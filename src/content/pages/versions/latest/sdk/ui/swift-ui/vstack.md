---
title: VStack 组件参考
description: 用于垂直布局的 SwiftUI VStack 组件。
---

# VStack 组件参考

> 支持平台：iOS、tvOS、Expo Go。

:::note
跨平台用法请参阅通用 [`Column`](/versions/latest/sdk/ui/universal/column)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 VStack 与官方 SwiftUI [VStack API](https://developer.apple.com/documentation/swiftui/vstack) 保持一致，将其子元素垂直排列。

![四个带编号的彩色圆角方块在 VStack 中垂直堆叠](/static/images/expo-ui/vstack/ios-light.webp)

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

### 基本垂直堆叠

![单词 First、Second 和 Third 上下堆叠](/static/images/expo-ui/examples/vstack-basic-ios-light.webp)

```tsx BasicVStackExample.tsx
import { Host, VStack, Text } from '@expo/ui/swift-ui';

export default function BasicVStackExample() {
  // 当堆叠需要空间来对齐子元素时，请给宿主指定尺寸。
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={12}>
        <Text>First</Text>
        <Text>Second</Text>
        <Text>Third</Text>
      </VStack>
    </Host>
  );
}
```

### 对齐方式

`alignment` 属性控制子元素的水平对齐。可用选项为：`leading`、`center` 和 `trailing`。

![三个宽度不同的矩形垂直堆叠，并共用同一左边缘](/static/images/expo-ui/examples/vstack-alignment-ios-light.webp)

```tsx VStackAlignmentExample.tsx
import { Host, VStack, Rectangle } from '@expo/ui/swift-ui';
import { frame } from '@expo/ui/swift-ui/modifiers';

export default function VStackAlignmentExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={12} alignment="leading">
        <Rectangle modifiers={[frame({ width: 50, height: 50 })]} />
        <Rectangle
          modifiers={[frame({ width: 100, height: 50 })]}
        />
        <Rectangle modifiers={[frame({ width: 75, height: 50 })]} />
      </VStack>
    </Host>
  );
}
```

## API

```tsx
import { VStack } from '@expo/ui/swift-ui';
```
