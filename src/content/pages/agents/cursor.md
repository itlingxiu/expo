---
title: Cursor 与 Expo
description: 使用 Cursor 构建、升级、调试并部署 Expo 与 React Native 项目。
---

# Cursor 与 Expo

Cursor 是基于 VS Code 的 AI 优先代码编辑器。它可以跨多个文件编辑、运行终端命令，并通过其智能体自主工作。用 `create-expo-app` 创建的 Expo 项目会带有一个 **AGENTS.md** 文件，Cursor 会直接读取它。它还可以查看 EAS 与 Expo CLI 日志、从 Expo Model Context Protocol (MCP) Server 获取文档、用 Expo Skills 遵循最佳实践、管理 EAS 部署工作流，以及完成更多工作。

## 快速开始

1. **下载 Cursor**

   从 [Cursor 网站](https://cursor.com)下载并安装 Cursor。设置细节见 [Cursor 文档](https://cursor.com/docs)。

2. **创建新的 Expo 项目**

   用下面的命令创建项目，或确认现有项目已安装最新的 expo 包。

   :::tabs
   :::tab npm
   ```sh
   npx create-expo-app@latest
   ```
   :::
   :::tab yarn
   ```sh
   yarn create expo-app
   ```
   :::
   :::tab pnpm
   ```sh
   pnpm create expo-app
   ```
   :::
   :::tab bun
   ```sh
   bun create expo
   ```
   :::
   :::

3. **设置 Expo Skills 与 Expo MCP Server**

   安装 Expo Skills 并连接 Expo MCP Server，让 Cursor 了解 Expo 约定，并能操作你的 EAS 项目。

   - **[Expo Skills](/skills#安装-expo-skills)**：安装教给智能体已知可靠 Expo 模式的插件，并浏览全部可用技能。
   - **[Expo MCP Server](/mcp#安装与设置)**：连接远程 Expo MCP Server，让智能体实时访问 Expo 文档和 EAS。

4. **打开项目并开始提问**

   在 Cursor 中打开项目，然后打开 Agent 面板，描述你想做的事。

5. **验证设置**

   在 Cursor 的 Agent 面板中输入下面的提示词，确认它能读取你的项目：

   ```text 示例提示词
   打开 package.json，告诉我这个项目针对的是哪个 Expo SDK 版本。
   ```

   如果智能体回复的是 **package.json** 中的 SDK 版本，说明它正在正确读取你的项目。

## Cursor 如何读取你的 Expo 项目

在 Cursor 中打开项目时，它会读取项目根目录下脚手架生成的 **AGENTS.md**，以及子目录中的嵌套 **AGENTS.md**。**AGENTS.md** 把 Cursor 指向项目所用 Expo SDK 版本的文档，并存放你添加的任何项目级说明。**AGENTS.md** 会提交进项目，因此开发者在 Cursor 中的会话从相同的上下文开始。

你也可以在 **.cursor/rules/** 下添加 Cursor 专用规则。

## 示例提示词

设置完成后，用自然语言描述 Expo 任务。例如：

| 任务 | 示例提示词 |
| --- | --- |
| 升级 SDK | 把这个项目升级到最新的 Expo SDK，并修复所有破坏性变更。 |
| 添加导航 | 用 Expo Router 添加一个标签导航器，以及一个新的设置屏幕。 |
| 自动化构建 | 创建一个 EAS Workflow，在每个拉取请求上构建应用。 |
| 调试构建 | 我最新的 iOS 构建失败了。读取 EAS Build 日志，告诉我出了什么问题。 |
| 添加通知 | 配置 expo-notifications，并在应用启动时显示一条本地通知。 |
| 设置 CI/CD | 创建一个在每个 PR 上构建的 CI/CD 工作流。 |
| 添加原生 UI | 给我的 Expo 应用添加一个 SwiftUI 选择器组件。 |
| 查看反馈 | 显示我的应用的 TestFlight 反馈。 |
| 验证 UI | 截一张图，并验证那个蓝色圆形视图。 |

更多示例见 [Expo Skills](/skills#示例提示词) 和 [Expo MCP Server](/mcp#expo-mcp-server-能做什么) 的示例提示词一节。
