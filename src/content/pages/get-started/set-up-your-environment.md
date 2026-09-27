---
title: 设置开发环境
description: 了解如何为 Android 和 iOS 设置 Expo 开发环境。
---

# 设置开发环境

本页介绍如何设置开发环境，以便使用 Expo 在本地开发和测试 Android、iOS 应用。

## 在哪里开发

- **真机（推荐）**：在真实设备上开发，能最直接地感受应用的实际表现与性能。
- **模拟器/仿真器**：在电脑上运行 Android 模拟器（emulator）或 iOS 模拟器（simulator），无需真机也能开发。

## 如何开发

在 Expo 中开发应用有两种方式：

- **Expo Go**：一个用于快速体验 Expo 的「沙盒」应用，适合学生和学习者快速上手。它功能有限，不适合生产环境。
- **开发构建（Development Build）**：你自己应用的构建版本，包含 Expo 的开发者工具。它支持自定义原生模块，是生产开发的推荐方式。

## Android 设备

:::tabs
:::tab 使用 Expo Go

从 Google Play 商店下载并安装 [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=docs)。

:::
:::tab 开发构建（EAS）

1. 全局安装 EAS CLI：

   ```sh
   npm install --global eas-cli
   ```

2. 创建并登录 [Expo 账户](https://expo.dev/signup)。
3. 在项目目录中运行以下命令配置 EAS：

   ```sh
   eas build:configure
   ```

4. 构建 Android 开发构建：

   ```sh
   eas build --platform android --profile development
   ```

5. 构建完成后，用设备扫描二维码即可安装。

:::
:::tab 开发构建（本地）

1. 安装 JDK：
   - macOS：`brew install --cask zulu@17`
   - Windows：`choco install -y microsoft-openjdk17`
   - Linux：安装 OpenJDK 17
2. （可选）安装 [Watchman](https://facebook.github.io/watchman/) —— 仅 SDK 55 及更早版本需要。
3. 安装 [Android Studio](https://developer.android.com/studio)。
4. 设置 `ANDROID_HOME` 环境变量并添加到 `PATH`。
5. 在项目中安装 `expo-dev-client`：

   ```sh
   npx expo install expo-dev-client
   ```

6. 在设备上开启 USB 调试：在「关于手机」中连续点击版本号七次启用开发者选项。
7. 用 `adb devices` 验证设备已连接。
8. 运行：

   ```sh
   npx expo run:android
   ```

:::
:::

## Android 模拟器

安装 Android Studio 时使用设置向导（Setup Wizard，选择 Standard 安装类型），勾选 **Android SDK Platform 36** 和 **Sources for Android 36**（位于 Android 16 (Baklava) 下），以及 Build-Tools 和 Android Emulator。

:::note
编译 React Native 应用需要 Android 16 SDK。
:::

创建模拟器：打开 **More Actions > Virtual Device Manager > Create virtual device**，建议选择 Pixel 设备。

- **使用 Expo Go**：在终端按 `A`，Expo CLI 会自动安装 Expo Go。
- **开发构建（EAS）**：按 `Y` 自动安装构建产物。
- **开发构建（本地）**：运行 `npx expo run:android`。

## iOS 设备

:::tabs
:::tab 使用 Expo Go

1. 需要一个有效的 [Apple Developer Program](https://developer.apple.com/programs/) 订阅。
2. 运行以下命令，通过 TestFlight 安装 Expo Go：

   ```sh
   npx eas-cli@latest go
   ```

3. 在 App Store Connect 中将你的 Apple ID 添加为内部测试员。
4. Expo Go 仅在 Expo CLI 与 Expo Go 登录同一 Expo 账户时才会打开本地项目，因此先运行：

   ```sh
   npx expo login
   ```

:::
:::tab 开发构建（EAS）

1. 需要一个有效的 [Apple Developer Program](https://developer.apple.com/programs/) 订阅。
2. 全局安装 EAS CLI 并登录 Expo 账户：

   ```sh
   npm install --global eas-cli
   ```

3. 在项目目录中运行：

   ```sh
   eas build:configure
   ```

4. 为设备创建临时（ad hoc）配置文件：

   ```sh
   eas device:create
   ```

5. 构建 iOS 开发构建：

   ```sh
   eas build --platform ios --profile development
   ```

6. 用设备扫描二维码安装。
7. 安装后，在「设置 > 隐私与安全性」中启用开发者模式（Developer Mode），按提示重启设备。

:::
:::tab 开发构建（本地）

1. 从 Mac App Store 安装 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)。
2. 在 Xcode 的 Settings > Locations 中安装 Command Line Tools。
3. 在 Xcode > Settings > Components 中安装 iOS 模拟器。
4. 安装 Watchman（仅 SDK 55 及更早版本需要）：

   ```sh
   brew install watchman
   ```

5. 在项目中安装 `expo-dev-client`：

   ```sh
   npx expo install expo-dev-client
   ```

6. 通过 USB 连接设备，并在设备上点击「信任」。
7. 启用开发者模式（Developer Mode）。
8. 在 **app.json** 中为 `ios.bundleIdentifier` 设置一个唯一的标识符。
9. 运行：

   ```sh
   npx expo run:ios --device
   ```

:::
:::

## iOS 模拟器

与 iOS 设备相同，需要安装 Xcode、Command Line Tools、iOS 模拟器以及 Watchman（SDK 55 及更早版本需要）。

- **使用 Expo Go**：在终端按 `I`。
- **开发构建（EAS）**：在 **eas.json** 的开发构建 profile 中设置 `"ios": { "simulator": true }`，然后运行 `eas build --platform ios --profile development`，构建完成后按 `Y` 安装。
- **开发构建（本地）**：运行 `npx expo run:ios`。

## 备注

- `npx expo run:android` / `npx expo run:ios` 会同时启动开发服务器（Development Server），因此可以跳过 `npx expo start`。

## 疑难排查

### Android Studio 无法识别 Homebrew 安装的 JDK

如果 Android Studio 无法识别通过 Homebrew 安装的 JDK，可以在 **~/.gradle/gradle.properties** 中配置 JDK 路径。
