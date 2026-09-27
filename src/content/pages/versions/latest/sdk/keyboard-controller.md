---
title: react-native-keyboard-controller 包参考
description: 提供在 Android 和 iOS 上以相同方式工作的键盘管理器的库。
---

# react-native-keyboard-controller 包参考

> 支持平台：Android、iOS、Expo Go。

`react-native-keyboard-controller` 在 React Native 内置键盘 API 之外提供更多功能。它只需很少的配置，就能在 Android 和 iOS 上保持一致，并提供用户所期望的原生手感。

## 安装

:::tabs
:::tab npm
```sh
npx expo install react-native-keyboard-controller
```
:::
:::tab yarn
```sh
yarn expo install react-native-keyboard-controller
```
:::
:::tab pnpm
```sh
pnpm expo install react-native-keyboard-controller
```
:::
:::tab bun
```sh
bun expo install react-native-keyboard-controller
```
:::
:::

## 用法

```tsx
import { TextInput, View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';

export default function FormScreen() {
  return (
    <>
      <KeyboardAwareScrollView bottomOffset={62} contentContainerStyle={styles.container}>
        <View>
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
        </View>
        <TextInput placeholder="Type a message..." style={styles.textInput} />
        <View>
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
        </View>
        <TextInput placeholder="Type a message..." style={styles.textInput} />
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  listStyle: {
    padding: 16,
    gap: 16,
  },
  textInput: {
    width: 'auto',
    flexGrow: 1,
    flexShrink: 1,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d8d8d8',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 8,
  },
});
```

## 其他资源

- [高级键盘处理](/guides/keyboard-handling#advanced-keyboard-handling-with-keyboard-controller)：了解更多使用 Keyboard Controller 的高级键盘处理示例。

- [查看官方文档](https://kirillzyusko.github.io/react-native-keyboard-controller/)：获取 API 及其用法的完整信息。
