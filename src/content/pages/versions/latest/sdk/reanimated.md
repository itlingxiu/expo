---
title: 'react-native-reanimated 包参考'
description: 一个提供 API 的库，可极大地简化创建流畅、强大且易于维护的动画的过程。
---

# react-native-reanimated 包参考

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

[`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/) 提供的 API 可极大地简化创建流畅、强大且易于维护的动画的过程。

> **Reanimated 使用的 React Native API 与 JavaScriptCore 的「远程 JS 调试」不兼容**。要在使用 `react-native-reanimated` 的应用中使用调试器，你需要使用 [Hermes JavaScript 引擎](/guides/using-hermes)和 [Hermes 的 JavaScript Inspector](/guides/using-hermes#javascript-debugger)。

## 安装

:::tabs
:::tab npm
```sh
npx expo install react-native-reanimated react-native-worklets
```
:::
:::tab yarn
```sh
yarn expo install react-native-reanimated react-native-worklets
```
:::
:::tab pnpm
```sh
pnpm expo install react-native-reanimated react-native-worklets
```
:::
:::tab bun
```sh
bun expo install react-native-reanimated react-native-worklets
```
:::
:::

无需额外配置。安装该库后，[`babel-preset-expo`](https://www.npmjs.com/package/babel-preset-expo) 会自动配置 [Reanimated Babel 插件](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#reanimated-babel-plugin)。

## 用法

以下示例展示了如何使用 `react-native-reanimated` 库创建简单的动画。

```jsx
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { View, Button, StyleSheet } from 'react-native';

export default function AnimatedStyleUpdateExample() {
  const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, style]} />
      <Button
        title="toggle"
        onPress={() => {
          randomWidth.value = Math.random() * 350;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 80,
    backgroundColor: 'black',
    margin: 30,
  },
});
```

## 了解更多

- [访问官方文档](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation)：获取 API 及其用法的完整信息。
