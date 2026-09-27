---
title: 配置状态栏、启动画面和应用图标
description: 在本教程中，学习如何配置状态栏、应用图标和启动画面的基础知识。
---

# 配置状态栏、启动画面和应用图标

在本章中，我们会在把应用部署到应用商店之前处理一些细节，例如为主题配置状态栏、自定义应用图标和启动画面。

[观看视频：为通用 Expo 应用添加收尾细节](https://www.youtube.com/watch?v=OgGCYdElcZo) —— 在部署到应用商店之前，配置状态栏、自定义应用图标并设置启动画面。

---

## 1. 配置状态栏

用 `create-expo-app` 创建的每个项目都预装了 [`expo-status-bar`](/versions/latest/sdk/status-bar) 库。这个库提供 `StatusBar` 组件，用来配置应用的状态栏样式。

在 **src/app/\_layout.tsx** 中：

1. 从 `expo-status-bar` 导入 `StatusBar`。
2. 用 [React 的 Fragment 组件](https://react.dev/reference/react/Fragment)把 `StatusBar` 和现有的 `Stack` 组件组合在一起。

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    // 用 React 的 Fragment 组件把 StatusBar 和现有的 Stack 组件组合在一起。
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
```

现在分别在 Android 和 iOS 上看看应用：

![Android 和 iOS 上都显示为浅色样式的状态栏。](/static/images/tutorial/statusbar-example.webp)

## 2. 应用图标

项目的 **assets/images** 目录中有一个 **icon.png** 文件。这就是我们的应用图标。它是一张 1024 像素 × 1024 像素的图片，如下所示：

![默认应用图标：深色圆角方块，上面是带黄色笑脸的白色照片图形。](/static/images/tutorial/icon.webp)

与启动画面图片一样，**app.json** 中的 `"icon"` 属性配置应用图标的路径。默认情况下，新的 Expo 项目已经把路径正确设为 `"./assets/images/icon.png"`。我们不需要做任何修改。

> 将来为应用商店构建应用时，[Expo Application Services（EAS）](/eas) 会使用这张图片，为每一种设备创建优化后的图标。

你可以在 Expo Go 的多个地方看到这个图标。下面是 Expo Go 开发者菜单中显示应用图标的例子：

![Expo Go 应用开发者菜单中的启动画面。](/static/images/tutorial/app-icon-visible.webp)

## 3. 启动画面

启动画面在应用内容加载之前可见。它使用一张较小的图片，例如应用图标，并居中显示。应用内容准备好展示后，它就会隐藏。

用 `create-expo-app` 创建的每个项目都预装了 [`expo-splash-screen`](/versions/latest/sdk/splash-screen) 插件。这个库提供一个配置插件来配置启动画面。

在 **app.json** 中，`expo-splash-screen` 插件已经配置为使用应用图标作为启动画面图片（见[可下载资源](/tutorial/create-your-first-app#下载资源)），因此我们不需要做任何修改：

```json app.json
{
  "plugins": [
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png"
      }
    ]
  ]
}
```

不过，**要测试启动画面，不能使用 Expo Go 或[开发构建](/develop/development-builds/introduction)**。要测试它，需要创建应用的预览构建或生产构建。建议阅读以下资料，进一步了解启动画面的配置以及如何测试：

- [创建启动画面图标](/develop/user-interface/splash-screen-and-app-icon#splash-screen)指南，了解启动画面图标是如何配置的。
- 要了解如何创建预览构建，参见 EAS 教程中的[内部分发](/tutorial/eas/internal-distribution-builds)指南；要创建生产构建，参见 [Android](/tutorial/eas/android-production-build) 和 [iOS](/tutorial/eas/ios-production-build) 指南。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
