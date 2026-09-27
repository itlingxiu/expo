---
title: 使用 monorepo
description: 了解如何使用工作区（workspaces）在 monorepo 中设置 Expo 项目。
---

# 使用 monorepo

monorepo 是"单一仓库"，存放多个应用/包，有助于加快大型项目的速度、共享代码，并作为单一事实来源。Expo 通过支持工作区（workspaces）的包管理器支持 monorepo：[Bun](https://bun.sh/docs/install/workspaces)、[npm](https://docs.npmjs.com/cli/using-npm/workspaces)、[pnpm](https://pnpm.io/workspaces) 与 [Yarn](https://yarnpkg.com/features/workspaces)（v1 Classic 与 Berry）。Expo 会根据工作区配置自动检测 monorepo，并配置添加到其中的新应用项目。

:::note
monorepo 并非适合所有项目 —— 当多个应用共享一个仓库，或原生模块与应用放在一起时，它才有帮助；代价是更多的设置/配置复杂度，所以请先确认你的工具与库能在 monorepo 中工作。
:::

### 自动配置（迁移到 SDK 52+）

使用 [`expo/metro-config`](/guides/customizing-metro) 时，Expo 会自动为 monorepo 配置 Metro。如果之前的手动 **metro.config.js** 修改过以下任何一项，删除它们：

- `watchFolders`
- `resolver.nodeModulesPath`
- `resolver.extraNodeModules`
- `resolver.disableHierarchicalLookup`

然后运行一次 `npx expo start --clear` 清空陈旧的 Metro 缓存。如果之后应用正常工作，它就是一个普通 Node monorepo，无需特殊配置。

### 手动配置（SDK 52 之前）

Metro 配置内置了对 Bun、npm、pnpm 与 Yarn 的 monorepo 支持。SDK 52 之前需要两处手动修改：(1) Metro 必须手动监视 monorepo 代码（不只是 **apps/cool-app**）；(2) 必须调整解析，让它在其他工作区与多个 `node_modules` 文件夹中找到包。

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(__dirname, '../..');
const config = getDefaultConfig(__dirname);

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
```

> 参见[自定义 Metro](/guides/customizing-metro)。

## 设置 monorepo

应用通常位于子目录中，包管理器配置为把依赖添加到 monorepo 中的其他包。一个基本结构：

- **apps**：多个项目，包括 Expo 应用。
- **packages**：应用使用的不同包。
- **package.json**：根包文件。

每个 monorepo 都需要一个根 **package.json** —— 主配置文件，可能存放为所有项目安装的工具。对于 Bun、npm 与 Yarn，添加带[glob 模式](https://classic.yarnpkg.com/lang/en/docs/workspaces/#toc-tips-tricks)的 `workspaces` 属性：

```json package.json
{
  "name": "monorepo",
  "private": true,
  "version": "0.0.0",
  "workspaces": ["apps/*", "packages/*"]
}
```

对于 [pnpm](https://pnpm.io/workspaces)，改为创建 [**pnpm-workspace.yaml**](https://pnpm.io/pnpm-workspace_yaml)：

```yaml pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 创建你的第一个应用

创建 **apps** 目录（存放所有应用/网站），然后为 Expo 应用创建子目录：

```sh
# npm
npx create-expo-app@latest apps/cool-app

# yarn
yarn create expo-app apps/cool-app

# pnpm
pnpm create expo-app apps/cool-app

# bun
bun create expo apps/cool-app
```

:::tip
如果你已有应用，可以把所有文件复制到 **apps** 内的一个目录中。
:::

创建/复制应用后，从 monorepo 根目录安装依赖，检查是否有常见警告。

### 创建包

包不需要发布；[Expo 仓库](https://github.com/expo/expo)把所有 SDK 包放在它的 [**packages**](https://github.com/expo/expo/tree/main/packages) 目录中，发布前通过 [**apps**](https://github.com/expo/expo/tree/main/apps/native-component-list) 目录测试。创建 **packages** 目录与子目录（这里为 **cool-package**）：

```sh
# npm
mkdir -p packages/cool-package && cd packages/cool-package && npm init

# yarn
mkdir -p packages/cool-package && cd packages/cool-package && yarn init

# pnpm
mkdir -p packages/cool-package && cd packages/cool-package && pnpm init

# bun
mkdir -p packages/cool-package && cd packages/cool-package && bun init -y
```

添加 **index.js**：

```js index.js
export const greeting = 'Hello!';
```

### 使用包

把 **cool-package** 作为依赖添加到应用中，使用"包的当前状态"而不是版本 —— 即 `"cool-package": "*"`：

```json package.json
{
  "name": "cool-app",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "cool-package": "*",
    "expo": "~58.0.0",
    "expo-status-bar": "~55.0.0",
    "react": "19.3.0",
    "react-native": "0.88"
  }
}
```

Bun、npm 与 pnpm 可以用 `"workspace:*"` 代替 `"*"`，确保工作区包永远不会解析到 npm 上同名的已发布包 —— 这是可选的。

再次从根目录安装依赖，然后编辑 **App.js** 测试：

```jsx App.js
import { greeting } from 'cool-package';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{greeting}</Text>
      <StatusBar style="auto" />
    </View>
  );
}
```

## 常见问题

monorepo 可能导致普通项目中不存在的解析与依赖问题，需要更深入的知识与特定的工具配置。

### 使用隔离依赖的包管理器

:::note
从 **SDK 54** 起，Expo 支持隔离依赖（isolated dependencies）与隔离安装。
**SDK 53** 建议禁用隔离依赖，否则可能遇到原生构建错误与依赖冲突。
:::

[Bun](https://bun.com/docs/install/isolated) 与 [pnpm](https://pnpm.io/settings#nodelinker) 对隔离安装有一等支持（pnpm 默认启用，除非禁用）。使用隔离依赖时，包不会从嵌套的 `node_modules` 提升（hoist）；而是创建一个中央目录并链接到它，强制包只能访问显式声明的依赖 —— 比传统的**提升**策略（npm 与 Yarn 的默认方式，把依赖扁平化）更严格。

提升的一个副作用是：你可能意外依赖了没有列在自己 `dependencies`/`peerDependencies` 中的模块。这会导致不确定的行为与脆弱的依赖链，在更新/升级时产生解析错误 —— 在 monorepo 中尤其常见。

从 SDK 54 起，Expo 支持隔离依赖，但并非所有包都能工作；一些 React Native 库可能导致构建或解析错误。如果 pnpm 隔离安装引发问题，通过根 **pnpm-workspace.yaml** 中的 `nodeLinker` 切换到**提升**策略：

```yaml pnpm-workspace.yaml
nodeLinker: hoisted
```

### monorepo 中的重复原生包

Expo 对隔离模块等更完整的 **node_modules** 模式改进了支持，但重复仍然可能导致问题：

- 单个 monorepo 中重复的 React Native 版本不受支持
- 单个应用中的重复 React 版本会导致运行时错误
- 重复版本的 Turbo 与 Expo 模块可能导致运行时或构建错误

检查是否存在多个版本（例如 `react-native`）以及它们为何被安装：

```sh
# npm
npm why react-native

# yarn
yarn why react-native

# pnpm
pnpm why --depth=10 react-native

# bun
bun pm why react-native
```

输出因包管理器而异；通过寻找多个版本来发现重复，例如同时出现 `react-native@0.79.5` 与 `react-native@0.81.0`。

#### 为 peer dependencies 添加依赖解析（resolutions）

如果无法通过更改依赖解决重复，添加一个 resolution —— 例如有些包还没为 React 19 更新 **peerDependencies**，强制使用单一的 `react` 版本：

```json package.json
{
  "name": "monorepo",
  "private": true,
  "version": "0.0.0",
  "workspaces": ["apps/*", "packages/*"],
  "resolutions": {
    "react": "^19.3.0"
  }
}
```

对于 [npm](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides)，使用 `overrides` 而不是 `resolutions`。

#### 去重自动链接的原生模块

重复通常不造成问题，但原生模块绝不能重复，因为每个应用构建只能编译一个版本。与 JS 依赖不同，原生构建无法包含同一个原生模块的两个冲突版本。

从 **SDK 54** 起，在 **app.json** 中把 `experiments.autolinkingModuleResolution` 设为 `true`，即可自动对 Expo CLI 与 Metro 应用 autolinking，强制 Metro 解析出的依赖与[autolinking](/modules/autolinking)链接的原生模块一致。从 **SDK 55** 起，monorepo 中的应用会自动启用。

非原生包（例如创建 React context 的库）在重复时也可能出问题；参见[检查不是原生模块的包](/modules/autolinking)。

#### 包含 TV 项目的 monorepo

当 TV 项目与其他 Expo 项目共享 monorepo 时，对 `react-native` 依赖有特殊要求；参见[构建 TV 应用](/guides/building-for-tv)的依赖章节。

### 脚本 "..." 不存在

React Native 附带 JavaScript 与原生文件；原生文件必须被链接，例如 **android/app/build.Gradle** 中的 [**react-native/react.Gradle**](https://github.com/facebook/react-native/blob/v0.70.6/react.gradle)。路径通常是硬编码的：

**Android**（[来源](https://github.com/facebook/react-native/blob/e918362be3cb03ae9dee3b8d50a240c599f6723f/template/android/app/build.gradle#L84)）

```groovy
apply from: "../../node_modules/react-native/react.gradle"
```

**iOS**（[来源](https://github.com/facebook/react-native/blob/e918362be3cb03ae9dee3b8d50a240c599f6723f/template/ios/Podfile#L1)）

```ruby
require_relative '../node_modules/react-native/scripts/react_native_pods'
```

由于[提升](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/)，monorepo 中的该路径可能不同，而且它不使用 [Node 模块解析](https://nodejs.org/api/modules.html#all-together)。改用 Node 定位包：

**Android**（[来源](https://github.com/expo/expo/blob/6877c1f5cdca62b395b0d5f49d87f2f3dbb50bec/templates/expo-template-bare-minimum/android/app/build.gradle#L87)）

```groovy
apply from: new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim(), "../react.gradle")
```

**iOS**（[来源](https://github.com/expo/expo/blob/61cbd9a5092af319b44c319f7d51e4093210e81b/templates/expo-template-bare-minimum/ios/Podfile#L2)）

```ruby
require File.join(File.dirname(`node --print "require.resolve('react-native/package.json')"`), "scripts/react_native_pods")
```

这些代码片段使用 Node 的 [`require.resolve()`](https://nodejs.org/api/modules.html#requireresolverequest-options)，引用 `package.json` 找到包根而不是入口点，从而解析出预期的相对路径。[了解更多关于这些引用的信息](https://github.com/expo/expo/blob/main/packages/expo-modules-core/README.md)。

所有 Expo SDK 模块与模板都使用这些动态引用，可与 monorepo 配合工作。偶尔有包仍然硬编码路径 —— 用 [`patch-package`](https://github.com/ds300/patch-package#readme) 手动修改，或告知维护者。
