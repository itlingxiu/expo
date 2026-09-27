---
title: Badge 组件参考
description: 用于显示状态指示和计数的 Jetpack Compose Badge 组件。
---

# Badge 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 Badge 与官方 Jetpack Compose [`Badge`](https://developer.android.com/develop/ui/compose/components/badges) API 保持一致。它可以渲染为一个小型彩色指示圆点，也可以带内容（例如计数数字）。

![Material 3 徽章，在图标上显示计数和圆点指示](/static/images/expo-ui/badge/android-light.webp)

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

### 指示圆点

没有子元素的徽章会渲染为一个小圆点指示器。

![一个空屏幕上的小型红色 Material 3 徽章圆点](/static/images/expo-ui/examples/badge-dot-android-light.webp)

```tsx BadgeDot.tsx
import { Host, Badge } from '@expo/ui/jetpack-compose';

export default function BadgeDot() {
  return (
    <Host matchContents>
      <Badge />
    </Host>
  );
}
```

### 带计数的徽章

传入一个 `Text` 子元素即可显示数字或标签。

![一个红色圆形徽章，白色显示计数 3](/static/images/expo-ui/examples/badge-count-android-light.webp)

```tsx BadgeCount.tsx
import { Host, Badge, Text } from '@expo/ui/jetpack-compose';

export default function BadgeCount() {
  return (
    <Host matchContents>
      <Badge containerColor="#EF5350" contentColor="#FFFFFF">
        <Text>3</Text>
      </Badge>
    </Host>
  );
}
```

## API

```tsx
import { Badge } from '@expo/ui/jetpack-compose';
```
