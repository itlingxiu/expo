---
title: EAS Update 如何工作
description: EAS Update 工作方式的概念概览。
---

# EAS Update 如何工作

EAS Update 是一项服务，让你在准备下一次应用商店发布的同时，立即向用户交付小的 bug 修复和更新。要让更新对构建可用，需要在构建与更新之间建立关联。

要建立这种关联，我们必须确保更新能在构建上运行。我们还希望能够创建一套部署流程，以便在准备好时把某些更新暴露给某些构建。

下图说明构建与更新如何相互作用：

![原生层与更新层示意图](/static/images/eas-update/layers.png)

可以把构建看成两层：构建进应用二进制文件的原生层，以及可以与其他兼容更新互换的更新层。这种分离让我们可以向构建发送 bug 修复，只要带有该修复的更新能够在构建内的原生层上运行。

为了确保更新能在构建上运行，我们必须设置多种属性，以便确信构建可以运行我们的更新。这从我们创建项目构建时开始。

## 概念概览

### 分发构建

当我们准备创建 Expo 项目的构建时，可以运行 `eas build` 来创建构建。构建过程中，会在构建内包含一些对更新很重要的属性。它们是：

- **Channel：** channel 是我们可以赋给多个构建以便轻松识别它们的名称。它在 `eas.json` 中定义。例如，我们可能有一对 channel 名为 "production" 的 Android 和 iOS 构建，另一对 channel 名为 "staging" 的构建。然后可以把 channel 为 "production" 的构建分发到公开应用商店，而把 "staging" 构建留在 Play Store 内部轨道和 TestFlight。之后发布更新时，可以先让它对 channel 为 "staging" 的构建可用；测试完变更后，再让更新对 channel 为 "production" 的构建可用。
- **运行时版本：** 运行时版本描述由运行应用更新层的原生代码层所定义的 JS 与原生接口。它在项目的[应用配置](/workflow/configuration)中定义。每当我们对原生代码的更改改变了应用的 JS 与原生接口，就需要更新运行时版本。[了解更多。](/eas-update/runtime-versions)
- **平台：** 每个构建都有一个平台，例如 "Android" 或 "iOS"。

如果我们做了两套 channel 分别名为 "staging" 和 "production" 的构建，就可以把构建分发到四个不同的地方：

![构建类型示意图](/static/images/eas-update/builds.png)

这张图只是一个例子，说明你可以如何创建构建、为它们的 channel 命名，以及可以把这些构建放在哪里。最终由你决定设置哪些 channel 名称，以及把这些构建放在哪里。

### 发布更新

创建构建之后，我们可以通过发布更新来改变项目的更新层。例如，我们可以更改 **App.js** 中的一些文本，然后把该变更作为更新发布。

要发布更新，可以运行 `eas update --auto`。此命令会在项目的 **dist** 目录中创建本地更新 bundle。创建更新 bundle 后，它会把该 bundle 上传到 EAS 服务器，存入一个名为 _branch_ 的数据库对象。branch 有一个名称，并包含一个更新列表，其中最近的更新是该 branch 上的活动更新。我们可以把 EAS branch 想象成 Git 分支。正如 Git 分支包含提交列表，EAS branch 包含更新列表。

![分支及其最近一次更新被标为活动更新](/static/images/eas-update/branch.png)

### 匹配更新与构建

与构建一样，branch 上的每个更新都包含目标运行时版本和目标平台。有了这些字段，我们可以通过所谓的 _更新策略_ 确保更新能在构建上运行。EAS 的更新策略如下：

- 构建的平台与更新的目标平台必须完全匹配。
- 构建的运行时版本与更新的目标运行时版本必须完全匹配。
- channel 可以链接到任何 branch。默认情况下，channel 链接到同名 branch。

我们重点看最后一点。每个构建都有一个 channel，我们作为开发者可以把该 channel 链接到任何 branch，从而使该 branch 上最近的兼容更新对该 channel 可用。为简化这种链接，默认情况下我们会自动把 channel 链接到同名 branch。例如，如果我们创建了 channel 名为 "production" 的构建，就可以把更新发布到名为 "production" 的 branch，构建就会从名为 "production" 的 branch 获取更新，即使我们没有手动链接任何东西。

![channel "production" 默认链接到 branch "production"](/static/images/eas-update/default-link.png)

如果你的部署流程中有多个一致的 Git 分支和 EAS branch，这种默认链接效果很好。例如，我们可以在 Git 和 EAS 上都有 "production" 分支和 "staging" 分支。配合 [GitHub Action](/eas-update/github-actions)，我们可以做到每次有提交推送到 "staging" Git 分支时，就发布到 "staging" EAS Update branch，从而使该更新应用到所有 channel 为 "staging" 的构建。在 staging 构建上测试完变更后，可以把 "staging" Git 分支合并到 "production" Git 分支，这会在 "production" EAS Update branch 上发布更新。最后，"production" EAS Update branch 上的最新更新会应用到 channel 为 "production" 的构建。

这种流程让我们可以推送到 GitHub，然后看到构建更新，而无需其他干预。

虽然这种流程适合许多开发者，由于我们可以更改 channel 与 branch 之间的链接，还可以实现另一种流程。想象我们把 branch 命名为 "version-1.0"、"version-2.0" 和 "version-3.0"。我们可以把 "version-1.0" EAS Update branch 链接到 "production" channel，使它对 "production" 构建可用。也可以把 "version-2.0" EAS Update branch 链接到 "staging" channel，使它对测试人员可用。最后，我们可以做一个尚未链接到任何构建的 "version-3.0" EAS Update branch，只有开发者用开发构建在测试。

![channel "production" 链接到 branch "version-1.0"，channel "staging" 链接到 branch "version-2.0"](/static/images/eas-update/custom-link-1.png)

一旦测试人员确认 "version-2.0" EAS Update branch 上的更新可以用于生产，我们就可以更新 "production" channel，使其链接到 "version-2.0" branch。为此可以运行：

```sh
$ eas channel:edit production --branch version-2.0
```

![channel "production" 链接到 branch "version-2.0"，channel "staging" 链接到 branch "version-2.0"](/static/images/eas-update/custom-link-2.png)

在此状态之后，我们就可以开始测试 "version-3.0" EAS Update branch。与上一步类似，可以用此命令把 "staging" channel 链接到 "version-3.0" EAS Update branch：

```sh
$ eas channel:edit staging --branch version-3.0
```

![channel "production" 链接到 branch "version-2.0"，channel "staging" 链接到 branch "version-3.0"](/static/images/eas-update/custom-link-3.png)

## 实践概览

熟悉了 EAS Update 的核心概念之后，我们来谈谈这个过程如何发生。

当包含 `expo-updates` 的 Expo 项目被构建时，其中包含的原生 Android 和 iOS 代码负责管理、获取、解析和验证更新。

库何时检查更新、何时下载它们，都是[可配置的](/versions/latest/config/app#updates)。默认情况下，库会在打开时检查更新。如果找到比当前正在运行的更新更新的更新，它会下载并运行较新的更新。如果库没有找到更新的更新，它会改为运行最新已下载的更新；如果还没有下载过，则回退到构建时嵌入应用内的更新。

`expo-updates` 分两个阶段下载更新。首先，它下载最近的更新 _清单_，其中包含关于该更新的信息，包括运行该更新所需的资源列表（图片、JavaScript bundle、字体文件等）。其次，库下载清单中指定的、先前更新中尚未下载的资源。例如，如果更新包含一张新图片，库会在运行更新之前下载该新图片资源。为了帮助终端用户快速可靠地获取更新，更新应尽可能小。

如果库能够在 `fallbackToCacheTimeout` 设置之前下载清单（第 1 阶段）和所有必需资源（第 2 阶段），新更新会在启动时立即运行。如果库无法在 `fallbackToCacheTimeout` 内获取清单和资源，它会在后台继续下载新更新，并在下次启动时运行它。

![更新下载时间线](/static/images/eas-update/process.png)

## 小结

借助 EAS Update，我们可以快速向用户交付小而关键的 bug 修复，并尽可能提供最好的体验。这通过构建的运行时版本、平台和 channel 来设置。有了这三个约束，我们可以让更新对特定的一组构建可用。这让我们可以在部署流程中，于进入生产之前测试变更。根据我们如何设置部署流程，可以针对速度进行优化，也可以把部署优化得尽可能安全和少 bug。部署的可能性很大，几乎可以匹配你偏好的任何发布流程。
