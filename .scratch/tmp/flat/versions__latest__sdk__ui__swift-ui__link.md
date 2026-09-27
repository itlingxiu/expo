---
title: Link 组件参考
description: A SwiftUI Link component for displaying clickable links.
---

# Link 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI Link matches the official SwiftUI [Link API](https://developer.apple.com/documentation/swiftui/link).

![Three Link rows opening external URLs](/static/images/expo-ui/link/ios-light.webp)

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

### Basic link

![A blue Visit Expo text link](/static/images/expo-ui/examples/link-basic-ios-light.webp)

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

### Custom label content

You can pass custom components as `children` for more complex link label content.

![A link SF Symbol above the text Expo, both tinted blue](/static/images/expo-ui/examples/link-custom-content-ios-light.webp)

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
