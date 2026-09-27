---
title: LinearGradient 包参考
description: 渲染渐变视图的通用 React 组件。
---

# LinearGradient 包参考

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-linear-gradient` 提供一个原生 React 视图，沿线性方向在多种颜色之间过渡。

:::note
React Native 还在 `View` 组件上提供 `experimental_backgroundImage`（Android 和 iOS）以及 `backgroundImage`（Web）样式属性，支持 [`linear-gradient()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/linear-gradient) 和 [`radial-gradient()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/radial-gradient) 等 CSS 渐变语法。这可以作为渐变背景的替代方案，而不必额外增加依赖。由于这是实验性属性，如果遇到问题，请[向 React Native 仓库报告](https://github.com/facebook/react-native/issues)。
:::

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-linear-gradient
```
:::
:::tab yarn
```sh
yarn expo install expo-linear-gradient
```
:::
:::tab pnpm
```sh
pnpm expo install expo-linear-gradient
```
:::
:::tab bun
```sh
bun expo install expo-linear-gradient
```
:::
:::

## 用法

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  return (
    <View style={styles.container}>
      <LinearGradient
        // 背景线性渐变
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.background}
      />
      <LinearGradient
        // 按钮线性渐变
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.button}>
        <Text style={styles.text}>Sign in with Facebook</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 15,
    color: '#fff',
  },
});
```

## API

```js
import { LinearGradient } from 'expo-linear-gradient';
```
