---
title: 自动化 EAS CLI 命令
description: 了解如何用 EAS Workflows 自动化一系列 EAS CLI 命令。
---

# 自动化 EAS CLI 命令

如果你使用 EAS CLI 来构建、提交和更新应用，可以用 EAS Workflows 自动化一系列命令。EAS Workflows 可以构建、提交和更新你的应用，同时也可以运行 Maestro 测试、单元测试、自定义脚本等其他作业。

下面你会看到如何设置项目以使用 EAS Workflows，随后是常见的 EAS CLI 命令示例，以及如何用 EAS Workflows 运行它们。

## 配置你的项目

EAS Workflows 可选地支持关联到你的 EAS 项目的 GitHub 仓库来运行。本指南假设已关联 GitHub 仓库，并展示如何在推送到 GitHub 上的特定分支时触发工作流。你可以用以下步骤把 GitHub 仓库关联到 EAS 项目：

- 前往项目的 [GitHub 设置](https://expo.dev/accounts/%5Baccount%5D/projects/%5BprojectName%5D/github)。
- 按照界面安装 GitHub 应用。
- 选择与 Expo 项目匹配的 GitHub 仓库并连接它。

## 创建构建

你可以用 `eas build` 命令通过 EAS CLI 构建项目。要使用 `production` 构建 profile 做一次 iOS 构建，可以运行以下 EAS CLI 命令：

```sh
eas build --platform ios --profile production
```

要把此命令写成工作流，在项目根目录创建名为 **.eas/workflows/build-ios-production.yml** 的工作流文件。

在 **build-ios-production.yml** 中，你可以使用下面的工作流启动一个作业，用 `production` 构建 profile 创建 iOS 构建。

```yaml .eas/workflows/build-ios-production.yml
name: iOS production build

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

有了这个工作流文件之后，你可以通过向 `main` 分支推送提交来启动它，或运行以下 EAS CLI 命令：

```sh
eas workflow:run .eas/workflows/build-ios-production.yml
```

你可以提供参数来做 Android 构建或使用其他构建 profile。关于构建作业参数的更多信息，见[构建作业文档](/eas/workflows/syntax#build)。

## 提交构建

你可以用 `eas submit` 命令通过 EAS CLI 把应用提交到应用商店。要提交 iOS 应用，可以运行以下 EAS CLI 命令：

```sh
eas submit --platform ios
```

要把此命令写成工作流，在项目根目录创建名为 **.eas/workflows/submit-ios.yml** 的工作流文件。

提交作业需要要提交的构建 ID。在 **submit-ios.yml** 中，你可以使用下面的工作流创建 iOS 构建然后提交它：

```yaml .eas/workflows/submit-ios.yml
name: Submit iOS app

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
  submit_ios:
    name: Submit iOS
    needs: [build_ios]
    type: submit
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
```

要提交已有构建而不是创建新构建，把其 `build_id` 直接传给提交作业，或使用 [`get-build`](/eas/workflows/pre-packaged-jobs#get-build) 作业动态查找一个，并传递其 `build_id` 输出。

有了这个工作流文件之后，你可以通过向 `main` 分支推送提交来启动它，或运行以下 EAS CLI 命令：

```sh
eas workflow:run .eas/workflows/submit-ios.yml
```

你可以提供参数以使用其他提交 profile。关于提交作业参数的更多信息，见[提交作业文档](/eas/workflows/syntax#submit)。

## 发布更新

你可以用 `eas update` 命令通过 EAS CLI 更新应用。要更新应用，可以运行以下 EAS CLI 命令：

```sh
eas update --auto
```

要把此命令写成工作流，在项目根目录创建名为 **.eas/workflows/publish-update.yml** 的工作流文件。

在 **publish-update.yml** 中，你可以使用下面的工作流启动一个发送 OTA 更新的作业。

```yaml .eas/workflows/publish-update.yml
name: Publish update

on:
  push:
    branches: ['*']

jobs:
  update:
    name: Update
    type: update
    params:
      branch: ${{ github.ref_name || 'test'}}
```

有了这个工作流文件之后，你可以通过向任意分支推送提交来启动它，或运行以下 EAS CLI 命令：

```sh
eas workflow:run .eas/workflows/publish-update.yml
```

你可以提供参数以更新特定分支或频道，并配置更新的消息。关于更新作业参数的更多信息，见[更新作业文档](/eas/workflows/syntax#update)。

## 下一步

工作流是自动化开发和发布流程的有力方式。了解如何用工作流示例指南创建开发构建、发布预览更新和创建生产构建：

- [工作流示例](/eas/workflows/examples/introduction)：了解如何使用工作流创建开发构建、发布预览更新和创建生产构建。
