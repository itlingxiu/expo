---
title: 使用应用内购买
description: 了解如何在 Expo 应用中使用应用内购买。
---

# 使用应用内购买

应用内购买（IAP）是移动或桌面应用内的交易，用户可以购买数字商品或额外功能。本指南列出了在 Expo 应用中实现 IAP 的常用库与教程。

> 应用内购买库需要配置自定义原生代码。使用 Expo Go 时无法配置原生代码。请改为创建[开发构建](/develop/development-builds/introduction)，以便在项目中使用原生库。

## 教程

- [观看：如何在 Expo 中实现应用内购买](https://www.youtube.com/watch?v=R3fLKC-2Qh0) —— 使用 RevenueCat 在 Expo 应用中设置应用内购买与订阅。

- [Expo 应用内购买教程](https://www.revenuecat.com/blog/engineering/expo-in-app-purchase-tutorial/) —— 使用 `react-native-purchases` 库与 RevenueCat 进行应用内购买和订阅的入门指南。

## 库

以下库支持应用内购买，并可与使用 [CNG](/workflow/continuous-native-generation) 和[配置插件](/config-plugins/introduction)的 Expo 应用开箱即用，从而无缝集成到应用中。

- [`react-native-purchases`](https://github.com/RevenueCat/react-native-purchases) —— 一个开源框架，封装了 Google Play Billing 与 StoreKit API，并集成 RevenueCat 服务以支持应用内购买。它支持商品管理、分析，以及简化可能超出客户端代码范围的应用内购买流程，例如在应用后端验证购买。
- [`expo-iap`](https://github.com/hyodotdev/openiap/tree/main/libraries/expo-iap) —— 一个符合 OpenIAP 规范、可与开发构建配合使用的 React Native 应用内购买库。
