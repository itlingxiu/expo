---
title: Surface 组件参考
description: A Jetpack Compose Surface component for styled content containers.
---

# Surface 组件参考

> 支持平台：Android、Expo Go。

Expo UI Surface matches the official Jetpack Compose [Surface](https://developer.android.com/develop/ui/compose/designsystems/material3) API and provides a container that applies Material Design surface styling including color, elevation, and content color.

![Two stacked Material 3 surfaces at low and high elevation](/static/images/expo-ui/surface/android-light.webp)

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

### Basic surface

![A pale Material 3 surface panel containing padded text](/static/images/expo-ui/examples/surface-basic-android-light.webp)

```tsx BasicSurfaceExample.tsx
import { Host, Surface, Text } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function BasicSurfaceExample() {
  return (
    <Host matchContents>
      <Surface>
        <Text modifiers={[paddingAll(16)]}>
          Content on a surface
        </Text>
      </Surface>
    </Host>
  );
}
```

### Surface with elevation

Use `tonalElevation` and `shadowElevation` to control the visual depth of the surface.

![Two stacked surfaces, the lower one casting a larger shadow than the upper one](/static/images/expo-ui/examples/surface-elevation-android-light.webp)

```tsx SurfaceElevationExample.tsx
import {
  Host,
  Surface,
  Column,
  Text,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function SurfaceElevationExample() {
  return (
    <Host matchContents>
      <Column
        verticalArrangement={{ spacedBy: 16 }}
        modifiers={[paddingAll(16)]}>
        <Surface tonalElevation={1} shadowElevation={2}>
          <Text modifiers={[paddingAll(16)]}>Low elevation</Text>
        </Surface>
        <Surface tonalElevation={4} shadowElevation={8}>
          <Text modifiers={[paddingAll(16)]}>High elevation</Text>
        </Surface>
      </Column>
    </Host>
  );
}
```

### Surface with custom colors

Use the `color` and `contentColor` props to override the default Material theme colors.

![A dark navy surface panel with white text](/static/images/expo-ui/examples/surface-colors-android-light.webp)

```tsx SurfaceCustomColorsExample.tsx
import { Host, Surface, Text } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function SurfaceCustomColorsExample() {
  return (
    <Host matchContents>
      <Surface
        color="#1E3A5F"
        contentColor="#FFFFFF"
        tonalElevation={2}>
        <Text color="#FFFFFF" modifiers={[paddingAll(16)]}>
          Custom colored surface
        </Text>
      </Surface>
    </Host>
  );
}
```

### Surface with shape and border

Use the `shape` prop to clip content and `border` to draw a stroke around the surface.

![A surface with 16dp rounded corners outlined by a purple two-pixel border](/static/images/expo-ui/examples/surface-shape-android-light.webp)

```tsx SurfaceShapeBorderExample.tsx
import {
  Host,
  Surface,
  Shape,
  Text,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function SurfaceShapeBorderExample() {
  return (
    <Host matchContents>
      <Surface
        shape={Shape.RoundedCorner({
          cornerRadii: {
            topStart: 16,
            topEnd: 16,
            bottomStart: 16,
            bottomEnd: 16,
          },
        })}
        border={{ width: 2, color: '#6200EE' }}>
        <Text modifiers={[paddingAll(16)]}>
          Rounded surface with border
        </Text>
      </Surface>
    </Host>
  );
}
```

## API

```tsx
import { Surface } from '@expo/ui/jetpack-compose';
```
