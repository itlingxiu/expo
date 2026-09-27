---
title: create-expo-module
description: 用于创建和更新 Expo 模块的命令行工具。
---

# create-expo-module

`create-expo-module` 是一个命令行工具，用于创建新的 Expo 模块，或为现有模块添加平台支持。它可以在 Expo 应用内创建本地模块，也可以创建带示例应用的独立模块，用于开发和测试原生代码。

## 本地模块与独立模块

`create-expo-module` 可以创建两类模块：本地模块和独立模块。

**本地模块**位于单个 Expo 项目内部。当你想为一个应用添加自定义原生代码，并且不需要把它作为单独的包发布或共享时，使用本地模块。本地模块使用应用的依赖和工具链，并由 Expo 自动链接从项目的原生模块目录自动发现。

**独立模块**是它自己的包。当你想在多个应用之间复用该模块、把它放在 monorepo 包中，或发布到 npm 时，使用独立模块。独立模块包含包元数据、自己的依赖和脚本，以及用于开发和测试该模块的示例应用。

## 创建本地模块

要在现有 Expo 项目中创建本地模块，进入项目目录并运行以下命令：

:::tabs
:::tab npm
```sh
npx create-expo-module@latest --local
```
:::
:::tab yarn
```sh
yarn create expo-module --local
```
:::
:::tab pnpm
```sh
pnpm create expo-module --local
```
:::
:::tab bun
```sh
bun create expo-module --local
```
:::
:::

运行上述命令会提示你输入本地模块名称、原生模块名称、目标平台，以及要包含的功能示例。

本地模块默认创建在 **modules** 目录中。如果项目的 **package.json** 定义了 `expo.autolinking.nativeModulesDir`，模块会创建在该目录中。

本地模块包含模块配置、JavaScript 或 TypeScript 源文件，以及所选平台的原生文件。例如，同时支持 Android 和 Apple 的模块包含：

```text
modules/my-module/
modules/my-module/android/
modules/my-module/ios/
modules/my-module/src/
modules/my-module/expo-module.config.json
```

## 创建独立模块

要创建独立的 Expo 模块，运行以下命令：

:::tabs
:::tab npm
```sh
npx create-expo-module@latest my-module
```
:::
:::tab yarn
```sh
yarn create expo-module my-module
```
:::
:::tab pnpm
```sh
pnpm create expo-module my-module
```
:::
:::tab bun
```sh
bun create expo-module my-module
```
:::
:::

运行上述命令会提示包名、原生模块名称、目标平台、功能示例、包元数据和包管理器。它会生成模块和一个 **example** 应用，你可以用它在 Android 和 iOS 上构建并测试该模块。

生成的模块包含包元数据、TypeScript 配置、原生平台文件、模块源文件和一个 **example** 应用。例如，同时支持 Android 和 Apple 的模块包含：

```text
my-module/
my-module/android/
my-module/ios/
my-module/src/
my-module/example/
my-module/expo-module.config.json
my-module/package.json
```

如果模块不是在现有 Git 仓库中创建的，该命令会初始化一个新的 Git 仓库并创建初始提交。

创建 **example** 应用时，该命令会安装依赖并为应用运行预构建。在 macOS 上，它还会为生成的 iOS 项目安装 CocoaPods。

## 开发独立模块

创建独立模块后，进入模块目录并打开生成的原生项目：

:::tabs
:::tab npm
```sh
cd my-module
npm run open:android
npm run open:ios
```
:::
:::tab yarn
```sh
cd my-module
yarn open:android
yarn open:ios
```
:::
:::tab pnpm
```sh
cd my-module
pnpm run open:android
pnpm run open:ios
```
:::
:::tab bun
```sh
cd my-module
bun run open:android
bun run open:ios
```
:::
:::

:::note
`open:ios` 脚本需要 macOS 和 Xcode。在 Windows 上，请在 Android Studio 中打开生成的 **android** 目录。
:::

然后从 **example** 目录启动开发服务器：

```sh
cd example && npx expo start
```

独立模块包含以下脚本：

| 脚本 | 说明 |
| --- | --- |
| `build` | 编译 TypeScript 源文件。 |
| `clean` | 移除生成的构建输出。 |
| `test` | 运行模块测试。 |
| `prepare` | 在发布或打包之前构建包目标。 |
| `open:ios` | 打开生成的 iOS 示例项目。 |
| `open:android` | 打开生成的 Android 示例项目。 |

更改原生代码时，重新构建示例应用才能看到更改。JavaScript 和 TypeScript 更改会被开发服务器拾取。

## 选项

使用以下选项自定义命令的行为。

### `[path]`

在提供的路径创建模块。如果省略，命令使用提示中的名称。

### `--local`

在当前 Expo 项目中创建本地模块。本地模块会跳过安装模块依赖，并且不创建示例应用。

### `--platform`

选择模块应支持的平台。可用值为 `android`、`apple` 和 `web`。

对于本地模块，当应用配置的 [`platforms`](/versions/latest/config/app#platforms) 属性可用时，交互式提示会根据它预选平台。对于独立模块，默认预选所有平台。在非交互模式下，除非提供此选项，否则使用所有平台。

例如，创建同时支持 Android 和 Apple 的模块：

```sh
npx create-expo-module@latest my-module --platform android apple
```

### `--features`

选择要包含在生成模块中的功能示例。功能示例是生成文件中的小型可运行片段，展示如何定义常见的 Expo Modules API 功能。它们旨在为你自己的实现提供起点，而不是声明模块允许支持什么。

可用的功能示例：

| 功能 | 说明 |
| --- | --- |
| `Constant` | 添加由模块导出的原生常量。 |
| `Function` | 添加同步原生函数。 |
| `AsyncFunction` | 添加异步原生函数。 |
| `Event` | 添加模块级事件发射器示例。 |
| `View` | 添加原生视图组件示例。 |
| `ViewEvent` | 添加从原生视图发出的事件。这也会包含 `View` 示例。 |
| `SharedObject` | 添加与 JavaScript 共享的原生对象示例。 |

例如：

```sh
npx create-expo-module@latest my-module --features Function AsyncFunction
```

使用 `all` 包含每个功能示例：

```sh
npx create-expo-module@latest my-module --features all
```

如果不选择任何功能示例，命令会创建一个最小模块。

### `--full-example`

包含所有可用的功能示例。这等价于传入 `--features all`。

### `--package-manager`

选择独立模块使用的包管理器。可用值为 `npm`、`pnpm`、`yarn` 和 `bun`。

如果省略，命令会从当前进程或系统上可用的包管理器检测包管理器。在交互模式下，检测到的包管理器会被预选。

### `--no-example`

跳过为独立模块创建 **example** 应用。

### `--barrel`

为本地模块生成 **index.ts** 桶文件。此选项仅与 `--local` 一起生效。

默认情况下，本地模块不生成桶文件，因此导入直接指向模块 **src** 目录中的文件。

### `--source`

使用本地模板目录，而不是从 npm 下载 **expo-module-template**。传入 **expo-module-template** 包的根目录。

### `--with-readme`

在独立模块中包含 **README.md** 文件。

### `--with-changelog`

在独立模块中包含 **CHANGELOG.md** 文件。

### `--name`

设置原生模块名称，例如 `MyModule`。如果名称与 Apple 框架冲突，命令会重命名它以避免原生构建错误。

### `--description`

设置包元数据中使用的模块描述。

### `--package`

设置 Android 包名，例如 `expo.modules.mymodule`。

### `--author-name`

设置包作者姓名。

### `--author-email`

设置包作者电子邮件地址。

### `--author-url`

设置包作者资料 URL。

### `--repo`

设置包仓库 URL。

### `--license`

设置包许可证。默认是 `MIT`。

### `--module-version`

设置初始包版本。默认是 `0.1.0`。

### `--version`

打印版本号并退出。

### `--help`

打印可用选项列表并退出。

## 非交互模式

`create-expo-module` 在非交互环境中运行时会跳过提示。这包括 CI、`EXPO_NONINTERACTIVE`，以及 stdin 不是 TTY 的终端。

在非交互模式下，未显式传入的值会用默认值填充，并打印为警告。例如，命令可以从目标路径推导包名，并对原生模块名称、Android 包名、描述、许可证和初始版本使用默认值。

当你需要稳定的生成值时，请显式传入选项：

```sh
npx create-expo-module@latest my-module --name MyModule --package expo.modules.mymodule --platform android apple --features Function AsyncFunction --description "My module" --license MIT --module-version 0.1.0
```

对于本地模块，非交互模式也会默认使用所有平台，除非提供了 `--platform`。

`add-platform-support` 命令在非交互模式下需要 `--platform`：

```sh
npx create-expo-module@latest add-platform-support --platform android
```

## 添加平台支持

`add-platform-support` 命令向现有 Expo 模块添加新的平台文件，并更新 **expo-module.config.json**。

:::note
该命令会扫描现有原生模块定义，并尝试检测 `Function`、`AsyncFunction`、`View` 和 `SharedObject` 等功能示例。功能检测是尽力而为。它对遵循通常 Expo Modules API 模式的模块效果很好，但在不寻常的模块、带生成代码的模块，或定义分散在多个文件中的大型模块中，可能无法正确检测功能。使用 `--features` 覆盖检测到的功能示例。
:::

对于原生模块，现有实现需要使用 Expo Modules API DSL，命令才能找到模块定义文件。不支持较旧的模块格式。

从模块根目录运行该命令：

```sh
npx create-expo-module@latest add-platform-support
```

命令会提示你从模块尚未支持的平台中选择。

也可以传入模块路径：

```sh
npx create-expo-module@latest add-platform-support ./packages/my-module
```

该命令只会添加尚未列在 **expo-module.config.json** 中的平台。它不会覆盖现有的原生平台目录，例如 **android** 或 **ios**。

### `add-platform-support --platform`

选择要添加的平台。可用值为 `apple`、`android` 和 `web`。

在非交互模式下，此选项是必需的。在交互模式下，命令会提示你从模块尚未支持的平台中选择。

例如，不经提示添加 Android 支持：

```sh
npx create-expo-module@latest add-platform-support --platform android
```

### `add-platform-support --features`

覆盖为新平台生成文件时使用的功能示例。

如果生成的文件与模块不匹配，请显式传入 `--features`：

```sh
npx create-expo-module@latest add-platform-support --platform android --features Function Event
```

如果没有检测到或提供任何功能，命令会为新平台生成最小脚手架。

### `add-platform-support --source`

使用本地模板目录，而不是从 npm 下载 **expo-module-template**。

## 模板版本

默认情况下，`create-expo-module` 从 npm 下载 **expo-module-template**。

独立模块使用最新模板。本地模块会尝试使用与当前项目中安装的 Expo SDK 版本匹配的模板版本，当无法检测 SDK 版本时回退到最新模板。

要测试 beta 版本，在运行命令前设置 `EXPO_BETA=1`：

```sh
EXPO_BETA=1 npx create-expo-module@latest my-module
```

## 环境变量

### `EXPO_BETA`

使用模块和示例应用模板的下一个版本。

### `EXPO_DEBUG`

为命令启用调试日志。

### `EXPO_NO_TELEMETRY`

禁用遥测。

### `EXPO_NONINTERACTIVE`

以非交互模式运行命令并跳过提示。

## 了解更多

- **[Expo Modules API：入门](/modules/get-started)**：了解如何创建和使用本地及独立 Expo 模块。
- **[expo-module.config.json](/modules/module-config)**：了解 Expo 自动链接使用的模块配置文件。
- **[如何使用独立 Expo 模块](/modules/use-standalone-expo-module-in-your-project)**：了解如何在 monorepo 中使用独立模块，以及如何把它们发布到 npm。
