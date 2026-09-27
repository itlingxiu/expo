---
title: Row 组件参考
description: 用于水平放置子元素的 Jetpack Compose Row 组件。
---

# Row 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台用法请参阅通用 [`Row`](/versions/latest/sdk/ui/universal/row)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Row 与官方 Jetpack Compose [Row](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary#Row) API 保持一致，水平放置子元素，并可配置排列与对齐方式。

![Row 内水平排列的三个色块](/static/images/expo-ui/row/android-light.webp)

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

`Row` 水平放置子元素。使用 `horizontalArrangement` 和 `verticalAlignment` 控制间距与对齐。

![三个标签在一行宽度内均匀分布](/static/images/expo-ui/examples/row-basic-android-light.webp)

```tsx RowExample.tsx
import {
  Host,
  Row,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  height,
} from '@expo/ui/jetpack-compose/modifiers';

export default function RowExample() {
  const colors = useMaterialColors();

  return (
    <Host style={{ flex: 1 }}>
      <Row
        horizontalArrangement="spaceEvenly"
        verticalAlignment="center"
        modifiers={[fillMaxWidth(), height(60)]}>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Item 1
        </Text>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Item 2
        </Text>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Item 3
        </Text>
      </Row>
    </Host>
  );
}
```

## API

```tsx
import { Row } from '@expo/ui/jetpack-compose';
```
