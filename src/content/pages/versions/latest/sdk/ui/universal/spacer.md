---
title: Spacer 组件参考
description: 在同级元素之间产生空白的布局间隔组件。
---

# Spacer 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

布局间隔组件，在 [`Row`](/versions/latest/sdk/ui/universal/row) 或 [`Column`](/versions/latest/sdk/ui/universal/column) 的同级元素之间产生空白。用 [`size`](#size) 指定固定间距，或用 [`flexible`](#flexible) 填满主轴上剩余的空间。

**Android**

![两个方块被带 weight 修改器的 Spacer 推到 Row 的两端](/static/images/expo-ui/spacer/android-light.webp)

**iOS**

![HStack 前端是红色 A 方块，末端是蓝色 B 方块，中间用 Spacer 分开](/static/images/expo-ui/spacer/ios-light.webp)

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

### 固定尺寸间隔

**Android**

![两个标签之间有固定的垂直间距](/static/images/expo-ui/examples/universal-spacer-fixed-android-light.webp)

**iOS**

![两个标签之间有固定的垂直间距](/static/images/expo-ui/examples/universal-spacer-fixed-ios-light.webp)

```tsx FixedSpacerExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Column, Text, Spacer } from '@expo/ui';

export default function FixedSpacerExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents>
      <Column>
        <Text textStyle={ink}>Top</Text>
        <Spacer size={32} />
        <Text textStyle={ink}>Bottom</Text>
      </Column>
    </Host>
  );
}
```

### 弹性间隔

弹性间隔会沿父级主轴填满剩余空间，把周围内容推到两端。

**Android**

![前端和末端标签被推到相对的边缘](/static/images/expo-ui/examples/universal-spacer-flexible-android-light.webp)

**iOS**

![前端和末端标签被推到相对的边缘](/static/images/expo-ui/examples/universal-spacer-flexible-ios-light.webp)

```tsx FlexibleSpacerExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Row, Text, Spacer } from '@expo/ui';

export default function FlexibleSpacerExample() {
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
import { Spacer } from '@expo/ui';
```
