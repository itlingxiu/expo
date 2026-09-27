---
title: 添加自定义原生代码
description: 了解如何向 Expo 项目添加自定义原生代码。
---

# 添加自定义原生代码

你可以通过以下一种或两种方式添加自定义原生代码：

- [使用包含原生代码的库](#使用包含原生代码的库)
- [编写原生代码](#编写原生代码)

## 使用包含原生代码的库

Expo 和 React Native 开发者通常把绝大部分时间花在编写 JavaScript 代码，以及使用通过 [`expo-camera`](/versions/latest/sdk/camera)、[`react-native-safe-area-context`](/versions/latest/sdk/safe-area-context) 和 `react-native` 本身等库提供的原生 API 和组件上。这些库让开发者可以从 JavaScript 代码访问和使用设备功能。它们也可能提供对以原生代码实现的第三方服务 SDK 的访问（例如 [`@sentry/react-native`](/guides/using-sentry)，它为 Android 和 iOS 提供 Sentry 原生 SDK 的绑定）。

<details>
<summary>正在使用 Expo Go？</summary>

如果你正在使用 [Expo Go](https://expo.dev/go)，[你只能访问 Expo SDK 中包含的原生库](/versions/latest/sdk/third-party-overview)，或不包含任何自定义原生代码的库（[进一步了解第三方库](/workflow/using-libraries#第三方库)）。[创建开发构建](/develop/development-builds/introduction)允许你像在任何其他原生应用中一样更改原生代码或配置。

</details>

### 在开发构建中安装带有自定义原生代码的库

使用[开发构建](/develop/development-builds/introduction)时，使用带有自定义原生代码的库很直接：

- 用 npm 安装库，例如：`npx expo install react-native-localize`
- 如果库包含[配置插件](/config-plugins/introduction)，你可以在应用配置中指定偏好的配置。
- 创建新的开发构建（[本地](/guides/local-app-development)或使用 [EAS](/develop/development-builds/introduction)）。

现在你可以在应用代码中使用该库。

<details>
<summary>关键概念与开发工作流</summary>

[开发概览](/workflow/overview)提供了用 Expo 开发应用的关键概念，以及核心开发循环的流程。

</details>

## 编写原生代码

使用 [Expo Modules API](/modules/overview) 编写 Swift 和 Kotlin 代码，并用原生模块和视图为应用添加新能力。虽然还有其他工具可以用来构建原生模块，但我们相信使用 Expo Modules API 能让构建和维护几乎所有类型的 React Native 模块尽可能简单。我们认为对于大多数为自己的应用构建原生模块的开发者，Expo Modules API 是最佳选择。

<details>
<summary>我应在何时考虑编写原生代码？</summary>

经常会遇到库并不能完全满足需求的情况。例如，库可能不提供对某个特定平台功能的访问，或者第三方服务可能不提供 React Native 绑定。

</details>

<details>
<summary>你是否考虑主要用 C++ 编写模块？</summary>

如果你打算主要用 C++ 编写原生模块，可以探索 React Native 提供的 [Turbo Modules API](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md)。

</details>

### 使用 Expo Modules API

- [Expo Modules API：概览](/modules/overview)：Expo 为开发原生模块提供的 API 和工具概览。
- [教程：创建原生模块](/modules/native-module-tutorial)：关于用 Expo Modules API 创建持久化设置的原生模块的教程。
- [教程：创建原生视图](/modules/native-view-tutorial)：关于用 Expo Modules API 创建渲染原生 WebView 组件的原生视图的教程。

### 创建本地模块

如果你打算只在单个应用中使用原生模块（以后随时可以改变主意），我们建议[使用“本地” Expo 模块](/modules/get-started#创建本地-expo-模块)来编写自定义原生代码。本地 Expo 模块的功能类似于库开发者和 Expo SDK 内部使用的 [Expo Modules](/modules/overview)（如 `expo-camera`），但它们不会发布到 npm。你直接在项目内部创建它们。

创建本地模块会在项目的 `modules` 目录中搭建 Swift 和 Kotlin 模块，并且这些模块会自动链接到你的应用。

:::tabs
:::tab npm
```sh
$ npx create-expo-module@latest --local
$ npx expo run
```
:::
:::tab yarn
```sh
$ yarn create expo-module --local
$ yarn expo run
```
:::
:::tab pnpm
```sh
$ pnpm create expo-module --local
$ pnpm expo run
```
:::
:::tab bun
```sh
$ bun create expo-module --local
$ bun expo run
```
:::
:::

### 与多个应用共享模块

如果你打算在多个应用中使用原生模块，则使用 `npx create-expo-module@latest`，去掉 `--local` 标志，并[创建独立模块](/modules/use-standalone-expo-module-in-your-project)。你可以把包发布到 npm，或者把它放在 [Monorepo](/guides/monorepos)（如果你有）的 packages 目录中，以[与本地模块类似的方式](/modules/use-standalone-expo-module-in-your-project)使用它。

## 使用持续原生生成（CNG）时的注意事项

以下建议在使用 [CNG](/workflow/continuous-native-generation) 时最为重要，但即使你不使用它，它们也是好的指导原则。

<details>
<summary>在本地构建，以获得最好的调试体验和快速反馈</summary>

默认情况下，用 `create-expo-app` 创建的 Expo 项目使用 CNG，在你于项目中运行 `npx expo prebuild` 命令之前不包含 **android** 或 **ios** 原生目录。使用 CNG 时，开发者通常不会把 **android** 和 **ios** 目录提交到源代码管理，也不会在本地生成它们，因为 EAS Build 会在构建过程中自动完成。即便如此，编写自定义原生代码时，用 `npx expo run` 在本地生成原生目录并构建是常见做法，以便获得快速反馈循环，并完整使用 Android Studio / Xcode 中的原生调试工具。

</details>

<details>
<summary>使用配置插件进行原生项目配置</summary>

如果你的原生代码要求你更改项目配置，例如修改项目的 **AndroidManifest.xml** 或 **Info.plist**，[你应通过配置插件应用这些更改](/modules/config-plugin-and-native-module-tutorial)，而不是直接修改 **android** 和 **ios** 目录中的文件。请记住，使用 CNG 时，直接对原生项目目录所做的更改会在下次运行预构建时丢失。

</details>

<details>
<summary>使用事件订阅者接入应用生命周期事件</summary>

如果你需要接入 Android 生命周期事件或 `AppDelegate` 方法，使用 Expo Modules 为 [Android](/modules/android-lifecycle-listeners) 和 [iOS](/modules/appdelegate-subscribers) 提供的 API 来完成，而不是直接修改原生项目目录中的源文件，或用配置插件添加代码（后者与其他插件组合得不好）。

</details>
