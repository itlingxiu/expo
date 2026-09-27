---
title: 核心概念
description: 了解 Expo Router 文件式路由的基本规则，以及它与项目其余代码的关系。
---

# 核心概念

本页介绍文件式路由（File-based Routing）的基础，以及 Expo Router 项目的结构与一般 React Native 项目的不同之处。

## Expo Router 的规则

### 1. 所有屏幕/页面都是 src/app 目录中的文件

路由来自 **src/app** 目录（关于使用或不使用 `src` 目录，参见 [src 目录](/router/reference/src-directory)）中的文件与子目录。每个文件导出一个默认的页面组件，特殊的布局（Layout）文件除外；**src/app** 内的目录用于组织一组相关的屏幕。

### 2. 每个页面都有 URL

每个页面的 URL 路径与其文件位置一致，可以用于浏览器地址栏或原生深度链接。这就是「通用深度链接」——在任何平台上，所有页面都可以通过 URL 访问。参见[链接](/linking/overview)。

### 3. 第一个 index.tsx 是初始路由

代码中不声明初始路由；路由会查找匹配 `/` 的第一个 **index.tsx**。在[默认模板](/router/introduction#quick-start)中，它是 **src/app/index.tsx**。如果想从目录树更深处开始，可以使用[路由组](/router/basics/notation#parentheses)——括号目录不包含在 URL 中。例如把标签页放在 **src/app/(tabs)**、默认标签页放在 **index.tsx**，那么 `/` 打开的就是 **src/app/(tabs)/index.tsx**。

### 4. 根 _layout.tsx 取代 App.jsx/tsx

每个项目都应在 **src/app** 下直接放置一个 **_layout.tsx**。它在任何其他路由之前渲染，承载原先 App.jsx 中的初始化逻辑：加载字体、主题 Provider、处理启动画面等。默认模板用 `ThemeProvider` 包裹应用并渲染 `AppTabs`。

### 5. 默认模板使用平台专属的标签页

默认模板有两种标签页实现：Android 与 iOS 上使用[原生标签页](/router/advanced/native-tabs)获得平台原生的标签栏；Web 上使用 `expo-router/ui` 的[自定义标签页](/router/advanced/custom-tabs)（无样式、灵活）。这是通过[平台专属文件扩展名](/router/advanced/platform-specific-modules)实现的：**src/components/app-tabs.native.tsx**（原生）与 **src/components/app-tabs.tsx**（Web），模块解析时按平台选择。这样做的原因：原生标签栏自带预期行为（如点击标签回到顶部、原生动画），而 Web 需要自定义样式的标签栏。

### 6. 非导航组件放在 src/app 目录之外

**src/app** 严格用于路由。组件、Hooks 和工具函数应放在 **src/components**、**src/hooks**、**src/constants** 等目录；放在 **src/app** 中的任何其他内容都会被当作路由处理。

### 7. 自定义堆栈与标签页导航器

堆栈（Stack）与标签页（Tabs）导航器支持许多选项：页头、动画、手势等。参见[堆栈导航](/router/advanced/stack)与[标签页导航](/router/advanced/tabs)指南。

## 实践：Expo Router 的规则

```
src
 app
  index.tsx
  home.tsx
  _layout.tsx
  profile
   friends.tsx
 components
  app-tabs.native.tsx
  app-tabs.tsx
  text-field.tsx
  toolbar.tsx
```

- **src/app/index.tsx**——初始路由，应用启动或 Web 根路径时首先显示。
- **src/app/home.tsx**——路由 `/home`；Web 上通过 `yourapp.com/home` 访问，原生端通过 `yourapp://home` 访问。
- **src/app/_layout.tsx**——根布局；原先 App.jsx 中初始化代码的归宿。
- **src/app/profile/friends.tsx**——路由 `/profile/friends`。
- **src/components/app-tabs.native.tsx** 与 **src/components/app-tabs.tsx**——[平台专属](/router/advanced/platform-specific-modules)的标签页组件；Android 与 iOS 使用 .native 文件，Web 使用另一个；由根布局导入以渲染标签导航器。
- **src/components/text-field.tsx** 与 **src/components/toolbar.tsx**——位于 **src/app** 之外，因此不是页面：没有 URL、不是导航目标，但可以作为页面中的组件使用。
