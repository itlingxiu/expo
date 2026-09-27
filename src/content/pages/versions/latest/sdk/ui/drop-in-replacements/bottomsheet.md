---
title: BottomSheet 包参考
description: 与 @gorhom/bottom-sheet 兼容的底部面板。
---

# BottomSheet 包参考

> 支持平台：Android、iOS、Web、Expo Go。

`BottomSheet` 组件的 API 与 `@gorhom/bottom-sheet` 兼容。它封装了各平台的 `@expo/ui` 原语：Android 上的 [Jetpack Compose ModalBottomSheet](/versions/latest/sdk/ui/jetpack-compose/bottomsheet)，以及 iOS 上的 [SwiftUI BottomSheet](/versions/latest/sdk/ui/swift-ui/bottomsheet)。在 Web 上，它使用 HTML `<dialog>` 底部面板。

如果需要对平台特定的样式、修饰符或布局行为做更底层的控制，请直接使用原生原语。

![在变暗的屏幕上呈现的底部面板（Android）](/static/images/expo-ui/community-bottomsheet/android-light.webp)

![在变暗的屏幕上呈现的底部面板（iOS）](/static/images/expo-ui/community-bottomsheet/ios-light.webp)

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

## 从 `@gorhom/bottom-sheet` 迁移

- 把导入从：

```tsx
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
```

  改为使用 `@expo/ui/community/bottom-sheet`：

```tsx
import BottomSheet, { BottomSheetView } from '@expo/ui/community/bottom-sheet';
```

- 此实现不需要 `react-native-gesture-handler` 的 `GestureHandlerRootView`。如果应用的其他部分需要它，可以保留。
- 不支持 `BottomSheetBackdrop`、`BottomSheetHandle`、`BottomSheetFooter`、`BottomSheetDraggableView`、`BottomSheetVirtualizedList`、`BottomSheetFlashList`、`useBottomSheetModal`、`useBottomSheetSpringConfigs` 和 `useBottomSheetTimingConfigs` 等组件与 Hook 导出。为了 API 兼容，会导出一些相关的属性类型。

## 基本用法

![位于 Open 按钮下方、处于最小吸附点的面板（Android）](/static/images/expo-ui/examples/community-bottomsheet-basic-android-light.webp)

![位于 Open 按钮下方、处于最小吸附点的面板（iOS）](/static/images/expo-ui/examples/community-bottomsheet-basic-ios-light.webp)

```tsx
import { useRef } from 'react';
import { Button, Text, useColorScheme, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@expo/ui/community/bottom-sheet';

export default function BottomSheetExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };
  const sheetRef = useRef<BottomSheet>(null);

  return (
    <View style={{ flex: 1 }}>
      <Button title="Open" onPress={() => sheetRef.current?.snapToIndex(0)} />

      <BottomSheet
        ref={sheetRef}
        snapPoints={['25%', '50%', '90%']}
        index={-1}
        onChange={index => {
          console.log('onChange', index);
        }}
        onClose={() => {
          console.log('closed');
        }}
        enablePanDownToClose>
        <BottomSheetView style={{ flex: 1, padding: 24, alignItems: 'center' }}>
          <Text style={ink}>Sheet content</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
```

## `BottomSheetModal`

从 `@gorhom/bottom-sheet` 的模态 API 迁移时使用 `BottomSheetModal`。它一开始是关闭的，通过 `present()` 打开。

![半高模态面板，包含 Modal content 和 Dismiss 按钮（Android）](/static/images/expo-ui/examples/community-bottomsheet-modal-android-light.webp)

![半高模态面板，包含 Modal content 和 Dismiss 按钮（iOS）](/static/images/expo-ui/examples/community-bottomsheet-modal-ios-light.webp)

```tsx
import { useRef } from 'react';
import { Button, Text, useColorScheme, View } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@expo/ui/community/bottom-sheet';

export default function BottomSheetModalExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };
  const modalRef = useRef<BottomSheetModal>(null);

  return (
    <View style={{ flex: 1 }}>
      <Button title="Present" onPress={() => modalRef.current?.present()} />

      <BottomSheetModal ref={modalRef} snapPoints={['50%', '90%']} enablePanDownToClose>
        <BottomSheetView style={{ padding: 24 }}>
          <Text style={ink}>Modal content</Text>
          <Button title="Dismiss" onPress={() => modalRef.current?.dismiss()} />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
```

## 动态尺寸

未提供 `snapPoints` 时，面板默认会按内容调整大小。用 `BottomSheetView` 作为面板内容的包装组件。

![按一行内容调整大小的面板（Android）](/static/images/expo-ui/examples/community-bottomsheet-dynamic-android-light.webp)

![按一行内容调整大小的面板（iOS）](/static/images/expo-ui/examples/community-bottomsheet-dynamic-ios-light.webp)

```tsx
import { useRef } from 'react';
import { Button, Text, useColorScheme, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@expo/ui/community/bottom-sheet';

export default function DynamicBottomSheetExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };
  const sheetRef = useRef<BottomSheet>(null);

  return (
    <View style={{ flex: 1 }}>
      <Button title="Open" onPress={() => sheetRef.current?.present()} />

      <BottomSheet ref={sheetRef} index={-1} enablePanDownToClose>
        <BottomSheetView style={{ padding: 24 }}>
          <Text style={ink}>This sheet sizes itself to its content.</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
```

### 可滚动的 React Native 内容

底部面板支持把 React Native 的 `FlatList` 或 `ScrollView`（或 [FlashList](https://shopify.github.io/flash-list/) 或 [Legend List](https://github.com/LegendApp/legend-list) 等高性能列表）作为子组件来承载可滚动内容。启用 `nestedScrollEnabled` 后，列表会先滚动自己的内容。到达顶部边缘后，剩余的拖动手势会移动面板。为了与 `@gorhom/bottom-sheet` 兼容，也会导出 `BottomSheetFlatList` 和 `BottomSheetScrollView`，但它们只是 React Native 组件的直接再导出。

![列出可滚动项目的半高面板（Android）](/static/images/expo-ui/examples/community-bottomsheet-scrollable-android-light.webp)

![列出可滚动项目的半高面板（iOS）](/static/images/expo-ui/examples/community-bottomsheet-scrollable-ios-light.webp)

```tsx
import { useRef } from 'react';
import { Button, FlatList, Text, useColorScheme, View } from 'react-native';
import BottomSheet from '@expo/ui/community/bottom-sheet';

const DATA = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

export default function BottomSheetScrollableExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };
  const sheetRef = useRef<BottomSheet>(null);

  return (
    <View style={{ flex: 1 }}>
      <Button title="Open" onPress={() => sheetRef.current?.snapToIndex(0)} />

      <BottomSheet ref={sheetRef} snapPoints={['50%', '90%']} index={-1} enablePanDownToClose>
        <FlatList
          nestedScrollEnabled
          style={{ flex: 1 }}
          data={DATA}
          keyExtractor={item => item}
          contentContainerStyle={{ padding: 24 }}
          renderItem={({ item }) => <Text style={{ ...ink, paddingVertical: 16 }}>{item}</Text>}
        />
      </BottomSheet>
    </View>
  );
}
```

## 平台行为

`@gorhom/bottom-sheet` 在其父视图底部内联渲染。此组件在 Android 和 iOS 上使用原生模态呈现，在 Web 上使用 HTML `<dialog>`。

这个差异是有意的。`@gorhom/bottom-sheet` 通过 `react-native-gesture-handler` 和 `react-native-reanimated` 拥有手势与动画层，而 `@expo/ui/community/bottom-sheet` 把这些行为委托给 Jetpack Compose、SwiftUI，以及 Web 上的 HTML `<dialog>`。因此，此组件最适合模态底部面板流程，包括使用 `BottomSheet` API 而不是 `BottomSheetModal` 的调用处。

| 功能 | Android | iOS | Web |
| --- | --- | --- | --- |
| 呈现方式 | Jetpack Compose 模态底部面板 | SwiftUI 面板 | HTML `<dialog>` 底部面板 |
| 吸附点 | 映射到部分展开和完全展开状态 | 支持所提供的吸附点 | 支持所提供的吸附点 |
| 没有 `snapPoints` | 适应内容 | 适应内容 | 适应内容 |
| 向下拖动关闭 | 同时启用返回按钮和点击遮罩关闭 | 同时启用点击背景关闭 | 启用点击遮罩、Escape 和向下拖动关闭 |
| 持久的内联窥视 | 不支持 | 不支持 | 不支持 |

:::note
在 iOS 上，要在一个底部面板之上再显示另一个，请把第二个 `BottomSheet` 嵌套在第一个面板的内容里，而不是放在它旁边。这是底层 SwiftUI [`sheet`](https://developer.apple.com/documentation/swiftui/view/sheet(ispresented:ondismiss:content:)) 修饰符的限制。更多信息见[如何呈现多个面板](https://www.hackingwithswift.com/quick-start/swiftui/how-to-present-multiple-sheets)。
:::

## 支持的导出

| 导出 | 是否支持 | 说明 |
| --- | --- | --- |
| `BottomSheet` | 支持 | Android 和 iOS 上为模态，Web 上为 HTML dialog |
| `BottomSheetModal` | 支持 | 一开始关闭，通过 `present()` 打开 |
| `BottomSheetModalProvider` | 支持 | 为兼容性直接渲染子组件 |
| `BottomSheetView` | 支持 | 包装面板内容 |
| `BottomSheetScrollView` | 支持 | React Native `ScrollView` 的再导出 |
| `BottomSheetFlatList` | 支持 | React Native `FlatList` 的再导出 |
| `BottomSheetSectionList` | 支持 | React Native `SectionList` 的再导出 |
| `BottomSheetTextInput` | 支持 | React Native `TextInput` 的再导出 |
| `useBottomSheet` | 支持 | 从上下文返回面板 ref 方法 |
| `BottomSheetBackdrop` | 不支持 | 由原生面板或 HTML dialog 处理背景 |
| `BottomSheetHandle` | 不支持 | 由原生面板或 HTML dialog 处理拖动指示器 |
| `BottomSheetFooter` | 不支持 | 此实现中没有对应物 |

## 兼容性说明

- 支持 `snapPoints`、`index`、`onChange`、`onClose`、`onDismiss`、`enablePanDownToClose` 和 `enableDynamicSizing`。
- `handleComponent={null}` 会隐藏原生或 Web 的拖动指示器。自定义拖动手柄组件不会在原生平台上渲染。
- `backgroundStyle` 在 Web 上完全生效。在 Android 上，`backgroundColor` 用于原生容器颜色。在 iOS 上，使用系统面板背景。
- 动画、过度拖动、内容平移、手柄平移、键盘行为、自定义背景遮罩、自定义背景、自定义页脚、动画值和分离属性会被接受以保持 API 兼容，但不会改变行为。

## API

```tsx
import BottomSheet from '@expo/ui/community/bottom-sheet';
```
