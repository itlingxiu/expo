---
title: 分发应用以供审查概览
description: 了解如何使用应用商店测试轨道、内部分发与 EAS Update 分发应用以供审查。
---

# 分发应用以供审查概览

把预览构建分享给团队进行 QA/审查，有三种方式：应用商店测试轨道（testing tracks）、内部分发（internal distribution），以及开发构建结合 EAS Update。

## 可以用 Expo Go 审查发布版本吗？

:::note
Expo Go 是"面向学生和学习者的游乐场，不是用来构建生产级项目的"，因此不适合用来审查应用。
:::

应用商店测试轨道只接受发布（release）构建 —— 不能用于分发开发构建。建议的替代方案是[内部分发](#使用-eas-build-进行内部分发)，它同时适用于发布构建与开发构建。

## 应用商店测试轨道

### Android：Google Play Beta

[Google Play beta](https://support.google.com/googleplay/android-developer/answer/9845334) 让你在全面公开发布之前，通过选择内部、封闭或开放轨道（track）分发给测试人员，并控制访问权限。

- 内部轨道（Internal track）：仅限邀请，最多 100 名测试人员。
- 封闭与开放轨道：支持更大的测试人群；封闭轨道需要邀请，开放轨道允许任何人加入。

设置：把 AAB 上传到 Play Console，配置一个轨道，然后通过邮件或可分享链接邀请用户。测试人员从 Play Store 安装；反馈与崩溃报告会显示在 Play Console 中。

### iOS：TestFlight

iOS TestFlight 需要付费的 Apple Developer 账户。

- 内部测试：最多 100 名 Apple Developer 团队成员组成的分组，通过 TestFlight 应用安装。团队通常更喜欢这种方式，因为它"添加新测试人员不需要新的构建，应用也会自动保持更新"。
- 外部测试：通过邮件或公开链接，最多 10,000 名用户。

两种方式都需要把应用上传到 App Store Connect 并通过自动审核；外部构建还需要更正式的 App Store 审核（独立于预发布审核）。

分步指引见[用 TestFlight 分发 iOS 应用](/submit/testflight)。

> 相关阅读：[EAS Submit](/submit/ios) —— 了解如何把应用上传到应用商店的测试与发布轨道。

## 使用 EAS Build 进行内部分发

EAS Build 的内部分发会创建通过 URL 分享的构建，在设备上打开该 URL 即可安装应用。产物：Android 上是一个可安装的 APK，iOS 上是一个 ad hoc 签名（provisioned）应用。

构建完成后立即可下载 —— "无需填写任何表单，也无需等待批准/处理"。发布构建与开发构建都可以这样分享。

> 相关阅读：[如何设置内部分发构建](/build/internal-distribution) —— 了解 EAS Build 如何为你的构建提供可分享的 URL，供团队内部分发。

## 开发构建与 EAS Update

在审查期间发布预览：把 EAS Update 推送到开发构建即可。开发构建通过内部分发分享并安装后，就可以启动任何兼容的已发布更新（见[运行时版本与更新](/eas-update/runtime-versions)）。

- 从 EAS 仪表盘启动更新，并分享指向特定更新的链接。
- 直接在开发构建中浏览并启动更新。
- 配置 GitHub Actions，在 PR 与提交时自动发布更新。

这种方式的能力独一无二：反馈可以"像运行 `eas update` 一样快"地得到响应 —— 分享新版本只需几秒钟，无需重新构建，也无需上传应用商店测试轨道。

> 相关阅读：
> - [开始使用 EAS Update](/eas-update/getting-started) —— 了解如何在项目中使用 expo-updates 库与 EAS Update。
> - [使用 GitHub Actions](/eas-update/github-actions) —— 了解如何用 GitHub Actions 自动化 EAS Update 的发布流程，让部署一致且快速，把更多时间留给开发。
> - [在 EAS Update 中使用 expo-dev-client](/eas-update/expo-dev-client) —— 了解如何在项目中使用 expo-dev-client 启动不同的应用版本，并在开发构建中预览已发布的更新。

另见：[与团队分享预览](/review/share-previews-with-your-team)、[使用 Orbit 分享](/review/with-orbit)。
