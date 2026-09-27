---
title: CI/CD 教程：简介
description: 介绍 EAS Workflows 教程，以及为 Expo 和 React Native 应用搭建 CI/CD 流水线的核心概念。
---

# CI/CD 教程：简介

构建、测试并交付一个 Expo 和 React Native 应用，很少是一步就能完成的。每一次代码变更都会走过相似的流程：为 Android 和 iOS 构建、运行单元测试和端到端（E2E）测试，再交给队友、QA 或应用商店。在每次提交上都手工做这些事很快就会变得乏味，而这正是 CI/CD 流水线该替我们处理的工作。

完成本教程后，向 Expo 项目的每一次推送都会自动构建、测试或发布。实现这一点的服务是 [EAS Workflows](/eas/workflows/introduction)，它是 Expo Application Services（EAS）为 Expo 和 React Native 应用提供的持续集成（CI）/持续交付（CD）服务。

我们在 Expo 项目根目录的 **.eas/workflows/** 中用 [YAML](https://en.wikipedia.org/wiki/YAML) 文件定义工作流。下面是一个完整示例：每当向 GitHub 仓库的 `main` 分支推送时，构建一个 Android 开发构建：

```yaml .eas/workflows/build.yml
name: Build Android

on:
  push:
    branches: ['main']

jobs:
  build:
    type: build
    params:
      platform: android
      profile: development
```

这几行就是整个工作流，其余由 EAS 处理。本教程会在这个模式上逐步展开。

## 为什么使用 EAS Workflows？

EAS Workflows 可以运行 Android、iOS 和 Web 构建，发布 [OTA 更新](/deploy/send-over-the-air-updates)，提交到应用商店，并用 Maestro 运行 E2E 测试，全部像上面的示例一样定义在 YAML 文件中。作业在托管的云环境中运行，因此我们不需要自己搭建或维护构建服务器。

可以从 GitHub 事件（推送、拉取请求、标签或 label）触发工作流，也可以按计划（cron）触发，或用 [EAS CLI](/eas/cli) 手动触发。

## 涵盖的主题

本教程分为三部分：

- **开发。** 创建自定义作业，用[指纹](/tutorial/cicd/development-builds)自动化[开发构建](/develop/development-builds/introduction)，并为相关方发布[拉取请求（PR）预览更新](/tutorial/cicd/preview-builds)。
- **测试与发布。** 在工作流中用 Maestro 运行 E2E 测试，然后创建一个生产工作流，用指纹在原生构建和 OTA 更新之间做出选择。
- **扩展。** 把生产触发器从分支切换为版本标签，并用 [EAS Hosting](/eas/hosting/introduction) 部署 Web 构建。

## 值得先了解的概念

:::tip
已经熟悉 EAS Build 和 EAS Update？可以跳到下一节。
:::

在创建第一个工作流之前，有几个概念值得先了解：

<details>
<summary>Expo 应用可以发布到哪里？</summary>

一个 Expo 应用可以发布到三个目标。具体是哪一个、由哪项 EAS 服务交付，取决于代码改了什么：

| 目标 | EAS 服务 | 何时使用 |
| --- | --- | --- |
| 应用商店 | EAS Build 和 EAS Submit | 新版本、原生代码变更 |
| 已安装的设备 | EAS Update | 仅 TypeScript/JavaScript 的修复，几秒内通过空中下载交付 |
| Web | EAS Hosting | 与原生发布一起提供的 Web 应用 |

</details>

<details>
<summary>构建 profile</summary>

[EAS Build](/build/introduction) 是为 Expo 项目构建应用二进制文件的服务。它默认支持三种构建 profile：`development`、`preview` 和 `production`。每种 profile 对应开发的不同阶段。本教程会用到这三种 profile。

</details>

<details>
<summary>构建与更新</summary>

与 EAS Build 一样，[EAS Update](/eas-update/introduction) 是一项服务，使用 [`expo-updates`](/versions/latest/sdk/updates) 库为 Expo 项目提供 OTA 更新。

> 示意图对比了两种交付方式：EAS Build 把原生代码编译成完整的应用二进制文件；EAS Update 把 TypeScript/JavaScript 变更通过空中下载发送到已安装兼容原生构建的设备。

- EAS Build 把原生代码编译成完整的应用二进制文件。构建耗时更长。当项目中的原生代码发生变化时，需要一次新的构建。例如添加新的原生库、更改权限，或升级 Expo SDK。
- EAS Update 把 TypeScript/JavaScript 变更通过空中下载发送到已经安装了兼容原生构建的设备。如果某次变更需要原生代码，应先创建并安装该构建，再发布更新。这样，每次更新都与它所针对的构建保持兼容。发布一次更新本身只需几秒。例如，可以发布一次更新来修复 UI 缺陷，或修改按钮上的文案。

根据变更的内容，我们使用其中一种服务。EAS Workflows 把它们接在一起，让流水线能够决定何时构建、何时发布更新。

</details>

## 前提条件

:::tip
已经有一个配置好 EAS Build 和 EAS Update 的 Expo 项目？可以跳到下一章。
:::

本教程是动手实践。要继续推进，我们需要一个使用[持续原生生成](/workflow/continuous-native-generation)的现有 Expo 项目。按以下要求在本机和 EAS 上完成设置：

**一个 Expo 账户**

我们需要[注册](https://expo.dev/signup)一个 Expo 账户。

**安装 EAS CLI 并登录**

要安装 EAS CLI，运行以下命令：

:::tabs
:::tab npm
```sh
npm install --global eas-cli
```
:::
:::tab yarn
```sh
yarn global add eas-cli
```
:::
:::tab pnpm
```sh
pnpm add -g eas-cli
```
:::
:::tab bun
```sh
bun add -g eas-cli
```
:::
:::

然后运行以下登录命令，用 Expo 账户对 EAS CLI 进行身份验证：

```sh
eas login
```

**创建一个 Expo 项目**

要创建一个新的 Expo 项目，运行以下命令：

:::tabs
:::tab npm
```sh
npx create-expo-app@latest
```
:::
:::tab yarn
```sh
yarn create expo-app
```
:::
:::tab pnpm
```sh
pnpm create expo-app
```
:::
:::tab bun
```sh
bun create expo
```
:::
:::

用 `create-expo-app` 创建新项目时，不会把原生的 **android** 和 **ios** 目录提交进仓库。这种模式称为持续原生生成（CNG），EAS Build 会自动为我们创建这些原生项目目录。

**在项目中初始化 EAS**

要在项目中初始化 EAS，运行以下命令：

```sh
eas build:configure
```

这会在 Expo 项目根目录生成 **eas.json**，并创建一个与本地项目关联的 EAS 项目。

**把 GitHub 仓库关联到 EAS 仪表板**

项目需要一个 GitHub 仓库。可以新建仓库，也可以使用现有仓库。然后把 GitHub 仓库连接到 EAS：

1. 在 EAS 仪表板中打开项目的 [GitHub 设置](https://expo.dev/accounts/[account]/projects/[projectName]/github)。
2. 按仪表板中的界面安装 Expo GitHub 应用。
3. 选择与该 Expo 项目对应的 GitHub 仓库并连接。

**为 EAS Submit 保存商店提交凭据（可选）**

只有在第 5 章之后把自动提交到应用商店作为改编内容加上时才需要。参见 [Google Play Store](/submit/android) 和 [Apple App Store](/submit/ios) 指南，了解如何为 EAS Submit 配置凭据。

## 从 GitHub Actions 过来？

EAS Workflows 文件位于 Expo 项目根目录的 **.eas/workflows/** 目录，类似于 GitHub Actions 工作流位于 **.github/workflows/**。触发器语法（`on.push`、`on.pull_request` 等）看起来也非常相似。

主要区别是预置作业：设置 `type: build` 后，由 EAS 处理环境和构建产物，不需要自己写 `runs-on` 或安装步骤。我们会在后面逐步介绍。

:::note
EAS Workflows 可以与 GitHub Actions 并行运行，GitHub Actions 作业也可以用 `eas workflow:run` 触发工作流。更多信息参见 [How to integrate EAS Workflows with GitHub Actions](https://expo.dev/blog/how-to-integrate-eas-workflows-with-github-actions)。
:::

## 下一步

项目设置好之后，就可以进入第一章，编写第一个工作流。

[开始](/tutorial/cicd/first-workflow)

用 EAS Workflows 创建并运行我们的第一个工作流。
