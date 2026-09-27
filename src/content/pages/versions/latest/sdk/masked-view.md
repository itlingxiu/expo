---
title: '@react-native-masked-view/masked-view 包参考'
description: 提供遮罩视图的库。
---

# @react-native-masked-view/masked-view 包参考

> 支持平台：Android、iOS、tvOS、Expo Go。

:::warning
[`@expo/ui` 提供了直接替代组件](/versions/latest/sdk/ui/drop-in-replacements/maskedview)，可替换 `@react-native-masked-view/masked-view`。Android 上由 Jetpack Compose 驱动，iOS 上由 SwiftUI 驱动。
:::

`@react-native-masked-view/masked-view` 提供遮罩视图，只显示与其遮罩元素所渲染视图重叠的像素。

:::warning
在任一时刻，项目里只能安装 `@react-native-community/masked-view`（已弃用）或 `@react-native-masked-view/masked-view` 其中之一。React Navigation v6 及更高版本需要 `@react-native-masked-view/masked-view`，因此如果使用最新版本的 React Navigation，应改用这个包。

**重要** 这个库的 Android 支持仍处于[实验阶段](/more/release-statuses#experimental)，你可能会遇到跨平台行为不一致的情况。请把遇到的问题报告到 [`react-native-masked-view` GitHub 仓库](https://github.com/react-native-masked-view/masked-view)。
:::

## 安装

:::tabs
:::tab npm
```sh
npx expo install @react-native-masked-view/masked-view
```
:::
:::tab yarn
```sh
yarn expo install @react-native-masked-view/masked-view
```
:::
:::tab pnpm
```sh
pnpm expo install @react-native-masked-view/masked-view
```
:::
:::tab bun
```sh
bun expo install @react-native-masked-view/masked-view
```
:::
:::

## 了解更多

- [查看官方文档](https://github.com/react-native-masked-view/masked-view)：获取 API 及其用法的完整信息。
