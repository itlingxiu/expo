---
title: EAS Workflows 洞察
description: 在 EAS Insights 的“工作流”标签页中跟踪 EAS Workflows 的运行次数、成功率和趋势。
---

# EAS Workflows 洞察

:::note
工作流洞察在 Production 和 Enterprise 方案上可用。Production 方案的时间范围最多可回溯 30 天，Enterprise 方案最多可回溯 365 天。更多信息见 [EAS 定价](https://expo.dev/pricing)。
:::

仪表盘中的**工作流**标签页展示你的 [EAS Workflows](/eas/workflows/introduction) 随时间的表现：运行频率、成功频率，以及哪些工作流失败最多。数据会在工作流运行时自动出现。

- 要查看这些洞察，在 EAS 仪表盘中打开项目，从导航菜单选择 **Insights**，然后选择**工作流**标签页。
- 选择时间范围以加载数据。每项指标也会与前一个等长时段比较，以便你看出数字是在上升还是下降。

你也可以[用 EAS CLI 从终端查询这些指标](/eas-insights/eas-cli)。导出运行记录仍在仪表盘中进行。

![EAS Insights 中的工作流标签页，展示运行指标、随时间变化的运行图表，以及工作流表格。](/static/images/eas-insights/insights-workflows-light.webp)

![EAS Insights 中的工作流标签页，展示运行指标、随时间变化的运行图表，以及工作流表格（深色）。](/static/images/eas-insights/insights-workflows-dark.webp)

## 概览

标签页顶部汇总所选时间范围内的活动：

- **总运行次数**：启动了多少次工作流运行。
- **成功率**：成功的运行所占比例。
- **活跃工作流**：运行过的不同工作流数量。
- **失败的运行**：有多少次运行失败。

## 随时间变化的运行

图表按天（较短时间范围则按小时或分钟）把运行拆成总计、成功、失败和已取消。可以在折线视图和堆叠视图之间切换，并单独打开或关闭各状态，以聚焦你关心的部分。

## 工作流表格

图表下方的表格列出该时间范围内运行过的每个工作流，包含：

- **运行次数**：总数，并拆分为成功、失败和已取消。
- **成功率**：成功的运行所占比例。
- **最近一次运行**：该工作流上次运行的时间。

## 筛选

可以按工作流、运行状态（成功、失败、已取消）、触发类型（手动、计划，或 GitHub 事件）或 git ref 缩小数据范围。也可以按工作流名称搜索。

## 导出

把符合当前筛选条件和时间范围的工作流运行导出为 CSV 或换行分隔的 JSON（NDJSON），以便进一步分析。

:::note
洞察是为趋势分析而汇总的，可能滞后于实时，或省略最近的运行。请用导出结果调查趋势，不要把它当作计费或审计的权威记录。
:::

## 更多

- [用 EAS CLI 查询 EAS Insights](/eas-insights/eas-cli)：从终端或 CI 作业查询相同的运行次数、成功率和趋势。
- [EAS Workflows 简介](/eas/workflows/introduction)：了解如何用 EAS Workflows 自动化构建、更新、提交和测试。
