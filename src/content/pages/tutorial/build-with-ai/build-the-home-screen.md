---
title: 构建主屏幕
description: 在本章中，指挥 AI 智能体添加标签导航、照片查看器和图片选择器。
---

# 构建主屏幕

在本章中，应用开始有 StickerSmash 的样子：两个导航标签、一个照片查看器，以及一个打开手机相册的按钮。

## 1. 添加导航标签

大多数应用不止一个屏幕，底部有标签用来切换。把下面的提示词粘贴给你的智能体：

```text 提示词
Add a tab bar to the app with two tabs: a Home tab showing the current home screen, and an About tab with a screen that says "About screen" for now. Use Expo Router for navigation. Style everything with a dark theme: the color #25292e for the screen backgrounds, headers, and tab bar, white text, and yellow (#ffd33d) as the color of the selected tab. Give each tab a fitting icon from the @expo/vector-icons library, such as a house for Home and an info circle for About.
```

**你应该看到**：应用底部有一个标签栏，包含 Home 和 About。当前所在的标签以黄色高亮，点击另一个标签会切换屏幕：

![双标签布局的应用](/static/images/tutorial/04-tab-navigator-complete.webp)

## 2. 添加照片查看器

接下来给主屏幕加上主要内容：一张大照片和两个按钮。我们准备了一个资源包，里面有占位照片，以及后面会用到的表情贴纸。把下面的提示词粘贴给你的智能体：

```text 提示词
Download the image assets for this app from https://docs.expo.dev/static/images/tutorial/sticker-smash-assets.zip and extract them into the assets/images folder, replacing any files with the same names. Then build out the Home screen: show the background-image.png photo large in the center of the screen with rounded corners, and below it two buttons stacked vertically: "Choose a photo" — a prominent button with a yellow border, a white background, a dark label, and a small picture icon — and a plain "Use this photo" button with white text. Use the expo-image library to display the image.
```

<details>
<summary>想自己下载资源？</summary>

如果智能体无法下载或解压文件，可以手动完成：下载 [sticker-smash-assets.zip](/static/images/tutorial/sticker-smash-assets.zip)，解压后把图片复制到 **StickerSmash** 文件夹内的 **assets/images** 目录，覆盖同名文件。然后用上面的提示词让智能体构建界面，但去掉第一句。

</details>

**你应该看到**：一张海上木栈道的照片占据屏幕大部分，下方是两个按钮：

![带照片查看器和两个按钮的主屏幕](/static/images/tutorial/initial-layout.webp)

## 3. 从相册选择照片

现在来做第一个真正的功能：选择你自己的照片。把下面的提示词粘贴给你的智能体：

```text 提示词
Add the expo-image-picker library. When I tap "Choose a photo", open my phone's photo library so I can pick an image, and show the one I pick in place of the placeholder photo. If I cancel without picking anything, keep showing the current photo.
```

**你应该看到**：点击 **Choose a photo** 会打开手机相册。第一次时，手机会请求访问照片的权限。点击 **Allow**。你选中的照片会替换占位照片。

> 如果结果与你的预期不符，把你看到的现象告诉智能体。[当结果不符合预期时](/tutorial/build-with-ai/create-your-first-app#当结果不符合预期时)一节给出了应对方法。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
