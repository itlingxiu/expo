---
title: ExposedDropdownMenuBox 组件参考
description: A Jetpack Compose ExposedDropdownMenuBox component for displaying a dropdown menu with a customizable anchor.
---

# ExposedDropdownMenuBox 组件参考

> 支持平台：Android、Expo Go。

> **info** For a cross-platform picker, see [`Picker`](/versions/latest/sdk/ui/universal/picker) — built on top of `ExposedDropdownMenuBox` on Android.

Expo UI `ExposedDropdownMenuBox` matches the official Jetpack Compose [`ExposedDropdownMenuBox`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-exposed-dropdown-menu-box.html). Use the `menuAnchor()` modifier on the anchor content (typically a read-only `TextField`) and `ExposedDropdownMenu` to wrap `DropdownMenuItem` children.

![Exposed dropdown menu showing four language options anchored to a text field](/static/images/expo-ui/exposeddropdownmenubox/android-light.webp)

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

### Basic

> The anchor is a read-only `TextField` bound to a [`useNativeState`](usenativestate) observable. Update that observable in each item's `onClick` to reflect the selected value.

![A read-only text field showing Java with an open menu below it listing Java, JavaScript, and TypeScript](/static/images/expo-ui/examples/exposeddropdownmenubox-basic-android-light.webp)

```tsx BasicExposedDropdownMenuBoxExample.tsx
import {
  DropdownMenuItem,
  ExposedDropdownMenuBox,
  ExposedDropdownMenu,
  Host,
  Text,
  TextField,
  useNativeState,
} from '@expo/ui/jetpack-compose';
import { menuAnchor } from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';

const LANGUAGES = [
  { label: 'Java', value: 'java' },
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
];

export default function BasicExposedDropdownMenuBoxExample() {
  const selectedLabel = useNativeState('Java');
  const [expanded, setExpanded] = useState(false);

  return (
    <Host matchContents>
      <ExposedDropdownMenuBox
        expanded={expanded}
        onExpandedChange={setExpanded}>
        <TextField
          value={selectedLabel}
          readOnly
          modifiers={[menuAnchor()]}
        />
        <ExposedDropdownMenu
          expanded={expanded}
          onDismissRequest={() => setExpanded(false)}>
          {LANGUAGES.map(lang => (
            <DropdownMenuItem
              key={lang.value}
              onClick={() => {
                selectedLabel.value = lang.label;
                setExpanded(false);
              }}>
              <DropdownMenuItem.Text>
                <Text>{lang.label}</Text>
              </DropdownMenuItem.Text>
            </DropdownMenuItem>
          ))}
        </ExposedDropdownMenu>
      </ExposedDropdownMenuBox>
    </Host>
  );
}
```

## API

```tsx
import { ExposedDropdownMenuBox } from '@expo/ui/jetpack-compose';
```
