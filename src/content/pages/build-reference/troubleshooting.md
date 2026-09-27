---
title: 排查构建错误与崩溃
description: 使用 EAS Build 时排查构建错误和崩溃的参考。
---

# 排查构建错误与崩溃

出问题时，多半会以下面两种方式之一出现：

1. 构建失败。
2. 构建成功，但遇到运行时错误，例如运行时崩溃或卡住。

关于[缩小错误来源](https://expo.fyi/manual-debugging)的所有常规建议在这里都适用；本文提供的信息可以叠加在你通常的排查流程和技巧之上。排查是一门手艺，你可能需要创造性地思考。

## 找到相关错误日志

在继续之前，你需要确认已经定位并阅读了错误信息。做法取决于你在调查的是构建失败还是运行时错误。

### 运行时错误

属于这一类的常见问题是：“我的应用在本地运行良好，但运行构建时立即崩溃”，或“我的应用在 Expo Go 中正常，但在构建里停在启动画面”。当应用构建成功，但运行时崩溃或卡住，这被视为运行时错误。

参考调试指南的[“生产错误”一节](/debugging/runtime-issues#production-errors)，了解发布构建在运行时崩溃时如何定位日志。

如果用这种方法找不到有用信息，试着[逐步缩小崩溃来源](https://expo.fyi/manual-debugging)。

### 构建错误

进入构建详情页（如果还没打开，可在[构建仪表盘](https://expo.dev/accounts/[account]/projects/[project]/builds)找到），点击展开任何失败的构建阶段。通常，最早出现错误的阶段包含最有用的信息，后续失败阶段往往是从第一个阶段级联而来。

无论哪个阶段，**日志条目前缀为 `[stderr]` 很常见，但请记住这并不一定表示这些日志指向错误**；CLI 工具用 [stderr](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_(stderr)) 输出警告和其他诊断信息是常见做法。

例如，你可能在 Android 构建中看到类似这样的内容：

```text
[stderr] Note: /build/workingdir/build/app/node_modules/@react-native-async-storage/async-storage/android/src/main/java/com/reactnativecommunity/asyncstorage/AsyncStorageModule.java uses or overrides a deprecated API.
[stderr] Note: Recompile with -Xlint:deprecation for details.
```

你可能想也可能不想跟进这条警告，但它并不是构建失败的原因。那么如何知道哪些日志才真正负责？如果你构建的是[现有 React Native 项目](/bare/overview)，你已经很擅长这一点。如果你构建的是使用[持续原生生成（CNG）](/workflow/continuous-native-generation)的项目，可能会更棘手，因为你不直接接触原生代码，只写 JavaScript。

一条好的前进路径是**判断构建失败是由于原生错误还是 JavaScript 错误**。当构建因 JavaScript 构建错误失败时，你通常会看到类似这样的内容：

```text
❌ Metro encountered an error:
Unable to resolve module ./src/Routes from /Users/expo/workingdir/build/App.js
```

这个特定错误意味着应用正在导入 **./src/Routes**，但找不到它。原因可能是 Git 中的文件名大小写与开发者文件系统不同（例如 Git 里是 **routes.js** 而不是 **Routes.js**），或者项目有构建步骤，但没有设置为在 EAS Build 上运行。在这个例子中，**./src/Routes** 本意是导入 **./src/Routes/index.js**，但该路径被意外排除在开发者的 **.gitignore** 中。

需要注意的是，对于 iOS 构建，构建详情页只显示日志的节略版本，因为 `xcodebuild` 的完整输出可能达到 10MB 量级。有时必须打开完整的 Xcode 日志才能找到你需要的信息；例如 JavaScript 构建失败，但构建详情页上看不到有用信息。要打开完整的 Xcode 日志，在构建完成后滚动到构建详情页底部，点击查看或下载。

如果你正在处理使用持续原生生成（CNG）的项目，并且构建错误是原生错误而不是 JavaScript 错误，这很可能是由于项目中的[配置插件](/config-plugins/introduction)或某个依赖。留意日志中自上次成功构建以来新添加的包。运行 `npx expo-doctor`，确认项目中 Expo SDK 依赖的版本与你的 Expo SDK 版本兼容。

有了错误日志，你通常就可以开始修复构建，或在[论坛](https://chat.expo.dev/)和 GitHub issues 中搜索相关包以深入了解。下面列出了一些常见问题来源。

<details>
<summary>你在使用 Monorepo 吗？</summary>

Monorepo 非常有用，但它们也会带来自己的一组问题。必须把整个 Monorepo 上传到 EAS Build 构建器，设置它，然后运行构建。

EAS Build 更像典型的 CI 服务：我们需要源代码，而不是已编译的 JavaScript 包和清单。EAS Build 对 Yarn workspaces 有一等支持，[使用其他 Monorepo 工具时结果可能有所不同](/build-reference/limitations)。

更多信息参见[使用 Monorepo](/guides/monorepos)。

</details>

<details>
<summary>内存不足（OOM）错误</summary>

如果构建失败，并且 Gradle 日志中出现 “Gradle build daemon disappeared unexpectedly (it may have been killed or may have crashed)”，这是因为负责打包应用 JavaScript 的 Node 进程被终止了。

这常常说明应用包极其庞大，这会让整体应用二进制文件更大，并导致启动变慢，尤其是在低端 Android 设备上。有时，当大文本文件被当作源代码处理时也会出现此错误，例如你有一个 JavaScript 文件包含 1MB 以上的 HTML 字符串要加载到 WebView，或同样大小的 JSON 文件。

要确定包有多大，并查看体积来自何处，请使用 [Expo Atlas](/guides/analyzing-bundles)。

要提高 EAS Build 构建器的内存上限，在 **eas.json** 中使用 [`large` 资源等级](/eas/json#resourceclass)。更多信息参见 [Android 专用资源等级](/build-reference/infrastructure#android-构建服务器配置)和 [iOS 专用资源等级](/build-reference/infrastructure#ios-构建服务器配置)。

</details>

<details>
<summary>None of the files exist 错误</summary>

运行 `eas build` 时，项目文件会上传到 Expo 的构建服务器。不过，**.gitignore** 中提到的任何文件或目录都**不会上传**。这是有意为之，以防止 API 密钥等敏感信息暴露在应用代码中。

如果项目导入了列在 **.gitignore** 中的文件，构建会以 `None of these files exist` 错误失败。你可以用不同方式解决此错误：

- 移除对被忽略文件的 import 语句并测试项目。如果项目按预期工作，该 import 语句可能已经过时或未被使用。

- 从 **.gitignore** 中移除 Metro 无法解析的任何文件或目录。不过这会带来安全风险，因为这些文件中包含的任何敏感信息现在都会出现在项目源代码和 Git 提交历史中。

- 用 `base64` 编码该文件，把该字符串保存为密钥，并在 EAS Build 钩子中创建该文件。更多信息参见[如果文件被 gitignore，如何把文件上传到 EAS Build？](https://expo.fyi/eas-build-archive.md#how-can-i-upload-files-to-eas-build-if-they-are-gitignored)

- 重构源代码，避免在客户端导入敏感文件。如果某个文件是第三方提供方自动生成的代码，并且该提供方已自动把文件列在 **.gitignore** 中，那么该文件可能包含敏感信息。你不应把它放在客户端。在应用开发期间，确保遵循安全实践，例如使用环境变量或通过后端提供它们。更多信息参见[在环境变量中使用密钥](/eas/environment-variables#visibility-settings-for-environment-variables)。

</details>

## 比较构建日志

当以前成功的 EAS Build 开始失败时，找出两次构建之间发生了什么变化有助于定位根因。EAS Build 详情页上的 **Compare** 按钮帮助你并排比较两次构建，显示构建日志和配置的差异。

要比较两次构建：

- 在失败构建的 [EAS 仪表盘](https://expo.dev/accounts/[account]/projects/[project]/builds)上打开构建详情页
- 点击 **Compare** 按钮打开比较对话框
- 输入你想比较的构建的构建 ID 或完整构建 URL。这应是以前成功的那次构建。
- 点击 **Compare**。

![比较构建对话框。](/static/images/eas-build/troubleshooting/compare-builds-modal.png)

上面的截图显示比较视图，顶部同时展示两次构建及其元数据。其中包括状态、环境、Expo SDK 版本等。元数据下方是并排的日志比较，输出按每个构建阶段组织。

在每个构建阶段内，用指示器显示两次构建之间发生了什么变化：

- **Changed (X lines)**：该阶段在两次构建中都运行了，但产出了不同的输出。
- **+ Added**：该阶段只存在于比较构建中（原始构建在到达它之前就失败了）。
- **- Removed**：该阶段只存在于原始构建中。

![比较构建视图。](/static/images/eas-build/troubleshooting/compare-builds-view.png)

在上面的示例中，把右侧的失败构建与左侧的成功构建比较，会揭示已安装包的差异，并高亮锁文件不匹配。

## 验证 JavaScript 能在本地打包

当构建以 `Task :app:bundleReleaseJsAndAssets FAILED`（Android）或 `Metro encountered an error`（iOS）失败时，意味着 Metro 打包器在尝试把应用的 JavaScript 代码嵌入应用二进制文件时无法打包。这条错误信息后面通常跟着语法错误，或其他关于打包为何失败的细节。不幸的是，标准 React Native 项目被配置为在 Gradle/Xcode 构建步骤的后期才执行这一步，这意味着要看到此错误可能要等很久。

你可以在本地运行 `npx expo export` 来构建生产包，从而绕过所有其他构建步骤，更快地看到此错误。反复运行此命令，解决发现的任何语法错误或其他问题，直到包成功构建。然后再试一次 EAS Build。

## 验证项目能在本地构建并运行

如果日志不足以立即帮助你理解并修复根因，就该尝试在本地复现问题了。如果项目能在本地以 release 模式构建并运行，那么它也能在 EAS Build 上构建，前提是以下各项都成立：

- 相关的[构建工具版本](/build/eas-json#配置构建工具)（例如 Xcode、Node.js、npm、Yarn）在两种环境中相同。
- 相关的[环境变量](/eas/environment-variables)在两种环境中相同。
- 上传到 EAS Build 的[归档](https://expo.fyi/eas-build-archive)包含相同的相关源文件。

你可以用 `npx expo run:android` 和 `npx expo run:ios` 命令验证项目能在本地机器上构建，并把变体/配置标志设为 release，以尽可能忠实地复现 EAS Build 上执行的内容。更多信息参见 [Android 构建过程](/build-reference/android-builds)和 [iOS 构建过程](/build-reference/ios-builds)。

:::tabs
:::tab npm
```sh
# 在本地以 release 模式编译并运行 Android 应用
$ npx expo run:android --variant release

# 在本地以 release 模式编译并运行 iOS 应用
$ npx expo run:ios --configuration Release
```
:::
:::tab yarn
```sh
# 在本地以 release 模式编译并运行 Android 应用
$ yarn expo run:android --variant release

# 在本地以 release 模式编译并运行 iOS 应用
$ yarn expo run:ios --configuration Release
```
:::
:::tab pnpm
```sh
# 在本地以 release 模式编译并运行 Android 应用
$ pnpm expo run:android --variant release

# 在本地以 release 模式编译并运行 iOS 应用
$ pnpm expo run:ios --configuration Release
```
:::
:::tab bun
```sh
# 在本地以 release 模式编译并运行 Android 应用
$ bun expo run:android --variant release

# 在本地以 release 模式编译并运行 iOS 应用
$ bun expo run:ios --configuration Release
```
:::
:::

> 如果你使用 [CNG](/workflow/continuous-native-generation)，这些命令会运行 `npx expo prebuild` 来生成原生项目以便编译。排查结束后，你可能想[清理这些更改](https://expo.fyi/prebuild-cleanup)，除非你想开始直接管理这些项目，而不是按需生成它们。
>
> 你也可以用 `eas build --local` 运行本地构建。该命令会运行一系列尽可能接近托管 EAS Build 服务上远程所运行步骤的步骤。它会把项目复制到临时目录，并在那里做任何必要的更改。[了解如何设置并用它进行调试](/build-reference/local-builds#使用本地构建进行调试)。

如果原生工具链安装正确，但你无法在本地机器上以 release 模式构建并运行项目，它也不会在 EAS Build 上构建。先在本地修复问题，然后再在 EAS Build 上重试。本文的其他建议可能有助于你在本地解决问题，但这通常需要一些原生工具知识，或恰当地使用 Google、Stack Overflow 和 GitHub Issues。

<details>
<summary>机器上没有设置 Xcode 和 Android Studio？</summary>

**如果你本地没有安装原生工具链**，例如因为你没有 Apple 电脑，因此无法在机器上构建 iOS 应用，要查清构建错误可能会更棘手。在本地做小改动然后在 EAS Build 上看到结果的反馈循环，比在本地做同样的步骤更慢，因为 EAS Build 构建器必须先设置环境、下载项目并安装依赖，然后才能开始构建。

如果你愿意并且能够设置合适的原生工具，请参考 [React Native 环境设置指南](https://reactnative.dev/docs/environment-setup)。

</details>

<details>
<summary>我的应用能在本地构建，但不能在 EAS Build 上构建</summary>

默认情况下，EAS Build 遵循相对直接的过程来为应用构建（[Android](/build-reference/android-builds)或 [iOS](/build-reference/ios-builds)）。如果 `npx expo run:android --variant release` 和 `npx expo run:ios --configuration Release` 在本地能工作，但构建失败，就该缩小范围：你的机器上存在哪些尚未为 EAS Build 上的项目设置的配置。

- 把项目全新 `git clone` 到一个新目录并让它跑起来，最好在另一台机器上。注意所需的每一步，并验证它们也为 EAS Build 做了配置。
- 检查[环境变量](/guides/environment-variables)是否正确配置。
- 验证 Node.js、npm、Yarn、Xcode、Java 和其他工具的版本在两种环境中相同。
- 确保[你上传到 EAS Build 的归档](https://expo.fyi/eas-build-archive)包含相同的相关源文件。

</details>

<details>
<summary>为什么我的生产应用与开发应用不一致？</summary>

你可以用 [`npx expo start --no-dev`](/workflow/development-mode#production-mode) 启动应用，测试应用的 JS 部分在生产环境中会如何运行。这告诉打包器在提供 JavaScript 之前先压缩它，最明显的是剥离受 `__DEV__` 布尔值保护的代码。这会移除大部分日志、HMR、Fast Refresh 功能，并让调试稍难一些，但你可以由此更快地迭代生产包。

</details>

## 仍然有问题？

本指南远非全面，根据你的经验水平，你可能仍然难以让应用正常工作。

如果你已经遵循了这里的建议，现在就处于一个有利位置，可以向其他开发者描述你的问题并获得帮助。

### 如何提出一个好问题

加入 [Discord 和论坛](https://chat.expo.dev/)，向社区和 Expo 团队寻求帮助。Expo 团队会尽力回应高质量、表述清楚的问题和 issue，但除非你订阅了[支持方案](https://expo.dev/support-terms#target-response-time-guidelines-for-subscriptions)，否则不保证回复。要确保 Expo 团队成员看到你的问题，可以在 [expo.dev/contact](https://expo.dev/contact) 提交工单。

寻求排查帮助时，请务必分享以下信息：

- **构建页面的链接**。只有你的团队或 Expo 员工可以访问。如果你想更公开地分享，请截图。如果你想更私密地分享，发邮件到 secure@expo.dev，并在聊天或论坛的求助中提及这一点。如果你是用 `eas build --local` 在本地执行此构建，可以省略此项，但请提及这一事实。
- **错误日志**。任何你怀疑可能与构建或运行时错误相关的内容。如果无法提供，请说明原因。
- **最小可复现示例或仓库链接**。让其他开发者能够复现问题，是获得解决方案最快的方式。如果你曾经在团队中工作，你会从经验中知道这一点。很多情况下，如果你无法提供可复现示例，可能就无法帮助你；往好处说，来回问答也会低效地消耗时间。进一步了解如何创建可复现示例，参见[手动调试指南](https://expo.fyi/manual-debugging)和 Stack Overflow 的[最小可行可复现示例](https://stackoverflow.com/help/minimal-reproducible-example)指南。

尽量清晰、精确、有帮助。Stack Overflow 的[如何提出一个好问题](https://stackoverflow.com/help/how-to-ask)指南中的一般性指导同样适用。
