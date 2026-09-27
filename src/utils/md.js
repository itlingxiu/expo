/**
 * Markdown 渲染管线：
 *  - 标题自动加 id（供右侧目录与锚点跳转）
 *  - 代码块：highlight.js 高亮 + 复制按钮 + 可选文件名
 *  - 容器语法：:::note / :::tip / :::warning / :::danger（提示框）
 *  - 标签页语法：:::tabs 内嵌多个 :::tab 标题
 *  - 内部链接自动去掉 .md 后缀；外部链接新窗口打开
 *  - 相对图片自动补全 docs.expo.dev 域名
 */
import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import yaml from 'highlight.js/lib/languages/yaml'
import diff from 'highlight.js/lib/languages/diff'
import plaintext from 'highlight.js/lib/languages/plaintext'
import groovy from 'highlight.js/lib/languages/groovy'
import markdown from 'highlight.js/lib/languages/markdown'
import ini from 'highlight.js/lib/languages/ini'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('diff', diff)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('text', plaintext)
hljs.registerLanguage('groovy', groovy)
hljs.registerLanguage('gradle', groovy)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('md', markdown)
hljs.registerLanguage('ini', ini)

const LANG_ALIAS = {
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  json5: 'json',
  jsonc: 'json',
  htm: 'html',
  txt: 'text',
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function highlight(code, lang) {
  const real = LANG_ALIAS[lang] || lang
  if (real && hljs.getLanguage(real)) {
    try {
      return hljs.highlight(code, { language: real, ignoreIllegals: true }).value
    } catch {
      /* 回退到纯文本 */
    }
  }
  return escapeHtml(code)
}

/* ---------- 标题 slug ---------- */

const usedSlugs = new Map()

function slugify(text) {
  let slug = text
    .trim()
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  if (!slug) slug = 'section'
  const count = usedSlugs.get(slug) || 0
  usedSlugs.set(slug, count + 1)
  return count ? `${slug}-${count + 1}` : slug
}

function inlineText(token) {
  if (!token) return ''
  if (token.type === 'text' || token.type === 'code_inline') return token.content
  if (token.children) return token.children.map(inlineText).join('')
  return ''
}

/* ---------- 提示框图标 ---------- */

const CALLOUT_META = {
  note: { title: '注意', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>' },
  tip: { title: '提示', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>' },
  warning: { title: '警告', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>' },
  danger: { title: '危险', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>' },
}

/* ---------- 标签页：预处理（markdown-it-container 不支持跨类型嵌套，改为自行解析） ---------- */

/**
 * 把 :::tabs / :::tab 语法转换为 HTML 结构，内部内容递归交给 markdown-it 渲染。
 * 结构扫描忽略代码围栏内的 ::: 行。
 */
function preprocessTabs(src, md) {
  const lines = src.split('\n')
  const out = []
  let i = 0
  let inFence = false

  while (i < lines.length) {
    // 切换代码围栏状态（``` 开头）
    if (/^\s*```/.test(lines[i])) inFence = !inFence

    if (lines[i].trim() === ':::tabs' && !inFence) {
      // 找到与之匹配的闭合 :::（按深度计数）
      let depth = 1
      let j = i + 1
      const inner = []
      for (; j < lines.length; j++) {
        if (/^\s*```/.test(lines[j])) inFence = !inFence
        const t = lines[j].trim()
        if (!inFence && t === ':::') {
          depth--
          if (depth === 0) break
        } else if (!inFence && /^:::/.test(t)) {
          depth++
        }
        inner.push(lines[j])
      }

      // 拆分 :::tab 标题 面板（面板内容内的 :::note 等嵌套是平衡的，
      // 只有深度归零时的 ::: 才是面板自身的闭合）
      const panels = []
      let cur = null
      let panelDepth = 0
      for (const l of inner) {
        const m = l.match(/^:::tab\s+(.*)$/)
        if (m) {
          cur = { label: m[1].trim(), lines: [] }
          panels.push(cur)
          panelDepth = 0
        } else if (cur) {
          if (l.trim() === ':::') {
            if (panelDepth === 0) {
              cur = null // 面板闭合
              continue
            }
            panelDepth--
          } else if (/^:::/.test(l.trim())) {
            panelDepth++
          }
          cur.lines.push(l)
        }
      }

      out.push('<div class="tabs">')
      for (const p of panels) {
        out.push(`<section class="tab-panel" data-label="${escapeHtml(p.label)}">`)
        out.push(md.render(p.lines.join('\n')))
        out.push('</section>')
      }
      out.push('</div>')
      i = j + 1
      continue
    }
    out.push(lines[i])
    i++
  }
  return out.join('\n')
}

/* ---------- 构建渲染器 ---------- */

function createRenderer() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false,
  })

  /* 标题：加 id 与悬浮锚点链接 */
  md.renderer.rules.heading_open = (tokens, idx) => {
    const t = tokens[idx]
    const id = slugify(inlineText(tokens[idx + 1]))
    return `<h${t.tag[1]} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>`
  }
  md.renderer.rules.heading_close = (tokens, idx) => `</h${tokens[idx].tag[1]}>\n`

  /* 代码块：文件名 + 复制按钮 + 高亮 */
  md.renderer.rules.fence = (tokens, idx) => {
    const t = tokens[idx]
    const parts = (t.info || '').trim().split(/\s+/)
    const lang = parts[0] || 'text'
    const filename = parts[1]
    const label = filename || lang
    const html = highlight(t.content, lang)
    return (
      `<div class="codeblock"><div class="codeblock-head">` +
      `<span class="codeblock-label">${escapeHtml(label)}</span>` +
      `<button class="code-copy" type="button" aria-label="复制代码">` +
      `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>` +
      `<span>复制</span></button></div>` +
      `<pre class="hljs"><code>${html}</code></pre></div>\n`
    )
  }

  /* 链接：内部链接去掉 .md；外部链接新窗口 */
  const defaultLinkOpen =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet('href') || ''
    if (href.startsWith('http') && !href.includes('docs.expo.dev')) {
      tokens[idx].attrSet('target', '_blank')
      tokens[idx].attrSet('rel', 'noopener noreferrer')
      tokens[idx].attrSet('class', 'ext-link')
    } else if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
      tokens[idx].attrSet('href', href.replace(/\.md(#[^]*)?$/, '$1'))
    } else if (href.startsWith('https://docs.expo.dev/')) {
      // 指向官方站点的内部链接改成本站路径，没有翻译的页面由回退页兜底
      const path = href.slice('https://docs.expo.dev'.length).replace(/\.md$/, '')
      tokens[idx].attrSet('href', path)
    }
    return defaultLinkOpen(tokens, idx, options, env, self)
  }

  /* 图片：补全域名 + 懒加载 */
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const src = tokens[idx].attrGet('src') || ''
    if (src.startsWith('/')) {
      tokens[idx].attrSet('src', 'https://docs.expo.dev' + src)
    } else if (src.startsWith('./') || src.startsWith('../')) {
      tokens[idx].attrSet('src', 'https://docs.expo.dev/' + src.replace(/^\.\//, ''))
    }
    tokens[idx].attrSet('loading', 'lazy')
    return self.renderToken(tokens, idx, options)
  }

  /* 提示框容器 */
  for (const [kind, meta] of Object.entries(CALLOUT_META)) {
    md.use(container, kind, {
      validate(params) {
        return params.trim().split(/\s+/)[0] === kind
      },
      render(tokens, idx) {
        const t = tokens[idx]
        if (t.nesting === 1) {
          const custom = t.info.trim().split(/\s+/).slice(1).join(' ')
          const title = custom || meta.title
          return (
            `<aside class="callout callout-${kind}">` +
            `<div class="callout-title">${meta.icon}<span>${escapeHtml(title)}</span></div>\n`
          )
        }
        return `</aside>\n`
      },
    })
  }

  /* 标签页容器（改为预处理实现，见 preprocessTabs） */

  /* 表格：包一层滚动容器（移动端横向滚动） */
  md.renderer.rules.table_open = () => `<div class="table-scroll"><table>\n`
  md.renderer.rules.table_close = () => `</table></div>\n`

  return md
}

/** 渲染 markdown 字符串（每次调用重置标题 slug 计数器） */
export function renderMarkdown(src) {
  usedSlugs.clear()
  const md = createRenderer()
  const body = stripFrontmatter(src)
  return md.render(preprocessTabs(body, md))
}

/** 解析 frontmatter（title / description / 其他字段） */
export function parseFrontmatter(src) {
  const m = src.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/)
  if (!m) return { attrs: {}, body: src }
  const attrs = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/)
    if (kv) attrs[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim()
  }
  return { attrs, body: src.slice(m[0].length) }
}

export function stripFrontmatter(src) {
  return src.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '')
}

/** 从渲染后的 DOM 中提取 h2/h3 目录 */
export function extractToc(rootEl) {
  const items = []
  rootEl.querySelectorAll('h2, h3').forEach((h) => {
    items.push({ id: h.id, text: h.textContent.replace(/^#/, '').trim(), level: h.tagName === 'H2' ? 2 : 3 })
  })
  return items
}

/** 渲染后处理：标签页交互、复制按钮、外链图标 */
export function hydrateContent(rootEl) {
  // 标签页
  rootEl.querySelectorAll('.tabs').forEach((tabs) => {
    const panels = [...tabs.querySelectorAll(':scope > .tab-panel')]
    if (!panels.length) return
    const bar = document.createElement('div')
    bar.className = 'tab-bar'
    panels.forEach((panel, i) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'tab-btn' + (i === 0 ? ' active' : '')
      btn.textContent = panel.dataset.label || `标签 ${i + 1}`
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'))
        panels.forEach((p) => p.classList.remove('active'))
        btn.classList.add('active')
        panel.classList.add('active')
      })
      bar.appendChild(btn)
    })
    tabs.prepend(bar)
    panels[0].classList.add('active')
  })

  // 复制按钮
  rootEl.querySelectorAll('.codeblock').forEach((block) => {
    const btn = block.querySelector('.code-copy')
    const pre = block.querySelector('pre')
    if (!btn || !pre) return
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.textContent.replace(/\n$/, ''))
      } catch {
        const ta = document.createElement('textarea')
        ta.value = pre.textContent
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
      }
      btn.classList.add('copied')
      btn.querySelector('span').textContent = '已复制'
      setTimeout(() => {
        btn.classList.remove('copied')
        btn.querySelector('span').textContent = '复制'
      }, 1600)
    })
  })
}
