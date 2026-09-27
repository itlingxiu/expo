---
title: React Navigation 集成
description: 通过为 EAS Observe 启用 React Navigation 集成，跟踪按屏幕的渲染和可交互耗时。
---

# React Navigation 集成

EAS Observe 附带一个可选的 [React Navigation](https://reactnavigation.org/) 集成，它收集带有屏幕路由名称路径标签的按屏幕指标（例如 `/Tabs/Sessions`）。这让你可以在仪表盘中按屏幕比较导航性能，而不是只看应用范围的汇总。

如果你的应用使用 [Expo Router](/router/introduction)，请改用 [Expo Router 集成](/eas/observe/integrations/expo-router)。本页面向直接使用 React Navigation 的应用。

## 前置条件

- **Expo SDK 56 及更高版本**

  React Navigation 集成在 SDK 56 及更高版本上可用。在更早的 SDK 上，`expo-observe` 仍然跟踪应用范围的指标，但不会发出按屏幕的导航事件。

- **已经使用 EAS Observe 的应用**

  按照[开始使用](/eas/observe/get-started)安装 `expo-observe` 并创建第一次构建。

- **应用中已安装 `@react-navigation/native` 7 或更高版本**

  该集成在运行时依赖 `@react-navigation/native`（v7.0.0 或更高版本）。如果没有安装该包，集成会静默地不执行任何操作。

1. **启用集成**

   :::warning
   集成必须在挂载之前启用，并且不能在运行时切换。在应用已经挂载之后调用 `configure()`，或在会话中途切换该标志，会抛出错误。
   :::

   在模块作用域、任何屏幕挂载之前，用 `react-navigation` 集成标志调用 `Observe.configure()`：

   ```tsx App.tsx
   import { Observe } from 'expo-observe';

   Observe.configure({
     integrations: { 'react-navigation': true },
   });
   ```

2. **把集成连接到你的导航**

   如何连接集成取决于应用使用 React Navigation 的[动态还是静态配置](https://reactnavigation.org/docs/static-vs-dynamic/)。两种方式记录相同的按屏幕指标。

   :::tabs
   :::tab 动态

   对于[动态配置](https://reactnavigation.org/docs/hello-react-navigation/)，用 `<ObserveNavigationContainer>` 替换顶层的 `<NavigationContainer>`。它包裹标准容器，接受相同的 props，并转发相同的 ref。它还会订阅导航状态变化，以便记录按屏幕的渲染耗时。

   ```tsx App.tsx
   import { Observe } from 'expo-observe';
   import { ObserveNavigationContainer } from 'expo-observe/integrations/react-navigation';

   Observe.configure({
     integrations: { 'react-navigation': true },
   });

   export default function App() {
     return <ObserveNavigationContainer>{/* 你的导航器 */}</ObserveNavigationContainer>;
   }
   ```

   :::
   :::tab 静态

   使用[静态配置](https://reactnavigation.org/docs/static-configuration/)时，没有可替换的 `NavigationContainer`。`createStaticNavigation()` 会为你渲染一个。此时请自己创建导航 ref，把它传给返回的 `<Navigation>` 元素，并用同一个 ref 把该元素包在 `<ObserveNavigationProvider>` 中。该 provider 通过 ref 监听导航事件，并记录相同的按屏幕渲染耗时。

   ```tsx App.tsx
   import { createStaticNavigation, useNavigationContainerRef } from '@react-navigation/native';
   import { Observe } from 'expo-observe';
   import { ObserveNavigationProvider } from 'expo-observe/integrations/react-navigation';

   import { RootStack } from './navigation';

   Observe.configure({
     integrations: { 'react-navigation': true },
   });

   const Navigation = createStaticNavigation(RootStack);

   export default function App() {
     const navigationRef = useNavigationContainerRef();

     return (
       <ObserveNavigationProvider navigationRef={navigationRef}>
         <Navigation ref={navigationRef} />
       </ObserveNavigationProvider>
     );
   }
   ```

   :::note
   `ObserveNavigationProvider` 不会自己渲染容器。它监听你传入的 `navigationRef`。它必须是每个屏幕的祖先，这样 `useObserve()` 才能在它们内部工作。
   :::

   :::
   :::

3. **在屏幕中调用 `useObserve()`**

   使用 `useObserve()` 钩子获取自动限定到当前屏幕的 `markInteractive`。发出的事件会带上该屏幕的路径标签。

   ```tsx screens/Home.tsx
   import { useObserve } from 'expo-observe';
   import { useEffect } from 'react';

   export default function Home() {
     const { markInteractive } = useObserve();

     useEffect(() => {
       markInteractive();
     }, [markInteractive]);

     return (/* 你的屏幕内容 */);
   }
   ```

   :::note
   如果集成被禁用或没有安装 `@react-navigation/native`，`useObserve()` 会回退到全局的 `Observe.markInteractive`。无论集成状态如何，你都可以把该钩子留在原处。
   :::

## 筛选敏感的路由参数

:::note
在 **SDK 57 及更高版本**中可用。
:::

默认情况下，集成会在 `routeParams` 中包含所有可序列化的当前焦点路由参数。如果你的应用在路由参数中包含敏感值，把它们的键传给 `filteredParams`：

```tsx App.tsx
import { Observe } from 'expo-observe';

Observe.configure({
  integrations: {
    'react-navigation': {
      filteredParams: ['userId', 'token'],
    },
  },
});
```

集成会从 `routeParams` 中移除被筛选的键，并在事件上包含 `urlHidden: true`。`routeName` 不受影响，因为它由路由名称构成，从不包含参数值。

## 指标

### 按屏幕的首次渲染（`cold_ttr`）

**它测量什么：** 从分发导航动作（例如 `navigation.navigate()`）到目标屏幕首次获得焦点的时间。对于应用启动后的第一次焦点，测量从 JS 包加载完成时开始，并且事件包含 `isAppLaunch: true`。

在一个会话中，每个屏幕实例最多发出一次。

**事件参数：**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `routeName` | `string` | 路由名称路径（例如 `/Tabs/Sessions`）。 |
| `urlHidden` | `boolean` | 当某个路由参数被筛选时，以 `true` 出现。 |
| `routeParams` | `object` | 当前焦点路由参数（例如 `{ sessionId: 'abc' }`）。 |
| `isAppLaunch` | `boolean` | 相对于进程启动测量时为 `true`，后续导航为 `false`。 |

### 按屏幕的热渲染（`warm_ttr`）

**它测量什么：** 与 `cold_ttr` 相同，但针对在获得焦点之前已经渲染过的屏幕，通常是因为它们被预加载，或用户导航回它们。标签导航器的兄弟屏幕只有在已经挂载之后才算作热渲染。在 React Navigation v7 默认的 `lazy: true` 下，未聚焦的标签保持未挂载，它们的第一次焦点会被记录为 `cold_ttr`。

**事件参数：**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `routeName` | `string` | 路由名称路径（例如 `/Tabs/Sessions`）。 |
| `urlHidden` | `boolean` | 当某个路由参数被筛选时，以 `true` 出现。 |
| `routeParams` | `object` | 当前焦点路由参数（例如 `{ sessionId: 'abc' }`）。 |

### 按屏幕的可交互时间（`tti`）

**它测量什么：** 从分发导航动作到在目标屏幕上调用 `markInteractive()` 的时间。每次导航只记录第一次调用，因此多次调用 `markInteractive()` 是安全的。

**事件参数：**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `routeName` | `string` | 路由名称路径（例如 `/Tabs/Sessions`）。 |
| `urlHidden` | `boolean` | 当某个路由参数被筛选时，以 `true` 出现。 |
| `routeParams` | `object` | 当前焦点路由参数。 |
| `...` | `any` | 通过 `markInteractive({ ... })` 传入的任何自定义参数。 |

## 查看导航指标

在仪表盘中，打开你的项目，前往 [**Observe**](https://expo.dev/accounts/[account]/projects/[project]/observe)，并选择 **Navigation** 页面。它显示按屏幕的导航耗时，包括冷/热首次渲染时间和可交互时间。

在 CLI 中，你可以运行以下命令：

```sh
# 按路由名称分组的导航指标
eas observe:routes

# 筛选到特定指标或路由
eas observe:routes --metric cold_ttr --route-name /Tabs/Sessions
```

运行 `eas observe:routes --help` 查看标志的完整列表（时间范围、平台、应用版本等）。其他 `eas observe` 命令见[使用 EAS CLI 查询](/eas/observe/eas-cli)。

## 说明与排查

- `routeName` 由路由名称构成（`/Tabs/Sessions`），因此路由参数永远不会出现在路径中。这使指标在不同参数值之间保持稳定，从而仪表盘把它们归入同一组。参数值仍然可以通过事件上的 `routeParams` 获得。
- 只有在运行时安装了 `@react-navigation/native` 时，集成才会激活。如果没有安装，`useObserve()` 仍然可以工作，但不会发出按屏幕的导航指标。在没有 `@react-navigation/native` 的情况下渲染 `<ObserveNavigationContainer>` 或 `<ObserveNavigationProvider>` 会抛出错误。
- 必须在挂载之前通过 `Observe.configure({ integrations: { 'react-navigation': true } })` 启用集成。在应用已经挂载之后，或在 `<ObserveNavigationContainer>` 或 `<ObserveNavigationProvider>` 已经挂载之后切换它，会抛出错误。
- 使用静态配置时，把同一个 ref 同时传给 `<ObserveNavigationProvider>` 和 `<Navigation>` 元素。如果 provider 收到的 ref 没有连接到导航容器，则不会发出按屏幕的指标。
- `markInteractive()` 只有在屏幕获得焦点后才会记录。在未聚焦屏幕上的调用会更新内部状态，但在屏幕获得焦点之前不会发出 `tti` 事件。
- 在屏幕组件内部调用 `useObserve()`，而不是在更高层的包装器中。如果屏幕的身份在渲染之间发生变化，该钩子会记录警告。如果 `markInteractive()` 记录 `Calling markInteractive on unmounted screen` 或 `No metadata available for the current screen`，说明调用发生在屏幕组件之外或卸载之后。把调用移到屏幕组件内部的 `useEffect` 中。
- 关于 EAS Observe 的一般问题，见[排查问题](/eas/observe/reference/troubleshooting)。
