---
title: Maestro 洞察
description: 在 EAS Insights 的 Maestro 标签页中跟踪 Maestro 端到端测试的流程健康状况、不稳定流程和失败模式。
---

# Maestro 洞察

:::note
Maestro 洞察在 Production 和 Enterprise 方案上可用。Production 方案的时间范围最多可回溯 30 天，Enterprise 方案最多可回溯 365 天。更多信息见 [EAS 定价](https://expo.dev/pricing)。
:::

仪表盘中的 **Maestro** 标签页展示你在 EAS Workflows 中用 [`maestro` 作业](/eas/workflows/pre-packaged-jobs#maestro)运行的 [Maestro](https://maestro.dev/) 端到端（E2E）测试结果。它帮助你找出失败或 flaky 最多的流程，从而保持测试套件健康。

- 要查看洞察，在 EAS 仪表盘中打开项目，从导航菜单选择 **Insights**，然后选择 **Maestro** 标签页。
- 要开始发送数据，按照[在 EAS Workflows 上用 Maestro 运行 E2E 测试](/eas/workflows/examples/e2e-tests)设置 E2E 测试。测试运行时结果会自动出现。

你也可以[用 EAS CLI 从终端查询相同的数据](/eas-insights/eas-cli)。

:::note
洞察收集自 JUnit 测试报告，`maestro` 作业默认会生成该报告（`output_format: junit`）。如果把 `output_format` 设为 `html` 等其他值，结果不会被上报，也不会出现在这里。
:::

每次流程运行属于以下三种状态之一：

- **Passed**：第一次尝试就通过，没有重试。
- **Flaky**：通过了，但经过一次或多次重试。
- **Failed**：没有通过。

![EAS Insights 中的 Maestro 标签页，展示运行指标、随时间变化的运行图表，以及 Maestro 流程表格。](/static/images/eas-insights/insights-maestro-light.webp)

![EAS Insights 中的 Maestro 标签页，展示运行指标、随时间变化的运行图表，以及 Maestro 流程表格（深色）。](/static/images/eas-insights/insights-maestro-dark.webp)

## 概览

标签页顶部汇总所选时间范围内的活动，每项指标都与前一个等长时段比较：

- **Maestro 运行次数**：完成了多少次流程运行。
- **通过率**：通过的运行所占比例（flaky 运行仍计为通过）。
- **Flaky 流程**：至少 flaky 过一次的不同流程数量。
- **平均时长**：平均运行时间。

## 随时间变化的运行

图表按天（较短时间范围则按小时或分钟）把运行拆成通过、flaky 和失败。

## 全部 Maestro 流程

表格列出每个流程的**运行次数**、**通过率**、**失败次数**、**Flake 率**、**P90**（第 90 百分位运行时长）和**最近一次运行**。按任意列排序以找出需要关注的流程，并按流程路径搜索。

## 筛选

可以按工作流、状态（通过、flaky、失败）、标签或分支缩小数据范围。

## 流程详情

选择一个流程以深入其历史，包括 Maestro 运行次数、通过率、flaky 运行和 P90 时长，以及：

- **错误模式**：按错误消息分组的失败，包含一条示例消息以及每种模式出现的频率。
- **最近的运行**：单次运行及其状态、时长、是否 flaky，以及它们来自的工作流运行、分支和提交。

![EAS Insights 中的 Maestro 流程详情视图，展示该流程的指标、随时间变化的运行图表，以及最常见的错误模式。](/static/images/eas-insights/insights-maestro-flow-light.webp)

![EAS Insights 中的 Maestro 流程详情视图，展示该流程的指标、随时间变化的运行图表，以及最常见的错误模式（深色）。](/static/images/eas-insights/insights-maestro-flow-dark.webp)

:::note
洞察是为趋势分析而汇总的，可能滞后于实时，或省略最近的运行。请用它们调查趋势，不要把它们当作权威记录。
:::

## 更多

- [用 EAS CLI 查询 EAS Insights](/eas-insights/eas-cli)：从终端或 CI 作业查询相同的通过率、flaky 流程和错误模式。
- [在 EAS Workflows 上用 Maestro 运行 E2E 测试](/eas/workflows/examples/e2e-tests)：在 EAS Workflows 中设置并运行 Maestro 端到端测试。
- [Maestro 文档](https://docs.maestro.dev/)：进一步了解 Maestro 流程以及如何编写它们。
