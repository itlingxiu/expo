---
title: Text 组件参考
description: 用于显示样式化文本内容的组件。
---

# Text 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

用于显示文本的组件。默认会适应平台的配色方案（浅色/深色），并通过 [`textStyle`](#textstyle) 暴露一组聚焦的排版控制项。

**Android**

![Material 3 排版层级：标题、副标题、正文和标签](/static/images/expo-ui/text/android-light.webp)

**iOS**

![以不同字号、字重和层级次要样式渲染的文本](/static/images/expo-ui/text/ios-light.webp)

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

### 基本文本

**Android**

![文本 Hello, world!](/static/images/expo-ui/examples/universal-text-basic-android-light.webp)

**iOS**

![文本 Hello, world!](/static/images/expo-ui/examples/universal-text-basic-ios-light.webp)

```tsx TextExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Text } from '@expo/ui';

export default function TextExample() {
  const colorScheme = useColorScheme();

  return (
    <Host matchContents>
      <Text textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
        Hello, world!
      </Text>
    </Host>
  );
}
```

### 样式化文本

使用 [`textStyle`](#textstyle) 设置排版相关属性（字号、字重、对齐）。

**Android**

![大号粗体单词 Headline](/static/images/expo-ui/examples/universal-text-styled-android-light.webp)

**iOS**

![大号粗体单词 Headline](/static/images/expo-ui/examples/universal-text-styled-ios-light.webp)

```tsx StyledTextExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Text } from '@expo/ui';

export default function StyledTextExample() {
  const colorScheme = useColorScheme();

  return (
    <Host matchContents>
      <Text
        textStyle={{
          color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          fontSize: 24,
          fontWeight: '700',
          textAlign: 'center',
        }}>
        Headline
      </Text>
    </Host>
  );
}
```

### 截断长文本

使用 [`numberOfLines`](#numberoflines) 把长文本限制为指定行数，并在末尾显示省略号。

**Android**

![一行长文本在屏幕边缘被截断](/static/images/expo-ui/examples/universal-text-truncated-android-light.webp)

**iOS**

![一行长文本被省略号截断](/static/images/expo-ui/examples/universal-text-truncated-ios-light.webp)

```tsx TruncatedTextExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Text } from '@expo/ui';

export default function TruncatedTextExample() {
  const colorScheme = useColorScheme();

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Text numberOfLines={1} textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
        A very long line of text that will be truncated when it does not fit on a single line.
      </Text>
    </Host>
  );
}
```

## API

```tsx
import { Text } from '@expo/ui';
```
