const fs = require('fs');
const path = require('path');
const root = 'E:/个人/个人项目/expo';
const batches = [
  'b32-agents.txt','b33-app-signing.txt','b34-bare.txt','b35-billing.txt','b36-more.txt',
  'b39-brownfield.txt','b40-debugging.txt','b42-custom-builds.txt','b43-regulatory-compliance.txt',
  'b44-technical-specs.txt','b45-accounts.txt','b46-additional-resources.txt','b47-core-concepts.txt',
  'b48-faq.txt','b49-linking.txt','b50-llms.txt','b51-mcp.txt','b52-monitoring.txt','b53-skills.txt'
];
const slugs = [];
for (const b of batches) {
  const t = fs.readFileSync(path.join(root, '.scratch/batches', b), 'utf8');
  for (const line of t.split(/\r?\n/)) {
    const s = line.trim();
    if (s) slugs.push(s);
  }
}
const forbidden = [
  /^\s*import\s/m,
  /export default/,
  /<Tabs>/,
  /<Tab[\s>]/,
  /<Terminal/,
  /<Collapsible/,
  /<Step[\s>]/,
  /<ContentSpotlight/,
  /\{\/\*/,
  /<BoxLink/,
  /<DiffBlock/,
  /<FileTree/,
  /<YesIcon/,
  /<NoIcon/,
  /<EASFunction/,
  /<VideoBoxLink/,
  /<Prerequisites/
];
function stripFences(s) {
  const lines = s.split(/\n/);
  let open = false;
  const out = [];
  for (const line of lines) {
    if (line.startsWith('```')) {
      open = !open;
      continue;
    }
    if (!open) out.push(line);
  }
  return out.join('\n');
}
const problems = [];
for (const slug of slugs) {
  const file = path.join(root, 'src/content/pages', slug + '.md');
  if (!fs.existsSync(file)) { problems.push(slug + ' MISSING'); continue; }
  const raw = fs.readFileSync(file, 'utf8');
  const s = stripFences(raw);
  const han = (raw.match(/[\u4e00-\u9fff]/g) || []).length;
  if (han <= 80) problems.push(slug + ' HAN=' + han);
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm || !/^title:\s*\S/m.test(fm[1]) || !/^description:\s*\S/m.test(fm[1])) problems.push(slug + ' bad fm');
  const body = raw.replace(/^---[\s\S]*?---\r?\n/, '').replace(/^\s+/, '');
  if (!body.startsWith('# ')) problems.push(slug + ' no h1');
  const lines = raw.split(/\n/);
  let fence = false;
  for (const line of lines) if (line.startsWith('```')) fence = !fence;
  if (fence) problems.push(slug + ' unclosed fence');
  let depth = 0;
  for (const line of lines) {
    if (fence) continue;
  }
  const textLines = [];
  fence = false;
  const stack = [];
  for (const line of lines) {
    if (line.startsWith('```')) { fence = !fence; continue; }
    if (fence) continue;
    const t = line.replace(/\r$/, '');
    if (t.startsWith(':::tabs')) stack.push('tabs');
    else if (t.startsWith(':::tab ') || t === ':::tab') stack.push('tab');
    else if (/^:::(note|warning|danger|tip)\b/.test(t)) stack.push('box');
    else if (t === ':::') {
      if (!stack.length) problems.push(slug + ' extra :::');
      else stack.pop();
    }
  }
  if (stack.length) problems.push(slug + ' unclosed ::: ' + stack.join(','));
  for (const re of forbidden) if (re.test(s)) problems.push(slug + ' ' + re);
}
console.log('slugs', slugs.length);
console.log(problems.length ? problems.join('\n') : 'NONE');
