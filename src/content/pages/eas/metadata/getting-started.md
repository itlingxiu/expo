---
title: 开始使用 EAS Metadata
description: 了解如何使用 EAS Metadata 从命令行自动化并维护你的应用商店展示信息。
---

# 开始使用 EAS Metadata

:::warning
**EAS Metadata** 处于 [beta](/more/release-statuses#beta)，可能会有破坏性变更。
:::

EAS Metadata 让你能够从命令行自动化并维护应用商店展示信息。它使用包含全部所需应用信息的 [**store.config.json**](/eas/metadata/config#静态商店配置) 文件，而不必填写多份不同的表单。它还会通过内置校验，尝试找出可能导致应用被拒的常见陷阱。

## 前置条件

- **Apple App Store 上的一个应用**

  EAS Metadata 目前只支持 Apple App Store。你需要一个已在 Apple 注册的应用，才能管理其元数据。

> 在使用 VS Code？安装 [Expo Tools 扩展](https://github.com/expo/vscode-expo#readme)，即可在 **store.config.json** 文件中获得自动补全、建议和警告。

## 创建商店配置

让我们从在项目根目录创建 **store.config.json** 文件开始。这个文件保存你想上传到应用商店的全部信息。

如果你在商店中已经有应用，可以运行以下命令把信息拉取到商店配置中：

```sh
eas metadata:pull
```

如果你在商店中还没有应用，EAS Metadata 无法为你生成商店配置。此时请新建一个商店配置文件。

```json store.config.json
{
  "configVersion": 0,
  "apple": {
    "info": {
      "en-US": {
        "title": "Awesome App",
        "subtitle": "Your self-made awesome app",
        "description": "The most awesome app you have ever seen",
        "keywords": ["awesome", "app"],
        "marketingUrl": "https://example.com/en/promo",
        "supportUrl": "https://example.com/en/support",
        "privacyPolicyUrl": "https://example.com/en/privacy"
      }
    }
  }
}
```

> 默认情况下，EAS Metadata 使用项目根目录的 **store.config.json** 文件。你可以通过设置 **eas.json** 的 [`metadataPath`](/eas/json#metadatapath) 属性来更改此文件的名称和位置。

## 更新商店配置

现在可以编辑 **store.config.json** 文件，并按应用需求进行定制。全部可用选项见[商店配置 schema](/eas/metadata/schema)。

## 上传新的应用版本

在把 **store.config.json** 推送到应用商店之前，你必须上传应用的新二进制文件。更多信息见[向商店上传新的二进制文件](/deploy/submit-to-app-stores)。

二进制文件提交并处理完成之后，你可以把商店配置推送到应用商店。

## 上传商店配置

当你对 **store.config.json** 的设置满意后，可以运行以下命令把它推送到应用商店：

```sh
eas metadata:push
```

如果 EAS Metadata 在你的商店配置中遇到任何问题，运行此命令时它会警告你。当没有错误，或者你确认即使可能存在问题也要推送时，它会尽可能多地上传。

当商店配置部分失败时，你可以修改商店配置并重试。`eas metadata:push` 可以用来重试推送缺失的项目。

## 后续步骤

- [自定义商店配置](/eas/metadata/config)：自定义商店配置，使 EAS Metadata 适配你偏好的工作流。
- [商店配置 schema](/eas/metadata/schema)：探索 EAS Metadata 提供的全部可配置选项。
