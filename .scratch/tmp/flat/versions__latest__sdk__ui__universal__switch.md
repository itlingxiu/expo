---
title: Switch 组件参考
description: A toggle control that switches between on and off states.
---

# Switch 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A controlled toggle. Pair [`value`](#value) with [`onValueChange`](#onvaluechange) to manage state from React.

**Android**

![Two Material 3 switches showing on and off states](/static/images/expo-ui/switch/android-light.webp)

**iOS**

![Two switches showing on and off states](/static/images/expo-ui/switch/ios-light.webp)

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

### Basic switch

**Android**

![A switch in the off position](/static/images/expo-ui/examples/universal-switch-basic-android-light.webp)

**iOS**

![A switch in the off position](/static/images/expo-ui/examples/universal-switch-basic-ios-light.webp)

```tsx SwitchExample.tsx
import { useState } from 'react';
import { Host, Switch } from '@expo/ui';

export default function SwitchExample() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Host matchContents>
      <Switch value={enabled} onValueChange={setEnabled} />
    </Host>
  );
}
```

### With label

When `label` is provided, the switch is rendered alongside its text in a labeled row.

**Android**

![An on switch with the label Enable notifications](/static/images/expo-ui/examples/universal-switch-labeled-android-light.webp)

**iOS**

![An on switch with the label Enable notifications](/static/images/expo-ui/examples/universal-switch-labeled-ios-light.webp)

```tsx LabeledSwitchExample.tsx
import { useState } from 'react';
import { Host, Switch } from '@expo/ui';

export default function LabeledSwitchExample() {
  const [notifications, setNotifications] = useState(true);

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Switch label="Enable notifications" value={notifications} onValueChange={setNotifications} />
    </Host>
  );
}
```

## API

```tsx
import { Switch } from '@expo/ui';
```
