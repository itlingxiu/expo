---
title: Card 组件参考
description: 用于在样式化容器中显示内容的 Jetpack Compose Card 组件。
---

# Card 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 Card 与官方 Jetpack Compose [Card API](https://developer.android.com/develop/ui/compose/components/card) 保持一致，在带可选海拔和轮廓的样式化表面容器中显示内容。`Card` 组件渲染[填充卡片](https://developer.android.com/develop/ui/compose/components/card#filled)，`ElevatedCard` 和 `OutlinedCard` 分别提供抬升和带边框的变体。

![填充、抬升和轮廓 Material 3 卡片](/static/images/expo-ui/card/android-light.webp)

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

### 基本卡片

![填充式 Material 3 卡片，里面是一行带内边距的文本](/static/images/expo-ui/examples/card-basic-android-light.webp)

```tsx BasicCardExample.tsx
import { Host, Card, Text } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function BasicCardExample() {
  return (
    <Host matchContents>
      <Card>
        <Text modifiers={[paddingAll(16)]}>
          This is a basic card with default styling.
        </Text>
      </Card>
    </Host>
  );
}
```

### 卡片类型

使用 `Card`（填充）、`ElevatedCard` 或 `OutlinedCard` 获得不同样式。

![在列中堆叠的填充、抬升和轮廓卡片](/static/images/expo-ui/examples/card-types-android-light.webp)

```tsx CardTypesExample.tsx
import {
  Host,
  Card,
  ElevatedCard,
  OutlinedCard,
  Text,
  Column,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function CardTypesExample() {
  return (
    <Host matchContents>
      <Column verticalArrangement={{ spacedBy: 12 }}>
        <Card>
          <Text modifiers={[paddingAll(16)]}>Filled card</Text>
        </Card>
        <ElevatedCard>
          <Text modifiers={[paddingAll(16)]}>Elevated card</Text>
        </ElevatedCard>
        <OutlinedCard>
          <Text modifiers={[paddingAll(16)]}>Outlined card</Text>
        </OutlinedCard>
      </Column>
    </Host>
  );
}
```

### 自定义海拔

使用 `elevation` 属性（单位 dp）控制阴影深度。海拔在 `ElevatedCard` 上最有意义，因为它使用阴影海拔。填充式 `Card` 默认使用色调海拔，因此变化可能比较细微。

![海拔为 8dp、投下阴影的抬升卡片](/static/images/expo-ui/examples/card-elevated-android-light.webp)

```tsx ElevatedCardExample.tsx
import { Host, ElevatedCard, Text } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function ElevatedCardExample() {
  return (
    <Host matchContents>
      <ElevatedCard elevation={8}>
        <Text modifiers={[paddingAll(16)]}>
          Card with 8dp elevation
        </Text>
      </ElevatedCard>
    </Host>
  );
}
```

### 自定义边框

`Card` 和 `OutlinedCard` 接受 `border` 属性，用于自定义描边宽度和颜色。

![带 2dp 紫色边框的轮廓卡片](/static/images/expo-ui/examples/card-outlined-android-light.webp)

```tsx OutlinedCardExample.tsx
import { Host, OutlinedCard, Text } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function OutlinedCardExample() {
  return (
    <Host matchContents>
      <OutlinedCard border={{ width: 2, color: '#6200EE' }}>
        <Text modifiers={[paddingAll(16)]}>
          Card with custom purple border
        </Text>
      </OutlinedCard>
    </Host>
  );
}
```

## API

```tsx
import {
  Card,
  ElevatedCard,
  OutlinedCard,
} from '@expo/ui/jetpack-compose';
```
