---
title: 创建并使用配置插件
description: 了解如何在 Expo 项目中创建与使用配置插件。
---

# 创建并使用配置插件

:::note
以下各节使用动态[应用配置](/workflow/configuration)（**app.config.js/app.config.ts** 而不是 **app.json**），但一个基础的插件并不需要它。不过，如果你想要一个接受参数的函数式插件，动态应用配置就是必需的。
:::

本指南介绍如何创建一个配置插件、向它传参、串联多个插件，以及使用 Expo 库自带的插件。你将学到层级的前两级：

```
withMyPlugin ("myPlugin") [Config Plugin]
→ withAndroidPlugin, withIosPlugin [Plugin Function]
→ withAndroidManifest, withInfoPlist [Mod Plugin Function]
→ mods.android.manifest, mods.ios.infoplist [Mod]
```

## 创建配置插件

下面的实操构建一个本地插件，向 **AndroidManifest.xml**（Android）与 **Info.plist**（iOS）插入 `HelloWorldMessage` 属性。在项目根目录创建 **plugins** 目录，包含 **withAndroidPlugin.ts**、**withIosPlugin.ts** 与 **withPlugin.ts**，另有一个使用插件的动态应用配置 **app.config.ts**。

### 创建 Android 插件

把这段代码添加到 **withAndroidPlugin.ts**：

```ts withAndroidPlugin.ts
import { ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';

const withAndroidPlugin: ConfigPlugin = config => {
  // Define a custom message
  const message = 'Hello world, from Expo plugin!';

  return withAndroidManifest(config, config => {
    const mainApplication = config?.modResults?.manifest?.application?.[0];

    if (mainApplication) {
      // Ensure meta-data array exists
      if (!mainApplication['meta-data']) {
        mainApplication['meta-data'] = [];
      }

      // Add the custom message as a meta-data entry
      mainApplication['meta-data'].push({
        $: {
          'android:name': 'HelloWorldMessage',
          'android:value': message,
        },
      });
    }

    return config;
  });
};

export default withAndroidPlugin;
```

该示例使用 `expo/config-plugins` 的 `ConfigPlugin` 与 `withAndroidManifest`，向 **android/app/src/main/AndroidManifest.xml** 添加 `HelloWorldMessage` meta-data 条目。[`withAndroidManifest`](/develop/config-plugins/mods#mod-plugins) 是一个异步 mod 插件，接受一个 config 与一个数据对象，修改值后返回一个对象。

### 创建 iOS 插件

把这段代码添加到 **withIosPlugin.ts**：

```ts withIosPlugin.ts
import { ConfigPlugin, withInfoPlist } from 'expo/config-plugins';

const withIosPlugin: ConfigPlugin = config => {
  // Define the custom message
  const message = 'Hello world, from Expo plugin!';

  return withInfoPlist(config, config => {
    // Add the custom message to the Info.plist file
    config.modResults.HelloWorldMessage = message;
    return config;
  });
};

export default withIosPlugin;
```

这使用 `expo/config-plugins` 的 `ConfigPlugin` 与 `withInfoPlist`，把 `HelloWorldMessage` 作为自定义键添加到 **ios/<你的项目名>/Info.plist**。[`withInfoPlist`](/develop/config-plugins/mods#mod-plugins) 的行为同样是异步的。

### 创建组合插件

组合插件应用两个平台专属插件，平台代码保持分离，同时暴露一个入口点。在 **withPlugin.ts** 中：

```ts withPlugin.ts
import { ConfigPlugin } from 'expo/config-plugins';
import withAndroidPlugin from './withAndroidPlugin';
import withIosPlugin from './withIosPlugin';

const withPlugin: ConfigPlugin = config => {
  // Apply Android modifications first
  config = withAndroidPlugin(config);
  // Then apply iOS modifications and return
  return withIosPlugin(config);
};

export default withPlugin;
```

### 添加 TypeScript 支持并转换为动态应用配置

推荐插件使用 TypeScript，因为它为配置对象提供智能提示。但你的应用配置由 Node.js 求值，默认不理解 TypeScript，因此必须为 **plugins** 目录中的 TypeScript 文件添加解析器。安装 `tsx`：

```sh
# npm
npm install --save-dev tsx

# yarn
yarn add --dev tsx

# pnpm
pnpm add --save-dev tsx

# bun
bun add --dev tsx
```

然后把 **app.json** 重命名为 **app.config.ts**（[动态应用配置](/workflow/configuration#dynamic-configuration)）并更改内容，在顶部添加此导入：

```ts app.config.ts
import 'tsx/cjs';

module.exports = () => {
  ... rest of your app config
};
```

### 从动态应用配置调用配置插件

在应用配置的 plugins 数组中添加 **withPlugin.ts** 的路径：

```ts app.config.ts
import "tsx/cjs";
import { ExpoConfig } from "expo/config";

module.exports = ({ config }: { config: ExpoConfig }) => {
  ... rest of your app config
  plugins: [
      ["./plugins/withPlugin.ts"],
    ],
};
```

要查看应用的自定义配置，运行：

```sh
# npm
npx expo prebuild --clean --no-install

# yarn
yarn expo prebuild --clean --no-install

# pnpm
pnpm expo prebuild --clean --no-install

# bun
bun expo prebuild --clean --no-install
```

打开 **android/app/src/main/AndroidManifest.xml** 与 **ios/<你的项目名>/Info.plist** 验证：

```xml AndroidManifest.xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
<!-- ... rest of the configuration-->
	<application ...>
		<meta-data android:name="HelloWorldMessage" android:value="Hello world, from Expo plugin!"/>
		<!-- ... -->
	</application>
</manifest>
```

```xml Info.plist
<plist version="1.0">
  <dict>
  <!-- ... -->
    <key>HelloWorldMessage</key>
    <string>Hello world, from Expo plugin!</string>
	<!-- ... -->
	</dict>
</plist>
```

## 向配置插件传参

插件可以从应用配置接受参数：在插件函数内读取参数，然后在应用配置中把包含它的对象与插件函数一起传入。扩展前面的例子，在 **withAndroidPlugin.ts** 中添加 `options` 对象，把 `message` 变量改为 `options.message`：

```ts withAndroidPlugin.ts
...
type AndroidProps = {
  message?: string;
};

const withAndroidPlugin: ConfigPlugin<AndroidProps> = (
  config,
  options = {}
) => {
  const message = options.message || 'Hello world, from Expo plugin!';
  return withAndroidManifest(config, config => {
   ... rest of the example remains unchanged
  });
};

export default withAndroidPlugin;
```

在 **withIosPlugin.ts** 中做同样的事：

```ts withIosPlugin.ts
...
type IosProps = {
  message?: string;
};

const withIosPlugin: ConfigPlugin<IosProps> = (config, options = {}) => {
   const message = options.message || 'Hello world, from Expo plugin!';
  ... rest of the example remains unchanged
};

export default withIosPlugin;
```

更新 **withPlugin.ts**，把 `options` 对象转发给两个插件：

```ts withPlugin.ts
...
const withPlugin: ConfigPlugin<{ message?: string }> = (config, options = {}) => {
  config = withAndroidPlugin(config, options);
  return withIosPlugin(config, options);
};
```

要动态提供值，在应用配置中传入带 `message` 的对象：

```ts app.config.ts
{
  ...
  plugins: [
    [
      "./plugins/withPlugin.ts",
      { message: "Custom message from app.config.ts" },
    ],
  ],
}
```

## 串联配置插件

插件可以串联，让多个修改按顺序运行；每个插件按列出的顺序执行，一个插件的输出成为下一个的输入。这种顺序保留了插件之间的依赖关系，让你能控制原生代码的修改顺序。要串联，向 `plugins` 属性传入插件数组 —— 这在 JSON 应用配置（**app.json**）中同样有效。

```ts app.config.ts
module.exports = ({ config }: { config: ExpoConfig }) => {
  name: 'my app',
  plugins: [
    [withFoo, 'input 1'],
    [withBar, 'input 2'],
    [withDelta, 'input 3'],
  ],
};
```

`plugins` 数组在内部使用 `withPlugins` 进行串联。当数组变长或复杂时，直接调用 `withPlugins` 可能更易读；它按顺序串联并执行插件。

```ts app.config.ts
import { withPlugins } from 'expo/config-plugins';

// Create a base config object
const baseConfig = {
  name: 'my app',
  ... rest of the config
};

// ❌ Hard to read
withDelta(withFoo(withBar(config, 'input 1'), 'input 2'), 'input 3');

// ✅ Easy to read
withPlugins(config, [
  [withFoo, 'input 1'],
  [withBar, 'input 2'],
  // When no input is required, you can just pass the method
  withDelta,
]);

// Export the base config with plugins applied
module.exports = ({ config }: { config: ExpoConfig }) => {
  return withPlugins(baseConfig, plugins);
};
```

## 使用配置插件

Expo 配置插件通常随 Node.js 模块发布，像其他库一样安装。例如，`expo-camera` 包含一个插件，向 **AndroidManifest.xml** 与 **Info.plist** 添加相机权限。安装：

```sh
# npm
npx expo install expo-camera

# yarn
yarn expo install expo-camera

# pnpm
pnpm expo install expo-camera

# bun
bun expo install expo-camera
```

然后把 `expo-camera` 添加到[应用配置](/versions/latest/config/app)的 plugins 列表：

```json app.json
{
  "expo": {
    "plugins": ["expo-camera"]
  }
}
```

一些插件接受选项用于自定义：传入一个数组，库名在前、选项对象在后。例如，`expo-camera` 插件让你自定义相机权限文案：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera."
        }
      ]
    ]
  }
}
```

:::tip
每个带配置插件的 Expo 库都会在它的 API 参考中说明 —— 参见 [`expo-camera` 库的配置插件一节](/versions/latest/sdk/camera#configuration-in-app-config)。
:::

运行 `npx expo prebuild` 会编译 [`mods`](/develop/config-plugins/introduction#mod) 并修改原生文件。这些改动只有重新构建原生项目（例如用 Xcode）后才生效。**对于没有原生目录的项目（CNG 项目）中使用的配置插件，它们在 EAS Build 的 prebuild 步骤中应用**，或在你本地运行 `npx expo prebuild|android|ios` 时应用。
