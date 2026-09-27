---
title: TrackingTransparency 包参考
description: 用于跟踪应用用户并管理跟踪权限的库。
---

# TrackingTransparency 包参考

> 支持平台：Android、iOS、tvOS、Expo Go。

用于跟踪应用用户并管理跟踪权限的库。它提供对广告标识符的访问，并管理跟踪所需的权限。用于跟踪的数据示例包括电子邮件地址、设备 ID、广告 ID 等。如果设备级设置「允许 App 请求跟踪」已关闭，此权限会被拒绝。请务必在 [**Info.plist**](/versions/latest/config/app#infoplist) 中添加 `NSUserTrackingUsageDescription`，说明将如何跟踪用户。否则应用会被 Apple 拒绝。

关于 Apple 的 App Tracking Transparency 框架的更多信息，见其[文档](https://developer.apple.com/app-store/user-privacy-and-data-use/)。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-tracking-transparency
```
:::
:::tab yarn
```sh
yarn expo install expo-tracking-transparency
```
:::
:::tab pnpm
```sh
pnpm expo install expo-tracking-transparency
```
:::
:::tab bun
```sh
bun expo install expo-tracking-transparency
```
:::
:::

## 在应用配置中配置

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-tracking-transparency`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

```json
{
  "expo": {
    "plugins": [
      [
        "expo-tracking-transparency",
        {
          "userTrackingPermission": "This identifier will be used to deliver personalized ads to you."
        }
      ]
    ]
  }
}
```

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `userTrackingPermission` | `"Allow this app to collect app-related data that can be used for tracking you or your device."` | 仅 iOS。在 **Info.plist** 中设置 iOS 的 `NSUserTrackingUsageDescription` 权限提示文案。 |

要本地化这条 iOS 权限消息，请保持 `userTrackingPermission` 为默认值，并在每个[语言文件](/guides/localization#translating-app-metadata)的 `ios` 对象中添加 `NSUserTrackingUsageDescription`。Expo 会在预构建时把本地化的值写入 **InfoPlist.strings**。

<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>

如果你没有使用连续原生生成（[CNG](/workflow/continuous-native-generation)）（即手动维护原生 **android** 和 **ios** 项目），则需要在原生项目中配置以下权限：

- 对于 Android，把 `com.google.android.gms.permission.AD_ID` 权限添加到项目的 **android/app/src/main/AndroidManifest.xml**。

```xml
<uses-permission android:name="com.google.android.gms.permission.AD_ID"/>
```

- 对于 iOS，把 `NSUserTrackingUsageDescription` 键添加到项目的 **ios/[app]/Info.plist**：

```xml
<key>NSUserTrackingUsageDescription</key>
<string>Your custom usage description string here.</string>
```

</details>

## 用法

```jsx
import { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

export default function App() {
  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === 'granted') {
        console.log('Yay! I have user permission to track data');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Tracking Transparency Module Example</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## API

```ts
import * as ExpoTrackingTransparency from 'expo-tracking-transparency';
```

## 权限

### Android

以下权限会通过这个库的 **AndroidManifest.xml** 自动添加。

| Android 权限 | 说明 |
| --- | --- |
| `com.google.android.gms.permission.AD_ID` | 允许访问用于跟踪和分析的广告 ID。面向 Android 13（API 级别 33）或更高版本、并使用 Google Play 服务广告 ID 的应用必须具备此权限。 |

### iOS

这个库使用以下用途描述键：

| Info.plist 键 | 说明 |
| --- | --- |
| `NSUserTrackingUsageDescription` | 告知用户应用为何请求使用数据来跟踪用户或设备的消息。 |
