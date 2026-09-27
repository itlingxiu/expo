const fs = require("fs");
const path = require("path");
const root = path.join("E:", "个人", "个人项目", "expo", "src", "content", "pages");
const list = fs
  .readFileSync(path.join("E:", "个人", "个人项目", "expo", ".scratch", "batches", "b01-versions.txt"), "utf8")
  .concat(fs.readFileSync(path.join("E:", "个人", "个人项目", "expo", ".scratch", "batches", "b02-versions.txt"), "utf8"));
const slugs = list.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
const bad = ["<APIInstallSection", "<APISection", "<SnackInline", "<ContentSpotlight", "<TerminalBlock", "<Collapsible", "<Step ", "<Tabs>", "<Tab "];
let ok = 0;
for (const s of slugs) {
  const p = path.join(root, s + ".md");
  if (!fs.existsSync(p)) {
    console.log("MISSING", s);
    continue;
  }
  const c = fs.readFileSync(p, "utf8");
  const zh = (c.match(/[\u4e00-\u9fff]/g) || []).length;
  const fences = (c.match(/```/g) || []).length;
  const issues = [];
  if (zh < 80) issues.push("zh=" + zh);
  if (c.length < 400) issues.push("short");
  if (fences % 2) issues.push("fences=" + fences);
  if (!/^title: .+/m.test(c)) issues.push("notitle");
  if (!/^description: .+/m.test(c)) issues.push("nodesc");
  if (!/^# /m.test(c)) issues.push("noh1");
  let inFence = false;
  for (const line of c.split(/\n/)) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (line.startsWith("import ") || line.startsWith("export ")) issues.push("mdx");
    for (const b of bad) if (line.includes(b)) issues.push("tag:" + b);
    if (line.includes("{/*") || line.includes("-->")) issues.push("comment");
  }
  const opens = (c.match(/^:::(tabs|tab|note|tip|warning|danger)/gm) || []).length;
  const closes = (c.match(/^:::$/gm) || []).length;
  if (opens !== closes) issues.push("colons open=" + opens + " close=" + closes);
  if (issues.length) console.log("ISSUE", s, issues.join(" | "));
  else {
    ok++;
    console.log("OK", zh, s);
  }
}
console.log("TOTAL_OK", ok, "of", slugs.length);
