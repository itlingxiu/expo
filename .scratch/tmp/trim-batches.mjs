import fs from 'fs';
import path from 'path';

const root = 'E:/个人/个人项目/expo';
const batches = ['b06', 'b07', 'b08', 'b09', 'b10', 'b11'];

function cnCount(text) {
  const m = text.match(/[\u4e00-\u9fff]/g);
  return m ? m.length : 0;
}

let removed = 0;
let kept = 0;
for (const b of batches) {
  const file = `${root}/.scratch/batches/${b}-versions.txt`;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(l => l.trim());
  const remain = [];
  for (const slug of lines) {
    const dest = path.join(root, 'src/content/pages', slug + '.md');
    if (fs.existsSync(dest) && cnCount(fs.readFileSync(dest, 'utf8')) >= 40) {
      removed++;
      continue;
    }
    remain.push(slug);
    kept++;
  }
  fs.writeFileSync(file, remain.length ? remain.join('\n') + '\n' : '');
}
console.log('removed', removed, 'kept', kept);
