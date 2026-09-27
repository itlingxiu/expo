---
title: Column 组件参考
description: 用于通用 @expo/ui 组件的垂直布局容器。
---

# Column 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

垂直布局容器，从上到下排列子元素。在 iOS 上委托给 SwiftUI 的 [`VStack`](/versions/latest/sdk/ui/swift-ui/vstack)，在 Android 上委托给 Jetpack Compose 的 [`Column`](/versions/latest/sdk/ui/jetpack-compose/column)，在 Web 上使用 flex `View`。

**Android**

![Column 内垂直堆叠的三个色块](/static/images/expo-ui/column/android-light.webp)

**iOS**

![Column 内垂直堆叠的三个色块](/static/images/expo-ui/column/ios-light.webp)

## 安装

:::tabs
:::tab npm
```sh
npx expo install @expo/ui
```
:::
:::tab yarn
```sh
yarn expo install @expo/ui
```
:::
:::tab pnpm
```sh
pnpm expo install @expo/ui
```
:::
:::tab bun
```sh
bun expo install @expo/ui
```
:::
:::

## 用法

### 基本列

**Android**

![三个垂直堆叠的文本标签](/static/images/expo-ui/examples/universal-column-basic-android-light.webp)

**iOS**

![三个垂直堆叠的文本标签](/static/images/expo-ui/examples/universal-column-basic-ios-light.webp)

```tsx ColumnExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Column, Text } from '@expo/ui';

export default function ColumnExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents>
      <Column spacing={8}>
        <Text textStyle={ink}>First</Text>
        <Text textStyle={ink}>Second</Text>
        <Text textStyle={ink}>Third</Text>
      </Column>
    </Host>
  );
}
```

### 对齐

使用 [`alignment`](#alignment) 沿交叉轴（水平方向）定位子元素。

**Android**

![两个水平居中的文本标签](/static/images/expo-ui/examples/universal-column-alignment-android-light.webp)

**iOS**

![两个水平居中的文本标签](/static/images/expo-ui/examples/universal-column-alignment-ios-light.webp)

```tsx ColumnAlignmentExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Column, Text } from '@expo/ui';

export default function ColumnAlignmentExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Column spacing={8} alignment="center">
        <Text textStyle={ink}>Centered</Text>
        <Text textStyle={ink}>Centered</Text>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { Column } from '@expo/ui';
```
