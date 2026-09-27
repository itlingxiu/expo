---
title: Picker 组件参考
description: A SwiftUI Picker component for selecting options from a list.
---

# Picker 组件参考

> 支持平台：iOS、tvOS、Expo Go。

> **info** For cross-platform usage, see the universal [`Picker`](/versions/latest/sdk/ui/universal/picker) — it renders the appropriate native component per platform.

Expo UI Picker matches the official SwiftUI [Picker API](https://developer.apple.com/documentation/swiftui/picker) and supports all picker styles via the [`pickerStyle`](modifiers#pickerstylestyle) modifier.

![Menu-style Picker showing fruit options with the current selection checked](/static/images/expo-ui/picker/ios-light.webp)

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

## Segmented picker

![A segmented control with Apple selected, next to Banana and Orange](/static/images/expo-ui/examples/picker-segmented-ios-light.webp)

```tsx SegmentedPickerExample.tsx
import { useState } from 'react';
import { Host, Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';

const options = ['Apple', 'Banana', 'Orange'];

export default function SegmentedPickerExample() {
  const [selectedTag, setSelectedTag] = useState(options[0]);

  // 分段和滚轮选择器会拉伸到给定宽度，因此它们
  // 在 `matchContents` 下会被压扁。
  return (
    <Host style={{ flex: 1 }}>
      <Picker
        modifiers={[pickerStyle('segmented')]}
        label="Select a fruit"
        selection={selectedTag}
        onSelectionChange={selection => {
          setSelectedTag(selection);
        }}>
        {options.map(option => (
          <Text key={option} modifiers={[tag(option)]}>
            {option}
          </Text>
        ))}
      </Picker>
    </Host>
  );
}
```

## Menu picker

![An open menu picker listing Apple with a checkmark, Banana, and Orange](/static/images/expo-ui/examples/picker-menu-ios-light.webp)

```tsx MenuPickerExample.tsx
import { useState } from 'react';
import { Host, Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';

const options = ['Apple', 'Banana', 'Orange'];

export default function MenuPickerExample() {
  const [selectedTag, setSelectedTag] = useState(options[0]);

  return (
    <Host style={{ flex: 1 }}>
      <Picker
        modifiers={[pickerStyle('menu')]}
        label="Select a fruit"
        selection={selectedTag}
        onSelectionChange={selection => {
          setSelectedTag(selection);
        }}>
        {options.map(option => (
          <Text key={option} modifiers={[tag(option)]}>
            {option}
          </Text>
        ))}
      </Picker>
    </Host>
  );
}
```

## Wheel picker

> **Warning** The wheel variant is not available on Apple TV.

![A wheel picker with Apple selected in the center band above Banana and Orange](/static/images/expo-ui/examples/picker-wheel-ios-light.webp)

```tsx WheelPickerExample.tsx
import { useState } from 'react';
import { Host, Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';

const options = ['Apple', 'Banana', 'Orange'];

export default function WheelPickerExample() {
  const [selectedTag, setSelectedTag] = useState(options[0]);

  return (
    <Host style={{ flex: 1 }}>
      <Picker
        modifiers={[pickerStyle('wheel')]}
        label="Select a fruit"
        selection={selectedTag}
        onSelectionChange={selection => {
          setSelectedTag(selection);
        }}>
        {options.map(option => (
          <Text key={option} modifiers={[tag(option)]}>
            {option}
          </Text>
        ))}
      </Picker>
    </Host>
  );
}
```

## API

```tsx
import { Picker } from '@expo/ui/swift-ui';
```
