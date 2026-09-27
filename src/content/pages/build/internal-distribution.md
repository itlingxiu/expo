---
title: 内部分发
description: 了解 EAS Build 如何为构建提供可分享的 URL，以便与团队进行内部分发。
---

# 内部分发

用 EAS Build 设置内部分发构建只需几分钟，并提供一种精简的方式，把应用分享给团队和其他测试人员以收集反馈。它通过一个 URL 实现这一点，让他们可以把应用直接安装到设备上。如果你还不确定是否要采用这种方式，并想了解内部分发应用的全部选项，请参考[用于审核的应用分发概览](/review/overview)指南。

## 使用内部分发

要为内部分发配置构建 profile，在其上设置 `"distribution": "internal"`。设置此配置后，对构建 profile 有以下影响：

- **Android**：`gradleCommand` 的默认行为会改为生成 APK 而不是 AAB。如果你指定了自定义 `gradleCommand`，请确保它[产出 APK](/build-reference/apk#配置用于构建-apk-的-profile)，否则无法直接安装到 Android 设备上。此外，EAS Build 会生成新的 Android keystore 来为 APK 签名；如果包名与[开发构建](/develop/development-builds/introduction)相同，则会使用已有的 keystore。
- **iOS**：使用此 profile 的构建会使用 [ad hoc 或企业级描述文件](#分发机制概览)。使用 ad hoc 描述文件时，EAS Build 会生成一份包含设备 UDID 允许列表的描述文件，只有构建时已在列表中的设备才能安装。你可以运行 `eas device:create` 添加设备，然后创建新构建。
- 默认情况下，任何拥有 URL 的人都可以访问内部分发构建的 URL，每个 URL 由 32 个字符的 UUID 标识。如果你希望必须登录已授权的 Expo 账户才能访问这些构建，可以在[项目设置](https://expo.dev/accounts/[account]/projects/[project]/settings)中禁用 **Unauthenticated access to internal builds** 选项。

关于如何配置、创建和安装构建的更多信息，参见下面的 EAS Build 内部分发教程：

- [创建并分享内部分发构建](/tutorial/eas/internal-distribution-builds)：使用 EAS Build 设置并分享内部分发构建的完整分步指南。

### CI 上的自动化（可选）

你可以用 [`--non-interactive`](/eas/cli#eas-build) 标志在 CI 中以非交互方式运行内部分发构建。[进一步了解如何从 CI 触发构建](/build/building-on-ci)。

对于 iOS ad hoc 构建，`eas build --non-interactive` 会复用一份有效的描述文件，而不更新其设备列表。构建可以成功，但应用可能无法安装到上次更新描述文件之后才登记的设备上。

把 `--refresh-ad-hoc-provisioning-profile` 与 `--non-interactive` 一起传入，即可在构建前于 Apple Developer Portal 上更新由 Expo 管理的 ad hoc 描述文件。

:::note
`--refresh-ad-hoc-provisioning-profile` 需要 EAS CLI 19.1.0 或更高版本。
:::

EAS 使用 App Store Connect API 密钥进行身份验证。它读取在 EAS 上为你的 Apple 团队登记的设备，在门户上登记任何缺失的 UDID，然后刷新描述文件的设备列表。

使用此标志时，EAS 会为构建目标的 Apple 平台选择所有匹配的设备：iOS 对应 iPhone 和 iPad，macOS 对应 Mac。

```sh
$ eas build --platform ios --profile preview --non-interactive --refresh-ad-hoc-provisioning-profile
```

对于 [EAS Workflows](/eas/workflows/get-started)，在构建作业的 `params` 中设置 `refresh_ad_hoc_provisioning_profile: true`，并满足相同的 profile 要求。参见[构建作业参数](/eas/workflows/pre-packaged-jobs#build)。

profile 必须设置 [`"distribution": "internal"`](/eas/json#distribution)，并使用[由 EAS 管理的凭据](/app-signing/app-credentials)。你至少需要一台来自 [`eas device:create`](/eas/cli#eas-device-create) 的设备，以及 CI 中的 App Store Connect API 密钥。密钥可以通过[环境变量](/build/building-on-ci#可选为你的-apple-团队提供-asc-api-令牌)（`EXPO_ASC_API_KEY_PATH`、`EXPO_ASC_KEY_ID` 和 `EXPO_ASC_ISSUER_ID`）提供，或使用项目上为提交存储在 EAS 中的密钥。

否则，在用 [`eas device:create`](/eas/cli#eas-device-create) 登记设备之后，以交互方式运行 [`eas build`](/eas/cli#eas-build) 并用 Apple 账户登录，以便 EAS 更新 ad hoc 描述文件。

### 管理设备

使用 [EAS Workflows](/eas/workflows/get-started) 时，你可以用 [`apple-device-registration-request`](/eas/workflows/pre-packaged-jobs#apple-device-registration-request) 作业暂停工作流，直到测试人员登记一台 iOS 设备并且团队成员批准。把它与设置了 `refresh_ad_hoc_provisioning_profile: true` 的 `build` 作业配对，即可把新设备包含进内部分发构建。

运行以下命令可以查看通过 `eas device:create` 登记的所有设备：

```sh
# 列出为 ad hoc 描述文件登记的设备
$ eas device:list
```

通过 Expo 为 ad hoc 描述文件登记的设备，会在它们被用来为 EAS Build 的新内部构建生成描述文件，或用 `eas build:resign` [用新凭据重新签名已有构建](/app-signing/app-credentials#re-signing-new-credentials)之后，出现在 Apple Developer Portal 上。

:::warning
**对于新的或最近续订的 Apple Developer Program 会员资格，新登记的设备可能无法立即安装。** 用 Expo 登记设备并不会向 Apple 登记该设备。设备只有在第一次被包含进描述文件时才会加入你的 Apple Developer Portal，而这发生在你创建新的内部构建或重新签名已有构建时。对于这些会员资格，Apple 可能需要[最多 24–72 小时](https://developer.apple.com/help/account/reference/device-registration-updates/)才能完成对新登记设备的处理，在此期间无法把该设备加入描述文件。因此，第一次包含新设备的构建或重新签名可能会失败。请等待 Apple 处理完成，然后创建新构建或再次重新签名，以产出包含该设备的可安装构建。
:::

#### 移除设备

如果某台设备不再使用，可以运行以下命令把它从列表中移除：

```sh
# 从 Expo 账户删除设备，可选地在 Apple Developer Portal 上禁用它们
$ eas device:delete
```

该命令还会提示你在 Apple Developer Portal 上禁用该设备。被禁用的设备仍然计入每个应用 ad hoc 分发的 [Apple 100 台设备上限](https://developer.apple.com/support/account/#:~:text=Resetting%20your%20device%20list%20annually)。

#### 重命名设备

通过网站 URL/二维码添加的设备，在为 EAS Build 选择它们时默认显示其 UDID。你可以用以下命令为设备指定易读的名称：

```sh
# 在 Expo 和 Apple Developer Portal 上重命名设备
$ eas device:rename
```

## 分发机制概览

以下是内部分发所支持的、把应用分发到设备的不同机制。

<details>
<summary>Android：构建并分发 APK</summary>

要把应用分享到 Android 设备，必须构建项目的 APK（Android 应用包文件）。用户接受安装未经 Play Store 审核的应用的安全警告后，可以通过 USB、从网上或通过电子邮件或聊天应用下载该文件，把 APK 直接安装到 Android 设备。应用的 AAB（Android App Bundle）二进制文件必须通过 Play Store 分发。

</details>

<details>
<summary>iOS：Ad Hoc 分发</summary>

Apple 提供 [ad hoc 描述文件](https://help.apple.com/xcode/mac/current/#/dev7ccaf4d3c)，在测试设备登记到你的 Apple Developer 账户后，把应用分发到这些设备。此方法需要付费的 Apple Developer 账户，并且该账户每年最多只能用此方法分发到 100 台 iPhone。

你需要知道每台将安装应用的设备的 UDID（唯一设备标识符）。如果要分享给不是开发者的人，这可能有难度。添加新设备需要重新构建应用，或[用新凭据重新签名该构建](/app-signing/app-credentials#re-signing-new-credentials)。

如果你以前没做过，正确设置 Ad Hoc 证书可能令人却步；即使做过，也很繁琐。如果你使用针对 Expo 和 React Native 项目优化的 [EAS Build](#使用内部分发)，我们会为你处理设置 Ad Hoc 凭据中耗时的部分。

</details>

<details>
<summary>iOS：企业分发</summary>

如果应用仅供大型组织的员工内部使用，并且不能通过 App Store 分发，你应该使用企业分发。与 Ad Hoc 分发不同，可以安装应用的设备数量没有上限，你也不需要管理每台设备的 UDID。这些应用通常通过移动设备管理（MDM）方案分发给最终用户。企业分发需要加入 [Apple Developer Enterprise Program](https://developer.apple.com/programs/enterprise/)。加入企业计划的组织必须满足超出 App Store 分发要求的额外条件。

</details>
