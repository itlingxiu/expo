---
title: EAS Observe 简介
description: EAS Observe 是一项性能监控服务，用于跟踪你的应用在真实设备和条件下于生产环境中的表现。
---

# EAS Observe 简介

:::note
EAS Observe 在 Free 方案上每月包含 100,000 个事件，在付费方案上包含 500,000 个，大约相当于 10,000 和 50,000 个月活跃用户。超出之后按使用量定价。详情见[定价](https://expo.dev/pricing)。
:::

**EAS Observe** 是来自 Expo 的性能监控服务，用于跟踪你的应用在生产环境中的表现。它让你能够看到跨不同设备、网络和条件的真实启动时间、渲染性能和用户体验。

在 React Native 中调试性能传统上局限于开发工具。EAS Observe 聚焦于生产环境，那里的性能特征与你在开发期间看到的有显著不同。

![EAS Observe 显示冷启动和热启动指标，以及两周应用启动数据上的发布标记。](/static/images/expo-observe/observe-light.webp)

![EAS Observe 显示冷启动和热启动指标，以及两周应用启动数据上的发布标记。（深色）](/static/images/expo-observe/observe-dark.webp)

> 视频：[EAS Observe 介绍](https://www.youtube.com/watch?v=5JqK9JLD140)。了解 EAS Observe 如何呈现生产应用在不同设备、网络和条件下的真实启动与渲染性能。

## 快速开始

:::tabs
:::tab npm
```sh
# 安装该库
npx expo install expo-observe
```
:::
:::tab yarn
```sh
# 安装该库
yarn expo install expo-observe
```
:::
:::tab pnpm
```sh
# 安装该库
pnpm expo install expo-observe
```
:::
:::tab bun
```sh
# 安装该库
bun expo install expo-observe
```
:::
:::

用 `ObserveRoot` 组件（在 SDK 55 上则是 `AppMetricsRoot` 组件）包裹根布局，并在应用准备好接受用户输入时调用 `markInteractive()`。完整设置指南见[开始使用](/eas/observe/get-started)。

### 面向 AI agent 的 Expo Skills

如果你使用 AI agent，安装 [Expo Skills](/skills) 来教它如何设置 `expo-observe` 并查询应用的性能指标。相关技能：`eas-observe`（设置 expo-observe，用 EAS CLI 查询指标，并解读启动和导航性能数据）。

## 为什么使用 EAS Observe

传统的开发时分析工具显示应用在你的机器上表现如何。EAS Observe 显示它为真实用户表现如何：

- **生产性能数据**：跟踪来自一系列设备上真实用户会话的启动时间、渲染性能、包加载时间和 EAS Update 下载时间
- **发布对比**：查看指标在应用版本和 OTA 更新之间如何变化，以便及早发现回退
- **按路由的导航指标**：用 [Expo Router](/eas/observe/integrations/expo-router) 或 [React Navigation](/eas/observe/integrations/react-navigation) 集成按路由比较渲染和可交互耗时
- **会话调查**：深入单个用户会话，理解为什么某些设备或条件导致更慢的性能
- **用户定义的事件**：用 `Observe.logEvent` 从应用记录自定义信号，并与性能数据一起分析
- **错误报告**（预览中）：[记录 JavaScript 错误和原生崩溃](/eas/observe/errors)，并在仪表盘中调查它们的堆栈跟踪
- **CLI 和仪表盘访问**：用 `eas observe:` 命令从终端查询指标，或在 EAS 仪表盘中查看它们

## 何时使用 EAS Observe

| 场景 | 建议 |
| --- | --- |
| 在生产环境中监控应用启动性能 | 推荐 |
| 比较各发布和 OTA 更新之间的性能 | 推荐 |
| 调查特定设备上的慢会话 | 推荐 |
| 比较各路由之间的导航性能 | 推荐 |
| 跟踪 EAS Update 下载时间 | 推荐 |
| 从 CLI 查询性能指标 | 推荐 |
| 跟踪来自应用的用户定义事件 | 推荐 |
| 在生产环境中跟踪 JavaScript 错误（预览中） | 推荐 |
| 在生产环境中跟踪原生崩溃（预览中） | 推荐 |
| 开发时分析和调试 | 不推荐 |

**开发时分析和调试**：使用 [React Native DevTools](/debugging/tools#使用-react-native-devtools-调试)进行调试，使用 [Expo Atlas](/guides/analyzing-bundles)进行包检查。

**JavaScript 错误**：在 SDK 57 及更高版本上，EAS Observe 会记录 JavaScript 错误，并在仪表盘中显示带有符号化堆栈跟踪的结果。此功能处于[预览](/more/release-statuses#preview)。设置和当前限制见[错误报告](/eas/observe/errors)。

**原生崩溃**：在 SDK 57 且 `expo-observe` 57.0.21 及更高版本上，EAS Observe 会在 Android 和 iOS 上记录原生崩溃，并与 JavaScript 错误一起显示在仪表盘中。原生堆栈跟踪不会在仪表盘中符号化。详情见[错误报告](/eas/observe/errors)。

## 常见问题（FAQ）

<details>
<summary>EAS Observe 跟踪哪些指标？</summary>

EAS Observe 跟踪启动指标（冷启动时间、热启动时间、首次渲染时间、可交互时间和包加载时间）以及 [EAS Update 下载时间](/eas/observe/eas-update)。在 SDK 56 及更高版本上，[导航集成](/eas/observe/integrations/expo-router)会增加按路由的渲染和可交互耗时。每个指标的详细说明见[指标参考](/eas/observe/reference/metrics)。你也可以把自己的信号记录为[用户定义的事件](/eas/observe/events)，并记录[JavaScript 错误和原生崩溃](/eas/observe/errors)（预览中）。

</details>

<details>
<summary>支持哪些平台？</summary>

EAS Observe 支持 Android、iOS 和 tvOS。指标从生产构建中收集，并且可以在仪表盘和 CLI 中按平台筛选。

</details>

<details>
<summary>EAS Observe 在 Expo Go 中可用吗？</summary>

不可用。EAS Observe 依赖 `expo-observe` 原生库，而 Expo Go 不包含它。要使用它，请创建[开发构建](/develop/development-builds/introduction)或生产构建。

</details>

<details>
<summary>EAS Observe 会收集个人身份信息吗？</summary>

不会。用户由每次应用安装唯一的匿名 ID 标识。此 ID 不是个人身份信息，如果用户卸载并重新安装应用，它会被重置。更多细节见[指标参考：用户](/eas/observe/reference/metrics#用户)。

</details>

<details>
<summary>设备离线时会发生什么？</summary>

离线时收集的指标会存储在设备本地。当应用转到后台并且有连接时，它们会自动发送。你也可以使用 `dispatchEvents()` 手动刷新事件。

</details>

<details>
<summary>我可以在开发期间测试指标吗？</summary>

默认情况下，从调试构建收集的指标不会被发送。你可以通过 [`configure()`](/versions/latest/sdk/observe#configureconfig) 把 `dispatchInDebug` 设为 `true`，以便为了测试仍然发送它们。详情见[配置](/eas/observe/configuration#在开发中启用指标)。

</details>

<details>
<summary>指标数据保留多久？</summary>

指标数据至少保留 60 天。

</details>

## 开始使用

- [设置 EAS Observe](/eas/observe/get-started)：安装该库，并开始从生产应用收集指标。
- [EAS Observe 仪表盘](/eas/observe/dashboard)：查看指标，按平台或版本筛选，并调查单个会话。
- [用户定义的事件](/eas/observe/events)：从应用记录具名事件，并在仪表盘中查看或从 CLI 查询。
- [错误报告](/eas/observe/errors)：记录 JavaScript 错误，并在仪表盘中调查符号化的堆栈跟踪。
- [配置](/eas/observe/configuration)：控制环境、发送和开发模式设置。
- [指标参考](/eas/observe/reference/metrics)：每个指标、概念和数据处理的详细说明。
- [API 参考](/versions/latest/sdk/observe)：`expo-observe` 库 API 的完整参考。
