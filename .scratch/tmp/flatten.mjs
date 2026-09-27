import fs from 'fs';
import path from 'path';

const root = 'E:/个人/个人项目/expo';
const results = JSON.parse(fs.readFileSync(path.join(root, '.scratch/tmp/fetch-manifest.json'), 'utf8'));
const outDir = path.join(root, '.scratch/tmp/flat');
fs.mkdirSync(outDir, { recursive: true });

const PLATFORM_LABEL = {
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
  'expo-go': 'Expo Go',
  tvos: 'tvOS',
  macos: 'macOS',
};

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return { data: {}, body: text };
  const data = {};
  const raw = m[1];
  const lines = raw.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let val = kv[2].trim();
    if (val === '>' || val === '|') {
      const acc = [];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) {
        i++;
        acc.push(lines[i].trim());
      }
      data[key] = acc.join(' ');
      continue;
    }
    if (val.startsWith('[') && !val.endsWith(']')) {
      while (i + 1 < lines.length && !val.includes(']')) {
        i++;
        val += ' ' + lines[i].trim();
      }
    }
    data[key] = val;
  }
  return { data, body: text.slice(m[0].length) };
}

function unquote(v) {
  if (!v) return '';
  v = v.trim();
  if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
    return v.slice(1, -1);
  }
  return v;
}

function parsePlatforms(v) {
  if (!v) return [];
  const inner = v.replace(/^\[/, '').replace(/\]$/, '');
  return inner
    .split(',')
    .map(s => unquote(s.trim()))
    .filter(Boolean);
}

let currentFences = [];

function protect(src) {
  const fences = [];
  currentFences = fences;
  const inline = [];
  let text = src.replace(/```[\s\S]*?```/g, block => {
    const id = fences.length;
    fences.push(block);
    return `\u0000FENCE${id}\u0000`;
  });
  text = text.replace(/`[^`\n]+`/g, block => {
    const id = inline.length;
    inline.push(block);
    return `\u0000INLINE${id}\u0000`;
  });
  return { text, fences, inline };
}

const COMMENT_ZH = new Map([
  ['Leading icon', '前置图标'],
  ['Trailing icon', '后置图标'],
  ['Both leading and trailing icons', '同时包含前置和后置图标'],
  ['Pull in the Kotlin Compose compiler plugin classpath.', '引入 Kotlin Compose 编译器插件的 classpath。'],
  ['Apply the Compose compiler plugin.', '应用 Compose 编译器插件。'],
  ['... group / version', '... group / version'],
  ['... namespace, defaultConfig', '... namespace、defaultConfig'],
  ['Turn on Jetpack Compose for this module.', '为本模块开启 Jetpack Compose。'],
  ['Depend on `expo-ui` plus the Compose libraries you use.', '依赖 `expo-ui` 以及你使用的 Compose 库。'],
  ['Complex combination with border and shadow', '边框与阴影的组合'],
  ['In a Row, the first button takes 2/3 and the second takes 1/3', '在 Row 中，第一个按钮占 2/3，第二个占 1/3'],
  ['Circular clipping', '圆形裁剪'],
  ['Rounded corners with uniform radius', '统一半径的圆角'],
  ['Rounded corners with individual radii', '各角半径不同的圆角'],
  ['Cut corners', '切角'],
  ['The user tapped Undo, restore the item.', '用户点了撤销，恢复该项。'],
  ['Bold parent, italic child inherits bold', '父级为粗体，斜体子级继承粗体'],
  ['Mixed inline styles', '混合的行内样式'],
  ['Color and background overrides per span', '按片段覆盖颜色和背景'],
  ['Deep nesting — styles accumulate', '深层嵌套——样式会累加'],
  ['A color picker fills the width it is given, so `matchContents` collapses it.', '颜色选择器会占满给定宽度，因此 `matchContents` 会把它压扁。'],
  ['A date picker fills the width it is given, so `matchContents` collapses it.', '日期选择器会占满给定宽度，因此 `matchContents` 会把它压扁。'],
  ['A disclosure group fills the width it is given, so `matchContents` collapses it.', 'DisclosureGroup 会占满给定宽度，因此 `matchContents` 会把它压扁。'],
  ['A divider spans the width it is given, so `matchContents` collapses it.', '分隔线会占满给定宽度，因此 `matchContents` 会把它压扁。'],
  ['Simulate network request', '模拟网络请求'],
  ['Add ExpoUI dependency', '添加 ExpoUI 依赖'],
  ['A linear gauge stretches to the width it is given, so give the host a size.', '线性仪表会拉伸到给定宽度，因此请给宿主指定尺寸。'],
  ['Simulate async data fetching', '模拟异步数据获取'],
  ['Complex combination with shadow and interaction', '阴影与交互的组合'],
  ['Conditional modifiers using spread operator', '用展开运算符合并条件修改器'],
  ['Segmented and wheel pickers stretch to the width they are given, so they', '分段和滚轮选择器会拉伸到给定宽度，因此它们'],
  ['collapse under `matchContents`.', '在 `matchContents` 下会被压扁。'],
  ['10 seconds from now', '从现在起 10 秒'],
  ['A secure field stretches to the width it is given, so give the host a size.', '安全输入框会拉伸到给定宽度，因此请给宿主指定尺寸。'],
  ['A text field stretches to the width it is given, so give the host a size.', '文本框会拉伸到给定宽度，因此请给宿主指定尺寸。'],
  ['Give the host a size when the stack needs room to align its children.', '当堆叠需要空间来对齐子元素时，请给宿主指定尺寸。'],
  ['A toggle row stretches to the width it is given, so give the host a size.', '开关行会拉伸到给定宽度，因此请给宿主指定尺寸。'],
  ['... Other imports, definition of the component, creating the player etc.', '... 其他导入、组件定义、创建播放器等。'],
  ['...Other imports, definition of the component, creating the player etc.', '... 其他导入、组件定义、创建播放器等。'],
  ['...Imports, definition of the component, creating the player etc.', '... 导入、组件定义、创建播放器等。'],
  ['You can use the `asset` directly as a video source', '可以直接把 `asset` 当作视频源使用'],
  ['...Definition of the component, creating the player etc.', '... 组件定义、创建播放器等。'],
  ['Alternatively you can use the asset uri directly', '也可以直接使用资源 URI'],
  ['You can now use loadAssetAndReplace to load and play the first video from the media library', '现在可以用 loadAssetAndReplace 加载并播放媒体库中的第一个视频'],
  ['You can also add an alert() to see the error message in case of an error when fetching updates.', '获取更新出错时，也可以加一个 alert() 来查看错误信息。'],
  ['Declared at module scope — not included in the widget bundle.', '声明在模块作用域——不会打进小组件包。'],
  ["Throws at runtime: Can't find variable: CITY_NAMES", '运行时会抛错：Can\'t find variable: CITY_NAMES'],
  ['Update the widget', '更新小组件'],
  ['1 hour from now', '从现在起 1 小时'],
  ['2 hours from now', '从现在起 2 小时'],
  ['3 hours from now', '从现在起 3 小时'],
  ['[{ date: Date, props: { count: number } }, ...]', '[{ date: Date, props: { count: number } }, ...]'],
  ['Render different layouts based on size', '按尺寸渲染不同布局'],
  ['systemLarge and others', 'systemLarge 及其他尺寸'],
  ['The widget already updated itself via onPress; mirror the change in app state here.', '小组件已通过 onPress 自行更新；在这里把变化同步到应用状态。'],
  ['`widgetsDirectory` is a file:// URL to a directory shared with your widgets.', '`widgetsDirectory` 是指向与小组件共享目录的 file:// URL。'],
  ['Start the Live Activity', '启动 Live Activity'],
  ['Store instance', '存储实例'],
  ['Rest of the component...', '组件的其余部分...'],
  ['Later, when you no longer need updates:', '之后，当不再需要更新时：'],
  ['Renders React children', '渲染 React 子元素'],
  ['Basic styling modifiers', '基本样式修改器'],
  ['... other config', '... 其他配置'],
  ['Snaps to end for demo. Real masks need smarter cursor handling.', '演示时直接跳到末尾。真正的遮罩需要更聪明的光标处理。'],
  ['Download icons by name (defaults: outlined, weight 400, 24px)', '按名称下载图标（默认：outlined、字重 400、24px）'],
  ['Rounded style', '圆角样式'],
  ['Sharp + filled', '尖锐 + 填充'],
  ['Paste a URL from fonts.google.com/icons to preserve the axes you picked there', '粘贴 fonts.google.com/icons 的 URL，以保留你在那里选择的轴'],
]);

function translateCodeComments(block) {
  return block
    .replace(/(^|[^:])\/\/\s?([^\n]*)$/gm, (full, pre, comment) => {
      const key = comment.trim();
      if (!key || key.startsWith('@') || COMMENT_ZH.get(key) == null) return full;
      const zh = COMMENT_ZH.get(key);
      if (zh === key) return full;
      return `${pre}// ${zh}`;
    })
    .replace(/\{\/\*\s*([\s\S]*?)\s*\*\/\}/g, (full, comment) => {
      const key = comment.trim();
      const zh = COMMENT_ZH.get(key);
      if (!zh) return full;
      return `{/* ${zh} */}`;
    })
    .replace(/\/\*\s*([^*]+?)\s*\*\//g, (full, comment) => {
      const key = comment.trim();
      if (key.startsWith('@')) return '';
      const zh = COMMENT_ZH.get(key);
      if (!zh) return full;
      return `/* ${zh} */`;
    })
    .replace(/^(\s*)#\s+(.+)$/gm, (full, indent, comment) => {
      const key = comment.trim();
      const zh = COMMENT_ZH.get(key);
      if (!zh || zh === key) return full;
      return `${indent}# ${zh}`;
    });
}

function restore(text, fences, inline) {
  let out = text.replace(/^([ \t]*)\u0000FENCE(\d+)\u0000/gm, (_, indent, i) => {
    let block = translateCodeComments(fences[Number(i)]);
    if (!indent) return block;
    return block
      .split('\n')
      .map(line => (line.length ? indent + line : line))
      .join('\n');
  });
  out = out.replace(/\u0000FENCE(\d+)\u0000/g, (_, i) => translateCodeComments(fences[Number(i)]));
  out = out.replace(/\u0000INLINE(\d+)\u0000/g, (_, i) => inline[Number(i)]);
  return out;
}

function readAttrs(src, i) {
  let attrs = '';
  let quote = null;
  let brace = 0;
  while (i < src.length) {
    const c = src[i];
    if (quote) {
      attrs += c;
      if (c === '\\') {
        attrs += src[i + 1] || '';
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      attrs += c;
      i++;
      continue;
    }
    if (c === '{') {
      brace++;
      attrs += c;
      i++;
      continue;
    }
    if (c === '}') {
      brace = Math.max(0, brace - 1);
      attrs += c;
      i++;
      continue;
    }
    if (brace === 0 && c === '/' && src[i + 1] === '>') {
      return { attrs: attrs.trim(), i: i + 2, selfClosing: true };
    }
    if (brace === 0 && c === '>') {
      return { attrs: attrs.trim(), i: i + 1, selfClosing: false };
    }
    attrs += c;
    i++;
  }
  return { attrs: attrs.trim(), i, selfClosing: false };
}

function readElement(src, i) {
  const nameMatch = src.slice(i).match(/^<([A-Za-z][A-Za-z0-9.]*)\b/);
  if (!nameMatch) return null;
  const name = nameMatch[1];
  const attrStart = i + nameMatch[0].length;
  const { attrs, i: afterOpen, selfClosing } = readAttrs(src, attrStart);
  if (selfClosing || attrs.endsWith('/')) {
    return { name, attrs: attrs.replace(/\/$/, '').trim(), children: '', end: afterOpen, selfClosing: true };
  }
  const close = `</${name}>`;
  let depth = 1;
  let k = afterOpen;
  while (k < src.length && depth > 0) {
    const rest = src.slice(k);
    const openRe = new RegExp(`<${name}\\b`, 'g');
    const closeIdx = rest.indexOf(close);
    if (closeIdx === -1) return null;
    openRe.lastIndex = 0;
    let openIdx = -1;
    let m;
    while ((m = openRe.exec(rest))) {
      if (m.index < closeIdx) openIdx = m.index;
      else break;
    }
    if (openIdx !== -1 && openIdx < closeIdx) {
      depth++;
      k += openIdx + name.length + 1;
      continue;
    }
    depth--;
    if (depth === 0) {
      return {
        name,
        attrs,
        children: src.slice(afterOpen, k + closeIdx),
        end: k + closeIdx + close.length,
        selfClosing: false,
      };
    }
    k += closeIdx + close.length;
  }
  return null;
}

function attrString(attrs, name) {
  const re = new RegExp(`(?:^|\\s)${name}\\s*=\\s*"([^"]*)"`);
  const m = attrs.match(re);
  if (m) return m[1];
  const re2 = new RegExp(`(?:^|\\s)${name}\\s*=\\s*'([^']*)'`);
  const m2 = attrs.match(re2);
  return m2 ? m2[1] : null;
}

function attrExpr(attrs, name) {
  const key = name + '=';
  const idx = attrs.indexOf(key);
  if (idx === -1) return null;
  let i = idx + key.length;
  while (attrs[i] === ' ') i++;
  if (attrs[i] !== '{') return null;
  let brace = 0;
  let quote = null;
  let start = i;
  for (; i < attrs.length; i++) {
    const c = attrs[i];
    if (quote) {
      if (c === '\\') {
        i++;
        continue;
      }
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      continue;
    }
    if (c === '{') brace++;
    else if (c === '}') {
      brace--;
      if (brace === 0) return attrs.slice(start + 1, i);
    }
  }
  return null;
}

function evalExpr(expr) {
  if (expr == null) return undefined;
  try {
    return Function(`"use strict"; return (${expr});`)();
  } catch {
    return undefined;
  }
}

function jsxToText(s) {
  if (!s) return '';
  return s
    .replace(/<CODE>([\s\S]*?)<\/CODE>/g, '`$1`')
    .replace(/<>/g, '')
    .replace(/<\/>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function installTabs(pkg) {
  const cmds = {
    npm: `npx expo install ${pkg}`,
    yarn: `yarn expo install ${pkg}`,
    pnpm: `pnpm expo install ${pkg}`,
    bun: `bun expo install ${pkg}`,
  };
  return (
    ':::tabs\n' +
    Object.entries(cmds)
      .map(([k, v]) => `:::tab ${k}\n\`\`\`sh\n${v}\n\`\`\`\n:::`)
      .join('\n') +
    '\n:::'
  );
}

function terminalToMd(attrs) {
  const expr = attrExpr(attrs, 'cmd');
  const val = evalExpr(expr);
  if (!val) {
    const copy = attrString(attrs, 'cmdCopy');
    if (copy) return '```sh\n' + copy + '\n```';
    return '';
  }
  const clean = arr =>
    (Array.isArray(arr) ? arr : [String(arr)])
      .map(line => String(line).replace(/^\$\s?/, ''))
      .join('\n');
  if (Array.isArray(val)) {
    return '```sh\n' + clean(val) + '\n```';
  }
  if (val && typeof val === 'object') {
    const order = ['npm', 'yarn', 'pnpm', 'bun'].filter(k => val[k]);
    if (!order.length) return '```sh\n' + clean(Object.values(val)[0]) + '\n```';
    return (
      ':::tabs\n' +
      order
        .map(k => `:::tab ${k}\n\`\`\`sh\n${clean(val[k])}\n\`\`\`\n:::`)
        .join('\n') +
      '\n:::'
    );
  }
  return '```sh\n' + String(val).replace(/^\$\s?/, '') + '\n```';
}

function imageFrom(src, alt) {
  if (!src) return '';
  const a = (alt || '').replace(/\]/g, '');
  return `![${a}](${src})`;
}

function platformImages(obj) {
  if (!obj || typeof obj !== 'object') return '';
  const parts = [];
  for (const key of ['android', 'ios', 'web']) {
    const item = obj[key];
    if (!item) continue;
    const label = key === 'android' ? 'Android' : key === 'ios' ? 'iOS' : 'Web';
    const img = imageFrom(item.src || item.file, item.alt);
    if (img) parts.push(`**${label}**\n\n${img}`);
  }
  return parts.join('\n\n');
}

function spotlight(attrs) {
  const src = attrString(attrs, 'src');
  const alt = attrString(attrs, 'alt');
  const file = attrString(attrs, 'file');
  if (src) return imageFrom(src, alt);
  if (file) {
    const p = file.startsWith('/') ? file : `/static/images/${file.replace(/^\/+/, '')}`;
    return imageFrom(p, alt || file);
  }
  const android = evalExpr(attrExpr(attrs, 'android'));
  const ios = evalExpr(attrExpr(attrs, 'ios'));
  const web = evalExpr(attrExpr(attrs, 'web'));
  return platformImages({ android, ios, web });
}

function componentExample(attrs, children) {
  const title = attrString(attrs, 'title');
  const src = attrString(attrs, 'src');
  const alt = attrString(attrs, 'alt');
  const parts = [];
  if (src) parts.push(imageFrom(src, alt));
  else {
    const android = evalExpr(attrExpr(attrs, 'android'));
    const ios = evalExpr(attrExpr(attrs, 'ios'));
    const web = evalExpr(attrExpr(attrs, 'web'));
    const imgs = platformImages({ android, ios, web });
    if (imgs) parts.push(imgs);
  }
  let body = transform(children).trim();
  body.replace(/\u0000FENCE(\d+)\u0000/g, (_, id) => {
    const i = Number(id);
    if (!currentFences[i]) return '';
    currentFences[i] = currentFences[i].replace(/^```([^\n]*)/, (line, info) => {
      const bits = info
        .trim()
        .split(/\s+/)
        .filter(part => part && !part.startsWith('collapseHeight'));
      const lang = bits[0] && !bits[0].includes('.') ? bits[0] : '';
      const rest = bits[0] && !bits[0].includes('.') ? bits.slice(1) : bits;
      const hasName = rest.some(part => part.includes('.')) || (title && info.includes(title));
      const name = hasName ? rest.join(' ') : title || rest.join(' ');
      return '```' + [lang, name].filter(Boolean).join(' ');
    });
    return '';
  });
  if (body) parts.push(body);
  return parts.join('\n\n');
}

function indentBlock(text, spaces) {
  const pad = ' '.repeat(spaces);
  return text
    .split('\n')
    .map(line => (line.trim() ? pad + line : line))
    .join('\n');
}

function propertiesTable(attrs) {
  const expr = attrExpr(attrs, 'properties');
  const props = evalExpr(expr);
  if (!Array.isArray(props)) return '';
  const lines = ['| 属性 | 默认值 | 说明 |', '| --- | --- | --- |'];
  for (const p of props) {
    const desc = String(p.description || '').replace(/\n/g, '<br>').replace(/\|/g, '\\|');
    const def = p.default != null ? '`' + String(p.default).replace(/\|/g, '\\|') + '`' : '';
    lines.push(`| \`${p.name}\` | ${def} | ${desc} |`);
  }
  return lines.join('\n');
}

function boxLink(attrs) {
  const title = attrString(attrs, 'title') || jsxToText(attrExpr(attrs, 'title') || '');
  const description = attrString(attrs, 'description') || '';
  const href = attrString(attrs, 'href') || '';
  const link = href ? `[${title}](${href})` : title;
  return description ? `${link}\n\n${description}` : link;
}

function videoBox(attrs) {
  const title = attrString(attrs, 'title') || '视频';
  const description = attrString(attrs, 'description') || '';
  const id = attrString(attrs, 'videoId');
  const href = id ? `https://www.youtube.com/watch?v=${id}` : '';
  const link = href ? `[${title}](${href})` : title;
  return description ? `${link}\n\n${description}` : link;
}

function render(el) {
  const children = transform(el.children);
  switch (el.name) {
    case 'APISection':
    case 'APISectionComponents':
    case 'DataAPISection':
    case 'PropsSection':
      return '';
    case 'APIInstallSection':
      return '\n\n__INSTALL__\n\n';
    case 'PlatformTabsGroup':
    case 'Prerequisites':
    case 'ConfigPluginExample':
    case 'SnackInline':
    case 'Snack':
      return children;
    case 'ContentSpotlight':
    case 'PlatformSpotlight':
      return '\n\n' + spotlight(el.attrs) + '\n\n';
    case 'ComponentExample':
      return '\n\n' + componentExample(el.attrs, el.children) + '\n\n';
    case 'Terminal':
      return '\n\n' + terminalToMd(el.attrs) + '\n\n';
    case 'Collapsible': {
      let summary =
        attrString(el.attrs, 'summary') ||
        jsxToText(attrExpr(el.attrs, 'summary') || '') ||
        '详情';
      summary = summary.replace(/<CODE>([\s\S]*?)<\/CODE>/g, '`$1`');
      return `\n\n<details>\n<summary>${summary}</summary>\n\n${children.trim()}\n\n</details>\n\n`;
    }
    case 'Step': {
      const label = attrString(el.attrs, 'label') || '1';
      const body = children.trim();
      return `\n\n${label}. ${indentBlock(body, 3).replace(/^   /, '')}\n\n`;
    }
    case 'Tabs': {
      return '\n\n:::tabs\n' + children.trim() + '\n:::\n\n';
    }
    case 'Tab': {
      const label = attrString(el.attrs, 'label') || 'Tab';
      return `\n:::tab ${label}\n${children.trim()}\n:::\n`;
    }
    case 'Requirement': {
      const title =
        attrString(el.attrs, 'title') || jsxToText(attrExpr(el.attrs, 'title') || '') || '';
      return `\n\n**${title}**\n\n${children.trim()}\n\n`;
    }
    case 'ConfigPluginProperties':
      return '\n\n' + propertiesTable(el.attrs) + '\n\n';
    case 'BoxLink':
      return '\n\n' + boxLink(el.attrs) + '\n\n';
    case 'VideoBoxLink':
      return '\n\n' + videoBox(el.attrs) + '\n\n';
    case 'YesIcon':
      return '是';
    case 'NoIcon':
      return '否';
    case 'PlatformTags': {
      const expr = attrExpr(el.attrs, 'platforms');
      const arr = evalExpr(expr) || [];
      const labels = arr.map(p => PLATFORM_LABEL[p] || p).join('、');
      return labels ? `（${labels}）` : '';
    }
    case 'CODE':
      return '`' + el.children.trim() + '`';
    default:
      if (el.selfClosing) return '';
      return children;
  }
}

function transform(src) {
  if (!src) return '';
  let out = '';
  let i = 0;
  while (i < src.length) {
    if (src[i] === '<' && /[A-Za-z]/.test(src[i + 1] || '')) {
      const el = readElement(src, i);
      if (el) {
        out += render(el);
        i = el.end;
        continue;
      }
    }
    out += src[i];
    i++;
  }
  return out;
}

function rewriteLinks(md, slug) {
  const pageDir = slug.split('/').slice(0, -1);
  return md.replace(/\[([^\]]*)\]\(([^)\s]+)\)/g, (full, text, href) => {
    if (href.startsWith('mailto:') || href.startsWith('#')) return full;
    let url = href;
    let hash = '';
    const hashIdx = url.indexOf('#');
    if (hashIdx !== -1) {
      hash = url.slice(hashIdx);
      url = url.slice(0, hashIdx);
    }
    if (url.startsWith('https://docs.expo.dev')) {
      url = url.replace('https://docs.expo.dev', '') || '/';
    } else if (url.startsWith('http://docs.expo.dev')) {
      url = url.replace('http://docs.expo.dev', '') || '/';
    }
    if (url.startsWith('./') || url.startsWith('../')) {
      const parts = pageDir.slice();
      for (const seg of url.split('/')) {
        if (seg === '.' || seg === '') continue;
        if (seg === '..') parts.pop();
        else parts.push(seg);
      }
      url = '/' + parts.join('/');
    }
    if (url.startsWith('/versions/unversioned/')) {
      url = url.replace('/versions/unversioned/', '/versions/latest/');
    }
    if (url.length > 1) url = url.replace(/\/+$/, '');
    url = url.replace(/\.mdx?$/, '');
    if (hash) hash = hash.replace(/\/+$/, '');
    return `[${text}](${url}${hash})`;
  });
}

function stripImports(md) {
  const lines = md.split('\n');
  const out = [];
  let skipping = false;
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    if (!skipping && /^import\s/.test(line)) {
      if (!line.includes(';')) {
        skipping = true;
        continue;
      }
      continue;
    }
    if (skipping) {
      if (line.includes(';')) skipping = false;
      continue;
    }
    if (/^export\s/.test(line)) continue;
    out.push(line);
  }
  return out.join('\n');
}

function cleanup(md) {
  md = stripImports(md);
  md = md.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  md = md.replace(/<!--[\s\S]*?-->/g, '');
  md = md.replace(/&ensp;/g, ' ');
  md = md.replace(/[ \t]+\n/g, '\n');
  md = md.replace(/\n{3,}/g, '\n\n');
  return md.trim();
}

function titleFor(slug, title) {
  const raw = unquote(title);
  if (slug.includes('/sdk/ui/')) {
    if (/^[A-Za-z][A-Za-z0-9]*$/.test(raw) || /^use[A-Z]/.test(raw)) {
      if (/^use[A-Z]/.test(raw)) return raw;
      return `${raw} 组件参考`;
    }
  }
  return raw;
}

function convert(slug, file) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const pkg = unquote(data.packageName || '');
  const platforms = parsePlatforms(data.platforms || '');
  const title = titleFor(slug, data.title || slug.split('/').pop());
  const description = unquote(data.description || '');
  const protectedBody = protect(body);
  let md = transform(protectedBody.text);
  md = restore(md, protectedBody.fences, protectedBody.inline);
  md = cleanup(md);
  md = md.replace(/__INSTALL__/g, installTabs(pkg || 'expo'));
  md = rewriteLinks(md, slug);
  const platformLine = platforms.length
    ? `> 支持平台：${platforms.map(p => PLATFORM_LABEL[p] || p).join('、')}。\n\n`
    : '';
  const out = `---\ntitle: ${title}\ndescription: ${description}\n---\n\n# ${title}\n\n${platformLine}${md.trim()}\n`;
  return out.replace(/\n{3,}/g, '\n\n');
}

for (const r of results) {
  const out = convert(r.slug, r.file);
  const dest = path.join(outDir, r.slug.replace(/[\\/]/g, '__') + '.md');
  fs.writeFileSync(dest, out);
}
console.log('flattened', results.length);
