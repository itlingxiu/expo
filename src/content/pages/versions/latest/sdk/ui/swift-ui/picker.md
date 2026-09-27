---
title: Picker 组件参考
description: 用于从列表中选择选项的 SwiftUI Picker 组件。
---

# Picker 组件参考

> 支持平台：iOS、tvOS、Expo Go。

:::note
跨平台用法请参阅通用 [`Picker`](/versions/latest/sdk/ui/universal/picker)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Picker 与官方 SwiftUI [Picker API](https://developer.apple.com/documentation/swiftui/picker) 保持一致，并通过 [`pickerStyle`](/versions/latest/sdk/ui/swift-ui/modifiers#pickerstylestyle) 修改器支持所有选择器样式。

![菜单样式的 Picker，显示水果选项，当前选中项带勾](/static/images/expo-ui/picker/ios-light.webp)

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

## 分段选择器

![分段控件中选中 Apple，旁边是 Banana 和 Orange](/static/images/expo-ui/examples/picker-segmented-ios-light.webp)

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

## 菜单选择器

![打开的菜单选择器，列出带勾的 Apple、Banana 和 Orange](/static/images/expo-ui/examples/picker-menu-ios-light.webp)

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

## 滚轮选择器

:::warning
滚轮变体在 Apple TV 上不可用。
:::

![滚轮选择器，中间带选中 Apple，下方是 Banana 和 Orange](/static/images/expo-ui/examples/picker-wheel-ios-light.webp)

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
