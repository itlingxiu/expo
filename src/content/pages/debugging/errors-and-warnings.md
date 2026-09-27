---
title: 错误与警告
description: 了解 Expo 项目中的 Redbox 错误和堆栈跟踪。
---

# 错误与警告

使用 Expo 开发应用时，你会遇到 **Redbox** 错误或 **Yellowbox** 警告。这些日志体验由 [React Native 中的 LogBox](https://reactnative.dev/blog/2020/07/06/version-0.63) 提供。

## Redbox 错误与 Yellowbox 警告

当致命错误导致应用无法运行时，会显示 Redbox 错误。Yellowbox 警告用来告知你可能存在问题，在发布应用之前应当解决。

你也可以用 `console.warn("Warning message")` 和 `console.error("Error message")` 自行创建警告和错误。触发 Redbox 的另一种方式是抛出错误且不捕获它：`throw Error("Error message")`。

> 这是用 Expo CLI 调试 React Native 应用的简要介绍。深入信息见[调试](/debugging/runtime-issues)。

## 堆栈跟踪

开发过程中遇到错误时，你会看到错误消息和**堆栈跟踪**，也就是应用崩溃时最近调用的报告。这段堆栈跟踪会同时显示在终端以及 Expo Go 应用中；如果你创建了开发构建，也会显示在那里。

堆栈跟踪**极其有价值**，因为它给出错误发生的位置。例如，在下图中，错误来自文件 **HomeScreen.js**，由该文件第 7 行引起。

![React Native 应用中的堆栈跟踪示例。](/static/images/stack-trace.webp)

查看该文件的第 7 行，你会看到引用了一个名为 `renderDescription` 的变量。错误消息说明找不到该变量，因为它没有在 **HomeScreen.js** 中声明。如果你花时间解读错误消息和堆栈跟踪，这就是它们有多有用的典型例子。

调试错误是开发中最令人沮丧、也最有成就感的部分之一。记住你并不孤单。**Expo 社区**以及 React 和 React Native 社区都是卡住时寻求帮助的好资源。很有可能别人也遇到过完全相同的错误。请务必阅读文档，并搜索[论坛](https://chat.expo.dev/)、[GitHub issues](https://github.com/expo/expo/issues/) 和 [Stack Overflow](https://stackoverflow.com/)。
