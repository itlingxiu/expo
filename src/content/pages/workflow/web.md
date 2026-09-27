---
title: 用 Expo 开发网站
description: 了解如何为 Web 开发应用，从而构建通用应用。
---

# 用 Expo 开发网站

Expo 对用 React 构建全栈网站提供一等支持。Expo 网站可以为了 SEO 和性能进行[静态渲染](/router/web/static-rendering)，或在浏览器中进行客户端渲染以获得更像应用的体验。

:::tabs
:::tab 通用
用 [React Native for web](https://github.com/necolas/react-native-web) 的 `<Text>` 组件在任何平台上渲染文本。

```jsx app/index.js
import { Text } from 'react-native';

export default function Page() {
  return <Text>Home page</Text>;
}
```

React Native for web（RNW）是一组组件库，例如 `<View>` 和 `<Text>`，它们包装 `react-dom` 原语，例如 `<div>`、`<p>` 和 `<img>`。为 Web 开发时 RNW 是可选的，因为你可以直接使用 React DOM，但在跨平台构建时我们通常建议使用它，因为它能最大化代码复用。

> React Native for web 被用来驱动整个 [X](https://x.com/) 网站。
:::
:::tab 仅 Web
你也可以编写仅用于 Web 的 React DOM 组件，例如 `<div>`、`<p>` 等，但这些组件不会在原生平台上渲染。

```jsx app/index.js
export default function Page() {
  return <p>Home page</p>;
}
```

Expo 完全支持构建仅 Web 的组件，不过你可能希望组织代码，以便同时更好地支持 Web 和原生平台。更多内容见[平台特定模块](/router/advanced/platform-specific-modules)。
:::
:::

Expo SDK 中的所有库都构建为同时支持浏览器和服务器渲染环境（在适用时）。库也会针对它们所面向的各个平台进行优化。

Fast Refresh、调试、环境变量和[打包](/guides/customizing-metro)等开发功能也完全通用，从而实现统一的开发者体验。当你为生产构建时，Expo CLI 会**自动为各个平台优化代码**，使用[平台 shaking](/guides/tree-shaking#平台-shaking)等技术。

## 开始使用

### 安装 Web 依赖

:::tabs
:::tab npm
```sh
$ npx expo install react-dom react-native-web @expo/metro-runtime
```
:::
:::tab yarn
```sh
$ yarn expo install react-dom react-native-web @expo/metro-runtime
```
:::
:::tab pnpm
```sh
$ pnpm expo install react-dom react-native-web @expo/metro-runtime
```
:::
:::tab bun
```sh
$ bun expo install react-dom react-native-web @expo/metro-runtime
```
:::
:::

<details>
<summary>应用中还没有使用 <code>expo</code> 包？</summary>

如果你还没有把 Expo 加入 React Native 应用，可以[安装 Expo modules](/bare/installing-expo-modules)（推荐），或只安装 `expo` 包并配置应用入口文件。这允许你面向 Web，但不会包含对 Expo SDK 的支持。

1. 在项目中安装 [Expo CLI](/more/expo-cli)：

:::tabs
:::tab npm
```sh
$ npm install expo
```
:::
:::tab yarn
```sh
$ yarn add expo
```
:::
:::tab pnpm
```sh
$ pnpm add expo
```
:::
:::tab bun
```sh
$ bun add expo
```
:::
:::

2. 修改入口文件，使用 [`registerRootComponent`](/versions/latest/sdk/expo#registerrootcomponentcomponent) 而不是 `AppRegistry.registerComponent`：

```diff index.js
diff --git a/index.js b/index.js
--- a/index.js
+++ b/index.js
@@ -1,5 +1,4 @@
-import {AppRegistry} from 'react-native';
-import {name as appName} from './app.json';
+import {registerRootComponent} from 'expo';
 import App from './App';

-AppRegistry.registerComponent(appName, () => App);
+registerRootComponent(App);
```

</details>

### 启动开发服务器

现在可以用以下命令启动开发服务器并在浏览器中开发：

:::tabs
:::tab npm
```sh
$ npx expo start --web
```
:::
:::tab yarn
```sh
$ yarn expo start --web
```
:::
:::tab pnpm
```sh
$ pnpm expo start --web
```
:::
:::tab bun
```sh
$ bun expo start --web
```
:::
:::

可以把应用导出为生产网站：

:::tabs
:::tab npm
```sh
$ npx expo export --platform web
```
:::
:::tab yarn
```sh
$ yarn expo export --platform web
```
:::
:::tab pnpm
```sh
$ pnpm expo export --platform web
```
:::
:::tab bun
```sh
$ bun expo export --platform web
```
:::
:::

## 下一步

- [基于文件的路由](/router/introduction)：用 Expo Router 构建路由和导航。
- [静态渲染与 SEO](/router/web/static-rendering)：用 Expo Router 把网站渲染为静态 HTML，以改善 SEO 和性能。
- [用 EAS Hosting 即时部署](/eas/hosting/get-started)：EAS Hosting 是部署 Expo Router 和 React Native Web 应用的最佳方式，支持自定义域名、SSL 等。
- [自定义 JavaScript 打包器](/guides/customizing-metro)：为项目自定义 Metro 打包器。
