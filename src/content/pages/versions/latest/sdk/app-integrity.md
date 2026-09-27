---
title: AppIntegrity 包参考
description: 一个库，用于在 Android 上访问 Google 的 Play Integrity API，在 iOS 上访问 Apple 的 App Attest 服务。
---

# AppIntegrity 包参考

`@expo/app-integrity` 提供的 API 可帮助确保你的后端资源只能被运行在真实设备上的应用的合法安装所访问。它在 Android 上使用 Google 的 [Play Integrity API](https://developer.android.com/google/play/integrity)，在 iOS 上使用 Apple 的 [App Attest 服务](https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity)来验证应用的真实性，帮助防止未经授权的客户端、被篡改的应用或自动化脚本向你的服务器发起请求。

一般来说，`@expo/app-integrity` 帮助你的服务器区分：

- 运行在**真实设备**上的**真实应用**
- 其他任何情况（被篡改的应用、脚本、模拟器）

它是通过使用平台推荐的应用认证服务来实现这一点的。

> 支持平台：Android、iOS、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install @expo/app-integrity
```
:::
:::tab yarn
```sh
yarn expo install @expo/app-integrity
```
:::
:::tab pnpm
```sh
pnpm expo install @expo/app-integrity
```
:::
:::tab bun
```sh
bun expo install @expo/app-integrity
```
:::
:::

## 在 Android 上使用

`@expo/app-integrity` 使用 Play Integrity 的[标准请求流程](https://developer.android.com/google/play/integrity/standard)进行完整性检查。

### 配置

请参阅 [Play Integrity 设置指南](https://developer.android.com/google/play/integrity/setup#set-integrity-responses)，了解如何在应用中启用完整性 API。

### 准备完整性令牌提供程序（一次性）

在进行完整性检查请求之前，你需要先准备好完整性令牌提供程序。你可以在应用启动时完成此操作，也可以在后台于完整性检查需要之前完成。

```js
import * as AppIntegrity from '@expo/app-integrity';

const cloudProjectNumber = 'your-cloud-project-number';
await AppIntegrity.prepareIntegrityTokenProviderAsync(cloudProjectNumber);
```

### 请求完整性令牌（按需）

每当你的应用发起一个需要验证真实性的服务器请求时，就请求一个完整性令牌，并将其发送到应用的后端服务器进行解密和验证。然后，你的后端服务器可以决定如何处理。

```js
const requestHash = '2cp24z...';
const result = await AppIntegrity.requestIntegrityCheckAsync(requestHash);
```

在调用 `requestIntegrityCheckAsync` 之前，请确保 `prepareIntegrityTokenProviderAsync` 已成功调用。

在这个示例中，`requestHash` 是针对正在验证的特定用户操作生成的唯一哈希。你可以针对不同的用户操作，使用不同的哈希多次调用 `requestIntegrityCheckAsync`。

成功后，将结果发送到你的服务器进行验证。

:::note
如果你的应用使用同一个令牌提供程序的时间过长，令牌提供程序可能会过期，导致下一次令牌请求出现 `ERR_APP_INTEGRITY_PROVIDER_INVALID` 错误。你应该通过再次调用 `prepareIntegrityTokenProviderAsync` 请求一个新的提供程序来处理此错误。
:::

### 解密并验证完整性判定

请参阅 [Play Integrity 的指南](https://developer.android.com/google/play/integrity/standard#decrypt-and)，在你的服务器中验证完整性令牌。

### 其他资源

- [Google Play Integrity 文档](https://developer.android.com/google/play/integrity/overview)：请参阅 Google 的官方指南，了解支撑 `@expo/app-integrity` 的 API 和验证流程。

- [Play Integrity 标准请求流程](https://developer.android.com/google/play/integrity/standard)：本页介绍如何发起获取完整性判定的标准 API 请求，该请求在 Android 5.0（API 级别 21）或更高版本上受支持。你可以在应用发起服务器调用、检查交互是否真实时，发起获取完整性判定的标准 API 请求。

- [关于完整性判定](https://developer.android.com/google/play/integrity/verdicts)：完整性判定传达有关设备、应用和账号有效性的信息。你的应用服务器可以使用解密、验证后的判定中的结果载荷，来决定如何最好地处理应用中的特定操作或请求。

- [处理错误代码](https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/StandardIntegrityErrorCode)：如果你的应用发起 Play Integrity API 请求且调用失败，应用会收到一个错误代码。这些错误可能由多种原因引起，例如网络连接较弱等环境问题、API 集成问题，或恶意活动与主动攻击。

## 在 iOS 上使用

### 配置

在 Xcode 中，前往 **Signing & Capabilities**，点击 **+ Capability**，添加 **App Attest**。Xcode 会自动为你的应用添加所需的 entitlement。

:::note
要使用 App Attest 服务，你的应用必须拥有一个在 Apple Developer 网站上注册的 App ID。
:::

有关服务器端的验证逻辑，请参阅 [验证连接到你的服务器的应用](https://developer.apple.com/documentation/devicecheck/validating-apps-that-connect-to-your-server)。

### 检查设备是否支持应用认证

并非所有设备都能使用 App Attest 服务，因此重要的是让应用在访问该服务之前先运行兼容性检查。如果用户的应用未通过兼容性检查，请优雅地绕过该服务。你可以通过读取 `isSupported` 属性来检查可用性。

```js
import * as AppIntegrity from '@expo/app-integrity';

if (AppIntegrity.isSupported) {
  // 执行密钥生成和认证。
}
// 继续访问你的服务器 API。
```

:::note
App Attest 不支持在 iOS 模拟器上使用。
:::

:::note
大多数应用扩展不支持 App Attest。通常，在这些扩展中执行代码时，即使 `isSupported` 方法属性为 `true`，也应绕过密钥生成和认证。唯一支持 App Attest 的应用扩展是 watchOS 9 或更高版本中的 watchOS 扩展。对于这些扩展，你可以使用 `isSupported` 的结果来指示你的 WatchKit 扩展是否绕过认证。
:::

### 创建密钥对

对于运行你应用的每台设备上的每个用户账号，通过调用 `generateKey` 方法生成一个唯一的、基于硬件的加密密钥对。

```js
const keyId = await AppIntegrity.generateKeyAsync();
```

成功后，该方法会返回一个密钥标识符（`keyId`），你稍后可以用它来访问该密钥。请将标识符记录在持久化存储中，因为没有标识符就无法使用密钥，而且以后也无法再获取该标识符。设备会自动将关联的私钥存储在 Secure Enclave 中，App Attest 服务可以从那里使用它来创建签名，但任何进程都无法直接读取或修改它，从而确保其安全性。

:::note
如果你在 App Clip 中创建了密钥对，请在对应的应用中使用相同的密钥对。为此，请务必将标识符存储在完整应用可以访问的共享容器中。请参阅 Expo 关于使用 [expo-sqlite](/versions/latest/sdk/sqlite#sharing-a-database-between-appsextensions-ios) 在应用/扩展之间共享数据库的指南，或使用 React Native MMKV 的 [App Groups / extensions](https://github.com/mrousavy/react-native-mmkv?tab=readme-ov-file#app-groups-or-extensions) 共享存储来在两个目标之间持久化标识符。
:::

不要在一台设备上的多个用户之间复用同一个密钥，因为这会削弱安全保护。特别是，这会难以检测到一种攻击：使用一台被攻破的设备为运行你应用被篡改版本的多个远程用户提供服务。有关更多信息，请参阅[评估欺诈风险](https://developer.apple.com/documentation/devicecheck/assessing-fraud-risk)。

### 从服务器获取挑战

向你的服务器请求一个唯一的一次性挑战（challenge）。该挑战将被嵌入下面的认证步骤中，确保攻击者无法复用它。挑战的长度应至少为 16 字节，以提供足够的熵，使猜解变得不可行。

### 验证密钥对的有效性

将 `keyId` 与前面步骤中从服务器获取的 challenge 一起传入 `attestKey` 方法，如下所示：

```js
const attestationObject = await AppIntegrity.attestKeyAsync(keyId, challenge);
```

成功后，将收到的 `attestationObject` 和 `keyId` 发送到你的服务器进行验证。

如果该方法返回 `ERR_APP_INTEGRITY_SERVER_UNAVAILABLE` 错误，请稍后使用同一个密钥重试认证。对于任何其他错误，请丢弃密钥标识符，并在想要重试时创建新的密钥。

:::note
如果你的应用已有数百万日活用户，并且你想开始调用 `attestKey` 方法从应用发起认证，请查看[准备使用 App Attest 服务](https://developer.apple.com/documentation/DeviceCheck/preparing-to-use-the-app-attest-service)，了解如何安全地逐步扩大用户范围。
:::

如果服务器能够成功验证认证对象，即认为该应用实例有效。在这种情况下，请务必将密钥标识符（而不是认证对象）持久化存储在应用中，以便将来为服务器请求签名。

### 为敏感请求生成断言

在成功验证密钥的认证之后，你的服务器可以要求应用为任何或所有后续服务器请求断言其合法性。应用通过对请求进行签名来实现这一点。在应用中，从服务器获取一个唯一的一次性挑战。与认证一样，你在这里使用挑战是为了避免重放攻击。

```js
const challenge = 'A string from your server';
const request = {
  action: 'getGameLevel',
  levelId: '1234',
  challenge: challenge,
};
const assertion = await AppIntegrity.generateAssertionAsync(keyId, JSON.stringify(request));
```

成功后，将断言对象连同客户端数据一起传给服务器。如果断言对象验证失败，则由你来决定如何处理该请求。

使用一个密钥可以生成的断言数量没有限制。不过，你通常应把断言保留给应用生命周期中的敏感时刻发起的请求，例如应用下载付费内容时。

### 重新安装后重新开始

你生成的密钥在常规应用更新期间保持有效，但在应用重新安装、设备迁移或从备份恢复设备后会失效。在这些情况下，你需要从头开始流程并生成新的密钥。请尽量将新密钥的生成限制在这些事件或新增用户时。保持设备上的密钥数量较少，有助于检测某些类型的欺诈。

### 其他资源

- [Apple 的 App Attest 文档](https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity)：请参阅 Apple 的官方指南，了解支撑 `@expo/app-integrity` 的 API 和验证流程。

- [验证连接到你的服务器的应用](https://developer.apple.com/documentation/devicecheck/validating-apps-that-connect-to-your-server)：在你的服务器上验证应用认证和断言。

- [评估欺诈风险](https://developer.apple.com/documentation/devicecheck/assessing-fraud-risk)：使用服务器到服务器的调用请求和分析风险数据。

- [准备使用 App Attest 服务](https://developer.apple.com/documentation/devicecheck/preparing-to-use-the-app-attest-service)：在开发环境中测试你的实现，并逐步让用户接入。

## API

```js
import * as AppIntegrity from '@expo/app-integrity';
```
