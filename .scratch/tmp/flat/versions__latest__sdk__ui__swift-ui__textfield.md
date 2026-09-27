---
title: TextField 组件参考
description: A SwiftUI TextField component for text input.
---

# TextField 组件参考

> 支持平台：iOS、tvOS、Expo Go。

> **info** For cross-platform usage, see the universal [`TextInput`](/versions/latest/sdk/ui/universal/textinput) — it renders the appropriate native component per platform.

Expo UI TextField matches the official SwiftUI [TextField API](https://developer.apple.com/documentation/swiftui/textfield) and supports single-line and multiline input, keyboard configuration, submit handling, and an imperative `ref` for programmatic control.

![TextField and SecureField inside a Form](/static/images/expo-ui/textfield/ios-light.webp)

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

### Uncontrolled text field

Bind a [`useNativeState`](usenativestate) observable to `text`. The field tracks the user's input on its own, and you read the current value from `textState.value`.

![An empty text field showing the placeholder Username](/static/images/expo-ui/examples/textfield-basic-ios-light.webp)

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

### Controlled text field

Pass an `onTextChange` worklet to transform or validate input and write the result back to the [`useNativeState`](usenativestate) observable state. The example below uppercases the text as it is typed.

> **Note:** Worklets require installing [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets).

![An empty text field showing the placeholder Name](/static/images/expo-ui/examples/textfield-controlled-ios-light.webp)

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

### Multiline text field

Set `axis="vertical"` to allow the text field to expand vertically. Use the [`lineLimit`](modifiers#linelimit) modifier to control the visible line count. Give the `Host` an explicit size so the field has a width to expand within.

![An empty multiline text field showing the placeholder Tell us about yourself](/static/images/expo-ui/examples/textfield-multiline-ios-light.webp)

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

### Keyboard type

Use the [`keyboardType`](modifiers#keyboardtypekeyboardtype) modifier to display a specific keyboard layout.

![An empty text field showing the placeholder Email](/static/images/expo-ui/examples/textfield-keyboard-type-ios-light.webp)

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

### Submit handling

Use the [`submitLabel`](modifiers#submitlabelsubmitlabel) modifier to customize the return key and [`onSubmit`](modifiers#onsubmithandler) to handle the submit action.

![An empty text field showing the placeholder Search](/static/images/expo-ui/examples/textfield-submit-ios-light.webp)

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

### Imperative ref

Use a `ref` to imperatively set text, focus, blur, or select text.

> **Note:** `setSelection` requires iOS 18.0+ / tvOS 18.0+. The other ref methods work on all supported versions.

![A text field reading Select me! above a row of Focus, Blur, Set text, Clear, and Select buttons](/static/images/expo-ui/examples/textfield-imperative-ios-light.webp)

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

### Worklet text masking

When `onTextChange` is marked with the `'worklet'` directive, it runs synchronously on the UI thread, so writes to [`useNativeState`](usenativestate) observables inside the callback take effect before the next frame. There is no flicker between the typed text and the masked text. The example below masks a phone number as the user types and writes both `text` and `selection` from the worklet to keep the cursor at the end of the formatted value.

> **Note:** Worklets require installing [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets). The `selection` prop requires iOS 18.0+ / tvOS 18.0+. On older versions the worklet can still update the text but cursor positioning is unavailable.

![An empty text field showing the placeholder formatted as a phone number](/static/images/expo-ui/examples/textfield-worklet-mask-ios-light.webp)

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
