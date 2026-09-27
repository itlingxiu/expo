---
title: 路由设置
description: 了解如何在 Expo Router 中用静态属性配置布局。
---

# 路由设置

:::warning
`unstable_settings` 目前无法与[异步路由](/router/web/async-routes)配合使用（仅开发环境）。因此该功能被标记为 _unstable_。
:::

## anchor

深层链接到某条路由时，你可能希望为用户提供一个“返回”按钮。`anchor` 用于设置栈的默认屏幕，并且应当匹配一个有效的文件名（不含扩展名）。

```text
src/app/_layout.tsx
src/app/index.tsx
src/app/other.tsx
```

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  // 确保任意路由都能链回 `/`
  anchor: 'index',
};

export default function Layout() {
  return <Stack />;
}
```

现在直接深层链接到 `/other`，或重新加载页面，仍会显示返回箭头。

使用[数组语法](/router/advanced/shared-routes#数组) `(foo,bar)` 时，可以在 `unstable_settings` 对象中指定分组名称，以针对特定片段。

```tsx other.tsx
export const unstable_settings = {
  // 用于 `(foo)`
  anchor: 'first',
  // 用于 `(bar)`
  bar: {
    anchor: 'second',
  },
};
```

`anchor` 仅在深层链接到某条路由时使用。应用内导航时，你正在前往的路由会成为锚点路由。若还希望在目标路由下方加载锚点路由，请在 `<Link />` 组件上使用 `withAnchor` 属性。命令式 API 接受相同的选项。

```js
// 若这会导航到新的 _layout，则在目标路由下方加载锚点路由
<Link href="/route" withAnchor />;

router.push('/route', { withAnchor: true });
```

## initialRouteName

:::warning
`initialRouteName` 已弃用。请改用 [`anchor`](#anchor)。
:::
