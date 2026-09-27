---
title: 发布状态
description: 了解 Expo SDK、Expo Router、EAS 和 Expo CLI 中使用的 experimental、alpha、preview、beta、stable 与 deprecated 发布状态。
---

# 发布状态

Expo 使用多种发布状态来表明其工具和服务的稳定性与就绪程度。理解这些状态有助于你决定在项目中使用哪些功能和版本。

这些状态并不是每个功能都会依次经过的单一流水线。每个产品领域使用适合其发布方式的状态：

| 产品领域 | 你最常看到的状态 |
| --- | --- |
| Expo SDK 库和 Expo Router | [Alpha](#alpha)、[Beta](#beta) |
| EAS 服务 | [Preview](#preview)、[Beta](#beta) |
| Expo CLI 和其他开发工具 | [Experimental](#experimental) |

:::note
任何功能在生命周期结束时都可能变为[已弃用](#deprecated)，稳定库内部的个别 API 也可以是 [experimental](#experimental)。
:::

## Experimental

Experimental 功能是对新想法的早期探索。分享它们是为了验证方向，我们仍在决定该功能是否应该存在。

**可以预期：**

- 可能在任意版本中大幅变化，或被完全移除
- API 可能在没有通知或弃用警告的情况下变更
- 把 experimental 功能的实现当作概念验证，而不是最终形态
- 可能存在已知缺陷、缺失功能或性能问题，且不保证修复
- 不建议用于生产应用

Experimental 功能是尝试新想法并影响它们是否继续推进的最早机会。请在开发环境中测试它们，并[分享反馈](https://expo.dev/contact)，帮助我们决定下一步。

:::note
这里的 Experimental 状态与[应用配置](/workflow/configuration)中的 [`experiments`](/versions/latest/config/app#experiments) 字段不同。该字段启用的是选择加入的功能，它们在 Expo 项目的应用配置里不一定是 experimental。例如，`experiments.typedRoutes` 启用的是 [类型化路由](/router/reference/typed-routes)，这是一项 beta 功能。
:::

## Alpha

Alpha 功能可供早期测试，但可能有明显限制。这些功能处于开发的最早阶段，分享给社区是为了收集反馈并塑造方向。

**可以预期：**

- API 可能在没有新 SDK 版本的情况下发生破坏性变更
- 实现可能根据反馈大幅改变
- 不建议用于生产应用

Alpha 功能是影响 Expo 未来的机会。我们鼓励你在开发环境中测试这些功能，并[提供反馈](https://expo.dev/contact)，帮助我们在它们接触更广泛受众之前打磨它们。

## Preview

Preview 功能让你提前看到新功能中一个聚焦的切片。它们的设计开销很小、范围有限，但还不是功能完整。你最常在新的 EAS 服务上看到这个状态。

**可以预期：**

- 只是功能的一个聚焦切片，不是完整功能集
- 随着功能继续构建，API 可能发生破坏性变更
- 经过充分测试后可以用于生产

Preview 的目的是尽早分享新功能，并在进一步构建之前收集对某个特定切片的反馈。你的意见会直接帮助塑造该功能的方向。[分享反馈](https://expo.dev/contact)，帮助我们确定下一步优先构建什么。

## Beta

Beta 功能已经功能完整，正在稳定发布前做最后验证。你最常在 EAS 服务以及接近稳定的 SDK 库上看到这个状态。

**可以预期：**

- 核心功能已经完整
- 除非发现关键问题，否则不太可能发生破坏性变更
- 经过充分测试后可以用于生产

Beta 功能已经可以做真实世界的测试。虽然我们不预期会有重大变化，但如果你计划在生产中使用，建议充分测试。这个阶段的[反馈](https://expo.dev/contact)帮助我们在稳定发布前发现剩余问题。

## Stable

没有状态标记的功能是稳定的，已完全发布，可用于生产。

**可以预期：**

- 可用于生产，并有完整支持
- 按照语义化版本，稳定功能的破坏性变更只发生在新的主版本中

## Deprecated

已弃用的功能不再建议使用，并将在未来版本中移除。我们会提供弃用警告，让开发者有时间从这些功能迁移走。

**可以预期：**

- 文档和代码会显示弃用警告
- Expo 可能不接受针对已弃用 API 的反馈或 issue
- 已弃用的功能和 API 会在新的 SDK 版本中移除
