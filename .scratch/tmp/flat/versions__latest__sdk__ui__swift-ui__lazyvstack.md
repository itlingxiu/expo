---
title: LazyVStack 组件参考
description: A SwiftUI LazyVStack component for lazy vertical layouts.
---

# LazyVStack 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI LazyVStack matches the official SwiftUI [LazyVStack API](https://developer.apple.com/documentation/swiftui/lazyvstack) and arranges its children vertically, creating items only as needed (when they become visible during scrolling).

> **info** `LazyVStack` is not truly lazy yet: the native side only builds visible items, but React still creates every child up front, so large lists can be slow to mount. We are working on improving this. For large lists, we recommend [FlashList](https://shopify.github.io/flash-list) or [Legend List](https://github.com/LegendApp/legend-list).

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

### Basic lazy vertical stack

LazyVStack should be used inside a `ScrollView` to enable lazy rendering.

![A vertical list of items numbered zero to twenty-four.](/static/images/expo-ui/examples/lazyvstack-basic-ios-light.webp)

```tsx BasicLazyVStackExample.tsx
import {
  Host,
  ScrollView,
  LazyVStack,
  Text,
} from '@expo/ui/swift-ui';

export default function BasicLazyVStackExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView>
        <LazyVStack spacing={12}>
          {Array.from({ length: 100 }, (_, i) => (
            <Text key={i}>{`Item ${i}`}</Text>
          ))}
        </LazyVStack>
      </ScrollView>
    </Host>
  );
}
```

### With alignment

The `alignment` prop controls horizontal alignment of children. Available options are: `leading`, `center`, and `trailing`.

![Three rectangles of different widths stacked vertically, aligned to the leading edge.](/static/images/expo-ui/examples/lazyvstack-alignment-ios-light.webp)

```tsx LazyVStackAlignmentExample.tsx
import {
  Host,
  ScrollView,
  LazyVStack,
  Rectangle,
} from '@expo/ui/swift-ui';
import { frame } from '@expo/ui/swift-ui/modifiers';

export default function LazyVStackAlignmentExample() {
  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <ScrollView>
        <LazyVStack spacing={12} alignment="leading">
          <Rectangle
            modifiers={[frame({ width: 50, height: 50 })]}
          />
          <Rectangle
            modifiers={[frame({ width: 100, height: 50 })]}
          />
          <Rectangle
            modifiers={[frame({ width: 75, height: 50 })]}
          />
        </LazyVStack>
      </ScrollView>
    </Host>
  );
}
```

## API

```tsx
import { LazyVStack } from '@expo/ui/swift-ui';
```
