---
title: ScrollView 组件参考
description: 支持垂直或水平滚动的可滚动容器。
---

# ScrollView 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

可滚动容器，默认垂直滚动。水平列表使用 [`direction="horizontal"`](#direction)。

## 原生实现

| 平台 | 底层组件 |
| --- | --- |
| Android | 带 [`verticalScroll` 或 `horizontalScroll` 修改器](https://developer.android.com/develop/ui/compose/touch-input/pointer-input/scroll#scroll-modifiers) 的 Jetpack Compose `Column` 或 `Row`。该实现会渲染全部子元素，不是惰性容器。 |
| iOS | SwiftUI [`ScrollView`](https://developer.apple.com/documentation/swiftui/scrollview)。 |
| Web | React Native [`ScrollView`](https://reactnative.dev/docs/scrollview)。 |

**Android**

![滚动视图中的六项垂直列表](/static/images/expo-ui/scrollview/android-light.webp)

**iOS**

![滚动视图中的垂直项目列表](/static/images/expo-ui/scrollview/ios-light.webp)

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

### 垂直滚动

**Android**

![填满屏幕的编号行垂直列表](/static/images/expo-ui/examples/universal-scrollview-vertical-android-light.webp)

**iOS**

![填满屏幕的编号行垂直列表](/static/images/expo-ui/examples/universal-scrollview-vertical-ios-light.webp)

```tsx VerticalScrollViewExample.tsx
import { useColorScheme } from 'react-native';
import { Host, ScrollView, Column, Text } from '@expo/ui';

export default function VerticalScrollViewExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host style={{ flex: 1 }}>
      <ScrollView>
        <Column spacing={8}>
          {Array.from({ length: 30 }).map((_, i) => (
            <Text key={i} textStyle={ink}>
              {`Row ${i + 1}`}
            </Text>
          ))}
        </Column>
      </ScrollView>
    </Host>
  );
}
```

### 水平滚动

**Android**

![编号项目的水平条，延伸到屏幕边缘之外](/static/images/expo-ui/examples/universal-scrollview-horizontal-android-light.webp)

**iOS**

![编号项目的水平条，延伸到屏幕边缘之外](/static/images/expo-ui/examples/universal-scrollview-horizontal-ios-light.webp)

```tsx HorizontalScrollViewExample.tsx
import { useColorScheme } from 'react-native';
import { Host, ScrollView, Row, Text } from '@expo/ui';

export default function HorizontalScrollViewExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <ScrollView direction="horizontal">
        <Row spacing={12}>
          {Array.from({ length: 20 }).map((_, i) => (
            <Text key={i} textStyle={ink}>
              {`Item ${i + 1}`}
            </Text>
          ))}
        </Row>
      </ScrollView>
    </Host>
  );
}
```

## API

```tsx
import { ScrollView } from '@expo/ui';
```
