---
title: Expo Router 标记
description: 了解如何使用特殊文件名和标记，在项目文件结构中清晰地定义应用的导航树。
---

# Expo Router 标记

在典型的 Expo Router 项目中打开 **src/app** 目录，你会看到的远不止一些简单的文件名和目录名。圆括号和方括号是什么意思？下面说明基于文件的路由标记有何意义，以及它如何让你定义复杂的导航模式。

## 路由标记的类型

### 简单名称/无标记

```text
src/app/home.tsx
src/app/feed/favorites.tsx
```

没有任何标记的普通文件名和目录名表示_静态路由_。它们的 URL 与文件树中的路径完全一致。因此，**feed** 目录中名为 **favorites.tsx** 的文件，URL 为 `/feed/favorites`。

### 方括号

```text
src/app/[userName].tsx
src/app/products/[productId]/index.tsx
```

如果文件名或目录名中出现方括号，你看到的就是_动态路由_。路由名称包含一个可在渲染页面时使用的参数。参数可以位于目录名或文件名中。例如，名为 **[userName].tsx** 的文件会匹配 `/evanbacon`、`/expo` 或其他用户名。然后可以在页面内用 `useLocalSearchParams` hook 访问该参数，并据此加载该用户的数据。

### 圆括号

```text
src/app/(home)/index.tsx
src/app/(home)/settings.tsx
```

名称被圆括号包围的目录表示一个_路由组_。这些目录用于把路由归组，同时不影响 URL。例如，名为 **src/app/(home)/settings.tsx** 的文件，URL 是 `/settings`，尽管它并不直接位于 **src/app** 目录中。

路由组可以用于简单的组织，但更常见的用途是定义路由之间的复杂关系。

### index.tsx 文件

```text
src/app/(home)/index.tsx
src/app/profile/index.tsx
```

与 Web 一样，**index.tsx** 文件表示某个目录的默认路由。例如，名为 **profile/index.tsx** 的文件会匹配 `/profile`。名为 **(home)/index.tsx** 的文件会匹配 `/`，从而成为整个应用的默认路由。

### _layout.tsx 文件

```text
src/app/_layout.tsx
src/app/(home)/_layout.tsx
src/app/feed/_layout.tsx
```

**\_layout.tsx** 文件比较特殊：它们本身不是页面，而是定义目录内一组路由之间的关系。如果一组路由被安排成栈或标签页，就在布局路由中用栈导航器或标签页导航器组件定义这种关系。

布局路由会在其目录内的实际页面路由之前渲染。这意味着 **src/app** 目录中直接放置的 **\_layout.tsx** 会在应用中的其他任何内容之前渲染，以前可能放在 **App.jsx** 中的初始化代码就应该放在这里。

### 加号

```text
src/app/+not-found.tsx
src/app/+html.tsx
src/app/+native-intent.tsx
src/app/+middleware.ts
```

包含 `+` 的路由对 Expo Router 有特殊意义，用于特定用途。例如：

- [`+not-found`](/router/error-handling#未匹配的路由) 会捕获所有不匹配应用中任何路由的请求。
- [`+html`](/router/web/static-rendering#根-html) 用于自定义应用在 Web 上使用的 HTML 样板。
- [`+native-intent`](/router/advanced/native-intent) 用于处理进入应用、但不匹配特定路由的深层链接，例如第三方服务生成的链接。
- [`+middleware`](/router/web/middleware) 用于在路由渲染之前运行代码，从而对每个请求执行认证或重定向等任务。

:::warning
某些路径名（例如 `/assets`）由 Metro 和 Expo Router 保留。避免将它们用作路由。完整列表见[保留路径](/router/reference/reserved-paths)。
:::

## 路由标记的应用

考虑以下项目文件结构，以识别其中表示的不同路由类型：

```text
src/app/(home)/_layout.tsx
src/app/(home)/index.tsx
src/app/(home)/feed.tsx
src/app/(home)/profile.tsx
src/app/_layout.tsx
src/app/users/[userId].tsx
src/app/+not-found.tsx
src/app/about.tsx
```

- **src/app/about.tsx** 是匹配 `/about` 的静态路由。
- **src/app/users/[userId].tsx** 是动态路由，匹配 `/users/123`、`/users/456` 等。
- **src/app/(home)** 是路由组。它不会进入 URL，因此 `/feed` 会匹配 **src/app/(home)/feed.tsx**。
- **src/app/(home)/index.tsx** 是 **(home)** 目录的默认路由，会匹配 `/` URL。
- **src/app/(home)/\_layout.tsx** 是布局文件，定义 **src/app/(home)/** 内各页面之间的关系。
- **src/app/\_layout.tsx** 是根布局文件，会在应用中的任何其他路由之前渲染。
- **src/app/+not-found.tsx** 是特殊路由，当用户导航到应用中不存在的路由时会显示它。
