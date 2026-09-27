const fs = require("fs");
const path = require("path");
const dir = "E:/个人/个人项目/expo/.scratch/tmp/sdk-src";
const outDir = "E:/个人/个人项目/expo/.scratch/tmp/sdk-stripped";
fs.mkdirSync(outDir, { recursive: true });

function strip(src) {
  let s = src.replace(/\r\n/g, "\n");
  s = s.replace(/^import .*$/gm, "");
  s = s.replace(/^export .*$/gm, "");
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  const names =
    "APISection|DataAPISection|PropsSection|APIBox|ClassAPI|MethodAPI|TypeAPI|ConstantsAPI|EnumsAPI|HooksAPI|ComponentsAPI|EventSubscriptionsAPI|InterfacesAPI|ConfigSection";
  s = s.replace(new RegExp("<(?:" + names + ")[^>]*/>", "g"), "");
  s = s.replace(
    new RegExp("<(?:" + names + ")[\\s\\S]*?</(?:" + names + ")>", "g"),
    ""
  );
  return s;
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).sort();
let total = 0;
for (const f of files) {
  const raw = fs.readFileSync(path.join(dir, f), "utf8");
  const body = strip(raw);
  fs.writeFileSync(path.join(outDir, f), body);
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  const meta = fm ? fm[1] : "";
  const title = (meta.match(/^title:\s*(.+)$/m) || [])[1] || "";
  const pkg = (meta.match(/^packageName:\s*(.+)$/m) || [])[1] || "";
  total += body.length;
  console.log(
    String(body.length).padStart(6),
    String(raw.length).padStart(6),
    (pkg || "-").padEnd(42),
    title.slice(0, 50)
  );
}
console.log("TOTAL BODY", total, "files", files.length);
