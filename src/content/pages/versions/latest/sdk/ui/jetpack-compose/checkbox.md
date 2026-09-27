---
title: Checkbox 组件参考
description: 用于选择控件的 Jetpack Compose Checkbox 组件。
---

# Checkbox 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台用法请参阅通用 [`Checkbox`](/versions/latest/sdk/ui/universal/checkbox)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Checkbox 与官方 Jetpack Compose [Checkbox](https://developer.android.com/develop/ui/compose/components/checkbox) API 保持一致。

![选中和未选中的 Material 3 复选框](/static/images/expo-ui/checkbox/android-light.webp)

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

![选中的 Material 3 复选框](/static/images/expo-ui/examples/checkbox-basic-android-light.webp)

```tsx CheckboxExample.tsx
import { useState } from 'react';
import { Host, Checkbox } from '@expo/ui/jetpack-compose';

export default function CheckboxExample() {
  const [checked, setChecked] = useState(false);

  return (
    <Host matchContents>
      <Checkbox value={checked} onCheckedChange={setChecked} />
    </Host>
  );
}
```

### 自定义颜色

![填充为紫色、勾选标记为白色的选中复选框](/static/images/expo-ui/examples/checkbox-custom-colors-android-light.webp)

```tsx CustomColorsExample.tsx
import { useState } from 'react';
import { Host, Checkbox } from '@expo/ui/jetpack-compose';

export default function CustomColorsExample() {
  const [checked, setChecked] = useState(false);

  return (
    <Host matchContents>
      <Checkbox
        value={checked}
        onCheckedChange={setChecked}
        colors={{
          checkedColor: '#6200EE',
          checkmarkColor: '#FFFFFF',
        }}
      />
    </Host>
  );
}
```

### 全选（TriStateCheckbox）

使用 `TriStateCheckbox` 作为反映子项状态的父级复选框。它支持三种状态：`'on'`、`'off'` 和 `'indeterminate'`。

给每个 `Row` 应用 `toggleable` 修改器，使整行（复选框 + 标签）可点击，并具有正确的无障碍语义。在行上使用 `toggleable` 时，不要再给复选框本身设置 `onCheckedChange` / `onClick`，以免重复处理。

![Select all 行显示不确定的短横线，下方是一个选中项和两个未选中项](/static/images/expo-ui/examples/checkbox-select-all-android-light.webp)

```tsx SelectAllExample.tsx
import { useState } from 'react';
import {
  Host,
  Checkbox,
  TriStateCheckbox,
  Row,
  Column,
  Text,
} from '@expo/ui/jetpack-compose';
import { toggleable } from '@expo/ui/jetpack-compose/modifiers';

export default function SelectAllExample() {
  const [child1, setChild1] = useState(false);
  const [child2, setChild2] = useState(false);
  const [child3, setChild3] = useState(false);

  const parentState =
    child1 && child2 && child3
      ? 'on'
      : !child1 && !child2 && !child3
        ? 'off'
        : 'indeterminate';

  return (
    <Host matchContents>
      <Column>
        <Row
          verticalAlignment="center"
          modifiers={[
            toggleable(
              parentState === 'on',
              () => {
                const newState = parentState !== 'on';
                setChild1(newState);
                setChild2(newState);
                setChild3(newState);
              },
              { role: 'checkbox' }
            ),
          ]}>
          <TriStateCheckbox state={parentState} />
          <Text>Select all</Text>
        </Row>
        <Row
          verticalAlignment="center"
          modifiers={[
            toggleable(child1, () => setChild1(!child1), {
              role: 'checkbox',
            }),
          ]}>
          <Checkbox value={child1} />
          <Text>Option 1</Text>
        </Row>
        <Row
          verticalAlignment="center"
          modifiers={[
            toggleable(child2, () => setChild2(!child2), {
              role: 'checkbox',
            }),
          ]}>
          <Checkbox value={child2} />
          <Text>Option 2</Text>
        </Row>
        <Row
          verticalAlignment="center"
          modifiers={[
            toggleable(child3, () => setChild3(!child3), {
              role: 'checkbox',
            }),
          ]}>
          <Checkbox value={child3} />
          <Text>Option 3</Text>
        </Row>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import {
  Checkbox,
  TriStateCheckbox,
} from '@expo/ui/jetpack-compose';
```
