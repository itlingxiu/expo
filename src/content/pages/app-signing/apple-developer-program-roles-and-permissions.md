---
title: EAS Build 的 Apple Developer Program 角色与权限
description: 了解创建 EAS Build 时对 Apple Developer 账户成员身份的要求。
---

# EAS Build 的 Apple Developer Program 角色与权限

使用 EAS Build 创建 iOS 设备构建时，需要一个有权限创建[应用签名凭据](/app-signing/managed-credentials#生成应用签名凭据)的 Apple Developer 账户，例如证书、标识符和描述文件。这些凭据可以在提交构建时通过 EAS CLI 登录 Apple 账户来生成，也可以由授权用户上传到你的 Expo 账户，这样没有 Apple Developer 账户访问权限的用户也可以使用已上传的凭据创建构建。

在个人 Apple Developer 账户上，只有 Account Holder 角色可以生成应用签名凭据。在组织 Apple Developer 账户上，Account Holder 和 Admin 角色始终可以生成应用签名凭据；当 App Manager 角色的用户在其 App Store Connect 用户权限中启用了 **Access to Certificates, Identifiers, and Profiles** 时，该角色也可以生成凭据。

![App Store Connect 中的 Access to Certificates, Identifiers, and Profiles 设置。](/static/images/apple-access-settings.webp)

本指南提供授权用户可以遵循的步骤，以确保生成应用签名凭据，并提供给使用 EAS 的团队成员。它也提供团队开发者使用预先生成的凭据创建 EAS Build 的步骤。

> 不同角色及其权限的详情（基于开发者账户类型，以及每个角色所需的权限）见 [Apple 关于 Program Roles 的文档](https://developer.apple.com/support/roles/)。

## Apple Developer 账户授权用户的步骤

Apple Developer 账户的授权用户需要生成以下凭据：

- **分发签名证书**：为安装到 iOS 设备上的开发和发布构建签名所必需。
- **Ad hoc 描述文件**：为安装到 Apple App Store 之外设备上的构建签名所必需。
- **分发描述文件**：为提交到 Apple App Store 的构建签名所必需。
- **推送密钥**：使用推送通知服务时所必需。

分发证书、描述文件和推送密钥的详情见[必需的 iOS 应用凭据](/app-signing/app-credentials#ios)。

借助 EAS CLI，上述所有凭据都可以自动创建，并与 Apple Developer 账户同步。授权用户登录其 [Expo 账户](/accounts/account-types)后，可以用 EAS CLI 运行 `eas credentials` 来创建或更新描述文件。

```sh
eas login

eas credentials
```

CLI 会提示选择用于 EAS Build 的[构建 profile](/build/eas-json#构建-profile)。如果 Apple Developer 账户的授权用户正在创建生产构建，请按照这些步骤[创建分发描述文件](/tutorial/eas/ios-production-build#1-创建分发描述文件)。要创建开发构建，请按照这些步骤[创建 ad hoc 描述文件](/tutorial/eas/ios-development-build-for-devices#描述文件)。

这可以确保与 Expo 账户关联的描述文件拥有必要权限。

> 对于已有凭据的项目，如何把它们同步到 EAS 或手动管理，见[使用现有凭据](/app-signing/existing-credentials)。

## 团队开发者的步骤

作为团队中的开发者，在终端窗口运行 `eas build -p ios` 时，EAS CLI 会要求你登录 Apple Developer 账户。

```text
? Do you want to log in to your Apple account? > (Y/n)

No problem! 👌 If any of the next steps will require Apple account access we will ask you again about it.
```

如果没有访问权限，按 <kbd>N</kbd> 跳过登录 Apple Developer 账户（也避免登录你可能拥有的个人 Apple Developer 账户）。CLI 会显示跳过描述文件校验和其他应用签名凭据校验的消息，并继续使用现有凭据创建 EAS Build。

EAS CLI 需要使用与 Expo 账户关联的描述文件来创建 iOS 构建。跳过登录后，EAS Build 会使用由 Apple Developer 账户授权用户在你组织的 Expo 账户中最近更新的描述文件和其他凭据。

## 其他信息

### 上传预先生成的 Apple 凭据

有些开发团队可能选择在 EAS 之外生成分发证书和描述文件。拥有 Developer 或更高权限的任何 EAS 用户都可以用 `eas credentials` 添加这些凭据，或在 EAS 仪表板的 **Select your project** > **Project settings** > **Configuration** > **Credentials** 下添加。

上传凭据时，你需要 **.p12** 和 **.mobileprovision** 文件，以及生成分发证书时设置的任何密码。

### 描述文件过期与更新

如果添加或移除了某些 [iOS 能力](/build-reference/ios-capabilities)（例如 entitlements），或描述文件到达年度到期时间，就需要更新关联的描述文件。这一步由 Apple Developer 账户的授权用户处理。

### 联合 Apple Developer 账户

#### EAS Build

EAS CLI 只能接受 Apple 账户的电子邮件和密码来登录 Apple Developer 账户。你无法登录[联合 Apple Developer 账户](https://support.apple.com/en-in/guide/apple-business-manager/axmb19317543/web)并更新分发证书或描述文件。如果构建凭据不需要任何更改，可以跳过登录。然后可以继续构建，EAS CLI 会继续使用当前已上传的凭据。

不过，你可以提供具有 Admin 访问权限的 App Store Connect (ASC) API 令牌，以便在运行 `eas build` 命令时检查并更新 Apple 凭据。按照[为 Apple 团队提供 ASC API 令牌](/build/building-on-ci#可选为你的-apple-团队提供-asc-api-令牌)中的步骤，把所需的令牌值传给 `eas build` 命令来创建构建。

#### EAS Submit

EAS Submit 使用 ASC API 令牌提交到 TestFlight。如果你有联合 Apple Developer 账户，可以遵循标准的 EAS Submit 设置。它让你用 `eas build --auto-submit` 自动提交构建。
