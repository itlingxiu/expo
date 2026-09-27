---
title: 将模型上下文协议（MCP）与 Expo 一起使用
description: 关于把模型上下文协议集成到 Expo 项目中以增强 AI 模型能力的指南。
---

# 将模型上下文协议（MCP）与 Expo 一起使用

模型上下文协议（Model Context Protocol，MCP）是一种标准协议，允许 AI 模型与外部数据源集成，为更精确的响应提供增强的上下文。它使智能体等 AI 辅助工具能够更深入地理解你的开发环境，从而为代码库提供更好的协助。

Expo MCP Server 是由 Expo 托管的远程 MCP 服务器，可与 Claude、Claude Code、Cursor、VS Code 等流行的 AI 辅助工具集成，使它们能够直接与你的 Expo 项目交互。Expo MCP 也可在 [Claude Connectors](https://claude.ai/directory/expo) 中使用，因此你可以从网页、桌面和移动应用上的 Claude 连接，无需本地安装。

**[视频：介绍 Expo MCP Server：获得准确、具备上下文感知的 AI 响应](https://www.youtube.com/watch?v=dp9dpIgDxZQ)**：增强用于使用 Expo 构建应用的 AI 辅助工具。

**[视频：用 AI 构建移动应用所需的 3 个工具](https://www.youtube.com/watch?v=WLGAuwagI8o&t=364)**：观看 AI 智能体在使用 Expo 构建移动应用时使用 MCP 服务器。

## Expo MCP Server 能做什么

Expo MCP Server 让 AI 辅助工具了解 Expo SDK，并让它们与移动模拟器和 React Native DevTools 交互。以下是 Expo MCP Server 可以增强的一些任务示例：

**了解如何使用 Expo 开发。** AI 辅助工具可以按需获取最新的官方 Expo 文档，并用它回复如下提示：

- “如何使用 Expo Router？”
- “在 Expo 文档中搜索实现深层链接”
- “阅读 Expo Router 文档页”
- “什么是 Expo CNG？”

**管理依赖。** Expo MCP Server 引导你安装我们推荐的包，并使用 `npx expo install` 安装已知的兼容版本。

- “添加 SQLite 以及基本的 CRUD 操作”
- “安装 `expo-camera` 并演示如何拍照”
- “添加 `expo-notifications` 以支持推送通知”

**管理构建和工作流。** Expo MCP Server 可以触发并监控 EAS 构建、运行工作流，以及从 TestFlight 拉取崩溃数据：

- “调查我最近一次在 EAS 上的 iOS 构建为什么失败”
- “找出最近失败工作流中的任何模式”
- “创建一个运行 Maestro 测试的工作流”
- “显示最近的 TestFlight 崩溃”
- “显示我的应用的 TestFlight 反馈”

**自动化视觉验证和测试。** 多模态 AI 辅助工具可以对模拟器中正在运行的应用截图并与之交互。Expo MCP Server 包含通过把 `expo-mcp` 包添加到项目依赖来启用的本地能力。

- “添加一个蓝色圆形视图并确认它正确渲染”
- “添加一个按钮并点击它以验证交互有效”
- “添加一个点击后递增的计数器按钮，并验证状态更新正确”

AI 辅助工具可以自主编写代码、截图以验证 UI 正确、测试交互，并修复它们发现的问题。

[MCP 能力](#可用的-mcp-能力)的完整表格记录了 Expo MCP Server 向 AI 辅助工具提供的工具和提示词。

**前置条件**

- **Expo 账户**：使用 Expo MCP Server 需要 Expo 账户。
- **使用最新 SDK 的 Expo 项目**：使用 `npx create-expo-app@latest` 创建项目，或确保现有项目已安装最新的 `expo` 包。
- **支持远程 MCP 的 AI 辅助工具**：Claude、Claude Code、Cursor、VS Code，或任何其他支持远程 MCP 服务器的工具。

## 安装与设置

### 安装 Expo MCP Server

Expo MCP Server 支持与各种 AI 辅助工具集成。使用下面的通用设置，或展开你的特定工具以查看详细说明：

- **服务器类型**：Streamable HTTP
- **URL**：`https://mcp.expo.dev/mcp`
- **身份验证**：OAuth

:::tabs
:::tab Claude

**网页、桌面和移动应用上的 Claude**

Expo MCP 可在 [Claude Connectors](https://claude.ai/directory/expo) 中使用。此设置不需要在你的机器上安装。点击以下链接并按照提示把 Expo 连接器添加到 Claude 账户：

[把 Expo 连接器添加到 Claude](https://claude.ai/directory/expo)

在 Claude Team 或 Enterprise 套餐上，可以为整个组织启用 Expo 连接器。该组织的成员随后可以在任何设备（包括手机）上使用它，无需手动安装。

**Claude Code**

如果已安装 [`expo` 插件](/skills#安装-expo-skills)，它已经注册了此服务器。跳过下面的命令，在会话中运行 `/mcp` 进行身份验证。

```sh
claude mcp add --transport http expo https://mcp.expo.dev/mcp
```

安装后，在 Claude Code 会话中运行 `/mcp` 以进行身份验证。

:::
:::tab Cursor

点击以下链接为 Cursor 安装 MCP 服务器：

[安装 MCP 服务器](cursor://anysphere.cursor-deeplink/mcp/install?name=expo&config=eyJ1cmwiOiJodHRwczovL21jcC5leHBvLmRldi9tY3AifQ%3D%3D)

:::
:::tab VS Code

1. 打开命令面板（<kbd>Cmd ⌘</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> 或 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>）
2. 运行 **MCP: Add Server**
3. 选择 **HTTP**
4. 输入服务器详细信息：
   - **URL**：`https://mcp.expo.dev/mcp`
   - **名称**：expo

:::
:::tab Codex

如果已安装 [`expo` 插件](/skills#安装-expo-skills)，它已经注册了此服务器。跳过下面的命令，运行 `codex mcp login expo` 进行身份验证。

```sh
codex mcp add expo --url https://mcp.expo.dev/mcp
```

上述命令会把 MCP 服务器添加到 Codex 配置文件，并提示你使用 Expo 账户进行身份验证。

:::
:::

### 使用 Expo 认证

安装 MCP 服务器后，需要进行身份验证。

在提示时于浏览器中使用 Expo 账户登录。服务器会自动生成访问令牌。

### 设置本地能力（推荐）

:::note
本地能力仅在 **SDK 54 及更高版本**中可用。
:::

要获得完整的 MCP 体验，包括从 iOS 模拟器截图、打开 DevTools 和自动化能力等高级功能，请设置本地 Expo 开发服务器：

:::tabs
:::tab npm
```sh
cd /path/to/your-project

# 安装 expo-mcp 包
npx expo install expo-mcp --dev

# 确保已使用与 MCP 服务器身份验证相同的账户登录 Expo CLI
npx expo whoami || npx expo login

# 启动带 MCP 能力的开发服务器
EXPO_UNSTABLE_MCP_SERVER=1 npx expo start
```
:::
:::tab yarn
```sh
cd /path/to/your-project

# 安装 expo-mcp 包
yarn expo install expo-mcp --dev

# 确保已使用与 MCP 服务器身份验证相同的账户登录 Expo CLI
yarn expo whoami || yarn expo login

# 启动带 MCP 能力的开发服务器
EXPO_UNSTABLE_MCP_SERVER=1 yarn expo start
```
:::
:::tab pnpm
```sh
cd /path/to/your-project

# 安装 expo-mcp 包
pnpm expo install expo-mcp --dev

# 确保已使用与 MCP 服务器身份验证相同的账户登录 Expo CLI
pnpm expo whoami || pnpm expo login

# 启动带 MCP 能力的开发服务器
EXPO_UNSTABLE_MCP_SERVER=1 pnpm expo start
```
:::
:::tab bun
```sh
cd /path/to/your-project

# 安装 expo-mcp 包
bun expo install expo-mcp --dev

# 确保已使用与 MCP 服务器身份验证相同的账户登录 Expo CLI
bun expo whoami || bun expo login

# 启动带 MCP 能力的开发服务器
EXPO_UNSTABLE_MCP_SERVER=1 bun expo start
```
:::
:::

:::warning
每次启动或停止开发服务器时，都需要在 AI 辅助工具中**重新连接或重启** MCP 服务器连接，以确保 AI 辅助工具获得刷新后的能力。
:::

## 服务器能力与本地能力

Expo MCP Server 根据你的设置提供两类能力：

### 服务器能力

仅连接远程 MCP 服务器即可使用服务器能力，无需设置本地开发服务器。

### 本地能力

本地能力需要本地 Expo 开发服务器正在运行，并提供与本地开发环境交互的高级功能：

- **自动化工具**：截图、点击视图、按 testID 查找元素
- **开发工具**：打开 React Native DevTools
- **项目分析**：生成 `expo-router` 站点地图

这些能力支持更复杂的工作流，例如自动化测试、视觉验证和更深入的项目内省。要使用本地能力，需要按照上文的[设置本地能力](#设置本地能力推荐)一节操作。

## 可用的 MCP 能力

:::note
MCP 能力会随 `expo-mcp` 包更新或 MCP 服务器更改而变化。以下列表仅供参考，可能不是最新的。
:::

### 工具

| 名称 | 说明 | 示例提示词 | 可用性 |
| --- | --- | --- | --- |
| `add_library` | 使用 expo install 向项目添加 Expo 库，并在可用时附上用法说明。 | add sqlite and basic CRUD to the app | 服务器 |
| `read_documentation` | 获取单个 Expo 文档页面，并以 Markdown 返回其内容。每次调用最多返回约 5000 个 token。使用 offset 对长页面分页。 | read the Expo Router docs page | 服务器 |
| `search_documentation` | 搜索官方 Expo 文档，并按与用户查询的相关性返回页面 URL。使用 read_documentation 从最相关的页面开始获取完整内容。需要 EAS 付费套餐。 | search documentation for CNG | 服务器 |
| `learn` | 学习特定主题的 Expo 操作方法，并记住它以供后续对话使用。用它来教助手特定的 Expo 功能或工作流。 | learn how to use expo-router | 服务器 |
| `workflow_create` | 为 Expo 项目创建新的 EAS 工作流 YAML 文件，或获取工作流语法文档。当用户想在 .eas/workflows/ 中创建 CI/CD 工作流，或需要学习 EAS 工作流语法时使用。创建后使用 workflow_validate 验证文件。 | create a CI/CD workflow for building and deploying | 服务器 |
| `workflow_info` | 按 ID 获取特定 EAS 工作流运行的详细信息。用于检查工作流运行的状态、作业结果、错误和产物。如果工作流有多个作业，用图画出它们以显示作业之间的依赖。 | get the status of the latest workflow run | 服务器 |
| `workflow_list` | 列出项目最近的 EAS 工作流运行。提供 appId（来自 app.json 的 `"extra.eas.projectId"`）或 appFullName（例如 `"@owner/my-app"`）。 | list the recent workflow runs | 服务器 |
| `workflow_logs` | 获取 EAS 工作流运行中特定作业的日志。不带 sectionIndex 或 phase 调用时，返回日志分段摘要（阶段名称和行范围）；然后带 sectionIndex 或 phase 再次调用以获取该分段。 | show me the logs for the build job in the workflow | 服务器 |
| `workflow_run` | 从 git 引用触发 EAS 工作流运行。提供 appId（来自 app.json 的 `"extra.eas.projectId"`）或 appFullName（例如 `"@owner/my-app"`）。工作流文件必须存在于指定的 git 引用处。 | run the build-and-deploy workflow | 服务器 |
| `workflow_cancel` | 取消正在运行的 EAS 工作流。使用 workflow_info 获取工作流运行 ID。 | cancel the running workflow | 服务器 |
| `workflow_validate` | 验证 EAS 工作流 YAML 语法和配置。创建工作流后用它确保工作流有效。提供 appId（来自 app.json 的 `"extra.eas.projectId"`）或 appFullName（例如 `"@owner/my-app"`）。 | validate my workflow file | 服务器 |
| `build_list` | 列出项目的 EAS 构建。提供 appId（来自 app.json 的 `"extra.eas.projectId"`）或 appFullName（例如 `"@owner/my-app"`）。用于查看最近的构建、其状态和可用产物。 | list the recent builds for this project | 服务器 |
| `build_info` | 按 ID 获取特定 EAS 构建的状态和详细信息。用于检查构建状态、错误、产物和其他细节。 | get the status of my latest iOS build | 服务器 |
| `build_logs` | 获取特定 EAS 构建的日志。构建必须已完成（结束或出错）才有可用日志。 | show me the logs for the failed build | 服务器 |
| `build_submit` | 把 EAS 构建提交到应用商店（Android 为 Google Play Store，iOS 为 App Store）。构建必须是已完成且分发类型合适的构建。提供 appId（来自 app.json 的 `"extra.eas.projectId"`）或 appFullName（例如 `"@owner/my-app"`）。 | submit the latest build to the App Store | 服务器 |
| `build_run` | 使用 eas.json 中的构建 profile 触发新的 EAS 构建。需要把 GitHub 仓库连接到项目。提供 appId（来自 app.json 的 `"extra.eas.projectId"`）或 appFullName（例如 `"@owner/my-app"`）。 | run a production build for iOS | 服务器 |
| `build_cancel` | 取消排队中或进行中的 EAS 构建。先使用 build_info 检查当前状态。 | cancel the build that is currently in progress | 服务器 |
| `testflight_crashes` | 获取 TestFlight 崩溃数据。不带 crashId 时列出最近的崩溃。带 crashId 时返回包含堆栈跟踪的完整崩溃日志。 | show me recent TestFlight crashes | 服务器 |
| `testflight_feedback` | 从 TestFlight 获取截图反馈。返回反馈元数据，包括设备信息、用户评论和截图 URL。 | show TestFlight feedback for my app | 服务器 |
| `appstore_reviews` | 获取应用的公开 App Store 客户评价（评分、标题、正文、评价者、地区）。TestFlight beta 反馈请改用 testflight_feedback。 | | 服务器 |
| `appstore_reply_review` | 发布或编辑对 App Store 客户评价的公开开发者回复。这是写操作：回复对 App Store 上的所有人可见，Apple 会在短暂审核后发布。App Store Connect 允许每条评价只有一条回复，因此任何现有回复都会被替换。 | | 服务器 |
| `appstore_delete_review_response` | 删除 App Store 客户评价上的公开开发者回复。这是写操作：它会从 App Store 移除该回复。如果评价没有回复，会报告未删除任何内容。 | | 服务器 |
| `playstore_crashes` | 从 Google Play（Android Vitals）获取崩溃和 ANR 数据。不带 issueId 时列出最近的崩溃/ANR 问题。带 issueId 时返回包含堆栈跟踪的完整错误报告。 | | 服务器 |
| `playstore_reviews` | 从 Google Play 获取用户评价。返回评价元数据，包括作者、星级、设备信息和评论文本。注意：Google Play 大约只公开最近一周带文本的生产评价。 | | 服务器 |
| `playstore_reply_review` | 向 Google Play 用户评价发布公开的开发者回复，或编辑现有回复。这是写操作：回复在商店列表上对用户可见。每条评价只有一条开发者回复，再次回复会替换它。回复文本限制为 350 个字符。 | | 服务器 |
| `expo_router_sitemap` | 列出当前 Expo Router 项目的所有路由（站点地图）。在使用 Expo Router 并需要知道应用中存在哪些路由或屏幕时使用。需要 `expo-router` 库。 | check the expo-router-sitemap output | 本地 |
| `open_devtools` | 为正在运行的应用打开 React Native DevTools，以调试 JavaScript、检查组件树并查看控制台输出。需要项目的开发服务器（Metro）正在运行。 | open devtools | 本地 |
| `collect_app_logs` | 在短时间窗口内从原生设备（Android logcat / iOS syslog）和/或 JavaScript 控制台收集日志。用于调试正在运行的应用中的运行时错误、崩溃或意外行为。 | collect app logs from the iOS simulator | 本地 |
| `automation_tap` | 在给定的屏幕坐标 (x, y) 处，或在具有给定 React Native testID 的视图上点击正在运行的应用。提供 x 和 y，或提供 testID。有 testID 时优先使用它，因为它对布局变化更稳健。 | tap the screen at x=12, y=22 | 本地 |
| `automation_take_screenshot` | 对正在运行的应用截图——全屏，或在提供 React Native testID 时截取特定视图。用于以视觉方式验证当前 UI 状态。 | take a screenshot and verify the blue circle view | 本地 |
| `automation_find_view` | 按 React Native testID 查找视图并返回其属性（位置、大小和可见性）。用于验证视图是否正确渲染，或在调用 automation_tap 之前获取坐标。 | dump properties for testID 'button-123' | 本地 |

### 提示词

如果 AI 辅助工具支持 [MCP 提示词](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts)，你可能会看到额外的菜单选项，例如 [Claude Code 中的斜杠命令](https://code.claude.com/docs/en/mcp)：

| 名称 | 说明 | 可用性 |
| --- | --- | --- |
| `expo_router_sitemap` | 使用 `expo-router-sitemap` 查询当前 expo-router 项目的所有路由。 | 本地 |

## 局限性

当前实现有以下局限：

- 一次只支持**单个开发服务器**连接
- 本地能力的 iOS 支持仅限于模拟器（尚不支持物理设备）
- 本地能力的 iOS 支持仅在 macOS 主机上可用。

## 数据隐私

Expo 不会使用发送到 Expo MCP Server 的数据来训练 AI 模型。Expo MCP Server 本身不运行 AI 模型。它向你连接的 AI 辅助工具（例如 Claude、Claude Code、Cursor 或 VS Code）提供 MCP 工具和提示词。

对于服务器能力，Expo MCP Server 可能会访问完成所请求工具调用所需的 Expo 账户和项目数据，例如构建、工作流、文档或与 TestFlight 相关的数据。结果通过 MCP 连接返回给你的 AI 辅助工具。

对于本地能力，来自开发机器的数据会通过 Expo MCP Server 代理并返回给你的 AI 辅助工具。例如，当 AI 辅助工具请求截取模拟器截图时，数据流如下：

1. 本地 Expo 开发服务器从模拟器捕获截图。
2. 截图被发送到 Expo MCP Server。
3. Expo MCP Server 把截图返回给你的本地 MCP 客户端或 AI 辅助工具。

Expo MCP Server 把数据返回给你连接的 MCP 客户端，例如 Claude、Claude Code、Cursor、VS Code 或 Codex。从那里开始，客户端及其模型提供商可能会应用自己的保留、零数据保留（ZDR）和训练策略。在为处理敏感数据（包括 HIPAA、SOC 2 或其他受监管工作负载）的项目启用 MCP 访问之前，请审阅这些策略。

## 更多资源

- **[模型上下文协议文档](https://modelcontextprotocol.io/)**：进一步了解 MCP 规范和协议细节。
