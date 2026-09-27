---
title: 使用 Hermes 引擎
description: 在 Expo 项目中为 Android 与 iOS 配置 Hermes 的指南。
---

# 使用 Hermes 引擎

[Hermes](https://hermesengine.dev/) 是为 React Native 构建的 JavaScript 引擎。它提前把 JavaScript 编译为字节码，有助于应用启动时间；它的二进制比其他引擎（如 JavaScriptCore（JSC））更小，运行时内存占用也更少 —— 页面指出这在低端 Android 硬件上最为重要。

## 支持

Hermes 是 Expo 的默认 JavaScript 引擎，所有 Expo 工具都完全支持它。

## 在特定平台上切换 JavaScript 引擎

如果你想要不同平台使用不同引擎，在应用配置顶层把 `"jsEngine"` 设为 `"hermes"`，然后在 `"ios"` 键下用 `"jsc"` 覆盖。或者，也可以只在 `"android"` 键下显式设置 `"hermes"`。

```json app.json
{
  "expo": {
    "jsEngine": "hermes",
    "ios": {
      "jsEngine": "jsc"
    }
  }
}
```

## 发布更新

运行 `eas update` 或 `npx expo export` 会生成 Hermes 字节码 bundle 以及 source map。字节码格式在不同 Hermes 版本之间可能不同，因此为一个版本构建的更新无法在另一个版本上运行。自 Expo SDK 46（React Native 0.69）起，[Hermes 被捆绑在 React Native 内](https://reactnative.dev/architecture/bundled-hermes)。把 React Native 或 Hermes 版本升级视同更新任何其他原生模块：当你更改 `react-native` 版本时，也要更改 **app.json** 中的 `runtimeVersion`。否则应用可能在启动时崩溃，因为现有二进制携带较旧、不兼容的 Hermes 版本，却加载了更新。详见 [`runtimeVersion`](/eas-update/runtime-versions)。

## JavaScript 调试器

用 `npx expo start` 启动项目，然后按 J 在 Google Chrome 或 Microsoft Edge 中启动调试器。开发构建与 Expo Go 中的开发者菜单也提供 **Open DevTools**（原 **Open JS Debugger**）。或者，通过[手动打开 Google Chrome DevTools](https://reactnative.dev/docs/other-debugging-methods#remote-javascript-debugging-deprecated)使用 JavaScript inspector。

### 故障排查

打开调试器时显示的报错：

> "No compatible apps connected. JavaScript Debugging can only be used with the Hermes engine."

- 确认 `jsEngine` 字段中配置了 Hermes（[链接](/guides/using-hermes#switch-javascript-engine-on-a-specific-platform)）。
- 如果应用来自 `eas build`、`npx expo run:android` 或 `npx expo run:ios`，确认它是调试构建。
- 应用内部会打开 WebSocket 连接，所以确保它已连接到开发服务器：
  - 在 Expo CLI 终端 UI 中按 R 重载。
  - 用 `curl http://127.0.0.1:8081/json/list` 检查调试可用性（根据你的开发服务器 URL 调整主机/端口）。响应应为如下数组；如果为空，给 `npx expo start` 添加 `--localhost` 或 `--tunnel` 标志。

```json
[
  {
    "id": "0-2",
    "description": "host.exp.Exponent",
    "title": "Hermes ABI47_0_0React Native",
    "faviconUrl": "https://react.dev/favicon.ico",
    "devtoolsFrontendUrl": "devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=%5B%3A%3A1%5D%3A8081%2Finspector%2Fdebug%3Fdevice%3D0%26page%3D2",
    "type": "node",
    "webSocketDebuggerUrl": "ws://[::1]:8081/inspector/debug?device=0&page=2",
    "vm": "Hermes"
  },
  {
    "id": "0--1",
    "description": "host.exp.Exponent",
    "title": "React Native Experimental (Improved Chrome Reloads)",
    "faviconUrl": "https://react.dev/favicon.ico",
    "devtoolsFrontendUrl": "devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=%5B%3A%3A1%5D%3A8081%2Finspector%2Fdebug%3Fdevice%3D0%26page%3D-1",
    "type": "node",
    "webSocketDebuggerUrl": "ws://[::1]:8081/inspector/debug?device=0&page=-1",
    "vm": "don't use"
  }
]
```

### 我可以对 Hermes 使用远程调试吗？

[远程调试](/more/glossary-of-terms#remote-debugging)有局限性 —— 尤其是对基于 [JSI](https://github.com/react-native-community/discussions-and-proposals/issues/91) 构建的模块（例如 [`react-native-reanimated`](https://github.com/software-mansion/react-native-reanimated) v2 或以后）会失败。取而代之，Hermes 支持 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/v8/)，针对设备上的引擎就地调试 JavaScript，而不是在桌面 Chrome 标签页中执行它。当你在 Expo Go 或开发构建中打开调试器时，Hermes 应用会自动切换到这种方式。
