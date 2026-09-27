---
title: Column 组件参考
description: A vertical layout container for universal @expo/ui components.
---

# Column 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A vertical layout container that arranges its children from top to bottom. Delegates to SwiftUI's [`VStack`](/versions/latest/sdk/ui/swift-ui/vstack) on iOS, Jetpack Compose's [`Column`](/versions/latest/sdk/ui/jetpack-compose/column) on Android, and a flex `View` on web.

**Android**

![Three colored boxes stacked vertically inside a Column](/static/images/expo-ui/column/android-light.webp)

**iOS**

![Three colored boxes stacked vertically inside a Column](/static/images/expo-ui/column/ios-light.webp)

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

### Basic column

**Android**

![Three text labels stacked vertically](/static/images/expo-ui/examples/universal-column-basic-android-light.webp)

**iOS**

![Three text labels stacked vertically](/static/images/expo-ui/examples/universal-column-basic-ios-light.webp)

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

### Alignment

Use [`alignment`](#alignment) to position children along the cross (horizontal) axis.

**Android**

![Two text labels centered horizontally](/static/images/expo-ui/examples/universal-column-alignment-android-light.webp)

**iOS**

![Two text labels centered horizontally](/static/images/expo-ui/examples/universal-column-alignment-ios-light.webp)

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
