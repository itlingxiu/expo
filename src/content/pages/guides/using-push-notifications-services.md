---
title: 使用推送通知
description: 了解与 Expo 和 React Native 应用兼容的推送通知服务。
---

# 使用推送通知

Expo 应用可以与任何通知服务配合，也可以使用 Android 和 iOS 操作系统提供的任何通知能力。即使某项功能还没有现成的包，也可以通过 [Expo Modules API](/modules/overview) 编写原生代码来访问它，并用[配置插件](/config-plugins/introduction)自动化原生项目配置。以下选项为在应用中实现推送通知提供了专门的 Expo 集成（必要时包含配置插件）：

> [`expo-notifications`](/versions/latest/sdk/notifications) 库经过设计与测试，可与 Expo 的推送通知服务以及直接从 FCM 和 APNs 发送的通知配合使用。部分高级功能可能与第三方提供商不兼容，因为它们通常有为自己的服务优化的原生和 React Native SDK。

## Expo 推送通知

[Expo Notifications](/versions/latest/sdk/notifications) 提供统一 API，用于在 Android 和 iOS 上处理推送通知。它与你的 Expo 账户无缝集成，并且可以免费使用。

### 关键能力

- 与 [`expo-notifications`](/versions/latest/sdk/notifications) 库完全兼容
- 包含 EAS 仪表盘，用于跟踪通知向 FCM 和 APNs 的送达情况
- 支持用 [Expo Notifications Tool](https://expo.dev/notifications) 测试通知

### 注意事项与限制

- 用于向通知添加图片等额外内容的 iOS Notification Service Extension 并未正式包含，但你可以用带自定义原生代码和配置的配置插件添加它（[示例](https://github.com/expo/expo/pull/36202)）。
- 每个项目的发送量限制为每秒 600 条通知。

实现细节见以下指南：

- [Expo 推送通知概览](/push-notifications/overview) —— 进一步了解 Expo 推送通知。
- [Expo Notifications 服务端 SDK 选项](/push-notifications/sending-notifications#send-push-notifications-using-a-server) —— 进一步了解如何使用服务器发送推送通知。

## OneSignal

[OneSignal](https://onesignal.com/) 是客户互动平台，为 Web 和移动应用提供推送通知、应用内消息、短信和邮件服务。OneSignal 支持通知中的富媒体和互动分析。它包含一个 [Expo 配置插件](https://github.com/OneSignal/onesignal-expo-plugin)，可直接集成到 Expo 项目中。

- [OneSignal Expo SDK 设置](https://documentation.onesignal.com/docs/react-native-expo-sdk-setup) —— 按照这份指南，分步了解如何在 Expo 项目中集成 OneSignal。

## Braze

[Braze](https://www.braze.com/) 是客户互动平台，通过推送通知、应用内消息、邮件、短信和 Web 提供个性化的跨渠道消息。Braze 支持富通知内容、推送通知活动，以及在 Android 上投递失败后重新发送通知。它提供 [React Native SDK](https://github.com/braze-inc/braze-react-native-sdk) 和[配置插件](https://github.com/braze-inc/braze-expo-plugin/tree/main)。更多细节见 [Expo 示例应用](https://github.com/braze-inc/braze-expo-plugin/tree/main/example)。

- [Braze Expo 设置](https://www.braze.com/docs/developer_guide/sdk_integration?sdktab=react%20native) —— 按照这份指南，分步了解如何在 Expo 项目中集成 Braze。

## Customer.io

[Customer.io](https://customer.io/) 是客户互动平台，让你利用推送通知、应用内消息、邮件、短信等能力设计强大的自动化工作流。它的可视化工作流构建器可以跨多个渠道自动化复杂的、数据驱动的活动。Customer.io 支持设备端指标收集，可用于根据用户行为和偏好定制推送通知。Customer.io 提供 [Expo 插件](https://github.com/customerio/customerio-expo-plugin)，可直接与 Expo 项目集成，并提供与其他提供商一起使用 Customer.io 推送通知的文档。

- [Customer.io Expo 快速入门指南](https://docs.customer.io/sdk/expo/quick-start-guide/) —— 按照这份指南，分步了解如何在 Expo 项目中集成 Customer.io。

## CleverTap

[CleverTap](https://clevertap.com/) 是一体化客户互动平台，帮助你通过推送通知、应用内消息、邮件等渠道交付个性化、实时、全渠道的消息。它提供高级分群、分析和活动自动化 —— 可随业务扩展。[CleverTap React Native SDK](https://developer.clevertap.com/docs/react-native) 和 [Expo 配置插件](https://github.com/CleverTap/clevertap-expo-plugin) 让你能轻松把 CleverTap 集成到 Expo 项目中。配置插件在预构建过程中处理全部原生模块设置，让你通过应用配置来配置 CleverTap，而不必手动修改原生代码。更多信息见 [CleverTap 示例插件](https://github.com/CleverTap/clevertap-expo-plugin/tree/main/CTExample)。

- [CleverTap Expo 插件文档](https://developer.clevertap.com/docs/clevertap-expo-plugin) —— 按照这份指南，在 Expo 或 React Native 项目中设置 CleverTap。

## 通过 FCM 和 APNs 直接发送通知

你可以选择从后端直接发送到平台推送 API。在这种情况下，仍可以使用 [`expo-notifications`](/versions/latest/sdk/notifications) 获取原生推送令牌，并为每个平台分别配置通知。

尽管客户端代码借助 [`expo-notifications`](/versions/latest/sdk/notifications) 仍然跨平台，你仍需要实现服务端逻辑，分别与 [FCM](https://firebase.google.com/docs/cloud-messaging) 和 [APNs](https://developer.apple.com/documentation/usernotifications) API 交互。

## React Native Firebase 消息

[React Native Firebase](https://rnfirebase.io/) 提供消息模块，让你把 [Firebase Cloud Messaging (FCM)](https://firebase.google.com/docs/cloud-messaging) 用作 Android 和 iOS 统一的推送通知服务。虽然 FCM 常与 Android 通知联系在一起，它也通过在幕后经由 Apple Push Notification service (APNs) 路由消息来支持 iOS。

这种方法不同于只把 FCM 用于 Android 通知。Firebase 的跨平台 SDK 通过单一服务处理两个平台的通知。

> 即使 FCM 处理两个平台的通知，iOS 通知仍然经过 APNs。Firebase 会自动管理这一路由。更多内容见 [React Native Firebase 消息文档](https://rnfirebase.io/messaging/usage)。

## 提示与重要注意事项

- **避免混用客户端实现**：不同通知服务的客户端实现可能冲突。使用一致的方法，以避免潜在问题。
- **Web 通知**：Expo 通知不支持 Web 通知。不过，一些第三方方案可能提供此能力。选择服务时请考虑应用的需求。
- **令牌管理**：在数据库中同时跟踪 Expo 推送令牌和原生设备令牌。这为将来的集成提供灵活性，尤其是那些通过 FCM 或 APNs 直接发送通知的营销工具。
