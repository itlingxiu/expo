---
title: Brightness 包参考
description: 提供用于获取和设置屏幕亮度的 API 的库。
---

# Brightness 包参考

用于获取和设置屏幕亮度的 API。

> 支持平台：Android、iOS、Expo Go。

在 Android 上，有一个全局的系统级亮度设置，每个应用也有自己的亮度设置，可以选择性地覆盖全局设置。可以用此 API 设置这两种值。在 iOS 上，无法以编程方式更改系统亮度设置；对屏幕亮度的任何更改都会一直保持，直到设备锁定或关机。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-brightness
```
:::
:::tab yarn
```sh
yarn expo install expo-brightness
```
:::
:::tab pnpm
```sh
pnpm expo install expo-brightness
```
:::
:::tab bun
```sh
bun expo install expo-brightness
```
:::
:::

## 配置

如果你没有使用持续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动使用原生 **android** 项目，则需要在 **AndroidManifest.xml** 文件中添加 `android.permission.WRITE_SETTINGS` 权限：

```xml android/app/src/main/AndroidManifest.xml
<uses-permission android:name="android.permission.WRITE_SETTINGS" />
```

## 用法

```jsx
import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Brightness from 'expo-brightness';

export default function App() {
  useEffect(() => {
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        Brightness.setSystemBrightnessAsync(1);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Brightness Module Example</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## API

```js
import * as Brightness from 'expo-brightness';
```

## 错误码

### `ERR_BRIGHTNESS`

获取或设置应用亮度时发生错误。

### `ERR_BRIGHTNESS_MODE`

获取或设置系统亮度模式时发生错误。更多信息见所抛出错误的 `nativeError` 属性。

### `ERR_BRIGHTNESS_PERMISSIONS_DENIED`

在未获得用户适当权限的情况下尝试设置系统亮度。用户未授予 `SYSTEM_BRIGHTNESS` 权限。

### `ERR_BRIGHTNESS_SYSTEM`

获取或设置系统亮度时发生错误。

### `ERR_INVALID_ARGUMENT`

传入了无效参数。只允许 `BrightnessMode.MANUAL` 或 `BrightnessMode.AUTOMATIC`。

## 权限

### Android

你必须在 **app.json** 的 [`expo.android.permissions`](/versions/latest/config/app#permissions) 数组中添加以下权限。

- `WRITE_SETTINGS`

### iOS

*无需权限。*
