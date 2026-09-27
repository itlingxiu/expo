---
title: 通知须知
description: 在开始之前，了解通知类型及其行为。
---

# 通知须知

通知是向用户告知新信息或事件的提醒，即使应用并未处于活跃使用中也会出现。它们的覆盖面很大，各平台之间的差异也会让实现通知变得令人却步。

无论你是刚开始接触通知，还是已有相关知识，本文都会说明不同类型的通知及其行为。

Expo 的通知支持建立在 Android 和 iOS 提供的原生功能之上。原生平台上的相同概念和行为也适用于 Expo 应用。如果对某项具体的通知功能不确定，请参阅各平台的[官方文档](#外部参考)。

## 远程通知与本地通知

1. **推送通知**：（也称为“远程通知”）从远程服务器发送到用户设备的通知。
2. **本地通知**：（也称为“应用内通知”）在应用内部创建并显示的通知。由于许多创建这些通知的 API 会在特定时间创建它们，这些通知有时也被称为“定时通知”。

`expo-notifications` 同时支持推送通知和本地通知。必须使用[开发构建](/develop/development-builds/introduction)才能使用推送通知，因为该能力并未内置在 Expo Go 中。

关于如何创建并显示本地通知，请参阅[应用内通知](/versions/latest/sdk/notifications#present-a-local-in-app-notification-to-the-user)。本指南的其余部分聚焦于推送通知。

## 推送通知的投递

推送通知到达应用时，其行为取决于应用状态和通知类型。先明确这些术语：

### 应用状态

- **前台**：应用正在前台活跃运行。它的界面当前显示在屏幕上。
- **后台**：应用在后台运行，处于“最小化”状态。它的界面当前没有显示在屏幕上。
- **已终止**：应用被“杀掉”，通常是在应用切换器中用滑动手势划掉。在 Android 上，如果用户从设备设置中强制停止应用，必须手动重新打开应用，通知才会重新开始工作（这是 Android 的限制）。

### 推送通知行为

对于任何类型的通知，当应用处于前台时，由应用控制如何处理收到的通知。应用可以直接展示它、显示某种自定义的应用内 UI，甚至忽略它（这由 [`NotificationHandler`](/versions/latest/sdk/notifications#setnotificationhandlerhandler) 控制）。当应用不在前台时，行为取决于通知类型。

下表总结了推送通知被投递到设备时会发生什么：

| 通知类型 | 应用在前台 | 应用在后台 | 应用已终止 |
| --- | --- | --- | --- |
| [通知消息](#通知消息)和[带数据载荷的通知消息](#带数据载荷的通知消息) | 投递时会运行 [`NotificationReceivedListener`](/versions/latest/sdk/notifications#addnotificationreceivedlistenerlistener) 和 [JS 任务](/versions/latest/sdk/notifications#registertaskasynctaskname) | 操作系统显示通知 | 操作系统显示通知 |
| [无界面后台通知](#无界面后台通知) | 投递时会运行 [`NotificationReceivedListener`](/versions/latest/sdk/notifications#addnotificationreceivedlistenerlistener) 和 [JS 任务](/versions/latest/sdk/notifications#registertaskasynctaskname) | 投递时会运行 [JS 任务](/versions/latest/sdk/notifications#registertaskasynctaskname) | 投递时会运行 [JS 任务](/versions/latest/sdk/notifications#registertaskasynctaskname) |

当用户与通知交互时（例如按下操作按钮），可以使用下面这些处理程序。

| 应用状态 | 触发的 iOS 监听器 | 触发的 Android 监听器 |
| --- | --- | --- |
| 前台 | `NotificationResponseReceivedListener` | `NotificationResponseReceivedListener` |
| 后台 | `NotificationResponseReceivedListener` | `NotificationResponseReceivedListener` 和 [JS 任务](/versions/latest/sdk/notifications#registertaskasynctaskname) |
| 已终止 | `NotificationResponseReceivedListener` | [JS 任务](/versions/latest/sdk/notifications#registertaskasynctaskname) |

在上表中，每当触发 `NotificationResponseReceivedListener` 时，`useLastNotificationResponse` 的返回值也会改变。

:::note
当应用未在运行或已被杀掉，并因点击通知而启动时，请在 iOS 上尽早（在模块顶层）注册 `NotificationResponseReceivedListener`。要在应用启动后处理最初的通知响应，我们建议同时在启动期间检查 `useLastNotificationResponse` 或 `getLastNotificationResponse`，而不是只依赖监听器。对于会把应用带到前台的操作按钮，这也是推荐做法。
:::

## 推送通知类型

### 通知消息

通知消息是指定了展示信息（例如标题或正文）的通知。

- 在 Android 上，这对应于包含 [`AndroidNotification`](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidNotification) 的推送通知请求
- 在 iOS 上，这对应于包含 [`aps.alert` 字典](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Create-the-JSON-payload)，并且 `apns-push-type` 头设为 `alert` 的推送通知请求。

使用 Expo Push Service 并指定 `title`、`subtitle`、`body`、`icon` 或 `channelId` 时，产生的推送通知请求就是通知消息。

通知消息的典型用例是立即展示给用户，而不做任何额外处理。

### 带数据载荷的通知消息

这是一个仅适用于 Android 的术语（[参见官方文档](https://firebase.google.com/docs/cloud-messaging/customize-messages/set-message-type#data-messages)），指推送通知请求同时包含 `data` 字段和 `notification` 字段。

在 iOS 上，额外数据可以是常规通知消息请求的一部分。Apple 并不区分携带数据和不携带数据的通知消息。

### 无界面后台通知

无界面通知是一种不直接指定标题或正文等展示信息的远程通知。除了下面的例外\*，无界面通知不会展示给用户。相反，它们携带数据（JSON），由应用中通过 [`registerTaskAsync`](/versions/latest/sdk/notifications#registertaskasynctaskname) 定义的 JavaScript 任务处理。该任务可以执行任意逻辑。例如，写入 `AsyncStorage`、发起 API 请求，或展示一条内容取自推送通知数据的本地通知。

:::note
我们使用“无界面后台通知”这个术语，指 Android 上的 [Data Message](https://firebase.google.com/docs/cloud-messaging/customize-messages/set-message-type#data-messages) 和 iOS 上的[后台通知](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app#Create-a-background-notification)。它们的关键相似之处在于：这两种通知类型都允许只发送 JSON 数据，并由应用在后台处理。
:::

无界面后台通知能够在响应通知时运行自定义 JavaScript，即使应用已终止也是如此。这很强大，但有一个限制：即使通知已投递到设备，操作系统也不保证会把它交给你的应用。发生这种情况的原因有很多，例如 Android 上启用了 [Doze 模式](https://developer.android.com/training/monitoring-device-state/doze-standby)，或者你发送了太多后台通知——Apple 建议[每小时不要发送超过两到三条](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app#overview)。

使用 Expo Push Service，并且只指定 `data` 和 `contentAvailable: true`（以及其他非交互字段，例如 `ttl`）时，产生的推送通知请求会生成无界面后台通知。

> 要在 iOS 上使用无界面后台通知，必须先[配置](/versions/latest/sdk/notifications#background-notification-configuration)它们。

经验法则是：如果不需要在后台运行 JavaScript，优先使用常规通知消息。

\* 例外情况是：当你在 [`data`](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidConfig) 内部指定 `title` 或 `message` 时。在这种情况下，`expo-notifications` 包会在 Android 上自动展示该无界面通知，但在 iOS 上不会。我们计划在未来的版本中让这一行为在各平台上更加一致。

### 仅数据通知

Android 有 [Data Message](https://firebase.google.com/docs/cloud-messaging/customize-messages/set-message-type#data-messages) 的概念。iOS 没有完全相同的概念，但相近的等价物是[无界面后台通知](#无界面后台通知)。

你可能还会遇到“静默通知”这个术语，它是不会向用户展示任何内容的通知的另一个名称——我们把它们描述为[无界面后台通知](#无界面后台通知)。

## 外部参考

以下是 Android 和 iOS 推送通知官方资源的非完整列表：

- [Android - Firebase Cloud Messaging 消息类型](https://firebase.google.com/docs/cloud-messaging/customize-messages/set-message-type)
- [iOS - 生成远程通知](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification)
- [iOS - 向应用推送后台更新](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app)
