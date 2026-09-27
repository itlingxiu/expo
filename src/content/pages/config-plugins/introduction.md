---
title: 配置插件简介
description: Expo 配置插件简介。
---

# 配置插件简介

## 什么是配置插件

在[持续原生生成（CNG）](/workflow/continuous-native-generation)下，对原生 **android** 与 **ios** 目录的改动无需直接编辑原生项目文件。配置插件让你在默认[应用配置](/workflow/configuration)属性之外配置原生项目。

配置插件是"一个顶层的自定义配置点，不是应用配置的内置项"。它可以修改 CNG 项目中 [prebuild](/workflow/continuous-native-generation#usage) 期间生成的原生项目。它在应用配置文件的 `plugins` 属性中引用，由一个或多个用 JavaScript 编写的插件函数组成，在 prebuild 期间运行。

## 术语表

一个典型的插件由一个或多个协作的插件函数组成，交互关系如下图：

```
withMyPlugin ("myPlugin") [Config Plugin]
→ withAndroidPlugin, withIosPlugin [Plugin Function]
→ withAndroidManifest, withInfoPlist [Mod Plugin Function]
→ mods.android.manifest, mods.ios.infoplist [Mod]
```

### 插件（Plugin）

应用配置 `plugins` 数组中引用的顶层配置插件 —— 入口点。惯例命名为 `with<插件名>`，例如 `withMyPlugin`。它由一个或多个[插件函数](/develop/config-plugins/introduction#plugin-function)组成。

### 插件函数（Plugin function）

配置插件内部的一个或多个函数，它们"包装执行平台专属修改的底层逻辑"。它们在技术上与顶层插件函数相同，本身也可以充当插件。把插件拆分成更小的函数通常便于测试与调试。

### Mod 插件函数（Mod plugin function）

`expo/config-plugins` 库中的包装函数，通过 `mods` 提供一种安全的方式来修改原生文件。开发者使用这些函数而不是底层 `mods`。

### Mod

底层的平台专属修改器（例如 `mods.android.manifest` 与 `mods.ios.infoplist`），在 prebuild 期间直接编辑原生项目文件。

## 为什么使用配置插件

插件可以添加默认没有的原生配置 —— 例如生成应用图标、设置应用名称，以及配置 **AndroidManifest.xml** 与 **Info.plist**。

在 CNG 项目中，建议避免手动编辑原生项目，因为重新生成时无法在不覆盖它们的情况下安全进行。配置插件以"可预测的方式"进行修改：把原生改动整合进配置文件，并在运行 `npx expo prebuild`（手动或在 CI/CD 中自动）时应用。例子：在应用配置中更改应用名称并运行 `npx expo prebuild`，原生项目中的名称会自动更新，无需手动编辑 **AndroidManifest.xml** 与 **Info.plist**。

## 配置插件的特征

- 插件是"**同步**函数，接受一个 [ExpoConfig](/workflow/configuration) 并返回修改后的 `ExpoConfig`"。如果原生通信的方法本身是异步的，插件偶尔可以是异步的，但那样性能不佳。
- 命名惯例：`with<插件功能>`，例如 `withFacebook`。
- 插件应是同步的，返回值可序列化，除非添加 [`mods`](/develop/config-plugins/introduction#mod)。
- 插件总是在应用配置求值阶段被求值。
- 可以选择性地传入第二个参数来配置插件。
- Mod 只在 `npx expo prebuild` 的**同步（syncing）**阶段求值，并在代码生成期间修改原生文件。因此插件中做出的任何应用配置更改都应放在 mod 之外，确保它们在非 prebuild 的配置场景下也能运行。

## 开始使用

- [创建配置插件](/develop/config-plugins/plugins) —— 创建与使用配置插件的全面指南。
- [Mods](/develop/config-plugins/mods) —— mod 如何工作、如何创建它们，以及最佳实践。
- [开发与调试的最佳实践](/develop/config-plugins/development-and-debugging) —— 开发与调试配置插件的最佳实践。
