---
title: 服务器渲染
description: 了解如何使用服务器端渲染（SSR）在请求时动态渲染 Expo Router 路由。
---

# 服务器渲染

:::warning
服务器渲染在 SDK 58 及更高版本中已稳定。对于 SDK 55–57，请在 `expo-router` 配置插件中启用 `unstable_useServerRendering`。生产环境使用需要[已部署的服务器](/router/web/api-routes#部署)。
:::

服务器端渲染（SSR）在每个请求上动态生成 HTML，而[静态渲染](/router/web/static-rendering)则在构建时预渲染 HTML。本指南带你为 Expo Router 应用启用服务器渲染。

:::note
使用服务器端渲染时，[数据加载器](/router/web/data-loaders)会在服务器上为每个请求执行，结果会嵌入 HTML 响应。
:::

## 设置

要保持 SDK 57 及更早版本中 `web.output: "server"` 的行为，请在 `expo-router` 配置插件中使用 `web.output: "static"` 并设置 `apiRoutes: true`。这会把[预渲染 HTML 与 API 路由](/router/web/api-routes#创建-api-路由)结合起来。

1. 在项目的[应用配置](/versions/latest/config/app)中把 `web.output` 设为 `server`，以启用服务器渲染：

   ```json app.json
   {
     "expo": {
       /* @hide 省略 ... */
       /* @end */
       "web": {
         "output": "server"
       },
       "plugins": ["expo-router"]
     }
   }
   ```

2. 启动开发服务器：

   :::tabs
   :::tab npm
   ```sh
   npx expo start
   ```
   :::
   :::tab yarn
   ```sh
   yarn expo start
   ```
   :::
   :::tab pnpm
   ```sh
   pnpm expo start
   ```
   :::
   :::tab bun
   ```sh
   bun expo start
   ```
   :::
   :::

## 生产环境

要为生产环境导出应用，运行导出命令：

:::tabs
:::tab npm
```sh
npx expo export --platform web
```
:::
:::tab yarn
```sh
yarn expo export --platform web
```
:::
:::tab pnpm
```sh
pnpm expo export --platform web
```
:::
:::tab bun
```sh
bun expo export --platform web
```
:::
:::

这会创建一个包含服务器渲染应用的 **dist** 目录。与静态渲染不同，不会预生成 HTML 文件。输出包含如下所示的类似目录结构：

```text
dist/client/_expo/static/js/web/entry-[hash].js
dist/client/_expo/static/css/[name]-[hash].css
dist/server/_expo/routes.json
dist/server/_expo/server/render.js
```

上面的输出在 **dist** 目录内包含以下目录：

- **client** 目录：包含用于客户端水合的 JavaScript 和 CSS bundle
- **server** 目录：包含路由清单和服务器渲染模块

可以运行以下命令并在浏览器中打开链接的 URL，在本地测试生产构建：

:::tabs
:::tab npm
```sh
npx expo serve
```
:::
:::tab yarn
```sh
yarn expo serve
```
:::
:::tab pnpm
```sh
pnpm expo serve
```
:::
:::tab bun
```sh
bun expo serve
```
:::
:::

上面的命令会启动一个本地服务器，在每个请求上渲染页面，以模拟生产环境。

## 动态路由

使用服务器渲染时，动态路由会即时渲染，不需要 [`generateStaticParams`](/router/web/static-rendering#generatestaticparams) 导出，并且应当移除它。如果路由文件导出了 `generateStaticParams`，这些路由会改为动态处理。路由会在请求时用 URL 中的实际参数渲染。

```tsx src/app/blog/[id].tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { id } = useLocalSearchParams();

  /* @info id 参数可立即从 URL 获得 */
  return <Text>Post {id}</Text>;
  /* @end */
}
```

在上面的示例中，当应用用户访问 `/blog/my-post` 时，页面会在服务器上以 `id` 为 `"my-post"` 渲染。

## 根 HTML

可以通过创建 **src/app/+html.tsx** 文件来自定义根 HTML 文档。此组件包裹所有路由，并且只在服务器上运行。

`expo-router/html` 中的 [`useServerDocumentContext`](/versions/latest/sdk/router#useserverdocumentcontext) hook 提供服务器渲染器注入文档的元数据和资源节点。必须把这些值展开到 HTML 中，以确保元数据、字体、CSS 和 JavaScript bundle 包含在响应中：

- `htmlAttributes`：添加到 `<html>` 元素的属性
- `bodyAttributes`：添加到 `<body>` 元素的属性
- `headNodes`：用于 `<head>` 元素的 React 节点（元数据、CSS 和其他资源）
- `bodyNodes`：用于 `<body>` 元素的 React 节点（水合所需的字体和 JavaScript bundle）。省略它们会阻止应用水合并变得可交互。

:::note
创建自定义 **+html.tsx** 模板时，必须使用 [`useServerDocumentContext`](/versions/latest/sdk/router#useserverdocumentcontext) 返回的全部属性。否则，服务器端渲染的 HTML 可能看起来损坏，或应用无法正确工作。
:::

```tsx src/app/+html.tsx
import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { ReactNode } from 'react';

// 此文件仅用于 Web，并在服务器渲染期间为每个
// Web 页面配置根 HTML。
// 此函数的内容只在 Node.js 环境中运行，
// 无法访问 DOM 或浏览器 API。
export default function Root({ children }: { children: ReactNode }) {
  const { bodyAttributes, bodyNodes, htmlAttributes, headNodes } = useServerDocumentContext();

  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/*
          在 Web 上禁用 body 滚动。这使 ScrollView 组件的行为更接近原生平台。
          不过，对移动 Web 来说，body 滚动通常是有益的。如果想启用它，请删除此行。
        */}
        <ScrollViewStyleReset />

        {headNodes}

        {/* 添加你希望在 Web 上全局可用的任何额外 <head> 元素... */}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
```

**+html.tsx** 文件只被服务器渲染器使用，从不被客户端代码使用。这意味着：

- 它会在服务器渲染期间由 `expo-server` 运行
- 它不会在客户端重新水合，并且只应使用 [`useServerDocumentContext`](/versions/latest/sdk/router#useserverdocumentcontext) React hook
- 不能在 `+html.tsx` 中导入全局 CSS（样式请使用[根布局](/router/basics/navigation-layouts#根布局)）
- 不能在 `+html.tsx` 中调用 `window` 或 `document` 等浏览器 API

所有 `+html.tsx` 组件都应在其 JSX 内容中渲染它们接收到的 `children` 属性。

## 元数据

路由可以导出 [`generateMetadata`](/versions/latest/sdk/server#generatemetadatafunctionrequest-params) 函数，以定义每页元数据，例如标题、描述和 [Open Graph](https://ogp.me/) 标签。此函数在渲染开始之前于服务器上运行，其结果会通过[根 HTML](#根-html)组件中 [`useServerDocumentContext`](/versions/latest/sdk/router#useserverdocumentcontext) 提供的 `headNodes` 注入 HTML 文档的 `<head>`。

从路由文件导出 [`generateMetadata`](/versions/latest/sdk/server#generatemetadatafunctionrequest-params) 函数并返回 [`Metadata`](/versions/latest/sdk/server#metadata) 对象。该函数接收传入请求和路由参数，你可以用它们动态生成元数据：

```tsx src/app/blog/[id].tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import type { GenerateMetadataFunction } from 'expo-router/server';

export const generateMetadata: GenerateMetadataFunction = async (request, params) => {
  const response = await fetch(`https://api.example.com/posts/${params.id}`);
  const post = await response.json();

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage,
    },
  };
};

export default function BlogPost() {
  const { id } = useLocalSearchParams();
  return <Text>Post {id}</Text>;
}
```

`generateMetadata` 函数在服务器上执行，并从客户端 bundle 中剥离，类似于[数据加载器](/router/web/data-loaders)。支持的元数据字段完整列表见 `expo-server` API 参考中的 [`Metadata`](/versions/latest/sdk/server#metadata) 类型。

### 在服务器渲染中使用 Head

也可以使用 `expo-router/head` 中的 `<Head>` 组件添加 `<meta>` 标签。两种方式可以在同一路由中共存。不过，对于服务器渲染，推荐使用 `generateMetadata`，因为它在 HTML 流开始之前解析元数据，确保 `<meta>` 标签包含在响应最早的字节中。`<Head>` 可用于在应用水合之后动态更新 `<meta>` 标签。

## 部署

服务器端渲染需要运行时服务器在每个请求上渲染页面。服务器端渲染的 Expo 应用**不能**部署到 GitHub Pages 等静态托管服务。

### 支持的平台

| 平台 | 适配器 |
| --- | --- |
| [EAS Hosting](/eas/hosting/introduction) | 内置 |
| Node.js/Express | `expo-server/adapter/express` |
| Cloudflare Workers | `expo-server/adapter/workerd` |
| Vercel Edge Functions | `expo-server/adapter/vercel` |
| Netlify Edge Functions | `expo-server/adapter/netlify` |
| Bun | `expo-server/adapter/bun` |

<details>
<summary>示例：使用 EAS Hosting 部署</summary>

EAS Hosting 开箱支持服务器渲染。导出应用并部署：

:::tabs
:::tab npm
```sh
npx expo export --platform web

npx eas-cli@latest hosting:deploy dist
```
:::
:::tab yarn
```sh
yarn expo export --platform web

yarn dlx eas-cli@latest hosting:deploy dist
```
:::
:::tab pnpm
```sh
pnpm expo export --platform web

pnpm dlx eas-cli@latest hosting:deploy dist
```
:::
:::tab bun
```sh
bun expo export --platform web

bunx eas-cli@latest hosting:deploy dist
```
:::
:::

</details>

## 与静态渲染的比较

| 特性 | 静态渲染 | 服务器渲染 |
| --- | --- | --- |
| HTML 生成 | 构建时 | 请求时 |
| HTML 交付 | 完整文档 | 渐进式流式传输 |
| 配置 | `web.output: 'static'` | `web.output: 'server'` |
| 动态路由 | 需要 [`generateStaticParams`](/router/web/static-rendering#generatestaticparams) | 自动工作 |
| 元数据 | [`<Head>`](#在服务器渲染中使用-head) 组件 | [`generateMetadata`](#元数据) |
| 需要服务器 | 否 | 是 |
| 首字节时间 | 最快（已缓存） | 较慢（按请求渲染） |
| 托管 | 任意静态主机 | 需要服务器运行时 |

## 常见问题

<details>
<summary>可以在服务器渲染中使用数据加载器吗？</summary>

可以。服务器渲染可以与[数据加载器](/router/web/data-loaders)一起工作，在渲染之前于服务器上获取数据。

</details>

<details>
<summary>可以混合服务器渲染和静态渲染吗？</summary>

目前，Expo Router 不支持在同一项目中混合服务器渲染和静态渲染。请根据需求选择单一输出模式。

</details>

<details>
<summary>如何缓存服务器渲染的响应？</summary>

缓存在服务器或 CDN 层处理。配置部署平台，根据 URL 模式或缓存请求头缓存响应。

</details>

<details>
<summary>服务器渲染可以与 API 路由一起工作吗？</summary>

可以。[API 路由](/router/web/api-routes)独立于渲染模式工作。它们始终在服务器上执行。

</details>
