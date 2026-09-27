---
title: Row 组件参考
description: A Jetpack Compose Row component for placing children horizontally.
---

# Row 组件参考

> 支持平台：Android、Expo Go。

> **info** For cross-platform usage, see the universal [`Row`](/versions/latest/sdk/ui/universal/row) — it renders the appropriate native component per platform.

Expo UI Row matches the official Jetpack Compose [Row](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary#Row) API and places children horizontally with configurable arrangement and alignment.

![Three colored boxes laid out horizontally inside a Row](/static/images/expo-ui/row/android-light.webp)

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

`Row` places children horizontally. Use `horizontalArrangement` and `verticalAlignment` to control spacing and alignment.

![Three labels spread evenly across the width of a row](/static/images/expo-ui/examples/row-basic-android-light.webp)

```tsx RowExample.tsx
import {
  Host,
  Row,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  height,
} from '@expo/ui/jetpack-compose/modifiers';

export default function RowExample() {
  const colors = useMaterialColors();

  return (
    <Host style={{ flex: 1 }}>
      <Row
        horizontalArrangement="spaceEvenly"
        verticalAlignment="center"
        modifiers={[fillMaxWidth(), height(60)]}>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Item 1
        </Text>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Item 2
        </Text>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Item 3
        </Text>
      </Row>
    </Host>
  );
}
```

## API

```tsx
import { Row } from '@expo/ui/jetpack-compose';
```
