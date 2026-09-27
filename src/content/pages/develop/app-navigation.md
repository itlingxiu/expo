---
title: 应用导航
description: 了解在 Expo 与 React Native 项目中集成导航的推荐方式。
---

# Expo 与 React Native 应用中的导航

React Native 核心并没有内置导航方案，因此开发者可以选择任何适合自己项目的库。对于 Expo 与 React Native 项目，通常是在 [React Navigation](https://reactnavigation.org/) 和 [Expo Router](/router/introduction) 之间做选择。

## 为什么 React Native 应用需要导航库

React Native 核心提供基础的 UI 组件、触摸处理、设备 API 与网络能力，但有意省略了存储、相机、地图、大多数设备传感器以及导航等功能。这些空白由社区库来填补。

## React Navigation

React Navigation 是一个基于组件的库，在整个 React Native 生态中被广泛使用。它支持用代码构建堆栈（stack）、标签页（tab）与抽屉（drawer）导航器，从而实现复杂的流程、自定义转场以及应用特有的 UX 模式。其能力包括：符合平台习惯的观感与流畅的动画手势、同时适用于移动端与 Web 的路由、自动的深链接（deep linking）、通过静态配置实现的类型化路由，以及高度的可定制性。

[React Navigation: Getting started](https://reactnavigation.org/docs/getting-started) —— 了解如何上手 React Navigation。

## Expo Router（Expo 项目推荐）

Expo Router 为 Expo 与 React Native 应用使用基于文件的路由模型。它遵循 "app" 目录约定，把文件转换为路由，并与 Expo 深度集成，使 [Expo CLI](/more/expo-cli) 与打包（bundling）开箱即用，无需额外配置。其他特性包括：类型化路由、动态路由、开发环境中的懒打包、Web 静态渲染以及自动深链接。

用 `npx create-expo-app@latest` 脚手架创建的新 Expo 项目默认已启用 Expo Router。

- [Expo Router 简介](/router/introduction) —— Expo Router 是一个开源的通用（Universal）React Native 应用路由库，随 Expo 一起构建。
- [安装](/router/installation) —— 创建全新的 Expo Router 项目，或把该库添加到现有项目。
- [核心概念](/router/basics/core-concepts) —— Expo Router 基于文件的路由基础。
