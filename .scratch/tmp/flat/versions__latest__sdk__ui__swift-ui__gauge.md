---
title: Gauge 组件参考
description: A SwiftUI Gauge component for displaying progress with visual indicators.
---

# Gauge 组件参考

> 支持平台：iOS、Expo Go。

Expo UI Gauge matches the official SwiftUI [Gauge API](https://developer.apple.com/documentation/swiftui/gauge) and supports styling via the [`gaugeStyle`](modifiers#gaugestylestyle) modifier.

![Circular capacity Gauge showing 70%](/static/images/expo-ui/gauge/ios-light.webp)

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

### Basic gauge

![A basic gauge rendered on iOS](/static/images/expo-ui/examples/gauge-basic-ios-light.webp)

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

### With label

You can pass custom components as `children` to provide a label for the gauge.

![A gauge with a Progress label rendered on iOS](/static/images/expo-ui/examples/gauge-label-ios-light.webp)

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

### With value labels

Use the `currentValueLabel`, `minimumValueLabel`, and `maximumValueLabel` props to display value information.

![A gauge with current, minimum, and maximum value labels rendered on iOS](/static/images/expo-ui/examples/gauge-value-labels-ios-light.webp)

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

### Gauge styles

Use the `gaugeStyle` modifier to change the gauge's appearance. Available styles are: `automatic`, `circular`, `circularCapacity`, `linear`, and `linearCapacity`.

![Circular, circular capacity, linear, and linear capacity gauge styles rendered on iOS](/static/images/expo-ui/examples/gauge-styles-ios-light.webp)

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

### Tinted gauge

Use the `tint` modifier to change the gauge's color.

![A green circular gauge and a red linear gauge rendered on iOS](/static/images/expo-ui/examples/gauge-tinted-ios-light.webp)

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
