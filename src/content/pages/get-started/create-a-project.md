---
title: 创建项目
description: 了解如何创建一个新的 Expo 项目。
---

# 创建项目

Expo 是一个 React Native 框架，让你无需编写原生代码即可开发 Android、iOS 应用。它提供文件式路由、一套标准原生模块库以及更多功能。Expo 是开源项目，你可以在 [GitHub](https://github.com/expo/expo) 与 [Discord](https://chat.expo.dev) 上找到社区。此外，[Expo Application Services (EAS)](https://expo.dev/services) 提供了覆盖整个开发流程的补充云服务。

:::note 刚接触编程？
你无需手写代码也能构建第一个应用 —— 跟随[使用 AI 构建教程](/tutorial/build-with-ai/introduction)，通过 AI 代理来创建应用。
:::

## 系统要求

- [Node.js（LTS 版本）](https://nodejs.org/en/)
- 支持 macOS、Windows（PowerShell 与 [WSL 2](https://expo.fyi/wsl)）以及 Linux。

## 使用默认模板创建项目

推荐使用 [`create-expo-app`](/more/create-expo) 的默认模板，它包含帮助你上手的示例代码。

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

也可以使用 [`--template` 选项](/more/create-expo#--template)选择其他模板。

## 从示例开始

除了默认模板，还可以选择一个 [Expo 示例](https://github.com/expo/examples) —— 每个示例都是一个展示特定功能或集成的小应用，例如 Expo Router、Expo Widgets 或相机界面。

不带名称运行 `--example` 可以交互式浏览全部示例：

```sh
npx create-expo-app@latest --example
```

按名称创建已知示例：

```sh
npx create-expo-app@latest --example with-widgets
```

:::note
后续「入门」指南均以默认模板为准；示例应用的结构可能有所不同，但概念是相通的。
:::

## 设置 AI 代理（可选）

新项目包含 **AGENTS.md**（代理上下文文件），并且当安装了 Claude Code 时，还会附带启用 Expo 插件的 **.claude/settings.json**。Claude Code 和 Codex 都有官方 Expo 插件；一条命令即可安装 [Expo Skills](/skills) 并注册 [Expo MCP Server](/mcp)。

```sh
# Claude Code
claude plugin install expo@claude-plugins-official
```

```sh
# Codex
codex plugin add expo@openai-curated
```

对于 Cursor 等其他代理，需要分别安装 [Expo Skills](/skills) 和 [Expo MCP Server](/mcp)；请参阅 [AI 代理与 Expo](/agents) 概览了解每种代理的设置方式。

## 下一步

创建好项目后，接下来是[设置开发环境](/get-started/set-up-your-environment)，开始你的开发之旅。
