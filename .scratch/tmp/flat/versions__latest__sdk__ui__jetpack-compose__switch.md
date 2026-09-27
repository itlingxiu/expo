---
title: Switch 组件参考
description: A Jetpack Compose Switch component for toggle controls.
---

# Switch 组件参考

> 支持平台：Android、Expo Go。

> **info** For cross-platform usage, see the universal [`Switch`](/versions/latest/sdk/ui/universal/switch) — it renders the appropriate native component per platform.

Expo UI Switch matches the official Jetpack Compose [Switch](https://developer.android.com/develop/ui/compose/components/switch) API.

![Two Material 3 switches showing on and off states](/static/images/expo-ui/switch/android-light.webp)

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

### Toggle switch

![A Material 3 switch in its unchecked state](/static/images/expo-ui/examples/switch-toggle-android-light.webp)

```tsx ToggleSwitchExample.tsx
import { useState } from 'react';
import { Host, Switch } from '@expo/ui/jetpack-compose';

export default function ToggleSwitchExample() {
  const [checked, setChecked] = useState(false);

  return (
    <Host matchContents>
      <Switch value={checked} onCheckedChange={setChecked} />
    </Host>
  );
}
```

### Custom colors

![A checked switch with a purple thumb on a pale lavender track](/static/images/expo-ui/examples/switch-colors-android-light.webp)

```tsx CustomColorsExample.tsx
import { useState } from 'react';
import { Host, Switch } from '@expo/ui/jetpack-compose';

export default function CustomColorsExample() {
  const [checked, setChecked] = useState(false);

  return (
    <Host matchContents>
      <Switch
        value={checked}
        onCheckedChange={setChecked}
        colors={{
          checkedThumbColor: '#6200EE',
          checkedTrackColor: '#EDE9FE',
          uncheckedThumbColor: '#9CA3AF',
          uncheckedTrackColor: '#F3F4F6',
          uncheckedBorderColor: '#D1D5DB',
        }}
      />
    </Host>
  );
}
```

### Custom thumb content

Use `Switch.ThumbContent` to render a custom element inside the thumb. `Switch.DefaultIconSize` gives you the M3 default icon size so your content fits perfectly.

![A checked switch whose purple thumb contains a white circle, reading as a ring](/static/images/expo-ui/examples/switch-thumb-android-light.webp)

```tsx ThumbContentExample.tsx
import { useState } from 'react';
import { Host, Switch, Box } from '@expo/ui/jetpack-compose';
import {
  size,
  clip,
  background,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';

export default function ThumbContentExample() {
  const [checked, setChecked] = useState(false);

  return (
    <Host matchContents>
      <Switch
        value={checked}
        onCheckedChange={setChecked}
        colors={{
          checkedThumbColor: '#7C3AED',
          checkedTrackColor: '#EDE9FE',
          checkedIconColor: '#7C3AED',
          uncheckedThumbColor: '#9CA3AF',
          uncheckedTrackColor: '#F3F4F6',
          uncheckedBorderColor: '#D1D5DB',
          uncheckedIconColor: '#9CA3AF',
        }}>
        <Switch.ThumbContent>
          <Box
            modifiers={[
              size(Switch.DefaultIconSize, Switch.DefaultIconSize),
              clip(Shapes.Circle),
              background(checked ? '#FFFFFF' : '#E5E7EB'),
            ]}
          />
        </Switch.ThumbContent>
      </Switch>
    </Host>
  );
}
```

## API

```tsx
import { Switch } from '@expo/ui/jetpack-compose';
```
