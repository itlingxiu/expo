import fs from 'fs';
import path from 'path';

const root = path.resolve('src/content/pages');
const slugs = fs
  .readFileSync('.scratch/batches/b26-modules.txt', 'utf8')
  .split(/\r?\n/)
  .concat(fs.readFileSync('.scratch/batches/b27-modules.txt', 'utf8').split(/\r?\n/))
  .concat(fs.readFileSync('.scratch/batches/b30-push-notifications.txt', 'utf8').split(/\r?\n/))
  .concat(fs.readFileSync('.scratch/batches/b31-troubleshooting.txt', 'utf8').split(/\r?\n/))
  .map(s => s.trim())
  .filter(Boolean);

const banned = [
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

for (const s of slugs) {
  const p = path.join(root, s + '.md');
  if (!fs.existsSync(p)) {
    console.log('MISSING ' + s);
    continue;
  }
  const t = fs.readFileSync(p, 'utf8');
  const zh = (t.match(/[\u4e00-\u9fff]/g) || []).length;
  const issues = [];
  const fm = t.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm || !/^title: .+/m.test(fm[1]) || !/^description: .+/m.test(fm[1])) issues.push('fm');
  const body = t.slice(fm ? fm[0].length : 0);
  if (!body.trimStart().startsWith('# ')) issues.push('h1');
  const fences = (t.match(/```/g) || []).length;
  if (fences % 2) issues.push('fences=' + fences);
  let depth = 0;
  let inFence = false;
  for (const line of t.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const tr = line.trim();
    if (
      tr === ':::tabs' ||
      /^:::tab\s+/.test(tr) ||
      /^:::(note|tip|warning|danger)\b/.test(tr)
    )
      depth++;
    else if (tr === ':::') depth--;
  }
  if (depth !== 0) issues.push('colons=' + depth);
  for (const b of banned) if (t.includes(b)) issues.push('banned:' + JSON.stringify(b));
  if (t.length < 400) issues.push('short');
  if (zh <= 80) issues.push('zh=' + zh);
  console.log(
    (issues.length ? 'BAD ' : 'OK  ') +
      s +
      ' zh=' +
      zh +
      ' len=' +
      t.length +
      (issues.length ? ' ' + issues.join(',') : '')
  );
}
