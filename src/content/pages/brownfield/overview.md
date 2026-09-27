---
title: 把 Expo 工具集成到现有原生应用
description: 如何把 Expo 工具集成到现有原生应用（“棕地”应用）的概览。
---

# 把 Expo 工具集成到现有原生应用

用其他技术构建、主入口**不是** React Native 视图的现有原生应用，通常称为“棕地”（brownfield）应用。例如，如果你的应用用 UIKit 和 Swift 构建，而你想在单个屏幕上使用 React Native，那就属于“现有原生应用”和“棕地”。

相比之下，“绿地”（greenfield）应用从一开始就用 Expo 或 React Native 创建，或者以 React Native 为入口，其余所有 UI 都从它分出。

按照这些定义，如果你已有 Android 或 iOS 的“现有原生应用”，并想了解如何在项目中使用 Expo 和 React Native（也许只在单个屏幕甚至单个功能上），那么本指南就是为你准备的。

## 与现有原生应用的兼容性

:::note
把 Expo modules 集成到现有原生项目的支持处于 [Alpha](/more/release-statuses#alpha) 阶段。如果遇到问题，请[在 GitHub 上创建 issue](https://github.com/expo/expo/issues)。在现有原生应用的上下文中使用时，下面这些工具和服务的部分功能可能不可用。
:::

Expo 主要面向绿地应用构建，但我们正在加大对棕地场景的投入。并非所有 Expo 工具和服务都已经兼容现有原生项目。此外，棕地集成的完整文档可能尚未提供，你可能需要根据自己的上下文改写其他相关文档。

| 工具 / 服务 | 支持棕地？ |
| --- | --- |
| [Expo SDK](/versions/latest)：React Native 的扩展标准库 | 是 |
| [Expo Modules API](/modules/overview)：用符合语言习惯的 Swift/Kotlin API 构建原生扩展 | 是 |
| [Expo Router](/router/introduction)：基于文件的路由与导航 | 是 |
| [Expo CLI](/more/expo-cli)：从终端运行和开发应用的工具 | 是 |
| [Expo Dev Client](/versions/latest/sdk/dev-client)：为 Debug 构建添加应用内开发者工具 | 否 |
| [EAS Build](/build/introduction)：专为 Expo/React Native 打造的 CI/CD 服务 | 是 |
| [EAS Submit](/deploy/submit-to-app-stores)：把应用上传到商店的托管服务 | 是 |
| [EAS Update](/eas-update/introduction)：即时更新应用的 JavaScript 和资源 | 是 |

## 集成方式与隔离方式

把 React Native 集成到现有原生应用时，可以在两种主要方式中选择：集成和隔离。哪种更合适，取决于项目结构、团队工作流和长期目标。

### 集成方式

在集成方式中，React Native 代码位于现有原生项目内部。这让 React Native 代码与原生代码紧密耦合。

例如，你可以把现有的 Android 或 iOS 原生项目放到 React Native 项目的子目录中。对于从 React Native 起步、后来才添加原生代码的项目，这是常见设置，但现有原生应用也可以这样用。如果不能把原生项目放在标准的 `android` 和 `ios` 子目录中，可以用简单的 Monorepo 设置，为 React Native 代码配置自定义根目录。

**在以下情况选择这种方式：**

- 你需要频繁地同时迭代原生代码和 React Native 代码。
- 你有一个同时负责原生和 React Native 开发的团队。
- 你的项目结构允许直接加入一个 React Native 项目。

### 隔离方式

在隔离方式中，React Native 代码与原生项目分开开发和维护，可以放在单独的仓库或 Monorepo 中。

采用这种方式时，你把 React Native 应用打包为原生库（Android 使用 AAR，iOS 使用 XCFramework）。然后像任何其他原生依赖一样，把这个库集成到原生应用中。

这种分离简化了原生开发者的工作流，因为他们不需要设置 Node.js 环境，也不必处理 React Native 的构建依赖。他们只需把应用中的 React Native 部分当作预构建产物来使用。

**在以下情况选择这种方式：**

- 原生开发和 React Native 开发由不同团队负责。
- 你希望尽量减少加入 React Native 对现有原生构建流程的影响。
- 你更愿意把应用中的 React Native 部分当作自包含模块。

## 面向 AI 智能体的 Expo Skills

如果使用 AI 智能体，请安装 [Expo Skills](/skills)，让它同时了解两种棕地集成方式。相关技能为 `expo-brownfield`。

## 下一步

- **[隔离方式：把 Expo 打包为原生库](/brownfield/isolated-approach)**：把 React Native 代码构建为 AAR / XCFramework 产物，并集成到任意原生应用中。
- **[集成方式：把 Expo 直接加入原生项目](/brownfield/integrated-approach)**：配置现有原生项目，直接使用 React Native 和 Expo。
