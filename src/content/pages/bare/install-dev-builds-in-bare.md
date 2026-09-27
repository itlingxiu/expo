---
title: 在现有 React Native 项目中安装 expo-dev-client
description: 了解如何在现有 React Native 项目中安装并配置 expo-dev-client。
---

# 在现有 React Native 项目中安装 expo-dev-client

下面的指南说明如何在现有 React Native 项目中安装并配置 `expo-dev-client`。

<details>
<summary>需要创建新项目吗？</summary>

如果要从新项目开始，使用 `with-dev-client` 模板创建它：

:::tabs
:::tab npm
```sh
npx create-expo-app -e with-dev-client
```
:::
:::tab yarn
```sh
yarn create expo-app -e with-dev-client
```
:::
:::tab pnpm
```sh
pnpm create expo-app -e with-dev-client
```
:::
:::tab bun
```sh
bun create expo -e with-dev-client
```
:::
:::

</details>

<details>
<summary>项目使用持续原生生成（CNG）吗？</summary>

要在使用 [CNG](/workflow/continuous-native-generation) 的项目中使用 `expo-dev-client`，参见[创建开发构建](/develop/development-builds/introduction#选择构建开发构建的方式)。

</details>

**前置条件**

- **安装并配置 expo 包**：如果项目是用 `npx @react-native-community/cli@latest init` 创建的，并且没有安装其他 Expo 库，继续之前需要先[安装 Expo modules](/bare/installing-expo-modules)。

## 安装 expo-dev-client

把 `expo-dev-client` 库加入 **package.json**：

:::tabs
:::tab npm
```sh
npx expo install expo-dev-client
```
:::
:::tab yarn
```sh
yarn expo install expo-dev-client
```
:::
:::tab pnpm
```sh
pnpm expo install expo-dev-client
```
:::
:::tab bun
```sh
bun expo install expo-dev-client
```
:::
:::

如果项目磁盘上有 **ios** 目录，运行下面的命令以完整安装 `expo-dev-client` 的原生代码：

:::tabs
:::tab npm
```sh
npx pod-install
```
:::
:::tab yarn
```sh
yarn dlx pod-install
```
:::
:::tab pnpm
```sh
pnpm dlx pod-install
```
:::
:::tab bun
```sh
bunx pod-install
```
:::
:::

如果项目没有 **ios** 目录，可以跳过这一步。

## 配置深层链接

Expo CLI 使用深层链接启动项目。如果你计划[用 `expo-dev-client` 启动预览更新](/eas-update/getting-started)，并且已经为项目添加了自定义深层链接 scheme，它也很有用。

如果尚未为应用配置 `scheme` 以支持深层链接，可以用 `uri-scheme` 库来完成。

:::tabs
:::tab npm
```sh
# 列出项目的 scheme
npx uri-scheme list

# 为项目添加 scheme
npx uri-scheme add your-scheme
```
:::
:::tab yarn
```sh
# 列出项目的 scheme
yarn dlx uri-scheme list

# 为项目添加 scheme
yarn dlx uri-scheme add your-scheme
```
:::
:::tab pnpm
```sh
# 列出项目的 scheme
pnpm dlx uri-scheme list

# 为项目添加 scheme
pnpm dlx uri-scheme add your-scheme
```
:::
:::tab bun
```sh
# 列出项目的 scheme
bunx uri-scheme list

# 为项目添加 scheme
bunx uri-scheme add your-scheme
```
:::
:::

更多信息见 [`uri-scheme` 库](https://www.npmjs.com/package/uri-scheme)。

## 构建并安装应用

用你选择的工具创建应用的调试构建。例如，可以[在本地用 Expo CLI](/guides/local-app-development)完成，或[在云端用 EAS Build](/develop/development-builds/introduction#选择构建开发构建的方式)完成。
