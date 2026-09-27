---
title: Checkbox 包参考
description: 提供基本复选框功能的通用 React 组件。
---

# Checkbox 包参考

`expo-checkbox` 为所有平台提供基本的 `boolean` 输入元素。

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-checkbox
```
:::
:::tab yarn
```sh
yarn expo install expo-checkbox
```
:::
:::tab pnpm
```sh
pnpm expo install expo-checkbox
```
:::
:::tab bun
```sh
bun expo install expo-checkbox
```
:::
:::

## 用法

```tsx
import { Checkbox } from 'expo-checkbox';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [isChecked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
        <Text style={styles.paragraph}>Normal checkbox</Text>
      </View>
      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#4630EB' : undefined}
        />
        <Text style={styles.paragraph}>Custom colored checkbox</Text>
      </View>
      <View style={styles.section}>
        <Checkbox style={styles.checkbox} disabled value={isChecked} onValueChange={setChecked} />
        <Text style={styles.paragraph}>Disabled checkbox</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});
```

下面展示了 `expo-checkbox` 在 Android 和 iOS 上的外观示例：

![Android 与 iOS 上的 Checkbox 组件。](/static/images/sdk/checkbox/example.webp)

## API

```js
import { Checkbox } from 'expo-checkbox';
```
