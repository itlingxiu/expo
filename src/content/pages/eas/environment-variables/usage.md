---
title: 在 EAS 中使用环境变量
description: 了解如何在 EAS 构建、更新、托管和工作流作业中使用环境变量。
---

# 在 EAS 中使用环境变量

以下各节介绍如何在 EAS 构建、更新和工作流作业中使用环境变量。

## 在 EAS Build 中使用环境变量

要完全掌控构建所用的环境，可以在 **eas.json** 的构建 profile 设置中指定 [`environment`](/eas/json#environment) 字段。

```json eas.json
{
  "build": {
    "development": {
      /* 使用 development 环境 */
      "environment": "development"
      /* ... */
    },
    "preview": {
      /* 使用 preview 环境 */
      "environment": "preview"
      /* ... */
    },
    "production": {
      /* 使用 production 环境 */
      "environment": "production"
      /* ... */
    },
    "my-profile": {
      /* 使用 production 环境 */
      "environment": "production"
      /* ... */
    }
  }
}
```

所选环境中的全部环境变量都会在构建过程中使用。在 EAS CLI 中根据动态应用配置解析构建配置时，明文和敏感变量同样可用。

如果没有设置 `environment` 选项，我们会根据构建配置自动设置环境：

- 当 `distribution` 设为 `store` 时使用 `production`
- 当 `developmentClient` 为 `true` 时使用 `development`
- 其余情况使用 `preview`

<details id="内置环境变量">
<summary>内置环境变量</summary>

以下环境变量是暴露给每个作业的额外系统环境变量，可以在任何构建步骤中使用。它们不属于任何项目环境，在本地求值 **app.config.js** 时也不可用：

- `CI=1`：表示这是 CI 环境
- `EAS_BUILD=true`：表示这是 EAS Build 环境
- `EAS_BUILD_PLATFORM`：`android` 或 `ios`
- `EAS_BUILD_RUNNER`：EAS Build 云构建为 `eas-build`，[本地构建](/build-reference/local-builds)为 `local-build-plugin`
- `EAS_BUILD_ID`：构建 ID，例如 `f51831f0-ea30-406a-8c5f-f8e1cc57d39c`
- `EAS_BUILD_PROFILE`：**eas.json** 中的构建 profile 名称，例如 `production`
- `EAS_BUILD_PROJECT_ID`：EAS 项目 ID，例如 `bd2f7e21-1ee7-47f2-8357-d7c4b50622fb`
- `EAS_BUILD_GIT_COMMIT_HASH`：Git 提交哈希，例如 `88f28ab5ea39108ade978de2d0d1adeedf0ece76`
- `EAS_BUILD_NPM_CACHE_URL`：npm 缓存的 URL（[进一步了解私有 npm 包](/build-reference/private-npm-packages)）
- `EAS_BUILD_MAVEN_CACHE_URL`：Maven 缓存的 URL（[进一步了解缓存 Android 依赖](/build-reference/caching#android-依赖)）
- `EAS_BUILD_COCOAPODS_CACHE_URL`：CocoaPods 缓存的 URL（[进一步了解缓存 iOS 依赖](/build-reference/caching#ios-依赖)）
- `EAS_BUILD_USERNAME`：发起构建的用户名（机器人用户为 undefined）
- `EAS_BUILD_WORKINGDIR`：项目所在的远程目录路径
- `EAS_BUILD_DISABLE_BUNDLE_JAVASCRIPT_STEP`：设为 `1` 可跳过早期 JavaScript 打包检查。默认情况下，EAS Build 会在原生构建之前运行 JavaScript 打包器，以便更早暴露 JS 错误。禁用这一步后，JavaScript 错误要到原生构建步骤才会被捕获。
- `EAS_BUILD_DISABLE_NPM_CACHE`：设为 `1` 可禁用 npm 缓存服务器（[进一步了解缓存 JavaScript 依赖](/build-reference/caching#javascript-依赖)）
- `EAS_BUILD_DISABLE_MAVEN_CACHE`：设为 `1` 可禁用 Maven 缓存服务器（[进一步了解缓存 Android 依赖](/build-reference/caching#android-依赖)）
- `EAS_BUILD_DISABLE_COCOAPODS_CACHE`：设为 `1` 可禁用 CocoaPods 缓存服务器（[进一步了解缓存 iOS 依赖](/build-reference/caching#ios-依赖)）

</details>

:::note
密钥类型的环境变量在 EAS CLI 解析构建配置时不可用，因为它们在 EAS 服务器之外不可读。
:::

## 在 EAS Update 中使用环境变量

在 **SDK 55 或更高版本**中，运行 `eas update` 时必须提供 `--environment` 标志。更新过程会使用指定 EAS 环境中的环境变量。对于使用 SDK 54 或更早版本的项目，省略 `--environment` 标志时，`eas update` 会回退到本地 **.env** 文件。

要在 EAS Update 中使用 EAS 环境变量，运行 `eas update` 命令并带上 `--environment` 标志：

```sh
eas update --environment production
```

使用 `--environment` 标志时，**更新过程只会使用指定 EAS 环境中的环境变量**，不会使用项目中的 **.env** 文件。这样可以保证更新和构建使用同一组环境变量。

Expo CLI 会把代码中带前缀的变量（例如 `process.env.EXPO_PUBLIC_VARNAME`）替换为 EAS 服务器上、由 `--environment` 标志指定的环境中对应的明文和敏感环境变量值。应用代码中的任何 `EXPO_PUBLIC_` 变量都会被内联替换为 EAS 环境中的对应值，无论是在本地机器上还是在 CI/CD 服务器上。

`--environment` 标志确保更新作业和构建作业使用同一组环境变量。

:::note
密钥变量在更新过程中不可用，因为它们在 EAS 服务器之外不可读。
:::

## 在 EAS Hosting 中使用环境变量

Expo Router Web 项目可以包含同时用于客户端和服务器的环境变量。运行 `npx expo export` 时，客户端值会被内联进 JavaScript 包；服务器端值存放在服务器上，并在运行 `eas deploy` 时随 API 路由一起部署。

:::warning
使用 EAS Hosting 时，只能使用 **明文** 和 **敏感** [环境变量](/eas/environment-variables#环境变量的可见性设置)。密钥不能随 EAS Hosting 一起部署。
:::

<details id="客户端环境变量">
<summary>客户端环境变量</summary>

所有在浏览器中运行的代码都是客户端代码。在 Expo Router 项目中，这包括所有不是 API Route 或服务器函数的代码。客户端代码中的环境变量在构建时被内联。你绝不应该把任何敏感信息放进客户端代码，因此所有客户端环境变量都必须带有 [`EXPO_PUBLIC_`](/guides/environment-variables) 前缀。

运行 `npx expo export` 时，所有 `process.env.EXPO_PUBLIC_*` 环境变量实例都会被替换为环境中的值。

</details>

<details id="服务端环境变量">
<summary>服务端环境变量</summary>

[API 路由](/router/web/api-routes)（以 **+api.ts** 结尾的文件）中的全部代码都在服务器上运行。由于在服务器上运行的代码对应用用户永远不可见，你可以安全地使用 API 密钥和令牌等敏感环境变量。

服务端环境变量不会内联进代码，而是在你运行 `eas deploy` 命令时随部署一起上传。

</details>

### 存储环境变量

使用 EAS 环境变量部署项目时，请注意客户端代码和服务端代码的环境变量是在不同步骤中纳入的：

- 运行 `npx expo export --platform web` 会把 `EXPO_PUBLIC_` 变量内联进前端代码。因此，在运行 `npx expo export` 命令之前，请确保 **.env.local** 文件包含正确的环境变量。
- `eas deploy --environment production` 会把给定环境（此例中为 `production`）的全部变量纳入 API 路由。用 `--environment` 标志加载的 EAS 环境变量，优先于 **.env** 和 **.env.local** 文件中定义的变量。

:::warning
**环境变量按部署生效，而部署是不可变的**。这意味着更改环境变量之后，你需要重新导出项目并重新部署，它们才会更新。
:::

### 用于本地开发

本地开发时，客户端和服务端环境变量都从[本地 **.env** 文件](/guides/environment-variables)加载，这些文件应被 git 忽略。如果使用 EAS 环境变量，用 [`eas env:pull`](/eas/environment-variables/manage#拉取变量用于本地开发) 获取 `development`、`preview` 或 `production` 的环境变量。

## 为其他命令使用环境变量

把非密钥的 EAS 环境变量提供给其他 EAS 命令的一种方式，是使用 `eas env:exec` 命令。

```sh
eas env:exec --environment production 'echo $APP_VARIANT'
```

例如，在更新包创建之后，用 [`SENTRY_AUTH_TOKEN`](/guides/using-sentry) 变量把 source map 上传到 Sentry 时，这会很有用。

```sh
eas env:exec --environment production 'npx sentry-expo-upload-sourcemaps dist'
```

## 在 EAS Workflows 中使用环境变量

### 为工作流作业设置 EAS 环境

省略 [`jobs.<job_id>.environment`](/eas/workflows/syntax#jobsjob_idenvironment) 时，默认值取决于作业类型：

- **构建作业**：环境来自 **eas.json** 中的构建 profile（`build.<profile>.environment`）。如果缺少该字段，则适用上文所述的自动默认值。参见[在 EAS Build 中使用环境变量](#在-eas-build-中使用环境变量)。
- **提交作业**：环境继承自被提交的构建。
- **Maestro 作业**（`maestro` 和 `maestro-cloud`）：环境默认为 `preview`。
- **其他作业**（例如 update、fingerprint、deploy 和自定义作业）：环境默认为 `production`。

在作业上显式设置 `environment`，可以覆盖其默认值，并与工作流中先前使用的构建 profile 保持同步。完整说明见[作业环境](/eas/workflows/environment#作业环境)。

在下面的例子中，构建作业配置为使用 `preview` profile，然后更新作业配置为使用同一个 EAS 环境。

```yaml .eas/workflows/publish-preview.yml
name: Publish preview build and update

jobs:
  build_preview:
    type: build
    params:
      platform: ios
      profile: preview # 使用 eas.json 中 build.preview.environment 的环境

  publish_preview_update:
    needs: [build_preview]
    type: update
    environment: preview # 从 preview 环境拉取变量
    params:
      branch: preview
```

在下面的例子中，fingerprint 作业配置为使用 `production` 环境，然后构建作业配置为使用同一个 EAS 环境。

```yaml .eas/workflows/fingerprint-and-build.yml
name: Fingerprint and build

jobs:
  fingerprint:
    type: fingerprint
    environment: production # 默认为 production，但显式设置以与构建匹配
  build_ios:
    needs: [fingerprint]
    type: build
    params:
      platform: ios
      profile: production # 使用 eas.json 中 build.production.environment 的环境
```

让作业环境的值与构建 profile 保持同步，以免密钥不匹配。例如，fingerprint 和 update 作业通常应与构建的 profile 环境一致。

### 在作业执行期间动态设置环境变量

你也可以在作业执行期间使用 `set-env` 命令动态设置环境变量。`set-env` 可执行文件位于 EAS Build worker 的 `PATH` 中，可用于设置在后续构建阶段可见的环境变量。

例如，你可以在某个 [EAS Build 钩子](/build-reference/npm-hooks)中加入以下内容，环境变量 `EXAMPLE_ENV` 将一直可用到构建作业结束。

```sh
set-env EXAMPLE_ENV "example value"
```

### 访问环境变量

创建环境变量之后，你可以在后续的 EAS Build 作业中读取它：在 Node.js 中使用 `process.env.VARIABLE_NAME`，在 shell 脚本中使用 `$VARIABLE_NAME`。
