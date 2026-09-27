
<a id="slack"></a>

## Slack

使用 [Slack webhook URL](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks) 向 Slack 频道发送消息。

### 语法

```yaml
jobs:
  send_slack_notification:
    type: slack
    params:
      webhook_url: string # 必需
      message: string # 如果未提供 payload 则必需
      payload: object # 如果未提供 message 则必需
```

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| webhook_url | string | 必需。发送消息所用的 Slack webhook URL。使用带 `${{ env.SLACK_WEBHOOK_URL }}` 的[环境变量](/eas/environment-variables/manage#管理环境变量)。 |
| message | string | 如果未提供 payload 则必需。要发送的消息。 |
| payload | object | 如果未提供 message 则必需。要发送的 [Slack Block Kit](https://docs.slack.dev/block-kit) 载荷。 |

### 示例

下面是使用 Slack 作业的一些实际示例：

<details>
<summary>基本构建通知</summary>

此工作流构建 iOS 应用，然后发送一条通知，其中包含来自构建作业输出的应用标识符和版本。webhook URL 从设置在作业 `environment` 中的 `SLACK_WEBHOOK_URL` [环境变量](/eas/environment-variables/manage#管理环境变量)读取。

```yaml .eas/workflows/slack-build-notification.yml
name: Build Notification

jobs:
  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production

  notify_build:
    name: Notify Build Status
    needs: [build_ios]
    type: slack
    environment: production
    params:
      webhook_url: ${{ env.SLACK_WEBHOOK_URL }}
      message: 'Build completed for app ${{ needs.build_ios.outputs.app_identifier }} (version ${{ needs.build_ios.outputs.app_version }})'
```

</details>

<details>
<summary>使用 Block Kit 的富构建通知</summary>

此工作流构建 Android 应用，并使用构建作业输出发送富通知。

```yaml .eas/workflows/slack-rich-notification.yml
name: Rich Build Notification

jobs:
  build_android:
    name: Build Android
    type: build
    params:
      platform: android
      profile: production

  notify_build:
    name: Notify Build Status
    needs: [build_android]
    type: slack
    environment: production
    params:
      webhook_url: ${{ env.SLACK_WEBHOOK_URL }}
      payload:
        blocks:
          - type: header
            text:
              type: plain_text
              text: 'Build Completed'
          - type: section
            fields:
              - type: mrkdwn
                text: "*App:*\n${{ needs.build_android.outputs.app_identifier }}"
              - type: mrkdwn
                text: "*Version:*\n${{ needs.build_android.outputs.app_version }}"
          - type: section
            fields:
              - type: mrkdwn
                text: "*Build ID:*\n${{ needs.build_android.outputs.build_id }}"
              - type: mrkdwn
                text: "*Platform:*\n${{ needs.build_android.outputs.platform }}"
          - type: section
            text:
              type: mrkdwn
              text: 'Distribution: ${{ needs.build_android.outputs.distribution }}'
```

</details>

<a id="github-comment"></a>

## GitHub 评论

自动把工作流已完成的构建、更新和部署的报告发布到 GitHub 拉取请求。它特别适合为 PR 构建提供即时反馈、用二维码分享测试构建以便在设备上轻松测试、显示 EAS Hosting 部署预览，以及自动化部署通知。你也可以通过提供 `payload` 参数覆盖评论内容。

- **已连接到项目的 GitHub 仓库**

  要使用 GitHub Comment 作业，你的项目必须连接一个 GitHub 仓库。了解如何[连接你的 GitHub 仓库](/build/building-from-github)以开始使用。

### 语法

```yaml
jobs:
  github_comment:
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

#### 参数

该作业以两种互斥模式运行：

##### 模式 1：自动发现并可覆盖

默认行为是自动发现构建和更新，如果你想指定，可以使用以下任何参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| message | string | 可选。包含在评论顶部的自定义消息。默认为 “Your builds, updates, and deployments are ready for testing!” |
| build_ids | string[] | 可选。要包含的特定构建 ID 数组。如果未指定，自动发现所有已完成/失败/已取消的构建。使用空数组 `[]` 排除构建。 |
| update_group_ids | string[] | 可选。要包含的特定更新组 ID 数组。如果未指定，自动发现所有成功的更新。使用空数组 `[]` 排除更新。 |
| deployment_ids | string[] | 可选。要包含的特定部署 ID 数组。如果未指定，自动发现所有成功的部署。使用空数组 `[]` 排除部署。 |

> **自动发现行为**：当未指定 `build_ids`、`update_group_ids` 或 `deployment_ids`（undefined）时，作业会自动发现当前工作流中所有相关的构建、更新和部署。要显式排除构建、更新或部署，传入空数组 `[]`。

##### 模式 2：载荷模式

使用载荷模式时，你不能指定任何其他参数。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| payload | string | 作为评论发布的原始 markdown 或 HTML 内容。支持工作流变量插值。 |

#### 输出

你可以在后续作业中引用以下输出：

| 输出 | 类型 | 说明 |
| --- | --- | --- |
| comment_url | string | 已发布的 GitHub 评论的 URL（只在评论成功发布时可用）。 |

### 示例

下面是演示 GitHub Comment 作业两种模式的实际示例：

#### 自动发现并可覆盖模式的示例

<details>
<summary>自动发现所有构建、更新和部署</summary>

这是最简单的用法——自动发现并发布工作流中的所有构建、更新和部署。

```yaml .eas/workflows/pr-auto-comment.yml
name: PR Auto Comment

on:
  pull_request: {}

jobs:
  # ...

  comment_on_pr:
    name: Post Results to PR
    after: [build_ios, build_android, publish_update, deploy]
    type: github-comment
    # 不需要参数 - 自动发现所有构建、更新和部署
```

</details>

<details>
<summary>带自动发现的自定义消息</summary>

添加自定义消息，同时仍然自动发现所有构建、更新和部署。

```yaml .eas/workflows/pr-custom-message.yml
name: PR Custom Message

on:
  pull_request: {}

jobs:
  # ...

  comment_on_pr:
    name: Post Build to PR
    after: [build_ios, build_android, publish_update, deploy]
    type: github-comment
    params:
      message: '🎉 Preview builds are ready! Please test these changes before approving the PR.'
      # build_ids、update_group_ids 和 deployment_ids 为 undefined，因此启用自动发现
```

</details>

<details>
<summary>带 EAS Hosting 部署的 PR 预览</summary>

此工作流使用 EAS Hosting 部署网站预览，并把部署详情发布到拉取请求。

```yaml .eas/workflows/pr-preview.yml
name: PR Preview

on:
  pull_request: {}

jobs:
  deploy:
    type: deploy
    name: Deploy PR Preview

  comment:
    needs: [deploy]
    type: github-comment
```

</details>

<details>
<summary>指定确切的构建和更新</summary>

显式指定要包含在评论中的构建和更新。

```yaml .eas/workflows/pr-specific-builds.yml
name: PR Specific Builds

on:
  pull_request: {}

jobs:
  # ...

  comment_update:
    name: Post Update to PR
    after: [build_ios, build_android, publish_update]
    type: github-comment
    params:
      message: 'Testing builds ready for QA review'
      build_ids:
        - ${{ after.build_ios.outputs.build_id }}
        - ${{ after.build_android.outputs.build_id }}
      update_group_ids:
        - ${{ after.publish_update.outputs.first_update_group_id }}
```

</details>

<details>
<summary>排除构建、更新或部署</summary>

使用空数组排除特定内容类型。

```yaml .eas/workflows/pr-updates-only.yml
name: PR Updates Only

on:
  pull_request: {}

jobs:
  # ...

  comment_updates_only:
    name: Post Updates Only
    after: [publish_update]
    type: github-comment
    params:
      message: 'New update available for testing!'
      build_ids: [] # 空数组排除所有构建
      deployment_ids: [] # 空数组排除所有部署
      # update_group_ids 为 undefined = 自动发现更新
```

</details>

#### 载荷模式示例

<details>
<summary>使用 payload 的完全自定义评论</summary>

载荷模式让你完全控制评论内容。注意，使用 payload 时，你不能指定任何其他参数。

```yaml .eas/workflows/custom-pr-comment.yml
name: Custom PR Comment

on:
  pull_request: {}

jobs:
  # ...

  custom_comment:
    name: Post Custom Comment
    needs: [build_ios]
    type: github-comment
    params:
      # 载荷模式：完全控制内容
      # 不能把 message、build_ids 或 update_group_ids 与 payload 一起使用
      payload: |
        ## 🚀 Build Status Update

        ### iOS Build Completed
        - **Build ID**: `${{ needs.build_ios.outputs.build_id }}`
        - **Version**: ${{ needs.build_ios.outputs.app_version }}
        - **Build Number**: ${{ needs.build_ios.outputs.app_build_version }}

        ### Next Steps
        1. Download the build from [EAS Dashboard](https://expo.dev/accounts/[account]/projects/[project]/builds/${{ needs.build_ios.outputs.build_id }})
        2. Test on physical device
        3. Approve for TestFlight distribution

        ---
        *This comment was automatically generated by EAS Workflows*
```

</details>

<details>
<summary>基于构建状态的条件评论</summary>

此工作流根据构建成功或失败发布不同的评论。

```yaml .eas/workflows/conditional-comment.yml
name: Conditional PR Comment

on:
  pull_request: {}

jobs:
  build_android:
    name: Build Android
    type: build
    params:
      platform: android
      profile: preview

  comment_success:
    name: Post Success Comment
    needs: [build_android]
    if: ${{ needs.build_android.status == 'success' }}
    type: github-comment
    params:
      message: '✅ Android build succeeded! Ready for testing.'
      build_ids: # 仅用于说明，你也可以在这里省略它
        - ${{ needs.build_android.outputs.build_id }}

  comment_failure:
    name: Post Failure Comment
    after: [build_android]
    if: ${{ after.build_android.status == 'failure' }}
    type: github-comment
    params:
      payload: |
        ❌ **Android build failed**

        Please check the [workflow logs](https://expo.dev/accounts/[account]/projects/[project]/workflows) for details.
```

</details>

<a id="apple-device-registration-request"></a>

## Apple 设备登记请求

暂停工作流运行，直到一台 iOS 设备登记到特定的 [Apple 团队](https://expo.fyi/apple-team)，并且团队成员在 [expo.dev](https://expo.dev) 上批准该登记。使用此作业在 EAS Workflows 内自动化为[内部分发](/build/internal-distribution)登记设备。

当工作流到达此作业时，作业和运行进入 `action-required`，并保持暂停直到流程完成：

1. 工作流运行页面显示正在登记的设备的二维码和登记链接。
2. 在 iPhone 或 iPad 上，设备下载一个描述文件并通过“设置”安装它。一次只有一个描述文件准备好，如果八分钟内未安装就会被移除。
3. 安装之后，会收集唯一设备标识符（UDID）和元数据。
4. 在工作流运行页面上，团队成员批准或拒绝该登记。批准会把作业标记为成功，并把输出（UDID、型号等）暴露给下游作业。拒绝会使作业失败，并阻止使用 `needs` 的作业。

如果该 UDID 已经在你的账户上登记，作业仍会等待登记和批准后再继续。

### 语法

```yaml
jobs:
  register_device:
    type: apple-device-registration-request
    params:
      apple_team_identifier: string # 可选
```

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| apple_team_identifier | string | 可选。Apple 团队 ID（例如 `ABCDE12345`）。如果你省略此参数，并且你的 Expo 账户恰好有一个 Apple 团队，则使用该团队。当你的账户没有 Apple 团队或有两个及以上 Apple 团队时，你必须设置此参数。提供时，EAS 会根据该标识符解析或创建团队。 |

#### 输出

团队成员批准已登记的设备之后，你可以在后续作业中引用以下输出：

| 输出 | 类型 | 说明 |
| --- | --- | --- |
| apple_device_id | string | Expo 内部设备 ID。 |
| identifier | string | 设备 UDID。 |
| name | string | 设备名称。可能为空。 |
| model | string | 硬件型号字符串（例如 `iPhone11,2`）。可能为空。 |
| device_class | string | 设备类别：`iphone`、`ipad` 或 `mac`。可能为空。 |
| software_version | string | iOS 版本字符串。可能为空。 |

如果团队成员拒绝登记，作业失败并且不会设置输出。使用 `needs` 的下游作业不会运行。

### 示例

下面是使用 Apple 设备登记请求作业的一些实际示例：

<details>
<summary>登记设备并通知 Slack</summary>

此工作流登记一台 iOS 设备，并发送一条 Slack 消息，其中包含来自作业输出的设备 UDID 和型号。

```yaml .eas/workflows/register-device-slack.yml
name: Register iOS device and notify Slack

jobs:
  register_device:
    type: apple-device-registration-request
    params:
      apple_team_identifier: XX33YYZ44Z
  notify_slack:
    needs: [register_device]
    type: slack
    environment: production
    params:
      webhook_url: ${{ env.SLACK_WEBHOOK_URL }}
      message: 'Registered device ${{ needs.register_device.outputs.identifier }} (${{ needs.register_device.outputs.model }})'
```

</details>

<details>
<summary>登记设备，然后运行内部 iOS 构建</summary>

此工作流登记一台设备，然后运行刷新 ad hoc 描述文件的 iOS 内部分发构建，以便包含新设备。

```yaml .eas/workflows/register-device-build.yml
name: Register device and build iOS internal

jobs:
  register_device:
    type: apple-device-registration-request
    params:
      apple_team_identifier: ABCDE12345
  build_ios:
    needs: [register_device]
    type: build
    params:
      platform: ios
      profile: preview
      refresh_ad_hoc_provisioning_profile: true
```

`preview` profile 必须设置 [`distribution: internal`](/eas/json#distribution)，并使用[由 EAS 管理的凭据](/app-signing/app-credentials)。对于 CI，你还需要 App Store Connect API 密钥。见 [CI 上的内部分发](/build/internal-distribution#ci-上的自动化可选)和[从 CI 触发构建](/build/building-on-ci)。

</details>

<a id="require-approval"></a>

## 需要批准

在继续工作流之前需要用户批准。用户可以批准或拒绝，这会转化为作业的成功或失败。

### 语法

```yaml
jobs:
  require_approval:
    type: require-approval
```

#### 参数

此作业不接受任何参数。

### 示例

下面是使用需要批准作业的一些实际示例：

<details>
<summary>在部署到生产环境之前请求批准</summary>

此工作流把 Web 应用部署到预览环境，然后在部署到生产环境之前需要用户批准。

```yaml .eas/workflows/web.yml
jobs:
  web_preview:
    name: Deploy Web Preview
    type: deploy

  require_approval:
    name: Deploy Web to Production?
    needs: [web_preview]
    type: require-approval

  web_production:
    name: Deploy Web Production
    needs: [require_approval]
    type: deploy
    params:
      prod: true
```

</details>

<details>
<summary>控制工作流的流程</summary>

此工作流通过在揭示结局之前需要批准，让用户决定故事如何结束。

```yaml .eas/workflows/dragon-knight-interactive.yml
jobs:
  show_story_intro:
    name: Dragon and Knight Story Intro
    type: doc
    params:
      md: |
        # The Dragon and the Knight

        Once upon a time, in a land far away, a brave knight set out to face a mighty dragon.

        The dragon roared, breathing fire across the valley, but the knight stood firm, shield raised high.

        Now, the fate of their encounter is in your hands...

  require_approval:
    name: Should the knight and dragon become friends?
    needs: [show_story_intro]
    type: require-approval

  happy_ending:
    name: Friendship Ending
    needs: [require_approval]
    type: doc
    params:
      md: |
        ## A New Friendship

        The knight lowered his sword, and the dragon ceased its fire. They realized they both longed for peace. From that day on, they became the best of friends, protecting the kingdom together.

  epic_battle:
    name: Epic Battle Ending
    after: [require_approval]
    if: ${{ failure() }}
    type: doc
    params:
      md: |
        ## The Epic Battle

        The knight charged forward, and the dragon unleashed a mighty roar. Their battle shook the mountains and echoed through the ages. In the end, both were remembered as fierce and noble adversaries.
```

</details>

<a id="doc"></a>

## Doc

在工作流日志中显示一个 Markdown 部分。

### 语法

```yaml
jobs:
  show_whats_next:
    type: doc
    params:
      md: string
```

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| md | string | 必需。要显示的 Markdown 内容。你可以使用 `${{ ... }}` 工作流插值。 |

### 示例

下面是使用 Doc 作业的一些实际示例：

<details>
<summary>显示说明</summary>

此工作流构建 iOS 应用，然后在工作流日志中显示一个 Markdown 部分。

```yaml .eas/workflows/build-and-submit-ios.yml
jobs:
  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production

  submit:
    name: Submit to App Store
    type: submit
    needs: [build_ios]
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
      profile: production

  next_steps:
    name: Next Steps
    needs: [submit]
    type: doc
    params:
      md: |
        # To do next

        Your app has just been sent to [App Store Connect](https://appstoreconnect.apple.com/apps).

        1. Download the app from TestFlight.
        2. Test the app a bunch.
        3. Submit the app for review.
```

</details>

<a id="repack"></a>

## Repack

从已有构建重新打包应用。此作业重新打包应用的元数据和 JavaScript bundle，而不执行完整的原生重新构建，这对于创建与特定指纹兼容的更快构建很有用。

### 语法

```yaml
jobs:
  repack:
    type: repack
    runs_on: string # 可选 - 可用选项见 /build-reference/infrastructure
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
      after_checkout: step[] # 可选 - 作业检出项目之后运行的步骤。
      before_install_node_modules: step[] # 可选 - 作业安装依赖之前运行的步骤。
      after_install_node_modules: step[] # 可选 - 作业安装依赖之后运行的步骤。
```

:::note
如果构建可能仍在进行中，使用带 `wait_for_in_progress: true` 的 [`get-build`](#get-build)，然后把它的 `build_id` 传给 `repack`。
:::

### 常见问题

<details>
<summary>何时使用以及何时不要使用 repack？</summary>

Repack 作业适合以下用例：

- 通过复用已有构建减少 CI 构建时间
- 在需要时触发完整的原生构建
- 为团队提供更快的反馈循环

Repack 作业不适合以下用例：

- 需要构建走完整流水线以便正确符号化和应用签名的生产构建

</details>

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| build_id | string | 必需。要重新打包的构建的源构建 ID。 |
| profile | string | 可选。要使用的构建 profile。默认为从 `build_id` 检索到的源构建的 profile。 |
| embed_bundle_assets | boolean | 可选。是否在重新打包的构建中嵌入 bundle 资源。默认根据源构建自动决定。 |
| js_bundle_only | boolean | 可选。是否只重新打包 JavaScript bundle。默认为 false，这意味着整个应用元数据都会被更新。 |
| message | string | 可选。附加到构建的自定义消息。对应运行 `eas build` 时的 `--message` 标志。 |
| repack_version | string | 可选。要使用的 `@expo/repack-app` 版本。默认为最新版本。 |
| repack_package | string | 可选。要使用的 repack npm 包。默认为 `@expo/repack-app`。 |
| ios_signing_use_source_app_entitlements | boolean | 可选。是否使用 fastlane resign 的 `use_app_entitlements` 行为：提取应用 bundle 的代码签名授权，并把它们与新描述文件中的授权合并。默认为 false。 |
| ios_signing_app_entitlements_path | string | 可选。要使用的授权文件路径，例如 `myApp/MyApp.entitlements`。它与 `ios_signing_use_source_app_entitlements` 互斥。 |

#### 钩子

Repack 作业支持以下钩子：

- `after_checkout`：作业检出项目之后运行的步骤。
- `before_install_node_modules`：作业安装项目依赖之前运行的步骤。
- `after_install_node_modules`：作业安装项目依赖之后运行的步骤。

通用钩子语法见 [`jobs.<job_id>.hooks`](/eas/workflows/syntax#jobsjob_idhooks)。

### 示例

下面是把指纹与 Repack 作业一起使用的一些实际示例：

<details>
<summary>使用指纹和 Repack 的持续部署</summary>

此工作流首先生成指纹，然后根据该指纹是否已有兼容构建来构建或重新打包应用。最后，它运行 Maestro 测试。

```yaml .eas/workflows/cd-fingerprint-repack.yml
name: continuous-deploy-fingerprint

jobs:
  fingerprint:
    id: fingerprint
    type: fingerprint
    # 与构建 profile 的环境匹配
    environment: production

  android_get_build:
    needs: [fingerprint]
    id: android_get_build
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.android_fingerprint_hash }}
      platform: android

  android_repack:
    needs: [android_get_build]
    id: android_repack
    if: ${{ needs.android_get_build.outputs.build_id }}
    type: repack
    params:
      build_id: ${{ needs.android_get_build.outputs.build_id }}

  android_build:
    needs: [android_get_build]
    id: android_build
    if: ${{ !needs.android_get_build.outputs.build_id }}
    type: build
    params:
      platform: android
      profile: preview-simulator

  android_maestro:
    after: [android_repack, android_build]
    id: android_maestro
    type: maestro
    image: latest
    params:
      build_id: ${{ needs.android_repack.outputs.build_id || needs.android_build.outputs.build_id }}
      flow_path: ['maestro.yaml']

  ios_get_build:
    needs: [fingerprint]
    id: ios_get_build
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.ios_fingerprint_hash }}
      platform: ios

  ios_repack:
    needs: [ios_get_build]
    id: ios_repack
    if: ${{ needs.ios_get_build.outputs.build_id }}
    type: repack
    params:
      build_id: ${{ needs.ios_get_build.outputs.build_id }}

  ios_build:
    needs: [ios_get_build]
    id: ios_build
    if: ${{ !needs.ios_get_build.outputs.build_id }}
    type: build
    params:
      platform: ios
      profile: preview-simulator

  ios_maestro:
    after: [ios_repack, ios_build]
    id: ios_maestro
    type: maestro
    image: latest
    params:
      build_id: ${{ needs.ios_repack.outputs.build_id || needs.ios_build.outputs.build_id }}
      flow_path: ['maestro.yaml']
```

</details>
