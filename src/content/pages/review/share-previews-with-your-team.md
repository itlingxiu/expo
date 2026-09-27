---
title: 与团队分享预览
description: 在分支上发布更新，把应用预览分享给团队。
---

# 与团队分享预览

在分支上做出改动后，你可以通过"发布更新（update）"把它们分享给团队，在审查期间获取对改动的反馈。

下面的步骤描述了一个基础的预览发布与分享流程；更完整的资源见[预览更新](/eas-update/preview)指南。

## 发布你的改动预览

用以下 EAS CLI 命令发布当前改动：

```sh
eas update --auto
```

该命令会"以当前分支名"发布一个更新。

## 与团队分享

发布后，终端输出类似：

```sh
✔ Published!

...
EAS Dashboard      https://expo.dev/accounts/your-account/projects/your-project/updates/708b05d8-9bcf-4212-a052-ce40583b04fd
```

把 **EAS 仪表盘**链接分享给审查者。打开链接后，他们可以按 **Preview** 按钮，弹出一个二维码，扫描后即可在设备上启动预览。

## 自动创建预览

使用 EAS Workflows 可以在每次提交时生成预览。步骤：先[配置你的项目](/eas/workflows/get-started)，然后在项目根目录放置名为 **.eas/workflows/publish-preview-update.yml** 的文件，配置如下：

```yaml .eas/workflows/publish-preview-update.yml
name: Publish preview update

on:
  push:
    branches: ['*']

jobs:
  publish_preview_update:
    name: Publish preview update
    type: update
    params:
      branch: ${{ github.ref_name || 'test' }}
```

该工作流"在每个分支的每次提交时发布一个更新"。也可以手动触发：

```sh
eas workflow:run publish-preview-update.yml
```

进一步阅读：[工作流示例指南](/eas/workflows/examples/introduction)。

## 了解更多

- [预览更新](/eas-update/preview) —— 了解如何在开发、预览与生产构建中预览更新。
