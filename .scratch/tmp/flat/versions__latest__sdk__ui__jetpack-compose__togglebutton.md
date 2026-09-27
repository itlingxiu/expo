---
title: ToggleButton 组件参考
description: Jetpack Compose ToggleButton components for displaying native Material3 toggle buttons.
---

# ToggleButton 组件参考

> 支持平台：Android、Expo Go。

Expo UI provides four toggle button components that match the official Jetpack Compose Toggle Button API: [`ToggleButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-toggle-button.html), [`IconToggleButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-icon-toggle-button.html), [`FilledIconToggleButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-filled-icon-toggle-button.html), and [`OutlinedIconToggleButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-outlined-icon-toggle-button.html).

![A toggle button with text and two icon toggle buttons in checked and unchecked states](/static/images/expo-ui/togglebutton/android-light.webp)

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

### Basic toggle button

A toggle button with text and icon content.

![An unchecked toggle button labelled Favorite](/static/images/expo-ui/examples/togglebutton-basic-android-light.webp)

```tsx BasicToggleButtonExample.tsx
import { useState } from 'react';
import { Host, ToggleButton, Text } from '@expo/ui/jetpack-compose';

export default function BasicToggleButtonExample() {
  const [checked, setChecked] = useState(false);

  return (
    <Host matchContents>
      <ToggleButton checked={checked} onCheckedChange={setChecked}>
        <Text>Favorite</Text>
      </ToggleButton>
    </Host>
  );
}
```

### Icon toggle button variants

Use different icon toggle button components to convey varying levels of emphasis.

![Three star icon toggle buttons: plain unchecked, filled checked, and outlined unchecked](/static/images/expo-ui/examples/togglebutton-icons-android-light.webp)

```tsx IconToggleButtonVariantsExample.tsx
import { useState } from 'react';
import {
  Host,
  IconToggleButton,
  FilledIconToggleButton,
  OutlinedIconToggleButton,
  Icon,
  Row,
  Surface,
} from '@expo/ui/jetpack-compose';

const starIcon = require('./assets/star.png');

export default function IconToggleButtonVariantsExample() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(false);

  return (
    <Host matchContents>
      <Surface>
        <Row horizontalArrangement={{ spacedBy: 8 }}>
          <IconToggleButton
            checked={checked1}
            onCheckedChange={setChecked1}>
            <Icon source={starIcon} size={24} />
          </IconToggleButton>
          <FilledIconToggleButton
            checked={checked2}
            onCheckedChange={setChecked2}>
            <Icon source={starIcon} size={24} />
          </FilledIconToggleButton>
          <OutlinedIconToggleButton
            checked={checked3}
            onCheckedChange={setChecked3}>
            <Icon source={starIcon} size={24} />
          </OutlinedIconToggleButton>
        </Row>
      </Surface>
    </Host>
  );
}
```

### Custom colors

Override checked and unchecked colors using the `colors` prop.

![A checked toggle button with a green container and white ON label](/static/images/expo-ui/examples/togglebutton-colors-android-light.webp)

```tsx CustomColorsToggleButtonExample.tsx
import { useState } from 'react';
import { Host, ToggleButton, Text } from '@expo/ui/jetpack-compose';

export default function CustomColorsToggleButtonExample() {
  const [checked, setChecked] = useState(true);

  return (
    <Host matchContents>
      <ToggleButton
        checked={checked}
        onCheckedChange={setChecked}
        colors={{
          checkedContainerColor: '#4CAF50',
          checkedContentColor: '#FFFFFF',
          containerColor: '#E0E0E0',
          contentColor: '#333333',
        }}>
        <Text>{checked ? 'ON' : 'OFF'}</Text>
      </ToggleButton>
    </Host>
  );
}
```

### Disabled toggle button

![A dimmed, non-interactive toggle button labelled Disabled](/static/images/expo-ui/examples/togglebutton-disabled-android-light.webp)

```tsx DisabledToggleButtonExample.tsx
import { Host, ToggleButton, Text } from '@expo/ui/jetpack-compose';

export default function DisabledToggleButtonExample() {
  return (
    <Host matchContents>
      <ToggleButton checked={false} enabled={false}>
        <Text>Disabled</Text>
      </ToggleButton>
    </Host>
  );
}
```

## API

```tsx
import {
  ToggleButton,
  IconToggleButton,
  FilledIconToggleButton,
  OutlinedIconToggleButton,
} from '@expo/ui/jetpack-compose';
```
