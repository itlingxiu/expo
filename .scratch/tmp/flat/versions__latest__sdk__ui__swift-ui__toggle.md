---
title: Toggle 组件参考
description: A SwiftUI Toggle component for displaying native toggles.
---

# Toggle 组件参考

> 支持平台：iOS、tvOS、Expo Go。

> **info** For cross-platform usage, see the universal [`Switch`](/versions/latest/sdk/ui/universal/switch) — it renders the appropriate native component per platform.

Expo UI Toggle matches the official SwiftUI [Toggle API](https://developer.apple.com/documentation/swiftui/toggle) and supports styling via the [`toggleStyle`](modifiers#togglestylestyle) modifier.

![Toggle rows inside a Form](/static/images/expo-ui/toggle/ios-light.webp)

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

### Basic toggle

![A row labeled Enable feature with a switch turned off at the trailing edge](/static/images/expo-ui/examples/toggle-basic-ios-light.webp)

```tsx BasicToggleExample.tsx
import { useState } from 'react';
import { Host, Toggle } from '@expo/ui/swift-ui';

export default function BasicToggleExample() {
  const [isOn, setIsOn] = useState(false);

  // 开关行会拉伸到给定宽度，因此请给宿主指定尺寸。
  return (
    <Host style={{ flex: 1 }}>
      <Toggle
        isOn={isOn}
        onIsOnChange={setIsOn}
        label="Enable feature"
      />
    </Host>
  );
}
```

### Toggle with system image

![A row with an airplane icon labeled Airplane Mode and a switch turned off](/static/images/expo-ui/examples/toggle-system-image-ios-light.webp)

```tsx ToggleWithImageExample.tsx
import { useState } from 'react';
import { Host, Toggle } from '@expo/ui/swift-ui';

export default function ToggleWithImageExample() {
  const [airplaneMode, setAirplaneMode] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Toggle
        isOn={airplaneMode}
        onIsOnChange={setAirplaneMode}
        label="Airplane Mode"
        systemImage="airplane"
      />
    </Host>
  );
}
```

### Toggle styles

Use the `toggleStyle` modifier to change the toggle's appearance. Available styles are: `automatic`, `switch`, and `button`.

> **Note:** The `button` style is not available on tvOS.

![A Switch Style row with its switch turned on, above a Button Style toggle in its selected filled state](/static/images/expo-ui/examples/toggle-styles-ios-light.webp)

```tsx ToggleStylesExample.tsx
import { useState } from 'react';
import { Host, Toggle, VStack } from '@expo/ui/swift-ui';
import { toggleStyle } from '@expo/ui/swift-ui/modifiers';

export default function ToggleStylesExample() {
  const [isOn, setIsOn] = useState(true);

  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={8}>
        <Toggle
          isOn={isOn}
          onIsOnChange={setIsOn}
          label="Switch Style"
          modifiers={[toggleStyle('switch')]}
        />
        <Toggle
          isOn={isOn}
          onIsOnChange={setIsOn}
          label="Button Style"
          modifiers={[toggleStyle('button')]}
        />
      </VStack>
    </Host>
  );
}
```

### Tinted toggle

Use the `tint` modifier to change the toggle's color.

![A row labeled Custom Color with a switch turned on and tinted orange](/static/images/expo-ui/examples/toggle-tinted-ios-light.webp)

```tsx TintedToggleExample.tsx
import { useState } from 'react';
import { Host, Toggle } from '@expo/ui/swift-ui';
import { tint } from '@expo/ui/swift-ui/modifiers';

export default function TintedToggleExample() {
  const [isOn, setIsOn] = useState(true);

  return (
    <Host matchContents>
      <Toggle
        isOn={isOn}
        onIsOnChange={setIsOn}
        label="Custom Color"
        modifiers={[tint('#FF9500')]}
      />
    </Host>
  );
}
```

### Custom label content

You can pass custom components as `children` for more complex toggle labels. Use multiple `Text` views where the first represents the title and the second represents the subtitle.

![A toggle row with the title Vibrate on ring above a grey subtitle line](/static/images/expo-ui/examples/toggle-custom-label-ios-light.webp)

```tsx CustomLabelExample.tsx
import { useState } from 'react';
import { Host, Toggle, Text } from '@expo/ui/swift-ui';

export default function CustomLabelExample() {
  const [vibrateOnRing, setVibrateOnRing] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Toggle isOn={vibrateOnRing} onIsOnChange={setVibrateOnRing}>
        <Text>Vibrate on ring</Text>
        <Text>Enable vibration when the phone rings</Text>
      </Toggle>
    </Host>
  );
}
```

### Hidden label

Use the [`labelsHidden`](modifiers#labelshidden) modifier to hide the label while keeping it for accessibility.

![A switch on its own, with no visible label text](/static/images/expo-ui/examples/toggle-hidden-label-ios-light.webp)

```tsx HiddenLabelExample.tsx
import { useState } from 'react';
import { Host, Toggle } from '@expo/ui/swift-ui';
import { labelsHidden } from '@expo/ui/swift-ui/modifiers';

export default function HiddenLabelExample() {
  const [isOn, setIsOn] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Toggle
        isOn={isOn}
        onIsOnChange={setIsOn}
        label="Hidden Label"
        modifiers={[labelsHidden()]}
      />
    </Host>
  );
}
```

## API

```tsx
import { Toggle } from '@expo/ui/swift-ui';
```
