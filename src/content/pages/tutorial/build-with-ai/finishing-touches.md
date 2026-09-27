---
title: 收尾打磨
description: 在本章中，指挥 AI 智能体打磨状态栏、启动画面和应用图标，然后作为构建者迈出下一步。
---

# 收尾打磨

应用已经能用了。现在让它看起来像完成品。在本章中，你会打磨用户会注意到、却未必意识到的细节：状态栏、启动画面和应用图标。

## 1. 修正状态栏

看应用最顶部：时钟和电池图标是深色的，在深色背景上很难看清。把下面的提示词粘贴给你的智能体：

```text 提示词
The phone's status bar (the clock and battery icons at the top of the screen) is hard to read against our dark background. Use the expo-status-bar library to make the status bar text light on every screen.
```

**你应该看到**：屏幕顶部的时钟、电池和信号图标现在是浅色的，可以看清：

![深色应用背景上的浅色状态栏文字](/static/images/tutorial/statusbar-example.webp)

## 2. 设置应用图标和启动画面

你之前下载的资源包里包含应用图标和启动画面图片。把下面的提示词粘贴给你的智能体：

```text 提示词
Set the app's icon to assets/images/icon.png, and configure the splash screen using the expo-splash-screen config plugin so it shows assets/images/splash-icon.png centered on a #25292e background on Android, iOS, and web.
```

**你应该看到**：这些设置写在应用配置里，需要重启开发服务器才会生效。在终端按 <kbd>Ctrl</kbd> + <kbd>C</kbd>，再次运行 `npx expo start`，然后从 Expo Go 重新打开应用。项目加载时，你会短暂看到启动画面。

有一点需要注意：主屏幕上的应用图标不会改变，因为你是在 Expo Go 里运行项目，而 Expo Go 本身是另一个应用，有自己的图标。只有在为应用创建独立构建时，你的图标才会生效。准备好这一步时，参见[开发构建](/develop/development-builds/introduction)。

> 如果结果与你的预期不符，把你看到的现象告诉智能体。[当结果不符合预期时](/tutorial/build-with-ai/create-your-first-app#当结果不符合预期时)一节给出了应对方法。

## 你构建了一个应用

花一点时间看看这里发生了什么：你从零搭好了开发环境，然后指挥 AI 智能体构建了一个真正的应用。它有导航、选照片、用手势操作的贴纸，以及保存功能（面向 Android、iOS 和 Web），而你没有写代码。

更重要的是，你学会了这套循环：提示、构建、验证、再次提示。这套循环不会随本教程结束。现在就拿你自己的想法试一试：

```text 提示词
Let me place more than one sticker on the photo.
```

```text 提示词
Add a share button that opens the system share sheet so I can send my creation to friends.
```

```text 提示词
Fill in the About screen: explain what the app does and credit me as the builder.
```

## 下一步

[Expo Skills](/skills)

浏览智能体可以使用的完整技能列表，以及每项技能的示例提示词。

[Expo MCP 服务器](/mcp)

探索智能体借助 Expo 工具能做的一切，包括触发构建和阅读崩溃报告。

需要帮助，或想展示你构建的成果？加入 Expo 社区 [Discord](https://chat.expo.dev/)。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
