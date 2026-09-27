---
title: Slider 组件参考
description: A Jetpack Compose Slider component for selecting values from a range.
---

# Slider 组件参考

> 支持平台：Android、Expo Go。

> **info** For cross-platform usage, see the universal [`Slider`](/versions/latest/sdk/ui/universal/slider) — it renders the appropriate native component per platform.

Expo UI Slider matches the official Jetpack Compose [Slider API](https://developer.android.com/develop/ui/compose/components/slider) and allows selecting values from a bounded range.

![Two Material 3 sliders at different positions](/static/images/expo-ui/slider/android-light.webp)

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

### Basic slider

![A Material 3 slider with the thumb at the midpoint](/static/images/expo-ui/examples/slider-basic-android-light.webp)

```tsx BasicSliderExample.tsx
import { useState } from 'react';
import { Host, Slider } from '@expo/ui/jetpack-compose';

export default function BasicSliderExample() {
  const [value, setValue] = useState(0.5);

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Slider value={value} onValueChange={setValue} />
    </Host>
  );
}
```

### Slider with custom range

Use the `min` and `max` props to define the slider's value range.

![A slider ranging from 0 to 100 with the thumb at 50](/static/images/expo-ui/examples/slider-custom-range-android-light.webp)

```tsx CustomRangeSliderExample.tsx
import { useState } from 'react';
import { Host, Slider } from '@expo/ui/jetpack-compose';

export default function CustomRangeSliderExample() {
  const [value, setValue] = useState(50);

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Slider
        value={value}
        min={0}
        max={100}
        onValueChange={setValue}
      />
    </Host>
  );
}
```

### Slider with steps

Use the `steps` prop to define discrete increments. Set `steps` to `0` for continuous values.

![A slider with eleven tick marks and the thumb at the far left](/static/images/expo-ui/examples/slider-stepped-android-light.webp)

```tsx SteppedSliderExample.tsx
import { useState } from 'react';
import { Host, Slider } from '@expo/ui/jetpack-compose';

export default function SteppedSliderExample() {
  const [value, setValue] = useState(0);

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Slider
        value={value}
        min={0}
        max={100}
        steps={10}
        onValueChange={setValue}
      />
    </Host>
  );
}
```

### Custom colors

Use the `colors` prop to override the default Material3 colors for the slider's thumb, track, and tick marks.

![A slider with a purple thumb, purple active track, and grey inactive track](/static/images/expo-ui/examples/slider-custom-colors-android-light.webp)

```tsx CustomColorsSliderExample.tsx
import { useState } from 'react';
import { Host, Slider } from '@expo/ui/jetpack-compose';

export default function CustomColorsSliderExample() {
  const [value, setValue] = useState(0.5);

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Slider
        value={value}
        colors={{
          thumbColor: '#6200EE',
          activeTrackColor: '#6200EE',
          inactiveTrackColor: '#E0E0E0',
        }}
        onValueChange={setValue}
      />
    </Host>
  );
}
```

### Custom thumb and track

Use both `Slider.Thumb` and `Slider.Track` slots for a fully custom slider appearance.

![A slider with a purple circular thumb on a purple and grey split track](/static/images/expo-ui/examples/slider-custom-thumb-track-android-light.webp)

```tsx FullyCustomSliderExample.tsx
import { useState } from 'react';
import {
  Host,
  Slider,
  Shape,
  Row,
  Box,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  height,
  weight,
  size,
  clip,
  background,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';

export default function FullyCustomSliderExample() {
  const [value, setValue] = useState(0.5);

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Slider value={value} onValueChange={setValue}>
        <Slider.Thumb>
          <Box
            modifiers={[
              size(24, 24),
              clip(Shapes.Circle),
              background('#6200EE'),
            ]}
          />
        </Slider.Thumb>
        <Slider.Track>
          <Row modifiers={[fillMaxWidth(), height(8)]}>
            <Shape.RoundedCorner
              color="#6200EE"
              cornerRadii={{ topStart: 4, bottomStart: 4 }}
              modifiers={[weight(Math.max(value, 0.01)), height(8)]}
            />
            <Shape.RoundedCorner
              color="#BDBDBD"
              cornerRadii={{ topEnd: 4, bottomEnd: 4 }}
              modifiers={[
                weight(Math.max(1 - value, 0.01)),
                height(8),
              ]}
            />
          </Row>
        </Slider.Track>
      </Slider>
    </Host>
  );
}
```

### Vertical slider

Use `VerticalSlider` to select a single value along a vertical track. Set `reverseDirection` to make values increase from bottom to top instead of top to bottom.

![A vertical slider with the thumb at the midpoint and the filled track below it](/static/images/expo-ui/examples/slider-vertical-android-light.webp)

```tsx VerticalSliderExample.tsx
import { useState } from 'react';
import { Host, VerticalSlider } from '@expo/ui/jetpack-compose';
import { height } from '@expo/ui/jetpack-compose/modifiers';

export default function VerticalSliderExample() {
  const [value, setValue] = useState(0.5);

  return (
    <Host matchContents>
      <VerticalSlider
        value={value}
        reverseDirection
        onValueChange={setValue}
        modifiers={[height(240)]}
      />
    </Host>
  );
}
```

## API

```tsx
import { Slider, VerticalSlider } from '@expo/ui/jetpack-compose';
```
