---
title: 面向 EAS Workflows 的 PostHog 配方
description: 一条引导路径：从在 PostHog 中标记第一次部署，到门控发布、自动熔断，以及用 EAS Workflows 做需要批准的发布。
---

# 面向 EAS Workflows 的 PostHog 配方

[EAS Workflows](/eas/workflows/get-started) 可以把 PostHog 操作作为 CI 流水线中的步骤运行。下面每个配方都是可以原样复制的完整工作流，它们合在一起构成完整的渐进交付流水线：

- **产品分析**：[标记一次部署](#在-posthog-时间线上标记一次部署)、[为发布添加注释](#为发布添加注释)，以及[用户采用后再宣布发布](#用户采用后再宣布发布)
- **功能标志**：[在功能标志后面发布功能](#在功能标志后面发布功能)、[根据错误率推出或回滚](#根据错误率推出或回滚)、[经人工批准后把标志推进到全量发布](#经人工批准后把标志推进到全量发布)，以及[手动](#用熔断开关关闭功能)或[在错误激增时自动](#在错误激增时自动关闭功能)关闭功能
- **错误跟踪**：为可读的堆栈跟踪[上传 source map](#为错误跟踪上传-source-map)，以及[推出 EAS Update 渠道或在失败时回退](#推出-eas-update-渠道或在失败时回退)

一份精简的[更多配方列表](#更多配方)覆盖更窄的需求。每个函数接受的全部输入见 [EAS Workflows 语法参考](/eas/workflows/syntax#easposthog_capture_event)。

## 开始

一条命令就能设置这些配方所需的一切。在项目目录中运行：

```sh
eas integrations:posthog:connect
```

它把 PostHog 项目链接到你的 Expo 项目，并把这些函数读取的凭据保存为 EAS 环境变量。[使用 PostHog](/guides/using-posthog)指南会走完完整设置。

当命令要求个人 API 密钥时，用 “Source map upload” 预设创建它，并加上 `feature_flag:read`、`feature_flag:write`、`query:read` 和 `annotation:write` 权限范围。这一把密钥覆盖本页的每个配方。如果之前用范围更窄的密钥连接过，请新建一把，并把它设为 `POSTHOG_CLI_API_KEY` [环境变量](/eas/environment-variables/manage)，可见性为 **Sensitive**。

:::note
在 GitHub 事件上运行的工作流（例如推送到 `main`）需要把 EAS 项目链接到 GitHub 仓库。参见[开始使用 EAS Workflows](/eas/workflows/get-started#automate-workflows-with-github-events)。
:::

## 在 PostHog 时间线上标记一次部署

每次发布更新时发送一个 PostHog 事件。每次部署随后会出现在 PostHog 数据中，因此你可以检查某个指标的变化是否与一次发布对齐。

```yaml .eas/workflows/mark-deploy.yml
name: Publish update and mark it in PostHog

on:
  push:
    branches: ['main']

jobs:
  publish:
    type: update
    params:
      branch: main

  mark_deploy:
    needs: [publish]
    steps:
      - uses: eas/posthog_capture_event
        with:
          event: ota_update_published
          properties:
            eas/account: ${{ account.name }}
            eas/project_id: ${{ app.id }}
            eas/workflow_id: ${{ workflow.id }}
            eas/update_id: ${{ needs.publish.outputs.first_update_group_id }}
            eas/runtime_version: ${{ fromJSON(needs.publish.outputs.updates_json || '[]')[0].runtimeVersion }}
            branch: main
```

### 工作原理

1. [`update`](/eas/workflows/pre-packaged-jobs#update) 作业把 EAS Update 发布到 `main` 分支。
2. [`eas/posthog_capture_event`](/eas/workflows/syntax#easposthog_capture_event) 在其后运行，并用[标准 EAS 属性](/guides/using-posthog#标准-eas-属性)记录这次部署。`eas/account`、`eas/project_id` 和 `eas/workflow_id` 来自始终可用的工作流上下文；`eas/update_id` 和 `eas/runtime_version` 来自更新作业的[输出](/eas/workflows/pre-packaged-jobs#update)。使用 [`fingerprint` 运行时版本策略](/eas-update/runtime-versions)时，每当原生运行时变化，运行时版本就会变化，依据是项目的[指纹](/versions/latest/sdk/fingerprint)。
3. 因为没有设置 `distinct_id`，该事件是匿名的，不会创建人员资料。

## 为发布添加注释

发布更新时创建一条 PostHog 注释。注释会作为标记出现在项目的每张图表上，因此你可以直接在受影响的图上看到每次发布。

```yaml .eas/workflows/annotate-release.yml
name: Annotate release in PostHog

on:
  push:
    branches: ['main']

jobs:
  publish:
    type: update
    params:
      branch: main

  annotate:
    needs: [publish]
    steps:
      - uses: eas/posthog_annotation
        with:
          content: Published update for runtime ${{ fromJSON(needs.publish.outputs.updates_json || '[]')[0].runtimeVersion }} to main
```

### 工作原理

1. [`update`](/eas/workflows/pre-packaged-jobs#update) 作业发布更新。
2. [`eas/posthog_annotation`](/eas/workflows/syntax#easposthog_annotation) 把注释钉在当前时间，内容中的运行时版本标识这次发布。

## 为错误跟踪上传 source map

上传 source map，以便错误跟踪能把崩溃符号化回原始代码。如何上传取决于产生 bundle 的预置作业。两条路径都需要[使用 PostHog](/guides/using-posthog#错误跟踪)指南中的 PostHog 设置。

[`build`](/eas/workflows/pre-packaged-jobs#build) 会自行上传 source map。`posthog-react-native/expo` 配置插件在原生构建期间上传它们，因此作业不需要额外内容：

```yaml .eas/workflows/build-production.yml
name: Build for production

on:
  push:
    branches: ['main']

jobs:
  build:
    type: build
    params:
      platform: ios
      profile: production
```

更新只发布 JavaScript，因此要在发布后上传它的 source map。[`update`](/eas/workflows/pre-packaged-jobs#update) 作业不能运行额外步骤，而且 source map 必须位于上传它们的那个作业的磁盘上。因此在自定义作业中用 `eas update` 为一个平台发布，并在那里添加上传步骤：

```yaml .eas/workflows/update-with-sourcemaps.yml
name: Publish update with source maps

on:
  push:
    branches: ['main']

jobs:
  publish_update:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - run: npx eas-cli@latest update --branch main --platform ios --auto --non-interactive
      - uses: eas/posthog_upload_sourcemaps
        with:
          directory: dist
```

### 工作原理

1. `eas update --platform ios` 发布更新，并把导出（包括 source map）留在 **dist** 目录中。每个作业导出一个原生平台：完整导出会包含 Web bundle，PostHog 的 Hermes 上传会拒绝它。
2. [`eas/posthog_upload_sourcemaps`](/eas/workflows/syntax#easposthog_upload_sourcemaps) 把这些 map 上传到 PostHog 错误跟踪，因此来自该更新的堆栈跟踪会符号化回原始代码。它使用 [PostHog Metro 配置](/guides/using-posthog#source-map)，为每个 bundle 提供与其 source map 匹配的 chunk ID。符号化如何工作见[错误跟踪](/guides/using-posthog#错误跟踪)。

## 在功能标志后面发布功能

把功能的发布状态保存在仓库中的一个文件里，让工作流把它应用到 PostHog。发布功能或扩大其发布范围就变成编辑一个文件的拉取请求。

```json .eas/feature-rollout.json
{
  "flag": "new-checkout",
  "rollout_percentage": 10
}
```

```yaml .eas/workflows/feature-release.yml
name: Apply the feature rollout from the repo

on:
  push:
    branches: ['main']
    paths: ['.eas/feature-rollout.json']

jobs:
  publish:
    type: update
    params:
      branch: main

  read_rollout:
    outputs:
      flag: ${{ steps.rollout.outputs.flag }}
      percent: ${{ steps.rollout.outputs.percent }}
    steps:
      - uses: eas/checkout
      - id: rollout
        run: |
          set-output flag "$(node -p "require('./.eas/feature-rollout.json').flag")"
          set-output percent "$(node -p "require('./.eas/feature-rollout.json').rollout_percentage")"

  apply_rollout:
    needs: [publish, read_rollout]
    steps:
      - uses: eas/posthog_flag_rollout
        with:
          flag: ${{ needs.read_rollout.outputs.flag }}
          active: true
          rollout_percentage: ${{ needs.read_rollout.outputs.percent }}
```

### 工作原理

1. [`paths`](/eas/workflows/syntax#onpush) 过滤器只在 **.eas/feature-rollout.json** 变化时运行此工作流，因此该文件就是你定义发布状态的地方。
2. `read_rollout` 用 [`set-output`](/eas/workflows/syntax#jobsjob_idoutputs) 读取文件，并通过作业的 `outputs` 暴露这些值。
3. [`eas/posthog_flag_rollout`](/eas/workflows/syntax#easposthog_flag_rollout) 在两个依赖都完成后应用标志状态，因此只有在读取它的代码已经上线后，标志才会翻转。

## 根据错误率推出或回滚

向一小部分用户发布，观察错误率，让工作流做决定。错误保持较低时，它把标志扩大到所有人。否则，它关闭标志。无论哪种情况，中间都不需要有人盯着仪表盘。

```yaml .eas/workflows/canary-rollout.yml
name: Canary rollout that rolls forward or back

on:
  push:
    branches: ['main']

jobs:
  publish:
    type: update
    params:
      branch: main

  canary:
    needs: [publish]
    steps:
      - uses: eas/posthog_flag_rollout
        with:
          flag: new-checkout
          active: true
          rollout_percentage: 25

  error_gate:
    needs: [canary]
    steps:
      - uses: eas/posthog_wait_for_metric
        with:
          query: SELECT count() FROM events WHERE event = '$exception' AND timestamp > now() - INTERVAL 30 MINUTE
          operator: lte
          threshold: 5
          interval_seconds: 60
          timeout_seconds: 1800

  full_rollout:
    needs: [error_gate]
    steps:
      - uses: eas/posthog_flag_rollout
        with:
          flag: new-checkout
          rollout_percentage: 100

  roll_back:
    after: [error_gate]
    if: ${{ failure() }}
    steps:
      - uses: eas/posthog_flag_rollout
        with:
          flag: new-checkout
          active: false
```

### 工作原理

1. [`update`](/eas/workflows/pre-packaged-jobs#update) 作业发布代码，然后 [`eas/posthog_flag_rollout`](/eas/workflows/syntax#easposthog_flag_rollout) 把它暴露给 25% 的用户。
2. [`eas/posthog_wait_for_metric`](/eas/workflows/syntax#easposthog_wait_for_metric) 运行一条 [HogQL](https://posthog.com/docs/hogql) 查询，并等待最近 30 分钟的异常计数为 5 或更少。门控通过后，`full_rollout` 把标志扩大到 100%。如果糟糕的发布让计数居高不下，门控会超时并失败，`full_rollout` 永远不会运行。
3. 失败时，`roll_back` 关闭标志。它使用带 [`if: ${{ failure() }}`](/eas/workflows/syntax#jobsjob_idif) 的 [`after`](/eas/workflows/syntax#jobsjob_idafter)，因为这里 `needs` 依赖行不通。当 `needs` 依赖失败时，作业会在其 `if` 条件求值之前被跳过。`failure()` 反映整个工作流运行，因此让此工作流专注于发布及其门控。

## 推出 EAS Update 渠道，或在失败时回退

上面的发布用 PostHog 功能标志控制曝光。如果你改为用 [EAS Update 渠道百分比](/eas-update/rollouts)发布，同一个门控会驱动 `eas channel:rollout`：发布更新，把一部分用户送到它，观察错误率，然后把发布扩大到所有人或回退。它触及的 EAS 比这里任何其他配方都多：更新作业、渠道发布、指标门控，以及一个结果事件。

```yaml .eas/workflows/channel-rollout.yml
name: Channel rollout that widens or reverts

on:
  push:
    branches: ['main']

jobs:
  publish:
    type: update
    params:
      branch: rollout

  start_rollout:
    needs: [publish]
    steps:
      - run: npx eas-cli@latest channel:rollout production --action create --branch rollout --percent 10 --runtime-version 1.0.0 --non-interactive

  error_gate:
    needs: [start_rollout]
    steps:
      - id: gate
        uses: eas/posthog_wait_for_metric
        with:
          query: SELECT count() FROM events WHERE event = '$exception' AND timestamp > now() - INTERVAL 15 MINUTE
          operator: lt
          threshold: 10
          interval_seconds: 60
          timeout_seconds: 900
      - uses: eas/posthog_capture_event
        with:
          event: channel_rollout_cleared
          properties:
            eas/account: ${{ account.name }}
            eas/project_id: ${{ app.id }}
            eas/workflow_id: ${{ workflow.id }}
            error_count: ${{ steps.gate.outputs.value }}

  widen:
    needs: [error_gate]
    steps:
      - run: npx eas-cli@latest channel:rollout production --action end --outcome republish-and-revert --non-interactive

  revert:
    after: [error_gate]
    if: ${{ failure() }}
    steps:
      - run: npx eas-cli@latest channel:rollout production --action end --outcome revert --non-interactive
```

### 工作原理

1. [`update`](/eas/workflows/pre-packaged-jobs#update) 作业发布到 `rollout` 分支，然后 `eas channel:rollout` 在 `production` 渠道上开始发布，把 10% 的用户送到新更新。`--runtime-version` 的值必须与已发布更新的运行时版本匹配。
2. [`eas/posthog_wait_for_metric`](/eas/workflows/syntax#easposthog_wait_for_metric) 一直等到最近 15 分钟的异常计数保持在 10 以下，然后通过步骤的 `value` 输出记录通过门控的计数。
3. 门控通过时，`widen` 用 `--outcome republish-and-revert` 结束发布，这会把新更新发布给所有人。
4. 门控失败时，`revert` 用 `--outcome revert` 结束发布，这会把用户送回先前的更新。它使用与[标志回滚](#根据错误率推出或回滚)相同的 [`after`](/eas/workflows/syntax#jobsjob_idafter) 加 [`if: ${{ failure() }}`](/eas/workflows/syntax#jobsjob_idif) 模式。

## 经人工批准后把标志推进到全量发布

在标志达到 100% 之前，在 EAS 仪表盘中暂停工作流以等待明确批准。对你不想端到端自动化的发布使用此方法。

```yaml .eas/workflows/approved-ga.yml
name: Take a feature to GA with human approval

jobs:
  approve:
    name: Approve new-checkout GA?
    type: require-approval

  go_full:
    needs: [approve]
    steps:
      - uses: eas/posthog_flag_rollout
        with:
          flag: new-checkout
          active: true
          rollout_percentage: 100

  bookkeeping:
    needs: [go_full]
    steps:
      - uses: eas/posthog_capture_event
        with:
          event: feature_went_ga
          properties:
            eas/account: ${{ account.name }}
            eas/project_id: ${{ app.id }}
            eas/workflow_id: ${{ workflow.id }}
            flag: new-checkout
```

### 工作原理

1. [`require-approval`](/eas/workflows/pre-packaged-jobs#require-approval) 作业暂停工作流，直到有人在 EAS 仪表盘中批准或拒绝。
2. 如果批准，[`eas/posthog_flag_rollout`](/eas/workflows/syntax#easposthog_flag_rollout) 把标志发布到 100%。如果拒绝，作业失败，`go_full` 被跳过。
3. 后续事件记录标志何时达到全量发布。

## 用熔断开关关闭功能

用一条命令为所有人关闭功能。此工作流没有 `on` 触发器，因此只有在你启动它时才运行，例如在事故期间。

```yaml .eas/workflows/kill-switch.yml
name: Disable new-checkout now

jobs:
  disable_flag:
    steps:
      - uses: eas/posthog_flag_rollout
        with:
          flag: new-checkout
          active: false

  audit_trail:
    needs: [disable_flag]
    steps:
      - uses: eas/posthog_capture_event
        with:
          event: kill_switch_pulled
          properties:
            eas/account: ${{ account.name }}
            eas/project_id: ${{ app.id }}
            eas/workflow_id: ${{ workflow.id }}
            flag: new-checkout
```

### 工作原理

1. 用以下命令运行它：

```sh
eas workflow:run kill-switch.yml
```

2. [`eas/posthog_flag_rollout`](/eas/workflows/syntax#easposthog_flag_rollout) 关闭标志，后续事件记录这件事发生了。

## 在错误激增时自动关闭功能

这是上一个配方中的熔断开关接到错误门控上，因此部署后错误率激增时，它会自行关闭功能。

```yaml .eas/workflows/auto-kill-switch.yml
name: Turn off new-checkout automatically on an error spike

on:
  push:
    branches: ['main']

jobs:
  publish:
    type: update
    params:
      branch: main

  error_gate:
    needs: [publish]
    steps:
      - uses: eas/posthog_wait_for_metric
        with:
          query: SELECT count() FROM events WHERE event = '$exception' AND timestamp > now() - INTERVAL 10 MINUTE
          operator: lt
          threshold: 20
          interval_seconds: 60
          timeout_seconds: 600

  auto_kill_switch:
    after: [error_gate]
    if: ${{ failure() }}
    steps:
      - uses: eas/posthog_flag_rollout
        with:
          flag: new-checkout
          active: false
      - uses: eas/posthog_capture_event
        with:
          event: auto_kill_switch_pulled
          properties:
            eas/account: ${{ account.name }}
            eas/project_id: ${{ app.id }}
            eas/workflow_id: ${{ workflow.id }}
            flag: new-checkout
```

### 工作原理

1. [`update`](/eas/workflows/pre-packaged-jobs#update) 作业发布更新，[`eas/posthog_wait_for_metric`](/eas/workflows/syntax#easposthog_wait_for_metric) 等待最近 10 分钟的异常计数低于 20。如果糟糕的更新让计数居高不下，门控会超时并失败。
2. `auto_kill_switch` 作业使用与[标志回滚](#根据错误率推出或回滚)相同的 [`after`](/eas/workflows/syntax#jobsjob_idafter) 加 [`if: ${{ failure() }}`](/eas/workflows/syntax#jobsjob_idif) 模式。
3. [`eas/posthog_flag_rollout`](/eas/workflows/syntax#easposthog_flag_rollout) 关闭标志，与手动熔断开关相同的操作，并记录它是自动触发的。

## 用户采用后再宣布发布

一旦有足够用户使用新更新，就发送一条 Slack 消息。工作流等待真实采用，而不是部署一完成就宣布。

```yaml .eas/workflows/announce-on-adoption.yml
name: Announce release once adopted

on:
  push:
    branches: ['main']

jobs:
  publish:
    type: update
    params:
      branch: main

  adoption_gate:
    needs: [publish]
    steps:
      - uses: eas/posthog_wait_for_metric
        with:
          query: SELECT count(DISTINCT distinct_id) FROM events WHERE timestamp > now() - INTERVAL 1 HOUR
          operator: gte
          threshold: 50
          interval_seconds: 120
          timeout_seconds: 3600

  announce:
    needs: [adoption_gate]
    type: slack
    environment: production
    params:
      webhook_url: ${{ env.SLACK_WEBHOOK_URL }}
      message: The latest update is live and 50 or more users are on it.
```

### 工作原理

1. [`update`](/eas/workflows/pre-packaged-jobs#update) 作业发布更新。
2. [`eas/posthog_wait_for_metric`](/eas/workflows/syntax#easposthog_wait_for_metric) 等待最近一小时至少有 50 个不同用户发送了事件。
3. 门控通过后，[`slack`](/eas/workflows/pre-packaged-jobs#slack) 作业宣布发布。把 `SLACK_WEBHOOK_URL` 设为 EAS 上的[环境变量](/eas/environment-variables/manage)。

## 更多配方

面向更窄需求的较短配方。

### 等待特定事件

保持工作流，直到特定事件到达，例如部署后的冒烟测试报告成功，而不是对聚合指标设门控。

```yaml .eas/workflows/wait-for-smoke-test.yml
name: Wait for smoke test to pass

jobs:
  wait_for_smoke_test:
    steps:
      - uses: eas/posthog_wait_for_query
        with:
          query: SELECT count() > 0 FROM events WHERE event = 'smoke_test_passed' AND timestamp > now() - INTERVAL 30 MINUTE
          interval_seconds: 15
          timeout_seconds: 600
```

[`eas/posthog_wait_for_query`](/eas/workflows/syntax#easposthog_wait_for_query) 在查询返回 true 时通过。30 分钟窗口防止旧的冒烟测试事件立刻通过门控。

### 检查夜间错误预算

按计划运行门控，而不是在部署之后，作为独立的健康检查。

```yaml .eas/workflows/error-budget.yml
name: Nightly error-budget check

on:
  schedule:
    - cron: '0 6 * * *'

jobs:
  assert_error_budget:
    steps:
      - uses: eas/posthog_wait_for_metric
        with:
          query: SELECT count() FROM events WHERE event = '$exception' AND timestamp > now() - INTERVAL 24 HOUR
          operator: lt
          threshold: 100
          interval_seconds: 30
          timeout_seconds: 60
```

[`on.schedule.cron`](/eas/workflows/syntax#onschedulecron) 触发器独立于任何部署运行此工作流，因此它作为常设健康检查，而不是针对某次具体发布的门控。

### 标记商店提交

`eas/posthog_capture_event` 对原生发布的工作方式与对更新相同。

```yaml .eas/workflows/store-release.yml
name: Build, submit to the store, mark it in PostHog

jobs:
  build:
    type: build
    params:
      platform: ios
      profile: production

  submit:
    needs: [build]
    type: submit
    params:
      build_id: ${{ needs.build.outputs.build_id }}
      profile: production

  mark_release:
    needs: [submit, build]
    steps:
      - uses: eas/posthog_capture_event
        with:
          event: store_build_submitted
          properties:
            eas/account: ${{ account.name }}
            eas/project_id: ${{ app.id }}
            eas/workflow_id: ${{ workflow.id }}
            eas/build_id: ${{ needs.build.outputs.build_id }}
            eas/channel: ${{ needs.build.outputs.channel }}
            platform: ios
            profile: production
```

## 重要说明

- **凭据来自 connect 命令。** 每个函数默认使用 `eas integrations:posthog:connect` 设置的环境变量，并且当你需要覆盖时，每个函数都接受 `api_key` 输入。要自己设置，把这些添加为 [EAS 环境变量](/eas/environment-variables/manage)：`eas/posthog_capture_event` 使用 `EXPO_PUBLIC_POSTHOG_API_KEY`，其他每个函数使用 `POSTHOG_CLI_API_KEY` 加上 `POSTHOG_CLI_PROJECT_ID`。[语法参考](/eas/workflows/syntax#easposthog_capture_event)列出了每个函数所需的权限范围。
- **超时的门控会使步骤失败。** `eas/posthog_wait_for_metric` 和 `eas/posthog_wait_for_query` 没有 `ignore_error` 输入，因此从未通过的门控会停止发布，而不是让它继续。
- **条件一成立，门控就会通过。** 检查低错误计数的门控可能在第一次检查时就通过，包括刚部署之后、用户还没使用新更新之前。当你需要先给错误一个浮现的机会时，把它与采用门控配对，就像[用户采用后再宣布发布](#用户采用后再宣布发布)中的那个。
- **把查询限定到当前运行。** 事件和指标查询会返回历史数据。添加 `timestamp > now() - INTERVAL ...` 过滤器，或本次运行独有的属性，这样旧事件就不会立刻通过门控。设置[发布标记](/guides/using-posthog#发布标记)会把 `eas/update_id`、`eas/channel` 和 `eas/runtime_version` 附加到每个客户端事件，因此你可以按 `properties['eas/update_id']` 过滤门控，把它限定到确切的发布。
