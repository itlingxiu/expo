---
title: react-native-keyboard-controller
description: A library that provides a Keyboard manager that works in an identical way on Android and iOS
packageName: react-native-keyboard-controller
---

# react-native-keyboard-controller

> 支持平台：Android、iOS、Expo Go。

`react-native-keyboard-controller` offers additional functionality beyond the built-in React Native keyboard APIs, providing consistency across Android and iOS with minimal configuration and offering the native feel users expect.

## Installation

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

## Usage

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

## Additional resources

- [Advanced keyboard handling](/guides/keyboard-handling#advanced-keyboard-handling-with-keyboard-controller)：Learn more about advanced keyboard handling examples with Keyboard Controller.

- [Visit official documentation](https://kirillzyusko.github.io/react-native-keyboard-controller/)：Get full information on API and its usage.

