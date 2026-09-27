---
title: EAS Build 的限制
description: 了解 EAS Build 目前的限制。
---

# EAS Build 的限制

EAS Build 的设计目标是适用于任意 React Native 项目。不过，最好先了解一些我们计划解决的限制，它们可能让你无法把该服务用于自己的应用，或者带来不便。

## 构建工作服务器上固定的内存与 CPU 限制

如果构建过程需要大量内存，可用资源可能不足以构建你的应用。这时可以考虑在 **eas.json** 中使用 [`large` 资源等级](/eas/json#resourceclass)。参见 [Android 专用资源等级](/build-reference/infrastructure#android-构建服务器配置)和 [iOS 专用资源等级](/build-reference/infrastructure#ios-构建服务器配置)。

更多信息参见[服务器基础设施参考](/build-reference/infrastructure)。其中包含 Android（Ubuntu）和 iOS（macOS）构建服务器当前规格的最新信息。

## 有限的依赖缓存

Android 构建任务从本地缓存安装 npm 和 Maven 依赖。iOS 构建任务从本地缓存安装 npm 依赖，并从缓存服务器安装 CocoaPods 产物。

**node_modules** 目录这类中间产物不会被缓存和恢复（例如不会根据 **package-lock.json** 或 **yarn.lock** 恢复），但如果你把它们提交到 Git 仓库，它们会被上传到构建服务器。

更多信息参见[依赖缓存](/build-reference/caching)。

## 最长构建时长

如果构建运行时间超过你的方案所允许的最长时长，构建会被取消。各方案包含的构建超时见 [EAS 定价](https://expo.dev/pricing#builds)，该限制可能会变化。

## 每个账户每个平台最多 50 个待处理构建

如果某个平台已有超过 50 个待处理构建，新构建会被拒绝，直到待处理构建数量降到该限制以下。

## 支持 workspaces 的包管理器可能需要特殊设置

:::note
除 Bun、npm、pnpm 和 Yarn 以外的包管理器，官方指导有限。
:::

EAS Build 支持由支持 workspaces 的包管理器管理的 Monorepo。不过，第三方 Monorepo 或 workspaces 工具可能无法按预期工作，或需要额外设置。设置和配置 Monorepo 与 workspaces 时，复杂度上升很常见。在搭建之前，请确认你的工具和库在 Monorepo 中能良好工作。参见[使用 Monorepo](/guides/monorepos)。

## 订阅变更通知

要在这些事项取得进展时收到通知，可以在 [expo.dev/services](https://expo.dev/services) 订阅 EAS 新闻通讯。
