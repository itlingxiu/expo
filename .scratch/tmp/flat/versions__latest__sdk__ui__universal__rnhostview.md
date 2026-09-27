---
title: RNHostView 组件参考
description: A cross-platform component for hosting React Native views inside @expo/ui views.
---

# RNHostView 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

Hosts a React Native view subtree inside a universal `@expo/ui` layout. On Android and iOS, it re-exports the platform-native [`RNHostView` for Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/rnhostview)/[`RNHostView` for SwiftUI](/versions/latest/sdk/ui/swift-ui/rnhostview), so React Native children bridge into the surrounding Compose/SwiftUI tree. On web, there is no native host tree to bridge into, so it falls back to a React Native [`View`](https://reactnative.dev/docs/view) that wraps the children.

> **Note:** Pass a single React Native element as the child. `RNHostView` measures and lays out only its first child, so wrap several views in one parent `View` and let that view arrange them.

**Android**

![A bold label above a purple React Native chip](/static/images/expo-ui/rnhostview/android-light.webp)

**iOS**

![A bold label above a purple React Native chip](/static/images/expo-ui/rnhostview/ios-light.webp)

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

### Basic usage

Place a React Native view subtree anywhere inside a universal `@expo/ui` layout.

**Android**

![A bold label above a purple React Native chip](/static/images/expo-ui/examples/universal-rnhostview-basic-android-light.webp)

**iOS**

![A bold label above a purple React Native chip](/static/images/expo-ui/examples/universal-rnhostview-basic-ios-light.webp)

```tsx RNHostViewExample.tsx
import { Host, Column, RNHostView, Text } from '@expo/ui';
import { Text as RNText, View, useColorScheme } from 'react-native';

export default function RNHostViewExample() {
  const colorScheme = useColorScheme();

  return (
    <Host matchContents>
      <Column spacing={12} style={{ padding: 16 }}>
        <Text
          textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000', fontWeight: 'bold' }}>
          Native UI label
        </Text>
        <RNHostView matchContents>
          <View
            style={{
              alignSelf: 'flex-start',
              padding: 16,
              backgroundColor: '#9B59B6',
              borderRadius: 10,
            }}>
            <RNText style={{ color: 'white' }}>Plain React Native content</RNText>
          </View>
        </RNHostView>
      </Column>
    </Host>
  );
}
```

### Fill parent vs. match child

By default `RNHostView` fills its native parent. Set `matchContents` to have it shrink to fit its React Native children instead.

**Android**

![Two sections comparing a purple square that fills a 100 by 100 frame with a smaller 50 by 50 square](/static/images/expo-ui/examples/universal-rnhostview-sizing-android-light.webp)

**iOS**

![Two sections comparing a purple square that fills a 100 by 100 frame with a smaller 50 by 50 square](/static/images/expo-ui/examples/universal-rnhostview-sizing-ios-light.webp)

```tsx RNHostViewSizingExample.tsx
import { Host, Column, Row, Text, RNHostView } from '@expo/ui';
import { View, useColorScheme } from 'react-native';

export default function RNHostViewSizingExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents>
      <Column spacing={24} style={{ padding: 16 }}>
        <Column spacing={8}>
          <Text textStyle={{ ...ink, fontSize: 18, fontWeight: 'bold' }}>Fill parent size</Text>
          <Text textStyle={{ fontSize: 12, color: '#666666' }}>
            The RNHostView fills the native parent's 100×100 frame.
          </Text>
          <Row style={{ width: 100, height: 100 }}>
            <RNHostView>
              <View style={{ flex: 1, backgroundColor: '#9B59B6', borderRadius: 10, margin: 4 }} />
            </RNHostView>
          </Row>
        </Column>

        <Column spacing={8}>
          <Text textStyle={{ ...ink, fontSize: 18, fontWeight: 'bold' }}>Match child size</Text>
          <Text textStyle={{ fontSize: 12, color: '#666666' }}>
            The RNHostView shrinks to wrap its 50×50 child.
          </Text>
          <Row style={{ padding: 8 }}>
            <RNHostView matchContents>
              <View
                style={{ width: 50, height: 50, backgroundColor: '#9B59B6', borderRadius: 10 }}
              />
            </RNHostView>
          </Row>
        </Column>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { RNHostView } from '@expo/ui';
```
