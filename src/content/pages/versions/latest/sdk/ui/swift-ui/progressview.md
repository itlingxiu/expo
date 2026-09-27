---
title: ProgressView 组件参考
description: 用于显示进度指示器的 SwiftUI ProgressView 组件。
---

# ProgressView 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 ProgressView 与官方 SwiftUI [ProgressView API](https://developer.apple.com/documentation/swiftui/progressview) 保持一致，并支持通过 [`progressViewStyle`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符设置样式。

![不确定的转圈，以及带标签的确定 ProgressView](/static/images/expo-ui/progressview/ios-light.webp)

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

:::note
使用 `linear` 样式时（确定进度的默认样式），`ProgressView` 是弹性宽度组件，会扩展以填满可用的水平空间。在 `Host` 上使用 `matchContents` 时，应对 `ProgressView` 应用 [`frame`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符以给出明确宽度。也可以用 `style` 给 `Host` 明确尺寸（例如 `style={{ width: 300 }}` 或 `style={{ flex: 1 }}`）。`circular` 样式和不确定转圈有固定尺寸，可以配合 `matchContents` 使用。
:::

### 不确定进度

未提供 `value` 时，进度视图显示不确定指示器（转圈）。

![按内容尺寸、位于前缘的不确定转圈](/static/images/expo-ui/examples/progressview-indeterminate-ios-light.webp)

```tsx IndeterminateExample.tsx
import { Host, ProgressView } from '@expo/ui/swift-ui';

export default function IndeterminateExample() {
  return (
    <Host matchContents>
      <ProgressView />
    </Host>
  );
}
```

### 确定进度

提供介于 `0` 和 `1` 之间的 `value` 以显示确定进度。

![填充到一半的线性进度条](/static/images/expo-ui/examples/progressview-determinate-ios-light.webp)

```tsx DeterminateExample.tsx
import { Host, ProgressView } from '@expo/ui/swift-ui';

export default function DeterminateExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ProgressView value={0.5} />
    </Host>
  );
}
```

### 进度视图样式

使用 [`progressViewStyle`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符改变进度视图外观。可用样式：`automatic`、`linear` 和 `circular`。

![填充一半、标签为 Linear 的线性进度条，上方是标签为 Circular 的圆形转圈](/static/images/expo-ui/examples/progressview-styles-ios-light.webp)

```tsx ProgressViewStylesExample.tsx
import {
  Host,
  ProgressView,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import { progressViewStyle } from '@expo/ui/swift-ui/modifiers';

export default function ProgressViewStylesExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={16}>
        <Text>Linear</Text>
        <ProgressView
          value={0.5}
          modifiers={[progressViewStyle('linear')]}
        />
        <Text>Circular</Text>
        <ProgressView
          value={0.5}
          modifiers={[progressViewStyle('circular')]}
        />
      </VStack>
    </Host>
  );
}
```

### 带标签

可以把自定义组件作为 `children` 传入，为进度视图提供标签。

![填充到四分之一的进度条，上方标签为 Loading](/static/images/expo-ui/examples/progressview-label-ios-light.webp)

```tsx LabelExample.tsx
import { Host, ProgressView, Text } from '@expo/ui/swift-ui';

export default function LabelExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ProgressView value={0.25}>
        <Text>Loading...</Text>
      </ProgressView>
    </Host>
  );
}
```

### 着色的进度视图

使用 `tint` 修饰符改变进度视图颜色。

![填充到大约百分之七十的红色进度条](/static/images/expo-ui/examples/progressview-tinted-ios-light.webp)

```tsx TintedExample.tsx
import { Host, ProgressView } from '@expo/ui/swift-ui';
import { tint } from '@expo/ui/swift-ui/modifiers';

export default function TintedExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ProgressView value={0.7} modifiers={[tint('red')]} />
    </Host>
  );
}
```

### 基于计时器的进度

使用 `timerInterval` 属性创建在时间范围内自动动画的进度视图。适用于显示倒计时或定时操作。

:::note
基于计时器的进度仅在 iOS 16+ 和 tvOS 16+ 上可用。
:::

![两条计时进度条，处于十秒范围的中途，其中一条标签为 Counting up](/static/images/expo-ui/examples/progressview-timer-ios-light.webp)

```tsx TimerExample.tsx
import {
  Host,
  ProgressView,
  Text,
  VStack,
} from '@expo/ui/swift-ui';

export default function TimerExample() {
  const startDate = new Date();
  const endDate = new Date(Date.now() + 10000); // 从现在起 10 秒

  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={16}>
        <ProgressView
          timerInterval={{ lower: startDate, upper: endDate }}
        />
        <ProgressView
          timerInterval={{ lower: startDate, upper: endDate }}
          countsDown={false}>
          <Text>Counting up</Text>
        </ProgressView>
      </VStack>
    </Host>
  );
}
```

## API

```tsx
import { ProgressView } from '@expo/ui/swift-ui';
```
