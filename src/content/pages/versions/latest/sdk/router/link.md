---
title: 'expo-router Link 参考'
description: 提供 Link、Redirect、preview 和 zoom 过渡组件的 Expo Router API。
---

# expo-router Link 参考

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

一个 Expo Router API，提供用于在路由之间导航的组件，包括链接、重定向、预览和缩放过渡。

> 有关安装和配置，请参阅 [Expo Router](/versions/latest/sdk/router) 参考。

## 用法

```tsx
import { Link } from 'expo-router';

export default function Page() {
  return <Link href="/about">About</Link>;
}
```

有关在路由之间导航的更多信息，请阅读导航指南：

- [在页面之间导航](/router/basics/navigation)：了解如何在 Expo Router 中于页面之间导航。

## API

```js
import { Link, Redirect } from 'expo-router';
```
