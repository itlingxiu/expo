---
title: LazyHStack 组件参考
description: A SwiftUI LazyHStack component for lazy horizontal layouts.
---

# LazyHStack 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI LazyHStack matches the official SwiftUI [LazyHStack API](https://developer.apple.com/documentation/swiftui/lazyhstack) and arranges its children horizontally, creating items only as needed (when they become visible during scrolling).

> **info** `LazyHStack` is not truly lazy yet: the native side only builds visible items, but React still creates every child up front, so large lists can be slow to mount. We are working on improving this. For large lists, we recommend [FlashList](https://shopify.github.io/flash-list) or [Legend List](https://github.com/LegendApp/legend-list).

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

### Basic lazy horizontal stack

LazyHStack should be used inside a `ScrollView` with `axes="horizontal"` to enable lazy rendering.

![A horizontal row of items numbered zero to five, centered on the screen.](/static/images/expo-ui/examples/lazyhstack-basic-ios-light.webp)

```tsx BasicLazyHStackExample.tsx
import {
  Host,
  ScrollView,
  LazyHStack,
  Text,
} from '@expo/ui/swift-ui';

export default function BasicLazyHStackExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView axes="horizontal">
        <LazyHStack spacing={12}>
          {Array.from({ length: 100 }, (_, i) => (
            <Text key={i}>{`Item ${i}`}</Text>
          ))}
        </LazyHStack>
      </ScrollView>
    </Host>
  );
}
```

### With alignment

The `alignment` prop controls vertical alignment of children. Available options are: `top`, `center`, `bottom`, `firstTextBaseline`, and `lastTextBaseline`.

![Three rectangles of different heights in a row, aligned along their top edges.](/static/images/expo-ui/examples/lazyhstack-alignment-ios-light.webp)

```tsx LazyHStackAlignmentExample.tsx
import {
  Host,
  ScrollView,
  LazyHStack,
  Rectangle,
} from '@expo/ui/swift-ui';
import { frame } from '@expo/ui/swift-ui/modifiers';

export default function LazyHStackAlignmentExample() {
  return (
    <Host
      matchContents={{ horizontal: true }}
      style={{ flex: 1, alignSelf: 'center' }}>
      <ScrollView axes="horizontal">
        <LazyHStack spacing={12} alignment="top">
          <Rectangle
            modifiers={[frame({ width: 50, height: 50 })]}
          />
          <Rectangle
            modifiers={[frame({ width: 50, height: 100 })]}
          />
          <Rectangle
            modifiers={[frame({ width: 50, height: 75 })]}
          />
        </LazyHStack>
      </ScrollView>
    </Host>
  );
}
```

## API

```tsx
import { LazyHStack } from '@expo/ui/swift-ui';
```
