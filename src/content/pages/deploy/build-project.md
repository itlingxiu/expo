---
title: 为应用商店构建你的项目
description: 了解如何通过 EAS Build 从命令行创建生产（商店就绪）构建。
---

# 为应用商店构建你的项目

用 **EAS** 或**本地**方式生成原生二进制之后，下一步是提交到商店，这需要一个**生产构建（production build）**。这类构建会上传到商店，用于公开发布或商店托管的测试（例如 TestFlight）。本指南介绍 EAS 与本地两种路线；此外，任何能编译 Android 与 iOS 应用的 CI 服务也都可以创建生产构建。

## 使用 EAS 创建生产构建

生产构建不能直接安装到模拟器或设备上 —— 它们必须经由各自的商店分发。唯一的例外是 Android 在构建配置中显式设置 `"buildType": "apk"`；但文档推荐商店提交使用 **aab**，这也是默认值。

### `eas.json` 配置

创建第一个构建后，就已经存在一个最小的生产配置：

```json eas.json
{
  "build": {
    ...
    "production": {}
    ...
  }
}
```

### 创建生产构建

为你的平台运行相应命令。

**Android：**

```sh
eas build --platform android
```

**iOS：**

```sh
eas build --platform ios
```

`--message` 标志可以为构建附加说明，例如 `eas build --platform ios --message "Some message"`；它会显示在 EAS 仪表盘上，帮助团队记录构建的用途。另外，`--platform all` 可以同时构建 Android 与 iOS：

```sh
eas build --platform all
```

## 开发者账户

目标商店需要对应的开发者账户。

- **分发到 Google Play Store 需要 Google Play 开发者会员资格。** 你可以用 EAS Build 构建/签名，但上传需要会员资格：一次性 25 美元费用。
- **为 Apple App Store 构建需要 Apple Developer Program 会员资格。** 面向 Apple App Store 的 EAS Build 生产构建需要访问一个拥有 99 美元 [Apple Developer Program](https://developer.apple.com/programs) 会员资格的账户。

## 应用签名凭据

为商店构建之前，你需要商店开发者账户与签名凭据 —— 生成或提供。无论你是否有经验，EAS CLI 都可以处理这一流程；你可以选择让它管理凭据。

### Android 应用签名凭据

- 没有现成 keystore 时，在 EAS CLI 中选择 `Generate new keystore`；keystore 会安全地存储在 EAS 服务器上。
- 要手动生成，参见[手动 Android 凭据指南](/app-signing/local-credentials)。

### iOS 应用签名凭据

- 没有配置文件（provisioning profile）和/或分发证书时，使用 EAS CLI：登录你的 Apple Developer Program 账户并按提示操作。
- 要手动生成，参见[手动 iOS 凭据指南](/app-signing/local-credentials)。

## 等待构建完成

默认情况下 `eas build` 会等待构建完成，不过你可以中断它。用 CLI 提供的构建详情链接监控进度并阅读日志，或者访问[你的构建仪表盘](https://expo.dev/builds)，或运行：

```sh
eas build:list
```

组织成员可以在[该账户的构建仪表盘](https://expo.dev/accounts/%5Baccount%5D/builds)上找到构建详情。

## 自动创建构建

通过 [EAS Workflows](/eas/workflows/introduction)，可以在分支提交时自动触发构建。先[配置你的项目](/eas/workflows/get-started)，然后在项目根目录添加 **.eas/workflows/create-builds.yml**，内容如下：

```yaml .eas/workflows/create-builds.yml
name: Create builds

on:
  push:
    branches: ['main']

jobs:
  build_android:
    name: Build Android app
    type: build
    params:
      platform: android
      profile: production
  build_ios:
    name: Build iOS app
    type: build
    params:
      platform: ios
      profile: production
```

这样每次提交到 `main` 都会创建 Android 与 iOS 构建。也可以用以下命令手动运行：

```sh
eas workflow:run create-builds.yml
```

常见模式见[工作流示例指南](/eas/workflows/examples/introduction)。

## 本地构建发布版本

下面的 React Native 指南介绍 Android 与 iOS 的本地发布/生产构建。它们假设 **android** 和/或 **ios** 目录已存在；使用[持续原生生成（CNG）](/workflow/continuous-native-generation)的用户必须先运行 [prebuild](/more/glossary-of-terms)。

:::note
在下面指南的第四步中，Android 发布 **.aab** 请在 **android** 目录中运行 `./gradlew app:bundleRelease`，而不是 `npx react-native build-android --mode=release`。
:::

- [发布到 Google Play Store](https://reactnative.dev/docs/signed-apk-android) —— 手动发布到 Google Play 的步骤。
- [发布到 Apple App Store](https://reactnative.dev/docs/publishing-to-app-store) —— 手动发布到 Apple App Store 的步骤。

## 下一步

[应用商店最佳实践](/distribution/app-stores) —— 提交到应用商店的最佳实践。
