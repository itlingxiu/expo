---
title: Divider 组件参考
description: 用于创建视觉分隔线的 Jetpack Compose Divider 组件。
---

# Divider 组件参考

> 支持平台：Android、Expo Go。

Expo UI 提供 [`HorizontalDivider`](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#HorizontalDivider(androidx.compose.ui.Modifier,androidx.compose.ui.unit.Dp,androidx.compose.ui.graphics.Color)) 和 [`VerticalDivider`](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#VerticalDivider(androidx.compose.ui.Modifier,androidx.compose.ui.unit.Dp,androidx.compose.ui.graphics.Color))，与官方 Jetpack Compose Divider API 保持一致。

![三段文本被水平 Material 3 分隔线分开](/static/images/expo-ui/divider/android-light.webp)

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

### 水平分隔线

一条细水平线，用于在列表和布局中从视觉上分隔内容。

![一条全宽线把标签 First section 和 Second section 分开](/static/images/expo-ui/examples/divider-horizontal-android-light.webp)

```tsx HorizontalDividerExample.tsx
import {
  Host,
  HorizontalDivider,
  Column,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';

export default function HorizontalDividerExample() {
  const colors = useMaterialColors();

  return (
    <Host style={{ flex: 1 }}>
      <Column>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          First section
        </Text>
        <HorizontalDivider />
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Second section
        </Text>
      </Column>
    </Host>
  );
}
```

### 自定义粗细和颜色

`HorizontalDivider` 和 `VerticalDivider` 都接受 `thickness` 和 `color` 属性。使用 `StyleSheet.hairlineWidth` 得到单像素线，或设置自定义粗细和颜色。

![一条淡发丝分隔线位于一条粗粉色分隔线上方，各自隔开一个标签](/static/images/expo-ui/examples/divider-custom-android-light.webp)

```tsx CustomDividerExample.tsx
import {
  Host,
  HorizontalDivider,
  Column,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { StyleSheet } from 'react-native';

export default function CustomDividerExample() {
  const colors = useMaterialColors();

  return (
    <Host style={{ flex: 1 }}>
      <Column>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Hairline divider (1 pixel)
        </Text>
        <HorizontalDivider thickness={StyleSheet.hairlineWidth} />
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Thick colored divider
        </Text>
        <HorizontalDivider thickness={4} color="#E91E63" />
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Below
        </Text>
      </Column>
    </Host>
  );
}
```

### 垂直分隔线

一条垂直线，用于在行布局中左右分隔项目。

![一条短垂直线把标签 Left 和 Right 分开](/static/images/expo-ui/examples/divider-vertical-android-light.webp)

```tsx VerticalDividerExample.tsx
import {
  Host,
  VerticalDivider,
  Row,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { height } from '@expo/ui/jetpack-compose/modifiers';

export default function VerticalDividerExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Row
        verticalAlignment="center"
        horizontalArrangement={{ spacedBy: 16 }}
        modifiers={[height(48)]}>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Left
        </Text>
        <VerticalDivider />
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Right
        </Text>
      </Row>
    </Host>
  );
}
```

## API

```tsx
import {
  HorizontalDivider,
  VerticalDivider,
} from '@expo/ui/jetpack-compose';
```
