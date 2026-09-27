---
title: RNHostView 组件参考
description: 让 React Native 视图能够放在 SwiftUI 内部的组件。
---

# RNHostView 组件参考

> 支持平台：iOS、tvOS、Expo Go。

当 React Native 视图渲染在 SwiftUI 组件内部时，该组件使布局行为正确。它通过更新 shadow node 尺寸，把布局信息从 SwiftUI 同步回 React Native 的 Yoga 布局系统。

当 React Native 视图放在 [`BottomSheet`](/versions/latest/sdk/ui/swift-ui/bottomsheet)、[`Popover`](/versions/latest/sdk/ui/swift-ui/popover) 或 [`HStack`](/versions/latest/sdk/ui/swift-ui/hstack) 等 SwiftUI 组件内部时，两套布局系统需要互相通信。`RNHostView` 桥接这一差距：

- **使用 `matchContents`**：shadow node 尺寸设为匹配子级 React Native 视图的固有尺寸，从而让 SwiftUI 父级根据 React Native 内容确定自身大小。
- **不使用 `matchContents`**：shadow node 尺寸设为匹配父级 SwiftUI 视图的尺寸，从而让 React Native 内容填满可用空间（适用于 `flex: 1` 布局）。

:::note
子节点请传入单个 React Native 元素。`RNHostView` 只测量并布局它的第一个子节点，因此多个视图应包在同一个父级 `View` 中，由该视图负责排列。
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

### 使用 matchContents 的基本用法

希望 SwiftUI 父级根据 React Native 内容确定自身大小时，使用 `matchContents`。

```tsx RNHostView with matchContents
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Host,
  BottomSheet,
  Button,
  RNHostView,
} from '@expo/ui/swift-ui';

function Example() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Button
        label="Open sheet"
        onPress={() => setIsPresented(true)}
      />
      <BottomSheet
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}>
        <RNHostView matchContents>
          <View style={{ padding: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              React Native Content
            </Text>
            <Pressable
              style={{
                backgroundColor: '#007AFF',
                padding: 12,
                borderRadius: 8,
                marginTop: 16,
              }}
              onPress={() => setIsPresented(false)}>
              <Text style={{ color: 'white', textAlign: 'center' }}>
                Close
              </Text>
            </Pressable>
          </View>
        </RNHostView>
      </BottomSheet>
    </Host>
  );
}
```

### 不使用 matchContents 的弹性内容

React Native 内容使用 `flex: 1` 时，省略 `matchContents` 属性，让内容填满可用的 SwiftUI 空间。

```tsx RNHostView with flex content
import { useState } from 'react';
import { Text, View } from 'react-native';
import {
  Host,
  BottomSheet,
  Button,
  Group,
  RNHostView,
} from '@expo/ui/swift-ui';
import { presentationDetents } from '@expo/ui/swift-ui/modifiers';

function Example() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Button
        label="Open sheet"
        onPress={() => setIsPresented(true)}
      />
      <BottomSheet
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}>
        <Group
          modifiers={[presentationDetents(['medium', 'large'])]}>
          <RNHostView>
            <View
              style={{
                flex: 1,
                backgroundColor: '#007AFF',
                padding: 24,
              }}>
              <Text style={{ color: 'white', fontSize: 18 }}>
                This content fills the available space
              </Text>
            </View>
          </RNHostView>
        </Group>
      </BottomSheet>
    </Host>
  );
}
```

### 与 Popover 一起使用

`RNHostView` 可以放在 [`Popover`](/versions/latest/sdk/ui/swift-ui/popover) 内，以显示可交互的 React Native 内容。

```tsx RNHostView in Popover
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Host,
  Button,
  Popover,
  RNHostView,
} from '@expo/ui/swift-ui';

function Example() {
  const [isPresented, setIsPresented] = useState(false);
  const [counter, setCounter] = useState(0);

  return (
    <Host style={{ flex: 1 }}>
      <Popover
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}>
        <Popover.Trigger>
          <Button
            onPress={() => setIsPresented(true)}
            label="Show Popover"
          />
        </Popover.Trigger>
        <Popover.Content>
          <RNHostView matchContents>
            <View style={{ padding: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginBottom: 8,
                }}>
                React Native Content
              </Text>
              <Text style={{ color: '#666', marginBottom: 12 }}>
                Counter: {counter}
              </Text>
              <Pressable
                style={{
                  backgroundColor: '#007AFF',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                onPress={() => setCounter(counter + 1)}>
                <Text style={{ color: 'white', fontWeight: '600' }}>
                  Increment
                </Text>
              </Pressable>
            </View>
          </RNHostView>
        </Popover.Content>
      </Popover>
    </Host>
  );
}
```

## API

```tsx
import { RNHostView } from '@expo/ui/swift-ui';
```
