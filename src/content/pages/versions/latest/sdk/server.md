---
title: Server 包参考
description: 用于 Expo Router 项目的服务端 API 与运行时。
---

# Server 包参考

> 支持平台：Server。

`expo-server` 是用于 Expo Router 的服务端 API 与运行时库。它提供可在 Expo Router API 路由或其他服务端代码中使用的辅助函数，并包含用于运行 Expo Router 服务端导出的适配器。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-server
```
:::
:::tab yarn
```sh
yarn expo install expo-server
```
:::
:::tab pnpm
```sh
pnpm expo install expo-server
```
:::
:::tab bun
```sh
bun expo install expo-server
```
:::
:::

要在项目中使用 `expo-server`，需要把 Expo Router 项目配置为以 `server` 模式导出。请按照 Expo Router 的 API 路由指南操作：

- [API 路由](/router/web/api-routes)：了解如何用 Expo Router 创建服务端端点。

## 用法

`expo-server` 的运行时 API 只能在服务端代码中使用，并让你访问服务端运行时环境。运行时 API 暴露的函数可以在请求处理程序的异步上下文中调用，用来获取当前请求的信息，或调度与传入请求并发运行的任务。

### 访问请求元数据

```ts
import { origin, environment } from 'expo-server';

export async function GET() {
  return Response.json({
    isProduction: environment() == null,
    isStaging: environment() === 'staging',
    origin: origin(),
  });
}
```

### 调度任务

```ts
import { runTask, deferTask } from 'expo-server';

export async function GET() {
  runTask(async () => {
    console.log('will run immediately.');
  });

  deferTask(async () => {
    console.log('will run after the response resolved.');
  });

  return Response.json({ success: true });
}
```

## 适配器

`expo-server` 提供适配器，以便在不同环境或不同云厂商的无服务器函数中运行 Expo Router 的服务端导出。通常每种运行时都需要自己的适配器，才能与 `expo-server` 运行时配合工作。在部署到这些提供商之前，最好先熟悉 [`npx expo export`](/more/expo-cli#exporting) 命令的基础用法。

| 适配器 | 提供商 |
| --- | --- |
| `expo-server/adapter/bun` | [Bun](https://bun.com/docs) |
| `expo-server/adapter/express` | [Express](https://expressjs.com/en/5x/api.html) |
| `expo-server/adapter/http` | [Node.js](https://nodejs.org/api/http.html) |
| `expo-server/adapter/netlify` | [Netlify Functions](https://docs.netlify.com/build/functions/overview/) |
| `expo-server/adapter/vercel` | [Vercel Functions](https://vercel.com/docs/functions) |
| `expo-server/adapter/workerd` | [Cloudflare Workers](https://developers.cloudflare.com/pages/functions/) |

要了解如何在不同第三方服务上托管 API 路由，请按照 Expo Router 的 API 路由指南操作：

- [API 路由](/router/web/api-routes#hosting-on-third-party-services)：了解如何在第三方服务上托管 API 路由。

按照约定，所有适配器都导出一个 `createRequestHandler` 函数，它接受一个参数对象。其中的 `build` 参数必须设为 `npx expo export` 生成的 `dist/server` 输出目录的相对路径。有些适配器还会接受更多值来配置运行时 API。

```ts
import path from 'node:path';
import { createRequestHandler } from 'expo-server/adapter/http';

const onRequest = createRequestHandler({
  build: path.join(process.cwd(), 'dist/server'),
  environment: process.env.NODE_ENV,
});
```

## API
