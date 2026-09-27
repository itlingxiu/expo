---
title: react-native-webview 包参考
description: 提供 WebView 组件的库。
---

# react-native-webview 包参考

> 支持平台：Android、iOS、Expo Go。

`react-native-webview` 提供 `WebView` 组件，用于在原生视图中渲染网页内容。

## 安装

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

## 用法

```jsx
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

### 内联 HTML

```jsx
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

## 了解更多

[查看官方文档](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide)

可获取 API 及其用法的完整信息。
