
<a id="testflight"></a>

## TestFlight

把 iOS 构建分发到 [TestFlight](/submit/testflight) 内部和外部测试组。当你需要更高级的 TestFlight 功能时，这是 iOS 提交作业的替代方案。如果你需要控制测试组、更新日志或 Beta App Review 提交，使用 `testflight` 作业而不是 submit。

该作业支持两种方式：上传构建并提交到 TestFlight（`build_id`），或提交已上传的构建（`asc_build_id`）。在两种情况下，你都可以把构建加入组、设置 “What to Test” 说明，并提交 Beta App Review。恰好提供 `build_id` 或 `asc_build_id` 之一。

- **用于外部分发的 TestFlight 测试信息**

  当分发到外部组或提交 Beta App Review（`external_groups` 和/或 `submit_beta_review: true`）时，构建必须在 App Store Connect 中完成所需的 TestFlight 测试信息，作业才能成功。见 Apple 文档中的[提供测试信息](https://developer.apple.com/help/app-store-connect/test-a-beta-version/provide-test-information/)。

<a id="shared-parameters"></a>

### 共享参数

两种方式都在 `params` 中接受以下参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| internal_groups | string[] | 可选。要把构建加入的 TestFlight 内部组名称数组。只包含未启用自动分发的组。 |
| external_groups | string[] | 可选。要把构建加入的 TestFlight 外部组名称数组。 |
| changelog | string | 可选。给 TestFlight 测试人员的测试说明（“What to Test”）。 |
| submit_beta_review | boolean | 可选。是否提交 Beta App Review。如果未指定，当提供了 `external_groups` 时默认为 `true`，否则为 `false`。设为 `false` 可以更新已提交构建的更新日志或组，而不重新提交 Beta App Review。 |

### 上传构建并提交到 TestFlight

在单个工作流作业中上传 EAS iOS 构建并提交到 TestFlight。

- **iOS 商店构建和 Apple Developer 账户**

  TestFlight 作业需要用 `distribution: store` 创建的 iOS 构建，以及已配置的 Apple Developer 账户。更多信息见 [TestFlight 提交指南](/submit/ios#用-eas-workflows-自动化)。

#### 语法

```yaml
jobs:
  testflight_distribution:
    type: testflight
    params:
      build_id: string # 必需
      profile: string # 可选 - 默认：production
      internal_groups: string[] # 可选
      external_groups: string[] # 可选
      changelog: string # 可选
      submit_beta_review: boolean # 可选
      wait_processing_timeout_seconds: number # 可选 - 默认：1800（30 分钟）
    hooks:
      after_checkout: step[] # 可选 - 作业检出项目之后运行的步骤。
      before_install_node_modules: step[] # 可选 - 作业安装依赖之前运行的步骤。
      after_install_node_modules: step[] # 可选 - 作业安装依赖之后运行的步骤。
```

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| build_id | string | 必需。要分发的 iOS EAS Build 的 ID。 |
| profile | string | 可选。要使用的提交 profile。默认为 `production`。 |
| wait_processing_timeout_seconds | number | 可选。等待 App Store Connect 构建处理的超时时间（秒）。默认为 `1800`（30 分钟）。只在通过组或更新日志分发时适用。 |

你也可以传入任何[共享参数](#shared-parameters)。

#### 输出

你可以在后续作业中引用以下输出：

| 输出 | 类型 | 说明 |
| --- | --- | --- |
| apple_app_id | string | 已提交构建的 Apple App ID。 |
| ios_bundle_identifier | string | 已提交构建的 iOS bundle identifier。 |

#### 钩子

TestFlight 作业支持以下钩子：

- `after_checkout`：作业检出项目之后运行的步骤。
- `before_install_node_modules`：作业安装项目依赖之前运行的步骤。
- `after_install_node_modules`：作业安装项目依赖之后运行的步骤。

通用钩子语法见 [`jobs.<job_id>.hooks`](/eas/workflows/syntax#jobsjob_idhooks)。[提交已上传的构建](#submit-an-already-uploaded-build)时不支持钩子，因为该作业变体不在 worker 上运行。

#### 示例

下面是使用 TestFlight 作业的一些实际示例：

<details>
<summary>向内部和外部组完整分发</summary>

此工作流带更新日志，同时分发到内部和外部 TestFlight 组。

```yaml .eas/workflows/testflight-full.yml
name: TestFlight Distribution

jobs:
  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production

  testflight:
    name: Distribute to TestFlight
    type: testflight
    needs: [build_ios]
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
      internal_groups: ['QA Team']
      external_groups: ['Public Beta']
      changelog: |
        What's new in this release:
        - New features
        - Bug fixes
```

</details>

<details>
<summary>只带更新日志上传</summary>

此工作流上传带更新日志的构建，但不指定要显式加入的任何组。构建只会加入启用了 “auto-distribute” 的内部组。

```yaml .eas/workflows/testflight-changelog.yml
name: TestFlight with Changelog

jobs:
  testflight:
    name: Upload with Changelog
    type: testflight
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
      changelog: "${{ github.commit_message || 'Bug fixes' }}"
      # github.commit_message 只在 push 和 schedule 事件中可用。
```

</details>

<a id="submit-an-already-uploaded-build"></a>

### 提交已上传的构建

把已经在 App Store Connect 中的构建提交到 TestFlight 组，设置 “What to Test” 说明，并提交 Beta App Review。Beta App Review 提交是可选的。设置 `submit_beta_review: false` 可以更新现有构建的更新日志或组，而不重新提交审核。

- **App Store Connect 集成**

  在[项目设置 > 通用 > 连接](https://expo.dev/accounts/[account]/projects/[project]/settings)中配置你的 App Store Connect 连接。构建必须已经存在于 App Store Connect 中，并且已准备好提交。

#### 语法

```yaml
jobs:
  testflight_distribution:
    type: testflight
    params:
      asc_build_id: string # 必需
      internal_groups: string[]
      external_groups: string[]
      changelog: string
      submit_beta_review: boolean
```

#### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| asc_build_id | string | 必需。已经存在于 App Store Connect 中的构建 ID。 |

你也可以传入任何[共享参数](#shared-parameters)。

#### 输出

你可以在后续作业中引用以下输出：

| 输出 | 类型 | 说明 |
| --- | --- | --- |
| asc_build_id | string | App Store Connect 构建 ID。 |
| apple_app_id | string | 已提交构建的 Apple App ID。 |
| ios_bundle_identifier | string | 已提交构建的 iOS bundle identifier。 |

#### 示例

<details>
<summary>在 App Store Connect 上传之后自动分发到 TestFlight</summary>

当构建上传到 App Store Connect 时，此工作流自动把构建加入 TestFlight 组，设置 “What to Test” 说明，并提交 Beta App Review。使用此触发器之前，先配置你的 App Store Connect 连接。见[从 App Store Connect 事件触发工作流](/eas/workflows/get-started#从-app-store-connect-事件触发工作流)。

`${{ app_store_connect.build_upload.build.id }}` 只在工作流由 `build_upload` 事件触发，并且 App Store Connect 已把某个构建与该上传关联时可用。`build_upload.state: complete` 表示上传已完成，而不是 App Store Connect 已完成构建处理。使用 `external_groups` 时，先在 App Store Connect 中完成所需的 TestFlight 测试信息。

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
      changelog: Build from CI
      submit_beta_review: true
```

</details>

<details>
<summary>更新更新日志而不重新提交 Beta App Review</summary>

对于已经存在于 App Store Connect 中的构建，你可以更新 “What to Test” 说明或组成员，而不触发 Beta App Review。设置 `submit_beta_review: false` 以应用更改，同时不触碰构建现有的审核状态。

此工作流把构建 ID 和新的更新日志作为[手动输入](/eas/workflows/syntax#onworkflow_dispatchinputs)，因此你可以用 `eas workflow:run` 按需运行它。

```yaml .eas/workflows/testflight-update-changelog.yml
name: Update TestFlight changelog

on:
  workflow_dispatch:
    inputs:
      asc_build_id:
        type: string
        required: true
        description: The App Store Connect build ID to update.
      changelog:
        type: string
        required: true
        description: The new "What to Test" notes.

jobs:
  update_changelog:
    name: Update changelog
    type: testflight
    params:
      asc_build_id: ${{ inputs.asc_build_id }}
      changelog: ${{ inputs.changelog }}
      submit_beta_review: false
```

</details>

<a id="update"></a>

## 更新

使用 [EAS Update](/eas-update/introduction) 发布更新。

- **已配置 EAS Update**

  用于发布更新预览并发送 OTA 更新。运行 `npx eas-cli@latest update:configure`，然后创建新构建。进一步了解[配置 EAS Update](/eas-update/getting-started#前置条件)。

### 语法

```yaml
jobs:
  publish_update:
    type: update
    environment: production | preview | development # 可选，默认为 production
    env: # 可选的环境变量列表
      ENV_VAR_NAME: value
    params:
      message: string # 可选
      platform: string # 可选 - android | ios | all，默认为 all
      branch: string # 可选
      channel: string # 可选 - 不能与 branch 一起使用
      rollout_percentage: number # 可选 - 0 到 100，默认为 100
      private_key_path: string # 可选
      upload_sentry_sourcemaps: boolean # 可选 - 默认为“尝试上传，但如果失败不要让作业失败”
    hooks:
      after_checkout: step[] # 可选 - 作业检出项目之后运行的步骤。
      before_install_node_modules: step[] # 可选 - 作业安装依赖之前运行的步骤。
      after_install_node_modules: step[] # 可选 - 作业安装依赖之后运行的步骤。
      before_update: step[] # 可选 - 发布更新之前运行的步骤。
      after_update: step[] # 可选 - 发布更新之后运行的步骤。
```

#### 环境变量

你可以把环境变量列表传入 `env` 参数。这些环境变量将从 [EAS 环境变量](/eas/environment-variables)中拉取。传入的 `environment` 参数将用作环境变量的环境，当同一个环境变量在不同环境中定义时这很有用。

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| message | string | 可选。用于更新的消息。如果未提供，将使用提交消息。 |
| platform | string | 可选。用于更新的平台。可以是 `android`、`ios` 或 `all`。默认为 `all`。 |
| branch | string | 可选。用于更新的分支。如果未提供，将使用工作流运行的分支。对于手动运行的工作流，你需要提供一个值。示例：`${{ github.ref_name \|\| 'testing' }}`。提供分支或频道之一，不要同时提供两者。 |
| channel | string | 可选。用于更新的频道。提供分支或频道之一，不要同时提供两者。 |
| rollout_percentage | number | 可选。此更新应当立即对百分之多少的用户可用。必须是 `0` 到 `100` 之间的整数。这等价于向 EAS CLI 传递 `--rollout-percentage`。 |
| private_key_path | string | 可选。包含与 [EAS Update 配置](/eas-update/code-signing#为应用发布已签名的更新)中证书对应的 PEM 编码私钥的文件路径。你可以用 `"$VARIABLE_NAME"` 语法引用文件类型的 [EAS 环境变量](/eas/environment-variables)。这等价于向 EAS CLI 传递 `--private-key-path`。 |
| upload_sentry_sourcemaps | boolean | 可选。是否上传 Sentry source map。如果值为 `true`，作业会上传 Sentry source map，并在上传失败时失败。如果值为 `false`，作业不会向 Sentry 上传 source map。如果未提供该值，作业会检查是否安装了 `@sentry/react-native`，如果已安装则尝试上传 source map。如果失败，它只会打印错误消息，并继续把作业标记为成功。 |

#### 输出

你可以在后续作业中引用以下输出：

| 输出 | 类型 | 说明 |
| --- | --- | --- |
| first_update_group_id | string | 第一个更新组的 ID。 |
| updates_json | string | 包含所有更新组信息的 JSON 字符串。 |

#### 钩子

更新作业支持以下钩子：

- `after_checkout`：作业检出项目之后运行的步骤。
- `before_install_node_modules`：作业安装项目依赖之前运行的步骤。
- `after_install_node_modules`：作业安装项目依赖之后运行的步骤。
- `before_update`：发布更新之前运行的步骤。
- `after_update`：发布更新之后运行的步骤。钩子步骤可以访问发布期间产生的文件（例如 **dist** 目录中的 source map）。

通用钩子语法见 [`jobs.<job_id>.hooks`](/eas/workflows/syntax#jobsjob_idhooks)。

### 示例

下面是使用更新作业的一些实际示例：

<details>
<summary>发布到生产频道的基本更新</summary>

此工作流在你推送到 main 分支时把更新发布到生产频道，并使用提交消息作为更新消息。

```yaml .eas/workflows/update-production.yml
name: Update Production

on:
  push:
    branches: ['main']

jobs:
  update_production:
    name: Update Production Channel
    type: update
    params:
      channel: production
```

</details>

<details>
<summary>特定平台的更新</summary>

此工作流分别为 Android 和 iOS 平台发布更新，从而允许特定于平台的更改。

```yaml .eas/workflows/update-platforms.yml
name: Platform-specific Updates

on:
  push:
    branches: ['main']

jobs:
  update_android:
    name: Update Android
    type: update
    params:
      platform: android
      channel: production

  update_ios:
    name: Update iOS
    type: update
    params:
      platform: ios
      channel: production
```

</details>

<details>
<summary>基于分支的更新部署</summary>

此工作流根据分支名称发布更新，从而允许基于分支使用不同环境（staging/production）。

```yaml .eas/workflows/update-branches.yml
name: Branch-based Updates

on:
  push:
    branches: ['main', 'staging']

jobs:
  update_branch:
    name: Update Branch
    type: update
    params:
      branch: ${{ github.ref_name }}
      message: 'Update for branch: ${{ github.ref_name }}'
```

</details>

<details>
<summary>发布更新后上传 source map</summary>

此工作流发布更新，然后用内置的 [`eas/posthog_upload_sourcemaps`](/eas/workflows/syntax#easposthog_upload_sourcemaps) 函数把生成的 source map 上传到 PostHog。发布更新会在 **dist** 目录中创建 source map，这是该函数的默认上传目录。这些文件只存在于运行该作业的 worker 上，因此上传必须发生在 `after_update` 钩子中，而不是在单独的作业中。钩子步骤继承作业的环境，因此你可以把 `POSTHOG_CLI_API_KEY` 和 `POSTHOG_CLI_PROJECT_ID` 凭据作为 [EAS 环境变量](/eas/environment-variables)提供。要上传到其他服务，改为在 `run` 步骤中运行它的上传命令。

```yaml .eas/workflows/update-with-sourcemaps.yml
name: Update with sourcemaps

on:
  push:
    branches: ['main']

jobs:
  update:
    name: Publish update
    type: update
    params:
      channel: production
    hooks:
      after_update:
        - uses: eas/posthog_upload_sourcemaps
```

</details>

<a id="update-rollout"></a>

## 更新发布

提高正在进行的 [EAS Update](/eas-update/introduction) 发布的发布百分比。用它逐步发布一个曾以部分 `rollout_percentage` 发布给一部分用户的更新组。

### 语法

```yaml
jobs:
  roll_out_update:
    type: update-rollout
    params:
      update_group_id: string # 必需
      rollout_percentage: number # 可选 - 0 到 100，默认为 100
```

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| update_group_id | string | 必需。要更改其发布的更新组 ID。这通常是前面 [`update`](#update) 作业的 `first_update_group_id` 输出。该组必须有正在进行的发布，否则作业失败。 |
| rollout_percentage | number | 可选。此更新组应当发布到的用户百分比。必须是 `0` 到 `100` 之间的整数，并且不低于该组当前的发布百分比。默认为 `100`，这会把更新发布给所有用户并完成发布。 |

#### 输出

你可以在后续作业中引用以下输出：

| 输出 | 类型 | 说明 |
| --- | --- | --- |
| update_group_id | string | 被发布的更新组的 ID。 |
| rollout_percentage | number | 应用到该更新组的发布百分比。 |
| updates_json | string | 包含该组中所有更新信息的 JSON 字符串。 |

### 示例

下面是使用更新发布作业的一些实际示例：

<details>
<summary>发布部分灰度，然后在批准后完成它</summary>

此工作流把更新发布给 25% 的用户，等待批准，然后才把发布完成到 100%。

```yaml .eas/workflows/update-rollout.yml
name: Update with staged rollout

on:
  push:
    branches: ['main']

jobs:
  publish_update:
    name: Publish update to 25% of users
    type: update
    params:
      channel: production
      rollout_percentage: 25

  require_approval:
    name: Roll out to all users?
    type: require-approval
    needs: [publish_update]

  complete_rollout:
    name: Roll out to all users
    type: update-rollout
    needs: [publish_update, require_approval]
    params:
      update_group_id: ${{ needs.publish_update.outputs.first_update_group_id }}
      rollout_percentage: 100
```

</details>

<a id="branch-delete"></a>

## 分支删除

删除当前项目中的一个 [EAS Update](/eas-update/introduction) 分支。与 [`eas branch:delete`](/eas-update/eas-cli#删除分支) 相同。在 `branch_name` 中传入 EAS Update 分支名称。

### 语法

```yaml
jobs:
  delete_branch:
    type: branch-delete
    params:
      branch_name: string # 必需
      fail_on_missing: boolean # 可选，默认：false
```

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| branch_name | string | 必需。要删除的 EAS Update 分支名称。 |
| fail_on_missing | boolean | 如果为 `false`，当分支不存在时作业成功。如果为 `true`，当分支缺失时作业以校验错误失败。默认为 `false`。 |
