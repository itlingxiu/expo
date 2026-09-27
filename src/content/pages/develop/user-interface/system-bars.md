---
title: 系统栏
description: 了解如何在 Expo 项目中处理并自定义系统栏，实现安全区域与边到边（edge-to-edge）布局。
---

# 系统栏

系统栏（system bars）是屏幕边缘的 UI 元素，承载设备信息与导航控件。按平台划分：

- 状态栏（Status bar）—— Android 与 iOS
- 标题栏（Caption bar）—— 仅 Android
- 导航栏（Navigation bar）—— Android 与 iOS
- Home 指示条（Home indicator）—— 仅 iOS

它们显示电量、时间与通知提醒等信息，并让用户随时随地与设备交互 —— 例如下拉状态栏打开快捷设置与通知，无论当前运行的是哪个应用。理解它们的工作方式对应用开发很重要。

相关参考：[Android 系统栏](https://developer.android.com/design/ui/mobile/guides/foundations/system-bars)、[iOS 状态栏指南](https://developer.apple.com/design/human-interface-guidelines/status-bars)、[Android 标题栏](https://medium.com/androiddevelopers/insets-handling-tips-for-android-15s-edge-to-edge-enforcement-872774e8839b)、[Android 导航栏](https://developer.android.com/design/ui/mobile/guides/foundations/system-bars#navigation-bar)、[iOS 导航栏](https://developer.apple.com/design/human-interface-guidelines/navigation-bars)。

## 使用安全区域处理重叠

应用内容有时会渲染到系统栏后面。解决办法是把内容放在既不重叠也不遮挡系统控件的位置。[安全区域](/develop/user-interface/safe-areas)指南介绍了如何使用 `SafeAreaView` 或 Hook，为屏幕的每条边应用 insets。

## Android 上的安全区域与边到边布局

过去，半透明状态栏与导航栏是常态；它们后面的内容本来就位于底层，因此通常无需考虑安全区域。如今 Android 默认启用边到边（edge-to-edge）显示，必须使用安全区域让内容避开系统栏（参见[官方博客](https://expo.dev/blog/edge-to-edge-display-now-streamlined-for-android)）。

## 自定义系统栏

Expo 提供两个库：`expo-status-bar` 与 `expo-navigation-bar`（仅 Android）。

## 状态栏配置

状态栏位于 Android 与 iOS 的屏幕顶部，可以通过 `expo-status-bar` 自定义。它的 `StatusBar` 组件在应用运行时控制外观，使用 `style` 属性或 `setStatusBarStyle`。

```tsx src/app/_layout.tsx
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      {/* Use light text instead of dark text in the status bar to provide more contrast with a dark background. */}
      <StatusBar style="light" />
    </>
  );
}
```

:::note
在 Expo 默认模板中，`style` 为 `auto`，会根据应用当前的亮色/深色配色方案自动选择样式。
:::

要隐藏状态栏，把 `hidden` 设为 `true`，或调用 `setStatusBarHidden`。参见 [`expo-status-bar`](/versions/latest/sdk/status-bar) 参考。

## 导航栏配置（仅 Android）

Android 上的导航栏位于屏幕底部，可以通过 `expo-navigation-bar` 自定义。它的 `NavigationBar` 组件通过 `setStyle` 设置样式。

```tsx src/app/_layout.tsx
import { NavigationBar } from 'expo-navigation-bar';

export default function RootLayout() {
  return (
    <>
      {/* Set the navigation bar style */}
      <NavigationBar style="dark" />
    </>
  );
}
```

可见性通过 `hidden` 属性或 `NavigationBar.setHidden` 控制。参见 [`expo-navigation-bar`](/versions/latest/sdk/navigation-bar) 参考。
