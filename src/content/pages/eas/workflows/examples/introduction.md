---
title: EAS Workflows 示例
description: 用于开发、审阅和发布应用的常见 React Native CI/CD 工作流。
---

# EAS Workflows 示例

以下工作流是如何使用 EAS Workflows 自动化开发、审阅和发布流程的示例。它们可以帮助你和你的团队开发、互相审阅 PR，并持续把更改发布给用户。

### 示例

- [创建开发构建](/eas/workflows/examples/create-development-builds)：了解如何为每个平台并行启动开发构建。
- [发布预览更新](/eas/workflows/examples/publish-preview-update)：了解如何为每个分支上的每次提交发布预览更新。
- [清理更新分支](/eas/workflows/examples/branch-cleanup)：了解如何在 GitHub 分支被删除时删除 EAS Update 分支。
- [部署到生产](/eas/workflows/examples/deploy-to-production)：了解如何在合并到 main 时构建并提交到应用商店，或发送 OTA 更新。
- [运行 E2E 测试](/eas/workflows/examples/e2e-tests)：了解如何运行 E2E 测试。
- [使用 PostHog](/guides/using-posthog/recipes)：了解如何用 PostHog 发送事件、推出功能标志，并根据指标控制发布。
