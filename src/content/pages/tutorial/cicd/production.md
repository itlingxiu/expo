---
title: 用 EAS Workflows 自动化生产部署
description: 学习如何从发布分支用 EAS Workflows 为 Android 和 iOS 自动化生产构建与 OTA 更新。
---

# 用 EAS Workflows 自动化生产部署

当大多数变更只涉及 TypeScript/JavaScript 时，为每一次生产变更都重新构建应用是一种浪费。

## 学习成果

- 从 `release/*` 分支触发生产部署，而不是在每次推送到 `main` 时都触发
- 根据项目指纹，在原生构建和 [OTA 更新](/deploy/send-over-the-air-updates) 之间分支
- 把自动提交到应用商店作为生产工作流中的后续步骤

### 前提条件

**已为生产配置 EAS Build**

第一次为某个 profile 触发构建时，[EAS CLI](/eas/cli) 会提示生成凭据。在工作流运行之前，先为 Android 和 iOS 手动触发一次生产构建，使凭据已经存在：

```sh
eas build --profile production --platform all
```

## 使用发布分支

此前在开发构建中，我们已经看到使用 `on.push.branches` 触发器会在每次推送到指定的 `main` 分支时运行工作流。对于生产部署，在每次推送到 `main` 时都触发工作流，意味着每一次合并的变更都是一次新发布。团队通常希望有一个经过考虑的发布过程，因此会改用发布分支或标签。

在发布分支策略中，我们通常用 `release/*` 这样的模式指定分支，其中 `*` 是功能或版本名称。这就是持续集成（CI）与持续交付（CD）的分界。CI 在每次推送到 `main` 分支时运行，而 CD 在团队准备部署到生产环境时于发布分支上运行。

下表说明每个工作流的触发器如何定义它的用途：

| 工作流文件 | 触发器 | 构建 profile | 用途 |
| --- | --- | --- | --- |
| **.eas/workflows/build.yml** | `on.push.branches: ['main']` | `development` | CI 工作流，在每次推送到 `main` 分支时运行。它可以运行单元测试并生成开发构建。 |
| **.eas/workflows/preview.yml** | `on.push.branches: ['main']` | `preview` | 预览工作流，在每次推送到 `main` 分支时运行。它可以生成预览构建，用于内部测试以及与相关方分享。 |
| **.eas/workflows/production.yml** | `on.push.branches: ['release/*']` | `production` | CD 工作流，在每次推送到发布分支时运行。 |

上面这些文件可以共存于项目的 GitHub 仓库中，互不冲突。每个文件使用不同的构建 profile 和触发器。

> 示意图展示如何根据指纹在两种路径之间选择：原生代码变化时创建生产构建；只有 JavaScript 变化时发布 OTA 更新。

## 用于生产构建的 `build` 作业类型

先创建一个生产工作流。它使用 EAS Workflows 的[预置](/tutorial/cicd/first-workflow#eas-workflows-中的作业类型) `build` 作业类型，并为 Android 和 iOS 都运行。

### 1. 添加 production.yml

在 **.eas/workflows/** 中创建一个名为 **production.yml** 的新文件，它使用 **eas.json** 中的 `production` 构建 profile：

```yaml .eas/workflows/production.yml
name: Deploy to production

on:
  push:
    branches: ['release/*']

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

这会在推送到任何匹配 `release/*` 模式的分支时，为 Android 创建 **.aab** 产物，为 iOS 创建 **.ipa** 产物。

### 2. 给工作流添加指纹

给工作流添加一个 [`fingerprint`](/eas/workflows/pre-packaged-jobs#fingerprint) 作业，检查原生代码是否有变化，并据此更新现有的 `build_android` 和 `build_ios` 作业。我们还会添加 [`get-build`](/eas/workflows/pre-packaged-jobs#get-build) 作业，查找 Android 和 iOS 的现有构建。

用以下代码更新 **production.yml**：

```yaml .eas/workflows/production.yml
name: Deploy to production

on:
  push:
    branches: ['release/*']

jobs:
  fingerprint:
    name: Fingerprint
    type: fingerprint
    environment: production
  get_android_build:
    name: Check for existing Android build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.android_fingerprint_hash }}
      profile: production
  get_ios_build:
    name: Check for existing iOS build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.ios_fingerprint_hash }}
      profile: production
  build_android:
    name: Build Android
    needs: [get_android_build]
    if: ${{ !needs.get_android_build.outputs.build_id }}
    type: build
    params:
      platform: android
      profile: production
  build_ios:
    name: Build iOS
    needs: [get_ios_build]
    if: ${{ !needs.get_ios_build.outputs.build_id }}
    type: build
    params:
      platform: ios
      profile: production
```

在上面的工作流中，`fingerprint` 作业先运行，并根据代码库中的变更生成一个哈希。然后 `get-build` 作业检查 Android 和 iOS 是否已有相同指纹哈希的构建。如果没有现有构建，`build` 作业会运行，为生产环境创建新构建。

`fingerprint` 作业上的 [`environment`](/eas/workflows/syntax#jobsjob_idenvironment) 字段告诉 EAS 在计算指纹时加载哪些环境变量。我们的生产环境中，`API_URL` 或功能开关等变量的值可能不同。当 EAS 把这些值烘焙进构建时，它们可能影响原生层。设置 `environment: production` 可以确保指纹反映实际发布的内容。

`build_android` 和 `build_ios` 作业上使用的 [`if`](/eas/workflows/syntax#jobsjob_idif) 字段是一个布尔表达式。当它求值为 `false` 时，构建作业会被跳过。`!` 运算符表示构建作业只在 `get-build` 没有找到匹配构建时运行。

### 3. 为更新添加作业

目前，我们的工作流只在原生代码有变化时创建生产构建。如果只有 TypeScript/JavaScript 文件的变化，我们希望触发一次 OTA 更新，而不是原生构建。

添加两个作业 `update_android` 和 `update_ios`。它们在原生代码没有变化时运行，并使用 `update` 作业类型触发 OTA 更新：

```yaml .eas/workflows/production.yml
name: Deploy to production

on:
  push:
    branches: ['release/*']

jobs:
  fingerprint:
    # ...
  get_android_build:
    # ...
  get_ios_build:
    # ...
  build_android:
    # ...
  build_ios:
    # ...
  update_android:
    name: Publish Android update
    needs: [get_android_build]
    if: ${{ needs.get_android_build.outputs.build_id }}
    type: update
    params:
      branch: production
      platform: android
  update_ios:
    name: Publish iOS update
    needs: [get_ios_build]
    if: ${{ needs.get_ios_build.outputs.build_id }}
    type: update
    params:
      branch: production
      platform: ios
```

我们的工作流只会构建可用于生产的应用二进制文件，或发布 OTA 更新。自动提交到商店是常见的下一步，见下文[自动提交到应用商店](#自动提交到应用商店)。

### 4. 创建发布分支并推送变更

:::note
请确保此时工作流文件已经是 GitHub 仓库的一部分，并且在 `main` 分支上可用。
:::

要测试工作流，从终端窗口创建一个发布分支并推送到 GitHub 仓库：

```sh
git checkout -b release/1.0.0 && git push origin release/1.0.0
```

打开 EAS 仪表板并找到这次工作流运行。由于这个指纹还没有任何构建，`build` 作业应该运行，`update` 作业应该显示为灰色。

![EAS Workflows 仪表板，展示一次发布分支上的生产运行，包含 fingerprint、get-build，以及 Android 和 iOS 构建作业。](/static/images/tutorial/cicd/eas-workflows-production-build-jobs.png)

Android 和 iOS 构建正在并行运行。每个作业完成后，我们会收到 Android 和 iOS 的新产物。

现在，在同一发布分支上对示例项目只做一处 TypeScript/JavaScript 修改，并用下面的命令再次推送：

```sh
git add . && git commit -m 'Update welcome text' && git push origin release/1.0.0
```

工作流运行后，在 EAS 仪表板上注意指纹与上一次推送的构建匹配。`build` 作业被完全跳过，`update` 作业发布一次 OTA 更新。

![EAS Workflows 生产运行通过指纹匹配复用现有原生构建，并发布 Android 和 iOS 的 OTA 更新。](/static/images/tutorial/cicd/eas-workflows-production-update-jobs.png)

## 自动提交到应用商店

本章构建的工作流只会构建可用于生产的应用二进制文件，或向现有的生产应用发布 OTA 更新。[自动提交到商店](/build/automate-submissions)是生产发布工作流中常见的下一步。

EAS Workflows 提供 `submit` 预置作业来自动化应用商店提交。它要求我们用 EAS CLI 管理应用商店凭据。它也要求我们满足应用商店的要求，例如手动把第一个 Android 发布（**.aab**）上传到 Google Play Store。iOS 则有自己的 Apple Developer Program 注册和签名凭据需要设置。

应用商店要求就绪后，可以在工作流中添加两个新作业 `submit_android` 和 `submit_ios`，它们在 `build` 作业之后运行：

```yaml .eas/workflows/production.yml
# rest of the workflow file

submit_android:
  name: Submit Android
  needs: [build_android]
  type: submit
  params:
    build_id: ${{ needs.build_android.outputs.build_id }}
submit_ios:
  name: Submit iOS
  needs: [build_ios]
  type: submit
  params:
    build_id: ${{ needs.build_ios.outputs.build_id }}
```

上面的 `submit_android` 和 `submit_ios` 作业需要 `build_id` 参数，以便知道向应用商店提交哪一次构建。它们只在 `build_android` 和 `build_ios` 作业运行时才会运行，这意味着创建了一次新的生产构建。如果只有 TypeScript/JavaScript 文件的变化，由于没有创建新构建，`submit` 作业同样会被跳过。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
