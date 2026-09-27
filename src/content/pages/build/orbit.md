---
title: Expo Orbit
description: 通过一键启动构建与更新、以及管理模拟器，加快开发工作流。
---

# Expo Orbit

适用于 macOS、Windows 和 Linux 的 [Expo Orbit](https://expo.dev/orbit) 可以更快地从 EAS、本地文件安装并启动构建或更新，或在模拟器和真机上运行 Snack 项目。

<video src="/static/videos/orbit/basic-features.mp4" controls></video>

## 为什么使用 Orbit

在 Orbit 之前，从 EAS 安装构建或更新（在 Android 和 iOS 真机或模拟器上），或在模拟器上运行 Snack 项目，都是手动的。你必须运行 `eas build:run` 命令并为所选设备挑选一次构建，或者下载归档再拖放到模拟器上（iOS 的情况）。对于 Snack 项目，还要额外在虚拟设备上安装 Expo Go、登录，再从列表中选择 Snack。Orbit 把这些步骤尽量变得无缝。

## 功能要点

- 列出并启动模拟器，包括在无音频的情况下运行 Android 模拟器。
- 一键把 EAS 上的构建安装并启动到模拟器和真机。
- 在 Android 模拟器或 iOS 模拟器上[从 EAS 安装并打开更新](/review/with-orbit)。
- 一键在模拟器中启动 Snack 项目。
- 使用 Finder 从本地文件安装并启动应用，或把文件拖放到菜单栏应用中。Orbit 支持任意 Android **.apk**、兼容 iOS 模拟器的 **.app**，或 ad hoc 签名的应用。
- 查看 [EAS 仪表盘](https://expo.dev) 中置顶的项目，并快速启动最新构建。

## 安装

:::note
Orbit 在 macOS、Windows 和 Linux 上依赖 Android SDK，并且仅在 macOS 上依赖 `xcrun` 做设备管理，因此需要同时设置 [Android Studio](/workflow/android-studio-emulator) 和 [Xcode](/workflow/ios-simulator)。
:::

:::tabs
:::tab macOS

可以从 Homebrew 为 macOS 下载 Orbit，也可以直接从 [GitHub releases](https://github.com/expo/orbit/releases) 下载。

```sh
$ brew install expo-orbit
```

如果希望登录时自动启动 Orbit，点击菜单栏中的 Orbit 图标，然后打开 **Settings**，选择 **Launch on Login**。

:::
:::tab Windows

可以直接从 [GitHub releases](https://github.com/expo/orbit/releases) 下载适用于 Windows 的 Orbit。

:::
:::tab Linux

可以直接从 [GitHub releases](https://github.com/expo/orbit/releases) 下载适用于 Linux 的 Orbit。提供 `.deb`（Debian 和 Ubuntu）和 `.rpm`（Fedora 和 RHEL）两种包。

:::
:::
