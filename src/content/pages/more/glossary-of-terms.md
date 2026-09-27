---
title: 术语表
description: 文档中使用的、与 Expo 或跨平台开发相关的非显而易见术语列表。
---

# 术语表

### Android

由 Google 赞助、用于 **Android** 设备的移动操作系统。

### 应用配置

项目根目录中名为 **app.json**、**app.config.json**、**app.config.js** 或 **app.config.ts** 的文件。更多信息见[应用配置](/workflow/configuration)。

此文件用于以下目的：

- 配置 [Expo CLI](#expo-cli) 的工作方式。
- 在 EAS Update 中生成项目的公开[清单](#清单)（可以把它理解为原生应用的 **index.html**）。
- 列出影响 `npx expo prebuild` 如何生成原生代码的 Expo [配置插件](#配置插件)。

### app.json

一个[应用配置](#应用配置)文件。

### Apple capabilities

由 Apple 提供的云服务。这些服务必须在 [Apple Developer Portal](#apple-developer-portal) 中为应用启用。

### Apple Developer Portal

Apple 用于管理应用代码签名的[官方网站](https://developer.apple.com/)。EAS 凭据会自动化开发者在开发应用时访问此网站的大多数常见原因。

### 自动 capability 签名

EAS Build 的一项功能，根据项目的授权项文件自动启用或禁用 [Apple capabilities](#apple-capabilities)。见 [iOS capabilities 参考](/build-reference/ios-capabilities)。

### 自动链接

一种跨平台工具，通过原生包管理器把原生模块自动链接到原生应用。

- 在 Android 上，该工具用于 **android/app/build.gradle**，并在 [Gradle](#gradle) 同步过程中调用。
- 在 iOS 上，该工具用于 [CocoaPods](#cocoapods) 的 **ios/Podfile**，并在 `pod install` 期间调用。

自动链接有两个版本：[Expo 自动链接](#expo-自动链接)和[社区自动链接](#社区自动链接)。

默认的[预构建模板](#预构建模板)包含对 [Expo 自动链接](#expo-自动链接)和[社区自动链接](#社区自动链接)分支的支持。

### Babel

用于移除运行时 [JavaScript 引擎](#javascript-引擎)中不可用的语言特性的转译器。[Metro](#metro-打包器)在内部使用 Babel。

项目可以通过修改项目目录中的 [**babel.config.js**](/versions/latest/config/babel) 文件来配置 Babel 的使用方式。使用 [Expo CLI](#expo-cli) 时此文件是可选的。Expo 项目应扩展默认 Babel 预设 [`babel-preset-expo`](https://github.com/expo/expo/tree/main/packages/babel-preset-expo)。

### 裸工作流

:::danger
[**已弃用**](/more/release-statuses#deprecated)：Expo 不再区分“托管”和“裸”工作流。所有项目都使用基于持续原生生成（CNG）的同一架构。需要原生访问时运行 `npx expo prebuild` 生成原生目录。配置插件让你可以声明式地自定义原生配置。
:::

描述原生项目（位于 **android** 和 **ios** 目录中）在 Git 中进行版本控制并手动维护的做法。对于**现有 React Native 应用**这很典型，你会手动更改原生项目。你可以自由自定义它们，但维护开销也很高。

这与使用[应用配置和预构建](/workflow/continuous-native-generation)形成对比：原生项目不进行版本控制，而是使用 `npx expo prebuild` 按需生成，这是[推荐做法](/workflow/continuous-native-generation)。

### Bun

一种 JavaScript 运行时，也是 Node.js 的直接替代品。Bun 也可以用作 [JavaScript 包管理器](#包管理器)。有关与 Expo 和 EAS 一起使用的更多信息，见[使用 Bun](/guides/using-bun)指南。

### CocoaPods

用于把原生模块链接到原生 iOS 项目的 iOS 包管理器。此包管理器使用 **ios/Podfile** 文件配置，并在用户于 **ios** 目录中运行 `pod install` 时更新。

### 社区自动链接

这是指 React Native 社区对 [Expo 自动链接](#expo-自动链接)的[分支](https://github.com/react-native-community/cli/issues/248#issue-422591744)。链接模块的要求与 [Expo 自动链接](#expo-自动链接)不同，但实现相同。

### 配置自省

在内存中评估 [`npx expo prebuild`](#预构建) 结果、而不持久化任何代码更改的过程。这用于[自动 capability 签名](#自动-capability-签名)，以确定授权项文件会是什么样子，而不生成任何原生代码。此过程也用于 [VS Code Expo Tools](#vs-code-expo-tools) 扩展，以调试[配置修改器](#配置修改器)。

### 配置修改器

附加到[应用配置](#应用配置)上、供[预构建](#预构建)使用的异步函数。这些函数会收到单个要修改的原生文件，例如 **AndroidManifest.xml** 或 **Info.plist**。配置修改器会串联起来，来自 `@expo/config-plugins` 包。更多信息见[配置插件](/config-plugins/introduction)。

### 配置插件

用于把[配置修改器](#配置修改器)附加到[应用配置](#应用配置)上、供[预构建](#预构建)使用的 JavaScript 函数。更多信息见[配置插件](/config-plugins/introduction)。

### 持续原生生成（CNG）

描述从一组输入生成原生项目这一过程的抽象概念。在 Expo 的上下文中，CNG 通过 [`prebuild`](#预构建) 命令实现。更多信息见[持续原生生成](/workflow/continuous-native-generation)。

### create-expo-app

用于引导安装了 `expo` 包的新 React Native 应用的独立命令行工具（CLI）。更多信息见 [`create-expo-app` 参考](/more/create-expo)。

### create-expo-module

用于创建 Expo 模块并为现有模块添加平台支持的独立命令行工具（CLI）。更多信息见 [`create-expo-module` 参考](/more/create-expo-module)。

### create-react-native-app

用于引导安装了 `expo` 包并已生成原生代码的新 React Native 应用的独立命令行工具（CLI）。此 CLI 也支持从 [expo/examples](https://github.com/expo/examples) 中的示例项目进行引导。

可以通过运行以下任一命令使用此包：

- `npx create-expo-app`
- `yarn create expo-app`
- `npm create expo-app`

### 危险修改器

在[预构建](#预构建)期间对原生项目应用不稳定更改的配置[修改器](#配置修改器)。使用这些修改器是不可预测的，并且容易在 [Expo SDK](#expo-sdk) 的主版本升级之间发生破坏性更改。更多信息见[使用危险修改器](/config-plugins/dangerous-mods)。

### 开发构建

开发构建是包含 `expo-dev-client` 包的应用调试构建。它像是 [Expo Go](#expo-go) 的演进版本，没有 Expo Go 的限制，并且可以按应用需求进行自定义。

这是使用 Expo 构建生产级应用的推荐做法。更多信息见[开发构建](/get-started/set-up-your-environment?mode=development-build)。

### 开发客户端

`expo-dev-client` 是一个允许你创建开发构建并包含有用开发工具的库。你也可能遇到“自定义开发客户端”，它是[开发构建](#开发构建)的同义词。

### 开发服务器

开发服务器（dev server）是在本地启动的服务器，通常通过从 [Expo CLI](#expo-cli) 运行 `npx expo start` 来启动。

开发服务器通常托管在 `http://localhost:8081`。它从 `/` 托管[清单](#清单)，客户端用该清单向打包器请求 JavaScript bundle。

### Expo Application Services (EAS)

[Expo Application Services（EAS）](/eas) 是为 Expo 和 React Native 应用深度集成的云服务，例如 [EAS Build](/build/introduction)、[EAS Submit](/deploy/submit-to-app-stores)、[EAS Update](/eas-update/introduction)、[EAS Metadata](/eas/metadata)、[EAS Insights](/eas-insights/introduction)、[EAS Hosting](/eas/hosting/introduction)、[EAS Workflows](/eas/workflows/introduction) 和 [EAS Observe](/eas/observe/introduction)。

### EAS Build

[EAS Build](/build/introduction) 是来自 [EAS](#expo-application-services-eas) 的云服务，用于为 Expo 和 React Native 应用构建 Android 和 iOS 二进制文件。EAS Build 可用于构建[开发构建](#开发构建)和[独立应用](#独立应用)。

### EAS CLI

用于使用 EAS 的命令行工具。更多信息见 [EAS CLI](/eas/cli) 参考。

### EAS 配置

用于配置 [EAS CLI](#eas-cli) 的 **eas.json** 文件。更多信息见[使用 eas.json 配置 EAS Build](/build/eas-json)。

### EAS Hosting

[EAS Hosting](/eas/hosting/introduction) 是来自 [EAS](#expo-application-services-eas) 的云服务，用于快速部署使用 [Expo Router](#expo-router) 和 [React Native Web](#react-native-web) 构建的 Web 项目。

### EAS Insights

[EAS Insights](/eas-insights/introduction) 是来自 [EAS](#expo-application-services-eas) 的云服务，为 Expo 项目提供用量、性能和触达信息。它使用 `expo-insights` 库从应用向 EAS Insights 发送事件。

### EAS Metadata

用于以 JSON 上传和下载 Apple App Store 元数据的命令行工具。此工具包含在 [EAS CLI](#eas-cli) 包中，应用于改进 iOS 提交流程。更多信息见 [EAS Metadata](/eas/metadata)。

### EAS Observe

[EAS Observe](/eas/observe/introduction) 是一项性能监控服务，跟踪应用在生产环境中的表现，包括冷启动和热启动时间、首次渲染时间和可交互时间。它使用 `expo-observe` 库从生产构建收集指标，然后可以在 Observe 仪表板中查看。它还会记录从应用记录的[用户定义事件](/eas/observe/events)。

### EAS Update

1. 来自 [EAS](#expo-application-services-eas) 的云托管服务 [EAS Update](/eas-update/introduction)，用于 OTA 更新。
2. 来自 [EAS CLI](#eas-cli) 的 CLI 命令 `eas update`，用于把静态文件发布到云托管服务。

### EAS Workflows

[EAS Workflows](/eas/workflows/introduction) 是来自 [EAS](#expo-application-services-eas) 的 CI/CD 服务，让团队可以自动化重复任务，例如构建 Android 和 iOS 二进制文件、发布空中更新、提交到应用商店、使用 Maestro 运行端到端测试，以及把 Web 应用部署到 [EAS Hosting](/eas/hosting/introduction)。工作流在 **.eas/workflows** 目录下的 YAML 文件中配置。

### Android 模拟器

模拟器用于描述计算机上的 Android 设备软件模拟器。通常，iOS 模拟器被称为 [iOS 模拟器](#ios-模拟器)。

### 入口文件

入口文件通常指用于加载应用的初始 JavaScript 文件。在使用 [Expo CLI](#expo-cli) 的应用中，默认入口文件是 **./node_modules/expo/AppEntry.js**，它只是从项目根目录导入 **App.js** 文件，并将其注册为原生应用中的初始组件。

### Experience

应用的同义词，通常暗示更偏一次性、范围更小，有时带有艺术性和趣味性。

### Expo Atlas

[Expo Atlas](/guides/analyzing-bundles) 是用于可视化 JavaScript bundle 的工具。它用于检查 bundle 大小，并识别哪些库构成了生产 bundle。

### Expo 自动链接

原始的[自动链接](#自动链接)系统是为使用 `expo-modules-core` 的项目设计的。此系统根据库根目录中是否存在 **expo-module.config.json** 来链接模块。

### Expo CLI

用于使用 Expo 的命令行工具。更多信息见 [Expo CLI](/more/expo-cli)。

### Expo 客户端

[Expo Go](#expo-go) 应用的旧名称。

### Expo Doctor

[Expo Doctor](/develop/tools#expo-doctor) 是用于诊断 Expo 项目中问题的命令行工具。要使用它，从项目目录运行 `npx expo doctor`。

### Expo export

指来自 [Expo CLI](#expo-cli) 的命令 `npx expo export`。此命令用于打包应用的 JavaScript 和资源，然后把它们导出到静态目录，该目录可以上传到 [EAS Update](#eas-update) 等托管服务，并嵌入[原生运行时](#原生运行时)以供离线使用。

### Expo Fingerprint

[`@expo/fingerprint`](/versions/latest/sdk/fingerprint) 库会对决定项目原生构建的文件和配置（应用依赖、自定义原生代码、原生项目文件和配置）进行哈希。该哈希表示原生层状态，因此工具可以判断 TypeScript/JavaScript bundle 是否与给定构建兼容，而无需重新构建。主要用于 EAS Update 的 fingerprint 运行时版本策略，以及用于 CI/CD 自动化的 EAS Workflows。

### Expo Go

在 Android 和 iOS 上作为学习和实验 React Native 的沙盒的应用。

由于它的限制（例如无法包含自定义原生代码），不建议用它来构建和分发生产应用。请改用[开发构建](#开发构建)。

### Expo install

指来自 [Expo CLI](#expo-cli) 的命令 `npx expo install`。此命令用于安装包含与项目中当前安装的 `expo` 版本兼容的[原生模块](#原生模块)的 npm 包。并非所有包都受支持。此命令包装全局安装的[包管理器](#包管理器)。

### Expo MCP 服务器

[Expo MCP（模型上下文协议）服务器](/mcp) 是由 Expo 托管的远程服务器，可与 Claude Code、Cursor、VS Code 等 AI 辅助工具集成。它使它们能够直接与你的 Expo 项目交互。

### Expo 模块配置

位于[原生模块](#原生模块)根目录中、名为 **expo-module.config.json** 的文件。更多信息见[模块配置](/modules/module-config)。

### Expo Modules API

[Expo Modules API](/modules/module-api) 是用于用 Kotlin 和 Swift 编写原生模块、为应用添加新能力的跨平台 API。此 API 由包含在 `expo` 包中的 `expo-modules-core` 库提供。

### Expo Orbit

[Expo Orbit](/build/orbit) 是适用于 macOS、Windows 和 Linux 的应用，可以在设备或模拟器上更快地安装并启动来自 EAS、本地文件或 Snack 项目的构建或更新。

### Expo Router

[Expo Router](/router/introduction) 是用于 React Native 和 Web 应用的基于文件的路由器。它允许你管理应用中屏幕之间的导航，让用户使用同一套组件在多个平台（Android、iOS 和 Web）上于应用 UI 的不同部分之间无缝移动。

### Expo SDK

一组包含[原生模块](#原生模块)的 [npm](#npm) 包，提供对相机、推送通知、联系人、文件系统等设备/系统功能的访问。

- 每个包尽可能支持 Android、iOS 和 Web。
- 接口完全用 [TypeScript](#typescript) 编写。
- Expo SDK 中的所有包都可以相互配合，并且可以安全地一起编译。
- SDK 中的任何包都可以在任何 [React Native](#react-native) 应用中使用，只需最少的共享设置。见[如何安装 Expo 模块](/bare/installing-expo-modules)。
- 所有包都是[开源的](https://github.com/expo/expo/tree/main/packages)，可以自由自定义。

### Expo start

指来自 [Expo CLI](#expo-cli) 的命令 `npx expo start`。此命令用于启动本地[开发服务器](#开发服务器)，[客户端](#expo-客户端)连接到它以与 [Metro 打包器](#metro-打包器)交互。

### Fabric

用于创建和管理原生视图的 React Native 渲染系统。更多信息见 [Fabric 渲染器](https://reactnative.dev/architecture/fabric-renderer)。

### FYI

有时称为 **Expo FYI**，是位于 [expo.fyi](https://expo.fyi/) 的、针对复杂问题的定制解决方案集合。FYI 链接贯穿 Expo 的开发者工具，以帮助为用户提供更好的开发者体验。

### Gradle

Gradle 是用于多语言软件开发的构建自动化工具。它用于构建 Android 应用。它控制从编译和打包到测试、部署和发布的开发过程。

### Hermes 引擎

由 [Meta](#meta) 专门为与 [React Native](#react-native) 一起使用而开发的 [JavaScript 引擎](#javascript-引擎)。Hermes 具有提前静态优化和紧凑字节码，以改进以移动设备为重点的性能，并且是默认的 JS 引擎。

### iOS

用于 iPhone、iPad 和 Apple TV 的操作系统。[Expo Go](#expo-go) 目前在 iPhone 和 iPad 的 iOS 上运行。

### JavaScript 引擎

可以在设备上求值 JavaScript 的原生包。在 React Native 中，我们主要使用 [Meta](#meta) 的 [Hermes](#hermes-引擎)。其他选项包括 Apple 的 [JavaScriptCore](#javascriptcore-引擎) 和 Google 的 V8。

### JavaScriptCore 引擎

由 Apple 开发并内置于 [iOS](#ios) 的 [JavaScript 引擎](#javascript-引擎)。用于 [Android](#android) 的 React Native 也可以使用 JavaScriptCore 的一个版本以保持一致。使用 JavaScriptCore 调试不如实现了 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) 的 V8 或 [Hermes](#hermes-引擎) 完善。

### 链接

链接可以指[类似在 Web 上链接到网站那样深层链接到应用](/linking/overview)，也可以指[自动链接](#自动链接)。

### 本地 Expo CLI

包 `@expo/cli` 随 `expo` 包一起安装。这有时被称为“带版本的 Expo CLI”，因为它安装在用户项目内部，而不是现在已弃用的、全局安装的 `expo-cli`。

### 清单

Expo 应用清单类似于 [Web 应用清单](https://developer.mozilla.org/en-US/docs/Web/Manifest)。它提供 Expo Go 需要知道如何运行应用的信息以及其他相关数据。

### Meta

Meta 前身为 Facebook，是开发 [React Native](#react-native)、[Metro 打包器](#metro-打包器)、[Hermes 引擎](#hermes-引擎)、[Yoga](#yoga) 等的组织。Expo 团队与 Meta 合作，以提供尽可能好的开发者体验。

### Metro 打包器

用于把 JavaScript 文件和资源转换为可在[原生运行时](#原生运行时)上运行的格式的打包器。此打包器由 [Meta](#meta) 维护，并用于 React Native（包括 Web）应用。更多信息见 [Metro 文档](https://metrobundler.dev/)。

### Metro 配置

用于配置 [Metro 打包器](#metro-打包器) 的 **metro.config.js** 文件。使用 [Expo CLI](#expo-cli) 时应扩展 `@expo/metro-config` 包。更多信息见[自定义 Metro](/guides/customizing-metro)。

### Monorepo

包含多个子项目、并通过包管理器全部链接在一起的项目。Monorepo 是维护跨平台应用代码库的好方法。

### 原生目录

React Native 生态有数千个库。如果没有专门构建的工具，很难知道这些库是什么、搜索它们、判断质量、试用它们，并过滤掉不适合你项目的库（有些不适用于 Expo，有些不适用于 Android 或 iOS）。[React Native Directory](https://reactnative.directory/) 是一个旨在解决此问题的网站，我们建议你用它来查找项目中要使用的包。

### 原生模块

用原生代码编写的模块，通过 JS 全局对象向 JavaScript 引擎公开原生平台功能。此功能通常通过 `import { NativeModules } from 'react-native';` 访问。

### 原生运行时

包含 [JavaScript 引擎](#javascript-引擎)并能运行 React 应用的原生应用。这包括 [Expo Go](#expo-go)、[开发构建](#开发构建)、[独立应用](#独立应用)，甚至 Chrome 等 Web 浏览器。

### npm

[npm](https://www.npmjs.com/) 是 [JavaScript 包管理器](#包管理器)，也是存储这些包的注册表。

### 包管理器

自动化从项目中安装、升级、配置和移除库（也称为依赖）的过程。见 [Bun](#bun)、[npm](#npm)、[pnpm](#pnpm) 和 [Yarn](#yarn)。

### 包管理器工作区

为 Expo 用户推荐的 [monorepo](#monorepo) 方案。有关如何使用受支持的包管理器配置工作区的更多信息，见[使用 monorepo](/guides/monorepos)指南。

### 平台扩展名

平台扩展名是 [Metro 打包器](#metro-打包器) 的一项功能，使用户可以在给定特定文件名的情况下按平台替换文件。例如，如果项目有 **.index.js** 文件和 **.index.ios.js** 文件，则在为 iOS 打包时会使用 **index.ios.js**，在为所有其他平台打包时会使用 **index.js** 文件。

默认情况下，平台扩展名在 `@expo/metro-config` 中按以下公式解析：

- Android：**\*.android.js**、**\*.native.js**、**\*.js**
- iOS：**\*.ios.js**、**\*.native.js**、**\*.js**
- Web：**\*.web.js**、**\*.js**

### pnpm

[pnpm](https://pnpm.io/) 是注重磁盘空间效率的 [JavaScript 包管理器](#包管理器)。

### 预构建

根据[应用配置](#应用配置)为 React Native 项目生成临时原生 **android** 和 **ios** 目录的过程。此过程通过在项目目录中从 [Expo CLI](#expo-cli) 运行命令 `npx expo prebuild` 来执行。

更多信息见[预构建模板](#预构建模板)和[自动链接](#自动链接)。

### 预构建模板

React Native 项目模板用作[预构建](#预构建)的第一步。此模板与 [Expo SDK](#expo-sdk) 一起进行版本控制，并根据项目中安装的 `expo` 版本选择模板。克隆模板后，`npx expo prebuild` 会评估[应用配置](#应用配置)并运行[配置修改器](#配置修改器)，这些修改器会修改模板中的各种文件。

虽然可以使用 `npx expo prebuild --template /path/to/template` 标志更改模板，但默认预构建模板包含 `npx expo prebuild` 命令所假设的重要初始默认值。

默认模板目前位于 [`expo-template-bare-minimum`](https://github.com/expo/expo/tree/main/templates/expo-template-bare-minimum)。

### 发布

我们把“发布”一词用作“部署”的同义词。当你发布应用时，它会在 Expo Go 的持久 URL 上可用；对于[独立应用](#独立应用)，它会更新该应用。

### React Native

[React Native](https://reactnative.dev/) 让你仅使用 JavaScript 构建移动应用。它使用与 React 相同的设计，让你用声明式组件组合丰富的移动 UI。

### React Native Web

`react-dom` 之上的高性能抽象，使 [React Native](#react-native) 的核心原语能够在浏览器中运行。用于 Web 的 React Native（RNW）在 X 开发，目前用于他们的[主网站](https://x.com)。[Expo SDK](#expo-sdk) 和 [Expo CLI](#expo-cli) 对 RNW 提供一流支持。

### React Navigation

React Native 应用首选的导航库，由 Expo 团队开发和赞助。

### 远程调试

远程调试是调试 React Native 应用的已弃用方式。今天更好的替代方案是使用 [Hermes](#hermes-引擎)，因为你可以把 React Native DevTools 连接到它。

也称为异步 Chrome 调试，它是调试 React Native 应用的实验性系统。该系统通过在 Chrome 标签页的 Web Worker 中执行应用 JavaScript，然后通过 websocket 向原生设备发送原生命令来工作。

### iOS 模拟器

可以在 macOS 上（或在 [Snack](#snack) 中）运行的 iOS 设备模拟器，让你无需手头有物理设备即可开发应用。

### Slug

[应用配置](#appjson)中的 `slug` 是项目的 URL 友好名称。它在你的 Expo 账户中是唯一的。

### Snack

[Snack](https://snack.expo.dev/) 是浏览器内的开发环境，你可以在其中构建 Expo [体验](#experience)，而无需在手机或计算机上安装任何工具。

### Software Mansion

位于波兰克拉科夫的开发机构。`react-native-gesture-handler`、`react-native-screens` 和 `react-native-reanimated` 的维护者。Expo 的平台团队由多名来自 Software Mansion 的承包商组成。Software Mansion 的所有核心 React Native 库都在 [Expo Go](#expo-go) 中受支持。

### 独立应用

与“生产构建”同义。可以提交到 Google Play Store 或 Apple App Store 的应用二进制文件。更多信息见[为应用商店构建项目](/deploy/build-project)或[在本地或你自己的基础设施上运行构建](/build-reference/local-builds)。

### 商店配置

用于配置 [EAS Metadata](#eas-metadata) 的 **store.config.json** 文件。此文件可以使用 `eas metadata:pull` 从现有 App Store 条目生成。

### Sweet API

用于编写 React Native 模块的 Swift 和 Kotlin API。此 API 由随 `expo` 包一起提供的 `expo-modules-core` 库提供。更多信息见[模块 API](/modules/module-api)。

### TypeScript

TypeScript 是一种强类型编程语言，构建在 JavaScript 之上，在任何规模下都为你提供更好的工具。Expo SDK 用 TypeScript 编写，我们强烈建议使用它。更多信息见我们的 [TypeScript 指南](/guides/typescript)。

### 更新

传统上，Android 和 iOS 应用通过向 App Store 和 Play Store 提交更新后的二进制文件来更新。更新允许你向应用推送更新，而无需向商店提交新版本的开销。更多信息见[发布](/eas-update/introduction)文档。

### VS Code Expo Tools

用于改进处理应用配置文件时开发者体验的 VS Code 扩展。此扩展为[应用配置](#应用配置)、[商店配置](#商店配置)、[Expo 模块配置](#expo-模块配置)和 [EAS 配置](#eas-配置)提供自动完成和智能感知。更多信息见 [VS Code Expo Tools 扩展](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)。

### Watchman

[Metro](#metro-打包器)可以选择使用的文件监视守护进程，用于爬取和查询项目文件。Watchman 包含原生代码，全局安装时可能会导致问题。Watchman 由 [Meta](#meta) 维护。

### webpack

[Expo CLI](#expo-cli) 用于开发 [`react-native-web`](#react-native-web) 应用的已弃用打包器。

### Yarn

[Yarn](https://yarnpkg.com/) 是在 Meta 创建的 [JavaScript 包管理器](#包管理器)。它有两个主线版本：[Yarn v1（Classic）](https://classic.yarnpkg.com/lang/en/) 和 [Yarn Berry](https://github.com/yarnpkg/berry)。

### Yoga

React Native 内部使用的原生跨平台库，为原生视图提供 [CSS FlexBox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox) 支持。React Native 样式会传递给 Yoga，以在屏幕上布局和设置元素样式。更多信息见 [Yoga](https://github.com/facebook/yoga) 文档。
