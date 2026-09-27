---
title: 'expo-router Experimental Stack 参考'
description: 基于 react-native-screens 实验性 gamma 栈构建的 Stack 的可选姊妹组件。仅供测试使用。
---

# expo-router Experimental Stack 参考

> 支持平台：iOS、Android。

:::note
`ExperimentalStack` 是一个 [alpha](/more/release-statuses#alpha) API，在 **Expo SDK 56** 及更高版本中提供。它仅供测试——API 和功能集在准备好用于正式环境之前可能会发生变化。
:::

`ExperimentalStack` 是 [`Stack`](/versions/latest/sdk/router/stack) 的姊妹组件，由新的 `react-native-screens/experimental` 栈驱动。它按导航器选择启用：在你想要迁移的特定布局中将 `<Stack />` 替换为 `<ExperimentalStack />`，其他位置继续使用 `<Stack />`。

我们提前分享它，以便你在应用中试用并告诉我们缺少什么。目前支持的选项范围有意保持精简，并将随时间逐步扩展。

> 有关用于原生和 Web 应用的基于文件的路由库的更多信息，请参阅 [Expo Router](/versions/latest/sdk/router) 参考。

## 支持的功能

支持的屏幕选项：

- `title`
- `headerShown`
- `headerTransparent`
- `headerBackVisible`

在 Android 上，`ExperimentalStack` 自带[预测性返回手势](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)支持。你仍需要在[应用配置](/workflow/configuration)中将 [`android.predictiveBackGestureEnabled`](/versions/latest/config/app#predictivebackgestureenabled) 设置为 `true` 来为应用启用它。

## 平台支持

`ExperimentalStack` 仅支持原生平台。在 Web 上，它会回退到标准 `Stack`，因此同一布局无需条件代码即可跨平台工作。

## 基本用法

```tsx app/_layout.tsx
import { ExperimentalStack as Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="details" options={{ title: 'Details' }} />
    </Stack>
  );
}
```

你可以像使用 `Stack` 一样组合 `ExperimentalStack.Screen` 和 `ExperimentalStack.Protected`。

## 已知限制

<details><summary>屏幕选项有限</summary>

`ExperimentalStack` 仅支持 `title`、`headerShown`、`headerTransparent` 和 `headerBackVisible`。传入任何其他选项（例如 `headerLeft`、`headerRight`、`headerTitle`、`headerStyle`、`headerTintColor`、动画覆盖、状态栏选项）会在开发环境记录一条警告且不生效。对于需要这些选项的屏幕，请继续使用 `<Stack />`。

</details>

<details><summary>尚不支持演示模式</summary>

`ExperimentalStack` 尚不支持 `presentation: 'modal'` 或 `transparentModal`。屏幕始终推入栈中。

</details>

<details><summary>尚不支持 sheet</summary>

`ExperimentalStack` 尚不支持 `formSheet` 或相关的 sheet 尺寸/detent 选项。

</details>

<details><summary>尚不支持自定义头部</summary>

`ExperimentalStack` 尚不支持自定义头部组件或头部着色/样式。只有上面列出的四个头部选项会生效。

</details>

<details><summary>尚不支持动画或状态栏自定义</summary>

`ExperimentalStack` 尚不遵循每个屏幕的动画覆盖（`animation`、`animationDuration`）或状态栏选项。

</details>

<details><summary>在 Android 上不能与 Stack 混用</summary>

在 Android 上，`ExperimentalStack` 和标准 `Stack` 不能共存于同一个应用中——请为你的原生栈选择一种导航器类型。我们希望在未来版本中解除此限制，以便你可以一次迁移一个导航器。

</details>

<details><summary>Web 回退到标准 Stack</summary>

在 Web 上，`<ExperimentalStack />` 会渲染 `expo-router` 中的标准 `Stack`。仅原生平台的选项在 Web 上不生效。

</details>

:::note
我们正在积极开发 `ExperimentalStack` 并寻求反馈。你可以在 [Discord](https://chat.expo.dev) 上分享想法、[在 GitHub 上提交 issue](https://github.com/expo/expo/issues)，或使用本页底部的 **Feedback** 按钮。
:::

## 安装

`ExperimentalStack` 随 `expo-router` 一起发布。如果你的项目中还没有它，请按照 Expo Router 安装指南操作：

- [安装 Expo Router](/router/installation)：了解如何在项目中安装 Expo Router。

## API

```js
import { ExperimentalStack } from 'expo-router';
```
