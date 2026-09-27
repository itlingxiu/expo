---
title: Column 组件参考
description: 用于垂直放置子元素的 Jetpack Compose Column 组件。
---

# Column 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台用法请参阅通用 [`Column`](/versions/latest/sdk/ui/universal/column)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Column 与官方 Jetpack Compose [Column](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary#Column) API 保持一致，垂直放置子元素，并可配置排列与对齐方式。

![Column 内垂直堆叠的三个色块](/static/images/expo-ui/column/android-light.webp)

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

`Column` 垂直放置子元素。使用 `verticalArrangement` 和 `horizontalAlignment` 控制间距与对齐。

![三个标签 First、Second 和 Third 垂直堆叠并水平居中](/static/images/expo-ui/examples/column-basic-android-light.webp)

```tsx ColumnExample.tsx
import {
  Host,
  Column,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  paddingAll,
} from '@expo/ui/jetpack-compose/modifiers';

export default function ColumnExample() {
  const colors = useMaterialColors();

  return (
    <Host style={{ flex: 1 }}>
      <Column
        verticalArrangement={{ spacedBy: 8 }}
        horizontalAlignment="center"
        modifiers={[fillMaxWidth(), paddingAll(16)]}>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          First
        </Text>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Second
        </Text>
        <Text style={{ fontSize: 28 }} color={colors.onBackground}>
          Third
        </Text>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { Column } from '@expo/ui/jetpack-compose';
```
