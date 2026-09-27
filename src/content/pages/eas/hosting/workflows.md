---
title: 使用 EAS Workflows 进行 Web 部署
description: 了解如何用 EAS Hosting 和 Workflows 自动化网站与服务器部署。
---

# 使用 EAS Workflows 进行 Web 部署

EAS Workflows 很适合自动化 React Native 的 CI/CD 流水线，把项目的网站和 API 路由部署到 EAS Hosting，并支持拉取请求（PR）预览和生产部署。

## 设置工作流

要使用 [EAS Workflows](/eas/workflows/get-started) 自动部署项目，请按照[开始使用 EAS Workflows](/eas/workflows/get-started)中的说明操作。你也可以添加 [GitHub 集成](/eas/workflows/get-started)，把 GitHub 仓库连接到工作流。

## 创建部署工作流

把下面的文件添加到 **.eas/workflows/deploy.yml**。每当你推送到 `main` 分支时，它会使用生产环境变量，导出 Web 包，部署项目，并把它提升到生产。

```yaml .eas/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: ['main']

jobs:
  deploy:
    type: deploy
    name: Deploy
    environment: production
    params:
      prod: true
```

现在，每当有提交推送到 `main` 或 PR 被合并，工作流就会运行以部署你的网站。

你也可以手动触发来测试这个工作流：

```sh
eas workflow:run .eas/workflows/deploy.yml
```

## 创建 PR 预览工作流

把下面的文件添加到 **.eas/workflows/pr-preview.yml**。每当创建或更新拉取请求时，它会自动部署网站预览，并在 PR 上发表包含部署详情的评论。

```yaml .eas/workflows/pr-preview.yml
name: PR Preview

on:
  pull_request: {}

jobs:
  deploy:
    type: deploy
    name: Deploy PR Preview

  comment:
    needs: [deploy]
    type: github-comment
```

每当拉取请求被打开、重新打开或同步时，这个工作流都会运行。`comment` 作业会自动发现该部署，并把详情发布到拉取请求，方便审阅者测试你的更改。
