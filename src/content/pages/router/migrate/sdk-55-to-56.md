---
title: 将 Expo Router 从 SDK 55 迁移到 SDK 56
description: 了解如何使用 codemod 或手动将 Expo Router 从 SDK 55 迁移到 SDK 56。
---

# 将 Expo Router 从 SDK 55 迁移到 SDK 56

在 **SDK 56 及更高版本**中，Expo Router 不再支持在应用代码里从外部 `@react-navigation/*` 包导入。请把这些导入更新为对应的 `expo-router` 入口。运行时 API 不变，只是模块说明符发生了移动。

## 自动迁移

在项目根目录运行 codemod。它会把应用代码中的 `@react-navigation/*` 导入改写为对应的 `expo-router` 入口。

:::tabs
:::tab npm
```sh
npx expo-codemod sdk-56-expo-router-react-navigation-replace src
```
:::
:::tab yarn
```sh
yarn dlx expo-codemod sdk-56-expo-router-react-navigation-replace src
```
:::
:::tab pnpm
```sh
pnpm dlx expo-codemod sdk-56-expo-router-react-navigation-replace src
```
:::
:::tab bun
```sh
bunx expo-codemod sdk-56-expo-router-react-navigation-replace src
```
:::
:::

将 `src` 替换为包含应用代码的目录或 glob。

## 手动迁移

如果无法运行 codemod，请手动改写每个导入：

```tsx
// 之前（SDK 55）
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// 之后（SDK 56）
import { ThemeProvider, DarkTheme } from 'expo-router/react-navigation';
import { createMaterialTopTabNavigator } from 'expo-router/js-top-tabs';
```

用下表把代码中的每个 React Navigation 导入映射到对应的 `expo-router` 目标：

| React Navigation 来源 | Expo Router 目标 |
| --- | --- |
| `@react-navigation/native` | `expo-router/react-navigation` |
| `@react-navigation/core` | `expo-router/react-navigation` |
| `@react-navigation/elements` | `expo-router/react-navigation` |
| `@react-navigation/routers` | `expo-router/react-navigation` |
| `@react-navigation/stack` | `expo-router/js-stack` |
| `@react-navigation/bottom-tabs` | `expo-router/js-tabs` |
| `@react-navigation/material-top-tabs` | `expo-router/js-top-tabs` |
| `@react-navigation/native-stack` | 没有直接对应项。请改用 [`Stack`](/router/advanced/stack) 布局。 |
| `@react-navigation/drawer` | 没有直接对应项。请改用 [`Drawer`](/router/advanced/drawer) 布局。 |

## 库

许多第三方库仍然从 `@react-navigation/core` 导入。为了方便 SDK 56 过渡，当这些导入来自 **node_modules** 时，Expo CLI 会自动把它们改写为 `expo-router`。你的应用代码不受这次改写影响。

这是临时的兼容垫片。在自动改写被移除之前，会有专门的库迁移指南说明替代方案。

要退出该行为，请在启动打包器之前在环境中设置 `EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1`。这也会禁用应用代码从 `@react-navigation/*` 导入时的打包器错误。

:::tabs
:::tab npm
```sh
EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1 npx expo start
```
:::
:::tab yarn
```sh
EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1 yarn expo start
```
:::
:::tab pnpm
```sh
EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1 pnpm expo start
```
:::
:::tab bun
```sh
EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1 bun expo start
```
:::
:::
