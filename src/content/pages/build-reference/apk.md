---
title: 为 Android 模拟器和设备构建 APK
description: 了解使用 EAS Build 时，如何配置并安装用于 Android 模拟器和设备的 .apk。
---

# 为 Android 模拟器和设备构建 APK

用 EAS Build 构建 Android 应用时，默认文件格式是 [Android App Bundle](https://developer.android.com/platform/technology/app-bundle)（AAB/**.aab**）。该格式针对分发到 Google Play Store 做了优化。不过，AAB 不能直接安装到设备上。要把构建直接安装到 Android 设备或模拟器，需要改为构建 [Android Package](https://en.wikipedia.org/wiki/Android_application_package)（APK/**.apk**）。

## 配置用于构建 APK 的 profile

要生成 **.apk**，请修改 [**eas.json**](/build/eas-json)，在某个构建 profile 中添加以下属性之一：

- 把 `developmentClient` 设为 `true`（**默认**）
- 把 `distribution` 设为 `internal`
- 把 `android.buildType` 设为 `apk`
- 把 `android.gradleCommand` 设为 `:app:assembleRelease`、`:app:assembleDebug`、[`:app:assembleDebugOptimized`](/more/expo-cli#compiling-android)（SDK 54 及更高版本可用），或任何其他会产出 **.apk** 的 Gradle 命令

```json eas.json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview3": {
      "developmentClient": true
    },
    "preview4": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

现在可以用下面的命令运行构建：

```sh
$ eas build -p android --profile preview
```

profile 的名称可以随意取。我们把 profile 命名为 `preview`。你也可以叫它 `local`、`emulator`，或任何对你最合适的名字。

## 安装构建

### 模拟器（虚拟设备）

> 如果还没有安装或运行过 Android 模拟器，请先阅读 [Android Studio 模拟器指南](/workflow/android-studio-emulator)再继续。

构建完成后，CLI 会提示你自动下载并安装到 Android 模拟器。出现提示时，按 <kbd>Y</kbd> 即可直接安装到模拟器。

如果有多次构建，也可以随时运行 `eas build:run` 命令，下载某一次构建并自动安装到 Android 模拟器：

```sh
$ eas build:run -p android
```

该命令还会列出项目中可用的构建。你可以从列表中选择要安装到模拟器的构建。列表中的每次构建都包含构建 ID、自构建创建以来经过的时间、构建号、版本号和 git 提交信息。如果项目中有无效构建，列表也会显示它们。

例如，下图列出了某个项目的构建：

![运行 eas build:run 命令后，显示项目中可用构建的列表。](/static/images/eas-build/eas-build-run-on-android.png)

构建安装完成后，它会出现在主屏幕上。如果这是开发构建，打开一个终端窗口，运行 `npx expo start` 启动开发服务器。

#### 运行最新构建

向 `eas build:run` 命令传入 `--latest` 标志，即可把最新构建下载并安装到 Android 模拟器：

```sh
$ eas build:run -p android --latest
```

### 真机

#### 直接下载到设备

- 构建完成后，从构建详情页复制 APK 的 URL，或使用 `eas build` 完成时提供的链接。
- 把该 URL 发到你的设备。可以用电子邮件，方式由你决定。
- 在设备上打开该 URL，安装 APK 并运行。

#### 用 `adb` 安装

- 如果尚未安装 [adb](https://developer.android.com/studio/command-line/adb)，请先安装。
- 把设备连接到电脑，如果尚未启用，请[在设备上启用 adb 调试](https://developer.android.com/studio/command-line/adb#Enabling)。
- 构建完成后，从构建详情页或 `eas build` 完成时提供的链接下载 APK。
- 运行 `adb install path/to/the/file.apk`。
- 在设备上运行应用。
