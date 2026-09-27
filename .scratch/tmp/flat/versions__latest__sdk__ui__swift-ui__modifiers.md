---
title: Modifiers 组件参考
description: SwiftUI view modifiers for customizing component appearance and behavior.
---

# Modifiers 组件参考

> 支持平台：iOS、tvOS、Expo Go。

SwiftUI view modifiers that allow you to customize the appearance and behavior of UI components.

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

Modifiers are applied to components using the `modifiers` prop with an array syntax. You can combine multiple modifiers to create complex styling and behavior.

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

> **info** You can also create custom modifiers that work with any Expo UI component. See the [Custom SwiftUI components](extending) guide for details.

## API

```tsx
import { background, cornerRadius, padding, shadow, foregroundColor, onTapGesture } from '@expo/ui/swift-ui/modifiers';
```
