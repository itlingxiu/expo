const fs = require('fs');
const path = require('path');

function prose(name) {
  const p = path.join('E:/个人/个人项目/expo/.scratch/tmp/sdk-en', name);
  const lines = fs.readFileSync(p, 'utf8').split(/\n/);
  let f = false;
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('```')) {
      f = !f;
      continue;
    }
    if (!f && lines[i].trim()) out.push(i + 1 + '|' + lines[i]);
  }
  return out;
}

for (const name of [
  'versions__latest__sdk__notifications.md',
  'versions__latest__sdk__sqlite.md',
]) {
  const out = prose(name);
  const dest = 'E:/个人/个人项目/expo/.scratch/tmp/' + name.replace('versions__latest__sdk__', '') + '.prose.txt';
  fs.writeFileSync(dest, out.join('\n'));
  console.log(name, out.length);
}
