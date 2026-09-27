---
title: iOS 构建过程
description: 了解 iOS 项目在 EAS Build 上是如何构建的。
---

# iOS 构建过程

本页描述用 EAS Build 构建 iOS 项目的过程。如果你关心构建服务的实现细节，可以阅读本页。

## 构建过程

下面更仔细地看一看用 EAS Build 构建 iOS 项目的步骤。我们先在你的本地机器上运行一些步骤来准备项目，然后在远程服务上构建项目。

### 本地步骤

第一阶段发生在你的电脑上。EAS CLI 负责完成以下步骤：

1. 如果 **eas.json** 中 `cli.requireCommit` 设为 `true`，检查 git 索引是否干净，也就是没有任何未提交的更改。如果不干净，EAS CLI 会提供选项，帮你提交本地更改，或中止构建过程。
2. 准备构建所需的凭据。
   - 凭据来自本地 **credentials.json** 文件还是 EAS 服务器，取决于 `builds.ios.PROFILE_NAME.credentialsSource` 的值。如果选择了 `remote` 模式但尚无凭据，系统会提议为你生成它们。
3. 自行管理原生目录（**android** 和 **ios**）的项目需要额外一步：检查 Xcode 项目是否配置为可以在 EAS 服务器上构建（以确保设置了正确的 bundle identifier 和 Apple Team ID）。
4. 创建包含仓库副本的 tarball。实际行为取决于你使用的 [VCS 工作流](https://expo.fyi/eas-vcs-workflow)。
5. 把项目 tarball 上传到私有的 Google Cloud Storage（GCS）存储桶，并把构建请求发送给 EAS Build。

### 远程步骤

在下一阶段，EAS Build 接手你的请求时会发生这些事：

1. 为构建创建一个新的 macOS 虚拟机。
   - 每次构建都有自己全新的 macOS 虚拟机，其中安装了全部构建工具（Xcode、Fastlane 等）。
2. 从私有 GCS 存储桶下载项目 tarball 并解包。
3. 如果设置了 `NPM_TOKEN`，则[创建 **.npmrc**](/build-reference/private-npm-packages)。
4. 如果 **package.json** 中定义了 `eas-build-pre-install` 脚本，则运行它。
5. 在项目根目录运行 `npm install`（如果存在 **yarn.lock**，则运行 `yarn install`）。
6. 运行 `npx expo-doctor`，诊断项目配置中的潜在问题。
7. 恢复凭据
   - 创建一个新的钥匙串。
   - 把分发证书导入钥匙串。
   - 把描述文件写入 **~/Library/MobileDevice/Provisioning Profiles** 目录。
   - 验证分发证书与描述文件匹配（每个描述文件都绑定到特定的分发证书，不能用来配合任何其他证书构建 iOS）。
8. 使用持续原生生成（CNG）的项目还有额外步骤：运行 `npx expo prebuild` 生成 **android** 和 **ios** 目录。这一步会使用带版本的 Expo CLI。
9. 恢复由[构建 profile](/build/eas-json)中 `cache.key` 值标识的先前保存的缓存。
10. 在项目内的 **ios** 目录中运行 `pod install`。
11. 如果 **package.json** 中定义了 `eas-build-post-install` 脚本，则运行它。
12. 用描述文件的 ID 更新 Xcode 项目。
13. 如果 **ios** 目录中尚不存在 **Gymfile**，则创建它（参见[默认 Gymfile](#默认-gymfile)一节）。
14. 在 **ios** 目录中运行 `fastlane gym`。
15. **已弃用：** 如果 **package.json** 中定义了 `eas-build-pre-upload-artifacts` 脚本，则运行它。
16. 存储[构建 profile](/build/eas-json)中定义的文件和目录缓存。默认会缓存 **Podfile.lock**。后续构建会恢复该缓存。
17. 把应用归档上传到私有 GCS 存储桶。
    - 产物路径可以在 **eas.json** 的 `builds.ios.PROFILE_NAME.applicationArchivePath` 中配置。默认是 **ios/build/App.ipa**。你可以为 `applicationArchivePath` 指定类似 glob 的模式。我们使用 [glob 模式](https://github.com/isaacs/node-glob#glob-primer)进行模式匹配。
18. 如果构建成功：运行 **package.json** 中定义的 `eas-build-on-success` 脚本（如果已定义）。
19. 如果构建失败：运行 **package.json** 中定义的 `eas-build-on-error` 脚本（如果已定义）。
20. 运行 **package.json** 中定义的 `eas-build-on-complete` 脚本（如果已定义）。环境变量 `EAS_BUILD_STATUS` 会被设为 `finished` 或 `errored`。
21. 如果构建 profile 中指定了 `buildArtifactPaths`，则把构建产物归档上传到私有 GCS 存储桶。

## 用 Fastlane 构建 iOS 项目

我们使用 [Fastlane](https://fastlane.tools/) 构建 iOS 项目。更具体地说，我们使用 `fastlane gym` 命令（[参见 Fastlane 文档了解更多](https://docs.fastlane.tools/actions/gym/)）。该命令允许你在 **Gymfile** 中声明构建配置。

EAS Build 可以使用你自己的 **Gymfile**。你只需把该文件放在 **ios** 目录中。

### 默认 Gymfile

如果 **ios/Gymfile** 文件不存在，iOS 构建器会创建一个默认文件，大致如下：

```rb ios/Gymfile
suppress_xcode_output(true)
clean(true)

scheme("app")

export_options({
  method: "app-store",
  provisioningProfiles: {
    "com.expo.eas.builds.test.application" => "dd83ed9c-4f89-462e-b901-60ae7fe6d737"
  }
})

export_xcargs "OTHER_CODE_SIGN_FLAGS=\"--keychain /tmp/path/to/keychain\""

disable_xcpretty(true)

output_directory("./build")
output_name("App")
```
