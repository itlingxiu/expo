---
title: 面向 AI 智能体与 LLM 的文档
description: 让 AI 智能体和 LLM 以更低的 token 成本访问并使用 Expo 文档的高效方式。
---

# 面向 AI 智能体与 LLM 的文档

使用下面的端点和工具，让 AI 智能体和 LLM 访问 Expo 文档，其 token 成本低于抓取完整网页。

## 快速开始

选择与你的工具匹配的方式：

| 方式 | 最适合 | 做法 |
| --- | --- | --- |
| 按页 Markdown | 聊天界面（ChatGPT、Claude.ai）和编程智能体 | 在任意文档页 URL 后追加 `/index.md` 或 `.md`。 |
| 复制 Markdown 下拉菜单 | 针对单页的快速提示 | 在任意文档页顶部点击 **Copy page** > **Copy Markdown**。 |
| 文档索引 | 项目规则和编程智能体 | 把通用索引（`/llms.txt`）加入 AI 工具配置。 |

## 按页 Markdown

每个文档页都有一个轻量的 Markdown 版本，在页面 URL 后追加 `/index.md` 或 `.md` 即可访问。两个 URL 提供同一份文件。例如：

```text 开发构建简介
https://docs.expo.dev/develop/development-builds/introduction/index.md
https://docs.expo.dev/develop/development-builds/introduction.md
```

当你想给 AI 智能体提供某个主题或页面的上下文，又不想用该页完整 HTML 淹没它时，上面的方法很有用。

## 文档索引

Expo 支持 [llms.txt](https://llmstxt.org/) 计划，为大型语言模型（LLM）以及使用它们的应用提供文档。

[/llms.txt](/llms.txt) 文件（约 54 kB）列出每个文档页，并附上其 Markdown 版本的链接和简短描述。AI 智能体可以用它发现与任务相关的页面，然后只获取这些页面，而不是把完整文档载入上下文窗口。
