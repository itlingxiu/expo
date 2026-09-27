---
title: Row 组件参考
description: 用于通用 @expo/ui 组件的水平布局容器。
---

# Row 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

水平布局容器，从起始端到末端排列子元素。在 Android 上委托给 Jetpack Compose 的 [`Row`](/versions/latest/sdk/ui/jetpack-compose/row)，在 iOS 上委托给 SwiftUI 的 [`HStack`](/versions/latest/sdk/ui/swift-ui/hstack)，在 Web 上使用 flex `View`。

**Android**

![Row 内水平排列的三个色块](/static/images/expo-ui/row/android-light.webp)

**iOS**

![Row 内水平排列的三个色块](/static/images/expo-ui/row/ios-light.webp)

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

### 基本行

**Android**

![水平一行中的三个文本标签](/static/images/expo-ui/examples/universal-row-basic-android-light.webp)

**iOS**

![水平一行中的三个文本标签](/static/images/expo-ui/examples/universal-row-basic-ios-light.webp)

```tsx RowExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Row, Text } from '@expo/ui';

export default function RowExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents>
      <Row spacing={8}>
        <Text textStyle={ink}>One</Text>
        <Text textStyle={ink}>Two</Text>
        <Text textStyle={ink}>Three</Text>
      </Row>
    </Host>
  );
}
```

### 对齐

使用 [`alignment`](#alignment) 沿交叉轴（垂直方向）定位子元素。

**Android**

![大标签和小标签共用一条中线](/static/images/expo-ui/examples/universal-row-alignment-android-light.webp)

**iOS**

![大标签和小标签共用一条中线](/static/images/expo-ui/examples/universal-row-alignment-ios-light.webp)

```tsx RowAlignmentExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Row, Text } from '@expo/ui';

export default function RowAlignmentExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host style={{ width: '100%', height: 160 }}>
      <Row spacing={8} alignment="center">
        <Text textStyle={{ ...ink, fontSize: 30 }}>Large</Text>
        <Text textStyle={ink}>centered</Text>
      </Row>
    </Host>
  );
}
```

### 用 Spacer 把内容推开

把 `Row` 和弹性 [`Spacer`](/versions/latest/sdk/ui/universal/spacer) 搭配，即可把子元素推到两端。

**Android**

![前端和末端标签被推到相对的边缘](/static/images/expo-ui/examples/universal-row-spacer-android-light.webp)

**iOS**

![前端和末端标签被推到相对的边缘](/static/images/expo-ui/examples/universal-row-spacer-ios-light.webp)

```tsx RowSpacerExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Row, Text, Spacer } from '@expo/ui';

export default function RowSpacerExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Row>
        <Text textStyle={ink}>Leading</Text>
        <Spacer flexible />
        <Text textStyle={ink}>Trailing</Text>
      </Row>
    </Host>
  );
}
```

## API

```tsx
import { Row } from '@expo/ui';
```
