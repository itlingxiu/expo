---
title: Claude Code 与 Expo
description: 使用 Claude Code 构建、升级、调试并部署 Expo 与 React Native 项目。
---

# Claude Code 与 Expo

Claude Code 是 Anthropic 基于终端的 AI 编程智能体。它可以理解整个代码库、提议修改、运行终端命令，并管理 git 操作。用 `create-expo-app` 创建的 Expo 项目包含用于项目上下文的 **AGENTS.md**。安装了 Claude Code 时，这些项目还会包含 **.claude/settings.json** 以启用 Expo 插件。它还可以查看 EAS 与 Expo CLI 日志、从 Expo Model Context Protocol (MCP) Server 获取文档、用 Expo Skills 遵循最佳实践、管理 EAS 部署工作流，以及完成更多工作。

## 快速开始

1. **安装 Claude Code**

   全局安装 Claude Code，然后从任意项目启动它。其他安装方式见 [Claude Code 文档](https://code.claude.com/docs)。

   ```sh
   curl -fsSL https://claude.ai/install.sh | bash
   ```

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

3. **安装 Expo 插件**

   安装官方 Expo 插件，让 Claude Code 了解 Expo 约定，并能操作你的 EAS 项目。一条命令即可安装 Expo Skills 并注册 Expo MCP Server：

   ```sh
   claude plugin install expo@claude-plugins-official
   ```

   然后在 Claude Code 会话中运行 `/mcp`，登录你的 Expo 账户。

   下面的指南介绍可用技能，以及 MCP Server 还能做的其他事情：

   - **[Expo Skills](/skills#安装-expo-skills)**：浏览插件提供的全部技能，并查看其他智能体的安装方式。
   - **[Expo MCP Server](/mcp#安装与设置)**：连接远程 Expo MCP Server，让智能体实时访问 Expo 文档和 EAS。

4. **打开项目并开始提问**

   从项目根目录运行 Claude Code，然后描述你想做的事。

   ```sh
   cd my-app

   claude
   ```

5. **验证设置**

   把下面的提示词粘贴到 Claude Code 会话中，确认它能读取你的项目：

   ```text 示例提示词
   打开 package.json，告诉我这个项目针对的是哪个 Expo SDK 版本。
   ```

   如果智能体回复的是 **package.json** 中的 SDK 版本，说明它正在正确读取你的项目。

## Claude Code 如何读取你的 Expo 项目

在项目中启动 Claude Code 时，它会读取两个脚手架文件：

- **AGENTS.md** 把 Claude Code 指向项目所用 Expo SDK 版本的文档。把项目级说明加到这个文件里，这样你的智能体会读取相同的上下文。
- **.claude/settings.json** 启用 Claude Code 插件市场中的官方 Expo 插件（[`expo@claude-plugins-official`](https://claude.com/plugins/expo)）。

这两个文件都会提交进项目，因此开发者的 Claude Code 会话从相同的上下文开始。

:::note
直接读取 **AGENTS.md** 需要 Claude Code v2.1.277 或更高版本。加载规则与可用性见 [Claude Code 文档](https://code.claude.com/docs/en/memory#agentsmd)。
:::

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

## 故障排除

<details>
<summary>插件 “expo” 已在项目设置中启用，但此处尚未安装。</summary>

如果在 Claude Code 会话中看到这条错误，就需要在你的开发机器上安装官方 [Expo 插件](https://claude.com/plugins/expo)。在终端中运行下面的命令，然后重新启动 Claude Code 会话：

```sh
claude plugin install expo@claude-plugins-official
```

上面的命令会全局安装 Expo 插件。如果只想为当前项目安装，给命令加上 `--scope project`：

```sh
claude plugin install expo@claude-plugins-official --scope project
```

</details>
