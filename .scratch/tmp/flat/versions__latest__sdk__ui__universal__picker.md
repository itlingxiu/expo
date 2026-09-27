---
title: Picker 组件参考
description: A single-selection input with menu and wheel appearances.
---

# Picker 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

`Picker` is a single-selection input. You can use `<Picker.Item label value />` children to declare options so that the parent `Picker` reads them and renders a platform-appropriate dropdown or rotor.

The universal `Picker` is independent of [`@expo/ui/community/picker`](/versions/latest/sdk/ui/drop-in-replacements/picker), which remains a compat shim for `@react-native-picker/picker`. Prefer this universal `Picker` for new code unless you specifically need the RN-Picker API surface.

**Android**

![Three labeled rows with dropdown pickers set to Apple, Medium, and Blue](/static/images/expo-ui/picker/android-light.webp)

**iOS**

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

## Usage

### Menu appearance (default)

**Android**

![A Flavour label beside a dropdown set to Vanilla](/static/images/expo-ui/examples/universal-picker-menu-android-light.webp)

**iOS**

![A Flavour label beside a menu picker set to Vanilla](/static/images/expo-ui/examples/universal-picker-menu-ios-light.webp)

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

### Wheel appearance

`appearance="wheel"` renders an inline scrollable rotor on iOS. On Android and web, this falls back to the platform's default dropdown (Material 3 doesn't ship a wheel-style picker).

**Android**

![A dropdown set to Chocolate, the Android fallback for the wheel appearance](/static/images/expo-ui/examples/universal-picker-wheel-android-light.webp)

**iOS**

![An inline wheel picker with Chocolate selected](/static/images/expo-ui/examples/universal-picker-wheel-ios-light.webp)

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
