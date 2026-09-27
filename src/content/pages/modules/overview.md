---
title: Expo Modules API：概述
description: Expo 为开发原生模块而提供的 API 与工具概述。
---

# Expo Modules API：概述

## 什么是 Expo Modules API

Expo Modules API 让你可以用 Swift 和 Kotlin 编写代码，通过原生模块和视图为应用添加新能力。这套 API 旨在利用现代语言特性，在两个平台上尽可能保持一致，要求最少的样板代码，并提供与 React Native Turbo Modules API 相当的性能特征。所有 Expo Modules 都支持新架构，并且自动向后兼容使用旧架构的现有 React Native 应用。

我们相信，使用 Expo Modules API 可以让构建和维护几乎所有类型的 React Native 模块变得尽可能容易。对于为应用构建原生模块的绝大多数开发者来说，Expo Modules API 是最佳选择。

### 面向 AI agent 的 Expo Skills

如果你使用 AI agent，请安装 [Expo Skills](/skills)，让它学习模块定义 DSL 和原生视图模式。相关 skill 为 `expo-module`。

### 常见问题

<details>
<summary>构建 Expo / React Native 应用是否需要了解 Expo Modules API？</summary>

大多数时候，Expo 和 React Native 开发者不需要编写任何原生代码。从相机、视频、地图到触感反馈等等，已经有覆盖广泛用例的库可用。

但有时，没有任何东西能完全满足你的需求。也许你想集成公司要求使用、但还没有 React Native 库的分析服务，因此需要围绕他们的 SDK 构建一个模块。或者你想访问应用所需、但并不常用、因而没有人维护相应库的系统功能。

</details>

<details>
<summary>什么时候应该使用 Turbo Modules，什么时候应该使用 Expo Modules API？</summary>

概括并转述 [React Native 团队的建议](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0759-react-native-frameworks.md#what-do-we-recommend-to-react-native-library-developers)：

- 如果你打算在原生模块中使用 C++，请使用 Turbo Modules，因为它能更方便地访问更底层的机制。
- 如果你追求更好的开发体验，并且愿意在模块中依赖 `expo` 包，那么请使用 Expo Modules API。

</details>

<details>
<summary>在哪里可以找到开源 Expo Modules 来学习？</summary>

如果你想了解我们如何实现自己的库，[Expo SDK](https://github.com/expo/expo/tree/main/packages) 是一个很好的去处。另一个很好的资源是开源应用，例如 [Bluesky](https://github.com/bluesky-social/social-app/tree/main/modules)。

以下是我们喜欢的一些社区库：

- [`react-native-widget-extension`](https://github.com/bndkt/react-native-widget-extension)
- [`burnt`](https://github.com/nandorojo/burnt)
- [`expo-video-metadata`](https://github.com/hirbod/expo-video-metadata)
- [`swiftui-react-native`](https://github.com/andrew-levy/swiftui-react-native)
- [`react-native-ios-context-menu`](https://github.com/dominicstop/react-native-ios-context-menu)
- [`react-native-mlkit`](https://github.com/infinitered/react-native-mlkit)
- [`react-native-passkeys`](https://github.com/peterferguson/react-native-passkeys)
- [`expo-drag-drop-content-view`](https://github.com/AlirezaHadjar/expo-drag-drop-content-view)

</details>

<details>
<summary>使用 Expo Modules API 对我的应用体积有什么影响？</summary>

把 Expo Modules API 添加到应用中对应用体积的影响可以忽略不计，可能会增加几百 KB。[在这篇博客文章中了解更多](https://blog.expo.dev/embracing-expo-modules-in-your-react-native-projects-cd8ed4cbec3)。

</details>

<details>
<summary>使用 Expo Modules API 对我的应用性能有什么影响？</summary>

Expo Modules API 的性能特征与 React Native 的 Turbo Modules API 相似。两套 API 都利用 React Native 的 JavaScript Interface (JSI)，而不是使用 JSON 消息队列（“bridge”）的旧方法（[进一步了解 JSI](https://reactnative.dev/docs/the-new-architecture/landing-page#fast-javascriptnative-interfacing)）。

Expo Modules 和 Turbo Modules 的设计目标都不是在技术上尽可能快，而是在重要的地方足够快。例如，Expo Modules API 可以利用代码生成以及新的原生 Swift / C++ 互操作来降低单次方法调用的开销。但这会带来一些开发体验上的挑战和额外开销，而且我们尚未遇到任何用例，表明这种优化能带来有意义的真实世界性能提升。实际上，执行原生方法体所花费的时间，往往比方法调用开销高出几个数量级。Expo Modules 和 Turbo Modules 都可以轻松地每秒执行数十万次原生方法调用，远超你在任何应用中可能遇到的量，方法调用开销也不太可能成为瓶颈。

如果你在 Expo Modules API 上遇到任何性能瓶颈，请[提交 issue](https://github.com/expo/expo/issues/new/choose)，我们很乐意与你讨论。

</details>

<details>
<summary>Expo Modules API 是否支持 Android、iOS 和 Web 以外的平台？</summary>

Expo Modules API 对 macOS 和 tvOS 提供实验性支持。更多信息请参阅[额外的平台支持](/modules/additional-platform-support)教程。

</details>

<details>
<summary>如何使用 Expo Modules API 让第三方 SDK 可用于我的 Expo 应用？</summary>

请在[集成现有库](/modules/existing-library)教程中了解更多。

</details>

## 下一步

- [教程：创建原生模块](/modules/native-module-tutorial) — 使用 Expo Modules API 创建用于持久化设置的原生模块的教程。
- [教程：创建原生视图](/modules/native-view-tutorial) — 使用 Expo Modules API 创建渲染 WebView 的原生视图的教程。
- [Expo Modules API：开始使用](/modules/module-api) — 了解如何开始使用 Expo Modules API。
- [Expo Modules API：参考](/modules/module-api) — 使用 Kotlin 和 Swift 创建原生模块的参考。
- [Expo Modules API：设计考量](/modules/design) — Expo Modules API 背后的设计考量概述。
- [expo-module.config.json](/modules/module-config) — 可用配置选项参考。
