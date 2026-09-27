---
title: Spacer 组件参考
description: A layout spacer that produces empty space between siblings.
---

# Spacer 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A layout spacer that produces empty space between siblings inside a [`Row`](row) or [`Column`](column). Use [`size`](#size) for a fixed gap, or [`flexible`](#flexible) to fill the remaining main-axis space.

**Android**

![Two boxes pushed to opposite ends of a Row by a Spacer with weight modifier](/static/images/expo-ui/spacer/android-light.webp)

**iOS**

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

### Fixed-size spacer

**Android**

![Two labels separated by a fixed vertical gap](/static/images/expo-ui/examples/universal-spacer-fixed-android-light.webp)

**iOS**

![Two labels separated by a fixed vertical gap](/static/images/expo-ui/examples/universal-spacer-fixed-ios-light.webp)

```tsx FixedSpacerExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Column, Text, Spacer } from '@expo/ui';

export default function FixedSpacerExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents>
      <Column>
        <Text textStyle={ink}>Top</Text>
        <Spacer size={32} />
        <Text textStyle={ink}>Bottom</Text>
      </Column>
    </Host>
  );
}
```

### Flexible spacer

A flexible spacer fills the remaining space along its parent's main axis, pushing the surrounding content to opposite ends.

**Android**

![Leading and trailing labels pushed to opposite edges](/static/images/expo-ui/examples/universal-spacer-flexible-android-light.webp)

**iOS**

![Leading and trailing labels pushed to opposite edges](/static/images/expo-ui/examples/universal-spacer-flexible-ios-light.webp)

```tsx FlexibleSpacerExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Row, Text, Spacer } from '@expo/ui';

export default function FlexibleSpacerExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Row>
        <Text textStyle={ink}>Leading</Text>
        <Spacer flexible />
        <Text textStyle={ink}>Trailing</Text>
      </Row>
    </Host>
  );
}
```

## API

```tsx
import { Spacer } from '@expo/ui';
```
