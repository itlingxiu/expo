---
title: Expo Modules API：开始使用
description: 了解如何开始使用 Expo Modules API。
---

# Expo Modules API：开始使用

**开始使用 Expo Modules API 有两种方式：** 可以从零初始化一个新模块，也可以把 Expo Modules API 添加到现有模块中。本指南将带你从零创建一个新模块，后者则由[集成到现有库中](/modules/existing-library)介绍。可用选项的完整列表请参阅 [`create-expo-module` 参考](/more/create-expo-module)。

使用 Expo Modules API 创建新模块的两种推荐流程：

- [向现有应用添加新模块](#向现有应用添加新模块)，并用它来测试和开发你的模块。

- 如果你希望在多个项目中复用它，或将其发布到 npm，请[创建带示例项目的新模块](#创建带示例项目的新模块)。

接下来的章节会介绍这两种流程。

## 向现有应用添加新模块

1. **创建本地 Expo 模块**

进入项目目录（包含 **package.json** 文件的那个目录）并运行以下命令。这是创建本地 Expo 模块的推荐方式。

:::tabs
:::tab npm
```sh
$ npx create-expo-module@latest --local
```
:::
:::tab yarn
```sh
$ yarn create expo-module --local
```
:::
:::tab pnpm
```sh
$ pnpm create expo-module --local
```
:::
:::tab bun
```sh
$ bun create expo-module --local
```
:::
:::

可以在 CLI 提示中提供一个有意义的模块名。其余提示也可以接受默认建议。

运行命令后，项目中会出现一个名为 **modules** 的新目录。目录结构应如下所示：

```text
modules/my-module
modules/my-module/android/
modules/my-module/ios/
modules/my-module/src/
modules/my-module/expo-module.config.json
modules/my-module/index.ts
```

然后，如果项目还没有生成原生项目（**android** 和 **ios** 目录），请运行以下命令，否则跳过此命令：

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

:::note
如果项目根目录中已有通过 `npx expo prebuild` 创建的 **ios** 目录，必须重新安装 pods：

```sh
$ npx pod-install
```
:::

2. **使用本地模块**

在应用中导入本地模块，例如在 **App.js**、**App.tsx** 或 **src/app/index.tsx** 中：

```tsx src/app/index.tsx
/* @hide 省略 ... */ /* @end */
import MyModule from '@/modules/my-module';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      /* @info 在组件中返回原生方法的结果。 */
      <Text>{MyModule.hello()}</Text>
      /* @end */
    </View>
  );
}
```

在终端中启动开发服务器，这样当你在下一步编辑原生模块并构建应用时，更改会反映到应用中：

:::tabs
:::tab npm
```sh
$ npx expo start
```
:::
:::tab yarn
```sh
$ yarn expo start
```
:::
:::tab pnpm
```sh
$ pnpm expo start
```
:::
:::tab bun
```sh
$ bun expo start
```
:::
:::

恭喜！你已经创建了一个本地 Expo 模块。现在可以开始开发它了。

:::tip
也可以[通过应用这些配置更改](https://expo.fyi/absolute-path-expo-modules.md)使用绝对导入路径。
:::

3. **编辑模块**

要在本地开发和测试模块，我们使用 Android Studio 和 Xcode 分别处理 Android 和 iOS。

**Android**

1. 在 Android Studio 中打开项目里的 **android** 目录（由第 1 步中的 `npx expo prebuild` 生成）。Gradle 同步原生目录项目可能需要一段时间。
2. 项目同步完成后，打开 **modules/my-module/android/src/main/java/expo/modules/mymodule/MyModule.kt** 文件。
3. 把 `hello` 函数改为返回不同的字符串，例如 "Hello world! 🌎🤖"，然后保存文件。
4. 点击顶部菜单栏的 **Run 'app'** 按钮构建应用，你就会在屏幕上看到更改。

每次修改原生代码后，都必须重复构建步骤才能看到这些更改。

**iOS**

1. 运行 `xed ios` 命令，在 Xcode 中打开项目里的 **ios** 目录（由第 1 步中的 `npx expo prebuild` 生成）。
2. 在 **Pods** > **Development Pods** > **MyModule** 下打开 **MyModule.swift** 文件。
3. 把 `hello` 函数改为返回不同的字符串，例如 "Hello world! 🌎🍎"，然后保存文件。
4. 点击顶部菜单栏的 **Run** 按钮，或按 **⌘ Cmd** + **R** 构建应用，你就会在屏幕上看到更改。

每次修改原生代码后，都必须重复构建步骤才能看到这些更改。

:::tip
如果向模块添加了新的原生文件，或修改了 **expo-module.config.json**，请使用 `npx pod-install` 重新安装 pods。
:::

:::note
还有其他与应用并行开发 Expo 模块的流程。例如，可以使用 Monorepo 或发布到 npm，如[如何使用独立 Expo 模块](/modules/use-standalone-expo-module-in-your-project)指南所述。
:::

## 创建带示例项目的新模块

1. **创建 Expo 模块**

要从零创建一个新的 Expo 模块，请按如下方式运行 `create-expo-module` 脚本。
脚本会问你几个问题，然后生成原生 Expo 模块，以及使用你的新模块的 Android 和 iOS 示例应用。

:::tabs
:::tab npm
```sh
$ npx create-expo-module@latest my-module
```
:::
:::tab yarn
```sh
$ yarn create expo-module my-module
```
:::
:::tab pnpm
```sh
$ pnpm create expo-module my-module
```
:::
:::tab bun
```sh
$ bun create expo-module my-module
```
:::
:::

2. **打开模块并启动开发服务器**

进入模块目录，然后运行以下命令打开 Android 和/或 iOS 示例项目：

:::tabs
:::tab npm
```sh
$ cd my-module
$ npm run open:android
$ npm run open:ios
```
:::
:::tab yarn
```sh
$ cd my-module
$ yarn run open:android
$ yarn run open:ios
```
:::
:::tab pnpm
```sh
$ cd my-module
$ pnpm run open:android
$ pnpm run open:ios
```
:::
:::tab bun
```sh
$ cd my-module
$ bun run open:android
$ bun run open:ios
```
:::
:::

进入 **example** 目录，并在终端中启动开发服务器，这样当你在下一步编辑原生模块并构建应用时，更改会反映到应用中：

:::tabs
:::tab npm
```sh
$ cd example
$ npx expo start
```
:::
:::tab yarn
```sh
$ cd example
$ yarn expo start
```
:::
:::tab pnpm
```sh
$ cd example
$ pnpm expo start
```
:::
:::tab bun
```sh
$ cd example
$ bun expo start
```
:::
:::

:::note
如果使用 Windows，可以通过在 Android Studio 中打开 **android** 目录来打开示例项目，但无法打开 iOS 项目文件。
:::

3. **编辑模块**

**Android**

1. 打开 **my-module/android/src/main/java/expo/modules/mymodule/MyModule.kt** 文件。
2. 把 `hello` 函数改为返回不同的字符串，例如 "Hello world! 🌎🤖"，然后保存文件。
3. 点击顶部菜单栏的 **Run 'app'** 按钮构建应用，你就会在屏幕上看到更改。

每次修改原生代码后，都必须重复构建步骤才能看到这些更改。

**iOS**

1. 在 **Pods** > **Development Pods** > **MyModule** 下打开 **MyModule.swift** 文件。
2. 把 `hello` 函数改为返回不同的字符串，例如 "Hello world! 🌎🍎"，然后保存文件。
3. 点击顶部菜单栏的 **Run** 按钮，或按 **⌘ Cmd** + **R** 构建应用，你就会在屏幕上看到更改。

每次修改原生代码后，都必须重复构建步骤才能看到这些更改。

:::tip
如果向模块添加了新的原生文件，或修改了 **expo-module.config.json**，请使用 `npx pod-install` 重新安装 pods。
:::

## 下一步

现在你已经了解如何初始化模块并对其进行简单修改，可以继续学习教程，或直接深入 API 参考。

- [教程：创建原生模块](/modules/native-module-tutorial) — 使用 Expo Modules API 创建用于持久化设置的原生模块的教程。
- [Expo Modules API 参考](/modules/module-api) — 使用 Swift 和 Kotlin 创建原生模块的参考。
