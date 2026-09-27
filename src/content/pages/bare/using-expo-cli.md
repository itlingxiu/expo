---
title: 从 React Native CLI 迁移到 Expo CLI
description: 了解如何把任何 React Native 项目从 React Native CLI（@react-native-community/cli）迁移到 Expo CLI。
---

# 从 React Native CLI 迁移到 Expo CLI

要从 React Native CLI（`npx @react-native-community/cli@latest init`）迁移到 Expo CLI，需要安装 `expo` 包，它包含 Expo Modules API 和 Expo CLI。本指南涵盖安装步骤、使用 Expo CLI 的好处，以及迁移到 Expo CLI 之后如何编译并运行项目。

使用其他 Expo 工具时，强烈建议使用 Expo CLI。许多工具都需要它，例如 EAS Update、Expo Router 和 expo-dev-client，没有它时其他功能也可能无法同样好地工作。

## 安装 `expo` 包

在大多数情况下，在项目目录中执行下面的命令来安装该包就是你需要做的全部事情：

:::tabs
:::tab npm
```sh
npx install-expo-modules@latest
```
:::
:::tab yarn
```sh
yarn dlx install-expo-modules@latest
```
:::
:::tab pnpm
```sh
pnpm dlx install-expo-modules@latest
```
:::
:::tab bun
```sh
bunx install-expo-modules@latest
```
:::
:::

详细安装指南见[安装 Expo modules](/bare/installing-expo-modules)。

:::note
安装 `expo` 包之后，需要配置项目以使用 Expo CLI。这包括设置 Metro 配置、Babel preset 和原生项目配置。完整设置说明见[为 Android 和 iOS 上的打包配置 Expo CLI](/bare/installing-expo-modules#为-android-和-ios-上的打包配置-expo-cli)。
:::

## 为什么用 Expo CLI 而不是 React Native CLI

Expo CLI 命令相比 `@react-native-community/cli` 中的类似命令有多项好处，包括：

- 按 <kbd>J</kbd> 键即可立即使用 Hermes 调试器。
- 调试器附带 [React Native DevTools](/debugging/tools#使用-react-native-devtools-调试)。
- 通过 [`expo prebuild`](/more/glossary-of-terms#预构建) 支持[持续原生生成（CNG）](/workflow/continuous-native-generation)，用于升级、白标、轻松设置第三方包，并通过缩小涉及面提高代码库可维护性。
- 通过 [`expo-router`](/router/introduction) 支持基于文件的路由。
  - 开发中的[异步打包](/router/web/async-routes)。
- 内置[环境变量支持](/guides/environment-variables)和 **.env** 文件集成。
- 在终端中与 JavaScript 日志一起直接查看原生日志。
- 使用专为 React Native 应用打造的、类似 `xcpretty` 的 Expo CLI 工具，改进原生构建日志格式。例如，编译某个 Pod 时，可以看到是哪个 Node 模块包含了它。
- [一流的 TypeScript 支持](/guides/typescript)。
- 支持 **tsconfig.json** 中的 `paths` 和 `baseUrl` 别名，并且[内置于 Metro](/guides/typescript#路径别名可选)。
- 使用 Metro 的 [Web 支持](/guides/customizing-metro#为-metro-添加-web-支持)。对 React Native Web 完全类型化。
- 现代 [CSS 支持](/versions/latest/config/metro#css)，包括 Tailwind、PostCSS、CSS Modules、SASS 等。
- 使用 Expo Router 和 Metro Web 进行静态站点生成。
- 开箱即用的 [Monorepo 支持](/guides/monorepos)。
- 支持 Expo 工具，例如 [`expo-dev-client`](/develop/development-builds/introduction)、[Expo Updates 协议](/technical-specs/expo-updates-1) 和 [EAS Update](/eas-update/introduction)。
- 使用 `npx expo run:ios` 时自动执行 `pod install`。
- `npx expo install` 为知名包选择兼容的依赖版本。
- 运行 `npx expo run:[android|ios]` 和 `npx expo start` 时自动检测端口。如果另一个应用占用了默认端口，会使用不同的端口。
- 在交互提示中用 <kbd>Shift</kbd> + <kbd>A</kbd> 或 <kbd>Shift</kbd> + <kbd>I</kbd> 快速选择启动 Android 或 iOS 设备。
- 内置支持通过 [ngrok 隧道](/develop/development-builds/development-workflows#隧道-url) 提供应用。
- 可以在任意端口上使用任意入口 JavaScript 文件进行开发。

对于大多数面向 Android、iOS 和/或 Web 的 React Native 项目，我们推荐 Expo CLI。它还没有对最流行的树外平台（例如 Windows 和 macOS）提供内置支持。如果要为这些平台构建，可以对受支持的平台使用 Expo CLI，对其余平台使用 `@react-native-community/cli`。

## 编译并运行应用

安装 `expo` 包之后，可以使用下面的命令，它们是 `npx react-native run-android` 和 `npx react-native run-ios` 的替代：

:::tabs
:::tab npm
```sh
# Android
npx expo run:android

# iOS
npx expo run:ios
```
:::
:::tab yarn
```sh
# Android
yarn expo run:android

# iOS
yarn expo run:ios
```
:::
:::tab pnpm
```sh
# Android
pnpm expo run:android

# iOS
pnpm expo run:ios
```
:::
:::tab bun
```sh
# Android
bun expo run:android

# iOS
bun expo run:ios
```
:::
:::

构建项目时，可以用 `--device` 标志选择设备或模拟器。这也适用于连接到计算机的任何 iOS 设备。

## 独立启动打包器

`npx expo run:[android|ios]` 会自动启动打包器/开发服务器。如果想用 `npx expo start` 命令独立启动打包器，向 `npx expo run:[android|ios]` 命令传入 `--no-bundler`。

## 常见问题

<details>
<summary>可以不安装 Expo Modules API 就使用 Expo CLI 吗？</summary>

用 `npx install-expo-modules` 安装 `expo` 包时，也会安装 Expo Modules API。如果目前只想试用 Expo CLI 而不安装 Expo Modules API，用 `npm install` 安装 `expo` 包，然后配置 **react-native.config.js**，把该包排除在自动链接之外：

```js react-native.config.js
module.exports = {
  dependencies: {
    expo: {
      platforms: {
        android: null,
        ios: null,
        macos: null,
      },
    },
  },
};
```

:::note
没有安装 Expo API Modules 时，`expo-dev-client` 或 `expo-router` 等某些功能不可用。
:::

</details>

<details>
<summary>可以对树外平台（例如 macOS 或 Windows）使用预构建吗？</summary>

可以。更多信息参见 [Customized Prebuild Example 仓库](https://github.com/byCedric/custom-prebuild-example)。

</details>

## 下一步

现在项目中已经安装并配置了 `expo` 包，你可以开始使用 Expo CLI 和 SDK 的全部功能。下面是一些建议的下一步，便于深入了解：

- **[Expo CLI 参考](/more/expo-cli)**：进一步了解 Expo CLI 中可用的命令和标志。
- **[自定义 Metro](/guides/customizing-metro)**：了解如何为项目自定义 Metro 打包器配置。
- **[采用预构建](/guides/adopting-prebuild)**：使用 **app.json** 自动化原生目录。
- **[使用 Expo SDK](/versions)**：在应用中试用 Expo SDK 中的库。
- **[Expo Router](/router/introduction)**：Expo Router 把 Web 上最好的路由概念带到原生 Android 和 iOS 应用。
