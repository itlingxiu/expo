const fs = require("fs");
const path = require("path");
const dir = "E:/个人/个人项目/expo/.scratch/tmp/sdk-src";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).sort();
let words = 0;
let chars = 0;
for (const f of files) {
  let s = fs.readFileSync(path.join(dir, f), "utf8");
  s = s.replace(/```[\s\S]*?```/g, "");
  s = s.replace(/^---[\s\S]*?---/, "");
  s = s.replace(/<[^>]+>/g, " ");
  const w = s.split(/\s+/).filter(Boolean);
  words += w.length;
  chars += s.length;
  console.log(String(w.length).padStart(5), f.replace("versions__latest__sdk__", "").replace(".mdx", ""));
}
console.log("WORDS", words, "CHARS", chars);
