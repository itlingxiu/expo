---
title: 应用版本管理
description: 了解不同的版本类型，以及如何远程或在本地管理它们。
---

# 应用版本管理

Android 和 iOS 各自暴露两个值来标识应用版本：商店中可见的版本（面向用户的版本），以及仅开发者可见的版本（面向开发者的构建版本）。本指南说明如何远程或在本地管理这些版本。

> 视频：[自动应用版本管理](https://www.youtube.com/watch?v=Gk7RHDWsLsQ)。在这段 Expo 功能聚焦视频中，你将了解 Expo EAS Build 中的自动应用版本管理。

## 应用版本

在 Expo 项目中，可以用[应用配置](/workflow/configuration)文件中的以下属性定义应用版本。

| 属性 | 说明 |
| --- | --- |
| [`version`](/versions/latest/config/app#version) | 商店中可见的面向用户版本。在 Android 上，它对应 **android/app/build.gradle** 中的 `versionName`。在 iOS 上，它对应 **Info.plist** 中的 `CFBundleShortVersionString`。 |
| [`android.versionCode`](/versions/latest/config/app#versioncode) | Android 面向开发者的构建版本。它对应 **android/app/build.gradle** 中的 `versionCode`。 |
| [`ios.buildNumber`](/versions/latest/config/app#buildnumber) | iOS 面向开发者的构建版本。它对应 **Info.plist** 中的 `CFBundleVersion`。 |

### 在应用中使用应用版本

要在应用内显示面向用户的版本，可以使用 `expo-application` 库中的 [`Application.nativeApplicationVersion`](/versions/latest/sdk/application#applicationnativeapplicationversion)。

要在应用内显示面向开发者的构建版本，可以使用 `expo-application` 库中的 [`Application.nativeBuildVersion`](/versions/latest/sdk/application#applicationnativebuildversion)。

## 推荐工作流

### 面向用户的版本

进行生产发布时，面向用户的版本应由你显式设置并更新。当生产构建提交到应用商店时，你可以更新应用配置中的 `version` 属性。如果你的项目使用 `expo-updates` 并采用自动运行时版本策略，这一点同样适用。这标志着应用新版本的新开发周期开始。进一步了解[部署模式](/eas-update/deployment-patterns)。

### 面向开发者的构建版本

对于面向开发者的构建版本，你可以设置为每次构建自动递增。这有助于避免每次向 Play Store 测试渠道或 TestFlight 上传新归档时都手动修改项目。应用商店拒绝的一个常见原因是提交了版本号重复的构建。当开发者在创建新构建之前忘记递增面向开发者的构建版本号时，就会发生这种情况。

如果你选择使用[`remote` 版本来源](#远程版本来源)（这是推荐行为），EAS Build 可以通过为你递增这些版本，帮助自动管理面向开发者的构建版本。你也可以选择使用 `local` 应用版本来源，这意味着你在各自的配置文件中手动控制版本。

## 远程版本来源

:::note
从 EAS CLI `12.0.0` 版本起，`remote` 版本来源是推荐行为。
:::

EAS 服务器可以远程存储并管理应用面向开发者的构建版本（`android.versionCode` 和 `ios.buildNumber`）。要启用它，需要在 **eas.json** 中把 `cli.appVersionSource` 设为 `remote`。然后在 `production` 构建 profile 下，可以把 `autoIncrement` 属性设为 `true`。

```json eas.json
{
  "cli": {
    // 应用版本来源设为 `remote`，以便存储并管理应用版本。
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      // ...
    },
    "preview": {
      // ...
    },
    "production": {
      // `autoIncrement` 设为 `true`，以自动递增 `android.versionCode` 和 `ios.buildNumber`。
      "autoIncrement": true
    }
  }
  // ...
}
```

远程版本会用本地项目中的值初始化。例如，如果应用配置中 `android.versionCode` 设为 `1`，当你使用远程版本来源创建新构建时，它会自动递增到 `2`。不过，如果应用配置中没有设置构建版本，第一次创建构建时远程版本会以 `1` 初始化。

当 **eas.json** 中启用了 `remote` 版本属性时，应用配置中存储的构建版本值会被忽略，并且在远程递增版本时不会更新。运行构建时，远程版本来源的值会设置到原生项目上，这些值被视为这些字段的事实来源。你可以安全地从应用配置中移除这些值。

### 把已定义的版本同步到远程

有些情况下，你已经为项目设置了版本，并希望在创建新的 EAS Build 时从这些版本继续递增。不过，这些现有版本可能尚未与 EAS 远程同步。其中一些情况是：

- 你已经在应用商店发布了应用，并希望继续使用相同的版本号。
- EAS CLI 无法检测应用当前的版本。
- 出于其他原因，你显式设置了版本，例如写在应用配置中。

在这些情况下，可以用 EAS CLI 按以下步骤把当前版本同步到 EAS Build：

- 在终端窗口中运行以下命令：

  ```sh
  $ eas build:version:set
  ```

- 出现提示时选择平台（Android 或 iOS）。
- 当提示 **Do you want to set app version source to remote now?** 时，选择 **yes**。这会在 **eas.json** 中把 `cli.appVersionSource` 设为 `remote`。
- 当提示 **What version would you like to initialize it with?** 时，输入你在应用商店中设置的最后一个版本号。

完成这些步骤后，应用版本会远程同步到 EAS Build。现在你可以在 **eas.json** 中把 `build.production.autoIncrement` 设为 `true`。创建新的生产构建时，`versionCode` 和 `buildNumber` 会自动递增。

### 把版本从远程同步到本地

要在 Android Studio 或 Xcode 中使用与 EAS 远程存储相同的版本在本地构建项目，用以下命令用远程版本更新本地项目：

```sh
$ eas build:version:sync
```

### 限制

- Android 上的 `eas build:version:sync` 命令不支持带有多个 flavor 的[现有 React Native 项目](/bare/overview)。不过，远程版本管理的其余功能应适用于所有项目。
- `autoIncrement` 不支持 `version` 选项。
- 如果你使用 EAS Update，并且运行时策略设为 `"runtimeVersion": { "policy": "nativeVersion" }`，则不支持。若要类似行为，请改用 `"appVersion"` 策略。

## 本地版本来源

你可以配置项目，使项目版本的事实来源就是本地项目源代码本身。为此，在 **eas.json** 中把 `cli.appVersionSource` 设为 `local`。

采用此设置时，EAS 会按原样读取应用版本值并构建项目。它不会写入项目。你也可以在构建 profile 上设置 `autoIncrement` 选项，在本地启用自动递增版本。

```json eas.json
{
  "cli": {
    // 应用版本来源设为 `local`，由你手动管理应用版本。
    "appVersionSource": "local"
  },
  "build": {
    "development": {
      // ...
    },
    "preview": {
      // ...
    },
    "production": {
      // `autoIncrement` 设为 `true`，以自动递增 `android.versionCode` 和 `ios.buildNumber`。
      "autoIncrement": true
    }
  }
  // ...
}
```

对于[现有 React Native 项目](/bare/overview)，原生代码中的值优先。`expo-constants` 和 `expo-updates` 库从应用配置文件读取值。如果你依赖清单中的版本值，应让它们与原生代码保持同步。如果你使用 EAS Update，并且运行时策略设为 `"runtimeVersion": { "policy": "nativeVersion" }`，保持这些值同步尤其重要，因为版本不匹配可能导致更新被投递到错误的应用版本。建议使用 [`expo-application`](/versions/latest/sdk/application#constants) 读取版本，而不是依赖应用配置中的值。

### 限制

- 使用 `autoIncrement` 时，如果你希望版本变更持久保存，每次构建都需要提交更改。在 CI 上构建时，协调这一点可能很困难。
- 对于 Gradle 配置支持多个 flavor 的现有 React Native 项目，EAS CLI 无法读取或修改版本，因此不支持 `autoIncrement` 选项，版本也不会列在 [expo.dev](https://expo.dev) 的构建详情页上。
