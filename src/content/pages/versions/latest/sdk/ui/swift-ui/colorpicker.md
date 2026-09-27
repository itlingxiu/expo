---
title: ColorPicker 组件参考
description: 用于选择颜色的 SwiftUI ColorPicker 组件。
---

# ColorPicker 组件参考

> 支持平台：iOS、Expo Go。

Expo UI 的 ColorPicker 与官方 SwiftUI [ColorPicker API](https://developer.apple.com/documentation/swiftui/colorpicker) 保持一致，允许应用用户从调色板中选择颜色。

![Form 中的 ColorPicker 行，显示当前颜色色块](/static/images/expo-ui/colorpicker/ios-light.webp)

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

### 基本颜色选择器

![系统颜色选择器面板打开在 Grid 标签，不透明度为 100%](/static/images/expo-ui/examples/colorpicker-basic-ios-light.webp)

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

### 支持不透明度的颜色选择器

使用 `supportsOpacity` 属性，允许用户选择带 alpha 透明度的颜色。

![系统颜色选择器面板打开在 Grid 标签，不透明度为 50%](/static/images/expo-ui/examples/colorpicker-opacity-ios-light.webp)

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
