---
title: Link 组件参考
description: 用于显示可点击链接的 SwiftUI Link 组件。
---

# Link 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 Link 与官方 SwiftUI [Link API](https://developer.apple.com/documentation/swiftui/link) 保持一致。

![三行 Link，用于打开外部 URL](/static/images/expo-ui/link/ios-light.webp)

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

### 基本链接

![蓝色的 Visit Expo 文本链接](/static/images/expo-ui/examples/link-basic-ios-light.webp)

```tsx BasicLinkExample.tsx
import { Host, Link } from '@expo/ui/swift-ui';

export default function BasicLinkExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Link label="Visit Expo" destination="https://expo.dev" />
    </Host>
  );
}
```

### 自定义标签内容

可以把自定义组件作为 `children` 传入，以组成更复杂的链接标签内容。

![链接 SF Symbol 位于文本 Expo 上方，两者都着蓝色](/static/images/expo-ui/examples/link-custom-content-ios-light.webp)

```tsx CustomContentExample.tsx
import { Host, Link, VStack, Image, Text } from '@expo/ui/swift-ui';

export default function CustomContentExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Link destination="https://expo.dev">
        <VStack spacing={4}>
          <Image systemName="link" />
          <Text>Expo</Text>
        </VStack>
      </Link>
    </Host>
  );
}
```

## API

```tsx
import { Link } from '@expo/ui/swift-ui';
```
