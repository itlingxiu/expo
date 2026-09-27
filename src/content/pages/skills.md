---
title: 面向 AI 智能体的 Expo Skills
description: Expo 为构建、部署和调试 Expo 与 React Native 应用提供的官方 AI 智能体技能列表。
---

# 面向 AI 智能体的 Expo Skills

Expo Skills 是结构化的说明文件，教 AI 智能体如何准确、高效地构建、部署和调试 Expo 与 React Native 应用。它们适用于 Claude Code、Cursor、Codex 以及其他 AI 智能体。

- **[用 AI 构建移动应用所需的 3 个工具](https://www.youtube.com/watch?v=WLGAuwagI8o&t=61s)**：了解 Expo Skills 如何教 AI 智能体从零构建一个习惯追踪应用。

## 安装 Expo Skills

:::tabs
:::tab Claude Code
运行下面的命令，从 `claude-plugins-official` 市场安装官方 Expo 插件：

```sh
claude plugin install expo@claude-plugins-official
```

也可以在 Claude Code 会话中运行 `/plugin install expo@claude-plugins-official`。
:::
:::tab Codex
在命令行运行下面的命令，安装官方 Expo 插件：

```sh
codex plugin add expo@openai-curated
```

也可以在 Codex 中打开 `/plugins`，从 `openai-curated` 市场安装 `expo`。
:::
:::tab Cursor
如果已经为 Claude Code、Codex 或其他智能体安装了 Expo Skills，较新版本的 Cursor 会自动导入它们。打开 **Settings** > **Rules, Skills, Subagents**，确认已启用 **Include third-party Plugins, Skills, and other configs**（默认开启），Expo Skills 就会出现在 **Skills** 列表中。

如果尚未安装 Expo Skills，用 [skills CLI](https://skills.sh/docs/cli) 运行下面之一：

```sh
# npm
npx skills add expo/skills

# yarn
yarn dlx skills add expo/skills

# pnpm
pnpm dlx skills add expo/skills

# bun
bunx skills add expo/skills
```

然后重新打开 Cursor，并在 **Settings** > **Rules, Skills, Subagents** > **Skills** 下确认这些技能已出现。

:::note
Cursor 中的 Skills 不会显示在斜杠命令（`/`）菜单里。当你向智能体提出与 Expo 相关的问题时，它们会通过自动发现生效。
:::
:::
:::tab 其他智能体
使用 [skills CLI](https://skills.sh/docs/cli) 把 Expo Skills 添加到任何兼容的智能体：

```sh
# npm
npx skills add expo/skills

# yarn
yarn dlx skills add expo/skills

# pnpm
pnpm dlx skills add expo/skills

# bun
bunx skills add expo/skills
```
:::
:::

:::note
对于 Claude Code 和 Codex，该插件还会注册 [Expo MCP Server](/mcp)，因此不必单独添加。skills CLI 只安装技能。
:::

## 可用的 Expo Skills

`expo` 插件中提供以下技能。名称以 `expo-*` 开头的技能用于 Expo 开源框架，`eas-*` 技能用于 EAS 服务。

### Expo SDK 与框架

| 技能 | 说明 |
| --- | --- |
| [`expo-animation`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-animation/SKILL.md) | 在 React Native 和 Expo 中构建动画，并按决定手感的顺序做决策：是否应该动画、在哪个线程上运行、哪些属性、弹簧还是时间曲线、手势如何交接、如何降级。用 Reanimated、Gesture Handler、Expo Router 和 expo-haptics 编写实现。在 Expo 应用中为任何内容添加动画、手势、底部表单、屏幕转场、按压反馈或触感，或修复设备上卡顿的动效时使用。Web 动画请使用 `animate`。 |
| [`expo-app-clip`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-app-clip/SKILL.md) | 为 Expo 应用添加 iOS App Clip target。当用户提到 App Clip、AASA、apple-app-site-association、appclips、智能应用横幅，或想随主应用一起发布一个由 URL 唤起的轻量 iOS Clip 时使用。 |
| [`expo-brownfield`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-brownfield/SKILL.md) | 把 Expo 和 React Native 集成到现有的原生 iOS 或 Android 应用中。用于棕地、在 SwiftUI/UIKit 或 Kotlin 中嵌入 React Native 屏幕，或 AAR/XCFramework 打包。涵盖隔离与集成两种方式。用 EAS 构建或分发纯原生应用时，请使用 eas-app-stores。 |
| [`expo-data-fetching`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-data-fetching/SKILL.md) | 在实现或调试任何网络请求、API 调用或数据获取时使用。涵盖 fetch API、React Query、SWR、错误处理、缓存、离线支持、加载/空/错误屏幕状态，以及 Expo Router 数据加载器（`useLoaderData`）。 |
| [`expo-design-system`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/SKILL.md) | 在 Expo 应用内构建并维护设计系统：可复用的设计令牌主题（颜色、间距、排版、圆角、阴影、动效）、带 variant/size/state 属性约定的可复用组件结构，以及何时把重复视图提取为共享组件的规则。在创建或整理主题文件与设计令牌（theme.ts / theme/）、以其自身惯用法扩展现有主题或样式库（NativeWind、Tamagui、Restyle、Unistyles）、统一样式使屏幕（包括 AI 生成的屏幕）看起来一致且精致、修复看起来像 AI 生成或过于通用而缺少原生感的应用、构建设计系统漂移审计（硬编码颜色、间距、字体）时使用。平台样式细节（语义颜色、HIG 规则、原生控件）请用 expo-native-ui；新应用的目录布局请用 expo-project-structure。 |
| [`expo-dev-client`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-dev-client/SKILL.md) | 在本地或通过 TestFlight 构建并分发 Expo 开发客户端，用于内部测试。生产环境的 TestFlight 发布和商店提交请使用 eas-app-stores 技能。 |
| [`expo-dom`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-dom/SKILL.md) | 使用 Expo DOM 组件，在原生端的 webview 中运行 Web 代码，并在 Web 上按原样运行。把 Web 代码增量迁移到原生。整站 Web 应用的端到端迁移请使用 expo-web-to-native 技能。 |
| [`expo-examples`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-examples/SKILL.md) | Expo 的官方示例项目：expo/examples 仓库中约 70 个 `with-*` 集成（Stripe、Clerk、Supabase、OpenAI、地图、Reanimated、SQLite、Skia、NativeWind 等）。把第三方库或服务集成到现有 Expo 应用、并希望采用规范且版本匹配的模式来改写时使用，或用 `npx create-expo --example` 从某个示例搭建新项目时使用。 |
| [`expo-module`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-module/SKILL.md) | 使用 Expo Modules API（Swift、Kotlin、TypeScript）创建并编写 Expo 原生模块和视图的指南。涵盖模块定义 DSL、原生视图、共享对象、配置插件、生命周期钩子、自动链接和类型系统。构建或修改 Expo 原生模块时使用。把现有 Swift 模块从定义 DSL 迁移到 Expo Modules API 2.0 宏时不要用它；那种情况请使用 expo-migrate-module（来自 expo-experiments 插件）。 |
| [`expo-native-ui`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-native-ui/SKILL.md) | 构建美观、具有原生感的 Expo 屏幕。涵盖 Apple HIG 样式、语义颜色、原生控件、SF Symbols、媒体、视觉效果、渐变、存储和响应式布局。路由与导航请使用 expo-router 技能；动效与动画请使用 expo-animation 技能。 |
| [`expo-overview`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-overview/SKILL.md) | 每个 Expo 或 EAS 任务的入口和路由器。当请求、PRD 或规格提到 Expo、EAS、Expo Go 或某个 expo-* 包，或项目的 `package.json` 中有 `expo` 依赖时，在写代码和选择其他 expo-* / eas-* 技能之前先加载此技能。在这个前提下，它也涵盖要实现的应用规格和设计（标签、堆栈、地图、列表、导航、根据截图构建），以及“实现一个移动应用”“让我的应用看起来像原生”“添加导航”“获取一些数据”“升级我的 SDK”“把 Expo 加到现有原生应用”“发布到 App Store”或“我是 Expo 新手，从哪里开始”这类说法。即使请求已经完全指定（固定了 SDK、点名了库、给出了布局），仍然要经过这里，因为共享的设置规则依然适用。当两种信号都不存在时不要加载它：没有 `expo` 依赖的纯 React Native 项目不属于 Expo 工作。它识别真正的目标，路由到正确的 expo-* / eas-* 技能，并负责共享的设置规则。 |
| [`expo-project-structure`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-project-structure/SKILL.md) | 新 Expo 应用的目录结构。用 Expo Router 搭建或布局新的 Expo 项目，或决定某个文件应放在何处时使用。仅用于新项目，不要为了匹配它而重组现有应用。 |
| [`expo-router`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-router/SKILL.md) | Expo Router 的导航与路由。涵盖基于文件的路由、分组与动态路由、目录组织、带预览和上下文菜单的 Link、原生 Stack、页面标题、模态框和表单表单（form sheet）、NativeTabs、标题栏和工具栏，以及标题栏搜索框。 |
| [`expo-skill-feedback`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-skill-feedback/SKILL.md) | 提交对某个 Expo 技能或 Expo 本身的反馈，并控制捆绑的匿名使用遥测（默认关闭 / 选择加入）。用下面的命令提交反馈：`npx --yes submit-expo-feedback@latest "ACTIONABLE_FEEDBACK"`。可选地加上其一或两者：`--category "CATEGORY"` 和 `--subject "SUBJECT"`。运行前替换大写占位符。当某个技能有用、令人困惑、已损坏、缺少上下文或值得改进时使用；当 Expo、Expo CLI、EAS CLI、文档或 MCP 表现良好或不足时使用；当 AI 智能体反复失败、卡住，或需要用户接管某个 Expo 任务时使用（把它报告为评测候选）；或当用户明确要求启用或禁用遥测（跟踪）、查看其状态，或了解它收集什么时使用。 |
| [`expo-ui`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-ui/SKILL.md) | 用 `@expo/ui` 包构建原生 UI：iOS 上是真正的 SwiftUI，Android 上是 Jetpack Compose。表单（BottomSheet）、选择器、滑块、开关、菜单和分组表单区域默认使用 `@expo/ui`，不要去用 Reanimated、`@gorhom/bottom-sheet` 或 RN 内置的 Picker/Switch；请改用 `@expo/ui`。只有当 `@expo/ui` 缺少该组件时，才回退到 RN 内置组件。注意：`@expo/ui` 的 List 渲染的是类似 iOS 设置屏幕的原生分组行，它不是虚拟化列表；大数据集请使用 FlatList/FlashList。涵盖通用组件（Host、Column、Row、Button、Text、List、BottomSheet、FieldGroup、Switch、Slider、Picker、Menu）、RN 社区库的直接替代，以及特定于平台的 SwiftUI/Jetpack Compose 树。不用于 Expo Router 导航、Reanimated 或数据获取。 |
| [`expo-upgrade`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-upgrade/SKILL.md) | 升级 Expo SDK 版本并修复依赖问题的指南。 |
| [`expo-web-to-native`](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-web-to-native/SKILL.md) | 把现有的 Web React 应用迁移为使用 Expo 的原生 iOS/Android 应用。当用户想把网站变成移动应用、把 Next.js/Vite/CRA React 代码库移植到 React Native、在原生端增量复用 Web 代码，或询问 Web 惯用法（DOM、CSS、React Router、localStorage、window）如何映射到原生时使用。这是端到端迁移指南；DOM 组件机制本身请使用 `expo-dom` 技能。 |

### Expo Application Services (EAS)

| 技能 | 说明 |
| --- | --- |
| [`eas-app-stores`](https://github.com/expo/skills/blob/main/plugins/expo/skills/eas-app-stores/SKILL.md) | 用 EAS 构建并提交 iOS 和 Android 应用到 TestFlight、App Store 或 Google Play。支持 Expo 与其他 React Native 项目，以及现有原生应用。用于 eas.json 设置、发布流水线、签名、应用版本与构建号、商店提交和列表元数据。Expo 网站和 API 路由请用 eas-hosting；向原生应用添加 React Native 屏幕请用 expo-brownfield。 |
| [`eas-hosting`](https://github.com/expo/skills/blob/main/plugins/expo/skills/eas-hosting/SKILL.md) | 把 Expo 网站和 Expo Router API 路由部署到 EAS Hosting：导出 Web bundle、为生产和 PR 预览 URL 运行 eas deploy、管理环境密钥和自定义域名，并在 Cloudflare Workers 运行时内工作。也涵盖编写 API 路由（+api.ts 处理函数、HTTP 方法、请求处理、CORS）。部署 Expo Web 应用或 API 路由、设置 EAS Hosting，或配置托管环境与域名时使用。不用于原生构建或商店发布，那些请使用 eas-app-stores 技能。 |
| [`eas-observe`](https://github.com/expo/skills/blob/main/plugins/expo/skills/eas-observe/SKILL.md) | 用于与 EAS Observe 相关的任何事情：向 Expo 项目添加 `expo-observe`（AppMetricsRoot/ObserveRoot HOC、markInteractive 与 ObserveInteractiveMarker、useObserve hook、用于按路由指标的 Expo Router / React Navigation 集成、通过 `Observe.logEvent` 记录的用户自定义事件、通过 ObserveErrorBoundary 和 `Observe.reportError` 的错误报告，以及 sampleRate、dispatchInDebug 等运行时配置）、通过 EAS CLI 查询（`eas observe:metrics-summary`、`observe:metrics`、`observe:routes`、`observe:events`、`observe:session`、`observe:versions`）、解读所得指标（冷/热启动、TTR、TTI、导航冷/热 TTR、更新下载，以及用于排查缓慢启动的 TTI frameRate/device/network 参数），或在第三方包中交付 Observe 集成。 |
| [`eas-simulator`](https://github.com/expo/skills/blob/main/plugins/expo/skills/eas-simulator/SKILL.md) | 在 EAS 云上托管的远程 iOS/Android 模拟器中运行并控制用户的应用。在运行任何 `eas simulator:*` 命令之前阅读它，其中有这个实验性 API 的当前语法。只要用户需要一台无法在本地运行的模拟器就使用：例如“在云模拟器上运行我的应用”“用 eas simulator 运行/安装/截图我的应用”“我在 Linux/Cursor 上需要一台 iOS 设备”“这台机器没有模拟器 / 无头 CI”“让智能体点按应用并截图”“在远程模拟器上用实时重载测试我的开发构建”“把模拟器串流到浏览器”，即使用户没有说 “EAS Simulator” 或 “cloud”。在没有本地模拟器的主机上（Linux、CI、云沙箱）它是默认选择；在 macOS 上，不要因为一句普通的“在模拟器上运行”就自动触发，只在需要云端/远程/可分享的模拟器、用户缺少的 iOS 版本，或由智能体驱动的会话时使用。不用于本地模拟器（expo run:ios、Xcode、Android Studio）、EAS Build/Update、Web 预览或物理设备。 |
| [`eas-update`](https://github.com/expo/skills/blob/main/plugins/expo/skills/eas-update/SKILL.md) | 用 expo-updates 和 EAS CLI 配置并使用 EAS Update，进行 JavaScript 与资源的 OTA 更新。设置 OTA 更新、运行 eas update:configure 或 eas update、发布到 preview/staging/production 渠道、解释分支/渠道/运行时版本、测试更新，或调试已安装构建仍显示旧代码的原因时使用。已安装的 TestFlight、预览或生产更新没有出现时也要加载，包括关于冷启动或重新打开应用的问题。不用于更新健康指标；采用率、崩溃和发布监控请使用 eas-update-insights。 |
| [`eas-update-insights`](https://github.com/expo/skills/blob/main/plugins/expo/skills/eas-update-insights/SKILL.md) | 检查已发布 EAS Update 的健康状况：崩溃率、安装/启动次数、独立用户、载荷大小，以及每个渠道上嵌入式用户与 OTA 用户的比例。当用户询问某次更新的表现、发布是否健康、有多少用户在嵌入式构建上相对于 OTA，或想根据更新健康状况把关 CI 时使用。 |
| [`eas-workflows`](https://github.com/expo/skills/blob/main/plugins/expo/skills/eas-workflows/SKILL.md) | 帮助理解并编写 Expo 项目的 EAS workflow YAML 文件。当用户在 Expo 或 EAS 上下文中询问 CI/CD 或工作流、提到 .eas/workflows/，或需要 EAS 构建流水线或部署自动化方面的帮助时使用此技能。 |

## 示例提示词

安装 Expo Skills 后试一下下面的提示词。AI 智能体会自动使用合适的技能：

| 示例提示词 | 使用的技能 |
| --- | --- |
| 用有原生感的控件构建一个设置屏幕 | `expo-native-ui` |
| 给我的应用添加标签导航和一个模态框 | `expo-router` |
| 在我的 Expo 项目中设置 Tailwind CSS | `expo-tailwind-setup` |
| 用 Web 代码在我的原生应用中嵌入一个 recharts 图表 | `expo-dom` |
| 给我的 Expo 应用添加一个 SwiftUI 选择器组件 | `expo-ui` |
| 用 Jetpack Compose 使用 Material Design 3 组件 | `expo-ui` |
| 如何把我的 Expo 应用部署到 Apple App Store？ | `eas-app-stores` |
| 创建一个在每个 PR 上构建的 CI/CD 工作流 | `eas-workflows` |
| 把我的项目升级到最新的 Expo SDK | `expo-upgrade` |

## 其他资源

- **[`expo/skills` GitHub 仓库](https://github.com/expo/skills)**：浏览所有可用 Expo Skills 的源码，或报告问题。
- **[Expo MCP Server](/mcp)**：配套的 AI 工具，让编程智能体直接访问 Expo 和 EAS 服务。
