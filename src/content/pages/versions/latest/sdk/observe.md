---
title: Observe 包参考
description: 收集应用性能指标和用户自定义事件，并发送到 EAS Observe 的库。
---

# Observe 包参考

> 支持平台：Android、iOS、tvOS。

:::note
EAS Observe 在免费方案中每月包含 100,000 个事件，付费方案为 500,000 个，大约相当于 10,000 和 50,000 个月活跃用户。超出部分按用量计费。详情见[定价](https://expo.dev/pricing)。
:::

`expo-observe` 从应用中收集性能指标和用户自定义事件，并发送到 [EAS Observe](/eas/observe/introduction)（Expo 的性能监控服务），或发送到你偏好的、符合 OpenTelemetry（OTEL）的后端。它测量生产环境中应用的真实启动性能，例如[首次渲染时间（TTR）](/eas/observe/reference/metrics#time-to-first-render-ttr)和[可交互时间（TTI）](/eas/observe/reference/metrics#time-to-interactive-tti)。

除了应用启动指标，这个库还可以：

- 通过 [Expo Router](/eas/observe/integrations/expo-router) 或 [React Navigation](/eas/observe/integrations/react-navigation) 集成收集按路由的导航指标。
- 用 `Observe.logEvent` 记录[用户自定义事件](/eas/observe/events)。
- 自动跟踪 [EAS Update 下载时间](/eas/observe/eas-update)。
- 用 `ObserveErrorBoundary` 和 `Observe.reportError` 记录 [JavaScript 错误](/eas/observe/errors)，并在 EAS Observe 仪表板中查看带符号还原的堆栈跟踪（处于[预览](/more/release-statuses#preview)阶段）。
- 让第三方包通过 `Observe.registerIntegration` [注册自己的集成](/eas/observe/integrations/third-party)。

:::warning
`expo-observe` 不能在 Expo Go 中使用。要使用它，请创建[开发构建](/develop/development-builds/introduction)。
:::

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-observe
```
:::
:::tab yarn
```sh
yarn expo install expo-observe
```
:::
:::tab pnpm
```sh
pnpm expo install expo-observe
```
:::
:::tab bun
```sh
bun expo install expo-observe
```
:::
:::

## 配置

在发布构建中，安装 `expo-observe` 库就足以开始发送启动指标（不过要跟踪 TTI，仍需按照下面的用法说明调用 `markInteractive`）。这个库不会在调试构建中发送事件，但你可以通过 `Observe.configure({})` 更改这一点以及其他配置选项，例如采样率、环境名称和启用集成。全部可用选项见 [EAS Observe 配置指南](/eas/observe/configuration)。

## 用法

用 `ObserveRoot` 包裹根布局，以便自动测量首次渲染时间。然后在应用准备好接受用户交互时调用 `markInteractive`，以记录可交互时间：

```tsx
import { ObserveRoot, useObserve } from 'expo-observe';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

function RootLayout() {
  const { markInteractive } = useObserve();

  useEffect(() => {
    // 把这个 effect 换成你自己的就绪信号：只有在启动画面背后的初始化工作
    //（例如加载初始数据）完成之后，才调用 markInteractive()。
    markInteractive();
  }, [markInteractive]);

  return <Stack />;
}

export default ObserveRoot.wrap(RootLayout);
```

分步说明（包括完整的启动画面示例，以及如何处理有多个入口屏幕的应用）见 [EAS Observe 入门指南](/eas/observe/get-started)。要从应用发送自定义事件，见[用户自定义事件](/eas/observe/events)。

## API

```ts
import { Observe, ObserveRoot, useObserve } from 'expo-observe';
```
