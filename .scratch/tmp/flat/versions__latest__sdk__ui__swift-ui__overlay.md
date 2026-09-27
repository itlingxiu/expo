---
title: Overlay 组件参考
description: A SwiftUI Overlay component for layering content on top of another view.
---

# Overlay 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI Overlay matches the official SwiftUI [overlay](<https://developer.apple.com/documentation/swiftui/view/overlay(alignment:content:)>) modifier and provides a way to layer secondary content on top of a view, positioned with a specified alignment.

![A bell icon with a red 3 notification badge overlaid at the top-trailing corner](/static/images/expo-ui/overlay/ios-light.webp)

## Installation

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

## Usage

![A blue bell icon with a red circular badge showing 3 at its top-trailing corner](/static/images/expo-ui/examples/overlay-basic-ios-light.webp)

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
