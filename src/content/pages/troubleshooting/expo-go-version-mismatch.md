---
title: “Project is incompatible with this version of Expo Go”错误
description: 了解为什么 Expo 项目与已安装的 Expo Go 版本不兼容，以及如何安装兼容版本。
---

# “Project is incompatible with this version of Expo Go”错误

当项目中的 Expo SDK 版本与已安装的 Expo Go 应用所包含的 SDK 版本不一致时，Expo Go 会显示此错误：

```text
Project is incompatible with this version of Expo Go
```

你也可能看到以下消息之一：

```text
The project you requested requires a newer version of Expo Go.
This project requires a newer version of Expo Go.
```

## 为什么会出现这种情况

每个 Expo Go 构建只包含一个 Expo SDK 版本。**package.json** 中的 `expo` 包版本决定了项目的 SDK 版本。项目与 Expo Go 的 SDK 版本必须一致。

Apple App Store 上的 Expo Go 停留在 SDK 54，SDK 55 及更高版本在那里不可用。Google Play 版本也可能滞后于新的 SDK 发布。如果项目使用的 SDK 比商店构建更新，请使用下面的方案之一，而不是等待商店更新。

## 安装兼容版本的 Expo Go

按照你正在测试项目的设备，使用对应说明。

### 实体 iPhone 或 iPad

对于使用 SDK 54 或更高版本的项目，使用 [`eas go`](https://expo.fyi/deploy-expo-go-testflight) 构建 Expo Go，并通过 TestFlight 内部团队分发。这需要 Apple Developer Program 会员资格。对于使用 SDK 54 的项目，也可以从 Apple App Store 安装 Expo Go。

对于使用 SDK 53 或更早版本的项目，无法在 iOS 真机上安装旧版本的 Expo Go。请升级项目、使用 Android 设备或 iOS 模拟器，或者创建开发构建。

### Android 设备、Android 模拟器或 iOS 模拟器

访问 [expo.dev/go](https://expo.dev/go)，选择项目使用的 SDK 版本和目标平台，然后安装兼容的 Expo Go 构建。

也可以使用 [`expo-go` CLI](/develop/tools#expo-go-cli) 下载特定版本。

安装兼容构建后，用 `npx expo start` 重启开发服务器，然后重新打开项目。

## 检查项目的 SDK 版本

如果安装了正确的 Expo Go 构建后错误仍然存在：

1. 检查 **package.json** 中的 `expo` 依赖，确认项目的 SDK 版本。
2. 如果[应用配置](/workflow/configuration)中包含 `sdkVersion` 字段，请移除它，或确保它与 `expo` 依赖一致。
3. 运行 `npx expo-doctor@latest`，检查依赖版本问题。
4. 运行 `npx expo install --fix`，使包版本与已安装的 Expo SDK 对齐。

## 升级项目或使用开发构建

你可以[将项目升级到更新的 Expo SDK](/workflow/upgrading-expo-sdk-walkthrough)，而不是安装另一个版本的 Expo Go。

Expo Go 是学习环境和沙盒。对于生产项目，请[创建开发构建](/develop/development-builds/introduction)，以便由项目自己控制原生应用及其依赖。
