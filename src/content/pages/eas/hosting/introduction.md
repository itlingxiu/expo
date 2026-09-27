---
title: EAS Hosting 简介
description: EAS Hosting 是一项服务，用于快速部署使用 Expo Router 库和 React Native Web 构建的 Web 项目。
---

# EAS Hosting 简介

**EAS Hosting** 是来自 EAS（Expo Application Services）的服务，用于快速部署使用 [Expo Router](/router/introduction) 和 React Native Web 构建的 Web 项目。它与 Expo CLI 无缝集成，让你可以自动化部署 API 路由、服务器函数和服务端资源。

EAS Hosting 提供了从 `npx create-expo-app` 到带有 API 路由和服务器函数的完整已部署 Web 应用的最快路径。

## 快速开始

:::note
下面的 `eas` 命令需要 EAS CLI。更多信息见[如何安装 EAS CLI](/eas/cli#安装)。
:::

要部署 Web 应用，你需要创建 Web 项目的静态构建。运行以下命令，把 Web 项目导出到 **dist** 目录：

:::tabs
:::tab npm
```sh
npx expo export --platform web
```
:::
:::tab yarn
```sh
yarn expo export --platform web
```
:::
:::tab pnpm
```sh
pnpm expo export --platform web
```
:::
:::tab bun
```sh
bun expo export --platform web
```
:::
:::

要发布 Web 应用，运行以下命令：

```sh
eas deploy
```

部署完成后，EAS CLI 会输出一个预览 URL，用于访问已部署的 Web 应用。

### 面向 AI agent 的 Expo Skills

如果你使用 AI agent，安装 [Expo Skills](/skills) 来教它如何部署 Web 应用和 API 路由。相关技能：`eas-hosting`。

## 为什么使用 EAS Hosting

以往，部署 Expo Router 和 React 应用时，通常推荐传统的网站托管服务。但这种方式无法应对原生应用特有的挑战。以下是一些关键限制：

- **版本同步**：在应用商店发布过程中，你可能需要部署服务器的新版本。

- **请求路由的复杂性**：原生应用的不同版本可能需要路由到特定的服务器版本。处理请求时这会带来额外的复杂性。

- **特定平台的分析**：运行原生应用时，你需要针对特定平台指标的更强可观测性。

EAS Hosting 通过在所有平台上提供统一的部署体验来应对这些限制。

## 何时使用 EAS Hosting

| 场景 | 建议 |
| --- | --- |
| 部署 Web 构建，而无需单独搭建托管服务商 | 推荐 |
| 在 Expo Router 应用中使用 API 路由或服务器函数 | 推荐 |
| 在 Android、iOS 和 Web 上保持一致的部署工作流 | 推荐 |
| 使用 [EAS Workflows](/eas/hosting/workflows) 自动化部署 | 推荐 |
| 内置监控服务端代码的崩溃、日志和请求 | 推荐 |
| 只有移动端、没有 Web 部分的项目 | 不推荐 |
| 需要完整的 Node.js 运行时兼容性（EAS Hosting 使用具备部分 Node.js 支持的 [Cloudflare Workers 运行时](/eas/hosting/reference/worker-runtime)） | 不推荐 |
| 已经有能满足需求的既有 Web 基础设施 | 不推荐 |

## 常见问题（FAQ）

<details>
<summary>EAS Hosting 可以使用哪些 Web 输出模式？</summary>

EAS Hosting 支持应用配置中 `expo.web.output` 的全部三种输出模式：

- `single`：把 Expo 应用导出为只有一个 **index.html** 输出的单页应用
- `static`：把 Expo 应用导出为[静态生成的 Web 应用](/router/web/static-rendering)
- `server`：除静态页面外，还支持[服务器函数](/guides/server-components#react-服务器函数)和 [API 路由](/router/web/api-routes)

</details>

<details>
<summary>可以在 EAS Hosting 中使用 API 路由吗？</summary>

使用 `server` 输出模式时，EAS Hosting 完整支持 [API 路由](/router/web/api-routes)（以 **+api.ts** 结尾的文件）。你可以在 [EAS 仪表盘](/eas/hosting/api-routes)中监控来自 API 路由的崩溃、日志和请求。

</details>

<details>
<summary>EAS Hosting 使用什么运行时？</summary>

EAS Hosting 构建在 [Cloudflare Workers](https://developers.cloudflare.com/workers/) 之上，运行在 V8 JavaScript 引擎上。它使用 V8 isolate，而不是完整的 Node.js 进程。Node.js 兼容模块可用，但有一些限制。支持的模块完整列表见[worker 运行时参考](/eas/hosting/reference/worker-runtime)。

</details>

<details>
<summary>可以为生产部署设置自定义域名吗？</summary>

[自定义域名](/eas/hosting/custom-domain)在付费方案上可用。每个项目可以有一个分配给生产部署的自定义域名。支持 apex 域名和子域名。

</details>

<details>
<summary>如何创建部署别名？</summary>

EAS Hosting 的部署是不可变的。每个部署都会得到一个唯一的预览 URL。你可以创建[别名](/eas/hosting/deployments-and-aliases)，为部署分配自定义名称（例如 `staging` 或 `production`）。由于部署不可变，你可以通过 `eas deploy:alias --prod --id=<deploymentId>` 把别名重新分配给先前的部署 ID，从而立即回滚。

</details>

<details>
<summary>EAS Hosting 提供哪些监控能力？</summary>

EAS Hosting 在 [EAS 仪表盘](/eas/hosting/api-routes)中提供内置监控：

- **崩溃**：查看来自 API 路由的未捕获错误，并按相似度分组
- **日志**：来自 API 路由的全部 `console.log`、`console.info` 和 `console.error` 输出
- **请求**：请求元数据，包括状态、浏览器、区域和耗时

</details>

<details>
<summary>如何在 EAS Hosting 中配置缓存？</summary>

API 路由可以返回 `Cache-Control` 指令，EAS Hosting 用它们在全球 CDN（内容分发网络）上缓存响应。静态资源的默认浏览器缓存时间为 3600 秒。详情见[缓存](/eas/hosting/reference/caching)参考。

</details>

<details>
<summary>可以把 EAS Hosting 与 EAS Workflows 一起使用吗？</summary>

EAS Hosting 使用 `deploy` 作业类型与 [EAS Workflows](/eas/workflows/get-started) 集成。你可以在工作流配置中添加 deploy 作业。例如：

```yaml
jobs:
  deploy_web:
    type: deploy
    environment: production
    params:
      prod: true
```

你也可以部署到特定别名，或根据分支有条件地设为生产：

```yaml
jobs:
  deploy:
    type: deploy
    params:
      prod: ${{ github.ref_name == 'main' }}
```

更多信息见[使用 EAS Workflows 进行 Web 部署](/eas/hosting/workflows)。

</details>

## 开始使用

- [创建你的第一次部署](/eas/hosting/get-started)：从新应用到已部署网站，不到一分钟。
- [分配部署别名](/eas/hosting/deployments-and-aliases)：创建别名，并把部署提升到生产。
- [配置环境变量](/eas/environment-variables/usage#在-eas-hosting-中使用环境变量)：在 Web 和服务器代码中使用环境变量。
- [自定义域名](/eas/hosting/custom-domain)：为生产部署设置自定义域名。
- [API 路由](/eas/hosting/api-routes)：在 EAS Hosting 仪表盘上检查来自 API 路由的请求。
- [使用 EAS Workflows 部署](/eas/hosting/workflows)：用 EAS Workflows 自动化部署。
