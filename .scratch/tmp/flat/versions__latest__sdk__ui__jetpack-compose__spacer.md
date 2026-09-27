---
title: Spacer 组件参考
description: A Jetpack Compose Spacer component for adding flexible space between elements.
---

# Spacer 组件参考

> 支持平台：Android、Expo Go。

> **info** For cross-platform usage, see the universal [`Spacer`](/versions/latest/sdk/ui/universal/spacer) — it renders the appropriate native component per platform.

Expo UI Spacer matches the official Jetpack Compose [Spacer](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary#Spacer) API and is used to add flexible or fixed-size space between elements in a layout.

![Two boxes pushed to opposite ends of a Row by a Spacer with weight modifier](/static/images/expo-ui/spacer/android-light.webp)

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

### Spacer with weight

Use the `weight()` modifier to make the spacer fill available space proportionally within a `Row` or `Column`.

![The labels Left and Right pushed to opposite ends of a row by a weighted spacer](/static/images/expo-ui/examples/spacer-weight-android-light.webp)

```tsx SpacerWeightExample.tsx
import {
  Host,
  Row,
  Spacer,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';

export default function SpacerWeightExample() {
  const colors = useMaterialColors();

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Row modifiers={[fillMaxWidth()]}>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Left
        </Text>
        <Spacer modifiers={[weight(1)]} />
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Right
        </Text>
      </Row>
    </Host>
  );
}
```

### Spacer with fixed size

Use a `height` or `width` modifier to create a spacer with a fixed dimension.

![Two stacked labels separated by a fixed 24dp vertical gap](/static/images/expo-ui/examples/spacer-fixed-android-light.webp)

```tsx SpacerFixedSizeExample.tsx
import {
  Host,
  Column,
  Spacer,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { height } from '@expo/ui/jetpack-compose/modifiers';

export default function SpacerFixedSizeExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Column>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Above
        </Text>
        <Spacer modifiers={[height(24)]} />
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Below (24dp gap)
        </Text>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { Spacer } from '@expo/ui/jetpack-compose';
```
