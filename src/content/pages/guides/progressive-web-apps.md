---
title: 渐进式 Web 应用
description: 了解如何为 Expo 网站添加渐进式 Web 应用支持。
---

# 渐进式 Web 应用

渐进式 Web 应用（简称 PWA）是可以安装到用户设备上并离线使用的网站。我们建议尽可能构建原生应用，因为它们的离线支持最好，但 PWA 对桌面用户是很好的选择。

## Favicon

Expo CLI 会根据 **app.json** 中的 `web.favicon` 字段自动生成 **favicon.ico** 文件。

```json
{
  "web": {
    "favicon": "./assets/favicon.png"
  }
}
```

也可以在 **public** 目录中创建 **favicon.ico** 文件，手动指定图标。

## Manifest 文件

PWA 可以用[清单文件配置](https://developer.mozilla.org/en-US/docs/Web/Manifest)，该文件描述应用名称、图标和其他元数据。

1. 在 **public/manifest.json** 中创建 PWA 清单：

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

2. **logo192.png** 和 **logo512.png** 是应用安装到用户设备上时使用的图标。这些文件也应添加到 **public** 目录。

- **public/manifest.json** —— PWA 清单
- **public/logo192.png** —— 192x192 图标
- **public/logo512.png** —— 512x512 图标

3. 现在在 HTML 文件中链接清单。方法取决于网站的输出模式（在[应用配置](/workflow/configuration)中用 `web.output` 配置）。

:::tabs
:::tab single

如果使用单页应用，可以先在 **public/index.html** 中创建模板 HTML，再在 HTML 文件中链接清单：

:::tabs
:::tab npm
```sh
npx expo customize public/index.html
```
:::
:::tab yarn
```sh
yarn expo customize public/index.html
```
:::
:::tab pnpm
```sh
pnpm expo customize public/index.html
```
:::
:::tab bun
```sh
bun expo customize public/index.html
```
:::
:::

然后把清单添加到 `<head>` 标签：

```html
<link rel="manifest" href="/manifest.json" />
```

:::
:::tab static & server

如果使用静态或服务器渲染，可以在 **src/app/+html.tsx** 中动态创建 HTML 入口。这里通过向 `<head>` 组件添加 `<link>` 标签来链接清单：

```tsx src/app/+html.tsx
import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// 此文件仅用于 Web，在静态渲染期间为每个网页配置根 HTML。
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
          在 Web 上禁用 body 滚动。这让 ScrollView 组件的行为更接近原生。
          不过，body 滚动对移动 Web 往往是好事。如果要启用它，删除这一行。
        */}
        <ScrollViewStyleReset />

        {/* 添加你希望在 Web 上全局可用的任何额外 <head> 元素... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

:::
:::

## Service Worker

Service Worker 主要用于为网站添加离线支持。Google 的 Workbox 是向网站添加 Service Worker 的最佳方式。遵循[使用 Workbox CLI](https://developer.chrome.com/docs/workbox/modules/workbox-cli/)的指南，凡是它提到“构建脚本”的地方，改用 `npx expo export -p web`。

:::warning
添加 Service Worker 时要小心，它们在 Web 上已知会导致意外行为。如果你不小心发布了一个激进缓存网站的 Service Worker，用户就无法轻松请求更新。要获得最佳的离线移动体验，请用 Expo 创建原生应用。与带 Service Worker 的网站不同，原生应用可以通过应用商店更新来清除缓存体验。这类似于重置用户的原生浏览器（如果 Service Worker 足够激进，他们可能不得不这样做）。更多信息见[为什么 Service Worker 并不理想](https://github.com/facebook/create-react-app/issues/2398)。
:::

例如，下面是设置 Workbox 的一种可能流程：

1. 用以下命令创建新项目：

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

2. 现在在 HTML 文件中注册 Service Worker。方法取决于网站的输出模式（在[应用配置](/workflow/configuration)中用 `web.output` 配置）。

:::tabs
:::tab single

接下来向根 **index.html** 添加 Service Worker 注册脚本。

如果还不存在，先在 **public/index.html** 中创建模板 HTML：

:::tabs
:::tab npm
```sh
npx expo customize public/index.html
```
:::
:::tab yarn
```sh
yarn expo customize public/index.html
```
:::
:::tab pnpm
```sh
pnpm expo customize public/index.html
```
:::
:::tab bun
```sh
bun expo customize public/index.html
```
:::
:::

然后在 `<head>` 标签中创建 Service Worker 注册脚本：

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
</script>
```

:::
:::tab static & server

接下来，为应用创建根 HTML 文件并添加 Service Worker 注册脚本：

```tsx src/app/+html.tsx
import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// 此文件仅用于 Web，在静态渲染期间为每个网页配置根 HTML。
// 此函数的内容只在 Node.js 环境中运行，
// 无法访问 DOM 或浏览器 API。
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* 引导 Service Worker。 */}
        <script dangerouslySetInnerHTML={{ __html: sw }} />

        {/*
          在 Web 上禁用 body 滚动。这让 ScrollView 组件的行为更接近原生。
          不过，body 滚动对移动 Web 往往是好事。如果要启用它，删除这一行。
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

:::
:::

3. 现在先构建网站，再运行向导：

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

4. 运行向导命令，选择 `dist` 作为应用根目录，其余使用默认值：

:::tabs
:::tab npm
```sh
npx workbox-cli wizard

? What is the root of your web app (that is which directory do you deploy)? dist/
? Which file types would you like to precache? js, html, ttf, ico, json
? Where would you like your service worker file to be saved? dist/sw.js
? Where would you like to save these configuration options? workbox-config.js
? Does your web app manifest include search parameter(s) in the 'start_url', other than 'utm_' or 'fbclid' (like '?source=pwa')? No
```
:::
:::tab yarn
```sh
yarn dlx workbox-cli wizard

? What is the root of your web app (that is which directory do you deploy)? dist/
? Which file types would you like to precache? js, html, ttf, ico, json
? Where would you like your service worker file to be saved? dist/sw.js
? Where would you like to save these configuration options? workbox-config.js
? Does your web app manifest include search parameter(s) in the 'start_url', other than 'utm_' or 'fbclid' (like '?source=pwa')? No
```
:::
:::tab pnpm
```sh
pnpm dlx workbox-cli wizard

? What is the root of your web app (that is which directory do you deploy)? dist/
? Which file types would you like to precache? js, html, ttf, ico, json
? Where would you like your service worker file to be saved? dist/sw.js
? Where would you like to save these configuration options? workbox-config.js
? Does your web app manifest include search parameter(s) in the 'start_url', other than 'utm_' or 'fbclid' (like '?source=pwa')? No
```
:::
:::tab bun
```sh
bunx workbox-cli wizard

? What is the root of your web app (that is which directory do you deploy)? dist/
? Which file types would you like to precache? js, html, ttf, ico, json
? Where would you like your service worker file to be saved? dist/sw.js
? Where would you like to save these configuration options? workbox-config.js
? Does your web app manifest include search parameter(s) in the 'start_url', other than 'utm_' or 'fbclid' (like '?source=pwa')? No
```
:::
:::

5. 最后，运行 `npx workbox-cli generateSW workbox-config.js` 生成 Service Worker 配置。

此后，可以在 **package.json** 中添加构建脚本，按正确顺序运行这两个脚本：

```json package.json
{
  "scripts": {
    "build:web": "expo export -p web && npx workbox-cli generateSW workbox-config.js"
  }
}
```

6. 如果托管了网站并用 Chrome 访问，可以在 Chrome DevTools 中前往 **Application > Service Workers** 检查 Service Worker。
