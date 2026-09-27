---
title: TextField 包参考
description: 用于原生 Material3 文本输入的 Jetpack Compose TextField 组件。
---

# TextField 包参考

> 本页面对应 Expo SDK v55。
> 支持平台：Android。

Expo UI 提供了两个与官方 Jetpack Compose [TextField API](https://developer.android.com/develop/ui/compose/text/user-input) 一致的文本输入组件：`TextField`（填充式）和 `OutlinedTextField`（描边式）。两种变体共享相同的属性，并支持用于标签、占位符、图标、前缀、后缀和辅助文本的可组合插槽子元素。

| 类型 | 外观 | 用途 |
| ---- | ---- | ---- |
| 填充式（Filled） | 实心背景，底部带指示线。 | 遵循 Material3 设计的默认文本输入样式。适用于大多数表单和输入字段。 |
| 描边式（Outlined） | 透明背景，带边框轮廓。 | 提供清晰视觉边界的替代样式。当填充式字段与背景融为一体时使用。 |

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

### 基本文本字段

填充式文本字段是默认的 Material3 文本输入样式。

```tsx BasicTextFieldExample.tsx
import { useState } from 'react';
import { Host, TextField, Text } from '@expo/ui/jetpack-compose';

export default function BasicTextFieldExample() {
  const [value, setValue] = useState('');

  return (
    <Host matchContents>
      <TextField onValueChange={setValue}>
        <TextField.Label>
          <Text>Username</Text>
        </TextField.Label>
      </TextField>
    </Host>
  );
}
```

### 描边式文本字段

使用 `OutlinedTextField` 可获得带边框轮廓（而不是填充背景）的文本字段。

```tsx OutlinedTextFieldExample.tsx
import { useState } from 'react';
import { Host, OutlinedTextField, Text } from '@expo/ui/jetpack-compose';

export default function OutlinedTextFieldExample() {
  const [value, setValue] = useState('');

  return (
    <Host matchContents>
      <OutlinedTextField onValueChange={setValue}>
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

### 插槽

`TextField` 和 `OutlinedTextField` 均支持 7 个与 Compose API 一致的可组合插槽：`Label`、`Placeholder`、`LeadingIcon`、`TrailingIcon`、`Prefix`、`Suffix` 和 `SupportingText`。

```tsx TextFieldSlotsExample.tsx
import { useState } from 'react';
import { Host, TextField, Text } from '@expo/ui/jetpack-compose';

export default function TextFieldSlotsExample() {
  const [value, setValue] = useState('');

  return (
    <Host matchContents>
      <TextField onValueChange={setValue}>
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

使用 `keyboardOptions` 属性来配置键盘类型、首字母大写、自动纠错和 IME 动作。

```tsx KeyboardOptionsExample.tsx
import { useState } from 'react';
import { Host, TextField, Text } from '@expo/ui/jetpack-compose';

export default function KeyboardOptionsExample() {
  const [value, setValue] = useState('');

  return (
    <Host matchContents>
      <TextField
        onValueChange={setValue}
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

### 键盘动作

使用 `keyboardActions` 属性来处理 IME 动作按钮的按压。触发的回调取决于 `keyboardOptions` 中设置的 `imeAction`。每个回调都会接收当前文本值。

```tsx KeyboardActionsExample.tsx
import { useState } from 'react';
import { Host, TextField, Text } from '@expo/ui/jetpack-compose';

export default function KeyboardActionsExample() {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState('');

  return (
    <Host matchContents>
      <TextField
        onValueChange={setValue}
        singleLine
        keyboardOptions={{ imeAction: 'search' }}
        keyboardActions={{
          onSearch: text => setSubmitted(text),
        }}>
        <TextField.Label>
          <Text>Search</Text>
        </TextField.Label>
      </TextField>
    </Host>
  );
}
```

### 错误状态

设置 `isError` 可使文本字段以错误状态显示。结合 `SupportingText` 使用可显示错误信息。

```tsx ErrorStateExample.tsx
import { useState } from 'react';
import { Host, OutlinedTextField, Text } from '@expo/ui/jetpack-compose';

export default function ErrorStateExample() {
  const [value, setValue] = useState('');
  const hasError = value.length > 0 && !value.includes('@');

  return (
    <Host matchContents>
      <OutlinedTextField onValueChange={setValue} isError={hasError} singleLine>
        <OutlinedTextField.Label>
          <Text>Email</Text>
        </OutlinedTextField.Label>
        <OutlinedTextField.SupportingText>
          <Text>{hasError ? 'Please enter a valid email' : 'Required'}</Text>
        </OutlinedTextField.SupportingText>
      </OutlinedTextField>
    </Host>
  );
}
```

### 命令式 ref

使用 ref 可以命令式地设置文本、聚焦或失焦文本字段。

```tsx ImperativeRefExample.tsx
import { useRef, useState } from 'react';
import { Host, TextField, TextFieldRef, Button, Row, Text, Column } from '@expo/ui/jetpack-compose';
import { padding } from '@expo/ui/jetpack-compose/modifiers';

export default function ImperativeRefExample() {
  const ref = useRef<TextFieldRef>(null);
  const [value, setValue] = useState('');

  return (
    <Host matchContents>
      <Column>
        <TextField ref={ref} onValueChange={setValue} singleLine>
          <TextField.Label>
            <Text>Name</Text>
          </TextField.Label>
        </TextField>
        <Row horizontalArrangement={{ spacedBy: 8 }} modifiers={[padding(8, 0, 0, 0)]}>
          <Button onClick={() => ref.current?.setText('Hello!')}>
            <Text>Set text</Text>
          </Button>
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

## API

```tsx
import { TextField, OutlinedTextField } from '@expo/ui/jetpack-compose';
```
