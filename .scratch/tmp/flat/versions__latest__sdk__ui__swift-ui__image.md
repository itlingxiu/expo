---
title: Image 组件参考
description: A SwiftUI Image component for displaying SF Symbols.
---

# Image 组件参考

> 支持平台：iOS、tvOS、Expo Go。

> **info** For cross-platform usage, see the universal [`Icon`](/versions/latest/sdk/ui/universal/icon) — it renders the appropriate native component per platform.

Expo UI Image displays SF Symbols using the SwiftUI [Image API](https://developer.apple.com/documentation/swiftui/image). SF Symbols are a library of configurable symbols provided by Apple.

![A row of colored SF Symbol images](/static/images/expo-ui/image/ios-light.webp)

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

### Basic SF Symbol

![A star SF Symbol rendered at its default size](/static/images/expo-ui/examples/image-basic-ios-light.webp)

```tsx BasicImageExample.tsx
import { Host, Image } from '@expo/ui/swift-ui';

export default function BasicImageExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Image systemName="star.fill" />
    </Host>
  );
}
```

### Custom SF Symbol

Use the `assetName` prop to display a custom SF Symbol imported into the app asset catalog as a symbol set.

```tsx CustomImageExample.tsx
import { Host, Image } from '@expo/ui/swift-ui';

export default function CustomImageExample() {
  return (
    <Host matchContents>
      <Image assetName="acme.mark" />
    </Host>
  );
}
```

### With size and color

![A red heart, an orange star, and a blue bell SF Symbol at increasing sizes](/static/images/expo-ui/examples/image-size-color-ios-light.webp)

```tsx ImageSizeColorExample.tsx
import { Host, HStack, Image } from '@expo/ui/swift-ui';

export default function ImageSizeColorExample() {
  return (
    <Host matchContents>
      <HStack spacing={16}>
        <Image systemName="heart.fill" size={24} color="red" />
        <Image systemName="star.fill" size={32} color="orange" />
        <Image systemName="bell.fill" size={40} color="blue" />
      </HStack>
    </Host>
  );
}
```

### With variable value

Some SF Symbols alter their appearance based on a variable value. Use the `variableValue` prop with a value between 0.0 and 1.0 to control the rendered symbol. Requires iOS 16.0+ and SF Symbols 4.0+.

![Three bar chart SF Symbols with variable values of 0.3, 0.6, and 1.0](/static/images/expo-ui/examples/image-variable-ios-light.webp)

```tsx ImageVariableExample.tsx
import { Host, HStack, Image } from '@expo/ui/swift-ui';

export default function ImageVariableExample() {
  return (
    <Host style={{ flex: 1 }}>
      <HStack spacing={16}>
        <Image
          systemName="chart.bar.fill"
          size={32}
          variableValue={0.3}
        />
        <Image
          systemName="chart.bar.fill"
          size={32}
          variableValue={0.6}
        />
        <Image
          systemName="chart.bar.fill"
          size={32}
          variableValue={1.0}
        />
      </HStack>
    </Host>
  );
}
```

### With symbol effect

Apply an SF Symbol effect to animate the symbol by passing a [`symbolEffect`](modifiers#symboleffecteffect-args) modifier from `@expo/ui/swift-ui/modifiers`. This effect runs continuously by default. You can also pass `value` for a discrete trigger that fires once per change, or `isActive` for a boolean toggle that runs the effect while `true`. Requires iOS 17.0 and later.

![A blue wifi SF Symbol shown during one frame of the variable color effect animation](/static/images/expo-ui/examples/image-symbol-effect-ios-light.webp)

```tsx ImageSymbolEffectExample.tsx
import { Host, Image } from '@expo/ui/swift-ui';
import { symbolEffect } from '@expo/ui/swift-ui/modifiers';

export default function ImageSymbolEffectExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Image
        systemName="wifi"
        size={48}
        color="blue"
        modifiers={[
          symbolEffect({
            effect: 'variableColor',
            fillStyle: 'iterative',
            playbackStyle: 'reversing',
          }),
        ]}
      />
    </Host>
  );
}
```

The following example uses `value` to play `bounce` on each button press. Write to `state.value` from a worklet (or via [`scheduleOnUI`](https://docs.swmansion.com/react-native-worklets/docs/threading/scheduleOnUI)) to trigger the effect.

![An orange bell SF Symbol above a Bounce button](/static/images/expo-ui/examples/image-symbol-effect-value-ios-light.webp)

```tsx ImageSymbolEffectValueExample.tsx
import {
  Button,
  Host,
  Image,
  useNativeState,
  VStack,
} from '@expo/ui/swift-ui';
import { symbolEffect } from '@expo/ui/swift-ui/modifiers';
import { scheduleOnUI } from 'react-native-worklets';

export default function ImageSymbolEffectValueExample() {
  const trigger = useNativeState(0);

  return (
    <Host matchContents>
      <VStack spacing={16}>
        <Image
          systemName="bell.fill"
          size={48}
          color="orange"
          modifiers={[
            symbolEffect(
              { effect: 'bounce', direction: 'up' },
              { value: trigger }
            ),
          ]}
        />
        <Button
          label="Bounce"
          onPress={() =>
            scheduleOnUI(() => {
              'worklet';
              trigger.value = trigger.value + 1;
            })
          }
        />
      </VStack>
    </Host>
  );
}
```

The following example uses `isActive` to toggle a continuous `breathe` animation.

![A cyan cloud SF Symbol above a Breathe toggle that is turned on](/static/images/expo-ui/examples/image-symbol-effect-isactive-ios-light.webp)

```tsx ImageSymbolEffectIsActiveExample.tsx
import {
  Host,
  Image,
  SyncToggle,
  useNativeState,
  VStack,
} from '@expo/ui/swift-ui';
import { symbolEffect } from '@expo/ui/swift-ui/modifiers';

export default function ImageSymbolEffectIsActiveExample() {
  const isActive = useNativeState(true);

  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={16}>
        <Image
          systemName="cloud.fill"
          size={48}
          color="cyan"
          modifiers={[
            symbolEffect({ effect: 'breathe' }, { isActive }),
          ]}
        />
        <SyncToggle label="Breathe" isOn={isActive} />
      </VStack>
    </Host>
  );
}
```

## API

```tsx
import { Image } from '@expo/ui/swift-ui';
```
