
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
