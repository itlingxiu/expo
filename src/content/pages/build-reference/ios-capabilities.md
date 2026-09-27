---
title: iOS 能力项
description: 了解 EAS Build 支持的内置 iOS capabilities，以及如何启用或禁用它们。
---

# iOS 能力项

当你更改 iOS entitlements 时，在制作生产构建之前，需要在 Apple 的服务器上远程更新这一更改。运行 `eas build` 时，EAS Build 会自动把 Apple Developer Console 上的 capabilities 与你本地的 entitlements 配置同步。Capabilities 是 Apple 提供的 Web 服务，可以把它们想成类似 AWS 或 Firebase 的服务。

> 可以用 `EXPO_NO_CAPABILITY_SYNC=1 eas build` 禁用此功能。

## 授权项（entitlements）

在 Expo 应用中，entitlements 从内省后的应用配置读取。要编辑它们，参见应用配置文件中的 [`ios.entitlements`](/versions/latest/config/app#entitlements) 字段。在项目中运行 `npx expo config --type introspect` 可以查看内省后的配置，然后在结果中查找 `ios.entitlements` 对象。

在[现有 React Native 项目](/bare/overview)中，entitlements 从 **ios/\*\*/\*.entitlements** 文件读取。

## 启用

如果 entitlements 文件中存在受支持的 entitlement，运行 `eas build` 就会在 Apple Developer Console 上启用它。如果该 capability 已经启用，EAS Build 会跳过它。

## 禁用

如果某个 capability 已在远程为你的应用启用，但原生 entitlements 文件中没有它，运行 `eas build` 会自动禁用它。

## 支持的 capabilities

EAS Build 只会启用它内置支持的 capabilities，任何不受支持的 entitlements 都必须通过 [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list) 手动启用。

| 支持 | Capability | Entitlement 字符串 |
| --- | --- | --- |
| 支持 | 访问 Wi-Fi 信息 | `com.apple.developer.networking.wifi-info` |
| 支持 | App Attest | `com.apple.developer.devicecheck.appattest-environment` |
| 支持 | App Groups | `com.apple.security.application-groups` |
| 支持 | Apple Pay Later 商品展示 | `com.apple.developer.pay-later-merchandising` |
| 支持 | Apple Pay 支付处理 | `com.apple.developer.in-app-payments` |
| 支持 | 关联域名 | `com.apple.developer.associated-domains` |
| 支持 | 自动填充凭据提供方 | `com.apple.developer.authentication-services.autofill-credential-provider` |
| 支持 | ClassKit | `com.apple.developer.ClassKit-environment` |
| 支持 | 与驱动程序通信 | `com.apple.developer.driverkit.communicates-with-drivers` |
| 支持 | 通讯通知 | `com.apple.developer.usernotifications.communication` |
| 支持 | 自定义网络协议 | `com.apple.developer.networking.custom-protocol` |
| 支持 | 数据保护 | `com.apple.developer.default-data-protection` |
| 支持 | DriverKit 允许第三方 UserClient | `com.apple.developer.driverkit.allow-third-party-userclients` |
| 支持 | DriverKit Family Audio（开发） | `com.apple.developer.driverkit.family.audio` |
| 支持 | DriverKit Family HID 设备（开发） | `com.apple.developer.driverkit.family.hid.device` |
| 支持 | DriverKit Family HID EventService（开发） | `com.apple.developer.driverkit.family.hid.eventservice` |
| 支持 | DriverKit Family Networking（开发） | `com.apple.developer.driverkit.family.networking` |
| 支持 | DriverKit Family SCSIController（开发） | `com.apple.developer.driverkit.family.scsicontroller` |
| 支持 | DriverKit Family Serial（开发） | `com.apple.developer.driverkit.family.serial` |
| 支持 | DriverKit Transport HID（开发） | `com.apple.developer.driverkit.transport.hid` |
| 支持 | DriverKit USB Transport（开发） | `com.apple.developer.driverkit.transport.usb` |
| 支持 | 用于开发的 DriverKit | `com.apple.developer.driverkit` |
| 支持 | 扩展虚拟地址空间 | `com.apple.developer.kernel.extended-virtual-addressing` |
| 支持 | 家庭控制 | `com.apple.developer.family-controls` |
| 支持 | FileProvider 测试模式 | `com.apple.developer.fileprovider.testing-mode` |
| 支持 | 字体 | `com.apple.developer.user-fonts` |
| 支持 | 群组活动 | `com.apple.developer.group-session` |
| 支持 | HealthKit | `com.apple.developer.healthkit` |
| 支持 | HomeKit | `com.apple.developer.homekit` |
| 支持 | 热点 | `com.apple.developer.networking.HotspotConfiguration` |
| 支持 | 提高内存上限 | `com.apple.developer.kernel.increased-memory-limit` |
| 支持 | 应用间音频 | `inter-app-audio` |
| 支持 | 日记建议 | `com.apple.developer.journal.allow` |
| 支持 | 低延迟 HLS | `com.apple.developer.low-latency-streaming` |
| 支持 | MDM 管理的关联域名 | `com.apple.developer.associated-domains.mdm-managed` |
| 支持 | 托管应用安装界面 | `com.apple.developer.managed-app-distribution.install-ui` |
| 支持 | 地图 | `com.apple.developer.maps` |
| 支持 | Matter 允许设置载荷 | `com.apple.developer.matter.allow-setup-payload` |
| 支持 | 媒体设备发现 | `com.apple.developer.media-device-discovery-extension` |
| 支持 | 信息协作 | `com.apple.developer.shared-with-you.collaboration` |
| 支持 | 多路径 | `com.apple.developer.networking.multipath` |
| 支持 | NFC 标签读取 | `com.apple.developer.nfc.readersession.formats` |
| 支持 | 网络扩展 | `com.apple.developer.networking.networkextension` |
| 支持 | 5G 网络切片 | `com.apple.developer.networking.slicing.appcategory` 或 `com.apple.developer.networking.slicing.trafficcategory` |
| 支持 | App Clip 扩展的按需安装能力 | `com.apple.developer.on-demand-install-capable` |
| 支持 | 个人 VPN | `com.apple.developer.networking.vpn.api` |
| 支持 | 推送通知 | `aps-environment` |
| 支持 | 一键通话 | `com.apple.developer.push-to-talk` |
| 支持 | 重新校准估算 | `com.apple.developer.healthkit.recalibrate-estimates` |
| 支持 | 敏感内容分析 | `com.apple.developer.sensitivecontentanalysis.client` |
| 支持 | 浅水深度与压力 | `com.apple.developer.submerged-shallow-depth-and-pressure` |
| 支持 | 与你共享 | `com.apple.developer.shared-with-you` |
| 支持 | 通过 Apple 登录 | `com.apple.developer.applesignin` |
| 支持 | SiriKit | `com.apple.developer.siri` |
| 支持 | 系统扩展 | `com.apple.developer.system-extension.install` |
| 支持 | iPhone 轻点支付 | `com.apple.developer.proximity-reader.payment.acceptance` |
| 支持 | 在 iPhone 上轻点出示证件（仅显示） | `com.apple.developer.proximity-reader.identity.display` |
| 支持 | TV 服务 | `com.apple.developer.user-management` |
| 支持 | 时效性通知 | `com.apple.developer.usernotifications.time-sensitive` |
| 支持 | 钱包 | `com.apple.developer.pass-type-identifiers` |
| 支持 | WeatherKit | `com.apple.developer.weatherkit` |
| 支持 | 无线配件配置 | `com.apple.external-accessory.wireless-configuration` |
| 支持 | iCloud | `com.apple.developer.icloud-container-identifiers` |
| 不支持 | HLS 插播预览 | Unknown |

不受支持的 capabilities 要么不支持 iOS，要么没有对应的 entitlement 值。完整列表见所有[官方 Apple capabilities](https://developer.apple.com/help/account/reference/supported-capabilities-ios)。

### 广播推送通知

Apple 的 Broadcast 选项位于推送通知 capability 内部，自身没有 entitlement。要打开它，在[应用配置](/workflow/configuration)中把 [`ios.usesBroadcastPushNotifications`](/versions/latest/config/app#usesbroadcastpushnotifications) 设为 `true`：

```json app.json
{
  "expo": {
    "ios": {
      "usesBroadcastPushNotifications": true
    }
  }
}
```

EAS Build 仅在启用推送通知 capability 时设置 Broadcast 选项，因此你的 entitlements 也需要 `aps-environment`。Apple 把[广播推送通知](https://developer.apple.com/documentation/usernotifications/setting-up-broadcast-push-notifications)限制为 iOS 18 及更高版本上的 Live Activities。

如果你只在 [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list) 中启用 Broadcast，下一次 `eas build` 会把推送通知 capability 重置为默认选项并关闭 Broadcast。Apple 推送通知服务（APNs）随后会以 `FeatureNotEnabled` 错误拒绝你的频道管理请求。

## Capability 标识符

商户 ID、App Groups 和 CloudKit 容器都可以自动注册并分配给你的应用。这些分配需要 Apple cookies 身份验证（在本地运行），因为官方 App Store Connect API 不支持这些操作。

## 调试 iOS capabilities

可以运行 `EXPO_DEBUG=1 eas build` 获取关于 capability 同步的更详细日志。

如果使用此功能遇到问题，可以用环境变量 `EXPO_NO_CAPABILITY_SYNC=1` 禁用它。

要查看当前已启用的全部 capabilities，访问 [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list)，找到与你的应用匹配的 bundle identifier，点击它即可看到当前已启用的 capabilities 列表。

## 手动设置

有两种手动启用 Apple capabilities 的方式，两种系统都要求重新生成任何已有的 Apple 描述文件。

### Xcode

> 对于**不**使用 [Expo 预构建](/more/glossary-of-terms#prebuild)持续生成原生 **android** 和 **ios** 目录的项目，这是首选方法。

1. 用 `xed ios` 在 Xcode 中打开 **ios** 目录。如果没有 **ios** 目录，运行 `npx expo prebuild -p ios` 生成一个。
2. 然后按照[添加 capability](https://help.apple.com/xcode/mac/current/#/dev88ff319e7)中提到的步骤操作。

### Apple Developer Console

第一步是把相应的键/值对加入 **ios/[app]/[app].entitlements**（或多 target 应用更具体的 entitlements 文件）。可以参考[支持的 capabilities](#支持的-capabilities)确定应添加哪些 entitlements 键。

1. 登录 [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list)。点击 “Certificates, IDs & Profiles”，然后进入 “Identifiers” 页面。
2. 选择与应用 bundle identifier 匹配的 bundle identifier。
3. 向下滚动并启用某个 capability，有些 capability 可能需要额外设置。
4. 滚动到顶部并按 “Save”。你会看到一个写着 “Modify App Capabilities” 的对话框，按 “Confirm” 继续。你需要重新生成任何使用此 bundle identifier 的描述文件，之后它们才能用于构建经过代码签名的生产 **.ipa**。

如果添加 capabilities 的过程没有正确完成，iOS 原生构建会失败，错误类似：

```text
❌  error: Provisioning profile "*[expo] app.bacon.hello AppStore ..." doesn't support the Associated Domains capability.

❌  error: Provisioning profile "*[expo] app.bacon.hello AppStore ..." doesn't include the com.apple.developer.associated-domains entitlement.
```
