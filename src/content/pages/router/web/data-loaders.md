---
title: 数据加载器
description: 了解如何在 Expo Router 中使用数据加载器在服务器上获取数据。
---

# 数据加载器

:::warning
数据加载器在 SDK 58 及更高版本中已稳定。对于 SDK 55–57，请在 `expo-router` 配置插件中启用 `unstable_useServerDataLoaders`。它们需要[静态渲染](/router/web/static-rendering)或[服务器渲染](/router/web/server-rendering)。
:::

数据加载器为路由启用服务端数据获取。从路由文件导出 `loader` 函数后，可以在服务器上获取数据，并在组件中用 [`useLoaderData`](/versions/latest/sdk/router#useloaderdata) hook 访问它。这样可以把敏感数据和 API 密钥留在服务器上，同时为组件提供所需数据。

## 设置

1. 配置 Web 输出模式。数据加载器同时适用于[静态渲染](/router/web/static-rendering)（`web.output: 'static'`）和[服务器渲染](/router/web/server-rendering)（`web.output: 'server'`）：

   ```json app.json
   {
     "expo": {
       "web": {
         // 选择 'static' 或 'server'
         "output": "server"
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

## 面向 AI agent 的 Expo Skills

如果使用 AI agent，请安装 [Expo Skills](/skills)，让它学习包括数据加载器在内的数据获取模式。

> 本页包含一个交互块，用于安装名为 `expo-data-fetching` 的 Expo Skill。

## 基本示例

从路由文件导出 `loader` 函数，并用 [`useLoaderData`](/versions/latest/sdk/router#useloaderdata) hook 在组件中访问数据：

```tsx src/app/index.tsx
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';

export async function loader() {
  // 从 API、数据库或任何服务端来源获取数据
  const response = await fetch('https://api.example.com/data');
  return response.json();
}

export default function Home() {
  const data = useLoaderData<typeof loader>();

  return (
    <View>
      <Text>Data: {JSON.stringify(data)}</Text>
    </View>
  );
}
```

`loader` 函数在服务器上执行，其返回值会被序列化并传给组件。因此可以安全地使用服务端密钥、数据库连接以及其他不应暴露给客户端的资源。使用 TypeScript 时，把 `typeof loader` 作为泛型参数传给 [`useLoaderData`](/versions/latest/sdk/router#useloaderdata)，可以让该 hook 从 loader 函数推断返回类型。

:::note
[`useLoaderData`](/versions/latest/sdk/router#useloaderdata) hook 不必在路由组件本身中调用。它可以在该路由组件树中的任何子组件里调用。
:::

### 使用 Suspense

当组件在数据仍在加载时调用 [`useLoaderData`](/versions/latest/sdk/router#useloaderdata) hook，React 会挂起该组件。加载状态会沿组件树向上传递，直到最近的 [`<Suspense>`](https://react.dev/reference/react/Suspense) 边界，然后渲染其 fallback。

通过在组件树中放置 [`<Suspense>`](https://react.dev/reference/react/Suspense) 边界，可以精确控制加载回退出现的位置：

```tsx src/app/index.tsx
import { Suspense } from 'react';
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';

export async function loader() {
  const response = await fetch('https://api.example.com/data');
  return response.json();
}

export default function Home() {
  return (
    <View>
      <Text>Welcome</Text>
      <Suspense fallback={<Text>Loading...</Text>}>
        <DataSection />
      </Suspense>
    </View>
  );
}

function DataSection() {
  const data = useLoaderData<typeof loader>();
  return <Text>{data.title}</Text>;
}
```

在上面的示例中，[`useLoaderData`](/versions/latest/sdk/router#useloaderdata) 位于 `<Home>` 的子组件中，并用 [`<Suspense>`](https://react.dev/reference/react/Suspense) 包裹它以显示加载状态。

### 错误处理

当 loader 抛出错误时，错误会传播到最近的[错误边界](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)。可以从同一路由文件导出 [`ErrorBoundary`](/versions/latest/sdk/router#errorboundary) 组件来处理 loader 错误：

```tsx src/app/data.tsx
import { Text, View } from 'react-native';
import { useLoaderData, type ErrorBoundaryProps } from 'expo-router';

export async function loader() {
  const response = await fetch('https://api.example.com/data');
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View>
      <Text>Error: {error.message}</Text>
      <Text onPress={retry}>Try again</Text>
    </View>
  );
}

export default function DataPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <View>
      <Text>{data.title}</Text>
    </View>
  );
}
```

如果没有导出 `ErrorBoundary`，错误会传播到最近的父路由错误边界。也可以在路由内使用自定义错误边界组件，在组件树的特定位置捕获错误。

## 动态路由

Loader 把路由参数作为第二个参数接收：

```tsx src/app/posts/[postId].tsx
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';

export async function loader(request, params) {
  const response = await fetch(`https://api.example.com/posts/${params.postId}`);
  return response.json();
}

export default function Post() {
  const data = useLoaderData<typeof loader>();

  return (
    <View>
      <Text>{data.title}</Text>
      <Text>{data.content}</Text>
    </View>
  );
}
```

## 访问请求

:::warning
使用静态渲染时，`request` 参数为 `undefined`，因为构建时没有 HTTP 请求。
:::

使用[服务器渲染](/router/web/server-rendering)时，loader 把传入的 HTTP 请求作为第一个参数接收。这样可以访问请求头、Cookie 和其他请求信息：

```tsx src/app/profile.tsx
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';

export async function loader(request) {
  // 访问授权请求头
  const authToken = request?.headers.get('Authorization');

  if (!authToken) {
    return { user: null };
  }

  // 使用令牌获取用户数据
  const response = await fetch('https://api.example.com/user', {
    headers: { Authorization: authToken },
  });

  return { user: await response.json() };
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

  if (!user) {
    return <Text>Please log in</Text>;
  }

  return (
    <View>
      <Text>Welcome, {user.name}</Text>
    </View>
  );
}
```

## 返回数据

Loader 可以把数据作为普通 JSON 返回，这些数据可以用 [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) 轻松反序列化。这包括对象、数组，或任何可以用 [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) 序列化的其他原始值。

```tsx src/app/index.tsx
export async function loader() {
  const response = await fetch('https://api.example.com/data');
  return response.json();
}
```

如果 loader 返回 `undefined` 或 `null`，该值会被规范化为 `null`。

## 运行时 API

数据加载器可以完整访问 [`expo-server`](/versions/latest/sdk/server) 的[运行时 API](/router/web/api-routes#运行时-api)。这包括用于设置响应头、抛出 HTTP 错误和运行后台任务的工具：

```tsx src/app/example.tsx
import { setResponseHeaders, StatusError } from 'expo-server';

export async function loader(request) {
  const authToken = request?.headers.get('Authorization');

  if (!authToken) {
    throw new StatusError(401, 'Unauthorized');
  }

  setResponseHeaders({ 'Cache-Control': 'private, max-age=60' });

  return { user: 'authenticated' };
}
```

可用函数的完整列表见[运行时 API 文档](/router/web/api-routes#运行时-api)。

## 环境变量

Loader 在服务器上运行，可以访问 `process.env`。在 loader 中使用的环境变量永远不会暴露给客户端 bundle。这对访问 API 密钥和其他机密很有用：

```tsx src/app/api-data.tsx
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';

export async function loader() {
  // 访问服务端环境变量
  const apiKey = process.env.API_SECRET_KEY;

  const response = await fetch('https://api.example.com/data', {
    headers: { 'X-API-Key': apiKey },
  });

  return response.json();
}

export default function ApiData() {
  const data = useLoaderData<typeof loader>();

  return (
    <View>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
}
```

## 静态渲染与服务器渲染的区别

数据加载器的行为取决于 [`web.output`](/versions/latest/config/app#output) 配置：

| 方面 | 静态渲染 | 服务器渲染 |
| --- | --- | --- |
| Loader 执行时机 | 构建时 | 请求时 |
| `request` 参数 | `undefined` | [`ImmutableRequest`](/versions/latest/sdk/server#immutablerequest) |
| 最适合 | 博客、营销页面、文档 | 个性化内容、依赖认证的页面 |

### 静态渲染

使用静态渲染时，loader 在用 `npx expo export` 导出应用期间执行。数据会嵌入生成的 HTML 和 JSON 文件。这意味着：

- 数据在构建时确定，直到下一次构建才会改变
- `request` 参数为 `undefined`，因为构建期间没有 HTTP 请求
- 适合不经常变化的内容

### 服务器渲染

使用服务器渲染时，loader 在每个请求上执行。这意味着：

- `request` 参数包含传入 HTTP 请求的不可变版本
- 生产部署需要 [`expo-server`](/versions/latest/sdk/server)

## 类型化的 loader 函数

`expo-server` 提供两个辅助函数，用于创建类型安全性更好的 loader。它们收窄回调签名，使你只接收与渲染模式相关的参数。

### `createStaticLoader`

对只需要路由参数的路由使用 [`createStaticLoader`](/versions/latest/sdk/server#createstaticloaderfn)。回调只接收路由参数，并且可以安全地同时用于静态渲染和服务器渲染：

```tsx src/app/posts/[postId].tsx
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';
import { createStaticLoader } from 'expo-router/server';

export const loader = createStaticLoader(async params => {
  const response = await fetch(`https://api.example.com/posts/${params.postId}`);
  return response.json();
});

export default function Post() {
  const data = useLoaderData<typeof loader>();

  return (
    <View>
      <Text>{data.title}</Text>
    </View>
  );
}
```

### `createServerLoader`

对需要访问传入 HTTP 请求的路由使用 [`createServerLoader`](/versions/latest/sdk/server#createserverloaderfn)。回调接收 [`ImmutableRequest`](/versions/latest/sdk/server#immutablerequest) 和路由参数作为参数：

```tsx src/app/profile.tsx
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';
import { createServerLoader } from 'expo-router/server';

export const loader = createServerLoader(async (request, params) => {
  const authToken = request.headers.get('Authorization');

  if (!authToken) {
    return { user: null };
  }

  const response = await fetch('https://api.example.com/user', {
    headers: { Authorization: authToken },
  });

  return { user: await response.json() };
});

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

  if (!user) {
    return <Text>Please log in</Text>;
  }

  return (
    <View>
      <Text>Welcome, {user.name}</Text>
    </View>
  );
}
```

:::warning
如果在静态站点生成（SSG）期间调用 `createServerLoader`，它会抛出错误，因为构建时没有 HTTP 请求。使用静态渲染时请用 `createStaticLoader`。
:::

### 直接使用 `LoaderFunction`

也可以使用 `expo-router/server` 中的 [`LoaderFunction`](/versions/latest/sdk/server#loaderfunctionrequest-params) 类型直接为 loader 标注类型。这让你可以完全控制函数签名，包括 `request` 和 `params`：

```tsx src/app/posts/[postId].tsx
import { Text, View } from 'react-native';
import { useLoaderData } from 'expo-router';
import { type LoaderFunction } from 'expo-router/server';

type PostData = {
  title: string;
  content: string;
};

export const loader: LoaderFunction<PostData> = async (request, params) => {
  const response = await fetch(`https://api.example.com/posts/${params.postId}`);
  return response.json();
};

export default function Post() {
  const data = useLoaderData<typeof loader>();

  return (
    <View>
      <Text>{data.title}</Text>
      <Text>{data.content}</Text>
    </View>
  );
}
```

## 已知限制

- Loader **必须**返回可 JSON 序列化的数据。不支持从 loader 返回流或异步可迭代对象。这将在未来的版本中解决。
- 导航期间，loader 数据会缓存在客户端。目前没有内置方式使此缓存失效。这将在未来的版本中解决。

## 常见问题

<details>
<summary>可以在没有服务器渲染的情况下使用数据加载器吗？</summary>

可以。数据加载器同时适用于静态渲染（`web.output: 'static'`）和服务器渲染（`web.output: 'server'`）。

</details>

<details>
<summary>loader 会包含在客户端 bundle 中吗？</summary>

不会，`loader` 导出会从客户端 bundle 中移除。不过，如果另一个模块包含服务端逻辑，并且被 **src/app** 目录之外的客户端代码导入，它可能会包含在客户端 bundle 中。

</details>
