---
title: 推送通知故障排除与 FAQ
description: 关于 Expo 推送通知服务的常见问题集。
---

# 推送通知故障排除与 FAQ

使用 `expo-notifications` 库和 Expo 推送通知服务设置推送通知时的常见问题与 FAQ。

## Expo 推送通知服务 FAQ

### 推送通知服务的费用

通过 Expo 推送通知服务发送通知不产生费用。

### 发送通知的限制

每个项目每秒最多可以发送 600 条通知。如果超过此速率，后续请求会失败，直到速率再次降到每秒 600 条以下。

为了获得最佳结果，我们建议你在服务器上添加限流（[`expo-server-sdk-node`](https://github.com/expo/expo-server-sdk-node) 会自动处理）和重试逻辑。

### 并非必须使用 Expo 推送通知服务

Expo 项目可以使用任何推送通知服务。[`expo-notifications` 的 `getDevicePushTokenAsync` 方法](/versions/latest/sdk/notifications#getdevicepushtokenasync)让你可以获取原生设备推送令牌，然后将其用于其他服务，甚至[直接通过 FCM 和 APNs 发送通知](/push-notifications/sending-notifications-custom)。

### 与通知服务的连接是加密的

Expo 与 Apple 和 Google 的连接是加密的，并使用 HTTPS。

### 不会存储通知内容

Expo 存储推送通知内容的时间不会超过把它交给 Google 和 Apple 运营的推送通知服务所需的时间。通知只存储在内存和消息队列中，不存储在数据库中。

### Expo 员工可能会看到通知内容

如果 Expo 团队正在积极调试推送通知服务，我们可能会看到通知内容（例如在断点处），但除此之外 Expo 无法看到推送通知内容。

### 投递保证

Expo 会尽最大努力把通知投递给 Google 和 Apple 运营的推送通知服务。Expo 的基础设施设计为至少一次投递到底层推送通知服务。在某些情况下，一条通知可能会被投递给 Google 或 Apple 不止一次，或者根本没有投递，尽管这些情况很少见。

通知被移交给底层推送通知服务之后，Expo 会创建一条“推送回执”，记录移交是否成功。推送回执表示底层推送通知服务是否收到了该通知。

最后，Google 和 Apple 的推送通知服务会按照各自的政策把通知投递到设备。

### `ExpoPushToken` 何时以及为何会变化

`ExpoPushToken` 在应用升级后保持不变。在 Android 上，重新安装应用可能导致令牌改变。在 iOS 上，即使卸载应用后重新安装，令牌也保持不变。

如果你更改了 [`applicationId`](/versions/latest/sdk/application#applicationapplicationid) 或 `experienceId`（通常是 `@expoUsername/projectSlug`），它也会改变。

`ExpoPushToken` 永不过期。不过，如果某个用户卸载了应用，你会从 Expo 的服务器收到 `DeviceNotRegistered` 错误。这意味着你应该停止向此令牌发送通知。

## 推送通知故障排除

### 通知无法工作

推送通知涉及很多环节，因此原因可能多种多样。为了缩小范围，请检查[推送票据](/push-notifications/sending-notifications#推送票据)和[推送回执](/push-notifications/sending-notifications#推送回执)中的错误信息。

你还可以通过在应用中测试[本地通知](/versions/latest/sdk/notifications#schedulenotificationasyncrequest)来进一步缩小范围。这可以确保所有客户端逻辑都正确，并把问题范围缩小到服务端或应用凭据。

<details>
<summary>这里有一些可以用来获取推送回执的快速终端命令</summary>

1. 发送一条通知：

   ```sh
   curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
     "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
     "title":"hello",
     "body": "world"
   }'
   ```

2. 使用得到的票据 `id` 请求推送回执：

   ```sh
   curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/getReceipts" -d '{
     "ids": [
       "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
     ]
   }'
   ```

</details>

### 通知在开发环境中可用，但在发布模式下不可用

这表明你在生产应用中错误配置了凭据，或者根本没有配置。在 SDK 53 及更高版本中，Expo Go 不支持推送通知功能，因此要测试推送，应使用[开发构建](/develop/development-builds/introduction)。在 SDK 52 及更早版本中，Expo Go 使用 Expo 的凭据，因此无需设置自己的凭据，推送通知也能在开发环境中工作。

当你为应用商店构建应用时，需要生成并使用自己的凭据。在 Android 上，请遵循[本指南](/push-notifications/fcm-credentials)。在 iOS 上，这由你的[推送密钥](/app-signing/app-credentials#推送通知密钥)处理（撤销与应用关联的推送密钥会导致通知无法投递。要修复这一点，请使用 `eas credentials` 添加新的推送密钥）。

更多信息请参阅[应用签名](/app-signing/app-credentials)。

### Android 上通知偶尔会停止送达

这很可能是由于你发送的通知的 `priority` 级别。你可以进一步了解 [Android 优先级](https://firebase.google.com/docs/cloud-messaging/http-server-ref#downstream-http-messages-json)。[Expo 接受四种优先级](/push-notifications/sending-notifications#消息请求格式)：

- `default`：手动映射为 Apple 和 Google 文档中的默认优先级
- `high`：映射为 Apple 和 Google 文档中的高优先级
- `normal`：映射为 Apple 和 Google 文档中的普通优先级
- （省略 priority）：视为指定了 `default`

把优先级设为 `high`，可以最大程度提高 Android 显示该通知的可能性。

### 处理过期的推送通知凭据

当推送通知凭据过期时，运行 `eas credentials`，选择 iOS 和一个构建 profile，然后移除推送通知密钥并生成一个新的。

### iOS 上出现 No valid aps-environment entitlement string found 错误

如果尚未为 iOS 项目设置推送通知密钥，就会出现此错误。要检查，请前往[项目凭据页面](https://expo.dev/accounts/[account]/projects/[project]/credentials/ios)。

要生成新的推送通知密钥，请运行以下命令触发新的构建：

```sh
$ eas build --profile [profile] --platform ios
```

可视指南请参阅 [Expo Notifications with EAS 视频](https://youtu.be/BCCjGtKtBjE?t=2123)。

### 发送通知时出现错误信息

请检查返回的推送票据或回执的 `details` 属性以获取更多信息。[阅读此处](/push-notifications/sending-notifications#错误)了解常见错误码响应及其对应的解决方案。

### 在 iOS 上获取推送令牌耗时很长

`getDevicePushTokenAsync` 和 `getExpoPushTokenAsync` 在 iOS 上有时需要很长时间才能解析。这超出了 `expo-notifications` 的控制范围，正如 Apple 的[排查推送通知](https://developer.apple.com/library/archive/technotes/tn2265/_index.html)技术说明所述：

> 这不一定是错误情况。系统可能完全没有互联网连接，因为它超出了任何基站或 Wi-Fi 接入点的范围，或者可能处于飞行模式。不要把这当作错误，应用应继续正常运行，只禁用依赖推送通知的那部分功能。

以下是我们的社区成员解决此问题的一些方法：

<details>
<summary>阅读 Apple 关于排查推送通知的技术说明</summary>

阅读 Apple 的[排查推送通知技术说明](https://developer.apple.com/library/archive/technotes/tn2265/_index.html)！这是关于此问题最可靠的单一信息来源。为了帮助你理解他们的建议：

- 确保设备有可靠的互联网连接（尝试关闭 Wi-Fi 或切换到另一个网络，并按[这篇 SO 回答](https://stackoverflow.com/a/34332047/1123156)的建议禁用对 5223 端口的防火墙拦截）。
- **[现有 React Native 项目](/bare/overview)**必须[手动启用 **Push Notifications** capability](/build-reference/ios-capabilities#manual-setup)。如果设置遇到困难，请参考[这篇 Stack Overflow 回答](https://stackoverflow.com/a/10791240/1123156)。你可能还想按照[这篇 Stack Overflow 回答](https://stackoverflow.com/a/8036052/1123156)所述，通过记录持久连接调试信息来进一步调试。

</details>

<details>
<summary>过一会儿再试</summary>

- 设备附近的 APNs 服务器可能宕机，如[这个论坛帖子](https://developer.apple.com/forums/thread/52224)所示。出去走走，稍后再试！
- 按照[这条 GitHub 评论](https://github.com/expo/expo/issues/10369#issuecomment-717872956)的建议，过几天再试。

</details>

<details>
<summary>在设备上禁用网络共享</summary>

你可能需要禁用网络共享，因为它可能影响注册，如[这篇 Stack Overflow 回答](https://stackoverflow.com/a/59156989/1123156)所建议。

</details>

<details>
<summary>重启设备</summary>

如果你刚刚更改了应用应向其注册的 APNs 服务器（在同一设备上用 TestFlight 构建覆盖了 Xcode 构建），可能需要按[这篇 Stack Overflow 回答](https://stackoverflow.com/a/59864028/1123156)的建议重启设备。

</details>

<details>
<summary>为设备装上 SIM 卡</summary>

如果你遇到此问题的设备尚未配置 SIM 卡，按[这篇 Stack Overflow 回答](https://stackoverflow.com/a/19432504/1123156)的建议进行配置，似乎有助于缓解此 bug。

</details>

## 其他

### 直接通过 FCM 和 APNs 发送通知

如果你不使用 [Expo 推送通知服务](/push-notifications/sending-notifications)，而是希望直接与 Google 和 Apple 通信，请参阅[使用 FCM 和 APNs 发送通知](/push-notifications/sending-notifications-custom)。

### Android 上的通知图标是灰色或白色方块

这表明你提供的图片资源有问题。图片应全白且背景透明（这是 Google 要求并强制执行的，不是 Expo）。更多信息请参阅[这篇文章](https://clevertap.com/blog/fixing-notification-icon-for-android-lollipop-and-above/)。
