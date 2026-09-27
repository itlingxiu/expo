---
title: Popover 组件参考
description: 用于在浮动浮层中显示内容的 SwiftUI Popover 组件。
---

# Popover 组件参考

> 支持平台：iOS、Expo Go。

Expo UI 的 Popover 与官方 SwiftUI [Popover API](https://developer.apple.com/documentation/swiftui/view/popover(ispresented:attachmentanchor:arrowedge:content:)) 保持一致，提供一种把内容呈现在锚定于触发元素的浮动浮层中的方式。

![浮在触发按钮上方的 Popover](/static/images/expo-ui/popover/ios-light.webp)

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

### 基本弹出框

![写着 Hello from Popover! 的弹出框浮在触发按钮上方](/static/images/expo-ui/examples/popover-basic-ios-light.webp)

```tsx BasicPopoverExample.tsx
import { useState } from 'react';
import {
  Host,
  Button,
  Popover,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';

export default function BasicPopoverExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Popover
        isPresented={isPresented}
        onIsPresentedChange={isPresented =>
          setIsPresented(isPresented)
        }>
        <Popover.Trigger>
          <Button
            label="Show Popover"
            onPress={() => setIsPresented(true)}
          />
        </Popover.Trigger>
        <Popover.Content>
          <VStack modifiers={[padding({ all: 16 })]}>
            <Text>Hello from Popover!</Text>
          </VStack>
        </Popover.Content>
      </Popover>
    </Host>
  );
}
```

### 附着锚点

`attachmentAnchor` 属性控制弹出框附着在触发元素的位置。可选值：`center`、`leading`、`trailing`、`top` 和 `bottom`。

![附着在触发按钮尾缘的弹出框](/static/images/expo-ui/examples/popover-attachment-anchor-ios-light.webp)

```tsx AttachmentAnchorExample.tsx
import { useState } from 'react';
import {
  Host,
  Button,
  Popover,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';

export default function AttachmentAnchorExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Popover
        isPresented={isPresented}
        onIsPresentedChange={isPresented =>
          setIsPresented(isPresented)
        }
        attachmentAnchor="trailing">
        <Popover.Trigger>
          <Button
            label="Show Popover"
            onPress={() => setIsPresented(true)}
          />
        </Popover.Trigger>
        <Popover.Content>
          <VStack modifiers={[padding({ all: 16 })]}>
            <Text>Attached to trailing edge</Text>
          </VStack>
        </Popover.Content>
      </Popover>
    </Host>
  );
}
```

### 箭头边

`arrowEdge` 属性控制弹出框的哪一条边显示箭头。可选值：`none`、`leading`、`trailing`、`top` 和 `bottom`。

![弹出框位于触发器下方，箭头在弹出框顶边](/static/images/expo-ui/examples/popover-arrow-edge-ios-light.webp)

```tsx ArrowEdgeExample.tsx
import { useState } from 'react';
import {
  Host,
  Button,
  Popover,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';

export default function ArrowEdgeExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Popover
        isPresented={isPresented}
        onIsPresentedChange={isPresented =>
          setIsPresented(isPresented)
        }
        arrowEdge="top">
        <Popover.Trigger>
          <Button
            label="Show Popover"
            onPress={() => setIsPresented(true)}
          />
        </Popover.Trigger>
        <Popover.Content>
          <VStack modifiers={[padding({ all: 16 })]}>
            <Text>Arrow on top edge</Text>
          </VStack>
        </Popover.Content>
      </Popover>
    </Host>
  );
}
```

### 包含 React Native 内容

可以使用 `RNHostView` 在弹出框内容中嵌入 React Native 组件。

![弹出框包含 React Native 文本、计数器和蓝色 Increment 按钮](/static/images/expo-ui/examples/popover-rn-content-ios-light.webp)

```tsx RNContentPopoverExample.tsx
import { useState } from 'react';
import { Pressable, Text as RNText, View } from 'react-native';
import {
  Host,
  Button,
  Popover,
  RNHostView,
} from '@expo/ui/swift-ui';

export default function RNContentPopoverExample() {
  const [isPresented, setIsPresented] = useState(false);
  const [counter, setCounter] = useState(0);

  return (
    <Host style={{ flex: 1 }}>
      <Popover
        isPresented={isPresented}
        onIsPresentedChange={isPresented =>
          setIsPresented(isPresented)
        }>
        <Popover.Trigger>
          <Button
            label="Show RN Popover"
            onPress={() => setIsPresented(true)}
          />
        </Popover.Trigger>
        <Popover.Content>
          <RNHostView matchContents>
            <View style={{ padding: 16 }}>
              <RNText style={{ fontSize: 16, fontWeight: 'bold' }}>
                React Native Content
              </RNText>
              <RNText style={{ color: '#666', marginVertical: 8 }}>
                Counter: {counter}
              </RNText>
              <Pressable
                style={{
                  backgroundColor: '#007AFF',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                onPress={() => setCounter(counter + 1)}>
                <RNText style={{ color: 'white' }}>
                  Increment
                </RNText>
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
import { Popover } from '@expo/ui/swift-ui';
```
