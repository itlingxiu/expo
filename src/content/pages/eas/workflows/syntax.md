---
title: EAS Workflows 的语法
description: EAS Workflows 配置文件语法的参考指南。
---

# EAS Workflows 的语法

工作流是由一个或多个作业组成的可配置自动化流程。你必须创建一个 YAML 文件来定义工作流配置。

要开始使用工作流，见[开始使用 EAS Workflows](/eas/workflows/get-started)，或见[示例](/eas/workflows/examples/introduction)以获取完整的工作流配置。

## 工作流文件

工作流文件使用 YAML 语法，必须使用 `.yml` 或 `.yaml` 扩展名，并且必须小于或等于 16 KiB。如果你不熟悉 YAML 并想了解更多，见 [Learn YAML in Y minutes](https://learnxinyminutes.com/docs/yaml/)。

工作流文件位于项目中的 **.eas/workflows** 目录。**.eas** 目录应当与 [**eas.json**](/build/eas-json) 文件处于同一级。

例如：

```text
my-app/
├── .eas/workflows/create-development-builds.yml
├── .eas/workflows/publish-preview-update.yml
├── .eas/workflows/deploy-to-production.yml
└── eas.json
```

## 配置参考

下面是工作流配置文件语法的参考。

## `name`

工作流的人类可读名称。它显示在 EAS 仪表盘的工作流列表页上，也是工作流详情页的标题。要为每一次单独的运行设置标题，使用 [`run_name`](#run_name)。

```yaml
name: My workflow
```

## `run_name`

单次工作流运行的标题。它与 [`name`](#name) 分开，后者标记的是工作流本身。

```yaml
name: Deploy
run_name: Deploy ${{ inputs.environment }}

on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options:
          - preview
          - production
        required: true
```

该值是一个字符串。它可以包含 `${{ }}` 表达式。EAS 在创建运行时、任何作业开始之前渲染该模板。

表达式可以使用 [`github`](#github)、[`app_store_connect`](#app_store_connect)、`inputs`、[`workflow`](#workflow)、`app` 和 `account` 上下文。它支持除 `success()`、`failure()` 和 `hashFiles()` 之外的所有[上下文函数](#context-functions)。那些函数需要一个已经运行过的作业或步骤。

作业级上下文（例如 `needs`、`steps` 和 `env`）不可用。如果模板引用了不受支持的上下文，运行会失败。EAS 会存储一条错误，并且不会存储自定义标题。

如果渲染后的文本长于 255 个字符，EAS 会把它截断为 254 个字符并追加省略号。

## `on`

`on` 键定义哪些 GitHub 事件会触发工作流。无论 `on` 键如何，任何工作流都可以用 `eas workflow:run` 命令触发。

```yaml
on:
  # 在推送到 main 分支时触发
  push:
    branches:
      - main
  # 以及在以 'version-' 开头的拉取请求上触发
  pull_request:
    branches:
      - version-*
```

:::note
你可以在提交消息中包含 `[eas skip]`、`[skip eas]` 或 `[no eas]`，以跳过由 `push` 和 `pull_request` 触发的工作流运行。
:::

### `on.push`

当你把提交推送到匹配的分支和/或标签时运行工作流。

使用 `branches` 列表，你可以只在推送到那些指定分支时触发工作流。例如，如果你使用 `branches: ['main']`，只有推送到 `main` 分支才会触发工作流。支持 glob。使用 `!` 前缀可以指定要忽略的分支（你仍然需要提供至少一个不带该前缀的分支模式）。

使用 `tags` 列表，你可以只在推送那些指定标签时触发工作流。例如，如果你使用 `tags: ['v1']`，只有推送 `v1` 标签才会触发工作流。支持 glob。使用 `!` 前缀可以指定要忽略的标签（你仍然需要提供至少一个不带该前缀的标签模式）。

使用 `paths` 列表，你可以只在对匹配指定路径的文件做出更改时触发工作流。例如，如果你使用 `paths: ['apps/mobile/**']`，只有 `apps/mobile` 目录中的文件更改才会触发工作流。支持 glob。默认情况下，任何路径的更改都会触发工作流。

当既没有提供 `branches` 也没有提供 `tags` 时，`branches` 默认为 `['*']`，`tags` 默认为 `[]`，这意味着工作流会在所有分支的 push 事件上触发，并且不会在标签推送上触发。如果只提供了两个列表中的一个，另一个默认为 `[]`。

使用 [`if:`](#ontriggerif) 条件，你可以决定工作流运行是否开始。

```yaml
on:
  push:
    branches:
      - main
      - feature/**
      - !feature/test-** # 其他分支名称和 glob


    tags:
      - v1
      - v2*
      - !v2-preview** # 其他标签名称和 glob


    paths:
      - apps/mobile/**
      - packages/shared/**
      - !**/*.md # 忽略 markdown 文件

```

### `on.ref_delete`

当 GitHub 分支或标签被删除时运行工作流。要求你的 EAS 项目上有一个[已关联的 GitHub 仓库](/eas/workflows/get-started#用-github-事件自动化工作流)。

使用 `branches` 列表，你可以只在删除那些指定分支时触发工作流。例如，如果你使用 `branches: ['feat/**']`，只有删除匹配 `feat/**` 的分支才会触发工作流。支持 glob。使用 `!` 前缀可以指定要忽略的分支（你仍然需要提供至少一个不带该前缀的分支模式）。关于 glob 和否定模式匹配的细节，见 [`on.push`](#onpush)。

使用 `tags` 列表，你可以只在删除那些指定标签时触发工作流。支持 glob 和 `!` 否定，规则与分支相同。

当既没有提供 `branches` 也没有提供 `tags` 时，`branches` 默认为 `['*']`，`tags` 默认为 `[]`，这意味着任何分支被删除时工作流都会触发，并且不会在标签删除上触发。如果只提供了两个列表中的一个，另一个默认为 `[]`。

使用 [`if:`](#ontriggerif) 条件，你可以决定工作流运行是否开始。

:::note
工作流文件是在删除发生时从默认分支的 HEAD 读取的，而不是从被删除的 ref 读取。
:::

把此触发器与 [`branch-delete`](/eas/workflows/pre-packaged-jobs#branch-delete) 作业配对，以便在 GitHub 分支被删除时移除 EAS Update 分支。完整工作流见[清理更新分支示例](/eas/workflows/examples/branch-cleanup)。

```yaml
on:
  ref_delete:
    branches:
      - feat/**
      - !main # 其他分支名称和 glob


    tags:
      - v*
      - !v2-preview** # 其他标签名称和 glob

```

### `on.pull_request`

当你创建或更新一个以匹配分支之一为目标的拉取请求时运行工作流。

:::note
从已连接仓库的 fork 打开的拉取请求不会触发 `pull_request` 工作流运行。
:::

使用 `branches` 列表，你可以只在那些指定分支是拉取请求的目标时触发工作流。例如，如果你使用 `branches: ['main']`，只有要合并进 main 分支的拉取请求才会触发工作流。支持 glob。未提供时默认为 `['*']`，这意味着工作流会在所有分支的拉取请求事件上触发。使用 `!` 前缀可以指定要忽略的分支（你仍然需要提供至少一个不带该前缀的分支模式）。

使用 `types` 列表，你可以只在指定的拉取请求事件类型上触发工作流。例如，如果你使用 `types: ['opened']`，只有 `pull_request.opened` 事件（拉取请求首次打开时发送）才会触发工作流。未提供时默认为 `['opened', 'reopened', 'synchronize']`。支持的事件类型：

- `opened`
- `edited`
- `base_ref_changed`
- `ready_for_review`
- `reopened`
- `synchronize`
- `labeled`

`edited` 类型遵循 GitHub 的 `pull_request.edited` 行为，并在拉取请求的标题、正文或基分支变化时触发。要只在拉取请求的基分支变化时触发，使用 `base_ref_changed`。

`branches` 过滤器匹配拉取请求当前的基分支，因此把拉取请求重新指向一个匹配的分支可以触发工作流。

使用 `paths` 列表，你可以只在对匹配指定路径的文件做出更改时触发工作流。例如，如果你使用 `paths: ['apps/mobile/**']`，只有 `apps/mobile` 目录中的文件更改才会触发工作流。支持 glob。默认情况下，任何路径的更改都会触发工作流。

你可以添加 [`if:`](#ontriggerif) 条件来决定工作流运行是否开始。

```yaml
on:
  pull_request:
    branches:
      - main
      - feature/**
      - !feature/test-** # 其他分支名称和 glob


    types:
      - opened
      # 其他事件类型

    paths:
      - apps/mobile/**
      - packages/shared/**
      - !**/*.md # 忽略 markdown 文件

```

### `on.pull_request_labeled`

当拉取请求被打上匹配的标签时运行工作流。

使用 `labels` 列表，你可以指定哪些标签在被分配给你的拉取请求时会触发工作流。例如，如果你使用 `labels: ['Test']`，只有给拉取请求打上 `Test` 标签才会触发工作流。未提供时默认为 `[]`，这意味着没有标签会触发工作流。

要决定工作流运行是否开始，添加 [`if:`](#ontriggerif) 条件。

你也可以直接向 `on.pull_request_labeled` 提供匹配标签的列表，以使用更简单的语法。

```yaml
on:
  pull_request_labeled:
    labels:
      - Test
      - Preview
      # 其他标签
```

另一种写法：

```yaml
on:
  pull_request_labeled:
    - Test
    - Preview
    # 其他标签
```

### `on.pull_request_comment`

当有人在拉取请求上创建、编辑或删除评论时运行工作流。

:::note
只有打开且未合并的拉取请求才会触发 `pull_request_comment` 工作流运行。从已连接仓库的 fork 打开的拉取请求不会触发工作流运行。
:::

使用 `types` 列表，你可以指定哪些事件会触发工作流。未提供时默认为 `['created']`。支持的事件类型：

- `created`
- `edited`
- `deleted`

与 `on.pull_request` 不同，此触发器没有 `branches` 或 `paths` 过滤器。

使用 [`if:`](#ontriggerif) 条件，你可以决定工作流运行是否开始。

```yaml
on:
  pull_request_comment:
    types:
      - created
      - edited
      # 其他事件类型
```

### `on.app_store_connect`

当所选的 App Store Connect 事件之一发生时运行工作流。

:::note
要使用此触发器，在 [EAS 仪表盘](https://expo.dev/accounts/[account]/projects/[project]/settings)中配置你的 App Store Connect 连接。设置步骤见[从 App Store Connect 事件触发工作流](/eas/workflows/get-started#从-app-store-connect-事件触发工作流)。
:::

当存在 `on.app_store_connect` 时，你必须指定至少一个事件域（`app_version`、`build_upload`、`external_beta` 或 `beta_feedback`）。在已配置的事件域内，你可以指定哪些状态应当触发工作流。

每个事件域也接受 [`if:`](#ontriggerif) 条件，因此你可以决定工作流运行是否开始。

#### `on.app_store_connect.app_version.states`

按状态过滤 App Store 应用版本状态变化事件。未提供时默认为所有受支持的应用版本状态。

支持的值：

- `accepted`
- `developer_rejected`
- `in_review`
- `invalid_binary`
- `metadata_rejected`
- `pending_apple_release`
- `pending_developer_release`
- `prepare_for_submission`
- `processing_for_distribution`
- `ready_for_distribution`
- `ready_for_review`
- `rejected`
- `replaced_with_new_version`
- `waiting_for_export_compliance`
- `waiting_for_review`

#### `on.app_store_connect.build_upload.states`

按状态过滤构建上传事件。未提供时默认为所有受支持的构建上传状态。

支持的值：

- `complete`
- `failed`
- `processing`
- `awaiting_upload`

#### `on.app_store_connect.external_beta.states`

按状态过滤外部 Beta 事件。未提供时默认为所有受支持的外部 Beta 状态。

支持的值：

- `processing`
- `processing_exception`
- `missing_export_compliance`
- `ready_for_beta_testing`
- `in_beta_testing`
- `expired`
- `ready_for_beta_submission`
- `in_export_compliance_review`
- `waiting_for_beta_review`
- `in_beta_review`
- `beta_rejected`
- `beta_approved`

#### `on.app_store_connect.beta_feedback.types`

按类型过滤测试人员报告的 Beta 反馈。未提供时默认为所有受支持的 Beta 反馈类型。

支持的值：

- `crash`
- `screenshot`

所有过滤值必须为小写，并且区分大小写。

```yaml
# 在以下情况触发：
# - 应用版本进入审核，
# - 构建上传完成或失败，
# - 外部 Beta 构建已准备好测试或已获批准，
# - 测试人员通过 TestFlight 报告崩溃。
on:
  app_store_connect:
    app_version:
      states:
        - ready_for_review
        - waiting_for_review
    build_upload:
      states:
        - complete
        - failed
    external_beta:
      states:
        - ready_for_beta_testing
        - beta_approved
    beta_feedback:
      types:
        - crash
```

```yaml
# 在任何应用版本或构建上传状态变化时触发。
on:
  app_store_connect:
    app_version: {}
    build_upload: {}
```

### `on.schedule.cron`

使用 [unix-cron](https://www.ibm.com/docs/en/db2/11.5?topic=task-unix-cron-format) 语法按计划运行工作流。你可以使用 [crontab guru](https://crontab.guru/) 及其[示例](https://crontab.guru/examples.html)来生成 cron 字符串。

- 计划工作流只会在仓库的默认分支上运行。在许多情况下，这意味着 `main` 分支上工作流文件中的 cron 会被调度，而功能分支中工作流文件里的 cron 不会被调度。
- 计划工作流在高负载时段可能会延迟。高负载时段包括每小时开始的时候。在极少数情况下，作业可能会被跳过或运行多次。请确保你的工作流是幂等的，并且没有有害的副作用。
- 一个工作流可以有多个 `cron` 计划。
- 计划工作流在 GMT 时区运行。

```yaml
on:
  schedule:
    - cron: '0 0 * * *' # 每天 GMT 午夜运行
```

### `on.workflow_dispatch.inputs`

定义使用 `eas workflow:run` 命令手动触发工作流时可以提供的输入。这让你可以创建参数化工作流，每次运行时接受不同的值。

```yaml
on:
  workflow_dispatch:
    inputs:
      name:
        type: string
        required: false
        description: 'Name of the person to greet'
        default: 'World'
      choice_example:
        type: choice
        options:
          - to be
          - not to be
        required: true
```

| 属性 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `type` | `string` | 必需 | 输入类型（`string`、`boolean`、`number`、`choice` 或 `environment`）。 |
| `description` | `string` | 可选 | 输入的说明。 |
| `required` | `boolean` | 可选 | 输入是否必需。默认为 `false`。 |
| `default` | 视类型而定 | 可选 | 输入的默认值。必须与输入类型匹配。 |
| `options` | `string[]` | 必需（对于 `type: choice`） | choice 输入的可用选项。 |

#### 提供输入

运行带输入的工作流时，你可以用几种方式提供它们：

1. 命令行标志：

   ```sh
   eas workflow:run .eas/workflows/deploy.yml -F environment=production -F debug=true -F version=1.2.3
   ```

2. 通过 stdin 传入 JSON：

   ```sh
   echo '{"environment": "production", "debug": true, "version": "1.2.3"}' | eas workflow:run .eas/workflows/deploy.yml
   ```

3. 交互式提示：
   如果缺少必需输入，并且你没有使用 `--non-interactive`，CLI 会提示你输入它们：

   ```sh
   eas workflow:run .eas/workflows/deploy.yml
   ```

#### 用法

输入值可以通过 `${{ inputs.<input_name> }}` 语法在工作流作业中使用：

```yaml
on:
  workflow_dispatch:
    inputs:
      name:
        type: string
        required: true
        description: 'Name of the person to greet'

jobs:
  deploy:
    steps:
      - name: Deploy to environment
        run: |
          echo "Hello, ${{ inputs.name }}!"

          # 注意：你可以使用 `||` 为非 eas workflow:run 运行的工作流提供默认值。
          echo "Hello, ${{ inputs.name || 'World' }}!"
```

### `on.<trigger>.if`

触发器上的 `if` 条件决定工作流运行是否开始。

你可以在 `push`、`ref_delete`、`pull_request`、`pull_request_labeled`、`pull_request_comment`，以及每个 `app_store_connect` 事件域（`app_version`、`build_upload`、`external_beta` 或 `beta_feedback`）下添加 `if:`。

该值是布尔值或表达式字符串。你可以带或不带 `${{ }}` 包裹来写它。

```yaml
on:
  pull_request:
    if: ${{ !github.event.pull_request.draft }}
```

表达式必须放在一个 `${{ }}` 块中，并且最多 250 个字符。

当条件求值为 false 时，该触发事件不会启动工作流运行。对已有运行的重试会跳过此检查。它只在创建新运行时适用。

表达式可以使用 [`github`](#github)、[`app_store_connect`](#app_store_connect)、`inputs`、[`workflow`](#workflow)、`app` 和 `account` 上下文。它支持除 `success()`、`failure()` 和 `hashFiles()` 之外的所有[上下文函数](#context-functions)。那些函数需要一个已经运行过的作业或步骤，但触发器的 `if` 条件在任何作业开始之前求值。

```yaml
on:
  push:
    if: ${{ github.ref_name == 'main' }}
  pull_request_comment:
    if: ${{ startsWith(github.event.comment.body, '/deploy') }}
```

## `jobs`

一次工作流运行由一个或多个作业组成。

```yaml
jobs:
  job_1:
    # ...
  job_2:
    # ...
```

### `jobs.<job_id>`

每个作业必须有一个 ID。该 ID 在工作流内应当唯一，并且可以包含字母数字字符和下划线。例如，下面 YAML 中的 `my_job`：

```yaml
jobs:
  my_job:
    # ...
```

### `jobs.<job_id>.name`

显示在工作流详情页上的作业人类可读名称。

```yaml
jobs:
  my_job:
    name: Build app
```

### `jobs.<job_id>.environment`

为作业设置 [EAS 环境变量](/eas/environment-variables)的环境。有三个可能的值：

- `production`
- `preview`
- `development`

`environment` 键在所有作业上都可用。省略它时，默认值取决于作业类型：`build` 作业从 **eas.json** 中构建 profile 的 `environment` 推断它，`submit` 作业从被提交的构建继承它，`maestro` 和 `maestro-cloud` 作业默认为 `preview`，所有其他作业默认为 `production`。细节见[作业环境](/eas/workflows/environment#作业环境)。

```yaml
jobs:
  my_job:
    environment: production | preview | development
```

### `jobs.<job_id>.env`

为作业设置环境变量。该属性在所有运行于 VM 上的作业上可用（除预置的 `apple-device-registration-request`、`branch-delete`、`doc`、`get-build`、`github-comment`、`require-approval`、`slack` 和 `update-rollout` 作业之外的所有作业）。

```yaml
jobs:
  my_job:
    env:
      APP_VARIANT: staging
      RETRY_COUNT: 3
      PREV_JOB_OUTPUT: ${{ needs.previous_job.outputs.some_output }}
```

### `jobs.<job_id>.hooks`

以下预置作业支持钩子，以便在主要作业动作之前或之后运行额外步骤：`build`、`deploy`、`fingerprint`、`maestro`、`maestro-cloud`、`repack`、`submit`、`testflight` 和 `update`。钩子名称是作业特定的。可用的钩子键见该作业的文档。要为工作流中的所有作业设置默认钩子，使用 [`defaults.hooks`](#defaultshooks)。钩子步骤可以像作业步骤一样调用[自定义函数](/eas/workflows/custom-functions)。

```yaml
jobs:
  maestro_test:
    type: maestro-cloud
    params:
      build_id: ${{ needs.build.outputs.build_id }}
      maestro_project_id: proj_xyz
      flows: ./maestro/flows
    hooks:
      before_maestro_cloud:
        - run: echo "Before upload"
      after_maestro_cloud:
        - run: echo "After upload"
```

### `jobs.<job_id>.defaults.run.working_directory`

设置作业中所有步骤运行命令的目录。

```yaml
jobs:
  my_job:
    defaults:
      run:
        working_directory: ./my-app
    steps:
      - name: My first step
        run: pwd # 打印：/home/expo/workingdir/build/my-app
```

## `defaults`

用作工作流配置中所定义全部作业的默认值的参数。

### `defaults.hooks`

工作流中所有作业的默认[钩子](#jobsjob_idhooks)。每个作业运行适用于它的钩子键，并忽略其余的。作业级钩子键会覆盖 `defaults.hooks` 中的同一个键。要让单个作业退出某个默认钩子，把该键设为空数组。默认钩子步骤也可以调用[自定义函数](/eas/workflows/custom-functions)。

```yaml
defaults:
  hooks:
    before_install_node_modules:
      - name: Configure private registry
        run: echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" >> .npmrc

jobs:
  build_app:
    type: build
    params:
      platform: ios
  publish_update:
    type: update
    hooks:
      before_install_node_modules: [] # 让此作业退出默认钩子
```

### `defaults.image`

工作流中所有作业使用的默认 VM 镜像。推荐使用 `sdk-XX` 镜像标签。可用镜像见[基础设施](/build-reference/infrastructure)。单个作业可以用 [`jobs.<job_id>.image`](#jobsjob_idimage) 覆盖此值。

```yaml
defaults:
  image: sdk-57
```

### `defaults.run.working_directory`

运行脚本的默认工作目录。像 "./assets" 或 "assets" 这样的相对路径从应用的基目录解析。

### `defaults.tools`

此工作流配置中定义的作业应当使用的工具的特定版本。可用值请遵循每个工具的文档。

| 工具 | 说明 |
| --- | --- |
| `node` | 通过 `nvm` 安装的 Node.js 版本。 |
| `yarn` | 通过 `npm -g` 安装的 Yarn 版本。 |
| `corepack` | 如果设为 `true`，会在构建过程开始时启用 [corepack](https://github.com/nodejs/corepack#readme)。默认为 false。 |
| `pnpm` | 通过 `npm -g` 安装的 pnpm 版本。 |
| `bun` | 通过向 Bun 安装脚本传递 `bun-v$VERSION` 安装的 Bun 版本。 |
| `ndk` | 通过 `sdkmanager` 安装的 Android NDK 版本。 |
| `bundler` | 将传递给 `gem install -v` 的 Bundler 版本。 |
| `fastlane` | 将传递给 `gem install -v` 的 fastlane 版本。 |
| `cocoapods` | 将传递给 `gem install -v` 的 CocoaPods 版本。 |

使用 `defaults.tools` 的工作流示例：

```yaml .eas/workflows/publish-update.yml
name: Set up custom versions
defaults:
  tools:
    node: latest
    yarn: '2'
    corepack: true
    pnpm: '8'
    bun: '1.0.0'
    fastlane: 2.224.0
    cocoapods: 1.12.0

on:
  push:
    branches: ['*']

jobs:
  setup:
    steps:
      - name: Check Node version
        run: node --version # 应当打印一个具体版本，例如 23.9.0
      - name: Check Yarn version
        run: yarn --version # 应当打印一个具体版本，例如 2.4.3
```

## `concurrency`

并发控制的配置。目前只允许为同一分支的工作流设置 `cancel_in_progress`。

```yaml
concurrency:
  cancel_in_progress: true
  group: ${{ workflow.filename }}-${{ github.ref }}
```

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `cancel_in_progress` | `true` | 如果为 true，从 GitHub 启动的新工作流运行会取消同一分支上当前正在进行的运行。 |
| `group` | `string` | 我们尚不支持自定义并发组。设置此占位值，以便当我们支持自定义组时，你的工作流仍然兼容。 |

## 控制流

你可以用 `needs` 和 `after` 关键字控制作业何时运行。此外，你可以使用 `if` 关键字根据条件控制作业是否应当运行。

### `jobs.<job_id>.needs`

必须成功完成之后此作业才会运行的作业 ID 列表。

```yaml
jobs:
  test:
    steps:
      - uses: eas/checkout
      - uses: eas/use_npm_token
      - uses: eas/install_node_modules
      - name: tsc
        run: yarn tsc
  build:
    needs: [test] # 只有当 'test' 作业成功时，此作业才会运行
    type: build
    params:
      platform: ios
```

### `jobs.<job_id>.after`

必须完成（无论成功与否）之后此作业才会运行的作业 ID 列表。

```yaml
jobs:
  build:
    type: build
    params:
      platform: ios
  notify:
    after: [build] # 此作业会在 build 完成后运行（无论 build 成功还是失败）
```

### `jobs.<job_id>.if`

`if` 条件决定作业是否应当运行。当 `if` 条件满足时，作业会运行。当条件不满足时，作业会被跳过。被跳过的作业不会成功完成，任何在 `needs` 列表中包含此作业的下游作业都不会运行。

```yaml
jobs:
  my_job:
    if: ${{ github.ref_name == 'main' }}
```

<a id="interpolation"></a>

## 插值

你可以根据工作流运行的上下文，自定义工作流的行为——要执行的命令、控制流、环境变量、构建 profile、应用版本等等。

使用 `${{ expression }}` 语法访问上下文属性和函数。例如：`${{ github.ref_name }}` 或 `${{ needs.build_ios.outputs.build_id }}`。

### 上下文属性

以下属性在插值上下文中可用：

#### `after`

当前作业的 `after` 列表中指定的所有上游作业的记录。每个作业提供：

```json
{
  "status": "success" | "failure" | "skipped",
  /* 每个作业产生不同的一组输出。细节见特定作业的文档。 */
  "outputs": {}
}
```

示例：

```yaml
jobs:
  build:
    type: build
    params:
      platform: ios
  notify:
    after: [build]
    steps:
      - run: echo "Build status: ${{ after.build.status }}"
```

#### `needs`

当前作业的 `needs` 列表中指定的所有上游作业的记录。每个作业提供：

```json
{
  "status": "success" | "failure" | "skipped",
  /* 每个作业产生不同的一组输出。细节见特定作业的文档。 */
  "outputs": {}
}
```

大多数预置作业会暴露特定输出。你可以[在自定义作业中使用 `set-output` 函数设置输出](#jobsjob_idoutputs)。

示例：

```yaml
jobs:
  setup:
    outputs:
      date: ${{ steps.current_date.outputs.date }}
    steps:
      - id: current_date
        run: |
          DATE=$(date +"%Y.%-m.%-d")
          set-output date "$DATE"

  build_ios:
    needs: [setup]
    type: build
    env:
      # 你可以使用 process.env.VERSION_SUFFIX 在动态应用配置中自定义应用版本。
      VERSION_SUFFIX: ${{ needs.setup.outputs.date }}
    params:
      platform: ios
      profile: development
```

#### `steps`

当前作业中所有步骤的记录。每个步骤使用 [`set-output`](#set-output) 函数提供其输出。

:::note
`steps` 上下文只在作业的步骤内可用，而不是在工作流级别。要把步骤的输出暴露给其他作业，使用 [`set-output`](#set-output) 函数和[作业的 `outputs` 配置](#jobsjob_idoutputs)。
:::

示例：

```yaml
jobs:
  my_job:
    outputs:
      value: ${{ steps.step_1.outputs.value }}
    steps:
      - id: step_1
        run: set-output value "hello"
      - run: echo ${{ steps.step_1.outputs.value }}

  another_job:
    needs: [my_job]
    steps:
      - run: echo "Value: ${{ needs.my_job.outputs.value }}"
```

#### `inputs`

使用 [`workflow_dispatch`](#onworkflow_dispatchinputs) 手动触发工作流时提供的输入记录。当工作流通过带输入参数的 `eas workflow:run` 命令触发时可用。

示例：

```yaml
on:
  workflow_dispatch:
    inputs:
      name:
        type: string
        required: true

jobs:
  greet:
    steps:
      - run: echo "Hello, ${{ inputs.name }}!"
```

#### `github`

为了便于从 GitHub Actions 迁移到 EAS Workflows，我们暴露了一些你可能会觉得有用的上下文字段。

```ts
type GitHubContext = {
  triggering_actor?: string;
  event_name: 'pull_request' | 'push' | 'schedule' | 'workflow_dispatch';
  sha: string;
  ref: string; // 例如 refs/heads/main
  ref_name: string; // 例如 main
  ref_type: 'branch' | 'tag' | 'other';
  commit_message?: string; // 仅用于 push 和 schedule 事件
  label?: string;
  repository?: string;
  repository_owner?: string;
  event?: {
    action?: string;
    label?: {
      name: string;
    };
    // 仅用于 push 和 schedule 事件
    head_commit?: {
      message: string;
      id: string;
    };
    pull_request?: {
      number: number;
      title: string;
      body: string | null;
      state: 'open' | 'closed';
      draft: boolean;
      merged: boolean | null;
      // ... GitHub Pull Request webhook 载荷中的其他字段
    };
    comment?: {
      body: string;
      // ... GitHub issue_comment webhook 载荷中的其他字段
    };
    changes?: {
      base?: {
        ref?: {
          from: string;
        };
      };
    };
    number?: number;
    schedule?: string;
    inputs?: Record<string, string | number | boolean>;
  };
};
```

:::note
`event` 对象包含完整的 [GitHub webhook 载荷](https://docs.github.com/en/webhooks/webhook-events-and-payloads)。对于 `pull_request` 事件，`event.pull_request` 包含 GitHub Pull Request webhook 载荷中的字段，例如 `github.event.pull_request.title` 和 `github.event.pull_request.body`。对于已编辑的拉取请求事件，`github.event.changes` 包含发生变化的字段，例如基分支变化时的 `github.event.changes.base.ref.from`。对于 `pull_request_comment` 事件，`event.comment.body` 包含评论文本，`event.pull_request.number` 和 `event.number` 包含拉取请求编号。上面的类型列出了一些有用字段，但 `user`、`labels`、`milestone` 等其他字段也同样可用。
:::

如果工作流运行是从 `eas workflow:run` 启动的，其 `event_name` 将是 `workflow_dispatch`，其余所有属性都为空。

示例：

```yaml
jobs:
  build_ios:
    type: build
    if: ${{ github.ref_name == 'main' }}
    params:
      platform: ios
      profile: production
```

- [${{ github }} 上下文](https://github.com/expo/eas-cli/blob/main/packages/eas-build-job/src/common.ts)：查看 `${{ github }}` 定义的源代码。

#### `workflow`

关于当前工作流的信息。

```ts
type WorkflowContext = {
  id: string;
  name: string;
  filename: string;
  url: string;
};
```

示例：

```yaml
jobs:
  notify_slack:
    after: [...]
    type: slack
    params:
      message: |
        Workflow run completed: ${{ workflow.name }}
        View details: ${{ workflow.url }}
```

#### `app`

工作流所针对的 EAS 项目的信息。此上下文在每次工作流运行中都可用。

```ts
type AppContext = {
  id: string;
  slug: string;
};
```

示例：

```yaml
jobs:
  print_context:
    steps:
      - run: echo "Project ${{ app.slug }} (${{ app.id }})"
```

#### `account`

拥有该项目的账户的信息。此上下文在每次工作流运行中都可用。

```ts
type AccountContext = {
  id: string;
  name: string;
};
```

示例：

```yaml
jobs:
  print_context:
    steps:
      - run: echo "Account ${{ account.name }} (${{ account.id }})"
```

#### `app_store_connect`

与工作流运行关联的 App Store Connect 实体的信息。此上下文只对由 App Store Connect 事件触发的工作流可用。见 [`on.app_store_connect`](#onapp_store_connect)。

```ts
type AppStoreConnectContext = {
  app: {
    id: string;
  };
  build_upload?: {
    id: string;
    state: 'awaiting_upload' | 'processing' | 'failed' | 'complete';
    cf_bundle_version?: string;
    cf_bundle_short_version_string?: string;
    platform?: string;
    uploaded_date?: string;
    created_date?: string;
    build?: {
      id: string;
    };
  };
  app_version?: {
    id: string;
    state: string;
  };
  external_beta?: {
    id: string;
    state: string;
  };
  beta_feedback?: {
    id: string;
    type: 'crash' | 'screenshot';
    url: string;
  };
};
```

只有当工作流由 `build_upload` 事件域触发时，`app_store_connect.build_upload` 对象才会存在。

示例：

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
        Upload complete for App Store Connect app: ${{ app_store_connect.app.id }}
        Upload ID: ${{ app_store_connect.build_upload.id }}
        Upload state: ${{ app_store_connect.build_upload.state }}
        Version: ${{ app_store_connect.build_upload.cf_bundle_short_version_string }} (${{ app_store_connect.build_upload.cf_bundle_version }})
```

把 `build_upload.build.id` 用作 `testflight` 作业的 `asc_build_id`：

```yaml .eas/workflows/testflight-after-asc-upload.yml
name: Distribute to TestFlight after ASC upload

on:
  app_store_connect:
    build_upload:
      states:
        - complete

jobs:
  distribute_to_testflight:
    name: Distribute to TestFlight
    type: testflight
    params:
      asc_build_id: ${{ app_store_connect.build_upload.build.id }}
      internal_groups:
        - QA Team
      external_groups:
        - Public Beta
      changelog: |
        Build ${{ app_store_connect.build_upload.cf_bundle_version }} is ready for testing.
      submit_beta_review: true
```

#### `env`

当前作业上下文中可用的环境变量记录。

:::note
`env` 上下文只在作业的上下文中可用，而不是在工作流级别。
:::

示例：

```yaml
jobs:
  my_job:
    steps:
      - run: echo "API URL: ${{ env.API_URL }}"
```

<a id="context-functions"></a>

### 上下文函数

以下函数在插值上下文中可用：

#### `success()`

返回之前的所有作业是否都已成功。

```yaml
jobs:
  notify:
    if: ${{ success() }}
    steps:
      - run: echo "All jobs succeeded"
```

#### `failure()`

返回之前是否有任何作业失败。

```yaml
jobs:
  notify:
    if: ${{ failure() }}
    steps:
      - run: echo "A job failed"
```

#### `fromJSON(value)`

解析 JSON 字符串。等价于 `JSON.parse()`。

示例：

```yaml
jobs:
  publish_update:
    type: update

  print_debug_info:
    needs: [publish_update]
    steps:
      - run: |
          echo "First update group: ${{ needs.publish_update.outputs.first_update_group_id }}"
          echo "Second update group: ${{ fromJSON(needs.publish_update.outputs.updates_json || '[]')[1].group }}"
```

#### `toJSON(value)`

把值转换为 JSON 字符串。等价于 `JSON.stringify()`。

示例：

```yaml
jobs:
  my_job:
    steps:
      - run: echo '${{ toJSON(github.event) }}'
```

#### `contains(value, substring)`

检查 `value` 是否包含 `substring`。

示例：

```yaml
jobs:
  my_job:
    if: ${{ contains(github.ref_name, 'feature') }}
    steps:
      - run: echo "Feature branch"
```

#### `startsWith(value, prefix)`

检查 `value` 是否以 `prefix` 开头。

示例：

```yaml
jobs:
  my_job:
    if: ${{ startsWith(github.ref_name, 'release') }}
    steps:
      - run: echo "Release branch"
```

#### `endsWith(value, suffix)`

检查 `value` 是否以 `suffix` 结尾。

示例：

```yaml
jobs:
  my_job:
    if: ${{ endsWith(github.ref_name, '-production') }}
    steps:
      - run: echo "Production branch"
```

#### `hashFiles(...globs)`

返回匹配所提供 glob 模式的文件的哈希。对缓存键很有用。

:::note
`hashFiles` 函数只在作业的步骤内可用，而不是在工作流级别。
:::

示例：

```yaml
jobs:
  my_job:
    steps:
      - run: echo "Dependencies hash: ${{ hashFiles('package-lock.json', 'yarn.lock') }}"
```

#### `replaceAll(input, stringToReplace, replacementString)`

把 `input` 中所有出现的 `stringToReplace` 替换为 `replacementString`。

示例：

```yaml
jobs:
  my_job:
    steps:
      - run: echo "${{ replaceAll(github.ref_name, '/', '-') }}"
```

#### `substring(input, start, end)`

从 `input` 中提取从 `start` 开始、到 `end` 结束的子字符串。如果未提供 `end`，则从 `start` 提取到 `input` 的末尾。底层使用 [`String#substring`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring)。

示例：

```yaml
jobs:
  my_job:
    steps:
      - run: echo "${{ substring(github.ref_name, 0, 50) }}"
```

## 预置作业

### `jobs.<job_id>.type`

指定要运行的预置作业类型。预置作业会根据作业类型，在工作流详情页上生成专门的 UI。

```yaml
jobs:
  my_job:
    type: build
```

下面介绍不同的预置作业。

#### `build`

使用 [EAS Build](/build/introduction) 为项目创建 Android 或 iOS 构建。详细信息和示例见[构建作业文档](/eas/workflows/pre-packaged-jobs#build)。

```yaml
jobs:
  my_job:
    type: build
    params:
      platform: ios | android # 必需
      profile: string # 可选，默认：production
      message: string # 可选
      refresh_ad_hoc_provisioning_profile: boolean # 可选
    hooks:
      before_install_node_modules: step[] # 可选
      after_install_node_modules: step[] # 可选
```

此作业输出以下属性：

```json
{
  "build_id": string,
  "app_build_version": string | null,
  "app_identifier": string | null,
  "app_version": string | null,
  "channel": string | null,
  "distribution": "internal" | "store" | null,
  "fingerprint_hash": string | null,
  "git_commit_hash": string | null,
  "platform": "ios" | "android" | null,
  "profile": string | null,
  "runtime_version": string | null,
  "sdk_version": string | null,
  "simulator": "true" | "false" | null
}
```

#### `deploy`

使用 [EAS Hosting](/eas/hosting/introduction) 部署你的应用。详细信息和示例见[部署作业文档](/eas/workflows/pre-packaged-jobs#deploy)。

```yaml
jobs:
  my_job:
    type: deploy
    params:
      alias: string # 可选
      prod: boolean # 可选
      source_maps: boolean # 可选
    hooks:
      after_checkout: step[] # 可选
      before_install_node_modules: step[] # 可选
      after_install_node_modules: step[] # 可选
```

此作业输出以下属性：

```json
{
  "deploy_json": string, // 包含部署详情的 JSON 对象（`npx eas-cli deploy --json` 的输出）。
  "deploy_url": string, // 部署的 URL。如果这是生产部署，则使用生产 URL。否则使用第一个别名 URL 或部署 URL。
  "deploy_alias_url": string, // 部署的别名 URL（例如 `https://account-project--alias.expo.app`）。
  "deploy_deployment_url": string, // 部署的唯一 URL（例如 `https://account-project--uniqueid.expo.app`）。
  "deploy_identifier": string, // 部署的标识符。
  "deploy_dashboard_url": string, // 部署仪表盘的 URL（例如 `https://expo.dev/projects/[project]/hosting/deployments`）。
}
```

#### `fingerprint`

计算项目的指纹。详细信息和示例见[指纹作业文档](/eas/workflows/pre-packaged-jobs#fingerprint)。

```yaml
jobs:
  my_job:
    type: fingerprint
    environment: production # 应当与你的构建 profile 匹配
    hooks:
      after_checkout: step[] # 可选
      before_install_node_modules: step[] # 可选
      after_install_node_modules: step[] # 可选
```

此作业输出以下属性：

```json
{
  "android_fingerprint_hash": string,
  "ios_fingerprint_hash": string,
}
```

:::note
为了准确匹配指纹，请确保指纹作业的 `environment` 与你的构建 profile 匹配。考虑使用 [EAS 环境变量](/eas/environment-variables) 而不是 `env`，以便在作业之间获得更好的一致性。
:::

#### `get-build`

从 EAS 检索与所提供参数匹配的已有构建。详细信息和示例见[获取构建作业文档](/eas/workflows/pre-packaged-jobs#get-build)。

```yaml
jobs:
  my_job:
    type: get-build
    params:
      platform: ios | android # 可选
      profile: string # 可选
      distribution: store | internal | simulator # 可选
      channel: string # 可选
      app_identifier: string # 可选
      app_build_version: string # 可选
      app_version: string # 可选
      git_commit_hash: string # 可选
      fingerprint_hash: string # 可选
      sdk_version: string # 可选
      runtime_version: string # 可选
      simulator: boolean # 可选
      wait_for_in_progress: boolean # 可选
```

此作业输出以下属性：

```json
{
  "build_id": string,
  "app_build_version": string | null,
  "app_identifier": string | null,
  "app_version": string | null,
  "channel": string | null,
  "distribution": "internal" | "store" | null,
  "fingerprint_hash": string | null,
  "git_commit_hash": string | null,
  "platform": "ios" | "android" | null,
  "profile": string | null,
  "runtime_version": string | null,
  "sdk_version": string | null,
  "simulator": "true" | "false" | null
}
```

#### `submit`

使用 [EAS Submit](/deploy/submit-to-app-stores) 把 Android 或 iOS 构建提交到应用商店。详细信息和示例见[提交作业文档](/eas/workflows/pre-packaged-jobs#submit)。

```yaml
jobs:
  my_job:
    type: submit
    params:
      build_id: string # 必需
      profile: string # 可选，默认：production
      groups: string[] # 可选
    hooks:
      after_checkout: step[] # 可选
      before_install_node_modules: step[] # 可选
      after_install_node_modules: step[] # 可选
      before_submit: step[] # 可选
      after_submit: step[] # 可选
```

此作业输出以下属性：

```json
{
  "apple_app_id": string | null, // Apple App ID。https://expo.fyi/asc-app-id
  "ios_bundle_identifier": string | null, // 已提交构建的 iOS bundle identifier。https://expo.fyi/bundle-identifier
  "android_package_id": string | null // 已提交的 Android 包 ID。https://expo.fyi/android-package
}
```

#### `testflight`

把 iOS 构建分发到 TestFlight 内部和外部测试组。恰好提供 `build_id`（上传构建并提交到 TestFlight）或 `asc_build_id`（提交已上传的构建）之一。详细信息和示例见 [TestFlight 作业文档](/eas/workflows/pre-packaged-jobs#testflight)。

```yaml
jobs:
  my_job:
    type: testflight
    params:
      build_id: string # 上传并提交到 TestFlight 时必需；与 asc_build_id 互斥
      profile: string # 可选，默认：production；仅在上传并提交时
      wait_processing_timeout_seconds: number # 可选，默认：1800（30 分钟）；仅在一个作业中上传并提交时
      asc_build_id: string # 提交已上传的构建时必需；与 build_id 互斥
      internal_groups: string[] # 可选
      external_groups: string[] # 可选
      changelog: string # 可选
      submit_beta_review: boolean # 可选
    hooks: # 仅在使用 build_id 上传并提交时
      after_checkout: step[] # 可选
      before_install_node_modules: step[] # 可选
      after_install_node_modules: step[] # 可选
```

此作业输出以下属性，其中 `asc_build_id` 只在提交已上传的构建时设置：

```json
{
  "apple_app_id": string | null, // Apple App ID。https://expo.fyi/asc-app-id
  "ios_bundle_identifier": string | null, // 已提交构建的 iOS bundle identifier。https://expo.fyi/bundle-identifier
  "asc_build_id": string | null // App Store Connect 构建 ID。仅在提交已上传的构建时。
}
```

#### `update`

使用 [EAS Update](/eas-update/introduction) 发布更新。详细信息和示例见[更新作业文档](/eas/workflows/pre-packaged-jobs#update)。

```yaml
jobs:
  my_job:
    type: update
    params:
      message: string # 可选
      platform: string # 可选 - android | ios | all，默认为 all
      branch: string # 可选
      channel: string # 可选 - 不能与 branch 一起使用
      rollout_percentage: number # 可选 - 0 到 100，默认为 100
      private_key_path: string # 可选
      upload_sentry_sourcemaps: boolean # 可选 - 默认为“尝试上传，但如果失败不要让作业失败”
    hooks:
      after_checkout: step[] # 可选
      before_install_node_modules: step[] # 可选
      after_install_node_modules: step[] # 可选
      before_update: step[] # 可选
      after_update: step[] # 可选
```

此作业输出以下属性：

```json
{
  "first_update_group_id": string, // 第一个更新组的 ID。你可以用它来构造开发客户端深层链接的更新 URL。
  "updates_json": string // 更新组的字符串化 JSON 数组。`eas update --json` 的输出。
}
```

#### `update-rollout`

提高正在进行的 EAS Update 发布的发布百分比。详细信息和示例见[更新发布作业文档](/eas/workflows/pre-packaged-jobs#update-rollout)。

```yaml
jobs:
  my_job:
    type: update-rollout
    params:
      update_group_id: string # 必需
      rollout_percentage: number # 可选 - 0 到 100，默认为 100
```

此作业输出以下属性：

```json
{
  "update_group_id": string, // 被发布的更新组的 ID。
  "rollout_percentage": string, // 应用到该更新组的发布百分比。
  "updates_json": string // 该组中更新的字符串化 JSON 数组。
}
```

#### `branch-delete`

删除一个 EAS Update 分支及其所有更新。详细信息和示例见[分支删除作业文档](/eas/workflows/pre-packaged-jobs#branch-delete)。

```yaml
jobs:
  my_job:
    type: branch-delete
    params:
      branch_name: string # 必需
      fail_on_missing: boolean # 可选，默认：false
```

此作业输出以下属性：

```json
{
  "branch_id": string | null,
  "branch_name": string
}
```

#### `maestro`

在构建上运行 [Maestro](https://maestro.dev/) 测试。详细信息和示例见 [Maestro 作业文档](/eas/workflows/pre-packaged-jobs#maestro)。

:::warning
Maestro 测试处于 [Alpha](/more/release-statuses#alpha)。
:::

```yaml
jobs:
  my_job:
    type: maestro
    environment: production | preview | development # 可选，默认为 preview
    image: string # 可选。可用镜像列表见 /build-reference/infrastructure。
    runs_on: string # 可选。Android 模拟器测试请使用 linux-*-nested-virtualization worker。可用选项见 #jobsjob_idruns_on。
    params:
      build_id: string # 必需
      flow_path: string | string[] # 必需
      shards: number # 可选，默认为 1
      retries: number # 可选，默认为 0
      retry_failed_only: boolean # 可选，默认为 true。为 true 时，重试会在适用时只尝试重新运行上一次失败的流程。
      record_screen: boolean # 可选，默认为 false。如果为 true，上传测试的屏幕录制。
      include_tags: string | string[] # 可选。要包含在测试中的标签。将作为 `--include-tags` 传给 Maestro。
      exclude_tags: string | string[] # 可选。要从测试中排除的标签。将作为 `--exclude-tags` 传给 Maestro。
      maestro_version: string # 可选。用于测试的 Maestro 版本。如果未提供，将使用最新版本。
      android_system_image_package: string # 可选。要使用的 Android 模拟器系统镜像包。
      device_identifier: string | { android?: string, ios?: string } # 可选。用于测试的设备标识符。
      output_format: string # 可选，默认为 junit。Maestro 测试报告格式。将作为 `--format` 传给 Maestro。可以是 `junit` 或其他受支持的格式。
      skip_build_check: boolean # 可选，默认为 false。跳过构建校验（iOS 构建是否为模拟器构建）。
    hooks:
      after_checkout: step[] # 可选
      before_maestro_tests: step[] # 可选
      after_maestro_tests: step[] # 可选
```

#### `maestro-cloud`

在 [Maestro Cloud](https://docs.maestro.dev/maestro-cloud/run-tests-on-maestro-cloud) 中对构建运行 [Maestro](https://maestro.dev/) 测试。详细信息和示例见 [Maestro Cloud 作业文档](/eas/workflows/pre-packaged-jobs#maestro-cloud)。

:::warning
在 Maestro Cloud 中运行测试需要 Maestro Cloud 账户和 Cloud Plan 订阅。前往 [Maestro 文档](https://docs.maestro.dev/maestro-cloud/run-tests-on-maestro-cloud)了解更多。
:::

```yaml
jobs:
  my_job:
    type: maestro-cloud
    environment: production | preview | development # 可选，默认为 preview
    image: string # 可选。可用镜像列表见 /build-reference/infrastructure。
    params:
      build_id: string # 必需。要测试的构建 ID。
      maestro_project_id: string # 必需。Maestro Cloud 项目 ID。示例：`proj_01jw6hxgmdffrbye9fqn0pyzm0`。
      flows: string # 必需。要运行的 Maestro 流程文件或包含流程的目录的路径。对应 `maestro cloud` 的 `--flows` 参数。
      maestro_api_key: string # 可选。用于 Maestro 项目的 API 密钥。默认使用 `MAESTRO_CLOUD_API_KEY` 环境变量。对应 `maestro cloud` 的 `--api-key` 参数。
      include_tags: string | string[] # 可选。要包含在测试中的标签。将作为 `--include-tags` 传给 Maestro。
      exclude_tags: string | string[] # 可选。要从测试中排除的标签。将作为 `--exclude-tags` 传给 Maestro。
      maestro_version: string # 可选。用于测试的 Maestro 版本。如果未提供，将使用最新版本。
      maestro_config: string # 可选。用于测试的 Maestro `config.yaml` 文件路径。将作为 `--config` 传给 Maestro。
      device_locale: string # 可选。用于测试的设备区域设置。将作为 `--device-locale` 传给 Maestro。
      device_model: string # 可选。用于测试的设备型号。将作为 `--device-model` 传给 Maestro。运行 `maestro list-cloud-devices` 查看受支持的值。
      device_os: string # 可选。用于测试的设备操作系统。将作为 `--device-os` 传给 Maestro。运行 `maestro list-cloud-devices` 查看受支持的值。
      skip_build_check: boolean # 可选，默认为 false。跳过构建校验（iOS 构建是否为模拟器构建）。
      name: string # 可选。Maestro Cloud 上传的名称。对应 `maestro cloud` 的 `--name` 参数。
      branch: string # 可选。Maestro Cloud 上传来源分支的覆盖值。默认情况下，如果工作流运行由 GitHub 触发，将使用工作流运行的分支。对应 `maestro cloud` 的 `--branch` 参数。
      async: boolean # 可选。异步运行 Maestro Cloud 测试。如果为 true，作业状态只表示上传是否成功，而不表示测试是否成功。对应 `maestro cloud` 的 `--async` 参数。
    hooks:
      after_checkout: step[] # 可选。作业检出项目之后运行的步骤。
      before_maestro_cloud: step[] # 可选。Maestro Cloud 上传之前运行的步骤。
      after_maestro_cloud: step[] # 可选。Maestro Cloud 上传之后运行的步骤。
```

#### `slack`

使用 webhook URL 向 Slack 频道发送消息。详细信息和示例见 [Slack 作业文档](/eas/workflows/pre-packaged-jobs#slack)。

```yaml
jobs:
  my_job:
    type: slack
    params:
      webhook_url: string # 必需
      message: string # 如果未提供 payload 则必需
      payload: object # 如果未提供 message 则必需
```

#### `github-comment`

自动把工作流已完成的构建、更新和部署的综合报告发布到 GitHub 拉取请求，或发布你提供的内容。详细信息和示例见 [GitHub Comment 作业文档](/eas/workflows/pre-packaged-jobs#github-comment)。

```yaml
jobs:
  my_job:
    type: github-comment
    params:
      message: string # 可选 - 要包含在报告中的自定义消息
      build_ids: string[] # 可选 - 要包含的特定构建 ID，默认为与正在运行的工作流相关的全部
      update_group_ids: string[] # 可选 - 要包含的特定更新组 ID，默认为与工作流相关的全部
      deployment_ids: string[] # 可选 - 要包含的特定部署 ID，默认为与工作流相关的全部

  # 除了使用 message 以及构建、更新和部署表格，你也可以用 payload 覆盖评论内容
  custom_github_comment:
    type: github-comment
    params:
      payload: string # 可选 - 用于完全自定义评论的原始 markdown/HTML 内容
```

此作业输出以下属性：

```json
{
  "comment_url": string | undefined  // 已发布的 GitHub 评论的 URL
}
```

#### `apple-device-registration-request`

暂停工作流，直到一台 iOS 设备登记到某个 Apple 团队并且团队成员批准该登记。详细信息和示例见 [Apple 设备登记请求作业文档](/eas/workflows/pre-packaged-jobs#apple-device-registration-request)。

```yaml
jobs:
  register_device:
    type: apple-device-registration-request
    params:
      apple_team_identifier: string # 可选
```

#### `require-approval`

在继续工作流之前需要用户批准。用户可以批准或拒绝，这会转化为作业的成功或失败。详细信息和示例见[需要批准作业文档](/eas/workflows/pre-packaged-jobs#require-approval)。

```yaml
jobs:
  confirm:
    type: require-approval
```

#### `doc`

在工作流日志中显示一个 Markdown 部分。详细信息和示例见 [Doc 作业文档](/eas/workflows/pre-packaged-jobs#doc)。

```yaml
jobs:
  next_steps:
    type: doc
    params:
      md: string
```

#### `repack`

从已有构建重新打包应用。此作业重新打包应用的元数据和 JavaScript bundle，而不执行完整的原生重新构建，这对于创建与特定指纹兼容的更快构建很有用。详细信息和示例见 [Repack 作业文档](/eas/workflows/pre-packaged-jobs#repack)。

```yaml
jobs:
  next_steps:
    type: repack
    params:
      build_id: string # 必需
      profile: string # 可选
      embed_bundle_assets: boolean # 可选
      js_bundle_only: boolean # 可选
      ios_signing_use_source_app_entitlements: boolean # 可选
      ios_signing_app_entitlements_path: string # 可选
      message: string # 可选
      repack_version: string # 可选
      repack_package: string # 可选
    hooks:
      after_checkout: step[] # 可选
      before_install_node_modules: step[] # 可选
      after_install_node_modules: step[] # 可选
```

<a id="custom-jobs"></a>

## 自定义作业

运行自定义代码，并且可以使用内置的 EAS 函数。不需要 `type` 字段。

```yaml
jobs:
  my_job:
    steps:
      # ...
```

### `jobs.<job_id>.steps`

作业包含一系列称为 `steps` 的任务。步骤可以运行命令。`steps` 只能在自定义作业和 `build` 作业中提供。

```yaml
jobs:
  my_job:
    steps:
      - name: My first step
        run: echo "Hello World"
```

### `jobs.<job_id>.outputs`

作业定义的输出列表。这些输出可供所有依赖此作业的下游作业访问。要设置输出，在作业步骤内使用 [`set-output`](#set-output) 函数。

下游作业可以在[插值上下文](#插值)中使用以下表达式访问这些输出：

- `needs.<job_id>.outputs.<output_name>`
- `after.<job_id>.outputs.<output_name>`

这里，`<job_id>` 指上游作业的标识符，`<output_name>` 指你想访问的特定输出变量。

在下面的示例中，`set-output` 函数在 `job_1` 的 `step_1` 步骤中把名为 `test` 的输出设置为值 `hello world`。稍后在 `job_2` 中，它在 `step_2` 里通过 `needs.job_1.outputs.output_1` 被访问。

```yaml
jobs:
  job_1:
    outputs:
      output_1: ${{ steps.step_1.outputs.test }}
    steps:
      - id: step_1
        run: set-output test "hello world"
  job_2:
    needs: [job_1]
    steps:
      - id: step_2
        run: echo ${{ needs.job_1.outputs.output_1 }}
```

### `jobs.<job_id>.image`

指定作业使用的 VM 镜像。可用镜像见[基础设施](/build-reference/infrastructure)。

```yaml
jobs:
  my_job:
    image: auto | string # 可选，默认为 'auto'
```

### `jobs.<job_id>.runs_on`

指定将执行作业的 worker。在自定义作业以及 `build`、`maestro`、`maestro-cloud` 和 `repack` 预置作业上可用。

```yaml
jobs:
  my_job:
    runs_on: linux-medium | linux-large |
      linux-medium-nested-virtualization |
      linux-large-nested-virtualization |
      macos-medium | macos-large # 可选，默认为 linux-medium
```

| Worker | vCPU | 内存（GiB RAM） | SSD（GiB） | 说明 |
| --- | --- | --- | --- | --- |
| linux-medium | 4 | 16 | 14 | 默认 worker。 |
| linux-large | 8 | 32 | 28 | |
| linux-medium-nested-virtualization | 4 | 16 | 14 | 允许运行 Android 模拟器。 |
| linux-large-nested-virtualization | 4 | 32 | 28 | 允许运行 Android 模拟器。 |

| Worker | 能效核心 | 统一内存（GiB RAM） | SSD（GiB） | 说明 |
| --- | --- | --- | --- | --- |
| macos-medium | 5 | 20 | 125 | 运行 iOS 作业，包括模拟器。 |
| macos-large | 10 | 40 | 125 | 运行 iOS 作业，包括模拟器。 |

:::note
对于 Android 模拟器作业，你必须使用 `linux-*-nested-virtualization` worker。对于 iOS 构建和 iOS 模拟器作业，你必须使用 `macos-*` worker。
:::

### `jobs.<job_id>.steps.<step>.id`

`id` 属性用于在作业中引用该步骤。对于在下游作业中使用该步骤的输出很有用。

```yaml
jobs:
  my_job:
    outputs:
      test: ${{ steps.step_1.outputs.test }} # 引用 step_1 的输出
    steps:
      - id: step_1
        run: set-output test "hello world"
```

### `jobs.<job_id>.steps.<step>.name`

步骤的人类可读名称，显示在作业日志中。未提供步骤名称时，使用 `run` 命令作为步骤名称。

```yaml
jobs:
  my_job:
    steps:
      - name: My first step
        run: echo "Hello World"
```

### `jobs.<job_id>.steps.<step>.run`

步骤中要运行的 shell 命令。

```yaml
jobs:
  my_job:
    steps:
      - run: echo "Hello World"
```

### `jobs.<job_id>.steps.<step>.shell`

用于运行命令的 shell。默认为 `bash`。

```yaml
jobs:
  my_job:
    steps:
      - run: echo "Hello World"
        shell: bash
```

### `jobs.<job_id>.steps.<step>.working_directory`

运行命令的目录。在步骤级别定义时，如果作业上也定义了 `jobs.<job_id>.defaults.run.working_directory`，它会覆盖该设置。

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - run: pwd # 打印：/home/expo/workingdir/build/my-app
        working_directory: ./my-app
```

### `jobs.<job_id>.steps.<step>.uses`

EAS 提供一组可在工作流步骤中使用的内置可复用函数。`uses` 关键字用于指定要使用的函数。所有内置函数都以 `eas/` 前缀开头。

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - uses: eas/prebuild
      - name: List files
        run: ls -la
```

你可以在项目中定义可复用的步骤序列，并用以 `./` 或 `../` 开头的路径调用它们，例如 `./.eas/functions/setup`。见[自定义函数 schema](#自定义函数)以及[在 EAS Workflows 中使用自定义函数](/eas/workflows/custom-functions)指南。

下面是你可以在工作流步骤中使用的内置函数列表。

#### `eas/checkout`

检出你的项目源文件。

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
```

对于使用基于 Git 的项目源的作业，该步骤默认使用作业记录的提交。使用 `ref` 检出不同的分支、标签或提交：

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
        with:
          ref: feature/add-icon
```

`ref` 接受：

- 分支，可以是裸名称（例如 `feature/add-icon`）或限定 ref（例如 `refs/heads/feature/add-icon`）。仓库最终会位于该分支上。
- 标签，作为限定 ref，例如 `refs/tags/v1.2.3`。仓库最终会位于分离的 `HEAD` 上。
- 完整的提交 SHA。仓库最终会位于分离的 `HEAD` 上。

该步骤从源仓库的 `origin` 执行浅获取（`--depth 1`），因此该 ref 必须在那里可达。

`ref` 只在项目源来自 Git 仓库时有效，例如通过 GitHub 集成触发的作业。本地构建和上传的项目压缩包不支持它。在作业的第一个 `eas/checkout` 步骤上设置 `ref`。在后续步骤上设置它会失败，因为项目已经被检出。

| 属性 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `ref` | `string` | 可选 | 要检出的 Git 分支、标签或完整提交 SHA。默认为触发构建或工作流作业的 ref。 |

- [eas/checkout 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/checkout.ts)：在 GitHub 上查看 eas/checkout 函数的源代码。

#### `eas/install_node_modules`

使用根据你的项目检测到的包管理器（bun、npm、pnpm 或 Yarn）安装 node_modules。适用于 Monorepo。

```yaml example.yml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
```

- [eas/install_node_modules 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/installNodeModules.ts)：在 GitHub 上查看 eas/install_node_modules 函数的源代码。

#### `eas/download_build`

下载给定构建的应用归档。默认情况下，下载的产物可以是 **.apk**、**.aab**、**.ipa** 或 **.app** 文件，或包含其中一个或多个文件的 **.tar.gz** 归档。如果产物是 **.tar.gz** 归档，它会被解压，并返回第一个匹配指定扩展名的文件。如果构建没有产生应用归档，该步骤会失败。

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/download_build
        with:
          build_id: string # 必需。要下载的构建 ID。
          extensions: [apk, aab, ipa, app] # 可选。要查找的文件扩展名列表。默认为 ["apk", "aab", "ipa", "app"]。
```

| 属性 | 类型 | 是否必需 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `build_id` | string | 必需 | – | 要下载的构建 ID。必须是有效的 UUID。 |
| `extensions` | string[] | 可选 | `["apk", "aab", "ipa", "app"]` | 在下载的产物或归档中查找的文件扩展名列表。 |

##### 输出

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `artifact_path` | string | 匹配的应用归档的绝对路径。此输出可以用作其他步骤的输入。例如，进一步上传或处理该产物。 |

- [eas/download_build 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/downloadBuild.ts)：在 GitHub 上查看 eas/download_build 函数的源代码。

用法示例：

```yaml
jobs:
  build_ios:
    type: build
    params:
      platform: ios
      profile: production

  my_job:
    needs: [build_ios]
    steps:
      - uses: eas/download_build
        id: download_build
        with:
          build_id: ${{ needs.build_ios.outputs.build_id }}
      - name: Print artifact path
        run: |
          echo "Artifact path: ${{ steps.download_build.outputs.artifact_path }}"
```

#### `eas/prebuild`

使用根据你的项目检测到的包管理器（bun、npm、pnpm 或 Yarn），以最适合你的构建类型和构建环境的命令运行 `expo prebuild`。

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - uses: eas/prebuild
```

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - uses: eas/resolve_apple_team_id_from_credentials
        id: resolve_apple_team_id_from_credentials
      - uses: eas/prebuild
        with:
          clean: false
          apple_team_id: ${{ steps.resolve_apple_team_id_from_credentials.outputs.apple_team_id }}
```

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `clean` | `boolean` | 可选属性，定义函数运行命令时是否应当使用 `--clean` 标志。默认为 false。 |
| `apple_team_id` | `string` | 可选属性，定义预构建时应当使用的 Apple 团队 ID。使用凭据的 iOS 构建应当指定它。 |

- [eas/prebuild 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/prebuild.ts)：在 GitHub 上查看 eas/prebuild 函数的源代码。

#### `eas/restore_cache`

从指定的键恢复先前保存的缓存。这对于通过复用缓存产物（例如已编译的依赖、构建工具或其他中间构建输出）来加快构建很有用。

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - uses: eas/prebuild
      - uses: eas/restore_cache
        with:
          key: cache-${{ hashFiles('package-lock.json') }}
          restore_keys: cache
          path: /path/to/cache
```

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - uses: eas/prebuild
      - uses: eas/restore_cache
        with:
          key: cache-${{ hashFiles('package-lock.json') }}
          path: /path/to/cache
```

| 属性 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `key` | `string` | 必需 | 要恢复的缓存键。你可以使用像 `${{ hashFiles('package-lock.json') }}` 这样的表达式，基于文件哈希创建动态键。 |
| `restore_keys` | `string` | 可选 | 当找不到精确键时使用的回退键或前缀。如果提供，缓存系统会查找任何以此前缀开头的缓存条目。 |
| `path` | `string` | 必需 | 应当恢复缓存的路径。这应当与保存缓存时使用的路径匹配。 |

- [eas/restore_cache 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/restoreCache.ts)：在 GitHub 上查看 eas/restore_cache 函数的源代码。

#### `eas/save_cache`

把缓存保存到指定的键。这让你可以持久化构建产物、已编译的依赖或其他中间输出，以便在后续构建中复用，从而加快构建过程。

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - uses: eas/prebuild
      - uses: eas/restore_cache
        with:
          key: cache-${{ hashFiles('package-lock.json') }}
          path: /path/to/cache
      - name: Build Android app
        run: cd android && ./gradlew assembleRelease
      - uses: eas/save_cache
        with:
          key: cache-${{ hashFiles('package-lock.json') }}
          path: /path/to/cache
```

| 属性 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `key` | `string` | 必需 | 保存缓存所用的缓存键。你可以使用像 `${{ hashFiles('package-lock.json') }}` 这样的表达式，基于文件哈希创建动态键。这应当与恢复缓存时使用的键匹配。 |
| `path` | `string` | 必需 | 应当被缓存的目录或文件的路径。这应当与恢复缓存时使用的路径匹配。 |

- [eas/save_cache 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/saveCache.ts)：在 GitHub 上查看 eas/save_cache 函数的源代码。

#### `eas/send_slack_message`

向已配置的 [Slack webhook URL](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks) 发送指定消息，然后由它发布到相关的 Slack 频道。消息可以指定为纯文本，或指定为 [Slack Block Kit](https://docs.slack.dev/block-kit) 消息。

你可以在消息中引用构建作业属性并[使用其他步骤的输出](#jobsjob_idoutputs)进行动态求值。例如，`Build URL: https://expo.dev/builds/${{ needs.build_ios.outputs.build_id }}`，`Build finished with status: ${{ after.build_android.status }}`。

必须指定 `message` 或 `payload` 之一，但不能同时指定两者。

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/send_slack_message
        with:
          message: 'This is a message sent to a Slack channel'
          slack_hook_url: ${{ env.ANOTHER_SLACK_HOOK_URL }}
```

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `message` | `string` | 你想发送的消息文本。例如 `'This is the content of the message'`。必须提供 `message` 或 `payload` 之一，但不能同时提供两者。 |
| `payload` | `json` | 你想发送的消息内容，使用 [Slack Block Kit](https://docs.slack.dev/block-kit) 布局定义。必须提供 `message` 或 `payload` 之一，但不能同时提供两者。 |
| `slack_hook_url` | `string` | 先前配置的 Slack webhook URL，它会把你的消息发布到指定频道。使用 [EAS 环境变量](/eas/environment-variables/manage#管理环境变量)提供它，例如 `slack_hook_url: ${{ env.ANOTHER_SLACK_HOOK_URL }}`，或设置 `SLACK_HOOK_URL` 环境变量，它将作为默认 webhook URL（在后一种情况下，不需要提供 `slack_hook_url` 属性）。 |

- [eas/send_slack_message 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/sendSlackMessage.ts)：在 GitHub 上查看 eas/send_slack_message 函数的源代码。

#### `eas/use_npm_token`

为使用私有包配置 Node 包管理器（bun、npm、pnpm 或 Yarn），这些包可以发布到 npm 或私有 registry。

在项目的密钥中设置 `NPM_TOKEN`，此函数会通过创建带有该令牌的 **.npmrc** 来配置构建环境。

```yaml example.yml
jobs:
  my_job:
    name: Install private npm modules
    steps:
      - uses: eas/checkout
      - uses: eas/use_npm_token
      - name: Install dependencies
        run: npm install # 现在可以安装私有包
```

- [eas/use_npm_token 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/useNpmToken.ts)：在 GitHub 上查看 eas/use_npm_token 函数的源代码。

#### `eas/upload_artifact`

把作业工作区中的文件作为附加到工作流运行的产物上传。上传的产物出现在该次运行的 **Artifacts** 部分，并且可以在后续作业中用 [`eas/download_artifact`](#easdownload_artifact) 取回。

:::note
在自定义（非构建）作业中，设置 `type: other` 以上传通用产物。`application-archive` 和 `build-artifact` 类型保留给构建作业——在自定义作业中使用它们会失败，错误类似于 `Uploading application archives outside of builds is not supported`。
:::

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/checkout
      - name: Run tests
        run: ./scripts/run-tests.sh # 把结果写入 ./results
      # 上传上一步产生的任何内容。
      - uses: eas/upload_artifact
        # `if: always()` 即使上一步失败也会上传结果。
        if: ${{ always() }}
        with:
          type: other
          name: test-results
          path: |
            results/**/*
```

##### 属性

| 属性 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `path` | string | 必需 | 要上传的路径，或换行分隔的路径列表。支持 `*` 和其他 [glob 模式](https://github.com/isaacs/node-glob#glob-primer)。 |
| `type` | string | 可选 | 产物类型。在自定义作业中使用 `other`（通用产物）。当作业没有构建平台时默认为 `other`，在构建作业中默认为 `application-archive`。限定于构建的值 `application-archive` 和 `build-artifact` 只在构建作业中有效。 |
| `name` | string | 可选 | 产物的名称，用于从 [`eas/download_artifact`](#easdownload_artifact) 引用它。 |
| `metadata` | json | 可选 | 附加到通用（`other`）产物的任意元数据。 |
| `ignore_error` | boolean | 可选 | 为 `true` 时，上传失败会被记录，但不会让步骤失败。默认为 `false`。 |

##### 输出

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `artifact_id` | string | 已上传产物的 ID。可以传给 [`eas/download_artifact`](#easdownload_artifact)。 |

- [eas/upload_artifact 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/uploadArtifact.ts)：在 GitHub 上查看 eas/upload_artifact 函数的源代码。

#### `eas/download_artifact`

根据产物的 ID 或名称从 EAS 下载产物。对于把先前作业的产物发送到其他服务很有用。

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/download_artifact
        with:
          name: string # 如果未提供 artifact_id 则必需。要下载的产物名称。
          artifact_id: string # 如果未提供 artifact_name 则必需。要下载的产物 ID。
```

##### 属性

| 属性 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `name` | string | 可选 | 要下载的产物名称。如果未提供 `artifact_id` 则必需。 |
| `artifact_id` | string | 可选 | 要下载的产物 ID。如果未提供 `name` 则必需。 |

##### 输出

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `artifact_path` | string | 已下载产物的路径。此输出可以用作工作流中其他步骤的输入。例如，发送或处理该产物。 |

- [eas/download_artifact 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/downloadArtifact.ts)：在 GitHub 上查看 eas/download_artifact 函数的源代码。

##### 示例

```yaml
jobs:
  maestro_tests:
    type: maestro
    params:
      build_id: '123-abc'
      flow_path: 'path/to/flow.yaml'
  my_job:
    needs: [maestro_tests]
    steps:
      - uses: eas/download_artifact
        id: download_artifact
        with:
          name: 'iOS Maestro Test Report (junit)'
      - name: Print Maestro output
        run: echo ${{ steps.download_artifact.outputs.artifact_path }}
```

以下函数把你的工作流连接到 [PostHog](/guides/using-posthog)。运行 `eas integrations:posthog:connect` 以关联一个 PostHog 项目，并设置这些函数读取的环境变量。`eas/posthog_capture_event` 使用你的公开项目 API 密钥，而其他函数使用带有各自注明权限范围的 PostHog 个人 API 密钥。设置见[使用 PostHog](/guides/using-posthog)，完整工作流见 [EAS Workflows 的 PostHog 配方](/guides/using-posthog/recipes)。

#### `eas/posthog_capture_event`

向 [PostHog](https://posthog.com/) 发送分析事件。用它在 PostHog 时间线上标记构建、发布和其他里程碑。

当你不提供 `distinct_id` 时，事件会匿名发送，并且不会创建 PostHog [人员资料](https://posthog.com/docs/data/persons)，从而使工作流事件不进入你的人员列表。

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/posthog_capture_event
        with:
          event: ota_update_published
          properties:
            branch: main
```

##### 属性

| 属性 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `event` | string | 必需 | 要发送的事件名称。 |
| `distinct_id` | string | 可选 | 要把事件归属到的人员。省略时，事件匿名发送，并且不会创建人员资料。 |
| `properties` | json | 可选 | 附加到事件的属性。 |
| `api_key` | string | 可选 | PostHog 项目 API 密钥。默认为由 `eas integrations:posthog:connect` 设置的 `EXPO_PUBLIC_POSTHOG_API_KEY` 环境变量，如果未设置则回退到 `POSTHOG_API_KEY`。 |
| `host` | string | 可选 | PostHog 主机。默认为 `EXPO_PUBLIC_POSTHOG_HOST` 环境变量，或 `https://us.posthog.com`。 |
| `ignore_error` | boolean | 可选 | 为 `true` 时，发送事件失败会被记录，但不会让步骤失败。默认为 `false`。 |

- [eas/posthog_capture_event 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/capturePosthogEvent.ts)：在 GitHub 上查看 eas/posthog_capture_event 函数的源代码。

#### `eas/posthog_flag_rollout`

启用、禁用或发布一个 [PostHog 功能标志](https://posthog.com/docs/feature-flags)。该函数按键查找标志，然后更新它。至少提供 `active`、`rollout_percentage` 或 `payload` 之一。

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/posthog_flag_rollout
        with:
          flag: new-checkout
          rollout_percentage: 25
```

##### 属性

| 属性 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `flag` | string | 必需 | 要更新的功能标志的键。 |
| `active` | boolean | 可选 | 标志是否启用。 |
| `rollout_percentage` | number | 可选 | 标志发布到的用户百分比，为从 `0` 到 `100` 的整数。函数把它应用到标志的兜底发布条件，并保留其他条件。当标志没有兜底条件时，函数把它应用到第一个条件。 |
| `payload` | json | 可选 | 附加到标志的载荷。 |
| `variant` | string | 可选 | 在多变量标志上存储 `payload` 所用的变体键。默认为标志的 `true` 载荷。 |
| `api_key` | string | 可选 | PostHog 个人 API 密钥。默认为 `POSTHOG_CLI_API_KEY` 环境变量。需要 `feature_flag:read` 和 `feature_flag:write` 权限范围。 |
| `project_id` | string | 可选 | PostHog 项目 ID。默认为 `POSTHOG_CLI_PROJECT_ID` 环境变量。 |
| `ignore_error` | boolean | 可选 | 为 `true` 时，网络错误、缺失的标志或意外响应会被记录，但不会让步骤失败。默认为 `false`。权限错误，或无效输入（例如超出范围的 `rollout_percentage`），始终会让步骤失败。 |

- [eas/posthog_flag_rollout 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/rolloutPosthogFlag.ts)：在 GitHub 上查看 eas/posthog_flag_rollout 函数的源代码。

#### `eas/posthog_wait_for_metric`

暂停工作流，直到一条 [HogQL](https://posthog.com/docs/hogql) 查询返回满足比较条件的数字。用它根据指标把关一次发布，例如一直等到最近几分钟的错误计数保持较低。

该函数每 `interval_seconds` 运行一次查询，直到比较为真或 `timeout_seconds` 耗尽。无法读取的查询（例如无效的 HogQL）会立即让步骤失败，而瞬时错误会重试直到超时。

:::note
此步骤没有 `ignore_error` 输入。超时或无法读取的查询始终会让步骤失败。
:::

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/posthog_wait_for_metric
        with:
          query: SELECT count() FROM events WHERE event = '$exception' AND timestamp > now() - INTERVAL 15 MINUTE
          operator: lt
          threshold: 10
```

##### 属性

| 属性 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `query` | string | 必需 | 一条 HogQL 查询。第一行的第一列必须是单个数字。 |
| `operator` | string | 必需 | 比较运算符。`lt`、`lte`、`gt`、`gte` 或 `eq` 之一。当 `value <operator> threshold` 成立时步骤通过。 |
| `threshold` | number | 必需 | 用来与查询结果比较的值。 |
| `timeout_seconds` | number | 可选 | 最长等待时间，以秒为单位。默认为 `600`。 |
| `interval_seconds` | number | 可选 | 两次检查之间的时间，以秒为单位。默认为 `30`。 |
| `api_key` | string | 可选 | PostHog 个人 API 密钥。默认为 `POSTHOG_CLI_API_KEY` 环境变量。需要 `query:read` 权限范围。 |
| `project_id` | string | 可选 | PostHog 项目 ID。默认为 `POSTHOG_CLI_PROJECT_ID` 环境变量。 |

##### 输出

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | string | 满足比较条件的指标值。 |

- [eas/posthog_wait_for_metric 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/waitForPosthogMetric.ts)：在 GitHub 上查看 eas/posthog_wait_for_metric 函数的源代码。

#### `eas/posthog_wait_for_query`

暂停工作流，直到一条 [HogQL](https://posthog.com/docs/hogql) 查询返回 true。当条件更容易在查询本身中表达时使用它。对于带有明确阈值的数值比较，改用 [`eas/posthog_wait_for_metric`](#easposthog_wait_for_metric)。

当第一行的第一列是 `true` 或非零数字时，该步骤通过，因此把查询写成选择单个布尔值，例如 `SELECT count() > 100 FROM events`。

:::note
与 `eas/posthog_wait_for_metric` 一样，此步骤没有 `ignore_error` 输入。超时或无法读取的查询始终会让步骤失败。
:::

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/posthog_wait_for_query
        with:
          query: SELECT count() > 0 FROM events WHERE event = 'smoke_test_passed' AND timestamp > now() - INTERVAL 30 MINUTE
```

##### 属性

| 属性 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `query` | string | 必需 | 一条 HogQL 查询。当第一行的第一列是 `true` 或非零数字时步骤通过。 |
| `timeout_seconds` | number | 可选 | 最长等待时间，以秒为单位。默认为 `600`。 |
| `interval_seconds` | number | 可选 | 两次检查之间的时间，以秒为单位。默认为 `30`。 |
| `api_key` | string | 可选 | PostHog 个人 API 密钥。默认为 `POSTHOG_CLI_API_KEY` 环境变量。需要 `query:read` 权限范围。 |
| `project_id` | string | 可选 | PostHog 项目 ID。默认为 `POSTHOG_CLI_PROJECT_ID` 环境变量。 |

- [eas/posthog_wait_for_query 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/waitForPosthogQuery.ts)：在 GitHub 上查看 eas/posthog_wait_for_query 函数的源代码。

#### `eas/posthog_annotation`

在项目时间线上创建一条 [PostHog 注释](https://posthog.com/docs/data/annotations)。注释显示在你的 PostHog 图表上，因此适合用来在受影响的指标旁边标记构建、发布和其他里程碑。

```yaml
jobs:
  my_job:
    steps:
      - uses: eas/posthog_annotation
        with:
          content: Published update to production
```

##### 属性

| 属性 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `content` | string | 必需 | 注释文本。 |
| `date_marker` | string | 可选 | 注释钉住的 ISO 8601 时间戳。默认为当前时间。 |
| `api_key` | string | 可选 | PostHog 个人 API 密钥。默认为 `POSTHOG_CLI_API_KEY` 环境变量。需要 `annotation:write` 权限范围。 |
| `project_id` | string | 可选 | PostHog 项目 ID。默认为 `POSTHOG_CLI_PROJECT_ID` 环境变量。 |
| `ignore_error` | boolean | 可选 | 为 `true` 时，网络错误或意外响应会被记录，但不会让步骤失败。默认为 `false`。权限错误始终会让步骤失败。 |

- [eas/posthog_annotation 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/createPosthogAnnotation.ts)：在 GitHub 上查看 eas/posthog_annotation 函数的源代码。

#### `eas/posthog_upload_sourcemaps`

把 JavaScript source map 上传到 PostHog，以便 PostHog 在[错误跟踪](/guides/using-posthog#错误跟踪)中符号化堆栈跟踪。在产生 bundle 的步骤之后、在同一个作业中运行它，这样 bundle 和 source map 都在磁盘上可用。用 `npx expo export --source-maps` 导出，并按照 [Source map 指南](/guides/using-posthog#source-map)配置 PostHog Metro 配置，使 bundle 带有与其 source map 匹配的 chunk ID。

:::warning
此步骤运行 PostHog CLI，它无法把权限错误与任何其他失败区分开。与其他 PostHog 函数不同，设置 `ignore_error: true` 也会隐藏身份验证和权限范围错误。
:::

```yaml
jobs:
  publish_update:
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - run: npx expo export --source-maps
      - uses: eas/posthog_upload_sourcemaps
        with:
          directory: dist
```

##### 属性

| 属性 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `directory` | string | 可选 | 包含 bundle 和 source map 的目录，相对于工作目录。默认为 `dist`。 |
| `api_key` | string | 可选 | PostHog 个人 API 密钥。默认为 `POSTHOG_CLI_API_KEY` 环境变量。需要 source map 上传权限。 |
| `project_id` | string | 可选 | PostHog 项目 ID。默认为 `POSTHOG_CLI_PROJECT_ID` 环境变量。 |
| `ignore_error` | boolean | 可选 | 为 `true` 时，上传失败会被记录，但不会让步骤失败。默认为 `false`。 |

- [eas/posthog_upload_sourcemaps 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/uploadPosthogSourcemaps.ts)：在 GitHub 上查看 eas/posthog_upload_sourcemaps 函数的源代码。

<a id="custom-functions"></a>

## 自定义函数

在项目中定义可复用的步骤序列，并通过 [`uses`](#jobsjob_idstepsstepuses) 用相对路径调用它们。路径必须是静态的字面字符串。它不能包含 `${{ }}` 插值或反斜杠。自定义函数调用接受与内置函数调用相同的字段：`id`、`name`、`with`、`if` 和 `env`。不要在调用步骤上设置 `working_directory`。改为在函数的内部步骤上设置它。把每个自定义函数存放在包含 **function.yml** 或 **function.yaml** 文件的目录中。自定义函数内部的步骤使用与[自定义作业步骤](#jobsjob_idsteps)相同的格式。关于组织文件、嵌套函数，以及从作业或钩子调用函数的细节，见[EAS Workflows 中的自定义函数](/eas/workflows/custom-functions)。

你的 **function.yml** 文件支持以下顶层属性：`name`、`description`、`inputs`、`outputs` 和 `runs`。EAS Workflows 会拒绝未知的顶层属性。

### 函数 `name`

显示在作业日志中的自定义函数可选显示名称。

```yaml
name: Greet
```

### 函数 `description`

关于自定义函数做什么的可选说明。

```yaml
description: Prints a greeting for the given name.
```

### 函数 `inputs`

调用方可以用 `with:` 传给自定义函数的输入值。你可以用两种方式声明输入。

简写形式是名称列表。每个输入都成为没有默认值的可选字符串输入：

```yaml
inputs:
  - who
```

完整形式是具有以下属性的对象列表：

| 属性 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | 必需 | 输入的名称。用它以 `${{ inputs.<name> }}` 访问该输入。 |
| `type` | `string` | 可选 | 输入类型：`string`、`boolean`、`number` 或 `json`。默认为 `string`。 |
| `default_value` | 视类型而定 | 可选 | 当你不提供值时 EAS Workflows 使用的值。必须与 `type` 匹配。 |
| `allowed_values` | array | 可选 | 你可以为此输入传递的值。 |
| `required` | `boolean` | 可选 | 你是否必须提供此输入。默认为 `false`。 |

```yaml
inputs:
  - name: who
    type: string
    default_value: world
  - name: platform
    type: string
    allowed_values: [android, ios]
    required: true
```

在自定义函数的步骤内部，用 `${{ inputs.<name> }}` 读取输入。

### 函数 `outputs`

把自定义函数暴露给其调用方的输出值声明为按输出名称键控的映射：

| 属性 | 是否必需 | 说明 |
| --- | --- | --- |
| `value` | 必需 | 解析为输出值的表达式，例如 `${{ steps.<id>.outputs.<name> }}`。 |
| `description` | 可选 | 输出的说明。 |

```yaml
outputs:
  message:
    value: '${{ steps.make.outputs.message }}'
    description: The rendered greeting.
```

EAS Workflows 把每个输出暴露为字符串。以 `${{ steps.<call_id>.outputs.<name> }}` 读取输出。使用调用步骤的 `id`。调用方不能引用函数内部的步骤标识符。

### 函数 `runs.steps`

`runs.steps` 是必需的，并且必须包含至少一个步骤。步骤使用与[自定义作业步骤](#jobsjob_idsteps)相同的格式，包括 `id`、`run`、`uses`、`if` 和 `working_directory`。目前，自定义函数不能调用 `eas/build` 或 `eas/maestro_test`。

```yaml
runs:
  steps:
    - id: make
      run: set-output message "Hello, ${{ inputs.who }}!"
```

## 内置 shell 函数

EAS Workflows 提供以下 shell 函数，你可以在工作流步骤中使用它们来设置变量输出。

### `set-output`

设置一个可由工作流中其他步骤或其他作业访问的输出变量。

```bash
set-output <name> <value>
```

与另一个步骤共享变量的用法示例：

```yaml
jobs:
  my_job:
    steps:
      - id: step_1
        run: set-output variable_1 "Variable 1"
      - id: step_2
        run: echo ${{ steps.step_1.outputs.variable_1 }} # 打印：Variable 1
```

与另一个作业共享变量的用法示例：

```yaml
jobs:
  job_1:
    outputs:
      variable_1: ${{ steps.step_1.outputs.variable_1 }}
    steps:
      - id: step_1
        run: set-output variable_1 "Variable 1"
  job_2:
    needs: [job_1]
    steps:
      - run: echo ${{ needs.job_1.outputs.variable_1 }} # 打印：Variable 1
```

### `set-env`

设置一个对同一作业中后续步骤可用的环境变量。在一个步骤的命令中用 `export` 导出的环境变量不会自动暴露给其他步骤。要与其他步骤共享环境变量，使用 `set-env` 可执行文件。

```bash
set-env <name> <value>
```

`set-env` 期望用两个参数调用：环境变量的名称和值。例如，`set-env NPM_TOKEN "abcdef"` 会把值为 `abcdef` 的 `$NPM_TOKEN` 变量暴露给后续步骤。

:::note
用 `set-env` 共享的变量不会在本地自动导出。如果你想在当前步骤中使用该变量，需要自己调用 `export`。
:::

与另一个步骤共享环境变量的用法示例：

```yaml
jobs:
  my_job:
    steps:
      - name: Set environment variables
        run: |
          # 只使用 export 只会让它在当前步骤中可用
          export LOCAL_VAR="only in this step"

          # 使用 set-env 会让它在后续步骤中可用
          set-env SHARED_VAR "available in next steps"

          # SHARED_VAR 在当前步骤的环境中尚不可用
          echo "LOCAL_VAR: $LOCAL_VAR"     # 打印：only in this step
          echo "SHARED_VAR: $SHARED_VAR"   # 打印：（空）
      - name: Use shared variable
        run: |
          # SHARED_VAR 现在可用
          echo "SHARED_VAR: $SHARED_VAR"   # 打印：available in next steps
```

#### 在作业之间共享环境变量

`set-env` 函数只与**同一作业内**的其他步骤共享环境变量。要在不同作业之间共享值，使用作业的 [`outputs`](#jobsjob_idoutputs) 配合 `set-output`，并通过接收作业上的 [`env`](#jobsjob_idenv) 属性传递它们：

```yaml
jobs:
  job_1:
    # 定义输出，以便把值暴露给其他作业
    outputs:
      my_value: ${{ steps.step_1.outputs.my_value }}
    steps:
      - id: step_1
        run: set-output my_value "value from job_1"

  job_2:
    needs: [job_1]
    # 使用 env 根据上游作业输出设置环境变量
    env:
      MY_VALUE: ${{ needs.job_1.outputs.my_value }}
    steps:
      - run: echo "MY_VALUE: $MY_VALUE"  # 打印：value from job_1
```
