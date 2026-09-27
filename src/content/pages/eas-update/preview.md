---
title: 预览更新
description: 了解如何在开发构建、预览构建和生产构建中预览更新。
---

# 预览更新

在把更新部署到生产环境之前，你通常希望在接近生产的环境中测试它。本指南概述预览更新的不同做法，并链接到每种做法的更详细指南。

## 在开发构建中预览更新

开发构建很适合预览来自 pull request 的更新、直接从 EAS 仪表盘预览，或使用 `expo-dev-client` 库提供的内置界面预览。

- [在开发构建中预览更新](/eas-update/expo-dev-client)：了解如何在开发构建中预览更新。
- [使用 GitHub Actions 自动发布更新](/eas-update/github-actions)：了解如何使用 GitHub Actions 通过 EAS Update 自动发布更新。
- [使用 Orbit 从 EAS 仪表盘启动预览更新](/review/with-orbit)：了解如何使用适用于 macOS、Windows 和 Linux 的桌面应用 Expo Orbit 启动更新。

## 在预览构建中预览更新

非技术用户通常不想使用开发构建，他们希望在[应用商店测试轨道](/review/overview#应用商店测试轨道)或[内部分发](/review/overview#使用-eas-build-进行内部分发)的预览构建上测试变更。

如果团队较小，一次只把一个预览构建部署到应用商店测试轨道或内部分发可能就够了。然后你可以把更新发布到该预览构建使用的 channel。[进一步了解预览构建](/review/overview)。

你也可以在预览构建中内置一种机制，让用户选择要加载的另一个更新或 channel。当[应用运行时](/eas-update/runtime-versions)不经常变化、同一个应用可以加载许多不同更新时，这会很有用。[进一步了解 channel surfing](/eas-update/channel-surfing)。

- [Channel surfing](/eas-update/channel-surfing)：了解如何在运行时切换更新 channel。

## 在生产构建中预览更新

在向所有终端用户部署更新之前，有些团队希望先在生产环境中向一小部分内部用户推出。一种做法是对已知的一部分用户使用 [channel surfing](/eas-update/channel-surfing)。只对能够报告并从预览更新问题中恢复的用户使用这种方式，因为损坏的更新可能让他们无法进入清除 channel 覆盖的界面。

另一种做法是使用类似[持久化预发布流程](/eas-update/deployment-patterns#持久化预发布流程)的部署模式，也就是始终保留一个指向预发布 channel 的生产应用版本。

- [持久化预发布流程](/eas-update/deployment-patterns#持久化预发布流程)：了解如何使用持久化预发布流程，始终保留一个指向预发布 channel 的生产应用版本。
