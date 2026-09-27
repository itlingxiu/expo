---
title: Device 包参考
description: 提供物理设备系统信息访问能力的通用库。
---

# Device 包参考

`expo-device` 提供物理设备的系统信息访问能力，例如制造商和型号。

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-device
```
:::
:::tab yarn
```sh
yarn expo install expo-device
```
:::
:::tab pnpm
```sh
pnpm expo install expo-device
```
:::
:::tab bun
```sh
bun expo install expo-device
```
:::
:::

## 用法

```jsx
import { Text, View } from 'react-native';
import * as Device from 'expo-device';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        {Device.manufacturer}: {Device.modelName}
      </Text>
    </View>
  );
}
```

## API

```js
import * as Device from 'expo-device';
```

## 错误码

| 代码 | 说明 |
| --- | --- |
| ERR_DEVICE_ROOT_DETECTION | `isRootedExperimentalAsync` 抛出的错误码。如果对某些系统文件没有读取权限，可能会抛出此错误。 |
