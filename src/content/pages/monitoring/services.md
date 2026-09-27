---
title: 监控服务
description: 了解应用发布后如何监控 Expo 与 React Native 应用的使用情况。
---

# 监控服务

应用发布之后，你可以跟踪匿名化的使用数据，从而了解用户如何使用应用。这些数据包括哪些更新正在使用、用户何时遇到缺陷、应用在生产环境中的表现，以及更多信息。

## EAS Insights

[EAS Insights](/eas-insights/introduction) 是一个仪表板，按三个标签页呈现项目中的趋势：

- **[应用使用情况](/eas-insights/app-usage)**：应用在各平台、应用商店版本和时间上的使用情况，汇总自 [EAS Update](/deploy/send-over-the-air-updates) 请求和 `expo-insights` 库。
- **[工作流](/eas-insights/workflows)**：[EAS Workflows](/eas/workflows/introduction) 的运行次数、成功率和趋势。
- **[Maestro](/eas-insights/maestro)**：你在 EAS Workflows 中运行的 [Maestro](https://maestro.dev/) 端到端测试的通过、不稳定和失败趋势。

![EAS 仪表板中的 Insights 仪表板，包含应用使用情况、工作流和 Maestro 标签页。](/static/images/eas-insights/insights-overview-light.webp)

从下面的指南开始：

- **[EAS Insights](/eas-insights/introduction)**：了解如何使用 EAS Insights 监控应用。

## EAS Observe

[EAS Observe](/eas/observe/introduction) 是 Expo 提供的性能监控服务，跟踪应用在生产环境中的表现。它让你看到真实用户会话中的启动指标（例如冷启动时间、首次渲染时间和可交互时间）、渲染性能，以及应用在不同设备、网络和条件下的用户体验。它还会记录你从应用中记录的[用户自定义事件](/eas/observe/events)，这样你可以在性能数据旁边跟踪自定义信号。

![EAS Observe 仪表板上的性能指标。](/static/images/expo-observe/observe-dashboard-light.webp)

从下面的指南开始：

- **[EAS Observe](/eas/observe/introduction)**：了解如何使用 EAS Observe 监控应用性能。

## LogRocket

你可以用 [LogRocket](https://logrocket.com) 获得更多洞察。LogRocket 会录制用户会话，并在用户使用应用时识别缺陷。你可以按更新 ID 筛选会话，也可以在 EAS 仪表板上连接 LogRocket 账户，以便快速访问应用的会话数据。

![LogRocket 仪表板上的用户会话。](/static/images/monitoring/monitor-your-app/logrocket.webp)

从下面的指南开始：

- **[使用 LogRocket](/guides/using-logrocket)**：了解如何使用 LogRocket 监控应用。

## Sentry

[Sentry](https://getsentry.com/) 是一个崩溃报告平台，提供生产部署的实时洞察，以及复现并修复崩溃所需的信息。

它会在用户使用应用时遇到异常或错误时通知你，并在 Web 仪表板上为你整理这些信息。报告的异常会自动包含堆栈跟踪、设备信息、版本和其他相关上下文。你也可以提供特定于应用的额外上下文，例如当前路由和用户 ID。

![Sentry 仪表板上的问题。](/static/images/monitoring/monitor-your-app/sentry.webp)

从下面的指南开始：

- **[使用 Sentry](/guides/using-sentry)**：了解如何使用 Sentry 监控应用。

## BugSnag

[BugSnag](https://www.bugsnag.com/) 是一套稳定性监控方案，提供丰富的端到端错误报告和分析，以便快速、精确地复现并修复错误。BugSnag 通过面向 50 多个平台的开源库支持完整技术栈，其中包括 React Native。

从下面的指南开始：

- **[使用 BugSnag](/guides/using-bugsnag)**：了解如何使用 BugSnag 监控应用。

## PostHog

[PostHog](https://posthog.com/) 是一个产品分析平台，具备会话回放、功能开关和错误跟踪。EAS CLI 集成会配置一个 PostHog 项目、接好 SDK，并让你通过发布标记按 EAS Update 给事件打标签，从而按发布版本筛选分析和错误。

从下面的指南开始：

- **[使用 PostHog](/guides/using-posthog)**：了解如何使用 PostHog 监控应用。
