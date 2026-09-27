---
title: 单点登录 (SSO)
description: 了解你的组织如何使用身份提供商来管理团队中的 Expo 用户。
---

# 单点登录 (SSO)

单点登录 (SSO) 仅面向 [Production 和 Enterprise 计划](https://expo.dev/pricing)客户提供。

要开始使用，请按照下方[身份提供商的配置指南](#身份提供商支持)准备你的身份提供商 (IdP) 并为 Expo SSO 收集信息。完成后，你组织的 Owner 可以按照说明[启用 SSO](#在组织上设置-sso)。

如果你有疑问或遇到问题，请[联系我们](https://expo.dev/contact)，我们将协助你完成组织设置。

## 身份提供商支持

Expo SSO 支持以下身份提供商：

| 身份提供商 | 资源 |
| --- | --- |
| [Okta](https://www.okta.com/) | [配置指南](https://expo.fyi/sso-setup-okta) |
| [OneLogin](https://www.onelogin.com/) | [配置指南](https://expo.fyi/sso-setup-onelogin) |
| [Microsoft Entra ID](https://www.microsoft.com/en-us/security/business/microsoft-entra) | [配置指南](https://expo.fyi/sso-setup-microsoft) |
| [Google Workspace](https://www.google.com/) | [配置指南](https://expo.fyi/sso-setup-google-ws) |

我们实现了 [OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html) 规范，并正在努力验证更多兼容的身份提供商。如果你使用的是其他身份提供商并且对 SSO 感兴趣，请[告诉我们](https://expo.dev/contact)。

## 在组织上设置 SSO

> 组织账户必须保留至少一个拥有 Owner 角色的非 SSO 用户。初始 SSO 设置需要该用户，并且如果你的 SSO 配置发生变化或停止使用 SSO 时，该用户可确保你对组织的访问不中断。

1. 以组织账户 Owner 的身份登录。在账户的 EAS 仪表板中，前往 **Settings** > **Organization settings** > **Create SSO configuration for account**。

2. 在 **Create SSO configuration for account** 页面上，点击 **Start** 按钮。

3. 使用在 IdP 设置期间收集的信息，输入你的 IdP 的配置详情：

   - Client ID
   - Client secret
   - IdP 子域名/租户 ID（如有需要）。点击 Issuer 字段上方的 **?** 图标可获取填写帮助。

4. 点击 **Create SSO Configuration**。

5. **Organization settings** > **Overview** 页面现在将显示 **Update SSO configuration** 选项。如果 client secret 发生变化，可使用此选项进行更新。

## SSO 用户登录

### Expo 网站

1. 前往 [expo.dev/sso-login](https://expo.dev/sso-login) 并输入你组织的账户名称。你可以创建一个预填组织名称的链接。例如，[expo.dev/sso-login/test-org](https://expo.dev/sso-login/test-org) 会预填 `test-org`。

2. 登录你的身份提供商 (IdP)。

3. 系统会提示你选择一个 Expo 用户名。该用户名将成为你的 Expo 账户用户名。

### Expo CLI

使用 Expo CLI 时，你可以运行以下命令登录你的 Expo 账户。

:::tabs
:::tab npm
```sh
$ npx expo login --sso
```
:::
:::tab yarn
```sh
$ yarn expo login --sso
```
:::
:::tab pnpm
```sh
$ pnpm expo login --sso
```
:::
:::tab bun
```sh
$ bun expo login --sso
```
:::
:::

系统会提示你在浏览器中通过 Expo 网站登录，完成后会重定向回 CLI。

### EAS CLI

使用 EAS CLI 时，你可以运行以下命令登录你的 Expo 账户。

```sh
$ eas login --sso
```

系统会提示你在浏览器中通过 Expo 网站登录，完成后会重定向回 CLI。

### Expo Go

1. 在登录流程中，点击登录页面上的 **Continue with SSO** 按钮。

2. 按照[上述步骤](#expo-网站)登录 Expo 网站。

## SSO 用户限制

SSO 用户与普通用户类似。不过，有几个已知的例外：

- SSO 用户只能属于其 SSO 组织。他们也不能创建其他组织。
- SSO 用户无法离开其 SSO 组织。离开会删除其 SSO 用户。
- SSO 用户无法登录 Expo 论坛。
- SSO 用户无法为其个人账户订阅 EAS。

## SSO 管理

新组织和现有组织都可以启用 SSO 作为登录选项。拥有现有非 SSO 成员的组织可以启用 SSO，然后引导新成员使用 SSO 登录页面，而现有用户则继续使用他们当前的 Expo 凭据。为了支持外部贡献者，启用 SSO 的组织还允许通过电子邮件邀请额外的非 SSO 用户。

### 将现有用户迁移到 SSO

普通用户可以是一个或多个个人账户、团队账户和组织账户的成员，而 SSO 用户只属于其组织账户。因此，现有用户无法直接转换为 SSO 用户。不过，已经是组织成员的普通用户可以通过访问 [SSO 登录页面](https://expo.dev/sso-login)创建第二个用户。然后，可以将他们的普通用户从组织中移除。

要从使用普通 Expo 账户切换到 SSO 账户，请按照以下步骤操作：

1. 检查你是否已在 [expo.dev](https://expo.dev) 登录。如果已登录，请退出登录。

2. 前往 [SSO 登录页面](https://expo.dev/sso-login)并按照提示操作，例如输入你的组织名称、创建新的 Expo 用户名以及登录你的身份提供商。

3. 默认情况下，你的新 SSO 用户将拥有 View Only 角色。如果你需要其他角色，请让 Admin 或 Owner 在 [**Members**](https://expo.dev/accounts/[account]/settings/members) 设置中更新你的角色。

4. 运行 `eas login --sso`，在 CLI 上切换到你的新账户。

5. 此时，Admin 或 Owner 可以将你的旧用户从组织中移除。在 [**Members**](https://expo.dev/accounts/[account]/settings/members) 设置中，组织成员列表会标明用户是 SSO 用户还是非 SSO 用户。Admin 或 Owner 可以点击旧用户旁边的下拉菜单，然后点击 **Remove member**。

6. 如果你不再需要旧用户账户，请退出新的 SSO 账户，然后登录旧账户并前往 [**User settings**](https://expo.dev/settings)。向下滚动并点击 **Delete Account**。**请注意，这将删除你旧用户账户下的所有项目。** 这不会影响组织拥有的任何项目。

> 如果你希望在新 SSO 用户账户上沿用旧用户名，可以在创建 SSO 账户之前，在旧用户的 [**User settings**](https://expo.dev/settings) 下将其重命名。或者，你也可以在删除旧用户后，重命名 SSO 用户账户的 Expo 用户名。Expo 用户名需要保持唯一，但你的身份提供商上的电子邮件地址与旧用户的电子邮件地址相同是没问题的。

### 移除 SSO 用户

如果有人离开了你的组织，请在 IdP 中将其移除或禁用。根据你在 IdP 中配置的令牌刷新时长，被移除的用户将随之失去对其 Expo 账户的访问权限。
如果你希望在此时间之前移除他们，或者为了清理账户上的用户而移除他们，可以在组织的 **Members** 设置页面上操作：

1. 导航到你的[组织账户 **Members** 设置](https://expo.dev/accounts/[account]/settings/members)。

2. 点击你要删除的成员旁边的下拉菜单，然后点击 **Delete SSO user**。

   :::warning
   这将删除他们的个人账户及其所有关联数据。你的组织账户中的所有数据将不受影响。
   :::

### 更改计费或停止使用 SSO

继续使用 SSO 需要有效的 Production 或 Enterprise 计划。如果你希望停止使用 SSO 或更改计划，请[联系我们](https://expo.dev/contact)。

为确保无论是否启用 SSO，你对组织的访问都不中断，SSO 组织必须保留至少一个拥有 Owner 角色的非 SSO 用户作为成员。

### 删除 SSO 组织

一旦为组织配置了 SSO，删除账户必须由 Expo 团队手动完成。请[联系我们](https://expo.dev/contact)获取帮助。
