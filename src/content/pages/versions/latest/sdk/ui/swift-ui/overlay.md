---
title: Overlay 组件参考
description: 用于在另一个视图上层叠内容的 SwiftUI Overlay 组件。
---

# Overlay 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 Overlay 与官方 SwiftUI [overlay](https://developer.apple.com/documentation/swiftui/view/overlay(alignment:content:)) 修改器保持一致，用于把次要内容层叠在视图之上，并按指定对齐方式定位。

![铃铛图标右上角叠着红色数字 3 的通知角标](/static/images/expo-ui/overlay/ios-light.webp)

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

![蓝色铃铛图标，右上角有显示 3 的红色圆形角标](/static/images/expo-ui/examples/overlay-basic-ios-light.webp)

```tsx OverlayExample.tsx
import { Host, Overlay, Text, Image } from '@expo/ui/swift-ui';
import {
  foregroundStyle,
  frame,
  font,
  background,
  clipShape,
  offset,
} from '@expo/ui/swift-ui/modifiers';

export default function OverlayExample() {
  return (
    <Host matchContents>
      <Overlay alignment="topTrailing">
        <Image
          systemName="bell.fill"
          modifiers={[
            font({ size: 28 }),
            foregroundStyle('#007AFF'),
          ]}
        />
        <Overlay.Content>
          <Text
            modifiers={[
              font({ size: 11, weight: 'bold' }),
              foregroundStyle('#FFFFFF'),
              frame({ width: 18, height: 18 }),
              background('#FF3B30'),
              clipShape('circle'),
              offset({ x: 8, y: -8 }),
            ]}>
            3
          </Text>
        </Overlay.Content>
      </Overlay>
    </Host>
  );
}
```

## API

```tsx
import { Overlay } from '@expo/ui/swift-ui';
```
