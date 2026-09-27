---
title: 账户类型
description: 了解不同类型的 Expo 账户以及如何使用它们。
---

# 账户类型

Expo 账户是容纳 Expo 项目并支持不同程度协作的容器。Expo 账户分为两种类型：**个人（Personal）** 账户和**组织（Organization）** 账户。

为新项目选择哪种账户类型取决于项目的性质。如果你希望进行协作，或为开发团队搭建工作流，请始终创建组织账户。对于个人或业余项目，个人账户就足够了。

## 个人账户

当你[注册 Expo 账户](https://expo.dev/signup)时，系统会自动为你创建一个个人账户。这个账户适合存放你的个人项目。

:::warning
无论出于何种原因，都不要与任何人共享你的个人账户身份验证凭据。
:::

## 组织

组织账户最适合存放你希望与公司或开发者团队的其他成员共享的项目。它是一个共享容器，你的团队可以在其中协作开发一个或多个项目，并访问共享凭据。

你可以邀请其他成员加入你的组织账户，然后为这些成员分配不同的角色，以授予他们在组织内的访问级别。更多信息请参阅[管理访问权限中的角色权限](#管理访问权限)。

在以下情况下，创建组织账户很有用：

- 你认为将来可能需要转移该组织项目的控制权。
- 与协作者团队共享一个或多个项目。
- 需要分配多个 [Owner](#管理访问权限)。
- 需要隔离费用支出。
- 通过为组织的每位成员分配角色来授予不同级别的访问权限。
- 为不同场景组织项目。例如，为不同客户工作时，可以为每个客户创建一个新的组织。
- 共享 [EAS 订阅](/eas)。

### 创建新组织

如果你已登录个人账户，可以从仪表板创建新组织：

- 在导航菜单中选择你的账户用户名，打开下拉菜单。
- 在下拉菜单的 Organizations 下选择 **Create Organization**。

![打开仪表板的下拉菜单以创建新组织。](/static/images/accounts/create-an-organization-light.webp)

- 为组织添加名称、编辑其 slug，或邀请团队成员。然后选择 **Create** 按钮。

![输入新组织的名称。](/static/images/accounts/enter-name-org-light.webp)

创建新组织后，你将被重定向到该组织的新仪表板页面。要将新项目与组织关联，你需要在项目的 **app.json** 中，于 `expo` 键下添加 [`owner` 键](/versions/latest/config/app#owner)。

### 将个人账户转换为组织

当你希望与其他成员共享项目访问权限并为每位成员分配基于角色的权限时，可以将个人账户转换为组织。

在个人账户的 **User settings** 中，前往 [Convert your account into an organization](https://expo.dev/settings#convert-account) 部分以开始转换流程。

在转换过程中，我们会非常小心地确保你和你的用户所依赖的所有功能都能继续按预期工作：

- 你可以继续向用户推送更新和推送通知。
- 你仍然可以使用存储在 Expo 服务器上的任何 Android 或 iOS 凭据。
- 任何使用你的个人访问令牌或 webhook 的集成都将继续运行，并转移到新的指定所有者名下。
- 你的 EAS 订阅将不间断地继续有效。
- 你的生产应用将不间断地继续运行。

### 邀请成员

可以邀请其他 Expo 用户加入你的组织。要邀请新成员：

- 在 EAS 仪表板中，导航到 **Organization settings** 下的 [**Members**](https://expo.dev/settings/members)。
- 点击 **Invite** 按钮。这会打开一个用于邀请成员加入组织的表单。
- 在表单中输入你想邀请的用户的电子邮件地址，并选择他们加入组织后应拥有的角色。更多信息请参阅[管理访问权限中的角色权限](#管理访问权限)。

![展示组织中多位成员的示例。](/static/images/accounts/members-light.webp)

邀请新成员时，请记住：

- 只有拥有 Owner 或 Admin 角色的成员才能邀请他人。
- 拥有 Owner 角色的成员可以为成员和被邀请者授予任何角色。
- 拥有 Admin 角色的成员只能为成员和被邀请者授予最高到 Admin 的角色（即除 Owner 外的所有角色）。

### 更改成员角色

要更改成员的角色权限，请确保你拥有 [**Owner** 或 **Admin** 角色](#管理访问权限)，然后按照以下步骤操作：

- 在 EAS 仪表板中，导航到 **Organization settings** 下的 [**Members**](https://expo.dev/settings/members)。
- 在要更改角色的成员旁边，点击三点菜单图标并更改角色。

### 移除成员

要移除成员，请确保你拥有 [**Owner** 或 **Admin** 角色](#管理访问权限)，然后按照以下步骤操作：

- 在 EAS 仪表板中，导航到 **Organization settings** 下的 [**Members**](https://expo.dev/settings/members)。
- 在要移除的成员旁边，点击三点菜单图标。
- 点击 **Remove member**。

### 重命名账户

账户重命名的次数有限。只有 Owner 可以重命名账户。要重命名账户，请访问 **Settings** > [**Organization settings**](https://expo.dev/accounts/[account]/settings)，然后按照 [**Rename account**](https://expo.dev/accounts/[account]/settings#rename-account) 下的步骤操作。

![Rename Account 设置面板。](/static/images/accounts/rename-account-light.webp)

### 在账户之间转移项目

项目转移的次数有限。用户必须在源账户和目标账户上都拥有 Owner 或 Admin 角色，才能在两者之间转移项目。访问 [**Project settings**](https://expo.dev/accounts/[account]/projects/[project]/settings) > **General**，然后按照 **Transfer project** 下的步骤操作。

![Transfer Projects 设置面板。](/static/images/accounts/transfer-project-light.webp)

#### 注意事项

> 如果你想将项目的所有权从你的个人或组织账户（源）转移到另一个人或公司（目标），但你在目标账户上没有 "Owner" 或 "Admin" 权限，你可以创建一个托管账户（一个新的组织账户）。这解决了以下问题：要在账户之间转移项目，用户必须是源账户的 "Owner"，并且是目标账户的 "Owner" 或 "Admin"。创建托管账户后，你可以在托管账户上授予最终目标账户的成员 Owner 角色，然后将项目安全地转移到托管账户。接收方（个人或公司）随后可以从托管账户将项目转移到他们的目标账户，而无需拥有目标账户本身的访问权限。

### 管理访问权限

成员的访问权限通过基于角色的系统进行管理。在组织账户中，用户可以拥有 _owner_、_admin_、_release manager_、_developer_ 或 _viewer_ 角色。每个角色都能执行其下方所有角色所能执行的操作。

| 角色 | 说明 |
| --- | --- |
| **Owner** | 可以对账户或任何项目执行任何操作，包括删除它们。 |
| **Admin** | 可以控制账户的大部分设置，包括注册付费服务、更改其他用户的权限以及管理程序化访问。 |
| **Release Manager** | 可以管理受保护渠道，并向这些渠道指向的分支发布更新。 |
| **Developer** | 可以创建新项目、进行新构建、发布更新以及管理凭据。 |
| **Viewer** | 只能通过 Expo Go 查看你的项目，无法以任何方式修改你的项目。 |

:::note
受保护渠道用于限制谁能向其发布更新。受保护渠道目前处于私有测试阶段，将在 Enterprise 计划中提供。任何账户都可以分配 Release Manager 角色，但除非账户启用了受保护渠道，否则 Release Manager 与 Developer 拥有相同的访问权限。
:::

### 安全活动

安全活动是账户个人资料所发生变更的列表。其中包括密码、电子邮件和 2FA 认证设置的更改等。

可以在 **Overview** > [**User settings**](https://expo.dev/settings) 下找到它。
