---
title: 常见问题
description: 关于 Expo 及相关服务的常见问题与限制列表。
---

# 常见问题

本页列出关于 Expo 及相关服务的一些常见问题与解答。如果这里没有回答你的问题，请到[论坛](https://chat.expo.dev/)查看更多常见问题。

## Expo 用来做什么？

Expo 是一个[开源框架](https://github.com/expo/expo)，用于构建在 Android、iOS 和 Web 上原生运行的应用。Expo 把移动端与 Web 的优势结合起来，并为构建和扩展应用提供许多重要能力，例如实时更新、即时分享应用和 Web 支持。`expo` 这个 npm 包为 React Native 应用带来一整套强大功能。`expo` 包几乎可以安装到任何 React Native 项目中。更多信息见 [Expo 提供什么](/core-concepts)。

## 公司会使用 Expo 吗？

会。Expo 被全球顶尖公司使用，服务数亿终端用户。见我们的[展示](https://expo.dev/customers)。

## 为什么 Expo 有自己的 SDK？

Expo 最初创建时，React Native 尚未公开发布。这意味着当时没有第三方包。为了让 React Native 的开发体验合理，我们创建了[若干库来实现常见功能](/versions/latest)。其中许多库后来被 fork 并修改，以满足各种需求。我们欢迎用户按需混用任何[自定义原生代码](/workflow/customizing)，把应用做得更好。

Expo SDK 经过充分测试，用 TypeScript 编写，有文档，并为 Android、iOS 和 Web 构建。Expo SDK 中的每个模块协同工作，确保版本始终匹配。这带来了良好的升级体验。

Expo SDK 也用 [Expo Modules API](/modules/overview) 编写，以便更容易贡献、维护和理解。

## Expo 和 React Native 有什么区别？

`expo` 包提供一整套功能，让开发和扩展复杂的 React Native 应用更容易。你几乎可以在任何 React Native 应用中安装 `expo`。使用 [Expo Application Services (EAS)](/eas) 或 React Native 并不必须安装 `expo` 包，但强烈建议安装。更多信息见 [Expo 提供什么](/core-concepts)。

## 要使用 Expo，需要从 React Native 切换过来吗？

不需要。`expo` 这个 npm 包和 CLI 可以与任何 React Native 应用一起工作。[Expo Application Services (EAS)](/eas) 也能与所有 React Native 应用一起工作，并对构建、更新、应用商店提交等提供一流支持。

## Expo 要花多少钱？

Expo 平台是[免费且开源的](https://blog.expo.dev/exponent-is-free-as-in-and-as-in-1d6d948a60dc)。这包括构成 [Expo SDK](/versions/latest) 的库，以及用于开发的 [Expo CLI](/more/expo-cli)。Expo Go 应用是最容易上手的方式，在应用商店中也是免费的。

[Expo Application Services (EAS)](/eas) 是 Expo 团队为 React Native 应用提供的可选云服务套件。EAS 让构建应用、提交到商店、保持更新、发送推送通知等变得更容易。如果 [Free 套餐](https://expo.dev/pricing) 的配额对你的应用足够，可以免费使用 EAS。更多信息见[定价页面](https://expo.dev/pricing)。

## 如何向 Expo 项目添加自定义原生代码？

Expo 支持添加自定义原生代码，并定制这些原生代码（Android/Xcode 项目）。要使用任何自定义原生代码，可以创建[开发构建](/develop/development-builds/introduction)和[配置插件](/config-plugins/introduction)。我们建议尽可能使用 [Expo SDK](/versions/latest) 中的模块，以便更容易升级并改善开发体验。

## 可以在用 React Native CLI 创建的应用中使用 Expo 吗？

可以。所有 Expo 工具和服务都能在任何 React Native 应用中很好地工作。例如，你可以使用 [Expo SDK](/versions/latest) 的任何部分、[`expo-dev-client`](/develop/development-builds/introduction#选择构建开发构建的方式) 以及 EAS Build、Submit 和 Update，它们都能很好地工作。进一步了解[在项目中安装 `expo`](/bare/installing-expo-modules)、[采用预构建](/guides/adopting-prebuild) 和[设置 EAS Build](/build/introduction)。

## 如何分享我的 Expo 项目？可以把它提交到应用商店吗？

分享项目最快的方式是用 [EAS Update](/eas-update/introduction) 发布，并在[开发构建](/develop/development-builds/introduction)中启动。这会给你的应用一个 URL；你可以把这个 URL 分享给任何拥有 Android 或 iOS [开发构建](/develop/development-builds/introduction)的人。URL 也可以在 Android 的 Expo Go 中打开。

准备好之后，可以创建生产构建（**.aab** 和 **.ipa**）以提交到应用商店。你可以用 [EAS Build](/build/introduction) 一条命令构建应用，并用 [EAS Submit](/deploy/submit-to-app-stores) 提交到商店。

你也可以使用[内部分发](/build/internal-distribution)，在 Android 上用 APK、在 iOS 上用 ad hoc 或企业描述文件分享应用。

## 可以在 Windows 电脑上开发 iOS 应用吗？

传统上开发 iOS 应用需要 macOS，不过你可以用 [EAS Build](/build/introduction) 在云端构建应用。你也可以用 [EAS Submit](/deploy/submit-to-app-stores) 把应用提交到商店。测试可以在物理 iOS 设备上使用 [Expo Go](https://expo.dev/go) 或[开发构建](/develop/development-builds/introduction)完成。

## Expo SDK 支持哪些 Android 和 iOS 版本？

目前，Expo SDK 支持 Android 7+ 和 iOS 16.4+。更多信息见 [Android 与 iOS 版本支持](/versions/latest#android-与-ios-版本支持)。

## “hello world” Expo 应用的最小体积是多少？

用纯 Expo 创建的最小生产应用不到 3 MB。对于 iOS，Expo 面向较新的最低 iOS 版本，从而启用应用商店优化。

如果应用包含 `expo` 包，它只会一次性给应用商店中应用的最终体积增加 1 MB。`expo` 包的体积成本很小（例如在 Android 上为 150 KiB）。其余体积来自语言运行时（例如 Android 上的 Kotlin）。

## 可以把 Expo 和我的原生库一起使用吗？

你可以通过用 Swift 和 Kotlin 创建[自定义原生模块](/modules/overview)，把原生 Android 和 iOS 库与 Expo 一起使用。许多流行库已经有自定义原生模块。查看我们的 [React Native 目录](https://reactnative.directory)，找到适合你用例的流行库。

## 可以把 Expo 和这个 Web 库一起使用吗？

许多流行的 Web 包（例如 three.js）可以与 Expo 和 React Native 一起工作。更多信息见 [Expo 示例](https://github.com/expo/examples)。

## Expo 和用于 Web 开发的 React 相似吗？

Expo 是一个[开源框架](https://github.com/expo/expo)，用于构建在 Android、iOS 和 Web 上原生运行的应用。React Native 类似于 Web 开发中的 `react-dom`，让你能在特定平台上运行 React，但它有几个关键区别：

- React Native 不支持 HTML 或 CSS。
- React Native 不使用 DOM，而使用原生组件。例如用 `<View />` 而不是 `<div />`。原生组件比 DOM 性能更好，并提供好得多的用户体验。
- 与可以访问浏览器 API 的 React.js 不同，React Native 使用自定义原生 API。例如，不用 `navigator.geolocation`，而用 `expo-location` 访问用户位置。自定义原生 API 与浏览器 API 类似，只是你对它们有完全控制。这意味着你可以在浏览器提供新功能之前就访问它们。

就像 React.js 框架帮助用户轻松创建更大的网站一样，Expo 帮助用户轻松创建更大的应用。Expo 提供一套经过充分测试、可在 Android、iOS 和 Web 上运行的 React Native 模块。Expo 还提供一套用于构建、部署和更新应用的[工具](/eas)。

## 关于解释型代码，商店政策是什么？

React Native 使用 JavaScript 解释器（JSC、V8 或 Hermes）来运行应用代码。最新政策信息请直接参考 [Google Play 政策中心](https://play.google/developer-content-policy/)和 [Apple Developer Program 许可协议](https://developer.apple.com/support/terms/apple-developer-program-license-agreement)。

_以下是相关政策的摘录，截至 2024 年 4 月 25 日。_

### Google Play Store

```text
...an app may not download executable code (such as dex, JAR, .so files) from a
source other than Google Play. This restriction does not apply to code that runs
in a virtual machine or an interpreter where either provides indirect access to
Android APIs (such as JavaScript in a webview or browser).

Apps or third-party code, like SDKs, with interpreted languages (JavaScript,
Python, Lua, etc.) loaded at run time (for example, not packaged with the app)
must not allow potential violations of Google Play policies.
```

来源：[Google Play 政策中心](https://support.google.com/googleplay/android-developer/answer/9888379?hl=en)。

### Apple App Store

```text
...Interpreted code may be downloaded to an Application but only so long as such code:
(a) does not change the primary purpose of the Application by providing features
    or functionality that are inconsistent with the intended and advertised purpose
    of the Application as submitted to the App Store,
(b) does not create a store or storefront for other code or applications, and
(c) does not bypass signing, sandbox, or other security features of the OS.
```

来源：[3.3.1 APIs and Functionality - B. Executable Code](https://developer.apple.com/support/terms/apple-developer-program-license-agreement#b331)。

## 应该使用 Expo CLI 还是 React Native Community CLI？

Expo CLI 提供与 React Native Community CLI（也称为 “React Native CLI”）相同的核心功能，并带有额外功能，例如自动 [TypeScript 设置](/guides/typescript)、[Web 支持](/workflow/web)、[自动安装兼容库](/more/expo-cli#安装依赖)、[改进的原生构建命令](/more/expo-cli#编译)、[隧道](/more/expo-cli#隧道)、[预构建](/more/glossary-of-terms#预构建)，以及[更多 Expo CLI 功能](/more/expo-cli)。

它可以与 React Native Community 同时使用。无论使用哪种 CLI，你都可以在项目中使用 [Expo SDK](/versions/latest) 和 [Expo Application Services](/eas) 的任何部分。更多信息见：

- 了解如何在[现有 React Native 项目](/bare/using-expo-cli)中迁移以使用 Expo CLI。
- 了解[使用框架构建 React Native 应用](https://reactnative.dev/blog/2024/06/25/use-a-framework-to-build-react-native-apps)的好处。
- 在[这篇博客](https://expo.dev/blog/from-rnc-cli-to-expo)中了解迁移到 Expo CLI 的好处，例如更好的应用性能、更快的发布，以及团队更紧密的协作。

:::note
EAS Build 与现有 React Native 项目兼容（原生目录已提交到版本控制）。当这些目录存在时，EAS Build 不会运行预构建步骤，因为那可能覆盖你对原生项目文件所做的任何手动定制。你必须用 Android Studio 或 Xcode 等原生工具自行配置原生目录。
:::

## Expo Go 是开源的吗？

是的。Expo Go 的源码可以在 [expo/expo GitHub 仓库](https://github.com/expo/expo)的 **apps/expo-go** 目录中找到。Expo Go 应用也是用 Expo 和 React Native 构建的。

## 用 Expo Go 能做什么、不能做什么？

[Expo Go](/get-started/set-up-your-environment#如何开发)是供学生和学习者快速试用 Expo 并理解基础的实验场。它允许你使用 Expo SDK 中包含的库，以及不需要自定义原生代码的库。

Expo Go 不能使用需要自定义原生代码的第三方库，你也不能在 Expo Go 中直接编辑原生代码。它有限制，不适合构建生产级项目。

**我们强烈建议任何真实项目都使用[开发构建](/develop/development-builds/introduction)。这就像创建了一个专门为你的应用需求定制的 Expo Go 版本。**

## 弹出（eject）已弃用了吗？

:::danger
**这个概念已弃用。** `expo eject` 命令已在 SDK 46 中移除。Expo 现在使用[持续原生生成（CNG）](/workflow/continuous-native-generation)。要访问或定制原生代码，运行 [`npx expo prebuild`](/workflow/continuous-native-generation#用法) 生成原生目录，然后直接修改它们，或使用[配置插件](/config-plugins/introduction)。
:::

是的，eject 是一个已弃用的术语，不再必要。Expo 最初发布时，应用的原生二进制体积更大，并且不“弹出”就无法支持自定义原生代码。2020 年 12 月随着支持任何 React Native 应用的 [EAS Build](/build/introduction) 发布，这一点发生了变化。“弹出”的概念在 SDK 41（2021 年 4 月）被 [`npx expo prebuild`](/more/glossary-of-terms#预构建) 命令取代，它根据项目中的库和应用配置（**app.json**）持续生成原生项目。`expo eject` 命令在 SDK 46（2022 年 8 月）被完全弃用。

与以前的弹出工作流不同，作者可以通过创建[配置插件](/config-plugins/introduction)来配置他们的库，使其与 Expo 预构建一起工作。这意味着你可以把任何库与 Expo 预构建一起使用。你也可以通过创建[开发构建](/develop/development-builds/introduction)，把任何自定义原生代码与 Expo 预构建一起使用。更多内容见 [Expo 预构建文档](/workflow/continuous-native-generation)。
