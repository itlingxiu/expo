---
title: 调试与性能分析工具
description: 了解可在运行时检查 Expo 项目的不同工具。
---

# 调试与性能分析工具

React Native 同时由 JavaScript 和原生代码组成。在调试时区分这一点非常重要。如果错误从 JavaScript 代码抛出，你可能无法用原生代码的调试工具找到它。本页列出一些帮助你调试 Expo 项目的工具。

## 开发者菜单

**开发者菜单**提供对有用调试功能的访问。它内置在开发客户端和 Expo Go 中。如果你使用模拟器，或设备通过 USB 连接，可以在 Expo CLI 启动开发服务器的终端中按 <kbd>M</kbd> 打开此菜单。

<details>
<summary>打开开发者菜单的其他方式</summary>

- Android 设备（无 USB）：垂直摇动设备。
- Android 模拟器或设备（有 USB）：
  - 按 <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> 或 <kbd>Ctrl</kbd> + <kbd>M</kbd>。
  - 在终端运行下面的命令来模拟按下菜单按钮：

    ```sh
    adb shell input keyevent 82
    ```

- iOS 设备（无 USB）：
  - 摇动设备。
  - 用三根手指触摸屏幕。
- iOS 模拟器或设备（有 USB）：
  - 按 <kbd>Ctrl</kbd> + <kbd>Cmd ⌘</kbd> + <kbd>Z</kbd> 或 <kbd>Cmd ⌘</kbd> + <kbd>D</kbd>

</details>

开发者菜单打开后，外观如下：

![Expo Go 开发者菜单，显示可用的菜单选项。](/static/images/debugging/developer-menu.webp)

开发者菜单提供以下选项：

- **Copy link**：复制应用的开发服务器地址。
- **Reload**：重新加载应用。通常不必这样做，因为 Fast Refresh 默认启用。
- **Go Home**：离开应用，回到开发客户端或 Expo Go 应用的主屏幕。
- **Toggle performance monitor**：查看应用的性能信息。
- **Toggle element inspector**：启用或禁用元素检查器覆盖层。
- **Open DevTools**（原为 **Open JS debugger**）：打开 React Native DevTools，它为使用 Hermes 的应用提供 Console、Sources、Network（**仅 Expo**）、Memory、Components 和 Profiler 标签页。更多信息见[使用 React Native DevTools 调试](#使用-react-native-devtools-调试)。
- **Fast Refresh**：切换是否在你用文本编辑器修改项目文件时自动刷新 JS bundle。

下面更详细地看看其中一些选项。

### 切换性能监视器

打开一个小覆盖层，提供应用的以下性能信息：

- 项目的 RAM 用量。
- JavaScript 堆（这是了解应用中是否有内存泄漏的简便方式）。
- 两个 View 计数。上方表示屏幕的视图数量，下方表示组件中的视图数量。
- UI 线程和 JS 线程的每秒帧数。UI 线程用于原生 Android 或 iOS UI 渲染。JS 线程是大部分逻辑运行的地方，包括 API 调用、触摸事件等。

### 切换元素检查器

打开元素检查器覆盖层：

![元素检查器覆盖层，在检查某个元素后显示其详情。](/static/images/debugging/element-inspector.webp)

该覆盖层具备以下能力：

- Inspect：检查元素
- Perf：显示性能覆盖层
- Network：显示网络详情
- Touchables：高亮可触摸元素

## 使用 React Native DevTools 调试

:::note
**从 React Native 0.76 开始**，React Native DevTools 已经取代 Chrome DevTools。
:::

**React Native DevTools** 是面向 Expo 和 React Native 应用的现代调试工具。它让你通过访问 [控制台](#与控制台交互)、[Sources](#在断点处暂停)、[Network](#检查网络请求仅-expo)（**仅 Expo**）和[内存](#检查内存)标签页，洞察应用的 JavaScript 代码。它还**内置支持 React DevTools**，例如[组件](#检查组件)和[性能分析器](#分析-javascript-性能)标签页。所有这些检查器都可以通过[开发客户端](/more/glossary-of-terms#开发客户端)或 Expo Go 访问。

你可以在任何使用 [Hermes](/guides/using-hermes) 的应用上使用 React Native DevTools。**要打开它，启动应用并在启动 Expo 的终端中按 <kbd>J</kbd>。** 打开 React Native DevTools 后，外观如下：

![React Native DevTools，在 Sources 标签页下显示其中一个文件。](/static/images/debugging/inspector-sources-tab.webp)

### 在断点处暂停

你可以在代码的特定位置暂停应用。为此，在 Sources 标签页下点击行号设置断点，或在代码中添加 `debugger` 语句。

一旦应用执行到带有断点的代码，它会完全暂停应用。这让你可以检查该作用域中的所有变量和函数。你也可以在[控制台](#与控制台交互)标签页中作为应用的一部分执行代码。

![React Native DevTools，在 Sources 标签页下显示其中一个文件。](/static/images/debugging/inspector-breakpoint.webp)

### 在异常处暂停

如果应用抛出意外错误，可能很难找到错误来源。你可以用 React Native DevTools 在抛出错误的那一刻暂停应用，并检查堆栈跟踪和变量。

![在 Sources 标签页的右侧面板中启用 Pause on exceptions。](/static/images/debugging/inspector-pause-exception.png)

:::note
有些错误可能被应用中的其他组件捕获，例如 Expo Router。在这些情况下，可以打开 **Pause on caught exceptions**。它让你能检查任何抛出的错误，即使它们已被正确处理。
:::

### 与控制台交互

**Console** 标签页让你访问一个交互式终端，直接连接到应用。你可以在这个终端中编写任何 JavaScript，像应用的一部分一样执行代码片段。代码默认在全局作用域中执行。但使用 [Sources](#在断点处暂停) 标签页的断点时，它会在到达的断点的作用域中执行。这让你可以在整个应用中调用方法并访问变量。

![配合断点使用控制台，以检查变量并在应用中调用代码。](/static/images/debugging/inspector-breakpoint-console.webp)

### 检查网络请求（仅 Expo）

:::note
只有安装了 [`expo-dev-client`](/versions/latest/sdk/dev-client)，或使用 Expo Go 时，React Native DevTools 中的 Network 标签页才可用。
:::

**Network** 标签页让你洞察应用发出的网络请求。你可以点击每个请求和响应来检查它们。这包括 `fetch` 请求、外部加载的媒体，以及在某些情况下甚至由原生模块发出的请求。

![洞察应用发出的网络请求。](/static/images/debugging/inspector-network-post.webp)

:::note
检查网络请求的其他方式见[检查网络流量](#检查网络流量)。
:::

### 检查内存

**Memory** 标签页允许你检查内存用量，并对应用 JavaScript 代码拍摄堆快照。

![检查应用 JavaScript 代码的内存用量。](/static/images/debugging/inspector-memory.webp)

### 检查组件

**Components** 标签页允许你检查应用中的 React 组件。在 React Native DevTools 中悬停某个组件，可以查看该组件的 props 和样式。这是调试应用 UI 并理解组件结构的好方法。

![在 React Native DevTools 中检查组件。](/static/images/debugging/inspector-components.webp)

### 分析 JavaScript 性能

:::warning
性能分析尚未用 sourcemap 符号化，并且[只能在调试构建中使用](https://github.com/facebook/hermes/issues/760)。这些限制将在后续版本中解决。
:::

**Profiler** 标签页允许你录制并分析应用 JavaScript 的性能。你可以开始录制、与应用交互，然后停止录制来分析性能数据。

![打开的 React Native DevTools Profiler 标签页，显示应用 JavaScript 性能的洞察。](/static/images/debugging/inspector-profiler.webp)

:::note
要分析原生运行时，请使用 Android Studio 或 Xcode 中包含的工具。
:::

### Rozenite

[**Rozenite**](https://www.rozenite.dev/) 是一个 React Native DevTools 插件框架。它允许你安装即插即用的集成，这些集成会被自动发现，并作为面板出现在 React Native DevTools 中。你也可以[创建自己的 Rozenite 插件](https://www.rozenite.dev/docs/plugin-development/plugin-development)，以集成自定义或第三方工具。

## 使用 VS Code 调试

:::warning
VS Code 调试器集成处于 [Alpha](/more/release-statuses#alpha) 阶段。要获得最稳定的调试体验，请[使用 React Native DevTools](#使用-react-native-devtools-调试)。
:::

VS Code 是流行的代码编辑器，内置调试器。该调试器使用与 React Native DevTools 相同的系统，即检查器协议。

你可以把这个调试器与 [Expo Tools](https://github.com/expo/vscode-expo#readme) VS Code 扩展一起使用。该调试器允许你设置断点、检查变量，并通过调试控制台执行代码。

![边写代码边调试。](/static/images/debugging/vscode-expo.webp)

要开始调试：

- 连接你的应用
- 打开 VS Code 命令面板（取决于你的电脑，是 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> 或 <kbd>Cmd ⌘</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>）
- 运行 **Expo: Debug ...** 这条 VS Code 命令。

这会把 VS Code 附加到正在运行的应用。

或者，如果你想在 VS Code 中获得功能完整的 IDE 设置，可以看看 [Radon IDE](https://ide.swmansion.com/) 扩展（付费，有 30 天免费试用）。它把编辑器变成专为 React Native 和 Expo 项目设计的强大环境，具备高级调试、网络检查器、路由集成和其他内置工具。

![使用 Radon IDE 调试代码。](/static/images/debugging/radon-ide.webp)

## React Native Debugger

:::warning
React Native Debugger 需要远程 JS 调试，而该功能自 [React Native 0.73](https://reactnative.dev/docs/other-debugging-methods#remote-javascript-debugging-deprecated) 起已弃用。
:::

React Native Debugger 是一个独立应用，封装了 React DevTools、Redux DevTools 和 React Native DevTools。不幸的是，它需要[已弃用的远程 JS 调试工作流](https://github.com/jhen0409/react-native-debugger/discussions/774)，并且与 Hermes 不兼容。

如果你使用 Expo **SDK 50** 或**更高版本**，可以使用与 React Native Debugger 对应的 [Expo 开发工具插件](/debugging/devtools-plugins)：

- [React Native DevTools](#使用-react-native-devtools-调试)
- [Redux DevTools](/debugging/devtools-plugins#redux)

如果你使用 Expo SDK 49 及更早版本，可以使用 React Native Debugger。本节提供快速入门说明。深入信息请查看其[文档](https://github.com/jhen0409/react-native-debugger#documentation)。

你可以通过[发布页面](https://github.com/jhen0409/react-native-debugger/releases)安装它；如果在 macOS 上，可以运行：

```sh
brew install react-native-debugger
```

### 启动

启动 React Native Debugger 后，需要把端口指定为 `8081`（快捷键：macOS 上为 <kbd>Cmd ⌘</kbd> + <kbd>T</kbd>，Linux/Windows 上为 <kbd>Ctrl</kbd> + <kbd>T</kbd>）。之后用 `npx expo start` 运行项目，并从开发者菜单选择 `Debug remote JS`。调试器应会自动连接。

在调试器控制台中，你可以看到元素树，以及所选元素的 props、state 和子元素。右侧还有 Chrome 控制台；如果在控制台中输入 `$r`，会看到所选元素的分解。

如果在 React Native Debugger 中任意位置右键，会得到一些方便的快捷方式，用于重新加载 JS、启用/禁用元素检查器和网络检查器，以及记录和清除 `AsyncStorage` 内容。

<video src="/static/videos/debugging/react-native-debugger.mp4" controls></video>

### 检查网络流量

用 React Native Debugger 调试网络请求很容易：在 React Native Debugger 中任意位置右键，选择 `Enable Network Inspect`。这会启用 Network 标签页，并允许你检查 `fetch` 和 `XMLHttpRequest` 的请求。

不过存在[一些限制](https://github.com/jhen0409/react-native-debugger/blob/master/docs/network-inspect-of-chrome-devtools.md#limitations)，因此还有其他几种替代方案，它们都需要使用代理：

- [Charles Proxy](https://www.charlesproxy.com/documentation/configuration/browser-and-system-configuration/)（约 50 美元，我们首选的工具）
- [Proxyman](https://proxyman.io)（有免费版本，或 49 到 59 美元）
- [mitmproxy](https://medium.com/@rotxed/how-to-debug-http-s-traffic-on-android-7fbe5d2a34#.hnhanhyoz)
- [Fiddler](https://www.telerik.com/fiddler)

## 调试生产应用

现实中，应用发布时往往带着缺陷。实现崩溃和缺陷报告系统可以帮助你获得生产应用的实时洞察。更多细节见[使用错误报告服务](/debugging/runtime-issues#使用错误报告服务)。
