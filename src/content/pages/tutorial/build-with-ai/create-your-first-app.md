---
title: 创建你的第一个应用
description: 在本章中，指挥 AI 智能体创建一个新的 Expo 应用，并在手机上看到它运行。
---

# 创建你的第一个应用

在本章中，智能体会创建一个新的 Expo 应用，你让它在手机上跑起来，并做出第一次修改。这就是本教程其余部分要反复使用的循环。

## 1. 在新文件夹中启动智能体

智能体一次只在一个文件夹里工作，所以为这个项目单独建一个文件夹，并在那里启动智能体。在终端中运行：

```sh
mkdir StickerSmash && cd StickerSmash
```

然后在该文件夹中启动智能体：运行 `claude` 或 `codex`。如果使用 Cursor，创建一个名为 **StickerSmash** 的新文件夹，用 **File** > **Open Folder** 打开它，再打开智能体面板。

## 2. 创建应用

把下面的提示词粘贴给你的智能体：

```text 提示词
Create a new Expo app in this folder (the current directory) by running npx create-expo-app@latest and choosing the SDK 57 template — I will test the app with Expo Go on my phone, which uses SDK 57. After it is created, run the project's reset-project script so we start from a minimal app, and delete the example folder that the script leaves behind. Don't start the development server; I will run that myself.
```

智能体需要几分钟下载模板并安装依赖。完成后，它应报告项目已就绪，**src/app** 文件夹里只有少量文件，是一个最小应用。

## 3. 在手机上运行应用

这是整个教程中你自己要运行的那一条命令。它会启动开发服务器，把应用推送到你的手机。打开一个**新的终端窗口**（让智能体继续在第一个窗口里运行），然后运行：

```sh
cd StickerSmash && npx expo start
```

终端中会出现一个二维码。打开应用的方式：

- **Android**：打开 Expo Go，点击 **Scan QR code**。
- **iOS**：打开系统相机，对准二维码。

:::note
在 iOS 真机上，只有当 Expo CLI 与 Expo Go 登录同一 Expo 账户时，项目才会打开。这两步你在上一章都做过。如果看到账户错误，请参见 [Expo Go 登录要求](/troubleshooting/expo-go-sign-in-required)。
:::

你应该在手机上看到一个几乎空白的屏幕。那就是你的应用。本教程其余部分请保持这个终端窗口打开，并把手机放在手边。

<details>
<summary>手机连不上？</summary>

手机和电脑必须在同一个 Wi-Fi 网络中。如果已经在同一网络但应用仍无法加载，用 <kbd>Ctrl</kbd> + <kbd>C</kbd> 停止服务器，再以隧道模式重启。隧道模式可以跨网络工作：

```sh
npx expo start --tunnel
```

当手机和终端登录的是同一个 Expo 账户时，也可以在 Expo Go 的 **Projects** 标签下找到你的项目。

</details>

## 4. 做出第一次修改

现在把循环走完：让智能体做一个看得见的修改，并在手机上看到它生效。把下面的提示词粘贴给你的智能体：

```text 提示词
Change the home screen so it shows the text "Home screen" in white, centered on a dark background with the color #25292e.
```

**你应该看到**：智能体完成后的几秒内，手机上的应用会重新加载成深色屏幕，中间是白色的 “Home screen” 文字：

![更新了文字和背景色的应用](/static/images/tutorial/02-index-screen-changes.webp)

这就是完整的工作流：你给出提示，智能体构建，手机显示结果。

## 当结果不符合预期时

迟早会有一次结果与你的要求不符。这很正常，修复它也是工作流的一部分：

- **描述现象，不要诊断原因。** 把你看到的和你期望的原样告诉智能体：“文字居中了，但背景仍然是白色。” 你不需要猜为什么。
- **原样粘贴错误信息。** 如果手机上出现红色错误屏，或终端打印了错误，把整段信息复制给智能体。错误信息是写给程序员的，而你的智能体就是程序员。
- **让智能体检查自己的工作。** 像这样的提示很有用：“有地方坏了 —— 复查你刚刚做的修改，找出问题并修复。”
- **如果应用卡住了**，摇一摇手机，在出现的菜单里点击 **Reload**。如果还不行，用 <kbd>Ctrl</kbd> + <kbd>C</kbd> 停止开发服务器，再运行 `npx expo start`。

后面几章的末尾会有一段简短提示，链回本节。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
