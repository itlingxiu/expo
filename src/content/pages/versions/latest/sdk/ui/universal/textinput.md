---
title: TextInput 组件参考
description: 由原生 SwiftUI 与 Jetpack Compose 组件支持、并兼容 React Native API 的文本输入。
---

# TextInput 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

文本输入组件：在 Android 上路由到 `@expo/ui/jetpack-compose` 的 [`TextField`](/versions/latest/sdk/ui/jetpack-compose/textfield)，在 iOS 上路由到 `@expo/ui/swift-ui` 的 [`TextField`](/versions/latest/sdk/ui/swift-ui/textfield)，在 Web 上路由到 React Native 的 [`TextInput`](https://reactnative.dev/docs/textinput)。

API 与 React Native 的 [`TextInput`](https://reactnative.dev/docs/textinput) 一致，有两处不同：[`value`](#value) 和 [`selection`](#selection) 是可观察状态对象（用 `useNativeState` 创建），[`onChangeText`](#onchangetext) 可以是 worklet，以便在 UI 线程上同步更新状态。

**Android**

![包含 hello 的文本框，下方有 Clear 按钮](/static/images/expo-ui/textinput/android-light.webp)

**iOS**

![包含 hello 的文本框，下方有 Clear 按钮](/static/images/expo-ui/textinput/ios-light.webp)

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

### 非受控

省略 [`value`](#value)，字段会在内部管理自己的文本。用 [`onChangeText`](#onchangetext) 观察编辑，用 [ref](#textinputref) 执行 `focus`、`blur` 和 `clear` 等命令式操作。

**Android**

![包含 hello 的 Material 3 文本框，下方有 Clear 按钮](/static/images/expo-ui/examples/universal-textinput-uncontrolled-android-light.webp)

**iOS**

![包含 hello 的文本框，下方有 Clear 按钮](/static/images/expo-ui/examples/universal-textinput-uncontrolled-ios-light.webp)

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

### 受控

传入 [`value`](#value)，用 `useNativeState` 可观察对象驱动字段。下面的示例会在你输入时把 `Hello` 替换为 `World`。

**Android**

![包含 Hello 的 Material 3 文本框](/static/images/expo-ui/examples/universal-textinput-controlled-android-light.webp)

**iOS**

![包含 Hello 的文本框](/static/images/expo-ui/examples/universal-textinput-controlled-ios-light.webp)

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

### Worklet 遮罩

在 [`onChangeText`](#onchangetext) 中加入 `'worklet'` 指令，即可在 UI 线程上同步更新状态。写入 `value` 不会经过 JS 线程往返，从而避免光标闪烁。

:::note
Worklet 需要安装 [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets)。
:::

**Android**

![包含格式化电话号码的 Material 3 文本框](/static/images/expo-ui/examples/universal-textinput-mask-android-light.webp)

**iOS**

![包含格式化电话号码的文本框](/static/images/expo-ui/examples/universal-textinput-mask-ios-light.webp)

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

## 不支持的 React Native 属性

部分 React Native `TextInput` 属性不受支持，因为 Compose 的 `TextField` 或 SwiftUI 的 `TextField` 没有等价能力，或者该属性已被另一种机制替代。支持的属性见下方 [API](#api)。如果缺少的属性阻碍了你的用例，请[提交 issue](https://github.com/expo/expo/issues/new/choose)，以便优先处理。

## API

```tsx
import { TextInput, useNativeState } from '@expo/ui';
```
