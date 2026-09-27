---
title: 创建你的第一个应用
description: 在本章中，学习如何创建一个新的 Expo 项目。
---

# 创建你的第一个应用

本章将学习如何创建一个新的 Expo 项目并让它跑起来。

[观看视频：创建你的第一个通用 Expo 应用](https://www.youtube.com/watch?v=m1-bc53EGh8) —— 从零构建一个项目，并让它运行在 Android、iOS 和 Web 上。

## 前提条件

- **真机上的 Expo Go**：在 Android 或 iOS 设备上安装 [Expo Go](https://expo.dev/go)。iOS 还需要一个免费的 [Expo 账户](https://expo.dev/signup)，并同时登录 Expo CLI 和 Expo Go。
- **Node.js (LTS)**：安装 [Node.js（LTS 版本）](https://nodejs.org/en)。
- **代码编辑器**：[VS Code](https://code.visualstudio.com/) 或其他编辑器/IDE。
- **带终端的开发机**：macOS、Linux 或 Windows（PowerShell 加 [WSL2](https://expo.fyi/wsl)）。

:::note
本教程假设你熟悉 TypeScript 与 React；如有需要，可参考 [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) 和 [React 官方教程](https://react.dev/learn)。
:::

## 初始化新的 Expo 应用

使用 [`create-expo-app`](/more/create-expo) —— 一个用于生成 React Native 项目的 CLI 工具。

:::tabs
:::tab npm
```sh
# 创建一个名为 StickerSmash 的项目
npx create-expo-app@latest StickerSmash

# CLI 会提示你选择模板，选择 SDK 57
Select an Expo SDK version > SDK 57

# 进入项目目录
cd StickerSmash
```
:::
:::tab yarn
```sh
# 创建一个名为 StickerSmash 的项目
yarn create expo-app StickerSmash

# CLI 会提示你选择模板，选择 SDK 57
Select an Expo SDK version > SDK 57

# 进入项目目录
cd StickerSmash
```
:::
:::tab pnpm
```sh
# 创建一个名为 StickerSmash 的项目
pnpm create expo-app StickerSmash

# CLI 会提示你选择模板，选择 SDK 57
Select an Expo SDK version > SDK 57

# 进入项目目录
cd StickerSmash
```
:::
:::tab bun
```sh
# 创建一个名为 StickerSmash 的项目
bun create expo StickerSmash

# CLI 会提示你选择模板，选择 SDK 57
Select an Expo SDK version > SDK 57

# 进入项目目录
cd StickerSmash
```
:::
:::

上述命令会使用[默认模板](/more/create-expo#--template)创建一个名为 StickerSmash 的目录，包含必要的样板代码、Expo Router 以及 Expo Go 测试支持；后续章节还会添加更多库。

### 使用默认模板的好处

- 生成一个包含 `expo` 包的 React Native 项目。
- 内置推荐的开发工具，如 Expo CLI。
- 通过 Expo Router 提供标签导航器，开箱即用的基本导航。
- 预配置支持 Android、iOS 和 Web。
- 默认开启 TypeScript。

## 下载资源

[下载资源压缩包](/static/images/tutorial/sticker-smash-assets.zip)，整个教程都会用到。

解压后，用其中的文件替换 **your-project-name/assets/images** 中的默认图片；然后在编辑器/IDE 中打开项目文件夹。

## 运行 reset-project 脚本

为了从零开始学习文件式导航，需要移除样板代码。

:::tabs
:::tab npm
```sh
npm run reset-project
```
:::
:::tab yarn
```sh
yarn run reset-project
```
:::
:::tab pnpm
```sh
pnpm run reset-project
```
:::
:::tab bun
```sh
bun run reset-project
```
:::
:::

运行后，**src/app** 中只保留 **index.tsx** 和 **_layout.tsx** 两个文件；原 **src** 下的内容（**components**、**constants**、**hooks**）会移动到 **example** 目录，之后按需新建目录和组件。

### reset-project 脚本做了什么？

它重组 **src/app**，把旧的样板代码从 **src** 移到名为 **example** 的子目录中 —— 该目录不属于主应用，可以放心删除。

## 在手机和 Web 上运行应用

启动开发服务器（Development Server）：

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

然后：

1. 服务器启动后，终端会显示一个二维码。
2. 扫描二维码打开应用：Android 使用 Expo Go 的「Scan QR code」；iOS 使用系统相机。
3. 在终端按 `W`，在默认浏览器中打开 Web 应用。

:::note
在 iOS 真机上，只有当 Expo CLI 与 Expo Go 登录同一 Expo 账户时项目才会打开 —— 运行 `npx expo login`，然后在 Expo Go 中用该账户登录。持续出现的错误请参考 [Expo Go 登录要求](/troubleshooting/expo-go-sign-in-required)。
:::

## 修改首页界面

**src/app/index.tsx** 存放屏幕上的文本，是应用的入口，使用了 `<View>` 和 `<Text>` 等 React Native 核心组件。样式是 JavaScript 对象而不是 CSS，属性名与 CSS 类似；大多数组件都接受 `style` prop —— 详见 [Styling in React Native](https://reactnative.dev/docs/style)。

修改 **src/app/index.tsx**：

1. 从 `react-native` 导入 `StyleSheet`，并创建 `styles` 对象。
2. 把 `styles.container.backgroundColor` 设置为 `#25292e`。
3. 把默认的 `<Text>` 内容替换为 "Home screen"。
4. 把 `styles.text.color` 设置为 `#fff`。

```tsx src/app/index.tsx
import { Text, View, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
```

:::note
React Native 支持网页风格的色值格式 —— 十六进制、`rgba`、`hsl`，以及 `red`、`green`、`blue`、`peru`、`papayawhip` 等命名颜色；详见 [Colors in React Native](https://reactnative.dev/docs/colors)。
:::

保存修改后，改动会推送到所有连接中的运行应用。

### 蓝色齿轮图标是什么？

它是 **Tools 按钮**（Tools button）—— Android/iOS 上的悬浮快捷入口，用于打开[开发者菜单](/debugging/tools#developer-menu)，执行重载、开关热重载（Fast Refresh）等调试操作；它只在开发中出现，绝不会出现在生产构建中。后文的截图会把它隐藏。隐藏方法：

1. 打开开发者菜单 —— 摇一摇设备，或在使用模拟器/USB 连接设备时在终端按 `M`。
2. 关闭 **Tools 按钮** 选项。

隐藏它并不影响开发者菜单本身，仍可按第 1 步的方式打开。

## 本章小结

第一章：创建你的第一个应用。

回顾：我们创建了一个新的 Expo 项目，使用了 React Native 核心组件，StickerSmash 应用已准备好继续开发。

下一章将添加堆栈导航器（stack navigator）和标签导航器（tab navigator）。

[下一章：第二章 添加导航](/tutorial/add-navigation)
