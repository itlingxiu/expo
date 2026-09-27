---
title: Card 组件参考
description: A Jetpack Compose Card component for displaying content in a styled container.
---

# Card 组件参考

> 支持平台：Android、Expo Go。

Expo UI Card matches the official Jetpack Compose [Card API](https://developer.android.com/develop/ui/compose/components/card) and displays content inside a styled surface container with optional elevation and outline. The `Card` component renders a [filled card](https://developer.android.com/develop/ui/compose/components/card#filled), while `ElevatedCard` and `OutlinedCard` provide raised and bordered variants respectively.

![Filled, elevated, and outlined Material 3 cards](/static/images/expo-ui/card/android-light.webp)

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

### Basic card

![A filled Material 3 card holding a single line of padded text](/static/images/expo-ui/examples/card-basic-android-light.webp)

```tsx BasicCardExample.tsx
import { Host, Card, Text } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function BasicCardExample() {
  return (
    <Host matchContents>
      <Card>
        <Text modifiers={[paddingAll(16)]}>
          This is a basic card with default styling.
        </Text>
      </Card>
    </Host>
  );
}
```

### Card types

Use `Card` (filled), `ElevatedCard`, or `OutlinedCard` for different styles.

![Filled, elevated, and outlined cards stacked in a column](/static/images/expo-ui/examples/card-types-android-light.webp)

```tsx CardTypesExample.tsx
import {
  Host,
  Card,
  ElevatedCard,
  OutlinedCard,
  Text,
  Column,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function CardTypesExample() {
  return (
    <Host matchContents>
      <Column verticalArrangement={{ spacedBy: 12 }}>
        <Card>
          <Text modifiers={[paddingAll(16)]}>Filled card</Text>
        </Card>
        <ElevatedCard>
          <Text modifiers={[paddingAll(16)]}>Elevated card</Text>
        </ElevatedCard>
        <OutlinedCard>
          <Text modifiers={[paddingAll(16)]}>Outlined card</Text>
        </OutlinedCard>
      </Column>
    </Host>
  );
}
```

### Custom elevation

Use the `elevation` prop (in dp) to control shadow depth. Elevation is most meaningful on `ElevatedCard`, which uses shadow elevation. Filled `Card` uses tonal elevation by default, so changes may be subtle.

![An elevated card casting a shadow at 8dp elevation](/static/images/expo-ui/examples/card-elevated-android-light.webp)

```tsx ElevatedCardExample.tsx
import { Host, ElevatedCard, Text } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function ElevatedCardExample() {
  return (
    <Host matchContents>
      <ElevatedCard elevation={8}>
        <Text modifiers={[paddingAll(16)]}>
          Card with 8dp elevation
        </Text>
      </ElevatedCard>
    </Host>
  );
}
```

### Custom border

`Card` and `OutlinedCard` accept a `border` prop to customize stroke width and color.

![An outlined card with a 2dp purple border](/static/images/expo-ui/examples/card-outlined-android-light.webp)

```tsx OutlinedCardExample.tsx
import { Host, OutlinedCard, Text } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function OutlinedCardExample() {
  return (
    <Host matchContents>
      <OutlinedCard border={{ width: 2, color: '#6200EE' }}>
        <Text modifiers={[paddingAll(16)]}>
          Card with custom purple border
        </Text>
      </OutlinedCard>
    </Host>
  );
}
```

## API

```tsx
import {
  Card,
  ElevatedCard,
  OutlinedCard,
} from '@expo/ui/jetpack-compose';
```
