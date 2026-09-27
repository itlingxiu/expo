/**
 * Markdown 渲染管线自测（Node 环境，无需浏览器）
 * 运行：node scripts/test-md-render.mjs
 * 验证：frontmatter 解析、标题锚点、代码块、提示框、标签页、链接处理
 */
import { renderMarkdown, parseFrontmatter, stripFrontmatter } from '../src/utils/md.js'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
let failed = 0

function check(name, cond) {
  console.log(`${cond ? '  ✓' : '  ✗ FAIL'} ${name}`)
  if (!cond) failed++
}

const sample = `---
title: 测试页面
description: 这是一段描述
---

# 测试页面

## 第一节

一些**加粗**和 \`行内代码\`，以及[内部链接](/get-started/create-a-project.md#--template)。

:::note 自定义标题
这是提示内容，带[链接](/guides/overview)。
:::

:::warning
无标题警告。
:::

:::tabs
:::tab npm
\`\`\`sh
npx create-expo-app@latest
\`\`\`
:::
:::tab yarn
\`\`\`sh
yarn create expo-app
\`\`\`

:::note 嵌套提示
标签页内的提示框。
:::
:::
:::

## 第二节

\`\`\`js App.js
const x = 1 // 注释
console.log(x)
\`\`\`

| 列一 | 列二 |
| --- | --- |
| a | b |

外部链接：<https://expo.dev> 与 [expo.dev](https://expo.dev)
`

// frontmatter
const { attrs, body } = parseFrontmatter(sample)
check('frontmatter title', attrs.title === '测试页面')
check('frontmatter description', attrs.description === '这是一段描述')
check('stripFrontmatter 移除头部', !stripFrontmatter(sample).includes('description:'))

const html = renderMarkdown(sample)
console.log('\n--- 渲染结果 ---\n')
console.log(html)
console.log('\n--- 断言 ---')

check('h1 渲染', html.includes('<h1 id="测试页面">'))
check('h2 锚点', html.includes('<h2 id="第一节">') && html.includes('<h2 id="第二节">'))
check('行内代码', html.includes('<code>行内代码</code>'))
check('内部链接去掉 .md', html.includes('href="/get-started/create-a-project#--template"'))
check('提示框 note + 自定义标题', html.includes('class="callout callout-note"') && html.includes('>自定义标题<'))
check('提示框 warning 默认标题', html.includes('callout-warning') && html.includes('>警告<'))
check('标签页容器', html.includes('class="tabs"'))
check('tab 面板 data-label', html.includes('data-label="npm"') && html.includes('data-label="yarn"'))
check('无残留 ::: 段落', !html.includes('<p>:::</p>'))
check('嵌套提示框在标签页内', html.includes('嵌套提示'))
check('tabs 只有一个容器', (html.match(/class="tabs"/g) || []).length === 1)
check('代码块文件名', html.includes('codeblock-label">App.js'))
check('代码高亮', html.includes('hljs-keyword') && html.includes('hljs-comment'))
check('表格滚动容器', html.includes('<div class="table-scroll"><table>'))
check('外部链接 target=_blank', html.includes('target="_blank"'))
check('复制按钮', html.includes('code-copy'))

// 真实文件渲染
for (const rel of ['get-started/create-a-project.md', 'versions/latest/index.md']) {
  const file = join(root, 'src/content/pages', rel)
  const raw = readFileSync(file, 'utf8')
  const out = renderMarkdown(raw)
  check(`${rel} 渲染成功`, out.length > 500 && out.includes('<h1 id='))
}

console.log(failed ? `\n✗ ${failed} 项失败` : '\n✓ 全部通过')
process.exit(failed ? 1 : 0)
