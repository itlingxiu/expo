---
title: 用 EAS Submit 提交到 Apple App Store
description: 了解如何用 EAS Submit 把 iOS 应用提交到 Apple App Store。
---

# 用 EAS Submit 提交到 Apple App Store

[EAS Submit](/deploy/submit-to-app-stores) 是把 iOS 应用上传到 Apple App Store 的推荐方式。`eas submit` 命令在你的机器上和 CI/CD 中的工作方式相同。[EAS Workflows](/eas/workflows/introduction) 是在构建之后自动运行它的最简单方式。EAS Submit 可在 macOS、Linux 和 Windows 上工作，因此发布 iOS 构建并不需要 Mac。

## 前置条件

- **注册 Apple Developer 账户**：向 Apple App Store 提交应用需要付费的 Apple Developer 账户。在 [Apple Developer Portal](https://developer.apple.com/account/)注册。
- **在应用配置中包含 bundle identifier**：在 **app.json** 中包含应用的 bundle identifier：

  ```json app.json
  {
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    }
  }
  ```

- **安装 EAS CLI 并用 Expo 账户进行身份验证**：安装 EAS CLI 并用 Expo 账户登录：

:::tabs
:::tab npm
  ```sh
  $ npm install --global eas-cli && eas login
  ```
:::
:::tab yarn
  ```sh
  $ yarn global add eas-cli && eas login
  ```
:::
:::tab pnpm
  ```sh
  $ pnpm add --global eas-cli && eas login
  ```
:::
:::tab bun
  ```sh
  $ bun add --global eas-cli && eas login
  ```
:::
:::

## 构建生产应用

提交需要一份生产 **.ipa**。用 [EAS Build](/build/introduction) 创建一份：

```sh
$ eas build --platform ios --profile production
```

你也可以在自己的电脑上用 `eas build --platform ios --profile production --local` 或 Xcode 构建。

## 用 `eas submit` 提交

构建就绪后，把它提交到 Apple App Store：

```sh
$ eas submit --platform ios
```

该命令会引导你选择一次构建，首次运行时提示输入 Apple ID，并把二进制文件上传到 App Store Connect。处理完成后（通常 10 到 15 分钟），构建会出现在 [TestFlight](/submit/testflight) 中。要发布到生产环境，登录 [App Store Connect](https://appstoreconnect.apple.com/)并把构建提交 App Review。

### 配置提交 profile

在 **eas.json** 中添加包含 App Store Connect 应用 ID 的提交 profile：

```json eas.json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "your-app-store-connect-app-id"
      }
    }
  }
}
```

<details id="如何查找-ascappid">
<summary>如何查找 <code>ascAppId</code></summary>

1. 登录 [App Store Connect](https://appstoreconnect.apple.com/)并选择你的团队。
2. 进入 [Apps](https://appstoreconnect.apple.com/apps)。
3. 点击你的应用。
4. 确认 **App Store** 标签页处于活动状态。
5. 在左侧窗格的 **General** 下，选择 **App Information**。
6. 你的 `ascAppId` 列在 **General Information** 下，名称为 **Apple ID**。

![App Store Connect 中的 Apple ID 和 Apple Team ID](/static/images/eas-submit/finding-ascAppId.webp)

</details>

每个可用选项参见 [eas.json 参考](/eas/json#ios-specific-options-1)。

### 一步完成构建和提交

向 `eas build` 传入 `--auto-submit`，即可把完成的构建自动交给 EAS Submit：

```sh
$ eas build --platform ios --auto-submit
```

细节参见[自动提交](/build/automate-submissions)。

## 用 EAS Workflows 自动化

[EAS Workflows](/eas/workflows/introduction) 在 EAS 基础设施上运行同一个提交步骤，由 git 推送触发，或从 CLI 手动运行。首先配置 App Store Connect API 密钥，以便工作流可以非交互地向 Apple 进行身份验证：

```sh
$ eas credentials --platform ios
```

1. 选择 `production` 构建 profile。
2. 用你的 Apple Developer 账户登录并按提示操作。
3. 选择 **App Store Connect: Manage your API Key**。
4. 选择 **Set up your project to use an API Key for EAS Submit**。

<details>
<summary>更想使用自己的凭据？</summary>

**App Store Connect API 密钥：** 创建你自己的 [API 密钥](https://expo.fyi/creating-asc-api-key)，并在 **eas.json** 中用 `ascApiKeyPath`、`ascApiKeyIssuerId` 和 `ascApiKeyId` 字段设置它。

**应用专用密码：** 通过环境变量 `EXPO_APPLE_APP_SPECIFIC_PASSWORD` 提供你的[应用专用密码](https://expo.fyi/apple-app-specific-password)，并在 **eas.json** 中用 `appleId` 字段设置你的 Apple ID。

</details>

创建名为 **.eas/workflows/submit-ios.yml** 的工作流文件，内容如下：

```yaml .eas/workflows/submit-ios.yml
name: Submit iOS

on:
  push:
    branches: ['main']

jobs:
  build_ios:
    name: Build iOS app
    type: build
    params:
      platform: ios
      profile: production

  submit_ios:
    name: Submit to TestFlight
    needs: [build_ios]
    type: testflight
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
```

这会在每次推送到 `main` 时构建 iOS 应用并提交到 TestFlight。[预置的 `testflight` 作业](/eas/workflows/pre-packaged-jobs#testflight)也可以把构建分享给内部和外部测试组。手动触发工作流：

```sh
$ eas workflow:run submit-ios.yml
```

更多模式参见[工作流示例指南](/eas/workflows/examples/introduction)。

## 使用其他 CI/CD 服务

你可以从任意 CI/CD 服务运行 `eas submit`，例如 GitHub Actions、GitLab CI 等：

```sh
$ eas submit --platform ios --profile production
```

这需要[个人访问令牌](/accounts/programmatic-access#personal-access-tokens)来向你的 Expo 账户进行身份验证。在 CI 服务中设置环境变量 `EXPO_TOKEN`，以便 `eas submit` 可以非交互运行。

## 手动备用方案

如果 EAS Submit 暂时不可用，你可以从装有 Xcode 的 Mac 手动上传到 Apple App Store。

- [用 Xcode 手动提交 iOS 应用](/submit/ios-manual)：在 macOS 上使用 Xcode 归档 iOS 应用并上传到 App Store Connect。
