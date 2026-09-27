---
title: 创建你的第一次构建
description: 了解如何用 EAS Build 为应用创建构建。
---

# 创建你的第一次构建

EAS Build 让你构建可提交到 Google Play Store 或 Apple App Store 的应用二进制文件。本指南说明如何做到这一点。

如果你更想把应用直接安装到 Android 设备/模拟器，或安装到 iOS 模拟器，我们会指向说明如何做的资料。

对于小型应用，Android 和 iOS 平台的构建会在几分钟内触发。如果过程中遇到问题，可以到 [Discord 和论坛](https://chat.expo.dev/)求助。

:::note
EAS Build 是一项快速演进的服务。在为项目创建构建之前，建议先查阅[限制](/build-reference/limitations)以及下面的其他前置条件。
:::

**前置条件**

- **一个 React Native Android 或 iOS 项目**：还没有项目？很快就能创建一个可配合本指南使用的 “Hello world” 应用：

:::tabs
:::tab npm
  ```sh
  $ npx create-expo-app@latest my-app
  ```
:::
:::tab yarn
  ```sh
  $ yarn create expo-app my-app
  ```
:::
:::tab pnpm
  ```sh
  $ pnpm create expo-app my-app
  ```
:::
:::tab bun
  ```sh
  $ bun create expo my-app
  ```
:::
:::

  EAS Build 也适用于由 `npx create-react-native-app`、`npx react-native`、`ignite-cli` 以及其他项目脚手架工具创建的项目。

- **一个 Expo 账户**：任何拥有 Expo 账户的人都可以使用 EAS Build，无论你是否为 EAS 付费，或使用免费方案。你可以在 [expo.dev](https://expo.dev/signup) 注册。

  付费订阅者会获得质量方面的改进，例如更多的构建并发数、优先排队以缩短构建排队时间，以及更高的构建超时上限。不同方案和权益参见 [EAS 定价](https://expo.dev/pricing)。

<a id="安装最新的-eas-cli"></a>

1. **安装最新的 EAS CLI**

   EAS CLI 是你将在终端中用来与 EAS 服务交互的命令行应用。运行以下命令安装：

:::tabs
:::tab npm
   ```sh
   $ npm install --global eas-cli
   ```
:::
:::tab yarn
   ```sh
   $ yarn global add eas-cli
   ```
:::
:::tab pnpm
   ```sh
   $ pnpm add --global eas-cli
   ```
:::
:::tab bun
   ```sh
   $ bun add --global eas-cli
   ```
:::
:::

   你也可以用上面的命令检查是否有新版本的 EAS CLI。我们建议你始终使用最新版本。

   > 你也可以改用 `npx eas-cli@latest`，而不做全局安装。选择这种方式时，文档中凡是需要调用 `eas` 的地方，都记得改用它。

2. **登录你的 Expo 账户**

   如果你已经用 Expo CLI 登录了 Expo 账户，可以跳过本节描述的步骤。如果还没有，运行以下命令登录：

   ```sh
   $ eas login
   ```

   你可以运行 `eas whoami` 检查是否已登录。

<a id="配置项目"></a>

3. **配置项目**

   要为 EAS Build 配置 Android 或 iOS 项目，运行以下命令：

   ```sh
   $ eas build:configure
   ```

   想了解幕后发生了什么，参见[构建配置过程参考](/build-reference/build-configuration)。

   对于开发，建议创建[开发构建](/develop/development-builds/introduction)，它是应用的调试构建，并包含 [`expo-dev-client`](/versions/latest/sdk/dev-client) 库。它帮助你尽快迭代，并提供更灵活、可靠、完整的开发环境。运行以下命令安装该库：

:::tabs
:::tab npm
   ```sh
   $ npx expo install expo-dev-client
   ```
:::
:::tab yarn
   ```sh
   $ yarn expo install expo-dev-client
   ```
:::
:::tab pnpm
   ```sh
   $ pnpm expo install expo-dev-client
   ```
:::
:::tab bun
   ```sh
   $ bun expo install expo-dev-client
   ```
:::
:::

   某些场景可能需要额外配置：

   - 应用代码依赖环境变量？[把它们加入构建配置](/eas/environment-variables)。
   - 项目在 Monorepo 中？[按照这些说明操作](/build-reference/build-with-monorepos)。
   - 使用私有 npm 包？[添加你的 npm 令牌](/build-reference/private-npm-packages)。
   - 应用依赖 Node、Yarn、npm、CocoaPods 或 Xcode 等工具的特定版本？[在构建配置中指定这些版本](/build/eas-json)。

4. **运行构建**

   ### 为 Android 模拟器/设备或 iOS 模拟器构建

   试用 EAS Build 最简单的方式，是创建一份可以在 Android 设备/模拟器或 iOS 模拟器上运行的构建。这比上传到商店更快，也不需要商店开发者会员账户。如果想试试，请阅读[为 Android 创建可安装的 APK](/tutorial/eas/android-development-build)和[为 iOS 创建模拟器构建](/tutorial/eas/ios-development-build-for-simulators)。

   ### 为应用商店构建

   在面向应用商店的构建过程开始之前，你需要拥有商店开发者账户，并生成或提供应用签名凭据。

   无论你是否有生成应用签名凭据的经验，EAS CLI 都会承担繁重的工作。你可以选择让 EAS CLI 处理应用签名凭据过程。更多信息请查看下面的 [Android 应用签名凭据](#android-应用签名凭据)或 [iOS 应用签名凭据](#ios-应用签名凭据)步骤。

   <details>
   <summary>分发到 Google Play Store 需要 Google Play 开发者会员资格。</summary>

   你可以用 EAS Build 构建并签名应用，但除非你有会员资格（一次性 25 美元），否则无法把它上传到 Google Play Store。

   </details>

   <details>
   <summary>为 Apple App Store 构建需要 Apple Developer Program 会员资格。</summary>

   如果你要用 EAS Build 为 Apple App Store 创建发布构建，需要能访问一个拥有 99 美元 [Apple Developer Program](https://developer.apple.com/programs) 会员资格的账户。

   </details>

   确认你拥有 Google Play Store 或 Apple App Store 账户，并决定是否由 EAS CLI 处理应用签名凭据之后，可以用下面这组命令为该平台的商店构建：

:::tabs
:::tab Android
   ```sh
   $ eas build --platform android
   ```
:::
:::tab iOS
   ```sh
   $ eas build --platform ios
   ```
:::
:::

   > 你可以向构建命令传入 `--message` 来为构建附加一条消息，例如 `eas build --platform ios --message "Some message"`。该消息会显示在网站上。当你想给团队留下这条构建用途的备注时，这很方便。

   你也可以使用 `--platform all` 选项同时为 Android 和 iOS 构建：

   ```sh
   $ eas build --platform all
   ```

   > 如果你以前已经把应用发布到商店，并且有想继续使用的现有[应用签名凭据](/app-signing/app-credentials)，请[按照这些说明配置它们](/app-signing/existing-credentials)。

   #### Android 应用签名凭据

   - 如果还没有为应用生成 keystore，可以选择 `Generate new keystore`，让 EAS CLI 为你处理，然后就完成了。keystore 会安全地存储在 EAS 服务器上。
   - 如果你以前用 `expo build:android` 构建过应用，可以在这里使用相同的凭据。
   - 如果想手动生成 keystore，更多信息参见[手动 Android 凭据指南](/app-signing/local-credentials#android-credentials)。

   #### iOS 应用签名凭据

   - 如果还没有生成描述文件和/或分发证书，可以登录 Apple Developer Program 账户并按提示操作，让 EAS CLI 为你处理。
   - 如果你已经用 `expo build:ios` 构建过应用，可以在这里使用相同的凭据。
   - 如果更想手动生成凭据，请参考[手动 iOS 凭据指南](/app-signing/local-credentials#ios-credentials)。

5. **等待构建完成**

   默认情况下，`eas build` 命令会等待构建完成，但如果你不想等待，可以中断它。构建过程一开始，EAS CLI 就会提示构建详情页链接，你可以顺着该链接查看进度并阅读日志。你也可以访问[构建仪表盘](https://expo.dev/builds)，或运行以下命令找到该页面：

   ```sh
   $ eas build:list
   ```

   如果你是某个组织的成员，并且构建代表该组织进行，你会在[该账户的构建仪表盘](https://expo.dev/accounts/[account]/builds)上找到构建详情。

:::note
   **构建失败了？** 请再次确认你遵循了[配置步骤](#配置项目)中所有适用的说明，必要时参考[故障排除指南](/build-reference/troubleshooting)。
:::

6. **部署构建**

   如果你走到了这一步，恭喜！根据你选择的路径，你现在要么有一份可以上传到应用商店的构建，要么有一份可以直接安装到 Android 设备/iOS 模拟器的构建。

   ### 把应用分发到应用商店

   只有当你专门为提交到应用商店而构建时，才能提交到应用商店。如果你创建的是面向商店的构建，请[了解如何用 EAS Submit 把应用提交到应用商店](/deploy/submit-to-app-stores)。

   ### 安装并运行应用

   只有当你明确为直接安装而构建时，才能把应用直接安装到 Android 设备/iOS 模拟器。如果你是为应用商店分发而构建的，需要先上传到应用商店，再从那里安装（例如从 Apple 的 TestFlight 应用安装）。

   要了解如何把应用直接安装到 Android 设备/iOS 模拟器，请从[构建仪表盘](https://expo.dev/accounts/[account]/builds)进入构建详情页，点击 “Install” 按钮。

## 后续步骤

我们带你走完了用 EAS Build 创建第一次构建的步骤，但没有深入过程中的任何特定部分。

准备好进一步了解时，建议按以下主题继续：

- [用 eas.json 进行配置](/build/eas-json)
- [内部分发](/build/internal-distribution)
- [更新](/build/updates)
- [自动提交](/build/automate-submissions)
- [从 CI 触发构建](/build/building-on-ci)

你也可以翻阅参考部分，了解你最感兴趣的主题，例如：

- [构建 webhook](/eas/webhooks)
- [构建服务器基础设施](/build-reference/infrastructure)
- [Android](/build-reference/android-builds)和 [iOS](/build-reference/ios-builds)构建过程如何工作
