---
title: Alert 组件参考
description: 用于呈现原生 iOS 警告对话框的 SwiftUI Alert 组件。
---

# Alert 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 Alert 与官方 SwiftUI [alert API](https://developer.apple.com/documentation/swiftui/view/alert(_:ispresented:actions:message:)) 保持一致，呈现带标题、操作和可选消息的原生 iOS 警告对话框。

![询问用户是否确认退出登录的 Alert](/static/images/expo-ui/alert/ios-light.webp)

`Alert` 是 [`ConfirmationDialog`](/versions/latest/sdk/ui/swift-ui/confirmationdialog) 的居中模态对应物，后者从屏幕底部以操作表形式呈现。两者共用同一套触发器/操作/消息插槽模型，调用方只需更换组件名即可在二者之间切换。

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

### 基本警告

用 `Alert.Trigger` 定义可见元素，用 `Alert.Actions` 提供对话框按钮。

![标题为 Saved、只有一个 OK 按钮的警告，位于 Show alert 触发器上方](/static/images/expo-ui/examples/alert-basic-ios-light.webp)

```tsx BasicAlertExample.tsx
import { useState } from 'react';
import { Host, Alert, Button } from '@expo/ui/swift-ui';

export default function BasicAlertExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Alert
        title="Saved"
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}>
        <Alert.Trigger>
          <Button
            label="Show alert"
            onPress={() => setIsPresented(true)}
          />
        </Alert.Trigger>
        <Alert.Actions>
          <Button
            label="OK"
            onPress={() => setIsPresented(false)}
          />
        </Alert.Actions>
      </Alert>
    </Host>
  );
}
```

### 取消与确认

把 `role="cancel"` 与确认按钮组合，构成标准的是/否警告。

![标题为 Sign out? 的警告，带消息以及 Cancel 和 Sign out 按钮](/static/images/expo-ui/examples/alert-cancel-confirm-ios-light.webp)

```tsx CancelConfirmAlertExample.tsx
import { useState } from 'react';
import { Host, Alert, Button, Text } from '@expo/ui/swift-ui';

export default function CancelConfirmAlertExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Alert
        title="Sign out?"
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}>
        <Alert.Trigger>
          <Button
            label="Sign out"
            onPress={() => setIsPresented(true)}
          />
        </Alert.Trigger>
        <Alert.Actions>
          <Button
            label="Sign out"
            onPress={() => console.log('Signed out')}
          />
          <Button label="Cancel" role="cancel" />
        </Alert.Actions>
        <Alert.Message>
          <Text>
            You will need to sign in again to access your account.
          </Text>
        </Alert.Message>
      </Alert>
    </Host>
  );
}
```

### 破坏性操作

在 `Alert.Actions` 内的 `Button` 上使用 `role="destructive"`，将其样式设为破坏性操作。

![标题为 Delete account? 的警告，带消息、Cancel 按钮和红色 Delete 按钮](/static/images/expo-ui/examples/alert-destructive-ios-light.webp)

```tsx DestructiveAlertExample.tsx
import { useState } from 'react';
import { Host, Alert, Button, Text } from '@expo/ui/swift-ui';

export default function DestructiveAlertExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Alert
        title="Delete account?"
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}>
        <Alert.Trigger>
          <Button
            label="Delete account"
            role="destructive"
            onPress={() => setIsPresented(true)}
          />
        </Alert.Trigger>
        <Alert.Actions>
          <Button
            label="Delete"
            role="destructive"
            onPress={() => {
              console.log('Deleted');
              setIsPresented(false);
            }}
          />
          <Button label="Cancel" role="cancel" />
        </Alert.Actions>
        <Alert.Message>
          <Text>
            This permanently deletes your account and all data. This
            cannot be undone.
          </Text>
        </Alert.Message>
      </Alert>
    </Host>
  );
}
```

## API

```tsx
import { Alert } from '@expo/ui/swift-ui';
```
