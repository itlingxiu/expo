---
title: KeepAwake 包参考
description: 渲染后可防止屏幕休眠的 React 组件。
---

# KeepAwake 包参考

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-keep-awake` 提供一个 React hook，用来防止屏幕休眠，另外还有一对函数，可以命令式地开启或关闭这一行为。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-keep-awake
```
:::
:::tab yarn
```sh
yarn expo install expo-keep-awake
```
:::
:::tab pnpm
```sh
pnpm expo install expo-keep-awake
```
:::
:::tab bun
```sh
bun expo install expo-keep-awake
```
:::
:::

## 用法

### 示例：hook

```jsx
import { useKeepAwake } from 'expo-keep-awake';
import React from 'react';
import { Text, View } from 'react-native';

export default function KeepAwakeExample() {
  // 只要这个组件处于挂载状态，屏幕就不会因空闲而关闭。
  useKeepAwake();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This screen will never sleep!</Text>
    </View>
  );
}
```

### 示例：函数

```jsx
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import React from 'react';
import { Button, View } from 'react-native';

export default class KeepAwakeExample extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={this._activate} title="Activate" />
        <Button onPress={this._deactivate} title="Deactivate" />
      </View>
    );
  }

  _activate = () => {
    // 调用后屏幕会保持常亮，直到调用 deactivateKeepAwake()。
    activateKeepAwake();
    alert('Activated!');
  };

  _deactivate = () => {
    // 关闭 KeepAwake；如果从未开启，则什么也不做。
    deactivateKeepAwake();
    alert('Deactivated!');
  };
}
```

## API

```js
import * as KeepAwake from 'expo-keep-awake';
```
