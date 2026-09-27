---
title: MaskedView 包参考
description: 与 @react-native-masked-view/masked-view 兼容的遮罩视图。
---

# MaskedView 包参考

> 支持平台：Android、iOS。

与 `@react-native-masked-view/masked-view` API 兼容的 `MaskedView` 组件。`maskElement` 中不透明的像素会显露其背后的被遮罩内容；透明像素则将其隐藏。

在底层，这个组件把任意 React Native 子元素桥接到平台专用的 `@expo/ui` 遮罩原语：

- **Android**：使用 `BlendMode.DstIn` 的 Jetpack Compose 图形层合成。
- **iOS**：SwiftUI [`.mask`](https://developer.apple.com/documentation/swiftui/view/mask(alignment:_:)) 修饰符。

![用彩虹渐变填充的 EXPO 字样（Android）](/static/images/expo-ui/community-maskedview/android-light.webp)

![用彩虹渐变填充的 EXPO 字样（iOS）](/static/images/expo-ui/community-maskedview/ios-light.webp)

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

## 从 `@react-native-masked-view/masked-view` 迁移

- 把导入从 `import MaskedView from '@react-native-masked-view/masked-view'` 改为 `import { MaskedView } from '@expo/ui/community/masked-view'`。
- 不支持 `androidRenderingMode` 属性。基于 Compose 的实现始终使用离屏图形层，因此该属性没有等价物，并从公开类型中省略。
- 尚未实现 Web。在 Web 上，子元素会不加遮罩地渲染，并记录一次控制台警告。对于 Web 目标，请根据具体情况选用合适的 CSS 原语：
  - **渐变文字**：`background-clip: text`，配合 `color: 'transparent'`，以及作为背景的 CSS 渐变或图片。
  - **透明度渐隐**：直接在内容视图上使用 `mask-image: linear-gradient(...)`（或 `WebkitMaskImage`）。
  - **形状遮罩**（圆形、圆角矩形等）：`clip-path: circle(...)` / `inset(...)` / `path(...)`，或者 `border-radius` 加 `overflow: 'hidden'`。

## 基本用法

![用彩虹渐变填充的 EXPO 字样（Android）](/static/images/expo-ui/examples/community-maskedview-basic-android-light.webp)

![用彩虹渐变填充的 EXPO 字样（iOS）](/static/images/expo-ui/examples/community-maskedview-basic-ios-light.webp)

```tsx
import { MaskedView } from '@expo/ui/community/masked-view';
import { StyleSheet, Text, View } from 'react-native';

export default function MaskedViewExample() {
  return (
    <MaskedView
      style={{ width: 300, height: 80 }}
      maskElement={
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 64, fontWeight: 'bold' }}>EXPO</Text>
        </View>
      }>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            experimental_backgroundImage:
              'linear-gradient(135deg, #FF3B30, #FF9500, #FFCC00, #34C759, #007AFF, #AF52DE)',
          },
        ]}
      />
    </MaskedView>
  );
}
```

## 透明度渐隐遮罩

只有 `maskElement` 的 alpha 通道起作用：不透明像素显露内容，透明像素隐藏内容。使用从 `expo-linear-gradient` 导入的 `LinearGradient`，让它从不透明过渡到透明（下面的例子是从 `'black'` 到 `'transparent'`），即可沿某个轴把内容渐隐。

![三条色带从左向右渐隐（Android）](/static/images/expo-ui/examples/community-maskedview-alpha-fade-android-light.webp)

![三条色带从左向右渐隐（iOS）](/static/images/expo-ui/examples/community-maskedview-alpha-fade-ios-light.webp)

```tsx
import { MaskedView } from '@expo/ui/community/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

export default function AlphaFadeExample() {
  return (
    <MaskedView
      style={{ width: 300, height: 80, flexDirection: 'row' }}
      maskElement={
        <LinearGradient
          colors={['black', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      }>
      <View style={{ flex: 1, backgroundColor: '#3D5A80' }} />
      <View style={{ flex: 1, backgroundColor: '#DAA520' }} />
      <View style={{ flex: 1, backgroundColor: '#E07A5F' }} />
    </MaskedView>
  );
}
```

## API

```tsx
import { MaskedView } from '@expo/ui/community/masked-view';
```
