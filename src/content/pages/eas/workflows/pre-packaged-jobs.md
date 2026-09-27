---
title: EAS Workflows 中的预置作业
description: 了解如何在 EAS Workflows 中设置和使用预置作业。
---

# EAS Workflows 中的预置作业

预置作业是开箱即用的工作流作业，帮助你自动化构建、提交和测试应用等常见任务。它们提供了一种标准化方式来处理这些操作，而不必从头编写自定义作业配置。本指南介绍可用的预置作业，以及如何在工作流中使用它们。

<a id="build"></a>

## 构建

把项目构建为 Android 或 iOS 应用。

构建作业可以自定义，以便你在构建过程中执行自定义命令。更多信息见[自定义构建](/custom-builds/get-started)。

- **为 EAS Build 配置的项目**

  你的项目必须为 EAS Build 设置好：**eas.json** 必须包含作业使用的构建 profile，并且必须为该平台配置应用签名凭据。可以在不先运行构建的情况下，通过运行 `eas credentials:configure-build -p <platform> -e <profile>` 来设置凭据，平台和 profile 与作业使用的相同。进一步了解[为 EAS Build 配置项目](/build/setup)。

### 语法

```yaml
jobs:
  build_app:
    type: build
    runs_on: string # 可选 - 可用选项见 /build-reference/infrastructure
    params:
      platform: android | ios # 必需
      profile: string # 可选 - 默认：production
      message: string # 可选
      refresh_ad_hoc_provisioning_profile: boolean # 可选
    hooks:
      before_install_node_modules: step[] # 可选 - 在构建安装依赖之前运行的步骤。
      after_install_node_modules: step[] # 可选 - 在构建安装依赖之后运行的步骤。
```

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| platform | string | **必需。** 要构建的平台。可以是 `android` 或 `ios`。 |
| profile | string | 可选。要使用的构建 profile。默认为 `production`。 |
| message | string | 可选。附加到构建的自定义消息。对应运行 `eas build` 时的 `--message` 标志。 |
| refresh_ad_hoc_provisioning_profile | boolean | 可选。在 iOS 内部分发构建开始之前刷新托管的 ad hoc 描述文件。对应运行 `eas build` 时的 [`--refresh-ad-hoc-provisioning-profile`](/eas/cli) 标志。见 [CI 上的内部分发](/build/internal-distribution#ci-上的自动化可选)。 |

#### 环境变量

如果在构建过程中需要某些环境变量，你可以在指定构建 `profile` 的 [eas.json](/eas/json#environment) 中包含它们。它们将从 [EAS 环境变量](/eas/environment-variables)中拉取。

#### 输出

你可以在后续作业中引用以下输出：

| 输出 | 类型 | 说明 |
| --- | --- | --- |
| build_id | string | 所创建构建的 ID。 |
| app_build_version | string | 应用的 version code/构建号。 |
| app_identifier | string | 应用的 bundle identifier/包名。 |
| app_version | string | 应用的版本。 |
| channel | string | 构建使用的更新频道。 |
| distribution | string | 使用的分发方式。可以是 `internal` 或 `store`。 |
| fingerprint_hash | string | 构建的指纹哈希。 |
| git_commit_hash | string | 构建使用的 git 提交哈希。 |
| platform | string | 构建所针对的平台。`android` 或 `ios`。 |
| profile | string | 使用的构建 profile。 |
| runtime_version | string | 使用的运行时版本。 |
| sdk_version | string | 使用的 SDK 版本。 |
| simulator | string | 构建是否用于模拟器。 |

#### 钩子

构建作业支持以下钩子：

- `before_install_node_modules`：在构建安装项目依赖之前运行的步骤。
- `after_install_node_modules`：在构建安装项目依赖之后运行的步骤。

通用钩子语法见 [`jobs.<job_id>.hooks`](/eas/workflows/syntax#jobsjob_idhooks)。

### 示例

下面是使用构建作业的一些实际示例：

<details>
<summary>针对特定平台的基本构建</summary>

此工作流在你推送到 main 分支时构建 iOS 应用。

```yaml .eas/workflows/build-ios.yml
name: Build iOS app

on:
  push:
    branches: ['main']

jobs:
  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production
```

</details>

<details>
<summary>并行构建两个平台</summary>

此工作流在你推送到 main 分支时并行构建 Android 和 iOS 应用。

```yaml .eas/workflows/build-all.yml
name: Build for all platforms

on:
  push:
    branches: ['main']

jobs:
  build_android:
    name: Build Android
    type: build
    params:
      platform: android
      profile: production

  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production
```

</details>

<details>
<summary>带环境变量的构建</summary>

此工作流使用可在构建过程中使用的自定义环境变量构建 Android 应用。

```yaml .eas/workflows/build-with-env.yml
name: Build with environment variables

on:
  push:
    branches: ['main']

jobs:
  build_android:
    name: Build Android
    type: build
    env:
      APP_ENV: production
      API_URL: https://api.example.com
    params:
      platform: android
      profile: production
```

</details>

<details>
<summary>使用不同 profile 的构建</summary>

此工作流使用不同的 profile 创建两个不同的 Android 构建——一个用于内部分发，一个用于商店提交，分别使用 development 和 production profile。

```yaml .eas/workflows/build-profiles.yml
name: Build with different profiles

on:
  push:
    branches: ['main']

jobs:
  build_android_development:
    name: Build Android Development
    type: build
    params:
      platform: android
      profile: development

  build_android_production:
    name: Build Android Production
    type: build
    params:
      platform: android
      profile: production
```

</details>

<details>
<summary>刷新了 ad hoc 描述文件的内部 iOS 构建</summary>

此工作流为内部分发构建你的 iOS 应用，并在你推送到 main 分支时刷新 ad hoc 描述文件。

```yaml .eas/workflows/build-ios-internal.yml
name: Build iOS internal

on:
  push:
    branches: ['main']

jobs:
  build_ios:
    name: Build iOS Internal
    type: build
    params:
      platform: ios
      profile: preview
      refresh_ad_hoc_provisioning_profile: true
```

</details>

<a id="deploy"></a>

## 部署

使用 [EAS Hosting](/eas/hosting/introduction) 部署你的应用。

- **为 EAS Hosting 设置的项目**

  设置说明见[开始使用 EAS Hosting](/eas/hosting/get-started#前置条件)。

### 语法

```yaml
jobs:
  deploy_web:
    type: deploy
    params:
      alias: string # 可选
      prod: boolean # 可选
      source_maps: boolean # 可选
    hooks:
      after_checkout: step[] # 可选 - 作业检出项目之后运行的步骤。
      before_install_node_modules: step[] # 可选 - 作业安装依赖之前运行的步骤。
      after_install_node_modules: step[] # 可选 - 作业安装依赖之后运行的步骤。
```

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| alias | string | 可选。要部署到的[别名](/eas/hosting/deployments-and-aliases#别名)。 |
| prod | boolean | 可选。是否部署到生产环境。 |
| source_maps | boolean | 可选。是否随部署上传 source map。 |

#### 输出

你可以在后续作业中引用以下输出：

| 输出 | 类型 | 说明 |
| --- | --- | --- |
| deploy_json | string | 包含部署详情的 JSON 对象（`npx eas-cli deploy --json` 的输出）。 |
| deploy_url | string | 部署的 URL。如果这是生产部署，则使用生产 URL。否则使用第一个别名 URL 或部署 URL。 |
| deploy_alias_url | string | 部署的别名 URL（例如 `https://account-project--alias.expo.app`）。 |
| deploy_deployment_url | string | 部署的唯一 URL（例如 `https://account-project--uniqueid.expo.app`）。 |
| deploy_identifier | string | 部署的标识符。 |
| deploy_dashboard_url | string | 部署仪表盘的 URL（例如 `https://expo.dev/projects/[project]/hosting/deployments`）。 |

#### 钩子

部署作业支持以下钩子：

- `after_checkout`：作业检出项目之后运行的步骤。
- `before_install_node_modules`：作业安装项目依赖之前运行的步骤。
- `after_install_node_modules`：作业安装项目依赖之后运行的步骤。

通用钩子语法见 [`jobs.<job_id>.hooks`](/eas/workflows/syntax#jobsjob_idhooks)。

### 示例

下面是使用部署作业的一些实际示例：

<details>
<summary>部署到生产环境的基本示例</summary>

此工作流使用 EAS Hosting 把应用部署到生产环境。

```yaml .eas/workflows/deploy-basic.yml
name: Basic Deployment

jobs:
  deploy:
    name: Deploy to Production
    type: deploy
    params:
      prod: true
```

</details>

<details>
<summary>仅在合并到 `main` 分支时部署到生产环境</summary>

此工作流在你合并到 main 分支时把应用部署到生产环境，并在所有其他分支上做非生产部署。

```yaml .eas/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: ['*']

jobs:
  deploy:
    name: Deploy
    type: deploy
    params:
      prod: ${{ github.ref_name == 'main' }}
```

</details>

<details>
<summary>使用自定义别名的部署</summary>

此工作流把应用部署到生产环境中的自定义别名。

```yaml .eas/workflows/deploy-alias.yml
name: Deployment with Alias

jobs:
  deploy:
    name: Deploy with Alias
    type: deploy
    params:
      alias: my-custom-alias
      prod: true
```

</details>

<a id="fingerprint"></a>

## 指纹

计算项目的指纹。

:::note
此作业类型只支持 [CNG](/workflow/continuous-native-generation) 工作流。如果你提交了 **android** 或 **ios** 目录，指纹作业将无法工作。
:::

:::note
为确保指纹与构建匹配，使用与构建 profile 相同的 `environment` 设置。对于环境变量，我们建议使用 [EAS 环境变量](/eas/environment-variables)，而不是 [`env`](/eas/workflows/syntax#jobsjob_idenv) 字段，以获得更好的一致性。
:::

### 语法

```yaml
jobs:
  fingerprint:
    type: fingerprint
    environment: production | preview | development # 可选，默认为 production
    env: # 可选的环境变量列表
      ENV_VAR_NAME: value
    hooks:
      after_checkout: step[] # 可选 - 作业检出项目之后运行的步骤。
      before_install_node_modules: step[] # 可选 - 作业安装依赖之前运行的步骤。
      after_install_node_modules: step[] # 可选 - 作业安装依赖之后运行的步骤。
```

#### 环境变量

你可以把环境变量列表传入 `env` 参数。这些环境变量将从 [EAS 环境变量](/eas/environment-variables)中拉取。传入的 `environment` 参数将用作环境变量的环境，当同一个环境变量在不同环境中定义时这很有用。

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| unstable_skip_cng_check | boolean | 可选。是否跳过 [持续原生生成（CNG）](/workflow/continuous-native-generation)兼容性检查。默认为 `false`。 |

#### 输出

你可以在后续作业中引用以下输出：

| 输出 | 类型 | 说明 |
| --- | --- | --- |
| android_fingerprint_hash | string | Android 的指纹哈希。 |
| ios_fingerprint_hash | string | iOS 的指纹哈希。 |

#### 钩子

指纹作业支持以下钩子：

- `after_checkout`：作业检出项目之后运行的步骤。
- `before_install_node_modules`：作业安装项目依赖之前运行的步骤。
- `after_install_node_modules`：作业安装项目依赖之后运行的步骤。

通用钩子语法见 [`jobs.<job_id>.hooks`](/eas/workflows/syntax#jobsjob_idhooks)。

### 示例

下面是使用指纹作业的一些实际示例：

<details>
<summary>基本指纹计算</summary>

此工作流为 Android 和 iOS 构建计算指纹。为了准确匹配指纹，`environment` 应当与你的构建 profile 匹配。

```yaml .eas/workflows/fingerprint-basic.yml
name: Basic Fingerprint

jobs:
  fingerprint:
    name: Calculate Fingerprint
    type: fingerprint
    # 与构建 profile 的环境匹配
    environment: production
```

</details>

<details>
<summary>带内联环境变量的指纹</summary>

:::note
如果你依赖内联环境变量，你需要始终确保在每个地方（构建 profile、指纹作业、更新作业等）把正确的一组环境变量设为正确的值，以便指纹匹配。**我们建议改用 [EAS 环境变量](/eas/environment-variables)**，你可以在其中把变量分组到环境中，并在构建 profile 和工作流作业中引用它们。
:::

```yaml .eas/workflows/fingerprint-with-env.yml
name: Fingerprint with Environment Variables

jobs:
  fingerprint:
    name: Calculate Fingerprint
    type: fingerprint
    environment: production
    # 最终环境将是 "production" 环境与内联环境变量的并集。
    # `env` 变量会覆盖 "production" 环境中同名的环境变量。
    env:
      APP_VARIANT: staging
      API_URL: https://api.staging.example.com
```

</details>

<a id="get-build"></a>

## 获取构建

从 EAS 检索与所提供参数匹配的已有构建。

### 语法

```yaml
jobs:
  get_build:
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

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| platform | string | 可选。要获取构建的平台。可以是 `ios` 或 `android`。 |
| profile | string | 可选。要使用的构建 profile。 |
| distribution | string | 可选。分发方式。可以是 `store`、`internal` 或 `simulator`。 |
| channel | string | 可选。更新频道。 |
| app_identifier | string | 可选。bundle identifier/包名。 |
| app_build_version | string | 可选。构建版本。 |
| app_version | string | 可选。应用版本。 |
| git_commit_hash | string | 可选。git 提交哈希。 |
| fingerprint_hash | string | 可选。指纹哈希。 |
| sdk_version | string | 可选。SDK 版本。 |
| runtime_version | string | 可选。运行时版本。 |
| simulator | boolean | 可选。是否获取模拟器构建。 |
| wait_for_in_progress | boolean | 可选。是否等待匹配的进行中构建。默认：`false`。 |

如果 `wait_for_in_progress` 设为 `true`，作业仍会优先立即继续使用成功的构建，但也会查找进行中的构建。如果找不到成功的构建，作业会等待进行中的构建完成后再继续。如果匹配的构建成功，作业会被标记为成功，并返回该成功构建。如果匹配的构建失败，作业会被标记为成功，并且其输出为空——就像没有匹配到构建一样。

#### 输出

你可以在后续作业中引用以下输出：

| 输出 | 类型 | 说明 |
| --- | --- | --- |
| build_id | string | 检索到的构建的 ID。 |
| app_build_version | string | 应用的构建版本。 |
| app_identifier | string | 应用的 bundle identifier/包名。 |
| app_version | string | 应用的版本。 |
| channel | string | 构建使用的更新频道。 |
| distribution | string | 使用的分发方式。 |
| fingerprint_hash | string | 构建的指纹哈希。 |
| git_commit_hash | string | 构建使用的 git 提交哈希。 |
| platform | string | 构建所针对的平台。 |
| profile | string | 使用的构建 profile。 |
| runtime_version | string | 使用的运行时版本。 |
| sdk_version | string | 使用的 SDK 版本。 |
| simulator | string | 构建是否用于模拟器。 |

### 示例

下面是使用 get-build 作业的一些实际示例：

<details>
<summary>获取最新的生产构建</summary>

此工作流从商店分发渠道检索 iOS 的最新生产构建。

```yaml .eas/workflows/get-build-production.yml
name: Get Production Build

jobs:
  get_build:
    name: Get Latest Production Build
    type: get-build
    params:
      platform: ios
      profile: production
      distribution: store
      channel: production
```

</details>

<details>
<summary>按版本获取构建</summary>

此工作流按应用版本和构建版本检索特定版本的 Android 构建。

```yaml .eas/workflows/get-build-version.yml
name: Get Build by Version

jobs:
  get_build:
    name: Get Specific Version Build
    type: get-build
    params:
      platform: android
      app_identifier: com.example.app
      app_version: 1.0.0
      app_build_version: 42
```

</details>

<details>
<summary>获取模拟器构建</summary>

此工作流检索用于 iOS 开发的模拟器构建。`wait_for_in_progress` 设为 `true`，因此如果已存在匹配过滤器的构建，作业会等待它完成后再继续。

```yaml .eas/workflows/get-build-simulator.yml
name: Get Simulator Build

jobs:
  get_build:
    name: Get Simulator Build
    type: get-build
    params:
      platform: ios
      simulator: true
      profile: development
      wait_for_in_progress: true
```

</details>

<a id="submit"></a>

## 提交

使用 EAS Submit 把 Android 或 iOS 构建提交到应用商店。

- **CI/CD 提交配置**

  提交作业需要额外配置才能在 CI/CD 流程中运行。更多信息见 [Google Play 商店 CI/CD 提交指南](/submit/android#用-eas-workflows-自动化)和 [Apple App Store CI/CD 提交指南](/submit/ios#用-eas-workflows-自动化)。

### 语法

```yaml
jobs:
  submit_to_store:
    type: submit
    params:
      build_id: string # 必需
      profile: string # 可选 - 默认：production
      groups: string[] # 可选
    hooks:
      after_checkout: step[] # 可选 - 作业检出项目之后运行的步骤。
      before_install_node_modules: step[] # 可选 - 作业安装依赖之前运行的步骤。
      after_install_node_modules: step[] # 可选 - 作业安装依赖之后运行的步骤。
      before_submit: step[] # 可选 - 提交开始之前运行的步骤。
      after_submit: step[] # 可选 - 提交完成之后运行的步骤。
```

#### 参数

你可以把以下参数传入 `params` 列表：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| build_id | string | 必需。要提交的构建 ID。 |
| profile | string | 可选。要使用的提交 profile。默认为 `production`。 |
| groups | string[] | 可选。要把构建加入的 TestFlight 内部组名称。更多 TestFlight 分发选项见 [TestFlight 作业](#testflight)。 |

#### 输出

你可以在后续作业中引用以下输出：

| 输出 | 类型 | 说明 |
| --- | --- | --- |
| apple_app_id | string | 已提交构建的 Apple App ID。 |
| ios_bundle_identifier | string | 已提交构建的 iOS bundle identifier。 |
| android_package_id | string | 已提交构建的 Android 包 ID。 |

#### 钩子

提交作业支持以下钩子：

- `after_checkout`：作业检出项目之后运行的步骤。
- `before_install_node_modules`：作业安装项目依赖之前运行的步骤。
- `after_install_node_modules`：作业安装项目依赖之后运行的步骤。
- `before_submit`：提交开始之前运行的步骤。
- `after_submit`：提交完成之后运行的步骤。

通用钩子语法见 [`jobs.<job_id>.hooks`](/eas/workflows/syntax#jobsjob_idhooks)。

### 示例

下面是使用提交作业的一些实际示例：

<details>
<summary>提交 iOS 构建</summary>

此工作流使用生产提交 profile 把 iOS 构建提交到 App Store。

```yaml .eas/workflows/submit-ios.yml
name: Submit iOS Build

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
```

</details>

<details>
<summary>提交 Android 构建</summary>

此工作流使用生产提交 profile 把 Android 构建提交到 Play 商店。

```yaml .eas/workflows/submit-android.yml
name: Submit Android Build

jobs:
  build_android:
    name: Build Android
    type: build
    params:
      platform: android
      profile: production

  submit:
    name: Submit to Play Store
    type: submit
    needs: [build_android]
    params:
      build_id: ${{ needs.build_android.outputs.build_id }}
      profile: production
```

</details>

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
