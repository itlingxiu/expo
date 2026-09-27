---
title: 开发构建常见问题
description: 关于开发构建、Expo Go 与 EAS Build 的常见问题汇总。
---

# 开发构建常见问题

本页介绍关于开发构建的常见问题、它们与 Expo Go 的关系，以及在哪里可以进一步了解 EAS Build。

## 进一步了解开发构建与 Expo Go

**Expo Go 与开发构建的区别**

[Expo Go](https://expo.dev/go) 是面向学生和学习者的"游乐场应用"，让你快速上手 —— 它内置了一组固定的原生库，因此无需自定义原生构建即可运行 JavaScript。而开发构建则是"功能完整的开发环境"，用于开发你的生产级 Expo 应用。

**原生应用与 JavaScript bundle**

原生应用是安装到设备上的产物；Expo Go 是一个预构建的原生应用，行为像游乐场，安装后无法更改。要添加原生库或更改应用名称/图标，就必须构建自己的原生应用（即开发构建）。

JS bundler（`expo start`）承载 UI 代码与业务逻辑。生产应用会把一个 `main.js` bundle 与应用一起发布，而在开发环境中，bundle 会从本机实时热加载。React Native 的作用是让 JavaScript 访问原生 API（Image、Camera、Notifications 等）；只有打进原生应用的 API 与库才可用。

## 为什么使用开发构建（即在 Expo Go 中做不了什么，以及为什么）

Expo Go 被定位为一个学习用的游乐场："它功能有限，不适合构建生产级项目"，因此大多数应用都会转向开发构建。了解 Expo Go 中哪些事做不了以及原因，有助于决定何时切换。

**使用 Expo Go 中没有的原生代码库**

以 `react-native-webview` 为例 —— 这是一个包含在 Expo Go 中的原生代码库（见 Expo Go 的 package.json）。运行 `npx expo install react-native-webview` 会把 JS 与原生代码安装到 `node_modules`，但构建出的 JS bundle 只使用 JS 部分，并与 Expo Go 中已有的原生代码交互。而对于不包含在内的库，例如 `react-native-firebase`（参见[使用 Firebase](/guides/using-firebase)），JS 可以热加载进 Expo Go，但会立刻报错，因为预期的原生代码不存在。除非原生代码本来就打包在商店上传的 bundle 中，否则无法添加到 Expo Go。

**测试应用图标、名称、启动画面的变更**

只用 Expo Go 时，你可以用你的值和图片产出商店构建，但无法在 Expo Go 中测试它们。这些原生资源随原生 bundle 一起发布，安装后不可变。Expo Go 确实会显示一个启动画面 —— 你的图标加纯色背景 —— 但那只是开发专用的模拟，功能有限；例如，无法测试通过 `SplashScreen.setOptions` 实现的动画。

**远程推送通知**

应用内通知（参见 [expo-notifications](/versions/latest/sdk/notifications)）可以在 Expo Go 中工作，但远程推送通知（服务器到应用）不行，因为"推送通知服务应当与你自己应用的推送通知证书绑定"。在 Expo Go 中实现虽然可行，但往往会让生产构建产生困惑；建议在开发构建中测试远程推送，以保持开发/生产环境一致。

**实现 App/Universal Links**

Android App Links（参见 [Android App Links](/linking/android-app-links)）与 iOS Universal Links（参见 [iOS Universal Links](/linking/ios-universal-links)）需要原生应用与网站之间的双向关联，包括在原生应用中写入所关联网站的 URL："由于上述原生代码的不可变性，这在 Expo Go 中不可能实现。"

**打开使用其他 SDK 版本的项目**

"每个 Expo Go 构建只支持一个 SDK 版本。"项目与 Expo Go 的 SDK 版本必须匹配。在 Android 设备/模拟器或 iOS 模拟器上，可以从 [expo.dev/go](https://expo.dev/go) 安装兼容版本，或使用 [`expo-go` CLI](/develop/tools#expo-go-cli)。平台专属指引：[排查 Expo Go 版本不匹配](/troubleshooting/expo-go-version-mismatch)。

## 进一步了解 EAS Build

- [用 eas.json 配置 EAS Build](/build/eas-json)
- [环境变量](/guides/environment-variables)
- [Android 构建流程](/build-reference/android-builds)
- [iOS 构建流程](/build-reference/ios-builds)
- [在 monorepo 中设置 EAS Build](/build-reference/build-with-monorepos)

## 视频教程

- [EAS 教程系列](https://www.youtube.com/playlist?list=PLsXDmrmFV_AS14tZCBin6m9NIS_VCUKe2)（YouTube 播放列表）—— 一门 YouTube 课程：学习如何用 Expo Application Services 加速开发。
- [Async Office Hours: How to make a development build with EAS Build](https://www.youtube.com/watch?v=LUFHXsBcW6w) —— 由开发者成功工程师 Keith Kurak 主持的教程。
