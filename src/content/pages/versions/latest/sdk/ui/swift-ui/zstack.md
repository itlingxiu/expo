---
title: ZStack 组件参考
description: 用于重叠布局的 SwiftUI ZStack 组件。
---

# ZStack 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 ZStack 与官方 SwiftUI [ZStack API](https://developer.apple.com/documentation/swiftui/zstack) 保持一致，将子元素相互叠放。

![三个彩色圆角方块沿 Z 轴堆叠，并在 ZStack 中对角偏移](/static/images/expo-ui/zstack/ios-light.webp)

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

### 基本重叠堆叠

![蓝色方块上居中叠着白色单词 Overlay](/static/images/expo-ui/examples/zstack-basic-ios-light.webp)

```tsx BasicZStackExample.tsx
import { Host, ZStack, Rectangle, Text } from '@expo/ui/swift-ui';
import {
  frame,
  foregroundStyle,
} from '@expo/ui/swift-ui/modifiers';

export default function BasicZStackExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ZStack>
        <Rectangle
          modifiers={[
            frame({ width: 100, height: 100 }),
            foregroundStyle('blue'),
          ]}
        />
        <Text modifiers={[foregroundStyle('white')]}>Overlay</Text>
      </ZStack>
    </Host>
  );
}
```

### 对齐方式

`alignment` 属性控制子元素在堆叠中的位置。可用选项包括：`center`、`leading`、`trailing`、`top`、`bottom`、`topLeading`、`topTrailing`、`bottomLeading` 和 `bottomTrailing`。

![蓝色方块右下角有一个小红圆](/static/images/expo-ui/examples/zstack-alignment-ios-light.webp)

```tsx ZStackAlignmentExample.tsx
import { Host, ZStack, Rectangle, Circle } from '@expo/ui/swift-ui';
import {
  frame,
  foregroundStyle,
} from '@expo/ui/swift-ui/modifiers';

export default function ZStackAlignmentExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ZStack alignment="bottomTrailing">
        <Rectangle
          modifiers={[
            frame({ width: 100, height: 100 }),
            foregroundStyle('blue'),
          ]}
        />
        <Circle
          modifiers={[
            frame({ width: 30, height: 30 }),
            foregroundStyle('red'),
          ]}
        />
      </ZStack>
    </Host>
  );
}
```

### 创建角标叠加

![蓝色铃铛图标右上角有一个小红点](/static/images/expo-ui/examples/zstack-badge-ios-light.webp)

```tsx ZStackBadgeExample.tsx
import {
  Host,
  ZStack,
  Circle,
  Text,
  Image,
} from '@expo/ui/swift-ui';
import {
  frame,
  foregroundStyle,
} from '@expo/ui/swift-ui/modifiers';

export default function ZStackBadgeExample() {
  return (
    <Host matchContents>
      <ZStack alignment="topTrailing">
        <Image systemName="bell.fill" size={32} color="blue" />
        <Circle
          modifiers={[
            frame({ width: 16, height: 16 }),
            foregroundStyle('red'),
          ]}
        />
      </ZStack>
    </Host>
  );
}
```

## API

```tsx
import { ZStack } from '@expo/ui/swift-ui';
```
