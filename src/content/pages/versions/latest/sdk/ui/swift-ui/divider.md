---
title: Divider 组件参考
description: 用于创建视觉分隔线的 SwiftUI Divider 组件。
---

# Divider 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 Divider 与官方 SwiftUI [Divider API](https://developer.apple.com/documentation/swiftui/divider) 保持一致，用于在内容之间创建视觉分隔线。

![分隔线把标题和正文分开](/static/images/expo-ui/divider/ios-light.webp)

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

### 基本分隔线

![水平线把文本 First section 和 Second section 分开](/static/images/expo-ui/examples/divider-basic-ios-light.webp)

```tsx BasicDividerExample.tsx
import { Host, Divider, VStack, Text } from '@expo/ui/swift-ui';

export default function BasicDividerExample() {
  // 分隔线会占满给定宽度，因此 `matchContents` 会把它压扁。
  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <Text>First section</Text>
        <Divider />
        <Text>Second section</Text>
      </VStack>
    </Host>
  );
}
```

### 列表中的分隔线

![Item 1 到 Item 4 上下堆叠，每两项之间有一条水平线](/static/images/expo-ui/examples/divider-in-list-ios-light.webp)

```tsx DividerInListExample.tsx
import { Host, Divider, VStack, Text } from '@expo/ui/swift-ui';

export default function DividerInListExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={8}>
        <Text>Item 1</Text>
        <Divider />
        <Text>Item 2</Text>
        <Divider />
        <Text>Item 3</Text>
        <Divider />
        <Text>Item 4</Text>
      </VStack>
    </Host>
  );
}
```

### 上下文菜单中的分隔线

分隔线常用于把上下文菜单中的操作分组隔开。

![上下文菜单中，一条线把 Edit 和 Duplicate 与红色的 Delete 分开](/static/images/expo-ui/examples/divider-context-menu-ios-light.webp)

```tsx DividerInContextMenuExample.tsx
import {
  Host,
  ContextMenu,
  Button,
  Text,
  Divider,
} from '@expo/ui/swift-ui';

export default function DividerInContextMenuExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ContextMenu>
        <ContextMenu.Items>
          <Button
            label="Edit"
            onPress={() => console.log('Edit')}
          />
          <Button
            label="Duplicate"
            onPress={() => console.log('Duplicate')}
          />
          <Divider />
          <Button
            label="Delete"
            role="destructive"
            onPress={() => console.log('Delete')}
          />
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Text>Long press me</Text>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
```

## API

```tsx
import { Divider } from '@expo/ui/swift-ui';
```
