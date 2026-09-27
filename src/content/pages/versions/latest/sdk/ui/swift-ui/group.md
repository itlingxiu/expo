---
title: Group 组件参考
description: 用于将视图分组且不影响布局的 SwiftUI Group 组件。
---

# Group 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 Group 与官方 SwiftUI [Group API](https://developer.apple.com/documentation/swiftui/group) 保持一致，可将视图组合在一起，同时不引入额外的布局结构。

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

### 基本分组

Group 适合一次给多个视图应用修改器，或在不影响布局的情况下组织视图。

![三行垂直堆叠的蓝色文本：First item、Second item 和 Third item。](/static/images/expo-ui/examples/group-basic-ios-light.webp)

```tsx BasicGroupExample.tsx
import { Group, Host, Text, VStack } from '@expo/ui/swift-ui';
import { foregroundStyle } from '@expo/ui/swift-ui/modifiers';

export default function BasicGroupExample() {
  return (
    <Host matchContents style={{ alignSelf: 'center' }}>
      <VStack spacing={8}>
        <Group modifiers={[foregroundStyle('blue')]}>
          <Text>First item</Text>
          <Text>Second item</Text>
          <Text>Third item</Text>
        </Group>
      </VStack>
    </Host>
  );
}
```

## API

```tsx
import { Group } from '@expo/ui/swift-ui';
```
