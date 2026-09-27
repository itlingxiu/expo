---
title: Column 组件参考
description: A Jetpack Compose Column component for placing children vertically.
---

# Column 组件参考

> 支持平台：Android、Expo Go。

> **info** For cross-platform usage, see the universal [`Column`](/versions/latest/sdk/ui/universal/column) — it renders the appropriate native component per platform.

Expo UI Column matches the official Jetpack Compose [Column](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary#Column) API and places children vertically with configurable arrangement and alignment.

![Three colored boxes stacked vertically inside a Column](/static/images/expo-ui/column/android-light.webp)

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

`Column` places children vertically. Use `verticalArrangement` and `horizontalAlignment` to control spacing and alignment.

![Three labels, First, Second, and Third, stacked vertically and centered horizontally](/static/images/expo-ui/examples/column-basic-android-light.webp)

```tsx ColumnExample.tsx
import {
  Host,
  Column,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  paddingAll,
} from '@expo/ui/jetpack-compose/modifiers';

export default function ColumnExample() {
  const colors = useMaterialColors();

  return (
    <Host style={{ flex: 1 }}>
      <Column
        verticalArrangement={{ spacedBy: 8 }}
        horizontalAlignment="center"
        modifiers={[fillMaxWidth(), paddingAll(16)]}>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          First
        </Text>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Second
        </Text>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Third
        </Text>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { Column } from '@expo/ui/jetpack-compose';
```
