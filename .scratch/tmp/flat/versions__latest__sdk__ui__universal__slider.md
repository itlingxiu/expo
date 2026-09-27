---
title: Slider 组件参考
description: A control for selecting a value from a continuous or stepped range.
---

# Slider 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A controlled slider for selecting a numeric value within a range. Pair [`value`](#value) with [`onValueChange`](#onvaluechange) to manage state from React.

**Android**

![Two Material 3 sliders at different positions](/static/images/expo-ui/slider/android-light.webp)

**iOS**

![Slider with brightness icons on either side, in a Form section](/static/images/expo-ui/slider/ios-light.webp)

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

### Continuous slider

The default range is `[0, 1]`.

**Android**

![A Material 3 slider with the handle at the halfway position](/static/images/expo-ui/examples/universal-slider-continuous-android-light.webp)

**iOS**

![A slider with the thumb at the halfway position](/static/images/expo-ui/examples/universal-slider-continuous-ios-light.webp)

```tsx ContinuousSliderExample.tsx
import { useState } from 'react';
import { Host, Slider } from '@expo/ui';

export default function ContinuousSliderExample() {
  const [value, setValue] = useState(0.5);

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Slider value={value} onValueChange={setValue} />
    </Host>
  );
}
```

### Stepped slider with custom range

Use `min`, `max`, and `step` to constrain the values produced by the slider.

**Android**

![A Volume label above a stepped Material 3 slider with tick marks](/static/images/expo-ui/examples/universal-slider-stepped-android-light.webp)

**iOS**

![A Volume label above a slider set to the middle of its range](/static/images/expo-ui/examples/universal-slider-stepped-ios-light.webp)

```tsx SteppedSliderExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, Column, Slider, Text } from '@expo/ui';

export default function SteppedSliderExample() {
  const [volume, setVolume] = useState(50);
  const colorScheme = useColorScheme();

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Column spacing={8}>
        <Text textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
          {`Volume: ${volume}`}
        </Text>
        <Slider value={volume} onValueChange={setVolume} min={0} max={100} step={10} />
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { Slider } from '@expo/ui';
```
