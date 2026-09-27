---
title: Slider 组件参考
description: A slider compatible with @react-native-community/slider.
---

# Slider 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A `Slider` component with an API compatible with [`@react-native-community/slider`](https://www.npmjs.com/package/@react-native-community/slider). It uses a Material 3 `Slider` on Android, a SwiftUI `Slider` on iOS, and a native `<input type="range">` element on web.

Under the hood this component wraps the platform-specific `@expo/ui` primitives:

- **Android**: [Jetpack Compose Slider](/versions/latest/sdk/ui/jetpack-compose/slider)
- **iOS**: [SwiftUI Slider](/versions/latest/sdk/ui/swift-ui/slider)

If you need lower-level control, use those primitives directly.

**Android**

![A Material 3 slider at the middle of its range](/static/images/expo-ui/community-slider/android-light.webp)

**iOS**

![A slider at the middle of its range](/static/images/expo-ui/community-slider/ios-light.webp)

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

## Migrating from `@react-native-community/slider`

- Update the import from `import Slider from '@react-native-community/slider'` to `import Slider from '@expo/ui/community/slider'`.
- `onSlidingStart`, `onSlidingComplete`, `tapToSeek`, `StepMarker`, `renderStepNumber`, `thumbImage`, `minimumTrackImage`, `maximumTrackImage`, `trackImage`, `accessibilityUnits`, `accessibilityIncrements`, `testID`, and `ref.updateValue` are not yet supported.
- On iOS, `maximumTrackTintColor` and `thumbTintColor` have no visual effect — SwiftUI's `Slider` only exposes the minimum (active) track tint. `minimumTrackTintColor` works on both platforms.

## Basic usage

**Android**

![A Material 3 slider at the middle of its range above a Value label](/static/images/expo-ui/examples/community-slider-basic-android-light.webp)

**iOS**

![A slider at the middle of its range above a Value label](/static/images/expo-ui/examples/community-slider-basic-ios-light.webp)

```tsx SliderExample.tsx
import { useState } from 'react';
import { Text, useColorScheme, View } from 'react-native';
import Slider from '@expo/ui/community/slider';

export default function SliderExample() {
  const [value, setValue] = useState(0.5);
  const colorScheme = useColorScheme();

  return (
    <View>
      <Slider value={value} onValueChange={setValue} />
      <Text style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
        Value: {value.toFixed(3)}
      </Text>
    </View>
  );
}
```

## API

```tsx
import Slider from '@expo/ui/community/slider';
```
