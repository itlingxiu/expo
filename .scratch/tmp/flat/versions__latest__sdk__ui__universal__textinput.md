---
title: TextInput 组件参考
description: A text input backed by native SwiftUI and Jetpack Compose components, with a React Native-compatible API.
---

# TextInput 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A text input that routes to [`TextField`](/versions/latest/sdk/ui/jetpack-compose/textfield) from `@expo/ui/jetpack-compose` on Android, [`TextField`](/versions/latest/sdk/ui/swift-ui/textfield) from `@expo/ui/swift-ui` on iOS, and React Native's [`TextInput`](https://reactnative.dev/docs/textinput) on web.

The API mirrors React Native's [`TextInput`](https://reactnative.dev/docs/textinput), with two changes: [`value`](#value) and [`selection`](#selection) are observable state objects (created with `useNativeState`), and [`onChangeText`](#onchangetext) can be a worklet for synchronously updating the state on the UI thread.

**Android**

![A text field containing hello above a Clear button](/static/images/expo-ui/textinput/android-light.webp)

**iOS**

![A text field containing hello above a Clear button](/static/images/expo-ui/textinput/ios-light.webp)

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

### Uncontrolled

Omit [`value`](#value) and the field manages its own text internally. Use [`onChangeText`](#onchangetext) to observe edits, and use the [ref](#textinputref) for imperative actions like `focus`, `blur`, and `clear`.

**Android**

![A Material 3 text field containing hello above a Clear button](/static/images/expo-ui/examples/universal-textinput-uncontrolled-android-light.webp)

**iOS**

![A text field containing hello above a Clear button](/static/images/expo-ui/examples/universal-textinput-uncontrolled-ios-light.webp)

```tsx UncontrolledTextInputExample.tsx
import { Button, Column, Host, TextInput, type TextInputRef } from '@expo/ui';
import { useRef } from 'react';

export default function UncontrolledTextInputExample() {
  const inputRef = useRef<TextInputRef>(null);

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Column spacing={8}>
        <TextInput
          ref={inputRef}
          defaultValue="hello"
          placeholder="Type here"
          onChangeText={value => console.log(value)}
        />
        <Button label="Clear" onPress={() => inputRef.current?.clear()} />
      </Column>
    </Host>
  );
}
```

### Controlled

Pass [`value`](#value) to drive the field from a `useNativeState` observable. The example below replaces `Hello` with `World` as you type.

**Android**

![A Material 3 text field containing Hello](/static/images/expo-ui/examples/universal-textinput-controlled-android-light.webp)

**iOS**

![A text field containing Hello](/static/images/expo-ui/examples/universal-textinput-controlled-ios-light.webp)

```tsx ControlledTextInputExample.tsx
import { Host, TextInput, useNativeState } from '@expo/ui';
import { useCallback } from 'react';

export default function ControlledTextInputExample() {
  const text = useNativeState('Hello');

  const handleChangeText = useCallback(
    (value: string) => {
      'worklet';
      text.value = value === 'Hello' ? 'World' : value;
    },
    [text]
  );

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <TextInput value={text} placeholder="Type here" onChangeText={handleChangeText} />
    </Host>
  );
}
```

### Worklet masking

Add the `'worklet'` directive to [`onChangeText`](#onchangetext) for synchronously updating the state on the UI thread. Writes to `value` land without the JS-thread round-trip that can cause cursor flicker.

> **Note:** Worklets require installing [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets).

**Android**

![A Material 3 text field containing a formatted phone number](/static/images/expo-ui/examples/universal-textinput-mask-android-light.webp)

**iOS**

![A text field containing a formatted phone number](/static/images/expo-ui/examples/universal-textinput-mask-ios-light.webp)

```tsx PhoneMaskExample.tsx
import { Host, TextInput, useNativeState } from '@expo/ui';
import { useCallback } from 'react';

function formatPhone(input: string) {
  'worklet';
  const digits = input.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function PhoneMaskExample() {
  const phone = useNativeState('(555) 123-4567');
  const selection = useNativeState({ start: 0, end: 0 });

  const handleChangeText = useCallback(
    (value: string) => {
      'worklet';
      const formatted = formatPhone(value);
      if (formatted !== value) {
        phone.value = formatted;
        // 演示时直接跳到末尾。真正的遮罩需要更聪明的光标处理。
        selection.value = { start: formatted.length, end: formatted.length };
      }
    },
    [phone, selection]
  );

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <TextInput
        value={phone}
        selection={selection}
        keyboardType="phone-pad"
        placeholder="(555) 123-4567"
        onChangeText={handleChangeText}
      />
    </Host>
  );
}
```

## Unsupported React Native props

Some React Native `TextInput` props are not supported, because Compose's `TextField` or SwiftUI's `TextField` does not expose an equivalent, or because the prop is replaced by a different mechanism. See the [API](#api) section below for the supported props. If a missing prop blocks your use case, [open an issue](https://github.com/expo/expo/issues/new/choose) so it can be prioritized.

## API

```tsx
import { TextInput, useNativeState } from '@expo/ui';
```
