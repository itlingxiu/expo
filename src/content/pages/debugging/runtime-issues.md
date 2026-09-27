---
title: 调试运行时问题
description: 了解可用于调试 Expo 项目的不同技术。
---

# 调试运行时问题

无论你是在本地开发应用、把它发给选定的 beta 测试者，还是把应用正式发布到应用商店，你总会遇到需要调试的问题。把错误分成两类很有用：

- 你在开发中遇到的错误
- 你（或你的用户）在生产中遇到的错误

下面分别说明处理上述两种情况时的推荐做法。

:::note
已经熟悉 React Native 调试？关于 React Native DevTools 和内置性能分析器等 Expo 专用工具，见[调试工具](/debugging/tools)。
:::

## 开发错误

这些是你在开发应用时遇到的常见错误。调试它们并不总是直截了当。通常，用 [Expo CLI](/more/expo-cli) 运行应用时进行调试就足够了。

调试这些问题的一种方式是查看[堆栈跟踪](/debugging/errors-and-warnings#堆栈跟踪)。不过在某些情况下，只看堆栈跟踪不够，因为追踪到的错误消息可能更晦涩。对于这类错误，按下面的步骤操作：

- 在 Google 和 [Stack Overflow](https://stackoverflow.com/questions) 上搜索错误消息，你很可能不是第一个遇到它的人。
- **隔离抛出错误的代码**。这一步对修复晦涩错误至关重要。做法是：
  - 回退到代码的一个可工作版本。这甚至可以是一个完全空白的 `npx create-expo-app` 项目。
  - 一块一块地应用最近的改动，直到它出问题。
  - 如果每一“块”中添加的代码很复杂，你可能想简化正在做的事。例如，如果使用 Redux 这类状态管理库，可以尝试把它完全从问题中拿掉，看看问题是否出在状态管理上（这在 React 应用中很常见）。
  - 这应当缩小错误的可能来源，并为你提供更多信息，以便在网上搜索遇到相同问题的人。
- 使用断点（或 `console.log`）来检查并确认某段代码正在运行，或某个变量具有某个值。用 `console.log` 调试通常不算最佳实践，但它快、简单，而且常常能提供一些有启发的信息。

尽可能简化代码以追踪错误来源，是调试应用的好方法，而且会变得指数级更容易。这就是许多开源仓库在你开 issue 时要求提供[最小可复现示例](https://stackoverflow.com/help/minimal-reproducible-example)的原因。它确保你已经隔离了问题，并准确指出问题发生的位置。如果应用太大、太复杂，做不到这一点，试着把你想添加的功能提取到一个空白的 `npx create-expo-app` 项目中，再从那里开始。

### 原生调试

你可以通过在本地生成源代码并从该源码构建，用 Android Studio 和 Xcode 进行完整的原生调试。

#### Android Studio

1. 运行下面的命令，为项目生成原生代码：

   :::tabs
   :::tab npm
   ```sh
   npx expo prebuild -p android
   ```
   :::
   :::tab yarn
   ```sh
   yarn expo prebuild -p android
   ```
   :::
   :::tab pnpm
   ```sh
   pnpm expo prebuild -p android
   ```
   :::
   :::tab bun
   ```sh
   bun expo prebuild -p android
   ```
   :::
   :::

   这会在项目根目录添加一个 **android** 目录。

2. 运行下面的命令，在 Android Studio 中打开项目：

   ```sh
   open -a "/Applications/Android Studio.app" ./android
   ```

3. 从 Android Studio 构建应用并连接调试器。更多信息见 [Google 文档](https://developer.android.com/studio/debug#startdebug)。

> 完成此过程后可以删除 **android** 目录。这确保项目仍由 Expo CLI 管理。保留该目录并在 `npx expo prebuild` 之外手动修改它，意味着你需要自己手动升级和配置原生库。

#### Xcode

> 这只适用于 macOS 用户，并且需要安装 Xcode。

1. 运行下面的命令，为项目生成原生代码：

   :::tabs
   :::tab npm
   ```sh
   npx expo prebuild -p ios
   ```
   :::
   :::tab yarn
   ```sh
   yarn expo prebuild -p ios
   ```
   :::
   :::tab pnpm
   ```sh
   pnpm expo prebuild -p ios
   ```
   :::
   :::tab bun
   ```sh
   bun expo prebuild -p ios
   ```
   :::
   :::

   这会在项目根目录添加一个 **ios** 目录。

2. 运行下面的命令在 Xcode 中打开项目。它是从项目 **ios** 目录打开 `.xcworkspace` 文件的快捷方式。

   ```sh
   xed ios
   ```

3. 用 <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> 或按 Xcode 左上角的播放按钮构建应用。

4. 现在你可以使用 [**底层调试器（LLDB）**](https://developer.apple.com/library/archive/documentation/IDEs/Conceptual/gdb_to_lldb_transition_guide/document/Introduction.html) 以及所有其他 [Xcode 调试工具](https://developer.apple.com/documentation/metal/debugging_tools) 来检查原生运行时。

> 完成此过程后可以删除 **ios** 目录，或把它加入 gitignore。这确保项目仍由 Expo CLI 管理。保留该目录并在 `npx expo prebuild` 之外手动修改它，意味着你需要自己手动升级和配置原生库。

## 查看原生日志

当应用崩溃或行为异常时，JavaScript 错误输出并不总是能说明全部情况。来自 Android 和 iOS 的原生日志可以揭示崩溃原因、原生模块错误，以及不会出现在 Metro 打包器或 React Native DevTools 中的系统级警告。

- **[如何使用 ADB Logcat 和 macOS 控制台进行调试](https://www.youtube.com/watch?v=LvCci4Bwmpc)**：在本教程中，你将学习如何使用 ADB Logcat 和 macOS 控制台等原生设备日志功能，在代码中找出缺陷并快速修复。

### Android：adb logcat

连接 Android 设备（或使用模拟器）并运行下面的命令：

```sh
adb logcat
```

Android Debug Bridge（`adb`）程序是 Android SDK 的一部分，允许你查看流式日志。不想安装 Android SDK 时，可以在 Chrome 中使用 [WebADB](https://webadb.com/) 作为替代。

### iOS：控制台应用

你可以用 Mac 上的 **控制台** 应用读取已连接 iOS 设备或正在运行的 iOS 模拟器的日志。按下面的步骤访问控制台应用：

1. 从 **应用程序** > **实用工具** 打开 **控制台** 应用。

2. 在侧边栏的 **设备** 下，选择已连接的设备或模拟器。

   ![macOS 上的控制台应用，设备下列出了所选的 iOS 模拟器。](/static/images/debugging/console-devices.webp)

3. 点击 **开始串流**，读取设备或模拟器的日志。

## 生产错误

生产应用中的错误或缺陷可能更难解决，主要是因为你围绕错误的上下文更少（也就是错误在哪里、如何以及为什么发生）。

**处理生产错误的最佳第一步是在本地复现它。** 一旦在本地复现错误，就可以遵循[开发调试过程](#开发错误)来隔离并处理根本原因。

### 生产应用正在崩溃

生产应用崩溃时，与开发相比可用的信息非常少。先尝试在本地复现崩溃，然后按这些步骤缩小原因：

- **检查特定于平台的崩溃报告。**
  - 对于 Google Play Store 上的 Android 应用，参考 [Google Play Console](https://play.google.com/console/about/) 的崩溃部分。
  - 对于 TestFlight 或 App Store 上的 iOS 应用，使用 Xcode 中的 [Crashes Organizer](https://developer.apple.com/news/?id=nra79npr)。另见 Apple 的[使用崩溃报告和设备日志诊断问题](https://developer.apple.com/documentation/xcode/diagnosing-issues-using-crash-reports-and-device-logs)指南。
- **使用原生日志工具。** 连接一台能复现崩溃的设备，用 [`adb logcat` 或控制台应用](#查看原生日志) 捕获原生日志输出。当 JavaScript 错误边界没有捕获问题时，原生日志常常能揭示根本原因。
- **在本地尝试生产模式。** 在本地以**生产模式**运行应用会显示通常不会抛出的错误。为此可以运行 `npx expo start --no-dev --minify`。`--no-dev` 标志告诉服务器以生产模式运行，`--minify` 用于以与生产 JavaScript bundle 相同的方式压缩代码。
- **检查崩溃报告仪表板。** 如果使用 [Sentry](/guides/using-sentry)、[BugSnag](/guides/using-bugsnag) 或类似服务，先在那里检查崩溃。这些服务提供堆栈跟踪、设备信息和复现上下文。

### 应用在某些（较旧）设备上崩溃

这可能表明存在性能问题。你很可能需要用性能分析器运行应用，以便更好地了解哪些进程导致应用被杀死，[React Native 为此提供了很好的文档](https://reactnative.dev/docs/profiling)。我们也建议使用 [React Native DevTools](/debugging/tools#使用-react-native-devtools-调试) 和其中包含的[性能分析器](/debugging/tools#分析-javascript-性能)，它让识别应用中的 JavaScript 性能瓶颈变得非常容易。

### 使用错误报告服务

在生产应用中实现崩溃和缺陷报告服务有多项好处，例如：

- 对生产部署的实时洞察，以及复现崩溃和缺陷所需的信息。
- 设置警报系统，以便在发生致命 JavaScript 错误或你配置的任何其他事件时收到通知。
- 使用 Web 仪表板查看异常详情，例如堆栈跟踪、设备信息等。

借助 Expo，你可以集成 [Sentry](/guides/using-sentry) 或 [BugSnag](/guides/using-bugsnag) 等报告服务，以实时获得更多洞察。

## 卡住了？

Expo 社区以及 React 和 React Native 社区都是卡住时寻求帮助的好资源。很有可能别人也遇到过和你相同的错误，因此请务必阅读文档，并搜索[论坛](https://chat.expo.dev/)、[GitHub issues](https://github.com/expo/expo/issues/) 和 [Stack Overflow](https://stackoverflow.com/)。
