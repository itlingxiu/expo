---
title: 权限
description: 了解如何在应用配置文件中配置与添加权限。
---

# 权限

需要敏感设备数据（例如位置、通讯录）的原生应用必须先请求权限。例如，访问媒体库需要调用 [`MediaLibrary.requestPermissionsAsync()`](/versions/latest/sdk/media-library)。

独立构建与[开发构建](/develop/development-builds/introduction)需要先在原生构建时配置权限，运行时 JavaScript 才能请求它们。在 [Expo Go](https://expo.dev/go) 中测试时无需这样做。

:::warning
原生权限配置不当或解释不清，"可能导致你的应用被商店拒绝或下架"。
:::

## Android

通过[应用配置](/workflow/configuration)中的 [`android.permissions`](/versions/latest/config/app) 与 [`android.blockedPermissions`](/versions/latest/config/app) 键配置。

大多数权限由库通过[配置插件](/develop/config-plugins/introduction)或包级 **AndroidManifest.xml** 自动添加。`android.permissions` 只用于默认没有附带、需要额外添加的权限。

```json app.json
{
  "android": {
    "permissions": ["android.permission.SCHEDULE_EXACT_ALARM"]
  }
}
```

移除来自包级 **AndroidManifest.xml** 的权限，唯一方式是 [`android.blockedPermissions`](/versions/latest/config/app)，使用**完整权限名**。示例 —— 去掉 `expo-camera` 添加的录音权限：

```json app.json
{
  "android": {
    "blockedPermissions": ["android.permission.RECORD_AUDIO"]
  }
}
```

- 默认的 [prebuild 模板](/workflow/continuous-native-generation)包含哪些权限，参见 [`android.permissions`](/versions/latest/config/app)。
- 使用 *dangerous* 或 *signature* 权限而没有正当理由的应用"**可能被 Google 拒绝**"；请遵循 [Android 权限最佳实践](https://developer.android.com/training/permissions/usage-notes)。
- [所有可用的 Android `Manifest.permissions`](https://developer.android.com/reference/android/Manifest.permission)。

### 在现有 React Native 应用中使用此库？

编辑 **AndroidManifest.xml** 来移除权限：在 `<use-permission>` 标签上添加 `tools:node="remove"`，这样即使库的 manifest 包含了该权限也会被移除。

```xml
<manifest xmlns:tools="http://schemas.android.com/tools">
  <uses-permission tools:node="remove" android:name="android.permission.ACCESS_FINE_LOCATION" />
</manifest>
```

:::note
必须先在 `<manifest>` 上定义 `xmlns:tools`，才能对权限使用 `tools:node`。
:::

## iOS

iOS 应用可以请求系统权限（相机、照片等）。Apple 要求解释应用如何使用这些数据。大多数包通过[配置插件](/develop/config-plugins/introduction)提供样板说明，但默认文案通常需要按你的用例定制，才能通过 App Store 审核。

使用 [`ios.infoPlist`](/versions/latest/config/app) 键设置文案：

```json app.json
{
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "This app uses the camera to scan barcodes on event tickets."
    }
  }
}
```

许多属性也可以通过添加它的库的[配置插件](/develop/config-plugins/introduction)属性直接配置。以 [`expo-media-library`](/versions/latest/sdk/media-library) 为例：

```json app.json
{
  "plugins": [
    [
      "expo-media-library",
      {
        "photosPermission": "Allow $(PRODUCT_NAME) to access your photos.",
        "savePhotosPermission": "Allow $(PRODUCT_NAME) to save photos."
      }
    ]
  ]
}
```

- **Info.plist** 的修改无法通过无线（OTA）更新送达；它们只随新的原生二进制发布，例如通过 [`eas build`](/build/introduction)。
- Apple 的[权限文案建议](https://developer.apple.com/design/human-interface-guidelines/privacy#Requesting-permission)。
- [所有可用的 **Info.plist** 属性](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html)。

### 在现有 React Native 应用中使用此库？

直接在 **Info.plist** 中添加/修改权限文案值；建议在 Xcode 中进行以获得自动补全。

## Web

`Camera` 与 `Location` 等 Web 权限需要[安全上下文](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts#When_is_a_context_considered_secure) —— `https://` 或 `http://localhost`。与 Android manifest 权限、iOS **Info.plist** 文案类似，出于隐私考虑强制执行。

## 重置权限

测试拒绝流程对优雅的应用行为很重要。Android 与 iOS 都在操作系统层面禁止对同一权限多次询问（拒绝后反复弹窗会烦扰用户）。因此，在开发中测试不同的权限流程可能需要卸载并重新安装原生应用。

在 [Expo Go](https://expo.dev/go) 中，运行 `npx expo start` 并在 [Expo CLI](/more/expo-cli) 的 Terminal UI 中按 I 或 A，即可删除并重新安装。
