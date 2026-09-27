---
title: 构建配置过程
description: 了解 EAS CLI 如何为 EAS Build 配置项目。
---

# 构建配置过程

本指南说明当你用 `eas build:configure`（或 `eas build`，若项目尚未配置，它会运行同一过程）让 EAS CLI 配置项目时会发生什么。

EAS CLI 在配置项目时会执行以下步骤：

1. 询问要配置的平台

   第一次运行该命令时，它会初始化你的 EAS 项目，并询问你要配置哪些平台。如果只想在单一平台上使用 EAS Build，完全可以。如果之后改变主意，可以回来配置另一个平台。

   ![终端中运行 eas build 命令，可选择 Android 和 iOS 平台](/static/images/eas-build/configure/01-configure-platform.webp)

2. 创建 eas.json

   该命令会在根目录创建带有默认配置的 **eas.json** 文件。它大致如下：

   ```json eas.json
   {
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal"
       },
       "production": {}
     }
   }
   ```

   如果你有[现有 React Native 项目](/bare/overview)，它看起来会稍有不同。

   这就是你的 EAS Build 配置。它为每个平台定义了三个构建 profile，名称分别为 `"development"`、`"preview"` 和 `"production"`（你可以有多个构建 profile，例如 `"production"`、`"debug"`、`"testing"` 等）。想进一步了解 **eas.json**，参见[使用 **eas.json** 进行配置](/build/eas-json)。

3. 配置项目

   这一步因项目类型而异。

   1. 初始化完成

      至此，项目已初始化为与 EAS Build 兼容。

      ![eas build:configure 中初始化步骤完成的提示](/static/images/eas-build/configure/02-initialization-complete.webp)

   2. Expo 项目

      如果尚未在 **app.json** 中配置 `android.package` 和/或 `ios.bundleIdentifier`，EAS CLI 会在你创建第一次构建时提示你指定它们。

      - `android.package` 会用作 Android 应用 ID，用于在 Google Play Store 上标识你的应用
      - `ios.bundleIdentifier` 会用于在 Apple App Store 上标识你的应用

      ![eas build:configure 中的应用标识符提示](/static/images/eas-build/configure/03-configure-app-ids.png)

      在上面的示例中，`eas build --platform android` 命令会提示设置 Android 应用 ID。如果使用 `--platform ios` 运行该命令，它会提示你设置 iOS bundle identifier。

   3. 现有 React Native 项目

      现有 React Native 项目没有额外步骤。

4. 后续步骤

   把项目配置为与 EAS Build 兼容，需要做的就是这些。如果你在 **eas.json** 中把 `cli.requireCommit` 设为 `true`，还有一步：系统会提示你提交我们为你所做的全部更改。你可以在提交前先审阅它们，也可以自行指定 git 提交说明，或使用默认说明。
