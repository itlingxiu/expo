---
title: 自定义域名
description: 为生产部署设置自定义域名。
---

# 自定义域名

默认情况下，EAS Hosting 上的生产部署看起来像这样：`my-app.expo.app`，其中 `my-app` 是你选择的预览子域名。如果你拥有一个域名，可以把它作为自定义域名分配给生产部署。

每个项目只能有一个自定义域名，它被分配给生产部署。

:::note
设置自定义域名是付费功能，免费方案不可用。不同方案及其权益见 [EAS 定价](https://expo.dev/pricing)。
:::

## 前置条件

- **一个已有生产部署的 EAS Hosting 项目**

  自定义域名始终加载生产部署。要为项目添加自定义域名，你需要先有一个已提升为生产的部署。

- **一个域名**

  你需要拥有想要使用的域名。

## 分配自定义域名

1. 在项目仪表盘中，前往 [Hosting settings](https://expo.dev/accounts/[accountName]/projects/[projectName]/hosting/settings)。
2. 如果还没有生产部署，系统会提示你先分配一个。
3. 在 **Custom domain** 下，输入你想设置的自定义域名。支持 apex 域名和子域名。如果你拥有 `example.com`，可以选择：
   - `example.com`：apex 域名
   - `anything.example.com`：子域名

4. 接下来，系统会提示你在 DNS 服务商处填写一些 DNS 记录：
   - **Verification**：证明你拥有该域名
   - **SSL**：设置 SSL 证书
   - **CNAME**（子域名）或 **A 记录**（apex 域名）：把域名指向你的生产部署

5. 按刷新按钮，直到所有检查通过。取决于你的 DNS 服务商，这一步通常只需要几分钟。

> 如果要求域名切换做到**零停机**，请按表格中给出的顺序逐条填写这些记录。也就是先添加 **Verification TXT** 记录，并按 “Refresh”，直到界面确认验证记录。然后添加 **SSL CNAME** 记录，直到它被确认，最后再设置第三条记录。如果停机并不重要或不相关，你可以一次添加全部三条 DNS 记录。

为应用分配自定义域名之后，自定义域名会路由到你的**生产**部署。

### 自定义域名的 DNS 记录

仪表盘向你展示的三条记录中，有两条用于验证你对域名的所有权。**Verification TXT** 记录证明你拥有该域名，因为它添加了一个可以读回的自定义令牌，以验证你是在自己控制的域名上设置该域名。**SSL CNAME** 记录向证书颁发机构证明你对域名的所有权，这也称为域名控制验证（Domain Control Validation，DCV）。它是 CNAME 记录，因为续期和验证都委托给自动化流程，从而避免证书过期。

这两条记录都创建在你正在设置的自定义域名的子域名上。

- 如果你设置的是 `example.com`，记录必须分别创建在 `_cf-custom-hostname.example.com` 和 `_acme-challenge.example.com` 上
- 如果你设置的是 `anything.example.com`，记录必须分别创建在 `_cf-custom-hostname.anything.example.com` 和 `_acme-challenge.anything.example.com` 上

最后，仪表盘给出的第三条 DNS 记录始终是真正把你的域名指向 EAS Hosting 的 DNS 记录。

- 对于 apex 域名，仪表盘通常建议使用指向 `172.66.0.241` 的 **A 记录**
- 对于子域名，仪表盘通常建议使用指向 `origin.expo.app` 的 **CNAME 记录**

这两条记录是等价的，但有些 DNS 服务商不允许在 apex 域名上设置 CNAME 记录。

### 别名与通配符子域名

:::note
如果你在 **2025 年 3 月 19 日**之前已经设置了自定义域名，在按照通配符域名的说明操作之前，必须先在项目的 [Hosting settings](https://expo.dev/accounts/[accountName]/projects/[projectName]/hosting/settings) 中按 “Refresh” 按钮。
:::

虽然每个项目只能设置一个自定义域名，但你可以进一步设置子域名 DNS 记录，以处理生产别名之外的其他别名请求。请求会被路由到别名与该子域名匹配的部署。

例如，在[创建 `staging` 别名](/eas/hosting/deployments-and-aliases#别名)之后，你可以为该别名设置 CNAME 记录：

- 如果你设置的是 apex 域名，例如 `example.com`，在 `staging.example.com` 上创建指向 `origin.expo.app` 的 CNAME 记录
- 如果你设置的是子域名，例如 `anything.example.com`，在 `staging.anything.example.com` 上创建指向 `origin.expo.app` 的 CNAME 记录

如果你希望把任意子域名请求指向你创建的任意别名，可以改为设置通配符 CNAME 记录：

- 如果你设置的是 apex 域名，例如 `example.com`，在 `*.example.com` 上创建指向 `origin.expo.app` 的 CNAME 记录
- 如果你设置的是子域名，例如 `anything.example.com`，在 `*.anything.example.com` 上创建指向 `origin.expo.app` 的 CNAME 记录

通配符 CNAME 记录始终以 `*` 开头，代表任意子域名。只要自定义域名上的子域名指向 `origin.expo.app`，EAS Hosting 就会尝试把请求发送到名称匹配的别名所对应的部署。

例外是 `www` 子域名。如果你设置了 `www` 子域名，并且不存在名为 `www` 的别名，请求会以 308 响应重定向到自定义域名，并被视为对生产部署的请求。如果你只想为自定义域名上的 `www` 子域名设置自动重定向，在 `www.<yourdomain>` 上创建指向 `origin.expo.app` 的 CNAME 记录。
