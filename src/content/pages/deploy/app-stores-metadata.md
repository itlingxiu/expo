---
title: 应用商店元数据
description: 了解如何使用 EAS Metadata 自动化并维护你的应用商店信息。
---

# 应用商店元数据

:::note
EAS Metadata 目前处于 beta 阶段，可能有不兼容的变更；它目前"只支持 Apple App Store"。
:::

提交到应用商店需要元数据，而且流程冗长，涉及许多往往与你的应用无关的复杂问题。如果审核人员标记了问题，整个流程就要重新来过。[EAS Metadata](/eas/metadata) 让你"从命令行自动化并维护这些信息"，而不用填写仪表盘表单，并且能即时标记"众所周知的应用商店限制"——那些在漫长审核队列之后可能触发拒审的问题。

:::tip
VS Code 用户可以安装 [Expo Tools 扩展](https://github.com/expo/vscode-expo#readme)，在 **store.config.json** 文件中获得"自动补全、建议与警告"。
:::

## 创建商店配置

EAS Metadata 把可上传的信息存储在 [store.config.json](/eas/metadata/config) 中，放在 Expo 项目的根目录。在项目根目录创建它：

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

示例是 JSON schema，把值替换成你自己的。常见字段包括 `title`、`subtitle`、`description`、`keywords` 与 `marketingUrl`。`configVersion` 属性很重要，因为它"帮助处理不向后兼容的版本变更"。

> 可以在 **store.config.json** 中定义的属性，见 [EAS Metadata 的 Schema](/eas/metadata/schema)。

## 上传商店配置

:::note
在把 **store.config.json** 推送到应用商店之前，你必须先上传应用的新二进制。参见[提交到应用商店](/deploy/submit-to-app-stores)。二进制提交并处理完成后，再继续。
:::

用所需信息创建 **store.config.json** 后，用以下命令把它推送到应用商店：

```sh
eas metadata:push
```

如果配置有问题，EAS Metadata 会在此刻警告你。没有错误时 —— 或者你确认即使可能有问题也要推送 —— 它会尝试"尽可能多地"上传。编辑 **store.config.json** 后可以重复使用同一条命令，推送最新的改动。

## 下一步

- [EAS Metadata Schema](/eas/metadata/schema) —— EAS Metadata 商店配置的参考。
- [EAS Metadata 的静态与动态配置](/eas/metadata/config) —— 了解配置 EAS Metadata 的不同方式。
