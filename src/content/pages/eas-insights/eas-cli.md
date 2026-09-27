---
title: 用 EAS CLI 查询 EAS Insights
description: 用 eas workflow:insights 命令从终端查询 EAS Workflows 和 Maestro 洞察。
---

# 用 EAS CLI 查询 EAS Insights

EAS Insights 的[工作流](/eas-insights/workflows)和 [Maestro](/eas-insights/maestro)标签页所展示的指标也可以从终端获取。使用 `eas workflow:insights` 命令检查运行健康状况、找出 flaky 流程，并把数字送入你自己的报告。

关于更新和 channel 用量，参见 EAS CLI 参考中的 [`eas update:insights`](/eas/cli#eas-updateinsights-groupid) 和 [`eas channel:insights`](/eas/cli#eas-channelinsights)。

## 前置条件

- **EAS CLI**

  遵循[安装 CLI 的说明](/eas/cli#安装)。

- **运行 EAS Workflows 的项目**

  遵循[开始使用 EAS Workflows](/eas/workflows/get-started)。对于 Maestro 洞察，项目还需要一个带有 [`maestro` 作业](/eas/workflows/pre-packaged-jobs#maestro)的工作流。工作流运行时结果会自动出现。

- **从项目目录向 EAS CLI 进行身份验证**

  用 `eas login` 登录。默认情况下，每条命令从当前目录的应用配置读取项目 ID。传入 `--project-id` 可以从任何地方查询项目，使用对该项目有访问权限的账户：

  ```sh
  $ eas workflow:insights --project-id <project-id>
  ```

## 方案与回溯限制

工作流和 Maestro 洞察在 Production 和 Enterprise 方案上可用。各方案包含的内容见 [EAS 定价](https://expo.dev/pricing)。

每个方案还限制时间范围可以回溯多远：

- **Production**：最近 30 天。
- **Enterprise**：最近 365 天。

该限制适用于拥有该项目的账户的方案。当时间范围的起点早于方案允许的范围时，命令会失败，并告诉你方案包含多少天。

## 命令

| 命令 | 它显示什么 |
| --- | --- |
| `eas workflow:insights` | 运行次数、成功率，以及按工作流划分的趋势 |
| `eas workflow:insights:maestro` | Maestro 流程的通过率和 flake 率，或单个流程的历史 |

两条命令都接受这些标志：

- `--days <number>`：显示最近 N 天的数据。默认 7。
- `--start <ISO date>` 和 `--end <ISO date>`：设置明确的时间范围。与 `--days` 互斥。单独传入 `--start` 会包含直到现在的一切。单独使用 `--end` 会失败。
- `--workflow <file name>`：只包含此工作流文件的运行，例如 **ci.yml**。包含扩展名，并对多个工作流重复该标志。工作流在第一次运行后才对此标志可用。项目不认识的名称会使命令失败，并列出它认识的名称。
- `--git-ref <ref>`：只包含为此 git ref 请求的运行。命令把 `main` 这样的裸名称当作分支，并展开为 `refs/heads/main`。其他情况请传入完整 ref，例如 `refs/tags/v1.0.0`。命令会按 `eas workflow:run` 记录的方式匹配完整的 40 字符提交 SHA。
- `--limit <number>`：列出多少行。默认 50。命令会拒绝 1 到 100 之外的值。
- `--project-id <id>`：不在项目目录内查询项目。
- `--json`：机器可读输出。隐含 `--non-interactive`。
- `--non-interactive`：失败而不是提示。

洞察只包含已完成的运行。时间范围按完整的 UTC 时段查询，因此命令报告的范围可能比你要求的略宽。概览指标把所选时间范围与前一个等长时段比较。例外是 `eas workflow:insights:maestro --flow`，它只报告一个流程在所选范围内的数字。数据是为趋势分析而汇总的，可能滞后于实时。请用它调查趋势，不要把它当作权威记录。

对任何命令使用 `--help`，查看你安装的 EAS CLI 版本支持的标志。

## `eas workflow:insights`

显示与工作流标签页相同的概览、随时间变化的运行拆分和工作流表格。用它查看工作流运行和成功的频率，以及哪些失败最多。

```sh
# 最近 7 天，全部工作流
$ eas workflow:insights

# 一个工作流，最近 30 天
$ eas workflow:insights --workflow ci.yml --days 30

# 只看 main 分支上失败的运行
$ eas workflow:insights --status FAILURE --git-ref main

# 只看由 GitHub push 启动的运行
$ eas workflow:insights --trigger GITHUB_PUSH
```

命令标志：

- `--status <status>`：只包含此状态的运行。`SUCCESS`、`FAILURE` 或 `CANCELED` 之一。对多个状态重复该标志。
- `--trigger <type>`：只包含由此触发器启动的运行，例如 `MANUAL`、`SCHEDULE` 或 `GITHUB_PUSH`。对多个触发器重复该标志。运行 `eas workflow:insights --help` 查看完整列表。

输出有三部分：

- **概览**：总运行次数、成功率、活跃工作流和失败的运行，每一项都带有相对上一时段的变化。
- **随时间变化的运行**：每个时段的总计、成功、失败和已取消运行。时段是完整的 UTC 间隔，其大小跟随时间范围的长度。表格只列出有运行的时段，并在标题中说明它省略了一些时段。该范围内没有任何运行时，表格不会出现。
- **工作流**：时间范围内运行次数最多的工作流，以及它们的运行次数、成功率和最近一次运行。**工作流**列显示文件名，因此你可以把一行直接传给 `--workflow`。

使用 `--json` 时，这些部分是 `overview`、`runsOverTime` 和 `workflows` 键，并在设置了筛选时附带 `project`、`timespan` 和 `filters`。每个概览指标是带有 `current` 和 `previous` 值的对象。`runsOverTime` 是带有 `granularity` 和 `buckets` 数组的对象，该数组保留每个时段，包括表格省略的空时段。`workflows` 中的每个条目在工作流文件的 `name` 旁边带有 `fileName`，`hasMoreWorkflows` 告诉你 `--limit` 是否截断了表格。

## `eas workflow:insights:maestro`

显示与 Maestro 标签页相同的概览和流程表格。用它找出失败或 flaky 最多的流程。传入 `--flow` 可以深入单个流程，就像在仪表盘中选择一个流程一样。

```sh
# 最近 7 天，失败最多的流程排在前面
$ eas workflow:insights:maestro

# 最近 30 天中最 flaky 的流程
$ eas workflow:insights:maestro --days 30 --sort flake-rate

# 只看标记为 smoke 的流程中失败的运行
$ eas workflow:insights:maestro --status FAILED --tag smoke

# 按仓库中的路径查看一个流程的历史
$ eas workflow:insights:maestro --flow .maestro/login.yml --days 30
```

命令标志：

- `--status <status>`：只包含此状态的流程运行。`PASSED`、`FLAKY` 或 `FAILED` 之一，其中 `PASSED` 表示第一次尝试就通过。对多个状态重复该标志。
- `--tag <tag>`：只包含带有此标签的流程运行。对多个标签重复该标志。
- `--search <text>`：只列出路径包含此文本的流程。它只缩小流程表格，因此概览仍覆盖其他筛选匹配的每个流程。
- `--sort <column>`：按 `fails`（默认）、`runs`、`flakes`、`pass-rate`、`flake-rate`、`p90` 或 `last-run` 对流程表格排序。
- `--sort-direction <direction>`：`desc`（默认）或 `asc`。
- `--flow <path>`：显示一个流程的历史，而不是概览。使用 **Flow** 列中的精确路径，不能与 `--status`、`--tag`、`--search`、`--sort` 或 `--sort-direction` 组合。

概览显示 Maestro 运行次数、通过率、flaky 流程和平均时长，每一项都带有相对上一时段的变化。flaky 运行计为通过，因此一个流程可以同时显示高通过率和非零 flake 率。概览下方，随时间变化的运行使用与 `eas workflow:insights` 相同的分桶。流程表格列出每个流程的运行次数、通过率、失败次数和 flake 率。表格还显示 P90（第 90 百分位）时长、最近一次运行，以及该次运行的状态。使用 `--json` 时，这些是 `totals`、`runsOverTime` 和 `flows` 键。`totalFlows` 和 `hasMoreFlows` 告诉你匹配了多少流程，以及 `--limit` 是否截断了表格。

使用 `--flow` 时，输出以该流程的运行次数、通过率、flaky 运行和 P90 时长开始。然后列出该流程随时间变化的运行、五种最常见的错误模式，以及最近的运行。`--limit` 应用于最近的运行。使用 `--json` 时，查找 `totals`、`errorPatterns` 和 `recentRuns` 键，以及 `totalRecentRuns` 和 `hasMoreRecentRuns`。

表格把时长打印为 `450ms` 或 `12.3s`，没有运行报告时长时为 `n/a`。`--json` 输出以毫秒报告时长，并省略值为 null 的任何键。读取时带上回退，例如 `jq '.flows[] | {path, p90: (.p90DurationMs // "n/a")}'`。

## 常见任务

**查看 main 分支上工作流的表现：**

```sh
$ eas workflow:insights --git-ref main --days 30
```

**找出应优先修复的 Maestro 流程：**

```sh
# 最近 30 天失败最多的流程
$ eas workflow:insights:maestro --days 30

# 然后查看最差的那个的错误模式
$ eas workflow:insights:maestro --flow <flow-path> --days 30
```

**从 CI 构建自动化报告：**

1. 在拥有该项目的账户上创建[机器人用户](/accounts/programmatic-access#机器人用户与访问令牌)。
2. 把它的访问令牌设为 CI 作业中的 `EXPO_TOKEN` 环境变量。
3. 按 ID 查询项目，并从 JSON 输出中读取你需要的数字。

非 JSON 消息进入 stderr，因此你可以把输出直接管道到 `jq` 等工具。命令失败时，stdout 保持为空，消息进入 stderr。退出码非零，因此在解析之前先检查它：

```sh
# 最近 7 天全部工作流的成功率，作为一个数字
$ eas workflow:insights --project-id <project-id> --json | jq '.overview.successRatePercent.current'

# 最近 7 天每个流程的通过率和 P90 时长，最多 100 个流程
$ eas workflow:insights:maestro --project-id <project-id> --limit 100 --json | jq '.flows[] | {path, passRatePercent, p90DurationMs}'
```
