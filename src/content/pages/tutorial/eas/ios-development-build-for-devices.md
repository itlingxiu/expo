---
title: 为 iOS 设备创建并运行云构建
description: 学习如何使用 EAS Build 为 iOS 设备配置开发构建。
---

# 为 iOS 设备创建并运行云构建

在本章中，我们将用 EAS Build 创建一个可以在 iOS 设备上运行的开发构建。

面向 iOS 设备的开发构建以 **.ipa** 格式生成，这是 iOS 应用安装的标准格式。

[观看视频：为 iOS 真机创建开发构建](https://www.youtube.com/watch?v=HbfWU7_o4cU) —— 学习如何用 EAS Build 在 iOS 真机上构建并运行开发构建，包括设置代码签名。

---

### 前提条件

- **Apple Developer 账户**：需要它才能访问为我们的应用签名所[必需的凭据](/app-signing/app-credentials#ios)，因为每次构建都需要签名，以验证应用来自可信来源。EAS Build 会帮助管理这些凭据。
- **在 iOS 16 及更高版本上启用开发者模式**：在设备上安装开发构建需要启用开发者模式。如果这是第一次，或当前已关闭，参见[启用开发者模式](/guides/ios-developer-mode)。

## 描述文件

要在 iOS 设备上开始开发，我们必须：

- 通过创建新的[描述文件](/app-signing/app-credentials#provisioning-profiles)来登记设备。
- 把这份描述文件下载并安装到设备上。

### 1. 登记一台 iOS 设备

用 EAS CLI 运行命令来登记一台新的 Apple 设备：

```sh
eas device:create
```

这条命令会向我们提出以下问题：

- **You're inside the project directory. Would you like to use the** **your-account-name** **account?** 按 <kbd>Y</kbd>。
- **Apple ID。** 在这一步输入你的 Apple ID。然后它会登录我们的 Apple Developer 账户。按照终端窗口中的步骤操作。
- **How would you like to register your devices?** 选择 **Website**，它会生成一个可以在 iOS 设备上打开的登记 URL。

:::tip
如果你或你的团队有多台设备，可以把描述文件链接分享给这些设备，供它们下载并安装描述文件。
:::

### 2. 下载并安装描述文件

在设备的 Web 浏览器中打开上一步提供的链接，并点击 **Download Profile button**。

![下载描述文件](/static/images/tutorial/eas/ios-ad-hoc-01.jpg)

打开 **Settings** 应用，它会提示我们登记设备。

![安装描述文件](/static/images/tutorial/eas/ios-ad-hoc-02.jpg)

点击 **Install** 以登记这台 iOS 设备。

![描述文件安装成功](/static/images/tutorial/eas/ios-ad-hoc-03.jpg)

描述文件安装后，设备会把我们重定向回 Web 浏览器，并显示一条成功消息，表明过程已完成。

## 面向 iOS 设备的开发构建

### 1. 创建

要在 iOS 设备上创建开发构建，请确保在 `build.development` profile 下：

- **eas.json** 中的 `developmentClient` 设为 `true`，默认配置已经这样做了。
- 然后以 `ios` 为平台、`development` 为构建 profile 运行 `eas build` 命令：

```sh
eas build --platform ios --profile development
```

:::tip
下次运行 `eas build` 命令时，也可以用 `-p` 指定平台。它是 `--platform` 的缩写。
:::

第一次创建构建时，这条命令会向我们提出以下问题：

- **What would you like your iOS bundle identifier to be?** 按 <kbd>Return</kbd> 选择该提示提供的默认值。如果 **app.json** 中尚未定义，这会添加 [`ios.bundleIdentifier`](/versions/latest/config/app#bundleidentifier)。
- **Do you want to log in to your Apple account?** 由于我们是第一次创建开发构建，它会要求我们 **Generate a new Apple Distribution Certificate**。两次都按 <kbd>Y</kbd>。
- **Select a device for ad hoc build**。这是关键部分，也是我们之前必须登记描述文件的原因。我们可以在这里选择一台或全部已登记的设备，然后按回车，以便稍后把该构建安装到这些设备上。

:::warning
**在新的或最近续订的 Apple Developer Program 会员资格下，新登记的设备可能无法立即安装。** 用 Expo 登记设备并不会向 Apple 登记它。设备只有在第一次被包含进某次构建时，才会被添加到 Apple。对于这类会员资格，Apple 随后可能需要[最多 24–72 小时](https://developer.apple.com/help/account/reference/device-registration-updates/)才能完成设备处理，之后才能把它加入描述文件，因此第一次包含新登记设备的构建可能会失败。如果发生这种情况，请等待 Apple 处理完成，然后再次运行构建。
:::

:::note
**仅当你跳过了 [iOS 模拟器](/tutorial/eas/ios-development-build-for-simulators)一章时：** 你会看到提示 **iOS app only uses standard/exempt encryption?** 按 <kbd>Y</kbd> 选择该提示提供的默认值。由于我们的应用不使用加密，它会把 **Info.plist** 文件中的 `ITSAppUsesNonExemptEncryption` 设为 `NO`，并在你把应用发布到 TestFlight / Apple App Store 时处理相应的合规检查。当你发布自己的应用且它使用加密时，可以选择 `N`，以便下次跳过这个提示。
:::

回答之后，构建会进入队列，我们可以通过 EAS CLI 提供的链接在 EAS 仪表板上跟踪进度：

![EAS 仪表板中的 iOS 预览构建详情与进度](/static/images/tutorial/eas/ios-build.png)

<details>
<summary>构建详情页包含什么？</summary>

构建详情页显示构建类型、profile、Expo SDK 版本、应用版本、构建号、最近一次提交哈希，以及发起构建的开发者或账户所有者的身份。

在上图中，**Build artifact** 的当前状态显示构建正在进行。完成后，这一节会提供下载构建的选项。**Logs** 列出了 EAS Build 上 iOS 构建过程中的每一步。为求简洁，这里不逐一展开。要了解更多，参见 [iOS 构建过程](/build-reference/ios-builds)。

</details>

<details>
<summary>什么是 iOS bundle identifier？</summary>

`ios.bundleIdentifier` 是我们应用的唯一名称。如果我们现在发布应用，Apple App Store 会用这个属性及其值在商店中识别我们的应用。

这种记法定义为 `host.owner.app-name`。例如，我们的示例应用是 `com.owner.stickersmash`，其中 `com.owner` 是域名，`stickersmash` 是应用名称。

</details>

### 2. 安装

构建完成后，Build artifact 一节会更新，表明构建已完成：

![构建产物提供为 iOS 设备和模拟器下载开发构建的选项](/static/images/tutorial/eas/ios-build-artifact.png)

这一节提供了在 iOS 设备上运行开发构建的可用方法：Expo Orbit 和 Install 按钮。

[Expo Orbit](https://expo.dev/orbit) 可以在 iOS 设备上无缝安装开发构建。使用这种方法：

- 用 USB 把 iOS 设备连接到开发机。
- 打开 Orbit 菜单栏应用。
- 在 Orbit 应用中选择 **Device**。

![EAS 仪表板 Build artifact 中的 Open with Orbit 按钮](/static/images/tutorial/eas/ios-orbit.png)

- 在 EAS 仪表板的 **Build artifact** 下，点击 **Open with Orbit**。

构建安装后，Orbit 应用会在设备上启动开发构建。

<details>
<summary>替代方案：使用 Install 按钮和二维码</summary>

**Build artifact** 一节中的 **Install** 按钮会生成便于安装的二维码：

- 点击 **Install**，弹出窗口中会显示二维码。

![Install 按钮生成二维码，便于在 iOS 设备和模拟器上安装](/static/images/tutorial/eas/ios-qr-code.png)

- 用 iOS 设备的相机扫描二维码，打开并点击链接，把开发构建下载到设备上。

</details>

### 3. 运行

在项目目录中运行 `npx expo start` 命令，启动开发服务器：

:::tabs
:::tab npm
```sh
npx expo start
```
:::
:::tab yarn
```sh
yarn expo start
```
:::
:::tab pnpm
```sh
pnpm expo start
```
:::
:::tab bun
```sh
bun expo start
```
:::
:::

- 在设备上点击应用图标，打开开发构建。

![iOS 设备上开发构建的启动器界面](/static/images/tutorial/eas/ios-dev-build-01.jpg)

- 使用账户同步功能，确保我们同时登录了 EAS CLI 和开发构建。由于我们已经登录了 EAS CLI，下一步是通过开发构建的界面登录。

![在 iOS 设备上登录 Expo 账户的模态框](/static/images/tutorial/eas/ios-dev-build-02.jpg)

- 点击 **Fetch development servers**，并在 Development servers 下列表中选择正在运行的服务器。

![获取要连接的开发服务器](/static/images/tutorial/eas/ios-dev-build-03.jpg)

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
