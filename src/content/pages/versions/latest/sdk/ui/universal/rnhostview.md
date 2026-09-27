---
title: RNHostView 组件参考
description: 在 @expo/ui 视图中托管 React Native 视图的跨平台组件。
---

# RNHostView 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

在通用 `@expo/ui` 布局中托管一棵 React Native 视图子树。在 Android 和 iOS 上，它重新导出平台原生的 [Jetpack Compose 版 `RNHostView`](/versions/latest/sdk/ui/jetpack-compose/rnhostview) 与 [SwiftUI 版 `RNHostView`](/versions/latest/sdk/ui/swift-ui/rnhostview)，因此 React Native 子节点会桥接到周围的 Compose/SwiftUI 树中。在 Web 上没有可桥接的原生宿主树，因此回退为包裹子节点的 React Native [`View`](https://reactnative.dev/docs/view)。

:::note
子节点请传入单个 React Native 元素。`RNHostView` 只测量并布局它的第一个子节点，因此多个视图应包在同一个父级 `View` 中，由该视图负责排列。
:::

**Android**

![粗体标签下方的紫色 React Native 芯片](/static/images/expo-ui/rnhostview/android-light.webp)

**iOS**

![粗体标签下方的紫色 React Native 芯片](/static/images/expo-ui/rnhostview/ios-light.webp)

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

### 基本用法

把 React Native 视图子树放在通用 `@expo/ui` 布局中的任意位置。

**Android**

![粗体标签下方的紫色 React Native 芯片](/static/images/expo-ui/examples/universal-rnhostview-basic-android-light.webp)

**iOS**

![粗体标签下方的紫色 React Native 芯片](/static/images/expo-ui/examples/universal-rnhostview-basic-ios-light.webp)

```tsx RNHostViewExample.tsx
import { Host, Column, RNHostView, Text } from '@expo/ui';
import { Text as RNText, View, useColorScheme } from 'react-native';

export default function RNHostViewExample() {
  const colorScheme = useColorScheme();

  return (
    <Host matchContents>
      <Column spacing={12} style={{ padding: 16 }}>
        <Text
          textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000', fontWeight: 'bold' }}>
          Native UI label
        </Text>
        <RNHostView matchContents>
          <View
            style={{
              alignSelf: 'flex-start',
              padding: 16,
              backgroundColor: '#9B59B6',
              borderRadius: 10,
            }}>
            <RNText style={{ color: 'white' }}>Plain React Native content</RNText>
          </View>
        </RNHostView>
      </Column>
    </Host>
  );
}
```

### 填满父级与匹配子级

默认情况下 `RNHostView` 会填满其原生父级。设置 `matchContents` 后，它会收缩以适配 React Native 子节点。

**Android**

![两段对比：一块填满 100×100 框的紫色方块，以及一块更小的 50×50 方块](/static/images/expo-ui/examples/universal-rnhostview-sizing-android-light.webp)

**iOS**

![两段对比：一块填满 100×100 框的紫色方块，以及一块更小的 50×50 方块](/static/images/expo-ui/examples/universal-rnhostview-sizing-ios-light.webp)

```tsx RNHostViewSizingExample.tsx
import { Host, Column, Row, Text, RNHostView } from '@expo/ui';
import { View, useColorScheme } from 'react-native';

export default function RNHostViewSizingExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents>
      <Column spacing={24} style={{ padding: 16 }}>
        <Column spacing={8}>
          <Text textStyle={{ ...ink, fontSize: 18, fontWeight: 'bold' }}>Fill parent size</Text>
          <Text textStyle={{ fontSize: 12, color: '#666666' }}>
            The RNHostView fills the native parent's 100×100 frame.
          </Text>
          <Row style={{ width: 100, height: 100 }}>
            <RNHostView>
              <View style={{ flex: 1, backgroundColor: '#9B59B6', borderRadius: 10, margin: 4 }} />
            </RNHostView>
          </Row>
        </Column>

        <Column spacing={8}>
          <Text textStyle={{ ...ink, fontSize: 18, fontWeight: 'bold' }}>Match child size</Text>
          <Text textStyle={{ fontSize: 12, color: '#666666' }}>
            The RNHostView shrinks to wrap its 50×50 child.
          </Text>
          <Row style={{ padding: 8 }}>
            <RNHostView matchContents>
              <View
                style={{ width: 50, height: 50, backgroundColor: '#9B59B6', borderRadius: 10 }}
              />
            </RNHostView>
          </Row>
        </Column>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { RNHostView } from '@expo/ui';
```
