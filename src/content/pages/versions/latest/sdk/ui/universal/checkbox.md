---
title: Checkbox 组件参考
description: 表示选中或未选中状态的切换控件。
---

# Checkbox 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

受控复选框。将 [`value`](#value) 与 [`onValueChange`](#onvaluechange) 配对，即可从 React 管理状态。

**Android**

![选中和未选中的 Material 3 复选框](/static/images/expo-ui/checkbox/android-light.webp)

**iOS**

![并排的一个选中复选框和一个未选中复选框](/static/images/expo-ui/checkbox/ios-light.webp)

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

### 基本复选框

**Android**

![带同意标签的未选中复选框](/static/images/expo-ui/examples/universal-checkbox-basic-android-light.webp)

**iOS**

![带同意标签的开关样式复选框](/static/images/expo-ui/examples/universal-checkbox-basic-ios-light.webp)

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

### 禁用

**Android**

![带标签 Locked option 的已选中且禁用的复选框](/static/images/expo-ui/examples/universal-checkbox-disabled-android-light.webp)

**iOS**

![带标签 Locked option 的已选中且禁用的开关样式复选框](/static/images/expo-ui/examples/universal-checkbox-disabled-ios-light.webp)

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
