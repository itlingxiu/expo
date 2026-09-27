---
title: 添加贴纸
description: 在本章中，引导你的 AI 智能体添加一个表情选择弹窗，并让贴纸响应拖拽和点按手势。
---

# 添加贴纸

在本章中，应用总算名副其实：你将从一个滑出的面板中挑选表情，把它贴到照片上，并用手指移动它。

1. **添加表情选择器**

   选中照片后，应用应从"选择照片"模式切换到"装饰照片"模式。将以下提示词粘贴给你的智能体：

   ```text 提示词
   When a photo has been chosen (either picked from the library or by tapping "Use this photo"), replace the two buttons with a row of options: a "Reset" option on the left that brings back the original buttons, and a circular "+" button in the middle. Tapping "+" should slide up a modal from the bottom titled "Choose a sticker" that shows the emoji images from the assets/images folder in a horizontally scrolling list. When I tap an emoji, close the modal and place that emoji on top of the photo as a sticker.
   ```

   **你应该看到**：选择照片后，按钮变为新的选项行。点击 **+** 会从底部滑出一个表情面板；你可以横向滚动列表。点击其中一个表情后面板关闭，表情出现在照片上：

   ![表情选择弹窗从屏幕底部滑出](/static/images/tutorial/emoji-picker.webp)

2. **移动和缩放贴纸**

   贴纸固定在一个位置就没什么意思了。将以下提示词粘贴给你的智能体：

   ```text 提示词
   Make the sticker interactive using the react-native-gesture-handler and react-native-reanimated libraries: I want to drag the sticker around with my finger to place it anywhere on the photo, and double-tap it to double its size (double-tapping again should shrink it back). The movement and resizing should animate smoothly.
   ```

   **你应该看到**：用手指在照片上拖动表情，双击它可以放大和缩小。

   这一步很好地提醒了你所扮演的角色：智能体可以阅读自己写的代码，但它无法感受手势。只有你能确认拖动的手感是否正确。如果贴纸出现卡顿、跳动或弹回原位，就把这些现象准确地描述给智能体。

> 如果结果与你的预期不符，把你看到的现象告诉智能体。[当结果不符合预期时](/tutorial/build-with-ai/create-your-first-app#当结果不符合预期时)一节给出了应对方法。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
