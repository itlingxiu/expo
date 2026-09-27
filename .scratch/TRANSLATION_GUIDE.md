# Expo 文档中文化翻译指南（Agent 必读）

任务：把 docs.expo.dev 官方英文文档翻译成中文，写入本地 Vue 项目的 Markdown 内容文件。
本指南定义**一切格式约定**，逐字遵守。

## 0. 任务与工作方式

- 每个 agent 领取一个任务清单文件（如 `.scratch/tasks/t01.txt`），每行一个页面 slug（不带前导 `/`，如 `guides/tailwind`）。
- 逐行处理：抓取原文 → 翻译 → 写文件 → **从任务清单中删除该行**（便于进度跟踪与断点续跑）。
- 全部完成后报告：成功数 / 失败数（404、抓取失败、格式异常）。

## 1. 抓取原文（source URL 映射）

用 curl 从 GitHub 抓取官方文档源文件（Expo 文档站点的内容源）：

```
基础仓库: https://raw.githubusercontent.com/expo/expo/main/docs/pages/
```

- slug `x`（无斜杠）→ 先试 `x.mdx`，404 再试 `x/index.mdx`
- slug `x/y` → 先试 `x/y.mdx`，404 再试 `x/y/index.mdx`
- slug `versions/latest/...` → 替换为 `versions/unversioned/...`，其余同上
- slug `versions/vNN.N.N/...` → 原样 `versions/vNN.N.N/...`

示例：
```
curl -s https://raw.githubusercontent.com/expo/expo/main/docs/pages/guides/tailwind.mdx
curl -s https://raw.githubusercontent.com/expo/expo/main/docs/pages/eas/index.mdx
curl -s https://raw.githubusercontent.com/expo/expo/main/docs/pages/versions/unversioned/sdk/expo.mdx
curl -s https://raw.githubusercontent.com/expo/expo/main/docs/pages/versions/v54.0.0/sdk/accelerometer.mdx
```

命令示例（Windows Git Bash）：
```sh
curl -s --max-time 30 "https://raw.githubusercontent.com/expo/expo/main/docs/pages/guides/tailwind.mdx" -o /tmp/page.mdx && wc -c /tmp/page.mdx
```
404 时文件内容是 `404: Not Found`。若 .mdx 404，试 `.md`；都失败则记录失败并在报告里列出。

## 2. 输出文件

- 路径：`E:\个人\个人项目\expo\src\content\pages\<slug>.md`
- 目录不存在则创建。
- 每次用 Write 工具整文件写入（UTF-8，LF 换行）。

## 3. 翻译总原则

- **整页翻译成简体中文**，包括 frontmatter 的 title/description、标题、正文、表格、提示框、图片 alt。
- **代码块内代码保持英文原样**（变量名、命令、路径、JSON 配置），但代码中的**注释（`//`、`#`）翻译成中文**。
- 保留专有名词不译：Expo Go、Expo CLI、EAS、EAS CLI、Metro、Expo Router、React Native、npm/yarn/pnpm/bun、Android Studio、Xcode、TestFlight、App Store、Play Store、GitHub Actions、Hermes、TypeScript、JavaScript、Webpack、Vite、CocoaPods、Gradle、Fastlane、Sentry、Firebase、Supabase、Clerk、PostHog、OneSignal、Slack、GitHub、Apple、Google 等品牌/工具名。
- 术语对照（尽量统一）：
  - development build → 开发构建；prebuild → 预构建；runtime → 运行时
  - over-the-air update → OTA 更新；eas update → EAS Update（或"更新"）
  - app config → 应用配置；config plugin → 配置插件；mod → 修改器
  - credentials → 凭据；provisioning profile → 配置文件/描述文件
  - simulator → 模拟器（iOS）；emulator → 模拟器（Android）
  - splash screen → 启动屏/启动画面；push notification → 推送通知
  - deep linking → 深层链接；universal link → 通用链接；app link → 应用链接
  - store listing → 商店列表页；metadata → 元数据
  - environment variable → 环境变量；access token → 访问令牌
  - monorepo → Monorepo；workflow → 工作流；profile（构建配置）→ profile
  - submission → 提交；internal distribution → 内部分发
  - WebView、deep link、cron、webhook、SDK、API、URL、JSON、CLI → 不译
- 代码围栏的信息串（语言后的标题，如 ` ```ts Streaming fetch`）翻译成中文，如 ` ```ts 流式 fetch`。
- 官方站点内部链接改写为本站绝对路径：
  - `[text](/guides/environment-variables/)` → `[文本](/guides/environment-variables)`（去尾部斜杠，去 .md）
  - `[text](/versions/latest/sdk/expo/#api)` → 保留为 `/versions/latest/sdk/expo#api` 形式（锚点不带斜杠）
  - `https://docs.expo.dev/xxx` → `/xxx`
  - 其余外部链接原样保留。
- 图片路径原样保留（渲染器会自动补全域名），如 `![图](/static/images/xxx.png)`。
- 表格：表头与单元格全部翻译；单元格内代码/标识符不译。

## 4. MDX → 本地 Markdown 转换规则

本地渲染器支持：`:::note` / `:::tip` / `:::warning` / `:::danger` 提示框、`:::tabs` + `:::tab 标题` 标签页、标准 Markdown、代码块文件名、表格、`<details>` 原生 HTML。

1. **删除**所有 `import ...` 行、`export ...` 行、MDX 注释 `{/* ... */}`、`<!-- ... -->`。
2. **frontmatter**：只保留 `title`（翻译）和 `description`（翻译）。丢弃 sourceCodeUrl、platforms、iconUrl、hideTOC、searchRank 等字段。
   - 若原 title 是包名（如 `Expo`、`Accelerometer`），译为 `<原名> 包参考`（如 `expo 包参考`）。
   - platforms 字段若存在，正文开头加一行：`> 支持平台：Android、iOS、tvOS、Web、Expo Go。`（按原文顺序翻译）。
3. **`<APIInstallSection ... />`**（SDK 参考页的"Installation"标题下）→ 替换为：
   ````
   :::tabs
   :::tab npm
   ```sh
   npx expo install <包名>
   ```
   :::
   :::tab yarn
   ```sh
   yarn expo install <包名>
   ```
   :::
   :::tab pnpm
   ```sh
   pnpm expo install <包名>
   ```
   :::
   :::tab bun
   ```sh
   bun expo install <包名>
   ```
   :::
   :::
   ````
   （`<包名>` 取 frontmatter 的 packageName；第三方库页取实际包名。）
4. **`> **Note:**` / `> **Warning:**` / `> **Deprecated:**` 引用块** → `:::note` / `:::warning` / `:::danger` 容器，内容翻译。普通引用块 `> 文本` 保留为引用块。
5. **`<TerminalBlock cmd={['npx','expo','start']} />`** → ` ```sh` 代码块，内容为命令拼接。带 `cmdCopy` 属性用其内容。
6. **`<Collapsible summary="...">内容</Collapsible>`** → 保留原生 HTML：`<details><summary>翻译后的标题</summary>\n\n翻译后的内容\n\n</details>`。
7. **Tabs 组件**：
   ```
   <Tabs>
     <Tab label="npm">...内容...</Tab>
     <Tab label="yarn">...内容...</Tab>
   </Tabs>
   ```
   → 转换为（注意嵌套代码块与 ::: 的配平，面板闭合必须单独一行 `:::`）：
   ```
   :::tabs
   :::tab npm
   ...内容...
   :::
   :::tab yarn
   ...内容...
   :::
   :::
   ```
8. **`<Step label="1">内容</Step>`** → `1. 内容`（合并成有序列表，若内容含代码块则缩进 3 空格）。
9. **`<SnackInline ...>` / `<Snack ...>`** → 将其中的 `{`\`js ...\`}` 代码提取为普通代码块；不支持的属性丢弃。
10. **其他未知组件**（如 `<ConfigReactNative />`、`<ContentSpotlight />`、`<APIBox ...>`、`<ConfigSection>`、`<AppetizeEmbed>` 等）：
    - 能提取出静态内容（文本、代码、属性中的文字）→ 转为等价的静态 Markdown（标题/段落/代码块）。
    - 纯交互组件（表单、搜索、实时配置器）→ 删除，若因此丢失关键信息，用一两句话概括其功能（如：`> 本页包含一个交互式配置工具，可选择平台与设备查看对应步骤。`）。
11. **标题层级**：MDX 中 SDK 参考页从 `##` 开始 → 保持原层级（本地文件正文第一个标题必须是 `#`——在 frontmatter 之后自行补一个 `# <页面标题>`，与 frontmatter title 相同）。
12. **代码围栏信息串**可能带文件名（` ```js App.js`）→ 原样保留文件名（不译），翻译部分仅指语言后的说明性文字（少见）。
13. `<DataAPISection>`、`<APISection>`、`<PropsSection>` 等数据驱动组件 → 删除（自动生成的 API 详情无法静态复刻，保留页面其余内容）。
14. 目录锚点 `[标题](#installation)` 的锚点值改成**翻译后标题的 slug 形式**（小写、空格转 `-`、去掉反引号与标点）。例如 `#installation` → `#安装`。

## 5. 格式硬性要求（写完必须自查）

1. frontmatter 含 `title` 和 `description`（均中文、非空）。
2. frontmatter 之后正文第一个块是 `# 标题`（一级标题，中文）。
3. `:::` 容器开闭配对（:::tabs 内每个 :::tab 面板都以单独一行 `:::` 结束，最后再一行 `:::` 关闭 tabs）。
4. 代码围栏数量为偶数。
5. 全文不得残留：`import `、`export default`、`<Tabs>`、`<Tab `、`<TerminalBlock`、`<Collapsible`、`<Step `、`<APIInstallSection`、`<APISection`、`<SnackInline`、`<ContentSpotlight`、`{/*`、`-->`（HTML 注释可以写 `<!-- -->` 但不要遗留 MDX 注释）。
6. 文件 ≥ 400 字符。
7. 完成后运行校验（可选）：`node scripts/validate-pages.mjs`（在 `E:\个人\个人项目\expo` 目录）。

## 6. 历史版本页（versions/vNN.N.N/*）

- 内容结构与 latest 相同，独立翻译（不要复制 latest 的翻译，各版本 API 有差异）。
- 页面 title 保持原名（包名），description 译为中文。
- 正文开头加 `> 本页面对应 Expo SDK v54。`（vNN 换成对应版本，如 v54 / v55 / v56 / v57 / v58）。

## 7. 质量底线

- 逐段逐句翻译，不省略、不总结、不改写含义；官方正文中的每个信息点都要出现在中文里。
- 中文自然流畅，符合技术文档语体；句子太长就拆句。
- 列表中项与原文一一对应。
