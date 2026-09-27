---
title: 开发工具插件
description: 了解如何使用开发工具插件检查并调试 Expo 项目。
---

# 开发工具插件

开发工具插件在本地开发环境中可用，帮助你调试应用。它们由你添加到项目中的少量代码组成，在应用与外部 Chrome 窗口之间建立双向通信。这种设置提供显示工具来检查应用、为测试触发某些行为，以及更多功能。

开发工具插件类似于在开发构建和 Expo Go 中可用的 Flipper 插件，并且不需要向项目添加原生模块或配置插件。

## 向项目添加开发工具插件

要把开发工具插件添加到应用，把它作为包安装，并添加一小段代码把该代码连接到应用。这段代码从应用的根组件调用，以在应用和插件之间建立双向通信。然后，在应用以开发模式运行的整个期间，插件都可以检查应用的各个方面。

所有 [Expo 开发工具插件](#expo-开发工具插件)以及用[我们的创建工具](/debugging/create-devtools-plugins)创建的插件，都会导出一个 hook，你可以用它把插件连接到应用。当应用不在开发模式中运行时，该 hook 以及它返回的任何函数都会变成空操作。

有些插件 hook 需要与插件如何检查应用相关的参数。例如，用于检查 React Navigation 状态的插件可能需要导航根的引用。

要开始使用插件，在应用的根组件中使用该 hook：

```jsx App.js
import { useMyDevToolsPlugin } from 'my-devtools-plugin';

export default App() {
  useMyDevToolsPlugin();
  return (/* 应用的其余部分 */)
}
```

在某些情况下，你可能需要直接与插件交互。所有插件都通过 `expo/devtools` 的导出来通信，你可以通过 `useDevToolsPluginClient` 发送和监听消息。务必向 `useDevToolsPluginClient` 传入与插件 Web 用户界面所用相同的插件名称：

```jsx App.js
import { useDevToolsPluginClient } from 'expo/devtools';

export default App() {
  const client = useDevToolsPluginClient('my-devtools-plugin');
   useEffect(() => {
    // 接收消息
    client?.addMessageListener("ping", (data) => {
      alert(`Received ping from ${data.from}`);
    });
    // 发送消息
    client?.sendMessage("ping", { from: "app" });
   }, []);

  return (/* 应用的其余部分 */)
}
```

### 与 Expo Go 和开发构建的兼容性

开发工具插件应只包含 JavaScript 代码。它们通常与 Expo Go 和[开发构建](/develop/development-builds/introduction)兼容，添加插件时不应需要创建新的开发构建。如果插件所检查的包的底层模块包含原生代码，并且不属于 Expo Go，请创建新的开发构建，以便同时使用该包中的组件和插件。

例如，检查 [React Native Firebase](/guides/using-firebase#使用-react-native-firebase) 的开发工具插件不能与 Expo Go 一起工作。React Native Firebase 包含不属于 Expo Go 的原生代码。要同时使用该开发工具插件和 React Native Firebase，请创建开发构建。

## 使用开发工具插件

安装开发工具插件并把所需的连接代码添加到项目后，可以用 `npx expo start` 启动开发服务器。然后按 <kbd>Shift</kbd> + <kbd>M</kbd> 打开可用开发工具插件列表。选择要使用的插件，它会在新的 Chrome 窗口中打开。

> 用 Expo CLI 启动开发服务器时，可以按 <kbd>?</kbd> 来**显示所有命令**。这会显示额外命令，包括打开**更多工具**的快捷方式。也可以在此菜单中选择开发工具插件。

## Expo 开发工具插件

Expo 为常见调试任务提供一些开发工具插件。按照下面的说明开始在应用中使用它们。

:::note
下面每个开发工具插件 hook 都只在开发模式中启用插件。它不会影响生产 bundle。
:::

### React Navigation

受 [`@react-navigation/devtools`](https://github.com/react-navigation/react-navigation/tree/main/packages/devtools) 启发，React Navigation 开发工具插件允许查看 [React Navigation](https://reactnavigation.org/) 操作和状态的历史。你也可以回溯到导航历史中的先前点，并向应用发送 deep link。该插件与 [Expo Router](/router/introduction) 完全兼容。

要使用该插件，先安装这个包：

:::tabs
:::tab npm
```sh
npx expo install @dev-plugins/react-navigation
```
:::
:::tab yarn
```sh
yarn expo install @dev-plugins/react-navigation
```
:::
:::tab pnpm
```sh
pnpm expo install @dev-plugins/react-navigation
```
:::
:::tab bun
```sh
bun expo install @dev-plugins/react-navigation
```
:::
:::

在应用入口把导航根传给插件：

:::tabs
:::tab Expo Router
```jsx app/_layout.js
import { useEffect, useRef } from 'react';
import { useNavigationContainerRef, Slot } from 'expo-router';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';

export default Layout() {
  const navigationRef = useNavigationContainerRef();

  useReactNavigationDevTools(navigationRef);

  return <Slot />;
}
```
:::
:::tab React Navigation
```jsx App.js
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';

export default function App() {
  const navigationRef = useNavigationContainerRef();

  useReactNavigationDevTools(navigationRef);

  return (
    <NavigationContainer ref={navigationRef}>{/* ... */}</NavigationContainer>
  );
}
```
:::
:::

在终端运行 `npx expo start`，按 <kbd>Shift</kbd> + <kbd>M</kbd> 打开开发工具列表，然后选择 React Navigation 插件。这会打开插件的 Web 界面，在你浏览应用时显示导航历史。

### Apollo Client

受 [`react-native-apollo-devtools`](https://github.com/razorpay/react-native-apollo-devtools) 启发，Apollo Client 开发工具插件允许检查 Apollo Client 的缓存、查询和 mutation。

要使用该插件，先安装这个包：

:::tabs
:::tab npm
```sh
npx expo install @dev-plugins/apollo-client
```
:::
:::tab yarn
```sh
yarn expo install @dev-plugins/apollo-client
```
:::
:::tab pnpm
```sh
pnpm expo install @dev-plugins/apollo-client
```
:::
:::tab bun
```sh
bun expo install @dev-plugins/apollo-client
```
:::
:::

然后在应用的根组件中，或在你用 `ApolloProvider` 包裹应用其余部分的地方，把客户端实例传给插件：

```jsx App.js
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { useApolloClientDevTools } from '@dev-plugins/apollo-client';

const client = new ApolloClient({
  uri: 'https://demo.test.com/',
  cache: new InMemoryCache(),
});

export default function App() {
  useApolloClientDevTools(client);

  return <ApolloProvider>{/* ... */}</ApolloProvider>;
}
```

在终端运行 `npx expo start`，按 <kbd>Shift</kbd> + <kbd>M</kbd> 打开开发工具列表，然后选择 Apollo Client 插件。这会打开插件的 Web 界面，在应用执行 Apollo Client 操作时显示查询历史、缓存和 mutation。

### React Query

受 [`react-query-native-devtools`](https://github.com/bgaleotti/react-query-native-devtools) 启发，React Query 开发工具插件让你探索数据和查询、缓存状态，并从 [TanStack Query](https://tanstack.com/query/latest/) 的缓存中重新获取和移除查询。

要使用该插件，先安装这个包：

:::tabs
:::tab npm
```sh
npx expo install @dev-plugins/react-query
```
:::
:::tab yarn
```sh
yarn expo install @dev-plugins/react-query
```
:::
:::tab pnpm
```sh
pnpm expo install @dev-plugins/react-query
```
:::
:::tab bun
```sh
bun expo install @dev-plugins/react-query
```
:::
:::

然后在应用的根组件中，或在你用 `QueryClientProvider` 包裹应用其余部分的地方，把客户端实例传给插件：

```jsx App.js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useReactQueryDevTools } from '@dev-plugins/react-query';

const queryClient = new QueryClient({});

export default function App() {
  useReactQueryDevTools(queryClient);

  return <QueryClientProvider client={queryClient}>{/* ... */}</QueryClientProvider>;
}
```

在终端运行 `npx expo start`，按 <kbd>Shift</kbd> + <kbd>M</kbd> 打开开发工具列表，然后选择 React Query 插件。这会打开插件的 Web 界面，显示应用中使用的查询。

### Redux

`redux-devtools-expo-dev-plugin` 基于 [Redux DevTools](https://github.com/reduxjs/redux-devtools/)（来自 Chrome 扩展）。它提供操作的实时列表以及它们如何影响状态，并能从 DevTools 回溯、重放和分发操作。

要使用该插件，先安装这个包：

:::tabs
:::tab npm
```sh
npx expo install redux-devtools-expo-dev-plugin
```
:::
:::tab yarn
```sh
yarn expo install redux-devtools-expo-dev-plugin
```
:::
:::tab pnpm
```sh
pnpm expo install redux-devtools-expo-dev-plugin
```
:::
:::tab bun
```sh
bun expo install redux-devtools-expo-dev-plugin
```
:::
:::

如果你使用 `@reduxjs/toolkit`，修改 `configureStore` 调用，传入 `devTools: false` 以禁用内置开发工具。然后通过拼接 `devToolsEnhancer()` 加入 Expo DevTools 插件增强器。`configureStore` 调用将如下所示：

```js store.js
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';

const store = configureStore({
  reducer: rootReducer,
  devTools: false,
  enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(devToolsEnhancer()),
});
```

在终端运行 `npx expo start`，按 <kbd>Shift</kbd> + <kbd>M</kbd> 打开开发工具列表，然后选择 `redux-devtools-expo-dev-plugin`。这会打开插件的 Web 界面，在操作被分发时显示操作和 store 的内容。

完整的安装和使用说明（包括直接使用 `redux` 而不是 `@reduxjs/toolkit` 的情况）见[项目 README](https://github.com/matt-oakes/redux-devtools-expo-dev-plugin)。

### TinyBase

TinyBase 开发工具插件把 TinyBase Store Inspector 连接到应用，允许你查看并更新应用 store 的内容。

要使用该插件，先安装这个包：

:::tabs
:::tab npm
```sh
npx expo install @dev-plugins/tinybase
```
:::
:::tab yarn
```sh
yarn expo install @dev-plugins/tinybase
```
:::
:::tab pnpm
```sh
pnpm expo install @dev-plugins/tinybase
```
:::
:::tab bun
```sh
bun expo install @dev-plugins/tinybase
```
:::
:::

然后在应用的根组件中，或在你用 store 的 `Provider` 包裹应用其余部分的地方，把客户端实例传给插件：

```jsx App.js
import { createStore } from 'tinybase';
import { useValue, Provider } from 'tinybase/lib/ui-react';
import { useTinyBaseDevTools } from '@dev-plugins/tinybase';

const store = createStore().setValue('counter', 0);

export default function App() {
  useTinyBaseDevTools(store);

  return <Provider store={store}>{/* ... */}</Provider>;
}
```

在终端运行 `npx expo start`，按 <kbd>Shift</kbd> + <kbd>M</kbd> 打开开发工具列表，然后选择 Tinybase 插件。这会打开插件的 Web 界面，在 store 被修改时显示其内容。
