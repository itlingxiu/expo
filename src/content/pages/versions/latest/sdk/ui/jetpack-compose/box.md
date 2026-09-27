---
title: Box 组件参考
description: 用于堆叠子元素的 Jetpack Compose Box 组件。
---

# Box 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 Box 与官方 Jetpack Compose [Box](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary#Box) API 保持一致，可将子元素相互堆叠，并配置内容对齐方式。

![文本内容居中的 Material 3 Box](/static/images/expo-ui/box/android-light.webp)

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

`Box` 将子元素相互堆叠。使用 `contentAlignment` 在盒子内定位它们。

![200×200 的浅灰色方块，中间是文本 Centered in Box](/static/images/expo-ui/examples/box-basic-android-light.webp)

```tsx BoxExample.tsx
import { Host, Box, Text } from '@expo/ui/jetpack-compose';
import {
  size,
  background,
} from '@expo/ui/jetpack-compose/modifiers';

export default function BoxExample() {
  return (
    <Host matchContents>
      <Box
        contentAlignment="center"
        modifiers={[size(200, 200), background('#E0E0E0')]}>
        <Text>Centered in Box</Text>
      </Box>
    </Host>
  );
}
```

## API

```tsx
import { Box } from '@expo/ui/jetpack-compose';
```
