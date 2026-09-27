---
title: ExposedDropdownMenuBox 组件参考
description: 用于显示带可自定义锚点的下拉菜单的 Jetpack Compose ExposedDropdownMenuBox 组件。
---

# ExposedDropdownMenuBox 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台选择器请参阅 [`Picker`](/versions/latest/sdk/ui/universal/picker)——在 Android 上它基于 `ExposedDropdownMenuBox` 构建。
:::

Expo UI 的 `ExposedDropdownMenuBox` 与官方 Jetpack Compose [`ExposedDropdownMenuBox`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-exposed-dropdown-menu-box.html) 保持一致。在锚点内容（通常是只读 `TextField`）上使用 `menuAnchor()` 修改器，并用 `ExposedDropdownMenu` 包裹 `DropdownMenuItem` 子元素。

![展开的下拉菜单，四个语言选项锚定在文本框上](/static/images/expo-ui/exposeddropdownmenubox/android-light.webp)

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

### 基本用法

> 锚点是绑定到 [`useNativeState`](/versions/latest/sdk/ui/jetpack-compose/usenativestate) 可观察值的只读 `TextField`。在每一项的 `onClick` 中更新该可观察值，以反映选中的值。

![只读文本框显示 Java，下方展开的菜单列出 Java、JavaScript 和 TypeScript](/static/images/expo-ui/examples/exposeddropdownmenubox-basic-android-light.webp)

```tsx BasicExposedDropdownMenuBoxExample.tsx
import {
  DropdownMenuItem,
  ExposedDropdownMenuBox,
  ExposedDropdownMenu,
  Host,
  Text,
  TextField,
  useNativeState,
} from '@expo/ui/jetpack-compose';
import { menuAnchor } from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';

const LANGUAGES = [
  { label: 'Java', value: 'java' },
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
];

export default function BasicExposedDropdownMenuBoxExample() {
  const selectedLabel = useNativeState('Java');
  const [expanded, setExpanded] = useState(false);

  return (
    <Host matchContents>
      <ExposedDropdownMenuBox
        expanded={expanded}
        onExpandedChange={setExpanded}>
        <TextField
          value={selectedLabel}
          readOnly
          modifiers={[menuAnchor()]}
        />
        <ExposedDropdownMenu
          expanded={expanded}
          onDismissRequest={() => setExpanded(false)}>
          {LANGUAGES.map(lang => (
            <DropdownMenuItem
              key={lang.value}
              onClick={() => {
                selectedLabel.value = lang.label;
                setExpanded(false);
              }}>
              <DropdownMenuItem.Text>
                <Text>{lang.label}</Text>
              </DropdownMenuItem.Text>
            </DropdownMenuItem>
          ))}
        </ExposedDropdownMenu>
      </ExposedDropdownMenuBox>
    </Host>
  );
}
```

## API

```tsx
import { ExposedDropdownMenuBox } from '@expo/ui/jetpack-compose';
```
