---
title: 'expo-router 包参考'
description: 用于 React Native 和 Web 应用的基于文件的路由库。
---

# expo-router 包参考

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-router` 是用于 React Native 和 Web 应用的路由库。它使用基于文件的路由系统来管理导航，并提供原生导航组件。

- [Expo Router 指南](/router/introduction)：了解 Expo Router 的基础知识、导航模式、核心概念等。

:::note
**重要** 在 **SDK 56 及更高版本**中，Expo Router 不再支持在应用代码中从外部 `@react-navigation/*` 包导入。请将这些导入重定向到对应的 `expo-router` 入口点。运行 [codemod](/router/migrate/sdk-55-to-56#automated-migration) 或按照 [SDK 55 到 56 迁移指南](/router/migrate/sdk-55-to-56) 来更新你的项目。
:::

## 安装

要在项目中使用 Expo Router，你需要进行安装。请按照 Expo Router 安装指南中的说明操作：

- [安装 Expo Router](/router/installation)：了解如何在项目中安装 Expo Router。

## 应用配置中的配置

如果你使用[默认模板](/more/create-expo#--template)创建新项目，`expo-router` 的[配置插件](/config-plugins/introduction)已经在你的应用配置中配置好了。

```json app.json
{
  "expo": {
    "plugins": ["expo-router"]
  }
}
```

| 属性 | 描述 | 默认值 |
| --- | --- | --- |
| `root` | 将路由目录从 `app` 更改为其他值。除非有特定需求，否则避免使用此属性。 | `"app"` |
| `origin` | public 文件夹中资源托管的正式环境 origin URL。`fetch` 函数经过 polyfill，以支持在正式环境中从该 origin 发起相对请求。开发环境的 origin 通过 Expo CLI 开发服务器推断得出。 | `undefined` |
| `headOrigin` | 用于 `expo-router/head` 模块中 iOS handoff 的更具体的 origin URL。默认等于 `origin`。 | `undefined` |
| `asyncRoutes` | 启用异步路由（懒加载）。在 SDK 58 及更高版本中于 Web 上稳定并默认启用；在原生平台上为实验性且默认禁用。可以是布尔值、字符串（`"development"` 或 `"production"`），或包含平台特定值的对象（`{ android, ios, web, default }`）。显式指定的平台值优先于 `default`。正式环境的异步路由仅支持 Web。 | `{ web: true }` |
| `platformRoutes` | 启用或禁用平台特定路由（例如 **index.android.tsx** 和 **index.ios.tsx**）。 | `true` |
| `sitemap` | 启用或禁用在 **/_sitemap** 自动生成的站点地图。 | `true` |
| `partialRouteTypes` | 启用部分类型化路由生成。这使 TypeScript 能够对路由进行类型检查，而无需所有路由都是静态可知的。 | `true` |
| `redirects` | 一组静态重定向规则。每条规则应包含 `source`、`destination`，并可包含 `permanent`（默认为 `false`）和 `methods`（要重定向的 HTTP 方法）。 | `undefined` |
| `rewrites` | 一组静态重写规则。每条规则应包含 `source`、`destination`，并可包含 `methods`（要重写的 HTTP 方法）。 | `undefined` |
| `headers` | 设置在服务器每个路由响应上的一组请求头。值可以是字符串或字符串数组。 | `undefined` |
| `pageHeaders` | 设置在服务器特定页面响应上的一组请求头规则。每条规则应包含 `source` 和 `headers`。规则仅适用于页面响应，不适用于 API 路由或数据加载器。 | `undefined` |
| `disableSynchronousScreensUpdates` | 禁用原生屏幕的同步布局更新。在某些情况下有助于提升性能。 | `false` |
| `unstable_useServerMiddleware` | 自 SDK 58 起不再需要且无效。请从应用配置中移除此选项。 | `false`（已弃用） |
| `unstable_useServerDataLoaders` | 自 SDK 58 起不再需要且无效。请从应用配置中移除此选项。 | `false`（已弃用） |
| `unstable_useServerRendering` | 自 SDK 58 起不再需要且无效。请从应用配置中移除此选项。 | `false`（已弃用） |
| `apiRoutes` | 使用静态或服务器输出启用 API 路由。服务器输出默认为 `true`，静态输出默认为 `false`。 | 取决于 web.output |

## 用法

有关核心概念、标记模式、导航布局和常见导航模式的信息，请从 Router 101 部分开始：

- [Router 101](/router/basics/core-concepts)

## API 列表

| API | 描述 |
| --- | --- |
| [Stack](/versions/latest/sdk/router/stack) | Stack 导航器、工具栏和屏幕组件 |
| [Link](/versions/latest/sdk/router/link) | Link 和 Redirect 组件 |
| [Color](/versions/latest/sdk/router/color) | 平台颜色工具 |
| [Native Tabs](/versions/latest/sdk/router/native-tabs) | 原生标签页导航 |
| [Split View](/versions/latest/sdk/router/split-view) | 分屏视图布局 |
| [UI](/versions/latest/sdk/router/ui) | 无头标签页组件 |

## API

```js
import { useRouter, Tabs, Navigator, Slot } from 'expo-router';
```
