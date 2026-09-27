---
title: LazyHStack 组件参考
description: 用于惰性水平布局的 SwiftUI LazyHStack 组件。
---

# LazyHStack 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 LazyHStack 与官方 SwiftUI [LazyHStack API](https://developer.apple.com/documentation/swiftui/lazyhstack) 保持一致，水平排列子元素，并且只在需要时创建项（滚动到可见时）。

:::note
`LazyHStack` 目前还不是真正的惰性：原生侧只构建可见项，但 React 仍会预先创建每一个子元素，因此大列表挂载可能较慢。我们正在改进这一点。对于大列表，建议使用 [FlashList](https://shopify.github.io/flash-list) 或 [Legend List](https://github.com/LegendApp/legend-list)。
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

### 基本惰性水平堆叠

LazyHStack 应放在 `axes="horizontal"` 的 `ScrollView` 内，才能启用惰性渲染。

![水平一行项目，编号从 0 到 5，在屏幕中居中。](/static/images/expo-ui/examples/lazyhstack-basic-ios-light.webp)

```tsx BasicLazyHStackExample.tsx
import {
  Host,
  ScrollView,
  LazyHStack,
  Text,
} from '@expo/ui/swift-ui';

export default function BasicLazyHStackExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView axes="horizontal">
        <LazyHStack spacing={12}>
          {Array.from({ length: 100 }, (_, i) => (
            <Text key={i}>{`Item ${i}`}</Text>
          ))}
        </LazyHStack>
      </ScrollView>
    </Host>
  );
}
```

### 对齐方式

`alignment` 属性控制子元素的垂直对齐。可用选项为：`top`、`center`、`bottom`、`firstTextBaseline` 和 `lastTextBaseline`。

![三个高度不同的矩形排成一行，沿顶边对齐。](/static/images/expo-ui/examples/lazyhstack-alignment-ios-light.webp)

```tsx LazyHStackAlignmentExample.tsx
import {
  Host,
  ScrollView,
  LazyHStack,
  Rectangle,
} from '@expo/ui/swift-ui';
import { frame } from '@expo/ui/swift-ui/modifiers';

export default function LazyHStackAlignmentExample() {
  return (
    <Host
      matchContents={{ horizontal: true }}
      style={{ flex: 1, alignSelf: 'center' }}>
      <ScrollView axes="horizontal">
        <LazyHStack spacing={12} alignment="top">
          <Rectangle
            modifiers={[frame({ width: 50, height: 50 })]}
          />
          <Rectangle
            modifiers={[frame({ width: 50, height: 100 })]}
          />
          <Rectangle
            modifiers={[frame({ width: 50, height: 75 })]}
          />
        </LazyHStack>
      </ScrollView>
    </Host>
  );
}
```

## API

```tsx
import { LazyHStack } from '@expo/ui/swift-ui';
```
