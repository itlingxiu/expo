---
title: API 路由
description: 了解如何在 EAS Hosting 仪表盘中检查来自 API 路由的请求。
---

# API 路由

:::note
本页介绍 EAS Hosting 中与 API 路由相关的细节。关于该主题的一般文档，请参阅 Expo Router 下的 [API 路由](/router/web/api-routes)文档。
:::

API 路由中发生的崩溃、日志和请求，都可以在 EAS Hosting 仪表盘上检查。

### 崩溃

崩溃是指处理请求时抛出的任何未捕获错误，它导致无法返回响应，例如 `throw new Error("An error!")`。可以在 [Hosting crashes](https://expo.dev/accounts/[accountName]/projects/[projectName]/hosting/crashes) 页面查看崩溃。

崩溃会分组。如果检测到相似的崩溃，你只会看到一行条目。崩溃详情会显示该崩溃第一次和最后一次已知发生时的堆栈跟踪和元数据。

![显示崩溃列表的 EAS 仪表盘](/static/images/eas-hosting/crashes.webp)

### 日志

来自 API 路由和服务器函数的所有日志（`console.log`、`console.info`、`console.error` 等）都会记录在部署级别的日志页面上。前往 [Hosting deployments](https://expo.dev/accounts/[accountName]/projects/[projectName]/hosting/deployments) > _选择一个部署_ > **Logs**。

![显示日志列表的 EAS 仪表盘](/static/images/eas-hosting/logs.webp)

### 请求

可以在项目级别的 [Hosting requests](https://expo.dev/accounts/[accountName]/projects/[projectName]/hosting/requests) 查看请求，也可以在部署级别的 [Hosting Deployments](https://expo.dev/accounts/[accountName]/projects/[projectName]/hosting/deployments) > _选择一个部署_ > **Requests** 查看。

这里会显示针对你的服务的请求列表，以及每个请求的元数据（状态、浏览器、区域、耗时等）。其中包括对该服务的所有请求，也包括对 API 路由的请求。

![显示请求列表的 EAS 仪表盘](/static/images/eas-hosting/requests.webp)

### 按 ID 查找请求

所有响应头都包含一个形如 `8ffb63895cf6779b-LHR` 的 `Cf-Ray` 头。前半部分是请求 ID，你可以在 [**Hosting** > **Requests**](https://expo.dev/accounts/[accountName]/projects/[projectName]/hosting/requests) 中用筛选器，通过这个 ID 在 EAS 仪表盘上查找该请求。

这个请求 ID 也会显示在任何服务级错误页面上。

### 采样

如果某个部署收到大量流量，EAS Hosting 记录的数据会被[降采样](https://developers.cloudflare.com/analytics/graphql-api/sampling/)。这意味着随着部署收到的请求增多，记录的数据点会变少，你可能不会看到每一条请求、日志和崩溃都被逐条列出。不过，请求数或崩溃数等统计计数仍会按比例估算，以反映全部请求。
