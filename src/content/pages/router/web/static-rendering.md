---
title: 静态渲染
description: 了解如何使用 Expo Router 把路由渲染为静态 HTML 和 CSS 文件。
---

# 静态渲染

要在 Web 上启用搜索引擎优化（SEO），必须静态渲染应用。本指南会带你完成静态渲染 Expo Router 应用的过程。

:::note
使用静态渲染时，[数据加载器](/router/web/data-loaders)会在构建过程中执行，其结果会嵌入输出的 HTML 文件。
:::

## 设置

1. 在项目的[应用配置](/versions/latest/config/app)中启用静态渲染：

   ```json app.json
   {
     "expo": {
       /* @hide 省略 ... */
       /* @end */
       "web": {
         "output": "static"
       }
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

在 SDK 58 及更高版本中，可以在 `expo-router` 配置插件中设置 `apiRoutes: true`，把静态渲染与 [API 路由](/router/web/api-routes#创建-api-路由)结合起来。这会把预渲染 HTML 和 API 路由导出到 **dist/server**，客户端资源放在 **dist/client**，并且需要已部署的服务器。

要为生产环境打包静态网站，运行导出命令：

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

这会创建一个包含静态渲染网站的 **dist** 目录。如果本地 **public** 目录中有文件，它们也会被复制过去。启用 API 路由时，使用 `npx expo serve` 在本地测试生产构建。否则，运行以下命令并在浏览器中打开链接的 URL：

:::tabs
:::tab npm
```sh
npx serve dist
```
:::
:::tab yarn
```sh
yarn dlx serve dist
```
:::
:::tab pnpm
```sh
pnpm dlx serve dist
```
:::
:::tab bun
```sh
bunx serve dist
```
:::
:::

禁用 API 路由时，此项目几乎可以部署到每一种托管服务。请注意，这不是单页应用，也不包含自定义服务器 API。这意味着动态路由（例如 **src/app/[id].tsx**）不会任意生效。你可能需要构建一个无服务器函数来处理动态路由。

## 动态路由

`static` 输出会为每条路由生成 HTML 文件。这意味着动态路由（**src/app/[id].tsx**）不会开箱即用。可以使用 `generateStaticParams` 函数提前生成已知路由。

```tsx src/app/blog/[id].tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/* @info 此方法在构建时于 Node.js 环境中运行。 */
export async function generateStaticParams(): Promise<Record<string, string>[]> {
  /* @end */
  const posts = await getPosts();
  // 返回参数数组，以便为其生成静态 HTML 文件。
  // 数组中的每一项都会成为新页面。
  return posts.map(post => ({ id: post.id }));
}

export default function Page() {
  const { id } = useLocalSearchParams();

  return <Text>Post {id}</Text>;
}
```

这会在 **dist** 目录中为每篇帖子输出一个文件。例如，如果 `generateStaticParams` 方法返回 `[{ id: "alpha" }, { id: "beta" }]`，会生成以下文件：

```text
dist/blog/alpha.html
dist/blog/beta.html
```

### generateStaticParams

仅在服务器上、由 Expo CLI 于构建时在 Node.js 环境中求值的函数。这意味着它可以访问 `__dirname`、`process.cwd()`、`process.env` 等。它也可以访问进程中可用的每个环境变量。不过，以 `EXPO_PUBLIC_` 为前缀的值不会在浏览器环境中运行，因此它无法访问 `localStorage` 或 `document` 等浏览器 API。它也无法访问 `expo-camera` 或 `expo-location` 等原生 Expo API。

```tsx src/app/[id].tsx
export async function generateStaticParams(): Promise<Record<string, string>[]> {
  /* @info 打印当前工作目录 */
  console.log(process.cwd());
  /* @end */

  return [];
}
```

`generateStaticParams` 从嵌套的父级向下级联到子级。级联参数会传给每个导出 **generateStaticParams** 的动态子路由。

```tsx src/app/[id]/_layout.tsx
export async function generateStaticParams(): Promise<Record<string, string>[]> {
  /* @info 任何导出 `generateStaticParams` 的动态子路由都会为数组中的每一项调用一次。 */
  return [{ id: 'one' }, { id: 'two' }];
  /* @end */
}
```

现在动态子路由会被调用两次，一次使用 `{ id: 'one' }`，一次使用 `{ id: 'two' }`。必须覆盖所有变体。

```tsx src/app/[id]/[comment].tsx
export async function generateStaticParams(params: {
  id: 'one' | 'two';
}): Promise<Record<string, string>[]> {
  const comments = await getComments(params.id);
  return comments.map(comment => ({
    /* @info 确保父级属性也被向下传递。 */
    ...params,
    /* @end */
    comment: comment.id,
  }));
}
```

### 使用 `process.cwd()` 读取文件

由于 Expo Router 会把代码编译到单独的目录，不能用 `__dirname` 组成路径，因为它的值会与预期不同。

请改用 `process.cwd()`，它给出项目正在被编译的目录。

```tsx src/app/[category].tsx
import fs from 'node:fs/promises';
import path from 'node:path';

export async function generateStaticParams(params: {
  id: string;
}): Promise<Record<string, string>[]> {
  const directory = await fs.readdir(path.join(process.cwd(), './posts/'));
  const posts = directory.filter(fileOrSubDirectory => return path.extname(fileOrSubDirectory) === '.md')

  return [{
    id,
    posts,
  }];
}
```

## 根 HTML

默认情况下，每个页面都会被一小段 HTML 样板包裹，这称为**根 HTML**。

可以通过在项目中创建 **src/app/+html.tsx** 文件来自定义根 HTML 文件。此文件导出一个只在 Node.js 中运行的 React 组件，这意味着不能在其中导入全局 CSS。该组件会包裹 **app** 目录中的所有路由。这对于添加全局 `<head>` 元素或禁用 body 滚动很有用。

:::note
全局 context provider 应放在[根布局](/router/basics/navigation-layouts#根布局)组件中，而不是根 HTML 组件中。
:::

```tsx src/app/+html.tsx
import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// 此文件仅用于 Web，并在静态渲染期间为每个
// Web 页面配置根 HTML。
// 此函数的内容只在 Node.js 环境中运行，
// 无法访问 DOM 或浏览器 API。
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/*
          在 Web 上禁用 body 滚动。这使 ScrollView 组件的行为更接近原生平台。
          不过，对移动 Web 来说，body 滚动通常是有益的。如果想启用它，请删除此行。
        */}
        <ScrollViewStyleReset />

        {/* 添加你希望在 Web 上全局可用的任何额外 <head> 元素... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- `children` 属性已经包含根 `<div id="root" />` 标签。
- JavaScript 脚本会附加在静态渲染之后。
- React Native Web 样式会被自动静态注入。
- 不应把全局 CSS 导入此文件。请改用[根布局](/router/basics/navigation-layouts#根布局)。Expo Router 从根布局开始遍历依赖图，因此在其他地方导入 CSS 可能导致意外的加载顺序，使 **node_modules** 的 CSS 优先于你的自定义样式。
- 此组件中无法使用 `window.location` 等浏览器 API，因为它只在静态渲染期间于 Node.js 中运行。

### `expo-router/html`

`expo-router/html` 的导出与根 HTML 组件相关。

- `ScrollViewStyleReset`：带有根 `<ScrollView />` 的全屏 [React Native Web 应用](https://necolas.github.io/react-native-web/docs/setup/#root-element)的根样式重置，应使用以下样式以确保与原生一致。

## Meta 标签

可以用 `expo-router` 中的 `<Head />` 模块向页面添加 meta 标签：

```tsx src/app/about.tsx
import Head from 'expo-router/head';
import { Text } from 'react-native';

export default function Page() {
  return (
    <>
      <Head>
        <title>My Blog Website</title>
        <meta name="description" content="This is my blog." />
      </Head>
      <Text>About my blog</Text>
    </>
  );
}
```

可以使用同一 API 动态更新 head 元素。不过，为了 SEO，提前渲染静态 head 元素是有用的。

## 静态文件

Expo CLI 支持根目录下的 **public** 目录，静态渲染期间它会被复制到 **dist** 目录。这对于添加图片、字体和其他资源等静态文件很有用。

```text
public/favicon.ico
public/logo.png
public/.well-known/apple-app-site-association
```

:::warning
`/assets` 等某些路径由 Metro 保留。避免把文件放在 **public/assets/** 或其他保留路径中。完整列表见[保留路径](/router/reference/reserved-paths)。
:::

静态渲染期间，这些文件会被复制到 **dist** 目录：

```text
dist/index.html
dist/favicon.ico
dist/logo.png
dist/.well-known/apple-app-site-association
dist/_expo/static/js/index-xxx.js
dist/_expo/static/css/index-xxx.css
```

:::note
**仅 Web**：可以在运行时代码中使用相对路径访问静态资源。例如，可以在 `/logo.png` 访问 **logo.png**：
:::

```tsx src/app/index.tsx
import { Image } from 'react-native';

export default function Page() {
  return <Image source={{ uri: '/logo.png' }} />;
}
```

## 字体

Expo Font 在 Expo Router 中对字体加载有自动静态优化。用 `expo-font` 加载字体时，Expo CLI 会自动提取字体资源并嵌入页面 HTML，从而启用预加载、更快的水合，并减少布局偏移。

下面的片段会把 Inter 加载到命名空间中，并在 Web 上进行静态优化：

```tsx src/app/home.tsx
import { Text } from 'react-native';
import { useFonts } from 'expo-font';

export default function App() {
  /* @info Expo CLI 会在编译期间自动查找并提取此字体。 */
  const [isLoaded] = useFonts({
    /* @end */
    inter: require('@/assets/inter.ttf'),
  });

  /* @info 启用静态渲染时，在 Web 上始终为 true。 */
  if (!isLoaded) {
    /* @end */
    return null;
  }

  return <Text style={{ fontFamily: 'inter' }}>Hello Universe</Text>;
}
```

这会生成以下静态 HTML：

```html dist/home.html
/* @info 在 JavaScript 加载之前预加载字体。 */
<link rel="preload" href="/assets/inter.ttf" as="font" crossorigin />
/* @end */
<style id="expo-generated-fonts" type="text/css">
  @font-face {
    font-family: inter;
    src: url(/assets/inter.ttf);
    font-display: auto;
  }
</style>
```

- 静态字体优化要求同步加载字体。如果字体没有被静态优化，可能是因为它在 `useEffect`、延迟组件或异步函数内部加载。
- 静态优化仅支持 `expo-font` 的 `Font.loadAsync` 和 `Font.useFonts`。只要包装函数是同步的，就支持包装函数。

## 常见问题

### 如何添加自定义服务器？

没有规定的方式来添加自定义服务器。你可以使用任何想用的服务器。不过，你需要自己处理动态路由。可以使用 `generateStaticParams` 函数为已知路由生成静态 HTML 文件。

在 SDK 58 及更高版本中，在 `expo-router` 配置插件中设置 `apiRoutes: true`，以便在静态 HTML 旁边[添加 API 路由](/router/web/api-routes#创建-api-路由)。要在请求时渲染页面，请使用[服务器渲染](/router/web/server-rendering)。

## 服务器端渲染

`web.output: 'static'` 不支持请求时渲染。要在每个请求上动态渲染页面，请改用 `web.output: 'server'` 的[服务器渲染](/router/web/server-rendering)。

### 可以把静态渲染的网站部署到哪里？

可以把静态渲染的网站部署到任何静态托管服务。以下是一些常见选项：

- [EAS Hosting](/eas/hosting/introduction)
- [Netlify](https://www.netlify.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [Vercel](https://vercel.com/)
- [GitHub Pages](https://pages.github.com/)
- [Render](https://render.com/)
- [Surge](https://surge.sh/)

:::note
不需要向静态托管服务添加单页应用风格的重定向。静态网站不是单页应用。它是一组静态 HTML 文件。
:::
