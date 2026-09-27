---
title: Slider 组件参考
description: A SwiftUI Slider component for selecting values from a range.
---

# Slider 组件参考

> 支持平台：iOS、Expo Go。

> **info** For cross-platform usage, see the universal [`Slider`](/versions/latest/sdk/ui/universal/slider) — it renders the appropriate native component per platform.

Expo UI Slider matches the official SwiftUI [Slider API](https://developer.apple.com/documentation/swiftui/slider) and allows selecting values from a bounded range.

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

> **Note:** `Slider` is a flexible-width component, it expands to fill available horizontal space and does not have an intrinsic width. When using `matchContents` on the `Host`, you should apply a [`frame`](modifiers#frameparams) modifier on the `Slider` to give it an explicit width. Alternatively, give the `Host` an explicit size using `style` (for example, `style={{ width: 300 }}` or `style={{ flex: 1 }}`), or place the `Slider` inside a SwiftUI container like `Form` that provides width constraints.

### Basic slider

![A slider with its thumb at the midpoint of the track](/static/images/expo-ui/examples/slider-basic-ios-light.webp)

```tsx BasicSliderExample.tsx
import { useState } from 'react';
import { Host, Slider } from '@expo/ui/swift-ui';

export default function BasicSliderExample() {
  const [value, setValue] = useState(0.5);

  return (
    <Host style={{ flex: 1 }}>
      <Slider value={value} onValueChange={setValue} />
    </Host>
  );
}
```

### Slider with custom range

![A slider over a range of 0 to 100 with its thumb three quarters of the way along](/static/images/expo-ui/examples/slider-custom-range-ios-light.webp)

```tsx CustomRangeSliderExample.tsx
import { useState } from 'react';
import { Host, Slider } from '@expo/ui/swift-ui';

export default function CustomRangeSliderExample() {
  const [value, setValue] = useState(75);

  return (
    <Host style={{ flex: 1 }}>
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

### Slider with step

Use the `step` prop to define discrete increments. Set `step` to `0` for continuous values.

![A slider with its thumb at the far left, at the minimum value of zero](/static/images/expo-ui/examples/slider-stepped-ios-light.webp)

```tsx SteppedSliderExample.tsx
import { useState } from 'react';
import { Host, Slider } from '@expo/ui/swift-ui';

export default function SteppedSliderExample() {
  const [value, setValue] = useState(0);

  return (
    <Host style={{ flex: 1 }}>
      <Slider
        value={value}
        min={0}
        max={100}
        step={10}
        onValueChange={setValue}
      />
    </Host>
  );
}
```

### Slider with labels

You can add labels to describe a slider's purpose and to mark the minimum and maximum value positions.

![A slider flanked by a 0 label on the left and a 100 label on the right](/static/images/expo-ui/examples/slider-labeled-ios-light.webp)

```tsx LabeledSliderExample.tsx
import { useState } from 'react';
import { Host, Slider, Text } from '@expo/ui/swift-ui';

export default function LabeledSliderExample() {
  const [value, setValue] = useState(50);

  return (
    <Host style={{ flex: 1 }}>
      <Slider
        value={value}
        min={0}
        max={100}
        label={<Text>Volume</Text>}
        minimumValueLabel={<Text>0</Text>}
        maximumValueLabel={<Text>100</Text>}
        onValueChange={setValue}
      />
    </Host>
  );
}
```

## API

```tsx
import { Slider } from '@expo/ui/swift-ui';
```
