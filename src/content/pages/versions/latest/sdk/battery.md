---
title: Battery 包参考
description: 提供物理设备电池信息以及相应事件监听器的库。
---

# Battery 包参考

`expo-battery` 提供物理设备的电池信息（例如电量、设备是否正在充电等），以及相应的事件监听器。

> 支持平台：Android、iOS*、Web、Expo Go。

:::note
在 Web 上，`expo-battery` 依赖 [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API)，该 API 仅在基于 Chromium 的浏览器（Chrome、Edge、Opera）中实现。在不支持的浏览器上，[`getBatteryLevelAsync()`](#getbatterylevelasync) 会解析为 `-1`，[`getBatteryStateAsync()`](#getbatterystateasync) 会解析为 `BatteryState.UNKNOWN`。
:::

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-battery
```
:::
:::tab yarn
```sh
yarn expo install expo-battery
```
:::
:::tab pnpm
```sh
pnpm expo install expo-battery
```
:::
:::tab bun
```sh
bun expo install expo-battery
```
:::
:::

## 用法

```jsx
import { useBatteryLevel } from 'expo-battery';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const batteryLevel = useBatteryLevel();

  return (
    <View style={styles.container}>
      <Text>Current Battery Level: {batteryLevel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## API

```js
import * as Battery from 'expo-battery';
```
