---
title: AccessoryWidgetBackground 组件参考
description: A SwiftUI adaptive background view that provides a standard appearance based on the widget's environment.
---

# AccessoryWidgetBackground 组件参考

> 支持平台：iOS、Expo Go。

Expo UI AccessoryWidgetBackground matches the official SwiftUI [AccessoryWidgetBackground API](https://developer.apple.com/documentation/widgetkit/accessorywidgetbackground) and creates an adaptive background view that provides a standard appearance based on the widget's environment.

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

### Basic accessory widget background

```tsx BasicAccessoryWidgetBackground.tsx
import {
  AccessoryWidgetBackground,
  VStack,
  Text,
  ZStack,
} from '@expo/ui/swift-ui';

export default function BasicAccessoryWidgetBackground() {
  return (
    <ZStack>
      <AccessoryWidgetBackground />
      <VStack>
        <Text>MON</Text>
      </VStack>
    </ZStack>
  );
}
```

## API

```tsx
import { AccessoryWidgetBackground } from '@expo/ui/swift-ui';
```
