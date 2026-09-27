---
title: ToggleButton 包参考
description: 用于显示原生 Material3 切换按钮的 Jetpack Compose ToggleButton 组件。
---

# ToggleButton 包参考

> 本页面对应 Expo SDK v55。
> 支持平台：Android。

Expo UI 提供了四个与官方 Jetpack Compose Toggle Button API 一致的切换按钮组件：[`ToggleButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-toggle-button.html)、[`IconToggleButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-icon-toggle-button.html)、[`FilledIconToggleButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-filled-icon-toggle-button.html) 和 [`OutlinedIconToggleButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-outlined-icon-toggle-button.html)。

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

### 基本切换按钮

带文本和图标内容的切换按钮。

```tsx BasicToggleButtonExample.tsx
import { useState } from 'react';
import { Host, ToggleButton, Text } from '@expo/ui/jetpack-compose';

export default function BasicToggleButtonExample() {
  const [checked, setChecked] = useState(false);

  return (
    <Host matchContents>
      <ToggleButton checked={checked} onCheckedChange={setChecked}>
        <Text>Favorite</Text>
      </ToggleButton>
    </Host>
  );
}
```

### 图标切换按钮变体

使用不同的图标切换按钮组件来传达不同的强调程度。

```tsx IconToggleButtonVariantsExample.tsx
import { useState } from 'react';
import {
  Host,
  IconToggleButton,
  FilledIconToggleButton,
  OutlinedIconToggleButton,
  Icon,
  Row,
} from '@expo/ui/jetpack-compose';

const starIcon = require('./assets/star.png');

export default function IconToggleButtonVariantsExample() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(false);

  return (
    <Host matchContents>
      <Row horizontalArrangement={{ spacedBy: 8 }}>
        <IconToggleButton checked={checked1} onCheckedChange={setChecked1}>
          <Icon source={starIcon} size={24} />
        </IconToggleButton>
        <FilledIconToggleButton checked={checked2} onCheckedChange={setChecked2}>
          <Icon source={starIcon} size={24} />
        </FilledIconToggleButton>
        <OutlinedIconToggleButton checked={checked3} onCheckedChange={setChecked3}>
          <Icon source={starIcon} size={24} />
        </OutlinedIconToggleButton>
      </Row>
    </Host>
  );
}
```

### 自定义颜色

使用 `colors` 属性覆盖选中与未选中状态的颜色。

```tsx CustomColorsToggleButtonExample.tsx
import { useState } from 'react';
import { Host, ToggleButton, Text } from '@expo/ui/jetpack-compose';

export default function CustomColorsToggleButtonExample() {
  const [checked, setChecked] = useState(true);

  return (
    <Host matchContents>
      <ToggleButton
        checked={checked}
        onCheckedChange={setChecked}
        colors={{
          checkedContainerColor: '#4CAF50',
          checkedContentColor: '#FFFFFF',
          containerColor: '#E0E0E0',
          contentColor: '#333333',
        }}>
        <Text>{checked ? 'ON' : 'OFF'}</Text>
      </ToggleButton>
    </Host>
  );
}
```

### 禁用的切换按钮

```tsx DisabledToggleButtonExample.tsx
import { Host, ToggleButton, Text } from '@expo/ui/jetpack-compose';

export default function DisabledToggleButtonExample() {
  return (
    <Host matchContents>
      <ToggleButton checked={false} enabled={false}>
        <Text>Disabled</Text>
      </ToggleButton>
    </Host>
  );
}
```

## API

```tsx
import {
  ToggleButton,
  IconToggleButton,
  FilledIconToggleButton,
  OutlinedIconToggleButton,
} from '@expo/ui/jetpack-compose';
```
