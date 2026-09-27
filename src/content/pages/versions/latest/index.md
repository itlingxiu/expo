---
title: Expo SDK 参考
description: 通过 Expo SDK 软件包为 Expo 与 React Native 应用提供设备与系统功能。
---

# Expo SDK 参考

Expo SDK 是一组提供设备与系统能力的软件包 —— 相机、联系人、定位、传感器、触觉反馈等等。每个包只针对一个功能，可以单独使用。只要应用中安装了 `expo` 包，任何软件包都可以在任意 React Native 应用中使用。

## 安装软件包

使用 [`npx expo install`](/more/expo-cli#install) 安装，例如一次安装三个软件包：

```sh
npx expo install expo-camera expo-contacts expo-sensors
```

然后在 JavaScript 中导入：

```tsx
import { CameraView } from 'expo-camera';
import { Contact } from 'expo-contacts';
import { Gyroscope } from 'expo-sensors';
```

这样就能调用 [`Contact.getAll()`](/versions/latest/sdk/contacts#getalloptions) 读取设备联系人、通过陀螺仪检测运动、启动相机拍照等。

## 所有 SDK 包都可用于任意 React Native 应用

Expo 应用本身就是 React Native 应用，因此 SDK 包在任意安装了 `expo` 并完成配置的 RN 应用中都能使用。`create-expo-app` 是最简单的上手方式；现有的 React Native 项目可以通过 `npx install-expo-modules` 添加支持。

```sh
# 创建一个名为 my-app 的项目
npx create-expo-app my-app --template bare-minimum
```

相关链接：

- [在现有 React Native 应用中安装 Expo SDK 包](/bare/installing-expo-modules)
- [使用第三方库](/workflow/using-libraries)

## 使用预发布版本

Expo SDK 每年发布三个版本；在正式版之间，`expo` 与 SDK 包会发布预发布版本。预发布版本不稳定，可能存在 bug。

### Canary 版本

Canary 是 `main` 分支的快照，版本号带有 `-canary` 加日期与提交哈希，例如 `57.0.0-canary-20260526-13e89ca`。

```sh
# 安装 expo 及其相关包的 alpha 版本
npm install expo@canary && npx expo install --fix
```

单个包的预发布版本通常可以与稳定版 SDK 混用，但可能出现不兼容；确认一切正常后，可以[关闭依赖校验警告](/more/expo-cli#configuring-dependency-validation)。

### Beta 版本

Beta 在每个 SDK 正式发布前推出，比 Canary 稳定得多，使用 npm 的 `beta` 标签，并会在[变更日志](https://expo.dev/changelog)中公告。

## 每个 Expo SDK 版本依赖特定的 React Native 版本

| Expo SDK 版本 | React Native 版本 | React 版本 | React Native Web 版本 | React Native TV 版本 | 最低 Node.js 版本 |
| --- | --- | --- | --- | --- | --- |
| 57.0.0 | 0.86 | 19.2.3 | 0.21.0 | 0.86-stable | 22.13.x |
| 56.0.0 | 0.85 | 19.2.3 | 0.21.0 | 0.85-stable | 20.19.x |
| 55.0.0 | 0.83 | 19.2.0 | 0.21.0 | 0.83-stable | 20.19.x |
| 54.0.0 | 0.81 | 19.1.0 | 0.21.0 | 0.81-stable | 20.19.x |

### 更多说明

**Expo SDK 跟进 React Native 版本的政策**

- 每个 SDK 版本对应一个 React Native 版本，通常是发布时最新的稳定版。
- React Native 每年发布六个版本，目标是每个版本都不引入破坏性变更。
- Expo SDK 的发布节奏尽量与之保持一致。
- 预发布 SDK 会迅速支持最新的 React Native，通常在同一天完成。每个周期都有一名 Expo SDK 团队成员加入 React Native 发布团队，保持仓库中的 RN 版本最新、验证兼容性并上报回归问题。

**如果我需要最新 React Native 的某个改动，但 Expo SDK 还没有包含它怎么办？**

Expo 工程师会确保紧急修复进入最新 SDK 所用的 RN 版本。如果某个特定修复不会被移植（例如非关键或破坏性改动），有两种选择：使用 [`patch-package`](https://github.com/ds300/patch-package)，或者使用[预发布版本的 Expo SDK](#使用预发布版本)。

**能否在最新的 Expo SDK 中使用旧版 React Native？**

SDK 包面向其 SDK 对应的 React Native 版本，通常不支持旧版本（尽管有时可以）。当 React Native 发布新版本时，SDK 包通常会更新以支持它，视改动规模可能需要数周或更长时间。

## Android 与 iOS 版本支持

每个 SDK 版本都有最低的 Android 和 iOS 版本要求。在 Android 上，`compileSdkVersion` 告诉 [Gradle](https://developer.android.com/studio/build) 用哪个 Android SDK 编译，从而获得该 API 级别及更低级别的访问权限。在 iOS 上，[Xcode](https://developer.apple.com/news/upcoming-requirements/) 表示编译所用的最低 SDK。

| Expo SDK 版本 | Android 版本 | `compileSdkVersion` | `targetSdkVersion` | iOS 版本 | Xcode 版本 |
| --- | --- | --- | --- | --- | --- |
| 57.0.0 | 7+ | 36 | 36 | 16.4+ | 26.4+ |
| 56.0.0 | 7+ | 36 | 36 | 16.4+ | 26.4+ |
| 55.0.0 | 7+ | 36 | 36 | 15.1+ | 26.2+ |
| 54.0.0 | 7+ | 36 | 36 | 15.1+ | 16.1+ |

考虑升级 SDK 时，需要同时考虑 Expo 的版本和上表中的应用商店提交要求。Google Play 与 Apple App Store 会周期性提高新提交的最低系统版本和 API 级别要求 —— 这不是 Expo 能控制的，请查看 [Google](https://developer.android.com/studio/build) 和 [Apple](https://developer.apple.com/news/upcoming-requirements/) 的当前要求。

**选择版本的关键要点：** 用上面两张表匹配你的目标 React Native 版本、Node 版本以及系统/Xcode 最低要求；为了商店合规和平台支持，两者都应升级。
