---
title: iOS 模拟器
description: 了解如何在 Mac 上安装 iOS 模拟器，并用它开发应用。
---

# iOS 模拟器

直接在计算机上开发应用，往往比不断与 iPhone 或 iPad 交互更方便，尤其是网络状况较慢，或因局域网限制而需要[隧道连接](/more/expo-cli#隧道)时。

本指南说明如何在 Mac 上安装 iOS 模拟器以进行应用开发。请注意，iOS 模拟器只能安装在 macOS 上。如果你从 Windows 或 Linux 机器开发 iOS 应用，将需要一台实体 iOS 设备。

## 设置 Xcode 和 Watchman

### 安装 Xcode

打开 Mac App Store，搜索 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)，然后点击 **Install**（如果已经安装则点击 **Update**）。

### 安装 Xcode 命令行工具

打开 Xcode，从 Xcode 菜单选择 **Settings...**（或按 <kbd>cmd ⌘</kbd> + <kbd>,</kbd>）。在侧边栏选择 **Locations**，然后在 **Command Line Tools** 下拉菜单中选择最新版本来安装这些工具。

![Xcode 中的 Locations 设置，Command Line Tools 下拉菜单中已选择一个版本。](/static/images/ios-simulator/xcode-command-line.webp)

### 在 Xcode 中安装 iOS 模拟器

要安装 iOS 模拟器，打开 **Xcode > Settings... > Components**，在 **Platform Support > iOS ...** 下点击 **Get**。

### 安装 Watchman

:::note
只有 SDK 55 及更早版本的项目才需要安装 Watchman。
:::

[Watchman](https://facebook.github.io/watchman/docs/install#macos) 是监视文件系统变更的工具。安装它会带来更好的性能。你可以用以下命令安装：

```sh
$ brew update
$ brew install watchman
```

### 试一试

用 `npx expo start` 运行应用，并在命令行按 <kbd>I</kbd>。

你可能会收到需要接受 Xcode 许可协议的警告。运行它建议的命令。再次打开应用，看看是否成功。如果没有，查看下面的[故障排查](#故障排查)提示。

官方页面在此处嵌入一段视频，演示在 iOS 模拟器中打开应用（`open-in-ios-simulator.mp4`）。

你也可以在 Expo CLI 中按 <kbd>Shift</kbd> + <kbd>I</kbd>，交互式地选择要打开的模拟器。

![Expo CLI 界面中的 iOS 模拟器列表。](/static/images/ios-simulator/simulators-list.webp)

## Expo Orbit

你可以使用 Expo Orbit 应用，它允许从 macOS 菜单栏一键启动构建并管理模拟器。

- [使用 Expo Orbit](/build/orbit)：进一步了解如何使用 Expo Orbit。

## 限制

尽管 iOS 模拟器非常适合快速开发，它确实有一些限制。下面列出影响 Expo API 的几个主要差异。更多细节参见 [Apple 的文档](https://help.apple.com/simulator/mac/current/#/devb0244142d)。

模拟器中不可用的硬件如下：

- 音频输入
- 气压计
- 相机
- 运动支持（加速度计和陀螺仪）

在 iOS 11 及更高版本上，模拟器还会挂起后台应用和进程。

## 故障排查

### 打开模拟器时 CLI 似乎卡住了

有时 iOS 模拟器不响应打开命令。如果它似乎卡在此提示上，请自己启动一个模拟器，然后再次运行应用。

```sh
# 列出 Mac 上已安装的模拟器
$ xcrun simctl list devices available

# 按名称启动其中一个
$ xcrun simctl boot "iPhone 17"
```

Xcode 27 用 Device Hub 取代了 Simulator 应用。运行 `open -a DeviceHub` 打开它。每个正在运行的设备出现在侧边栏中。在 Xcode 26 上，改为运行 `open -a Simulator`。

![macOS 上的 Device Hub 在侧边栏中列出正在运行的 iPhone 17 模拟器。](/static/images/ios-simulator/device-hub.webp)

你可以同时运行多个模拟器。Expo CLI 始终以最近打开的模拟器为目标。

### 模拟器打开了，但其中的 Expo Go 应用没有打开

第一次在模拟器中安装应用时，iOS 会询问你是否要打开 Expo Go 应用。你可能需要与模拟器交互（点击各处、拖动某物）此提示才会出现，然后按 **OK**。

### 如何安装特定版本的 Expo Go？

你可以创建所需 SDK 版本的项目，并在模拟器中打开它，以安装匹配版本的 Expo Go。

:::tabs
:::tab npm
```sh
# 引导一个 SDK 57 项目
$ npx create-expo-app --template blank@57

# 在模拟器上打开应用，以安装所需的 Expo Go 应用
$ npx expo start --ios
```
:::
:::tab yarn
```sh
# 引导一个 SDK 57 项目
$ yarn create expo-app --template blank@57

# 在模拟器上打开应用，以安装所需的 Expo Go 应用
$ yarn expo start --ios
```
:::
:::tab pnpm
```sh
# 引导一个 SDK 57 项目
$ pnpm create expo-app --template blank@57

# 在模拟器上打开应用，以安装所需的 Expo Go 应用
$ pnpm expo start --ios
```
:::
:::tab bun
```sh
# 引导一个 SDK 57 项目
$ bun create expo --template blank@57

# 在模拟器上打开应用，以安装所需的 Expo Go 应用
$ bun expo start --ios
```
:::
:::

你也可以用 [`expo-go` CLI](https://www.npmjs.com/package/expo-go) 传入 SDK 版本来下载特定版本的 Expo Go，或使用 `latest` 表示最新 SDK 版本。此命令把 Expo Go 应用下载到当前目录，并缓存在 **~/.expo** 下。

:::tabs
:::tab npm
```sh
$ npx expo-go download ios latest
```
:::
:::tab yarn
```sh
$ yarn dlx expo-go download ios latest
```
:::
:::tab pnpm
```sh
$ pnpm dlx expo-go download ios latest
```
:::
:::tab bun
```sh
$ bunx expo-go download ios latest
```
:::
:::

### Expo CLI 正在打印关于 `xcrun` 的错误消息，我该怎么办？

对于各种杂项错误，尝试以下做法：

- 在模拟器上手动卸载 Expo Go，然后在 Expo CLI 终端界面中按 <kbd>Shift</kbd> + <kbd>I</kbd> 并选择所需模拟器来重新安装。
- 如果这没有帮助，在 Device Hub 中选择该模拟器，并选择 **Device** > **Reset Content and Settings...**

  Xcode 26 上的 Simulator 应用把此菜单项称为 **Erase All Content and Settings...**

  这会从空白镜像重新初始化模拟器。当计算机内存不足、模拟器无法存储某些内部文件、使设备处于损坏状态时，这有时很有用。
