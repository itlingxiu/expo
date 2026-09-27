const fs = require('fs');
const path = require('path');
const root = 'E:/个人/个人项目/expo';
const batches = [
  '.scratch/batches/b22-eas-update.txt',
  '.scratch/batches/b23-eas-update.txt',
  '.scratch/batches/b38-eas-insights.txt',
  '.scratch/batches/b28-workflow.txt',
];
const slugs = [];
for (const b of batches) {
  const t = fs.readFileSync(path.join(root, b), 'utf8');
  for (const line of t.split(/\r?\n/)) {
    const s = line.trim();
    if (s) slugs.push(s);
  }
}
const banned = [
  [/\bimport\s/, 'import'],
  [/export default/, 'export default'],
  [/<Tabs>/, 'Tabs'],
  [/<Tab /, 'Tab'],
  [/<TerminalBlock/, 'TerminalBlock'],
  [/<Collapsible/, 'Collapsible'],
  [/<Step /, 'Step'],
  [/<APIInstallSection/, 'APIInstallSection'],
  [/<APISection/, 'APISection'],
  [/<SnackInline/, 'SnackInline'],
  [/<ContentSpotlight/, 'ContentSpotlight'],
  [/\{\/\*/, 'mdx comment'],
];
const problems = [];
let ok = 0;
for (const slug of slugs) {
  const fp = path.join(root, 'src/content/pages', slug + '.md');
  if (!fs.existsSync(fp)) {
    problems.push(slug + ': MISSING');
    continue;
  }
  const text = fs.readFileSync(fp, 'utf8');
  const cn = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const issues = [];
  if (text.length < 400) issues.push('short ' + text.length);
  if (cn <= 80) issues.push('cn=' + cn);
  const fm = text.split('---')[1] || '';
  if (!/title:\s*\S/.test(fm)) issues.push('no title');
  if (!/description:\s*\S/.test(fm)) issues.push('no desc');
  if (!/[\u4e00-\u9fff]/.test((fm.match(/title:\s*(.*)/) || [])[1] || '')) issues.push('title not zh');
  if (!/[\u4e00-\u9fff]/.test((fm.match(/description:\s*(.*)/) || [])[1] || '')) issues.push('desc not zh');
  const body = text.replace(/^---[\s\S]*?---\r?\n/, '');
  if (!body.trimStart().startsWith('# ')) issues.push('no h1');
  const lines = text.split(/\n/);
  let fence = 0;
  for (const l of lines) {
    if (/^\s*```/.test(l)) fence++;
    if (/^\s+:::tab\b/.test(l)) issues.push('indented tab');
  }
  if (fence % 2) issues.push('odd fences ' + fence);
  let depth = 0;
  let inF = false;
  for (const l of lines) {
    if (/^\s*```/.test(l)) {
      inF = !inF;
      continue;
    }
    if (inF) continue;
    const t = l.trim();
    if (t === ':::') depth--;
    else if (/^:::/.test(t)) depth++;
    if (depth < 0) {
      issues.push('::: underflow');
      break;
    }
  }
  if (depth !== 0) issues.push('::: depth ' + depth);
  for (const [re, name] of banned) if (re.test(text)) issues.push('banned ' + name);
  if (/-->/.test(text)) issues.push('arrow comment');
  if (issues.length) problems.push(slug + ': ' + [...new Set(issues)].join(', '));
  else ok++;
}
console.log('slugs', slugs.length, 'ok', ok);
console.log(problems.join('\n') || 'NO PROBLEMS');
for (const slug of ['eas-update/rollbacks']) {
  const t = fs.readFileSync(path.join(root, 'src/content/pages', slug + '.md'), 'utf8');
  console.log(slug, 'chars', t.length);
}
