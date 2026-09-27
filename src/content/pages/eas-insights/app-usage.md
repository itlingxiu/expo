---
title: 应用使用情况
description: 在 EAS Insights 的“应用使用情况”标签页中，按平台、应用商店版本和时间查看应用的使用情况。
---

# 应用使用情况

:::warning
**应用使用情况**处于[预览](/more/release-statuses#预览)阶段，可能会有破坏性变更。预览期间可以免费使用。
:::

**应用使用情况**标签页提供项目性能、用量和覆盖范围的视图。它让你看到应用的状态，并提供按平台、应用商店版本和时间范围划分的使用信息。

![EAS Insights 中的应用使用情况标签页，展示按平台、应用商店版本和时间划分的应用使用情况。](/static/images/eas-insights/insights-app-usage-light.webp)

![EAS Insights 中的应用使用情况标签页，展示按平台、应用商店版本和时间划分的应用使用情况（深色）。](/static/images/eas-insights/insights-app-usage-dark.webp)

## 与 EAS Update 集成

如果你已经在使用 [EAS Update](/eas-update/introduction)，无需任何额外的客户端改动，就能获得某些高层使用洞察。其原理是把应用已经发出的更新检查请求汇总成按时间和平台划分的有限 Insights 使用视图。

## 使用 `expo-insights` 库

开发者可以把 `expo-insights` 库加入项目，获得比仅汇总更新请求更精确的使用指标，以及按应用商店版本的额外细分。目前该库仅发送与应用冷启动相关的客户端事件，但未来 `expo-insights` 会扩展新的事件类型和载荷，以支持更高级的功能。

### 安装

要使用 `expo-insights`，请先运行 `eas init`，确保应用在[应用配置](/workflow/configuration)中关联到你的 EAS 项目，然后安装该库。

:::tabs
:::tab npm
```sh
# 若尚未安装 EAS CLI
$ npm install --global eas-cli

# 若尚未为项目初始化 EAS
$ eas init

# 安装该库
$ npx expo install expo-insights
```
:::
:::tab yarn
```sh
# 若尚未安装 EAS CLI
$ yarn global add eas-cli

# 若尚未为项目初始化 EAS
$ eas init

# 安装该库
$ yarn expo install expo-insights
```
:::
:::tab pnpm
```sh
# 若尚未安装 EAS CLI
$ pnpm add --global eas-cli

# 若尚未为项目初始化 EAS
$ eas init

# 安装该库
$ pnpm expo install expo-insights
```
:::
:::tab bun
```sh
# 若尚未安装 EAS CLI
$ bun add --global eas-cli

# 若尚未为项目初始化 EAS
$ eas init

# 安装该库
$ bun expo install expo-insights
```
:::
:::

安装该库后，用 [EAS](/build/setup)或[本地](/guides/local-app-development)创建构建。应用启动时，该库会自动向 EAS Insights 发送事件。

### 查看洞察

要查看应用的使用数据，在 EAS 仪表盘中打开项目，从导航菜单选择 **Insights**，然后选择 **应用使用情况**标签页。
