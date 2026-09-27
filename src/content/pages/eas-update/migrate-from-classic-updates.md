---
title: 从 Classic Updates 迁移
description: 帮助从 Classic Updates 迁移到 EAS Update 的指南。
---

# 从 Classic Updates 迁移

:::warning
SDK 49 是最后一个支持 Classic Updates 的版本。要继续使用已弃用的 `expo publish` 命令，请在应用配置中设置 `updates.useClassicUpdates`。
:::

EAS Update 是 Expo 更新服务的下一代。如果你正在使用 Classic Updates，本指南将帮助你升级到 EAS Update。

## 前置条件

- **EAS Update 的最低版本**

  EAS Update 需要以下版本或更高版本：

  - Expo SDK 45.0.0 及更高版本
  - Expo CLI 5.3.0 及更高版本
  - EAS CLI 0.50.0 及更高版本
  - `expo-updates` 0.13.0 及更高版本

## 安装 EAS CLI

1. 安装 EAS CLI：

:::tabs
:::tab npm
```sh
$ npm install --global eas-cli
```
:::
:::tab yarn
```sh
$ yarn global add eas-cli
```
:::
:::tab pnpm
```sh
$ pnpm add --global eas-cli
```
:::
:::tab bun
```sh
$ bun add --global eas-cli
```
:::
:::

2. 然后用你的 expo 账户登录：

```sh
$ eas login
```

## 配置项目

你需要对项目做以下更改：

1. 用 EAS Update 初始化项目：

```sh
$ eas update:configure
```

此命令之后，应用配置中应有两个新字段：`expo.updates.url` 和 `expo.runtimeVersion`。

2. 为确保更新与构建内部的底层原生代码兼容，EAS Update 使用名为 `runtimeVersion` 的新字段，它替换项目应用配置中的 `sdkVersion` 字段。从应用配置中移除 `expo.sdkVersion` 属性。

3. 为了让更新应用到用 EAS 构建的构建，更新 **eas.json** 中的 EAS Build profile，加入 `channel` 属性。这些 channel 替换 `releaseChannel` 属性。我们发现用 profile 的名称来命名 `channel` 很方便。例如，`preview` profile 有一个名为 `"preview"` 的 `channel`，`production` profile 有一个名为 `"production"` 的 `channel`。

```json eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

4. **可选**：如果你的项目是[现有的 React Native 项目](/bare/overview)，参见[在现有项目中使用 EAS Update](/eas-update/getting-started)，了解你可能需要的额外配置。

## 创建新构建

上面的更改会影响构建内部的原生代码层，这意味着你需要制作新构建才能开始发送更新。构建完成后，你就可以发布更新了。

## 发布更新

在本地对项目做出更改后，你就可以发布更新了，运行：

```sh
$ eas update --channel [channel-name] --message [message]

# 示例
$ eas update --channel production --message "Fixes typo"
```

发布后，你可以在 [EAS 仪表盘](https://expo.dev/accounts/[account]/projects/[project]/updates)中看到该更新。

## 额外的迁移步骤

- 在脚本中把 `expo publish` 的实例替换为 `eas update`。你可以用 `eas update --help` 查看发布的全部选项。
- 如果你有任何代码引用 `expo-updates` 库的 `Updates.releaseChannel`，把它们替换为 `Updates.channel`。
- 移除任何引用 `Constants.manifest` 的代码。它现在总会返回 `null`。你可以用 `expo-constants` 库的 `Constants.expoConfig` 访问大多数你需要的属性。

## 了解更多

上面描述的步骤让你可以使用与 Classic Updates 类似的流程。不过 EAS Update 更灵活，功能也更多。它可以用来创建更稳定的发布流程。了解 [EAS Update 如何工作](/eas-update/how-it-works)，以及如何为你的项目和团队打造更稳定的[部署流程](/eas-update/deployment-patterns)。

如果迁移时遇到问题，查看我们的[调试指南](/eas-update/debug)。如果你有反馈，在 #update 频道加入我们的 [Discord](https://chat.expo.dev/)。
