---
title: FlowRow 组件参考
description: A Jetpack Compose FlowRow component for wrapping children horizontally.
---

# FlowRow 组件参考

> 支持平台：Android、Expo Go。

Expo UI FlowRow matches the official Jetpack Compose [FlowRow](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary#FlowRow) API and arranges children in a horizontal flow that wraps to the next line when it runs out of space.

![Six assist chip tags wrapping across multiple lines](/static/images/expo-ui/flowrow/android-light.webp)

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

`FlowRow` arranges children in a horizontal flow that wraps to the next line when it runs out of space.

![Six tag labels flowing across three lines, wrapping at the edge of the screen](/static/images/expo-ui/examples/flowrow-basic-android-light.webp)

```tsx FlowRowExample.tsx
import {
  Host,
  FlowRow,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  border,
  padding,
  paddingAll,
} from '@expo/ui/jetpack-compose/modifiers';

export default function FlowRowExample() {
  const colors = useMaterialColors();
  const tags = [
    'React Native',
    'Expo',
    'Android',
    'Jetpack Compose',
    'Material 3',
    'Kotlin',
  ];

  return (
    <Host style={{ flex: 1 }}>
      <FlowRow
        horizontalArrangement={{ spacedBy: 8 }}
        verticalArrangement={{ spacedBy: 8 }}
        modifiers={[paddingAll(16)]}>
        {tags.map(tag => (
          <Text
            key={tag}
            style={{ fontSize: 28 }}
            color={colors.onBackground}
            modifiers={[
              border(1, colors.outline),
              padding(12, 6, 12, 6),
            ]}>
            {tag}
          </Text>
        ))}
      </FlowRow>
    </Host>
  );
}
```

## API

```tsx
import { FlowRow } from '@expo/ui/jetpack-compose';
```
