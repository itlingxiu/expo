---
title: 为 Android 创建并运行云构建
description: 学习如何使用 EAS Build 为 Android 设备和模拟器配置开发构建。
---

# 为 Android 创建并运行云构建

在本章中，我们将用 EAS Build 创建一个可以在 Android 上运行的开发构建。

在 Android 设备或模拟器上创建并运行构建的过程是相同的，区别只在于开发构建的安装方式。

[观看视频：如何为 Android 创建并运行云构建](https://www.youtube.com/watch?v=D612BUtvvl8) —— 学习如何用 EAS Build 创建 Android 开发构建，并把它安装到设备或模拟器上。

---

## 为 development profile 创建构建

对于 Android，开发构建必须是 **.apk**。Android 的默认格式是 **.aab**，它适合分发到 Google Play Store，但不能安装到设备或模拟器上。

要创建 **.apk**：

- 在 **eas.json** 中，确保 `build.development` profile 下的 `developmentClient` 设为 `true`。
- 然后以 `android` 为平台、`development` 为构建 profile 运行 `eas build` 命令：

```sh
eas build --platform android --profile development
```

:::tip
下次运行 `eas build` 命令时，也可以用 `-p` 指定平台。它是 `--platform` 的缩写。
:::

这条命令会向我们提出以下问题：

- **What would you like your Android application id to be?** 按 <kbd>Return</kbd> 选择该提示提供的默认值。这会在 **app.json** 中添加 [`android.package`](/versions/latest/config/app#package)。
- **Generate a new Android Keystore?** 按 <kbd>Y</kbd>。

回答之后，构建会进入队列，我们可以通过 EAS CLI 提供的链接在 EAS 仪表板上跟踪进度：

![EAS 仪表板中的 Android 开发构建详情与进度](/static/images/tutorial/eas/android-build-details.png)

<details>
<summary>构建详情页包含哪些信息？</summary>

构建详情页显示构建类型、profile、Expo SDK 版本、应用版本、版本号、最近一次提交哈希，以及发起构建的开发者或账户所有者的身份。

在上图中，**Build artifact** 的当前状态显示构建正在进行。完成后，这一节会提供下载构建的选项。**Logs** 列出了 EAS Build 上 Android 构建过程中的每一步。为求简洁，这里不逐一展开。要了解更多，参见 [Android 构建过程](/build-reference/android-builds)。

</details>

<details>
<summary>什么是 Android application ID？</summary>

它也称为我们 Android 应用的包名，以 DNS 反向记法（`com.owner.appname`）存储该值。这种记法的每一段都应以小写字母开头。

例如，我们的示例应用是 `com.owner.stickersmash`，其中 `com.owner` 是域名，`stickersmash` 是应用名称。

</details>

## Android 设备

### 1. 安装开发构建

构建完成后，**Build artifact** 一节会更新，表明构建已完成：

![构建产物提供为 Android 设备和模拟器下载开发构建的选项](/static/images/tutorial/eas/android-build-artifact.png)

这一节提供了在 Android 设备上运行开发构建的可用方法：Expo Orbit 和 Install 按钮。

[Expo Orbit](https://expo.dev/orbit) 可以在 Android 设备上无缝安装开发构建。使用这种方法：

- 用 USB 把 Android 设备连接到本机。
- 打开 Orbit 应用。
- 在 Orbit 应用中选择 **Device**。

![连接到 Android 设备时的 Expo Orbit 应用界面](/static/images/tutorial/eas/android-orbit.png)

- 在 EAS 仪表板的 **Build artifact** 下，点击 **Open with Orbit**。

构建安装后，Orbit 应用会在设备上启动开发构建。

<details>
<summary>替代方案：使用 Install 按钮和二维码</summary>

**Build artifact** 中的 **Install** 按钮会生成用于安装的二维码：

- 点击 **Install**，弹出窗口中会显示二维码。

![Install 按钮生成二维码，便于在 Android 设备和模拟器上安装](/static/images/tutorial/eas/android-qr-code.png)

- 用 Android 设备的相机扫描二维码，在默认浏览器中打开构建链接。
- 在网页上点击 **Install** 按钮，下载 **.apk** 文件。
- 下载完成后，打开 **.apk** 开始安装。
- 如果出现 **Unsafe app blocked message**，选择 **Install anyway**。可以安全地忽略这个警告，因为 **.apk** 的来源（由我们生成）是可信的。

![在 Android 设备上安装开发构建时出现的不安全应用提示对话框](/static/images/tutorial/eas/android-unsafe-dialog.webp)

</details>

### 2. 运行开发构建

在项目目录中运行 `npx expo start` 启动开发服务器。服务器运行后，在终端窗口中按 <kbd>A</kbd> 打开项目：

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

## Android 模拟器

### 1. 安装开发构建

在终端中，构建完成后，EAS CLI 会询问是否要在 Android 模拟器上运行该构建。按 <kbd>Y</kbd>。

![EAS CLI 自动提供在 Android 模拟器上运行构建的选项](/static/images/tutorial/eas/android-emulator-cli.png)

<details>
<summary>替代方案：使用 Expo Orbit</summary>

也可以用 [Expo Orbit](/build/orbit) 安装。在 EAS 仪表板的 **Build artifact** 中，点击 **Open with Expo Orbit**，把开发构建安装到 Android 模拟器。

</details>

### 2. 运行开发构建

在项目目录中运行 `npx expo start` 启动开发服务器。服务器运行后，在终端窗口中按 <kbd>A</kbd> 打开项目：

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

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
