---
title: ScrollView 组件参考
description: 用于可滚动内容的 SwiftUI ScrollView 组件。
---

# ScrollView 组件参考

> 支持平台：iOS、tvOS、Expo Go。

:::note
跨平台用法请参阅通用 [`ScrollView`](/versions/latest/sdk/ui/universal/scrollview)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 ScrollView 与官方 SwiftUI [ScrollView API](https://developer.apple.com/documentation/swiftui/scrollview) 保持一致，为其子节点提供可滚动容器。

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

### 基本垂直滚动视图

简单的垂直可滚动文本项列表。

![垂直滚动视图列出第 1 到第 29 项。](/static/images/expo-ui/examples/scrollview-vertical-ios-light.webp)

```tsx ScrollViewVerticalExample.tsx
import { Host, ScrollView, VStack, Text } from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';

export default function ScrollViewVerticalExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView>
        <VStack spacing={8}>
          {Array.from({ length: 30 }, (_, i) => (
            <Text key={i} modifiers={[padding({ horizontal: 16 })]}>
              {`Item ${i + 1}`}
            </Text>
          ))}
        </VStack>
      </ScrollView>
    </Host>
  );
}
```

### 水平滚动视图

使用 `axes` 属性进行水平滚动。

![一行圆角方块，颜色从红经橙过渡到黄。](/static/images/expo-ui/examples/scrollview-horizontal-ios-light.webp)

```tsx ScrollViewHorizontalExample.tsx
import {
  Host,
  ScrollView,
  HStack,
  RoundedRectangle,
} from '@expo/ui/swift-ui';
import {
  frame,
  foregroundStyle,
} from '@expo/ui/swift-ui/modifiers';

export default function ScrollViewHorizontalExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView axes="horizontal">
        <HStack spacing={8}>
          {Array.from({ length: 20 }, (_, i) => (
            <RoundedRectangle
              key={i}
              cornerRadius={12}
              modifiers={[
                frame({ width: 100, height: 100 }),
                foregroundStyle(`hsl(${i * 18}, 70%, 50%)`),
              ]}
            />
          ))}
        </HStack>
      </ScrollView>
    </Host>
  );
}
```

### 隐藏滚动指示器

将 `showsIndicators` 设为 `false` 以隐藏滚动条。

![编号项的垂直列表，右边缘没有滚动指示器](/static/images/expo-ui/examples/scrollview-hidden-indicators-ios-light.webp)

```tsx ScrollViewHiddenIndicatorsExample.tsx
import { Host, ScrollView, VStack, Text } from '@expo/ui/swift-ui';

export default function ScrollViewHiddenIndicatorsExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView showsIndicators={false}>
        <VStack spacing={8}>
          {Array.from({ length: 30 }, (_, i) => (
            <Text key={i}>{`Item ${i + 1}`}</Text>
          ))}
        </VStack>
      </ScrollView>
    </Host>
  );
}
```

### 共享滚动位置

:::note
需要 iOS 17 或更高版本。在更早的版本上，该修饰符不产生效果。
:::

从 JavaScript 跟踪前导滚动目标 id，并通过写入状态滚动到目标。用 `id` 修饰符标记每个滚动目标，用 `scrollTargetLayout` 包裹内容容器，并对 `ScrollView` 应用 `scrollPosition` 修饰符。可选的 `onChange` 回调在前导目标变化时于 JS 线程触发。

`scrollPosition` 修饰符也适用于 `LazyVStack` 和 `LazyHStack` 等其他可滚动容器。

:::warning
对 `state.value` 的写入必须在 UI 运行时执行。用 `react-native-worklets` 的 `scheduleOnUI` 包裹写入，或在 `'worklet'` 函数内部调用。从 JS 运行时写入会触发 Main Thread Checker，这是 Xcode 的运行时工具，用于标记从后台线程发起的 UIKit 调用。
:::

![可滚动项目列表，下方按钮标签为 Scroll to item 10 from worklet。](/static/images/expo-ui/examples/scrollview-shared-position-ios-light.webp)

```tsx ScrollViewSharedPositionExample.tsx
import {
  Button,
  Host,
  ScrollView,
  Text,
  VStack,
  useNativeState,
} from '@expo/ui/swift-ui';
import {
  id,
  padding,
  scrollPosition,
  scrollTargetLayout,
} from '@expo/ui/swift-ui/modifiers';
import { scheduleOnUI } from 'react-native-worklets';

export default function ScrollViewSharedPositionExample() {
  const activeID = useNativeState<string | null>(null);

  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={12}>
        <ScrollView
          modifiers={[
            scrollPosition(activeID, {
              onChange: newID => {
                console.log('[JS thread] leading target:', newID);
              },
            }),
          ]}>
          <VStack modifiers={[scrollTargetLayout()]}>
            {Array.from({ length: 30 }, (_, i) => (
              <Text
                key={`item-${i}`}
                modifiers={[
                  id(`item-${i}`),
                  padding({ horizontal: 16, vertical: 12 }),
                ]}>
                {`Item ${i}`}
              </Text>
            ))}
          </VStack>
        </ScrollView>
        <Button
          label="Scroll to item 10 from worklet"
          onPress={() => {
            scheduleOnUI(() => {
              'worklet';
              activeID.value = 'item-10';
            });
          }}
        />
      </VStack>
    </Host>
  );
}
```

### 不裁剪的滚动内容

:::note
需要 iOS 17 或更高版本。在更早的版本上，该修饰符不产生效果。
:::

滚动视图会把内容裁剪到自身边界，因此画到边界之外的内容会被切掉，例如阴影或放大到边缘之外的卡片。应用 [`scrollClipDisabled`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符即可让这些内容保持可见。

![一行彩色方块，阴影延伸到滚动边界之外](/static/images/expo-ui/examples/scrollview-unclipped-ios-light.webp)

```tsx ScrollViewUnclippedExample.tsx
import {
  Host,
  HStack,
  RoundedRectangle,
  ScrollView,
} from '@expo/ui/swift-ui';
import {
  frame,
  foregroundStyle,
  scrollClipDisabled,
  shadow,
} from '@expo/ui/swift-ui/modifiers';

export default function ScrollViewUnclippedExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView
        axes="horizontal"
        modifiers={[scrollClipDisabled()]}>
        <HStack>
          {Array.from({ length: 20 }, (_, i) => (
            <RoundedRectangle
              key={i}
              cornerRadius={12}
              modifiers={[
                frame({ width: 100, height: 100 }),
                foregroundStyle(`hsl(${i * 18}, 70%, 50%)`),
                shadow({ radius: 10, color: 'secondary' }),
              ]}
            />
          ))}
        </HStack>
      </ScrollView>
    </Host>
  );
}
```

## API

```tsx
import { ScrollView } from '@expo/ui/swift-ui';
```
