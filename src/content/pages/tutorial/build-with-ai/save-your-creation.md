---
title: 保存你的作品
description: 在本章中，指挥 AI 智能体把装饰后的照片保存到手机，并可选地让它在浏览器中也能工作。
---

# 保存你的作品

在本章中，你将添加最后一个核心功能：把照片连同贴纸一起保存到手机相册。

## 1. 保存到相册

把下面的提示词粘贴给你的智能体：

```text 提示词
Add a "Save" option to the row of options, with a download icon. When I tap it, capture just the photo with the sticker on it (not the whole screen) using the react-native-view-shot library, and save the result to my phone's photo library using the expo-media-library library. Ask for permission the first time if needed, and show an alert confirming that the image was saved.
```

**你应该看到**：第一次点击 **Save** 时，会请求保存到照片的权限。点击 **Allow** 后，应用会显示确认提示。打开手机相册：照片已经在那里，贴纸已经合成进去，可以分享到任何地方。

## 2. 让它在 Web 上也能工作（可选）

你的应用不只是手机应用。同一个项目也能在 Web 浏览器中运行。在运行开发服务器的终端窗口中按 <kbd>W</kbd>，应用会在浏览器中打开。除了 **Save** 之外，其他功能都能用：在手机上截取图片的那个库在 Web 上不可用。

<details>
<summary>想修复 Web 上的保存功能？</summary>

把下面的提示词粘贴给你的智能体：

```text 提示词
Make the Save option also work when the app runs in a web browser. The react-native-view-shot library doesn't support the web, so when the platform is web, use the dom-to-image library to capture the image and download it as a file instead.
```

**你应该看到**：在浏览器中选择一张照片、添加贴纸，然后点击 **Save**。图片会作为文件下载。这就是 Expo 应用处理平台差异的方式：一个应用，只在需要的地方做少量平台分支。

</details>

> 如果结果与你的预期不符，把你看到的现象告诉智能体。[当结果不符合预期时](/tutorial/build-with-ai/create-your-first-app#当结果不符合预期时)一节给出了应对方法。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
