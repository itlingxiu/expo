---
title: react-native-webview
description: A library that provides a WebView component.
---

# react-native-webview

> 支持平台：Android、iOS、Expo Go。

`react-native-webview` provides a `WebView` component that renders web content in a native view.

## Installation

:::tabs
:::tab npm
```sh
npx expo install react-native-webview
```
:::
:::tab yarn
```sh
yarn expo install react-native-webview
```
:::
:::tab pnpm
```sh
pnpm expo install react-native-webview
```
:::
:::tab bun
```sh
bun expo install react-native-webview
```
:::
:::

## Usage

```jsx collapseHeight=310
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: 'https://expo.dev' }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
```

### With inline HTML

```jsx collapseHeight=310
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <WebView
      style={styles.container}
      originWhitelist={['*']}
      source={{ html: '<h1><center>Hello world</center></h1>' }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
```

## Learn more

[Visit official documentation](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide)

Get full information on API and its usage.
