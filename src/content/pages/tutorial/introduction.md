---
title: 教程简介
description: 了解如何通过本教程构建一个运行在 Android、iOS 和 Web 上的通用应用。
---

# 教程简介

本教程将带你踏上一段构建通用应用的旅程：使用 Expo，从一个共享代码库创建同时运行在 Android、iOS 和 Web 上的应用。

:::note 刚接触编程？
你无需手写代码 —— 使用 AI 编程代理（AI coding agent）也能构建同样的应用。[使用 AI 构建教程](/tutorial/build-with-ai/introduction)覆盖了从零开始的完整设置。
:::

## 关于本教程

本教程的目标是帮助你上手 Expo，并熟悉 Expo SDK。你将学到：

- 使用默认模板（开启 TypeScript）构建一个应用
- 使用 Expo Router 实现双页面的底部标签布局
- 解构布局并用 flexbox 重新构建
- 使用各平台的系统 UI 从媒体库中选择图片
- 使用 React Native 的 `<Modal>` 和 `<FlatList>` 创建贴纸模态框
- 添加触摸手势与贴纸交互
- 通过第三方库截图并保存到磁盘
- 处理 Android、iOS 与 Web 之间的平台差异
- 最后配置状态栏、启动画面（Splash Screen）和应用图标

这些主题构成了 Expo 基础知识。教程为自学节奏，最长约两小时即可完成。为便于初学者循序渐进，教程分为九章，可以随时停下来稍后继续；每章都包含所需的代码片段，你可以从头构建，也可以直接复制粘贴。

完成后的应用名为 **StickerSmash**，运行在 Android、iOS 和 Web 上。

:::note
完整源代码见 [GitHub](https://github.com/expo/examples/tree/master/stickersmash)。
:::

## 如何使用本教程

遵循「做中学」（[learning by doing](https://en.wikipedia.org/wiki/Learning-by-doing)）的理念，本教程重实践轻讲解，你将亲手从零构建应用。

关键或改动的代码会以绿色高亮显示；在桌面端悬停（或在移动端点击）高亮部分，可以查看更多细节。例如：

```tsx Hello World
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Hello world!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## 下一步

准备好构建你的应用了吗？

[开始：创建你的第一个应用](/tutorial/create-your-first-app)
