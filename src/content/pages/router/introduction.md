---
title: Expo Router 简介
description: Expo Router 是 Expo 官方推出的开源路由库，为通用 React Native 应用提供基于文件的路由方案。
---

# Expo Router 简介

Expo Router 是一个面向基于 Expo 构建的通用（Universal）React Native 应用的开源路由库。

它是 React Native 与 Web 的文件式路由（File-based Routing）方案，负责管理屏幕之间的导航，在 Android、iOS 和 Web 上使用相同的组件。它把 Web 开发中的文件系统路由概念带到通用应用中；在 **app** 目录中添加一个文件，就会自动成为导航中的一个路由。

## 快速开始

推荐使用 [`create-expo-app`](/more/create-expo) 搭建项目，Expo Router 已经预先安装并配置好。

```sh
# npm
npx create-expo-app@latest

# yarn
yarn create expo-app

# pnpm
pnpm create expo-app

# bun
bun create expo
```

然后启动项目：

```sh
# npm
npx expo start

# yarn
yarn expo start

# pnpm
pnpm expo start

# bun
bun expo start
```

- 在移动设备上建议先用 [Expo Go](/get-started/set-up-your-environment#how-would-you-like-to-develop) 上手，随着项目复杂度提升再改用[开发构建](/develop/development-builds/introduction)。
- 按 W 在 Web 浏览器中打开项目；按 A 在 Android 上打开（需要安装 Android Studio）；按 I 在 iOS 上打开（需要 macOS 与 Xcode）。

## 资源

- **Expo 教程**：手把手教你构建一个同时运行在 Android、iOS 和 Web 上的应用。[查看教程](/tutorial/introduction)
- **Expo Router API 参考**：组件、Hooks、方法与配置。[查看 API 参考](/versions/latest/sdk/router)
- **Expo Router 视频合集**：从核心概念到复杂导航的系列教程。[观看视频](https://www.youtube.com/playlist?list=PLsXDmrmFV_AT17JDf-otXSNE_eH7s0uDD)

### 面向 AI 代理的 Expo Skills

如果你在使用 AI 代理，建议安装 [Expo Skills](/skills)，让代理掌握文件式导航模式。

- **expo-router**：Expo Router 的导航与路由。[查看 skill](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-router/SKILL.md)

## 主要特性

- **原生（Native）**：基于 [React Native Screens](https://github.com/software-mansion/react-native-screens) 构建，导航默认就是真正的原生体验，并针对平台进行优化。
- **可分享（Shareable）**：每个屏幕都自动支持深度链接（Deep Linking），路由可以随时分享。
- **离线优先（Offline-first）**：应用会被缓存并以离线优先的方式运行，支持自动更新；无需网络连接或服务器即可处理传入的原生 URL。
- **优化（Optimized）**：路由在生产环境中采用延迟求值（Lazy Evaluation），在开发环境中采用延迟打包。参见[异步路由](/router/web/async-routes)。
- **迭代（Iteration）**：跨平台的通用 Fast Refresh，加上打包器的产物缓存（Memoization）。
- **通用（Universal）**：Android、iOS 和 Web 共享统一的导航结构，同时提供路由级的平台专属 API。
- **可发现（Discoverable）**：支持 Web 端构建时的[静态渲染](/router/web/static-rendering)与原生端的[通用链接](/linking/overview)，让内容可以被搜索引擎索引。

## 使用其他导航库

你也可以使用其他导航库（如 [React Navigation](https://reactnavigation.org/docs/getting-started#installation)），但新应用建议使用 Expo Router 以获得上述全部特性；其他方案在可分享链接或 Web 与原生统一导航方面往往需要额外的自定义工作。

Wix 的 [React Native Navigation](https://github.com/wix/react-native-navigation) 无法在 Expo Go 中使用，目前也不兼容 `expo-dev-client`；如需原生 Android 与 iOS 导航 API，建议改用 React Navigation 的 [`createNativeStackNavigator`](https://reactnavigation.org/docs/native-stack-navigator)。

## 常见问题

#### Expo Router 与 Expo、React Native CLI 的关系

React Native 在历史上并不「教」你如何组织应用，就像不使用现代 Web 框架而直接使用 React 一样。Expo Router 是「一个为 React Native 提供明确主张（Opinionated）的框架」，类似 Web 端 React 领域的 Remix 与 Next.js。

它的目标是让每个人都能用上这些架构模式，从而充分发挥 React Native 的能力；例如[异步路由](/router/web/async-routes)带来的延迟打包（Lazy Bundling），此前只有 Meta 在 Facebook 应用内部使用。

#### 能在现有的 React Native 应用中使用 Expo Router 吗？

可以——Expo Router 就是为通用 React Native 应用而生的框架。由于路由与打包器紧密相关，Expo Router 目前「只能在使用 Metro 的 Expo CLI 项目中使用」，但 Expo CLI 可以添加到任何 React Native 项目中。参见[在现有应用中使用 Expo CLI](/bare/using-expo-cli)。

#### 文件式路由有哪些好处？

- 文件系统人人都熟悉；更简单的心智模型让上手与扩展更容易。
- 通用链接（Universal Links）无论应用是否已安装，都能把用户带到正确的屏幕——以前只有大公司才做得到，现在开箱即用。
- 重构更容易：移动文件时无需更新 import 或路由组件。
- 路由自动获得静态类型，避免链接到不存在的路由；链接写错时会直接暴露类型错误。
- 异步路由（按需分包，Bundle Splitting）加快开发速度，并支持逐页渐进升级。
- 每个页面的深度链接始终可用，方便分享、Bug 报告、端到端（E2E）测试与自动化截图。
- 借助 Expo Head 的自动链接，仅通过配置即可实现深度原生集成（快速备忘录、Handoff、Siri 上下文、通用链接）。
- Web 端自动静态渲染带来 SEO 与可发现性——这正是文件式约定的功劳。
- Expo CLI 可以通过约定推断应用信息（例如按路由分包、生成站点地图），单一入口点的应用无法做到。
- 通知、主屏幕小组件等再互动（Re-engagement）功能更容易实现，可以在任何地方拦截启动与带查询参数的深度链接。
- 分析与错误上报可以自动附带路由名称，便于调试与行为分析。

#### 为什么选择 Expo Router 而不是 React Navigation？

Expo Router 从 **app** 目录的文件结构推导路由，内置类型化路由（Typed Routes）、自动深度链接与 Web 静态渲染；React Navigation 则需要手动定义导航器与路由。根据需求选择即可。

#### 如何对 Expo Router 网站做服务端渲染？

Expo Router 支持基础静态渲染（SSG）；「服务端渲染（SSR）目前需要自行搭建基础设施」。

## 下一步

- [手动安装](/router/installation)——将 Expo Router 添加到现有应用的详细步骤。
- [Router 101](/router/basics/core-concepts)——核心概念、路由记法、导航布局与常见导航模式。
- [示例应用](https://github.com/expo/expo/tree/main/templates/expo-template-tabs)——GitHub 上的源代码。
