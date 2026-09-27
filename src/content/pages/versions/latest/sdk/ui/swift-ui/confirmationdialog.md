---
title: ConfirmationDialog 组件参考
description: 用于呈现确认提示的 SwiftUI ConfirmationDialog 组件。
---

# ConfirmationDialog 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 ConfirmationDialog 与官方 SwiftUI [confirmationDialog API](https://developer.apple.com/documentation/swiftui/view/confirmationdialog(_:ispresented:titlevisibility:actions:message:)) 保持一致，呈现带标题、操作和可选消息的操作表样式对话框。

![询问用户是否确认破坏性操作的 ConfirmationDialog](/static/images/expo-ui/confirmationdialog/ios-light.webp)

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

### 基本确认对话框

用 `ConfirmationDialog.Trigger` 定义可见元素，用 `ConfirmationDialog.Actions` 提供对话框按钮。

![锚定在触发器下方的对话框，标题为 Are you sure?，带 Confirm 按钮](/static/images/expo-ui/examples/confirmationdialog-basic-ios-light.webp)

```tsx BasicConfirmationDialogExample.tsx
import { useState } from 'react';
import {
  Host,
  ConfirmationDialog,
  Button,
} from '@expo/ui/swift-ui';

export default function BasicConfirmationDialogExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <ConfirmationDialog
        title="Are you sure?"
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}
        titleVisibility="visible">
        <ConfirmationDialog.Trigger>
          <Button
            label="Show dialog"
            onPress={() => setIsPresented(true)}
          />
        </ConfirmationDialog.Trigger>
        <ConfirmationDialog.Actions>
          <Button
            label="Confirm"
            onPress={() => setIsPresented(false)}
          />
          <Button label="Cancel" role="cancel" />
        </ConfirmationDialog.Actions>
      </ConfirmationDialog>
    </Host>
  );
}
```

### 破坏性操作确认

在 `ConfirmationDialog.Actions` 内的 `Button` 上使用 `role="destructive"`，将其样式设为破坏性操作。

![标题为 Delete Item? 的对话框，带消息和红色 Delete 按钮](/static/images/expo-ui/examples/confirmationdialog-destructive-ios-light.webp)

```tsx DestructiveConfirmationDialogExample.tsx
import { useState } from 'react';
import {
  Host,
  ConfirmationDialog,
  Button,
  Text,
} from '@expo/ui/swift-ui';

export default function DestructiveConfirmationDialogExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <ConfirmationDialog
        title="Delete Item?"
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}
        titleVisibility="visible">
        <ConfirmationDialog.Trigger>
          <Button
            label="Delete"
            role="destructive"
            onPress={() => setIsPresented(true)}
          />
        </ConfirmationDialog.Trigger>
        <ConfirmationDialog.Actions>
          <Button
            label="Delete"
            role="destructive"
            onPress={() => {
              console.log('Deleted');
              setIsPresented(false);
            }}
          />
          <Button label="Cancel" role="cancel" />
        </ConfirmationDialog.Actions>
        <ConfirmationDialog.Message>
          <Text>This action cannot be undone.</Text>
        </ConfirmationDialog.Message>
      </ConfirmationDialog>
    </Host>
  );
}
```

### 带消息和多个操作

用 `ConfirmationDialog.Message` 在标题下方显示说明性消息，并包含多个操作按钮以提供不同选择。

![标题为 Save Changes? 的对话框，带消息、Save 按钮和红色 Discard 按钮](/static/images/expo-ui/examples/confirmationdialog-multi-action-ios-light.webp)

```tsx MultiActionConfirmationDialogExample.tsx
import { useState } from 'react';
import {
  Host,
  ConfirmationDialog,
  Button,
  Text,
} from '@expo/ui/swift-ui';

export default function MultiActionConfirmationDialogExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <ConfirmationDialog
        title="Save Changes?"
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}
        titleVisibility="visible">
        <ConfirmationDialog.Trigger>
          <Button
            label="Close document"
            onPress={() => setIsPresented(true)}
          />
        </ConfirmationDialog.Trigger>
        <ConfirmationDialog.Actions>
          <Button
            label="Save"
            onPress={() => console.log('Saved')}
          />
          <Button
            label="Discard"
            role="destructive"
            onPress={() => console.log('Discarded')}
          />
          <Button label="Cancel" role="cancel" />
        </ConfirmationDialog.Actions>
        <ConfirmationDialog.Message>
          <Text>
            You have unsaved changes. What would you like to do?
          </Text>
        </ConfirmationDialog.Message>
      </ConfirmationDialog>
    </Host>
  );
}
```

### 隐藏标题

设置 `titleVisibility="hidden"` 可隐藏对话框标题，同时仍显示操作和消息。为了无障碍，你仍应提供 `title`。

![对话框只显示消息和 OK 按钮，没有标题](/static/images/expo-ui/examples/confirmationdialog-hidden-title-ios-light.webp)

```tsx HiddenTitleConfirmationDialogExample.tsx
import { useState } from 'react';
import {
  Host,
  ConfirmationDialog,
  Button,
  Text,
} from '@expo/ui/swift-ui';

export default function HiddenTitleConfirmationDialogExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <ConfirmationDialog
        title="Hidden Title"
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}
        titleVisibility="hidden">
        <ConfirmationDialog.Trigger>
          <Button
            label="Show dialog"
            onPress={() => setIsPresented(true)}
          />
        </ConfirmationDialog.Trigger>
        <ConfirmationDialog.Actions>
          <Button
            label="OK"
            onPress={() => setIsPresented(false)}
          />
          <Button label="Cancel" role="cancel" />
        </ConfirmationDialog.Actions>
        <ConfirmationDialog.Message>
          <Text>Only the message and actions are visible.</Text>
        </ConfirmationDialog.Message>
      </ConfirmationDialog>
    </Host>
  );
}
```

## API

```tsx
import { ConfirmationDialog } from '@expo/ui/swift-ui';
```
