const fs = require('fs');
const path = require('path');
const root = 'E:/个人/个人项目/expo/src/content/pages';
function walk(dir, acc=[]) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (name.endsWith('.md')) acc.push(p);
  }
  return acc;
}
const files = walk(root);
for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\n/);
  let fence = false;
  const stack = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].replace(/\r$/, '');
    if (t.startsWith('```')) { fence = !fence; continue; }
    if (fence) continue;
    if (t.startsWith(':::tab')) {
      if (stack.includes('tab')) {
        console.log(path.relative(root, file) + ':' + (i+1) + ' nested tab');
      }
    }
    if (t.startsWith(':::tabs')) stack.push('tabs');
    else if (t.startsWith(':::tab')) stack.push('tab');
    else if (/^:::(note|warning|danger|tip)\b/.test(t)) stack.push('box');
    else if (t === ':::') stack.pop();
  }
}
console.log('done');
