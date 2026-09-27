---
title: 使用 Expo SDK、React Native 和第三方库
description: 了解如何在项目中使用 Expo SDK、React Native 库以及其他第三方 npm 包。
---

# 使用 Expo SDK、React Native 和第三方库

每个应用最终都会使用第三方库，因此了解如何判断某个库是否与你的项目兼容很重要。

## React Native 核心库

React Native 提供一组大多数开发者在应用中都会需要的内置原语。其中包括 `<ActivityIndicator>`、`<TextInput>`、`<Text>`、`<ScrollView>` 和 `<View>` 等组件。它们列在 React Native 文档的 [核心组件与 API](https://reactnative.dev/docs/components-and-apis) 中。你也可以查看[与你的 Expo SDK 版本对应的 React Native 版本](/versions/latest)。

要在项目中使用 React Native 组件或 API，从代码中的 `react-native` 包导入它：

```tsx
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello, world!</Text>
    </View>
  );
}
```

## Expo SDK 库

Expo SDK 从 React Native 核心库结束的地方接续。它提供对大量设备和系统功能的访问，例如音频、条码扫描、相机、日历、通讯录、视频等。它还加入了更新、地图、OAuth 身份验证工具等其他强大库。更多信息参见我们如何决定 [Expo SDK 包含什么](https://expo.fyi/whats-in-the-sdk)。

要使用 Expo SDK 中的库，在 [API 参考](/versions/latest)中找到你要的那个，或使用文档搜索。

> 如果你用 `npx @react-native-community/cli@latest init` 初始化应用，并且还没有安装 `expo` 包，参见[安装 Expo modules 指南](/bare/installing-expo-modules)了解更多信息。

你会在每个 API 参考的顶部看到平台兼容性标签。它告诉你该库兼容哪些平台和环境。例如，[`expo-device`](/versions/latest/sdk/device) 库的平台标签如下：

![expo-device 库 API 参考上的平台兼容性标签。](/static/images/guides/platform-tags.png)

平台兼容性表之后是库的描述，以及安装该库的说明。例如：

:::tabs
:::tab npm
```sh
npx expo install expo-device
```
:::
:::tab yarn
```sh
yarn expo install expo-device
```
:::
:::tab pnpm
```sh
pnpm expo install expo-device
```
:::
:::tab bun
```sh
bun expo install expo-device
```
:::
:::

`npx expo install` 命令会选择与你的项目兼容的库版本，然后使用你的 JavaScript 包管理器（例如 npm）安装它。

接下来，典型的 API 参考包括：

- 如果库需要配置插件，则有配置插件用法信息。
- 展示如何使用该库的代码示例。
- API 部分，列出如何导入该库，然后是该库提供的 hook、props、类型、方法和类的列表。

:::note
如果你使用 TypeScript，可以在兼容 TypeScript 的代码编辑器（例如 VS Code）中通过自动补全看到 API 部分包含的信息。
:::

## 第三方库

### 寻找第三方库

[React Native Directory](https://reactnative.directory) 是专门为 React Native 构建的库的可搜索数据库。如果你要找的库不是 React Native 或 Expo SDK 提供的，那么在为应用寻找库时，这里是首先查看的最佳地方。

在 React Native Directory 之后，[npm 注册表](https://www.npmjs.com/)是下一个最佳地方。npm 注册表是 JavaScript 库的权威来源，但它列出的库不一定都与 React Native 兼容。React Native 是众多 JavaScript 编程环境之一，还包括 Node.js、Web 浏览器、Electron 等，npm 包含适用于所有这些环境的库。任何与 React Native 兼容的库，在你创建[开发构建](/workflow/overview#开发构建)时都与 Expo 项目兼容。但它可能与 [Expo Go](https://expo.dev/go) 应用不兼容。

### 判断第三方库的兼容性

使用 Expo [开发构建](/workflow/overview#开发构建)来构建生产质量的应用。它包含项目运行所需的全部原生代码。这是在发布到 App Store 或 Google Play 之前测试应用的好方法。你也可以包含需要原生项目（**android** 和 **ios** 目录）配置的库。

Expo Go 是学生和学习者快速试用 React Native 的演练场。它不包含支持每个库所需的全部原生代码，因此有限制，不适合构建生产级项目。你可以查看 **React Native Directory**，访问网站并确认它有 "✔️ Expo Go" 标签，从而找到与 Expo Go 兼容的库。你也可以启用[按 Expo Go 筛选](https://reactnative.directory/?expoGo=true)。

要判断新依赖是否会更改原生项目目录，可以检查以下问题：

- 该库是否包含 **android** 或 **ios** 目录？
- 该库的 README 是否提到链接？
- 该库是否要求你更改 **android/app/src/main/AndroidManifest.xml** 或 **ios/Podfile** 或 **ios/Info.plist** 来改变项目配置？
- 该库是否有[配置插件](/config-plugins/introduction)？

**如果这些问题中有任何一个的答案是肯定的，** 你应该[创建开发构建](/develop/development-builds/introduction)才能在项目中使用该库。

**目录上没有列出？** 你可以在 GitHub 上找到该项目。一个简单的方法是 `npx npm-home --github <package-name>`。例如，要打开 `react-native-localize` 的 GitHub 页面，运行：

:::tabs
:::tab npm
```sh
$ npx npm-home --github react-native-localize
```
:::
:::tab yarn
```sh
$ yarn dlx npm-home --github react-native-localize
```
:::
:::tab pnpm
```sh
$ pnpm dlx npm-home --github react-native-localize
```
:::
:::tab bun
```sh
$ bunx npm-home --github react-native-localize
```
:::
:::

> 如果你需要帮助判断库的兼容性，请[在 React Native Directory 仓库创建 issue](https://github.com/react-native-community/directory/issues/new/choose)并告诉我们。这不仅会帮助你，也会帮助其他开发者在将来轻松得到答案！

### 安装第三方库

> 我们始终建议使用 `npx expo install`，而不是直接使用 `npm install` 或 `yarn add`，因为它允许 [Expo CLI](/more/expo-cli) 在可能时选择库的兼容版本，并就已知的不兼容向你发出警告。

一旦确定该库与 React Native 兼容，使用 [Expo CLI](/more/expo-cli) 安装该包：

:::tabs
:::tab npm
```sh
$ npx expo install @react-navigation/native
```
:::
:::tab yarn
```sh
$ yarn expo install @react-navigation/native
```
:::
:::tab pnpm
```sh
$ pnpm expo install @react-navigation/native
```
:::
:::tab bun
```sh
$ bun expo install @react-navigation/native
```
:::
:::

务必遵循项目网站或 README 中的任何额外配置和使用说明。你可以用此命令快速打开 README：

:::tabs
:::tab npm
```sh
$ npx npm-home @react-navigation/native
```
:::
:::tab yarn
```sh
$ yarn dlx npm-home @react-navigation/native
```
:::
:::tab pnpm
```sh
$ pnpm dlx npm-home @react-navigation/native
```
:::
:::tab bun
```sh
$ bunx npm-home @react-navigation/native
```
:::
:::

如果模块需要额外的原生配置，你可以使用[配置插件](/config-plugins/introduction)。有些包需要配置插件但还没有，可以参考[树外配置插件](https://github.com/expo/config-plugins/)列表。

> 如果你的项目不支持 [Expo 预构建](/workflow/continuous-native-generation)，你将无法使用[配置插件](/config-plugins/introduction)。你可以[采用 Expo 预构建](/guides/adopting-prebuild)，或按照相应模块网站或 README 中的额外设置指南，手动设置和配置每个库。

如果模块在 [Expo Go](https://expo.dev/go) 中不受支持，你可以创建[开发构建](/develop/development-builds/introduction)：

- [添加自定义原生代码](/workflow/customizing)：了解如何向 Expo 项目添加自定义原生代码。

### 把第三方库排除在版本检查之外

如果你安装了特定版本的第三方库，并希望把它排除在 `npx expo install`、`npx expo-doctor` 或 `npx expo start` 执行的版本检查之外，请在 **package.json** 文件中使用 [`expo.install.exclude`](/versions/latest/config/package-json#installexclude) 属性。
