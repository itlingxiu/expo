---
title: Spacer 组件参考
description: A SwiftUI Spacer component for flexible spacing.
---

# Spacer 组件参考

> 支持平台：iOS、tvOS、Expo Go。

> **info** For cross-platform usage, see the universal [`Spacer`](/versions/latest/sdk/ui/universal/spacer) — it renders the appropriate native component per platform.

Expo UI Spacer matches the official SwiftUI [Spacer API](https://developer.apple.com/documentation/swiftui/spacer) and expands to fill available space in a stack.

![A red A square at the leading edge and a blue B square at the trailing edge of an HStack, separated by a Spacer](/static/images/expo-ui/spacer/ios-light.webp)

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

### Basic spacer in HStack

Use Spacer to push content to opposite ends of a horizontal stack.

![The word Left at the leading edge and Right at the trailing edge of the same row](/static/images/expo-ui/examples/spacer-hstack-ios-light.webp)

```tsx SpacerHStackExample.tsx
import { Host, HStack, Text, Spacer } from '@expo/ui/swift-ui';

export default function SpacerHStackExample() {
  return (
    <Host style={{ flex: 1 }}>
      <HStack>
        <Text>Left</Text>
        <Spacer />
        <Text>Right</Text>
      </HStack>
    </Host>
  );
}
```

### Basic spacer in VStack

Use Spacer to push content to opposite ends of a vertical stack.

![The word Top at the upper edge and Bottom at the lower edge of the same column](/static/images/expo-ui/examples/spacer-vstack-ios-light.webp)

```tsx SpacerVStackExample.tsx
import { Host, VStack, Text, Spacer } from '@expo/ui/swift-ui';

export default function SpacerVStackExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <Text>Top</Text>
        <Spacer />
        <Text>Bottom</Text>
      </VStack>
    </Host>
  );
}
```

## API

```tsx
import { Spacer } from '@expo/ui/swift-ui';
```
