---
title: EAS Workflows 简介
description: EAS Workflows 是一项 CI/CD 服务，用于自动化 React Native 和 Expo 应用的构建、更新、提交和测试。
---

# EAS Workflows 简介

**EAS Workflows** 是来自 EAS（Expo Application Services）的 CI/CD 服务，用于自动化重复任务，例如构建 Android 和 iOS 二进制文件、发布 OTA 更新、提交到应用商店、运行 E2E 测试，以及把 Web 应用部署到 EAS Hosting。

EAS Workflows 在托管的云环境中运行，并带有专门为移动应用开发设计的预置作业类型。当 EAS 项目关联到 GitHub 时，团队可以从 GitHub 事件（push、拉取请求、标签）或计划（cron）触发工作流，或通过 EAS CLI 手动运行它们。

> 视频：[开始使用 EAS Workflows](https://www.youtube.com/watch?v=OJ2u9tQCpr4)。了解如何自动化每个应用开发团队都必须处理的一些最常见流程：创建开发构建、发布预览更新，以及部署到生产。

## 快速开始

:::note
下面的 `eas` 命令需要 EAS CLI。更多信息见[如何安装 EAS CLI](/eas/cli#安装)。
:::

要创建你的第一个工作流，运行以下命令并按照提示操作：

```sh
eas workflow:create
```

## 开始使用

工作流定义为项目根目录 **.eas/workflows/** 目录中的 YAML 文件。每个文件指定一个 `name`、可选的触发器（`on`），以及一个或多个在云中运行的 `jobs`。入门指南会带你完成前置条件和第一次工作流运行：

- [创建你的第一个工作流](/eas/workflows/get-started)：设置项目并用工作流创建开发构建。

### 面向 AI agent 的 Expo Skills

如果你使用 AI agent，安装 [Expo Skills](/skills) 来教它如何编写和调试工作流 YAML 文件。相关技能：`eas-workflows`。

## 关键特性

- **预置作业**：[开箱即用的作业](/eas/workflows/pre-packaged-jobs)，用于构建、提交和更新应用、运行 Maestro E2E 测试、发送 Slack 消息等。[自定义作业](/eas/workflows/syntax#custom-jobs)可以运行你需要的任何命令。
- **灵活的触发器**：在 [GitHub 事件](/eas/workflows/syntax#on)（push、拉取请求、标签、分支或标签删除）、cron 计划、[App Store Connect 事件](/eas/workflows/syntax#onapp_store_connect)上运行工作流，用 `eas workflow:run` 手动运行，或从 [REST API](/eas/workflows/rest-api) 运行。
- **无需管理基础设施**：作业在 EAS 托管的 macOS 和 Linux worker 上运行，因此你不需要维护 CI 服务器，也不需要配置 Android Studio 和 Xcode。
- **一切都在一个仪表盘上**：构建、更新、测试结果、产物和日志都出现在 [expo.dev](https://expo.dev/) 上。
- **更快的发布**：组合 `fingerprint`、`get-build` 和 `update` 作业，以跳过冗余的原生构建，并在可能时发布 OTA 更新。

## 何时使用 EAS Workflows

| 场景 | 建议 |
| --- | --- |
| 自动化构建、应用商店提交、OTA 更新和 Web 部署 | 推荐 |
| 把 Web 应用部署到 EAS Hosting | 推荐 |
| 把 Maestro E2E 测试作为 CI 的一部分运行 | 推荐 |
| 从 GitHub push 或拉取请求事件触发构建和更新 | 推荐 |
| 无需管理自己的基础设施或 macOS 机器的 CI/CD | 推荐 |
| 依赖非 EAS 服务（Docker、自定义 runner）的高度定制流水线 | 不推荐 |

## 常见问题（FAQ）

<details open>
<summary>工作流与其他 CI 服务相比如何？</summary>

EAS Workflows 旨在帮助你和你的团队发布应用。它预配置了可以构建、提交、更新、运行 Maestro 测试等的预置作业类型。所有作业类型都在 EAS 上运行，因此你只需要管理一套 YAML 文件，并且作业运行的所有产物都会出现在 [expo.dev](https://expo.dev/) 上。

其他 CI 服务，例如 CircleCI 和 GitHub Actions，更加通用，能够做的事情比工作流更多。不过，那些服务也要求你更了解每个作业的实现。虽然在某些情况下这是必要的，但工作流通过预置应用开发者最基本的作业类型，帮助你快速完成常见任务。此外，工作流旨在为手头的任务提供尽可能快的云机器，并且我们会不断为你更新它们。

EAS Workflows 非常适合与 Expo 应用相关的操作，而其他 CI/CD 服务会为其他类型的工作流提供更好的体验。

</details>

<details>
<summary>可以不使用 GitHub 触发工作流吗？</summary>

可以。无论 `on` 触发器配置如何，任何工作流都可以用 `eas workflow:run` 手动运行。你也可以使用带有 cron 语法的计划触发器。

</details>

<details>
<summary>工作流在什么云机器上运行？</summary>

工作流在 EAS 的托管基础设施上运行：

- **Linux worker**：`linux-medium`（4 vCPU、16 GB RAM）或 `linux-large`（8 vCPU、32 GB RAM）
- **带嵌套虚拟化的 Linux**，用于 Android 模拟器：`linux-medium-nested-virtualization` 或 `linux-large-nested-virtualization`
- **macOS worker**，用于 iOS 构建和模拟器：`macos-medium`（5 核、20 GB RAM）或 `macos-large`（10 核、40 GB RAM）

</details>

<details>
<summary>工作流可以并行运行作业吗？</summary>

可以。没有依赖的作业默认并行运行。

使用 `needs` 指定某个作业应当等待另一个作业成功，或使用 `after` 等待某个作业完成，无论成功还是失败。

</details>

<details>
<summary>可以在工作流中使用环境变量吗？</summary>

可以。工作流支持 [EAS 环境变量](/eas/environment-variables)和内联的 `env` 值。环境变量可以使用 `${{ env.VARIABLE_NAME }}` 语法引用。

</details>

<details>
<summary>当前有哪些限制？</summary>

不能共享工作流配置（每个工作流必须独立定义），也没有矩阵构建（不能用不同配置并行运行多个变体）。更多细节和更新见[限制](/eas/workflows/limitations)。

</details>

<details>
<summary>可以在工作流中运行自定义脚本吗？</summary>

可以。带有 `steps` 的[自定义作业](/eas/workflows/syntax#custom-jobs)让你可以运行 shell 命令、使用 `eas/checkout` 和 `eas/install_node_modules` 等内置函数，并为下游作业设置输出。

</details>

<details>
<summary>EAS Workflows 能与现有的 React Native 项目一起使用吗？</summary>

可以。只要项目已为 EAS Build 配置，EAS Workflows 就可以同时用于 [CNG（持续原生生成）](/workflow/continuous-native-generation)和[现有的 React Native 项目](/bare/overview)。

</details>

<details>
<summary>在考虑 EAS Workflows？在下次团队会议中分享以下幻灯片</summary>

在下次团队会议中分享以下幻灯片，讨论 EAS Workflows 是什么以及它们如何帮助你的团队：

![EAS Workflows CI/CD 同步幻灯片](/static/images/eas-workflows/eas-worfklows-slide.webp)

了解使用 EAS Workflows 自动化 CI/CD 流程的好处。

</details>

## 其他资源

- [预置作业](/eas/workflows/pre-packaged-jobs)：使用开箱即用的作业来构建、提交、更新、测试和部署应用。
- [工作流语法参考](/eas/workflows/syntax)：了解用于定义工作流的 YAML 语法。
- [示例工作流](/eas/workflows/examples/introduction)：查看开发构建、预览更新和生产部署的常见工作流。
- [工作流洞察](/eas-insights/workflows)：跟踪工作流随时间变化的运行次数、成功率和趋势。
