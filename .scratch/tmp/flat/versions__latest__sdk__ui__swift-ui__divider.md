---
title: Divider 组件参考
description: A SwiftUI Divider component for creating visual separators.
---

# Divider 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI Divider matches the official SwiftUI [Divider API](https://developer.apple.com/documentation/swiftui/divider) and creates a visual separator between content.

![Divider separating a heading from body text](/static/images/expo-ui/divider/ios-light.webp)

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

### Basic divider

![A horizontal rule separating the text First section from Second section](/static/images/expo-ui/examples/divider-basic-ios-light.webp)

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

### Divider in a list

![Item 1 through Item 4 stacked with a horizontal rule between each pair](/static/images/expo-ui/examples/divider-in-list-ios-light.webp)

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

### Divider in a context menu

Dividers are commonly used to separate groups of actions in context menus.

![A context menu with a rule separating Edit and Duplicate from a red Delete](/static/images/expo-ui/examples/divider-context-menu-ios-light.webp)

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
