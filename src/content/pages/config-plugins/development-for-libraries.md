---
title: 库的插件开发
description: 了解如何为 Expo 与 React Native 库开发配置插件。
---

# 库的插件开发

React Native 库中的配置插件可以自动化原生项目配置。用户无需手动编辑原生文件（例如 **AndroidManifest.xml**、**Info.plist**），插件在 prebuild 期间处理这些改动 —— 用可靠、可重复的自动化替代容易出错的手动设置。本指南涵盖关键配置步骤与策略。

## 库中配置插件的战略价值

- 安装一个库通常需要一组复杂的原生、平台专属步骤，必须正确完成，且可能需要深厚的原生知识。
- 内置插件把这个手动流程变成 Expo 应用配置（通常是 **app.json**）中的一个简单声明，降低采用门槛，同时让设置可靠。
- 插件还支持与[持续原生生成](/workflow/continuous-native-generation)兼容，其中原生目录是生成的而不是提交的。没有插件，CNG 用户要么放弃该工作流手动配置原生文件，要么构建自己的自动化 —— 这在现代 Expo 工作流中是采用的一大障碍。

## 项目结构

示例目录树：`android/`（原生模块代码；`src/main/java/com/your-awesome-library`；`build.gradle`）、`ios/`（`YourAwesomeLibrary`、`YourAwesomeLibrary.podspec`）、`src/`（`index.ts` 主入口、`YourAwesomeLibrary.ts` 核心实现、`types.ts` 类型定义）、`plugin/`（`src/index.ts` 插件入口、`withAndroid.ts`、`withIos.ts`、`build/`、`__tests__/`、`tsconfig.json`）、`example/`（`app.json`、`App.tsx`、`package.json`），以及根级 `__tests__/`、`app.plugin.js`、`package.json`、`tsconfig.json`、`jest.config.js`、`README.md`。

组织原则：

- **根级分离**：库代码（`src`）与插件实现（`plugin`）之间有清晰的边界。
- **插件目录组织**：平台专属文件（`withAndroid.ts`、`withIos.ts`）便于专注测试与维护。
- **构建输出管理**：编译后的 JS 与 TypeScript 声明放在 `plugins/build/`。
- **测试**：插件测试与库测试分离，反映不同的关注点。

## 开发环境的安装与配置

推荐工具：`expo` 与 [`expo-module-scripts`](https://www.npmjs.com/package/expo-module-scripts)。`expo` 提供配置插件 API 与类型；`expo-module-scripts` 提供 Expo 模块与配置插件的构建工具，并处理 TypeScript 编译。

安装命令（按包管理器）：`npx expo install package`、`yarn expo install package`、`pnpm expo install package`、`bun expo install package`。

`expo-module-scripts` 所需的 **package.json** 配置（替换任何同名的现有脚本）：脚本 `build` → `expo-module build`、`build:plugin` → `expo-module build plugin`、`clean` → `expo-module clean`、`test` → `expo-module test`、`prepare` → `expo-module prepare`、`prepublishOnly` → `expo-module prepublishOnly`；devDependencies `expo: ^58.0.0`；peerDependencies `expo: >=58.0.0`；peerDependenciesMeta 把 `expo` 标记为可选。

**plugins/tsconfig.json**：继承 `expo-module-scripts/tsconfig.plugin`，compilerOptions 为 `outDir: "build"`、`rootDir: "src"`、`include: ["./src"]`、`exclude: ["**/__mocks__/*", "**/__tests__/*"]`。

**app.plugin.js** 定义插件入口点，导出 `plugin/build` 的编译代码：`module.exports = require('./plugin/build');`。这很重要，因为 Expo CLI 在库的项目根目录查找这个文件；`plugin/build` 存放插件 TypeScript 源码生成的 JS。

## 关键实现模式

三个领域：**插件结构**（每个插件都应遵循的核心模式）、**平台专属实现**（处理 Android 与 iOS）、**测试策略**（验证插件代码）。

### 插件结构与平台专属实现

每个插件遵循相同的模式：接收配置与参数，通过 mod 应用转换，返回修改后的配置。

#### 入口文件

代码从 `expo/config-plugins` 导入 `ConfigPlugin`、`withAndroidManifest` 与 `withInfoPlist`；导出接口 `YourLibraryPluginProps`，带可选的 `customProperty?: string` 与 `enableFeature?: boolean`；定义 `withYourLibrary` 为 `ConfigPlugin<YourLibraryPluginProps>`（props 默认为 `{}`），先对 config 应用 Android 配置，再应用 iOS 配置，返回它，并默认导出插件。

#### Android

`withAndroidConfiguration` 使用 `withAndroidManifest`，通过 `AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults)` 获取主应用，并调用 `AndroidConfig.Manifest.addMetaDataItemToMainApplication`，键为 `'your_library_config_key'`、值为 `props.customProperty || 'default_value'`。

#### iOS

`withIosConfiguration` 使用 `withInfoPlist`；把 `config.modResults.YourLibraryCustomProperty` 设为 `props.customProperty || 'default_value'`；如果设置了 `props.enableFeature`，把 `config.modResults.YourLibraryFeatureEnabled = true`。

### 测试策略

插件测试与常规库测试不同：它测试配置转换而不是运行时行为 —— 配置对象进入，修改后的配置对象出来。有效的测试可以组合：**单元测试**（用模拟的 Expo 配置对象测试转换逻辑）、**跨平台验证**（一个示例应用验证真实的 prebuild 输出）与**错误条件测试**（错误处理）。

单元测试可以用 Jest 创建模拟配置对象（不涉及文件系统），把它们传入插件并验证修改。示例测试：从 `../src` 导入 `withYourLibrary`；一个名为"用自定义属性配置 Android"的测试构建一个 `name`/`slug` 为 `'test-app'`、`platforms: ['android', 'ios']` 的 config，用 `customProperty: 'test-value'` 运行插件，并断言 `result.plugins` 已定义。

错误处理指引：优雅地处理错误并给出清晰反馈，用 try-catch 尽早拦截。示例插件先校验 props，然后应用 Android 与 iOS 配置，在 catch 块中附加上下文重新抛出（消息以 `Failed to configure YourLibrary plugin:` 开头）。

## 替代构建方式

如果库不使用 `expo-module-scripts`，有两个选择：

### 把插件添加到你的主包

对于使用其他构建工具的库（例如用 `create-react-native-library` 创建的），添加一个 **app.plugin.js** 文件并与主包一起构建：`module.exports = require('./lib/plugin');`。

### 创建单独的插件包

一些库把配置插件作为单独的包分发，保持它独立于原生模块。这需要 **app.plugin.js** 中的导出与一个编译后的 **build** 目录。所示的 **package.json** 示例设置 `"name": "your-library-expo-plugin"`、`"main": "app.plugin.js"`、`"files": ["app.plugin.js", "build/"]`，peerDependencies 为 `"expo": "*"` 与 `"your-library": "*"`。

## 插件开发最佳实践

- **在 README 中写说明**：记录包的手动设置步骤，这样插件失败时开发者可以手动执行自动化的修改，也支持非 [CNG](/workflow/continuous-native-generation) 项目。记录可用的插件属性，注明哪些是必需的。优先编写幂等插件 —— 无论在新原生模板还是已有改动的模板上运行都得到相同结果 —— 这样 `npx expo prebuild`（不带 `--clean`）可以同步改动而不是重建原生项目；使用危险 mod 时这更难。
- **命名惯例**：全平台插件使用 `withFeatureName`；平台专属插件使用驼峰命名，平台紧跟在 "with" 之后，例如 `withAndroidSplash`、`withIosSplash`。
- **利用内置插件**：如果某个配置已存在于[应用配置](/versions/latest/config/app)或 [prebuild 配置](https://github.com/expo/expo/blob/main/packages/%40expo/prebuild-config/src/plugins/withDefaultPlugins.ts)中，就不需要插件。
- **按平台拆分插件**：按平台拆分函数让 `npx expo prebuild` 的 `--platform` 标志在 `EXPO_DEBUG` 模式下更容易跟踪，因为日志会显示运行了哪些平台专属函数。
- **对插件做单元测试**：为复杂修改编写 Jest 测试；如果需要文件系统访问，使用模拟系统，强烈推荐 [`memfs`](https://www.npmjs.com/package/memfs)。示例在 [`expo-notifications`](https://github.com/expo/expo/blob/fc3fb2e81ad3a62332fa1ba6956c1df1c3186464/packages/expo-notifications/plugin/src/__tests__/withNotificationsAndroid-test.ts#L34) 插件测试、根 [`**/__mocks__/**/*`](https://github.com/expo/expo/tree/main/packages/expo-notifications/plugin/__mocks__) 目录与 [`plugin/jest.config.js`](https://github.com/expo/expo/tree/main/packages/expo-notifications/plugin/jest.config.js) 中。
- TypeScript 总是比 JavaScript 更可取，因为它提供额外的类型安全；参见 [`expo-module-scripts` 插件](https://github.com/expo/expo/tree/main/packages/expo-module-scripts#-config-plugin)工具。
- 不要通过配置插件修改 `sdkVersion` —— 它可能破坏 `expo install` 等命令并导致其他意外问题。
