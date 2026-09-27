---
title: Group 组件参考
description: A SwiftUI Group component for grouping views without affecting layout.
---

# Group 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI Group matches the official SwiftUI [Group API](https://developer.apple.com/documentation/swiftui/group) and groups views together without introducing additional layout structure.

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

### Basic group

Groups are useful for applying modifiers to multiple views at once or organizing views without affecting layout.

![Three lines of blue text stacked vertically: First item, Second item, and Third item.](/static/images/expo-ui/examples/group-basic-ios-light.webp)

```tsx BasicGroupExample.tsx
import { Group, Host, Text, VStack } from '@expo/ui/swift-ui';
import { foregroundStyle } from '@expo/ui/swift-ui/modifiers';

export default function BasicGroupExample() {
  return (
    <Host matchContents style={{ alignSelf: 'center' }}>
      <VStack spacing={8}>
        <Group modifiers={[foregroundStyle('blue')]}>
          <Text>First item</Text>
          <Text>Second item</Text>
          <Text>Third item</Text>
        </Group>
      </VStack>
    </Host>
  );
}
```

## API

```tsx
import { Group } from '@expo/ui/swift-ui';
```
