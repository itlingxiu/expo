---
title: Modifiers 组件参考
description: 用于自定义组件外观和行为的 SwiftUI 视图修改器。
---

# Modifiers 组件参考

> 支持平台：iOS、tvOS、Expo Go。

这些 SwiftUI 视图修改器可用于自定义界面组件的外观和行为。

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

修改器通过 `modifiers` 属性以数组形式应用到组件上。可以组合多个修改器，以实现复杂的样式和行为。

```tsx
import { Text, Host, VStack } from '@expo/ui/swift-ui';
import {
  background,
  cornerRadius,
  padding,
  shadow,
  foregroundColor,
  onTapGesture,
} from '@expo/ui/swift-ui/modifiers';

function ModifiersExample() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={20}>

        <Text
          modifiers={[
            background('#FF6B6B'),
            cornerRadius(12),
            padding({ all: 16 }),
            foregroundColor('#FFFFFF'),
          ]}>
          Basic styled text
        </Text>

        <Text
          modifiers={[
            background('#4ECDC4'),
            cornerRadius(16),
            padding({ horizontal: 20, vertical: 12 }),
            shadow({ radius: 4, x: 0, y: 2, color: '#4ECDC440' }),
            onTapGesture(() => console.log('Tapped!')),
          ]}>
          Styled with shadow and tap gesture
        </Text>

        <Text
          modifiers={[
            background('#9B59B6'),
            cornerRadius(8),
            padding({ all: 14 }),
            ...(isEnabled
              ? [shadow({ radius: 6, y: 3 }), scaleEffect(1.02)]
              : [grayscale(0.5), opacity(0.7)]),
          ]}>
          Conditional styling
        </Text>
      </VStack>
    </Host>
  );
}
```

:::note
你也可以创建适用于任何 Expo UI 组件的自定义修改器。详见 [自定义 SwiftUI 组件](/versions/latest/sdk/ui/swift-ui/extending) 指南。
:::

## API

```tsx
import { background, cornerRadius, padding, shadow, foregroundColor, onTapGesture } from '@expo/ui/swift-ui/modifiers';
```
