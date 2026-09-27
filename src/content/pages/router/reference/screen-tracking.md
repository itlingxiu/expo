---
title: 用于分析的屏幕追踪
description: 了解如何在使用 Expo Router 时为分析启用屏幕追踪。
---

# 用于分析的屏幕追踪

与 React Navigation 不同，Expo Router 始终能访问 URL。因此屏幕追踪与 Web 一样简单。

1. 创建一个高阶组件，观察当前选中的 URL
2. 在分析服务中追踪该 URL

```text
src/app/_layout.tsx
```

```tsx src/app/_layout.tsx
import { useEffect } from 'react';
import { usePathname, useGlobalSearchParams, Slot } from 'expo-router';

export default function Layout() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  // 在这里把位置信息发送给你的分析服务。
  useEffect(() => {
    analytics.track({ pathname, params });
  }, [pathname, params]);

  // 以最基本的方式导出所有子路由。
  return <Slot />;
}
```

用户切换路由时，分析服务会收到通知。

## 从 React Navigation 迁移

React Navigation 的[屏幕追踪指南](https://reactnavigation.org/docs/screen-tracking/)无法像 Expo Router 那样对导航状态做出同样的假设。因此它的实现需要使用 `onReady` 与 `onStateChange` 回调。请尽量避免这些方法，因为根 `<NavigationContainer />` 并未直接暴露，且 Expo Router 允许级联。
