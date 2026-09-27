---
title: iOS 应用扩展
description: 了解如何通过 EAS Build 使用应用扩展来添加自定义功能。
---

# iOS 应用扩展

应用扩展让你把自定义功能和内容延伸到应用之外，使用户在与其他应用或 iOS 系统功能交互时也能使用它们。EAS Build 为[现有 React Native 项目](/bare/overview)和使用[持续原生生成（CNG）](/workflow/continuous-native-generation)的项目都提供了包含应用扩展的支持。

## CNG 项目（实验性支持）

一个典型、简单的持续原生生成（CNG）项目只有一个应用 target，没有应用扩展。你可以通过编写[配置插件](/config-plugins/introduction)（或使用自带配置插件来创建扩展的库）把应用扩展加到项目中。配置插件可以在构建任务的“预构建”阶段，向生成的 Xcode 项目添加 target。

在应用配置中用 `extra.eas.build.experimental.ios.appExtensions` 声明应用扩展后，EAS CLI 就能在**构建开始之前**（Xcode 项目生成之前）知道存在哪些应用扩展，从而确保生成并校验所需的凭据。配置插件也可以修改应用配置。多数情况下，如果你使用的库会添加扩展，它的配置插件也会把声明该扩展所需的配置写进应用配置。如果你正在编写库，建议考虑这一点。下面是直接在 **app.json** 中声明时的示例：

```json app.json
{
  "expo": {
    ...
    "extra": {
      "eas": {
        "build": {
          "experimental": {
            "ios": {
              "appExtensions": [
                {
                  "targetName": "myappextension",
                  "bundleIdentifier": "com.myapp.extension",
                  "entitlements": {
                    "com.apple.example": "entitlement value"
                  }
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

## 现有 React Native 项目

构建现有 React Native 项目时，EAS CLI 会自动检测 Xcode 项目中配置的应用扩展，并为每个 target 生成全部必要凭据；你也可以在 **credentials.json** 中自行提供。更多信息参见[多 target 项目](/app-signing/local-credentials#multi-target-project)。
