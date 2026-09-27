---
title: 核心概念
description: Expo 工具、功能与服务概览。
---

# 核心概念

Expo 是一个[开源框架](https://github.com/expo/expo/)，用于构建在 Android、iOS 和 Web 上原生运行的应用。Expo 把移动端与 Web 的优势结合起来，并为构建和扩展应用提供许多重要能力。

`expo` 这个 npm 包为 React Native 应用带来一整套强大功能。`expo` 包几乎可以安装到**任何 React Native 项目**中。

## 工具与功能

- **[Expo SDK](/versions/latest)**：经过充分测试的 React Native 模块套件，可在 Android、iOS 和 Web 上运行。
- **[用 Expo 开发应用](/workflow/overview)**：构建 Expo 应用的开发流程概览，帮助你建立核心开发循环的心智模型。
- **[Expo Modules API](/modules/overview)**：用现代 Swift 与 Kotlin API 编写高性能原生代码。
- **[预构建](/workflow/continuous-native-generation)**：把 React 与原生分离，从而在任意电脑上开发、轻松升级、制作白标应用，并维护更大的项目。
- **[Expo CLI](/more/expo-cli)**：管理依赖、编译原生应用、进行 Web 开发，并通过强大的开发服务器连接到任意设备。
- **[Expo Go](/get-started/set-up-your-environment)**：供学生和学习者在模拟器或设备上试用 React Native 的实验场。

:::note
所有功能都免费、可选，并且可以彼此独立使用。未使用的功能不会给应用增加额外体积。
:::

| 功能 | 使用 `expo` | 不使用 `expo`（现有 React Native） |
| --- | --- | --- |
| **完全**用 JavaScript 开发复杂应用。 | 是 | 否 |
| 用 Swift 和 Kotlin 编写 JSI 原生模块。 | 是 | 否 |
| 不使用 Xcode 或 Android Studio 开发应用。 | 是 | 否 |
| 在浏览器中用 [Snack](https://snack.expo.dev/) 创建并分享示例应用。 | 是 | 否 |
| 主要升级无需改动原生代码。 | 是 | 否 |
| 一流的 TypeScript 支持。 | 是 | 否 |
| 从命令行安装原生兼容的库。 | 是 | 否 |
| 用同一套代码库开发高性能网站。 | 是 | 否 |
| 把开发服务器[通过隧道](/more/expo-cli#隧道)连接到任意设备。 | 是 | 否 |

## 服务

Expo 背后的团队还提供 **Expo Application Services (EAS)**，这是与构建、提交和更新 React Native 应用深度集成的云服务。无论应用是否使用 `expo`，EAS 都可以用于**任何 React Native 应用**。

- **[Expo Application Services](/eas)**：构建、部署和更新原生应用的最简单方式。
