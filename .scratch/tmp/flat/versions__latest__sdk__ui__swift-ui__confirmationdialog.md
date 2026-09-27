---
title: ConfirmationDialog 组件参考
description: A SwiftUI ConfirmationDialog component for presenting confirmation prompts.
---

# ConfirmationDialog 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI ConfirmationDialog matches the official SwiftUI [confirmationDialog API](<https://developer.apple.com/documentation/swiftui/view/confirmationdialog(_:ispresented:titlevisibility:actions:message:)>) and presents an action sheet-style dialog with a title, actions, and an optional message.

![ConfirmationDialog asking the user to confirm a destructive action](/static/images/expo-ui/confirmationdialog/ios-light.webp)

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

### Basic confirmation dialog

Use `ConfirmationDialog.Trigger` to define the visible element and `ConfirmationDialog.Actions` to provide the dialog buttons.

![A dialog anchored under the trigger, titled Are you sure? with a Confirm button](/static/images/expo-ui/examples/confirmationdialog-basic-ios-light.webp)

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

### Destructive action confirmation

Use `role="destructive"` on a `Button` inside `ConfirmationDialog.Actions` to style it as a destructive action.

![A dialog titled Delete Item? with a message and a red Delete button](/static/images/expo-ui/examples/confirmationdialog-destructive-ios-light.webp)

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

### With message and multiple actions

Use `ConfirmationDialog.Message` to display a descriptive message below the title, and include multiple action buttons for different choices.

![A dialog titled Save Changes? with a message, a Save button, and a red Discard button](/static/images/expo-ui/examples/confirmationdialog-multi-action-ios-light.webp)

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

### Hidden title

Set `titleVisibility="hidden"` to hide the dialog title while still showing the actions and message. You should still provide a `title` for accessibility.

![A dialog showing only a message and an OK button, with no title](/static/images/expo-ui/examples/confirmationdialog-hidden-title-ios-light.webp)

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
