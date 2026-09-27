---
title: EAS Update 下载性能
description: 在真实用户设备上跟踪 EAS Update OTA 包的下载耗时，并在 EAS Observe 仪表盘中按更新查看明细。
---

# EAS Update 下载性能

EAS Observe 会自动跟踪每个 OTA 更新在真实用户设备上下载所需的时间。你不需要添加任何埋点：如果应用使用 [EAS Update](/eas-update/introduction) 并包含 [`expo-observe`](/eas/observe/get-started)，EAS Observe 会为每次更新获取收集下载指标。

更新下载时间显示在 EAS Observe 仪表盘的 **EAS Update** 页面上，也可以从 EAS CLI 查询。

## 查看更新下载

在仪表盘中：打开你的项目，并前往 [**Observe > EAS Update**](https://expo.dev/accounts/[account]/projects/[project]/observe?tab=eas-update)。该页面有两个部分：一张汇总图表和一张按更新列出的表格。

![EAS Observe 仪表盘中的 EAS Update 页面，显示更新下载时间和最近的更新。](/static/images/expo-observe/observe-updates-light.webp)

![EAS Observe 仪表盘中的 EAS Update 页面，显示更新下载时间和最近的更新。（深色）](/static/images/expo-observe/observe-updates-dark.webp)

### 更新下载时间

一张图表，显示所选时间范围内获取的全部更新的汇总下载时间。统计明细与应用启动页面一致：**Median**、**Avg**、**Min**、**Max**、**P90** 和 **P99**。用它们来发现更新体积或 CDN 延迟方面的回退。

图表上的更新标记表明每个更新首次被下载的时间。点击标记可查看该时刻的更新 ID、版本和指标。

### 最近的更新

一张按更新列出的表格，列出该时间范围内获取的每个更新，包含以下列：

- **Update**：更新 ID 和消息。
- **Downloads**：下载了该更新的唯一设备数。
- **Median download**：该更新的中位数下载时间，以相对于表格中最慢更新的条形图可视化。
- **P90**：该更新的第 90 百分位下载时间。
- **First downloaded**：第一台设备获取该更新的时间。

可以按 **Downloads**、**Median download**、**P90** 或 **First downloaded** 升序或降序排序。点击一行可深入查看该更新的各个下载事件。

从 CLI：

```sh
# 按应用版本分组的更新下载时间摘要
eas observe:metrics-summary --metric update_download

# 最慢的单次更新下载
eas observe:metrics update_download --sort slowest
```

运行 `eas observe:metrics-summary --help` 或 `eas observe:metrics --help` 查看标志的完整列表（时间范围、平台、应用版本、更新 ID 等）。其他 `eas observe` 命令见[使用 EAS CLI 查询](/eas/observe/eas-cli)。
