---
title: ZStack 组件参考
description: A SwiftUI ZStack component for overlapping layouts.
---

# ZStack 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI ZStack matches the official SwiftUI [ZStack API](https://developer.apple.com/documentation/swiftui/zstack) and overlays its children on top of each other.

![Three colored rounded squares stacked along the z-axis with diagonal offsets in a ZStack](/static/images/expo-ui/zstack/ios-light.webp)

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

### Basic overlapping stack

![A blue square with the white word Overlay centered on top of it](/static/images/expo-ui/examples/zstack-basic-ios-light.webp)

```tsx BasicZStackExample.tsx
import { Host, ZStack, Rectangle, Text } from '@expo/ui/swift-ui';
import {
  frame,
  foregroundStyle,
} from '@expo/ui/swift-ui/modifiers';

export default function BasicZStackExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ZStack>
        <Rectangle
          modifiers={[
            frame({ width: 100, height: 100 }),
            foregroundStyle('blue'),
          ]}
        />
        <Text modifiers={[foregroundStyle('white')]}>Overlay</Text>
      </ZStack>
    </Host>
  );
}
```

### With alignment

The `alignment` prop controls how children are positioned within the stack. Available options include: `center`, `leading`, `trailing`, `top`, `bottom`, `topLeading`, `topTrailing`, `bottomLeading`, and `bottomTrailing`.

![A blue square with a small red circle at its bottom trailing corner](/static/images/expo-ui/examples/zstack-alignment-ios-light.webp)

```tsx ZStackAlignmentExample.tsx
import { Host, ZStack, Rectangle, Circle } from '@expo/ui/swift-ui';
import {
  frame,
  foregroundStyle,
} from '@expo/ui/swift-ui/modifiers';

export default function ZStackAlignmentExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ZStack alignment="bottomTrailing">
        <Rectangle
          modifiers={[
            frame({ width: 100, height: 100 }),
            foregroundStyle('blue'),
          ]}
        />
        <Circle
          modifiers={[
            frame({ width: 30, height: 30 }),
            foregroundStyle('red'),
          ]}
        />
      </ZStack>
    </Host>
  );
}
```

### Creating a badge overlay

![A blue bell icon with a small red dot at its top trailing corner](/static/images/expo-ui/examples/zstack-badge-ios-light.webp)

```tsx ZStackBadgeExample.tsx
import {
  Host,
  ZStack,
  Circle,
  Text,
  Image,
} from '@expo/ui/swift-ui';
import {
  frame,
  foregroundStyle,
} from '@expo/ui/swift-ui/modifiers';

export default function ZStackBadgeExample() {
  return (
    <Host matchContents>
      <ZStack alignment="topTrailing">
        <Image systemName="bell.fill" size={32} color="blue" />
        <Circle
          modifiers={[
            frame({ width: 16, height: 16 }),
            foregroundStyle('red'),
          ]}
        />
      </ZStack>
    </Host>
  );
}
```

## API

```tsx
import { ZStack } from '@expo/ui/swift-ui';
```
