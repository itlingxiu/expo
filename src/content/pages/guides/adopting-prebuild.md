---
title: 采用 Prebuild
description: 了解如何在通过 React Native CLI 初始化的项目中采用 Expo Prebuild。
---

# 采用 Prebuild

使用 [Expo Prebuild](/workflow/continuous-native-generation) 来[持续生成你的原生项目](/workflow/continuous-native-generation)有[诸多优势](/workflow/continuous-native-generation)。本指南将展示如何在使用 `npx @react-native-community/cli@latest init` 初始化的项目中采用 Expo Prebuild。转换项目所需的时间取决于你对 Android 和 iOS 原生项目所做的自定义原生改动的数量。在全新项目上这可能只需要一两分钟，而在大型项目上则会长得多。

采用 Prebuild 会通过原生方式链接 `expo-modules-core`，从而自动为使用 [Expo 原生模块 API](/modules/module-api) 开发模块提供支持。你也可以在项目中使用 [Expo CLI](/more/expo-cli) 的任何命令。

:::warning
[并非所有版本的 `react-native` 都被明确支持](/versions/latest#each-expo-sdk-version-depends-on-a-react-native-version)。请务必使用与某个 Expo SDK 版本相对应的 `react-native` 版本。
:::

## 安装 `expo` 包

`expo` 包包含 [`npx expo prebuild`](/more/expo-cli#prebuild) 命令，并指明要使用的[预构建模板](/workflow/continuous-native-generation#templates)：

```sh
# npm
$ npm install expo

# yarn
$ yarn add expo

# pnpm
$ pnpm add expo

# bun
$ bun add expo
```

请确保安装的 `expo` 版本与你当前安装的 [`react-native` 版本](/versions/latest#each-expo-sdk-version-depends-on-a-react-native-version)相匹配。

## 更新入口文件

修改入口文件，改用 [`registerRootComponent`](/versions/latest/sdk/expo#registerrootcomponentcomponent) 而不是 `AppRegistry.registerComponent`：

```diff
diff --git a/index.js b/index.js
index 0000000..1111111 100644
--- a/index.js
+++ b/index.js
@@ -1,5 +1,4 @@
-import {AppRegistry} from 'react-native';
-import {name as appName} from './app.json';
+import {registerRootComponent} from 'expo';
 import App from './App';
-
-AppRegistry.registerComponent(appName, () => App);
+registerRootComponent(App);
```

> 了解有关 [`registerRootComponent`](/versions/latest/sdk/expo#registerrootcomponentcomponent) 的更多信息。

## 预构建

:::warning
请务必先提交你的改动，以防需要回滚；该命令也会对此发出警告！
:::

如果你正在迁移现有项目，可能需要先参考[**迁移原生自定义**](#迁移原生自定义)。

运行以下命令，根据应用配置（**app.json/app.config.js**）重新生成 **android** 和 **ios** 目录：

```sh
# npm
$ npx expo prebuild --clean

# yarn
$ yarn expo prebuild --clean

# pnpm
$ pnpm expo prebuild --clean

# bun
$ bun expo prebuild --clean
```

你可以通过本地构建项目来验证一切是否正常：

```sh
# npm
# 构建你的原生 Android 项目
$ npx expo run:android

# 构建你的原生 iOS 项目
$ npx expo run:ios

# yarn
# 构建你的原生 Android 项目
$ yarn expo run:android

# 构建你的原生 iOS 项目
$ yarn expo run:ios

# pnpm
# 构建你的原生 Android 项目
$ pnpm expo run:android

# 构建你的原生 iOS 项目
$ pnpm expo run:ios

# bun
# 构建你的原生 Android 项目
$ bun expo run:android

# 构建你的原生 iOS 项目
$ bun expo run:ios
```

> 了解有关[编译原生应用](/more/expo-cli#compiling)的更多信息。

## 额外改动

以下改动是可选的，但建议执行。

**.gitignore**

你可以将 **.expo** 添加到 **.gitignore** 中，防止 Expo CLI 生成的值被提交。这些[值是本地计算机上项目独有的](/more/expo-cli#expo-directory)。

创建新项目时，**android** 和 **ios** 目录会自动添加到 **.gitignore** 中，确保它们在两次预构建之间不会被提交。

**app.json**

删除顶级 `expo` 对象之外的所有字段，因为 `npx expo prebuild` 不会使用它们：

```diff
diff --git a/app.json b/app.json
index 0000000..1111111 100644
--- a/app.json
+++ b/app.json
@@
-  "name": "myapp",
-  "displayName": "myapp"
+  "expo": {
+    "name": "myapp"
+  }
 }
```

**metro.config.js**

参见[自定义 Metro](/guides/customizing-metro)。

**package.json**

你可能想把脚本改为使用 [Expo CLI](/more/expo-cli#compiling) 的运行命令：

```diff
diff --git a/package.json b/package.json
index 0000000..1111111 100644
--- a/package.json
+++ b/package.json
@@
   "scripts": {
     "start": "expo start",
-    "android": "react-native run-android",
-    "ios": "react-native run-ios",
+    "android": "expo run:android",
+    "ios": "expo run:ios",
   },
```

这些命令具有更好的日志输出、自动代码签名、更好的模拟器处理能力，并且能确保运行 `npx expo start` 来提供文件服务。

## 迁移原生自定义

如果你的项目有任何原生修改（对 **android** 或 **ios** 目录的更改，例如应用图标配置或启动屏），那么你需要配置应用配置（**app.json**）来反映这些原生更改。

- 检查你的改动是否与内置的[应用配置字段](/versions/latest/config/app)重叠。例如，如果你设置了应用图标，请务必在 **app.json** 中将其定义为 `expo.icon`，然后重新运行 `npx expo prebuild`。
- 查询你使用的包中是否有需要 [Expo 配置插件](/config-plugins/introduction)的。如果项目中的某个包需要在 **android** 或 **ios** 目录中进行额外更改，那么你可能就需要一个配置插件。通过运行 `npx expo install` 并带上 **package.json** 依赖中的所有包，可以自动添加一些插件。如果某个包需要插件但本身没有提供，可以尝试查看 [`expo/config-plugins`](https://github.com/expo/config-plugins) 中的社区插件，看看是否已有现成的。
- 你可以使用 [VS Code Expo 扩展](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)来检查你的改动，并调试 prebuild 是否生成了你期望的原生代码。只需按 Cmd ⌘ + Shift + P，输入 "Expo: Preview Modifier"，然后选择你想要检查的原生文件即可。
- 此外，你还可以开发本地配置插件来满足自己的需求。参见[如何开发配置插件](/config-plugins/development-and-debugging#plugin-development)。

## 添加更多功能

Prebuild 只是自动化冰山的一角，以下是一些接下来可以采用的特性：

- [EAS Build](/build/setup)：代码签名与云端构建。
- [EAS Update](/build/updates)：即时发送 OTA 更新。
- [Expo for web](/workflow/web)：在浏览器中运行你的应用。
- [Expo Dev Client](/develop/development-builds/introduction)：围绕你的原生运行时创建属于你自己的"Expo Go"类应用。
- [Expo 原生模块 API](/modules/module-api)：用 Swift 和 Kotlin 编写模块。使用 `npx expo prebuild` 时会自动支持。
