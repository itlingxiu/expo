---
title: Slider 组件参考
description: 用于从连续或步进范围中选择数值的控件。
---

# Slider 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

受控滑块，用于在范围内选择数值。将 [`value`](#value) 与 [`onValueChange`](#onvaluechange) 配对，即可从 React 管理状态。

**Android**

![两个处于不同位置的 Material 3 滑块](/static/images/expo-ui/slider/android-light.webp)

**iOS**

![Form 分区中两侧带亮度图标的滑块](/static/images/expo-ui/slider/ios-light.webp)

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

## 用法

### 连续滑块

默认范围是 `[0, 1]`。

**Android**

![手柄位于中点的 Material 3 滑块](/static/images/expo-ui/examples/universal-slider-continuous-android-light.webp)

**iOS**

![滑块拇指位于中点](/static/images/expo-ui/examples/universal-slider-continuous-ios-light.webp)

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

### 自定义范围的步进滑块

使用 `min`、`max` 和 `step` 约束滑块产生的值。

**Android**

![Volume 标签位于带刻度的步进 Material 3 滑块上方](/static/images/expo-ui/examples/universal-slider-stepped-android-light.webp)

**iOS**

![Volume 标签位于设置在范围中点的滑块上方](/static/images/expo-ui/examples/universal-slider-stepped-ios-light.webp)

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
