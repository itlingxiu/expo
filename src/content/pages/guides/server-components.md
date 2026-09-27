---
title: 在 Expo Router 应用中使用 React Server Components
description: 了解如何在 Expo 中于服务器上渲染 React 组件。
---

# 在 Expo Router 应用中使用 React Server Components

:::warning
[实验性](/more/release-statuses#experimental)可用。这是 [beta](/more/release-statuses#beta) 发布，可能发生破坏性变更。
:::

React Server Components 带来多项令人期待的能力，包括：

- 用异步组件和 React Suspense 获取数据。
- 使用密钥与服务端 API。
- 用于 SEO 和性能的服务端渲染（SSR）。
- 构建时渲染，以移除未使用的 JS 代码。

Expo Router 在所有平台上启用对 [React Server Components](https://react.dev/reference/rsc/server-components) 的支持。这是一项将在 Expo Router 中默认启用的特性的早期[预览](/more/release-statuses#preview)。

## 前置条件

- **使用 Expo Router 的项目** —— 如果还没有，参见 [Expo Router 安装](/router/installation)。
- **React Native 新架构** —— 需要 React Native 新架构，并且从 SDK 52 起默认启用。

## 用法

要在 Expo 应用中使用 React Server Components，你需要：

1. 安装所需的 RSC 依赖：

```sh
npx expo install react-server-dom-webpack
```

2. 确保 **package.json** 中的入口模块是 `expo-router/entry`（默认）。
3. 在项目应用配置中启用该标志：

```json app.json
{
  "expo": {
    "experiments": {
      "reactServerFunctions": true
    }
  }
}
```

4. 确保应用配置中任何地方都没有把 `"origin"` 设为布尔值。
5. 创建初始路由 **app/index.tsx**：

```tsx app/index.tsx (Client Component)
/// <reference types="react/canary" />

import React from 'react';
import { ActivityIndicator } from 'react-native';
import renderInfo from '../actions/render-info';

export default function Index() {
  return (
    <React.Suspense
      fallback={
        // 在 Server Function 等待数据时将渲染的视图。
        <ActivityIndicator />
      }>
      {renderInfo({ name: 'World' })}
    </React.Suspense>
  );
}
```

4. 创建 Server Function **actions/render-info.tsx**：

```tsx actions/render-info.tsx (Server Function)
'use server';

import { Text } from 'react-native';

export default async function renderInfo({ name }) {
  // 安全地从 API 获取数据，并读取环境变量...
  return <Text>Hello, {name}!</Text>;
}
```

Server Function 的视图返回值是将流式传输到客户端的 React Server Component 载荷。

> 在开发者预览期间，应用配置中的 `web.output` 必须是 `single`。对更多输出模式的支持即将到来。

## Server Components

Server Components 在服务器上运行，这意味着它们可以访问服务器 API 和 Node.js 内置模块（在本地运行时）。它们也可以使用异步组件。

考虑以下获取数据并渲染它的组件：

```tsx components/pokemon.tsx
import 'server-only';

import { Image, Text, View } from 'react-native';

export async function Pokemon() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/2');
  const json = await res.json();
  return (
    <View style={{ padding: 8, borderWidth: 1 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{json.name}</Text>
      <Image source={{ uri: json.sprites.front_default }} style={{ width: 100, height: 100 }} />

      {json.abilities.map(ability => (
        <Text key={ability.ability.name}>- {ability.ability.name}</Text>
      ))}
    </View>
  );
}
```

要把它渲染为服务器组件，需要从 Server Function 返回它。

### 要点

- 不能在 Server Components 中使用 `useState`、`useEffect` 或 `useContext` 等 hook。
- 不能在 Server Components 中使用浏览器或原生 API。
- `"use server"` 并不是用来把文件标记为服务器组件的。它用来把文件标记为从中导出 React Server Functions。
- 服务器组件可以访问所有环境变量，因为它们在客户端之外安全运行。

## Client Components

由于 Server Components 无法访问原生 API 或 React Context，你可以创建 Client Component 来使用这些特性。在文件顶部用 `"use client"` 指令标记即可创建它们。

```tsx components/button.tsx
'use client';
import { Text } from 'react-native';

export default function Button({ title }) {
  return <Text onPress={() => {}}>{title}</Text>;
}
```

此模块可以导入并在 Server Function 或 Server Component 中使用。

### 要点

不能把函数作为 props 传给 Server Components。只能传递可序列化的数据。

## React Server Functions

Server Functions 是在服务器上运行、并可从 Client Components 调用的函数。可以把它们看作更容易编写的、完全类型化的 API 路由。

它们必须始终是异步函数，并在函数顶部用 `"use server"` 标记。

```tsx app/index.tsx
export default function Index() {
  return (
    <Button
      title="Press me"
      onPress={async () => {
        'use server';
        // 这段代码在服务器上运行。
        console.log('Button pressed');
        return '...';
      }}
    />
  );
}
```

可以创建一个 Client Component 来调用 Server Function：

```tsx components/button.tsx
'use client';
import { Text } from 'react-native';

export default function Button({ title, onPress }) {
  return <Text onPress={() => onPress()}>{title}</Text>;
}
```

Server Functions 也可以定义在独立文件中（顶部有 `"use server"`），并从 Client Components 导入：

```tsx components/server-actions.tsx
'use server';

export async function callAction() {
  // ...
}
```

这些可以在 Client Component 中使用：

```tsx components/button.tsx
import { Text } from 'react-native';
import { callAction } from './server-actions';

export default function Button({ title }) {
  return <Text onPress={() => callAction()}>{title}</Text>;
}
```

### 要点

- 只能把可序列化的数据作为参数传给 Server Functions。
- Server Functions 只能返回可序列化的数据。
- Server Functions 在服务器上运行，适合放置不应暴露给客户端的逻辑。
- Server Functions 目前不能在 DOM 组件内部使用

### 在 Server Functions 中渲染

Expo Router 中的 React Server Functions 可以在服务器上渲染 React 组件，并流式传回 **RSC 载荷**（由 React 团队维护的一种自定义的类 JSON 格式）以便在客户端渲染。这类似于 Web 上的服务端渲染（SSR）。

例如，下面的 Server Function 会渲染一些文本：

```tsx components/server-actions.tsx
'use server';

// 可选：导入 "server-only" 以作健全性检查。
import 'server-only';

import { View, Image, Text } from 'react-native';

export async function renderProfile({
  username,
  accessToken,
}: {
  username: string;
  accessToken: string;
}) {
  // 注意：速率限制、GDPR 和其他服务端操作可以在这里完成。

  // 安全地从 API 获取一些数据。
  const { name, image } = await fetch(`https://api.example.com/profile/${username}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // 安全地使用密钥环境变量，因为这段代码将位于服务器上。
      // 这里不需要 EXPO_PUBLIC_ 前缀。
      'X-Secret': process.env.SECRET,
    },
  }).then(res => res.json());

  // 渲染
  return (
    <View>
      <Image source={{ uri: image }} />
      <Text>{name}</Text>
    </View>
  );
}
```

可以从 Client Component 调用此 Server Function，内容会流式传回客户端：

```tsx components/profile.tsx
'use client';

import { useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Text } from 'react-native';

import { renderProfile } from '@/components/server-actions';

// 获取数据时渲染的加载状态。
function Fallback() {
  return <Text>Loading...</Text>;
}

export default function Profile() {
  const { username } = useLocalSearchParams();
  const { accessToken } = useCustomAuthProvider();

  // 用用户名和访问令牌调用 Server Function。
  const profile = React.useMemo(
    () => renderProfile({ username, accessToken }),
    [username, accessToken]
  );

  // 用 React Suspense 和自定义加载状态异步渲染资料。
  return <React.Suspense fallback={<Fallback />}>{profile}</React.Suspense>;
}
```

## 库兼容性

并非所有库都已针对 React Server Components 优化。可以用 `"use client"` 指令把文件标记为 Client Component，并在 Server Component 中使用它。这可以用来临时绕过兼容性问题。

例如，考虑一个尚未附带 `"use client"` 指令的库 `react-native-unoptimized`。可以通过创建一个模块并重新导出每个模块来绕过：

```tsx lib/react-native-unoptimized.tsx
// 此指令让模块选择客户端渲染。
'use client';

// 重新导出该库的导入。
export { One, Two, Three } from 'react-native-unoptimized';
```

避免使用 `export * from '...'`，因为这会破坏服务器与客户端互操作的某些内部机制。

用 `"use client"` 标记的模块不能从 Server Components 用点号访问。这意味着如果 `react-native` 包没有进一步优化，`StyleSheet.create` 或 `Platform.OS` 之类的操作在服务器上不会工作。

## Suspense

可以使用 React Suspense，在等待数据加载时从服务器流式传回部分 UI。

在下面的示例中，客户端会立刻返回 `Loading...` 文本，一秒钟后 `<MediumTask>` 完成渲染时，会把文本替换为 `Medium task done!`。`<ExpensiveTask>` 需要三秒加载，完成后会把文本替换为 `Expensive task done!`。

```tsx app/index.tsx (Client Component)
import { Suspense } from 'react';
import { renderMediumTask, renderExpensiveTask } from '@/actions/tasks';

export default function App() {
  return <Suspense fallback={<Text>Loading...</Text>}>{renderTasks()}</Suspense>;
}
```

```tsx actions/tasks.tsx (Server Functions)
'use server';

export async function renderTasks() {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <>
        <MediumTask />
        <Suspense fallback={<Text>Loading...</Text>}>
          <ExpensiveTask />
        </Suspense>
      </>
    </Suspense>
  );
}

async function MediumTask() {
  // 等待一秒后再 resolve。
  await new Promise(resolve => setTimeout(resolve, 1000));
  return <Text>Medium task done!</Text>;
}

async function ExpensiveTask() {
  // 等待三秒后再 resolve。
  await new Promise(resolve => setTimeout(resolve, 3000));
  return <Text>Expensive task done!</Text>;
}
```

如果移除 `<ExpensiveTask>` 周围的 `Suspense` 包装，你会看到 `Loading...` 会等到两个组件都完成渲染后才更新 UI。这让你可以增量控制加载状态。有时等待一切一起加载是合理的（大多数时候），而另一些时候，尽早流式传回 UI 更有益（就像 ChatGPT 中的文本响应）。

## 密钥

Server Components 可以访问密钥和服务端 API。可以使用 `process.env` 对象访问环境变量。可以通过在项目中导入 `server-only` 模块，确保某个模块永远不会在客户端运行。

```tsx actions/renderData.tsx
// 如果模块在客户端运行，这会断言失败。
import 'server-only';

import { Text } from 'react-native';

export async function renderData() {
  // 这段代码只在服务器上运行。
  const data = await fetch('https://my-endpoint/', {
    headers: {
      Authorization: `Bearer ${process.env.SECRET}`,
    },
  });

  // ...
  return <div />;
}
```

可以在 **.env** 文件中定义密钥：

```text .env
SECRET=123
```

> 更新环境变量不需要重启开发服务器。它们会在每次请求时自动重新加载。

## 平台检测

要检测代码是为哪个平台打包的，使用 `process.env.EXPO_OS` 环境变量。例如 `process.env.EXPO_OS === 'ios'`。优先使用它而不是 `Platform.OS`，因为 `react-native` 尚未完全针对 React Server Components 优化，不会按预期工作。

可以通过 `typeof window === 'undefined'` 检查来检测代码是否在服务器上运行。这在客户端设备上始终返回 `true`，在服务器上返回 `false`。

## 用 Jest 测试

库作者可以使用 `jest-expo` 测试其模块对 Server Components 的支持。更多内容见[测试 React Server Components](/guides/testing-rsc)指南。

## 元数据

React Server Components 是 React 19 的特性。为了启用它们，Expo CLI 会在所有平台上自动使用 React 的特殊 canary 构建。将来，当 React Native 默认启用 React 19 时，它会被移除。

因此，你可以使用 React 19 特性，例如在应用中任何地方放置 `<meta>` 标签（仅 Web）。

```tsx app/index.tsx
export default function Index() {
  return (
    <>
      {process.env.EXPO_OS === 'web' && (
        <>
          <meta name="description" content="Hello, world!" />
          <meta property="og:image" content="/og-image.png" />
        </>
      )}
      <MyComponent />
    </>
  );
}
```

可以用它代替 `expo-router/head` 的 `Head` 组件，但目前只在 Web 上工作。

## 请求头

可以使用 `expo-router/rsc/headers` 模块访问用于向 Server Component 发出请求的请求头。

```tsx actions/renderHome.tsx
import { unstable_headers } from 'expo-router/rsc/headers';

export async function renderHome() {
  const authorization = (await unstable_headers()).get('authorization');

  return <Text>{authorization}</Text>;
}
```

`unstable_headers` 函数返回一个 promise，解析为只读的 `Headers` 对象。

### 要点

- 此 API 不能与构建时渲染（`render: 'static'`）一起使用，因为请求头会根据请求动态变化。将来，如果输出模式是 `static`，此 API 会断言失败。
- `unstable_headers` 仅用于服务器，不能在客户端使用。

## 完整 React Server Components 模式

:::warning
此模式是[实验性](/more/release-statuses#experimental)的。
:::

启用完整的 React Server Components 支持可以让你利用更多特性。在此模式下，路由的默认渲染模式是服务器组件而不是客户端组件。它仍在开发中，因为 Router 和 React Navigation 需要重写以支持并发。

要启用完整 Server Components 模式，需要在应用配置中启用 `reactServerComponentRoutes` 标志：

```json app.json
{
  "expo": {
    "experiments": {
      "reactServerFunctions": true,
      "reactServerComponentRoutes": true
    }
  }
}
```

启用后，所有路由默认都会作为 Server Components 渲染。将来这会减少服务器/客户端的瀑布，并启用构建时渲染以提供更好的离线支持。

- 目前没有栈路由。自定义布局、`Stack`、`Tabs` 和 `Drawer` 尚不支持 Server Components。
- 大多数 `Link` 组件 props 尚不支持。

### 重新加载 Server Components

> 这仅限于完整 React Server Components 模式。

在开发中，Server Components 会在每次请求时重新加载。这意味着你可以更改服务器组件，并立即在客户端运行时中看到反映。你可能希望以编程方式手动触发重新加载事件，以重新获取数据或重新渲染组件。可以使用 `useRouter` hook 的 `router.reload()` 函数完成。

```tsx components/button.tsx
'use client';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

export function Button() {
  const router = useRouter();
  return (
    <Text
      onPress={() => {
        // 重新加载当前路由。
        router.reload();
      }}>
      Reload current route
    </Text>
  );
}
```

如果路由是在构建时渲染的，它不会在客户端重新渲染。这是因为渲染代码不包含在生产服务器中。

### 构建时渲染

> 这仅限于完整 React Server Components 模式。

Expo Router 支持两种不同的 Server Components 渲染模式：构建时渲染和请求时渲染。可以通过 `unstable_settings` 导出在每条路由上指明这些模式：

```tsx app/index.tsx
import { Text, View } from 'react-native';

export const unstable_settings = {
  // 此组件将在构建时渲染，并且在生产环境中永不重新渲染。
  render: 'static',
};

export default function Index() {
  return (
    <View>
      <Text>Hello, world!</Text>
    </View>
  );
}
```

- `render: 'static'` 会在构建时渲染组件，并且在生产环境中永不重新渲染。这类似于经典静态站点生成器的工作方式。
- `render: 'dynamic'` 会在请求时渲染组件，并在每次请求时重新渲染。这类似于服务端渲染的工作方式。

如果想要客户端渲染，把数据获取移到 Client Component，并在本地控制渲染。

标记为 `static` 输出的路由会在构建时渲染并嵌入原生二进制。这使得无需发出服务器请求即可渲染路由（因为服务器请求是在下载应用时发出的）。

当前默认是 `dynamic` 渲染。将来，我们会让缓存和优化更智能、更自动。

可以用 `generateStaticParams` 函数在构建时生成静态页面。这对必须只在构建时运行、而不在服务器上运行的组件很有用。

```tsx app/shapes/[shape].tsx
import { Text } from 'react-native';

// 添加 `unstable_settings.render: 'static'` 会阻止此组件在服务器上运行。
export const unstable_settings = {
  render: 'static',
};

// 此函数会为每种形状生成静态页面。
export async function generateStaticParams() {
  return [{ shape: 'square' }];
}

export default function ShapeRoute({ shape }) {
  return <Text>{shape}</Text>;
}
```

### CSS

> 这仅限于完整 React Server Components 模式。

Expo Router 支持在 Server Components 中导入全局 CSS 和 CSS 模块。

```tsx app/index.tsx
import './styles.css';
import styles from './styles.module.css';

export default function Index() {
  return <div className={styles.container}>Hello, world!</div>;
}
```

CSS 会从服务器提升到客户端 bundle 中。

## 部署

> 通用 React Server Components 仍处于 [beta](/more/release-statuses#beta)。

### Web

首先构建 Web 项目：

```sh
npx expo export -p web
```

然后可以用 `npx expo serve` 在本地托管，或部署到云端：

- [用 EAS 即时部署](/eas/hosting/get-started) —— EAS Hosting 是部署 Expo API 路由和服务器的最佳方式。

### 原生

可以按照服务器部署指南部署原生 React Server Components：

- [把原生服务器部署到 EAS](/router/web/api-routes#native-deployment) —— 部署版本化服务器并链接到生产原生应用。

## 已知限制

> 这是我们正在积极开发的非常早期的技术预览。

- Expo Snack 不支持打包 Server Components。
- EAS Update 尚不能与 Server Components 一起工作。
- DOM 组件在生产环境中尚不能使用 React Server Functions。
- 生产部署仍然有限，尚不推荐。
- 尚不支持把 RSC 载荷服务端渲染为 HTML。这意味着静态和服务器输出还不能完全工作。
- [`generateStaticParams`](/router/web/static-rendering#generatestaticparams) 在完整 React Server Components 模式中仅部分支持。
- 尚不支持 HTML `form` 与 Server Functions 的集成（这会部分自动工作，但数据未加密）。
- 原生上不支持 `StyleSheet.create` 和 `Platform.OS`。样式使用普通对象，平台检测使用 `process.env.EXPO_OS`。
- 由于 Hermes 运行时的限制，调用其他 Server Functions 的 React Server Functions 在 Hermes 上不受支持。这可能会随着 Static Hermes 得到解决。
