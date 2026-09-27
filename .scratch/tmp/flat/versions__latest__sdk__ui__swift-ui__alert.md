---
title: Alert 组件参考
description: A SwiftUI Alert component for presenting native iOS alert dialogs.
---

# Alert 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI Alert matches the official SwiftUI [alert API](<https://developer.apple.com/documentation/swiftui/view/alert(_:ispresented:actions:message:)>) and presents a native iOS alert dialog with a title, actions, and an optional message.

![Alert asking the user to confirm signing out](/static/images/expo-ui/alert/ios-light.webp)

`Alert` is the centered modal counterpart to [`ConfirmationDialog`](confirmationdialog), which renders as an action sheet from the bottom of the screen. Both share the same trigger/actions/message slot model so callers can swap between them by changing the component name.

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

### Basic alert

Use `Alert.Trigger` to define the visible element and `Alert.Actions` to provide the dialog buttons.

![Alert titled Saved with a single OK button, above the Show alert trigger](/static/images/expo-ui/examples/alert-basic-ios-light.webp)

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

### Cancel and confirm

Combine `role="cancel"` with a confirm button to build a standard yes/no alert.

![Alert titled Sign out? with a message and Cancel and Sign out buttons](/static/images/expo-ui/examples/alert-cancel-confirm-ios-light.webp)

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

### Destructive action

Use `role="destructive"` on a `Button` inside `Alert.Actions` to style it as a destructive action.

![Alert titled Delete account? with a message, a Cancel button, and a red Delete button](/static/images/expo-ui/examples/alert-destructive-ios-light.webp)

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
