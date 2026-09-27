---
title: 管理不同的应用版本
description: 了解面向开发者与面向用户的应用版本，以及 EAS Build 如何自动管理面向开发者的版本。
---

# 管理不同的应用版本

在本章中，我们将学习 EAS Build 如何自动管理 Android 和 iOS 上面向开发者的应用版本。在接下来两章进入生产构建之前，先了解这一点会很有帮助。

[观看视频：自动化应用版本号](https://www.youtube.com/watch?v=C8x4N9UmzS8) —— 理解面向开发者与面向用户的应用版本，以及 EAS Build 如何为你自动化版本管理。

---

## 理解面向开发者与面向用户的应用版本

一个应用版本由两个值组成：

- 面向开发者的值：Android 用 [`versionCode`](/versions/latest/config/app#versioncode) 表示，iOS 用 [`buildNumber`](/versions/latest/config/app#buildnumber) 表示。
- 面向用户的值：由 **app.config.js** 中的 [`version`](/versions/latest/config/app#version) 表示。

Google Play Store 和 Apple App Store 都依赖面向开发者的值来识别每一次唯一构建。例如，如果我们上传的应用版本是 `1.0.0 (1)`（面向用户的值与面向开发者的值的组合），就不能再向应用商店提交另一个相同应用版本的构建。提交重复的应用版本号会导致提交失败。

下面用 **app.config.js** 中的 `android.versionCode` 和 `ios.buildNumber` 演示如何手动管理面向开发者的值。**我们不必手动添加或管理这些值，因为 EAS Build 会为我们自动化这一点**。

```js app.config.js
{
  ios: {
    buildNumber: 1
    // ...
  },
  android: {
    versionCode: 1
  }
  // ...
}
```

:::note
[面向用户的版本号](/build-reference/app-versions#user-facing-version)不由 EAS 处理。我们会在把生产应用提交审核之前，在应用商店的开发者门户中定义它。
:::

## 用 EAS Build 自动管理应用版本

默认情况下，EAS Build 会协助自动化面向开发者的值。它使用[远程版本源](/build-reference/app-versions#remote-version-source)，在每次制作新的生产发布时自动递增面向开发者的值。

当我们用 `eas init` 命令初始化项目时，EAS CLI 会自动在 **eas.json** 中添加以下属性：

- `cli.appVersionSource`，设置为 `remote`
- [`build.production.autoIncrement`](/eas/json#autoincrement-1)，设置为 `true`

可以在项目的 **eas.json** 中查看它们：

```json eas.json
{
  "cli": {
    // ...
    // appVersionSource 设置为 remote。
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      // autoIncrement 设置为 true，以自动递增 versionCode 或 buildNumber。
      "autoIncrement": true
    }
  }
  // ...
}
```

在接下来两章创建新的生产构建时，Android 的 `versionCode` 和 iOS 的 `buildNumber` 会自动递增。

<details>
<summary>把已发布应用的面向开发者版本同步到 EAS</summary>

如果应用已经在应用商店发布，面向开发者的应用版本已经设置好了。把这个应用迁移到 EAS Build 时，按以下步骤同步这些应用版本：

- 在终端窗口中运行 `eas build:version:set` 命令：

```sh
eas build:version:set
```

- 在提示时选择平台（Android 或 iOS）。
- 当提示 **Do you want to set app version source to remote now?** 时，选择 **yes**。这会把 **eas.json** 中的 `cli.appVersionSource` 设为 `remote`。
- 当提示 **What version would you like to initialize it with?** 时，输入你在应用商店中设置的最后一个版本号。

完成这些步骤后，应用版本会远程同步到 EAS Build。可以在 **eas.json** 中把 `build.production.autoIncrement` 设为 `true`。之后创建新的生产构建时，`versionCode` 和 `buildNumber` 会从此自动递增。

</details>

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
