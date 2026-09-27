---
title: Surface 组件参考
description: 用于样式化内容容器的 Jetpack Compose Surface 组件。
---

# Surface 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 Surface 与官方 Jetpack Compose [Surface](https://developer.android.com/develop/ui/compose/designsystems/material3) API 保持一致，提供应用 Material Design 表面样式（包括颜色、海拔和内容颜色）的容器。

![两个上下堆叠、海拔一低一高的 Material 3 表面](/static/images/expo-ui/surface/android-light.webp)

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

### 基本表面

![浅色 Material 3 表面面板，里面是带内边距的文本](/static/images/expo-ui/examples/surface-basic-android-light.webp)

```tsx BasicSurfaceExample.tsx
import { Host, Surface, Text } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function BasicSurfaceExample() {
  return (
    <Host matchContents>
      <Surface>
        <Text modifiers={[paddingAll(16)]}>
          Content on a surface
        </Text>
      </Surface>
    </Host>
  );
}
```

### 带海拔的表面

使用 `tonalElevation` 和 `shadowElevation` 控制表面的视觉深度。

![两个上下堆叠的表面，下方那个投下的阴影比上方更大](/static/images/expo-ui/examples/surface-elevation-android-light.webp)

```tsx SurfaceElevationExample.tsx
import {
  Host,
  Surface,
  Column,
  Text,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function SurfaceElevationExample() {
  return (
    <Host matchContents>
      <Column
        verticalArrangement={{ spacedBy: 16 }}
        modifiers={[paddingAll(16)]}>
        <Surface tonalElevation={1} shadowElevation={2}>
          <Text modifiers={[paddingAll(16)]}>Low elevation</Text>
        </Surface>
        <Surface tonalElevation={4} shadowElevation={8}>
          <Text modifiers={[paddingAll(16)]}>High elevation</Text>
        </Surface>
      </Column>
    </Host>
  );
}
```

### 自定义颜色的表面

使用 `color` 和 `contentColor` 属性覆盖默认的 Material 主题颜色。

![深海军蓝表面面板，配白色文本](/static/images/expo-ui/examples/surface-colors-android-light.webp)

```tsx SurfaceCustomColorsExample.tsx
import { Host, Surface, Text } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function SurfaceCustomColorsExample() {
  return (
    <Host matchContents>
      <Surface
        color="#1E3A5F"
        contentColor="#FFFFFF"
        tonalElevation={2}>
        <Text color="#FFFFFF" modifiers={[paddingAll(16)]}>
          Custom colored surface
        </Text>
      </Surface>
    </Host>
  );
}
```

### 带形状和边框的表面

使用 `shape` 属性裁剪内容，使用 `border` 在表面周围绘制描边。

![圆角为 16dp、带两像素紫色边框的表面](/static/images/expo-ui/examples/surface-shape-android-light.webp)

```tsx SurfaceShapeBorderExample.tsx
import {
  Host,
  Surface,
  Shape,
  Text,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function SurfaceShapeBorderExample() {
  return (
    <Host matchContents>
      <Surface
        shape={Shape.RoundedCorner({
          cornerRadii: {
            topStart: 16,
            topEnd: 16,
            bottomStart: 16,
            bottomEnd: 16,
          },
        })}
        border={{ width: 2, color: '#6200EE' }}>
        <Text modifiers={[paddingAll(16)]}>
          Rounded surface with border
        </Text>
      </Surface>
    </Host>
  );
}
```

## API

```tsx
import { Surface } from '@expo/ui/jetpack-compose';
```
