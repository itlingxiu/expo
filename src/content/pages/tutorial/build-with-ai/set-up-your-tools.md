---
title: 准备工具
description: 在本章中，安装 AI 编程智能体、Node.js 和 Expo Go，并让智能体了解 Expo。
---

# 准备工具

在本章中，你将从零安装所需的一切。这是最长的一章。工具准备好之后，有趣的部分就开始了，教程其余部分会快很多。

### 前提条件

- **一台电脑**：一台运行 macOS、Windows 或 Linux 的电脑。
- **一部手机**：一部 Android 或 iOS 手机，与电脑连接在同一个 Wi-Fi 网络。
- **一个 AI 智能体及其账户**：一个 AI 编程智能体，以及你所选服务的账户。
- **大约 20 分钟**：准备工作所需的全部时间。

## 1. 打开终端

终端是你与 AI 智能体对话的应用。

- 在 macOS 上，打开内置的 **Terminal** 应用。可以打开 Spotlight 搜索（<kbd>Cmd ⌘</kbd> + <kbd>Space</kbd>）并输入 “Terminal” 来找到它。
- 在 Windows 上，从开始菜单打开 **PowerShell**。本章中你会在里面输入少量命令。每条命令都提供给你复制粘贴。

![macOS 上一个空的终端窗口。](/static/images/tutorial/terminal.webp)

你的终端外观可能因操作系统和设置而不同，但用法相同。

> 如果打算使用 **Cursor**，本教程的大部分时间你会在它的可视化编辑器里工作，而不是终端。不过请备好一个终端，因为运行应用时仍然要用到它。

## 2. 安装 AI 智能体

如果你已经在用某个 AI 编程智能体，可以跳到下一步。否则从下面选一个。本教程对它们的用法相同。

:::tabs
:::tab Claude Code

在终端窗口中运行以下命令，安装 [Claude Code](https://claude.com/claude-code)：

```sh
curl -fsSL https://claude.ai/install.sh | bash
```

:::note
**在 Windows 上：** 如果用 PowerShell 安装 Claude Code，请运行 `irm https://claude.ai/install.ps1 | iex`。
:::

然后在终端中运行 `claude`，并按提示登录。遇到问题请参见 [Claude Code 安装指南](https://code.claude.com/docs/en/setup)。

:::
:::tab Codex

在终端窗口中运行以下命令，安装 [Codex](https://developers.openai.com/codex/cli)：

```sh
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

然后在终端中运行 `codex`，并按提示用 ChatGPT 账户登录。遇到问题请参见 [Codex CLI 文档](https://developers.openai.com/codex/cli)。

:::
:::tab Cursor

下载 [Cursor](https://cursor.com)，像安装其他应用一样安装它。Cursor 是一个带内置 AI 智能体的可视化代码编辑器，你会在智能体面板里输入提示词，而不是在终端里。

:::
:::

其他智能体也可以。只要它能在你的电脑上编辑文件并运行命令，就可以跟着做。

## 3. 安装 Node.js

来运行你的第一条提示词，并安装 Node.js。

Node.js 是驱动 Expo 开发工具的运行时。运行下面的提示词，让智能体从 [nodejs.org](https://nodejs.org/en) 下载 **长期支持（LTS）** 版本。

```text 提示词
I'm following the Expo "Build with AI" tutorial on a brand-new setup and I have no programming experience. Please install the latest LTS version of Node.js on my computer.

- First, tell me in one or two plain sentences what you're about to do.
- Detect my operating system and use the most reliable method for it.
- When you're done, verify it worked by showing me the output of `node --version` and `npm --version`, and tell me if I need to reopen anything for it to take effect.
```

要确认安装成功，打开一个新的终端窗口并运行以下命令。它应打印当前安装的 Node.js 版本号：

```sh
node --version
```

## 4. 安装 Expo Go 并创建 Expo 账户

Expo Go 是一个免费应用，让你在构建过程中在手机上测试项目，无需发布到应用商店。每次智能体修改代码，手机上的应用都会在几秒内更新。

1. 在手机上从 Google Play Store 或 Apple App Store 安装 [Expo Go](https://expo.dev/go)。
2. 在电脑上前往 [expo.dev/signup](https://expo.dev/signup) 创建一个免费账户。
3. 在手机上打开 Expo Go，用同一个账户登录。

在 iOS 真机上，只有当 Expo CLI 登录同一账户时，Expo Go 才会打开你的项目。现在登录 Expo CLI：

```sh
npx expo login
```

## 5. 让智能体了解 Expo

Expo Skills 是一组说明文件，教 AI 智能体如何把 Expo 应用构建好：该用哪些库、如何组织屏幕，以及如何避免常见错误。安装它们，是让智能体给出好结果的最重要一步。

:::tabs
:::tab Claude Code

启动 `claude`，然后在其中运行以下命令：

```sh
/plugin install expo@claude-plugins-official
```

:::
:::tab Codex

在终端中运行以下命令：

```sh
codex plugin add expo@openai-curated
```

:::
:::tab Cursor

在终端中运行以下命令：

```sh
npx skills add expo/skills
```

然后重新打开 Cursor，在 **Settings** > **Rules, Skills, Subagents** > **Skills** 下确认这些技能已出现。

:::
:::

[Expo Skills](/skills)

面向每种智能体的完整安装说明，以及所有可用技能的列表。

## 6. 连接 Expo MCP 服务器

Expo MCP 服务器让智能体直接使用 Expo 的工具：它可以阅读最新的 Expo 文档、安装正确的包，并检查你的项目。

:::tabs
:::tab Claude Code

在终端中运行以下命令：

```sh
claude mcp add --transport http expo https://mcp.expo.dev/mcp
```

然后启动 `claude`，在其中运行 `/mcp`，用你在上一步创建的 Expo 账户登录。

:::
:::tab Codex

在终端中运行以下命令，并在提示时用你在上一步创建的 Expo 账户登录：

```sh
codex mcp add expo --url https://mcp.expo.dev/mcp
```

:::
:::tab Cursor

点击下面的链接为 Cursor 安装 MCP 服务器，然后用你在上一步创建的 Expo 账户登录：

<a href="cursor://anysphere.cursor-deeplink/mcp/install?name=expo&config=eyJ1cmwiOiJodHRwczovL21jcC5leHBvLmRldi9tY3AifQ%3D%3D">
  <img src="https://cursor.com/deeplink/mcp-install-light.svg" alt="安装 MCP 服务器" />
  <img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="安装 MCP 服务器" />
</a>

:::
:::

<details>
<summary>可选：让智能体看到并点击你的应用</summary>

MCP 服务器还提供本地能力：经过额外设置后，多模态智能体可以截取模拟器中正在运行的应用、点击按钮，并自行验证结果。这需要电脑上有模拟器（iOS 仅限 macOS），因此超出了本教程的范围。在后面的章节中，**由你**在手机上验证应用。如果以后想探索，参见[设置本地能力](/mcp#set-up-local-capabilities-recommended)。

</details>

[Expo MCP 服务器](/mcp)

完整的安装说明、可用工具，以及数据隐私细节。

## 7. 测试你的环境

来确认一切都已连通。把下面的提示词粘贴给你的智能体：

```text 提示词
Use the Expo MCP server to search the Expo documentation for "expo-image-picker" and tell me in one sentence what it does.
```

**你应该看到**：智能体调用一个 Expo 文档工具，并用一句话回复从设备相册选择图片这件事。如果它报告的是连接或身份验证错误，请重复上一步中的登录部分。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
