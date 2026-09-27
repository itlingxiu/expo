---
title: AI 智能体与 Expo 概述
description: 使用 Claude Code、Codex、Cursor 等 AI 编程智能体构建并发布 Expo 与 React Native 应用。
---

# AI 智能体与 Expo 概述

Claude Code、Codex、Cursor 以及其他 AI 编程智能体可以帮助你构建、升级、调试并部署 Expo 与 React Native 项目。使用 [`create-expo-app`](/more/create-expo) 创建新项目时，该项目已经带有 AI 智能体所需的配置文件。这些配置也会提交进项目，因此团队中的每个人都从相同的 SDK 版本和项目说明开始，他们的智能体也会读取相同的项目上下文。

## 快速开始

Claude Code 与 Codex 有官方 Expo 插件。一条命令即可安装 [Expo Skills](/skills)，并注册 [Expo Model Context Protocol (MCP) Server](/mcp)。

:::tabs
:::tab Claude Code
```sh
claude plugin install expo@claude-plugins-official
```

然后在 Claude Code 会话中运行 `/mcp`，登录你的 Expo 账户。
:::
:::tab Codex
```sh
codex plugin add expo@openai-curated
```

然后登录你的 Expo 账户：

```sh
codex mcp login expo
```
:::
:::

Cursor 和其他智能体没有官方 Expo 插件。要配置它们，请分别安装 [Expo Skills](/skills) 和 [Expo MCP Server](/mcp)。

## Expo 如何支持 AI 智能体

三个部分协同工作，为 AI 智能体提供一致的、针对 Expo 的上下文：

- **Expo Skills：** `expo` 插件为智能体添加 Expo 专用说明和斜杠命令。智能体会套用已知可靠的 Expo 模式（SDK 升级、EAS Workflows、使用 Jetpack Compose 与 SwiftUI 的原生 UI、API 路由），而不是根据训练数据猜测。Skills 每台机器安装一次。
- **Expo MCP Server：** 远程 Model Context Protocol (MCP) 服务器，让智能体实时访问最新的 Expo 文档、EAS Build 历史、EAS Update 渠道和 TestFlight 元数据。智能体可以通过它安装与 SDK 匹配的包、读取构建日志，并截取模拟器截图。对于 Claude Code 和 Codex，`expo` 插件会注册该服务器，因此不必单独添加。
- **项目上下文文件：** `create-expo-app` 会在项目根目录写入 **AGENTS.md**，把智能体指向项目所针对的 Expo SDK 版本文档。安装了 Claude Code 时，它还会写入 **.claude/settings.json** 以启用 Expo 插件。

## 设置 Expo Skills 与 Expo MCP Server

Expo Skills 和 Expo MCP Server 适用于每一个受支持的智能体。如果你已经安装了上面的 `expo` 插件，两者都已配置完成。下面的指南涵盖每一种安装方式，包括没有插件的智能体：

- **[Expo Skills](/skills)**：安装教给智能体已知可靠 Expo 模式的插件，并浏览全部可用技能。
- **[Expo MCP Server](/mcp)**：连接远程 Expo MCP Server，让智能体实时访问 Expo 文档和 EAS。

## 选择智能体

每份按智能体划分的指南都涵盖该智能体的安装、设置和示例提示词：

- **[Claude Code](/agents/claude)**：使用 Expo 设置 Anthropic 的终端智能体，包括项目上下文和示例提示词。
- **[Codex](/agents/codex)**：使用 Expo 设置 OpenAI 的终端智能体，包括项目上下文和示例提示词。
- **[Cursor](/agents/cursor)**：使用 Expo 设置这款 AI 优先的代码编辑器，包括项目上下文和示例提示词。

## 面向智能体的项目上下文文件

`create-expo-app` CLI 会把 **AGENTS.md** 添加到新项目的根目录。安装了 Claude Code 时，它还会添加 **.claude/settings.json**：

| 文件 | 读取方 | 用途 |
| --- | --- | --- |
| **AGENTS.md** | Claude Code、Codex 和 Cursor。 | 把智能体指向与项目 SDK 匹配的 Expo 文档。这是项目级说明的事实来源。 |
| **.claude/settings.json** | Claude Code 在启动时读取。 | 预先启用 Claude Code 插件市场中的官方 Expo 插件。 |

把共享的项目说明添加到 **AGENTS.md**，这样 Claude Code、Codex 和 Cursor 会读取相同的上下文。

## 为现有项目设置

`create-expo-app` 只在创建新项目时写入项目上下文文件。对于现有项目，请在项目根目录自行添加相同的文件。

1. **下载 AGENTS.md**

   把 `create-expo-app` 附带的规范 **AGENTS.md** 下载到 Expo 项目根目录：

   ```sh
   curl -o AGENTS.md https://raw.githubusercontent.com/expo/expo/main/packages/create-expo/template/agent-files/AGENTS.md
   ```

   如果项目已经有 **AGENTS.md**，把下载的内容追加进去，不要替换该文件。

2. **为 Claude Code 启用 Expo 插件**

   创建 **.claude/settings.json**，以启用 Claude Code 插件市场中的官方 Expo 插件：

   ```json .claude/settings.json
   {
     "enabledPlugins": {
       "expo@claude-plugins-official": true
     }
   }
   ```

   该文件会为打开此项目的每个人启用插件。每位开发者仍需在自己的机器上用 `claude plugin install expo@claude-plugins-official` 安装一次。

提交这两个文件，这样团队中的每一次智能体会话都从相同的项目上下文开始。Codex 和 Cursor 只需要 **AGENTS.md**，因此第 2 步仅适用于 Claude Code。

## 验证设置

要确认智能体能够读取你的项目，在 Expo 项目中打开 AI 智能体会话并运行以下提示词：

```text 示例提示词
打开 package.json，告诉我这个项目针对的是哪个 Expo SDK 版本。
```

如果智能体回复的是 **package.json** 中的 SDK 版本，说明它正在正确读取你的项目。

## 智能体工具包

[选择智能体](#选择智能体)中提到的智能体会读取你的代码和文档等内容。要让智能体在运行时也能对 Expo 项目执行操作，请把它与第三方工具包搭配使用。智能体工具包随后可以点按流程、读取日志、检查 React 组件树并分析性能。

- **[agent-device](/agents/agent-device)**：来自 Callstack 的开源、面向智能体的 CLI，用于在 iOS 模拟器、Android 模拟器和物理设备上检查、控制、调试、分析和测试应用。
- **[Argent](/agents/argent)**：来自 Software Mansion 的智能体工具包，通过 MCP 连接，在 Android 模拟器或 iOS 模拟器上控制、调试和分析你的应用。
