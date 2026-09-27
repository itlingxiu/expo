---
title: 使用 patch-project
description: 了解如何使用 patch-project 生成、应用并保留 Expo 项目中的原生改动。
---

# 使用 patch-project

`patch-project` 是一个 Expo 配置插件和命令行界面（CLI）工具，它会在运行 `npx expo prebuild` 后生成并应用补丁，以保留你的原生改动。对于希望保留自定义改动、但又不想学习如何编写配置插件的原生应用开发者来说，这个工具非常有用——它会自动生成一套可与[持续原生生成（CNG）](/workflow/continuous-native-generation)配合使用的解决方案。

本指南将介绍如何使用 `patch-project`、何时使用它，以及它的局限性。

## patch-project 的工作原理

`patch-project` 采用了一种受 Git 启发的方案来生成并自动应用补丁。在你的项目中使用这个命令行工具需要以下步骤：

### 安装

首先，你需要在项目中安装该工具：

:::tabs
:::tab npm
```sh
npx expo install patch-project
```
:::
:::tab yarn
```sh
yarn expo install patch-project
```
:::
:::tab pnpm
```sh
pnpm expo install patch-project
```
:::
:::tab bun
```sh
bun expo install patch-project
```
:::
:::

这条命令会自动将 `patch-project` 配置插件添加到你的[应用配置](/workflow/configuration)中：

```json app.json
{
  "expo": {
    "plugins": [
      "patch-project"
      /* @hide  ...*/ /* @end */
    ]
  }
}
```

### 从现有自定义改动生成补丁

假设你已经手动修改了项目中的原生目录（**android** 和 **ios**）。要为这些原生目录生成补丁，可以运行以下命令：

:::tabs
:::tab npm
```sh
npx patch-project
```
:::
:::tab yarn
```sh
yarn dlx patch-project
```
:::
:::tab pnpm
```sh
pnpm dlx patch-project
```
:::
:::tab bun
```sh
bunx patch-project
```
:::
:::

:::note
如果你只想为某个特定平台生成补丁，可以使用 `--platform` 选项，运行 `npx patch-project --platform android` 或 `npx patch-project --platform ios`。
:::

生成的补丁会保存在 **cng-patches** 目录中。

```text
.
├── app.json                                          # 已配置 patch-project 插件
├── cng-patches/
│   ├── android+eee880ad7b07965271d2323f7057a2b4.patch  # android 目录的补丁
│   └── ios+eee880ad7b07965271d2323f7057a2b4.patch      # ios 目录的补丁
├── package.json
└── ...                                               # 其他项目文件
```

每个补丁文件都会以平台名称开头，后跟一个校验值。例如：

```bash
ios+eee880ad7b07965271d2323f7057a2b4.patch
```

### 在预构建期间应用补丁

生成补丁之后，当你随后运行 `npx expo prebuild` 命令时，这些补丁会被自动应用。`patch-project` 配置插件会检测到现有补丁并应用它们，从而恢复你的自定义改动。

## 何时使用 patch-project

你可以在以下场景中使用 `patch-project`：

- **迁移现有 React Native 应用**：当应用非常复杂、包含大量原生自定义改动，而将这些改动重新实现为配置插件又非常耗时时。
- **保留手动改动**：在 Expo 项目中过渡到采用持续原生生成（CNG）的过程中，保留对 **android** 和/或 **ios** 目录所做的手动修改。
- **快速原型验证**：当你需要在编写配置插件之前先测试原生改动时。
- **补丁自动应用**：后续运行 `npx expo prebuild` 命令时补丁会被自动应用。与 `patch-package`（常用于为 npm 库生成补丁）这类工具相比，这是一个优势——后者不会在预构建过程中保留并自动应用补丁。

## 局限性与注意事项

在升级 Expo SDK 版本时，补丁可能会失效，原因如下：

- **模板和/或文件结构变化**：预构建模板会随 SDK 版本的更新不断演进，原生目录中会有新的改动和文件更新。这会影响 **cng-patches** 目录中已生成的 diff，使其可能不再适用。
- **插件冲突**：当其他插件修改了相同的文件时，CNG 补丁可能会很危险，甚至出错。例如，如果你添加了一个会更新 **MainApplication.kt** 的新插件，而它与你的现有补丁相冲突，那么补丁可能无法再正确应用。在这种情况下，你可能需要重新生成补丁。
- **iOS .pbxproj 变化**：在 iOS 项目中，对 **.pbxproj** 文件应用补丁可能非常脆弱，因为这个文件包含 UUID，而运行 `npx expo prebuild --clean` 之类的命令会改变这些 ID。例如，如果你要添加 widget 扩展或进行其他项目配置修改，基于补丁的方案可能无法可靠地工作。你可以检查生成的 **cng-patches/ios-\*** 补丁，只保留必要的部分。补丁越精简，应用时失败的风险就越低。

建议在每次 SDK 升级后重新生成补丁。
