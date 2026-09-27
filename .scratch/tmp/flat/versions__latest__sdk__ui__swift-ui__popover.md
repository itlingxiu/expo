---
title: Popover 组件参考
description: A SwiftUI Popover component for displaying content in a floating overlay.
---

# Popover 组件参考

> 支持平台：iOS、Expo Go。

Expo UI Popover matches the official SwiftUI [Popover API](<https://developer.apple.com/documentation/swiftui/view/popover(ispresented:attachmentanchor:arrowedge:content:)>) and provides a way to present content in a floating overlay anchored to a trigger element.

![Popover floating above its trigger button](/static/images/expo-ui/popover/ios-light.webp)

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

### Basic popover

![A popover reading Hello from Popover! floating above its trigger button](/static/images/expo-ui/examples/popover-basic-ios-light.webp)

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

### With attachment anchor

The `attachmentAnchor` prop controls where the popover attaches to the trigger element. Available options are: `center`, `leading`, `trailing`, `top`, and `bottom`.

![A popover attached to the trailing edge of its trigger button](/static/images/expo-ui/examples/popover-attachment-anchor-ios-light.webp)

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

### With arrow edge

The `arrowEdge` prop controls which edge of the popover displays the arrow. Available options are: `none`, `leading`, `trailing`, `top`, and `bottom`.

![A popover below its trigger with the arrow on the popover's top edge](/static/images/expo-ui/examples/popover-arrow-edge-ios-light.webp)

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

### With React Native content

You can use `RNHostView` to embed React Native components inside the popover content.

![A popover containing React Native text, a counter, and a blue Increment button](/static/images/expo-ui/examples/popover-rn-content-ios-light.webp)

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
