---
title: FloatingActionButton 组件参考
description: Jetpack Compose FloatingActionButton components following Material Design 3.
---

# FloatingActionButton 组件参考

> 支持平台：Android、Expo Go。

Expo UI provides four FloatingActionButton variants matching the Material Design 3 [`FloatingActionButton`](https://developer.android.com/develop/ui/compose/components/fab) API:

- `SmallFloatingActionButton` — a compact FAB
- `FloatingActionButton` — the standard FAB (default size)
- `LargeFloatingActionButton` — a larger FAB
- `ExtendedFloatingActionButton` — a FAB with an icon and a text label, supporting animated expand/collapse

Each component uses slot-based children (`.Icon` and, for `ExtendedFloatingActionButton`, `.Text`) to compose content.

> **Note:** If you need multiple action buttons in a floating toolbar, use [`HorizontalFloatingToolbar`](/versions/latest/sdk/ui/jetpack-compose/horizontalfloatingtoolbar) instead.

![Small, regular, and large Material 3 floating action buttons](/static/images/expo-ui/floatingactionbutton/android-light.webp)

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

### Standard FloatingActionButton

![A standard floating action button with a plus icon](/static/images/expo-ui/examples/fab-standard-android-light.webp)

```tsx StandardFABExample.tsx
import {
  FloatingActionButton,
  Host,
  Icon,
} from '@expo/ui/jetpack-compose';

export default function StandardFABExample() {
  return (
    <Host matchContents>
      <FloatingActionButton
        onClick={() => console.log('FAB pressed')}>
        <FloatingActionButton.Icon>
          <Icon source={require('./assets/add.xml')} />
        </FloatingActionButton.Icon>
      </FloatingActionButton>
    </Host>
  );
}
```

### FAB variants

![Small, standard, and large floating action buttons side by side, each with a plus icon](/static/images/expo-ui/examples/fab-variants-android-light.webp)

```tsx FABVariantsExample.tsx
import {
  FloatingActionButton,
  Host,
  Icon,
  LargeFloatingActionButton,
  SmallFloatingActionButton,
} from '@expo/ui/jetpack-compose';
import { View } from 'react-native';

export default function FABVariantsExample() {
  return (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <Host matchContents>
        <SmallFloatingActionButton onClick={() => {}}>
          <SmallFloatingActionButton.Icon>
            <Icon source={require('./assets/add.xml')} />
          </SmallFloatingActionButton.Icon>
        </SmallFloatingActionButton>
      </Host>
      <Host matchContents>
        <FloatingActionButton onClick={() => {}}>
          <FloatingActionButton.Icon>
            <Icon source={require('./assets/add.xml')} />
          </FloatingActionButton.Icon>
        </FloatingActionButton>
      </Host>
      <Host matchContents>
        <LargeFloatingActionButton onClick={() => {}}>
          <LargeFloatingActionButton.Icon>
            <Icon source={require('./assets/add.xml')} />
          </LargeFloatingActionButton.Icon>
        </LargeFloatingActionButton>
      </Host>
    </View>
  );
}
```

### ExtendedFloatingActionButton

![An extended floating action button with a pencil icon and the label Edit](/static/images/expo-ui/examples/fab-extended-android-light.webp)

```tsx ExtendedFABExample.tsx
import {
  ExtendedFloatingActionButton,
  Host,
  Icon,
  Text,
} from '@expo/ui/jetpack-compose';
import { useState } from 'react';

export default function ExtendedFABExample() {
  const [expanded, setExpanded] = useState(true);

  return (
    <Host matchContents>
      <ExtendedFloatingActionButton
        expanded={expanded}
        onClick={() => setExpanded(v => !v)}>
        <ExtendedFloatingActionButton.Icon>
          <Icon source={require('./assets/edit.xml')} />
        </ExtendedFloatingActionButton.Icon>
        <ExtendedFloatingActionButton.Text>
          <Text>Edit</Text>
        </ExtendedFloatingActionButton.Text>
      </ExtendedFloatingActionButton>
    </Host>
  );
}
```

### Floating over content

Use a Compose `Box` with `align('bottomEnd')` to position the FAB over scrollable content entirely within the Compose layer.

![A floating action button in the bottom right corner over a scrollable list of items](/static/images/expo-ui/examples/fab-floating-android-light.webp)

```tsx FloatingFABExample.tsx
import {
  Box,
  FloatingActionButton,
  Host,
  Icon,
  LazyColumn,
  ListItem,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  align,
  fillMaxSize,
  offset,
} from '@expo/ui/jetpack-compose/modifiers';

const ITEMS = Array.from(
  { length: 20 },
  (_, index) => `Item ${index + 1}`
);

export default function FloatingFABExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Box modifiers={[fillMaxSize()]}>
        <LazyColumn modifiers={[fillMaxSize()]}>
          {ITEMS.map(item => (
            <ListItem key={item}>
              <ListItem.HeadlineContent>
                <Text>{item}</Text>
              </ListItem.HeadlineContent>
            </ListItem>
          ))}
        </LazyColumn>

        <FloatingActionButton
          modifiers={[align('bottomEnd'), offset(-16, -16)]}
          onClick={() => console.log('pressed')}>
          <FloatingActionButton.Icon>
            <Icon source={require('./assets/add.xml')} />
          </FloatingActionButton.Icon>
        </FloatingActionButton>
      </Box>
    </Host>
  );
}
```

### Custom color

![An extended floating action button with a light purple container and the label New item](/static/images/expo-ui/examples/fab-custom-color-android-light.webp)

```tsx FABCustomColorExample.tsx
import {
  ExtendedFloatingActionButton,
  Host,
  Icon,
  Text,
} from '@expo/ui/jetpack-compose';

export default function FABCustomColorExample() {
  return (
    <Host matchContents>
      <ExtendedFloatingActionButton
        containerColor="#E8DEF8"
        onClick={() => console.log('pressed')}>
        <ExtendedFloatingActionButton.Icon>
          <Icon source={require('./assets/add.xml')} />
        </ExtendedFloatingActionButton.Icon>
        <ExtendedFloatingActionButton.Text>
          <Text>New item</Text>
        </ExtendedFloatingActionButton.Text>
      </ExtendedFloatingActionButton>
    </Host>
  );
}
```

## API

```tsx
import {
  SmallFloatingActionButton,
  FloatingActionButton,
  LargeFloatingActionButton,
  ExtendedFloatingActionButton,
} from '@expo/ui/jetpack-compose';
```
