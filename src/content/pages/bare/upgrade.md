---
title: 原生项目升级助手
description: 查看把原生项目升级到下一个 Expo SDK 版本时，需要逐个文件做出的全部改动差异。
---

# 原生项目升级助手

如果你自行管理原生项目（**android** 和 **ios** 目录），要[升级到最新的 Expo SDK](/workflow/upgrading-expo-sdk-walkthrough)，就必须修改原生项目。找出哪个原生文件发生了变化、以及要在哪个文件里更新什么，可能是一个复杂的过程。

下面的指南提供差异对比，用来比较项目当前 SDK 版本与你想升级到的目标 SDK 版本之间的原生项目文件。你可以根据项目使用的 `expo` 包版本，用这些差异来修改项目。本页工具类似于 [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)，但面向使用 Expo modules 及相关工具的项目。

> 想完全避免升级原生代码？参见[持续原生生成（CNG）](/workflow/continuous-native-generation)，了解 Expo 预构建如何在构建前生成原生项目。

## 升级原生项目文件

在你[升级 Expo SDK 版本及相关依赖](/workflow/upgrading-expo-sdk-walkthrough#如何升级到最新-sdk-版本)之后，使用下面的差异工具了解需要对原生项目做哪些改动，使它们与当前 Expo SDK 版本保持一致。

选择**起始 SDK 版本**和**目标 SDK 版本**以查看生成的差异。然后通过复制粘贴或手动修改项目文件，把这些改动应用到原生项目。

> 本页包含一个交互式对比工具，可选择起始 SDK 版本与目标 SDK 版本，查看原生项目文件的逐文件差异。
