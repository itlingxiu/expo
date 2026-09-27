---
title: Speech
description: A library that provides access to text-to-speech functionality.
packageName: expo-speech
---

# Speech

> 支持平台：Android、iOS、Web、Expo Go。

`expo-speech` provides an API that allows you to utilize Text-to-speech functionality in your app.

:::note
On iOS physical devices, `expo-speech` won't produce sound if the device is in silent mode. Make sure silent mode is turned off.
:::

## Installation

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

## Usage

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

