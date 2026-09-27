---
title: 应用凭据
description: 了解 Android 和 iOS 应用所需的凭据。
---

# 应用凭据

Expo 会自动为 Android 和 iOS 应用完成签名过程，但在这两个平台上，你都可以选择提供自己的替代配置。[EAS Build](/build/introduction) 可以生成已签名或未签名的应用，但要想通过商店分发你的应用，它**必须**是已签名的应用。

本页将介绍每个平台所需的凭据。如果你对我们如何存储你的凭据感到好奇，可以查看我们的[安全文档](/app-signing/security)。

## Android

Google 要求所有 Android 应用在安装到设备或更新之前，都必须使用证书进行数字签名。通常，私钥及其公钥证书存储在 keystore 中。过去，上传到商店的 APK 必须使用**应用签名证书**（即附加到 Play Store 中应用的证书）进行签名，如果 keystore 丢失，就没有办法恢复或重置它。现在，你可以选择加入 Google Play 应用签名（App Signing by Google Play），只需上传一个用**上传证书**签名的 APK，Google Play 就会自动将其替换为**应用签名证书**。旧方法（应用签名证书）和新方法（上传证书）本质上是相同的机制，但使用新方法时，如果你的上传 keystore 丢失或泄露，你可以联系 Google Play 支持团队重置密钥。

从 Expo 构建流程的角度来看，应用是用**上传证书**还是**应用签名密钥**签名没有区别。无论哪种方式，`eas build` 都会生成一个使用当前与应用关联的 keystore 签名的 **.apk** 或 **.aab**。如果你想手动生成上传 keystore，可以用与创建原始 keystore 相同的方式完成。

参阅 [Android 文档](https://developer.android.com/studio/publish/app-signing)了解更多关于此过程的信息。

### Google Play 应用签名

当你[将第一个版本上传到 Google Play](/submit/android-manual)时，会看到关于 "App signing by Google Play" 和 "Google is protecting your app signing key" 的通知。这是默认行为，除了按 "Continue" 之外，你无需执行任何操作。

如果你目前自己管理应用签名密钥，并希望 Google 代为管理，请参阅[使用 Google Play 应用签名](https://support.google.com/googleplay/android-developer/answer/9842756)。

<details><summary>丢失了 keystore？了解如何在 Google Play 上重置上传密钥</summary>

要将你的 Expo keystore 与 Google 同步，请按照以下步骤操作：

#### 下载凭据

在终端窗口中：

1. 运行 `eas credentials` 命令。
2. 选择平台 `Android`，以及你希望下载凭据的 profile。
3. 选择选项 `credentials.json: Upload/Download credentials between EAS servers and your local json`。
4. 选择 `Download credentials from EAS to credentials.json`。

你应用的 keystore 应保持私密。**在任何情况下都不应将其提交到你的代码仓库。** 调试 keystore 是唯一的例外，因为我们不会用它向 Google Play Store 上传应用。

#### 将 keystore 导出为 `pem` 格式

下载凭据和 keystore 后，将其导出为 `pem` 格式，以便提交给 Google：

1. 在你的 **credentials.json** 文件的 `keyAlias` 键下找到密钥别名。
2. 使用 `keytool` 导出证书：

```sh
$keytool -export -rfc -alias alias_from_step_1 -file certificate_for_google.pem -keystore ./path/to/keystore.jks
```

#### 联系 Google 支持

使用[此支持表单](https://support.google.com/googleplay/android-developer/contact/key)联系 Google 支持，请求他们更换你的密钥。填写表单时，请附上从 keystore 导出的 `pem` 文件。

Google 在你的账户上完成更新后，通过 `eas build` 创建的构建将按照 Google Play Store 的预期正确签名。请注意，Google 会将新上传证书的生效起始日期设置为 72 小时之后，因此执行此过程后，你需要等待一段时间才能进行首次提交。

</details>

## iOS

三种主要的 iOS 凭据均与你的 Apple Developer 账户关联，它们是：

- 分发证书（Distribution Certificate）
- 配置文件（Provisioning Profiles）
- 推送通知密钥（Push Notification Keys）

无论你是让 EAS 处理所有凭据，还是自己管理，了解每种凭据的含义、何时何地使用它们，以及它们过期或被吊销时会发生什么，都是很有价值的。你可以运行 `eas credentials`，通过 EAS CLI 检查和管理所有凭据。

### 分发证书

分发证书只与你（开发者）有关，与任何特定应用无关。你的 Apple Developer 账户只能关联一个分发证书。该证书将用于你的所有应用。如果此证书过期，你已上线的应用不会受到影响。但是，如果你想向 App Store 上传新应用或更新任何现有应用，则需要生成新证书。删除分发证书对 App Store 上已有的任何应用都没有影响。你可以在下次构建时运行 `eas credentials` 并按照提示操作，清除 Expo 当前为你的应用存储的分发证书。

### 推送通知密钥

Apple 推送通知密钥（通常缩写为 APN 密钥）允许关联的应用发送和接收推送通知。

你的 Apple Developer 账户最多可以关联 2 个 APN 密钥，一个密钥可用于任意数量的应用。如果你吊销了某个 APN 密钥，所有依赖该密钥的应用将无法发送或接收推送通知，直到你上传一个新密钥来替换它。上传新的 APN 密钥**不会**改变用户的 [Expo Push Token](/versions/latest/sdk/notifications#getexpopushtokenasyncoptions)。推送通知密钥不会过期。你可以运行 `eas credentials` 并按照提示操作，清除 Expo 当前为你的应用存储的 APN 密钥。

> Expo 创建的 APN 密钥可以在 [Expo 网站](https://expo.dev/accounts/[account]/settings/credentials)上下载。

### 配置文件

每个配置文件都是针对特定应用的，也就是说，你提交到 App Store 的每个应用都会有一个配置文件。这些配置文件与你的分发证书关联，因此如果分发证书被吊销或过期，你也需要重新生成应用的配置文件。与分发证书类似，吊销应用的配置文件不会对 App Store 上已有的应用产生任何影响。

配置文件会在 12 个月后过期，但这不会影响已上线的应用。你只需在下次构建应用时，通过运行 `eas build -p ios` 或手动运行 `eas credentials` 创建一个新的配置文件。

### 总结

| 凭据                     | 每个账户的上限 | 是否特定于应用？ | 吊销后是否不影响线上应用？ | 使用时机 |
| ------------------------ | -------------- | ---------------- | -------------------------- | -------- |
| 分发证书                 | 2              | ✗                | ✓                          | 构建时   |
| 推送通知密钥             | 2              | ✗                | ✗                          | 运行时   |
| 配置文件                 | 无限制         | ✓                | ✓                          | 构建时   |

### 清除凭据

当你使用 `eas credentials` 命令删除凭据时，这只是从 Expo 的服务器上移除这些凭据。**它不会从 Apple 的角度删除这些凭据**。这意味着，要完全删除你的凭据（例如，你想要一个新的推送通知密钥，但你已有两个），你需要从 [Apple Developer Console](https://developer.apple.com/account/resources/certificates/list) 中进行操作。

### 用新凭据重新签名

你可以使用 `eas build:resign` 将现有的 iOS **.ipa** 重新签名到新的 ad hoc 配置文件。这有助于缩短内部分发的时间——例如，如果你想在现有构建中添加一台新的测试设备，可以使用此命令更新配置文件以包含该设备，而无需从头重新构建整个应用。

运行该命令会要求你选择要重新签名的构建。例如，在一个示例项目中运行该命令会显示一个可用的构建：

![运行 eas build:resign 命令会显示项目中可用的构建列表。](/static/images/eas-build/eas-build-resign.png)

选择构建后，按照步骤登录你的 Apple Developer 账户。当出现 **Show devices and ask me again** 提示时，你可以选择一个新配置文件。

选择一台新设备，该命令将再次运行 EAS Build。请注意，这次触发的构建会复用所选构建中的应用产物，并用新配置文件对其进行签名。此过程完成后，你可以使用这个新构建链接，将 **.ipa** 安装到已添加到配置文件中的 iOS 设备上。
