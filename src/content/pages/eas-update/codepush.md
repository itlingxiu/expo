---
title: 从 CodePush 迁移
description: 帮助从 CodePush 迁移到 EAS Update 的指南。
---

# 从 CodePush 迁移

本指南说明如何把使用 CodePush 的 React Native 项目过渡到 EAS Update。EAS Update 提供[许多优势](/eas-update/introduction#主要功能)。它假设你使用默认的 React Native 项目结构。关于把棕地原生应用迁移到 EAS Update 的帮助，参见[在现有原生应用中使用 EAS Update](/eas-update/integration-in-existing-native-apps)。

要进一步了解 CodePush 与 EAS Update 的差异，参见 [CodePush 与 EAS Update 的概念差异](#codepush-与-eas-update-的概念差异)以及 Expo 博客上的 [没有 CodePush 时该怎么做](https://expo.dev/blog/what-to-do-without-codepush)。

## 确保应用使用最新的 Expo SDK 版本

要从 CodePush 迁移到 EAS Update，我们建议你使用最新的 Expo SDK 版本。没有针对较旧 Expo SDK 和 React Native 版本的说明。你也许可以通过按需改写说明，成功迁移到应用所使用的较旧 Expo SDK 和 React Native 版本，但针对较旧版本集成的额外亲手支持只能提供给企业客户（[联系我们](https://expo.dev/contact)）。

## 卸载 CodePush

为避免冲突和意外行为，如果你正在使用 EAS Update，建议卸载 CodePush。这是因为应用可能会定期从两个服务获取更新，从而导致问题，尤其是当你为每个服务使用不同配置时。

通过卸载 `react-native-code-push` 包，从项目中移除 CodePush SDK：

```sh
$ npm uninstall react-native-code-push
```

你还需要从 JS 和原生代码中移除 CodePush 引用。更详细的说明见这条 [GitHub 评论](https://github.com/Microsoft/react-native-code-push/issues/1101#issuecomment-350204507)。

## 向 `app.json` 添加 `expo` 键

确保项目有一个带 `expo` 对象的 **app.json** 文件。如果你还没有什么需要在 **app.json** 中专门配置的内容，可以创建一个带空 `expo` 对象的最小文件，如下所示：

```json app.json
{
  "expo": {
    // ... 你已有的其他键
  }
}
```

## 遵循“入门”指南

[EAS Update 入门指南](/eas-update/getting-started)中的说明将引导你在项目中设置 EAS Update。

## 重新提交应用

由于你把更新提供方从 CodePush 改成了 EAS Update，你需要重新构建应用，并把新构建提交到相应的应用商店（Google Play Store 和 Apple App Store），以确保更新机制对终端用户按预期工作。

遵循相应商店的指南提交应用的新构建：

- [提交到 Google Play Store](/submit/android)
- [提交到 Apple App Store](/submit/ios)

成功提交应用后，用户将能够下载并使用集成了 EAS Update 的最新构建。如果应用没有按预期更新，请[验证你的配置](/eas-update/debug)。

## 常见问题

<details>
<summary>如何用 EAS Update 发布强制/关键更新？</summary>

CodePush CLI 有一个 `--mandatory` 标志，允许你发布强制更新。你可以用 EAS Update 构建此功能，但没有专门的标志。

[进一步了解强制/关键更新](/eas-update/download-updates#关键强制更新)。

</details>

<details>
<summary>如何在更新中包含一条消息？</summary>

CodePush CLI 有一个 `--description` 标志，允许你在更新中包含一条消息。你可以用应用配置中的 `extra` 字段，通过 EAS Update 构建此功能。

参见此示例中的 `--message` 标志：[`expo/UpdatesAPIDemo`](https://github.com/expo/UpdatesAPIDemo)。

</details>

<details>
<summary>如何在运行时切换正在使用的“部署”，类似于 CodePush 中的 sync() 函数？</summary>

这可以使用 `Updates.setUpdateURLAndRequestHeadersOverride()` 实现。更多内容见[在运行时覆盖更新配置](/eas-update/override)指南。

</details>

<details>
<summary>如何用 EAS Update 处理不同环境（例如预发布和生产）？</summary>

使用 EAS Update 时，你可以用 channel 和 branch 管理不同环境和灰度。参见[如何用 EAS CLI 管理分支和 channel](/eas-update/eas-cli)。

</details>

<details>
<summary>如何用 EAS Update 回滚更新？</summary>

你可以用 `eas update:rollback` 回滚更新。更多内容见[回滚到先前的更新](/eas-update/rollbacks)指南。

</details>

<details>
<summary>如何用 EAS Update 逐步推出更新？</summary>

EAS Update 支持多种逐步推出更新的策略，因此你可以选择最适合需求的方法。参见[灰度发布指南](/eas-update/rollouts)。

</details>

<details>
<summary>如何直接控制何时下载并应用更新？</summary>

关于下载和应用更新的不同策略，参见[下载更新](/eas-update/download-updates)指南，例如在应用运行时检查更新，甚至在后台用 `Updates.checkForUpdateAsync()` 检查。

</details>

<details>
<summary>EAS Update 是否支持端到端代码签名？</summary>

是的，EAS Update 支持端到端代码签名。它对 EAS Production 和 Enterprise 方案订阅者可用。更多内容见[代码签名](/eas-update/code-signing)指南。

</details>

<details>
<summary>还有什么我应该知道的？</summary>

- Expo Orbit：适用于 macOS、Windows 和 Linux 的桌面启动器应用。你可以用它一键[从网站启动更新](/review/with-orbit)，以及其他功能。
- 你可以从 EAS 网站监控更新的采用情况。参见[监控更新的采用情况](/eas-update/download-updates#监控更新的采用情况)。你也可以从网站推出和回滚更新。
- 你可以用 EAS Update 实现类似 Web 的预览工作流。参见[如何预览更新](/eas-update/preview)。
- 用 EAS 创建的每个更新和构建都关联一个[指纹](/versions/latest/sdk/fingerprint)。你可以通过网站 UI 或 `eas fingerprint:compare` 对比这些指纹，查看构建与更新之间应用原生运行时发生了什么变化，以理解构建/更新兼容性，并指导你何时提升 [`runtimeVersion`](/eas-update/runtime-versions)。

</details>

## CodePush 与 EAS Update 的概念差异

CodePush 和 EAS Update 都是允许你向应用的 JavaScript 代码发送热修复的服务，但它们采用略有不同的方式，因此迁移到 EAS Update 时你可能需要调整发布流程。

<details>
<summary>更新在流中如何组织的差异</summary>

**CodePush 对部署有单一的更新流**。这意味着你可以把构建指向一个部署，它就会从那里拉取更新。如果你想更改构建所针对的部署，可以通过 JavaScript API 在运行时完成。

**EAS Update 有多条更新流**：一条对应于你的源代码管理分支（称为 branch），另一条称为 channel，channel 指向 branch。channel 与 branch 之间的映射在服务器端处理，并且一个 channel 可以为每个运行时版本指向不同的 branch（此外还可以表达更高级的逻辑，例如支持增量灰度）。构建不直接与 branch 关联，而是与 channel 关联。每个构建默认指向单个 channel。这样做的原因是确保某些 branch（例如：development、staging）不会自动进入生产，从而使预览更新不会到达生产用户。这帮助你分离 EAS Update 的两种主要用途：预览和生产热修复。

</details>

<details>
<summary>运行时如何选择更新的差异</summary>

CodePush 与 EAS Update 之间一个可能影响发布流程的关键区别是：**使用 CodePush 时，客户端在运行时控制目标更新部署**；**使用 EAS Update 时，默认路径在服务器端控制，通过把 channel 映射到 branch**。在默认的 EAS Update 流程中，构建为其配置的 channel 请求更新，EAS Update 返回映射到该 channel 的 branch 上最新的兼容更新。

在运行时控制目标部署的能力，常与 CodePush 一起用于预发布环境，让非技术相关方从 Google Play Beta 和 TestFlight 上的单个构建测试功能。使用 EAS Update 时，你可以用 [channel surfing](/eas-update/channel-surfing)实现同样的效果。这允许你在非开发构建中于运行时切换更新 channel。开发构建也可以从任何兼容的 channel 加载更新，很适合面向开发者的测试。

</details>
