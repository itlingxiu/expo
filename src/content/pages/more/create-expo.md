---
title: create-expo-app
description: 用于创建新的 Expo 与 React Native 项目的命令行工具。
---

# create-expo-app

`create-expo-app` 是用于创建并设置新的 Expo 与 React Native 项目的命令行工具。它通过提供多种模板来简化初始化过程，让你无需手动配置就能快速开始。

## 创建新项目

要创建新项目，运行下面的命令：

:::tabs
:::tab npm
```sh
npx create-expo-app@latest
```
:::
:::tab yarn
```sh
yarn create expo-app
```
:::
:::tab pnpm
```sh
pnpm create expo-app
```
:::
:::tab bun
```sh
bun create expo
```
:::
:::

运行上面的命令后，系统会提示你输入项目的应用名称。该应用名称也会用于应用配置的 [`name`](/versions/latest/config/app#name) 属性。

```text
What is your app named? my-app
```

## 选项

使用下面的选项来自定义命令行为。

### `--yes`

使用默认选项创建新项目。

### `--no-install`

跳过安装 npm 依赖或 CocoaPods。

### `--no-agents-md`

跳过生成 **AGENTS.md** 和 **.claude/settings.json**。默认情况下，`create-expo-app` 会生成 **AGENTS.md**，以便 AI 编程智能体拥有针对 Expo 的上下文。安装了 Claude Code 时，它还会生成 **.claude/settings.json**，以自动配置 [`expo` skills 插件](https://expo.dev/expo-skills)。生成的 **AGENTS.md** 指向与项目 SDK 版本匹配的版本文档。

### `--template`

使用[Node 包管理器](#node-包管理器支持)运行 `create-expo-app` 时，会用默认模板初始化并设置一个新的 Expo 项目。

你可以用 `--template` 选项选择下面的模板之一，或把它作为参数传给该选项。例如 `--template default`。

:::note
想要更多模板？查看 [`--example`](#--example) 选项，用演示特定功能和集成的示例应用之一来初始化项目。
:::

| 模板 | 说明 |
| --- | --- |
| [`default`](https://github.com/expo/expo/tree/main/templates/expo-template-default) | 默认模板。为构建多屏幕应用而设计。包含推荐工具，例如 Expo CLI、Expo Router 库，并启用 TypeScript 配置。适合大多数应用。 |
| [`blank`](https://github.com/expo/expo/tree/main/templates/expo-template-blank) | 安装所需的最少 npm 依赖，不配置导航。 |
| [`blank-typescript`](https://github.com/expo/expo/tree/main/templates/expo-template-blank-typescript) | 启用 TypeScript 的 Blank 模板。 |
| [`tabs`](https://github.com/expo/expo/tree/main/templates/expo-template-tabs) | 安装并配置基于文件的路由，使用 Expo Router 并启用 TypeScript。 |
| [`bare-minimum`](https://github.com/expo/expo/tree/main/templates/expo-template-bare-minimum) | 生成了原生目录（**android** 和 **ios**）的 Blank 模板。设置过程中会运行 [`npx expo prebuild`](/workflow/continuous-native-generation)。 |

### `--example`

用此选项，根据 [expo/examples](https://github.com/expo/examples) 中的示例初始化项目。

例如：

- 运行 `npx create-expo-app --example` 会显示可供选择的示例交互列表
- 运行 `npx create-expo-app --example with-router` 会设置一个带 Expo Router 库的项目
- 运行 `npx create-expo-app --example with-react-navigation` 会设置一个与默认模板类似、但配置为普通 React Navigation 库的项目

#### 面向 AI 智能体的 Expo Skills

如果使用 AI 智能体，请安装 [Expo Skills](/skills)，让它学习示例仓库中的规范模式。相关技能为 `expo-examples`。

### `--version`

打印版本号并退出。

### `--help`

打印可用选项列表并退出。

## Node 包管理器支持

用 `create-expo-app` 创建新项目时，也会处理特定 Node 包管理器所需的额外配置。

**如果你正在从一个包管理器迁移到另一个**，必须在项目中手动完成额外配置。**如果你使用 [EAS](/eas)**，也必须手动为任何额外的必需步骤配置项目。

每个包管理器的全部额外步骤列在下面。

### npm

#### 本地安装

npm 作为 Node.js 安装的一部分安装。安装说明见 [Node.js 文档](https://nodejs.org/en/download/package-manager)。

#### EAS 安装

如果项目目录包含 **package-lock.json**，则默认支持。

### Yarn 1（Classic）

#### 本地安装

Yarn 1（Classic）通常作为 npm 的全局依赖安装。安装说明见 [Yarn 1 文档](https://classic.yarnpkg.com/en/docs/getting-started)。

#### EAS 安装

如果项目目录包含 **yarn.lock**，则默认支持。

### Yarn 2+（Modern）

#### 本地安装

安装说明见 [Yarn 文档](https://yarnpkg.com/getting-started/install)。

Yarn 2+ 处理包管理的方式与 Yarn 1 不同。Yarn 2+ 的核心变化之一是 [Plug'n'Play (PnP)](https://yarnpkg.com/features/pnp) 节点链接模型，它不能与 React Native 一起工作。

默认情况下，用 `create-expo-app` 和 Yarn 2+ 创建的项目使用 [`nodeLinker`](https://yarnpkg.com/features/linkers#nodelinker-node-modules)，并将其值设为 `node-modules` 来安装依赖。

```yaml .yarnrc.yml
nodeLinker: node-modules
```

#### EAS 安装

EAS 上的 Yarn Modern 需要为构建启用 [Corepack](https://github.com/nodejs/corepack)。在 **eas.json** 的构建 profile 中把 [`corepack`](/eas/json#corepack) 设为 `true`：

```json eas.json
{
  "build": {
    "production": {
      "corepack": true
    }
  }
}
```

然后用 [`packageManager`](https://nodejs.org/api/packages.html#packagemanager) 字段在项目的 **package.json** 中固定 Yarn 版本。在本地运行 `yarn set version <version>` 会为你更新该字段：

```json package.json
{
  "packageManager": "yarn@4.14.1"
}
```

添加以上两项配置之后，EAS 安装依赖时，Corepack 会自动下载并使用固定的 Yarn 版本。

### pnpm

#### 本地安装

需要安装 Node.js。安装说明见 [pnpm 文档](https://pnpm.io/installation)。

默认情况下，用 `create-expo-app` 和 pnpm 创建的项目使用 [`nodeLinker`](https://pnpm.io/settings#nodelinker)，并将其值设为 `hoisted` 来安装依赖。

```yaml pnpm-workspace.yaml
nodeLinker: hoisted
```

:::note
在 **SDK 54** 及更高版本中，Expo 支持隔离安装。如果你更喜欢使用隔离依赖，可以删除 `nodeLinker` 设置。
:::

#### EAS 安装

如果项目目录包含 **pnpm-lock.yaml**，则默认支持。

### Bun

关于用 `bun` 创建新的 Expo 项目、从其他包管理器迁移，以及与 EAS 一起使用的细节，见 [Bun](/guides/using-bun) 指南。
