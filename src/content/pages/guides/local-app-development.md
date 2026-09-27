---
title: 在本地创建调试构建
description: 在自己的机器上为 Expo 应用创建调试构建的指引。
---

# 在本地创建调试构建

## 前置条件

- **Android Studio** —— 设置 Android Studio 以在本地编译/运行 Android 项目：[设置你的环境（Android）](/get-started/set-up-your-environment?platform=android&device=physical&mode=development-build&buildEnv=local#set-up-an-android-device-with-a-development-build)
- **Xcode** —— 设置 Xcode 以在本地编译/运行 iOS 项目：[设置你的环境（iOS）](/get-started/set-up-your-environment?platform=ios&device=physical&mode=development-build&buildEnv=local#set-up-an-ios-device-with-a-development-build)

在本地构建需要先手动生成原生代码，才能测试调试构建或制作可上架的生产构建。本页介绍两种本地构建方式，并指向相关指南。

## 本地应用编译

Expo CLI 编译命令会生成 **android** 与 **ios** 目录：

```sh
# npm
# Build native Android project
npx expo run:android
# Build native iOS project
npx expo run:ios

# yarn
# Build native Android project
yarn expo run:android
# Build native iOS project
yarn expo run:ios

# pnpm
# Build native Android project
pnpm expo run:android
# Build native iOS project
pnpm expo run:ios

# bun
# Build native Android project
bun expo run:android
# Build native iOS project
bun expo run:ios
```

这些命令使用你本地安装的 Android SDK 或 Xcode 生成调试构建。每个命令做两件事：编译并把原生二进制安装到你的设备/模拟器上，然后启动 Metro 提供你的 JavaScript/TypeScript 代码。

- 如果 **android** 与 **ios** 还不存在，命令会先运行 `npx expo prebuild`；如果存在则跳过该步骤。
- 添加 `--device` 选择目标 —— 一台物理连接的设备或模拟器。
- `--variant release`（Android）或 `--configuration Release`（iOS）生成[生产构建](/deploy/build-project#release-builds-locally)。此类构建未签名，不能提交到应用商店；签名在[本地应用生产](/guides/local-app-production)中介绍。
- **仅 Android**：从 SDK 54 起，`--variant debugOptimized` 加快开发迭代 —— 参见 [Expo CLI 参考中的 Android 编译](/more/expo-cli#compiling-android)。

### 首次构建之后：使用 `npx expo start`

一旦编译并安装完成，仅 JS/TS 的改动不需要重新构建 —— 单独启动 Metro：

```sh
# npm
npx expo start

# yarn
yarn expo start

# pnpm
pnpm expo start

# bun
bun expo start
```

在终端中按 **A**（Android）或 **I**（iOS）打开已安装的应用；Metro 无需重新编译原生代码即可提供更新后的 bundle，因此加载只需几秒而不是几分钟。

| 命令 | 用途 | 何时使用 |
| --- | --- | --- |
| `npx expo run:android` / `npx expo run:ios` | 编译原生代码、安装应用、启动 Metro。 | 首次构建、添加原生库之后、或更改配置插件之后。 |
| `npx expo start` | 只启动 Metro。 | 只有 JS/TS 改动的日常开发。 |

首次构建之后更改项目配置或原生代码，意味着用 `npx expo run:android|ios` 重新构建。再次运行 `npx expo prebuild` 会把改动叠加到现有文件上，构建后的结果可能不同。为避免这种情况，新项目把原生目录加入 gitignore；`npx expo prebuild --clean` 删除并重新生成它们（参见 [`--clean` 标志](/workflow/continuous-native-generation#clean)）。使用[应用配置](/workflow/configuration)或[配置插件](/develop/config-plugins/introduction)修改配置或原生代码。

延伸阅读：

- [使用 Expo CLI 编译](/more/expo-cli#compiling) —— run 命令如何在本地编译，以及可用参数。
- [Prebuild](/workflow/continuous-native-generation) —— 原生代码在编译前如何生成。

## 使用 `expo-dev-client` 的本地构建

安装 `expo-dev-client` 会让调试构建包含它的 UI 与工具 —— 这些称为开发构建：

```sh
# npm
npx expo install expo-dev-client

# yarn
yarn expo install expo-dev-client

# pnpm
pnpm expo install expo-dev-client

# bun
bun expo install expo-dev-client
```

使用[本地应用编译](#local-app-compilation)命令（`npx expo run:[android|ios]`）创建一个，它们会构建调试构建并启动开发服务器。参见 [expo-dev-client 简介](/develop/development-builds/introduction)。

## 使用 Android product flavor 的本地构建

对于使用不同 application ID 的多个 flavor 的自定义 Android 项目，`npx expo run:android` 接受 `--variant` 与 `--app-id` 控制构建与启动行为。

`--variant` 在 **debug** 与 **release** 之间切换构建类型，也可以用 camelCase 组合 product flavor 与构建类型。使用 [**free** 与 **paid** flavor](https://developer.android.com/build/build-variants#change-app-id) 构建开发版本：

```sh
# npm
npx expo run:android --variant freeDebug

npx expo run:android --variant paidDebug

# yarn
yarn expo run:android --variant freeDebug

yarn expo run:android --variant paidDebug

# pnpm
pnpm expo run:android --variant freeDebug

pnpm expo run:android --variant paidDebug

# bun
bun expo run:android --variant freeDebug

bun expo run:android --variant paidDebug
```

`--app-id` 以自定义的 application ID 启动构建好的应用。如果 **free** flavor 使用 `applicationIdSuffix ".free"` 或 `applicationId "dev.expo.myapp.free"`：

```sh
# npm
npx expo run:android --variant freeDebug --app-id dev.expo.myapp.free

# yarn
yarn expo run:android --variant freeDebug --app-id dev.expo.myapp.free

# pnpm
pnpm expo run:android --variant freeDebug --app-id dev.expo.myapp.free

# bun
bun expo run:android --variant freeDebug --app-id dev.expo.myapp.free
```

> 你可以自定义 Android 构建类型，但这与 Expo 假设 **release** 是生产构建类型相冲突；不同的构建类型可能产出未经优化的代码。

## 使用 EAS 的本地构建

[在你自己的基础设施上运行构建](/build-reference/local-builds) —— 如何通过 `--local` 标志在你自己的基础设施或本地运行 EAS Build。
