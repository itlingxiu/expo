
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
