---
title: Spacer 组件参考
description: 用于弹性间距的 SwiftUI Spacer 组件。
---

# Spacer 组件参考

> 支持平台：iOS、tvOS、Expo Go。

:::note
跨平台用法请参阅通用 [`Spacer`](/versions/latest/sdk/ui/universal/spacer)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Spacer 与官方 SwiftUI [Spacer API](https://developer.apple.com/documentation/swiftui/spacer) 保持一致，会展开以填满堆叠中的可用空间。

![HStack 前端是红色 A 方块，末端是蓝色 B 方块，中间用 Spacer 分开](/static/images/expo-ui/spacer/ios-light.webp)

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

### HStack 中的基本 Spacer

使用 Spacer 把内容推到水平堆叠的两端。

![同一行前端是单词 Left，末端是 Right](/static/images/expo-ui/examples/spacer-hstack-ios-light.webp)

```tsx SpacerHStackExample.tsx
import { Host, HStack, Text, Spacer } from '@expo/ui/swift-ui';

export default function SpacerHStackExample() {
  return (
    <Host style={{ flex: 1 }}>
      <HStack>
        <Text>Left</Text>
        <Spacer />
        <Text>Right</Text>
      </HStack>
    </Host>
  );
}
```

### VStack 中的基本 Spacer

使用 Spacer 把内容推到垂直堆叠的两端。

![同一列上沿是单词 Top，下沿是 Bottom](/static/images/expo-ui/examples/spacer-vstack-ios-light.webp)

```tsx SpacerVStackExample.tsx
import { Host, VStack, Text, Spacer } from '@expo/ui/swift-ui';

export default function SpacerVStackExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <Text>Top</Text>
        <Spacer />
        <Text>Bottom</Text>
      </VStack>
    </Host>
  );
}
```

## API

```tsx
import { Spacer } from '@expo/ui/swift-ui';
```
