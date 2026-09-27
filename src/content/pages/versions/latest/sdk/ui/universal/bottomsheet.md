---
title: BottomSheet 组件参考
description: 从屏幕底部滑出的模态工作表。
---

# BottomSheet 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

从屏幕底部滑出的模态工作表。工作表的可见性由你控制——用 React 状态切换 [`isPresented`](#ispresented)，并在 [`onDismiss`](#ondismiss) 中关闭它（用户下滑或点击遮罩时会调用）。

:::note
在 iOS 上，要在一个底部工作表之上再显示另一个，请把第二个 `BottomSheet` 嵌套在第一个工作表的内容里，而不是并排放置。这是底层 SwiftUI [`sheet`](https://developer.apple.com/documentation/swiftui/view/sheet(ispresented:ondismiss:content:)) 修饰符的限制。更多信息见 [如何呈现多个工作表](https://www.hackingwithswift.com/quick-start/swiftui/how-to-present-multiple-sheets)。
:::

**Android**

![带标题、说明和操作按钮的模态底部工作表](/static/images/expo-ui/bottomsheet/android-light.webp)

**iOS**

![停在中等档位的 BottomSheet，显示 Sort By 列表且 Most Recent 已选中](/static/images/expo-ui/bottomsheet/ios-light.webp)

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

### 基本底部工作表

**Android**

![打开的工作表，标题为 Sheet contents，带 Close 按钮，背景变暗](/static/images/expo-ui/examples/universal-bottomsheet-basic-android-light.webp)

**iOS**

![打开的工作表，标题为 Sheet contents，带 Close 按钮，背景变暗](/static/images/expo-ui/examples/universal-bottomsheet-basic-ios-light.webp)

```tsx BottomSheetExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, Column, Button, BottomSheet, Text } from '@expo/ui';

export default function BottomSheetExample() {
  const [isPresented, setIsPresented] = useState(false);
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <>
      <Host matchContents>
        <Button label="Open sheet" onPress={() => setIsPresented(true)} />
      </Host>
      <BottomSheet isPresented={isPresented} onDismiss={() => setIsPresented(false)}>
        <Column spacing={12}>
          <Text textStyle={{ ...ink, fontSize: 18, fontWeight: '700' }}>Sheet contents</Text>
          <Text textStyle={ink}>Drag down or tap the overlay to dismiss.</Text>
          <Button label="Close" onPress={() => setIsPresented(false)} />
        </Column>
      </BottomSheet>
    </>
  );
}
```

### 隐藏拖动指示器

不需要手柄的工作表传入 [`showDragIndicator={false}`](#showdragindicator)。

**Android**

![变暗屏幕底部的短工作表，没有拖动手柄](/static/images/expo-ui/examples/universal-bottomsheet-no-indicator-android-light.webp)

**iOS**

![变暗屏幕底部的短工作表，没有拖动手柄](/static/images/expo-ui/examples/universal-bottomsheet-no-indicator-ios-light.webp)

```tsx BottomSheetNoIndicatorExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, Button, BottomSheet, Text } from '@expo/ui';

export default function BottomSheetNoIndicatorExample() {
  const [isPresented, setIsPresented] = useState(false);
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <>
      <Host matchContents>
        <Button label="Open" onPress={() => setIsPresented(true)} />
      </Host>
      <BottomSheet
        isPresented={isPresented}
        onDismiss={() => setIsPresented(false)}
        showDragIndicator={false}>
        <Text textStyle={ink}>No drag handle.</Text>
      </BottomSheet>
    </>
  );
}
```

### 内容内边距

工作表默认会给内容加内边距。传入 [`contentPadding`](#contentpadding) 可改变该内边距——`0` 会让一行、图片或分隔线贴到工作表边缘。

**Android**

![底部工作表的蓝色横幅在没有内容内边距时贴到工作表边缘](/static/images/expo-ui/examples/universal-bottomsheet-content-padding-android-light.webp)

**iOS**

![底部工作表的蓝色横幅在没有内容内边距时贴到工作表边缘](/static/images/expo-ui/examples/universal-bottomsheet-content-padding-ios-light.webp)

```tsx BottomSheetContentPaddingExample.tsx
import { useState } from 'react';
import { Host, BottomSheet, Button, Column, Text } from '@expo/ui';

export default function BottomSheetContentPaddingExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <>
      <Host matchContents>
        <Button label="Open" onPress={() => setIsPresented(true)} />
      </Host>
      <BottomSheet
        isPresented={isPresented}
        onDismiss={() => setIsPresented(false)}
        contentPadding={0}>
        <Column>
          <Column style={{ backgroundColor: '#0a84ff', padding: 16 }}>
            <Text textStyle={{ color: '#FFFFFF' }}>This banner reaches the sheet's edge.</Text>
          </Column>
          <Button label="Close" onPress={() => setIsPresented(false)} />
        </Column>
      </BottomSheet>
    </>
  );
}
```

### 吸附点

传入 [`snapPoints`](#snappoints)，让用户在多个停靠高度之间拖动工作表。可以使用语义值 `'half'` 和 `'full'` 以保持跨平台一致。`{ fraction }` 和 `{ height }` 形式在 iOS 和 Web 上会精确生效。

当工作表内容可能高于最小吸附点时，把它包在 `ScrollView` 里，溢出部分才能正确滚动。

**Android**

![半高工作表，标题为 Half / full sheet](/static/images/expo-ui/examples/universal-bottomsheet-snap-points-android-light.webp)

**iOS**

![半高工作表，标题为 Half / full sheet](/static/images/expo-ui/examples/universal-bottomsheet-snap-points-ios-light.webp)

```tsx BottomSheetSnapPointsExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, BottomSheet, Button, Column, ScrollView, Text } from '@expo/ui';

export default function BottomSheetSnapPointsExample() {
  const [isPresented, setIsPresented] = useState(false);
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <>
      <Host matchContents>
        <Button label="Open" onPress={() => setIsPresented(true)} />
      </Host>
      <BottomSheet
        isPresented={isPresented}
        onDismiss={() => setIsPresented(false)}
        snapPoints={['half', 'full']}>
        <ScrollView>
          <Column spacing={12}>
            <Text textStyle={{ ...ink, fontSize: 20, fontWeight: '700' }}>Half / full sheet</Text>
            <Text textStyle={ink}>Drag the sheet between half and full screen height.</Text>
          </Column>
        </ScrollView>
      </BottomSheet>
    </>
  );
}
```

> 在 Android 上，`{ fraction }` 和 `{ height }` 会吸附到最近的 `'half'` / `'full'`——底层 `ModalBottomSheet` 只支持两种停靠状态。部分展开状态仅在内容足够高、超过 Material 的部分展开阈值时可见；若短内容也需要半高状态，请给内容明确高度，或让它填满可用空间。

### 可滚动的 React Native 内容

底部工作表支持把 React Native 列表（例如 `FlatList`，或 [FlashList](https://shopify.github.io/flash-list)、[Legend List](https://github.com/LegendApp/legend-list) 这类高性能列表）包在 [`RNHostView`](/versions/latest/sdk/ui/universal/rnhostview) 里作为子元素。[`snapPoints`](#snappoints) 决定工作表尺寸，列表在该高度内滚动。设置 `nestedScrollEnabled` 后，列表先滚动自身内容；到达顶部边缘后，剩余拖动会移动工作表。

**Android**

![半高工作表中容纳可滚动的项目列表](/static/images/expo-ui/examples/universal-bottomsheet-scrollable-android-light.webp)

**iOS**

![半高工作表中容纳可滚动的项目列表](/static/images/expo-ui/examples/universal-bottomsheet-scrollable-ios-light.webp)

```tsx BottomSheetScrollableExample.tsx
import { useState } from 'react';
import { FlatList, Text, useColorScheme } from 'react-native';
import { Host, BottomSheet, Button, RNHostView } from '@expo/ui';

const DATA = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

export default function BottomSheetScrollableExample() {
  const [isPresented, setIsPresented] = useState(false);
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <>
      <Host matchContents>
        <Button label="Open" onPress={() => setIsPresented(true)} />
      </Host>
      <BottomSheet
        isPresented={isPresented}
        onDismiss={() => setIsPresented(false)}
        snapPoints={['half', 'full']}>
        <RNHostView>
          <FlatList
            nestedScrollEnabled
            style={{ flex: 1 }}
            data={DATA}
            keyExtractor={item => item}
            renderItem={({ item }) => <Text style={[ink, { padding: 16 }]}>{item}</Text>}
          />
        </RNHostView>
      </BottomSheet>
    </>
  );
}
```

## API

```tsx
import { BottomSheet } from '@expo/ui';
```
