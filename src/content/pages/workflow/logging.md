---
title: 查看日志
description: 了解如何在使用 Expo CLI 时查看日志，以及 Android Studio 和 Xcode 中的原生日志与系统日志。
---

# 查看日志

在 React Native 应用中记录信息的方式与 Web 浏览器类似。你可以使用 `console.log`、`console.warn` 和 `console.error`。不过有时你可能希望更深入地了解应用中正在发生的事情。为此可以使用**原生日志**和**系统日志**。

## 控制台日志

运行 `npx expo start` 并连接设备后，控制台日志会显示在终端进程中。这些日志通过 WebSocket 从运行时发送到 Expo CLI，因此保真度低于把开发工具直接连到引擎。

你可以创建带有 [Hermes](/guides/using-hermes) 的开发构建，并[连接检查器](/guides/using-hermes#javascript-调试器)，从而查看**高保真**日志并使用 `console.table` 等高级日志函数。

### 在生产模式中查看控制台日志

使用 [`npx expo start --no-dev`](/workflow/development-mode#生产模式) 启动应用时，控制台日志不会出现在 Expo CLI 终端中。把日志转发到 Expo CLI 的运行时代码只在开发模式下运行。你无法在生产模式中重新启用它。不过 `console.log` 仍会写入设备上的原生日志。要查看这些日志，在 Android 上使用 `adb logcat`，在 iOS 上使用“控制台”应用。逐步说明参见[查看原生日志](/debugging/runtime-issues#查看原生日志)。

## 原生日志

在本地编译原生应用后，可以在 Android Studio 和 Xcode 中查看原生运行时日志。更多信息参见[原生调试](/debugging/runtime-issues#原生调试)。

## 系统日志

通常没有必要，但如果你想查看设备上发生的一切日志，例如来自其他应用和操作系统的日志，可以使用以下命令：

:::tabs
:::tab npm
```sh
# 用 adb logcat 显示 Android 设备的系统日志
$ npx react-native log-android
# 显示 iOS 设备的系统日志
$ npx react-native log-ios
```
:::
:::tab yarn
```sh
# 用 adb logcat 显示 Android 设备的系统日志
$ yarn dlx react-native log-android
# 显示 iOS 设备的系统日志
$ yarn dlx react-native log-ios
```
:::
:::tab pnpm
```sh
# 用 adb logcat 显示 Android 设备的系统日志
$ pnpm dlx react-native log-android
# 显示 iOS 设备的系统日志
$ pnpm dlx react-native log-ios
```
:::
:::tab bun
```sh
# 用 adb logcat 显示 Android 设备的系统日志
$ bunx react-native log-android
# 显示 iOS 设备的系统日志
$ bunx react-native log-ios
```
:::
:::
