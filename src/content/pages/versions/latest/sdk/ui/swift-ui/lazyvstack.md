---
title: LazyVStack 组件参考
description: 用于惰性垂直布局的 SwiftUI LazyVStack 组件。
---

# LazyVStack 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 LazyVStack 与官方 SwiftUI [LazyVStack API](https://developer.apple.com/documentation/swiftui/lazyvstack) 保持一致，垂直排列子元素，并且只在需要时创建项（滚动到可见时）。

:::note
`LazyVStack` 目前还不是真正的惰性：原生侧只构建可见项，但 React 仍会预先创建每一个子元素，因此大列表挂载可能较慢。我们正在改进这一点。对于大列表，建议使用 [FlashList](https://shopify.github.io/flash-list) 或 [Legend List](https://github.com/LegendApp/legend-list)。
:::

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

### 基本惰性垂直堆叠

LazyVStack 应放在 `ScrollView` 内，才能启用惰性渲染。

![垂直列表，项目编号从 0 到 24。](/static/images/expo-ui/examples/lazyvstack-basic-ios-light.webp)

```tsx BasicLazyVStackExample.tsx
import {
  Host,
  ScrollView,
  LazyVStack,
  Text,
} from '@expo/ui/swift-ui';

export default function BasicLazyVStackExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView>
        <LazyVStack spacing={12}>
          {Array.from({ length: 100 }, (_, i) => (
            <Text key={i}>{`Item ${i}`}</Text>
          ))}
        </LazyVStack>
      </ScrollView>
    </Host>
  );
}
```

### 对齐方式

`alignment` 属性控制子元素的水平对齐。可用选项为：`leading`、`center` 和 `trailing`。

![三个宽度不同的矩形垂直堆叠，沿前端对齐。](/static/images/expo-ui/examples/lazyvstack-alignment-ios-light.webp)

```tsx LazyVStackAlignmentExample.tsx
import {
  Host,
  ScrollView,
  LazyVStack,
  Rectangle,
} from '@expo/ui/swift-ui';
import { frame } from '@expo/ui/swift-ui/modifiers';

export default function LazyVStackAlignmentExample() {
  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <ScrollView>
        <LazyVStack spacing={12} alignment="leading">
          <Rectangle
            modifiers={[frame({ width: 50, height: 50 })]}
          />
          <Rectangle
            modifiers={[frame({ width: 100, height: 50 })]}
          />
          <Rectangle
            modifiers={[frame({ width: 75, height: 50 })]}
          />
        </LazyVStack>
      </ScrollView>
    </Host>
  );
}
```

## API

```tsx
import { LazyVStack } from '@expo/ui/swift-ui';
```
