---
title: 在现有 React Native 应用中使用 Expo 的概述
description: 了解如何在现有 React Native 应用中使用 Expo 工具和服务。
---

# 在现有 React Native 应用中使用 Expo 的概述

如果你有一个没有使用任何 Expo 工具的 React Native 应用，你可能会想知道 Expo 能为你提供什么、为什么要使用 Expo 工具和服务，以及如何开始。

**Expo 提供的所有工具和服务都能在任何 React Native 应用中很好地工作。**

你可以用 [EAS](/eas) 快速搭建专业的 CI/CD 工作流，用于构建、审查、部署和更新应用。[Expo CLI](/more/expo-cli) 提供使用 React Native 时最好的命令行体验。[Expo SDK](/versions/latest) 是 React Native 的扩展标准库。它为开发者提供高质量、维护良好的原生库，并使用一致的 API 约定，使它们更容易学习和使用。

如果你曾经为 React Native 编写过原生模块，会惊讶于用 [Expo Modules API](/modules/overview) 提供的符合语言习惯的 Swift 和 Kotlin DSL 来构建和维护模块有多么容易。

还有更多值得探索的内容，下面的链接会帮助你了解可用的选项。

## 渐进采用步骤

下面是渐进采用的四个建议阶段。这些阶段通常从改善开发体验的快速改动，进展到更重要的工作流和代码库优化。

只有第一阶段（前置条件）是其他阶段所必需的。按照它的说明操作之后，你可以跳到与你采用 Expo 的目标最相关的工具和服务。

### 前置条件

这些第一步是之后采用 Expo 工具和服务所必需的：

- **[安装 Expo modules](/bare/installing-expo-modules)**：要解锁 Expo 能力，需要在现有 React Native 项目中安装 `expo` 包。本指南同时提供自动和手动安装步骤。
- **[使用 Expo CLI](/bare/using-expo-cli)**：迁移到 Expo CLI 是对 `@react-native-community/cli` 的直接替换。它与所有 Expo 工具和服务完全兼容。本指南说明其好处，并提供安装 `expo` 包后启动开发服务器的编译命令。

### 速效改进

下面这些有助于改善开发体验，并且需要配置：

- **[使用 Expo SDK](/versions)**：使用 Expo SDK 提供的众多库之一。这是一套提供原生 API 访问的广泛库集合。
- **[安装 expo-dev-client](/bare/install-dev-builds-in-bare)**：`expo-dev-client` 让调试应用变体能够使用类似 Expo Go 的应用启动界面。了解如何在现有 React Native 项目中安装并配置它。
- **[编写原生模块](/modules/overview)**：使用 Expo Modules API，用 Swift 和 Kotlin 编写原生模块。
- **[原生项目升级助手](/bare/upgrade)**：查看把原生项目升级到下一个 Expo SDK 和 React Native 版本时，需要逐个文件做出的全部改动差异。

### 新工作流

应用安装了 `expo` 包之后，你可以用一条命令把应用提交到应用商店，或配置 `expo-updates` 库来管理应用代码的远程更新：

- **[应用分发](/distribution/introduction)**：用一条命令构建应用并提交到应用商店。
- **[安装 expo-updates](/bare/installing-updates)**：了解如何安装并配置 `expo-updates`，以管理远程更新并启用 PR 预览。

### 新的思路

下面这些有助于项目的长期可维护性、原生代码维护和更轻松的升级：

- **[采用预构建](/guides/adopting-prebuild)**：了解如何通过按需从配置生成原生项目，来简化对它们的维护。
- **[Expo Router](/router/introduction)**：Expo Router 是基于文件的路由库，具有有组织的导航层级、自动深层链接支持等优势。

## 常见问题

<details>
<summary>在现有 React Native 项目中采用 Expo 需要多久？</summary>

采用 Expo 不必一步完成。你可以从**速效改进**开始，然后再进入更复杂的部分。你也可以根据对项目最有帮助的内容，挑选想采用的功能。

</details>

<details>
<summary>在 React Native 应用中使用 Expo 能得到什么？</summary>

在现有 React Native 应用中采用 Expo 工具，可以帮助你用 [Expo SDK](/versions/latest) 更快地开发，用 [CNG](/workflow/continuous-native-generation) 简化原生代码维护和升级，用 [EAS Update](/eas-update/introduction) 更快地部署，以及更多。

</details>

<details>
<summary>谁在使用 Expo？</summary>

Expo 被全球顶尖公司使用，服务数百万终端用户。更多信息见我们的 [Expo 展示](https://expo.dev/customers)。

</details>

<details>
<summary>采用 Expo 会对应用体积产生什么影响？</summary>

`expo` 包体积很小，因为它只包含每个应用都需要的最小模块集合、自动链接基础设施，以及其他内置的 Expo SDK 库。关于如何确定应用实际体积的更多信息，见[理解应用体积](/distribution/app-size)。

</details>

<details>
<summary>为什么 React Native 建议使用 Expo？</summary>

大多数 React Native 开发者在构建应用时都会解决常见问题，例如实现导航、访问原生 API、升级到新版本等。这需要使用一套特定的工具和库来构建和维护应用，意味着你在创建自己的框架。

Expo 通过提供一组原语来解决这些问题，并帮助你（开发者）专注于构建应用。它还提供在开发中更快迭代的工具。更多信息见 [为什么 React Native 建议使用框架](https://reactnative.dev/blog/2024/06/25/use-a-framework-to-build-react-native-apps)。

</details>

<details>
<summary>使用 Expo 必须丢掉原生项目吗？</summary>

默认情况下，用 `create-expo-app` 创建的 Expo 项目使用[持续原生生成（CNG）](/workflow/continuous-native-generation)，不包含 **android** 和 **ios** 原生目录。如果你在现有 React Native 应用中渐进采用 Expo，不必移除这些目录。你可以用 `npx expo run:[android|ios]` 作为 `@react-native-community/cli` 所提供命令的替代，在本地编译应用并保留原生项目的配置。

</details>

<details>
<summary>我使用 CodePush。还能继续把它和 Expo 一起使用吗？</summary>

CodePush 将于 2025 年 3 月停用，并且与 React Native 的新架构不兼容，因此从长远来看，我们建议改用 EAS Update 来管理应用代码的远程更新。不过，你今天就可以在启用了 CodePush 的应用中开始使用 Expo 工具，包括 Expo SDK、Expo CLI、EAS Build 等。

</details>

<details>
<summary>必须用 EAS 构建吗？</summary>

[Expo Application Services (EAS)](/eas) 是面向 Expo 和 React Native 应用的深度集成云服务，提供构建、测试和部署应用的工具。

虽然我们建议使用 EAS，以便与队友顺利协作并快速分发，但你也可以在本地、在自己的 CI 上，或以你喜欢的任何其他方式编译应用。

</details>

<details>
<summary>可以在代码中安装第三方原生库吗？</summary>

可以。你可以安装并使用需要原生项目（**android** 和 **ios**）配置、或提供[配置插件](/config-plugins/introduction)的第三方库，并配合[开发构建](/workflow/overview#开发构建)。更多信息见[使用第三方库](/workflow/using-libraries#第三方库)。

</details>

<details>
<summary>我使用 React Navigation。必须使用 Expo Router 吗？</summary>

你可以继续在项目中使用任何导航库。不过，我们建议使用 Expo Router，以获得[这里描述的](/router/introduction)全部好处。

</details>
