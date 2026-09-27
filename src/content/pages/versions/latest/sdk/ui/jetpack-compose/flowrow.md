---
title: FlowRow 组件参考
description: 用于让子元素水平换行排列的 Jetpack Compose FlowRow 组件。
---

# FlowRow 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 FlowRow 与官方 Jetpack Compose [FlowRow](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary#FlowRow) API 保持一致，按水平流排列子元素，空间不足时换到下一行。

![六个辅助芯片标签换行显示在多行中](/static/images/expo-ui/flowrow/android-light.webp)

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

`FlowRow` 按水平流排列子元素，空间不足时换到下一行。

![六个标签在三行中流动，并在屏幕边缘换行](/static/images/expo-ui/examples/flowrow-basic-android-light.webp)

```tsx FlowRowExample.tsx
import {
  Host,
  FlowRow,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  border,
  padding,
  paddingAll,
} from '@expo/ui/jetpack-compose/modifiers';

export default function FlowRowExample() {
  const colors = useMaterialColors();
  const tags = [
    'React Native',
    'Expo',
    'Android',
    'Jetpack Compose',
    'Material 3',
    'Kotlin',
  ];

  return (
    <Host style={{ flex: 1 }}>
      <FlowRow
        horizontalArrangement={{ spacedBy: 8 }}
        verticalArrangement={{ spacedBy: 8 }}
        modifiers={[paddingAll(16)]}>
        {tags.map(tag => (
          <Text
            key={tag}
            style={{ fontSize: 28 }}
            color={colors.onBackground}
            modifiers={[
              border(1, colors.outline),
              padding(12, 6, 12, 6),
            ]}>
            {tag}
          </Text>
        ))}
      </FlowRow>
    </Host>
  );
}
```

## API

```tsx
import { FlowRow } from '@expo/ui/jetpack-compose';
```
