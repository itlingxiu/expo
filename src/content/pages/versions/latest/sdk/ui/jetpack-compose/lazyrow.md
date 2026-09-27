---
title: LazyRow 组件参考
description: 用于显示水平滚动列表的 Jetpack Compose LazyRow 组件。
---

# LazyRow 组件参考

> 支持平台：Android、Expo Go。

惰性加载的水平列表组件，只渲染可见项，以便高效滚动。更多信息请参阅 [Jetpack Compose 官方文档](https://developer.android.com/develop/ui/compose/lists)。

:::note
`LazyRow` 目前还不是真正的惰性：原生侧只组合可见项，但 React 仍会预先创建每一个子节点，因此大型列表挂载可能较慢。我们正在改进这一点。大型列表建议使用 [FlashList](https://shopify.github.io/flash-list) 或 [Legend List](https://github.com/LegendApp/legend-list)。
:::

![LazyRow 在水平滚动列表中渲染彩色分类卡片](/static/images/expo-ui/lazyrow/android-light.webp)

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

### 基本惰性行

![描边项排成水平行，向屏幕右边缘外滚动](/static/images/expo-ui/examples/lazyrow-basic-android-light.webp)

```tsx BasicLazyRow.tsx
import {
  Host,
  LazyRow,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  border,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';

const items = Array.from(
  { length: 100 },
  (_, i) => `Item ${i + 1}`
);

export default function BasicLazyRow() {
  const colors = useMaterialColors();

  return (
    <Host style={{ height: 100 }}>
      <LazyRow>
        {items.map(item => (
          <Text
            key={item}
            style={{ fontSize: 28 }}
            color={colors.onBackground}
            modifiers={[
              border(1, colors.outline),
              padding(12, 6, 12, 6),
            ]}>
            {item}
          </Text>
        ))}
      </LazyRow>
    </Host>
  );
}
```

### 排列方式

使用 `horizontalArrangement` 属性控制列表中各项的间距。可传入 `'spaceBetween'` 这类字符串，或 `{ spacedBy: 8 }` 这类对象以使用固定的 dp 间距。

![描边行项之间有 16 密度独立像素的间隙](/static/images/expo-ui/examples/lazyrow-arrangement-android-light.webp)

```tsx LazyRowArrangement.tsx
import {
  Host,
  LazyRow,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  border,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';

export default function LazyRowArrangement() {
  const colors = useMaterialColors();

  return (
    <Host style={{ height: 100 }}>
      <LazyRow
        horizontalArrangement={{ spacedBy: 16 }}
        verticalAlignment="center">
        <Text
          style={{ fontSize: 28 }}
          color={colors.onBackground}
          modifiers={[
            border(1, colors.outline),
            padding(12, 6, 12, 6),
          ]}>
          Spaced item 1
        </Text>
        <Text
          style={{ fontSize: 28 }}
          color={colors.onBackground}
          modifiers={[
            border(1, colors.outline),
            padding(12, 6, 12, 6),
          ]}>
          Spaced item 2
        </Text>
        <Text
          style={{ fontSize: 28 }}
          color={colors.onBackground}
          modifiers={[
            border(1, colors.outline),
            padding(12, 6, 12, 6),
          ]}>
          Spaced item 3
        </Text>
      </LazyRow>
    </Host>
  );
}
```

### 内容内边距

使用 `contentPadding` 属性为列表内容添加以 dp 为单位的内边距。

![描边行项因内容内边距而从列表起始处向内缩进](/static/images/expo-ui/examples/lazyrow-padding-android-light.webp)

```tsx LazyRowPadding.tsx
import {
  Host,
  LazyRow,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  border,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';

export default function LazyRowPadding() {
  const colors = useMaterialColors();

  return (
    <Host style={{ height: 100 }}>
      <LazyRow
        contentPadding={{ start: 16, top: 8, end: 16, bottom: 8 }}>
        <Text
          style={{ fontSize: 28 }}
          color={colors.onBackground}
          modifiers={[
            border(1, colors.outline),
            padding(12, 6, 12, 6),
          ]}>
          Padded item 1
        </Text>
        <Text
          style={{ fontSize: 28 }}
          color={colors.onBackground}
          modifiers={[
            border(1, colors.outline),
            padding(12, 6, 12, 6),
          ]}>
          Padded item 2
        </Text>
        <Text
          style={{ fontSize: 28 }}
          color={colors.onBackground}
          modifiers={[
            border(1, colors.outline),
            padding(12, 6, 12, 6),
          ]}>
          Padded item 3
        </Text>
      </LazyRow>
    </Host>
  );
}
```

## API

```tsx
import { LazyRow } from '@expo/ui/jetpack-compose';
```
