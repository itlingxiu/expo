---
title: Slider 组件参考
description: 用于从范围内选择数值的 Jetpack Compose Slider 组件。
---

# Slider 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台用法请参阅通用 [`Slider`](/versions/latest/sdk/ui/universal/slider)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Slider 与官方 Jetpack Compose [Slider API](https://developer.android.com/develop/ui/compose/components/slider) 保持一致，允许从有界范围中选择数值。

![两个处于不同位置的 Material 3 滑块](/static/images/expo-ui/slider/android-light.webp)

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

### 基本滑块

![滑块位于中点的 Material 3 滑块](/static/images/expo-ui/examples/slider-basic-android-light.webp)

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

### 自定义范围的滑块

使用 `min` 和 `max` 属性定义滑块的取值范围。

![范围从 0 到 100、滑块位于 50 的滑块](/static/images/expo-ui/examples/slider-custom-range-android-light.webp)

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

### 带步进的滑块

使用 `steps` 属性定义离散增量。将 `steps` 设为 `0` 即可使用连续值。

![带十一处刻度、滑块位于最左端的滑块](/static/images/expo-ui/examples/slider-stepped-android-light.webp)

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

### 自定义颜色

使用 `colors` 属性覆盖滑块滑块、轨道和刻度的默认 Material 3 颜色。

![紫色滑块、紫色活动轨道和灰色非活动轨道的滑块](/static/images/expo-ui/examples/slider-custom-colors-android-light.webp)

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

### 自定义滑块与轨道

同时使用 `Slider.Thumb` 和 `Slider.Track` 插槽，完全自定义滑块外观。

![紫色圆形滑块位于紫灰分段轨道上](/static/images/expo-ui/examples/slider-custom-thumb-track-android-light.webp)

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

### 垂直滑块

使用 `VerticalSlider` 沿垂直轨道选择单个值。设置 `reverseDirection` 可使数值从下到上增加，而不是从上到下。

![垂直滑块，滑块位于中点，填充轨道在其下方](/static/images/expo-ui/examples/slider-vertical-android-light.webp)

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
