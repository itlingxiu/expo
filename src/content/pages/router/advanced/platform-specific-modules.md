---
title: 平台特定扩展与模块
description: 了解如何在 Expo Router 中使用平台特定扩展和 React Native 的 Platform 模块，按平台切换模块。
---

# 平台特定扩展与模块

构建应用时，你可能希望根据当前平台显示特定内容。平台特定扩展和 `Platform` 模块可以让体验更贴近某个平台。以下各节介绍用 Expo Router 实现这一点的方式。

## 平台特定扩展

:::warning
平台特定扩展是在 Expo Router `3.5.x` 中加入的。如果使用的是该库的更早版本，请按照[Platform 模块](#platform-模块)中的说明操作。
:::

使用平台特定扩展有两种方式：

### 在 src/app 目录内

Metro 打包器的平台特定扩展（例如 **.android.tsx**、**.ios.tsx**、**.native.tsx** 或 **.web.tsx**）只有在同时存在**非平台版本**时，才支持放在 **src/app** 目录中。这可以确保路由在各平台上对深层链接都是通用的。

考虑以下项目结构：

```text
src/app/_layout.tsx
src/app/_layout.web.tsx
src/app/index.tsx
src/app/about.tsx
src/app/about.web.tsx
```

在上面的文件结构中：

- **\_layout.web.tsx** 文件用作 Web 上的布局，**\_layout.tsx** 用于所有其他平台。
- **index.tsx** 文件用作所有平台的主页。
- **about.web.tsx** 文件用作 Web 上的关于页面，**about.tsx** 文件用于所有其他平台。

### 在 src/app 目录外

可以在 **src/app** 目录之外创建带扩展名的平台特定文件（例如 **.android.tsx**、**.ios.tsx**、**.native.tsx** 或 **.web.tsx**），并在 **src/app** 目录内使用它们。

考虑以下项目结构：

```text
src/app/_layout.tsx
src/app/index.tsx
src/app/about.tsx
src/components/about.tsx
src/components/about.ios.tsx
src/components/about.web.tsx
```

在上面的文件结构中，设计要求为每个平台构建不同的 `about` 屏幕。此时可以在 **src/components** 目录中用平台扩展为每个平台创建一个组件。导入时，Metro 会根据当前平台确保使用正确的组件版本。然后可以在 **src/app** 目录中将该组件重新导出为屏幕。

```tsx src/app/about.tsx
export { default } from '@/components/about';
```

## Platform 模块

可以使用 React Native 的 [`Platform`](https://reactnative.dev/docs/platform-specific-code#platform-module) 模块检测当前平台，并根据结果渲染相应内容。例如，可以在原生平台上渲染 `Tabs` 布局，在 Web 上渲染自定义布局。

```tsx src/app/_layout.tsx
import { Platform } from 'react-native';
import { Link, Slot, Tabs } from 'expo-router';

export default function Layout() {
  if (Platform.OS === 'web') {
    // 在 Web 上使用基本的自定义布局。
    return (
      <div style={{ flex: 1 }}>
        <header>
          <Link href="/">Home</Link>
          <Link href="/settings">Settings</Link>
        </header>
        <Slot />
      </div>
    );
  }
  // 在原生平台上使用原生底部标签页布局。
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
```
