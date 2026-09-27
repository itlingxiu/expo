const fs = require('fs');
const path = require('path');
const root = 'E:/个人/个人项目/expo/src/content/pages';
const slugs = fs
  .readFileSync('E:/个人/个人项目/expo/.scratch/tmp/router/slugs.txt', 'utf8')
  .trim()
  .split(/\r?\n/);
const bad = [
  'import ',
  'export default',
  '<Tabs>',
  '<Tab ',
  '<TerminalBlock',
  '<Collapsible',
  '<Step ',
  '<APIInstallSection',
  '<APISection',
  '<SnackInline',
  '<ContentSpotlight',
  '{/*',
];
for (const slug of slugs) {
  const p = path.join(root, slug + '.md');
  if (!fs.existsSync(p)) {
    console.log('MISSING ' + slug);
    continue;
  }
  const t = fs.readFileSync(p, 'utf8');
  const cn = (t.match(/[\u4e00-\u9fff]/g) || []).length;
  const fences = (t.match(/^```/gm) || []).length;
  const issues = [];
  if (!t.startsWith('---')) issues.push('no-fm');
  if (!/^title: .+/m.test(t)) issues.push('no-title');
  if (!/^description: .+/m.test(t)) issues.push('no-desc');
  const body = t.replace(/^---[\s\S]*?---\n/, '');
  if (!body.trimStart().startsWith('# ')) issues.push('no-h1');
  if (fences % 2) issues.push('fences=' + fences);
  if (t.length < 400) issues.push('short');
  if (cn < 80) issues.push('cn=' + cn);
  for (const b of bad) if (t.includes(b)) issues.push('bad:' + JSON.stringify(b));
  const m = t.match(/<[A-Z][A-Za-z0-9]+/g);
  if (m) issues.push('jsx:' + [...new Set(m)].join(','));
  console.log((issues.length ? 'ISSUE ' : 'OK ') + cn + ' ' + slug + (issues.length ? ' | ' + issues.join('; ') : ''));
}
