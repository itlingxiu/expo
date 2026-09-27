---
title: ColorPicker 组件参考
description: A SwiftUI ColorPicker component for selecting colors.
---

# ColorPicker 组件参考

> 支持平台：iOS、Expo Go。

Expo UI ColorPicker matches the official SwiftUI [ColorPicker API](https://developer.apple.com/documentation/swiftui/colorpicker) and allows app users to select colors from a palette.

![ColorPicker row inside a Form, showing the current color swatch](/static/images/expo-ui/colorpicker/ios-light.webp)

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

### Basic color picker

![The system color picker sheet open on the Grid tab, with opacity at 100 percent](/static/images/expo-ui/examples/colorpicker-basic-ios-light.webp)

```tsx ColorPickerExample.tsx
import { useState } from 'react';
import { Host, ColorPicker } from '@expo/ui/swift-ui';

export default function ColorPickerExample() {
  const [color, setColor] = useState('#FF6347');

  // 颜色选择器会占满给定宽度，因此 `matchContents` 会把它压扁。
  return (
    <Host style={{ flex: 1 }}>
      <ColorPicker
        label="Select a color"
        selection={color}
        onSelectionChange={setColor}
      />
    </Host>
  );
}
```

### Color picker with opacity support

Use the `supportsOpacity` prop to allow users to select colors with alpha transparency.

![The system color picker sheet open on the Grid tab, with opacity at 50 percent](/static/images/expo-ui/examples/colorpicker-opacity-ios-light.webp)

```tsx ColorPickerOpacityExample.tsx
import { useState } from 'react';
import { Host, ColorPicker } from '@expo/ui/swift-ui';

export default function ColorPickerOpacityExample() {
  const [color, setColor] = useState('#FF634780');

  return (
    <Host style={{ flex: 1 }}>
      <ColorPicker
        label="Select a color with opacity"
        selection={color}
        onSelectionChange={setColor}
        supportsOpacity
      />
    </Host>
  );
}
```

## API

```tsx
import { ColorPicker } from '@expo/ui/swift-ui';
```
