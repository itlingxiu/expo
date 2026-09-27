---
title: 程序化访问
description: 了解访问令牌的类型以及如何使用它们。
---

# 程序化访问

在设置 CI 或编写脚本来管理项目时，我们建议避免使用用户名和密码进行身份验证。使用这些凭据，任何人都可以登录并使用你的账户。

除了提供凭据，你还可以生成令牌，从而分别管理每个集成点。任何拥有这些令牌的人都可以对你的账户执行操作。请像对待用户密码一样小心保管令牌。如果发生泄露，你可以吊销这些令牌以阻止访问。

## 个人访问令牌

你可以在仪表板的 [Access tokens](https://expo.dev/settings/access-tokens) 页面创建个人访问令牌。任何拥有此令牌的人都可以代表你执行操作。这适用于你的个人账户上的所有内容，以及你被授予访问权限的任何个人账户或组织。

## 机器人用户与访问令牌

账户可以创建机器人（Robot）用户，以对账户拥有的资源执行操作。可以为机器人用户分配[角色](/accounts/account-types#管理访问权限)，以限制其被授权执行的操作。机器人用户无法登录任何 Expo 产品，不能自己拥有任何项目，并且只能通过访问令牌进行身份验证。

## 访问令牌的使用

你可以使用自己创建的任何令牌通过 EAS CLI 执行操作。要使用令牌，你需要在运行命令之前定义环境变量，例如 `EXPO_TOKEN="token"`。

设置 `EXPO_TOKEN` 环境变量后，你可以使用令牌进行身份验证来运行任何 EAS CLI 命令，而无需运行 `eas login` 命令。`eas login` 命令仅用于用户名和密码身份验证。如果同时配置了两者，`EXPO_TOKEN` 认证方式优先于用户名和密码。

例如，获得令牌后，你可以运行以下 EAS CLI 命令来触发构建：

```sh
$ EXPO_TOKEN=my_token eas build
```

:::note
使用访问令牌运行的命令要求项目已关联到 EAS 项目。如果你的[应用配置](/workflow/configuration)中未设置 `extra.eas.projectId`，则 `eas build` 等命令会失败并报 `EAS project not configured` 错误。要完成配置，请先运行 `EXPO_TOKEN=my_token eas init --force --non-interactive`。
:::

如果你使用的是 GitHub Actions，[可以配置 `token` 属性](https://github.com/expo/expo-github-action#configuration-options)，将该环境变量包含在所有作业步骤中。

访问令牌常见的适用场景：

- 在 CI 中发布或构建，而无需提供你的 Expo 用户名和密码
- 续期令牌以尽可能保证安全；无需重置密码并退出所有会话
- 以有限的权限向某人（或某个脚本）提供对项目的一次性访问

## 吊销访问令牌

如果令牌意外泄露，你可以将其吊销，而无需更改用户名和密码。吊销访问令牌后，使用该令牌访问你账户的所有途径都将被阻止。要执行此操作，请前往仪表板上的 [Access Token 页面](https://expo.dev/settings/access-tokens)，删除你要吊销的令牌。
