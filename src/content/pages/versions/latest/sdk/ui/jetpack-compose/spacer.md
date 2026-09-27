---
title: Spacer 组件参考
description: 用于在元素之间添加弹性空间的 Jetpack Compose Spacer 组件。
---

# Spacer 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台用法请参阅通用 [`Spacer`](/versions/latest/sdk/ui/universal/spacer)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Spacer 与官方 Jetpack Compose [Spacer](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary#Spacer) API 保持一致，用于在布局中的元素之间添加弹性或固定尺寸的空间。

![两个方块被带 weight 修改器的 Spacer 推到 Row 的两端](/static/images/expo-ui/spacer/android-light.webp)

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

### 带权重的 Spacer

使用 `weight()` 修改器，让 Spacer 在 `Row` 或 `Column` 中按比例填满可用空间。

![标签 Left 和 Right 被带权重的 Spacer 推到一行的两端](/static/images/expo-ui/examples/spacer-weight-android-light.webp)

```tsx SpacerWeightExample.tsx
import {
  Host,
  Row,
  Spacer,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';

export default function SpacerWeightExample() {
  const colors = useMaterialColors();

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Row modifiers={[fillMaxWidth()]}>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Left
        </Text>
        <Spacer modifiers={[weight(1)]} />
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Right
        </Text>
      </Row>
    </Host>
  );
}
```

### 固定尺寸的 Spacer

使用 `height` 或 `width` 修改器创建固定尺寸的 Spacer。

![两个上下堆叠的标签之间有固定的 24dp 垂直间距](/static/images/expo-ui/examples/spacer-fixed-android-light.webp)

```tsx SpacerFixedSizeExample.tsx
import {
  Host,
  Column,
  Spacer,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { height } from '@expo/ui/jetpack-compose/modifiers';

export default function SpacerFixedSizeExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Column>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Above
        </Text>
        <Spacer modifiers={[height(24)]} />
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Below (24dp gap)
        </Text>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { Spacer } from '@expo/ui/jetpack-compose';
```
