---
title: ScrollView 组件参考
description: A scrollable container that supports vertical or horizontal scrolling.
---

# ScrollView 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A scrollable container, defaulting to vertical scrolling. Use [`direction="horizontal"`](#direction) for horizontal lists.

## Native implementations

| Platform | Backing component                                                                                                                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Android  | A Jetpack Compose `Column` or `Row` with the [`verticalScroll` or `horizontalScroll` modifier](https://developer.android.com/develop/ui/compose/touch-input/pointer-input/scroll#scroll-modifiers). This implementation renders all children and is not a lazy container. |
| iOS      | SwiftUI [`ScrollView`](https://developer.apple.com/documentation/swiftui/scrollview).                                                                                                                                                                                     |
| Web      | React Native [`ScrollView`](https://reactnative.dev/docs/scrollview).                                                                                                                                                                                                     |

**Android**

![A vertical list of six items inside a scroll view](/static/images/expo-ui/scrollview/android-light.webp)

**iOS**

![A vertical list of items inside a scroll view](/static/images/expo-ui/scrollview/ios-light.webp)

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

### Vertical scrolling

**Android**

![A vertical list of numbered rows filling the screen](/static/images/expo-ui/examples/universal-scrollview-vertical-android-light.webp)

**iOS**

![A vertical list of numbered rows filling the screen](/static/images/expo-ui/examples/universal-scrollview-vertical-ios-light.webp)

```tsx VerticalScrollViewExample.tsx
import { useColorScheme } from 'react-native';
import { Host, ScrollView, Column, Text } from '@expo/ui';

export default function VerticalScrollViewExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host style={{ flex: 1 }}>
      <ScrollView>
        <Column spacing={8}>
          {Array.from({ length: 30 }).map((_, i) => (
            <Text key={i} textStyle={ink}>
              {`Row ${i + 1}`}
            </Text>
          ))}
        </Column>
      </ScrollView>
    </Host>
  );
}
```

### Horizontal scrolling

**Android**

![A horizontal strip of numbered items running off the screen edge](/static/images/expo-ui/examples/universal-scrollview-horizontal-android-light.webp)

**iOS**

![A horizontal strip of numbered items running off the screen edge](/static/images/expo-ui/examples/universal-scrollview-horizontal-ios-light.webp)

```tsx HorizontalScrollViewExample.tsx
import { useColorScheme } from 'react-native';
import { Host, ScrollView, Row, Text } from '@expo/ui';

export default function HorizontalScrollViewExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <ScrollView direction="horizontal">
        <Row spacing={12}>
          {Array.from({ length: 20 }).map((_, i) => (
            <Text key={i} textStyle={ink}>
              {`Item ${i + 1}`}
            </Text>
          ))}
        </Row>
      </ScrollView>
    </Host>
  );
}
```

## API

```tsx
import { ScrollView } from '@expo/ui';
```
