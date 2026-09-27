---
title: Picker 组件参考
description: 具有菜单和滚轮外观的单选输入组件。
---

# Picker 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

`Picker` 是单选输入。可以用 `<Picker.Item label value />` 子元素声明选项，父级 `Picker` 会读取它们，并渲染适合平台的下拉菜单或滚轮。

通用 `Picker` 与 [`@expo/ui/community/picker`](/versions/latest/sdk/ui/drop-in-replacements/picker) 相互独立，后者仍是 `@react-native-picker/picker` 的兼容垫片。新代码请优先使用这个通用 `Picker`，除非你明确需要 RN-Picker 的 API 表面。

**Android**

![三行带标签的下拉选择器，分别设为 Apple、Medium 和 Blue](/static/images/expo-ui/picker/android-light.webp)

**iOS**

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

## 用法

### 菜单外观（默认）

**Android**

![Flavour 标签旁边的下拉菜单设为 Vanilla](/static/images/expo-ui/examples/universal-picker-menu-android-light.webp)

**iOS**

![Flavour 标签旁边的菜单选择器设为 Vanilla](/static/images/expo-ui/examples/universal-picker-menu-ios-light.webp)

```tsx PickerMenuExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, Row, Picker, Spacer, Text } from '@expo/ui';

const FLAVOURS = [
  { label: 'Vanilla', value: 'vanilla' },
  { label: 'Chocolate', value: 'chocolate' },
  { label: 'Strawberry', value: 'strawberry' },
];

export default function PickerMenuExample() {
  const [value, setValue] = useState('vanilla');
  const colorScheme = useColorScheme();

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Row alignment="center" spacing={12} style={{ padding: 16 }}>
        <Text textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>Flavour:</Text>
        <Spacer flexible />
        <Picker selectedValue={value} onValueChange={setValue}>
          {FLAVOURS.map(f => (
            <Picker.Item key={f.value} label={f.label} value={f.value} />
          ))}
        </Picker>
      </Row>
    </Host>
  );
}
```

### 滚轮外观

`appearance="wheel"` 在 iOS 上渲染内联可滚动滚轮。在 Android 和 Web 上会回退到平台默认下拉菜单（Material 3 没有滚轮样式的选择器）。

**Android**

![下拉菜单设为 Chocolate，这是滚轮外观在 Android 上的回退](/static/images/expo-ui/examples/universal-picker-wheel-android-light.webp)

**iOS**

![内联滚轮选择器，选中 Chocolate](/static/images/expo-ui/examples/universal-picker-wheel-ios-light.webp)

```tsx PickerWheelExample.tsx
import { useState } from 'react';
import { Host, Column, Picker } from '@expo/ui';

const FLAVOURS = [
  { label: 'Vanilla', value: 'vanilla' },
  { label: 'Chocolate', value: 'chocolate' },
  { label: 'Strawberry', value: 'strawberry' },
];

export default function PickerWheelExample() {
  const [value, setValue] = useState('chocolate');

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Column spacing={8} style={{ padding: 16 }}>
        <Picker selectedValue={value} onValueChange={setValue} appearance="wheel">
          {FLAVOURS.map(f => (
            <Picker.Item key={f.value} label={f.label} value={f.value} />
          ))}
        </Picker>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { Picker } from '@expo/ui';
```
