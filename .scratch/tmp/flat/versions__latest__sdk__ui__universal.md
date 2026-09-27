---
title: Universal 组件参考
description: Cross-platform components for building shared UIs across Android, iOS, and web with @expo/ui.
---

# Universal 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

The universal components in `@expo/ui` are a single-API layer over the platform-native UI toolkits. On Android, they delegate to [`@expo/ui/jetpack-compose`](/versions/latest/sdk/jetpack-compose). On iOS, they delegate to [`@expo/ui/swift-ui`](/versions/latest/sdk/swift-ui). On web, they're JS implementations using `react-dom` or `react-native-web` and are picked per component to suit the control.

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

Universal components must still be wrapped in a [`Host`](host), but you import everything, including `Host`, from the package root. The universal `Host` dispatches to the platform-native host on Android and iOS, so there's no need to reach for [`@expo/ui/swift-ui`](/versions/latest/sdk/swift-ui) or [`@expo/ui/jetpack-compose`](/versions/latest/sdk/jetpack-compose) directly.

**Android**

![A Hello world label above a filled Material 3 button](/static/images/expo-ui/examples/universal-index-basic-android-light.webp)

**iOS**

![A Hello world label above a filled button](/static/images/expo-ui/examples/universal-index-basic-ios-light.webp)

```tsx UniversalExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Column, Button, Text } from '@expo/ui';

export default function UniversalExample() {
  const colorScheme = useColorScheme();

  return (
    <Host style={{ flex: 1 }}>
      <Column spacing={12} alignment="center">
        <Text textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
          Hello, world!
        </Text>
        <Button label="Press me" onPress={() => alert('Pressed')} />
      </Column>
    </Host>
  );
}
```

## Available components

## When to use this versus `jetpack-compose`/`swift-ui`

- Reach for **universal** components when you want one component tree that runs unmodified on Android, iOS, and web. The platform-native look and feel is preserved on Android and iOS because the components delegate to Jetpack Compose/SwiftUI under the hood.
- Reach for **[`@expo/ui/jetpack-compose`](/versions/latest/sdk/jetpack-compose)** or **[`@expo/ui/swift-ui`](/versions/latest/sdk/swift-ui)** directly when you need platform-specific controls, modifiers, or behavior that the universal API doesn't surface.
