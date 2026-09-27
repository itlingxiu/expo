---
title: 为 iOS 创建生产构建
description: 了解为 iOS 创建生产构建并自动化发布过程。
---

# 为 iOS 创建生产构建

在本章中，我们将创建示例应用的生产版本，并用 TestFlight 提交以供测试。之后，我们会把它们提交给 App Store 审核，以便上架 App Store。

[观看视频：为 iOS 创建并发布生产构建](https://www.youtube.com/watch?v=VZL_e0cEwo8) —— 用 EAS 为 iOS 创建生产构建，用 TestFlight 测试，并提交到 App Store。

---

### 前提条件

- **Apple Developer 账户**：要创建一个，参见 [Apple Developer Portal](https://developer.apple.com/account/)。
- **eas.json 中的生产构建 profile**：确保 **eas.json** 中存在 `production` 构建 profile，它是默认添加的。

## 面向 iOS 的生产构建

[iOS 生产构建](/build/eas-json#production-builds)针对 Apple 的 App Store Connect 做了优化，可以通过 TestFlight 把构建分发给测试者，并通过 App Store 分发给公众最终用户。这种构建类型不能旁加载到模拟器或设备上，只能通过 App Store Connect 分发。

## 1. 创建分发描述文件

在终端中运行 `eas credentials` 命令，然后回答 EAS CLI 的以下提示：

- **Select platform**：iOS。
- **Which build profile do you want to configure?** 选择 production。
- **Do you want to log in to your Apple account?** 按 <kbd>Y</kbd>。这会登录我们的 Apple Developer 账户。
- **What do you want to do?** 选择 **Build credentials**，并选择 **All: Set up all the required credentials to build your project**。
- 现在它会提示是否要复用之前的 Distribution Certificate。按 <kbd>Y</kbd>。
- **Generate a new Apple Provisioning Profile?** 按 <kbd>Y</kbd>。这将成为生产应用的描述文件。
- 配置文件创建完成后，按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 退出 EAS CLI。

## 2. 创建生产构建

要使用默认的 `production` profile 创建 iOS 生产构建，打开终端并执行以下命令。由于 EAS 配置中把 `production` 设为默认 profile，不必用 `--profile` 标志显式指定它。

```sh
eas build --platform ios
```

这条命令会把构建加入队列。在 EAS 仪表板上注意 **Build Number** 会自动递增。

## 3. 把应用二进制文件提交到 App Store

要提交我们最新一次 EAS Build 创建的应用二进制文件，运行 [`eas submit`](/submit/ios) 命令：

```sh
eas submit --platform ios
```

运行这条命令后，我们需要：

- **Select a build from EAS。** 选择最新的构建 ID。
- **按照提示登录我们的 Apple 账户。** 当它询问 **Reuse this App Store Connect API Key?** 时，按 <kbd>Y</kbd>。

这会启动提交过程。

## 4. 发布内部测试版本

提交过程完成后，需要在 Web 浏览器中登录 Apple Developer 账户。

- 点击 **[Apps](https://appstoreconnect.apple.com/apps)**，查看应用图标。
- 点击应用名称，并从导航标签菜单中点击 **TestFlight**。如果构建刚刚提交，Apple 处理构建可能需要几分钟，之后才能用 TestFlight 分发。

:::note
**仅当你跳过了[面向设备的 iOS 开发构建](/tutorial/eas/ios-development-build-for-devices)一章时：** 你会看到提示 **iOS app only uses standard/exempt encryption?** 按 <kbd>Y</kbd> 选择该提示提供的默认值。由于我们的应用不使用加密，它会把 **Info.plist** 文件中的 `ITSAppUsesNonExemptEncryption` 设为 `NO`，并在你把应用发布到 TestFlight / Apple App Store 时处理相应的合规检查。当你发布自己的应用且它使用加密时，可以选择 `N`，以便下次跳过这个提示。
:::

- 在 App Store Connect 的 **Internal Testing** 下创建一个测试组。这让我们可以邀请测试用户。

![在 App Store Connect 中创建测试用户组](/static/images/tutorial/eas/app-store-01.webp)

- 组创建后，会向所有测试用户发送一封电子邮件。

![发送给测试用户的内部测试邮件](/static/images/tutorial/eas/app-store-02.jpg)

- 在邮件中点击 **View in TestFlight**，接受邀请，然后点击 **Install**。

![TestFlight 应用中显示待安装的应用](/static/images/tutorial/eas/app-store-03.jpg)

之后，应用会下载到我们的设备上，以便测试。

:::note
与内部测试类似，我们也可以创建一个组，用 TestFlight 邀请外部测试者。内部测试的上限是 100 名用户，而 TestFlight 允许把测试发布版本对外分享给最多 10,000 名测试者，并提供一个可公开分享的链接。逐步说明参见[用 TestFlight 分发 iOS 应用](/submit/testflight)。
:::

## 5. 把应用提交到 Apple App Store

要为 App Store 提交准备应用，前往 **App Store** 标签：

- 按 Apple 的指南提供元数据详情和截图，并填写 **General** 下的详情。

![App Store Connect 中显示应用详情和截图](/static/images/tutorial/eas/app-store-04.png)

- 然后手动选择构建。

![App Store Connect 中显示应用的构建选择](/static/images/tutorial/eas/app-store-05.png)

> **完成商店列表页**：要为商店列表页准备应用，参见[创建应用商店素材](/guides/store-assets)，了解如何创建截图和预览。

- 应用准备好后，点击 **Submit to App Review**。之后 Apple 会审核我们的应用，如果通过，应用就会出现在 App Store 上。

![App Store Connect 中显示提交审核的应用](/static/images/tutorial/eas/app-store-06.png)

## 6. 自动提交

对于以后的发布，可以用 `eas build` 的 [`--auto-submit`](/build/automate-submissions) 标志，把创建构建和提交到 App Store 合并为一步，从而简化流程：

```sh
eas build --platform ios --auto-submit
```

:::note
这条命令会自动把构建上传到 TestFlight 以供内部测试，但不会自动把应用提交给 App Store 审核。准备公开发布时，你仍然需要手动把构建从 TestFlight 提升到 App Store。更多信息参见[应用商店的默认提交行为](/build/automate-submissions#default-submission-behavior-for-app-stores)。
:::

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
