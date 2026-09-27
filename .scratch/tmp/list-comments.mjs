import fs from 'fs';
const root = 'E:/个人/个人项目/expo';
const results = JSON.parse(fs.readFileSync(root + '/.scratch/tmp/fetch-manifest.json', 'utf8'));
const comments = new Map();
for (const r of results) {
  const t = fs.readFileSync(r.file, 'utf8');
  const fences = t.match(/```[\s\S]*?```/g) || [];
  for (const f of fences) {
    const lines = f.split('\n');
    for (const line of lines) {
      const m1 = line.match(/\/\/\s*(.+?)\s*$/);
      const m2 = line.match(/\/\*\s*([^*]+?)\s*\*\//);
      const m3 = line.match(/^\s*#\s+(.+)/);
      const text = (m1 && m1[1]) || (m2 && m2[1]) || (m3 && m3[1]);
      if (!text) continue;
      if (text.startsWith('@')) continue;
      comments.set(text, (comments.get(text) || 0) + 1);
    }
  }
}
const arr = [...comments.entries()].sort((a, b) => b[1] - a[1]);
console.log('unique', arr.length);
for (const [c, n] of arr) console.log(n + '\t' + c);
