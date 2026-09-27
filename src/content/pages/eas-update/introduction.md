---
title: EAS Update
description: EAS Update 是一项云服务，为使用 expo-updates 库的项目提供更新。
---

# EAS Update

**EAS Update** 是来自 EAS（Expo Application Services）的云服务，为使用 [`expo-updates`](/versions/latest/sdk/updates) 库的项目提供更新。

EAS Update 让你在应用商店提交之间轻松修复小 bug 并推送快速修复。它通过让应用以 OTA 方式更新自己的非原生部分（例如 JS、样式和图片）来实现这一点。所有包含 `expo-updates` 库的应用都能够接收更新。

## 快速开始

:::note
下面的 `eas` 命令需要 EAS CLI。更多信息参见[如何安装 EAS CLI](/eas/cli#安装)。
:::

安装 `expo-updates` 库并配置 EAS Update：

:::tabs
:::tab npm
```sh
$ npx expo install expo-updates

$ eas update:configure
```
:::
:::tab yarn
```sh
$ yarn expo install expo-updates

$ eas update:configure
```
:::
:::tab pnpm
```sh
$ pnpm expo install expo-updates

$ eas update:configure
```
:::
:::tab bun
```sh
$ bun expo install expo-updates

$ eas update:configure
```
:::
:::

你需要为 Android 或 iOS 创建新构建，以便把 `expo-updates` 库包含进构建。之后可以向 production channel 推送更新：

```sh
$ eas update --channel production --message "Fix login button alignment"
```

此命令会发布你的 JavaScript bundle 和资源，使用户在下次启动应用时收到新版本。

开始使用 EAS Update 的完整步骤，参见[开始使用 EAS Update](/eas-update/getting-started)。

### 面向 AI 代理的 Expo Skills

如果你使用 AI 代理，安装 [Expo Skills](/skills)，教它如何检查已发布更新的健康状况。

相关技能：`eas-update-insights`。

## 主要功能

### 用于更新管理的 JS API

![Updates JavaScript API 示例](/static/images/eas-update/frontpage/critical-update.webp)

更新的 [JavaScript API](/versions/latest/sdk/updates) 包含一个名为 `useUpdates()` 的 React hook。这个 hook 提供关于当前正在运行的更新，以及任何可用或已下载的新更新的详细信息。此外，你可以查看更新过程中遇到的任何错误，以便在应用尝试更新时帮助调试问题。

该 API 还提供 `checkForUpdateAsync()` 和 `fetchUpdateAsync()` 等方法，让你控制应用何时检查并下载更新。

### 洞察跟踪

![网站仪表盘上的部署洞察](/static/images/eas-update/frontpage/insights.png)

你会得到一个[部署仪表盘](https://expo.dev/accounts/[account]/projects/[project]/deployments)，帮助可视化哪些更新被发送到哪些构建。更新与[洞察](/eas-insights/introduction)配合，提供用户对更新采用率的数据。

### 重新发布以撤销错误

![更新上的重新发布按钮](/static/images/eas-update/frontpage/republish.png)

如果更新的表现不符合预期，你可以在有问题的版本之上[重新发布](/eas-update/eas-cli#在分支内重新发布先前的更新)一个先前的稳定版本，很像版本控制系统中的一次新“提交”。

## 何时使用 EAS Update

| 场景 | 建议 |
| --- | --- |
| 修复 JavaScript 代码中的 bug 或崩溃，并在几分钟内部署更新 | 适合 |
| 更新文案、翻译、UI 样式或屏幕布局 | 适合 |
| 使用[灰度发布](/eas-update/rollouts)把变更推给一定百分比的用户 | 适合 |
| 从 [CI 或自动化工作流](/eas/workflows/pre-packaged-jobs#update)发布更新 | 适合 |
| 在生产发布前与内部团队测试更新 | 适合 |
| 更改原生代码或原生依赖 | 不适合 |
| 更改应用权限（相机、位置等） | 不适合 |
| 更新 Expo SDK 版本 | 不适合 |
| 任何需要新应用二进制版本的事项 | 不适合 |

对于标记为不适合的场景，使用 [EAS Build](/build/introduction)创建并提交新的应用二进制文件。

## 常见问题（FAQ）

<details open>
<summary>发布更新时必须遵守哪些准则？</summary>

EAS Update 的规则之一是，你需要遵守所针对平台和应用商店的规则。这意味着你的更新需要遵守 App Store 和 Play Store 准则，包括更新的内容以及你如何使用它们。这通常意味着应用行为的变更需要经过审核。

应用商店规则会经常变化。正如不使用 Expo 编写应用时你需要遵守它们一样，使用 Expo 和 EAS Update 时也同样需要遵守。

EAS Update 是向使用你应用的人快速交付改进的好方法。例如，考虑一个有必须修复的严重 bug 的应用。借助 EAS Update，你可以快速发出修复，之后再跟进一次把该修复内置进去的新提交。

</details>

<details id="每月活跃用户是如何计数的">
<summary>一个计费周期内如何计算“每月活跃用户”？</summary>

:::note
**说明**：1 个每月活跃用户等于在计费周期内至少下载 1 次更新的应用的 1 次唯一安装。
:::

- 在计费周期的每一天都下载新更新的一次应用安装，计为 1 个每月活跃用户。
- 在计费周期内没有下载任何新更新的一次应用安装，计为 0 个每月活跃用户。
- 卸载并重新安装应用（并且在计费周期内每次都下载了更新）计为 2 个每月活跃用户。
- 一台设备上有同一 Expo 账户拥有的两个都使用更新的应用，对该账户而言计为 2 个每月活跃用户。

</details>

<details>
<summary>如何为我的应用实现自定义更新策略？</summary>

默认情况下，`expo-updates` 会在每次加载应用时检查更新。你可以用 [Updates API](/versions/latest/sdk/updates) 和[应用配置](/versions/latest/config/app#updates)实现自定义更新策略。

</details>

<details>
<summary>我可以在现有的 React Native 项目中使用 EAS Update 吗？</summary>

可以。EAS Update 同时适用于使用[持续原生生成（CNG）](/workflow/continuous-native-generation)的项目，以及已安装 [`expo-updates`](/versions/latest/sdk/updates) 库的[现有 React Native 项目](/bare/installing-updates)。

</details>

<details>
<summary>应用用户需要重新安装应用才能收到更新吗？</summary>

不需要。更新在应用内部下载，并根据你的配置应用。应用用户会在下次启动或重新加载应用时看到新版本。

</details>

<details>
<summary>EAS Update 如何处理原生代码兼容性？</summary>

EAS Update 使用[运行时版本策略](/eas-update/runtime-versions)确保更新只发送给具有兼容原生代码的构建。如果原生代码发生变化，你要创建新的运行时版本。

</details>

<details>
<summary>我可以在 EAS Workflows 内或其他 CI/CD 流水线中使用 EAS Update 吗？</summary>

可以。EAS Update 可以与 [EAS Workflows](/eas/workflows/get-started)一起使用。你仍然需要为 Android 或 iOS 配置并创建新构建。之后可以在工作流配置中添加更新作业。例如：

```yaml
jobs:
  publish_update:
    type: update
    params:
      message: 'Fix login button alignment'
      channel: production
```

更多信息参见 [EAS Workflows 预置作业](/eas/workflows/pre-packaged-jobs#update)。

要用 GitHub Actions 自动发布更新，参见 [PR 预览的 GitHub Action](/eas-update/github-actions)指南。

</details>

<details>
<summary>EAS Update 和 CodePush 有什么区别？</summary>

EAS Update 是原生方案，并且与 [EAS Build](/build/introduction)集成，提供统一的工作流。CodePush 采用略有不同的方式。要进一步了解 EAS Update 与 CodePush 的差异，参见 [CodePush 与 EAS Update 的概念差异](/eas-update/codepush#codepush-与-eas-update-的概念差异)。

</details>

<details>
<summary>Classic Updates 是否仍受支持？</summary>

Classic Updates 服务在 2021 年 12 月之前可用，现已弃用。不能再通过 `expo publish` 发布新更新，但现有应用仍会继续接收已经发布且仍在积极使用的 Classic Updates。

我们建议过渡到 EAS Update，或使用[自托管更新服务](/versions/latest/sdk/updates)。

</details>

## 开始使用

- [开始使用 EAS Update](/eas-update/getting-started)：了解在项目中配置和使用 EAS Update 所需的设置。
- [发布更新](/eas-update/getting-started#发布更新)：了解如何用 EAS Update 向特定分支发布更新。
- [预览更新](/eas-update/preview)：用 EAS Update 查看队友的变更。
- [使用 GitHub Actions](/eas-update/github-actions)：在一次提交后发布更新，并用二维码预览。
- [从 CodePush 迁移](/eas-update/codepush)：了解如何从 CodePush 迁移到 EAS Update。
- [结合其他 EAS 服务使用 EAS Update](/tutorial/eas/introduction)：关于结合其他 EAS 服务使用 EAS Update 的完整教程，参见这篇 EAS 教程。
