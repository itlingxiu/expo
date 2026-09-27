---
title: Picker 组件参考
description: 与 @react-native-picker/picker 兼容的 Picker 组件。
---

# Picker 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

`Picker` 组件的 API 与 `@react-native-picker/picker` 兼容。它在 iOS 上使用 SwiftUI 滚轮样式的 `Picker`，在 Android 上使用 Material 3 的 `ExposedDropdownMenuBox`，在 Web 上使用原生 `<select>` 元素。

该组件在底层封装了各平台的 `@expo/ui` 原语：

- **Android**：[Jetpack Compose ExposedDropdownMenuBox](/versions/latest/sdk/ui/jetpack-compose/exposeddropdownmenubox)
- **iOS**：使用 `pickerStyle('wheel')` 的 [SwiftUI Picker](/versions/latest/sdk/ui/swift-ui/picker)

如果需要更底层的控制，请直接使用这些原语。

**Android**

![显示 Java 的下拉字段](/static/images/expo-ui/community-picker/android-light.webp)

**iOS**

![选中 Java 的滚轮选择器](/static/images/expo-ui/community-picker/ios-light.webp)

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

## 从 `@react-native-picker/picker` 迁移

- 将导入从 `import { Picker } from '@react-native-picker/picker'` 改为 `import { Picker } from '@expo/ui/community/picker'`。
- 不支持 `mode`、`prompt`、`dropdownIconColor`、`dropdownIconRippleColor`、`numberOfLines`、`selectionColor`、`itemStyle` 和 `accessibilityLabel` 属性。
- 在 `Picker.Item` 上，`style` 属性只应用 `color`、`backgroundColor`、`fontFamily` 和 `fontSize`。顶层的 `color` 和 `fontFamily` 属性仍然支持，作为对应 `style` 值的别名。
- `Picker.Item` 上的 `enabled` 仅在 Android 上生效。
- `ref` 的 `focus()` 和 `blur()` 方法仅在 Android 上有效（打开或关闭下拉菜单）。在 iOS 上，滚轮选择器始终可见。

## 基本用法

**Android**

![下拉字段显示 Java，下方有 Selected 标签](/static/images/expo-ui/examples/community-picker-basic-android-light.webp)

**iOS**

![滚轮选择器选中 Java，下方有 Selected 标签](/static/images/expo-ui/examples/community-picker-basic-ios-light.webp)

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

## 逐项样式与状态

向 `Picker.Item` 传入 `style`，即可按项控制 `color`、`backgroundColor`、`fontFamily` 和 `fontSize`；传入 `enabled={false}` 可在 Android 上禁用特定项。

`fontFamily` 在 iOS 上接受 iOS 字体名称（例如 `'Menlo'`），在 Android 上接受 Compose 通用字体族（`'monospace'`、`'serif'`、`'sansSerif'`、`'cursive'`），或通过 [`expo-font`](/versions/latest/sdk/font) 加载的字体。

**Android**

![展开的下拉菜单，每种语言使用各自的颜色和字体](/static/images/expo-ui/examples/community-picker-styled-android-light.webp)

**iOS**

![滚轮选择器，每种语言使用各自的颜色和字体](/static/images/expo-ui/examples/community-picker-styled-ios-light.webp)

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

## 命令式 focus 与 blur（Android）

使用 ref 可以在 Android 上以编程方式打开和关闭下拉菜单。在 iOS 上，这些方法是空操作，因为滚轮选择器始终可见。

**Android**

![由上方按钮打开的下拉菜单](/static/images/expo-ui/examples/community-picker-ref-android-light.webp)

**iOS**

![按钮位于选中 Java 的滚轮选择器上方](/static/images/expo-ui/examples/community-picker-ref-ios-light.webp)

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
