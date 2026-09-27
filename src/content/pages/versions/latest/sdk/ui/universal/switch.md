---
title: Switch 组件参考
description: 在开与关状态之间切换的控件。
---

# Switch 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

受控开关。将 [`value`](#value) 与 [`onValueChange`](#onvaluechange) 配对，即可从 React 管理状态。

**Android**

![两个 Material 3 开关，分别显示开和关](/static/images/expo-ui/switch/android-light.webp)

**iOS**

![两个开关，分别显示开和关](/static/images/expo-ui/switch/ios-light.webp)

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

### 基本开关

**Android**

![处于关闭位置的开关](/static/images/expo-ui/examples/universal-switch-basic-android-light.webp)

**iOS**

![处于关闭位置的开关](/static/images/expo-ui/examples/universal-switch-basic-ios-light.webp)

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

### 带标签

提供 `label` 时，开关会与文本一起渲染在带标签的行中。

**Android**

![标签为 Enable notifications 的开启状态开关](/static/images/expo-ui/examples/universal-switch-labeled-android-light.webp)

**iOS**

![标签为 Enable notifications 的开启状态开关](/static/images/expo-ui/examples/universal-switch-labeled-ios-light.webp)

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
