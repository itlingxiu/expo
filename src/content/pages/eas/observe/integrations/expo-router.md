---
title: Expo Router 集成
description: 通过为 EAS Observe 启用 Expo Router 集成，跟踪按路由的渲染和可交互耗时。
---

# Expo Router 集成

EAS Observe 附带一个可选的 [Expo Router](/router/introduction) 集成，它收集带有路由模式标签的按路由指标（例如 `/(tabs)/sessions/[sessionId]`）。这让你可以在仪表盘中按路由比较导航性能，而不是只看应用范围的汇总。

## 前置条件

- **Expo SDK 56 或更高版本**

  Expo Router 集成在 SDK 56 及更高版本上可用。在更早的 SDK 上，`expo-observe` 仍然跟踪应用范围的指标，但不会发出按路由的导航事件。

- **已经使用 EAS Observe 的应用**

  按照[开始使用](/eas/observe/get-started)安装 `expo-observe` 并创建第一次构建。

- **应用中已安装 Expo Router**

  该集成在运行时依赖 `expo-router`。如果没有安装该包，集成会静默地不执行任何操作。

1. **启用集成**

   :::warning
   集成必须在挂载之前启用，并且不能在运行时切换。在应用已经挂载之后调用 `configure()`，或在会话中途切换该标志，会抛出错误。
   :::

   在模块作用域、任何屏幕挂载之前，用 `expo-router` 集成标志调用 `Observe.configure()`：

   ```tsx src/app/_layout.tsx
   import { Observe } from 'expo-observe';

   Observe.configure({
     integrations: { 'expo-router': true },
   });
   ```

2. **在屏幕中调用 `useObserve()`**

   使用 `useObserve()` 钩子获取自动限定到当前路由的 `markInteractive`。发出的事件会带上该屏幕的路由模式标签。

   ```tsx src/app/(tabs)/index.tsx
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
   如果集成被禁用或没有安装 `expo-router`，`useObserve()` 会回退到全局的 `Observe.markInteractive`。无论集成状态如何，你都可以把该钩子留在原处。
   :::

## 筛选敏感的 URL 参数

:::note
在 **SDK 57 及更高版本**中可用。
:::

默认情况下，集成会在 `routeParams` 中包含解析后的 `url` 以及所有可序列化的路由和查询参数。如果你的应用在 URL 参数中包含敏感值，把它们的键传给 `filteredParams`：

```tsx src/app/_layout.tsx
import { Observe } from 'expo-observe';

Observe.configure({
  integrations: {
    'expo-router': {
      filteredParams: ['userId', 'token'],
    },
  },
});
```

集成会从 `routeParams` 中移除被筛选的键，并且事件会省略 `url`，改为包含 `urlHidden: true`。`routeName` 不受影响，因为它是模式，从不包含参数值。

## 指标

### 按路由的首次渲染（`cold_ttr`）

**它测量什么：** 从分发导航动作（例如点击链接）到目标屏幕首次获得焦点的时间。对于应用启动后的第一次焦点，测量从 JS 包加载完成时开始，并且事件包含 `isAppLaunch: true`。

在一个会话中，每个屏幕实例最多发出一次。

**事件参数：**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `routeName` | `string` | 路由模式，例如 `/(tabs)/sessions/[sessionId]`。 |
| `url` | `string` | 该次导航解析后的路径名。 |
| `urlHidden` | `boolean` | 当因为某个参数被筛选而省略 `url` 时，以 `true` 出现。 |
| `routeParams` | `object` | 解析后的路由参数（例如 `{ sessionId: 'abc' }`）。 |
| `isAppLaunch` | `boolean` | 相对于进程启动测量时为 `true`，后续导航为 `false`。 |

### 按路由的热渲染（`warm_ttr`）

**它测量什么：** 与 `cold_ttr` 相同，但针对在获得焦点之前已经渲染过的屏幕，通常是因为它们通过 [`<Link prefetch />`](/router/basics/navigation#预取) 被预加载，或用户导航回它们。

**事件参数：**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `routeName` | `string` | 路由模式，例如 `/(tabs)/sessions/[sessionId]`。 |
| `url` | `string` | 该次导航解析后的路径名。 |
| `urlHidden` | `boolean` | 当因为某个参数被筛选而省略 `url` 时，以 `true` 出现。 |
| `routeParams` | `object` | 解析后的路由参数（例如 `{ sessionId: 'abc' }`）。 |

### 按路由的可交互时间（`tti`）

**它测量什么：** 从分发导航动作到在目标屏幕上调用 `markInteractive()` 的时间。每次导航只记录第一次调用，因此多次调用 `markInteractive()` 是安全的。

**事件参数：**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `routeName` | `string` | 路由模式，例如 `/(tabs)/sessions/[sessionId]`。 |
| `url` | `string` | 解析后的路径名。 |
| `urlHidden` | `boolean` | 当因为某个参数被筛选而省略 `url` 时，以 `true` 出现。 |
| `routeParams` | `object` | 解析后的路由参数。 |
| `...` | `any` | 通过 `markInteractive({ params: { ... } })` 传入的任何自定义参数。 |

## 查看导航指标

在仪表盘中，打开你的项目，前往 [**Observe**](https://expo.dev/accounts/[account]/projects/[project]/observe)，并选择 **Navigation** 页面。它显示按路由的导航耗时，包括冷/热首次渲染时间和可交互时间。

在 CLI 中，你可以运行以下命令：

```sh
# 按路由名称分组的导航指标
eas observe:routes

# 筛选到特定指标或路由
eas observe:routes --metric cold_ttr --route-name "/(tabs)/sessions/[sessionId]"
```

运行 `eas observe:routes --help` 查看标志的完整列表（时间范围、平台、应用版本等）。其他 `eas observe` 命令见[使用 EAS CLI 查询](/eas/observe/eas-cli)。

## 说明与排查

- `routeName` 是模式（`/(tabs)/sessions/[sessionId]`），不是解析后的 URL（`/sessions/abc`）。这使指标在不同参数值之间保持稳定，从而仪表盘把它们归入同一组。解析后的值仍然可以通过事件上的 `url` 和 `routeParams` 获得。
- 对 `router.prefetch()` 的调用不算作用户导航，也从不会为 `cold_ttr` 或 `warm_ttr` 测量播种。下一次用户驱动的、前往该路由的导航会发出 `warm_ttr`，因为屏幕已经渲染过。
- 只有在运行时安装了 `expo-router` 时，集成才会激活。如果没有安装，`useObserve()` 和 `ObserveRoot` 仍然可以工作，但不会发出按路由的导航指标。
- 必须在挂载之前通过 `Observe.configure({ integrations: { 'expo-router': true } })` 启用集成。在应用已经挂载之后切换它会抛出错误。
- 如果 `markInteractive()` 记录 `Calling markInteractive on unmounted screen` 或 `No metadata available for the current screen`，说明调用发生在屏幕组件之外或卸载之后。把调用移到屏幕组件内部的 `useEffect` 中。
- 关于 EAS Observe 的一般问题，见[排查问题](/eas/observe/reference/troubleshooting)。
