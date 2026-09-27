---
title: DocumentPicker 包参考
description: 提供系统界面、以便从用户设备上的可用提供方选择文档的库。
---

# DocumentPicker 包参考

`expo-document-picker` 提供系统界面，用于从用户设备上的可用提供方选择文档。

> 支持平台：Android、iOS、Web、Expo Go。

> 本页包含一段文档选择器的演示。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-document-picker
```
:::
:::tab yarn
```sh
yarn expo install expo-document-picker
```
:::
:::tab pnpm
```sh
pnpm expo install expo-document-picker
```
:::
:::tab bun
```sh
bun expo install expo-document-picker
```
:::
:::

## 在应用配置中配置

如果你的项目使用配置插件（[持续原生生成（CNG）](/workflow/continuous-native-generation)），可以使用内置的[配置插件](/config-plugins/introduction)来配置 `expo-document-picker`。该插件允许你配置若干无法在运行时设置的属性，这些属性需要重新构建应用二进制文件后才会生效。如果应用**没有**使用 CNG，则需要手动配置此库。

如果要启用 [iCloud 存储功能](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_icloud-services)，请按[配置属性](/versions/latest/config/app#usesicloudstorage)中的说明，在[应用配置](/workflow/configuration)文件中把 `expo.ios.usesIcloudStorage` 键设为 `true`。

在本地运行 [EAS Build](/build/introduction) 时，会使用 [iOS 功能签名](/build-reference/ios-capabilities) 在构建前启用所需功能。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-document-picker",
        {
          "iCloudContainerEnvironment": "Production"
        }
      ]
    ]
  }
}
```

### 可配置属性

| 属性 | 平台 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `iCloudContainerEnvironment` | iOS | `undefined` | 设置用于 AdHoc iOS 构建的 iOS `com.apple.developer.icloud-container-environment` 授权。可能的值：`Development`、`Production`。见 [eas-cli issue #693，关于内部分发构建](https://github.com/expo/eas-cli/issues/693)。 |
| `kvStoreIdentifier` | iOS | `undefined` | 覆盖默认的 iOS `com.apple.developer.ubiquity-kvstore-identifier` 授权，该授权使用你的 Apple Team ID 和 Bundle Identifier。如果应用在启用 iCloud 存储后被转移到另一个 Apple Team，可能需要此项。 |

不使用 [EAS Build](/build/introduction)、但又想要 [iCloud 存储功能](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_icloud-services) 的应用，必须为其 Bundle Identifier [手动配置](/build-reference/ios-capabilities#manual-setup) [**带 CloudKit 支持的 iCloud 服务**](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_icloud-container-environment)。

如果通过 [Apple Developer Console](/build-reference/ios-capabilities#apple-developer-console) 启用 **iCloud** 功能，请务必在 `ios/[app]/[app].entitlements` 文件中加入以下授权（其中 `dev.expo.my-app` 是你的 Bundle Identifier）：

```xml
<key>com.apple.developer.icloud-container-identifiers</key>
<array>
    <string>iCloud.dev.expo.my-app</string>
</array>
<key>com.apple.developer.icloud-services</key>
<array>
    <string>CloudDocuments</string>
</array>
<key>com.apple.developer.ubiquity-container-identifiers</key>
<array>
    <string>iCloud.dev.expo.my-app</string>
</array>
<key>com.apple.developer.ubiquity-kvstore-identifier</key>
<string>$(TeamIdentifierPrefix)dev.expo.my-app</string>
```

Apple Developer Console 还要求创建一个 **iCloud Container**。注册新容器时，系统会要求你提供容器的描述和标识符。描述可以填写任意名称。标识符请添加 `iCloud.<your_bundle_identifier>`（与 `com.apple.developer.icloud-container-identifiers` 和 `com.apple.developer.ubiquity-container-identifiers` 授权使用的值相同）。

## 与 `expo-file-system` 一起使用

将 `expo-document-picker` 与 [`expo-file-system`](/versions/latest/sdk/filesystem) 一起使用时，文件系统并不总是能在 `expo-document-picker` 选中文件后立即读取该文件。

要让 `expo-file-system` 在文件被选中后立即读取，需要确保 [`copyToCacheDirectory`](#documentpickeroptions) 选项设为 `true`。

## API

```js
import * as DocumentPicker from 'expo-document-picker';
```
