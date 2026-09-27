---
title: 服务器中间件
description: 了解如何在 Expo Router 中创建对每个服务器请求都会运行的中间件。
---

# 服务器中间件

:::warning
服务器中间件在 SDK 58 及更高版本中已稳定。对于 SDK 54–57，请在 `expo-router` 配置插件中启用 `unstable_useServerMiddleware`。生产环境使用服务器中间件需要[已部署的服务器](/router/web/api-routes#部署)。
:::

在 SDK 58 及更高版本中，`unstable_useServerMiddleware` 已弃用且没有效果。请从配置中移除它，以避免弃用警告。

Expo Router 中的服务器中间件允许你在请求到达路由之前运行代码，从而为每个请求启用认证和日志等强大的服务端功能。与处理特定端点的 [API 路由](/router/web/api-routes) 不同，中间件会对应用中的**每个**请求运行，因此它应尽快运行，以免拖慢应用性能。客户端导航（例如原生平台上，或在 Web 应用中使用 [`<Link />`](/versions/latest/sdk/router/link#link) 时）不会经过服务器中间件。

## 设置

1. ### 在应用配置中启用服务器中间件

   首先，通过向[应用配置](/versions/latest/config/app)添加服务器配置，把应用配置为使用服务器输出：

   ```json app.json
   {
     "expo": {
       /* @hide 省略 ... */
       /* @end */
       "web": {
         /* @info 启用服务器渲染 */
         "output": "server"
         /* @end */
       },
       "plugins": ["expo-router"]
     }
   }
   ```

   在 SDK 58 及更高版本中，当 `expo-router` 配置插件中设置了 `apiRoutes: true` 时，可以在 `web.output: "static"` 下使用中间件。这允许中间件在[预渲染 HTML 和 API 路由](/router/web/api-routes#创建-api-路由)之前运行。

2. ### 创建中间件文件

   在 **src/app** 目录中创建 **+middleware.ts** 文件，以定义服务器中间件函数：

   ```ts src/app/+middleware.ts
   export default function middleware(request) {
     console.log(`Middleware executed for: ${request.url}`);
     // 中间件逻辑写在这里
   }
   ```

   中间件函数必须是该文件的默认导出。它接收一个[不可变请求](#请求不可变性)，可以返回 [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)，或不返回任何内容以让请求原样通过。请求是不可变的，以防止副作用；你可以读取请求头和属性，但不能修改请求头或消费请求体。

3. ### 启动开发服务器

   运行开发服务器以测试中间件：

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

   现在中间件会对应用的所有请求运行。

4. ### 测试中间件功能

   在浏览器中访问应用或发起请求，以测试中间件是否工作。查看控制台中来自中间件函数的日志消息。

5. ### 配置中间件匹配器（可选）

   默认情况下，中间件在所有服务器请求上运行。可以用 `unstable_settings` 添加匹配器，以控制中间件何时执行：

   ```ts src/app/+middleware.ts
   export const unstable_settings = {
     matcher: {
       // 仅在 GET 请求上运行
       methods: ['GET'],
       // 仅在 API 路由和特定路径上运行
       patterns: ['/api', '/admin/[...path]'],
     },
   };

   export default function middleware(request) {
     console.log(`Middleware executed for: ${request.url}`);
   }
   ```

   匹配器配置允许你：

   - **按 HTTP 方法过滤**：指定哪些方法应触发中间件
   - **按路径模式过滤**：使用精确路径、命名参数或正则表达式定义哪些 URL 模式应匹配

## 工作原理

中间件函数在任何路由处理程序之前执行，允许你执行日志、认证或修改响应等操作。它只在服务器上运行，并且只针对实际的 HTTP 请求。

### 请求/响应流程

请求到达应用时，Expo Router 按以下顺序处理：

1. 中间件函数首先以[不可变请求](#请求不可变性)运行。
2. 如果中间件返回 `Response`，该响应会立即发送
3. 如果中间件不返回任何内容，请求会继续到匹配的路由
4. 路由处理程序处理请求并返回其响应

### 模式匹配

匹配器支持不同类型的模式，以控制中间件何时运行：

```ts
export const unstable_settings = {
  matcher: {
    patterns: [
      '/api', // 精确路径
      '/posts/[postId]', // 命名参数
      '/blog/[...slug]', // 捕获全部参数
      /^\/api\/v\d+\/users$/, // 正则表达式
    ],
  },
};
```

- **精确路径**只匹配指定路径。`/api` 匹配 `/api`，但不匹配 `/api/users`
- **命名参数**（如 `[postId]`）捕获任意单个片段。`/posts/[postId]` 匹配 `/posts/123` 或 `/posts/my-post`
- **捕获全部参数**（如 `[...slug]`）捕获一个或多个片段。`/blog/[...slug]` 匹配 `/blog/2024` 或 `/blog/2024/12/post`
- **正则表达式**用于复杂模式。`/^\/api\/v\d+\/users$/` 匹配 `/api/v1/users`，但不匹配 `/api/users`

如果**任一**模式匹配请求 URL，中间件就会运行。当同时指定 `methods` 和 `patterns` 时，两个条件都必须满足，中间件才会运行。

### 中间件执行顺序

Expo Router 支持名为 **+middleware.ts** 的单个中间件文件，它对所有服务器请求运行。使用匹配器时，中间件只对匹配指定模式和方法的请求执行，并且发生在任何路由匹配或渲染之前。

### 中间件何时运行

中间件只对发往服务器的实际 HTTP 请求执行。这意味着它会为以下情况执行：

- 初始页面加载，例如用户首次访问站点时
- 整页刷新
- 直接 URL 导航
- 来自任何客户端（原生/Web 应用、外部服务）的 API 路由调用
- 服务器端渲染请求

中间件不会为以下情况运行：

- 使用 [`<Link />`](/versions/latest/sdk/router/link#link) 或 [`router`](/versions/latest/sdk/router#imperativerouter) 的客户端导航
- 原生应用的屏幕过渡
- 预取的路由
- 图片和字体等静态资源请求

## 示例

<details>
<summary>认证</summary>

中间件常用于在路由加载之前执行授权检查。可以检查请求头、Cookie 或查询参数，以确定用户是否有权访问某些路由：

```ts src/app/+middleware.ts
import { jwtVerify } from 'jose';

export default function middleware(request) {
  const token = request.headers.get('authorization');

  const decoded = jwtVerify(token, process.env.SECRET_KEY);
  if (!decoded.payload) {
    return new Response('Forbidden', { status: 403 });
  }
}
```

</details>

<details>
<summary>日志</summary>

可以用中间件记录请求，用于调试或分析。这有助于跟踪用户活动或诊断应用中的问题：

```ts src/app/+middleware.ts
export default function middleware(request) {
  console.log(`${request.method} ${request.url}`);
}
```

</details>

<details>
<summary>动态重定向</summary>

中间件也可用于执行动态重定向。这允许你根据特定条件控制用户导航：

```ts src/app/+middleware.ts
export default function middleware(request) {
  if (request.headers.has('specific-header')) {
    return Response.redirect('https://expo.dev');
  }
}
```

</details>

<details>
<summary>仅 API 的中间件</summary>

使用匹配器让中间件只对 API 路由运行，其他路由不受影响：

```ts src/app/+middleware.ts
export const unstable_settings = {
  matcher: {
    patterns: ['/api'],
  },
};

export default function middleware(request) {
  // 记录所有 API 请求以便调试
  console.log(`API request: ${request.method} ${request.url}`);

  // 为 API 路由添加 CORS 请求头
  const response = new Response();
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

</details>

<details>
<summary>针对特定方法的认证</summary>

保护写操作（POST、PUT、DELETE），同时允许公开读取：

```ts src/app/+middleware.ts
export const unstable_settings = {
  matcher: {
    methods: ['POST', 'PUT', 'DELETE'],
    patterns: ['/api', '/admin/[...path]'],
  },
};

export default function middleware(request) {
  const token = request.headers.get('authorization');

  if (!token || !isValidToken(token)) {
    return new Response('Unauthorized', { status: 401 });
  }
}

function isValidToken(token: string): boolean {
  // 你的令牌校验逻辑
  return token.startsWith('Bearer ');
}
```

</details>

<details>
<summary>选择性日志</summary>

监控特定端点，而不记录每个请求：

```ts src/app/+middleware.ts
export const unstable_settings = {
  matcher: {
    patterns: ['/api/users/[userId]', '/admin', /^\/webhook/],
  },
};

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent');
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${request.method} ${request.url} - ${userAgent}`);
}
```

</details>

## 补充说明

### 最佳实践

- 保持中间件轻量，因为它在每个服务器请求上同步运行，并直接影响响应时间。
- 使用匹配器优化性能，避免在不需要的路由上执行不必要的中间件，对高流量应用尤其如此。
- 优先使用精确路径和命名参数，而不是正则表达式，因为简单模式求值更快，也比复杂正则表达式更容易维护。
- 结合方法和模式过滤，精确控制中间件何时执行。
- 对于原生应用，使用 API 路由进行安全的数据获取。当原生应用调用 API 路由时，这些请求会先经过中间件。

### 类型化中间件

```ts src/app/+middleware.ts
import { MiddlewareFunction } from 'expo-router/server';

const middleware: MiddlewareFunction = request => {
  if (request.headers.has('specific-header')) {
    return Response.redirect('https://expo.dev');
  }
};

export default middleware;
```

### 限制

- 中间件只在服务器上运行，并且只针对 HTTP 请求。它不会在客户端导航期间执行，例如使用 [`<Link />`](/versions/latest/sdk/router/link#link) 或原生应用屏幕过渡时。
- 传给中间件的请求对象是[不可变的](#请求不可变性)，以防止副作用。你不能修改请求头或消费请求体，从而确保它仍可供路由处理程序使用。
- 应用中只能有一个根级 **+middleware.ts**。
- [适用于 API 路由的相同限制](/router/web/api-routes#已知限制)也适用于中间件。

### 请求不可变性

为防止意外副作用，并确保请求体仍可供路由处理程序使用，传给中间件的 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 是不可变的。这意味着你可以：

- 读取所有请求属性，如 `url`、`method`、`headers` 等
- 使用 `request.headers.get()` 读取请求头值
- 使用 `request.headers.has()` 检查请求头是否存在
- 访问 URL 参数和查询字符串

但不能：

- 用 `set()`、`append()`、`delete()` 修改请求头
- 用 `text()`、`json()`、`formData()` 等消费请求体
- 直接访问 `body` 属性
