---
title: HStack 组件参考
description: 用于水平布局的 SwiftUI HStack 组件。
---

# HStack 组件参考

> 支持平台：iOS、tvOS、Expo Go。

:::note
跨平台用法请参阅通用 [`Row`](/versions/latest/sdk/ui/universal/row)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 HStack 与官方 SwiftUI [HStack API](https://developer.apple.com/documentation/swiftui/hstack) 保持一致，将其子元素水平排列。

![四个带编号的彩色圆角方块在 HStack 中水平排列](/static/images/expo-ui/hstack/ios-light.webp)

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

### 基本水平堆叠

![First、Second 和 Third 文本项在 HStack 中水平排列](/static/images/expo-ui/examples/hstack-basic-ios-light.webp)

```tsx BasicHStackExample.tsx
import { Host, HStack, Text } from '@expo/ui/swift-ui';

export default function BasicHStackExample() {
  return (
    <Host style={{ flex: 1 }}>
      <HStack spacing={12}>
        <Text>First</Text>
        <Text>Second</Text>
        <Text>Third</Text>
      </HStack>
    </Host>
  );
}
```

### 对齐方式

`alignment` 属性控制子元素的垂直对齐。可用选项为：`top`、`center`、`bottom`、`firstTextBaseline` 和 `lastTextBaseline`。

![三个高度不同的矩形在 HStack 中按顶边对齐](/static/images/expo-ui/examples/hstack-alignment-ios-light.webp)

```tsx HStackAlignmentExample.tsx
import { Host, HStack, Rectangle } from '@expo/ui/swift-ui';
import { frame } from '@expo/ui/swift-ui/modifiers';

export default function HStackAlignmentExample() {
  return (
    <Host style={{ flex: 1 }}>
      <HStack spacing={12} alignment="top">
        <Rectangle modifiers={[frame({ width: 50, height: 50 })]} />
        <Rectangle
          modifiers={[frame({ width: 50, height: 100 })]}
        />
        <Rectangle modifiers={[frame({ width: 50, height: 75 })]} />
      </HStack>
    </Host>
  );
}
```

## API

```tsx
import { HStack } from '@expo/ui/swift-ui';
```
