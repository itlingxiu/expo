---
title: 用 Expo 开发应用
description: Expo 应用开发过程概览，帮助建立核心开发循环的心智模型。
---

# 用 Expo 开发应用

无论你是 Expo 和 React Native 的新手，还是已经在这个生态中待了一段时间，本文档都有助于你更好地理解构建 Expo 应用的开发过程。它将帮助你建立核心开发循环的心智模型，以及 Expo 工具如何融入其中。

## 关键概念

以下概念值得理解。我们建议在阅读本指南其余部分以及使用 Expo 工具时，回头参考这些定义。

<details>
<summary>什么是“Expo 应用”？</summary>

这是我们用来描述 _使用 Expo 工具的 React Native 应用_ 的简写。一个“Expo 应用”可以使用 Expo SDK 中的单个包，或 Expo Router，或 Expo CLI，或持续原生生成，它们的组合，或任何其他 Expo 工具。

我们说“Expo 应用”，是因为 _使用 Expo 工具的 React Native 应用_ 频繁打出来和说出来都极不方便。

<details>
<summary>对于“Expo 应用”和“不使用 Expo 工具的 React Native 应用”，开发过程是否不同？</summary>

Expo 提供多种可以独立采用的工具和服务，因此答案取决于你选择使用哪些工具。对于 Expo 提供的大部分内容，Meta 没有提供可比较的 React Native 工具。

</details>

</details>

<details>
<summary>“Expo”和“Expo Application Services (EAS)”有什么区别？</summary>

Expo 是一个开源项目，为开发者提供强大的工具，协助在任何规模上构建和维护 React Native 应用。例如 Expo CLI、Expo Router 和 Expo SDK 包。所有 Expo 开源工具都可以完全免费使用，并采用 MIT 许可证。

Expo Application Services（EAS）是一套托管服务，你可以把它与 Expo 和 React Native 项目一起使用，以便：

- 构建、提交和更新你的应用
- 围绕所有这些过程设置自动化
- 与团队协作

EAS 解决一组需要物理资源的问题，例如用于提供 OTA 更新的应用服务器和 CDN，以及用于运行构建的物理服务器。EAS 有慷慨的[免费方案](https://expo.dev/pricing#get-started)，对许多学生和业余项目都够用。

你不必使用 GitHub 才能使用 git，但在许多情况下它确实有帮助。EAS 和 Expo 也是如此。

<details>
<summary>如果我使用 Expo 开源工具，是否必须使用 EAS？</summary>

不必！你的 Expo 项目只是一个 React Native 应用，也就是一个原生应用。你可以使用 Fastlane 或任何你喜欢的原生构建、更新等工具。

大多数 EAS 服务也允许你在自己的基础设施上运行它们，并且我们提供如何做到这一点的说明。例如，[自托管更新](/versions/latest/sdk/updates)（而不是使用 EAS Update），或[在本地运行构建](/guides/local-app-development)或在[你自己的 CI](/build/building-on-ci)上运行（而不是使用我们的 EAS Build 工作机集群）。

对大多数团队而言，使用 EAS 比把工程时间和资源花在获取、设置和维护其他基础设施上的服务更有意义。此外，EAS 提供服务之间的深度集成，例如用于监控应用版本采用情况的部署页面、把更新分配给特定构建，以及增量推出这些更新，这又与 [EAS Insights](/eas-insights/introduction) 的监控联系起来。

</details>

<details>
<summary>如果我没有使用任何 Expo 开源工具，可以使用 EAS 吗？</summary>

可以！我们认为 EAS 非常适合任何 React Native 项目。

</details>

</details>

<details>
<summary>Expo Go：学生和学习者的演练场</summary>

[Expo Go](https://expo.dev/go) 是开始使用 React Native 的最快方式，尤其是与 [Snack](https://snack.expo.dev/) 结合时。它非常适合学生和学习者理解基础。

不过，**Expo Go 是有限的演练场，不适合构建生产级项目**。**如果你计划把应用部署到商店，那么[开发构建](#开发构建)会提供更灵活、更可靠、更完整的开发环境。** 本指南不深入 Expo Go 的任何细节，本节是唯一提到它的部分。

</details>

<details id="开发构建">
<summary>开发构建</summary>

开发构建是包含 `expo-dev-client` 库的应用调试构建。它帮助你尽可能快地迭代，并提供比 Expo Go 更灵活、更可靠、更完整的开发环境。你可以使用[应用配置](/workflow/configuration)或创建[配置插件](/config-plugins/introduction)来安装任何原生库，并配置或应用对[原生项目](#android-与-ios-原生项目)的更改。你可以[在本地](/guides/local-app-development#使用-expo-dev-client-的本地构建)创建开发构建，或使用 [EAS Build](/develop/development-builds/introduction)在云端创建构建。

</details>

<details id="android-与-ios-原生项目">
<summary>Android 与 iOS 原生项目</summary>

移动平台的 React Native 应用由两个相互连接的部分组成：

<details>
<summary>1. 应用的 JavaScript</summary>

它包含你的 React 组件以及大部分（如果不是全部）应用逻辑。它的角色与 React 网站上的应用 JavaScript 大致相同。

</details>

<details>
<summary>2. 原生项目</summary>

Android 和 Xcode 项目打包 JavaScript 应用，并作为 JavaScript 应用在每个平台上的启动台。它们还处理原生组件的渲染，并提供访问平台特定功能以及与任何已安装原生库集成的手段。应用配置，例如名称（显示在主屏幕上）、图标、所需权限、关联域名、支持的方向等，都在原生项目中配置。

</details>

与任何移动应用一样，分发给用户的应用是通过编译（“构建”）Android Studio 或 Xcode 项目创建的。

当你用 `npx create-expo-app` 初始化新应用时，你不会看到任何 **android** 或 **ios** 目录。你可以[运行 `npx expo prebuild` 生成原生项目](/workflow/continuous-native-generation)，这会初始化原生项目，然后把项目的 Expo 应用配置（**app.json / app.config.js**）应用到它们。

如果你使用基于云的开发工作流，你可能永远不需要运行预构建，或在自己的机器上安装 Android Studio 或 Xcode（尽管你可能会发现这很有用）。这一点在下面的[本地与基于云的开发工作流](#基于云和本地的开发工作流)中说明。

<details>
<summary>为什么用 create-expo-app 初始化项目时默认不创建原生项目？</summary>

默认行为鼓励在需要时使用[持续原生生成](/workflow/continuous-native-generation)（CNG）生成原生项目，这可以使升级和项目维护容易得多。以下三条命令产生的项目大致相同：

:::tabs
:::tab npm
```sh
$ npx create-expo-app@latest MyApp && cd MyApp && npx expo prebuild

$ npx create-expo-app --template bare-minimum

$ npx @react-native-community/cli@latest init MyApp && cd MyApp && npx install-expo-modules
```
:::
:::tab yarn
```sh
$ yarn create expo-app MyApp && cd MyApp && yarn expo prebuild

$ yarn create expo-app --template bare-minimum

$ yarn dlx @react-native-community/cli@latest init MyApp && cd MyApp && yarn dlx install-expo-modules
```
:::
:::tab pnpm
```sh
$ pnpm create expo-app MyApp && cd MyApp && pnpm expo prebuild

$ pnpm create expo-app --template bare-minimum

$ pnpm dlx @react-native-community/cli@latest init MyApp && cd MyApp && pnpm dlx install-expo-modules
```
:::
:::tab bun
```sh
$ bun create expo MyApp && cd MyApp && bun expo prebuild

$ bun create expo --template bare-minimum

$ bunx @react-native-community/cli@latest init MyApp && cd MyApp && bunx install-expo-modules
```
:::
:::

</details>

</details>

<details id="持续原生生成-cng">
<summary>持续原生生成（CNG）</summary>

持续原生生成（CNG）是构建 Expo 应用的过程，其中你的[原生项目](#android-与-ios-原生项目)按需从 **app.json** 和 **package.json** 生成，类似于 **node_modules** 从 **package.json** 生成。

创建新项目时，[原生项目](#android-与-ios-原生项目)目录（**android** 和 **ios**）会自动加入 **.gitignore**，你可以随时删除它们，然后在需要时用 `npx expo prebuild` 从 Expo 应用配置重新生成。如果你使用基于云的开发工作流，你甚至可能永远不在自己的开发机器上运行预构建。

使用 CNG 可以使升级到新版本的 React Native 容易得多。它可以简化项目维护，并便于设置复杂功能，例如 [App Clips](https://github.com/bndkt/react-native-app-clip)、[分享扩展](https://github.com/timedtext/expo-config-plugin-ios-share-extension)和[错误报告](https://github.com/getsentry/sentry-react-native)。这一切都通过[配置插件](/config-plugins/introduction)成为可能。进一步了解 [CNG](/workflow/continuous-native-generation)。

<details>
<summary>如果我想在 Android Studio 或 Xcode 中编辑原生项目配置，而不是用预构建生成项目，怎么办？</summary>

CNG 已被证明对许多团队有帮助。不过它可能不是你项目的最佳选择，在许多情况下这是使用 Expo 工具的完全合理的方式。

你可以在项目中运行 `npx expo prebuild`，然后直接对 **android** 和 **ios** 目录做更改，而不是使用 Expo 应用配置。如果你决定这样做，请记住你将不再能够用预构建重新生成项目：在直接做了原生更改之后运行预构建会覆盖所有这些修改。

请注意，你可以使用[配置插件](/config-plugins/introduction)修改原生项目配置，而不必直接修改原生项目；如果你决定在某个时候回到 CNG，也可以这样做。

</details>

<details id="我如何知道何时需要再次运行预构建">
<summary>我如何知道何时需要再次运行预构建？</summary>

如果你向项目添加了新的原生依赖，或在 Expo 应用配置（**app.json / app.config.js**）中更改了项目配置，可以运行 `npx expo prebuild --clean` 重新生成原生项目目录。

关于如何判断新依赖是否需要原生代码更改，参见[判断第三方库的兼容性](/workflow/using-libraries#判断第三方库的兼容性)。

</details>

</details>

<details id="基于云和本地的开发工作流">
<summary>基于云和本地的开发工作流</summary>

选择基于云还是本地，并不会显著改变你的开发循环。这关系到你如何生产和分发 JavaScript 代码所针对的应用二进制文件。每次运行新的原生构建时，你都可以选择基于云或本地的开发。

用 EAS Build 在云端编译应用就像运行一条命令一样简单，无需安装 Android Studio 或 Xcode。云构建使与其他队友或相关方分享应用更容易，[以及其他好处](/build/introduction)。

要在本地编译应用，你需要在机器上安装 Android Studio 和 Xcode，然后可以从这些工具运行构建，或使用 `npx expo run:[android|ios]`。当你想用原生调试工具在实体设备或模拟器上调试应用时，这最有用。

进一步了解[使用 EAS Build 的基于云的工作流](/build/introduction)和[本地开发](/guides/local-app-development)。

</details>

## 初始化并运行项目

[用 `create-expo-app` 创建新项目](/get-started/create-a-project)是最简单的方式。创建项目后，如果你想试验或构建快速原型，可以立即在实体设备或模拟器上的 Expo Go 中直接启动它。

在大多数情况下，你会创建并使用项目的开发构建。你将安装 [`expo-dev-client`](/develop/development-builds/introduction) 库。开发构建可以用 EAS Build 创建，或在你的机器上本地创建：

- [使用 EAS 创建开发构建](/develop/development-builds/introduction)：了解如何使用 EAS 为项目创建开发构建。
- [在本地创建开发构建](/guides/local-app-development#使用-expo-dev-client-的本地构建)：了解如何使用你自己的机器、Android Studio 和 Xcode 在本地编译应用。

## 核心开发循环

![核心开发循环示意图](/static/images/guides/core-development-loop-light.png)

![核心开发循环示意图（深色）](/static/images/guides/core-development-loop-dark.png)

上图描述的核心开发循环是开发应用时通常经历的四个主要活动的循环。

- **编写并运行 JavaScript 代码**

  这包括创建组件、编写业务逻辑，或从 npm 安装不需要原生代码更改的库。你在这里做的更改会反映在应用中，而不需要与应用的原生侧有任何交互。

- **更新应用配置**

  这包括使用应用配置文件（**app.json** 或 **app.config.js**）修改应用的配置。它包括更新应用的名称、图标、启动画面和其他属性。这些更改并非都会直接影响原生项目。不过，如果你做了影响原生项目的更改，可以使用[应用配置](/workflow/configuration)修改原生项目配置，或创建或使用[配置插件](/config-plugins/introduction)。应用配置文件中可用属性的完整列表参见[应用配置参考](/versions/latest/config/app)。

- **编写原生代码或修改原生项目配置**

  这包括直接编写原生代码或修改原生代码配置。你要么需要访问原生代码项目目录来做这些更改，要么可以用[本地 Expo 模块](/modules/get-started#向现有应用添加新模块)编写原生代码。

- **安装需要原生代码修改的库**

  这包括某个库需要更改原生代码项目配置。要么该库提供配置插件，要么提供更新应用配置的步骤。与前一项活动一样，这也要求你创建开发构建。

创建[开发构建](#开发构建)时，你有两个选项。你可以使用 [EAS Build](/build/setup)创建基于云的构建，或在本地完成。如果你选择在本地完成，可以使用 [CNG](#持续原生生成-cng)，然后运行 [`npx expo prebuild --clean`](#我如何知道何时需要再次运行预构建)，或使用 [`npx expo run android|ios` 或 Android Studio 和 Xcode](/guides/local-app-development#本地应用编译)创建开发构建。

:::note
在本地创建开发构建时，`npx expo run` 命令会在构建应用之前生成原生目录。如果在第一次构建之后修改项目配置或原生代码，你必须重新构建项目。再次运行 `npx expo prebuild` 会把更改叠加在现有文件之上。构建之后它也可能产生不同的结果。为避免这一点，把原生目录加入项目的 **.gitignore**，并使用 `npx expo prebuild --clean` 命令。
:::

在应用的开发循环中，你也可以在同一设备上[安装不同变体（开发、预览或生产）](/build-reference/variants)。

开发循环的另一个关键部分是调试。关于调试应用的更多信息参见[调试运行时问题](/debugging/runtime-issues)，并了解可用的不同[调试工具](/debugging/tools)。

## 与测试人员分享应用

开发应用的下一步是与团队、beta 测试人员分享应用，或在多台测试设备上运行它。传统做法是把应用的二进制文件上传到 Google Play Beta（Android）或 TestFlight（iOS）。这可能很耗时，并且一次只能有一个活动构建（例如 TestFlight 的情况）。

如果你正在使用 EAS Build，我们建议阅读[内部分发](/build/internal-distribution)，进一步了解如何分享应用以供测试。

如果你在本地编译应用，可以[在本地创建生产构建](/guides/local-app-production)。

## 把应用发布到商店

要把应用发布到应用商店，可以使用 [EAS Submit](/deploy/submit-to-app-stores)。关于使用 EAS Submit 的更多信息，参见[提交到 Google Play Store](/submit/android)和[提交到 Apple App Store](/submit/ios)。

要在本地创建生产构建，参见同一主题的[指南](/guides/local-app-production)，然后阅读应用商店指南来提交应用。

## 在生产环境中监控应用

监控生产应用的两种方式是崩溃报告和分析。崩溃报告帮助你了解用户使用应用时遇到的异常或错误。你可以使用 [Sentry](/guides/using-sentry) 或 [BugSnag](https://docs.bugsnag.com/platforms/react-native/expo/) 启用崩溃报告。

分析允许你跟踪用户如何与应用交互。参见[分析概览](/guides/using-analytics)，进一步了解 Expo 和 React Native 生态中可用的服务。

## 更新应用

`expo-updates` 库允许你以编程方式把应用 JavaScript 的即时更新提供给生产应用。

你可以使用 [EAS Update](/eas-update/introduction)，它为 React Native 应用中的即时更新提供一等支持。它从全球 CDN 的边缘提供更新，并对支持的客户端使用 HTTP/3 等现代网络协议。它也[为使用 EAS Build 的开发者量身打造](/eas-update/preview)。你也可以把它用于[在本地](/eas-update/standalone-service)创建的构建。
