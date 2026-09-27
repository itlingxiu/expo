---
title: Image 组件参考
description: 用于显示 SF Symbol 的 SwiftUI Image 组件。
---

# Image 组件参考

> 支持平台：iOS、tvOS、Expo Go。

:::note
跨平台用法请参阅通用 [`Icon`](/versions/latest/sdk/ui/universal/icon)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Image 使用 SwiftUI [Image API](https://developer.apple.com/documentation/swiftui/image) 显示 SF Symbol。SF Symbol 是 Apple 提供的可配置符号库。

![一排彩色 SF Symbol 图像](/static/images/expo-ui/image/ios-light.webp)

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

### 基本 SF Symbol

![以默认尺寸渲染的星星 SF Symbol](/static/images/expo-ui/examples/image-basic-ios-light.webp)

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

### 自定义 SF Symbol

使用 `assetName` 属性显示导入到应用资源目录中、作为符号集的自定义 SF Symbol。

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

### 指定尺寸和颜色

![红色心形、橙色星星和蓝色铃铛 SF Symbol，尺寸依次增大](/static/images/expo-ui/examples/image-size-color-ios-light.webp)

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

### 可变值

部分 SF Symbol 会根据可变值改变外观。使用 `variableValue` 属性，传入 0.0 到 1.0 之间的值来控制渲染的符号。需要 iOS 16.0+ 和 SF Symbols 4.0+。

![三个柱状图 SF Symbol，可变值分别为 0.3、0.6 和 1.0](/static/images/expo-ui/examples/image-variable-ios-light.webp)

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

### 符号效果

传入 `@expo/ui/swift-ui/modifiers` 中的 [`symbolEffect`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符，即可为 SF Symbol 应用动画效果。该效果默认持续运行。也可以传入 `value` 作为离散触发器，每次变化播放一次；或传入 `isActive` 作为布尔开关，为 `true` 时运行效果。需要 iOS 17.0 及更高版本。

![蓝色 Wi-Fi SF Symbol，处于可变颜色效果动画的某一帧](/static/images/expo-ui/examples/image-symbol-effect-ios-light.webp)

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

下面的示例使用 `value`，在每次按下按钮时播放 `bounce`。从 worklet 写入 `state.value`（或通过 [`scheduleOnUI`](https://docs.swmansion.com/react-native-worklets/docs/threading/scheduleOnUI)）以触发效果。

![橙色铃铛 SF Symbol，下方是 Bounce 按钮](/static/images/expo-ui/examples/image-symbol-effect-value-ios-light.webp)

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

下面的示例使用 `isActive` 切换持续的 `breathe` 动画。

![青色云朵 SF Symbol，下方是已打开的 Breathe 开关](/static/images/expo-ui/examples/image-symbol-effect-isactive-ios-light.webp)

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
