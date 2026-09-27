---
title: useNativeState
description: 创建在 JavaScript 与原生 Jetpack Compose 视图之间共享的可观察状态的 React Hook。
---

# useNativeState

> 支持平台：Android、Expo Go。

`useNativeState` 返回一个 [`ObservableState`](#observablestate)，它在原生侧映射为 Compose 的 [`MutableState`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/MutableState)，因此对 `.value` 的读写会被 Compose 直接跟踪，而不经过 React 渲染周期。这样就可以在 UI 线程的 worklet 中同步更新原生视图。

:::note
使用 [React Compiler](https://react.dev/learn/react-compiler) 时，不要直接访问和修改 `value` 属性。请改用符合 React Compiler 规范的 [`get`](#observablestate) 和 [`set`](#observablestate) 方法。
:::

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

:::note
使用 worklet 需要在项目中安装 [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets)。`useNativeState` 本身不依赖它，但下面展示的同步 UI 线程更新依赖 worklet 运行时。
:::

下面的示例在用户输入时遮罩电话号码。格式化以及对 `maskedPhone.value`（文本）和 `selection.value`（光标位置）的写入都在 UI 线程上同步发生，因此输入值和遮罩值之间不会闪烁。

```tsx WorkletPhoneMaskExample.tsx
import {
  Host,
  TextField,
  Text as ComposeText,
  useNativeState,
} from '@expo/ui/jetpack-compose';
import { fillMaxWidth } from '@expo/ui/jetpack-compose/modifiers';
import { useCallback } from 'react';

export default function WorkletPhoneMaskExample() {
  const maskedPhone = useNativeState('');
  const selection = useNativeState({ start: 0, end: 0 });

  const handleValueChange = useCallback(
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
        value={maskedPhone}
        selection={selection}
        keyboardOptions={{ keyboardType: 'phone' }}
        modifiers={[fillMaxWidth()]}
        onValueChange={handleValueChange}>
        <TextField.Placeholder>
          <ComposeText>(555) 123-4567</ComposeText>
        </TextField.Placeholder>
      </TextField>
    </Host>
  );
}
```

## API

```tsx
import { useNativeState } from '@expo/ui/jetpack-compose';
```
