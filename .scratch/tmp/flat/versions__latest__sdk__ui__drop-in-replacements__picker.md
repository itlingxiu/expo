---
title: Picker 组件参考
description: A picker compatible with @react-native-picker/picker.
---

# Picker 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A `Picker` component with an API compatible with `@react-native-picker/picker`. It uses a SwiftUI wheel `Picker` on iOS, a Material 3 `ExposedDropdownMenuBox` on Android, and a native `<select>` element on web.

Under the hood this component wraps the platform-specific `@expo/ui` primitives:

- **Android**: [Jetpack Compose ExposedDropdownMenuBox](/versions/latest/sdk/ui/jetpack-compose/exposeddropdownmenubox)
- **iOS**: [SwiftUI Picker](/versions/latest/sdk/ui/swift-ui/picker) with `pickerStyle('wheel')`

If you need lower-level control, use those primitives directly.

**Android**

![A dropdown field showing Java](/static/images/expo-ui/community-picker/android-light.webp)

**iOS**

![A wheel picker with Java selected](/static/images/expo-ui/community-picker/ios-light.webp)

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

## Migrating from `@react-native-picker/picker`

- Update the import from `import { Picker } from '@react-native-picker/picker'` to `import { Picker } from '@expo/ui/community/picker'`.
- `mode`, `prompt`, `dropdownIconColor`, `dropdownIconRippleColor`, `numberOfLines`, `selectionColor`, `itemStyle`, and `accessibilityLabel` props are not supported.
- On `Picker.Item`, the `style` prop only applies `color`, `backgroundColor`, `fontFamily`, and `fontSize`. The top-level `color` and `fontFamily` props are still supported as aliases for the corresponding `style` values.
- `enabled` on `Picker.Item` only applies on Android.
- The `ref` `focus()` and `blur()` methods only have an effect on Android (open/close the dropdown). On iOS, the wheel picker is always visible.

## Basic usage

**Android**

![A dropdown field showing Java above a Selected label](/static/images/expo-ui/examples/community-picker-basic-android-light.webp)

**iOS**

![A wheel picker with Java selected above a Selected label](/static/images/expo-ui/examples/community-picker-basic-ios-light.webp)

```tsx PickerExample.tsx
import { useState } from 'react';
import { Text, useColorScheme, View } from 'react-native';
import { Picker } from '@expo/ui/community/picker';

export default function PickerExample() {
  const [language, setLanguage] = useState('java');
  const colorScheme = useColorScheme();

  return (
    <View>
      <Picker selectedValue={language} onValueChange={value => setLanguage(value)}>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
        <Picker.Item label="Objective C" value="objc" />
        <Picker.Item label="Swift" value="swift" />
      </Picker>
      <Text style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
        Selected: {language}
      </Text>
    </View>
  );
}
```

## Per-item styling and state

Pass a `style` to `Picker.Item` to control `color`, `backgroundColor`, `fontFamily`, and `fontSize` per item, and `enabled={false}` to disable specific items on Android.

`fontFamily` accepts iOS font names (for example, `'Menlo'`) on iOS, and Compose generic families (`'monospace'`, `'serif'`, `'sansSerif'`, `'cursive'`) or fonts loaded with [`expo-font`](/versions/latest/sdk/font) on Android.

**Android**

![An open dropdown with each language in its own color and font](/static/images/expo-ui/examples/community-picker-styled-android-light.webp)

**iOS**

![A wheel picker with each language in its own color and font](/static/images/expo-ui/examples/community-picker-styled-ios-light.webp)

```tsx StyledPickerExample.tsx
import { useState } from 'react';
import { Platform } from 'react-native';
import { Picker } from '@expo/ui/community/picker';

const monospace = Platform.select({ ios: 'Menlo', android: 'monospace' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

export default function StyledPickerExample() {
  const [language, setLanguage] = useState('java');

  return (
    <Picker selectedValue={language} onValueChange={value => setLanguage(value)}>
      <Picker.Item
        label="Java"
        value="java"
        style={{ color: '#e11d48', fontFamily: monospace, fontSize: 14 }}
      />
      <Picker.Item
        label="JavaScript"
        value="js"
        style={{ color: '#2563eb', fontFamily: serif, fontSize: 18 }}
        enabled={false}
      />
      <Picker.Item
        label="Objective C"
        value="objc"
        style={{ color: '#059669', fontFamily: monospace, fontSize: 16 }}
      />
      <Picker.Item
        label="Swift"
        value="swift"
        style={{ color: '#d97706', fontFamily: serif, fontSize: 30 }}
        enabled={false}
      />
    </Picker>
  );
}
```

## Imperative focus and blur (Android)

Use a ref to programmatically open and close the dropdown on Android. On iOS, these methods are no-ops because the wheel picker is always visible.

**Android**

![A dropdown opened by the button above it](/static/images/expo-ui/examples/community-picker-ref-android-light.webp)

**iOS**

![A button above a wheel picker with Java selected](/static/images/expo-ui/examples/community-picker-ref-ios-light.webp)

```tsx RefPickerExample.tsx
import { useRef, useState } from 'react';
import { Button } from 'react-native';
import { Picker, type PickerRef } from '@expo/ui/community/picker';

export default function RefPickerExample() {
  const [language, setLanguage] = useState('java');
  const pickerRef = useRef<PickerRef>(null);

  return (
    <>
      <Button
        title="Open and close after 2s"
        onPress={() => {
          pickerRef.current?.focus();
          setTimeout(() => pickerRef.current?.blur(), 2000);
        }}
      />
      <Picker ref={pickerRef} selectedValue={language} onValueChange={setLanguage}>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
        <Picker.Item label="Objective C" value="objc" />
        <Picker.Item label="Swift" value="swift" />
      </Picker>
    </>
  );
}
```

## API

```tsx
import { Picker } from '@expo/ui/community/picker';
```
