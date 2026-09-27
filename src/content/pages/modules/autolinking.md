---
title: 自动链接
description: 了解如何使用 Expo 自动链接，在 Expo 项目中自动链接原生依赖。
---

# 自动链接

通常，在开发原生移动应用并想安装第三方库时，你会被要求把依赖添加到包管理器的清单文件中（Android 上的 **build.gradle**、iOS 上 CocoaPods 的 **Podfile**、iOS 上 SwiftPM 的 **Package.swift**）。
在 Expo 和 React Native 中，你已经通过从 [npm](https://www.npmjs.com) 注册表安装包，在 **package.json** 文件中完成了这件事。由于大多数 React Native 库都带有一些原生（平台特定）代码，安装一个库甚至可能需要配置多达三个不同的包管理器！

Expo 自动链接是一种自动化此过程的机制，把库的安装过程减少到最低限度——通常只需从 `npm` 安装包并重新运行 `pod install`。
核心实现位于 [`expo-modules-autolinking`](https://github.com/expo/expo/tree/main/packages/expo-modules-autolinking) 包中，分为三个部分：

1. 带有模块解析算法的 CLI 命令
2. 与 Android 的 Gradle 构建系统集成的代码
3. 与 iOS 的 CocoaPods 集成的代码

Expo 自动链接会同时链接 Expo 模块和 React Native 模块。如果要改用 React Native community CLI 的自动链接，请参阅[为 React Native 模块停用 Expo 自动链接](#为-react-native-模块停用-expo-自动链接)一节。

## 链接行为

Expo 自动链接集成到 Android 的 Gradle 构建系统和 iOS 的 CocoaPods 中。构建应用时，会调用 Expo 自动链接 CLI，搜索要自动链接的 Expo 和 React Native 模块。

此模块解析分四个独立步骤搜索候选依赖：

1. 仅针对 React Native 模块，它会考虑项目根目录 **react-native.config.js** 的 `dependencies` 中包含显式 `root` 路径的项。此文件是可选的，大多数 Expo 项目中并不存在。
2. 它会搜索自动链接配置的 `searchPaths` 选项中指定的所有目录。
3. 它会在自动链接配置的 `nativeModulesDir` 选项所指定的目录中搜索本地模块，该选项默认为 `./modules/`。
4. 它会递归解析应用的依赖以及任何依赖或 peer 依赖。这与 [Node.js 解析算法](https://nodejs.org/api/modules.html#loading-from-node_modules-folders)一致。

自动链接的模块会被自动加入构建，这通常意味着包含原生（平台特定）代码的应用依赖会自动完成设置。

## 配置

可以使用一些配置选项自定义模块解析的行为。这些选项可以定义在三个不同的位置，优先级从低到高为：

- 应用 **package.json** 中的 `expo.autolinking` 配置对象
- 使用 `expo.autolinking.android`、`expo.autolinking.ios` 和 `expo.autolinking.apple` 对象按平台覆盖（当缺少 `apple` 时，`apple` 会回退到 `ios`）
- 提供给 CLI 命令的选项、**Podfile** 中的 `use_expo_modules!` 方法，或 **settings.gradle** 中的 `useExpoModules` 函数

### `searchPaths`

相对于应用根目录的路径列表，Expo 自动链接应在这些路径中搜索要自动链接的模块。
当你的项目结构是自定义的，或者想从 **node_modules** 以外的目录链接本地包时，这很有用。
你指定的路径仍然必须具有类似 **node_modules** 目录的结构。

```json package.json
{
  "expo": {
    "autolinking": {
      "searchPaths": ["../../packages"]
    }
  }
}
```

:::note
在 **SDK 54** 之前，此列表默认是应用的 **node_modules** 目录，以及 monorepo 中它之上的所有 **node_modules** 目录。
要恢复旧行为，请把此列表设置为应用的 **node_modules** 目录，例如：`["../../node_modules", "./node_modules"]`。
:::

### `nativeModulesDir`

相对于应用根目录的路径，Expo 自动链接应在该路径中搜索要自动链接的本地模块。此选项默认为 `"./modules"`。只有在需要更改[本地 Expo 模块](/modules/get-started)的路径时，修改此选项才有用。

```json package.json
{
  "expo": {
    "autolinking": {
      "nativeModulesDir": "./modules"
    }
  }
}
```

### `exclude`

要从自动链接中排除的包名列表。如果你不想链接某些特定平台未使用的包以减小二进制体积，这很有用。
**package.json** 中的以下配置会在 Android 上把 `expo-random` 和 `third-party-expo-module` 排除在自动链接之外：

```json package.json
{
  "expo": {
    "autolinking": {
      "android": {
        "exclude": ["expo-random", "third-party-expo-module"]
      }
    }
  }
}
```

也可以通过在项目根目录创建 **react-native.config.js**，并把模块应被排除的平台配置设为 `null`，来排除 React Native 模块。以下配置会在 Android 上把 `library-name` 排除在自动链接之外：

```js react-native.config.js
module.exports = {
  dependencies: {
    'library-name': {
      platforms: {
        android: null,
      },
    },
  },
};
```

:::note
在 **SDK 54** 之前，`exclude` 选项只适用于 Expo 模块，不适用于 React Native 模块。React Native 模块只能使用项目根目录中的 **react-native.config.js** 文件来排除。
:::

### `include`

:::note
在 **SDK 55 及更高版本**中可用。
:::

要额外进行去重校验的包名列表。对于即使不是原生模块、也不应因单例或内部状态而被重复安装的工具库，这很有用。何时使用此选项，请参阅[检查不是原生模块的包](#检查不是原生模块的包)。

```json package.json
{
  "expo": {
    "autolinking": {
      "include": ["third-party-library"]
    }
  }
}
```

与其他选项不同，按平台的 `include` 列表会与根列表合并，而不是覆盖。下面的配置会在每个平台上校验一个第三方库，并额外只在 Android 上检查一个平台特定的库：

```json package.json
{
  "expo": {
    "autolinking": {
      "include": ["third-party-library"],
      "android": {
        "include": ["third-party-android-library"]
      }
    }
  }
}
```

此列表中的包不会被链接进原生构建。它们只会被加入重复检查；当启用 `experiments.autolinkingModuleResolution` 时，也会加入 Metro 的模块解析。

### `flags`

> 支持平台：iOS。

传递给每个自动链接 pod 的 CocoaPods 标志。大多数开发者可能只想使用 `inhibit_warnings`，以抑制编译自动链接模块时 Xcode 产生的警告。
可用标志请参阅 [CocoaPods Podfile 文档](https://guides.cocoapods.org/syntax/podfile.html#pod)。

:::tabs
:::tab Podfile
```ruby
use_expo_modules!({
  flags: {
    :inhibit_warnings => false
  }
})
```
:::
:::tab package.json
```json
{
  "expo": {
    "autolinking": {
      "ios": {
        "flags": {
          "inhibit_warnings": true
        }
      }
    }
  }
}
```
:::
:::

### `buildFromSource`

> 支持平台：Android。

要退出预构建 Expo 模块的包名列表。完整参考请参阅[适用于 Android 的预构建 Expo 模块](/guides/prebuilt-expo-modules)中的“通过 Expo Autolinking 禁用特定模块”。

### `legacy_shallowReactNativeLinking`

解析应用的 React Native 模块时，Expo 自动链接会搜索应用的依赖，并递归搜索这些依赖的依赖（与 [Node.js 解析算法](https://nodejs.org/api/modules.html#loading-from-node_modules-folders)一致）。在 **SDK 54** 之前，Expo 自动链接不会递归搜索依赖，只解析应用的直接依赖。

启用此标志会退出新行为，并恢复 **SDK 54** 之前的行为，只在应用的直接依赖中搜索 React Native 模块。解析 Expo 模块时不会考虑此选项。

## CLI 命令

### `search`

构建系统在自动链接的第一阶段调用此命令来解析 Expo 模块。它的实现在所有平台之间共享。如果发现了重复项，`search` 的输出会包含每个包的 `duplicates` 列表。

:::tabs
:::tab npm
```sh
$ npx expo-modules-autolinking search
```
:::
:::tab yarn
```sh
$ yarn dlx expo-modules-autolinking search
```
:::
:::tab pnpm
```sh
$ pnpm dlx expo-modules-autolinking search
```
:::
:::tab bun
```sh
$ bunx expo-modules-autolinking search
```
:::
:::

上面的命令会以 JSON 格式返回一个对象，其中包含 Expo 自动链接找到的 Expo 模块：

```json
{
  "expo-random": {
    "path": "/absolute/path/to/node_modules/expo-random",
    "version": "13.0.0",
    "config": {
      // `expo-module.config.json` 的内容
    },
    "duplicates": [
      // 此模块冲突的重复项列表（优先级较低）
    ]
  }
  // 更多模块...
}
```

### `resolve`

构建系统在自动链接的第二阶段调用此命令。它会为每个 Expo 模块输出一个包含更多（平台特定）细节的对象，例如 **build.gradle** 或 podspec 文件的路径，以及要链接的模块类。

:::tabs
:::tab npm
```sh
$ npx expo-modules-autolinking resolve --platform <apple|android>
```
:::
:::tab yarn
```sh
$ yarn dlx expo-modules-autolinking resolve --platform <apple|android>
```
:::
:::tab pnpm
```sh
$ pnpm dlx expo-modules-autolinking resolve --platform <apple|android>
```
:::
:::tab bun
```sh
$ bunx expo-modules-autolinking resolve --platform <apple|android>
```
:::
:::

例如，使用 `--platform apple` 选项时，它会以 JSON 格式返回一个对象，其中包含模块数组以及为该平台解析出的细节：

```json
{
  "modules": [
    {
      "packageName": "expo-random",
      "packageVersion": "13.0.0",
      "pods": [
        {
          "podName": "ExpoRandom",
          "podspecDir": "/absolute/path/to/node_modules/expo-random/ios"
        }
      ],
      "swiftModuleNames": ["ExpoRandom"],
      "modules": ["RandomModule"],
      "appDelegateSubscribers": [],
      "reactDelegateHandlers": [],
      "debugOnly": false
    }
    // 更多模块...
  ]
}
```

### `verify`

通过检查重复项来验证已自动链接的原生模块。每个冲突的重复安装都会显示警告。

:::tabs
:::tab npm
```sh
$ npx expo-modules-autolinking verify
```
:::
:::tab yarn
```sh
$ yarn dlx expo-modules-autolinking verify
```
:::
:::tab pnpm
```sh
$ pnpm dlx expo-modules-autolinking verify
```
:::
:::tab bun
```sh
$ bunx expo-modules-autolinking verify
```
:::
:::

传入 `--verbose` 选项可列出所有已自动链接的原生模块。

### `react-native-config`

构建系统在自动链接 React Native 模块时调用此命令。它会为每个 React Native 模块输出一个包含更多平台特定细节的对象，例如 gradle 或 podspec 文件的路径。

:::tabs
:::tab npm
```sh
$ npx expo-modules-autolinking react-native-config
```
:::
:::tab yarn
```sh
$ yarn dlx expo-modules-autolinking react-native-config
```
:::
:::tab pnpm
```sh
$ pnpm dlx expo-modules-autolinking react-native-config
```
:::
:::tab bun
```sh
$ bunx expo-modules-autolinking react-native-config
```
:::
:::

例如，使用 `--platform ios` 选项时，它会以 **react-native.config.js** 的输出格式返回一个对象，其中包含每个 React Native 依赖的信息以及 React Native 安装路径。

```json
{
  "root": "/absolute/path/to",
  "reactNativePath": "/absolute/path/to/node_modules/react-native",
  "dependencies": {
    "@react-native-async-storage/async-storage": {
      "root": "/absolute/path/to/node_modules/@react-native-async-storage/async-storage",
      "name": "@react-native-async-storage/async-storage",
      "platforms": {
        "ios": {
          "podspecPath": "/absolute/path/to/node_modules/@react-native-async-storage/async-storage/RNCAsyncStorage.podspec",
          "version": "",
          "configurations": [],
          "scriptPhases": []
        }
      }
    }
    // 更多模块...
  }
}
```

## 依赖解析与冲突

自动链接和 Node 解析的目标不同，Node 和 Metro 中的模块解析算法有时会相互冲突。如果应用包含被自动链接选中的原生模块的重复安装，JavaScript bundle 可能同时包含该原生模块的两个版本，而自动链接和原生应用只会包含一个版本。这可能导致运行时崩溃，并带来不兼容的风险。

这在隔离依赖或 monorepo 中尤其常见，你应该[检查并去除依赖中的重复原生模块](/guides/monorepos#monorepo-中的重复原生包)。

### 查找重复的包

[`expo-doctor`](/develop/tools#expo-doctor) 会列出项目中每一个重复的原生模块，以及每次安装的路径：

:::tabs
:::tab npm
```sh
$ npx expo-doctor
```
:::
:::tab yarn
```sh
$ yarn dlx expo-doctor
```
:::
:::tab pnpm
```sh
$ pnpm dlx expo-doctor
```
:::
:::tab bun
```sh
$ bunx expo-doctor
```
:::
:::

[`verify`](#verify) 命令会报告相同的重复项，而不会运行其他项目检查。去除依赖重复是完整的修复方法。各包管理器的步骤请参阅[解决依赖问题](https://expo.fyi/resolving-dependency-issues)。

### 绕过重复项

从 **SDK 54** 起，可以在[应用配置](/workflow/configuration)中把 `experiments.autolinkingModuleResolution` 设为 `true`，以便自动把自动链接应用到 Expo CLI 和 Metro 打包器。这会强制 Metro 解析到的依赖与**自动链接**解析到的原生模块一致。

```json app.json
{
  "expo": {
    "experiments": {
      "autolinkingModuleResolution": true
    }
  }
}
```

从 **SDK 55** 起，monorepo 中的应用默认启用 `experiments.autolinkingModuleResolution` 标志。

重复安装仍然留在 **node_modules** 目录中，因此此标志是一种变通办法，不能替代去除依赖重复。对无法移除的重复项使用它。

### 检查不是原生模块的包

重复检查和 `experiments.autolinkingModuleResolution` 作用于自动链接解析到的原生模块，再加上一份不得重复的内置包列表。不是原生模块的包在被重复安装时也可能出问题。创建 React context 或在模块级变量中保存状态的库就是常见例子。

把这些包添加到 [`include`](#include) 选项中，以便以同样的方式处理它们：

```json package.json
{
  "expo": {
    "autolinking": {
      "include": ["third-party-library"]
    }
  }
}
```

现在 `npx expo-doctor` 和 `verify` 命令会报告 `third-party-library` 的重复项。打包时，`experiments.autolinkingModuleResolution` 会把该包解析为单一副本。不会向原生构建添加任何内容，因此列出一个不包含原生代码的包是安全的。

## 常见问题

### 如何在我的应用中设置自动链接？

使用 `npx create-expo-app` 命令创建的所有项目都已经配置为使用 Expo 自动链接。如果项目是用其他工具创建的，请参阅[安装 Expo 模块](/bare/installing-expo-modules)，确保项目包含所有必要的更改。

### 要让模块可自动链接，模块中需要有什么？

模块解析算法只搜索根目录中、紧挨 **package.json** 文件、包含 [Expo 模块配置](/modules/module-config)文件（**expo-module.config.json**）的包。
还必须在 `platforms` 数组中包含受支持的平台——如果运行自动链接算法的平台不在此数组中，它就会在搜索结果中被跳过。

### 它与 React Native community CLI 自动链接有何不同？

- Expo 自动链接内置支持 monorepo、包管理器 workspace、传递依赖和隔离依赖安装。
- 它也明显更快，尽管模块解析算法更复杂，以便更可靠并匹配 Node.js 的模块解析。
- Expo 模块解析还能检测重复依赖，这是 monorepo 中的常见问题。
- 最后，它与 Expo Modules API 提供的功能集成良好，并支持 React Native 模块。

### 为 React Native 模块停用 Expo 自动链接

从 SDK 52 开始，Expo 自动链接默认取代 React Native community CLI 的自动链接。如果希望改用 React Native community CLI 的自动链接，请设置环境变量 `EXPO_USE_COMMUNITY_AUTOLINKING=1`，并把 `@react-native-community/cli` 添加为项目的开发依赖。

设置此环境变量后，Expo 自动链接将不再用于解析 React Native 模块，但会继续自动链接 Expo 模块。
