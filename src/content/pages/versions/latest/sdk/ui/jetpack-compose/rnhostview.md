---
title: RNHostView 组件参考
description: 让 React Native 视图能够放在 Jetpack Compose 内部的组件。
---

# RNHostView 组件参考

> 支持平台：Android、Expo Go。

当 React Native 视图渲染在 Jetpack Compose 组件内部时，该组件使布局行为正确。它通过更新 shadow node 尺寸，把布局信息从 Jetpack Compose 同步回 React Native 的 Yoga 布局系统。

当 React Native 视图放在 [`ModalBottomSheet`](/versions/latest/sdk/ui/jetpack-compose/bottomsheet)、[`Card`](/versions/latest/sdk/ui/jetpack-compose/card)、[`Row`](/versions/latest/sdk/ui/jetpack-compose/row)、[`Column`](/versions/latest/sdk/ui/jetpack-compose/column) 等 Jetpack Compose 组件内部时，两套布局系统需要互相通信。`RNHostView` 桥接这一差距：

- **使用 [`matchContents`](#使用-matchcontents-的基本用法)**：shadow node 尺寸设为匹配子级 React Native 视图的固有尺寸，从而让 Jetpack Compose 父级根据 React Native 内容确定自身大小。
- **不使用 `matchContents`**：shadow node 尺寸设为匹配父级 Jetpack Compose 视图的尺寸，从而让 React Native 内容填满可用空间（适用于 `flex: 1` 布局）。

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

希望 Jetpack Compose 父级根据 React Native 内容确定自身大小时，使用 `matchContents`。

![Compose 卡片中，减号和加号 React Native 按钮分列在读数为零的 Compose 计数器两侧](/static/images/expo-ui/examples/rnhostview-counter-android-light.webp)

```tsx RNHostViewCounterExample.tsx
import { useState } from 'react';
import { Pressable, Text as RNText } from 'react-native';
import {
  Host,
  Card,
  Column,
  Row,
  RNHostView,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';

export default function RNHostViewCounterExample() {
  const [counter, setCounter] = useState(0);

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Card modifiers={[fillMaxWidth()]}>
        <Column
          verticalArrangement={{ spacedBy: 12 }}
          modifiers={[padding(16, 16, 16, 16)]}>
          <Text>Mixing RN Components with Compose</Text>
          <Row
            horizontalArrangement={{ spacedBy: 24 }}
            verticalAlignment="center">
            <RNHostView matchContents>
              <Pressable
                onPress={() => setCounter(prev => prev - 1)}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#9B59B6',
                }}>
                <RNText style={{ color: 'white', fontSize: 24 }}>
                  -
                </RNText>
              </Pressable>
            </RNHostView>
            <Text>{counter}</Text>
            <RNHostView matchContents>
              <Pressable
                onPress={() => setCounter(prev => prev + 1)}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#9B59B6',
                }}>
                <RNText style={{ color: 'white', fontSize: 24 }}>
                  +
                </RNText>
              </Pressable>
            </RNHostView>
          </Row>
        </Column>
      </Card>
    </Host>
  );
}
```

### 不使用 matchContents 的弹性内容

React Native 内容使用 `flex: 1` 时，省略 `matchContents` 属性，让内容填满可用的 Jetpack Compose 空间。

![Compose 卡片中一块紫色 React Native 方块填满其 100×100 槽位](/static/images/expo-ui/examples/rnhostview-flex-android-light.webp)

```tsx RNHostViewFlexExample.tsx
import { View } from 'react-native';
import {
  Host,
  Card,
  Column,
  Row,
  RNHostView,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  padding,
  size,
} from '@expo/ui/jetpack-compose/modifiers';

export default function RNHostViewFlexExample() {
  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Card modifiers={[fillMaxWidth()]}>
        <Column
          verticalArrangement={{ spacedBy: 12 }}
          modifiers={[padding(16, 16, 16, 16)]}>
          <Text>RN components with flex: 1 children</Text>
          <Row
            horizontalArrangement={{ spacedBy: 20 }}
            modifiers={[size(100, 100)]}>
            <RNHostView>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#9B59B6',
                  borderRadius: 10,
                }}
              />
            </RNHostView>
          </Row>
        </Column>
      </Card>
    </Host>
  );
}
```

### 与 ModalBottomSheet 一起使用

`RNHostView` 可以放在 [`ModalBottomSheet`](/versions/latest/sdk/ui/jetpack-compose/bottomsheet) 内，以显示可交互的 React Native 内容。

![底部工作表中 Compose 标题位于 React Native 文本和蓝色 Close 按钮上方](/static/images/expo-ui/examples/rnhostview-sheet-android-light.webp)

```tsx RNHostViewSheetExample.tsx
import { useRef, useState } from 'react';
import { Pressable, Text as RNText, View } from 'react-native';
import {
  Host,
  ModalBottomSheet,
  Button,
  Column,
  RNHostView,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import type { ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import { padding } from '@expo/ui/jetpack-compose/modifiers';

export default function RNHostViewSheetExample() {
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<ModalBottomSheetRef>(null);
  const colors = useMaterialColors();

  const hideSheet = async () => {
    await sheetRef.current?.hide();
    setVisible(false);
  };

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Open sheet</Text>
      </Button>
      {visible && (
        <ModalBottomSheet
          ref={sheetRef}
          onDismissRequest={() => setVisible(false)}>
          <Column
            verticalArrangement={{ spacedBy: 16 }}
            modifiers={[padding(16, 16, 16, 16)]}>
            <Text>Mixing Compose + RN in a Bottom Sheet</Text>
            <RNHostView matchContents>
              <View>
                <RNText
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 8,
                    color: colors.onSurface,
                  }}>
                  React Native Content
                </RNText>
                <Pressable
                  style={{
                    backgroundColor: '#007AFF',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                  onPress={hideSheet}>
                  <RNText
                    style={{ color: 'white', fontWeight: '600' }}>
                    Close
                  </RNText>
                </Pressable>
              </View>
            </RNHostView>
          </Column>
        </ModalBottomSheet>
      )}
    </Host>
  );
}
```

### 底部工作表中的弹性 React Native 内容

不使用 `matchContents` 的 `RNHostView` 可让 React Native 视图填满工作表内的剩余空间。在父级 `Column` 上配合 `height` 修饰符以控制工作表尺寸。

![底部工作表被紫色 React Native 视图填满，标签为 React Native Content (flex: 1)](/static/images/expo-ui/examples/rnhostview-flex-sheet-android-light.webp)

```tsx RNHostViewFlexSheetExample.tsx
import { useRef, useState } from 'react';
import { Text as RNText, View } from 'react-native';
import {
  Host,
  ModalBottomSheet,
  Button,
  Column,
  RNHostView,
  Text,
} from '@expo/ui/jetpack-compose';
import type { ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import {
  height,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';

export default function RNHostViewFlexSheetExample() {
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Open flex content sheet</Text>
      </Button>
      {visible && (
        <ModalBottomSheet
          ref={sheetRef}
          onDismissRequest={() => setVisible(false)}
          skipPartiallyExpanded>
          <Column
            modifiers={[height(400), padding(16, 16, 16, 16)]}>
            <RNHostView>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#9B59B6',
                  borderRadius: 10,
                }}>
                <RNText
                  style={{
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 'bold',
                    padding: 16,
                  }}>
                  React Native Content (flex: 1)
                </RNText>
              </View>
            </RNHostView>
          </Column>
        </ModalBottomSheet>
      )}
    </Host>
  );
}
```

## API

```tsx
import { RNHostView } from '@expo/ui/jetpack-compose';
```
