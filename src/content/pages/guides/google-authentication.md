---
title: 使用 Google 身份验证
description: 使用 react-native-nitro-google-signin 或 @react-native-google-signin/google-signin 在 Expo 项目中集成 Google 身份验证的指南。
---

# 使用 Google 身份验证

有两个库可用于 Google 身份验证：

- [`react-native-nitro-google-signin`](https://react-native-nitro-google-sign-in.github.io) —— "一个使用现代原生 API 的库。"
- [`@react-native-google-signin/google-signin`](https://github.com/react-native-google-signin/google-signin) —— "一个广泛使用的库。"

两者都提供原生登录按钮，并处理用户身份验证以及对 Google API 的授权。由于它们需要自定义原生代码，你必须在[应用配置](/versions/latest/config/app)中使用[配置插件](/develop/config-plugins/introduction)并创建开发构建。

## 选择库

需要权衡的差异：

- `react-native-nitro-google-signin` 支持 **Android Credential Manager**。
- `@react-native-google-signin/google-signin` 把 Android Credential Manager API "作为其付费产品的一部分"提供。

:::note
旧版 Google Sign-In SDK for Android（位于 `com.google.android.gms:play-services-auth`）已弃用，Google 建议"迁移到 Android Credential Manager"。参见[关于从旧版 Google Sign-In 迁移](https://developer.android.com/identity/sign-in/legacy-gsi-migration)。
:::

本指南涵盖如何为你的项目配置库。

### 前置条件

#### 开发构建

"这些库不能在 Expo Go 中使用，因为它们需要自定义原生代码。"更多内容见[向应用添加自定义原生代码](/workflow/customizing)。

## 安装

选择两个设置指南之一：

- [React Native Nitro Google Sign-In](https://react-native-nitro-google-sign-in.github.io)
- [React Native Google Sign In：Expo 安装说明](https://react-native-google-signin.github.io/docs/setting-up/expo)

## 为 Android 与 iOS 配置 Google 项目

以下是在两个平台上配置 Google 项目的说明。

### 把应用上传到 Google Play Store

对于生产应用，推荐上传到 Play Store。即使在开发过程中也可以提交应用进行测试，这样当 EAS 为测试签名应用、以及当 [Google Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756?hl=en) 为商店部署签名应用时，你都能测试 Google Sign In。以下三个指南按指定顺序列出：

- [创建你的第一个 EAS Build](/build/setup)
- [为应用商店构建项目](/deploy/build-project)
- [用 EAS Submit 提交到 Google Play Store](/submit/android)

### 配置你的 Firebase 或 Google Cloud Console 项目

更深入的配置指引在库文档中：

- [`react-native-nitro-google-signin`](https://react-native-nitro-google-sign-in.github.io/docs/setup/google-cloud)
- [`@react-native-google-signin/google-signin`](https://react-native-google-signin.github.io/docs/setting-up/get-config-file)

在 Android 上，上传应用后，你必须在项目设置期间提供 SHA-1 证书指纹值。有两种：

- 你构建的 **.apk**（本地或通过 EAS Build）的指纹，位于 Google Play Console 的 **Release** > **Setup** > **App Integrity** > **Upload key certificate** 下。
- 从 Play Store 下载的**生产应用**的指纹，位于 **Release** > **Setup** > **App Integrity** > **App signing key certificate** 下。

### 使用 Firebase

各库的 Firebase 配置说明：

- [Firebase（Nitro Google Sign-In）](https://react-native-nitro-google-sign-in.github.io/docs/setup/expo#with-firebase--google-services-files-recommended)
- [Firebase（@react-native-google-signin/google-signin）](https://react-native-google-signin.github.io/docs/setting-up/expo#expo-and-firebase-authentication)

#### 把 google-services.json 与 GoogleService-Info.plist 上传到 EAS

使用 Firebase 方式时，构建时 EAS 必须能访问 `google-services.json` 与 `GoogleService-Info.plist`。要么把它们检入仓库（它们"不应包含敏感值"），要么把它们当作密钥处理：加入 **.gitignore**，并按照[上传密钥文件到 EAS 并在应用配置中使用](/eas/environment-variables/usage#using-environment-variables-with-eas-build)操作。

### 使用 Google Cloud Console

不使用 [Firebase](/guides/google-authentication#with-firebase) 的项目的替代方案。各库的配置说明：

- [不带 Firebase 的 Expo（Nitro Google Sign-In）](https://react-native-nitro-google-sign-in.github.io/docs/setup/expo#without-firebase-manual-ios-url-scheme)
- [不带 Firebase 的 Expo（@react-native-google-signin/google-signin）](https://react-native-google-signin.github.io/docs/setting-up/expo#expo-without-firebase)
