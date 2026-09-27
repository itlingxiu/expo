---
title: Haptics 包参考
description: 在 Android 上访问系统振动效果、在 iOS 上访问触觉引擎、在 Web 上访问 Web Vibration API 的库。
---

# Haptics 包参考

`expo-haptics` 提供触觉（触摸）反馈，适用于：

- 使用 Vibrator 系统服务的 Android 设备。
- 使用 Taptic Engine 的 iOS 10 及以上设备。
- 使用 Web Vibration API 的 Web 平台。

> 支持平台：Android、iOS、Web。

在 iOS 上，如果用户设备满足以下任一条件，Taptic 引擎将不会产生效果：

- 已启用低电量模式。可通过 [`expo-battery`](/versions/latest/sdk/battery) 检测。
- 用户在设置中禁用了 Taptic Engine。
- iOS 相机处于活动状态（以避免失稳）。
- iOS 听写处于活动状态（以免干扰麦克风输入）。

在 Web 上，此库使用 Web Vibration API。请注意：

- 浏览器必须支持该 API（查看[浏览器兼容性](https://caniuse.com/vibration)）
- 设备必须具备振动硬件
- 用户必须授予振动权限（通常会自动授予）
- 某些浏览器可能在特定上下文中忽略振动（例如后台标签页）

:::note
如需对触觉做更高级的控制，我们推荐 [Pulsar haptics SDK](https://docs.swmansion.com/pulsar/)。它让你可以创建自定义触觉模式、使用更丰富的预设、构建基于手势的触觉，并在 worklet 上运行触觉。
:::

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-haptics
```
:::
:::tab yarn
```sh
yarn expo install expo-haptics
```
:::
:::tab pnpm
```sh
pnpm expo install expo-haptics
```
:::
:::tab bun
```sh
bun expo install expo-haptics
```
:::
:::

## 配置

在 Android 上，此库需要控制设备振动的权限。`VIBRATE` 权限会自动添加。

## 用法

```jsx
import { StyleSheet, View, Text, Button } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Haptics.selectionAsync</Text>
      <View style={styles.buttonContainer}>
        <Button title="Selection" onPress={() => Haptics.selectionAsync()} />
      </View>
      <Text style={styles.text}>Haptics.notificationAsync</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Success"
          onPress={() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          }
        />
        <Button
          title="Error"
          onPress={() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
          }
        />
        <Button
          title="Warning"
          onPress={() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          }
        />
      </View>
      <Text style={styles.text}>Haptics.impactAsync</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Light"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <Button
          title="Medium"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        />
        <Button
          title="Heavy"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
        />
        <Button
          title="Rigid"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)}
        />
        <Button
          title="Soft"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 10,
    marginBottom: 30,
    justifyContent: 'space-between',
  },
});
```

## API

```js
import * as Haptics from 'expo-haptics';
```
