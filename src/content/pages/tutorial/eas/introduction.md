---
title: EAS 教程：简介
description: 介绍如何使用 Expo Application Services（EAS）为 Android 和 iOS 构建应用，涵盖 Build、Update 与 Submit 工作流。
---

# EAS 教程：简介

## 关于本教程

本教程将帮助你熟练使用 [Expo Application Services（EAS）](https://expo.dev/services) 的核心服务：[Build](/build/introduction)、[Submit](/deploy/submit-to-app-stores) 和 [Update](/eas-update/introduction)。完成教程后，你将知道如何为个人项目和团队项目搭建一套专业的移动端持续集成（CI）/持续交付（CD）流水线。

本教程涵盖以下主题：

- 使用 EAS Build 创建并安装开发构建，然后在设备、Android 模拟器或 iOS 模拟器上运行。
- 体验使用开发构建相对于 Expo Go 的好处。
- 实现与团队或外部相关方共享开发构建的工作流。
- 自动递增应用构建版本号。
- 在同一台设备上同时安装不同的应用变体，例如 development 和 preview。
- 在开发阶段使用 EAS Update 快速创建并部署更新。
- 通过与 GitHub 仓库集成来自动化构建流程。

这些主题将为我们有效使用 EAS 打下基础，并在需要时进一步接触更高级的主题。

本教程以动手实践为主，预计大约两小时可以完成。

### 前提条件

**本地已有一个 Expo 项目**

任选以下一种方式跟着做：

- 继续使用上一篇教程中的 Sticker Smash 应用。如果是新开始，可从 [GitHub](https://github.com/expo/examples/tree/master/stickersmash) 下载。
- 用 [`npx create-expo-app`](/get-started/create-a-project) 开始一个新项目。
- 使用[现有的 React Native 项目](/bare/overview)。请确保已安装 `expo` 包，可以[自动安装](/bare/installing-expo-modules)或[手动安装](/bare/installing-expo-modules#manual-installation)。

## 工具

[Expo Orbit](https://expo.dev/orbit) 可以在 macOS、Windows 和 Linux 上用一次点击管理和启动构建。

如果希望在本机同时安装并运行构建，可以使用 Android 模拟器或 iOS 模拟器。设置方法参见：

- [Android 模拟器](/workflow/android-studio-emulator)
- [iOS 模拟器](/workflow/ios-simulator)（仅 macOS 可用）

## 下一步

在本地搭好 Expo 项目之后，就可以开始这段旅程。下一章将学习如何用 EAS Build 创建你的第一个构建。

[开始](/tutorial/eas/configure-development-build)

我们从配置开发构建开始。
