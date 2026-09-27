---
title: Drawer
description: 了解如何在 Expo Router 中使用 Drawer 布局。
---

# Drawer

导航抽屉是移动应用中的常见模式，它允许用户从屏幕一侧滑出菜单，以显示导航选项。这个菜单通常也可以通过应用标题栏中的按钮来切换。

> 演示视频：抽屉导航的实际效果。

## 安装

在 **SDK 56 及更高版本**中，抽屉导航器已内置于 `expo-router`，底层使用 [`react-native-drawer-layout`](https://www.npmjs.com/package/react-native-drawer-layout)。

在 Android 和 iOS 上，抽屉需要 `react-native-reanimated` 和 `react-native-worklets` 来驱动动画。在 Web 上，动画由 CSS 处理。

:::tabs
:::tab SDK 56 及更高版本

要使用抽屉导航器，如果尚未安装这些依赖，请安装它们：

:::tabs
:::tab npm
```sh
npx expo install react-native-reanimated react-native-worklets react-native-gesture-handler
```
:::
:::tab yarn
```sh
yarn expo install react-native-reanimated react-native-worklets react-native-gesture-handler
```
:::
:::tab pnpm
```sh
pnpm expo install react-native-reanimated react-native-worklets react-native-gesture-handler
```
:::
:::tab bun
```sh
bun expo install react-native-reanimated react-native-worklets react-native-gesture-handler
```
:::
:::

:::
:::tab SDK 54 和 55

要使用[抽屉导航器](https://reactnavigation.org/docs/drawer-navigator)，如果尚未安装这些依赖，请安装它们：

:::tabs
:::tab npm
```sh
npx expo install @react-navigation/drawer react-native-reanimated react-native-worklets react-native-gesture-handler
```
:::
:::tab yarn
```sh
yarn expo install @react-navigation/drawer react-native-reanimated react-native-worklets react-native-gesture-handler
```
:::
:::tab pnpm
```sh
pnpm expo install @react-navigation/drawer react-native-reanimated react-native-worklets react-native-gesture-handler
```
:::
:::tab bun
```sh
bun expo install @react-navigation/drawer react-native-reanimated react-native-worklets react-native-gesture-handler
```
:::
:::

:::
:::tab SDK 53 及更早版本

要使用[抽屉导航器](https://reactnavigation.org/docs/drawer-navigator)，如果尚未安装这些依赖，请安装它们：

:::tabs
:::tab npm
```sh
npx expo install @react-navigation/drawer react-native-reanimated react-native-gesture-handler
```
:::
:::tab yarn
```sh
yarn expo install @react-navigation/drawer react-native-reanimated react-native-gesture-handler
```
:::
:::tab pnpm
```sh
pnpm expo install @react-navigation/drawer react-native-reanimated react-native-gesture-handler
```
:::
:::tab bun
```sh
bun expo install @react-navigation/drawer react-native-reanimated react-native-gesture-handler
```
:::
:::

:::
:::

## 用法

现在可以使用 `Drawer` 布局创建抽屉导航器。

```tsx src/app/_layout.tsx
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return <Drawer />;
}
```

要编辑抽屉导航菜单的标签、标题以及特定屏幕的屏幕选项，需要如下声明屏幕：

```tsx src/app/_layout.tsx
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index" // 页面名称，必须与从根路径开始的 URL 匹配
        options={{
          drawerLabel: 'Home',
          title: 'overview',
        }}
      />
      <Drawer.Screen
        name="user/[id]" // 页面名称，必须与从根路径开始的 URL 匹配
        options={{
          drawerLabel: 'User',
          title: 'overview',
        }}
      />
    </Drawer>
  );
}
```
