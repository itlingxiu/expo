---
title: Progress indicators
description: Jetpack Compose progress indicator components for displaying operation status.
---

# Progress indicators

> 支持平台：Android、Expo Go。

Expo UI Progress Indicators match the official Jetpack Compose [Progress Indicator API](https://developer.android.com/develop/ui/compose/components/progress).

![Indeterminate circular progress indicator with two determinate linear progress bars at 30% and 75%](/static/images/expo-ui/progress/android-light.webp)

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

### Linear progress

A horizontal bar that fills to indicate progress. Provide a `progress` value between `0` and `1` for determinate mode.

![A horizontal progress bar filled to half its track](/static/images/expo-ui/examples/progress-linear-android-light.webp)

```tsx LinearExample.tsx
import {
  Host,
  LinearProgressIndicator,
} from '@expo/ui/jetpack-compose';

export default function LinearExample() {
  return (
    <Host matchContents>
      <LinearProgressIndicator progress={0.5} />
    </Host>
  );
}
```

### Circular progress

A spinning circle whose stroke grows to indicate progress.

![A circular progress ring drawn three quarters of the way round](/static/images/expo-ui/examples/progress-circular-android-light.webp)

```tsx CircularExample.tsx
import {
  Host,
  CircularProgressIndicator,
} from '@expo/ui/jetpack-compose';

export default function CircularExample() {
  return (
    <Host matchContents>
      <CircularProgressIndicator progress={0.75} />
    </Host>
  );
}
```

### Indeterminate

Omit the `progress` prop to animate continuously without indicating a specific completion level.

![Linear, circular, wavy circular, and wavy linear indicators animating without a set value](/static/images/expo-ui/examples/progress-indeterminate-android-light.webp)

```tsx IndeterminateExample.tsx
import {
  CircularProgressIndicator,
  CircularWavyProgressIndicator,
  Column,
  Host,
  LinearProgressIndicator,
  LinearWavyProgressIndicator,
} from '@expo/ui/jetpack-compose';

export default function IndeterminateExample() {
  return (
    <Host matchContents>
      <Column verticalArrangement={{ spacedBy: 16 }}>
        <LinearProgressIndicator />
        <CircularProgressIndicator />
        <CircularWavyProgressIndicator />
        <LinearWavyProgressIndicator />
      </Column>
    </Host>
  );
}
```

### Custom colors

Use `color` for the indicator and `trackColor` for the background track.

![A circular progress ring drawn in red over a grey track](/static/images/expo-ui/examples/progress-colors-android-light.webp)

```tsx ColorsExample.tsx
import {
  Host,
  CircularProgressIndicator,
} from '@expo/ui/jetpack-compose';

export default function ColorsExample() {
  return (
    <Host matchContents>
      <CircularProgressIndicator
        progress={0.6}
        color="red"
        trackColor="#cccccc"
      />
    </Host>
  );
}
```

### Wavy variants

`LinearWavyProgressIndicator` and `CircularWavyProgressIndicator` add an expressive wave animation from Material 3 Expressive.

![A wavy linear bar and a wavy circular ring, each at sixty percent](/static/images/expo-ui/examples/progress-wavy-android-light.webp)

```tsx WavyExample.tsx
import {
  Host,
  LinearWavyProgressIndicator,
  CircularWavyProgressIndicator,
  Column,
} from '@expo/ui/jetpack-compose';

export default function WavyExample() {
  return (
    <Host matchContents>
      <Column verticalArrangement={{ spacedBy: 16 }}>
        <LinearWavyProgressIndicator progress={0.6} />
        <CircularWavyProgressIndicator progress={0.6} />
      </Column>
    </Host>
  );
}
```

### Wave configuration

Use `amplitude` to set the wave height, from `0` for a flat line to `1` for the full height. Use `wavelength` to set the length of a single wave in dp, and `waveSpeed` to set how fast the wave travels in dp per second. `waveSpeed` defaults to `wavelength`. Set `waveSpeed={0}` to render a static wave.

![A wavy progress indicator filled to 60 percent with a flat track after it](/static/images/expo-ui/examples/progress-wave-config-android-light.webp)

```tsx WaveConfigExample.tsx
import {
  Host,
  LinearWavyProgressIndicator,
} from '@expo/ui/jetpack-compose';

export default function WaveConfigExample() {
  return (
    <Host matchContents>
      <LinearWavyProgressIndicator
        progress={0.6}
        amplitude={0.4}
        wavelength={24}
        waveSpeed={18}
      />
    </Host>
  );
}
```

## API

```tsx
import {
  LinearProgressIndicator,
  CircularProgressIndicator,
  LinearWavyProgressIndicator,
  CircularWavyProgressIndicator,
} from '@expo/ui/jetpack-compose';
```
