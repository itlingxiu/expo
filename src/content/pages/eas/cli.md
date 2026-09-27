---
title: EAS CLI 参考
description: EAS CLI 是一个命令行工具，让你可以在终端中与 Expo Application Services（EAS）交互。
---

# EAS CLI 参考

你可以使用 EAS 命令行界面（CLI）在终端窗口中为你的 Expo 和 React Native 项目执行构建、更新、提交、部署或使用工作流。

## 安装

你需要在机器上全局安装 EAS CLI，运行以下命令即可：

:::tabs
:::tab npm
```sh
npm install --global eas-cli
```
:::
:::tab yarn
```sh
yarn global add eas-cli
```
:::
:::tab pnpm
```sh
pnpm add --global eas-cli
```
:::
:::tab bun
```sh
bun add --global eas-cli
```
:::
:::

或者，你可以使用包管理器提供的 CLI 工具来运行 EAS CLI 命令：

:::tabs
:::tab npm
```sh
npx eas-cli@latest
```
:::
:::tab yarn
```sh
yarn dlx eas-cli@latest
```
:::
:::tab pnpm
```sh
pnpm dlx eas-cli@latest
```
:::
:::tab bun
```sh
bunx eas-cli@latest
```
:::
:::

## 命令

通过运行本页记录的命令之一来使用 EAS CLI，后面可以跟任意标志或参数。标志用于自定义命令的行为，参数则针对具体命令。

> 本页包含一个交互式 EAS CLI 命令参考（可查看所有命令、标志与参数），无法以静态形式复刻。
