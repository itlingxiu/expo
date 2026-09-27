---
title: 在开发构建中预览更新
description: 了解如何使用 expo-dev-client 库，在开发构建中预览已发布的 EAS Update。
---

# 在开发构建中预览更新

[`expo-dev-client`](/develop/development-builds/introduction) 库允许通过创建开发构建来启动项目的不同版本。任何兼容的 EAS Update 都可以在开发构建中预览。

本指南逐步说明如何使用 **Extensions** 标签页或构造特定的 Update URL，在开发构建中加载并预览已发布的更新。

## 前置条件

- **已安装开发构建**

  [创建开发构建并安装它](/develop/development-builds/introduction)到你的设备、Android 模拟器或 iOS 模拟器上。

- **已安装 `expo-updates`**

  确保你的开发构建已[安装 `expo-updates` 库](/eas-update/getting-started#配置项目)。

## 什么是 Extensions 标签页

![开发构建中的 Extensions 标签页。](/static/images/eas-update/extensions-01.png)

在开发构建中使用 `expo-updates` 库时，**Extensions** 标签页提供自动加载并预览已发布更新的能力。

### 使用 Extensions 标签页预览更新

1. 在项目中本地做非原生更改，然后[用 `eas update` 发布它们](/eas-update/getting-started#发布更新)。更新会发布到一个分支上。

2. 发布更新后，打开开发构建，进入 **Extensions**，点按 **Login**，在开发构建内登录你的 Expo 账户。**Extensions** 标签页要加载与你 Expo 账户下该项目关联的任何已发布更新，都需要这一步。

3. 登录后，**Extensions** 标签页内会出现 EAS Update 部分，其中有一个或多个最新发布的更新。在你想预览的更新旁边点按 **Open**。

在 **Extensions** 标签页中，你可以查看某个分支的全部已发布更新列表。在 **Extensions** 标签页中点按分支名称。

![开发构建中的 Extensions 标签页。](/static/images/eas-update/extensions-02.png)

## 使用 EAS 仪表盘预览更新

你也可以按以下步骤使用 EAS 仪表盘预览更新：

- 运行发布更新的命令后，点击 CLI 中已发布更新的链接。这会在 EAS 仪表盘的 **Updates** 页面打开该更新的详情。
- 点击 **Preview**。这会打开 **Preview** 对话框。
- 要预览更新，你可以用设备相机扫描二维码，或选择一个平台，[在 **Open with Orbit** 下启动更新](/review/with-orbit)。

## 构造更新 URL

作为前面各节所述方法的替代，你可以构造一个特定 URL，在开发构建中打开 EAS Update。URL 如下所示：

```sh
[slug]://expo-development-client/?url=[https://u.expo.dev/project-id]/group/[group-id]

# 示例
my-app://expo-development-client/?url=https://u.expo.dev/675cb1f0-fa3c-11e8-ac99-6374d9643cb2/group/47839bf2-9e01-467b-9378-4a978604ab11
```

我们拆开这个 URL，了解每一部分的作用：

| URL 的部分 | 描述 |
| --- | --- |
| `slug` | 应用配置中找到的项目 [slug](/versions/latest/config/app#slug)。 |
| `://expo-development-client/` | 深层链接要与 [`expo-dev-client`](/versions/latest/sdk/dev-client) 库一起工作所必需的部分。 |
| `?url=` | 定义 `url` 查询参数。 |
| `https://u.expo.dev/675cb1f0-fa3c-11e8-ac99-6374d9643cb2` | 这是更新 URL，位于项目应用配置的 [`updates.url`](/versions/latest/config/app#url) 下。 |
| `/group/47839bf2-9e01-467b-9378-4a978604ab11` | 更新的 group ID。 |

构造好 URL 后，把它直接复制并粘贴到开发构建启动器屏幕的 **Enter URL Manually** 下。

你也可以[为该 URL 创建二维码](/more/qr-codes)并用设备相机扫描。扫描后，URL 会打开开发构建并进入指定的 channel。

## 示例

- [查看可运行示例](https://github.com/jonsamp/test-expo-dev-client-eas-update)：查看把 `expo-dev-client` 与 EAS Update 一起使用的可运行示例。
