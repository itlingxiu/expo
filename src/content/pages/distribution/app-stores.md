---
title: 应用商店最佳实践
description: 了解向应用商店提交应用时的最佳实践。
---

# 应用商店最佳实践

本指南提供向应用商店提交应用的最佳实践。要了解如何生成用于提交的原生二进制文件，参见[创建你的第一次构建](/build/setup)。

:::warning
**免责声明：** 审核指南和规则会经常更新，各项规则的执行有时也不一致。无法保证你的具体项目会被任一平台接受，你最终要对应用的行为负责。即便如此，你仍可以根据审核反馈按需重新提交应用。
:::

- [为应用设置版本](/build-reference/app-versions)：了解如何为应用配置原生运行时版本。
- [App Store 展示信息](/eas/metadata)：从命令行管理 Apple App Store 元数据。
- [权限](/guides/permissions)：通过应用配置细化原生权限和系统对话框文案。
- [应用图标](/develop/user-interface/splash-screen-and-app-icon)：应用商店对主屏幕图标有严格规则。
- [启动画面](/develop/user-interface/splash-screen-and-app-icon)：使用启动画面 API 打造无缝的加载体验。
- [应用商店素材](/guides/store-assets)：了解如何为应用的商店页面制作截图和预览。
- [本地化应用](/guides/localization)：为不同语言和地区准备应用版本。
- [Apple：审核指南](https://developer.apple.com/distribute/app-review/)：Apple 关于准备应用以通过 App Store 审核的官方指南。

## 响应式设计

最好在小屏设备或模拟器（例如 iPhone SE）和大屏设备（例如 iPhone X）上测试应用。确认组件按你的预期渲染，没有按钮被挡住，所有文本框都可访问。

除手机外，也在平板上试用应用。即使配置了 `ios.supportsTablet: false`，应用在 iPad 上仍会以手机分辨率渲染，并且必须可用。

:::warning
即使应用不以 iPad 形态为目标，如果元素在 iPad 上渲染不正确，Apple 仍可能拒绝你的应用。请务必在 iPad（或 iPad 模拟器）上测试应用。
:::

## 隐私政策

自 2018 年 10 月 3 日起，所有新的 iOS 应用和应用更新都必须有隐私政策，才能通过 App Store 审核指南。

### 应用隐私问题

自 2020 年 12 月 8 日起，新的应用提交和更新都必须在 App Store Connect 中提供其隐私实践信息。更多信息参见 [App Store 上的应用隐私详情](https://developer.apple.com/app-store/app-privacy-details/)。

提交应用时，Apple 会问你一系列问题。答案会因你使用的库而不同。例如，如果使用 `expo-updates`，你需要回答 **Yes, we collect data from this app**，然后选择 **Crash Data**。
