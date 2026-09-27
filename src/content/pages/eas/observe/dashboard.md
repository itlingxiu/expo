---
title: EAS Observe 仪表盘
description: 在 EAS Observe 仪表盘中查看性能指标，按平台、环境和发布进行筛选，并调查单个会话。
---

# EAS Observe 仪表盘

EAS Observe 仪表盘提供应用性能指标的可视化概览。在 EAS 仪表盘中打开你的项目，并从导航菜单中选择 [**Observe**](https://expo.dev/accounts/[account]/projects/[project]/observe)。

![EAS Observe 仪表盘，显示应用的启动指标、发布标记和统计明细。](/static/images/expo-observe/observe-dashboard-light.webp)

![EAS Observe 仪表盘，显示应用的启动指标、发布标记和统计明细。（深色）](/static/images/expo-observe/observe-dashboard-dark.webp)

## 摘要

在页面顶部，仪表盘显示当前视图中数据的摘要：活跃用户、发布、构建和更新。计数会随着你更改筛选器而更新。点击 **Show all** 可清除发布筛选，并查看每个发布的汇总计数。

## 筛选器

筛选器控制下面的指标包含哪些事件。

- **Platform**：Android 或 iOS。
- **Environment**：筛选到特定[环境](/eas/observe/configuration#环境)，例如 `production` 或 `preview`。默认为 **All environments**。
- **Time range**：1 小时、12 小时、1 天、3 天、7 天、14 天、21 天、30 天或 60 天。默认为 **Last 14 Days**。
- **Release**：筛选到特定应用版本、特定原生构建或特定 OTA 更新。

## 页面

仪表盘把数据分成五个页面：

- **App startup**：启动性能指标（冷启动、热启动、包加载时间、首次渲染时间、可交互时间）。完整说明见[指标参考](/eas/observe/reference/metrics)。
- **EAS Update**：OTA 更新的下载时间以及按更新列出的表格。详情见 [EAS Update 下载性能](/eas/observe/eas-update)。
- **Events**（需要 SDK 56 及更高版本）：用 [`Observe.logEvent`](/eas/observe/events) 记录的用户定义事件，以及 SDK 及其集成发出的事件（例如 `expo.memory.warning` 和 `expo-image.oversized`），带有计数和深入每个事件的链接。
- **Navigation**（需要 SDK 56 及更高版本）：按路由的导航耗时，包括冷/热首次渲染时间和可交互时间。需要 [Expo Router](/eas/observe/integrations/expo-router) 或 [React Navigation](/eas/observe/integrations/react-navigation)。
- **Errors**（预览中）：SDK 57 及更高版本上应用记录的 JavaScript 错误，以及 `expo-observe` 57.0.21 及更高版本的原生崩溃。详情见[错误报告](/eas/observe/errors)。

## 指标卡片

每个指标都以一张带有图表和统计明细的卡片出现。对于每个指标，仪表盘显示：

- **Median**：中间值，代表典型用户体验。
- **Avg**：所有事件的算术平均值。
- **Min** 和 **Max**：记录到的最快和最慢值。
- **P90** 和 **P99**：90% 或 99% 的事件都低于该值，可用于识别尾部延迟。

在 App startup 页面上，可以在列表布局（每行一张图表）和网格布局之间切换。使用 **Show builds** 和 **Show updates** 开关控制图表上是否出现发布标记。

## 发布标记与对比

当你发布新的原生构建或 OTA 更新时，每张图表都会在部署时间显示一个发布标记。在时间轴上彼此靠近的标记会合并成一个指示器，以保持图表可读。

点击标记可打开一个弹出框，其中有该发布的详情，包括版本、构建号或更新 ID、用户和事件计数，以及该时刻的指标值。从弹出框可以深入查看该发布的事件。

没有发布筛选时，App startup 卡片也会在卡片顶部显示**最新**和**上一个**发布的指标。这样更容易一眼发现回退。

## 调查会话

当某些情况看起来不对时，从 **Events** 页面或发布标记弹出框深入单个会话。会话时间线显示：

- 该会话期间记录的所有事件（启动、用户定义和更新下载事件）。
- 设备元数据：平台、应用版本、构建号、操作系统和时间戳。
- 按类型统计的事件计数。

这有助于你理解为什么特定用户或设备体验到更慢的性能，无论是特定的操作系统版本、网络状况还是发布。

同样的时间线可以从终端用 `eas observe:session` 获得。见[使用 EAS CLI 查询](/eas/observe/eas-cli)。

## 交给 AI

使用页面标题中的 **Handoff to AI** 按钮，把当前仪表盘状态复制为结构化提示。把它粘贴到 Claude 或其他 AI 助手中，询问你所看到的指标，例如为什么某个发布出现回退，或哪些路由最慢。
