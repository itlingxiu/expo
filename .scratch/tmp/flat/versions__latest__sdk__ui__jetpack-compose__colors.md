---
title: Material Colors
description: Read the Material 3 color palette (including Material 3 Dynamic Colors) from JavaScript.
---

# Material Colors

> 支持平台：Android、Expo Go。

Expo UI Jetpack Compose exposes the [Material 3 color palette](https://m3.material.io/styles/color/system/overview) used by Jetpack Compose so you can pick a palette source and have every component under a [`<Host>`](/versions/latest/sdk/ui/jetpack-compose/host) theme from it consistently.

The palette source depends on the options you pass:

- **Wallpaper-derived:** Default on Android 12+ when no `seedColor` is given. Uses [Material 3 Dynamic Colors](https://m3.material.io/styles/color/dynamic-color/overview) (Material You).
- **Static [Material 3 baseline](https://m3.material.io/styles/color/roles):** Default fallback on Android 11 and below when no `seedColor` is given.
- **Seeded from a color:** When you pass a `seedColor`, the full palette is derived using the same algorithm that Material 3 Dynamic Colors use for wallpaper-based colors. Works on every Android API level and is independent of the wallpaper.

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

### Theming `<Host>` from a seed color

[`Host`](/versions/latest/sdk/ui/jetpack-compose/host) accepts `seedColor` and `colorScheme` props directly. This is the recommended way to theme a Compose subtree. Native Compose components under this `Host` render with the seeded palette and any descendant that calls [`useMaterialColors()`](#usematerialcolorsoptions) without arguments receives the same palette from the Host's context.

![A button in a light purple container with dark purple text, themed from the seed color](/static/images/expo-ui/examples/colors-branded-host-android-light.webp)

```tsx BrandedHostExample.tsx
import { Button, Host, Text } from '@expo/ui/jetpack-compose';

export default function BrandedHostExample() {
  return (
    <Host seedColor="#8E24AA" colorScheme="dark" matchContents>
      <Button onClick={() => {}}>
        <Text>Themed from the seed</Text>
      </Button>
    </Host>
  );
}
```

### Reading the current palette inside Host

Call [`useMaterialColors()`](#usematerialcolorsoptions) without arguments inside a [`<Host>`](/versions/latest/sdk/ui/jetpack-compose/host) to read the Host's current palette. The hook returns a reference-stable [`MaterialColors`](#materialcolors) object and does not cross the native bridge on re-renders.

![A surface panel printing the current primary and surface hex values](/static/images/expo-ui/examples/colors-palette-android-light.webp)

```tsx MaterialColorsExample.tsx
import {
  Column,
  Host,
  Surface,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { padding } from '@expo/ui/jetpack-compose/modifiers';

export default function MaterialColorsExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Surface>
        <PaletteInspector />
      </Surface>
    </Host>
  );
}

function PaletteInspector() {
  const colors = useMaterialColors();
  return (
    <Column
      modifiers={[padding(16, 16, 16, 16)]}
      verticalArrangement={{ spacedBy: 8 }}>
      <Text>Primary: {colors.primary}</Text>
      <Text>Surface: {colors.surface}</Text>
    </Column>
  );
}
```

### Computing a specific palette with arguments

Pass arguments to [`useMaterialColors()`](#usematerialcolorsoptions) to compute a palette on demand, even outside a `<Host>`. The `colorScheme` takes `'light'` or `'dark'`, you can omit it to follow the system.

![A surface panel printing three primary hex values for the dark, branded, and branded dark palettes](/static/images/expo-ui/examples/colors-use-material-colors-android-light.webp)

```tsx UseMaterialColorsExample.tsx
import {
  Column,
  Host,
  Surface,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { padding } from '@expo/ui/jetpack-compose/modifiers';

export default function UseMaterialColorsExample() {
  const dark = useMaterialColors({ colorScheme: 'dark' });
  const brand = useMaterialColors({ seedColor: '#8E24AA' });
  const brandedDark = useMaterialColors({
    colorScheme: 'dark',
    seedColor: '#8E24AA',
  });

  return (
    <Host style={{ flex: 1 }}>
      <Surface>
        <Column
          modifiers={[padding(16, 16, 16, 16)]}
          verticalArrangement={{ spacedBy: 8 }}>
          <Text>Dark primary: {dark.primary}</Text>
          <Text>Brand primary: {brand.primary}</Text>
          <Text>Branded dark primary: {brandedDark.primary}</Text>
        </Column>
      </Surface>
    </Host>
  );
}
```

### Reading colors outside React components

```tsx GetMaterialColorsExample.tsx
import {
  getMaterialColors,
  isDynamicColorAvailable,
} from '@expo/ui/jetpack-compose';

const palette = getMaterialColors({ seedColor: '#8E24AA' });
console.log(
  'available:',
  isDynamicColorAvailable,
  'primary:',
  palette.primary
);
```

## API
