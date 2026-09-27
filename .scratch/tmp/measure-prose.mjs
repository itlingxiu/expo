import fs from 'fs';

const root = 'E:/个人/个人项目/expo';
const results = JSON.parse(fs.readFileSync(root + '/.scratch/tmp/fetch-manifest.json', 'utf8'));
let prose = 0;
let code = 0;
const files = [];
for (const r of results) {
  const t = fs.readFileSync(r.file, 'utf8');
  const re = /```[\s\S]*?```/g;
  let m;
  let last = 0;
  let c = 0;
  let p = 0;
  while ((m = re.exec(t))) {
    p += t.slice(last, m.index).length;
    c += m[0].length;
    last = m.index + m[0].length;
  }
  p += t.length - last;
  prose += p;
  code += c;
  files.push({
    slug: r.slug.split('/').slice(-3).join('/'),
    prose: p,
    code: c,
    total: t.length,
  });
}
files.sort((a, b) => b.prose - a.prose);
console.log('prose', prose, 'code', code, 'pages', files.length);
console.log('top prose:');
for (const f of files.slice(0, 30)) console.log(String(f.prose).padStart(6), String(f.code).padStart(6), f.slug);
