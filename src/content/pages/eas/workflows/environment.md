---
title: EAS Workflows 中的环境变量
description: EAS Workflows 作业内部可用环境变量的参考，包括 env 上下文和额外的 worker 变量。
---

# EAS Workflows 中的环境变量

每个工作流作业都在一个 worker 上运行，该 worker 有一组可用的环境变量。你可以用两种方式读取这些变量：

- 在作业插值的任何地方（例如 `params`、`if`、`env` 和 `run`），使用 [`${{ env.NAME }}`](/eas/workflows/syntax#env) 插值语法。
- 在 [`run`](/eas/workflows/syntax#jobsjob_idstepssteprun) 步骤内部，作为标准 shell 变量（`$NAME`）或通过 `process.env.NAME`。

```yaml .eas/workflows/print-env.yml
name: Print environment

jobs:
  print:
    steps:
      # 在命令运行之前插值。
      - run: echo "Project: ${{ env.EAS_BUILD_PROJECT_ID }}"
      # 在运行时从 shell 环境读取。
      - run: echo "Project: $EAS_BUILD_PROJECT_ID"
```

## 优先级

作业中可用的变量从三个来源合并。当同一个名称在不止一个来源中定义时，此列表中更高的那个胜出：

| 来源 | 说明 |
| --- | --- |
| [作业 `env`](/eas/workflows/syntax#jobsjob_idenv) | 你用 `env` 键在作业上设置的变量。它们是明文，并直接定义在工作流文件中。 |
| [**eas.json** 构建 profile 的 `env`](/build/eas-json#环境变量) | 对于 [`build`](/eas/workflows/pre-packaged-jobs#build) 作业，来自 **eas.json** 中由 `params.profile` 选中的 profile 的 `env`。 |
| [EAS 环境变量](/eas/environment-variables) | 为作业的[环境](#作业环境)（`production`、`preview` 或 `development`）存储在 EAS 上的变量名称和值。 |

在这些之上，worker 会设置若干[额外变量](#额外环境变量)，例如 `EAS_BUILD_ID` 和 `CI`。避免用 `EAS_` 前缀命名你自己的变量，以免这些变量遮蔽它们。

## 作业环境

作业可以读取哪些 EAS 环境变量取决于它的 [environment](/eas/workflows/syntax#jobsjob_idenvironment)：`production`（默认）、`preview` 或 `development`。只有分配给该环境的变量才会暴露给作业。

每个作业以不同方式解析其环境：

- [`build`](/eas/workflows/pre-packaged-jobs#build) 作业从 **eas.json** 中构建 profile 的 `environment` 推断它。
- [`submit`](/eas/workflows/pre-packaged-jobs#submit) 作业从被提交的构建继承它。
- [`maestro`](/eas/workflows/pre-packaged-jobs#maestro) 和 [`maestro-cloud`](/eas/workflows/pre-packaged-jobs#maestro-cloud) 作业默认为 `preview`。
- 其他作业默认为 `production`。

显式设置 [`jobs.<job_id>.environment`](/eas/workflows/syntax#jobsjob_idenvironment) 以覆盖默认值，并让作业与它所配对的构建 profile 保持同步。关于为作业选择环境的更多细节，见[在 EAS Workflows 中使用环境变量](/eas/environment-variables/usage#在-eas-workflows-中使用环境变量)。

## `${{ env }}` 上下文

[`${{ env }}` 上下文](/eas/workflows/syntax#env)是按名称键控的环境变量记录。它在作业的上下文中可用，而不是在工作流的顶层。例如，你可以在作业的 `params`、`if`、`env`、`outputs` 和 `run` 中使用它，但不能在顶层的 `on` 触发器中使用。

```yaml
jobs:
  notify:
    type: slack
    params:
      # 读取 SLACK_WEBHOOK_URL EAS 环境变量。
      webhook_url: ${{ env.SLACK_WEBHOOK_URL }}
      message: 'Deploy finished'
```

插值发生在两个地方，这会改变 `${{ env.NAME }}` 能够解析什么：

- **作业配置**（`params`、`if`、`outputs`，以及 `env` 本身的值）在作业被分发到 worker 之前插值。此时，`env` 包含已解析[环境](#作业环境)的 [EAS 环境变量](/eas/environment-variables)。额外的 worker 变量和作业自己的 `env` 值此时尚不可用。
- **`run` 命令**在 worker 上插值，此时 `env` 反映完整的运行时环境：EAS 环境变量、作业的 `env`，以及[额外变量](#额外环境变量)。

因此，像 `EAS_BUILD_ID` 这样的变量应当在 `run` 步骤内读取，而不是在作业的 `params` 中。在 `run` 步骤内，`${{ env.EAS_BUILD_ID }}` 和 `$EAS_BUILD_ID` 是等价的。

:::note
从密钥或敏感类型的 EAS 环境变量插值得到的值，会在工作流日志中被脱敏。
:::

## 上下文变量

环境变量并不是作业可以插值的唯一内容。同样的 `${{ ... }}` 语法暴露了若干描述工作流运行的上下文对象。上面介绍的 `env` 上下文是其中之一。其余的记录在下面。关于插值语法以及可用的[上下文函数](/eas/workflows/syntax#context-functions)（例如 `toJSON`、`fromJSON` 和 `success()`），见[语法](/eas/workflows/syntax#interpolation)。

:::note
要在运行时查看任何上下文的完整内容，用 `toJSON` 打印它。例如 `run: echo '${{ toJSON(github) }}'`。
:::

### `github`

来自触发工作流的 GitHub 事件的字段。当你用 `eas workflow:run` 启动一次运行时，`event_name` 是 `workflow_dispatch`，其他字段为空。

```js
github {
  triggering_actor,   // 触发运行的用户，例如 jonexpo
  event_name,         // 'pull_request'、'push'、'schedule' 或 'workflow_dispatch'
  sha,                // 提交 SHA
  ref,                // 完整 ref，例如 refs/heads/main
  ref_name,           // 短 ref，例如 main
  ref_type,           // 'branch'、'tag' 或 'other'
  commit_message,     // 仅用于 push 和 schedule 事件
  label,              // 标签名称，用于 pull_request_labeled 事件
  repository,         // 例如 expo/expo
  repository_owner,   // 例如 expo
  event {             // 完整的 GitHub webhook 载荷
    action,
    head_commit { message, id },   // 仅用于 push 和 schedule 事件
    pull_request {
      number,
      title,
      body,
      state,          // 'open' 或 'closed'
      draft,
      merged,
      html_url,
      user { login },
      labels,         // { name } 的数组
      head { ref, sha },   // 源分支
      base { ref, sha },   // 目标分支
      created_at,
      updated_at,
      merged_at,
      // ... 以及 GitHub Pull Request webhook 载荷中的其他字段
    },
    inputs,           // workflow_dispatch 输入
    schedule,         // cron 表达式，用于计划运行
    number,
  }
}
```

`event` 对象包含完整的 [GitHub webhook 载荷](https://docs.github.com/en/webhooks/webhook-events-and-payloads)。详细字段参考和示例见语法指南中的 [`github`](/eas/workflows/syntax#github)。

### `inputs`

当你用 [`workflow_dispatch`](/eas/workflows/syntax#onworkflow_dispatchinputs) 手动启动工作流时提供的输入记录。当工作流以其他方式触发时为空。

```yaml
jobs:
  greet:
    steps:
      - run: echo "Hello, ${{ inputs.name }}!"
```

### `needs`

当前作业的 [`needs`](/eas/workflows/syntax#jobsjob_idneeds) 中列出的上游作业记录。每一项提供作业的 `status`（`success`、`failure` 或 `skipped`）及其 `outputs`。

```yaml
jobs:
  notify:
    needs: [build]
    steps:
      - run: echo "Build status: ${{ needs.build.status }}"
```

### `after`

当前作业的 [`after`](/eas/workflows/syntax#jobsjob_idafter) 中列出的上游作业记录，无论它们是否成功。每一项提供与 [`needs`](#needs) 相同的 `status` 和 `outputs` 形状。

```yaml
jobs:
  notify:
    after: [build]
    steps:
      - run: echo "Build status: ${{ after.build.status }}"
```

### `steps`

当前作业中步骤的记录，按步骤 `id` 键控。每一项暴露用 [`set-output`](/eas/workflows/syntax#set-output) 函数设置的 `outputs`。此上下文只在作业的步骤内可用。

```yaml
jobs:
  my_job:
    steps:
      - id: step_1
        run: set-output my_greeting "hello"
      - run: echo "${{ steps.step_1.outputs.my_greeting }}"
```

### `metadata`

与作业关联的构建的元数据。它为 [`build`](/eas/workflows/pre-packaged-jobs#build) 作业填充，对于没有构建元数据的作业类型（例如自定义作业）则是空对象（`{}`）。

```js
metadata {
  buildProfile,     // 来自 eas.json 的构建 profile，例如 production
  appVersion,       // 应用版本，例如 1.0.0
  appBuildVersion,  // 构建号（iOS）或 version code（Android）
  sdkVersion,       // Expo SDK 版本，例如 54.0.0
  runtimeVersion,   // 用于 EAS Update 的运行时版本
  gitCommitHash,    // 构建所针对的 Git 提交
  distribution,     // 'store' 或 'internal'
}
```

### `workflow`

关于当前工作流运行的信息。

```js
workflow {
  id,        // 工作流运行的 ID
  name,      // 工作流的名称
  filename,  // 工作流文件的名称，例如 deploy.yml
  url,       // EAS 仪表盘上该次运行的 URL
}
```

```yaml
jobs:
  notify:
    type: slack
    params:
      message: |
        Workflow run completed: ${{ workflow.name }}
        View details: ${{ workflow.url }}
```

### `app_store_connect`

与该次运行关联的 App Store Connect 实体的信息。此上下文只存在于由 [App Store Connect 事件](/eas/workflows/syntax#onapp_store_connect)触发的工作流。

```js
app_store_connect {
  app { id },
  build_upload {
    id,
    state,             // 'awaiting_upload'、'processing'、'failed' 或 'complete'
    cf_bundle_version,
    cf_bundle_short_version_string,
    platform,
    uploaded_date,
    created_date,
    build { id },
  },
  app_version { id, state },
  external_beta { id, state },
  beta_feedback {
    id,
    type,              // 'crash' 或 'screenshot'
    url,
  },
}
```

```yaml
on:
  app_store_connect:
    build_upload:
      states:
        - complete

jobs:
  notify:
    type: slack
    params:
      webhook_url: ${{ env.SLACK_WEBHOOK_URL }}
      message: |
        Upload complete for app: ${{ app_store_connect.app.id }}
        Upload state: ${{ app_store_connect.build_upload.state }}
```

关于填充每个字段的事件域和完整示例，见语法指南中的 [`app_store_connect`](/eas/workflows/syntax#app_store_connect)。

## 额外环境变量

除了你设置的变量之外，worker 会在每个运行于虚拟机（VM）上的作业上提供若干变量，例如 `EAS_BUILD_ID`、`EAS_BUILD_PROJECT_ID` 和 `CI`。它们在运行时读取，因此从 `run` 步骤内引用它们。完整列表见[内置环境变量](/eas/environment-variables/usage#内置环境变量)。

Worker 也暴露标准工具链变量，例如 `HOME`、`PATH`、`LANG`、`ANDROID_HOME`、`ANDROID_SDK_ROOT` 和 `JAVA_HOME`。它们的确切值取决于 worker [镜像](/eas/workflows/syntax#jobsjob_idimage)，并且可能会变化。

## 在作业中设置环境变量

要定义你自己的变量，在作业上使用 [`env` 键](/eas/workflows/syntax#jobsjob_idenv)。值可以引用其他上下文属性。

```yaml
jobs:
  my_job:
    env:
      APP_VARIANT: staging
      COMMIT: ${{ github.sha }}
    steps:
      - run: echo "Building $APP_VARIANT at $COMMIT"
```

### 与同一作业中的后续步骤共享一个值

使用 [`set-env`](/eas/workflows/syntax#set-env) 命令在一个步骤中计算一个值，并在同一作业的后续步骤中读取它。该命令在 worker 的 `PATH` 上可用。它是 [`set-output`](/eas/workflows/syntax#set-output) 的环境变量对应物：`set-output` 暴露一个具名的作业输出，而 `set-env` 把环境变量暴露给作业的后续步骤。

```yaml
jobs:
  my_job:
    steps:
      - run: set-env GENERATED_TAG "v$(date +%Y%m%d)"
      # set-env 只影响后续步骤，因此该值在这里可用。
      - run: echo "Tag is $GENERATED_TAG"
```

- [EAS 环境变量](/eas/environment-variables)：为项目的环境创建和管理环境变量与密钥。
- [EAS Workflows 的语法](/eas/workflows/syntax#interpolation)：工作流中可用的全部插值上下文和函数的参考。
