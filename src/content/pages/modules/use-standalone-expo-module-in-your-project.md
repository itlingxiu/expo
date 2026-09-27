---
title: 如何使用独立 Expo 模块
description: 了解如何通过 monorepo 或把包发布到 npm，在项目中使用由 create-expo-module 创建的独立模块。
---

# 如何使用独立 Expo 模块

在现有项目中**创建 Expo 模块的推荐方式**在 [Expo Modules API：开始使用](/modules/get-started)指南中介绍。本教程说明在现有项目中使用由 `create-expo-module` 创建的模块的另外两种方法：

- [配置 monorepo](#使用-monorepo)
- [把模块发布到 npm](#把模块发布到-npm)

如果你仍然希望把模块与应用分开，或与其他开发者共享，这些方法会很有用。

## 使用 monorepo

项目应使用以下结构：

- **apps**：用于存放多个项目（包括 React Native 应用）的目录。
- **packages**：用于存放应用所使用的不同包的目录。
- **package.json**：根包文件，包含 Yarn workspaces 配置。

:::note
要了解如何把项目配置为 monorepo，请参阅[使用 monorepo](/guides/monorepos)指南。
:::

1. **初始化新模块**

设置好基本的 monorepo 结构后，使用 `create-expo-module` 并加上 `--no-example` 标志来创建新模块，以跳过创建示例应用：

:::tabs
:::tab npm
```sh
$ npx create-expo-module packages/expo-settings --no-example
```
:::
:::tab yarn
```sh
$ yarn create expo-module packages/expo-settings --no-example
```
:::
:::tab pnpm
```sh
$ pnpm create expo-module packages/expo-settings --no-example
```
:::
:::tab bun
```sh
$ bun create expo-module packages/expo-settings --no-example
```
:::
:::

2. **设置 workspace 依赖**

把 **packages** 中的原生模块添加到应用的依赖中。更新 **apps** 目录中每个将使用该原生模块的应用的 **package.json**，把原生模块添加到现有的 dependencies 条目中：

```json package.json
{
  "dependencies": {
    /* @hide 省略 ... */ /* @end */
    "expo-settings": "*"
    /* @hide 省略 ... */ /* @end */
  }
}
```

3. **运行模块**

运行其中一个应用，确认一切正常。然后在 **packages/expo-settings** 中启动 TypeScript 编译器，以监视更改并重新构建模块的 JavaScript：

:::tabs
:::tab npm
```sh
$ cd packages/expo-settings
$ npm run build
```
:::
:::tab yarn
```sh
$ cd packages/expo-settings
$ yarn run build
```
:::
:::tab pnpm
```sh
$ cd packages/expo-settings
$ pnpm run build
```
:::
:::tab bun
```sh
$ cd packages/expo-settings
$ bun run build
```
:::
:::

打开另一个终端窗口，从 **apps** 目录中选择一个应用，并使用 `--clean` 选项运行 `prebuild` 命令。对 monorepo 中的每个应用重复这些步骤，以便使用新模块。

:::tabs
:::tab npm
```sh
$ npx expo prebuild --clean
```
:::
:::tab yarn
```sh
$ yarn expo prebuild --clean
```
:::
:::tab pnpm
```sh
$ pnpm expo prebuild --clean
```
:::
:::tab bun
```sh
$ bun expo prebuild --clean
```
:::
:::

使用以下命令编译并运行应用：

:::tabs
:::tab npm
```sh
# 在 Android 上运行应用
$ npx expo run:android
# 在 iOS 上运行应用
$ npx expo run:ios
```
:::
:::tab yarn
```sh
# 在 Android 上运行应用
$ yarn expo run:android
# 在 iOS 上运行应用
$ yarn expo run:ios
```
:::
:::tab pnpm
```sh
# 在 Android 上运行应用
$ pnpm expo run:android
# 在 iOS 上运行应用
$ pnpm expo run:ios
```
:::
:::tab bun
```sh
# 在 Android 上运行应用
$ bun expo run:android
# 在 iOS 上运行应用
$ bun expo run:ios
```
:::
:::

现在可以在应用中使用该模块了。要测试它，编辑应用中的 **src/app/index.tsx** 文件，渲染来自 `expo-settings` 模块的文本消息：

```tsx src/app/index.tsx
import React from 'react';
import { Text, View } from 'react-native';
import * as Settings from 'expo-settings';

export default function TabOneScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{Settings.hello()}</Text>
    </View>
  );
}
```

完成此配置后，应用会显示文本 “Hello world! 👋”。

## 把模块发布到 npm

可以按照以下步骤把模块发布到 npm，并在项目中把它作为依赖安装。

1. **初始化新模块**

先用 `create-expo-module` 创建一个新模块。请仔细回答提示，因为你将发布这个库，并为 npm 包选择一个唯一的名称。

:::tabs
:::tab npm
```sh
$ npx create-expo-module expo-settings
```
:::
:::tab yarn
```sh
$ yarn create expo-module expo-settings
```
:::
:::tab pnpm
```sh
$ pnpm create expo-module expo-settings
```
:::
:::tab bun
```sh
$ bun create expo-module expo-settings
```
:::
:::

2. **运行示例项目**

运行其中一个应用，确认一切正常。然后在项目根目录启动 TypeScript 编译器，以监视更改并重新构建模块的 JavaScript：

:::tabs
:::tab npm
```sh
# 在项目根目录运行此命令以启动 TypeScript 编译器
$ npm run build
```
:::
:::tab yarn
```sh
# 在项目根目录运行此命令以启动 TypeScript 编译器
$ yarn run build
```
:::
:::tab pnpm
```sh
# 在项目根目录运行此命令以启动 TypeScript 编译器
$ pnpm run build
```
:::
:::tab bun
```sh
# 在项目根目录运行此命令以启动 TypeScript 编译器
$ bun run build
```
:::
:::

打开另一个终端窗口，编译并运行示例应用：

:::tabs
:::tab npm
```sh
$ cd example
# 在 Android 上运行示例应用
$ npx expo run:android
# 在 iOS 上运行示例应用
$ npx expo run:ios
```
:::
:::tab yarn
```sh
$ cd example
# 在 Android 上运行示例应用
$ yarn expo run:android
# 在 iOS 上运行示例应用
$ yarn expo run:ios
```
:::
:::tab pnpm
```sh
$ cd example
# 在 Android 上运行示例应用
$ pnpm expo run:android
# 在 iOS 上运行示例应用
$ pnpm expo run:ios
```
:::
:::tab bun
```sh
$ cd example
# 在 Android 上运行示例应用
$ bun expo run:android
# 在 iOS 上运行示例应用
$ bun expo run:ios
```
:::
:::

3. **把包发布到 npm**

要把包发布到 npm，需要一个 npm 账户。如果还没有，请在 [npm 网站](https://www.npmjs.com/signup)上创建一个账户。创建账户后，运行以下命令登录：

```sh
$ npm login
```

进入模块根目录，然后运行以下命令发布它：

```sh
$ npm publish
```

模块现在会发布到 npm，可以使用 `npm install` 安装到其他项目中。

除了把模块发布到 npm，还可以用以下方式在项目中使用它：

- **创建 tarball**：使用 `npm pack` 创建模块的 tarball，然后运行 `npm install /path/to/tarball` 在项目中安装它。此方法有助于在发布前在本地测试模块，或与无法访问 npm 注册表的人共享。
- **运行本地 npm 注册表**：使用 [Verdaccio](https://verdaccio.org/) 等工具托管本地 npm 注册表。你可以从该注册表安装模块，这对在公司或组织内管理内部包很有用。
- **发布私有包**：使用[带 EAS Build 的私有注册表](/build-reference/private-npm-packages)安全地管理私有模块。

4. **测试已发布的模块**

要在新项目中测试已发布的模块，创建一个新应用，并运行以下命令把模块作为依赖安装：

:::tabs
:::tab npm
```sh
$ npx create-expo-app@latest my-app
$ cd my-app
$ npx expo install expo-settings
```
:::
:::tab yarn
```sh
$ yarn create expo-app my-app
$ cd my-app
$ yarn expo install expo-settings
```
:::
:::tab pnpm
```sh
$ pnpm create expo-app my-app
$ cd my-app
$ pnpm expo install expo-settings
```
:::
:::tab bun
```sh
$ bun create expo my-app
$ cd my-app
$ bun expo install expo-settings
```
:::
:::

现在可以在应用中使用该模块了！要测试它，编辑 **src/app/index.tsx**，渲染来自 **expo-settings** 的文本消息。

```tsx src/app/index.tsx
import React from 'react';
import * as Settings from 'expo-settings';
import { Text, View } from 'react-native';

export default function TabOneScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{Settings.hello()}</Text>
    </View>
  );
}
```

最后，预构建项目并运行以下命令来运行应用：

:::tabs
:::tab npm
```sh
# 从头重新生成原生项目目录
$ npx expo prebuild --clean
# 在 Android 上运行示例应用
$ npx expo run:android
# 在 iOS 上运行示例应用
$ npx expo run:ios
```
:::
:::tab yarn
```sh
# 从头重新生成原生项目目录
$ yarn expo prebuild --clean
# 在 Android 上运行示例应用
$ yarn expo run:android
# 在 iOS 上运行示例应用
$ yarn expo run:ios
```
:::
:::tab pnpm
```sh
# 从头重新生成原生项目目录
$ pnpm expo prebuild --clean
# 在 Android 上运行示例应用
$ pnpm expo run:android
# 在 iOS 上运行示例应用
$ pnpm expo run:ios
```
:::
:::tab bun
```sh
# 从头重新生成原生项目目录
$ bun expo prebuild --clean
# 在 Android 上运行示例应用
$ bun expo run:android
# 在 iOS 上运行示例应用
$ bun expo run:ios
```
:::
:::

完成此配置后，你会在应用中看到文本 “Hello world! 👋”。

## 下一步

- [封装第三方原生库](/modules/third-party-library) — 了解如何在 Expo 模块中封装第三方原生库。
- [教程：创建原生模块](/modules/native-module-tutorial) — 使用 Expo Modules API 创建用于持久化设置的原生模块的教程。
