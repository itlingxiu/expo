---
title: 构建 TV 应用
description: 了解如何使用 Expo 构建 Android TV 或 Apple TV 应用。
---

# 构建 TV 应用

:::warning
并非所有 Expo 功能与 SDK 库都在 TV 上可用。参见下方受支持的库一节。
:::

React Native 通过相关的 [React Native TV 项目](https://github.com/react-native-tvos/react-native-tvos)在 Android TV 与 Apple TV 上运行。该项目被描述为超出 TV 范畴 —— 一个核心仓库的 fork，用 Hermes 与 Fabric 支持手机与 TV 目标。把 TV 库作为 `react-native` 依赖，一个 Expo 项目就可以同时面向移动端（Android、iOS）与 TV（Android TV、Apple TV）。

## 所需的原生项目改动

原生 Android/iOS 编辑很少，使用 [prebuild](/more/glossary-of-terms#prebuild) 时可以由 [config-tv 配置插件](https://github.com/react-native-tvos/config-tv/tree/main/packages/config-tv)自动完成。插件的改动（也可以手动完成）：

### Android

- **AndroidManifest.xml** —— 移除默认的手机竖屏方向；添加 TV 所需的 intent。
- **MainApplication.kt** —— 移除不受支持的 Flipper 调用。

### iOS

- **ios/Podfile** —— 重定向到 tvOS 而不是 iOS。
- Xcode 项目 —— 重定向到 tvOS 而不是 iOS。
- 启动屏（**SplashScreen.storyboard**）—— 为 tvOS 调整。

## TV 开发的系统要求

### Android TV

#### 前置条件

- **Node.js（LTS）** —— 在 macOS 或 Linux 上安装（[nodejs.org](https://nodejs.org/en/)）。
- **Android Studio（Iguana 或以后）** —— 所需版本。
- **Android TV 系统镜像** —— 在 SDK manager 中选择 Android SDK 下拉框（API 31+），安装 Android TV 系统镜像；Apple silicon 用 ARM 64，否则用 Intel x86_64。
- **Android TV 模拟器** —— 用该镜像创建一个，流程与手机模拟器相同。

### Apple TV

#### 前置条件

- **Node.js（LTS）** —— 在 macOS 上（[nodejs.org](https://nodejs.org/en/)）。
- **Xcode 16 或以后**。
- **tvOS SDK 17 或以后** —— 不会随 Xcode 自动捆绑；之后通过 `xcodebuild -downloadAllPlatforms` 安装。

## 快速开始

最快的路径是 Expo 示例仓库中的 [TV 示例](https://github.com/expo/examples/tree/master/with-tv)：

```sh
# npm
npx create-expo-app MyTVProject -e with-tv

# yarn
yarn create expo-app MyTVProject -e with-tv

# pnpm
pnpm create expo-app MyTVProject -e with-tv

# bun
bun create expo MyTVProject -e with-tv
```

或者从 [TV Router 示例](https://github.com/expo/examples/tree/master/with-router-tv)开始：

```sh
# npm
npx create-expo-app MyTVProject -e with-router-tv

# yarn
yarn create expo-app MyTVProject -e with-router-tv

# pnpm
pnpm create expo-app MyTVProject -e with-router-tv

# bun
bun create expo MyTVProject -e with-router-tv
```

router 版本使用 [Expo Router](/router/introduction) 进行基于文件的路由，仿照 [create-expo-app 默认模板](/get-started/create-a-project)。

#### 查看哪些库受支持

TV 上受支持的库/API（每个都链接到其 SDK 页面）：

[AppleAuthentication](/versions/latest/sdk/apple-authentication)、[Application](/versions/latest/sdk/application)、[Audio](/versions/latest/sdk/audio)、[Asset](/versions/latest/sdk/asset)、[AsyncStorage](/versions/latest/sdk/async-storage)、[AV](/versions/v54.0.0/sdk/av)、[BackgroundTask](/versions/latest/sdk/background-task)、[BlurView](/versions/latest/sdk/blur-view)、[BuildProperties](/versions/latest/sdk/build-properties)、[Constants](/versions/latest/sdk/constants)、[Crypto](/versions/latest/sdk/crypto)、[DevClient](/versions/latest/sdk/dev-client)、[Device](/versions/latest/sdk/device)、[Expo UI](/versions/latest/sdk/ui)、[FileSystem](/versions/latest/sdk/filesystem)、[FlashList](/versions/latest/sdk/flash-list)、[Font](/versions/latest/sdk/font)、[GlassEffect](/versions/latest/sdk/glass-effect)、[Image](/versions/latest/sdk/image)、[ImageManipulator](/versions/latest/sdk/imagemanipulator)、[KeepAwake](/versions/latest/sdk/keep-awake)、[LinearGradient](/versions/latest/sdk/linear-gradient)、[Localization](/versions/latest/sdk/localization)、[Manifests](/versions/latest/sdk/manifests)、[MediaLibrary](/versions/latest/sdk/media-library)、[NetInfo](/versions/latest/sdk/netinfo)、[Network](/versions/latest/sdk/network)、[Reanimated](/versions/latest/sdk/reanimated)、[SafeAreaContext](/versions/latest/sdk/safe-area-context)、[SecureStore](/versions/latest/sdk/securestore)、[Skia](/versions/latest/sdk/skia)、[SplashScreen](/versions/latest/sdk/splash-screen)、[SQLite](/versions/latest/sdk/sqlite)、[Svg](/versions/latest/sdk/svg)、[SystemUI](/versions/latest/sdk/system-ui)、[TaskManager](/versions/latest/sdk/task-manager)、[TrackingTransparency](/versions/latest/sdk/tracking-transparency)、[Updates](/versions/latest/sdk/updates)、[Video](/versions/latest/sdk/video)、[VideoThumbnails](/versions/latest/sdk/video-thumbnails)。

TV 也可以与 [React Navigation](https://reactnavigation.org/)、[React Native Skia](https://shopify.github.io/react-native-skia/) 及其他常见第三方 RN 库配合使用；更多见 [React Native directory](https://reactnative.directory/?tvos=true)。

### 限制

- [Expo DevClient](/versions/latest/sdk/dev-client) 仅从 SDK 54 起受支持：
  - **Android TV**：一切正常，与 Android 手机相当。
  - **Apple TV**：使用本地或隧道 packager 的基本操作；EAS 认证、EAS 构建列表与更新列表尚不受支持。

## 与现有 Expo 项目集成

### 为 TV 修改依赖

在 **package.json** 中，把 `react-native` 指向 TV 仓库。

#### SDK 56 及以后

```json
{
  ...
  "dependencies": {
    ...
    "react-native": "npm:react-native-tvos@0.85-stable"
    ...
  }
}
```

`react-native-tvos` 版本必须与 Expo SDK 对应 —— SDK 56 搭配 React Native 0.85，因此是 `0.85-stable`。参见 [SDK 兼容性表](/versions/latest#each-expo-sdk-version-depends-on-a-react-native-version)。从 SDK 56 起，升级项目 SDK 也会升级 TV 仓库依赖。

#### SDK 55 及更早

你必须把 `react-native` 从 [`npx expo install` 版本校验](/more/expo-cli#configuring-dependency-validation)中排除：

```json
{
  ...
  "dependencies": {
    ...
    "react-native": "npm:react-native-tvos@0.83-stable"
    ...
  },
  "expo": {
    "install": {
      "exclude": ["react-native"]
    }
  }
}
```

SDK 55 搭配 React Native 0.83，因此是 `0.83-stable`；参见[兼容性表](/versions/latest#each-expo-sdk-version-depends-on-a-react-native-version)。

:::note
（SDK 55 或更早的升级）`react-native-tvos` 版本"必须手动升级"，`npx expo install expo@latest --fix` 不会升级它。
:::

:::note
（monorepo）如果 monorepo 中的一个项目为 TV 转换，所有项目都应切换到 RN TV 包 —— 即使不面向 TV 的项目 —— 以避免依赖冲突，同时仍完全支持移动端开发。
:::

### 添加 TV 配置插件

```sh
# npm
npx expo install @react-native-tvos/config-tv -- --dev

# yarn
yarn expo install @react-native-tvos/config-tv -- --dev

# pnpm
pnpm expo install @react-native-tvos/config-tv -- --dev

# bun
bun expo install @react-native-tvos/config-tv -- --dev
```

安装后，当 `EXPO_TV` 环境变量等于 `1`，或 `isTV` 插件参数为 `true` 时，插件会把项目转换为 TV。

确认插件列在 **app.json** 中：

```json
{
  "plugins": ["@react-native-tvos/config-tv"]
}
```

关于 prebuild 期间插件动作的更多细节，在 prebuild 前设置[调试环境变量](https://github.com/debug-js/debug#conventions)（另见 [Expo CLI 环境变量](/more/expo-cli#environment-variables)）：

```sh
# See all Expo CLI and config plugin debug information
export DEBUG=expo:*

# See only debug information for the TV plugin
export DEBUG=expo:react-native-tvos:config-tv
```

### 运行 prebuild

设置 `EXPO_TV` 并 prebuild 以应用 TV 改动：

```sh
export EXPO_TV=1
npx expo prebuild --clean
```

:::note
推荐使用 `--clean`；当项目已有 Android 与 iOS 目录时它是必需的。
:::

### 为 Android TV 构建

启动 Android TV 模拟器，然后：

```sh
# npm
npx expo run:android

# yarn
yarn expo run:android

# pnpm
pnpm expo run:android

# bun
bun expo run:android
```

### 为 Apple TV 构建

在 Apple TV 模拟器上构建/运行：

```sh
# npm
npx expo run:ios

# yarn
yarn expo run:ios

# pnpm
pnpm expo run:ios

# bun
bun expo run:ios
```

### 撤销 TV 改动并为手机构建

取消 `EXPO_TV` 并再次 prebuild，回到手机开发：

```sh
unset EXPO_TV
npx expo prebuild --clean
```

### 为 TV 与手机创建 EAS Build profile

因为 TV 构建由环境变量驱动，同一份源码可以产出 TV 或手机 profile。下面的 **eas.json** 示例把 `development` 与 `preview` 扩展为 `development_tv` 与 `preview_tv`：

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "base": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk",
        "withoutCredentials": true
      },
      "channel": "base"
    },
    "development": {
      "extends": "base",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "buildConfiguration": "Debug"
      },
      "channel": "development"
    },
    "development_tv": {
      "extends": "development",
      "env": {
        "EXPO_TV": "1"
      },
      "channel": "development"
    },
    "preview": {
      "extends": "base",
      "channel": "preview"
    },
    "preview_tv": {
      "extends": "preview",
      "env": {
        "EXPO_TV": "1"
      },
      "channel": "preview"
    }
  },
  "submit": {}
}
```

### tvOS App Store 构建的凭据

tvOS 与 iOS 及其他 Apple 平台共享 bundle ID 与分发证书，但它的 provisioning profile 不同。由于 EAS 工具（Web 与 CLI）只制作 iOS provisioning profile，tvOS 项目需要额外步骤 —— 两种选择：

1. **仅 tvOS 项目**：凭据保留在 EAS 中。像 iOS 一样在项目站点创建 bundle ID 并上传分发证书。然后用 EAS 创建的 bundle ID 在 Apple 开发者站点创建 tvOS provisioning profile，下载后上传到 [EAS 项目凭据页面](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/credentials/)。参见[应用凭据指南](/app-signing/app-credentials)。
2. **同时面向 tvOS 与 iOS**：tvOS 使用[本地凭据](/app-signing/local-credentials)，因为 iOS 构建需要 EAS 存储的凭据。

## 示例与演示项目

- [IgniteTV](https://github.com/react-native-tvos/IgniteTV) —— 用 Ignite CLI 生成；可面向移动端或 TV 构建。
- [SkiaMultiplatform](https://github.com/react-native-tvos/SkiaMultiplatform) —— React Native Skia 跨移动端、TV 与 Web。
- [NativewindMultiplatform](https://github.com/react-native-tvos/NativewindMultiplatform) —— TailwindCSS 样式跨移动端、TV 与 Web。
