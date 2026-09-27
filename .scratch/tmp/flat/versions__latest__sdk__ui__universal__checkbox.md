---
title: Checkbox 组件参考
description: A toggle control that represents a checked or unchecked state.
---

# Checkbox 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A controlled checkbox. Pair [`value`](#value) with [`onValueChange`](#onvaluechange) to manage state from React.

**Android**

![Checked and unchecked Material 3 checkboxes](/static/images/expo-ui/checkbox/android-light.webp)

**iOS**

![A checked and an unchecked checkbox side by side](/static/images/expo-ui/checkbox/ios-light.webp)

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

### Basic checkbox

**Android**

![An unchecked checkbox with a consent label](/static/images/expo-ui/examples/universal-checkbox-basic-android-light.webp)

**iOS**

![A switch-style checkbox with a consent label](/static/images/expo-ui/examples/universal-checkbox-basic-ios-light.webp)

```tsx CheckboxExample.tsx
import { useState } from 'react';
import { Host, Checkbox } from '@expo/ui';

export default function CheckboxExample() {
  const [accepted, setAccepted] = useState(false);

  return (
    <Host matchContents>
      <Checkbox label="I accept the terms" value={accepted} onValueChange={setAccepted} />
    </Host>
  );
}
```

### Disabled

**Android**

![A checked, disabled checkbox with the label Locked option](/static/images/expo-ui/examples/universal-checkbox-disabled-android-light.webp)

**iOS**

![A checked, disabled switch-style checkbox with the label Locked option](/static/images/expo-ui/examples/universal-checkbox-disabled-ios-light.webp)

```tsx DisabledCheckboxExample.tsx
import { Host, Checkbox } from '@expo/ui';

export default function DisabledCheckboxExample() {
  return (
    <Host matchContents>
      <Checkbox label="Locked option" value onValueChange={() => {}} disabled />
    </Host>
  );
}
```

## API

```tsx
import { Checkbox } from '@expo/ui';
```
