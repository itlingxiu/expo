---
title: Switch 组件参考
description: 用于开关控件的 Jetpack Compose Switch 组件。
---

# Switch 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台用法请参阅通用 [`Switch`](/versions/latest/sdk/ui/universal/switch)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Switch 与官方 Jetpack Compose [Switch](https://developer.android.com/develop/ui/compose/components/switch) API 保持一致。

![两个 Material 3 开关，分别显示开和关](/static/images/expo-ui/switch/android-light.webp)

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

### 切换开关

![处于未选中状态的 Material 3 开关](/static/images/expo-ui/examples/switch-toggle-android-light.webp)

```tsx ToggleSwitchExample.tsx
import { useState } from 'react';
import { Host, Switch } from '@expo/ui/jetpack-compose';

export default function ToggleSwitchExample() {
  const [checked, setChecked] = useState(false);

  return (
    <Host matchContents>
      <Switch value={checked} onCheckedChange={setChecked} />
    </Host>
  );
}
```

### 自定义颜色

![选中的开关，紫色滑块位于淡紫轨道上](/static/images/expo-ui/examples/switch-colors-android-light.webp)

```tsx CustomColorsExample.tsx
import { useState } from 'react';
import { Host, Switch } from '@expo/ui/jetpack-compose';

export default function CustomColorsExample() {
  const [checked, setChecked] = useState(false);

  return (
    <Host matchContents>
      <Switch
        value={checked}
        onCheckedChange={setChecked}
        colors={{
          checkedThumbColor: '#6200EE',
          checkedTrackColor: '#EDE9FE',
          uncheckedThumbColor: '#9CA3AF',
          uncheckedTrackColor: '#F3F4F6',
          uncheckedBorderColor: '#D1D5DB',
        }}
      />
    </Host>
  );
}
```

### 自定义滑块内容

使用 `Switch.ThumbContent` 在滑块内渲染自定义元素。`Switch.DefaultIconSize` 提供 Material 3 默认图标尺寸，让内容正好放得下。

![选中的开关，紫色滑块内有一个白色圆，看起来像圆环](/static/images/expo-ui/examples/switch-thumb-android-light.webp)

```tsx ThumbContentExample.tsx
import { useState } from 'react';
import { Host, Switch, Box } from '@expo/ui/jetpack-compose';
import {
  size,
  clip,
  background,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';

export default function ThumbContentExample() {
  const [checked, setChecked] = useState(false);

  return (
    <Host matchContents>
      <Switch
        value={checked}
        onCheckedChange={setChecked}
        colors={{
          checkedThumbColor: '#7C3AED',
          checkedTrackColor: '#EDE9FE',
          checkedIconColor: '#7C3AED',
          uncheckedThumbColor: '#9CA3AF',
          uncheckedTrackColor: '#F3F4F6',
          uncheckedBorderColor: '#D1D5DB',
          uncheckedIconColor: '#9CA3AF',
        }}>
        <Switch.ThumbContent>
          <Box
            modifiers={[
              size(Switch.DefaultIconSize, Switch.DefaultIconSize),
              clip(Shapes.Circle),
              background(checked ? '#FFFFFF' : '#E5E7EB'),
            ]}
          />
        </Switch.ThumbContent>
      </Switch>
    </Host>
  );
}
```

## API

```tsx
import { Switch } from '@expo/ui/jetpack-compose';
```
