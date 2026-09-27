---
title: 本地构建：概览
description: 如何使用你自己的机器为 Expo 项目在本地构建应用的概览。
---

# 本地构建：概览

你可以利用本地开发环境，借助 Android Studio 和 Xcode 在本地构建应用。这一构建过程同时适用于调试构建和发布构建。本页概述在自己的机器上本地构建应用的不同方式，并指向此工作流中可能需要的其他指南。

## 何时在本地构建应用

在以下场景中，你会希望在开发者机器上构建应用：

- 你希望快速迭代原生代码改动，或在调试构建中测试特定平台的改动
- 你希望手动生成原生代码来测试调试构建
- 任何必须在网络访问受限的环境中创建构建的场景
- 你希望在本地自行管理凭据（例如上传密钥等）
- 你希望测试或集成自己的自定义构建缓存提供方
- 你希望退出 Android 的预编译 Expo Modules，并在本地从源码编译一次

:::note
在本地构建应用是对 EAS Build 的补充。你可以继续使用构建服务做云端自动化，并在开发时回退到本地构建。
:::

## 前置条件

- **Android Studio** —— [设置 Android Studio](/get-started/set-up-your-environment?platform=android&device=physical&mode=development-build&buildEnv=local#set-up-an-android-device-with-a-development-build)，以便在本地机器上编译并运行 Android 项目。
- **Xcode** —— [设置 Xcode](/get-started/set-up-your-environment?platform=ios&device=physical&mode=development-build&buildEnv=local#set-up-an-ios-device-with-a-development-build)，以便在本地机器上编译并运行 iOS 项目。

## 在本地创建调试构建

要快速构建并迭代调试构建，可以使用 Expo CLI 的 `npx expo run:[android|ios]` 命令。这些命令使用本地安装的 Android SDK 或 Xcode 编译项目，生成应用的调试构建。

- [在本地创建调试构建](/guides/local-app-development) —— 了解如何在本地为 Expo 应用创建调试构建。

## 在本地创建发布构建

要创建应用的发布构建（也称为生产构建），可以使用 Android Studio 和 Xcode 提供的工具生成签名凭据。然后生成发布构建，并按流程手动把应用提交到 Google Play Store 或 Apple App Store。

- [在本地创建发布构建](/guides/local-app-production) —— 生成已签名的 Android App Bundle，在 Xcode 中归档 iOS 构建，并手动提交到应用商店。

## 复用来自提供方的先前构建

你可以通过缓存并复用来自提供方的构建来加快本地开发。可以使用 EAS 作为构建提供方，也可以创建自己的自定义提供方。

- [使用构建缓存提供方](/guides/cache-builds-remotely) —— 启用 EAS 构建缓存，或交付自定义提供方以缩短本地构建时间。

## Android 的预编译 Expo Modules

Expo 为 Android 提供预编译的 Expo Modules，减少每次构建时 Gradle 的工作量。你可以继续使用默认设置，或在需要修改某个模块源码时有选择地退出。

- [Android 的预编译 Expo Modules](/guides/prebuilt-expo-modules) —— 了解预编译模块如何工作，以及如何全局或按包退出。
