# Expo 文档中文版（docs.expo.dev 复刻）

[docs.expo.dev](https://docs.expo.dev) 的**非官方中文翻译版**，使用 **Vue 3 + Vite** 复刻官方站点设计与结构。

> ⚠️ 非官方项目：内容与设计版权归 Expo（650 Industries, Inc.）所有，仅供学习交流使用。如有出入，请以[英文原文](https://docs.expo.dev)为准。

## 功能

- 🎨 1:1 复刻官方文档布局：黑色顶栏、左侧导航树（完整覆盖官方全部栏目）、右侧本页目录、页脚
- 🌓 亮色 / 深色双主题（跟随系统，可手动切换）
- 📝 Markdown 内容系统：提示框（note/tip/warning/danger）、JS/TS 与包管理器标签页、代码高亮 + 一键复制、表格
- 🔍 客户端全文搜索（Ctrl+K 或 `/` 唤起）
- 🌐 完整导航：入门 / 开发 / 审查 / 部署 / 指南 / 参考 / Expo SDK / Expo Router / EAS / 工作流 / 教程 / 更多
- 🚧 未翻译页面自动回退：显示占位页并链接到英文原文

## 快速开始

```bash
npm install
npm run dev        # 开发服务器
npm run build      # 生产构建
npm run index      # 重建搜索索引（新增/修改页面后运行）
```

## 目录结构

```
src/
├── components/         # 界面组件（Header / Sidebar / TocNav / Footer / 搜索…）
├── content/
│   ├── nav.js          # 完整导航树（对照官方侧边栏）
│   ├── search-index.json  # 自动生成的搜索索引
│   └── pages/**/*.md   # 中文翻译内容（Markdown）
├── styles/global.css   # 设计系统（亮/暗主题变量）
└── utils/md.js         # Markdown 渲染管线（markdown-it + highlight.js）
```

## 添加新页面

1. 在 `src/content/pages/<官方路径>.md` 创建 Markdown 文件（frontmatter 含 `title` / `description`）
2. 运行 `npm run index` 重建搜索索引

页面 slug 与官方 URL 路径一一对应，例如官方 `https://docs.expo.dev/get-started/start-developing` 对应 `src/content/pages/get-started/start-developing.md`。

## Markdown 扩展语法

````markdown
:::note 自定义标题（可省略）
提示框内容
:::

:::tabs
:::tab npm
```sh
npx expo start
```
:::
:::tab yarn
```sh
yarn expo start
```
:::
:::
````

支持 `note` / `tip` / `warning` / `danger` 四种提示框；代码围栏信息 ` ```js 文件名` 可在代码块顶部显示文件名。
