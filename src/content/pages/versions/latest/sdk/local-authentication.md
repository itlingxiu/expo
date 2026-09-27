---
title: LocalAuthentication 包参考
description: 提供指纹 API（Android）或 Face ID 与 Touch ID（iOS）的库，通过面部或指纹扫描对用户进行身份验证。
---

# LocalAuthentication 包参考

> 支持平台：Android、iOS、Expo Go。

`expo-local-authentication` 让你使用生物识别提示（Android）或 Face ID 与 Touch ID（iOS），通过指纹或面部扫描对用户进行身份验证。

## 已知限制

### iOS

Expo Go 不支持 iOS 的 Face ID 身份验证。你需要创建[开发构建](/develop/development-builds/introduction)才能测试 Face ID。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-local-authentication
```
:::
:::tab yarn
```sh
yarn expo install expo-local-authentication
```
:::
:::tab pnpm
```sh
pnpm expo install expo-local-authentication
```
:::
:::tab bun
```sh
bun expo install expo-local-authentication
```
:::
:::

## 在应用配置中配置

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-local-authentication`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

```json
{
  "expo": {
    "plugins": [
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID."
        }
      ]
    ]
  }
}
```

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `faceIDPermission` | `"Allow $(PRODUCT_NAME) to use Face ID"` | 仅 iOS。用于设置 [`NSFaceIDUsageDescription`](#permission-nsfaceidusagedescription) 权限提示文案的字符串。如果应用不使用 Face ID，把它设为 `false`，即可从 **Info.plist** 中省略 `NSFaceIDUsageDescription`。 |

<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>

如果你没有使用连续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动维护原生 **ios** 项目，则需要在 **ios/[app]/Info.plist** 中添加 `NSFaceIDUsageDescription` 键：

```xml
<key>NSFaceIDUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to use FaceID</string>
```

</details>

## API

```js
import * as LocalAuthentication from 'expo-local-authentication';
```

## 权限

### Android

以下权限会通过这个库的 **AndroidManifest.xml** 自动添加：

| Android 权限 | 说明 |
| --- | --- |
| `USE_BIOMETRIC` | 允许应用使用设备支持的生物识别方式。 |
| `USE_FINGERPRINT` | 警告：此常量在 API 级别 28 中已弃用。应用应改为请求 `USE_BIOMETRIC`。 |

### iOS

这个库使用以下用途描述键：

| Info.plist 键 | 说明 |
| --- | --- |
| `NSFaceIDUsageDescription` | 向用户说明应用为何请求使用 Face ID 进行身份验证的消息。警告：如果应用使用访问 Face ID 的 API，则必须提供此键。 |
