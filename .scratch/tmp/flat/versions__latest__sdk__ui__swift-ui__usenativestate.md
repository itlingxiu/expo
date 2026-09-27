---
title: useNativeState
description: A React hook that creates observable state shared between JavaScript and native SwiftUI views.
---

# useNativeState

> 支持平台：iOS、tvOS、Expo Go。

`useNativeState` returns an [`ObservableState`](#observablestate) that maps to a SwiftUI [`ObservableObject`](https://developer.apple.com/documentation/combine/observableobject) on the native side, so reads and writes to `.value` are observed directly by SwiftUI without going through the React render cycle. This lets you update the native view synchronously from a worklet on the UI thread.

> **Note:** When working with the [React Compiler](https://react.dev/learn/react-compiler), you should refrain from accessing and modifying the `value` property directly. Instead, use the [`get`](#observablestate) and [`set`](#observablestate) methods, which are compliant with the React Compiler standards.

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

> **Note:** Using worklets requires installing [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets) in your project. `useNativeState` itself works without it, but the synchronous UI-thread updates shown below depend on the worklet runtime.

The example below masks a phone number as the user types. The formatting and the writes to `maskedPhone.value` (text) and `selection.value` (cursor position) all happen synchronously on the UI thread, so there is no flicker between the typed value and the masked value.

```tsx WorkletPhoneMaskExample.tsx
import { Host, TextField, useNativeState } from '@expo/ui/swift-ui';
import { keyboardType } from '@expo/ui/swift-ui/modifiers';
import { useCallback } from 'react';

export default function WorkletPhoneMaskExample() {
  const maskedPhone = useNativeState('');
  const selection = useNativeState({ start: 0, end: 0 });

  const handleTextChange = useCallback(
    (v: string) => {
      'worklet';
      const digits = v.replace(/\D/g, '').slice(0, 10);
      let formatted: string;
      if (digits.length === 0) {
        formatted = '';
      } else if (digits.length <= 3) {
        formatted = digits;
      } else if (digits.length <= 6) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      }
      if (formatted !== v) {
        maskedPhone.value = formatted;
        // 演示时直接跳到末尾。真正的遮罩需要更聪明的光标处理。
        selection.value = {
          start: formatted.length,
          end: formatted.length,
        };
      }
    },
    [maskedPhone, selection]
  );

  return (
    <Host matchContents>
      <TextField
        text={maskedPhone}
        selection={selection}
        placeholder="(555) 123-4567"
        modifiers={[keyboardType('phone-pad')]}
        onTextChange={handleTextChange}
      />
    </Host>
  );
}
```

## API

```tsx
import { useNativeState } from '@expo/ui/swift-ui';
```
