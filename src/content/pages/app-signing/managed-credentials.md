---
title: 使用自动管理的凭据
description: 了解如何用 EAS 自动管理应用凭据。
---

# 使用自动管理的凭据

应用要在应用商店分发，需要用密钥库或分发证书等凭据进行数字签名。这证明应用的来源，并确保它不会被篡改。其他凭据，例如 FCM API Key 和 Apple Push Key，用于发送推送通知，但不参与应用签名。

用 EAS Build 构建应用时，你需要了解的就是这些。如果想进一步了解，可以参考[应用签名](/app-signing/app-credentials)指南。

继续阅读，了解 EAS 如何为你和你的团队自动管理凭据。

## 生成应用签名凭据

运行 `eas build` 时，如果尚未生成凭据，系统会提示你生成。按照简单说明生成凭据。需要时，它们会存储在 EAS 服务器上。之后再次构建应用时，除非你另行指定，否则会复用这些凭据。

生成 iOS 凭据（分发证书、描述文件和推送密钥）需要你使用 [Apple Developer Program](https://developer.apple.com/programs) 会员身份登录。

> 如果你对 EAS 管理凭据，或通过 EAS CLI 登录 Apple Developer 账户有安全顾虑，请参阅[安全](/app-signing/security)指南。如果仍不能打消顾虑，可以发邮件到 [secure@expo.dev](mailto:secure@expo.dev) 了解更多，或改用[本地凭据](/app-signing/local-credentials)。

### 推送通知凭据

#### Android

EAS Build 的 Android 推送通知凭据设置需要用 FCM 配置应用。运行 `eas credentials`，选择 `Android`，然后选择 `Push Notifications: Manage your FCM Api Key`，再选择合适的选项来设置密钥。

#### iOS

如果尚未设置推送通知密钥，EAS CLI 会在下一次运行 `eas build` 时要求你设置。

也可以用 `eas credentials` 命令设置推送通知密钥。运行该命令，选择 `iOS`，然后选择 `Push Notifications: Manage your Apple Push Notifications Key`，再选择合适的选项来设置密钥。

## 与团队共享凭据

如果你与其他开发者协作项目，让他们能够自行执行构建通常很有用。[确保项目已配置为可协作](/accounts/account-types#组织)，通过 [EAS 仪表板](https://expo.dev/) 添加的队友只要拥有足够权限，就可以顺利运行 `eas build`。

生成 iOS 凭据之后，启动构建就不再需要访问 Apple Developer 团队。这意味着协作者只需拥有 Expo 账户就可以启动新的 iOS 构建。

## 检查凭据配置

运行 `eas credentials` 可以查看当前配置的应用签名凭据。该命令也允许你在需要变更时移除和修改凭据。通常不必这样做，但如果你想[把凭据同步到本地机器以运行本地构建](/app-signing/syncing-credentials)，或[把现有凭据迁移为自动管理](/app-signing/existing-credentials)，就会用到它。
