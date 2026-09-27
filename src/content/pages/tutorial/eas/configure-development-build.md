---
title: 在云端配置开发构建
description: 学习如何使用 EAS Build 为项目配置开发构建。
---

# 在云端配置开发构建

在本章中，我们将为示例应用用 EAS 设置并配置开发构建。

[观看视频：如何配置开发构建](https://www.youtube.com/watch?v=uQCE9zl3dXU) —— 学习如何安装 expo-dev-client、在 eas.json 中配置构建 profile，并用 EAS Build 创建你的第一个开发构建。

---

## 理解开发构建

先了解什么是开发构建，以及为什么需要它们。

[开发构建](/develop/development-builds/introduction)是项目的调试版本。它针对创建应用时的快速迭代做了优化。它包含 [`expo-dev-client`](/versions/latest/sdk/dev-client) 库，提供完整的开发环境。这样我们可以按需集成任何原生库，或修改[原生目录](/workflow/overview#android-and-ios-native-projects)中的代码。

### 要点

:::note
如果你熟悉 [Expo Go](/get-started/set-up-your-environment)，可以把开发构建看作按项目需求定制的 Expo Go。
:::

| 特性 | 开发构建 | Expo Go |
| --- | --- | --- |
| **开发阶段** | 为移动应用开发提供接近 Web 的迭代速度。 | 允许用客户端应用快速迭代和测试 Expo SDK 项目。 |
| **协作** | 借助共享的原生运行时方便团队测试。 | 通过设备上的二维码轻松分享项目。 |
| **第三方库支持** | 完整支持任何[第三方库](/workflow/using-libraries#third-party-libraries)，包括需要自定义原生代码的库。 | 仅限于 Expo SDK 内的库，不适合自定义原生依赖。 |
| **定制** | 可通过[配置插件](/config-plugins/introduction)和直接访问原生代码进行广泛定制。 | 定制有限，聚焦 Expo SDK 能力，不能直接修改原生代码。 |
| **预期用途** | 适合以商店部署为目标的完整应用开发，提供完整的开发环境和工具。 | 适合学习、原型和实验。不建议用于生产应用。 |

## 1. 安装 expo-dev-client 库

要为开发构建初始化项目，先 [`cd`](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line#basic_built-in_terminal_commands) 进入项目目录，然后运行以下命令安装该库：

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

### 启动开发服务器

运行 `npx expo start` 来启动[开发服务器](/get-started/start-developing#start-a-development-server)：

:::tabs
:::tab npm
```sh
npx expo start
```
:::
:::tab yarn
```sh
yarn expo start
```
:::
:::tab pnpm
```sh
pnpm expo start
```
:::
:::tab bun
```sh
bun expo start
```
:::
:::

这条命令会启动 Metro bundler。在终端窗口中，我们会看到二维码，后面是 `Metro waiting on...` 和一个清单 URL：

![正在运行的开发服务器](/static/images/tutorial/eas/development-server.webp)

注意安装 `expo-dev-client` 库后的变化：

- 清单 URL 中包含 `expo-development-client` 以及应用 scheme
- 开发服务器现在为开发构建运行（不再是 Expo Go）

由于我们还没有在某台设备或模拟器上安装开发构建，暂时还不能运行项目。

## 2. 初始化开发构建

### 安装 EAS CLI

需要把 EAS 命令行界面（CLI）工具作为全局依赖安装到本机。运行以下命令：

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

### 登录或注册 Expo 账户

> 如果你已有 Expo 账户，并且已经用 Expo CLI 登录，跳过这一步。如果没有 Expo 账户，请[在此注册](https://expo.dev/signup)，然后继续执行下面描述的登录命令。

要登录，运行以下命令：

```sh
eas login
```

这条命令会要求我们的 Expo 账户邮箱或用户名以及密码，以完成登录。

### 初始化项目并关联到 EAS

对于任何新项目，第一步是初始化并把它关联到 EAS 服务器。运行以下命令：

```sh
eas init
```

运行后，这条命令会：

- 要求通过输入 Expo 账户凭据来验证账户所有者，并询问是否要创建一个新的 EAS 项目：

```text
# 运行 eas init 后的输出
✔ Which account should own this project? > your-username
✔ Would you like to create a project for @your-username/sticker-smash? … yes
✔ Created @your-username/sticker-smash
✔ Project successfully linked (ID: XXXX-XX-XX-XXXX) (modified app.json)
```

- 创建 EAS 项目，并提供一个可以在 EAS 仪表板中打开的链接：

![EAS 仪表板中的新项目](/static/images/tutorial/eas/new-project.png)

- 生成一个唯一的 `projectId`，并把这个 EAS 项目关联到开发机上的示例应用。
- 修改 **app.json**，加入 [`extra.eas.projectId`](/versions/latest/sdk/constants#easconfig)，并用创建的唯一 ID 更新它的值。

<details>
<summary>app.json 中的 <code>projectId</code> 是什么？</summary>

当 `eas init` 运行时，它会在 **app.json** 的 `extra.eas.projectId` 下为我们的项目关联一个唯一标识符。这个属性的值用于在 EAS 服务器上识别我们的项目。

```json
{
  "extra": {
    "eas": {
      "projectId": "0cd3da2d-xxx-xxx-xxx-xxxxxxxxxx"
    }
  }
}
```

</details>

## 3. 为 EAS Build 配置项目

要为 EAS Build 设置项目，运行以下命令：

```sh
eas build:configure
```

运行后，这条命令会：

- 提示选择平台：**Android**、**iOS** 或 **All**。由于我们要创建 Android 和 iOS 应用，选择 **All**。
- 在项目目录根目录创建 **eas.json**，配置如下：

```json eas.json
{
  "cli": {
    "version": ">= 16.18.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

这是新项目中 **eas.json** 的默认配置。它做两件事：

- 定义当前的 EAS CLI 版本。
- 添加三个[构建 profile](/build/eas-json#build-profiles)：`development`、`preview` 和 `production`。

<details>
<summary>进一步了解 development profile</summary>

**eas.json** 是不同构建 profile 的集合。每个 profile 都带有不同的配置，以产出特定的构建类型。这些 profile 也可以包含针对 Android 或 iOS 的平台设置。

目前我们关注的是 `development` profile，它包含以下配置：

- [`developmentClient`](/eas/json#developmentclient)：启用（`true`）以创建调试构建。它使用 `expo-dev-client` 库加载应用，该库提供开发工具，并生成可安装到设备或模拟器的构建产物，还允许把应用用于本地开发，因为它支持即时更新 JavaScript。
- [`distribution`](/eas/json#distribution)：配置为 `internal`，表示我们希望在内部共享构建（而不是上传到应用商店）。

:::note
构建提供广泛的定制选项，包括平台特定设置，以及在不同构建 profile 之间扩展配置的能力。更多内容参见[自定义构建 profile](/build/eas-json#build-profiles)。
:::

</details>

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
