---
title: 使用 EAS CLI 查询
description: 使用 eas observe 命令从终端查询 EAS Observe 的指标、事件和会话。
---

# 使用 EAS CLI 查询

[EAS Observe 仪表盘](/eas/observe/dashboard)显示的一切也可以从终端获得。使用 `eas observe` 命令比较发布、调查慢会话，并把结果管道到脚本中。

## 前置条件

- **EAS CLI**

  按照[安装 CLI 的说明](/eas/cli#安装)操作。

- **已经使用 EAS Observe 的应用**

  按照[开始使用](/eas/observe/get-started)安装 `expo-observe` 并创建第一次构建。

- **从项目目录向 EAS CLI 认证**

  用 `eas login` 登录。默认情况下，每个命令都从当前目录的应用配置读取项目 ID。传入 `--project-id` 可以从任何地方查询项目，使用对该项目有访问权限的账户：

  ```sh
  eas observe:metrics-summary --project-id <project-id>
  ```

## EAS CLI 帮助

为任何命令加上 `--help`，即可查看你所安装的 EAS CLI 版本支持的标志。

某些数据只在特定方案上可用。当你的账户方案不包含命令所要求的内容时，命令会失败，并给出链接到账单页面的升级消息。会话时间线会在交互式选择器运行之前检查，因此被阻止的方案会立即被报告。每个方案包含的内容见[定价](https://expo.dev/pricing)。

## 命令

| 命令 | 它显示什么 |
| --- | --- |
| `eas observe:metrics-summary` | 按应用版本的汇总统计，例如中位数、p90 和 p99 |
| `eas observe:metrics` | 各个指标样本，按值或时间排序 |
| `eas observe:routes` | 按路由名称分组的导航指标 |
| `eas observe:session` | 一个会话的完整事件时间线 |
| `eas observe:events` | 用 `Observe.logEvent` 记录的用户定义事件 |
| `eas observe:versions` | 应用版本及其构建号和更新 ID |

每个命令都接受这些标志：

- `--platform android` 或 `--platform ios`：按平台筛选。默认包含两者。在 `observe:session` 上不可用，因为它已经针对一个会话。
- `--days <number>`：显示最近 N 天的数据。
- `--start <ISO date>` 和 `--end <ISO date>`：设置明确的时间范围。与 `--days` 互斥。
- `--project-id <id>`：不在项目目录内查询项目。
- `--json`：机器可读输出。隐含 `--non-interactive`。
- `--non-interactive`：失败而不是提示。

未给出时间范围时，命令返回最近 60 天。

## 指标名称

应用完成埋点后，启动指标会自动收集。每个指标测量什么，见[指标参考](/eas/observe/reference/metrics)。

| 名称 | 指标 |
| --- | --- |
| `tti` | 可交互时间 |
| `ttr` | 首次渲染时间 |
| `cold_launch` | 冷启动时间 |
| `warm_launch` | 热启动时间 |
| `bundle_load` | 包加载时间 |
| `update_download` | [EAS Update 下载时间](/eas/observe/eas-update) |

导航指标按路由计算。它们需要 SDK 56 或更高版本，以及其中一个导航集成：[Expo Router](/eas/observe/integrations/expo-router) 或 [React Navigation](/eas/observe/integrations/react-navigation)。

| 名称 | 指标 |
| --- | --- |
| `nav_cold_ttr` | 按路由的首次渲染 |
| `nav_warm_ttr` | 按路由的热渲染 |
| `nav_tti` | 按路由的可交互时间 |

`observe:metrics` 和 `observe:metrics-summary` 接受全部九个名称。`observe:routes` 接受三个导航名称。

## `eas observe:metrics-summary`

显示按应用版本分组的汇总统计，每个平台一张单独的表。用它比较各发布的启动性能。

```sh
# 全部指标，最近 60 天，两个平台
eas observe:metrics-summary

# 一个指标，最近 14 天，仅 iOS
eas observe:metrics-summary --metric tti --days 14 --platform ios

# 多个指标，每个指标一张表
eas observe:metrics-summary --metric tti --metric cold_launch

# 选择要显示的统计量
eas observe:metrics-summary --metric tti --stat median --stat p90
```

命令标志：

- `--metric <name>`：要显示的指标。重复该标志以指定多个指标。
- `--stat <name>`：每个指标要显示的统计量。取值为 `min`、`median`、`max`、`average`、`p80`、`p90`、`p99` 或 `eventCount`。

表格默认显示 `median` 和 `eventCount`，并把它们合并到一个单元格中，例如 `0.45s (150)`。App version 列在括号中包含构建号。为了保持可读，表中省略了更新 ID，但 `--json` 会把它们作为每个版本的数组返回。

## `eas observe:metrics`

显示各个样本而不是汇总。用它调查离群值，并找到慢启动背后的会话。

```sh
# 本周最慢的可交互时间
eas observe:metrics tti --sort slowest --days 7 --limit 20

# 来自一个发布的样本
eas observe:metrics tti --app-version 1.2.0

# 结果的下一页
eas observe:metrics tti --after <cursor>
```

指标是位置参数。省略它会提示选择，并在非交互模式下失败。

命令标志：

- `--sort <order>`：`oldest`（默认）、`newest`、`slowest` 或 `fastest` 之一。
- `--limit <number>`：每页样本数。默认为 10，上限为 100。
- `--after <cursor>`：上一次运行的 `endCursor`。
- `--app-version <version>`：按应用版本筛选。
- `--update-id <id>`：按 EAS Update ID 筛选。

当还有更多结果时，命令会打印获取下一页所需的标志。JSON 输出会增加 `sessionId`、`easClientId`，以及附加到样本上的任何自定义参数。

## `eas observe:routes`

显示按路由名称分组的导航指标，每个平台一个单独的部分。用它找到到达最慢的屏幕。

```sh
# 全部导航指标，最近 7 天
eas observe:routes --days 7

# 每个路由的可交互时间，带百分位
eas observe:routes --metric nav_tti --stat median --stat p90

# 只看你关心的路由
eas observe:routes --route-name /home --route-name /checkout
```

命令标志：

- `--metric <name>`：`nav_cold_ttr`、`nav_warm_ttr` 或 `nav_tti` 之一。重复该标志以指定多个指标。默认为全部三个。
- `--stat <name>`：`median`、`p90` 或 `count` 之一。
- `--route-name <name>`：按路由名称筛选。重复该标志以指定多个路由。
- `--app-version <version>` 和 `--build-number <number>`：筛选到一个发布。
- `--update-id <id>`：按 EAS Update ID 筛选。
- `--limit <number>`：每页路由数。默认为 50，上限为 200。
- `--after <cursor>`：上一次运行的 `endCursor`。

路由名称是模式，例如 `/(tabs)/sessions/[sessionId]`，因此不同的参数值会归在一起。每个平台单独分页，因此下一页提示会标明它适用的平台。

## `eas observe:session`

按顺序显示一个会话期间记录的每个指标和日志事件。在 `observe:metrics` 呈现出慢样本之后使用它，以查看该次启动期间还发生了什么。

```sh
# 检查已知会话
eas observe:session <session-id>

# 从最慢的可交互时间事件中挑选一个会话
eas observe:session --event-name tti --sort slowest --days 7
```

会话 ID 是位置参数。在交互模式下省略它会提示你从候选会话列表中挑选。在非交互模式下，包括在 `--json` 下，会话 ID 是必需的。会话 ID 也包含在 `observe:metrics` 和 `observe:events` 的 `--json` 输出中。

命令标志：

- `--event-name <name>`：用于构建候选列表的指标或用户定义事件，例如 `tti` 或 `onboarding.completed`。
- `--sort <order>`：对候选事件排序。`slowest`、`fastest`、`newest` 或 `oldest` 之一。

:::note
用于构建候选列表的标志——`--event-name`、`--sort`、`--days`、`--start` 和 `--end`——描述的是如何*找到*一个会话，因此不能与会话 ID 组合。要检查你已经拥有的会话，请单独传入该 ID。
:::

## `eas observe:events`

显示用 `Observe.logEvent` 记录的[用户定义事件](/eas/observe/events)，以及[SDK 及其集成发出的事件](/eas/observe/events#sdk-和集成发出的事件)，例如 `expo.memory.warning` 和 `expo-image.oversized`。没有参数时，它列出事件名称及其计数。

```sh
# 应用正在发出哪些事件
eas observe:events

# 具有一个名称的各个事件
eas observe:events report.exported --limit 50

# 所有名称下的每个事件
eas observe:events --all-events --days 7

# 来自单个会话的事件
eas observe:events --all-events --session-id <session-id>
```

命令标志：

- `--all-events`：列出每个事件，而不是名称摘要。不能与事件名称组合。
- `--session-id <id>`：筛选到一个会话。要获得包括指标在内的完整时间线，使用 `observe:session`。
- `--app-version <version>`：按应用版本筛选。
- `--update-id <id>`：按 EAS Update ID 筛选。
- `--limit <number>` 和 `--after <cursor>`：对结果分页。

查询一个没有事件的名称会打印同一时间范围内的可用名称，这使拼写错误很容易发现。

## `eas observe:versions`

列出线上的应用版本及其构建号、更新 ID 和事件计数。用它找到其他命令用来筛选的标识符。

```sh
# 两个平台，最近 60 天
eas observe:versions

# 仅 iOS，最近 14 天
eas observe:versions --days 14 --platform ios
```

表格显示应用版本、首次出现、事件、用户、构建和更新。JSON 输出返回完整层次，EAS Build 和更新详情嵌套在每个版本之下。

## 常见工作流

**把当前发布与上一个发布比较：**

```sh
eas observe:metrics-summary --days 7 --stat median --stat p90
```

**找到并调查最慢的启动：**

```sh
eas observe:metrics tti --sort slowest --days 7 --json

# 然后检查上面返回的某个会话
eas observe:session <session-id>
```

**检查哪些屏幕变得可交互最慢：**

```sh
eas observe:routes --metric nav_tti --stat median --stat p90 --days 7
```

**检查 OTA 更新在线上的下载情况：**

```sh
eas observe:metrics-summary --metric update_download --days 7
```

**用指标把脚本或 CI 作业设为门禁：**

```sh
eas observe:metrics-summary --metric tti --json --non-interactive
```
