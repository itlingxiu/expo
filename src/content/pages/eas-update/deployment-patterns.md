---
title: 其他部署模式
description: 了解使用 EAS Update 时项目的不同部署模式。
---

# 其他部署模式

在应用中创建功能并修复 bug 之后，我们希望尽可能快速、安全地把这些功能和 bug 修复交付给用户。向用户交付代码时，“安全”和“快速”往往是对立的力量。我们可以把代码直接推到生产，这很快，但因为从未测试代码而不那么安全。另一方面，我们可以制作测试构建，与 QA 团队分享，并定期发布，这更安全，但向用户交付变更更慢。

取决于你的项目，你对向用户交付更新时需要多“快”和多“安全”会有一定的容忍度。

设计 EAS Update 部署流程时要考虑三个部分：

1. **创建构建**
   - (a) 我们可以只创建供生产使用的构建。
   - (b) 我们可以创建供生产使用的构建，以及用于生产前变更测试的单独构建。
2. **测试变更**
   - (a) 我们可以用 TestFlight 和 Play Store 内部轨道测试变更。
   - (b) 我们可以用内部分发构建测试变更。
   - (c) 我们可以用 Expo Go 或[开发构建](/develop/development-builds/introduction)测试变更。
3. **发布更新**
   - (a) 我们可以把更新发布到单个分支。
   - (b) 我们可以创建基于环境的更新分支，例如 "production" 和 "staging"。
   - (c) 我们可以创建基于版本的更新分支，例如 "version-1.0"，这使我们能够把更新从一个 channel 提升到另一个。

我们可以混合、匹配并调整上面的部分，创建对团队和用户而言发布节奏与安全性平衡得当的流程。

另一个要考虑的权衡是整个过程中我们必须做多少版本/名称/环境的簿记。簿记越少，就越容易遵循一致的流程，也更容易与同事沟通。如果我们需要细粒度控制，就要做簿记才能得到我们想要的精确流程。

下面我们概述了使用 EAS Update 部署项目的四种常见模式。

## 两命令流程

这是最简单、最快的流程，安全检查最少。它很适合试用 Expo 和较小的项目。构成此流程的上述部署过程部分如下：

**创建构建：** (a) 只创建供生产使用的构建。

**测试变更：** (c) 用 Expo Go 或[开发构建](/develop/development-builds/introduction)测试变更。

**发布更新：** (a) 发布到单个分支。

### 流程示意图

![两命令部署示意图](/static/images/eas-update/deployment-patterns/deployment-two-command.png)

![两命令部署示意图（深色）](/static/images/eas-update/deployment-patterns/deployment-two-command-dark.png)

### 流程说明

1. 在本地开发项目，并在开发构建或 Expo Go 中测试变更。
2. 运行 `eas build` 创建构建，然后提交到应用商店。这些构建供公众使用，应提交/审核，并在应用商店发布。
3. 当我们有想交付的更新时，运行 `eas update --branch production`，立即把更新交付给用户。

#### 此流程的优点

- 此流程不需要额外的版本或环境名称簿记，因此容易向他人沟通。
- 向构建交付更新非常快。

#### 此流程的缺点

- 没有生产前检查来确保代码会按预期工作。我们可以用 Expo Go 或[开发构建](/develop/development-builds/introduction)测试，但这不如拥有专门的测试环境安全。

## 持久化预发布流程

此流程类似于 "分支提升流程" 的不带版本变体。我们不用分支跟踪发布版本。相反，我们会有可以永远合并进去的持久 "staging" 和 "production" 分支。构成此流程的上述部署过程部分如下：

**创建构建：** (b) 创建供生产使用的构建，以及用于测试的单独构建。

**测试变更：** (a) 在 TestFlight 和 Play Store 内部轨道上测试变更，和/或 (b) 用内部分发构建测试变更。

**发布更新：** (b) 创建基于环境的更新分支，例如 "staging" 和 "production"。

### 流程示意图

![预发布部署示意图](/static/images/eas-update/deployment-patterns/deployment-staging.webp)

![预发布部署示意图（深色）](/static/images/eas-update/deployment-patterns/deployment-staging-dark.webp)

### 流程说明

1. 在本地开发项目，并在 Expo Go 中测试变更。
2. 创建 channel 名为 "production" 的构建，它们最终会经过审核并在应用商店上可用。创建另一组 channel 名为 "staging" 的构建，用于在 TestFlight 和 Play Store 内部轨道上测试。
3. 设置 `expo-github-action`，在把提交合并到分支时发布更新。
4. 把更改合并到名为 "staging" 的分支。GitHub Action 会发布更新，并使它在我们的测试构建上可用。
5. 准备好后，把更改合并到 "production" 分支，向生产构建发布更新。

#### 此流程的优点

- 此流程让你独立于开发节奏来控制部署到生产的节奏。这增加了一次额外的测试应用的机会，并避免用户在每个 PR 落地时都要下载新更新。
- 容易向团队沟通，因为部署更新发生在合并到名为 "staging" 和 "production" 的 GitHub 分支时。

#### 此流程的缺点

- 检出应用的先前版本略微更复杂，因为我们需要检出旧提交而不是旧分支。
- 合并到 "production" 时，更新会被重新构建并重新发布，而不是从 channel 为 "staging" 的构建移动到 channel 为 "production" 的构建。

## 平台特定流程

此流程适用于始终需要分别构建和更新 Android 与 iOS 应用的项目。它会导致向 Android 和 iOS 应用交付更新时使用分开的命令。构成此流程的上述部署过程部分如下：

**创建构建：** (a) 只创建供生产使用的构建，或 (b) 创建供生产使用的构建以及用于测试的单独构建。

**测试变更：** (a) 在 TestFlight 和 Play Store 内部轨道上测试变更，和/或 (b) 用内部分发构建测试变更。

**发布更新：** (b) 创建基于环境和平台的更新分支，例如 "ios-staging"、"ios-production"、"android-staging" 和 "android-production"。

### 流程示意图

![平台特定部署示意图](/static/images/eas-update/deployment-patterns/deployment-platform-specific.webp)

![平台特定部署示意图（深色）](/static/images/eas-update/deployment-patterns/deployment-platform-specific-dark.webp)

### 流程说明

1. 在本地开发项目，并在 Expo Go 中测试变更。
2. 创建 channel 名称类似 "ios-staging"、"ios-production"、"android-staging" 和 "android-production" 的构建。然后把 "ios-staging" 构建放到 TestFlight，并把 "ios-production" 构建提交到公开 App Store。同样，把 "android-staging" 构建放到 Play Store 内部轨道，并把 "android-production" 构建提交到公开 Play Store。
3. 设置 `expo-github-action`，在把提交合并到分支时向所需平台发布更新。
4. 然后，把 iOS 应用的更改合并到分支 "ios-staging"，准备好后再把更改合并到 "ios-production" 分支。同样，把 Android 应用的更改合并到分支 "android-staging"，准备好后再合并到名为 "android-production" 的分支。

#### 此流程的优点

- 此流程让你完全控制哪些更新进入 Android 和 iOS 构建。更新永远不会同时应用到两个平台。

#### 此流程的缺点

- 要在两个平台上修复更改，你必须运行两条命令而不是一条。

## 分支提升流程

此流程是管理带版本发布的流程示例。

:::warning
此流程需要更多簿记，并且不支持自动[运行时版本策略](/eas-update/runtime-versions#设置-runtimeversion)（`"sdkVersion"`、`"appVersion"`、`"nativeVersion"` 和 `"fingerprint"`）。使用此流程时，你需要[手动指定](/eas-update/runtime-versions#自定义运行时版本)运行时版本。
:::

构成此流程的上述部署过程部分如下：

**创建构建：** (b) 创建供生产使用的构建（每个主版本一个）以及用于测试的单独构建。

**测试变更：** (a) 在 TestFlight 和 Play Store 内部轨道上测试变更，和/或 (b) 用内部分发构建测试变更。

**发布更新：** (c) 创建基于版本的更新分支，例如 "version-1.0"。分支动态映射到 channel，以便把经过充分测试的变更从测试提升到生产。

### 流程示意图

![分支部署示意图](/static/images/eas-update/deployment-patterns/deployment-branch.webp)

![分支部署示意图（深色）](/static/images/eas-update/deployment-patterns/deployment-branch-dark.webp)

### 流程说明

1. 在本地开发项目，并在 Expo Go 或[开发构建](/develop/development-builds/introduction)中测试变更。
2. 创建 channel 名为 "production-rtv-1"（表示运行时版本为 "1" 的 channel）的构建，它们最终会经过审核并在应用商店上可用。创建另一组 channel 名为 "staging" 的构建，用于在 TestFlight 和 Play Store 内部轨道上测试。
3. 设置 `expo-github-action`，在把提交合并到分支时发布更新。
4. 把更改合并到名为 "version-1" 的分支。
5. 使用网站或 EAS CLI 把 "staging" channel 指向 EAS Update 分支 "version-1"。通过在 TestFlight 和 Play Store 内部轨道上打开应用来测试更新。
6. 准备好后，使用网站或 EAS CLI 把 "production-rtv-1" channel 指向 EAS Update 分支 "version-1"。
7. 然后，你可能会遇到两种更新情形：
   - 新发布不需要新的运行时版本：
     1. 创建另一个名为 "version-2" 的 GitHub 分支。
     2. 使用网站或 EAS CLI 把 "staging" channel 指向 EAS Update 分支 "version-2"。
     3. 把提交合并到 "version-2" 分支，直到新功能和修复准备好并稳定。
     4. 使用网站或 EAS CLI 把 "production-rtv-1" channel 指向 EAS Update 分支 "version-2"。这意味着拥有生产构建的所有人（从应用商店下载应用的用户）现在都会获得 "version-2" 分支上的最新更新。
   - 新发布需要新的运行时版本（例如添加了新的原生库或升级了 SDK 版本）：
     1. 把运行时版本从 "1" 提升到 "2"。
     2. 用新的运行时版本创建新的 "staging" 构建。
     3. 创建另一个名为 "version-2" 的 GitHub 分支。
     4. 使用网站或 EAS CLI 把 "staging" channel 指向 EAS Update 分支 "version-2"。
     5. 把提交合并到 "version-2" 分支，直到新功能和修复准备好并稳定。
     6. 创建 channel 名为 "production-rtv-2" 的新构建，它最终会经过审核并在应用商店上可用。
     7. 使用网站或 EAS CLI 把 "production-rtv-2" channel 指向 EAS Update 分支 "version-2"。这意味着此前拥有生产构建的所有人（从应用商店下载应用的用户）会继续获得 EAS Update 分支 "version-1" 上的最新更新，直到他们从应用商店下载应用的新版本，那时他们会获得 EAS Update 分支 "version-2" 上的最新更新。

#### 此流程的优点

- 此流程比其他流程更安全。所有更新都在分发给内部测试人员的测试构建上测试，并且分支在 channel 之间移动，因此测试过的精确产物就是部署到生产构建的那个。
- 此流程在 GitHub 分支与 EAS Update 分支之间建立直接映射。它也在 GitHub 提交与 EAS Update 更新之间建立映射。如果你在跟踪 GitHub 分支，可以为每个 GitHub 分支创建 EAS Update 分支，并把这些分支链接到构建的 channel。实践中，这使你可以推送到 GitHub，然后在 Expo 上选择同名分支来链接到构建。
- 部署的先前版本始终保留在 GitHub 上。一旦部署了 "version-1.0" 分支，之后又部署了另一个版本（例如 "version-1.1"），"version-1.0" 分支会永远保留，使检出项目的先前版本变得容易。

#### 此流程的缺点

- 需要每个生产运行时版本一个 channel，以维护先前生产发布的历史更新。这使使用运行时版本策略更困难。
- 此流程需要分支名称的簿记，这意味着要与团队沟通哪些分支当前指向测试构建和生产构建。
