---
title: TextField 组件参考
description: 用于原生 Material 3 文本输入的 Jetpack Compose TextField 组件。
---

# TextField 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台用法请参阅通用 [`TextInput`](/versions/latest/sdk/ui/universal/textinput)——它会按平台渲染对应的原生组件。
:::

Expo UI 提供三个与官方 Jetpack Compose [TextField API](https://developer.android.com/develop/ui/compose/text/user-input) 一致的文本框组件：`TextField`（填充）、`OutlinedTextField`（描边）和 `BasicTextField`（无样式）。Material 变体 `TextField` 和 `OutlinedTextField` 共用同一套属性，并支持可组合的插槽子元素，用于标签、占位符、图标、前缀、后缀和辅助文本。`BasicTextField` 没有 Material 外观，因此你需要自己提供装饰。

| 类型 | 外观 | 用途 |
| --- | --- | --- |
| 填充 | 实心背景，底部有指示线。 | 遵循 Material 3 设计的默认文本输入样式。适用于大多数表单和输入框。 |
| 描边 | 透明背景，带边框轮廓。 | 提供清晰视觉边界的替代样式。适用于填充字段会融入背景的情况。 |
| 基础 | 没有容器、指示线或内边距，只有可编辑文本。 | 完全自定义样式的输入。自行设置样式，并通过 `DecorationBox` 添加装饰。 |

![填充、描边和基础（无样式）文本框](/static/images/expo-ui/textfield/android-light.webp)

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

把 [`useNativeState`](/versions/latest/sdk/ui/jetpack-compose/usenativestate) 可观察对象绑定到 `value`。字段会自行跟踪用户输入，你从 `text.value` 读取当前值。这里展示的填充样式是默认的 Material 3 文本输入。

![标签为 Username 的填充 Material 3 文本框](/static/images/expo-ui/examples/composetextfield-uncontrolled-android-light.webp)

```tsx UncontrolledTextFieldExample.tsx
import {
  Host,
  TextField,
  Text,
  useNativeState,
} from '@expo/ui/jetpack-compose';

export default function UncontrolledTextFieldExample() {
  const text = useNativeState('');

  return (
    <Host matchContents>
      <TextField value={text}>
        <TextField.Label>
          <Text>Username</Text>
        </TextField.Label>
      </TextField>
    </Host>
  );
}
```

### 受控文本框

把 [`useNativeState`](/versions/latest/sdk/ui/jetpack-compose/usenativestate) 可观察对象作为 `value` 传入，并用 `onValueChange` worklet 在写回之前转换或校验输入。下面的示例会在输入时把文本转为大写。

:::note
Worklet 需要安装 [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets)。
:::

![标签为 Name 的文本框，内容为输入时转成大写的 ADA LOVELACE](/static/images/expo-ui/examples/composetextfield-controlled-android-light.webp)

```tsx ControlledTextFieldExample.tsx
import {
  Host,
  TextField,
  Text,
  useNativeState,
} from '@expo/ui/jetpack-compose';
import { useCallback } from 'react';

export default function ControlledTextFieldExample() {
  const text = useNativeState('');

  const handleValueChange = useCallback(
    (value: string) => {
      'worklet';
      text.value = value.toUpperCase();
    },
    [text]
  );

  return (
    <Host matchContents>
      <TextField value={text} onValueChange={handleValueChange}>
        <TextField.Label>
          <Text>Name</Text>
        </TextField.Label>
      </TextField>
    </Host>
  );
}
```

### 描边文本框

使用 `OutlinedTextField` 获得带边框轮廓、而不是填充背景的文本框。

![聚焦的描边文本框，Email 标签位于边框缺口中，并带有占位符](/static/images/expo-ui/examples/composetextfield-outlined-android-light.webp)

```tsx OutlinedTextFieldExample.tsx
import {
  Host,
  OutlinedTextField,
  Text,
  useNativeState,
} from '@expo/ui/jetpack-compose';

export default function OutlinedTextFieldExample() {
  const text = useNativeState('');

  return (
    <Host matchContents>
      <OutlinedTextField value={text}>
        <OutlinedTextField.Label>
          <Text>Email</Text>
        </OutlinedTextField.Label>
        <OutlinedTextField.Placeholder>
          <Text>you@example.com</Text>
        </OutlinedTextField.Placeholder>
      </OutlinedTextField>
    </Host>
  );
}
```

### 基础文本框

`BasicTextField` 是无样式的 Compose 原语，没有容器、指示线或内边距。用[修饰符](/versions/latest/sdk/ui/jetpack-compose/modifiers)自行设置样式，并通过 `DecorationBox` 提供装饰，把 `InnerTextField` 放在可编辑文本应渲染的位置。把占位内容包在 `Placeholder` 中，它只在字段为空时显示，并由字段文本在原生侧切换。

![无样式文本框，画成全宽圆角灰色胶囊，占位符为 Search](/static/images/expo-ui/examples/composetextfield-basic-android-light.webp)

```tsx BasicTextFieldExample.tsx
import {
  Host,
  BasicTextField,
  Box,
  Text,
  useNativeState,
} from '@expo/ui/jetpack-compose';
import {
  background,
  clip,
  fillMaxWidth,
  padding,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';

export default function BasicTextFieldExample() {
  const value = useNativeState('');

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <BasicTextField
        cursorColor="#7c3aed"
        value={value}
        modifiers={[
          fillMaxWidth(),
          clip(Shapes.RoundedCorner(12)),
          background('#f3f4f6'),
          padding(12, 10, 12, 10),
        ]}>
        <BasicTextField.DecorationBox>
          <Box>
            <BasicTextField.Placeholder>
              <Text color="#9ca3af">Search…</Text>
            </BasicTextField.Placeholder>
            <BasicTextField.InnerTextField />
          </Box>
        </BasicTextField.DecorationBox>
      </BasicTextField>
    </Host>
  );
}
```

### 插槽

`TextField` 和 `OutlinedTextField` 都支持 7 个与 Compose API 一致的可组合插槽：`Label`、`Placeholder`、`LeadingIcon`、`TrailingIcon`、`Prefix`、`Suffix` 和 `SupportingText`。

![聚焦的文本框，显示金钱图标、Price 标签、美元前缀、占位符、USD 后缀和辅助文本](/static/images/expo-ui/examples/composetextfield-slots-android-light.webp)

```tsx TextFieldSlotsExample.tsx
import {
  Host,
  TextField,
  Text,
  useNativeState,
} from '@expo/ui/jetpack-compose';

export default function TextFieldSlotsExample() {
  const text = useNativeState('');

  return (
    <Host matchContents>
      <TextField value={text}>
        <TextField.Label>
          <Text>Price</Text>
        </TextField.Label>
        <TextField.Placeholder>
          <Text>0.00</Text>
        </TextField.Placeholder>
        <TextField.LeadingIcon>
          <Text>💰</Text>
        </TextField.LeadingIcon>
        <TextField.Prefix>
          <Text>$</Text>
        </TextField.Prefix>
        <TextField.Suffix>
          <Text>USD</Text>
        </TextField.Suffix>
        <TextField.SupportingText>
          <Text>Enter the amount</Text>
        </TextField.SupportingText>
      </TextField>
    </Host>
  );
}
```

### 键盘选项

使用 `keyboardOptions` 属性配置键盘类型、大小写、自动更正和 IME 操作。

![聚焦的邮箱字段位于邮箱键盘上方，键盘有专用的 @ 键和完成操作](/static/images/expo-ui/examples/composetextfield-keyboard-options-android-light.webp)

```tsx KeyboardOptionsExample.tsx
import {
  Host,
  TextField,
  Text,
  useNativeState,
} from '@expo/ui/jetpack-compose';

export default function KeyboardOptionsExample() {
  const text = useNativeState('');

  return (
    <Host matchContents>
      <TextField
        value={text}
        singleLine
        keyboardOptions={{
          keyboardType: 'email',
          capitalization: 'none',
          autoCorrectEnabled: false,
          imeAction: 'done',
        }}>
        <TextField.Label>
          <Text>Email</Text>
        </TextField.Label>
      </TextField>
    </Host>
  );
}
```

### 键盘操作

使用 `keyboardActions` 属性处理 IME 操作按钮按下。触发哪个回调取决于 `keyboardOptions` 中设置的 `imeAction`。每个回调都会收到当前文本值。

![聚焦的搜索字段位于键盘上方，操作键是放大镜](/static/images/expo-ui/examples/composetextfield-keyboard-actions-android-light.webp)

```tsx KeyboardActionsExample.tsx
import {
  Host,
  TextField,
  Text,
  useNativeState,
} from '@expo/ui/jetpack-compose';

export default function KeyboardActionsExample() {
  const text = useNativeState('');

  return (
    <Host matchContents>
      <TextField
        value={text}
        singleLine
        keyboardOptions={{ imeAction: 'search' }}
        keyboardActions={{
          onSearch: value => console.log('Searched:', value),
        }}>
        <TextField.Label>
          <Text>Search</Text>
        </TextField.Label>
      </TextField>
    </Host>
  );
}
```

### 命令式 ref

使用 ref 以命令方式设置文本、清空字段、改变选区或移动焦点。

![文本框上方有五个按钮：Set text、Clear、Select first word、Focus 和 Blur](/static/images/expo-ui/examples/composetextfield-imperative-android-light.webp)

```tsx ImperativeRefExample.tsx
import { useRef } from 'react';
import {
  Host,
  TextField,
  TextFieldRef,
  Button,
  Row,
  Text,
  Column,
  useNativeState,
} from '@expo/ui/jetpack-compose';
import { padding } from '@expo/ui/jetpack-compose/modifiers';

export default function ImperativeRefExample() {
  const ref = useRef<TextFieldRef>(null);
  const text = useNativeState('');

  return (
    <Host matchContents>
      <Column>
        <TextField ref={ref} value={text} singleLine>
          <TextField.Label>
            <Text>Name</Text>
          </TextField.Label>
        </TextField>
        <Row
          horizontalArrangement={{ spacedBy: 8 }}
          modifiers={[padding(8, 0, 0, 0)]}>
          <Button
            onClick={() => ref.current?.setText('Hello world')}>
            <Text>Set text</Text>
          </Button>
          <Button onClick={() => ref.current?.clear()}>
            <Text>Clear</Text>
          </Button>
          <Button onClick={() => ref.current?.setSelection(0, 5)}>
            <Text>Select first word</Text>
          </Button>
        </Row>
        <Row
          horizontalArrangement={{ spacedBy: 8 }}
          modifiers={[padding(8, 0, 0, 0)]}>
          <Button onClick={() => ref.current?.focus()}>
            <Text>Focus</Text>
          </Button>
          <Button onClick={() => ref.current?.blur()}>
            <Text>Blur</Text>
          </Button>
        </Row>
      </Column>
    </Host>
  );
}
```

### Worklet 文本遮罩

当 `onValueChange` 带有 `'worklet'` 指令时，它会在 UI 线程上同步运行，因此回调内对 [`useNativeState`](/versions/latest/sdk/ui/jetpack-compose/usenativestate) 可观察对象的写入会在下一帧之前生效。输入文本和遮罩文本之间不会闪烁。下面的示例在用户输入时遮罩电话号码，并从 worklet 同时写入 `value` 和 `selection`，使光标保持在格式化值的末尾。

:::note
Worklet 需要安装 [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets)。
:::

![全宽文本框把 2125559876 遮罩为格式化的电话号码](/static/images/expo-ui/examples/composetextfield-worklet-mask-android-light.webp)

```tsx WorkletPhoneMaskExample.tsx
import {
  Host,
  TextField,
  Text,
  useNativeState,
} from '@expo/ui/jetpack-compose';
import { fillMaxWidth } from '@expo/ui/jetpack-compose/modifiers';
import { useCallback } from 'react';

export default function WorkletPhoneMaskExample() {
  const phone = useNativeState('');
  const selection = useNativeState({ start: 0, end: 0 });

  const handleValueChange = useCallback(
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
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <TextField
        value={phone}
        selection={selection}
        keyboardOptions={{ keyboardType: 'phone' }}
        modifiers={[fillMaxWidth()]}
        onValueChange={handleValueChange}>
        <TextField.Placeholder>
          <Text>(555) 123-4567</Text>
        </TextField.Placeholder>
      </TextField>
    </Host>
  );
}
```

## API

```tsx
import {
  TextField,
  OutlinedTextField,
  BasicTextField,
} from '@expo/ui/jetpack-compose';
```
