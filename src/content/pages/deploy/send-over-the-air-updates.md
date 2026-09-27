---
title: 发送无线（OTA）更新
description: 了解如何发送无线更新，向用户推送关键 Bug 修复与改进。
---

# 发送无线（OTA）更新

你可以发送无线（over-the-air）更新，把关键 Bug 修复与改进推送给用户。

## 开始使用

:::note
如果你之前发布过[预览](/review/share-previews-with-your-team)或创建过[构建](/deploy/build-project)，更新可能已经设置好了，可以跳过本节。
:::

运行以下 [EAS CLI](/develop/tools) 命令设置更新：

```sh
eas update:configure
```

完成后，必须先创建新的构建，再继续下一节。

## 发送更新

用以下 [EAS CLI](/develop/tools) 命令发送更新：

```sh
eas update --channel production
```

它创建一个更新，并让配置为在 `production` 频道上接收更新的应用构建可以使用它。该频道在 [**eas.json**](/eas/json) 中定义。

要检查是否生效，强制关闭应用并重新打开"两次"；更新应在第二次启动时生效。

## 自动发送更新

使用 [EAS Workflows](/eas/workflows/introduction) 可以自动发送更新。先[配置你的项目](/eas/workflows/get-started)，然后在项目根目录添加名为 **.eas/workflows/send-updates.yml** 的文件，配置如下：

```yaml .eas/workflows/send-updates.yml
name: Send updates

on:
  push:
    branches: ['main']

jobs:
  send_updates:
    name: Send updates
    type: update
    params:
      channel: production
```

该工作流在 `main` 分支的每次提交时为 `production` 更新频道发送一个无线更新。也可以手动触发：

```sh
eas workflow:run send-updates.yml
```

更多常见模式见[工作流示例指南](/eas/workflows/examples/introduction)。

## 了解更多

你可以学习如何[分批发布更新](/eas-update/rollouts)、[优化资源](/eas-update/optimize-assets)等等，详见[更新指南](/eas-update/introduction)。
