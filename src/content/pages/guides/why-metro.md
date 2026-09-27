---
title: 为什么选择 Metro？
description: 了解为什么 Metro 是 React Native 通用打包的未来，以及它如何让开发者受益。
---

# 为什么选择 Metro？

[Metro](https://metrobundler.dev/) 是 Expo 与 React Native 的官方打包器。它是 Expo 框架中的核心构建工具。打包器包含成千上万条判断与取舍。本文概述 Expo 围绕 Metro 开发的关键原因，以及它如何让开发者受益。

## 官方 Meta 打包器

Metro 由 Meta 维护，Meta 也是 React、React Native、Yoga 和 Hermes 的维护者。它被用于开发应用商店中各类目下一些世界上最大的应用。

Meta 工程师积极开发 Metro，明确要求能够打包他们的全部应用（超过 40 万个源文件），同时保持快速与可靠。

通过提供一流的 Metro 支持，我们确保 Expo 开发者与 Meta 的工具保持延续，并能立即获得新兴特性。这包括：

- React Fast Refresh 于 2019 年[首先作为 Metro 特性引入](https://reactnative.dev/blog/2019/09/18/version-0.61)。次年 React Web 社区通过 Webpack 采用了它。
- 把 JavaScript 转换为 Hermes 字节码，以实现即时的原生启动。
- React Native DevTools，包括对[网络与 JS 调试](/debugging/tools#debugging-with-react-native-devtools)的一流支持，仅在 Metro 与 Hermes 下可用。
- React Compiler 最初以兼容 Metro 的 Babel 插件形式推出。

计划进入 Metro 的新特性与即将推出的特性包括：

- 用 Static Hermes 把 Flow 代码编译为原生机器码。更多内容见 Tzvetan Mikov 的 [Static Hermes](https://www.youtube.com/watch?v=GUM64b-gAGg) 演讲。
- 面向所有平台的通用 React Server Components，涵盖数据获取、流式传输、React Suspense、服务端渲染以及构建时静态渲染。更多内容见 React Conf 2024 上的[通用 React Server Components](https://www.youtube.com/watch?v=djhEgxQf3Kw)演讲。

Expo 团队与 Meta 合作，为 Expo Router 开发 Metro，加入了[基于文件的路由](/develop/app-navigation)、[Web 支持](/guides/customizing-metro#web-support)、[bundle 拆分](/guides/customizing-metro#bundle-splitting)、[tree shaking](/guides/tree-shaking)、[CSS](/versions/latest/config/metro#css)、[DOM 组件](/guides/dom-components)、服务端组件以及 [API 路由](/router/web/api-routes)等特性。

## 经过大规模实战检验

世界上几乎每个 React Native 应用都使用 Metro，这使它成为经过实战检验、面向大规模项目优化的方案。因此它适合从爱好者到大公司的各种规模的开发者。Metro 专门为处理大规模 Meta 应用而设计，因此具备增量打包和[共享远端缓存](https://metrobundler.dev/docs/caching)等特性。

## 按需处理

在开发期间，Metro 在被请求之前不会做任何特定平台的工作。这让开发者可以在大型项目上工作，而不必为所支持的平台数量付出性能代价。配合激进缓存与[异步路由](/router/web/async-routes)，开发者可以只增量打包正在积极开发的那部分应用。

## 多维度

传统打包器会创建多个实例来分别打包服务端与客户端代码，Metro 则在平台与环境（服务端、客户端、DOM 组件）之间最大化资源复用。这种架构适合多平台与服务端开发。

## 可复用的转换记忆化

Metro 是增量式的，可以创建能跨机器使用的缓存转换产物。这让大型团队可以复用远端构建器的工作，Meta 在所有大型项目中都使用这一技术。

## 为自定义运行时优化

其他打包器围绕浏览器的静态规范设计，Metro 则针对 React Native 的灵活性进行优化。这使得它可以生成 Hermes 字节码编译所需的特定语言特性集合，从而加快生产环境中的应用启动。这也会延伸到 Static Hermes，后者会把静态类型信息编译为原生应用的机器码。

## 跨技术支持

Expo 利用 Metro 的技术创造了 [DOM 组件](/guides/dom-components)这类新功能。这让原生应用中的 React 组件可以按需动态打包成一个完整网站，并使用与父应用相同的全部默认设置。

## 原生资源导出

传统打包器的最终结果是一个完整托管的应用，Metro 的配置选项则支持把 bundle 导出为独立应用二进制中嵌入的原生产物。这利用了操作系统特定的优化，例如 Apple 平台上的 `xcassets`。

## 并发处理

Metro 中的所有 AST 转换都在全部可用线程上并发执行，从而充分利用硬件。

## 与其他方案的比较

Metro 面向通用应用开发而设计，但它经常被拿来与仅面向 Web 的打包器比较。以下是一些关键差异：

### 浏览器 ESM 与打包

Vite 等打包器利用浏览器内置的 ESM 支持，但在中大规模下，成千上万个级联网络请求会导致实际开发时间变慢。Metro 在本地开发中执行打包，使开发结果更接近生产结果，也更适合 React Native 更大的模块数量。

### JavaScript 与原生语言

一些打包器选择用 Rust 编写核心以追求性能，但这带来一些取舍，例如贡献、补丁和开发会更困难。Metro 根据操作混合使用多种技术：

- 核心打包器与工具用 JS/Flow 编写。
- 文件监视默认使用 JS 爬虫，安装后也可以选用 Watchman（C++）。
- AST 用 Hermes 解析器（WebAssembly）解析为兼容 Babel 的格式。
- AST 转换由 Babel 完成。这最大化了开发者的自定义能力。
- 压缩在原生平台使用 Hermes，在 Web 上使用 Terser（可选 ESBuild 支持）。
- CSS 解析与压缩由 [LightningCSS](https://lightningcss.dev/)（Rust）完成。

这种方式与 Meta 和社区使用的工具一致，也让开发者更容易调试、分析和打补丁。
