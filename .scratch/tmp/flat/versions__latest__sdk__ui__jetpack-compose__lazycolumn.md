---
title: LazyColumn 组件参考
description: A Jetpack Compose LazyColumn component for displaying scrollable lists.
---

# LazyColumn 组件参考

> 支持平台：Android、Expo Go。

A lazily-loaded vertical list component that only renders visible items for efficient scrolling. See the [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/lists) for more information.

> **info** `LazyColumn` is not truly lazy yet: the native side only composes visible items, but React still creates every child up front, so large lists can be slow to mount. We are working on improving this. For large lists, we recommend [FlashList](https://shopify.github.io/flash-list) or [Legend List](https://github.com/LegendApp/legend-list).

![LazyColumn rendering a settings list of five Material 3 list items](/static/images/expo-ui/lazycolumn/android-light.webp)

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

### Basic lazy column

![A scrollable list showing the first seven of one hundred items](/static/images/expo-ui/examples/lazycolumn-basic-android-light.webp)

```tsx BasicLazyColumn.tsx
import {
  Host,
  LazyColumn,
  ListItem,
  Text,
} from '@expo/ui/jetpack-compose';

const items = Array.from(
  { length: 100 },
  (_, i) => `Item ${i + 1}`
);

export default function BasicLazyColumn() {
  return (
    <Host style={{ height: 400 }}>
      <LazyColumn>
        {items.map(item => (
          <ListItem key={item}>
            <ListItem.HeadlineContent>
              <Text>{item}</Text>
            </ListItem.HeadlineContent>
          </ListItem>
        ))}
      </LazyColumn>
    </Host>
  );
}
```

### With arrangement

Use the `verticalArrangement` prop to control how items are spaced within the list. Pass a string value like `'spaceBetween'` or an object like `{ spacedBy: 8 }` for fixed spacing in dp.

![Three list items separated by an eight density independent pixel gap](/static/images/expo-ui/examples/lazycolumn-arrangement-android-light.webp)

```tsx LazyColumnArrangement.tsx
import {
  Host,
  LazyColumn,
  ListItem,
  Text,
} from '@expo/ui/jetpack-compose';

export default function LazyColumnArrangement() {
  return (
    <Host style={{ height: 400 }}>
      <LazyColumn
        verticalArrangement={{ spacedBy: 8 }}
        horizontalAlignment="center">
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>Spaced Item 1</Text>
          </ListItem.HeadlineContent>
        </ListItem>
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>Spaced Item 2</Text>
          </ListItem.HeadlineContent>
        </ListItem>
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>Spaced Item 3</Text>
          </ListItem.HeadlineContent>
        </ListItem>
      </LazyColumn>
    </Host>
  );
}
```

### With content padding

Use the `contentPadding` prop to add padding around the list content in dp.

![Three list items inset from the edges of the list by content padding](/static/images/expo-ui/examples/lazycolumn-padding-android-light.webp)

```tsx LazyColumnPadding.tsx
import {
  Host,
  LazyColumn,
  ListItem,
  Text,
} from '@expo/ui/jetpack-compose';

export default function LazyColumnPadding() {
  return (
    <Host style={{ height: 400 }}>
      <LazyColumn
        contentPadding={{ start: 16, top: 8, end: 16, bottom: 8 }}>
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>Padded item 1</Text>
          </ListItem.HeadlineContent>
        </ListItem>
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>Padded item 2</Text>
          </ListItem.HeadlineContent>
        </ListItem>
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>Padded item 3</Text>
          </ListItem.HeadlineContent>
        </ListItem>
      </LazyColumn>
    </Host>
  );
}
```

## API

```tsx
import { LazyColumn } from '@expo/ui/jetpack-compose';
```
