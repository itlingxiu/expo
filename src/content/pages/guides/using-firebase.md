---
title: 使用 Firebase
description: 开始使用 Firebase JS SDK 与 React Native Firebase 的指南。
---

# 使用 Firebase

[Firebase](https://firebase.google.com/) 是一个"后端即服务（BaaS）应用开发平台"，提供托管后端服务，包括实时数据库、云存储、身份验证、崩溃报告与分析，构建在 Google 基础设施之上并自动扩展。有两种集成路径：

- Firebase JS SDK
- React Native Firebase

React Native 同时支持 JS SDK 与原生 SDK。本指南介绍何时选择哪一个，以及在 Expo 项目中所需的配置。

### 前置条件

**一个 Firebase 项目** —— 在 Firebase 控制台中新建一个，或复用现有项目。

## 使用 Firebase JS SDK

Firebase JS SDK 是一个与 Firebase 服务交互的 JavaScript 库，在 React Native 应用中支持 Authentication、Firestore、Realtime Database 与 Storage。

### 何时使用 Firebase JS SDK

在以下情况考虑使用：

- 使用 Expo Go 开发时需要 Auth、Firestore、Realtime Database 与 Storage。
- 想快速上手 Firebase 服务。
- 想要一个通用的 Android/iOS/Web 应用。

#### 注意事项

JS SDK 并不覆盖移动端的每项服务。缺失的服务包括 Analytics、Dynamic Links 与 Crashlytics —— 这些参见 React Native Firebase 一节。

### 安装并初始化 Firebase JS SDK

> Expo SDK 仅支持 `firebase@12.0.0` 及以上版本。更早的版本会导致 ES 模块解析错误。

#### 安装 SDK

创建 Expo 项目后，安装：

```sh
# npm
npx expo install firebase

# yarn
yarn expo install firebase

# pnpm
pnpm expo install firebase

# bun
bun expo install firebase
```

#### 在项目中初始化 SDK

创建一个配置对象，把它传给从 `firebase/app` 导入的 `initializeApp()`。配置需要一个 API key 以及其他唯一标识符，通过在你的 Firebase 项目中注册一个 Web 应用获得（按 Firebase 文档操作）。把这段代码放在项目根目录（或你存放配置文件的地方）新建的 **firebaseConfig.js** 中。

```js firebaseConfig.js
import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'api-key',
  authDomain: 'project-id.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'project-id',
  storageBucket: 'project-id.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'app-id',
  measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
```

不需要额外的插件或配置。Firebase v9+ 使用模块化 API —— 直接从 `firebase` 包导入你需要的服务（例如从 `firebase/auth` 导入 `auth`）。

> **故障排查提示：** 如果遇到 JS SDK 的"认证持久化"问题，参见关于设置持久化的指南，让用户在重新加载之间保持登录状态（expo.fyi/firebase-js-auth-setup）。

### 后续步骤（链接）

- Authentication —— Firebase 文档
- Firestore —— Firebase 文档
- Realtime Database —— Firebase 文档
- Storage —— Firebase 文档
- Firebase Storage 示例 —— Expo 示例仓库（with-firebase-storage-upload）
- 管理 Firebase 项目的 API key —— Firebase 文档
- 从 Expo Firebase 包迁移到 React Native Firebase —— expo.fyi/firebase-migration-guide

## 使用 React Native Firebase

React Native Firebase 把 Android 与 iOS 的原生 SDK 封装成 JavaScript API。每个 Firebase 服务都是你添加的一个依赖模块（例如，`auth` 模块提供 Firebase Authentication 的访问）。

### 何时使用 React Native Firebase

在以下情况考虑使用：

- 应用需要 JS SDK 没有的服务，例如 Dynamic Links 或 Crashlytics（原生 SDK 能力参见 React Native Firebase 文档）。
- 你想在应用中使用原生 SDK。
- 你有一个已配置 React Native Firebase 的现有 React Native（bare）项目，正在迁移到 Expo SDK。
- 你想要 Firebase Analytics。

#### 从 Expo Firebase 包迁移？

之前使用 `expo-firebase-analytics` 与 `expo-firebase-recaptcha` 的项目可以迁移到 React Native Firebase；参见 Firebase 迁移指南（expo.fyi/firebase-migration-guide）。

#### 注意事项

React Native Firebase 需要"自定义原生代码，不能与 Expo Go 一起使用"。

### 安装并初始化 React Native Firebase

#### 安装 expo-dev-client

因为需要自定义原生代码，先安装 `expo-dev-client`，它让配置插件在你不用手写的情况下配置原生代码：

```sh
# npm
npx expo install expo-dev-client

# yarn
yarn expo install expo-dev-client

# pnpm
pnpm expo install expo-dev-client

# bun
bun expo install expo-dev-client
```

#### 安装 React Native Firebase

你必须安装 `@react-native-firebase/app` —— 它为所有其他模块提供核心功能，并通过配置插件添加自定义原生代码：

```sh
# npm
npx expo install @react-native-firebase/app

# yarn
yarn expo install @react-native-firebase/app

# pnpm
pnpm expo install @react-native-firebase/app

# bun
bun expo install @react-native-firebase/app
```

**此时，你必须按照 React Native Firebase 文档中的说明操作**（rnfirebase.io，"Installation for Expo projects"），它涵盖所有配置步骤。然后回到本指南执行运行步骤。

#### 运行项目

使用 EAS Build，无需先在本地运行项目，即可创建设备上可安装的开发构建。

#### 在本地运行项目？

本地运行需要安装并配置好 Android Studio 与 Xcode（参见[本地应用开发指南](/guides/local-app-development)）。如果某个 React Native Firebase 模块需要自定义原生配置，把它作为 `plugin` 添加到应用配置中，然后运行 `npx expo prebuild --clean` 应用原生改动，再执行 `npx expo run` 命令。

### 后续步骤

配置完成后，React Native Firebase 提供的任何模块都可以在你的 Expo 项目中使用。安装与使用特定模块参见 React Native Firebase 文档。
