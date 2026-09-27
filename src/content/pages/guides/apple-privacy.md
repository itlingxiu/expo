---
title: 隐私清单
description: 了解如何为移动应用配置 iOS 隐私清单。
---

# 隐私清单

如果你使用的原生 iOS 库调用了“受限原因”API，就需要配置 iOS 隐私清单，声明为何包含调用这些 API 的原生代码。

更多细节以及“必需原因”API 列表见 [Apple 开发者文档](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)。

:::note
本指南中的信息与步骤仍在完善中，可能因针对此用途的新工具或 Apple 的新要求而变化。
:::

## 什么是隐私清单？

隐私清单是包含在 iOS 原生项目中、名为 **PrivacyInfo.xcprivacy** 的文件。该文件用于声明应用为何包含调用 Apple 视为敏感的某些 API 的原生代码。

这些 API 目前包括访问 UserDefaults、文件时间戳、系统启动时间、磁盘空间以及当前键盘。Apple 将其视为开放列表，未来可能会扩展。

## 在应用配置中配置

你可以在应用配置的 `expo.ios` 下使用 `privacyManifests` 字段来包含 iOS 隐私清单。

```json app.json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    /* @hide 省略 ... */ /* @end */
    "ios": {
      "privacyManifests": {
        "NSPrivacyAccessedAPITypes": [
          {
            "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryUserDefaults",
            "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
          }
        ]
      }
    }
  }
}
```

请使用 `npx expo install --fix` 将 Expo SDK 库更新到当前 SDK 版本的最新版本。

对于[现有 React Native 项目](/bare/overview)，可以在 Xcode 中创建 **PrivacyInfo.xcprivacy** 文件并将其添加到 iOS 应用 target，从而包含 iOS 隐私清单。按照 [Apple 的隐私清单文件](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)指南创建 **PrivacyInfo.xcprivacy** 文件。

你可以通过查阅 [Apple 开发者文档](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api) 来确定 `NSPrivacyAccessedAPITypes` 与 `NSPrivacyAccessedAPITypeReasons` 的取值。

### 为 Expo SDK 包与其他第三方库包含必需原因

目前，Apple 无法正确解析静态 CocoaPods 依赖（例如 Expo SDK 包与其他生态库）所包含的全部 **PrivacyInfo** 文件。你可能需要在应用的 **PrivacyInfo.xcprivacy** 文件或 **app.json** 配置中，为这些依赖所使用的 API 包含必需原因。

所有使用“必需原因”API 的 Expo SDK 包都会在包目录中包含 **PrivacyInfo** 文件。这是 `expo-application` 库附带的[示例文件](https://github.com/expo/expo/blob/main/packages/expo-application/ios/PrivacyInfo.xcprivacy)。

你通常可以通过检查打算使用的库在 **node_modules/package_name/ios** 目录中是否有 **PrivacyInfo.xcprivacy** 文件，来确定其他第三方库所使用 API 的必需原因。如果有，可以查看该文件中的 `NSPrivacyAccessedAPITypes` 与 `NSPrivacyAccessedAPITypeReasons` 值，并将这些值复制到你的配置中。

另一种做法是：在你提交缺少隐私清单文件或特定原因的构建后，Apple 会通知开发者。你可以等到收到 Apple 的通知邮件，然后把邮件中列出的必需原因加入应用的 **PrivacyInfo.xcprivacy** 文件（如果你不使用 [CNG](/workflow/continuous-native-generation)）或 **app.json** 配置中。

## 测试隐私清单

你可以通过构建应用并提交来测试隐私清单，无论是走 App Store 审核流程，还是提交到 TestFlight 的外部审核。如果你的应用缺少所用 API 的任何必需原因，Apple 会在提交后几分钟内给你发邮件。
