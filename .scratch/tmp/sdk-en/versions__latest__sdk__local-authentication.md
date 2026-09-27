---
title: LocalAuthentication
description: A library that provides functionality for implementing the Fingerprint API (Android) or FaceID and TouchID (iOS) to authenticate the user with a face or fingerprint scan.
packageName: expo-local-authentication
---

# LocalAuthentication

> 支持平台：Android、iOS、Expo Go。

`expo-local-authentication` allows you to use the Biometric Prompt (Android) or FaceID and TouchID (iOS) to authenticate the user with a fingerprint or face scan.

## Known limitation

### iOS （iOS）

The FaceID authentication for iOS is not supported in Expo Go. You will need to create a [development build](/develop/development-builds/introduction) to test FaceID.

## Installation

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

## Configuration in app config

You can configure `expo-local-authentication` using its built-in [config plugin](/config-plugins/introduction) if you use config plugins in your project ([Continuous Native Generation (CNG)](/workflow/continuous-native-generation)). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does **not** use CNG, then you'll need to manually configure the library.

### Example app.json with config plugin

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

### Configurable properties

| Name | Default | Description |
| --- | --- | --- |
| `faceIDPermission` | `"Allow $(PRODUCT_NAME) to use Face ID"` | Only for: iOS. A string to set the [`NSFaceIDUsageDescription`](#permission-nsfaceidusagedescription) permission message. Set it to `false` to omit `NSFaceIDUsageDescription` from your **Info.plist** if your app does not use Face ID. |

<details><summary>Are you using this library in an existing React Native app?</summary>

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation)) or you're using a native **ios** project manually, then you need to add `NSFaceIDUsageDescription` key to your **ios/[app]/Info.plist**:

```xml
<key>NSFaceIDUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to use FaceID</string>
```

</details>

## API

```js
import * as LocalAuthentication from 'expo-local-authentication';
```

## Permissions

### Android

The following permissions are added automatically through this library's **AndroidManifest.xml**:

| Android permission | Description |
| --- | --- |
| `USE_BIOMETRIC` | Allows an app to use device supported biometric modalities. |
| `USE_FINGERPRINT` | Warning: This constant was deprecated in API level 28. Applications should request USE_BIOMETRIC instead |

### iOS

The following usage description keys are used by this library:

| Info.plist key | Description |
| --- | --- |
| `NSFaceIDUsageDescription` | A message that tells the user why the app is requesting the ability to authenticate with Face ID. Warning: This key is required if your app uses APIs that access Face ID. |

