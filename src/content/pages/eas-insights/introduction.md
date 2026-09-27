---
title: EAS Insights
description: EAS Insights 简介。这是一个展示应用使用情况、工作流运行和 Maestro 测试趋势的仪表盘。
---

# EAS Insights

**EAS Insights** 是一个仪表盘，汇总项目中的趋势，让你一眼看到应用的状况。在 EAS 仪表盘中打开项目，从导航菜单选择 [**Insights**](https://expo.dev/accounts/[account]/projects/[project]/insights)。

![EAS 仪表盘中的 Insights 仪表盘，包含应用使用情况、工作流和 Maestro 标签页。](/static/images/eas-insights/insights-overview-light.webp)

![EAS 仪表盘中的 Insights 仪表盘，包含应用使用情况、工作流和 Maestro 标签页（深色）。](/static/images/eas-insights/insights-overview-dark.webp)

Insights 把数据分为三个标签页：

- **[应用使用情况](/eas-insights/app-usage)**：按平台、应用商店版本和时间汇总的应用使用情况，数据来自 EAS Update 请求和 `expo-insights` 库。
- **[工作流](/eas-insights/workflows)**：你的 [EAS Workflows](/eas/workflows/introduction) 的运行次数、成功率和趋势。
- **[Maestro](/eas-insights/maestro)**：你在 EAS Workflows 中运行的 [Maestro](https://maestro.dev/) 端到端测试的通过、flaky 和失败趋势。
