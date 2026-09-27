---
title: Argent 与 Expo
description: 使用 Argent，让 AI 智能体在 Android 模拟器和 iOS 模拟器上控制、调试并分析你的 Expo 项目。
---

# Argent 与 Expo

[Argent](https://argent.swmansion.com) 是 Software Mansion 出品的智能体工具包。Claude Code 或 Codex 这类 AI 智能体负责读取代码和文档，Argent 则让同一个智能体直接操作正在运行的应用：它可以在 Android 模拟器或 iOS 模拟器上**控制、调试并分析**你的 Expo 应用。你只需设置一次，并通过 [Model Context Protocol (MCP)](/mcp) 把它连接到编辑器。

:::note
Argent 由 [Software Mansion](https://swmansion.com) 构建并维护，可免费使用。完整能力列表见 [Argent 网站](https://argent.swmansion.com)。
:::

**前置条件**

- **Node.js 18 或更高版本**：Argent 的 CLI 需要 Node.js 18 或更新版本。
- **正在运行的 Android 模拟器或 iOS 模拟器**：Android 请安装 [Android SDK Platform Tools（`adb`）](/workflow/android-studio-emulator#设置-android-studio)，确认 `adb` 在 `PATH` 中，并准备好一台模拟器。iOS 请使用已[安装 Xcode](/workflow/ios-simulator#设置-xcode-和-watchman) 的 macOS。

## 快速开始

1. **设置 Argent**

   在 Expo 项目根目录运行 init 命令。向导会检测你的编辑器、注册 Argent MCP 服务器，并把技能与智能体定义复制到工作区。

   :::tabs
   :::tab npm
   ```sh
   npx @swmansion/argent init
   ```
   :::
   :::tab yarn
   ```sh
   yarn dlx @swmansion/argent init
   ```
   :::
   :::tab pnpm
   ```sh
   pnpm dlx @swmansion/argent init
   ```
   :::
   :::tab bun
   ```sh
   bunx @swmansion/argent init
   ```
   :::
   :::

   编辑器会用 `argent` 命令启动 Argent MCP 服务器，因此请全局安装 Argent，并确认该命令在 `PATH` 中。然后重启编辑器，让它加载新配置。

   :::tabs
   :::tab npm
   ```sh
   npm install -g @swmansion/argent
   ```
   :::
   :::tab yarn
   ```sh
   yarn global add @swmansion/argent
   ```
   :::
   :::tab pnpm
   ```sh
   pnpm add -g @swmansion/argent
   ```
   :::
   :::tab bun
   ```sh
   bun add -g @swmansion/argent
   ```
   :::
   :::

2. **在模拟器上运行应用**

   Argent 作用于正在运行的应用，因此请在 Android 模拟器或 iOS 模拟器上启动 Expo 应用。使用[开发构建](/develop/development-builds/introduction)，或在开发服务器运行时用 Expo Go 测试。

   ```sh
   # 在模拟器上运行开发构建
   npx expo run:android
   npx expo run:ios

   # 或启动开发服务器，并在 Expo Go 中测试
   npx expo start
   ```

3. **向智能体提问**

   在编辑器中打开项目，然后打开智能体面板，描述你想对正在运行的应用做什么。例如，让它启动应用、点按一个按钮并读取日志。

4. **验证设置**

   在智能体面板中输入下面的提示词，确认 Argent 能够访问正在运行的应用：

   ```text 示例提示词
   为正在运行的应用截一张图，并描述屏幕上有什么。
   ```

   如果智能体返回截图并描述了应用当前屏幕，说明 Argent 已正确连接。

## Argent 让智能体能做什么

连接之后，智能体可以针对模拟器上的实时应用工作：

- **控制**：启动应用、点按、滑动、在输入框中打字、打开 deep link，并沿着无障碍树导航以运行多步骤流程。
- **调试**：读取控制台日志、浏览视图层级、检查 React 组件树，并在 JavaScript 层和原生层查看网络请求及其载荷。
- **分析**：同时录制 React 与原生性能数据，把缓慢的 React commit 追溯到背后的原生栈帧，并找出 UI 卡顿、渲染级联和内存泄漏。

## 示例提示词

设置完成后，用自然语言描述任务。例如：

| 任务 | 示例提示词 |
| --- | --- |
| 冒烟测试一条流程 | 启动应用，点按完成引导流程，并根据日志告诉我它在哪里出了问题。 |
| 验证 UI | 为主屏幕截一张图，并确认商品列表已渲染。 |
| 调试一次网络调用 | 打开购物车屏幕，向我展示失败的请求及其响应载荷。 |
| 检查 React 状态 | 打开设置屏幕，向我展示开关那一行的 React 组件树。 |
| 分析一次变慢 | 分析商品列表的滚动，并指出最慢的那次 commit。 |
| 测试一个 deep link | 通过 deep link 打开应用，并确认加载的是正确的屏幕。 |

## 把 Argent 与 Expo 的其余 AI 工具一起使用

Argent 通过 MCP 连接，因此可以与 Expo 自己的智能体工具一起使用。把它和 Expo Skills、Expo MCP Server 搭配，这样智能体在 Argent 驱动应用的同时，也了解 Expo 约定。

- **[Expo MCP Server](/mcp#安装与设置)**：连接远程 Expo MCP Server，让智能体实时访问 Expo 文档和 EAS。
- **[Expo Skills](/skills#安装-expo-skills)**：安装教给智能体已知可靠 Expo 模式的插件。

## 管理 Argent

```sh
# 更新到最新版本和配置
argent update

# 列出功能开关及其状态
argent flags

# 注销 MCP 服务器并移除 Argent
argent remove
```

## 限制与提示

- Argent 支持 Android 模拟器和 iOS 模拟器。
- 尽量让 Argent 自己在设备上启动或重新启动应用。如果你自行启动设备，Argent 可能看不到系统对话框或原生模态框。
- 在 Expo Go 中，Argent 可以控制应用、读取 React 组件树并运行 React 性能分析器。原生性能分析需要开发构建，因为在 Expo Go 中它分析的是 Expo Go 宿主应用，而不是你的代码。
- React 组件树和 React 性能分析器依赖 JavaScript 调试连接，因此请保持开发服务器运行。
- 完整且最新的能力列表见 [Argent 文档](https://argent.swmansion.com)。
