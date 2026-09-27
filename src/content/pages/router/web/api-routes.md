---
title: API 路由
description: 了解如何用 Expo Router 创建服务器端点。
---

# API 路由

Expo Router 让你在 **src/app** 目录中为所有平台编写安全的服务器代码。

```ts src/app/hello+api.ts
export function GET(request: Request) {
  return Response.json({ hello: 'world' });
}
```

服务器功能需要自定义服务器，可以部署到 EAS 或大多数[其他托管提供方](#部署)。

> 视频：[Expo Router API 路由处理请求并流式传输数据](https://www.youtube.com/watch?v=2_UzR1wdimI)。使用 Expo Router API 路由创建服务器端点，以处理请求、返回 JSON 并流式传输数据。

## 什么是 API 路由

API 路由是在匹配到路由时在服务器上执行的函数。它们可用于安全地处理敏感数据（例如 API 密钥），或实现自定义服务器逻辑，例如用授权码交换访问令牌。API 路由应在符合 [WinterCG](https://wintercg.org/) 的环境中执行。

在 Expo 中，通过在 **app** 目录中创建带 `+api.ts` 扩展名的文件来定义 API 路由。例如，匹配到路由 `/hello` 时会执行下面的 API 路由。

```text
src/app/index.tsx
src/app/hello+api.ts    API 路由
```

<a id="create-an-api-route"></a>

## 创建 API 路由

1. 确保项目使用服务器输出。这会把导出和生产构建配置为同时生成服务器 bundle 和客户端 bundle。

   ```json app.json
   {
     "web": {
       // 输出动态服务器。
       "output": "server"
     }
   }
   ```

   在 SDK 58 及更高版本中，`web.output: "server"` 默认启用 API 路由。要把 API 路由与构建时生成的 HTML 结合起来，请使用 `web.output: "static"`，并在 `expo-router` 配置插件中启用 `apiRoutes`：

   ```json app.json
   {
     "expo": {
       "web": {
         "output": "static"
       },
       "plugins": [["expo-router", { "apiRoutes": true }]]
     }
   }
   ```

   这会把预渲染 HTML 和 API 路由导出到 **dist/server**，客户端资源导出到 **dist/client**。它需要[已部署的服务器](#部署)。

   把 `apiRoutes` 设为 `false` 可在保持所选渲染模式的同时禁用 API 路由。启用 API 路由需要 `static` 或 `server` 输出。显式的 `apiRoutes: false` 在任何输出模式下都可接受。

2. API 路由创建在 **app** 目录中。例如，添加下面的路由处理函数。匹配到路由 `/hello` 时会执行它。

   ```ts src/app/hello+api.ts
   export function GET(request: Request) {
     return Response.json({ hello: 'world' });
   }
   ```

   可以从服务器路由导出以下任一函数：`GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`HEAD` 和 `OPTIONS`。匹配到对应 HTTP 方法时执行该函数。不支持的方法会自动返回 `405: Method not allowed`。

3. 用 Expo CLI 启动开发服务器：

:::tabs
:::tab npm
```sh
npx expo
```
:::
:::tab yarn
```sh
yarn expo
```
:::
:::tab pnpm
```sh
pnpm expo
```
:::
:::tab bun
```sh
bun expo
```
:::
:::

4. 可以向该路由发起网络请求以访问数据。运行下面的命令测试路由：

   ```sh
   curl http://localhost:8081/hello
   ```

   也可以从客户端代码发起请求：

   ```tsx src/app/index.tsx
   import { Button } from 'react-native';

   async function fetchHello() {
     const response = await fetch('/hello');
     const data = await response.json();
     alert('Hello ' + data.hello);
   }

   export default function App() {
     return <Button onPress={() => fetchHello()} title="Fetch hello" />;
   }
   ```

   相对 fetch 请求在开发环境中会自动相对于开发服务器源发起，生产环境中可以用 **app.json** 的 `origin` 字段配置：

   ```json app.json
   {
     "plugins": [
       [
         "expo-router",
         {
           // API 路由托管所在的 URL。
           "origin": "https://evanbacon.dev/"
         }
       ]
     ]
   }
   ```

   在 EAS Build 期间，可以通过设置环境变量 `EXPO_UNSTABLE_DEPLOY_SERVER=1` 自动配置此 URL。这会触发版本化的服务器部署，并自动把 origin 设为预览部署 URL。

5. 把网站和服务器部署到[托管提供方](#部署)，以便在原生和 Web 的生产环境中访问这些路由。

:::warning
API 路由文件名不能有平台专属扩展名。例如，**hello+api.web.ts** 不会生效。
:::

## 请求

请求使用全局标准 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 对象。

```ts src/app/blog/[post]+api.ts
export async function GET(request: Request, { post }: Record<string, string>) {
  // const postId = new URL(request.url).searchParams.get('post')
  // 获取 'post' 的数据
  return Response.json({ ... });
}
```

<a id="request-body"></a>

### 请求体

使用 `request.json()` 函数访问请求体。它会自动解析请求体并返回结果。

```ts src/app/validate+api.ts
export async function POST(request: Request) {
  const body = await request.json();

  return Response.json({ ... });
}
```

### 请求查询参数

可以通过解析请求 URL 访问查询参数：

```ts src/app/endpoint+api.ts
export async function GET(request: Request) {
  const url = new URL(request.url);
  const post = url.searchParams.get('post');

  // 获取 'post' 的数据
  return Response.json({ ... });
}
```

## 响应

响应使用全局标准 [`Response`](https://fetch.spec.whatwg.org/#response) 对象。

```ts src/app/demo+api.ts
export function GET() {
  return Response.json({ hello: 'universe' });
}
```

### 错误

对于错误情况，可以创建带任意状态码和响应体的 `Response`。

```ts src/app/blog/[post]+api.ts
export async function GET(request: Request, { post }: Record<string, string>) {
  if (!post) {
    return new Response('No post found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
  // 获取 `post` 的数据
  return Response.json({ ... });
}
```

使用未定义的方法发起请求会自动返回 `405: Method not allowed`。如果请求期间抛出错误，会自动返回 `500: Internal server error`。

## 运行时 API

:::warning
服务器运行时 API 和 `expo-server` 在 SDK 54 及更高版本中可用，生产环境使用需要已部署的服务器。
:::

可以使用 [`expo-server`](/versions/latest/sdk/server) 库，使用若干可在任何服务器端 Expo 代码中工作的工具和代码模式。这包括获取请求元数据、调度任务和错误处理的工具。

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

使用 `expo-server` 不限于 API 路由，也可以在任何其他服务器代码中使用，例如[服务器中间件](/router/web/middleware)。

### 错误处理

可以通过抛出 [`StatusError`](/versions/latest/sdk/server#statuserror) 中止请求并改为返回错误 `Response`。这是一种特殊的 `Error` 实例，会被替换为 HTTP 响应，从而替换错误本身。

```ts src/app/blog/[post]+api.ts
import { StatusError } from 'expo-server';

export async function GET(request: Request, { post }: Record<string, string>) {
  if (!post) {
    throw new StatusError(404, 'No post found');
  }
  // ...
}
```

在组合自己的服务器工具和辅助函数时，`StatusError` 是处理异常更方便的方式，因为抛出它们会中断任何 API 函数并提前返回错误。

`StatusError` 接受状态码和错误消息，错误消息也可以选择作为 JSON 或 `Error` 对象传入，并且始终返回 JSON 正文中带 `error` 键（设为其错误消息）的 `Response`。

这可能有限制，并不适合所有情况。有时改为 `throw` 一个 `Response` 对象可能更有益：它同样会中断逻辑，但会直接替换 API 路由解析出的 `Response`，而没有 `StatusError` 包装。例如，这可以用来创建重定向响应。

```ts src/app/blog/[post]+api.ts
import { StatusError } from 'expo-server';

export async function GET(request: Request, { post }: Record<string, string>) {
  if (!post) {
    throw Response.redirect('https://expo.dev', 302);
  }
  // ...
}
```

### 请求元数据

请求通常在其头中携带你需要的大部分元数据。不过，`expo-server` 提供一些辅助函数，以便更容易地获取常见值。

`expo-server` 的辅助函数返回限定于当前 `Request` 的值。只能在服务器端代码中、并且只在进行中的请求期间调用这些函数。

你可能需要访问的一个常见值是请求的源 URL。源 URL 通常通过请求的 `Origin` 头传输，表示用户用来访问你的 API 路由的 URL。当请求被代理时，它可能不同于服务器看到的任何内部部署 URL。可以使用 `expo-server` 的 [`origin()`](/versions/latest/sdk/server#origin) 辅助方法访问此值。

```ts src/app/help+api.ts
import { origin } from 'expo-server';

export async function GET(request: Request) {
  const target = new URL('/help', origin() ?? request.url);
  return Response.redirect('https://expo.dev', 302);
}
```

你把服务器代码部署到的大多数运行时都有环境的概念，以区分生产或预发部署。可以使用 `expo-server` 的 [`environment()`](/versions/latest/sdk/server#environment) 辅助函数获取环境名称。此值会因运行服务器代码的方式而不同。

```ts src/app/env+api.ts
import { environment } from 'expo-server';

export async function GET(request: Request) {
  const env = environment();
  if (env === 'staging') {
    return Response.json({ isStaging: true });
  } else if (!env) {
    return Response.json({ isProduction: true });
  } else {
    return Response.json({ env });
  }
}
```

### 任务调度

在请求处理函数中，你可能需要与服务器逻辑并行运行异步任务。

```ts src/app/tasks+api.ts
export async function GET(request: Request) {
  // 这会延迟响应：
  await pingAnalytics(...);

  const data = await fetchExampleData(...);
  return Response.json({ data });
}
```

在上面的示例中，被 `await` 的函数调用会延迟 API 路由其余部分的执行。如果不想延迟 `Response`，那么 `await` 此调用并不合适。不过，不带 `await` 调用该函数并不能保证此任务会让无服务器函数保持运行。

可以改用 `expo-server` 的 [`runTask()`](/versions/latest/sdk/server#runtaskfn) 辅助函数运行并发任务。这等同于在 service worker 代码或其他无服务器运行时中看到的 [`waitUntil()`](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil) 方法。

```ts src/app/tasks+api.ts
import { runTask } from 'expo-server';

export async function GET(request: Request) {
  // 这不会延迟响应：
  runTask(async () => {
    await pingAnalytics(...);
  });

  const data = await fetchExampleData(...);
  return Response.json({ data });
}
```

使用 `runTask`，你在 `await` 与不 `await` 异步函数之间取得折中。它们会并发运行，不会延迟 API 路由的响应或执行，同时也会确保运行时知道它们，不会过早退出。

不过，有时你可能想把任务延迟到 API 路由返回 `Response` 之后。在这种情况下，如果 API 拒绝了它，你可能更希望不执行该任务。此外，你可能只想在时间敏感的任务完成之后运行函数，以防止并发代码延迟 API 路由中计算密集的任务。

可以使用 `expo-server` 的 [`deferTask()`](/versions/latest/sdk/server#defertaskfn) 辅助函数，把任务安排在 API 路由解析出 `Response` 之后运行。

```ts src/app/tasks+api.ts
import { deferTask } from 'expo-server';

export async function GET(request: Request) {
  // 这会在整个函数解析之后运行：
  deferTask(async () => {
    await pingAnalytics(...);
  });

  const data = await fetchExampleData(...);
  return Response.json({ data });
}
```

### 响应头

把服务器逻辑拆分到单独的辅助函数和文件中时，可能需要在创建 `Response` 之前修改 `Response` 头。

例如，你可能需要在 API 路由代码运行之前，在[服务器中间件](/router/web/middleware)中向 `Response` 添加元数据。

```ts src/app/+middleware.ts
import { setResponseHeaders } from 'expo-server';

export default function middleware(request: Request) {
  // 速率限制器通常会添加 Retry-After 头
  setResponseHeaders({ 'Retry-After': '3600' });
}
```

在上面的示例中，`Retry-After` 头被添加到 API 路由将来可能创建的 `Response` 上。这也可以扩展到身份验证和 cookie。

```ts src/app/+middleware.ts
import { setResponseHeaders } from 'expo-server';

export default function middleware(request: Request) {
  // 向未来的响应追加 cookie
  setResponseHeaders(headers => {
    headers.append('Set-Cookie', 'token=123; Secure');
  });
}
```

## 打包

API 路由由 Expo CLI 和 [Metro 打包器](/guides/customizing-metro)打包。它们可以访问与客户端代码相同的全部语言特性：

- [TypeScript](/guides/typescript)：类型和 [**tsconfig.json** 路径](/guides/typescript#路径别名可选)。
- [环境变量](/guides/environment-variables)：服务器路由可以访问所有环境变量，而不仅仅是以 `EXPO_PUBLIC_` 为前缀的那些。
- Node.js 标准库：确保在本地为服务器环境使用正确的 Node.js 版本。
- **babel.config.js** 和 **metro.config.js** 支持：设置同时适用于客户端和服务器代码。

## 安全性

路由处理函数在与客户端代码隔离的沙箱环境中执行。这意味着你可以安全地把敏感数据存储在路由处理函数中，而不会暴露给客户端。

- 导入带有密钥的代码的客户端代码会被包含在客户端 bundle 中。这适用于 **src/app 目录**中的**所有文件**，即使它们不是路由处理函数文件（例如以 **+api.ts** 为后缀）。
- 如果密钥在 **&lt;...&gt;+api.ts** 文件中，它不会被包含在客户端 bundle 中。这适用于路由处理函数中导入的所有文件。
- 密钥剥离发生在 `expo/metro-config` 中，并且需要在 **metro.config.js** 中使用它。

## 部署

准备好部署到生产环境时，运行下面的命令，在 **dist** 目录中创建服务器 bundle（更多细节见 [Expo CLI 文档](/more/expo-cli#exporting)）：

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

可以用 `npx expo serve` 在本地测试此服务器，在 Web 浏览器中访问该 URL，或创建把 `origin` 设为本地服务器 URL 的原生构建。可以使用 [EAS Hosting](/eas/hosting/get-started) 或其他第三方服务把服务器部署到生产环境。

如果想导出 API 路由并跳过生成应用的网站版本，可以使用下面的命令，它会生成只包含项目服务器代码的 **dist** 目录。

:::tabs
:::tab npm
```sh
npx expo export --platform web --no-ssg
```
:::
:::tab yarn
```sh
yarn expo export --platform web --no-ssg
```
:::
:::tab pnpm
```sh
pnpm expo export --platform web --no-ssg
```
:::
:::tab bun
```sh
bun expo export --platform web --no-ssg
```
:::
:::

- [用 EAS 即时部署](/eas/hosting/get-started)：EAS Hosting 是部署 Expo API 路由和服务器的最佳方式。

<a id="native-deployment"></a>

### 原生部署

:::warning
这是 [alpha](/more/release-statuses#alpha) 功能。该流程在未来版本中会更加自动化并获得更好的支持。
:::

Expo Router 中的服务器功能（API 路由和 React Server Components）围绕 `window.location` 和 `fetch` 的原生实现，它们指向远程服务器。在开发环境中，我们会自动指向用 `npx expo start` 运行的开发服务器，但要让生产原生构建工作，你需要把服务器部署到安全主机，并设置 Expo Router 配置插件的 `origin` 属性。

配置之后，相对 fetch 请求（例如 `fetch('/my-endpoint')`）会自动指向服务器源。

可以实验性地用环境变量 `EXPO_UNSTABLE_DEPLOY_SERVER=1` 自动化此部署流程，以确保原生构建期间的版本正确。

下面是如何配置原生应用，以便在构建时自动部署并链接版本化的生产服务器：

1. 确保 **app.json** 中**没有**设置 `origin` 字段，也没有设置 `expo.extra.router.origin` 字段。还要确保没有使用 **app.config.js**，因为自动链接的部署尚不支持它。

2. 先在本地部署一次，为项目设置 [EAS Hosting](/eas/hosting/get-started)。

:::tabs
:::tab npm
```sh
npx expo export -p web
eas deploy
```
:::
:::tab yarn
```sh
yarn expo export -p web
eas deploy
```
:::
:::tab pnpm
```sh
pnpm expo export -p web
eas deploy
```
:::
:::tab bun
```sh
bun expo export -p web
eas deploy
```
:::
:::

3. 在 `.env` 文件中设置环境变量 `EXPO_UNSTABLE_DEPLOY_SERVER`。这将在 EAS Build 期间启用实验性服务器部署功能。

   ```sh .env
   EXPO_UNSTABLE_DEPLOY_SERVER=1
   ```

4. 现在可以使用自动服务器部署了。运行构建命令开始该流程。

   ```sh
   eas build
   ```

   也可以在本地运行：

:::tabs
:::tab npm
```sh
# Android
npx expo run:android --variant release

# iOS
npx expo run:ios --configuration Release
```
:::
:::tab yarn
```sh
# Android
yarn expo run:android --variant release

# iOS
yarn expo run:ios --configuration Release
```
:::
:::tab pnpm
```sh
# Android
pnpm expo run:android --variant release

# iOS
pnpm expo run:ios --configuration Release
```
:::
:::tab bun
```sh
# Android
bun expo run:android --variant release

# iOS
bun expo run:ios --configuration Release
```
:::
:::

关于原生应用自动服务器部署的说明：

- 如果某些内容设置不正确，EAS Build 的 `Bundle JavaScript` 阶段可能会发生服务器失败。
- 如果愿意，可以在构建应用之前手动部署服务器并设置 `origin` URL。
- 可以用环境变量 `EXPO_NO_DEPLOY=1` 强制跳过自动部署。
- 自动部署尚不支持[动态应用配置](/workflow/configuration#动态配置)（**app.config.js** 和 **app.config.ts**）文件。
- 部署日志会写入 `.expo/logs/deploy.log`。
- 在 `EXPO_OFFLINE` 模式下不会运行部署。

### 在本地测试原生生产应用

针对本地开发服务器测试生产构建通常很有用，以确保一切按预期工作。这可以大幅加快调试过程。

1. 导出生产服务器：

:::tabs
:::tab npm
```sh
npx expo export
```
:::
:::tab yarn
```sh
yarn expo export
```
:::
:::tab pnpm
```sh
pnpm expo export
```
:::
:::tab bun
```sh
bun expo export
```
:::
:::

2. 在本地托管生产服务器：

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

3. 在 **app.json** 的 `origin` 字段中设置源。确保 `expo.extra.router.origin` 中没有生成的值。这应该是 `http://localhost:8081`（假定 `npx expo serve` 运行在默认端口上）。

   ```json app.json
   {
     "expo": {
       "plugins": [
         [
           "expo-router",
           {
             "origin": "http://localhost:8081"
           }
         ]
       ]
     }
   }
   ```

   部署到生产环境时记得移除此 `origin` 值。

4. 在模拟器上以发布模式构建应用：

:::tabs
:::tab npm
```sh
EXPO_NO_DEPLOY=1 npx expo run:ios --configuration Release
```
:::
:::tab yarn
```sh
EXPO_NO_DEPLOY=1 yarn expo run:ios --configuration Release
```
:::
:::tab pnpm
```sh
EXPO_NO_DEPLOY=1 pnpm expo run:ios --configuration Release
```
:::
:::tab bun
```sh
EXPO_NO_DEPLOY=1 bun expo run:ios --configuration Release
```
:::
:::

现在应该能看到请求进入本地服务器。使用 [Proxyman](https://proxyman.com/) 之类的工具检查模拟器的网络流量，以获得更好的洞察。

可以实验性地更改 URL，并用 `--unstable-rebundle` 标志快速为 iOS 重新构建。这会换掉 **app.json** 和客户端资源，跳过原生重新构建。

例如，可以运行 `eas deploy` 获取新的部署 URL，把它添加到 **app.json**，然后运行 `npx expo run:ios --unstable-rebundle --configuration Release`，用新 URL 快速重新构建应用。

在提交到商店之前，你会想做一次干净构建，以确保没有暂时性问题。

<a id="hosting-on-third-party-services"></a>

## 在第三方服务上托管

:::warning
`expo-server` 库是在 SDK 54 中加入的。更早的 SDK 请改用 `@expo/server`。
:::

每个云托管提供方都需要自定义适配器才能支持 Expo 服务器运行时。以下第三方提供方有来自 Expo 团队的非官方或实验性支持。

在部署到这些提供方之前，最好熟悉 [`npx expo export`](/more/expo-cli#exporting) 命令的基础：

- **dist** 是 Expo CLI 的默认导出目录。
- 导出时，**public** 目录中的文件会被复制到 **dist**。
- `expo-server` 包是导出的 Expo Web 和 API 路由产物的服务器端运行时。
- `expo-server` **不会**从 **.env** 文件填充环境变量。它们应由托管提供方或用户加载。
- 服务器中不包含 Metro。

`expo-server` 库包含各种提供方和运行时的适配器。在继续下面任一节之前，安装 `expo-server` 库。

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

### Bun

1. 为生产环境导出网站：

   ```sh
   bunx expo export -p web
   ```

2. 编写服务器入口文件，提供静态文件并把请求委托给服务器路由：

   ```ts server.ts
   import { createRequestHandler } from 'expo-server/adapter/bun';

   const CLIENT_BUILD_DIR = `${process.cwd()}/dist/client`;
   const SERVER_BUILD_DIR = `${process.cwd()}/dist/server`;
   const handleRequest = createRequestHandler({ build: SERVER_BUILD_DIR });

   const port = process.env.PORT || 3000;

   Bun.serve({
     port: process.env.PORT || 3000,
     async fetch(req) {
       const url = new URL(req.url);
       console.log('Request URL:', url.pathname);

       const staticPath = url.pathname === '/' ? '/index.html' : url.pathname;
       const file = Bun.file(CLIENT_BUILD_DIR + staticPath);

       if (await file.exists()) return new Response(await file.arrayBuffer());

       return handleRequest(req);
     },
     websocket,
   });

   console.log(`Bun server running at http://localhost:${port}`);
   ```

4. 用 `bun` 启动服务器：

   ```sh
   bun run server.ts
   ```

### Express

1. 安装所需依赖：

:::tabs
:::tab npm
```sh
npm install --save-dev express compression morgan
```
:::
:::tab yarn
```sh
yarn add --dev express compression morgan
```
:::
:::tab pnpm
```sh
pnpm add --save-dev express compression morgan
```
:::
:::tab bun
```sh
bun add --dev express compression morgan
```
:::
:::

2. 为生产环境导出网站：

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

3. 编写服务器入口文件，提供静态文件并把请求委托给服务器路由：

   ```ts server.ts
   #!/usr/bin/env node

   const path = require('path');
   const { createRequestHandler } = require('expo-server/adapter/express');

   const express = require('express');
   const compression = require('compression');
   const morgan = require('morgan');

   const CLIENT_BUILD_DIR = path.join(process.cwd(), 'dist/client');
   const SERVER_BUILD_DIR = path.join(process.cwd(), 'dist/server');

   const app = express();

   app.use(compression());

   // 至少禁用 x-powered-by 头：http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
   app.disable('x-powered-by');

   process.env.NODE_ENV = 'production';

   app.use(
     express.static(CLIENT_BUILD_DIR, {
       maxAge: '1h',
       extensions: ['html'],
     })
   );

   app.use(morgan('tiny'));

   app.all(
     '/{*all}',
     createRequestHandler({
       build: SERVER_BUILD_DIR,
     })
   );
   const port = process.env.PORT || 3000;

   app.listen(port, () => {
     console.log(`Express server listening on port ${port}`);
   });
   ```

4. 用 `node` 命令启动服务器：

   ```sh
   node server.ts
   ```

### Netlify

:::warning
第三方适配器可能会发生破坏性变更。我们没有针对它们的持续测试。
:::

1. 创建服务器入口文件。所有请求都会通过此中间件委托。确切的文件位置很重要。

   ```ts netlify/functions/server.ts
   import path from 'node:path';
   import { createRequestHandler } from 'expo-server/adapter/netlify';

   export default createRequestHandler({
     // 指向根 dist/（输出）目录
     build: path.join(__dirname, '../../dist/server'),
   });
   ```

2. 在项目根目录创建 Netlify 配置文件，把所有请求重定向到服务器函数。

   ```yaml netlify.toml
   [build]
     command = "expo export -p web"
     functions = "netlify/functions"
     publish = "dist/client"

   [[redirects]]
     from = "/*"
     to = "/.netlify/functions/server"
     status = 404

   [functions]
     # 包含所有内容，以确保可以使用动态路由。
     included_files = ["dist/server/**/*"]

   [[headers]]
     for = "/dist/server/_expo/functions/*"
     [headers.values]
       # 示例设为 60 秒。
       "Cache-Control" = "public, max-age=60, s-maxage=60"
   ```

3. 创建配置文件之后，可以用 Expo CLI 构建网站和函数：

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

4. 用 [Netlify CLI](https://docs.netlify.com/cli/get-started/) 部署到 Netlify。

:::tabs
:::tab npm
```sh
# 如有需要，全局安装 Netlify CLI。
npm install --global netlify-cli
# 部署网站。
netlify deploy
```
:::
:::tab yarn
```sh
# 如有需要，全局安装 Netlify CLI。
yarn global add netlify-cli
# 部署网站。
netlify deploy
```
:::
:::tab pnpm
```sh
# 如有需要，全局安装 Netlify CLI。
pnpm add --global netlify-cli
# 部署网站。
netlify deploy
```
:::
:::tab bun
```sh
# 如有需要，全局安装 Netlify CLI。
bun add --global netlify-cli
# 部署网站。
netlify deploy
```
:::
:::

   现在可以访问 Netlify CLI 提供的 URL 上的网站。运行 `netlify deploy --prod` 会发布到生产 URL。

5. 如果使用任何环境变量或 **.env** 文件，请把它们添加到 Netlify。可以进入 **Site settings**，把它们添加到 **Build & deploy** 部分。

### Vercel

:::warning
第三方适配器可能会发生破坏性变更。我们没有针对它们的持续测试。
:::

1. 创建服务器入口文件。所有请求都会通过此中间件委托。确切的文件位置很重要。

   ```ts api/index.ts
   const { createRequestHandler } = require('expo-server/adapter/vercel');

   module.exports = createRequestHandler({
     // 指向根 dist/（输出）目录
     build: require('path').join(__dirname, '../dist/server'),
   });
   ```

2. 在项目根目录创建 Vercel 配置文件（**vercel.json**），把所有请求重定向到服务器函数。

:::tabs
:::tab vercel.json v3

```json vercel.json
{
  "buildCommand": "expo export -p web",
  "outputDirectory": "dist/client",
  "functions": {
    "api/index.ts": {
      "runtime": "@vercel/node@5.1.8",
      "includeFiles": "dist/server/**"
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index"
    }
  ]
}
```

较新版本的 **vercel.json** 不再使用 `routes` 和 `builds` 配置选项，并自动从 **dist/client** 输出目录提供公共资源。

:::
:::tab vercel.json v2

```json vercel.json
{
  "version": 2,
  "outputDirectory": "dist",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/client"
      }
    },
    {
      "src": "api/index.ts",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["dist/server/**"]
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

**旧版** **vercel.json** 需要 `@vercel/static-build` 运行时，才能从 **dist/client** 输出目录提供资源。

:::
:::

3. 创建配置文件之后，向 **package.json** 文件添加 `vercel-build` 脚本，并把它设为 `expo export -p web`。

:::note
此步骤仅适用于 **vercel.json** 旧版的用户。如果使用 v3，可以跳过此步骤。
:::

4. 用 [Vercel CLI](https://vercel.com/docs/cli) 部署到 Vercel。

:::tabs
:::tab npm
```sh
# 如有需要，全局安装 Vercel CLI。
npm install --global vercel
# 构建网站。
vercel build
# 部署网站。
vercel deploy --prebuilt
```
:::
:::tab yarn
```sh
# 如有需要，全局安装 Vercel CLI。
yarn global add vercel
# 构建网站。
vercel build
# 部署网站。
vercel deploy --prebuilt
```
:::
:::tab pnpm
```sh
# 如有需要，全局安装 Vercel CLI。
pnpm add --global vercel
# 构建网站。
vercel build
# 部署网站。
vercel deploy --prebuilt
```
:::
:::tab bun
```sh
# 如有需要，全局安装 Vercel CLI。
bun add --global vercel
# 构建网站。
vercel build
# 部署网站。
vercel deploy --prebuilt
```
:::
:::

   现在可以访问 Vercel CLI 提供的 URL 上的网站。

## 已知限制

API 路由测试版目前不支持若干已知功能。

### 不支持动态导入

API 路由目前通过把所有代码（减去 Node.js 内置模块）打包成单个文件来工作。这意味着你不能使用任何未与服务器一起打包的外部依赖。例如，包含多个平台二进制文件的 `sharp` 之类的库不能使用。这将在未来版本中解决。

### 不支持 ESM

当前的打包实现选择更统一而不是更灵活。这意味着原生不支持 ESM 的限制也会带到 API 路由。所有代码都会被转译为 CommonJS（`require`/`module.exports`）。不过，我们仍然建议你用 ESM 编写 API 路由。这将在未来版本中解决。
