---
title: EAS Build
description: EAS Build 是一项托管服务，用于为 Expo 和 React Native 项目构建应用二进制文件。
---

# EAS Build

**EAS Build** 是一项托管的 Expo Application Services（EAS）服务，用于为你的 Expo 和 React Native 项目构建应用二进制文件（也称为[独立应用](/more/glossary-of-terms#standalone-app)）。

EAS Build 通过提供开箱即用、适合 Expo 和 React Native 项目的默认值，并在你需要时为你处理应用签名凭据，让面向分发的应用构建变得简单、易于自动化。它还通过[内部分发](/build/internal-distribution)（使用 [ad hoc](/build/internal-distribution) 和/或企业级 “universal” 描述文件）让与团队分享构建比以往更容易，与 EAS Submit 深度集成以提交到应用商店，并对 [`expo-updates`](/build/updates) 库提供一等支持。

EAS Build 的设计也适用于任意原生项目，无论你是否使用 Expo 和 React Native。它是从 `npx create-expo-app` 或 `npx @react-native-community/cli@latest init` 走到应用商店的最快方式。

## 快速开始

:::note
下面的 `eas` 命令需要 EAS CLI。更多信息参见[如何安装 EAS CLI](/eas/cli#安装)。
:::

要构建应用，运行以下命令：

```sh
$ eas build --platform all
```

该命令把项目发送到 EAS Build，并为 Android 和 iOS 产出可安装的二进制文件。你也可以按需传入 `--platform android` 或 `--platform ios`，一次只构建一个平台。完整设置说明参见[创建你的第一次构建](/build/setup)。

### 面向 AI 代理的 Expo Skills

如果你使用 AI 代理，请安装 [Expo Skills](/skills)，教它如何创建生产构建并发布到应用商店。相关技能包括 `eas-app-stores`。

## 主要功能

- 在一致环境中为 Android 和 iOS 进行云端构建
- 自动配置并管理应用签名凭据，或使用你自己的凭据
- 用 URL 分享[内部分发](/build/internal-distribution)构建
- 用 **eas.json** 中的[构建 profile](/build/eas-json#构建-profile)（一组命名的构建设置）以及与 [EAS Workflows](/eas/workflows/get-started) 或 [CI 流水线](/build/building-on-ci) 的集成来自动化构建
- 通过 [`--auto-submit`](/build/automate-submissions) 和 EAS Submit，把成功的构建自动提交到应用商店
- 一等的 [`expo-updates` 集成](/build/updates)，包含按 profile 划分的 channel 和[运行时版本](/eas-update/runtime-versions)指导
- 在团队中复用[开发构建](/develop/development-builds/introduction)。当两名团队成员运行 `eas build:dev` 且项目指纹匹配时，会从 EAS 下载已有构建，而不是创建新构建
- 通过[依赖缓存和自定义缓存路径](/build-reference/caching)加快构建
- 用 [Expo Orbit](https://expo.dev/orbit) 在设备上安装构建和更新

## 何时使用 EAS Build

| 场景 | 建议 |
| --- | --- |
| 为应用商店构建可用于生产的二进制文件 | 推荐 |
| 通过[内部分发](/build/internal-distribution)与测试人员分享构建 | 推荐 |
| 无需设置本地环境，团队成员之间构建保持一致 | 推荐 |
| 从 CI 或 [EAS Workflows](/eas/workflows/get-started) 自动化构建 | 推荐 |
| 托管的应用签名凭据 | 推荐 |
| 在本地调试原生代码 | 不推荐 |

## 常见问题

<details>
<summary>在提交到应用商店之前，如何与团队分享构建？</summary>

使用[内部分发](/build/internal-distribution)，用 URL 分享构建。在 **eas.json** 的[构建 profile](/build/eas-json#构建-profile)中设置 `"distribution": "internal"`，为 Android 生成可安装的 Android Package（APK）文件，或为 iOS 生成 [ad hoc 构建](/build/internal-distribution)。

</details>

<details>
<summary>能否把 EAS Build 用于现有 React Native 项目？</summary>

可以。EAS Build 适用于用 `npx react-native init` 或类似工具创建的现有 React Native 项目。更多信息参见[在现有 React Native 应用中使用 Expo 的概览](/bare/overview)。

</details>

<details>
<summary>EAS Build 会处理应用签名凭据吗？</summary>

会。EAS Build 可以生成并管理 Android [keystore](/app-signing/app-credentials#android)、iOS [描述文件](/app-signing/app-credentials#ios)和[分发证书](/app-signing/app-credentials#ios)，也可以使用你提供的凭据。更多信息参见[应用签名凭据](/app-signing/app-credentials)。

</details>

<details>
<summary>能否在本地而不是云端运行构建？</summary>

可以。使用[本地构建](/build-reference/local-builds)，用 `eas build --local` 在你的机器上运行构建。这有助于调试，或满足要求本地构建的安全策略。

</details>

<details>
<summary>能否把 EAS Build 与 EAS Workflows 或 CI 流水线一起使用？</summary>

可以。EAS Build 使用 `build` 作业类型与 [EAS Workflows](/eas/workflows/get-started) 集成。在工作流配置中添加构建作业，例如：

```yaml
jobs:
  build_ios:
    type: build
    params:
      platform: ios
```

构建作业支持两个平台的构建，或基于分支的条件构建：

```yaml
jobs:
  build:
    type: build
    params:
      platform: all
      profile: ${{ github.ref_name == 'main' && 'production' || 'preview' }}
```

更多信息和其他用法示例参见 [EAS Workflows 的 build 作业](/eas/workflows/pre-packaged-jobs#build)。

EAS Build 支持[从 GitHub 构建](/build/building-from-github)以及用任意提供方[在 CI 上构建](/build/building-on-ci)。

</details>

<details>
<summary>EAS Build 使用什么样的构建服务器基础设施？</summary>

Android 构建在 Google Cloud Platform 上托管的 Linux 运行器上运行，iOS 构建在 Expo 的 macOS 云上托管的 macOS 运行器上运行。参见[构建服务器基础设施](/build-reference/infrastructure)。

</details>

## 开始使用

- [创建你的第一次构建](/build/setup)：为 iOS 和/或 Android 跑起来，总共应该只需要几分钟。
- [与内部测试人员分享应用](/build/internal-distribution)：EAS Build 可以用一个 URL 分享应用的预览构建。
- [自动提交](/build/automate-submissions)：了解 EAS Build 如何接收成功的构建，并自动把它们上传到应用商店。
- [应用版本管理](/build-reference/app-versions)：自动递增版本，这样你就不必再操心它们。
- [在本地或你自己的基础设施上运行构建](/build-reference/local-builds)：EAS Build 是托管服务，也可以在你自己的机器上运行，例如用于调试或遵守公司安全策略。
- [限制](/build-reference/limitations)：EAS Build 还很新，并且快速演进，建议先熟悉当前的限制。
