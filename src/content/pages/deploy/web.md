---
title: 发布你的 Web 应用
description: 了解如何使用 EAS Hosting 部署 Web 应用。
---

# 发布你的 Web 应用

通用（universal）应用可以用 [EAS Hosting](/eas/hosting/introduction) 快速部署到 Web —— 它是"为用 Expo Router 与 React 构建的 Web 应用提供的部署服务"。

## 前置条件

### 在 app.json 中设置 expo.web.output

在 **app.json** 中，[`expo.web.output`](/versions/latest/config/app) 属性必须设置为 `static` 或 `server`。

## 导出你的 Web 项目

需要一次静态构建。把项目导出到 **dist** 目录：

```sh
# npm
npx expo export --platform web

# yarn
yarn expo export --platform web

# pnpm
pnpm expo export --platform web

# bun
bun expo export --platform web
```

:::note
Web 应用每次改动后、部署前，都要重新运行此命令。
:::

## 初始部署

用 [EAS CLI](/develop/tools) 发布：

```sh
eas deploy
```

首次运行时，会提示你选择一个预览子域名（subdomain）——"用于创建预览 URL 的前缀，也用于生产部署"。在 `https://test-app--1234.expo.app` 中，`test-app` 就是预览子域名。部署完成后，CLI 会打印预览 URL。

## 生产部署

用以下命令创建生产部署：

```sh
eas deploy --prod
```

完成后，CLI 会打印生产 URL。

## 自动部署

通过 [EAS Workflows](/eas/workflows/introduction) 可以自动部署 Web。步骤：[配置你的项目](/eas/workflows/get-started)，在项目根目录添加 **.eas/workflows/deploy-web.yml**，并加入以下配置：

```yaml .eas/workflows/deploy-web.yml
name: Deploy web

on:
  push:
    branches: ['main']

jobs:
  deploy_web:
    name: Deploy web
    type: deploy
    params:
      prod: true
```

这样每次提交到 `main` 都会创建一次 Web 部署。也可以手动运行：

```sh
eas workflow:run deploy-web.yml
```

更多模式：[工作流示例指南](/eas/workflows/examples/introduction)。

### 面向 AI Agent 的 Expo Skills

安装 [Expo Skills](/skills)，让 AI Agent 学会如何部署 Web 应用。[eas-hosting](https://github.com/expo/skills/blob/main/plugins/expo/skills/eas-hosting/SKILL.md) 技能涵盖把 Expo 站点与 Expo Router API 路由部署到 EAS Hosting —— 导出 Web bundle、运行 `eas deploy` 获取生产与 PR 预览 URL、管理环境密钥与自定义域名，以及在 Cloudflare Workers 运行时中工作。

## 了解更多

更多主题：[部署别名](/eas/hosting/deployments-and-aliases)、[自定义域名](/eas/hosting/custom-domain)，以及[部署 API Route](/router/web/api-routes)。
