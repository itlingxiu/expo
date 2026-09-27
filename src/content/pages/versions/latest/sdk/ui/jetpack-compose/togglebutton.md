---
title: ToggleButton 组件参考
description: 用于显示原生 Material 3 切换按钮的 Jetpack Compose ToggleButton 组件。
---

# ToggleButton 组件参考

> 支持平台：Android、Expo Go。

Expo UI 提供四个与官方 Jetpack Compose Toggle Button API 一致的切换按钮组件：[`ToggleButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-toggle-button.html)、[`IconToggleButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-icon-toggle-button.html)、[`FilledIconToggleButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-filled-icon-toggle-button.html) 和 [`OutlinedIconToggleButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-outlined-icon-toggle-button.html)。

![带文本的切换按钮，以及选中与未选中状态的两个图标切换按钮](/static/images/expo-ui/togglebutton/android-light.webp)

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

![未选中、标签为 Favorite 的切换按钮](/static/images/expo-ui/examples/togglebutton-basic-android-light.webp)

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

使用不同的图标切换按钮组件来表达不同程度的强调。

![三个星星图标切换按钮：普通未选中、填充已选中、描边未选中](/static/images/expo-ui/examples/togglebutton-icons-android-light.webp)

```tsx IconToggleButtonVariantsExample.tsx
import { useState } from 'react';
import {
  Host,
  IconToggleButton,
  FilledIconToggleButton,
  OutlinedIconToggleButton,
  Icon,
  Row,
  Surface,
} from '@expo/ui/jetpack-compose';

const starIcon = require('./assets/star.png');

export default function IconToggleButtonVariantsExample() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(false);

  return (
    <Host matchContents>
      <Surface>
        <Row horizontalArrangement={{ spacedBy: 8 }}>
          <IconToggleButton
            checked={checked1}
            onCheckedChange={setChecked1}>
            <Icon source={starIcon} size={24} />
          </IconToggleButton>
          <FilledIconToggleButton
            checked={checked2}
            onCheckedChange={setChecked2}>
            <Icon source={starIcon} size={24} />
          </FilledIconToggleButton>
          <OutlinedIconToggleButton
            checked={checked3}
            onCheckedChange={setChecked3}>
            <Icon source={starIcon} size={24} />
          </OutlinedIconToggleButton>
        </Row>
      </Surface>
    </Host>
  );
}
```

### 自定义颜色

使用 `colors` 属性覆盖选中和未选中颜色。

![已选中的切换按钮，绿色容器、白色 ON 标签](/static/images/expo-ui/examples/togglebutton-colors-android-light.webp)

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

![变暗、不可交互、标签为 Disabled 的切换按钮](/static/images/expo-ui/examples/togglebutton-disabled-android-light.webp)

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
