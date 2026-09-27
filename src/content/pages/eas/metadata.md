---
title: EAS Metadata
description: 概述如何使用 EAS Metadata 从命令行自动化并维护你的应用商店展示信息。
---

# EAS Metadata

:::warning
**EAS Metadata** 处于 [beta](/more/release-statuses#beta)，可能会有破坏性变更。
:::

**EAS Metadata** 是来自 EAS（Expo Application Services）的命令行工具，让你能够自动化并维护应用商店展示信息。

在用户能够使用你的应用之前，你需要向多个应用商店提供大量信息。这些信息常常涉及并不适用于你的应用的复杂主题。提供信息之后，你必须启动漫长的审核流程。当审核人员在你提供的信息中发现任何问题时，你需要重新开始这一流程。

EAS Metadata 使用 [**store.config.json**](/eas/metadata/config#静态商店配置) 文件来提供信息，而不必在应用商店仪表盘中填写多份表单，也不必离开项目环境。再加上内置校验，即使在任何审核开始之前，你也能立刻得到关于所提供内容的反馈。

## 快速开始

:::note
下面的 `eas` 命令需要 EAS CLI。更多信息见[如何安装 EAS CLI](/eas/cli#安装)。
:::

运行以下命令，可以把商店配置推送到应用商店：

```sh
eas metadata:push
```

> 在使用 VS Code？安装 [Expo Tools 扩展](https://github.com/expo/vscode-expo#readme)，即可在 **store.config.json** 文件中获得自动补全、建议和警告。

## 关键特性

### 易于配置、更新或维护

你可以通过[新建或从已有应用生成商店配置](/eas/metadata/getting-started#创建商店配置)开始使用 EAS Metadata。这份商店配置让你无需离开项目环境，就能快速更新应用商店信息。在把更改推送到应用商店之前，EAS Metadata 会查找可能导致应用被拒的常见陷阱。

### 通过校验获得更快的反馈循环

EAS Metadata 带有内置校验，甚至在任何内容发送到应用商店之前就会进行。这种校验帮助你更快地迭代信息，而不必启动审核。你可以在一切都已提供、并且没有检测到问题时，再开始审核流程。

> 请务必安装 [VS Code Expo Tools 扩展](https://github.com/expo/vscode-expo#readme)，以获得 **store.config.json** 文件的自动补全、建议和警告。

### 可用动态商店配置扩展

EAS Metadata 也支持更[动态的商店配置](/eas/metadata/config#动态商店配置)，而不仅仅使用 JSON 文件。这种动态商店配置允许你从外部服务等其他地方收集信息。借助异步函数，你可以不受限制地调整 EAS Metadata，以适配你偏好的工作流。

## 何时使用 EAS Metadata

| 场景 | 建议 |
| --- | --- |
| 以编程方式管理应用商店信息 | 推荐 |
| 在审核前发现元数据问题 | 推荐 |
| 协作更新商店展示信息 | 推荐 |
| 管理 Google Play 商店列表页 | 不推荐 |
| 上传截图 | 不推荐 |

## 常见问题（FAQ）

<details open>
<summary>可以在 Google Play 商店使用 EAS Metadata 吗？</summary>

我们致力于 EAS Metadata，并会随时间扩展功能。这也意味着并非所有功能都已在 EAS Metadata 中实现。Google Play 商店就是目前尚未实现的功能之一。

现有的全部功能见[商店配置 schema](/eas/metadata/schema#配置-schema)。

</details>

<details>
<summary>如何使用尚不支持的应用商店功能？</summary>

EAS Metadata 只把商店配置中的数据发送到应用商店。如果你需要 EAS Metadata 尚未覆盖的功能，它不会阻止你使用应用商店仪表盘。

在使用 EAS Metadata 的同时，如果在应用商店仪表盘中编辑了某些内容，请务必在这些更改之后运行 `eas metadata:pull`。如果不更新本地商店配置，EAS Metadata 在推送到应用商店时可能会覆盖你的更改。

</details>

<details>
<summary>如何在受限的应用商店账户中使用 EAS Metadata？</summary>

在 EAS Metadata 能够访问信息之前，你需要向应用商店认证。如果你使用的是大型企业账户，可能没有权限使用 EAS Metadata 的全部功能。在这些情况下你仍然可以使用 EAS Metadata，但由于安全限制，通常会更有挑战。

</details>

## 开始使用

- [简介](/eas/metadata/getting-started)：把 EAS Metadata 添加到新项目，或从已有应用生成商店配置。
- [自定义商店配置](/eas/metadata/config)：自定义商店配置，使 EAS Metadata 适配你偏好的工作流。
- [商店配置 schema](/eas/metadata/schema)：探索 EAS Metadata 提供的全部可配置选项。
