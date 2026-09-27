---
title: SecureField 组件参考
description: 用于密码输入的 SwiftUI SecureField 组件。
---

# SecureField 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 SecureField 与官方 SwiftUI [SecureField API](https://developer.apple.com/documentation/swiftui/securefield) 保持一致，提供会遮罩用户输入的文本框，用于密码和其他敏感文本。

![用于修改密码的三行 SecureField](/static/images/expo-ui/securefield/ios-light.webp)

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

### 基本安全输入框

![显示占位符 Password 的空安全输入框](/static/images/expo-ui/examples/securefield-basic-ios-light.webp)

```tsx BasicSecureFieldExample.tsx
import { useState } from 'react';
import { Host, SecureField } from '@expo/ui/swift-ui';

export default function BasicSecureFieldExample() {
  const [password, setPassword] = useState('');

  // 安全输入框会拉伸到给定宽度，因此请给宿主指定尺寸。
  return (
    <Host style={{ flex: 1 }}>
      <SecureField
        placeholder="Password"
        onTextChange={setPassword}
      />
    </Host>
  );
}
```

### 提交处理

使用 [`submitLabel`](/versions/latest/sdk/ui/swift-ui/modifiers#submitlabelsubmitlabel) 和 [`onSubmit`](/versions/latest/sdk/ui/swift-ui/modifiers#onsubmithandler) 修改器，从键盘处理表单提交。

![键盘上方聚焦的安全输入框，提交键显示完成对勾](/static/images/expo-ui/examples/securefield-submit-ios-light.webp)

```tsx SecureFieldSubmitExample.tsx
import { useState } from 'react';
import { Host, SecureField } from '@expo/ui/swift-ui';
import { submitLabel, onSubmit } from '@expo/ui/swift-ui/modifiers';

export default function SecureFieldSubmitExample() {
  const [password, setPassword] = useState('');

  return (
    <Host style={{ flex: 1 }}>
      <SecureField
        placeholder="Password"
        onTextChange={setPassword}
        modifiers={[
          submitLabel('done'),
          onSubmit(() => console.log('Login submitted')),
        ]}
      />
    </Host>
  );
}
```

### 命令式 ref

使用 ref 以编程方式设置文本、聚焦或失焦安全输入框。

![安全输入框下方有一行 Focus、Blur 和 Set text 按钮](/static/images/expo-ui/examples/securefield-imperative-ios-light.webp)

```tsx ImperativeSecureFieldExample.tsx
import { useRef } from 'react';
import {
  Host,
  SecureField,
  SecureFieldRef,
  Button,
  HStack,
  VStack,
} from '@expo/ui/swift-ui';
import { buttonStyle } from '@expo/ui/swift-ui/modifiers';

export default function ImperativeSecureFieldExample() {
  const ref = useRef<SecureFieldRef>(null);

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <SecureField ref={ref} placeholder="Password" />
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
          <Button
            modifiers={[buttonStyle('bordered')]}
            onPress={() => ref.current?.setText('secret123')}
            label="Set text"
          />
        </HStack>
      </VStack>
    </Host>
  );
}
```

## API

```tsx
import { SecureField } from '@expo/ui/swift-ui';
```
