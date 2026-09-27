---
title: 异步路由
description: 了解如何借助 Expo Router 的异步打包加快开发。
---

# 异步路由

:::warning
在 SDK 58 及更高版本中，Web 上的异步路由已稳定，并在开发和生产环境中默认启用。在原生平台上，异步路由仍是实验性的，需要显式启用，且仅在开发环境中受支持。当前限制见[注意事项](#注意事项)。
:::

> 演示视频：Expo Router 按路由异步打包的效果。

Expo Router 可以基于路由文件，使用 [React Suspense](https://react.dev/reference/react/Suspense) 自动拆分 JavaScript bundle。这样可以加快开发，因为只有你导航到的路由才会被打包或载入内存。这也可以用来减小应用的初始 bundle 体积。

使用 Hermes 引擎的应用从 bundle 拆分中受益较少，因为字节码已经预先做了内存映射。不过，它仍会改善 OTA 更新、React Server Components 和 Web 支持。

> 在**原生平台**上为生产环境打包时，所有 suspense 边界**都会被禁用**，也不会有加载状态。

## 工作原理

所有路由都被包裹在 suspense 边界中，并异步加载。这意味着第一次导航到某条路由时，加载会稍慢一些。不过一旦加载完成，它会被缓存，之后的访问会立即完成。

加载错误在父路由中通过 [`ErrorBoundary`](/router/error-handling#错误处理) 导出处理。

开发期间无法对异步路由做静态分析，因此即使文件没有导出默认组件，所有文件也会被当作路由。组件打包并加载之后，任何无效路由都会使用一个回退警告屏幕。

如果你熟悉高级打包技术，异步路由功能由 [React Suspense](https://react.dev/reference/react/Suspense)、[基于路由的 bundle 拆分](https://legacy.reactjs.org/docs/code-splitting.html#route-based-code-splitting) 和（开发环境中的）[惰性打包](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0605-lazy-bundling.md) 组成。

## 设置

在 SDK 58 及更高版本中，异步路由在 Web 的开发和生产环境中默认启用。原生平台默认禁用。在 SDK 57 及更早版本中，每个平台都需要显式启用异步路由。

在[应用配置](/workflow/configuration)的 Expo Router 配置插件中配置 `asyncRoutes`。要在 Web 上禁用异步路由，将 `asyncRoutes` 设为 `{ "web": false }`。将 `asyncRoutes` 设为 `false` 会在所有平台上禁用该功能：

```json app.json
{
  "expo": {
    "plugins": [["expo-router", { "asyncRoutes": false }]]
  }
}
```

也可以使用 `"development"` 或 `"production"`，仅在该模式下启用异步路由，或使用带平台特定设置的对象（`default`、`android`、`ios` 或 `web`）：

- 显式的平台值优先于 `default`。
- 设置 `{ "default": false }` 会在 Web 上禁用异步路由，除非 `web` 显式启用它们。
- 在 SDK 58 及更高版本中，只设置原生平台会保留 Web 的默认值。例如，`{ "android": true }` 的行为等同于 `{ "android": true, "web": true }`。原生生产构建仍然同步加载路由。

例如，下面的配置在两种模式下都在 Web 上启用异步路由，在开发环境的 iOS 上启用，同时在 Android 上禁用。它在 SDK 57 及更早版本中也可以作为显式启用：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://acme.com",
          "asyncRoutes": {
            "web": true,
            "android": false,
            "default": "development"
          }
        }
      ]
    ]
  }
}
```

更改设置后，启动或导出项目时用 `--clear` 清除 Metro 缓存：

:::tabs
:::tab npm
```sh
npx expo start --clear

# 或在导出时
npx expo export --clear
```
:::
:::tab yarn
```sh
yarn expo start --clear

# 或在导出时
yarn expo export --clear
```
:::
:::tab pnpm
```sh
pnpm expo start --clear

# 或在导出时
pnpm expo export --clear
```
:::
:::tab bun
```sh
bun expo start --clear

# 或在导出时
bun expo export --clear
```
:::
:::

## 静态渲染

生产环境的 Web 应用支持静态渲染：在 Node.js 中同步渲染所有 Suspense 边界，然后根据某个 HTML 文件选定的全部路由，把所有异步 chunk 链接到 HTML 中。这样可以避免服务器导航时出现一连串加载状态。后续导航会递归加载任何缺失的 chunk。

为了保证首次渲染一致，通向某个 URL 叶子路由的所有布局路由都会包含在初始服务器响应中。

所有用 `unstable_settings = { anchor: '...' }` 定义的锚点路由都会包含在初始 HTML 文件中，因为首次渲染需要它们。例如，如果服务器请求的是一个模态，模态下方渲染的屏幕也会被包含，以确保模态正确渲染。

## 注意事项

异步路由有以下限制：

- 异步路由尚不支持原生生产应用。
- 在开发环境中，运行时 JavaScript 是惰性打包的，因此你可能会遇到 HTML 与可用 JavaScript 不匹配的情况。
- 自定义 [`SuspenseFallback`](/router/error-handling#使用-suspense-回退的加载状态) 导出不能与异步路由一起使用。在 SDK 58 及更高版本中，除非禁用异步路由，否则 Web 应用使用默认加载回退。要保留自定义回退，请在 `expo-router` 配置插件中设置 `asyncRoutes: { web: false }`。应用配置示例见[迁移指南](/router/migrate/sdk-57-to-58#检查异步路由的默认行为)。
