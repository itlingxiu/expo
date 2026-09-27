---
title: Row 组件参考
description: A horizontal layout container for universal @expo/ui components.
---

# Row 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A horizontal layout container that arranges its children from start to end. Delegates to Jetpack Compose's [`Row`](/versions/latest/sdk/ui/jetpack-compose/row) on Android, SwiftUI's [`HStack`](/versions/latest/sdk/ui/swift-ui/hstack) on iOS, and a flex `View` on web.

**Android**

![Three colored boxes laid out horizontally inside a Row](/static/images/expo-ui/row/android-light.webp)

**iOS**

![Three colored boxes laid out horizontally inside a Row](/static/images/expo-ui/row/ios-light.webp)

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

### Basic row

**Android**

![Three text labels in a horizontal row](/static/images/expo-ui/examples/universal-row-basic-android-light.webp)

**iOS**

![Three text labels in a horizontal row](/static/images/expo-ui/examples/universal-row-basic-ios-light.webp)

```tsx RowExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Row, Text } from '@expo/ui';

export default function RowExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents>
      <Row spacing={8}>
        <Text textStyle={ink}>One</Text>
        <Text textStyle={ink}>Two</Text>
        <Text textStyle={ink}>Three</Text>
      </Row>
    </Host>
  );
}
```

### Alignment

Use [`alignment`](#alignment) to position children along the cross (vertical) axis.

**Android**

![A large label and a small label sharing a center line](/static/images/expo-ui/examples/universal-row-alignment-android-light.webp)

**iOS**

![A large label and a small label sharing a center line](/static/images/expo-ui/examples/universal-row-alignment-ios-light.webp)

```tsx RowAlignmentExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Row, Text } from '@expo/ui';

export default function RowAlignmentExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host style={{ width: '100%', height: 160 }}>
      <Row spacing={8} alignment="center">
        <Text textStyle={{ ...ink, fontSize: 30 }}>Large</Text>
        <Text textStyle={ink}>centered</Text>
      </Row>
    </Host>
  );
}
```

### Pushing content apart with Spacer

Pair `Row` with a flexible [`Spacer`](spacer) to push its children to the opposite ends.

**Android**

![Leading and trailing labels pushed to opposite edges](/static/images/expo-ui/examples/universal-row-spacer-android-light.webp)

**iOS**

![Leading and trailing labels pushed to opposite edges](/static/images/expo-ui/examples/universal-row-spacer-ios-light.webp)

```tsx RowSpacerExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Row, Text, Spacer } from '@expo/ui';

export default function RowSpacerExample() {
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
import { Row } from '@expo/ui';
```
