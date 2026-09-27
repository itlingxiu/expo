---
title: 用 eas.json 配置 EAS Submit
description: 了解如何用 eas.json 为 EAS Submit 配置项目。
---

# 用 eas.json 配置 EAS Submit

**eas.json** 是 EAS CLI 与各项服务的配置文件。它在项目中第一次运行 [`eas build:configure` 命令](/build/setup#配置项目)时生成，位于项目根目录、与 **package.json** 相邻。虽然使用 EAS Submit 并不强制要求 **eas.json**，但如果你需要在不同配置之间切换，它会让事情更容易。

## 生产 profile

运行 `eas submit` 时如果不指定 profile 名称，并且 **eas.json** 中已定义 `production` profile，就会用它来配置提交。如果 `production` profile 中没有值，EAS CLI 会以交互方式提示你提供这些值。

下面的 `production` profile 是在 CI/CD 流程（例如 [EAS Workflows](/eas/workflows/introduction)）中运行 Android 和 iOS 提交所必需的：

```json eas.json
{
  "cli": {
    "version": ">= 0.34.0"
  },
  "submit": {
    "production": {
      "android": {
        "track": "internal"
      },
      "ios": {
        "ascAppId": "your-app-store-connect-app-id"
      }
    }
  }
}
```

进一步了解你可以设置的值：[Android 专用选项](/eas/json#android-specific-options-1)和 [iOS 专用选项](/eas/json#ios-specific-options-1)。你也可以了解如何提交到 [Apple App Store](/submit/ios) 和 [Google Play Store](/submit/android)。

## 多个 profile

`submit` 下的 JSON 对象可以包含多个提交 profile。如下例所示，`submit` 下的每个 profile 都可以使用任意名称：

```json eas.json
{
  "cli": {
    "version": "SEMVER_RANGE", // 所需的 EAS CLI 版本范围
    "requireCommit": false // 为 true 时，确保构建前所有更改都已提交。默认为 false
  },
  "build": {
    // EAS Build 配置
    // ...
  },
  "submit": {
    "SUBMIT_PROFILE_NAME_1": {
      // 任意名称，用作标识符
      "android": {
        // Android 专用配置
        // ...ANDROID_OPTIONS
      },
      "ios": {
        // iOS 专用配置
        // ...IOS_OPTIONS
      }
    },
    "SUBMIT_PROFILE_NAME_2": {
      // 任意名称，用作标识符
      "extends": "SUBMIT_PROFILE_NAME_1",
      "android": {
        // Android 专用配置
        // ...ANDROID_OPTIONS
      }
    }
    // ...
  }
}
```

当你选择一次构建进行提交时，系统会选用该构建所用的 profile。如果该 profile 不存在，则选择默认的 `production` profile。

你也可以用 EAS CLI 通过参数指定另一个 `submit` profile，例如：

```sh
# 把 <profile-name> 替换为 eas.json 中的某个提交 profile
$ eas submit --platform ios --profile <profile-name>
```

## 在 `submit` profile 之间共享配置

`submit` profile 可以用 `extends` 键扩展另一个 profile。

例如，在 `preview` profile 中可以有 `"extends": "production"`。这样 `preview` profile 会继承 `production` profile 的配置。

只要避免循环依赖，就可以把 profile 扩展链起来，最深 5 层。

## 下一步

- [EAS Submit schema 参考](/eas/json#eas-submit)：了解 EAS Submit 可用的属性，以及如何在项目中配置并覆盖它们的默认行为。
