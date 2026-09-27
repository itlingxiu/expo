---
title: LazyRow 组件参考
description: A Jetpack Compose LazyRow component for displaying horizontally scrolling lists.
---

# LazyRow 组件参考

> 支持平台：Android、Expo Go。

A lazily-loaded horizontal list component that only renders visible items for efficient scrolling. See the [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/lists) for more information.

> **info** `LazyRow` is not truly lazy yet: the native side only composes visible items, but React still creates every child up front, so large lists can be slow to mount. We are working on improving this. For large lists, we recommend [FlashList](https://shopify.github.io/flash-list) or [Legend List](https://github.com/LegendApp/legend-list).

![LazyRow rendering colored category cards in a horizontally scrolling list](/static/images/expo-ui/lazyrow/android-light.webp)

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

### Basic lazy row

![Outlined items in a horizontal row, scrolling off the right edge of the screen](/static/images/expo-ui/examples/lazyrow-basic-android-light.webp)

```tsx BasicLazyRow.tsx
import {
  Host,
  LazyRow,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  border,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';

const items = Array.from(
  { length: 100 },
  (_, i) => `Item ${i + 1}`
);

export default function BasicLazyRow() {
  const colors = useMaterialColors();

  return (
    <Host style={{ height: 100 }}>
      <LazyRow>
        {items.map(item => (
          <Text
            key={item}
            style={{ fontSize: 28 }}
            color={colors.onBackground}
            modifiers={[
              border(1, colors.outline),
              padding(12, 6, 12, 6),
            ]}>
            {item}
          </Text>
        ))}
      </LazyRow>
    </Host>
  );
}
```

### With arrangement

Use the `horizontalArrangement` prop to control how items are spaced within the list. Pass a string value like `'spaceBetween'` or an object like `{ spacedBy: 8 }` for fixed spacing in dp.

![Outlined row items separated by a sixteen density independent pixel gap](/static/images/expo-ui/examples/lazyrow-arrangement-android-light.webp)

```tsx LazyRowArrangement.tsx
import {
  Host,
  LazyRow,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  border,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';

export default function LazyRowArrangement() {
  const colors = useMaterialColors();

  return (
    <Host style={{ height: 100 }}>
      <LazyRow
        horizontalArrangement={{ spacedBy: 16 }}
        verticalAlignment="center">
        <Text
          style={{ fontSize: 28 }}
          color={colors.onBackground}
          modifiers={[
            border(1, colors.outline),
            padding(12, 6, 12, 6),
          ]}>
          Spaced item 1
        </Text>
        <Text
          style={{ fontSize: 28 }}
          color={colors.onBackground}
          modifiers={[
            border(1, colors.outline),
            padding(12, 6, 12, 6),
          ]}>
          Spaced item 2
        </Text>
        <Text
          style={{ fontSize: 28 }}
          color={colors.onBackground}
          modifiers={[
            border(1, colors.outline),
            padding(12, 6, 12, 6),
          ]}>
          Spaced item 3
        </Text>
      </LazyRow>
    </Host>
  );
}
```

### With content padding

Use the `contentPadding` prop to add padding around the list content in dp.

![Outlined row items inset from the start of the list by content padding](/static/images/expo-ui/examples/lazyrow-padding-android-light.webp)

```tsx LazyRowPadding.tsx
import {
  Host,
  LazyRow,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  border,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';

export default function LazyRowPadding() {
  const colors = useMaterialColors();

  return (
    <Host style={{ height: 100 }}>
      <LazyRow
        contentPadding={{ start: 16, top: 8, end: 16, bottom: 8 }}>
        <Text
          style={{ fontSize: 28 }}
          color={colors.onBackground}
          modifiers={[
            border(1, colors.outline),
            padding(12, 6, 12, 6),
          ]}>
          Padded item 1
        </Text>
        <Text
          style={{ fontSize: 28 }}
          color={colors.onBackground}
          modifiers={[
            border(1, colors.outline),
            padding(12, 6, 12, 6),
          ]}>
          Padded item 2
        </Text>
        <Text
          style={{ fontSize: 28 }}
          color={colors.onBackground}
          modifiers={[
            border(1, colors.outline),
            padding(12, 6, 12, 6),
          ]}>
          Padded item 3
        </Text>
      </LazyRow>
    </Host>
  );
}
```

## API

```tsx
import { LazyRow } from '@expo/ui/jetpack-compose';
```
