---
title: 错误处理与加载状态
description: 了解如何在使用 Expo Router 时处理未匹配路由、错误和加载状态。
---

# 错误处理与加载状态

本指南说明如何在使用 Expo Router 时处理应用中的未匹配路由、错误和加载状态。

## 未匹配的路由

![各平台上显示的未匹配路由示例](/static/images/expo-router/unmatched.webp)

原生应用没有服务器，因此严格来说不存在 404。不过，如果你在实现一个通用路由，处理缺失路由就有意义。每个应用都会自动处理这一点，你也可以自定义它。

```tsx src/app/+not-found.tsx
import { Unmatched } from 'expo-router';
export default Unmatched;
```

这会渲染默认的 `Unmatched`。你可以导出任何想要替代渲染的组件。建议提供一个指向 `/` 的链接，以便用户导航回主屏幕。

### 路由优先级

在 Web 上，文件按以下顺序提供：

1. **public** 目录中的静态文件。
2. app 目录中的标准路由和动态路由。
3. app 目录中的 [API 路由](/router/web/api-routes)。
4. 未找到路由最后提供，状态码为 404。

## 错误处理

Expo Router 提供细粒度的错误处理，以便将来采用更有明确主张的数据加载策略。

![在 Expo Router 中使用 ErrorBoundary 捕获路由组件中的错误](/static/images/expo-router/error-boundaries.webp)

可以从任意路由导出嵌套的 [`ErrorBoundary`](/versions/latest/sdk/router#errorboundary) 组件，用 [React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) 拦截并格式化组件级错误：

```tsx src/app/home.tsx
import { View, Text } from 'react-native';
import { type ErrorBoundaryProps } from 'expo-router';

/* @info */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
/* @end */
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>{error.message}</Text>
      <Text onPress={retry}>Try Again?</Text>
    </View>
  );
}

export default function Page() { ... }
```

导出 `ErrorBoundary` 后，该路由实际上会被 React Error Boundary 包裹：

```tsx Virtual
function Route({ ErrorBoundary, Component }) {
  return (
    <Try catch={ErrorBoundary}>
      <Component />
    </Try>
  );
}
```

当不存在 `ErrorBoundary` 时，错误会抛给最近的父级 `ErrorBoundary`，并接受 [`error`](/versions/latest/sdk/router#error) 和 [`retry`](/versions/latest/sdk/router#retry) 属性。

### 布局中屏幕的错误边界

屏幕错误边界可以在某个屏幕抛出错误时，保持导航器 UI（例如标题栏和标签栏）仍然挂载。在布局或导航器上配置它：

```tsx src/app/_layout.tsx
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { Text } from 'react-native';

function ScreenErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <Text onPress={retry}>Try again: {error.message}</Text>;
}

// 为此布局及嵌套布局中的屏幕配置边界。
export const unstable_settings = {
  screenErrorBoundary: ScreenErrorBoundary,
};

export default function Layout() {
  return <Stack />;
}
```

也可以在导航器上配置该边界：

```tsx src/app/_layout.tsx
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { Text } from 'react-native';

function ScreenErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <Text onPress={retry}>Try again: {error.message}</Text>;
}

// 此属性会覆盖同一批屏幕上的 unstable_settings.screenErrorBoundary。
export default function Layout() {
  return <Stack unstable_screenErrorBoundary={ScreenErrorBoundary} />;
}
```

Expo Router 按以下顺序应用错误边界：

1. 从屏幕导出的 `ErrorBoundary`
2. 导航器级属性（例如 `Stack`）
3. 在 **\_layout.tsx** 文件中声明的 `unstable_settings.screenErrorBoundary`

嵌套布局会继承 `unstable_settings.screenErrorBoundary`，除非它们定义了自己的屏幕错误边界。在嵌套布局中把 `screenErrorBoundary` 设为 `null`，即可停止继承。

### 进行中的工作

为了在有错误的情况下进行开发，React Native LogBox 需要以不那么激进的方式呈现。目前，它会为 `console.error` 和 `console.warn` 显示。理想情况下，它应该只为未捕获的错误显示。

## 使用 Suspense 回退的加载状态

:::warning
自定义 suspense 回退自 SDK 56 起可用。
:::

在 SDK 58 及更高版本中，[异步路由](/router/web/async-routes) 在 Web 上默认启用，并使用默认加载回退，而不是自定义的 `SuspenseFallback` 导出。要在 Web 上使用下面的示例，请在[应用配置](/workflow/configuration)的 `expo-router` 配置插件中设置 `asyncRoutes: { web: false }`。这会恢复同步路由加载和自定义回退支持。原生平台的默认值不变。

Expo Router 把每条路由包裹在 [React Suspense](https://react.dev/reference/react/Suspense) 边界中。可以从布局文件导出 [`SuspenseFallback`](/versions/latest/sdk/router#suspensefallback) 组件，自定义任意子路由挂起时显示的加载 UI：

```tsx src/app/_layout.tsx
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';

export function SuspenseFallback() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function RootLayout() {
  return <Stack />;
}
```

> 当多个父布局都定义了回退时，最近的父级优先。

### 访问路由参数

[`SuspenseFallback`](/versions/latest/sdk/router#suspensefallback) 组件接收 `route` 和 `params` 属性。可以用 `params` 为动态路由显示与上下文相关的加载状态，例如：

```tsx src/app/(app)/_layout.tsx
import { ActivityIndicator, Text, View } from 'react-native';
import { Stack, type SuspenseFallbackProps } from 'expo-router';

export function SuspenseFallback({ params }: SuspenseFallbackProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading profile {params.id}...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function AppLayout() {
  return <Stack />;
}
```

### 限制

- [异步路由](/router/web/async-routes) 不支持自定义 Suspense 回退。
