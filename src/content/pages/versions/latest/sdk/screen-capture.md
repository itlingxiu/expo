---
title: ScreenCapture 包参考
description: 用于保护应用中的屏幕不被截取或录制的库。
---

# ScreenCapture 包参考

> 支持平台：Android、iOS、Expo Go。

`expo-screen-capture` 可以保护应用中的屏幕不被截取或录制，也可以在应用处于前台时有人截屏时收到通知。你可能想阻止屏幕捕获的两个最常见原因是：

- 某个屏幕正在显示敏感信息（密码、信用卡数据等）
- 你正在展示付费内容，不希望被录制并分享

这在 Android 上尤其重要，因为 [`android.media.projection`](https://developer.android.com/about/versions/android-5.0.html#ScreenCapture) API 允许第三方应用执行屏幕捕获或屏幕共享（即使应用在后台）。

在 Android 上，屏幕捕获回调只在 Android 14+ 上无需额外权限即可工作。**在 Android 14+ 上，阻止屏幕捕获或使用该回调时，不需要请求或检查权限。**

如果要在 Android 13 或更低版本上使用屏幕捕获回调，需要在 **AndroidManifest.xml** 中添加 `READ_MEDIA_IMAGES` 权限。可以在应用配置中使用 `android.permissions` 键。更多信息见 [Android 权限](/guides/permissions#android)。

:::warning
`READ_MEDIA_IMAGES` 权限只能添加给需要广泛访问照片的应用。见 [Google Play 照片和视频权限政策详情](https://support.google.com/googleplay/android-developer/answer/14115180)。

**重要** 测试屏幕捕获功能时：在 Android 模拟器上，在另一个终端中运行 `adb shell input keyevent 120` 来触发截屏。在 iOS 模拟器上，可以从菜单栏选择 **Device** > **Trigger Screenshot** 来触发截屏。
:::

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-screen-capture
```
:::
:::tab yarn
```sh
yarn expo install expo-screen-capture
```
:::
:::tab pnpm
```sh
pnpm expo install expo-screen-capture
```
:::
:::tab bun
```sh
bun expo install expo-screen-capture
```
:::
:::

## 用法

### 示例：hook

```jsx
import { usePreventScreenCapture } from 'expo-screen-capture';
import { Text, View } from 'react-native';

export default function ScreenCaptureExample() {
  usePreventScreenCapture();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>As long as this component is mounted, this screen is unrecordable!</Text>
    </View>
  );
}
```

### 示例：命令式阻止屏幕捕获

```jsx
import * as ScreenCapture from 'expo-screen-capture';
import { useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default function ScreenCaptureExample() {
  const activate = async () => {
    await ScreenCapture.preventScreenCaptureAsync();
  };

  const deactivate = async () => {
    await ScreenCapture.allowScreenCaptureAsync();
  };

  return (
    <View style={styles.container}>
      <Button title="Activate" onPress={activate} />
      <Button title="Deactivate" onPress={deactivate} />
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

### 示例：屏幕捕获回调

```jsx
import * as ScreenCapture from 'expo-screen-capture';
import { useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default function useScreenCaptureCallback() {
  // 仅当你在 AndroidManifest.xml 中添加了 READ_MEDIA_IMAGES 权限时才使用
  const hasPermissions = async () => {
    const { status } = await ScreenCapture.requestPermissionsAsync();
    return status === 'granted';
  };

  useEffect(() => {
    let subscription;

    const addListenerAsync = async () => {
      if (await hasPermissions()) {
        subscription = ScreenCapture.addScreenshotListener(() => {
          alert('Thanks for screenshotting my beautiful app 😊');
        });
      } else {
        console.error('Permissions needed to subscribe to screenshot events are missing!');
      }
    };
    addListenerAsync();

    return () => {
      subscription?.remove();
    };
  }, []);
}
```

## API

```js
import * as ScreenCapture from 'expo-screen-capture';
```
