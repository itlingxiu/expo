---
title: 开发工具
description: 在构建应用的整个过程中会用到的 Expo 工具与网站概览。
---

# 开发工具

开始新 Expo 项目时，熟悉一些必备工具和网站会让应用开发事半功倍。本页介绍一组推荐工具。

## Expo CLI

创建项目时随 `expo` 包自动附带的开发工具，通过 `npx`（Node.js 包运行器）调用。它的作用是让你在开发中更快推进 —— 通常第一次交互就是运行 `npx expo start` 启动开发服务器。

常用命令：

| 命令 | 说明 |
| --- | --- |
| `npx expo start` | 启动开发服务器（无论是开发构建还是 Expo Go）。 |
| `npx expo prebuild` | 使用 [Prebuild](/workflow/continuous-native-generation) 生成原生 Android 和 iOS 目录。 |
| `npx expo run:android` | 本地编译原生 Android 应用。 |
| `npx expo run:ios` | 本地编译原生 iOS 应用。 |
| `npx expo install package-name` | 安装新库；加上 `--fix` 选项可校验并更新项目中的特定库。 |
| `npx expo lint` | [安装并配置](/guides/using-eslint) ESLint。若已配置，则[检查项目文件](/guides/using-eslint#用法)。 |

简而言之，CLI 让你可以开发、编译、启动应用等。更多选项见 [Expo CLI 参考](/more/expo-cli)。

## EAS CLI

用于登录你的 Expo 账户，并通过 EAS 服务（Build、Update、Submit）编译你的应用。它还可以：

- 将应用发布到应用商店
- 创建应用的开发、预览或生产构建
- 创建 OTA（Over-the-Air）更新
- 管理应用凭据
- 为 iOS 设备创建临时（ad hoc）配置文件

全局安装：

:::tabs
:::tab npm
```sh
npm install --global eas-cli
```
:::
:::tab yarn
```sh
yarn global add eas-cli
```
:::
:::tab pnpm
```sh
pnpm add --global eas-cli
```
:::
:::tab bun
```sh
bun add --global eas-cli
```
:::
:::

使用 `eas --help` 查看可用命令。完整参考见 [`eas-cli` npm 页面](https://www.npmjs.com/package/eas-cli)。

## Expo Doctor

用于诊断 Expo 项目问题的命令行工具。在项目根目录运行：

:::tabs
:::tab npm
```sh
npx expo-doctor
```
:::
:::tab yarn
```sh
yarn dlx expo-doctor
```
:::
:::tab pnpm
```sh
pnpm dlx expo-doctor
```
:::
:::tab bun
```sh
bunx expo-doctor
```
:::
:::

它会检查分析代码库中的常见问题，包括[应用配置](/workflow/configuration)与 **package.json** 文件、依赖兼容性、配置文件以及项目整体健康状态，然后输出结果。发现问题时，它会描述问题并给出修复建议或求助渠道。

默认情况下，它会对照 [React Native directory](https://reactnative.directory/) 校验包，并在存在原生目录时检查应用配置属性是否正确同步。这些检查可在 **package.json** 中配置 —— 见 [`reactNativeDirectoryCheck`](/versions/latest/config/package-json#reactnativedirectorycheck) 与 [`appConfigFieldsNotSyncedCheck`](/versions/latest/config/package-json#appconfigfieldsnotsyncedcheck)。用法信息：`npx expo-doctor --help`。

## Orbit

一个支持 macOS、Windows 和 Linux 的应用，可用于：

- 在真机和模拟器上安装并启动来自 EAS 的构建
- 在 Android 模拟器或 iOS 模拟器上安装并启动来自 EAS 的更新
- 在 Android 模拟器或 iOS 模拟器上启动 Snack 项目
- 使用本地文件安装并启动应用。Orbit 支持任意 Android **.apk**、iOS 模拟器兼容的 **.app** 或 ad hoc 签名应用
- 查看 EAS 仪表盘中置顶的项目列表

### 安装

#### macOS

通过 Homebrew 下载，或直接从 [GitHub releases](https://github.com/expo/orbit/releases) 下载。

```sh
brew install expo-orbit
```

要让 Orbit 开机自启，点击菜单栏中的 Orbit 图标，然后进入 **Settings** 并勾选 **Launch on Login**。

#### Windows

直接从 [GitHub releases](https://github.com/expo/orbit/releases) 下载 Windows 版 Orbit。

#### Linux

从 [GitHub releases](https://github.com/expo/orbit/releases) 下载。提供 `.deb`（Debian 与 Ubuntu）和 `.rpm`（Fedora 与 RHEL）两种包。

:::note
Orbit 在 macOS、Windows 和 Linux 上依赖 Android SDK；仅在 macOS 上依赖 `xcrun` 进行设备管理，因此需要先配置好 [Android Studio](/workflow/android-studio-emulator) 与 [Xcode](/workflow/ios-simulator)。
:::

## Expo Tools for VS Code

一个 VS Code 扩展，为应用配置文件提供自动补全与智能提示，覆盖应用配置、EAS 配置、商店配置以及 Expo Module 配置文件。

[安装 Expo Tools VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools) —— 点击链接安装，或在 VS Code 中搜索 "Expo Tools"。

它还支持通过 VS Code 内置调试器调试：设置断点、检查变量、通过调试控制台执行代码等。参见[使用 VS Code 调试](/develop/debugging/tools#debugging-with-vs-code)。

## 用 Snack 和 Expo Go 测试原型

### Snack

一个浏览器内的开发环境，工作方式与 Expo Go 类似 —— 适合分享代码片段、无需本地安装任何东西即可试验 React Native。访问 [snack.expo.dev](https://snack.expo.dev/)，编辑 **App.js** 中的 `<Text>` 组件，在右侧面板选择平台（Android、iOS 或 Web），即可实时看到变化。

### Expo Go

[Expo Go](https://expo.dev/go) 是一个免费、开源的试验场，面向想试玩 React Native 的学生和学习者，支持 Android 和 iOS。

使用方法：

- 打开[设置开发环境指南](/get-started/set-up-your-environment?mode=expo-go)
- 在 **Where would you like to develop?** 下选择平台
- 在 **How would you like to develop?** 下选择 Expo Go
- 按照指南的说明操作

:::note
Expo Go 功能有限，不适合构建生产级项目。请改用[开发构建（Development Build）](/get-started/set-up-your-environment?mode=development-build)。
:::

#### `expo-go` CLI

[`expo-go` CLI](https://www.npmjs.com/package/expo-go) 是一个独立工具，可下载指定平台和 SDK 版本的 Expo Go 二进制文件，或打印其下载链接。传入 SDK 版本可锁定特定版本，省略则获取最新版；指定平台可获得正确的二进制文件。

```sh
# npm
# 下载指定平台的 Expo Go
npx expo-go download android latest

# 打印下载链接而不是直接下载
npx expo-go url ios latest

# yarn
# 下载指定平台的 Expo Go
yarn dlx expo-go download android latest

# 打印下载链接而不是直接下载
yarn dlx expo-go url ios latest
```

应用会下载到当前目录，并缓存在 **~/.expo** 下。

> `expo-go` CLI 适用于 Android 设备、Android 模拟器和 iOS 模拟器。由于 Apple 的政策，iPhone 设备通常不支持侧载旧版本应用，`expo-go` CLI 也不支持。

#### 打开不支持 SDK 版本的项目会怎样？

在 Expo Go 中打开为不支持的 SDK 版本创建的项目会报错：

```text
"Project is incompatible with this version of Expo Go"
```

正确的解决办法取决于你用的是 Android 设备、iOS 真机还是模拟器。参见[排查 Expo Go 版本不匹配](/troubleshooting/expo-go-version-mismatch)。

#### 如何升级不支持 SDK 版本的项目？

参见[升级 Expo SDK 指南](/workflow/upgrading-expo-sdk-walkthrough)，了解如何升级到特定 SDK 版本。

## React Native directory

使用开发构建时，任何兼容 React Native 的库都可以在 Expo 项目中使用。[reactnative.directory](https://reactnative.directory/) 是一个可搜索的 React Native 库数据库；如果某个库不在 Expo SDK 中，可以用它寻找兼容的库。

[使用第三方库](/workflow/using-libraries) —— 介绍了 React Native 核心库、Expo SDK 库与第三方库的区别，以及如何判断第三方库的兼容性。
