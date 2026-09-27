---
title: 共享路由
description: 了解如何用 Expo Router 定义共享路由，或使用数组让同一条路由以不同布局多次出现。
---

# 共享路由

要用不同布局匹配同一个 URL，请使用带有重叠子路由的[**分组**](/router/basics/notation#圆括号)。这种模式在原生应用中非常常见。例如在 X 应用中，每个标签页（如首页、搜索和个人资料）都可以查看个人资料。但访问这条路由只需要一个 URL。

在下面的示例中，**src/app/\_layout.tsx** 是标签栏，每条路由都有自己的标题栏。**src/app/(profile)/[user].tsx** 路由在各个标签页之间共享。

```text
src/app/_layout.tsx
src/app/(home)/_layout.tsx
src/app/(home)/[user].tsx
src/app/(search)/_layout.tsx
src/app/(search)/[user].tsx
src/app/(profile)/_layout.tsx
src/app/(profile)/[user].tsx
```

分组片段不属于 URL，因此每条共享路由都匹配同一个 URL。Expo Router 根据你当前所在的分组来选择其中一条。应用内导航会保持当前分组。页面重新加载、书签、分享的 URL 和深层链接都是冷链接。冷链接没有当前分组，因此 Expo Router 会渲染按字母顺序的第一个匹配项。同一个 URL 在应用内导航后可能渲染一个屏幕，在页面重新加载后则渲染另一个屏幕。

共享路由可以通过在路由中包含分组名称直接导航。例如，`/(search)/baconbrix` 会在 “search” 布局中导航到 `/baconbrix`。当链接必须始终打开某一个特定分组时，使用这种形式。

:::warning
不要用共享路由给不同用户角色提供同一屏幕的不同版本。URL 不携带用户角色，因此冷链接无法选择正确的分组，[受保护路由](/router/advanced/protected)也不会改变这一点。只声明一次该屏幕，并用 `Stack.Protected` 控制访问。
:::

## 数组

> 数组语法是原生应用开发特有的高级概念。

与其用不同布局多次定义同一条路由，不如使用数组语法 `(,)` 来复制一个分组的子路由。例如，`src/app/(home,search)/[user].tsx` 会在内存中创建 `src/app/(home)/[user].tsx` 和 `src/app/(search)/[user].tsx`。

要用布局的 `segment` 属性区分这两条路由：

```tsx src/app/(home,search)/_layout.tsx
export default function DynamicLayout({ segment }) {
  if (segment === '(search)') {
    return <SearchStack />;
  }

  return <Stack />;
}
```

要启用**数组语法**，请在动态布局中用 `unstable_settings` 对象为每个分组指定 [`anchor`](/router/advanced/router-settings#anchor)：

```tsx src/app/(home,search)/_layout.tsx
export const unstable_settings = {
  anchor: 'home',
  search: {
    anchor: 'search',
  },
};

export default function DynamicLayout({ segment }) {
  /* @hide 省略 ... */ /* @end */
}
```

在上面的示例中，`home` 路由是 `home` 分组以及应用的默认路由。`search` 路由是 `search` 分组的默认路由。

## 要点

- 只能为当前导航器提供分组。
- 使用数组语法时，如果有两个分组（例如 `(one)/(two)`），只有最后一个分组的片段会用于匹配路由。
- 如果至少有两个分组锚点，但没有提供默认 `anchor`，则使用第一个分组的锚点。
