---
title: 手动把 iOS 应用提交到 Apple App Store
description: 在 macOS 上使用 Xcode 归档 iOS 应用并上传到 App Store Connect。
---

# 手动把 iOS 应用提交到 Apple App Store

本指南介绍如何用 Xcode 归档 iOS 应用并上传到 [App Store Connect](https://appstoreconnect.apple.com/)。如果你没有使用 EAS，或者 EAS Submit 暂时不可用、需要备用方案，这一流程会很有用。

如果你已经有 **.ipa** 文件，请跳到[用 Transporter 上传已有构建](#用-transporter-上传已有构建)。对大多数团队来说，[EAS Submit](/submit/ios) 更简单，并且可以在任意操作系统上使用。

## 前置条件

- **注册 Apple Developer 账户**：向 Apple App Store 提交应用需要付费的 Apple Developer 会员资格。在 [Apple Developer Portal](https://developer.apple.com/account/) 注册。
- **安装 Xcode**：必须在 Mac 上安装 Xcode。参见[设置 Xcode](/get-started/set-up-your-environment?platform=ios&device=physical&mode=development-build&buildEnv=local#set-up-xcode-and-watchman)。
- **生成 ios 目录**：项目需要 **ios** 目录。如果使用 [CNG](/workflow/continuous-native-generation)，运行 `npx expo prebuild` 来生成它。
- **在 App Store Connect 中创建应用记录**：需要在 [App Store Connect](https://appstoreconnect.apple.com/) 中有一条 bundle identifier 匹配的应用记录。如果还没有，请登录 App Store Connect，点击 **Apps** 旁边的蓝色 **+**，选择 **New App**。

1. 在 Xcode 中打开 iOS 工作区

   在项目目录中，用 Xcode 打开 iOS 工作区：

   ```sh
   $ xed ios
   ```

   然后：

   1. 在左侧边栏中选择应用的工作区。
   2. 进入 **Signing & Capabilities**，选择 **All** 或 **Release**。
   3. 在 **Signing** > **Team** 下选择你的 Apple Developer 团队。Xcode 会生成自动管理的描述文件和签名证书。

2. 配置发布 scheme

   1. 从菜单栏打开 **Product** > **Scheme** > **Edit Scheme**。
   2. 在边栏中选择 **Run**，把 **Build configuration** 设为 **Release**。

3. 为发布构建应用

   从菜单栏打开 **Product** > **Build**。Xcode 会构建发布二进制文件。

4. 归档并上传到 App Store Connect

   1. 从菜单栏打开 **Product** > **Archive**。
   2. 在 **Archives** 下，从右侧边栏点击 **Distribute App**。
   3. 点击 **App Store Connect** 并按提示操作。Xcode 会把构建上传到 App Store Connect。如果想改为得到 **.ipa** 文件并稍后上传，请在提示中选择 **Export**，然后使用 [Transporter](#用-transporter-上传已有构建)。
   4. 登录 [App Store Connect](https://appstoreconnect.apple.com/)，选择你的应用，并从 App Store Connect 仪表盘把它提交到 TestFlight 或 App Review。

## 用 Transporter 上传已有构建

如果你已经有 **.ipa** 文件，例如来自 `eas build --platform ios --local`，或从 [EAS 仪表盘](https://expo.dev/accounts/[account]/projects/[project]/builds)下载的构建，就不需要在 Xcode 中归档应用。改用 Apple 的 Transporter 应用上传：

1. 从 App Store 下载 [**Transporter**](https://apps.apple.com/app/transporter/id1450874784)。
2. 用你的 Apple ID 登录。
3. 添加构建：把 **.ipa** 文件直接拖进 Transporter 窗口，或用 **+** 或 **Add App** 按钮打开的文件对话框选择它。
4. 点击 **Deliver** 按钮提交。

这一过程可能需要几分钟，然后 Apple 的服务器还要再处理 10 到 15 分钟。之后，你可以在 App Store Connect 中查看二进制文件的状态，并把它提交到 TestFlight 或 App Review。

## 延伸阅读

- 为应用的商店页面[创建商店素材](/guides/store-assets)
- [用 EAS Submit 提交到 Apple App Store](/submit/ios)
