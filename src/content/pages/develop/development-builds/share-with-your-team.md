---
title: 与团队共享开发构建
description: 把开发构建安装并分享给你的团队，或在多台设备上运行。
---

# 与团队共享开发构建

Android 和 iOS 都提供了把应用构建直接装到设备上的方式。这让你完全掌控哪些构建装在哪些设备上，从而可以快速迭代，同时保留多个构建供审查。你也可以把构建分享给同事，或安装到多台测试设备上。

## 分享 URL

开发构建就绪后，系统会生成一个可分享的 URL 及安装说明。你可以把链接发给同事，或发送到测试设备上安装构建。生成的 URL 仅适用于该项目的这次构建。

:::note
开发构建创建后再注册新的 iOS 设备，必须重新生成开发构建才能安装到这些设备上。详见[内部分发](/build/internal-distribution)。
:::

### 使用 EAS 仪表盘

你可以让同事打开 EAS 仪表盘中的构建页面，直接把构建产物下载到设备上。

### 使用 EAS CLI

同事也可以通过 EAS CLI 下载并安装构建。他们需要使用与该开发构建关联的 Expo 账户登录，然后运行：

```sh
eas build:run --profile development
```

如果开发构建使用的配置名不是 `development`，请用 `--profile` 指定实际名称。

### 仅 iOS 的说明

:::note
在 iOS 16 或更高版本上，如果尚未开启开发者模式（Developer Mode），构建运行前必须先[开启](/guides/ios-developer-mode)。使用企业级签名（enterprise provisioning）时不受此限制。
:::

`eas build:resign` 可以对现有 iOS **.ipa** 使用新的 ad hoc 配置文件重新签名，在为团队分发时节省时间。例如，要为现有构建添加一台新的测试设备，该命令会更新配置文件以包含该设备，而无需重新构建整个应用。进一步阅读：[重新签名新凭据](/app-signing/app-credentials)。

## 下一步

- [在同一设备上安装多个应用变体](/build-reference/variants) —— 通过把 app.json 转换为 app.config.js 并添加为每个变体启动开发服务器所需的额外配置，在一台设备上同时安装开发、预览与生产变体。
- [分享应用的预发布版本](/build/internal-distribution) —— 了解如何分享应用的预发布版本。
