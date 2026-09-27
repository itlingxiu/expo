---
title: 使用身份验证 SDK 与库
description: Expo 与 React Native 生态中可用的身份验证集成概览。
---

# 使用身份验证 SDK 与库

移动应用中的身份验证，指的是如何识别用户是谁、管理注册或登录流程，并在应用多次启动以及多台设备之间维持其已认证会话。身份验证 SDK 与库帮助你添加这些流程，因此不必自己搭建自定义认证后端。以下指南介绍适用于 Expo 与 React Native 项目的常用 SDK 与提供商。

:::warning
部分提供商需要自定义原生代码，并且不支持 Expo Go。需要时请使用[开发构建](/develop/development-builds/introduction)。
:::

- [使用 Clerk](/guides/using-clerk) —— 为 Expo 与 React Native 项目添加 Clerk 身份验证与用户管理。
- [使用 Facebook 身份验证](/guides/facebook-authentication) —— 配置 `react-native-fbsdk-next`，在 Expo 项目中添加 Facebook 身份验证。
- [使用 Google 身份验证](/guides/google-authentication) —— 配置 `@react-native-google-signin/google-signin`，在 Expo 项目中添加 Google 身份验证。
