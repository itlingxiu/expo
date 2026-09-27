---
title: 使用 Facebook 身份验证
description: 使用 react-native-fbsdk-next 库在 Expo 项目中集成 Facebook 身份验证的指南。
---

# 使用 Facebook 身份验证

[`react-native-fbsdk-next`](https://github.com/thebergamo/react-native-fbsdk-next/) 库封装了 Facebook 的 Android 与 iOS SDK。它允许在 Expo 项目中集成 Facebook 身份验证，并提供对原生组件的访问。

本指南补充说明如何在 Android 上用 Expo 配置该库。

### 前置条件

- **开发构建** —— `react-native-fbsdk-next` 库不能在 Expo Go 中使用，因为它需要自定义原生代码。更多内容见[向应用添加自定义原生代码](/workflow/customizing)。

## 安装

安装与配置该库的说明见 `react-native-fbsdk-next` 文档：

- [React Native FBSDK Next：Expo 安装说明](https://github.com/thebergamo/react-native-fbsdk-next/#expo-installation)

## Android 配置

在 Facebook 项目中添加 Android 平台时，应用需要先通过 Google Play Store 审核，从而拥有有效的 Play Store URL，以及与应用关联的 [`package`](/versions/latest/config/app#package) 名称。否则会遇到以下错误：

![Facebook 项目无法识别尚未发布、且没有有效 Google Play Store URL 的 Android 应用包名。](/static/images/guides/android-package-error.webp)

关于如何为应用商店构建项目，参见以下指南：

- [为应用商店构建项目](/deploy/build-project)
- [用 EAS Submit 提交到 Google Play Store](/submit/android)

把应用上传到 Play Store 后，就可以提交应用审核。审核通过后，Facebook 项目就能通过 Play Store URL 访问它。

之后，前往 Facebook 项目的 **Settings** > **Basic**，添加 **Android** 平台。你需要提供 Key hash、Package name 和 Class name。

![在 Facebook 项目中添加 Android 平台所需的字段。](/static/images/guides/android-required-fields.webp)

- 要添加 Key hash，前往 Play Store Console，从 **Release** > **Setup** > **App Integrity** > **App signing key certificate** 获取 SHA-1 证书指纹。然后[把证书的十六进制值转换为 Base64](https://base64.guru/converter/encode/hex)，并添加到 Facebook 项目的 **Android** > **Key hashes** 下。
- Package name 位于[应用配置](/versions/latest/config/app)的 [`android.package`](/versions/latest/config/app#package) 字段。
- Class name 默认为 `MainActivity`，可以使用 `package.MainActivity`，其中 `package` 是项目应用配置中的 `android.package`。例如 `com.myapp.example.MainActivity`，其中 `com.myapp.example` 是应用的 `package` 名称。
- 然后点击 **Save changes** 保存配置。

现在，你可以在开发构建、发布构建以及生产应用中使用这个 Facebook 项目。
