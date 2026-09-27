---
title: Expo SDK 参考
description: 使用 Expo SDK 包，在 Expo 与 React Native 应用中访问设备和系统功能。
---

# Expo SDK 参考

> 如果你要找的页面在此 SDK 版本中不存在，它可能已被弃用，或已加入更新的 SDK 版本。

Expo SDK 是一组软件包，用于访问设备和系统功能，例如相机、通讯录、位置、传感器、触觉反馈等。每个包针对一项具体功能，可以独立使用。只要安装了 `expo` 包，所有这些包都可以在任意 React Native 应用中使用。

你可以使用 [`npx expo install`](/more/expo-cli#install) 命令安装任意 Expo SDK 包。例如，下面的命令会安装三个不同的包：

:::tabs
:::tab npm
```sh
npx expo install expo-camera expo-contacts expo-sensors
```
:::
:::tab yarn
```sh
yarn expo install expo-camera expo-contacts expo-sensors
```
:::
:::tab pnpm
```sh
pnpm expo install expo-camera expo-contacts expo-sensors
```
:::
:::tab bun
```sh
bun expo install expo-camera expo-contacts expo-sensors
```
:::
:::

安装一个或多个包之后，就可以在 JavaScript 代码中导入它们：

```ts
import { CameraView } from 'expo-camera';
import { Contact } from 'expo-contacts';
import { Gyroscope } from 'expo-sensors';
```

这样你就可以调用 [`Contact.getAll()`](/versions/latest/sdk/contacts#getalloptions) 读取设备上的通讯录、读取陀螺仪传感器以检测设备移动，或打开手机相机拍照。

## 所有 Expo SDK 包都可在任意 React Native 应用中使用

Expo 应用就是 React Native 应用，因此只要安装并配置了 `expo` 包，所有 Expo SDK 包都可以在任意 React Native 应用中使用。创建支持 Expo SDK 包的 React Native 应用，最简单的方式是使用 `create-expo-app`。你也可以用 `npx install-expo-modules` 命令，为已有的 React Native 应用添加 Expo SDK 支持。

:::tabs
:::tab npm
```sh
# 创建一个名为 my-app 的项目
npx create-expo-app my-app --template bare-minimum
```
:::
:::tab yarn
```sh
# 创建一个名为 my-app 的项目
yarn create expo-app my-app --template bare-minimum
```
:::
:::tab pnpm
```sh
# 创建一个名为 my-app 的项目
pnpm create expo-app my-app --template bare-minimum
```
:::
:::tab bun
```sh
# 创建一个名为 my-app 的项目
bun create expo my-app --template bare-minimum
```
:::
:::

**在已有 React Native 应用中安装 Expo SDK 包**

了解如何为使用 `npx @react-native-community/cli@latest init` 创建的项目配置 Expo SDK 包。

[在已有 React Native 应用中安装 Expo SDK 包](/bare/installing-expo-modules)

**使用库**

了解如何在项目中安装 Expo SDK 包。

[使用库](/workflow/using-libraries)

## 使用预发布版本

新的 Expo SDK 版本每年发布三次。在这些正式版本之间，我们会发布 `expo` 包以及所有 Expo SDK 包的预发布版本。预发布版本不被视为稳定版本，仅建议在你能够接受遇到 bug 或其他问题的风险时使用。

### Canary 版本

Canary 版本是发布时 `main` 分支状态的快照。Canary 包版本名中包含 `-canary`，以及日期和提交哈希，例如 `58.0.0-canary-20260909-ea7a89a`。安装最新 Canary 版本：

:::tabs
:::tab npm
```sh
# 安装 expo 及其相关包的 alpha 版本
npm install expo@canary && npx expo install --fix
```
:::
:::tab yarn
```sh
# 安装 expo 及其相关包的 alpha 版本
yarn add expo@canary && yarn expo install --fix
```
:::
:::tab pnpm
```sh
# 安装 expo 及其相关包的 alpha 版本
pnpm add expo@canary && pnpm expo install --fix
```
:::
:::tab bun
```sh
# 安装 expo 及其相关包的 alpha 版本
bun add expo@canary && bun expo install --fix
```
:::
:::

你通常可以将各个包的预发布版本与 Expo SDK 的稳定版本一起使用。Canary 质量的版本偶尔可能出现不兼容或其他问题。如果你选择使用 Canary 包，并已确认它适合你的使用场景，可以[关闭依赖校验警告](/more/expo-cli#configuring-dependency-validation)。

### Beta 版本

在每次 Expo SDK 发布之前，我们会发布 `expo` 包以及所有 Expo SDK 包的 beta 版本。Beta 版本比 Canary 版本稳定得多，我们鼓励开发者在自己的应用中试用并反馈。Beta 版本在 npm 上使用 `beta` 标签，并遵循相关[更新日志](https://expo.dev/changelog)文章中的说明。

## 每个 Expo SDK 版本都依赖一个 React Native 版本

> 本页包含一张兼容性表，列出各 Expo SDK 版本所对应的 React Native 版本。

### 补充信息

<details>
<summary>Expo SDK 跟踪 React Native 发布的策略</summary>

- 每个 Expo SDK 版本针对单一 React Native 版本。这通常是发布时的最新稳定版本。
- React Native 目前每年发布六次，并力求每次发布都不包含破坏性变更。
- Expo SDK 的发布节奏力求与此保持一致。
- 即将发布的 Expo SDK 预发布版本会很快加入对最新 React Native 版本的支持，通常在 React Native 发布当天即可提供。Expo SDK 团队的一名成员会参与每次 React Native 的发布团队，负责持续更新 Expo 仓库中的 React Native 版本、验证兼容性，并将回归问题反馈给 React Native 团队。

</details>

<details>
<summary>如果我需要最新 React Native 版本中的某项改动，而它尚未进入 Expo SDK 发布版，该怎么办？</summary>

React Native 发布团队中的 Expo 工程师会确保任何紧急修复都包含在最新 Expo SDK 所使用的 React Native 版本中。如果你需要的特定修复不会被拣选进现有版本——可能因为它不被视为关键修复，或因为它包含破坏性变更——那么你有两个选择：

1. 使用 [`patch-package`](https://github.com/ds300/patch-package) 引入该修复。
2. 使用 [Expo SDK 的预发布版本](#使用预发布版本)。

</details>

<details>
<summary>我能否将较旧的 React Native 版本与最新的 Expo SDK 一起使用？</summary>

Expo SDK 中的包旨在支持该 SDK 所针对的 React Native 版本。通常它们不支持更旧的 React Native 版本，但也可能支持。当新的 React Native 版本发布时，最新的 Expo SDK 包通常会更新以支持它。不过，这可能需要数周或更长时间，具体取决于该版本中变更的范围。

</details>

## 对 Android 与 iOS 版本的支持

每个 Expo SDK 版本都支持 Android 和 iOS 的最低操作系统版本。对于 Android，会定义 `compileSdkVersion`，它告诉 [Gradle](https://developer.android.com/studio/build) 使用哪个 Android SDK 版本来编译应用。这也意味着你可以使用该 SDK 版本以及更早版本中包含的 Android API 功能。对于 iOS，[Xcode](https://developer.apple.com/news/upcoming-requirements/) 会指明编译应用时要使用的最低 Xcode SDK 版本。

> 本页包含一张表，列出各 Expo SDK 版本所支持的最低 Android 与 iOS 系统版本。

在决定是否升级 Expo SDK 版本时，请同时考虑 Expo 的 SDK 版本和应用商店提交要求，如上表所述。Google Play Store 与 Apple App Store 会定期提高新应用提交所需的最低操作系统版本和 API 级别。Expo 无法控制应用商店的要求，你应查看 [Google](https://developer.android.com/studio/build) 与 [Apple](https://developer.apple.com/news/upcoming-requirements/) 了解当前的商店提交要求。
