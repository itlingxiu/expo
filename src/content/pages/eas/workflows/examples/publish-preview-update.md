---
title: 使用 EAS Workflows 发布预览更新
description: 了解如何使用 EAS Workflows 发布预览更新。
---

# 使用 EAS Workflows 发布预览更新

对项目做出更改之后，你可以通过发布[预览更新](/review/share-previews-with-your-team)与团队分享更改的预览。当你想和团队一起审阅更改、而不必拉取最新更改并在本地运行时，这很有用。

你可以在开发构建 UI 中，以及通过 EAS 仪表盘上可扫描的二维码访问预览更新。当每次提交都发布预览时，你的团队可以审阅更改，而不必拉取最新更改并在本地运行。

![展示预览更新工作流的图。](/static/images/eas-workflows/publish-preview-update.png)

> 视频：[Expo 黄金工作流：与团队分享预览更新](https://www.youtube.com/watch?v=v_rzRcVSQYQ)。用 EAS Workflows 在每次提交时发布预览更新，这样你的团队无需在本地拉取代码即可审阅更改。

## 开始使用

- **设置 EAS Update**

  你的项目需要已设置 [EAS Update](/eas-update/introduction) 才能发布预览更新。可以用以下命令设置项目：

  ```sh
  eas update:configure
  ```

- **创建新的开发构建**

  配置项目之后，为每个平台创建新的[开发构建](/develop/development-builds/introduction?buildenv=build-with-eas#你希望如何构建开发构建)。

下面的工作流会为每个分支上的每次提交发布预览更新。

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
