const fs = require("fs");
const path = require("path");

const SRC = "E:/个人/个人项目/expo/.scratch/tmp/sdk-src";
const OUT = "E:/个人/个人项目/expo/.scratch/tmp/sdk-en";
const COMP = "E:/个人/个人项目/expo/.scratch/tmp/comps";
fs.mkdirSync(OUT, { recursive: true });

const androidPerms = JSON.parse(fs.readFileSync(path.join(COMP, "android.json"), "utf8")).data;
const iosPerms = JSON.parse(fs.readFileSync(path.join(COMP, "ios.json"), "utf8")).data;
const skills = JSON.parse(fs.readFileSync(path.join(COMP, "skills.json"), "utf8")).skills;
const sqliteDiff = fs.readFileSync(path.join(COMP, "sqlite.diff"), "utf8").replace(/\r\n/g, "\n");

const PLAT = {
  android: "Android",
  ios: "iOS",
  "ios*": "iOS*",
  web: "Web",
  "expo-go": "Expo Go",
  tvos: "tvOS",
  macos: "macOS",
  server: "Server",
};

const CARD_FILES = {
  JetpackComposeCards: { file: "jetpack.mdx", section: "jetpack-compose" },
  SwiftUICards: { file: "swift.mdx", section: "swift-ui" },
  DropInCards: { file: "dropin.mdx", section: "drop-in-replacements" },
  UniversalCards: { file: "universal.mdx", section: "universal" },
};

function unquote(v) {
  if (v == null) return "";
  v = String(v).trim();
  if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
    return v.slice(1, -1);
  }
  return v;
}

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  return { meta, body: src.slice(m[0].length) };
}

function parsePlatforms(raw) {
  if (!raw) return [];
  const inner = raw.replace(/^\[/, "").replace(/\]$/, "");
  return [...inner.matchAll(/'([^']+)'|"([^"]+)"/g)].map((x) => x[1] || x[2]);
}

function platformLabel(name) {
  return PLAT[name] || name;
}

function maskCode(s, tokens) {
  return s.replace(/```[\s\S]*?```/g, (block) => {
    const cleaned = block.replace(/^```([A-Za-z0-9_+-]*)[^\n]*/, (all, lang) => "```" + (lang || ""));
    const id = tokens.length;
    tokens.push(cleaned.endsWith("\n```") ? cleaned : cleaned.replace(/```$/, "\n```"));
    return `\n\n@@CODE${id}@@\n\n`;
  });
}

function unmask(s, tokens) {
  return s.replace(/@@(?:CODE|INLINE)(\d+)@@/g, (_, i) => tokens[Number(i)]);
}

function maskInline(s, tokens) {
  return s.replace(/`[^`\n]+`/g, (block) => {
    const id = tokens.length;
    tokens.push(block);
    return `@@INLINE${id}@@`;
  });
}

function unescapeJsString(str) {
  return str
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function canStartString(s, j) {
  let k = j - 1;
  while (k >= 0 && /\s/.test(s[k])) k--;
  if (k < 0) return true;
  return "={[(:,+|!?&".includes(s[k]);
}

function readTag(s, i) {
  let j = i + 1;
  let brace = 0;
  let quote = null;
  while (j < s.length) {
    const c = s[j];
    if (quote) {
      if (c === "\\") {
        j += 2;
        continue;
      }
      if (c === quote) quote = null;
      j++;
      continue;
    }
    if ((c === '"' || c === "'" || c === "`") && canStartString(s, j)) {
      quote = c;
      j++;
      continue;
    }
    if (c === "{") brace++;
    else if (c === "}") brace--;
    else if (c === ">" && brace === 0) {
      const raw = s.slice(i, j + 1);
      const self = /\/\s*>$/.test(raw);
      const name = raw.match(/^<([A-Za-z][A-Za-z0-9.]*)/)[1];
      return { name, raw, end: j + 1, self };
    }
    j++;
  }
  return null;
}

function findClose(s, name, from) {
  let i = from;
  while (i < s.length) {
    const lt = s.indexOf("<", i);
    if (lt < 0) return null;
    if (s.startsWith("</" + name, lt) && /^<\/[A-Za-z][A-Za-z0-9.]*\s*>/.test(s.slice(lt))) {
      const m = s.slice(lt).match(/^<\/[A-Za-z][A-Za-z0-9.]*\s*>/);
      return { start: lt, end: lt + m[0].length };
    }
    if (s.startsWith("<" + name, lt)) {
      const tag = readTag(s, lt);
      if (!tag) return null;
      if (!tag.self) {
        const inner = findClose(s, name, tag.end);
        if (!inner) return null;
        i = inner.end;
        continue;
      }
      i = tag.end;
      continue;
    }
    i = lt + 1;
  }
  return null;
}

function attrRaw(tag, key) {
  const re = new RegExp("\\b" + key + "\\s*=\\s*");
  const m = re.exec(tag);
  if (!m) return null;
  let i = m.index + m[0].length;
  if (tag[i] === "{" ) {
    let depth = 0;
    let q = null;
    let j = i;
    for (; j < tag.length; j++) {
      const c = tag[j];
      if (q) {
        if (c === "\\") {
          j++;
          continue;
        }
        if (c === q) q = null;
        continue;
      }
    if ((c === '"' || c === "'" || c === "`") && canStartString(tag, j)) {
      q = c;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return tag.slice(i, j + 1);
    }
    }
    return null;
  }
  if (tag[i] === '"' || tag[i] === "'") {
    const q = tag[i];
    let j = i + 1;
    while (j < tag.length && tag[j] !== q) {
      if (tag[j] === "\\") j++;
      j++;
    }
    return tag.slice(i, j + 1);
  }
  return null;
}

function attrString(tag, key) {
  const raw = attrRaw(tag, key);
  if (raw == null) return null;
  if (raw.startsWith("{") && raw.endsWith("}")) {
    const inner = raw.slice(1, -1).trim();
    if (
      (inner.startsWith("'") && inner.endsWith("'")) ||
      (inner.startsWith('"') && inner.endsWith('"'))
    ) {
      return unescapeJsString(inner.slice(1, -1));
    }
    return jsxToText(inner);
  }
  return unescapeJsString(unquote(raw));
}

function jsxToText(s) {
  let t = s.trim();
  if (t.startsWith("<>") && t.endsWith("</>")) t = t.slice(2, -3);
  t = t.replace(/<CODE>([\s\S]*?)<\/CODE>/g, "`$1`");
  t = t.replace(/<MONOSPACE>([\s\S]*?)<\/MONOSPACE>/g, "`$1`");
  t = t.replace(/<\/?[A-Za-z][^>]*>/g, "");
  t = t.replace(/\{'((?:\\'|[^'])*)'\}/g, (_, x) => unescapeJsString(x));
  t = t.replace(/\{"((?:\\"|[^"])*)"\}/g, (_, x) => unescapeJsString(x));
  return t.replace(/\s+/g, " ").trim();
}

function parseStringList(raw) {
  if (!raw) return [];
  return [...raw.matchAll(/'([^']+)'|"([^"]+)"/g)].map((x) => x[1] || x[2]);
}

function htmlToMd(html) {
  if (!html) return "";
  return html
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function escCell(s) {
  return String(s || "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ")
    .trim();
}

function installBlock(pkg) {
  const cmds = [
    ["npm", `npx expo install ${pkg}`],
    ["yarn", `yarn expo install ${pkg}`],
    ["pnpm", `pnpm expo install ${pkg}`],
    ["bun", `bun expo install ${pkg}`],
  ];
  let out = "\n:::tabs\n";
  for (const [name, cmd] of cmds) {
    out += `:::tab ${name}\n\`\`\`sh\n${cmd}\n\`\`\`\n:::\n`;
  }
  out += ":::\n";
  return out;
}

function grabStringsAfter(obj, key) {
  const re = new RegExp("\\b" + key + "\\s*:\\s*");
  const m = re.exec(obj);
  if (!m) return null;
  let i = m.index + m[0].length;
  const parts = [];
  while (i < obj.length) {
    while (i < obj.length && /[\s|+]/.test(obj[i])) i++;
    if (i >= obj.length) break;
    if (obj[i] !== "'" && obj[i] !== '"' && obj[i] !== "`") {
      const um = obj.slice(i).match(/^(true|false|undefined|null|-?\d+(?:\.\d+)?)/);
      if (um && parts.length === 0) return um[1];
      break;
    }
    const q = obj[i];
    i++;
    let s = "";
    while (i < obj.length && obj[i] !== q) {
      if (obj[i] === "\\") {
        s += obj[i + 1] || "";
        i += 2;
        continue;
      }
      s += obj[i++];
    }
    i++;
    parts.push(unescapeJsString(s));
    let k = i;
    while (k < obj.length && /\s/.test(obj[k])) k++;
    if (obj[k] === "+") {
      i = k;
      continue;
    }
    if (obj[k] === "|") {
      parts.push(" | ");
      i = k;
      continue;
    }
    break;
  }
  if (!parts.length) return null;
  return parts.join("");
}

function extractBalanced(tag, key) {
  const re = new RegExp("\\b" + key + "\\s*=\\s*\\{");
  const m = re.exec(tag);
  if (!m) return null;
  let i = m.index + m[0].length - 1;
  let depth = 0;
  let q = null;
  for (let j = i; j < tag.length; j++) {
    const c = tag[j];
    if (q) {
      if (c === "\\") {
        j++;
        continue;
      }
      if (c === q) q = null;
      continue;
    }
    if ((c === '"' || c === "'" || c === "`") && canStartString(tag, j)) {
      q = c;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return tag.slice(i + 1, j);
    }
  }
  return null;
}

function splitObjects(src) {
  const objs = [];
  let i = 0;
  while (i < src.length) {
    const start = src.indexOf("{", i);
    if (start < 0) break;
    let depth = 0;
    let q = null;
    let j = start;
    for (; j < src.length; j++) {
      const c = src[j];
      if (q) {
        if (c === "\\") {
          j++;
          continue;
        }
        if (c === q) q = null;
        continue;
      }
      if (c === '"' || c === "'" || c === "`") {
        q = c;
        continue;
      }
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) {
          objs.push(src.slice(start, j + 1));
          i = j + 1;
          break;
        }
      }
    }
    if (j >= src.length) break;
  }
  return objs;
}

function propertiesTable(tag) {
  const block = extractBalanced(tag, "properties") || "";
  const rows = splitObjects(block).map((obj) => {
    const name = grabStringsAfter(obj, "name") || "";
    const def = grabStringsAfter(obj, "default");
    let desc = grabStringsAfter(obj, "description") || "";
    const platform = grabStringsAfter(obj, "platform");
    const experimental = /experimental\s*:\s*true/.test(obj);
    const deprecated = /deprecated\s*:\s*true/.test(obj);
    const bits = [];
    if (deprecated) bits.push("Deprecated");
    if (experimental) bits.push("Experimental");
    if (platform) {
      const labels = platform.split("|").map((p) => platformLabel(p.trim().replace(/^['"]|['"]$/g, "")));
      bits.push("Only for: " + labels.join(", "));
    }
    if (bits.length) desc = bits.join(" · ") + (desc ? ". " + desc : "");
    return `| \`${escCell(name)}\` | ${def == null ? "-" : `\`${escCell(def)}\``} | ${escCell(desc)} |`;
  });
  return (
    "\n\n### Configurable properties\n\n| Name | Default | Description |\n| --- | --- | --- |\n" +
    rows.join("\n") +
    "\n"
  );
}

function imageFromObject(label, objSrc) {
  if (!objSrc) return "";
  const src = (objSrc.match(/\bsrc:\s*'([^']+)'/) || [])[1];
  const alt = (objSrc.match(/\balt:\s*'([^']+)'/) || [])[1] || label;
  if (!src) return "";
  return `![${alt}（${label}）](${src})\n\n`;
}

function platformImages(tag) {
  let out = "";
  const android = extractBalanced(tag, "android");
  const ios = extractBalanced(tag, "ios");
  out += imageFromObject("Android", android);
  out += imageFromObject("iOS", ios);
  const src = attrString(tag, "src");
  const alt = attrString(tag, "alt") || "";
  if (src && !android && !ios) out += `![${alt}](${src})\n\n`;
  return out;
}

function cardsMarkdown(which) {
  const spec = CARD_FILES[which];
  const raw = fs.readFileSync(path.join(COMP, spec.file), "utf8");
  const cards = splitObjects(raw.replace(/^[\s\S]*?<UIComponentGrid[^>]*>/, "").replace(/<\/UIComponentGrid>[\s\S]*$/, ""));
  // splitObjects on whole file may grab too much. Parse UIComponentCard blocks instead.
  const blocks = [...raw.matchAll(/<UIComponentCard[\s\S]*?\/>/g)].map((m) => m[0]);
  const items = blocks.map((b) => {
    const title = attrString(b, "title") || "";
    const slug = attrString(b, "slug") || "";
    const description = attrString(b, "description") || "";
    const href = `/versions/latest/sdk/ui/${spec.section}/${slug}`;
    const src = attrString(b, "src");
    const alt = title;
    let img = "";
    if (src) img = `![${alt}](${src})\n\n`;
    else img = platformImages(b);
    return `${img}- [${title}](${href})：${description}`;
  });
  return "\n\n" + items.join("\n\n") + "\n\n";
}

function permTable(kind, tag) {
  const names = parseStringList(attrRaw(tag, "permissions") || "");
  const rows = names.map((name) => {
    const data = kind === "android" ? androidPerms[name] : iosPerms[name];
    if (!data) return `| \`${name}\` |  |`;
    let desc = htmlToMd(data.description || "");
    if (data.warning) desc += " Warning: " + htmlToMd(data.warning);
    if (data.explanation) desc += " " + htmlToMd(data.explanation);
    return `| \`${escCell(data.name || name)}\` | ${escCell(desc)} |`;
  });
  const h1 = kind === "android" ? "Android permission" : "Info.plist key";
  return `\n\n| ${h1} | Description |\n| --- | --- |\n${rows.join("\n")}\n`;
}

function relatedSkills(tag) {
  const names = parseStringList(attrRaw(tag, "names") || "");
  return (
    "\n" +
    names
      .map((name) => {
        const skill = skills.find((s) => s.name === name);
        if (!skill) return `- ${name}`;
        const sentence = skill.description.split(". ")[0];
        const desc = sentence.endsWith(".") ? sentence : sentence + ".";
        return `- [${skill.name}](${skill.githubUrl})：${desc}`;
      })
      .join("\n") +
    "\n"
  );
}

function indentStep(label, inner) {
  const text = inner.replace(/^\n+/, "").replace(/\n+$/, "");
  const lines = text.split("\n");
  if (lines.length === 1 && !lines[0].includes("@@CODE")) {
    return `\n${label}. ${lines[0].trim()}\n`;
  }
  const body = lines
    .map((line, idx) => (idx === 0 ? `${label}. ${line}` : line.trim() === "" ? "" : "   " + line))
    .join("\n");
  return `\n${body}\n`;
}

function render(name, tag, inner, ctx) {
  switch (name) {
    case "APIInstallSection": {
      const pkg = attrString(tag, "packageName") || ctx.packageName;
      return installBlock(pkg);
    }
    case "APISection":
    case "DataAPISection":
    case "PropsSection":
    case "CornerDownRightIcon":
      return "";
    case "YesIcon":
      return "支持";
    case "FileTree": {
      const files = parseStringList(attrRaw(tag, "files") || "");
      return "\n```text\n" + files.join("\n") + "\n```\n";
    }
    case "NoIcon":
      return "不支持";
    case "br":
      return "\n";
    case "SnackInline":
    case "FAQ":
      return "\n" + inner.trim() + "\n";
    case "ConfigPluginExample":
      return "\n\n### Example app.json with config plugin\n\n" + inner.trim() + "\n";
    case "ConfigPluginProperties":
      return propertiesTable(tag) + (inner.trim() ? "\n" + inner.trim() + "\n" : "");
    case "ConfigReactNative": {
      const explicit = attrString(tag, "title");
      const abstract = /abstract(?:=\{true\}|\s|>)/.test(tag) && !/abstract=\{false\}/.test(tag);
      const title =
        explicit ||
        (abstract
          ? "Working in an existing React Native app?"
          : "Are you using this library in an existing React Native app?");
      return `\n\n<details><summary>${title}</summary>\n\n${inner.trim()}\n\n</details>\n`;
    }
    case "Collapsible": {
      const summary = attrString(tag, "summary") || "";
      return `\n\n<details><summary>${summary}</summary>\n\n${inner.trim()}\n\n</details>\n`;
    }
    case "Tabs":
      return `\n\n:::tabs\n${inner.trim()}\n:::\n`;
    case "Tab": {
      const label = attrString(tag, "label") || "tab";
      return `\n:::tab ${label}\n${inner.trim()}\n:::\n`;
    }
    case "Step":
      return indentStep(attrString(tag, "label") || "1", inner);
    case "ContentSpotlight": {
      const file = attrString(tag, "file");
      const videoId = attrString(tag, "videoId");
      const src = attrString(tag, "src");
      const alt = attrString(tag, "alt") || "";
      const caption = attrString(tag, "caption");
      let out = "\n";
      if (file) out += `<video src="/static/videos/${file}" controls></video>\n`;
      else if (videoId) out += `[视频](https://www.youtube.com/watch?v=${videoId})\n`;
      else if (src) out += `![${alt}](${src})\n`;
      if (caption) out += `\n${caption}\n`;
      return out;
    }
    case "BoxLink": {
      const title = attrString(tag, "title") || "";
      const href = attrString(tag, "href") || "";
      const description = attrString(tag, "description") || "";
      const resolved = ctx.resolve(href);
      return description
        ? `\n- [${title}](${resolved})：${description}\n`
        : `\n- [${title}](${resolved})\n`;
    }
    case "VideoBoxLink": {
      const title = attrString(tag, "title") || "";
      const description = attrString(tag, "description") || "";
      const videoId = attrString(tag, "videoId") || "";
      const time = attrString(tag, "time");
      const href = `https://www.youtube.com/watch?v=${videoId}${time ? `&t=${time}` : ""}`;
      return `\n- [${title}](${href})：${description}\n`;
    }
    case "PlatformTags": {
      const list = parseStringList(attrRaw(tag, "platforms") || "");
      const prefix = attrString(tag, "prefix");
      const labels = list.map(platformLabel).join("、");
      return prefix ? `${prefix} ${labels}` : `（${labels}）`;
    }
    case "PlatformTag": {
      const p = attrString(tag, "platform") || "";
      return platformLabel(p);
    }
    case "AndroidPermissions":
      return permTable("android", tag);
    case "IOSPermissions":
      return permTable("ios", tag);
    case "DiffBlock": {
      const source = attrString(tag, "source") || "";
      if (source.includes("sqlite-web-metro-config")) {
        return "\n```diff\n" + sqliteDiff.trim() + "\n```\n";
      }
      return `\n> 差异文件：${source}\n`;
    }
    case "RelatedSkills":
      return relatedSkills(tag);
    case "JetpackComposeCards":
    case "SwiftUICards":
    case "DropInCards":
    case "UniversalCards":
      return cardsMarkdown(name);
    case "PlatformTabsGroup":
      return "\n" + inner.trim() + "\n";
    case "PlatformSpotlight":
    case "ComponentExample": {
      let out = "\n" + platformImages(tag);
      if (name === "ComponentExample") {
        const title = attrString(tag, "title");
        let body = inner.trim();
        if (title) {
          body = body.replace(/@@CODE(\d+)@@/, (all, id) => {
            const tok = ctx.tokens[Number(id)];
            if (tok && /^```[A-Za-z0-9_+-]*\n/.test(tok) && !/^```[A-Za-z0-9_+-]* /.test(tok.split("\n")[0] + " ")) {
              ctx.tokens[Number(id)] = tok.replace(/^```([A-Za-z0-9_+-]*)\n/, "```$1 " + title + "\n");
            }
            return all;
          });
        }
        out += body + "\n";
      }
      return out;
    }
    case "PaddedAPIBox": {
      const header = attrString(tag, "header") || "";
      const level = Number(attrString(tag, "headerNestingLevel") || "3");
      const hashes = "#".repeat(Math.min(Math.max(level, 2), 6));
      return `\n\n${hashes} ${header}\n\n${inner.trim()}\n`;
    }
    case "APIBoxSectionHeader": {
      const text = attrString(tag, "text") || "";
      return `\n\n#### ${text}\n`;
    }
    case "CALLOUT":
      return "\n\n" + inner.trim() + "\n\n";
    case "A": {
      const href = attrString(tag, "href") || "";
      return `[${inner.trim()}](${ctx.resolve(href)})`;
    }
    case "CODE":
    case "MONOSPACE":
    case "code":
      return "`" + inner.trim() + "`";
    default:
      ctx.unknown.add(name);
      return inner ? "\n" + inner.trim() + "\n" : "";
  }
}

function transform(s, ctx) {
  let out = "";
  let i = 0;
  while (i < s.length) {
    const lt = s.indexOf("<", i);
    if (lt < 0) {
      out += s.slice(i);
      break;
    }
    const m = s.slice(lt).match(/^<([A-Za-z][A-Za-z0-9.]*)\b/);
    if (!m || m[1] === "http" || m[1] === "https" || (!/^[A-Z]/.test(m[1]) && !["br", "code", "a"].includes(m[1]))) {
      out += s.slice(i, lt + 1);
      i = lt + 1;
      continue;
    }
    const tag = readTag(s, lt);
    if (!tag) {
      out += s.slice(i);
      break;
    }
    out += s.slice(i, lt);
    if (tag.self) {
      out += render(tag.name, tag.raw, "", ctx);
      i = tag.end;
    } else {
      const close = findClose(s, tag.name, tag.end);
      if (!close) {
        ctx.unknown.add(tag.name + ":unclosed");
        out += tag.raw;
        i = tag.end;
        continue;
      }
      const inner = transform(s.slice(tag.end, close.start), ctx);
      out += render(tag.name, tag.raw, inner, ctx);
      i = close.end;
    }
  }
  return out;
}

function classifyQuote(text) {
  let t = text.trim();
  let kind = null;
  t = t.replace(/^\*\*info\*\*:?\s*/i, () => {
    kind = kind || "note";
    return "";
  });
  const m = t.match(/^\*\*(Note|Warning|Deprecated|Tip|important)\*\*:?\s*/i);
  if (m) {
    const k = m[1].toLowerCase();
    kind = k === "warning" || k === "important" ? "warning" : k === "deprecated" ? "danger" : k === "tip" ? "tip" : "note";
    t = t.slice(m[0].length);
  }
  if (!kind) return text.startsWith(">") ? text : "> " + text.split("\n").join("\n> ");
  return `:::${kind}\n${t.trim()}\n:::`;
}

function convertQuotes(s) {
  const lines = s.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    if (/^>/.test(lines[i])) {
      const buf = [];
      while (i < lines.length && (/^>/.test(lines[i]) || lines[i].trim() === "")) {
        if (lines[i].trim() === "") {
          if (i + 1 >= lines.length || !/^>/.test(lines[i + 1])) break;
          buf.push("");
          i++;
          continue;
        }
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(classifyQuote(buf.join("\n").trim()));
      continue;
    }
    out.push(lines[i]);
    i++;
  }
  return out.join("\n");
}

function resolveLink(href, slug, isIndex) {
  if (!href) return href;
  href = href.trim();
  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("/static/")) return href;
  const hashSplit = href.split("#");
  let pathPart = hashSplit[0];
  const hash = hashSplit.length > 1 ? "#" + hashSplit.slice(1).join("#") : "";
  if (/^https?:\/\/docs\.expo\.dev/.test(pathPart)) {
    pathPart = pathPart.replace(/^https?:\/\/docs\.expo\.dev/, "") || "/";
  } else if (/^https?:\/\//.test(pathPart)) {
    return href;
  }
  pathPart = pathPart.replace(/\.mdx?$/, "");
  if (pathPart.startsWith("/")) {
    pathPart = pathPart.replace(/\/+$/, "") || "/";
    if (pathPart !== "/" && hash) return pathPart + hash;
    return (pathPart || "/") + hash;
  }
  if (!pathPart) return hash || href;
  const base = slug.split("/");
  if (!isIndex) base.pop();
  for (const part of pathPart.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") base.pop();
    else base.push(part.replace(/\/+$/, ""));
  }
  return "/" + base.join("/") + hash;
}

function rewriteLinks(s, slug, isIndex) {
  s = s.replace(/https?:\/\/docs\.expo\.dev(\/[^\s)<]*)/g, (all, p) => resolveLink(p, slug, isIndex));
  s = s.replace(/(!?)\[([^\]]*)\]\((<[^>\n]+>|[^)\s]+)\)/g, (all, bang, text, href) => {
    if (bang) return all;
    let h = href;
    if (h.startsWith("<") && h.endsWith(">")) h = h.slice(1, -1);
    return `[${text}](${resolveLink(h, slug, isIndex)})`;
  });
  return s;
}

function cleanupExpressions(s) {
  s = s.replace(/\{'((?:\\'|[^'])*)'\}/g, (_, x) => unescapeJsString(x));
  s = s.replace(/\{"((?:\\"|[^"])*)"\}/g, (_, x) => unescapeJsString(x));
  s = s.replace(/&ensp;|&nbsp;/g, " ");
  s = s.replace(/&#x20;/g, " ");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s;
}

function fileToSlug(filename) {
  return filename.replace(/\.mdx$/, "").replace(/__/g, "/");
}

function convertFile(filename) {
  const raw = fs.readFileSync(path.join(SRC, filename), "utf8").replace(/\r\n/g, "\n");
  const slug = fileToSlug(filename);
  const { meta, body } = parseFrontmatter(raw);
  const title = unquote(meta.title || "");
  const description = unquote(meta.description || "");
  const packageName = unquote(meta.packageName || "");
  const platforms = parsePlatforms(meta.platforms || "");
  const isIndex = slug === "versions/latest/sdk/ui";
  let s = body;
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  const tokens = [];
  s = maskCode(s, tokens);
  s = s.replace(/^import[\s\S]*?from\s+['"][^'"]+['"];?[ \t]*$/gm, "");
  s = s.replace(/^export\s+.*$/gm, "");
  s = s.replace(/(\w+)=\{<>([\s\S]*?)<\/>\}/g, (_, key, inner) => {
    const text = inner
      .replace(/<CODE>([\s\S]*?)<\/CODE>/g, "`$1`")
      .replace(/<[^>]+>/g, "")
      .replace(/"/g, "'")
      .replace(/\s+/g, " ")
      .trim();
    return `${key}="${text}"`;
  });
  s = maskInline(s, tokens);
  const ctx = {
    packageName,
    tokens,
    unknown: new Set(),
    resolve: (href) => resolveLink(href, slug, isIndex),
  };
  s = transform(s, ctx);
  s = cleanupExpressions(s);
  s = convertQuotes(s);
  s = rewriteLinks(s, slug, isIndex);
  s = unmask(s, tokens);
  s = s.replace(/\n{3,}/g, "\n\n").trim() + "\n";
  const platLine = platforms.length
    ? `> 支持平台：${platforms.map(platformLabel).join("、")}。\n\n`
    : "";
  const doc = `---
title: ${title}
description: ${description}
packageName: ${packageName}
---

# ${title}

${platLine}${s.startsWith("#") ? s : s}
`;
  fs.writeFileSync(path.join(OUT, slug.replace(/\//g, "__") + ".md"), doc);
  const leftover = [...s.matchAll(/<([A-Z][A-Za-z0-9.]*)\b/g)].map((m) => m[1]);
  return { slug, title, packageName, unknown: [...ctx.unknown], leftover: [...new Set(leftover)], chars: doc.length };
}

const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".mdx")).sort();
for (const f of files) {
  const r = convertFile(f);
  const flags = [];
  if (r.unknown.length) flags.push("unknown=" + r.unknown.join(","));
  if (r.leftover.length) flags.push("left=" + r.leftover.join(","));
  console.log(String(r.chars).padStart(6), r.slug.split("/").slice(-2).join("/"), flags.join(" "));
}
