import fs from 'fs';
const p = process.argv[2];
const lines = fs.readFileSync(p, 'utf8').split(/\n/);
let fence = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('```')) {
    fence = !fence;
    continue;
  }
  if (!fence) console.log(String(i + 1).padStart(4) + ' ' + line);
}
