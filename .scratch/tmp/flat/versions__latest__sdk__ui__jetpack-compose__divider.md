---
title: Divider 组件参考
description: Jetpack Compose Divider components for creating visual separators.
---

# Divider 组件参考

> 支持平台：Android、Expo Go。

Expo UI provides [`HorizontalDivider`](<https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#HorizontalDivider(androidx.compose.ui.Modifier,androidx.compose.ui.unit.Dp,androidx.compose.ui.graphics.Color)>) and [`VerticalDivider`](<https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#VerticalDivider(androidx.compose.ui.Modifier,androidx.compose.ui.unit.Dp,androidx.compose.ui.graphics.Color)>) matching the official Jetpack Compose Divider API.

![Three text sections separated by horizontal Material 3 dividers](/static/images/expo-ui/divider/android-light.webp)

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

### Horizontal divider

A thin horizontal line to visually separate content in lists and layouts.

![A full width line separating the labels First section and Second section](/static/images/expo-ui/examples/divider-horizontal-android-light.webp)

```tsx HorizontalDividerExample.tsx
import {
  Host,
  HorizontalDivider,
  Column,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';

export default function HorizontalDividerExample() {
  const colors = useMaterialColors();

  return (
    <Host style={{ flex: 1 }}>
      <Column>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          First section
        </Text>
        <HorizontalDivider />
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Second section
        </Text>
      </Column>
    </Host>
  );
}
```

### Custom thickness and color

Both `HorizontalDivider` and `VerticalDivider` accept `thickness` and `color` props. Use `StyleSheet.hairlineWidth` for a single-pixel line, or set a custom thickness and color.

![A faint hairline divider above a thick pink divider, each separating a label](/static/images/expo-ui/examples/divider-custom-android-light.webp)

```tsx CustomDividerExample.tsx
import {
  Host,
  HorizontalDivider,
  Column,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { StyleSheet } from 'react-native';

export default function CustomDividerExample() {
  const colors = useMaterialColors();

  return (
    <Host style={{ flex: 1 }}>
      <Column>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Hairline divider (1 pixel)
        </Text>
        <HorizontalDivider thickness={StyleSheet.hairlineWidth} />
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Thick colored divider
        </Text>
        <HorizontalDivider thickness={4} color="#E91E63" />
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Below
        </Text>
      </Column>
    </Host>
  );
}
```

### Vertical divider

A vertical line to separate items side by side in a row layout.

![A short vertical line separating the labels Left and Right](/static/images/expo-ui/examples/divider-vertical-android-light.webp)

```tsx VerticalDividerExample.tsx
import {
  Host,
  VerticalDivider,
  Row,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { height } from '@expo/ui/jetpack-compose/modifiers';

export default function VerticalDividerExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Row
        verticalAlignment="center"
        horizontalArrangement={{ spacedBy: 16 }}
        modifiers={[height(48)]}>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Left
        </Text>
        <VerticalDivider />
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Right
        </Text>
      </Row>
    </Host>
  );
}
```

## API

```tsx
import {
  HorizontalDivider,
  VerticalDivider,
} from '@expo/ui/jetpack-compose';
```
