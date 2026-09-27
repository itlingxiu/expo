---
title: VStack 组件参考
description: A SwiftUI VStack component for vertical layouts.
---

# VStack 组件参考

> 支持平台：iOS、tvOS、Expo Go。

> **info** For cross-platform usage, see the universal [`Column`](/versions/latest/sdk/ui/universal/column) — it renders the appropriate native component per platform.

Expo UI VStack matches the official SwiftUI [VStack API](https://developer.apple.com/documentation/swiftui/vstack) and arranges its children vertically.

![Four numbered colored rounded squares stacked vertically in a VStack](/static/images/expo-ui/vstack/ios-light.webp)

## Installation

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

## Usage

### Basic vertical stack

![The words First, Second, and Third stacked one above the other](/static/images/expo-ui/examples/vstack-basic-ios-light.webp)

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

### With alignment

The `alignment` prop controls horizontal alignment of children. Available options are: `leading`, `center`, and `trailing`.

![Three rectangles of different widths stacked vertically and sharing the same left edge](/static/images/expo-ui/examples/vstack-alignment-ios-light.webp)

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
