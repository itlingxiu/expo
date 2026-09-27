---
title: React Native 功能标志服务
description: Expo 与 React Native 生态中可用的功能标志服务概览。
---

# React Native 功能标志服务

功能标志（也称为 _功能门_）是一种远程启用和禁用功能的机制。它们是向应用用户推出新功能的安全方式，无需额外部署代码。你可以将其用于生产环境测试、A/B 测试，或发布 UI 元素等新的应用功能。

## 功能标志服务

以下库支持功能标志，并可与使用[持续原生生成（CNG）](/workflow/continuous-native-generation)和[配置插件](/config-plugins/introduction)的 Expo 应用开箱即用，从而无缝集成到应用中。

### PostHog

[PostHog](https://posthog.com/) 是开源产品分析平台，在分析、会话录制和 A/B 测试之外，还提供全面的功能标志能力。它支持带用户分群的实时功能开关，并能即时回滚功能，适合希望在单一平台中同时获得分析与功能管理的团队。它内置 A/B 测试与多变量测试，让你通过功能标志直接运行实验，同时收集功能采用与性能指标的详细分析。该服务还支持引导标志，以消除加载状态并改善用户体验。

- [PostHog React Native 库](https://posthog.com/docs/libraries/react-native#feature-flags) —— 了解如何在 React Native 与 Expo 项目中集成 PostHog 功能标志。
- [PostHog 功能标志教程](https://posthog.com/tutorials/react-native-analytics) —— 按照这份分步指南，用 PostHog 实现功能标志。

### Statsig

[Statsig](https://statsig.com/) 是面向数据驱动产品开发的功能管理平台，提供高级统计分析、渐进发布，以及带内置指标与功能发布性能监控的精细定向能力。该平台为 React Native 和 Expo 提供 SDK，支持自动事件日志与动态配置，特别适合注重严谨实验和数据驱动决策的团队。

- [Statsig Expo 集成](https://docs.statsig.com/client/javascript-sdk/expo/#basics-check-gate) —— 了解如何在 Expo 项目中集成 Statsig 功能标志与实验。

### LaunchDarkly

[LaunchDarkly](https://launchdarkly.com/) 是企业级功能管理平台，支持即时功能开关与定向发布，并提供全面的仪表盘控制、高级用户定向，以及可实时更新标志的实验工具。SDK 包含多项高级能力，例如 React 集成钩子、上下文识别与修改、全面日志、开发工作流中的多环境支持、处理敏感数据的私有属性，以及用于增强安全性与性能的中继代理配置。

- [LaunchDarkly React Native SDK](https://launchdarkly.com/docs/sdk/client-side/react/react-native) —— 按照这份指南，在 React Native 与 Expo 项目中集成 LaunchDarkly 功能标志。

### Firebase Remote Config

[Firebase Remote Config](https://firebase.google.com/docs/remote-config) 是一项云服务，让你无需应用更新即可改变应用的外观与功能。Remote Config 的值通过 Firebase 控制台管理，并通过 JavaScript API 访问，从而完全控制这些值何时以及如何影响应用。该服务支持基于用户属性、应用版本、自定义属性的条件定向，以及实时更新。

- [React Native Firebase Remote Config](https://rnfirebase.io/remote-config/usage) —— 了解如何在 React Native 与 Expo 项目中集成 React Native Firebase 库的 Firebase Remote Config。
