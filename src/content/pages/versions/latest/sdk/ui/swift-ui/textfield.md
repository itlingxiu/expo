---
title: TextField 组件参考
description: 用于文本输入的 SwiftUI TextField 组件。
---

# TextField 组件参考

> 支持平台：iOS、tvOS、Expo Go。

:::note
跨平台用法请参阅通用 [`TextInput`](/versions/latest/sdk/ui/universal/textinput)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 TextField 与官方 SwiftUI [TextField API](https://developer.apple.com/documentation/swiftui/textfield) 保持一致，支持单行和多行输入、键盘配置、提交处理，以及用于编程控制的命令式 `ref`。

![Form 中的 TextField 和 SecureField](/static/images/expo-ui/textfield/ios-light.webp)

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

### 非受控文本框

把 [`useNativeState`](/versions/latest/sdk/ui/swift-ui/usenativestate) 可观察对象绑定到 `text`。字段会自行跟踪用户输入，你从 `textState.value` 读取当前值。

![空文本框，占位符为 Username](/static/images/expo-ui/examples/textfield-basic-ios-light.webp)

```tsx BasicTextFieldExample.tsx
import { Host, TextField, useNativeState } from '@expo/ui/swift-ui';

export default function BasicTextFieldExample() {
  const textState = useNativeState('');

  // 文本框会拉伸到给定宽度，因此请给宿主指定尺寸。
  return (
    <Host style={{ flex: 1 }}>
      <TextField placeholder="Username" text={textState} />
    </Host>
  );
}
```

### 受控文本框

传入 `onTextChange` worklet，转换或校验输入，并把结果写回 [`useNativeState`](/versions/latest/sdk/ui/swift-ui/usenativestate) 可观察状态。下面的示例会在输入时把文本转为大写。

:::note
Worklet 需要安装 [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets)。
:::

![空文本框，占位符为 Name](/static/images/expo-ui/examples/textfield-controlled-ios-light.webp)

```tsx ControlledTextFieldExample.tsx
import { Host, TextField, useNativeState } from '@expo/ui/swift-ui';
import { useCallback } from 'react';

export default function ControlledTextFieldExample() {
  const text = useNativeState('');

  const handleTextChange = useCallback(
    (value: string) => {
      'worklet';
      text.value = value.toUpperCase();
    },
    [text]
  );

  return (
    <Host style={{ flex: 1 }}>
      <TextField
        placeholder="Name"
        text={text}
        onTextChange={handleTextChange}
      />
    </Host>
  );
}
```

### 多行文本框

设置 `axis="vertical"` 让文本框垂直扩展。使用 [`lineLimit`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符控制可见行数。给 `Host` 一个明确尺寸，字段才有宽度可以扩展。

![空的多行文本框，占位符为 Tell us about yourself](/static/images/expo-ui/examples/textfield-multiline-ios-light.webp)

```tsx MultilineTextFieldExample.tsx
import { Host, TextField, useNativeState } from '@expo/ui/swift-ui';
import { lineLimit, fixedSize } from '@expo/ui/swift-ui/modifiers';

export default function MultilineTextFieldExample() {
  const textState = useNativeState('');

  return (
    <Host style={{ flex: 1 }}>
      <TextField
        axis="vertical"
        text={textState}
        placeholder="Tell us about yourself..."
        modifiers={[
          lineLimit(5),
          fixedSize({ horizontal: false, vertical: true }),
        ]}
      />
    </Host>
  );
}
```

### 键盘类型

使用 [`keyboardType`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符显示特定键盘布局。

![空文本框，占位符为 Email](/static/images/expo-ui/examples/textfield-keyboard-type-ios-light.webp)

```tsx KeyboardTypeExample.tsx
import { Host, TextField, useNativeState } from '@expo/ui/swift-ui';
import {
  keyboardType,
  autocorrectionDisabled,
} from '@expo/ui/swift-ui/modifiers';

export default function KeyboardTypeExample() {
  const textState = useNativeState('');

  return (
    <Host style={{ flex: 1 }}>
      <TextField
        placeholder="Email"
        text={textState}
        modifiers={[
          keyboardType('email-address'),
          autocorrectionDisabled(),
        ]}
      />
    </Host>
  );
}
```

### 提交处理

使用 [`submitLabel`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符自定义回车键，并用 [`onSubmit`](/versions/latest/sdk/ui/swift-ui/modifiers) 处理提交动作。

![空文本框，占位符为 Search](/static/images/expo-ui/examples/textfield-submit-ios-light.webp)

```tsx SubmitHandlingExample.tsx
import { Host, TextField, useNativeState } from '@expo/ui/swift-ui';
import { submitLabel, onSubmit } from '@expo/ui/swift-ui/modifiers';

export default function SubmitHandlingExample() {
  const textState = useNativeState('');

  return (
    <Host style={{ flex: 1 }}>
      <TextField
        placeholder="Search..."
        text={textState}
        modifiers={[
          submitLabel('search'),
          onSubmit(() =>
            console.log('Submitted:', textState.value)
          ),
        ]}
      />
    </Host>
  );
}
```

### 命令式 ref

使用 `ref` 以命令方式设置文本、聚焦、失焦或选中文本。

:::note
`setSelection` 需要 iOS 18.0+ / tvOS 18.0+。其他 ref 方法在所有受支持版本上可用。
:::

![文本框显示 Select me!，下方一排 Focus、Blur、Set text、Clear 和 Select 按钮](/static/images/expo-ui/examples/textfield-imperative-ios-light.webp)

```tsx ImperativeRefExample.tsx
import { useRef } from 'react';
import {
  Host,
  TextField,
  TextFieldRef,
  Button,
  HStack,
  VStack,
  useNativeState,
} from '@expo/ui/swift-ui';
import { buttonStyle } from '@expo/ui/swift-ui/modifiers';

export default function ImperativeRefExample() {
  const ref = useRef<TextFieldRef>(null);
  const textState = useNativeState('Select me!');

  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={12}>
        <TextField
          ref={ref}
          text={textState}
          placeholder="Imperative field"
        />
        <HStack spacing={12}>
          <Button
            modifiers={[buttonStyle('bordered')]}
            onPress={() => ref.current?.focus()}
            label="Focus"
          />
          <Button
            modifiers={[buttonStyle('bordered')]}
            onPress={() => ref.current?.blur()}
            label="Blur"
          />
        </HStack>
        <HStack spacing={12}>
          <Button
            modifiers={[buttonStyle('bordered')]}
            onPress={() => ref.current?.setText('SwiftUI rocks!')}
            label="Set text"
          />
          <Button
            modifiers={[buttonStyle('bordered')]}
            onPress={() => ref.current?.clear()}
            label="Clear"
          />
          <Button
            modifiers={[buttonStyle('bordered')]}
            onPress={() => ref.current?.setSelection(0, 7)}
            label="Select"
          />
        </HStack>
      </VStack>
    </Host>
  );
}
```

### Worklet 文本遮罩

当 `onTextChange` 带有 `'worklet'` 指令时，它会在 UI 线程上同步运行，因此回调内对 [`useNativeState`](/versions/latest/sdk/ui/swift-ui/usenativestate) 可观察对象的写入会在下一帧之前生效。输入文本和遮罩文本之间不会闪烁。下面的示例在用户输入时遮罩电话号码，并从 worklet 同时写入 `text` 和 `selection`，使光标保持在格式化值的末尾。

:::note
Worklet 需要安装 [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets)。`selection` 属性需要 iOS 18.0+ / tvOS 18.0+。在更早的版本上，worklet 仍可更新文本，但无法定位光标。
:::

![空文本框，占位符格式化为电话号码](/static/images/expo-ui/examples/textfield-worklet-mask-ios-light.webp)

```tsx WorkletPhoneMaskExample.tsx
import { Host, TextField, useNativeState } from '@expo/ui/swift-ui';
import { keyboardType } from '@expo/ui/swift-ui/modifiers';
import { useCallback } from 'react';

export default function WorkletPhoneMaskExample() {
  const phone = useNativeState('');
  const selection = useNativeState({ start: 0, end: 0 });

  const handleTextChange = useCallback(
    (v: string) => {
      'worklet';
      const digits = v.replace(/\D/g, '').slice(0, 10);
      let formatted = digits;
      if (digits.length > 6) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length > 3) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      }
      if (formatted !== v) {
        phone.value = formatted;
        // 演示时直接跳到末尾。真正的遮罩需要更聪明的光标处理。
        selection.value = {
          start: formatted.length,
          end: formatted.length,
        };
      }
    },
    [phone, selection]
  );

  return (
    <Host style={{ flex: 1 }}>
      <TextField
        text={phone}
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
import { TextField } from '@expo/ui/swift-ui';
```
