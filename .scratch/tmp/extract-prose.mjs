import fs from 'fs';

const files = process.argv.slice(2);
for (const p of files) {
  const lines = fs.readFileSync(p, 'utf8').split(/\n/);
  let fence = 0;
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trimStart();
    if (t.startsWith('```')) {
      fence = fence ? 0 : 1;
      continue;
    }
    if (fence) continue;
    if (!lines[i].trim()) continue;
    out.push(String(i + 1).padStart(4) + '|' + lines[i]);
  }
  const dest = p.replace(/\.md$/, '.prose.txt').replace(/flat[\\/]/, 'flat-prose-');
  const name = p.split(/[\\/]/).pop().replace(/\.md$/, '.prose.txt');
  fs.writeFileSync('E:/个人/个人项目/expo/.scratch/tmp/' + name, out.join('\n'));
  console.log(name, out.length);
}
