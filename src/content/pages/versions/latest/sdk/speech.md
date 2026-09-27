---
title: Speech 包参考
description: 提供文字转语音功能的库。
---

# Speech 包参考

> 支持平台：Android、iOS、Web、Expo Go。

`expo-speech` 提供 API，让你可以在应用中使用文字转语音功能。

:::note
在 iOS 真机上，如果设备处于静音模式，`expo-speech` 不会发出声音。请确保已关闭静音模式。
:::

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-speech
```
:::
:::tab yarn
```sh
yarn expo install expo-speech
```
:::
:::tab pnpm
```sh
pnpm expo install expo-speech
```
:::
:::tab bun
```sh
bun expo install expo-speech
```
:::
:::

## 用法

```jsx
import { View, StyleSheet, Button } from 'react-native';
import * as Speech from 'expo-speech';

export default function App() {
  const speak = () => {
    const thingToSay = '1';
    Speech.speak(thingToSay);
  };

  return (
    <View style={styles.container}>
      <Button title="Press to hear some words" onPress={speak} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
```

## API

```js
import * as Speech from 'expo-speech';
```
