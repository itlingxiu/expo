---
title: Barometer 包参考
description: 提供设备气压计传感器访问能力的库。
---

# Barometer 包参考

`expo-sensors` 提供的 `Barometer` 可访问设备气压计传感器，以响应气压变化。气压以百帕（`hPa`）为单位。

> 支持平台：Android、iOS*、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-sensors
```
:::
:::tab yarn
```sh
yarn expo install expo-sensors
```
:::
:::tab pnpm
```sh
pnpm expo install expo-sensors
```
:::
:::tab bun
```sh
bun expo install expo-sensors
```
:::
:::

## 用法

```jsx
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Barometer } from 'expo-sensors';

export default function App() {
  const [{ pressure, relativeAltitude }, setData] = useState({ pressure: 0, relativeAltitude: 0 });
  const [subscription, setSubscription] = useState(null);

  const toggleListener = () => {
    subscription ? unsubscribe() : subscribe();
  };

  const subscribe = () => {
    setSubscription(Barometer.addListener(setData));
  };

  const unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  return (
    <View style={styles.wrapper}>
      <Text>Barometer: Listener {subscription ? 'ACTIVE' : 'INACTIVE'}</Text>
      <Text>Pressure: {pressure} hPa</Text>
      <Text>
        Relative Altitude:{' '}
        {Platform.OS === 'ios' ? `${relativeAltitude} m` : `Only available on iOS`}
      </Text>
      <TouchableOpacity onPress={toggleListener} style={styles.button}>
        <Text>Toggle listener</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
    marginTop: 15,
  },
  wrapper: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
```

## API

```js
import { Barometer } from 'expo-sensors';
```

## 单位与数据来源

| 操作系统 | 单位 | 数据来源 | 说明 |
| --- | --- | --- | --- |
| iOS | *`hPa`* | [`CMAltimeter`](https://developer.apple.com/documentation/coremotion/cmaltimeter) | 海拔事件反映的是当前海拔的变化，而不是绝对海拔。 |
| Android | *`hPa`* | [`Sensor.TYPE_PRESSURE`](https://developer.android.com/reference/android/hardware/Sensor#TYPE_PRESSURE) | 监测气压变化。 |
| Web | — | — | 此传感器在 Web 上不可用，无法访问。如果尝试获取数据，将抛出 `UnavailabilityError`。 |
