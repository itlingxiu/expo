---
title: AccessoryWidgetBackground 组件参考
description: SwiftUI 自适应背景视图，会根据小组件所处环境提供标准外观。
---

# AccessoryWidgetBackground 组件参考

> 支持平台：iOS、Expo Go。

Expo UI 的 AccessoryWidgetBackground 与官方 SwiftUI [AccessoryWidgetBackground API](https://developer.apple.com/documentation/widgetkit/accessorywidgetbackground) 保持一致，用于创建自适应背景视图，并根据小组件所处环境提供标准外观。

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

### 基本配件小组件背景

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
