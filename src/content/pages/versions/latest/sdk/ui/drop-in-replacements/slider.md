---
title: Slider 组件参考
description: 与 @react-native-community/slider 兼容的 Slider 组件。
---

# Slider 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

`Slider` 组件的 API 与 [`@react-native-community/slider`](https://www.npmjs.com/package/@react-native-community/slider) 兼容。它在 Android 上使用 Material 3 的 `Slider`，在 iOS 上使用 SwiftUI 的 `Slider`，在 Web 上使用原生 `<input type="range">` 元素。

该组件在底层封装了各平台的 `@expo/ui` 原语：

- **Android**：[Jetpack Compose Slider](/versions/latest/sdk/ui/jetpack-compose/slider)
- **iOS**：[SwiftUI Slider](/versions/latest/sdk/ui/swift-ui/slider)

如果需要更底层的控制，请直接使用这些原语。

**Android**

![位于范围中点的 Material 3 滑块](/static/images/expo-ui/community-slider/android-light.webp)

**iOS**

![位于范围中点的滑块](/static/images/expo-ui/community-slider/ios-light.webp)

## 安装

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

## 从 `@react-native-community/slider` 迁移

- 将导入从 `import Slider from '@react-native-community/slider'` 改为 `import Slider from '@expo/ui/community/slider'`。
- `onSlidingStart`、`onSlidingComplete`、`tapToSeek`、`StepMarker`、`renderStepNumber`、`thumbImage`、`minimumTrackImage`、`maximumTrackImage`、`trackImage`、`accessibilityUnits`、`accessibilityIncrements`、`testID` 和 `ref.updateValue` 尚不支持。
- 在 iOS 上，`maximumTrackTintColor` 和 `thumbTintColor` 没有视觉效果——SwiftUI 的 `Slider` 只暴露最小值（活动）轨道的着色。`minimumTrackTintColor` 在两个平台上都有效。

## 基本用法

**Android**

![位于范围中点的 Material 3 滑块，下方有 Value 标签](/static/images/expo-ui/examples/community-slider-basic-android-light.webp)

**iOS**

![位于范围中点的滑块，下方有 Value 标签](/static/images/expo-ui/examples/community-slider-basic-ios-light.webp)

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
