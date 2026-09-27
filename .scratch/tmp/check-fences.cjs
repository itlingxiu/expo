const fs = require('fs');
const path = require('path');
const root = 'E:/个人/个人项目/expo';
const files = process.argv.slice(2);
for (const f of files) {
  const s = fs.readFileSync(path.join(root, 'src/content/pages', f), 'utf8');
  const lines = s.split(/\n/);
  let open = false;
  let last = 0;
  let n = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('```')) {
      n++;
      open = !open;
      if (open) last = i + 1;
    }
  }
  console.log(f, open ? 'UNCLOSED from ' + last : 'closed', 'fences', n);
}
