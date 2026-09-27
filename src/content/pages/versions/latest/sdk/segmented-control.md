---
title: '@react-native-segmented-control/segmented-control 包参考'
description: 用于渲染 iOS UISegmentedControl 的 React Native 库。
---

# @react-native-segmented-control/segmented-control 包参考

> 支持平台：Android、iOS、Web、Expo Go。

:::warning
[`@expo/ui` 提供了直接替代组件](/versions/latest/sdk/ui/drop-in-replacements/segmentedcontrol)，可替换 `@react-native-segmented-control/segmented-control`。Android 上由 Jetpack Compose 驱动，iOS 上由 SwiftUI 驱动。
:::

它有点像更精致的单选按钮。用 Apple 的话说：「由多个分段组成的横向控件，每个分段都作为一个独立按钮」（[来源](https://developer.apple.com/documentation/uikit/uisegmentedcontrol)）。这个组件在 iOS 上渲染为 [`UISegmentedControl`](https://developer.apple.com/documentation/uikit/uisegmentedcontrol)，在 Android 和 Web 上则渲染为对该控件的忠实复刻（因为这两个平台的标准库中没有等价控件）。

## 安装

:::tabs
:::tab npm
```sh
npx expo install @react-native-segmented-control/segmented-control
```
:::
:::tab yarn
```sh
yarn expo install @react-native-segmented-control/segmented-control
```
:::
:::tab pnpm
```sh
pnpm expo install @react-native-segmented-control/segmented-control
```
:::
:::tab bun
```sh
bun expo install @react-native-segmented-control/segmented-control
```
:::
:::

## 了解更多

- [查看官方文档](https://github.com/react-native-community/segmented-control)：获取 API 及其用法的完整信息。
