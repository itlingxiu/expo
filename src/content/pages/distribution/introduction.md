---
title: 分发：概览
description: 概述如何把应用提交到应用商店，或通过内部分发分享。
---

# 分发：概览

把应用交到用户手中：提交到应用商店，或使用[内部分发](/build/internal-distribution)。

:::tabs
:::tab npm
```sh
# 安装 CLI
$ npm install --global eas-cli

# 构建并提交应用
$ eas build --auto-submit

# 或者提交已有的二进制文件
$ eas submit
```
:::
:::tab yarn
```sh
# 安装 CLI
$ yarn global add eas-cli

# 构建并提交应用
$ eas build --auto-submit

# 或者提交已有的二进制文件
$ eas submit
```
:::
:::tab pnpm
```sh
# 安装 CLI
$ pnpm add --global eas-cli

# 构建并提交应用
$ eas build --auto-submit

# 或者提交已有的二进制文件
$ eas submit
```
:::
:::tab bun
```sh
# 安装 CLI
$ bun add --global eas-cli

# 构建并提交应用
$ eas build --auto-submit

# 或者提交已有的二进制文件
$ eas submit
```
:::
:::

你可以用 [EAS CLI](/eas) 运行 `eas build --auto-submit`，构建应用并自动上传二进制文件，以便在 Google Play Store 和 Apple App Store 上分发。

这会自动管理任意 React Native 应用在 Android 和 iOS 上的**全部原生代码签名**。支付、通知、通用链接和 iCloud 等高级功能可以根据你的[配置插件](/config-plugins/introduction)或原生 entitlements 自动启用，你不必再和缓慢的门户网站较劲，才能把库配置正确。

### 开始使用

- [提交到 Google Play Store](/submit/android)：了解如何把 Android 应用提交到 Google Play Store。
- [提交到 Apple App Store](/submit/ios)：了解如何从任意操作系统把 iOS 或 iPadOS 应用提交到 Apple App Store。
- [内部分发](/build/internal-distribution)：使用 Ad Hoc 构建在内部与测试人员分享移动应用。
- [发布网站](/guides/publishing-websites)：导出网站并上传到任意 Web 托管服务。
- [OTA 更新](/eas-update/introduction)：即时向用户发送 OTA 更新。
