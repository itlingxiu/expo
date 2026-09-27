
#### 输出

你可以在后续作业中引用以下输出：

| 输出 | 类型 | 说明 |
| --- | --- | --- |
| branch_id | string | 已删除分支的 UUID；如果分支缺失且 `fail_on_missing` 为 `false`，则为 `null`。 |
| branch_name | string | 来自 `params.branch_name` 的分支名称。 |

### 示例

使用 [`on.ref_delete`](/eas/workflows/syntax#onref_delete) 与 `branch-delete` 作业的工作流，见[清理更新分支示例](/eas/workflows/examples/branch-cleanup)。

<a id="maestro"></a>

## Maestro

在 Android 模拟器或 iOS 模拟器构建上运行 Maestro 测试。

:::warning
Maestro 测试处于 [Alpha](/more/release-statuses#alpha)。
:::

### 语法

```yaml
jobs:
  run_maestro_tests:
    type: maestro
    environment: production | preview | development # 可选 - 默认为 preview
    image: string # 可选 - 可用镜像列表见 /build-reference/infrastructure
    runs_on: string # 可选 - Android 模拟器测试请使用 linux-*-nested-virtualization worker。可用选项见 #jobsjob_idruns_on。
    params:
      build_id: string # 必需
      flow_path: string | string[] # 必需
      shards: number # 可选 - 默认为 1
      retries: number # 可选 - 默认为 0
      retry_failed_only: boolean # 可选 - 默认为 true
      record_screen: boolean # 可选 - 默认为 false
      include_tags: string | string[] # 可选
      exclude_tags: string | string[] # 可选
      maestro_version: string # 可选 - 默认为最新版本
      android_system_image_package: string # 可选
      device_identifier: string | { android?: string, ios?: string } # 可选
      output_format: string # 可选 - 默认为 junit
      skip_build_check: boolean # 可选 - 默认为 false
    hooks:
      after_checkout: step[] # 可选 - 作业检出项目之后运行的步骤。
      before_maestro_tests: step[] # 可选 - 测试开始之前运行的步骤。
      after_maestro_tests: step[] # 可选 - 测试完成之后运行的步骤。
```

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| build_id | string | 必需。要测试的构建 ID。 |
| flow_path | string 或 string[] | 必需。要运行的 Maestro 流程文件或目录的路径。 |
| shards | number | 可选且实验性。把测试拆分成的分片数量。默认为 1。 |
| retries | number | 可选。测试失败时重试的次数。默认为 0。 |
| retry_failed_only | boolean | 可选。为 true（默认）时，重试会在适用时只尝试重新运行上一次失败的流程。设为 false 则在每次重试时重新运行所有流程。 |
| record_screen | boolean | 可选。是否录制屏幕。默认为 false。注意：录制屏幕可能影响模拟器性能。录制屏幕时你可能希望使用大型 runner。 |
| include_tags | string 或 string[] | 可选。要包含在测试中的流程标签。将作为 `--include-tags` 传给 Maestro。 |
| exclude_tags | string 或 string[] | 可选。要从测试中排除的流程标签。将作为 `--exclude-tags` 传给 Maestro。 |
| maestro_version | string | 可选。用于测试的 Maestro 版本。如果未提供，将使用最新版本。 |
| output_format | string | 可选。Maestro 测试报告格式。默认为 `junit`。将作为 `--format` 传给 Maestro。可以是 `junit` 或其他受支持的格式。 |
| android_system_image_package | string | 可选。要使用的 Android 模拟器系统镜像包。在你的机器上运行 `sdkmanager --list` 以列出可用包。选择 `x86_64` 变体。示例：`system-images;android-36;google_apis;x86_64`、`system-images;android-35-ext15;google_apis_playstore;x86_64`。注意较新的镜像需要更多计算资源，你可能希望使用大型 runner。 |
| device_identifier | string 或 `{ android?: string, ios?: string }` 对象 | 可选。用于测试的设备标识符。你也可以使用单值表达式，例如 `pixel_6`、`iPhone 16 Plus` 或 `${{ needs.build.outputs.platform == "android" ? "pixel_6" : "iPhone 16 Plus" }}`，以及像 `device_identifier: { android: "pixel_6", ios: "iPhone 16 Plus" }` 这样的对象。注意 iOS 设备可用性因 runner 镜像而异。可用设备列表可以在作业日志中找到。 |
| skip_build_check | boolean | 可选。跳过构建校验（iOS 构建是否为模拟器构建）。默认为 false。 |

#### 钩子

Maestro 作业支持以下钩子：

- `after_checkout`：作业检出项目之后运行的步骤。
- `before_maestro_tests`：测试开始之前运行的步骤。
- `after_maestro_tests`：测试完成之后运行的步骤。

通用钩子语法见 [`jobs.<job_id>.hooks`](/eas/workflows/syntax#jobsjob_idhooks)。

### 示例

下面是使用 Maestro 作业的一些实际示例：

<details>
<summary>基本 Maestro 测试</summary>

此工作流使用默认设置在 iOS 模拟器构建上运行 Maestro 测试。

```yaml .eas/workflows/maestro-basic.yml
name: Basic Maestro Test

jobs:
  test:
    name: Run Maestro Tests
    type: maestro
    environment: preview
    params:
      build_id: ${{ needs.build_ios_simulator.outputs.build_id }}
      flow_path: ./maestro/flows
```

</details>

<details>
<summary>带分片的 Maestro 测试</summary>

此工作流在 Android 模拟器构建上运行 Maestro 测试，使用 3 个分片，并对失败的测试重试 2 次。

```yaml .eas/workflows/maestro-sharded.yml
name: Sharded Maestro Test

jobs:
  test:
    name: Run Sharded Maestro Tests
    type: maestro
    environment: preview
    runs_on: linux-large-nested-virtualization
    params:
      build_id: ${{ needs.build_android_emulator.outputs.build_id }}
      flow_path: ./maestro/flows
      shards: 3
      retries: 2
```

</details>

<details>
<summary>使用带 Maestro 前缀的环境变量</summary>

当变量以 `MAESTRO_` 为前缀时，Maestro 可以自动读取工作流中的环境变量。更多信息见 [Maestro 关于 shell 变量的文档](https://docs.maestro.dev/maestro-flows/flow-control-and-logic/parameters-and-constants#accessing-shell-variables)。

```yaml .eas/workflows/maestro-basic.yml
name: Basic Maestro Test

jobs:
  test:
    name: Run Maestro Tests
    type: maestro
    env:
      MAESTRO_APP_ID: 'com.yourhost.yourapp'
    params:
      build_id: ${{ needs.build_ios_simulator.outputs.build_id }}
```

</details>

<details>
<summary>在运行测试之前生成 Maestro 流程</summary>

此工作流使用钩子，在 Maestro 开始运行测试之前生成 `maestro_tests` 目录。

```yaml .eas/workflows/maestro-hooks.yml
name: Maestro Hooks

jobs:
  test:
    name: Run Maestro Tests
    type: maestro
    environment: preview
    params:
      build_id: ${{ needs.build_ios_simulator.outputs.build_id }}
      flow_path: ./maestro_tests
    hooks:
      before_maestro_tests:
        - name: Generate Maestro flows
          run: npx tsx scripts/generate-maestro-tests.ts
```

</details>

<details>
<summary>录制屏幕并使用特定设备</summary>

此工作流在特定设备的 Android 模拟器构建上运行 Maestro 测试并录制屏幕。

```yaml .eas/workflows/maestro-sharded.yml
name: Pixel E2E Test

jobs:
  test:
    name: Run Maestro Tests
    type: maestro
    runs_on: linux-large-nested-virtualization
    params:
      build_id: ${{ needs.build_android_emulator.outputs.build_id }}
      device_identifier: 'pixel_6'
      record_screen: true
      android_system_image_package: 'system-images;android-35;default;x86_64'
```

</details>

<details>
<summary>保存截图和录制</summary>

[`takeScreenshot`](https://docs.maestro.dev/reference/commands-available/takescreenshot) 或 [`startRecording`](https://docs.maestro.dev/reference/commands-available/startrecording) 等 Maestro 命令会保存你稍后可用于调试的资源。

在你的 Maestro 流程文件中，给每个资源一个相对路径：

```yaml maestro/flows/test-flow.yaml
appId: com.myapp
---
- launchApp
- startRecording: my_recording
- takeScreenshot: my_screenshot
- tapOn: 'Login Button'
- takeScreenshot: after_login_screenshot
- stopRecording
```

这些资源将在 Artifacts 部分的 “Maestro Test Results” 产物中可用。

</details>

<details>
<summary>把 Maestro 产物报告到 Slack</summary>

此工作流把截图和录制保存到 `MAESTRO_TESTS_DIR`，然后在测试结束后运行一个脚本，上传这些文件或向 Slack 发送摘要。

```yaml .eas/workflows/maestro-report-artifacts.yml
name: Maestro Artifact Reporting

jobs:
  test:
    name: Run Maestro Tests
    type: maestro
    environment: preview
    env:
      SLACK_WEBHOOK_URL: ${{ env.SLACK_WEBHOOK_URL }}
    params:
      build_id: ${{ needs.build_ios_simulator.outputs.build_id }}
      flow_path: ./maestro/flows
      record_screen: true
    hooks:
      after_maestro_tests:
        - name: Report Maestro artifacts
          run: npx tsx scripts/report-maestro-artifacts.ts "$MAESTRO_TESTS_DIR"
```

</details>

<a id="maestro-cloud"></a>

## Maestro Cloud

在 Maestro Cloud 上运行 Maestro 测试。

:::warning
这需要 Maestro Cloud 账户和 Cloud Plan 订阅。前往 [Maestro 文档](https://docs.maestro.dev/maestro-cloud/run-tests-on-maestro-cloud)了解更多。
:::

### 语法

```yaml
jobs:
  run_maestro_tests:
    type: maestro-cloud
    environment: production | preview | development # 可选 - 默认为 preview
    image: string # 可选 - 可用镜像列表见 /build-reference/infrastructure
    params:
      build_id: string # 必需 - 要测试的构建 ID。
      maestro_project_id: string # 必需 - Maestro Cloud 项目 ID。示例：`proj_01jw6hxgmdffrbye9fqn0pyzm0`。
      flows: string # 必需 - 要运行的 Maestro 流程文件或包含流程的目录的路径。对应 `maestro cloud` 的 `--flows` 参数。
      maestro_api_key: string # 可选 - 默认为 `$MAESTRO_CLOUD_API_KEY`
      include_tags: string | string[] # 可选 - 要包含在测试中的标签。将作为 `--include-tags` 传给 Maestro。
      exclude_tags: string | string[] # 可选 - 要从测试中排除的标签。将作为 `--exclude-tags` 传给 Maestro。
      maestro_version: string # 可选 - 用于测试的 Maestro 版本。如果未提供，将使用最新版本。
      maestro_config: string # 可选 - 用于测试的 Maestro `config.yaml` 文件路径。将作为 `--config` 传给 Maestro。
      device_locale: string # 可选 - 用于测试的设备区域设置。将作为 `--device-locale` 传给 Maestro。
      device_model: string # 可选 - 用于测试的设备型号。将作为 `--device-model` 传给 Maestro。运行 `maestro list-cloud-devices` 查看受支持的值。
      device_os: string # 可选 - 用于测试的设备操作系统。将作为 `--device-os` 传给 Maestro。运行 `maestro list-cloud-devices` 查看受支持的值。
      skip_build_check: boolean # 可选 - 跳过构建校验（iOS 构建是否为模拟器构建）。默认为 false。
      name: string # 可选 - Maestro Cloud 上传的名称。对应 `maestro cloud` 的 `--name` 参数。
      branch: string # 可选 - Maestro Cloud 上传来源分支的覆盖值。默认情况下，如果工作流运行由 GitHub 触发，将使用工作流运行的分支。对应 `maestro cloud` 的 `--branch` 参数。
      async: boolean # 可选 - 异步运行 Maestro Cloud 测试。如果为 true，作业状态只表示上传是否成功，而不表示测试是否成功。对应 `maestro cloud` 的 `--async` 参数。
    hooks:
      after_checkout: step[] # 可选 - 作业检出项目之后运行的步骤。
      before_maestro_cloud: step[] # 可选 - Maestro Cloud 上传之前运行的步骤。
      after_maestro_cloud: step[] # 可选 - Maestro Cloud 上传之后运行的步骤。
```

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| build_id | string | 必需。要测试的构建 ID。示例：`${{ needs.build_android.outputs.build_id }}`。 |
| maestro_project_id | string | 必需。要使用的 Maestro Cloud 项目 ID。对应 `maestro cloud` 的 `--project-id` 参数。示例：`proj_01jw6hxgmdffrbye9fqn0pyzm0`。前往 [Maestro Cloud](https://app.maestro.dev/) 查找你的项目 ID。 |
| flows | string | 必需。要运行的 Maestro 流程文件或包含流程的目录的路径。对应 `maestro cloud` 的 `--flows` 参数。 |
| maestro_api_key | string | 可选。用于 Maestro 项目的 API 密钥。默认使用 `MAESTRO_CLOUD_API_KEY` 环境变量。对应 `maestro cloud` 的 `--api-key` 参数。 |
| include_tags | string | 可选。要包含在测试中的标签。对应 `maestro cloud` 的 `--include-tags` 参数。示例：`"pull,push"`。 |
| exclude_tags | string | 可选。要从测试中排除的标签。对应 `maestro cloud` 的 `--exclude-tags` 参数。示例：`"disabled"`。 |
| maestro_version | string | 可选。要使用的 Maestro 版本。示例：`1.30.0`。 |
| maestro_config | string | 可选。要使用的 Maestro `config.yaml` 文件路径。对应 `maestro cloud` 的 `--config` 参数。示例：`.maestro/config.yaml`。 |
| device_locale | string | 可选。将设置在用于测试的设备上的区域设置。对应 `maestro cloud` 的 `--device-locale` 参数。示例：`pl_PL`。 |
| device_model | string | 可选。用于测试的设备型号。对应 `maestro cloud` 的 `--device-model` 参数。示例：`iPhone-11`。运行 `maestro list-cloud-devices` 查看受支持的值。 |
| device_os | string | 可选。用于测试的设备操作系统。对应 `maestro cloud` 的 `--device-os` 参数。示例：`iOS-18-2`。运行 `maestro list-cloud-devices` 查看受支持的值。 |
| skip_build_check | boolean | 可选。跳过构建校验（iOS 构建是否为模拟器构建）。默认为 false。 |
| name | string | 可选。Maestro Cloud 上传的名称。对应 `maestro cloud` 的 `--name` 参数。 |
| branch | string | 可选。Maestro Cloud 上传来源分支的覆盖值。默认情况下，如果工作流运行由 GitHub 触发，将使用工作流运行的分支。对应 `maestro cloud` 的 `--branch` 参数。 |
| async | boolean | 可选。异步运行 Maestro Cloud 测试。如果为 true，作业状态只表示上传是否成功，而不表示测试是否成功。对应 `maestro cloud` 的 `--async` 参数。 |

:::warning
你需要在作业环境中设置 `maestro_api_key` 参数或 `MAESTRO_CLOUD_API_KEY` 环境变量。前往 [Maestro Cloud](https://app.maestro.dev/) 的 “Settings” 生成 API 密钥，然后到[环境变量](https://expo.dev/accounts/[account]/projects/[project]/environment-variables)把它添加到你的项目。
:::

#### 钩子

Maestro Cloud 作业支持以下钩子：

- `after_checkout`：作业检出项目之后运行的步骤。
- `before_maestro_cloud`：Maestro Cloud 上传之前运行的步骤。
- `after_maestro_cloud`：Maestro Cloud 上传之后运行的步骤。

通用钩子语法见 [`jobs.<job_id>.hooks`](/eas/workflows/syntax#jobsjob_idhooks)。

#### 输出

你可以在后续作业中引用以下输出：

| 输出 | 类型 | 说明 |
| --- | --- | --- |
| maestro_cloud_url | string | Maestro Cloud 上传结果页的 URL。 |
| total_flows_count | number | 已执行的流程总数。 |
| successful_flows_count | number | 成功完成的流程数量（状态为 SUCCESS 或 WARNING）。 |
| failed_flows_count | number | 失败的流程数量（状态为 ERROR 或 STOPPED）。 |
| successful_flow_names_json | string | 包含成功流程名称的 JSON 数组。 |
| failed_flow_names_json | string | 包含失败流程名称的 JSON 数组。 |

:::note
使用 `async: true` 模式时，只有 `maestro_cloud_url` 输出保证有效。其他输出（流程计数和流程名称）可能无效或为空，因为作业不会等待上传完成，并且流程尚未执行。
:::

你也可以使用 [`jobs.<job_id>.outputs`](/eas/workflows/syntax#jobsjob_idoutputs) 为此作业定义额外输出。

### 示例

下面是使用 Maestro Cloud 作业的一些实际示例：

<details>
<summary>基本 Maestro Cloud 测试</summary>

此工作流使用默认设置在 iOS 模拟器构建上运行 Maestro 测试。

```yaml .eas/workflows/maestro-basic.yml
name: Basic Maestro Test

jobs:
  test:
    name: Run Maestro Tests
    type: maestro-cloud
    environment: preview
    params:
      build_id: ${{ needs.build_ios_simulator.outputs.build_id }}
      maestro_project_id: proj_01jw6hxgmdffrbye9fqn0pyzm0
      flows: ./maestro/flows
```

</details>

<details>
<summary>使用带 Maestro 前缀的环境变量</summary>

当变量以 `MAESTRO_` 为前缀时，Maestro 可以自动读取工作流中的环境变量。更多信息见 [Maestro 关于 shell 变量的文档](https://docs.maestro.dev/maestro-flows/flow-control-and-logic/parameters-and-constants#accessing-shell-variables)。

```yaml .eas/workflows/maestro-basic.yml
name: Basic Maestro Test

jobs:
  test:
    name: Run Maestro Tests
    type: maestro-cloud
    env:
      MAESTRO_APP_ID: 'com.yourhost.yourapp'
    params:
      build_id: ${{ needs.build_ios_simulator.outputs.build_id }}
      maestro_project_id: proj_01jw6hxgmdffrbye9fqn0pyzm0
      flows: ./maestro/flows
```

</details>

<details>
<summary>在后续作业中使用 Maestro Cloud 输出</summary>

此工作流运行 Maestro Cloud 测试，然后在 Slack 通知中使用测试结果。

```yaml .eas/workflows/maestro-with-notification.yml
name: Maestro Cloud with Notification

jobs:
  maestro_test:
    name: Run Maestro Cloud Tests
    type: maestro-cloud
    environment: preview
    params:
      build_id: ${{ needs.build.outputs.build_id }}
      maestro_project_id: proj_xyz
      flows: ./maestro/flows

  notify:
    name: Send Test Results
    after: [maestro_test]
    type: slack
    environment: production
    params:
      webhook_url: ${{ env.SLACK_WEBHOOK_URL }} # 确保在正确的环境中设置它（见上面的 "environment: ..."）
      message: 'Tests complete: ${{ after.maestro_test.outputs.successful_flows_count }}/${{ after.maestro_test.outputs.total_flows_count }} passed'
```

</details>
