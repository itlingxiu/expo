---
title: 从 Expo Webpack 迁移
description: 了解如何把使用 Expo Webpack 的网站迁移到 Expo Router。
---

# 从 Expo Webpack 迁移

最初的 **Expo for web** 版本基于 Webpack 4，主要专注于构建单页应用（SPA）。这种方法基于 [Create React App](https://create-react-app.dev/)，可以用 Expo SDK 和 React Native for web 构建简单的 Web 应用。

Expo Router 是构建能在 Web 和原生平台上运行的强大通用应用的新方法。本指南将帮助你把现有网站迁移到 Expo Router。

## 优势

:::warning
`@expo/webpack-config` 已[弃用](/more/release-statuses#deprecated)，不再接收任何新功能更新。
:::

与 Expo Webpack 不同，Expo Router 支持 [Web 上的静态渲染](/router/web/static-rendering)，从而实现搜索引擎优化（SEO）、社交媒体预览和更快的加载时间。除了 React Navigation 的好处之外，它还支持自动深层链接、[类型安全](/router/reference/typed-routes)、[延迟打包](/router/web/async-routes)、[模块化 HTML 模板](/router/web/static-rendering#根-html)、[Web 上的静态渲染](/router/web/static-rendering)等。

Expo Router 的设计也是为了解决 Expo Webpack 的主要跨平台问题：在 Web 和原生之间共享导航，同时不牺牲功能或性能。

## 不适用的情况

Expo Router 使用基于 [Metro](https://metrobundler.dev/) 的自定义打包器栈。它与 React Native 使用的是同一个打包器。这有助于确保最大程度的代码复用，并解决跨平台使用不同打包器时许多行为分叉的问题。这也意味着某些打包功能在 Expo Router 中可能尚不可用。

Expo Router 是一个完整的通用框架，而 `@expo/webpack-config` 只是一个打包器集成。所有新的 Expo Web 项目都应使用 Expo Router。

## Expo CLI

与 `@expo/webpack-config` 不同，Expo Router 对 Web 和原生使用相同的 CLI 命令和功能。下表说明 Expo Router 与 `@expo/webpack-config` 的差异。

| 功能 | Expo Router | `@expo/webpack-config` |
| --- | --- | --- |
| 启动命令 | `npx expo start` | `npx expo start` |
| 打包命令 | `npx expo export` | `npx expo export:web` |
| 输出目录 | **dist** | **web-build** |
| 静态目录 | **public** | **web** |
| 配置文件 | **metro.config.js** | **webpack.config.js** |
| 默认配置 | `@expo/metro-config` | `@expo/webpack-config` |
| Bundle 拆分 | 是（SDK 50 • Web） | 是 |
| 全局 CSS | 是（SDK 50 • Web） | 是 |
| CSS Modules | 是（SDK 50 • Web） | 否 |
| 静态字体优化 | 是（SDK 50 • Web） | 否 |
| API 路由 | 是（SDK 50） | 否 |
| 多平台 | 是 | 否 |
| Fast Refresh | 是 | 否 |
| 错误遮罩 | 是 | 否 |
| 惰性打包 | 是 | 否 |
| 静态生成 | 是 | 否 |
| 环境变量 | 是 | 否 |
| `tsconfig.json` 路径 | 是 | 否 |
| Tree Shaking | 部分（[部分支持](/guides/tree-shaking)） | 是 |

## HTML 模板

在 `@expo/webpack-config` 中，所有路由共享单个 HTML 文件。该文件基于 `web/index.html` 中的模板，然后由 `@expo/webpack-config` 修改以包含必要的脚本和样式表。

在 Expo Router 中，有两种不同的渲染模式：

- **推荐**：`web.output: "static"`，为应用中的每条路由输出一个新的 HTML 文件。这种方法让你[使用 **src/app/+html.tsx** 文件动态生成整个 HTML 模板](/router/web/static-rendering#根-html)。
- **不推荐**：`web.output: "single"`，输出单页应用。这种方法让你使用 `public/index.html` 作为模板 HTML 文件。

## 静态资源

在 `@expo/webpack-config` 中，可以把静态文件放在 `web` 目录中，它们会从网站根路径提供。例如，`web/favicon.ico` 从 `https://example.com/favicon.ico` 提供。

在 Expo Router 中，可以使用 **public** 目录托管静态文件。例如，**public/favicon.ico** 从 `https://example.com/favicon.ico` 提供。与 Webpack 不同，Expo Router 的托管在原生平台上也有效。在生产环境中使用这些文件之前，请确保从服务器托管它们。

## 为生产环境打包

在 `@expo/webpack-config` 中，可以使用 `npx expo export:web` 为生产环境打包网站。这会把 bundle 输出到 **web-build** 目录。

在 Expo Router 中，使用 `npx expo export --platform web` 命令导出到 **dist** 目录。可以用 `--dump-sourcemap` 标志生成 sourcemap。构建时，**public** 目录的内容会被复制到 **dist** 目录。

## Babel 配置

和以前一样，根目录的 [**babel.config.js**](/versions/latest/config/babel) 文件同时用于 Web 和原生。可以通过 API caller 中的 `platform` 属性更改 preset：

```js babel.config.js
module.exports = api => {
  // 从 API caller 获取平台...
  const platform = api.caller(caller => caller && caller.platform);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 添加仅 Web 的插件...
      platform === 'web' && 'custom-web-only-plugin',
    ].filter(Boolean),
  };
};
```

## 开发服务器

在 Expo Router 中，所有平台都从同一端口上的同一个开发服务器托管。这便于模拟应用的生产行为。所有日志和热模块重载也经过同一端口。

由于原生平台的限制，目前不支持使用伪造的 HTTPS 进行托管。这一功能现在不如 2018 年那么重要，因为可以使用 Chrome 等 Web 浏览器在 localhost 上测试相机和位置等安全功能。

## Expo constants

[`expo-constants`](/versions/latest/sdk/constants) 库可用于在应用内访问 **app.json**。在幕后，这是通过把 **app.json** 文件的字符串化内容设置到 `process.env.APP_MANIFEST` 来完成的。

在 Expo Router 中，这通过 Babel 和 `babel-preset-expo` 完成。如果修改了 **app.json**，请用 `npx expo start --clear` 重启 Babel 缓存以看到更新。

## 基础路径与子路径托管

:::warning
[实验性](/more/release-statuses#experimental)功能。
:::

在 `@expo/webpack-config` 中，可以通过 `PUBLIC_URL` 环境变量或项目 **package.json** 中的 `homepage` 字段，把网站打包为从子路径托管：

```json package.json
{
  "homepage": "/evanbacon/my-website"
}
```

在 Expo Router 中，可以使用项目 **app.json** 中的实验性 `baseUrl` 字段：

```json app.json
{
  "expo": {
    "experiments": {
      "baseUrl": "/evanbacon/my-website"
    }
  }
}
```

与之前的系统不同，这也会更新路由以计入基础路径。例如，如果有路由 `/profile`，并把基础路径设为 `/evanbacon/my-website`，则该路由会变成 `/evanbacon/my-website/profile`。

更多信息见[使用子路径托管](/more/expo-cli#hosting-with-sub-paths)。

## Fast Refresh

在 `@expo/webpack-config` 中，可以安装 `@pmmmwh/react-refresh-webpack-plugin`，并在 **webpack.config.js** 中添加以下内容：

```js webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // 在开发模式下使用 React refresh 插件
  if (env.mode === 'development') {
    config.plugins.push(new ReactRefreshWebpackPlugin({ disableRefreshCheck: true }));
  }

  return config;
};
```

在 Expo Router 中，**Fast Refresh 默认启用**，使用的是 Meta 的官方 Fast Refresh 实现。

## Favicon

与 `@expo/webpack-config` 一样，Expo Router 支持根据 **app.json** 中的 `web.favicon` 字段生成 **favicon.ico** 文件。

## Service Worker

:::warning
添加 service worker 时要小心，因为它们在 Web 上会导致意外行为。如果意外发布了一个激进缓存网站的 service worker，用户就无法轻易请求更新。要获得最佳的离线移动体验，请用 Expo 创建原生应用。与带有 service worker 的网站不同，原生应用可以通过应用商店更新来清除缓存体验。这类似于重置用户的原生浏览器（如果 service worker 足够激进，他们可能不得不这样做）。更多信息见[为什么 service worker 并非最优](https://github.com/facebook/create-react-app/issues/2398)。
:::

Expo Webpack 没有内置的 service worker 支持。不过，可以通过 `workbox-webpack-plugin` 把它添加到 **webpack.config.js** 中来自行添加。

Workbox 没有 Metro 集成，但由于 Workbox 不需要打包器的核心功能之一（转换、解析、序列化），它可以很容易地用作构建后步骤。按照[使用 Workbox CLI](https://developer.chrome.com/docs/workbox/modules/workbox-cli/) 的指南操作，凡是提到 “build script” 的地方，改用 `npx expo export -p web`。

例如，下面是设置 Workbox 的一种可能流程。用以下命令创建新项目：

:::tabs
:::tab npm
```sh
npm create expo -t tabs my-app

cd my-app
```
:::
:::tab yarn
```sh
yarn create expo -t tabs my-app

cd my-app
```
:::
:::tab pnpm
```sh
pnpm create expo -t tabs my-app

cd my-app
```
:::
:::tab bun
```sh
bun create expo -t tabs my-app

cd my-app
```
:::
:::

接下来，为应用创建根 HTML 文件，并添加 service worker 注册脚本：

```tsx src/app/+html.tsx
import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

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

        {/* 引导 service worker。 */}
        <script dangerouslySetInnerHTML={{ __html: sw }} />

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

const sw = `
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    });
}
`;
```

现在在运行向导之前先构建应用：

:::tabs
:::tab npm
```sh
npx expo export -p web
```
:::
:::tab yarn
```sh
yarn expo export -p web
```
:::
:::tab pnpm
```sh
pnpm expo export -p web
```
:::
:::tab bun
```sh
bun expo export -p web
```
:::
:::

运行向导命令，选择 `dist` 作为应用根目录，其余选项使用默认值：

:::tabs
:::tab npm
```text
npx workbox-cli wizard

? What is the root of your web app (that is which directory do you deploy)? dist/
? Which file types would you like to precache? js, html, ttf, ico, json
? Where would you like your service worker file to be saved? dist/sw.js
? Where would you like to save these configuration options? workbox-config.js
? Does your web app manifest include search parameter(s) in the 'start_url', other than 'utm_' or 'fbclid' (like '?source=pwa')? No
```
:::
:::tab yarn
```text
yarn dlx workbox-cli wizard

? What is the root of your web app (that is which directory do you deploy)? dist/
? Which file types would you like to precache? js, html, ttf, ico, json
? Where would you like your service worker file to be saved? dist/sw.js
? Where would you like to save these configuration options? workbox-config.js
? Does your web app manifest include search parameter(s) in the 'start_url', other than 'utm_' or 'fbclid' (like '?source=pwa')? No
```
:::
:::tab pnpm
```text
pnpm dlx workbox-cli wizard

? What is the root of your web app (that is which directory do you deploy)? dist/
? Which file types would you like to precache? js, html, ttf, ico, json
? Where would you like your service worker file to be saved? dist/sw.js
? Where would you like to save these configuration options? workbox-config.js
? Does your web app manifest include search parameter(s) in the 'start_url', other than 'utm_' or 'fbclid' (like '?source=pwa')? No
```
:::
:::tab bun
```text
bunx workbox-cli wizard

? What is the root of your web app (that is which directory do you deploy)? dist/
? Which file types would you like to precache? js, html, ttf, ico, json
? Where would you like your service worker file to be saved? dist/sw.js
? Where would you like to save these configuration options? workbox-config.js
? Does your web app manifest include search parameter(s) in the 'start_url', other than 'utm_' or 'fbclid' (like '?source=pwa')? No
```
:::
:::

最后，运行 `npx workbox-cli generateSW workbox-config.js` 生成 service worker 配置。之后，可以在 **package.json** 中添加构建脚本，按正确顺序运行这两个脚本：

```json package.json
{
  "scripts": {
    "build:web": "expo export -p web && npx workbox-cli generateSW workbox-config.js"
  }
}
```

## PWA 清单

与 `@expo/webpack-config` 不同，Expo Router 不会自动尝试生成 PWA 清单配置。可以在 **public/manifest.json** 中创建一个：

```json
{
  "short_name": "Expo App",
  "name": "Expo Router Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

可以使用 `link` 标签在 HTML 文件中链接它：

```tsx src/app/+html.tsx
import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

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

        {/* 链接 PWA 清单文件。 */}
        <link rel="manifest" href="/manifest.json" />

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

## 打包器插件

如果使用了自定义打包器插件，请参阅 [Expo Metro 配置](/versions/latest/config/metro)，了解如何向打包器流水线添加自定义功能。

## 导航

如果在 `@expo/webpack-config` 中使用 React Navigation 在屏幕之间导航，请参阅 [React Navigation 迁移指南](/router/migrate/from-react-navigation)。

## 部署

关于如何把 Expo Router 网站部署到各种托管提供方，请查看[发布网站](/guides/publishing-websites)。
