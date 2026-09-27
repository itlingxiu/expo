---
title: 使用开发构建
description: 了解如何在项目中使用开发构建。
---

# 使用开发构建

从零开始的完整原生构建耗时较长，长到可能让你分心；但只要把开发构建安装到设备或模拟器上，在修改底层原生代码之前，你就不必再等待原生构建过程（见[重新构建开发构建](#重新构建开发构建)）。

## 启动开发服务器

运行以下命令启动开发服务器：

```sh
# npm
npx expo start

# yarn
yarn expo start

# pnpm
pnpm expo start

# bun
bun expo start
```

要在开发客户端中打开项目：

- 按 A 或 I 键，在 Android 模拟器或 iOS 模拟器上打开项目。
- 在真机上，用系统相机或二维码扫描工具扫描二维码。

## 启动器界面

从设备主屏幕启动开发构建会显示启动器界面。它包含 **Home** 标签页（显示本地网络上的开发服务器）与 **Updates** 标签页（显示已发布的 EAS 更新）。

如果本地网络上有 bundler，或者你在 Expo CLI 和开发构建中都登录了同一个 Expo 账户，可以直接从此界面连接；否则，通过扫描 Expo CLI 显示的二维码连接。

## 重新构建开发构建

添加包含原生代码 API 的库 —— 例如 [expo-secure-store](/versions/latest/sdk/securestore) —— 就必须重新构建开发客户端，因为把该库作为项目依赖安装时，它的原生代码不会自动包含进来。

## 调试开发构建

需要时，在 Expo CLI 中按 Cmd ⌘ + D 或 Ctrl + D，或摇一摇手机/平板打开菜单。在那里可以使用所有开发构建功能、调试功能，或切换到不同版本的应用。更多信息见[调试](/develop/debugging/runtime-issues)指南。
