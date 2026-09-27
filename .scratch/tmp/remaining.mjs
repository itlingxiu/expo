import fs from 'fs';
import path from 'path';

const root = 'E:/个人/个人项目/expo';
const batches = ['b06', 'b07', 'b08', 'b09', 'b10', 'b11'];
const slugs = [];
for (const b of batches) {
  const t = fs.readFileSync(`${root}/.scratch/batches/${b}-versions.txt`, 'utf8');
  for (const line of t.split(/\r?\n/)) {
    const s = line.trim();
    if (s) slugs.push(s);
  }
}
function cnCount(text) {
  const m = text.match(/[\u4e00-\u9fff]/g);
  return m ? m.length : 0;
}
const done = [];
const todo = [];
for (const slug of slugs) {
  const dest = path.join(root, 'src/content/pages', slug + '.md');
  if (fs.existsSync(dest)) {
    const text = fs.readFileSync(dest, 'utf8');
    const cn = cnCount(text);
    if (cn > 80) {
      done.push(slug);
      continue;
    }
  }
  todo.push(slug);
}
console.log('done', done.length, 'todo', todo.length);
for (const s of todo) console.log(s);
