---
title: 教程：创建带配置插件的模块
description: 使用 Expo Modules API 创建带配置插件的原生模块的教程。
---

# 教程：创建带配置插件的模块

[配置插件](/config-plugins/introduction)让你可以在[持续原生代码生成（CNG）](/workflow/continuous-native-generation)项目中，自定义由 `npx expo prebuild` 生成的原生 Android 和 iOS 项目。你可以用它们向原生配置文件添加属性、把资源复制到原生项目，或应用高级配置，例如添加[应用扩展 target](/build-reference/app-extensions)。

作为应用开发者，配置插件帮助你应用默认[应用配置](/workflow/configuration)中未暴露的自定义。作为库作者，它们让你能够为使用你的库的开发者自动配置原生项目。

本教程说明如何从零创建一个新的配置插件，并从一个 Expo 模块中读取插件注入到 **AndroidManifest.xml** 和 **Info.plist** 的自定义值。

1. **初始化模块**

首先用 `create-expo-module` 初始化一个新的 Expo 模块项目。这会为 Android、iOS 和 TypeScript 搭建脚手架，并包含一个用于在应用中测试模块的示例项目。运行以下命令开始：

:::tabs
:::tab npm
```sh
$ npx create-expo-module expo-native-configuration
```
:::
:::tab yarn
```sh
$ yarn create expo-module expo-native-configuration
```
:::
:::tab pnpm
```sh
$ pnpm create expo-module expo-native-configuration
```
:::
:::tab bun
```sh
$ bun create expo-module expo-native-configuration
```
:::
:::

本指南对模块项目使用名称 `expo-native-configuration` / `ExpoNativeConfiguration`。不过，你可以选择任何你喜欢的名称。

2. **设置工作区**

在本示例中，你不需要 `create-expo-module` 附带的视图模块。用以下命令清理默认模块：

```sh
$ cd expo-native-configuration
$ rm android/src/main/java/expo/modules/nativeconfiguration/ExpoNativeConfigurationView.kt
$ rm ios/ExpoNativeConfigurationView.swift
$ rm src/ExpoNativeConfigurationView.tsx src/ExpoNativeConfiguration.types.ts
$ rm src/ExpoNativeConfigurationView.web.tsx src/ExpoNativeConfigurationModule.web.ts
```

找到以下文件，并用提供的最小样板替换它们：

- **android/src/main/java/expo/modules/nativeconfiguration/ExpoNativeConfigurationModule.kt**
- **ios/ExpoNativeConfigurationModule.swift**
- **src/ExpoNativeConfigurationModule.ts**
- **src/index.ts**
- **example/App.tsx**
- **package.json**

```kotlin android/src/main/java/expo/modules/nativeconfiguration/ExpoNativeConfigurationModule.kt
package expo.modules.nativeconfiguration

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoNativeConfigurationModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoNativeConfiguration")

    Function("getApiKey") {
      return@Function "api-key"
    }
  }
}
```

```swift ios/ExpoNativeConfigurationModule.swift
import ExpoModulesCore

public class ExpoNativeConfigurationModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoNativeConfiguration")

    Function("getApiKey") { () -> String in
      "api-key"
    }
  }
}
```

```ts src/ExpoNativeConfigurationModule.ts
import { NativeModule, requireNativeModule } from 'expo';

declare class ExpoNativeConfigurationModule extends NativeModule {
  getApiKey(): string;
}

// 此调用从 JSI 加载原生模块对象。
export default requireNativeModule<ExpoNativeConfigurationModule>('ExpoNativeConfiguration');
```

```ts src/index.ts
import ExpoNativeConfigurationModule from './ExpoNativeConfigurationModule';

export function getApiKey(): string {
  return ExpoNativeConfigurationModule.getApiKey();
}
```

```tsx example/App.tsx
import * as ExpoNativeConfiguration from 'expo-native-configuration';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>API key: {ExpoNativeConfiguration.getApiKey()}</Text>
    </View>
  );
}
```

```json package.json
{
  "dependencies": {
    "expo-native-configuration": "file:.."
  }
}
```

3. **运行示例项目**

在项目根目录运行 TypeScript 编译器，以监视更改并重新构建模块的 JavaScript：

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

在另一个终端窗口中，编译并运行示例应用：

:::tabs
:::tab npm
```sh
# 进入示例项目
$ cd example

# 重新安装依赖
$ rm -rf node_modules && npm install

# 在 Android 上运行示例应用
$ npx expo run:android

# 在 iOS 上运行示例应用
$ npx expo run:ios
```
:::
:::tab yarn
```sh
# 进入示例项目
$ cd example

# 重新安装依赖
$ rm -rf node_modules && yarn install

# 在 Android 上运行示例应用
$ yarn expo run:android

# 在 iOS 上运行示例应用
$ yarn expo run:ios
```
:::
:::tab pnpm
```sh
# 进入示例项目
$ cd example

# 重新安装依赖
$ rm -rf node_modules && pnpm install

# 在 Android 上运行示例应用
$ pnpm expo run:android

# 在 iOS 上运行示例应用
$ pnpm expo run:ios
```
:::
:::tab bun
```sh
# 进入示例项目
$ cd example

# 重新安装依赖
$ rm -rf node_modules && bun install

# 在 Android 上运行示例应用
$ bun expo run:android

# 在 iOS 上运行示例应用
$ bun expo run:ios
```
:::
:::

你应该会看到一个显示文本 “API key: api-key” 的屏幕。

4. **创建新的配置插件**

[插件](/config-plugins/introduction#插件函数plugin-function)是接受 `ExpoConfig` 并返回修改后的 `ExpoConfig` 的同步函数。按照惯例，这些函数以单词 `with` 为前缀。把你的插件命名为 `withMyApiKey`，或使用其他名称，只要遵循这一惯例即可。

下面是一个基本配置插件函数的示例：

```js
const withMyApiKey = config => {
  return config;
};
```

你也可以使用 `mods`，它们是修改原生项目中文件的异步函数，例如源代码或配置文件（plist、xml）。`mods` 对象与应用配置的其余部分不同，因为它在初次读取之后不会序列化。这允许你在代码生成期间执行操作。

编写配置插件时，请遵循以下考虑：

- 插件必须是同步的，并且除了添加的任何 `mods` 之外，其返回值必须可序列化。
- 每当 `expo/config` 的 `getConfig` 方法读取配置时，都会调用 `plugins`。相比之下，`mods` 只在 `npx expo prebuild` 的“同步”阶段被调用。

> 虽然是可选的，但可以使用 [`expo-module-scripts`](https://www.npmjs.com/package/expo-module-scripts) 来简化插件开发。它为 TypeScript 和 Jest 提供了推荐的默认配置。更多信息请参阅[配置插件指南](https://github.com/expo/expo/tree/main/packages/expo-module-scripts#-config-plugin)。

用这份最小样板开始创建你的插件。创建一个 **plugin** 目录，用 TypeScript 编写插件，并在项目根目录添加 **app.plugin.js** 文件，它将作为插件的入口。

### 创建 plugin/tsconfig.json 文件

```json plugin/tsconfig.json
{
  "extends": "expo-module-scripts/tsconfig.plugin",
  "compilerOptions": {
    "outDir": "build",
    "rootDir": "src"
  },
  "include": ["./src"],
  "exclude": ["**/__mocks__/*", "**/__tests__/*"]
}
```

### 为插件创建 plugin/src/index.ts 文件

```ts plugin/src/index.ts
import { ConfigPlugin } from 'expo/config-plugins';

const withMyApiKey: ConfigPlugin = config => {
  console.log('my custom plugin');
  return config;
};

export default withMyApiKey;
```

### 在根目录创建 app.plugin.js 文件

```js app.plugin.js
// 此文件配置插件的入口文件。
module.exports = require('./plugin/build');
```

在项目根目录运行 `npm run build plugin`，以监视模式启动 TypeScript 编译器。接下来，通过在 **example/app.json** 文件中添加以下一行，配置示例项目使用你的插件：

```json example/app.json
{
  "expo": {
    "plugins": ["../app.plugin.js"]
  }
}
```

在 **example** 目录内运行 `npx expo prebuild` 命令时，终端会通过一条 console 语句记录 “my custom plugin”。

:::tabs
:::tab npm
```sh
$ cd example
$ npx expo prebuild --clean
```
:::
:::tab yarn
```sh
$ cd example
$ yarn expo prebuild --clean
```
:::
:::tab pnpm
```sh
$ cd example
$ pnpm expo prebuild --clean
```
:::
:::tab bun
```sh
$ cd example
$ bun expo prebuild --clean
```
:::
:::

要把自定义 API 密钥注入 **AndroidManifest.xml** 和 **Info.plist**，请使用 [`expo/config-plugins` 提供的辅助 `mods`](/config-plugins/mods)。它们让修改原生文件变得容易。在本示例中，使用 `withAndroidManifest` 和 `withInfoPlist`。

顾名思义，`withAndroidManifest` 允许你读取和修改 **AndroidManifest.xml** 文件。使用 `AndroidConfig` 辅助函数向主 application 添加一个 metadata 项，如下所示：

```ts
const withMyApiKey: ConfigPlugin<{ apiKey: string }> = (config, { apiKey }) => {
  config = withAndroidManifest(config, config => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'MY_CUSTOM_API_KEY',
      apiKey
    );
    return config;
  });

  return config;
};
```

类似地，你可以使用 `withInfoPlist` 修改 **Info.plist** 的值。使用 `modResults` 属性，你可以添加自定义值，如下面的代码片段所示：

```ts
const withMyApiKey: ConfigPlugin<{ apiKey: string }> = (config, { apiKey }) => {
  config = withInfoPlist(config, config => {
    config.modResults['MY_CUSTOM_API_KEY'] = apiKey;
    return config;
  });

  return config;
};
```

你可以把所有内容合并成一个函数，从而创建自定义插件：

```ts plugin/src/index.ts
import {
  withInfoPlist,
  withAndroidManifest,
  AndroidConfig,
  ConfigPlugin,
} from 'expo/config-plugins';

const withMyApiKey: ConfigPlugin<{ apiKey: string }> = (config, { apiKey }) => {
  config = withInfoPlist(config, config => {
    config.modResults['MY_CUSTOM_API_KEY'] = apiKey;
    return config;
  });

  config = withAndroidManifest(config, config => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'MY_CUSTOM_API_KEY',
      apiKey
    );
    return config;
  });

  return config;
};

export default withMyApiKey;
```

插件准备好之后，更新示例应用，把你的 API 密钥作为配置选项传给插件。按如下方式修改 **example/app.json** 中的 `plugins` 字段：

```json example/app.json
{
  "expo": {
    "plugins": [["../app.plugin.js", { "apiKey": "custom_secret_api" }]]
  }
}
```

做出此更改后，在 **example** 目录内运行 `npx expo prebuild --clean` 来测试插件是否正常工作。此命令会执行你的插件并更新原生文件，把 `"MY_CUSTOM_API_KEY"` 注入 **AndroidManifest.xml** 和 **Info.plist**。你可以通过检查 **example/android/app/src/main/AndroidManifest.xml** 和 **example/ios/exponativeconfigurationexample/Info.plist** 的内容来验证。

5. **从模块读取原生值**

现在，让你的原生模块读取添加到 **AndroidManifest.xml** 和 **Info.plist** 的字段，方法是使用平台特定的方法访问它们的内容。

在 Android 上，使用 `packageManager` 类从 **AndroidManifest.xml** 文件访问 metadata 信息。要读取 `"MY_CUSTOM_API_KEY"` 的值，请更新 **android/src/main/java/expo/modules/nativeconfiguration/ExpoNativeConfigurationModule.kt** 文件：

```kotlin android/src/main/java/expo/modules/nativeconfiguration/ExpoNativeConfigurationModule.kt
package expo.modules.nativeconfiguration

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.pm.PackageManager

class ExpoNativeConfigurationModule() : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoNativeConfiguration")

    Function("getApiKey") {
      val applicationInfo = appContext?.reactContext?.packageManager?.getApplicationInfo(appContext?.reactContext?.packageName.toString(), PackageManager.GET_META_DATA)

      return@Function applicationInfo?.metaData?.getString("MY_CUSTOM_API_KEY")
    }
  }
}
```

在 iOS 上，你可以使用 `Bundle.main.object(forInfoDictionaryKey: "")` 方法读取 **Info.plist** 属性的内容。要访问之前添加的 `"MY_CUSTOM_API_KEY"` 值，请按如下方式更新 **ios/ExpoNativeConfigurationModule.swift** 文件：

```swift ios/ExpoNativeConfigurationModule.swift
import ExpoModulesCore

public class ExpoNativeConfigurationModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoNativeConfiguration")

    Function("getApiKey") {
     return Bundle.main.object(forInfoDictionaryKey: "MY_CUSTOM_API_KEY") as? String
    }
  }
}
```

6. **运行你的模块**

原生模块已经在读取添加到原生文件中的字段，现在你可以运行示例应用，并使用 `ExamplePlugin.getApiKey()` 函数访问你的自定义 API 密钥。

:::tabs
:::tab npm
```sh
$ cd example

# 执行插件并更新原生文件
$ npx expo prebuild

# 在 Android 上运行示例应用
$ npx expo run:android

# 在 iOS 上运行示例应用
$ npx expo run:ios
```
:::
:::tab yarn
```sh
$ cd example

# 执行插件并更新原生文件
$ yarn expo prebuild

# 在 Android 上运行示例应用
$ yarn expo run:android

# 在 iOS 上运行示例应用
$ yarn expo run:ios
```
:::
:::tab pnpm
```sh
$ cd example

# 执行插件并更新原生文件
$ pnpm expo prebuild

# 在 Android 上运行示例应用
$ pnpm expo run:android

# 在 iOS 上运行示例应用
$ pnpm expo run:ios
```
:::
:::tab bun
```sh
$ cd example

# 执行插件并更新原生文件
$ bun expo prebuild

# 在 Android 上运行示例应用
$ bun expo run:android

# 在 iOS 上运行示例应用
$ bun expo run:ios
```
:::
:::

## 下一步

恭喜，你已经创建了一个与 Android 和 iOS 的 Expo 模块交互的配置插件！

如果你想挑战自己，让插件更加通用，这个练习对你开放。修改插件，允许传入任意一组配置键和值，并添加从模块读取任意键的功能。

- [Expo Modules API 参考](/modules/module-api) — 使用 Kotlin 和 Swift 创建原生模块的参考。
- [额外的平台支持](/modules/additional-platform-support) — 了解如何为 macOS 和 tvOS 平台添加支持。
