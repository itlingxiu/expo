const fs = require('fs');
const path = require('path');

function leftover(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\n/);
  let f = false;
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith('```')) {
      f = !f;
      continue;
    }
    if (f) continue;
    if (/[A-Za-z]{5,}/.test(l) && !/[\u4e00-\u9fff]/.test(l) && l.trim() && !l.startsWith('| ---') && !l.startsWith('---') && !l.startsWith('![') && !/^https?:/.test(l.trim()) && !l.trim().startsWith(':::') && !l.includes('packageName')) {
      if (/^(import |export |const |let |await |return |function |if |for |<|{|}|\)|;)/.test(l.trim())) continue;
      if (l.trim().length < 12) continue;
      hits.push(i + 1 + '|' + l);
    }
  }
  return hits;
}

for (const f of [
  'src/content/pages/versions/latest/sdk/notifications.md',
  'src/content/pages/versions/latest/sdk/sqlite.md',
  'src/content/pages/versions/latest/sdk/ui.md',
]) {
  const hits = leftover('E:/个人/个人项目/expo/' + f);
  console.log('\n==', f, hits.length);
  hits.slice(0, 40).forEach(h => console.log(h));
}
