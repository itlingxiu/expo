---
title: 部署更新
description: 了解一套简单而强大的流程，安全地把更新部署给用户。
---

# 部署更新

当你的应用在生产环境中有多个二进制版本时（这很常见，用户并不总会跟上你最新的商店发布），重要的是理解哪些代码在哪些版本上运行，并能够用热修复专门针对某个特定版本。

EAS Update 提供 "channel"、"branch" 和 "运行时版本"，帮助你确定要针对哪个应用版本，帮助你做簿记以理解部署状态，并支持多种[部署模式](/eas-update/deployment-patterns)。

<details>
<summary>如果我偏好的发布流程不受 EAS Update 支持怎么办？</summary>

发布管理是软件工程中的大话题，每个人对想怎么做都有略微不同的看法。EAS Update 设计为支持[多种不同的工作流](/eas-update/deployment-patterns)，但本指南将聚焦于对大多数应用都有效的最简单工作流。即便如此，有些其他工作流可能无法在 EAS Update 服务的约束内工作。例如，每个二进制版本必须始终指向单个 channel，并且创建构建后你不能更改嵌入构建中的 channel。不过在 SDK 54 及更高版本上，[channel surfing](/eas-update/channel-surfing) 让已安装的发布构建可以在运行时从另一个 channel 请求更新。

作为逃生舱，你可以托管自己的、与 [Expo Updates 协议](/technical-specs/expo-updates-1)兼容的更新服务，并把 `expo-updates` 配置指向该服务。协议层面上与更新选择相关的概念只有 "Runtime Version" 和 "Platform"，你可以像我们构建 channel 和 branch 那样，在这些概念之上自由创建自己的概念。[进一步了解创建自定义 expo-updates 服务器](https://github.com/expo/custom-expo-updates-server)。

</details>

## 一套简单的发布流程

在本指南中，我们将描述一套简单而强大的发布流程，它使用 **channel** 和**运行时版本**，并且大多忽略 _branch_。这以最少的概念开销提供 EAS Update 的大部分好处。你可以随着需求出现而演进此流程，或转向[其他部署模式](/eas-update/deployment-patterns)。

<details>
<summary>为什么在此发布流程中忽略 branch？</summary>

使用 EAS Update 最简单的方式是忽略 "branch" 的概念，聚焦于 "channel"。branch 仍然存在，但你不必直接与它们交互来管理部署。你可以让 channel 指向与 channel 同名的 branch，并把它们看成一个概念。

EAS Update 的 branch 本意是映射到 Git 分支，使团队可以把 Git 分支上的更改直接发布到同名的 EAS Update branch。这对[预览更新](/eas-update/preview)有帮助，但对许多应用而言，这种与 Git 的集成程度并非必需。开发者往往只关心能够手动向应用的预发布或生产版本发布热修复，并在需要时运行 `eas update --channel staging` 或 `eas update --channel production`，而不是通过管理 branch 来达到同样的结果。

</details>

## 配置项目

channel 表示更新针对哪个环境（例如 "production" 或 "staging"），运行时版本表示更新将针对的应用版本（例如 "1.0.0" 或 "1.0.1"）。

### channel 配置

如果还没有，在项目中运行 `eas update:configure`。

**如果你使用 EAS Build**，configure 命令将应用的默认配置几乎就是我们这里想用的：每个 profile 指向同名 channel，因此应用的生产发布会指向 "production" channel。我们只需要添加一个指向 "staging" channel 的 "staging" profile。

<details>
<summary>eas.json 配置示例</summary>

如果你尚未配置项目，下面的配置大约就是 `eas update:configure` 会为你生成的内容。

```json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "staging": {
      "channel": "staging"
    },
    "preview": {
      "channel": "preview",
      "distribution": "internal"
    }
  }
}
```

</details>

**如果你不使用 EAS Build**，你需要修改[原生项目配置](/eas-update/getting-started#配置更新-channel)中使用的 channel。发布到生产时，确保把原生配置中的 channel 名称更新为 "production"；发布到预发布时，确保把原生配置中的 channel 名称更新为 "preview"。值得注意的是，把 EAS Build 与 EAS Update 一起使用能帮你发挥产品的最大价值，但这不是必需的。

### 运行时版本配置

默认情况下，`eas update:configure` 会在应用配置中设置 `"runtimeVersion": { "policy": "appVersion" }`。这是推荐配置，它确保应用的运行时版本始终与应用版本相同，并且你对应用的每次发布都有唯一的运行时版本可以针对。在此情况下，应用版本指用户在应用商店上看到的应用原生版本，不包括构建号或 version code。例如：会使用 `"1.0.0"` 作为运行时版本，而不是 `"1.0.0(1)"`（其中 `1` 是构建号或 version code）。

<details>
<summary>app.json 配置示例</summary>

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

</details>

<details>
<summary>fingerprint 运行时版本策略怎么样？</summary>

我们希望这会成为运行时版本策略的未来，但目前我们建议使用 `"appVersion"` 策略。`"fingerprint"` 策略是实验性的，尚未被广泛推荐。

</details>

## 部署预览

你可以在内部分发的发布构建或开发构建中预览更新。使用内部分发而不是部署到商店 beta 轨道，可以降低把应用分发给内部测试人员的摩擦，并且适合例如你想在每个 pull request 上分享构建，或分享你正在做的早期概念的情况。

### 内部分发的发布构建

如上所述，预览构建会指向 "preview" channel。如果你希望在任何给定时间在内部分发多个版本的预览应用，可以根据功能名称更改 channel 名称。例如，做功能 A 时可以把构建上的 channel 设为 "preview-feature-a"，做功能 B 时再设为 "preview-feature-b"。

### 在开发构建中预览

只要运行时版本兼容，开发构建就可以从任何 channel 加载更新。更多内容见[预览更新](/eas-update/preview)。

## 部署到预发布

运行 `eas update --channel staging` 把更新发布到预发布。这会使热修复立即对具有目标运行时版本的预发布构建用户可用。

你的预发布环境将是 Google Play Beta 或 TestFlight，即相应应用商店上的 "beta 轨道"。你也可以使用内部分发，但当你在为生产发布准备代码时，通常更建议部署到商店 beta 轨道，因为用户无需了解分发应用的内部流程就能访问它（而使用内部分发则要求用户从 expo.dev URL 下载应用）。

创建预发布构建的常见做法是，每当你把生产构建上传到商店时都创建一个。这让你拥有与生产构建运行时相同的预发布构建，可以在把更新推出到生产之前用它测试更新。使用 EAS Build 时，这意味着每次运行 `eas build --profile production --auto-submit` 时，也运行 `eas build --profile staging --auto-submit`。

## 部署到生产

运行 `eas update --channel production` 来打包并把新更新推送到生产。这会使热修复立即对具有相同运行时版本的生产构建用户可用。

**如果你已经把修复发布到预发布并在那里验证过**，请确保你是从同一次提交重新发布。

对于此发布流程，我们建议预发布使用与生产相同的环境变量和代码签名配置，以确保在预发布中验证过的更新在生产中完全一样地工作。如果你这样做，就可以用 `eas update:republish --destination-channel production` 来提升更新，而不是生成新的更新。这会确保你在预发布中测试过的完全相同的 bundle 被用于生产。

运行 `eas update --channel production` 把更新发布到生产。这会使热修复立即对具有相同运行时版本的生产构建用户可用。

### 运行时版本

创建新的生产构建时，我们建议递增[应用版本](/build-reference/app-versions#应用版本)，以确保应用的每次发布都有唯一的运行时版本。

### 逐步推出更新

你可以使用[按更新灰度](/eas-update/rollouts#按更新灰度)把更新逐步部署给越来越高百分比的用户。例如：`eas update --rollout-percentage 10` 会把更新推给 10% 的用户，之后你可以用 `eas update:edit` 编辑灰度百分比。更多内容见[灰度发布](/eas-update/rollouts)。

<details>
<summary>还有哪些其他类型的灰度？</summary>

另一种灰度称为 "基于分支的灰度"。它们需要围绕更新分支的部署策略，本指南没有使用它，对大多数用例也不是必需的。

按更新灰度与基于分支灰度的区别是：按更新灰度作用于单个更新（ID 为 `123` 的更新会推给 `production` channel/branch 上 10% 的用户），而基于分支的灰度会推出切换到另一个分支（那是一条更新流）（分支 `hotfix-123` 会推给 `production` channel 上 10% 的用户，并且 `hotfix-123` 可以指向更新 ID `123` 或 `124`）。

</details>

### 回滚到先前的更新版本

如果你错误地向任何环境发布了更新，可以运行 `eas update:rollback` 发起回滚到先前的更新。

更多内容见[回滚](/eas-update/rollbacks)。

## 下一步

- [进一步了解持久化预发布流程](/eas-update/deployment-patterns#持久化预发布流程)，它与这里描述的非常相似。
- [探索在开发构建中使用预览更新](/eas-update/preview)。
