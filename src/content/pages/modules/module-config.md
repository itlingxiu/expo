---
title: expo-module.config.json
description: 了解 expo-module.config.json 中可用的不同配置选项。
---

# expo-module.config.json

Expo 模块在 **expo-module.config.json** 中配置。该文件目前可以配置自动链接和模块注册。可用属性如下：

- `platforms` — 支持平台的数组。可接受的值为 `android`、`apple`（或使用更细粒度的 `ios` / `macos` / `tvos`）、`web` 和 `devtools`（参见[创建开发工具插件](/debugging/create-devtools-plugins)）。
- `apple` — Apple 平台专用的配置选项
  - `modules` — 要写入生成的模块 provider 文件的 Swift 原生模块类名。
  - `appDelegateSubscribers` — 接入 `ExpoAppDelegate` 以接收 AppDelegate 生命周期事件的 Swift 类名。
- `android` — Android 平台专用的配置选项
  - `modules` — 要写入生成的 package provider 文件的 Kotlin 原生模块类的完整名称（包名 + 类名）。
