---
title: Host 组件参考
description: 让 SwiftUI 组件能够在 React Native 中使用的 Host 组件。
---

# Host 组件参考

> 支持平台：iOS、tvOS、Expo Go。

:::note
跨平台用法请参阅通用 [`Host`](/versions/latest/sdk/ui/universal/host)——它会按平台渲染对应的原生组件。
:::

该组件让你可以把其他 `@expo/ui/swift-ui` 组件放进 React Native。它的作用类似于 DOM 中的 [`<svg>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/svg)，以及 [`react-native-skia`](https://shopify.github.io/react-native-skia) 中的 [`<Canvas>`](https://shopify.github.io/react-native-skia/docs/canvas/overview)。内部使用 [`UIHostingController`](https://developer.apple.com/documentation/swiftui/uihostingcontroller) 在 UIKit 中渲染 SwiftUI 视图。

由于 `Host` 组件是 React Native 的 [`View`](https://reactnative.dev/docs/view)，你可以向它传入 [`style`](https://reactnative.dev/docs/style) 属性，或使用 `matchContents` 属性让 `Host` 匹配内容尺寸。

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

### 匹配内容尺寸

使用 `matchContents` 让 `Host` 自动调整自身大小以适配 SwiftUI 内容，而不必指定明确尺寸。

:::note
`matchContents` 只对具有固有尺寸或显式 [`frame`](/versions/latest/sdk/ui/swift-ui/modifiers) 的组件正确工作（例如 `Button`、`Toggle`、`Text`）。`Slider` 和线性 `ProgressView` 这类弹性宽度组件会扩展以填满可用空间，没有固有宽度，对它们使用 `matchContents` 会导致宽度接近零。对这些组件，要么在组件上应用 [`frame`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符以给出明确宽度，要么改用 `Host` 上的 `style` 做显式尺寸（例如 `style={{ flex: 1 }}` 或 `style={{ width: 300 }}`）。
:::

```tsx MatchContentsExample.tsx
import { Button, Host } from '@expo/ui/swift-ui';

export default function MatchContentsExample() {
  return (
    <Host matchContents>
      <Button
        onPress={() => {
          console.log('Pressed');
        }}
        label="Click"
      />
    </Host>
  );
}
```

:::note
不要在与滚动容器（`ScrollView`、`List`、`Form`、`LazyHStack`、`LazyVStack`）相同的轴上使用 `matchContents`。`matchContents` 会解析为 SwiftUI 的 `.fixedSize`，从而把滚动容器尺寸设为内容大小。视口之外也不会留下可滚入的内容，因此滚动会静默停止工作。请把 `matchContents={{ vertical: true }}` 与 `style={{ width: '100%' }}`（或滚动轴上的任何有限宽度）一起使用。
:::

```tsx ScrollViewMatchContents.tsx
import { Host, HStack, ScrollView, Text } from '@expo/ui/swift-ui';

export default function ScrollViewMatchContents() {
  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <ScrollView axes="horizontal">
        <HStack spacing={12}>
          {Array.from({ length: 20 }).map((_, i) => (
            <Text key={i}>Item {i}</Text>
          ))}
        </HStack>
      </ScrollView>
    </Host>
  );
}
```

### 使用样式指定明确尺寸

使用 `style` 为 `Host` 设置明确尺寸，例如用 `flex: 1` 填满可用空间。

```tsx ExplicitSizingExample.tsx
import { Button, Host, VStack, Text } from '@expo/ui/swift-ui';

export default function ExplicitSizingExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={8}>
        <Text>Hello, world!</Text>
        <Button
          onPress={() => {
            console.log('Pressed');
          }}
          label="Click"
        />
      </VStack>
    </Host>
  );
}
```

### 把组件放进 React Native 视图

`Host` 用 SwiftUI 渲染其子节点。`Host` 内部的 React Native 视图（如 `View` 或 `ScrollView`）会切回 React Native 渲染。要在该视图内使用 SwiftUI 组件，请把组件包在新的 `Host` 中。即使树中更高处已有 `Host` 包裹该视图，也要这样做。

```tsx ReactNativeLayoutExample.tsx
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Host, Toggle } from '@expo/ui/swift-ui';

export default function ReactNativeLayoutExample() {
  const [isOn, setIsOn] = useState(false);

  return (
    <ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
        }}>
        <Text>Notifications</Text>
        <Host matchContents>
          <Toggle isOn={isOn} onIsOnChange={setIsOn} />
        </Host>
      </View>
    </ScrollView>
  );
}
```

要把 React Native 视图放进 SwiftUI 组件，请使用 [`RNHostView`](/versions/latest/sdk/ui/swift-ui/rnhostview)。

### 忽略键盘安全区

当 React Native 已经处理键盘避让（例如使用 `react-native-keyboard-controller`）时，使用 `ignoreSafeArea="keyboard"`，以免 SwiftUI 宿主再应用自己的键盘内边距。

```tsx IgnoreKeyboardExample.tsx
import { Host, TextField } from '@expo/ui/swift-ui';
import {
  KeyboardProvider,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { View } from 'react-native';

export default function IgnoreKeyboardExample() {
  return (
    <KeyboardProvider>
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <KeyboardStickyView
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            backgroundColor: 'green',
          }}>
          <Host
            matchContents
            ignoreSafeArea="keyboard"
            style={{ backgroundColor: 'red' }}>
            <TextField placeholder="Enter text" axis="vertical" />
          </Host>
        </KeyboardStickyView>
      </View>
    </KeyboardProvider>
  );
}
```

### 忽略容器安全区

使用 `ignoreSafeArea="container"` 只移除容器安全区（刘海、主屏幕指示条、状态栏和导航栏）。键盘安全区仍然生效。

```tsx IgnoreContainerSafeAreaExample.tsx
import { Button, Host, HStack, Spacer } from '@expo/ui/swift-ui';
import { labelStyle } from '@expo/ui/swift-ui/modifiers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function IgnoreContainerSafeAreaExample() {
  const insets = useSafeAreaInsets();
  return (
    <Host
      style={{ width: '100%', paddingTop: insets.top }}
      matchContents={{ vertical: true }}
      ignoreSafeArea="container">
      <HStack>
        <Button
          systemImage="chevron.backward"
          label="Back"
          modifiers={[labelStyle('iconOnly')]}
        />
        <Spacer />
        <Button
          systemImage="square.and.arrow.up"
          label="Share"
          modifiers={[labelStyle('iconOnly')]}
        />
      </HStack>
    </Host>
  );
}
```

### 忽略全部安全区

希望 SwiftUI 内容延伸到状态栏和键盘后面时，使用 `ignoreSafeArea="all"`，适用于全屏浮层或背景。

```tsx IgnoreAllSafeAreasExample.tsx
import { Host, Text, VStack } from '@expo/ui/swift-ui';

export default function IgnoreAllSafeAreasExample() {
  return (
    <Host
      ignoreSafeArea="all"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
      <VStack>
        <Text>
          This content extends behind the status bar and home
          indicator.
        </Text>
      </VStack>
    </Host>
  );
}
```

## API

```tsx
import { Host } from '@expo/ui/swift-ui';
```
