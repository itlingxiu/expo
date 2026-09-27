const fs = require("fs");
const path = require("path");
const dir = "E:/个人/个人项目/expo/.scratch/tmp/sdk-src";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).sort();
const tags = new Map();
for (const f of files) {
  const raw = fs.readFileSync(path.join(dir, f), "utf8");
  const found = raw.match(/<[A-Z][A-Za-z0-9.]*/g) || [];
  const uniq = [...new Set(found)];
  if (uniq.length) console.log(f.replace("versions__latest__sdk__", "").replace(".mdx", ""), "=>", uniq.join(" "));
  for (const t of uniq) tags.set(t, (tags.get(t) || 0) + 1);
}
console.log("---TAGS---");
for (const [k, v] of [...tags.entries()].sort((a, b) => b[1] - a[1])) console.log(v, k);
