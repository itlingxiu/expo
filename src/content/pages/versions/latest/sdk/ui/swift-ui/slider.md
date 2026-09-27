---
title: Slider 组件参考
description: 用于从范围内选择数值的 SwiftUI Slider 组件。
---

# Slider 组件参考

> 支持平台：iOS、Expo Go。

:::note
跨平台用法请参阅通用 [`Slider`](/versions/latest/sdk/ui/universal/slider)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Slider 与官方 SwiftUI [Slider API](https://developer.apple.com/documentation/swiftui/slider) 保持一致，可从有界范围中选择数值。

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

:::note
`Slider` 是弹性宽度组件，会展开以填满可用的水平空间，没有固有宽度。在 `Host` 上使用 `matchContents` 时，应对 `Slider` 应用 [`frame`](/versions/latest/sdk/ui/swift-ui/modifiers#frameparams) 修改器，给它一个明确的宽度。也可以用 `style` 给 `Host` 明确尺寸（例如 `style={{ width: 300 }}` 或 `style={{ flex: 1 }}`），或把 `Slider` 放进能提供宽度约束的 SwiftUI 容器（如 `Form`）中。
:::

### 基本滑块

![滑块拇指位于轨道中点](/static/images/expo-ui/examples/slider-basic-ios-light.webp)

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

### 自定义范围的滑块

![范围 0 到 100 的滑块，拇指大约在四分之三处](/static/images/expo-ui/examples/slider-custom-range-ios-light.webp)

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

### 带步进的滑块

使用 `step` 属性定义离散增量。把 `step` 设为 `0` 可得到连续值。

![滑块拇指在最左端，位于最小值 0](/static/images/expo-ui/examples/slider-stepped-ios-light.webp)

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

### 带标签的滑块

可以添加标签来说明滑块用途，并标出最小值和最大值的位置。

![滑块左侧是 0 标签，右侧是 100 标签](/static/images/expo-ui/examples/slider-labeled-ios-light.webp)

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
