---
title: 如何使用 Expo Orbit 启动更新
description: 了解如何在审查工作流中用 Expo Orbit 打开更新。
---

# 如何使用 Expo Orbit 启动更新

[Expo Orbit](https://expo.dev/orbit) 是一款支持 macOS、Windows 与 Linux 的应用，可以加速 EAS 构建的安装与运行 —— 按下 **Open in Orbit** 即可运行构建与更新。

## 自动安装与启动更新是如何工作的？

启动更新时，Orbit 会搜索与该更新的运行时版本（runtime version）及目标平台匹配的最新开发构建。如果找到兼容的构建，更新会安装到目标设备上，并通过指向该更新的深链接启动。如果不存在开发构建 —— 已过期、从未创建、没有使用 EAS Build，或[在本地构建](/guides/local-app-development) —— Orbit 会提示你如何继续。选择 **Launch with deep link** 可以在设备上已有兼容开发构建时直接打开更新。

## 前置条件

### 安装 Orbit 应用

从 [GitHub releases](https://github.com/expo/orbit/releases) 下载，或使用[其他安装方式](/build/orbit)。

### 登录你的 Expo 账户

安装后，在 **Settings** 中登录。

## 用 Expo Orbit 预览更新

预览需要一个已发布的更新；如果还没发布过，先参见[发布更新](/eas-update/getting-started)。

:::note
Expo Orbit 启动更新不支持 iOS 真机。支持的设备是 Android 设备/模拟器或 iOS 模拟器。
:::

### 安装并启动更新

打开一个已发布更新的步骤：

- 进入项目的 **Updates** 标签页。
- 选择要预览的更新。
- 点击 **Preview**，打开 **Preview** 对话框。
- 在 **Open with Orbit** 下选择一个平台。
- Orbit 会在所选的 Android 模拟器或 iOS 模拟器上安装并启动该更新。

现在你就可以用 Expo Orbit 流畅地启动并审查更新了。
