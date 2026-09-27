---
title: 审计日志
description: 了解如何使用审计日志跟踪和分析账户的活动。
---

# 审计日志

:::note
审计日志仅面向 [Enterprise 计划](https://expo.dev/pricing)客户提供。
:::

审计日志记录了账户使用 Expo Application Services (EAS) 执行的操作。记录的数据包括受影响实体的信息、对其所做的修改类型、操作执行者以及活动发生的时间。

## 要点

- 审计日志只能创建，无法修改或删除，它作为可信数据来源，帮助监控账户内发生的事件并调试问题。
- **审计日志仅面向 Enterprise 计划客户提供**。订阅后，Expo 内部使用的部分日志立即可用，而其他类型的日志则在订阅激活后开始收集。
- 审计日志保存 1.5 年。如果账户被删除，其审计日志将在 90 天后删除。
- 要访问审计日志，请前往 **Account settings**/**Organization settings** > [**Audit logs**](https://expo.dev/accounts/[account]/settings/audit-logs)，或使用 [EAS CLI](#使用-eas-cli-查看审计日志)。

![展示账户审计日志页面的截图。](/static/images/accounts/audit-logs-light.webp)

## 使用场景

### 权限监控

审计日志可以跟踪组织内的用户邀请和权限变更。一个示例安全事件可能是：某员工账户被盗用，攻击者借此邀请自己加入组织，并将自己的权限更改为 [Admin](/accounts/account-types#管理访问权限)。

在这种场景下，审计日志会记录是哪个员工账户邀请了攻击者并修改了权限。由于审计日志不可变，攻击者无法删除这段被记录的历史。组织的其他成员可以查看审计日志，确定哪个账户被盗用，采取措施撤销攻击者的权限并保护员工账户的安全。

审计日志按权限名称记录权限变更，而不是按角色。例如，`PUBLISH_PROTECTED` 权限包含在 Release Manager、Admin 和 Owner [角色](/accounts/account-types#管理访问权限)中。它允许管理受保护渠道（目前处于私有测试阶段），并向这些渠道指向的分支发布更新。

### 访问历史

Expo 组织账户可以包含许多项目，这些项目的开发访问权限由分配给各个团队的发布证书控制。当设备被授予加入这些团队的权限时，跟踪权限的授予和移除对于留存历史记录非常重要。即使某台设备当前不在某个 Apple 团队中，在发生内部安全事件时，了解谁此前拥有该团队的访问权限也很有用。

Expo 团队设置中列出的 Apple 设备只会显示当前已注册到账户的设备，但借助审计日志，可以查看 Apple 团队和设备的历史修改记录。

## 审计日志实体

虽然我们正在努力在未来添加更多实体，但以下实体已经启用：

- Account
- Account subscription
- Android App Credentials
- Android Keystore
- App Store Connect API key
- Apple Device
- Apple Distribution Certificate
- Apple Provisioning Profile
- Apple Team
- EAS Hosting Alias
- EAS Hosting Custom Domain
- EAS Hosting Deployment
- EAS Update Branch
- EAS Update Channel
- Google Service Account key
- iOS App Credentials
- LogRocket Organization
- LogRocket Project
- Organization SSO Configuration
- Project
- User Invitation
- User Permission
- Workflow
- Workflow Revision

### 结构

审计日志条目包含以下字段：

| 字段 | 说明 |
| --- | --- |
| Actor | 执行特定操作的账户主体。 |
| Entity Type | 被以下修改类型之一修改的对象：`CREATE`、`UPDATE`、`DELETE`。 |
| Action Type | 修改的类型：`CREATE`、`UPDATE`、`DELETE`。 |
| Message | 包含基于 **Action** 的信息。 |
| Created At | 特定操作执行的时间。 |

此外，点击某条审计日志行，可以查看与该日志相关的元数据。

![展示审计日志详情抽屉的截图。](/static/images/accounts/audit-logs-details-light.webp)

## 导出

**审计日志仅面向 Enterprise 计划客户提供**。订阅后，Expo 内部使用的部分日志立即可用，而其他类型的日志将在订阅激活后收集。

你可以导出审计日志，以便在 Expo 仪表板之外查看。要导出审计日志：

1. 在侧边栏菜单中，点击 **Account/Organization settings** 下的 [**Audit logs**](https://expo.dev/accounts/[account]/settings/audit-logs)。
2. 点击审计日志页面右上角的 **Export** 按钮。

   ![审计日志导出按钮。](/static/images/accounts/audit-logs-export-button-light.webp)

3. 选择所需的时间范围。导出支持最长 30 天的时间范围。
4. 审计日志将以文件形式导出供下载。

导出的文件将包含审计日志页面上显示的所有字段，**Message** 字段除外。

:::note
**Export** 按钮仅在 Expo 网站上可用。要以编程方式读取审计日志，请使用 [EAS CLI](#使用-eas-cli-查看审计日志)。
:::

## 使用 EAS CLI 查看审计日志

你也可以在终端中以编程方式读取审计日志。运行 `eas account:audit` 命令并附上账户名：

```sh
$ eas account:audit my-account
```

如果省略账户名，命令会提示你选择一个。要在脚本中读取日志，请传入 `--json` 标志：

```sh
$ eas account:audit my-account --json
```

关于分页和其余标志，请参阅 [`eas account:audit`](/eas/cli#eas-account-audit-account-name) 参考。
