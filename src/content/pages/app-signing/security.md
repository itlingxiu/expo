---
title: 安全
description: 了解使用 EAS 时如何处理凭据和其他敏感数据。
---

# 安全

在把外部凭据或其他敏感数据提供给第三方软件之前，你应该问自己是否信任该软件会负责任地使用并保护它们。由于为应用商店分发生成应用二进制文件的性质，Expo 独立应用构建服务需要各种敏感程度不同的信息。本文说明这些信息是什么、我们如何存储它们，以及一旦泄露可能出什么问题。

Expo 服务器存储的大多数数据（无论是否为凭据）都由我们的云提供商 Google Cloud 在静态时加密。凭据还会使用 [KMS](https://cloud.google.com/security/products/security-key-management) 额外加密。凭据只在独立应用构建器或推送通知服务的内存中、在我们需要它们的那段时间内解密。在数据库、消息队列以及系统中其他更持久的部分，凭据始终是加密的。

与下面说明的信息相关的所有数据都可以从 Expo 服务器下载并移除（如果它们一开始就存储在那里），其中一些也可能通过 Apple Developer Portal 等其他位置获得。

## Android 推送通知凭据

Android 使用 Firebase Cloud Messaging (FCM) 发送推送通知。如果你用 Expo 构建独立应用，我们会为你存储 FCM 服务器密钥。

### 泄露的后果

每个 FCM 服务器密钥都可以向该密钥所属 Firebase 项目关联的任何 Android 应用发送推送通知。恶意行为者需要同时拥有 FCM 服务器密钥和设备令牌才能发送通知。

你可以在 Firebase 控制台创建和删除服务器密钥。删除密钥后，使用该密钥的通知将停止工作。创建新密钥并上传到 Expo 后，通知会恢复工作。

### 丢失的后果

没有。你可以通过 Firebase 控制台访问它。

## Android 构建凭据

向 Play Store 发布构建需要密钥库和密钥库密码。它们用 KMS 加密，并在静态时额外加密。签名证明更新来自拥有该密钥库的开发者。Google Play 只接受用为你的应用注册的密钥签名的更新。对于使用 [Google Play 应用签名](/app-signing/app-credentials#google-play-应用签名)的应用（新应用的默认方式），Google 持有应用签名密钥，你的密钥库是上传密钥。仅有密钥库并不能让你提交到 Google Play，你的 Google 账户还需要能访问 Google Play Console。

### 泄露的后果

如果 Google Play 开发者账户是安全的，恶意行为者无法用你的密钥库和密钥库密码更新你的应用。如果应用使用 Google Play 应用签名，你也可以创建新的密钥库，并[要求 Google 重置上传密钥](/app-signing/app-credentials#google-play-应用签名)。重置之后，Google Play 不再接受用已泄露密钥签名的构建。

### 丢失的后果

如果应用使用 Google Play 应用签名，丢失的密钥库可以恢复。创建新的密钥库，并[要求 Google 重置上传密钥](/app-signing/app-credentials#google-play-应用签名)。在 Google 完成重置之前，你无法更新应用。如果应用不使用 Google Play 应用签名，丢失的密钥库本身就是应用签名密钥。在这种情况下，你无法在 Google Play 上更新应用。我们建议把密钥库和密钥库密码下载并备份到安全的位置。

## Google 开发者凭据

Expo 工具从不会要求你提供 Google 账户凭据。

## Android 提交凭据

### Google 服务账户密钥

Google 服务账户密钥是用 EAS Submit 把 Android 应用提交到 Google Play Store 时使用的认证方式。该密钥存储在 Expo 服务器上，静态时使用 [KMS](https://cloud.google.com/security/products/security-key-management) 加密。密钥会留在 Expo 服务器上以便后续提交复用，拥有必要权限的用户可以随时移除它。

#### 泄露的后果

如果恶意行为者以某种方式获得你的 Google 服务账户密钥，他们就能代表你在 Google Play Console 中执行操作。他们能执行的操作限于授予该服务账户密钥的权限。

如果攻击者还获得了你的上传密钥库，他们就能提交现有应用的新版本。该行为者无法以你的名义向 Google Play Store 提交新应用，因为第一次 Google Play 提交必须通过 Web 控制台完成。

#### 丢失的后果

没有。如果丢失 Google 服务账户密钥，可以用 Google Cloud Console 撤销它并创建新的。

## iOS 推送通知凭据

iOS 推送通知凭据有两种：Apple 推荐的现代方式，以及旧方式。默认行为是使用现代方式，但开发者可以通过提供 p12 证书选择旧方式。

### APNs 认证密钥（p8）+ 密钥 ID（字符串）

每个开发者账户最多有两把认证密钥，每一把都可以向该账户上的任何应用发送通知。

认证密钥可以在 Apple Developer Center 撤销。撤销后，通知将停止工作。如果你配置新的认证密钥并上传到 Expo，通知会恢复工作。撤销认证密钥时，设备令牌不会失效。

### 泄露的后果

如果恶意行为者以某种方式获得这些凭据，他们就能向你的应用发送推送通知。不过，他们需要知道要把通知发到哪些设备令牌。

### 丢失的后果

Apple Developer 控制台只允许在创建 APNs 认证密钥时下载它。如果认证密钥丢失，可以通过 Apple Developer 控制台撤销，并用新密钥替换。

## iOS 构建凭据

这指的是生产分发证书和密码（如果你让 Expo 代为管理，会自动生成）以及描述文件（描述文件不是机密）。与 Expo 存储的大多数凭据数据一样，它们都用 KMS 加密。构建凭据让你能够构建应用以上传到 App Store Connect。但要实际上传并提交审核，你仍需要 Apple Developer 账户凭据。

### 泄露的后果

仅凭这些，恶意行为者做不了太多事：没有你的 Apple Developer 账户凭据，他们无法提交任何应用。你可以在 Apple Developer 网站撤销分发证书和描述文件。

### 丢失的后果

没有。它们可以通过 Apple Developer 控制台获得。

## Apple Developer 账户凭据

创建独立应用构建或上传到 App Store 时，系统会提示你输入 Apple Developer 账户凭据。我们不会把这些凭据存储在服务器上，EAS CLI 只在本地使用它们。只有你的计算机会配置分发证书和认证密钥并发送到 Expo 服务器；你的开发者凭据不会发送到 Expo 服务器。Apple 还强制了一层额外的安全：所有 Apple Developer 账户都需要双因素认证。

创建 ad hoc 构建时，我们会临时存储一个 Apple Developer 会话令牌，用于用开发设备的 UDID 创建 ad hoc 描述文件。用完该会话令牌后，我们会销毁它。

### 钥匙串

默认情况下，你的 Apple ID 凭据存储在 macOS 钥匙串中。密码只存储在你的计算机本地。Windows 或 Linux 用户无法使用此功能。

用环境变量 `EXPO_NO_KEYCHAIN=1` 禁用钥匙串支持。你也可以用它来更改已保存的密码。

### 更改钥匙串中的 Apple ID 密码

要删除本地存储的密码，打开 “Keychain Access” 应用，切换到 “All Items”，搜索 “deliver. [你的 Apple ID]”（例如 `deliver.bacon@expo.dev`）。选择要修改的条目并删除它。下次运行 Expo 命令时，系统会提示你输入新密码。

### 泄露的后果

对于独立构建，如上所述，恶意行为者要获得你的用户名和密码，你的机器必须已被入侵。他们还需要访问你的双因素认证验证码生成器，对 Apple Developer 账户来说，那是一台预先授权的 Apple 设备。到这一步，你可能已经有更严重的问题，但正如你所料，该行为者可以对你的 Apple Developer 账户为所欲为。

对于 ad hoc 构建，如果有人获得你的会话令牌，其效果相当于已登录你的账户。

### 丢失的后果

没有。它们可以通过 Apple Developer 控制台获得。

## iOS 提交凭据

### Apple App Store Connect (ASC) API 密钥

Apple App Store Connect (ASC) API 密钥是使用 EAS Submit 服务把 iOS 应用提交到 Apple App Store 时可采用的认证方式之一。该密钥存储在 Expo 服务器上，静态时使用 [KMS](https://cloud.google.com/security/products/security-key-management) 加密。密钥会留在 Expo 服务器上以便后续提交复用，拥有必要权限的用户可以随时移除它。

ASC API 密钥是使用 EAS Submit 把应用提交到 App Store 的默认且**推荐**的认证方式。

#### 泄露的后果

如果恶意行为者以某种方式获得 ASC API 密钥，他们就能代表你在 App Store Connect 中执行操作。他们能执行的操作限于授予该 API 密钥的权限。

如果攻击者还获得了你的构建凭据，他们就能提交现有应用的新版本。他们只能提交用那些构建凭据签名的应用，不能以你的名义向 App Store 提交任意应用。

#### 丢失的后果

没有。如果丢失 ASC API 密钥，可以用 App Store Connect 门户撤销它并创建新的。

### Apple 应用专用密码

Apple 应用专用密码是使用 EAS Submit 把 iOS 应用提交到 Apple App Store 时可采用的另一种认证方式。与其他凭据不同，应用专用密码不会在两次提交之间存储在 Expo 服务器上，每次使用时都必须提供。

该密码使用 [KMS](https://cloud.google.com/security/products/security-key-management) 加密，只在把应用提交到 App Store 所需的时间再加上 24 小时内存储，以便在此期间重试。这段时间结束后，密码会从 Expo 服务器删除。

**不推荐**这种认证方式。我们建议改用 Apple Store Connect (ASC) API 密钥把应用提交到 App Store。除了把应用提交到 App Store 之外，Expo 不会以任何方式使用 Apple 应用专用密码。

#### 泄露的后果

如果恶意行为者以某种方式获得应用专用密码，他们就能访问你存储在 iCloud 中的邮件、通讯录和日历等信息（更多细节见 [Apple 文档](https://support.apple.com/en-us/102654)）。

如果攻击者还获得了你的构建凭据，他们就能提交现有应用的新版本。他们只能提交用那些构建凭据签名的应用，不能以你的名义向 App Store 提交任意应用。

#### 丢失的后果

没有。如果丢失应用专用密码，可以在 Apple 账户设置中撤销它并创建新的。

## Android 与 iOS 推送通知的设备令牌

除了特定于平台的凭据，发送推送通知还需要设备令牌。Expo 为你管理这一点，并用 Expo Push Token 在其上提供一层抽象。设备令牌标识接收者，也就是通知要发送到的设备。设备令牌在静态时加密，并由 Android 和 iOS 定期自动轮换。

### 泄露的后果

如果恶意行为者获得设备令牌，除非他们同时拥有相应平台的推送通知凭据，否则无法用这些令牌做任何事。

### 丢失的后果

在用户再次打开你的应用之前，你将无法向他们发送通知。

## 需要更多控制？

如果以上信息不能满足你的安全要求，你可以[在自己的基础设施上](/build-reference/local-builds)运行独立应用构建。请注意，要使用推送通知服务，你仍然需要提供推送通知凭据。如果那也不可能，我们建议你自行处理推送通知。
