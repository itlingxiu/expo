---
title: Gauge 组件参考
description: 用于用视觉指示器显示进度的 SwiftUI Gauge 组件。
---

# Gauge 组件参考

> 支持平台：iOS、Expo Go。

Expo UI 的 Gauge 与官方 SwiftUI [Gauge API](https://developer.apple.com/documentation/swiftui/gauge) 保持一致，并可通过 [`gaugeStyle`](/versions/latest/sdk/ui/swift-ui/modifiers#gaugestylestyle) 修改器设置样式。

![显示 70% 的圆形容量 Gauge](/static/images/expo-ui/gauge/ios-light.webp)

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

### 基本仪表

![在 iOS 上渲染的基本仪表](/static/images/expo-ui/examples/gauge-basic-ios-light.webp)

```tsx BasicGaugeExample.tsx
import { Host, Gauge } from '@expo/ui/swift-ui';

export default function BasicGaugeExample() {
  // 线性仪表会拉伸到给定宽度，因此请给宿主指定尺寸。
  return (
    <Host style={{ flex: 1 }}>
      <Gauge value={0.5} />
    </Host>
  );
}
```

### 带标签

可以把自定义组件作为 `children` 传入，为仪表提供标签。

![带 Progress 标签、在 iOS 上渲染的仪表](/static/images/expo-ui/examples/gauge-label-ios-light.webp)

```tsx LabelExample.tsx
import { Host, Gauge, Text } from '@expo/ui/swift-ui';

export default function LabelExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Gauge value={0.7}>
        <Text>Progress</Text>
      </Gauge>
    </Host>
  );
}
```

### 带数值标签

使用 `currentValueLabel`、`minimumValueLabel` 和 `maximumValueLabel` 属性显示数值信息。

![带当前值、最小值和最大值标签、在 iOS 上渲染的仪表](/static/images/expo-ui/examples/gauge-value-labels-ios-light.webp)

```tsx ValueLabelsExample.tsx
import { Host, Gauge, Text } from '@expo/ui/swift-ui';

export default function ValueLabelsExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Gauge
        value={50}
        min={0}
        max={100}
        currentValueLabel={<Text>50%</Text>}
        minimumValueLabel={<Text>0</Text>}
        maximumValueLabel={<Text>100</Text>}>
        <Text>Usage</Text>
      </Gauge>
    </Host>
  );
}
```

### 仪表样式

使用 `gaugeStyle` 修改器改变仪表外观。可用样式为：`automatic`、`circular`、`circularCapacity`、`linear` 和 `linearCapacity`。

![在 iOS 上渲染的圆形、圆形容量、线性和线性容量仪表样式](/static/images/expo-ui/examples/gauge-styles-ios-light.webp)

```tsx GaugeStylesExample.tsx
import { Host, Gauge, Text, VStack } from '@expo/ui/swift-ui';
import { gaugeStyle } from '@expo/ui/swift-ui/modifiers';

export default function GaugeStylesExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={16}>
        <Text>Circular</Text>
        <Gauge value={0.5} modifiers={[gaugeStyle('circular')]}>
          <Text>Circular</Text>
        </Gauge>
        <Text>Circular Capacity</Text>
        <Gauge
          value={0.5}
          modifiers={[gaugeStyle('circularCapacity')]}>
          <Text>Circular Capacity</Text>
        </Gauge>
        <Text>Linear</Text>
        <Gauge value={0.5} modifiers={[gaugeStyle('linear')]}>
          <Text>Linear</Text>
        </Gauge>
        <Gauge
          value={0.5}
          modifiers={[gaugeStyle('linearCapacity')]}>
          <Text>Linear Capacity</Text>
        </Gauge>
      </VStack>
    </Host>
  );
}
```

### 着色仪表

使用 `tint` 修改器改变仪表颜色。

![在 iOS 上渲染的绿色圆形仪表和红色线性仪表](/static/images/expo-ui/examples/gauge-tinted-ios-light.webp)

```tsx TintedGaugeExample.tsx
import { Host, Gauge, VStack } from '@expo/ui/swift-ui';
import { gaugeStyle, tint } from '@expo/ui/swift-ui/modifiers';

export default function TintedGaugeExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={16}>
        <Gauge
          value={0.7}
          modifiers={[gaugeStyle('circular'), tint('green')]}
        />
        <Gauge
          value={0.3}
          modifiers={[gaugeStyle('linear'), tint('red')]}
        />
      </VStack>
    </Host>
  );
}
```

## API

```tsx
import { Gauge } from '@expo/ui/swift-ui';
```
