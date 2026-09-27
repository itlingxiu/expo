---
title: 开发与调试插件
description: 了解 Expo 配置插件的开发最佳实践与调试技巧。
---

# 开发与调试插件

开发插件是扩展 Expo 生态的好方法。有时你会想调试自己的插件。

## 插件开发

:::note
使用 [modifier 预览](https://github.com/expo/vscode-expo#expo-preview-modifier)实时调试插件的结果。
:::

插件开发支持已添加到 [`expo-module-scripts`](https://www.npmjs.com/package/expo-module-scripts)；[配置插件指南](https://github.com/expo/expo/tree/main/packages/expo-module-scripts#-config-plugin)涵盖 TypeScript 与 Jest 用法。

### 安装依赖

```json package.json
{
  "dependencies": {},
  "devDependencies": {
    "expo": "^58.0.0"
  },
  "peerDependencies": {
    "expo": ">=58.0.0"
  },
  "peerDependenciesMeta": {
    "expo": {
      "optional": true
    }
  }
}
```

- 可以固定确切的 `expo` 版本以针对特定版本构建。
- 只依赖核心稳定 API 的简单插件（例如只改 **AndroidManifest.xml** 或 **Info.plist**）可以使用如上宽松的依赖。
- `expo-module-scripts` 是一个有用但可选的开发依赖。

### 导入配置插件包

`expo/config-plugins` 与 `expo/config` 从 `expo` 再导出：

```js
const { ... } = require('expo/config-plugins');
const { ... } = require('expo/config');
```

通过 `expo` 导入可以保证你使用 `expo` 包所依赖的版本。否则你可能会导入不兼容的副本（取决于模块提升），或者在使用 Yarn Berry、pnpm 等 "plug and play" 包管理器时根本无法导入。配置类型直接来自 `expo/config`，因此无需安装 `expo/config-types`：

```ts
import { ExpoConfig, ConfigContext } from 'expo/config';
```

### Mod 的最佳实践

- "避免正则：静态修改是关键。"对于 Gradle 更改，优先使用 `gradle.properties`；对于 Podfile 更改，考虑写入由 Podfile 读取的 JSON。
- 不要在 mod 中运行长任务（网络请求、安装 Node 模块）。
- Mod 中不要有交互式终端提示。
- "只在危险 mod 中生成、移动与删除新文件。"否则内省会损坏。
- 使用 `withXcodeProject` 等内置工具，尽量减少文件读取/解析。
- 使用 prebuild 内部使用的 XML 解析库，避免不必要的代码重排。

## 插件结构与脚手架

### 版本控制

`npx expo prebuild` 转换一个与项目 Expo SDK 版本（来自 **app.json** 或安装的 `expo`）绑定的[源模板](https://github.com/expo/expo/tree/main/templates/expo-template-bare-minimum)。SDK/React Native 升级时模板可能发生显著变化。主要做静态修改的插件通常跨 SDK 工作；基于正则的转换器应记录它们预期的 SDK 版本。[beta 期](https://github.com/expo/expo/blob/main/guides/releasing/Release%20Workflow.md#stage-4---beta-release)允许在发布前测试。

### 插件属性

属性自定义 prebuild 行为，必须是静态的（不能是函数或 promise）：

```ts
type StaticValue = boolean | number | string | null | StaticArray | StaticObject;

type StaticArray = StaticValue[];

interface StaticObject {
  [key: string]: StaticValue | undefined;
}
```

"需要静态属性，因为应用配置必须可序列化为 JSON，以用作应用 manifest。"在可能的情况下，插件应在没有 props 时也能工作，这样 `expo install` 或 VS Code Expo Tools 等工具的解析效果更好。每个属性都增加复杂度、未来变更的难度与更多测试。"可行时，好的默认值优于强制配置。"

## 开发环境

### 工具

强烈推荐 [Expo Tools VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)用于校验、显示错误与其他体验提升功能。

### 设置演练环境

仅 JS 的插件开发很容易，但 Jest 测试与 TypeScript 建议使用 monorepo，让你可以在一个 node 模块上工作，并像已发布一样在应用配置中导入它。monorepo 支持是内置的。在 `packages/` 中创建模块并[引导一个配置插件](https://github.com/expo/expo/tree/main/packages/expo-module-scripts#-config-plugin)。

### 手动运行插件

如果避免使用 monorepo：

- 在插件包中运行 `npm pack`。
- 在测试项目中运行 `npm install path/to/react-native-my-package-1.0.0.tgz`，它会加入 **package.json** 的 `dependencies`。
- 把它添加到 **app.json** 的 `plugins`：`{ "plugins": ["react-native-my-package"] }`（VS Code Expo Tools 提供自动补全）。
- 要更新，在包的 **package.json** 中提升 `version` 并重复。

## 用插件修改原生文件

### 修改 AndroidManifest.xml

对于静态、非可选的功能（如权限），优先使用内置的 [manifest 合并系统](https://developer.android.com/studio/build/manage-manifests) —— 在构建时而不是 prebuild 时合并，降低用户忘记 prebuild 的风险。代价：没有内省预览/调试。

```xml AndroidManifest.xml
<manifest package="expo.modules.filesystem" xmlns:android="http://schemas.android.com/apk/res/android">
  <uses-permission android:name="android.permission.INTERNET"/>
</manifest>
```

对于需要更多控制的本地项目插件或包，实现一个插件。示例 —— 向默认的 `<application android:name=".MainApplication" />` 添加 `<meta-data android:name="..." android:value="..."/>`：

```ts my-config-plugin.ts
import { AndroidConfig, ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';
import { ExpoConfig } from 'expo/config';

// Using helpers keeps error messages unified and helps cut down on XML format changes.
const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } = AndroidConfig.Manifest;

export const withMyCustomConfig: ConfigPlugin = config => {
  return withAndroidManifest(config, async config => {
    // Modifiers can be async, but try to keep them fast.
    config.modResults = await setCustomConfigAsync(config, config.modResults);
    return config;
  });
};

// Splitting this function out of the mod makes it easier to test.
async function setCustomConfigAsync(
  config: Pick<ExpoConfig, 'android'>,
  androidManifest: AndroidConfig.Manifest.AndroidManifest
): Promise<AndroidConfig.Manifest.AndroidManifest> {
  const appId = 'my-app-id';
  // Get the <application /> tag and assert if it doesn't exist.
  const mainApplication = getMainApplicationOrThrow(androidManifest);

  addMetaDataItemToMainApplication(
    mainApplication,
    // value for `android:name`
    'my-app-id-key',
    // value for `android:value`
    appId
  );

  return androidManifest;
}
```

### 修改 Info.plist

`withInfoPlist` 比在 **app.json** 中静态编辑 `expo.ios.infoPlist` 更安全，因为它读取 Info.plist 并与 `expo.ios.infoPlist` 合并，有助于防止改动被覆盖。示例 —— 添加 `GADApplicationIdentifier`：

```ts my-config-plugin.ts
import { ConfigPlugin, withInfoPlist } from 'expo/config-plugins';

// Pass `<string>` to specify that this plugin requires a string property.
export const withCustomConfig: ConfigPlugin<string> = (config, id) => {
  return withInfoPlist(config, config => {
    config.modResults.GADApplicationIdentifier = id;
    return config;
  });
};
```

### 修改 iOS Podfile

**Podfile**（CocoaPods 配置，之于 iOS 类似于 **package.json**）是 Ruby，因此它**不能**从配置插件安全修改 —— 使用其他方式，如 [Expo Autolinking](/modules/autolinking) hooks。存在一种有限的安全机制：版本化的[模板 Podfile](https://github.com/expo/expo/tree/main/templates/expo-template-bare-minimum/ios/Podfile) 通过 `ios.podfileProperties` / `withPodfileProperties` mod 读取静态 JSON 文件 **Podfile.properties.json**（被 [expo-build-properties](/versions/latest/sdk/build-properties) 与 JavaScript 引擎配置使用）。

### 向 `pluginHistory` 添加插件

`_internal.pluginHistory` 在从旧版 UNVERSIONED 插件迁移到版本化插件时防止插件重复运行。

```ts my-config-plugin.ts
import { ConfigPlugin, createRunOncePlugin } from 'expo/config-plugins';

// Keeping the name, and version in sync with it's package.
const pkg = require('my-cool-plugin/package.json');

const withMyCoolPlugin: ConfigPlugin = config => config;

// A helper method that wraps `withRunOnce` and appends items to `pluginHistory`.
export default createRunOncePlugin(
  // The plugin to guard.
  withMyCoolPlugin,
  // An identifier used to track if the plugin has already been run.
  pkg.name,
  // Optional version property, if omitted, defaults to UNVERSIONED.
  pkg.version
);
```

### 配置 Android 应用启动

JS 引擎启动前需要的配置（例如 `expo-splash-screen` 在 **MainActivity.java** 的 `onCreate` 中设置 resize mode）通过生命周期 hooks 与静态设置处理，而不是危险正则 —— 跨 Java/Kotlin、Expo 版本与插件组合都安全。三个组件：

- `ReactActivityLifecycleListeners`：来自 `expo-modules-core`，项目 `ReactActivity` 的 `onCreate` 运行时的原生回调。
- `withStringsXml`：向 Android **strings.xml** 写入属性的 mod；库读取该值进行初始设置，遵循指定的字符串格式。
- `SingletonModule`（可选）：来自 `expo-modules-core`，原生模块与 `ReactActivityLifecycleListeners` 之间的共享接口。

示例 —— 通过一个实现 `expo-modules-core` 与 Expo 配置插件的 node 模块 `expo-custom`，在 Android `Activity` 的 `onCreate` 之后立即设置一个自定义 "value" 字符串。首先，在原生模块中注册 `ReactActivity` 监听器（只有在有 `expo-modules-core` 支持时才被调用，Expo CLI/Create React Native App/Ignite CLI 项目与 Expo prebuilding 默认如此）：

```kotlin expo-custom/android/src/main/java/expo/modules/custom/CustomPackage.kt
package expo.modules.custom

import android.content.Context
import expo.modules.core.BasePackage
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class CustomPackage : BasePackage() {
  override fun createReactActivityLifecycleListeners(activityContext: Context): List<ReactActivityLifecycleListener> {
    return listOf(CustomReactActivityLifecycleListener(activityContext))
  }

  // ...
}
```

然后是监听器，拿到 `Context` 并能读取 **strings.xml**：

```kotlin expo-custom/android/src/main/java/expo/modules/custom/CustomReactActivityLifecycleListener.kt
package expo.modules.custom

import android.app.Activity
import android.content.Context
import android.os.Bundle
import android.util.Log
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class CustomReactActivityLifecycleListener(activityContext: Context) : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity, savedInstanceState: Bundle?) {
    // Execute static tasks before the JS engine starts.
    // These values are defined via config plugins.

    var value = getValue(activity)
    if (value != "") {
      // Do something to the Activity that requires the static value...
    }
  }

  // Naming is node module name (`expo-custom`) plus value name (`value`) using underscores as a delimiter
  // i.e. `expo_custom_value`
  // `@expo/vector-icons` + `iconName` -> `expo__vector_icons_icon_name`
  private fun getValue(context: Context): String = context.getString(R.string.expo_custom_value).toLowerCase()
}
```

默认 **strings.xml** 值（用户用相同的 `name` 本地覆盖）：

```xml expo-custom/android/src/main/res/values/strings.xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="expo_custom_value" translatable="false"></string>
</resources>
```

带 `expo-modules-core` 的现有 React Native 项目（[bare 概览](/bare/overview)）可以本地设置该值：

```xml ./android/app/src/main/res/values/strings.xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="expo_custom_value" translatable="false">I Love Expo</string>
</resources>
```

使用[持续原生生成（CNG）](/workflow/continuous-native-generation)时，该功能通过配置插件安全暴露：

```js expo-custom/app.plugin.js
const { AndroidConfig, withStringsXml } = require('expo/config-plugins');

function withCustom(config, value) {
  return withStringsXml(config, config => {
    config.modResults = setStrings(config.modResults, value);
    return config;
  });
}

function setStrings(strings, value) {
  // Helper to add string.xml JSON items or overwrite existing items with the same name.
  return AndroidConfig.Strings.setStringItem(
    [
      // XML represented as JSON
      // <string name="expo_custom_value" translatable="false">value</string>
      { $: { name: 'expo_custom_value', translatable: 'false' }, _: value },
    ],
    strings
  );
}
```

CNG 开发者然后使用：

```json app.json
{
  "expo": {
    "plugins": [["expo-custom", "I Love Expo"]]
  }
}
```

重新运行 `npx expo prebuild -p`（`eas build -p android`，或 `npx expo run:ios`）会安全地应用改动。该示例展示依赖应用代码（expo-modules-core）与应用代码（原生项目）交互，让配置插件"安全可靠，希望能保持很长时间！"

## 调试配置插件

- `EXPO_DEBUG=1 expo prebuild` 打印插件栈日志，显示哪些 mod 运行了以及运行顺序。
- `EXPO_CONFIG_PLUGIN_VERBOSE_ERRORS` 显示所有静态插件解析错误（主要供插件作者使用）；一些自动插件错误默认隐藏，因为它们通常与版本相关（例如还没有配置插件的旧包）。
- `npx expo prebuild --clean` 在编译前删除生成的原生目录。
- `npx expo config --type prebuild` 打印 mod 未求值的插件结果（不生成代码）。
- Expo CLI 命令可以用 `EXPO_PROFILE=1` 进行分析。

## 内省

一种高级技术，用于"读取修改器的求值结果而不在项目中生成任何代码"，适合在没有 prebuild 的情况下调试静态修改。`vscode-expo` 的[预览功能](https://github.com/expo/vscode-expo#expo-preview-modifier)允许实时交互。运行 `expo config --type introspect`。

受支持的修改器：

- `android.manifest`
- `android.gradleProperties`
- `android.strings`
- `android.colors`
- `android.colorsNight`
- `android.styles`
- `ios.infoPlist`
- `ios.entitlements`
- `ios.expoPlist`
- `ios.podfileProperties`

:::note
内省只对安全修改器（JSON、XML、plist、properties 等静态文件）有效，例外是 `ios.xcodeproj`，它经常需要文件系统更改，因此是非幂等的。
:::

内省使用自定义基础 mod，行为类似默认 mod，但不把 `modResults` 写入磁盘；结果按 mod 名称保存到应用配置的 `_internal.modResults` 下，例如 `ios.infoPlist` → `_internal.modResults.ios.infoPlist: {}`。实际用途：`eas-cli` 在构建前确定 CNG 项目中最终的 iOS entitlements，以与 Apple Developer Portal 同步。

## 旧版插件

为了匹配 `eas build` 与经典 `expo build` 的行为，"旧版插件"在安装时自动应用。例如，已安装但 `plugins` 中没有条目的 `expo-camera` 会被自动添加，以确保相机/麦克风权限；手动条目优先。用 `expo config --type prebuild` 调试并检查 `_internal.pluginHistory`。

这会显示通过 `expo/config-plugins` 的 `withRunOnce` 添加的所有插件对象。示例中，`expo-location` 显示 `version: '11.0.0'`，`react-native-maps` 显示 `version: 'UNVERSIONED'`，意味着两者都已安装；`expo-location` 使用项目 `node_modules/expo-location/app.plugin.js` 中的插件；已安装的 `react-native-maps` 没有插件，回退到 `expo-cli` 附带的未版本化旧版支持插件。

```json
{
  _internal: {
    pluginHistory: {
      'expo-location': {
        name: 'expo-location',
        version: '11.0.0',
      },
      'react-native-maps': {
        name: 'react-native-maps',
        version: 'UNVERSIONED',
      },
    },
  },
};
```

"为了最稳定的体验，你应该尽量让项目中没有任何 UNVERSIONED 插件" —— 无版本插件可能不支持你的原生代码，破坏性变更可能破坏 prebuild。

## 静态修改

应用代码的正则转换是危险的，因为模板会随时间变化（或用户修改文件/使用自定义模板）。以下是不应手动修改的文件示例及替代方案。

### Android Gradle 文件

Gradle 文件（Groovy 或 Kotlin）管理依赖与设置。不要用 `withProjectBuildGradle`、`withAppBuildGradle` 或 `withSettingsGradle`，改用静态 `gradle.properties`。示例开关：

```properties gradle.properties
expo.react.jsEngine=hermes
```

```groovy app/build.gradle
project.ext.react = [enableHermes: findProperty('expo.react.jsEngine') ?: 'jsc']
```

- 使用以 `.` 分隔的驼峰键，通常以 `expo` 为前缀表示由 prebuild 管理。
- 通过 `property`（未定义时抛出）或 `findProperty`（不抛出；常与 `?:` 组合提供默认值）访问。

"一般来说，你应该只通过 Expo [Autolinking](/more/glossary-of-terms#autolinking)与 Gradle 文件交互"，它提供项目文件的编程接口。

### iOS AppDelegate

添加 delegate 方法的模块应使用 [AppDelegate subscribers](/modules/appdelegate-subscribers)，而不是 `withAppDelegate` mod（强烈不鼓励）；subscribers 让 Expo 模块安全地响应事件。引用的例子：`expo-linking` 的 [**LinkingAppDelegateSubscriber.swift**](https://github.com/expo/expo/blob/b4ca25a4319d7148258ebd5121d1df40a3b1333e/packages/expo-linking/ios/LinkingAppDelegateSubscriber.swift#L14)（openURL）；`expo-notifications` 的 [**NotificationsAppDelegateSubscriber.swift**](https://github.com/expo/expo/blob/bd469e421856f348d539b1b57325890147935dbc/packages/expo-notifications/ios/EXNotifications/PushToken/EXPushTokenManager.m)（didRegisterForRemoteNotificationsWithDeviceToken、didFailToRegisterForRemoteNotificationsWithError、didReceiveRemoteNotification）；还有社区示例 [bamlab/react-native-app-security](https://github.com/bamlab/react-native-app-security/blob/c1a861cbd348f404ec18ffae90d1c9bdc66bc00d/ios/RNASAppLifecyleDelegate.swift)。

### iOS CocoaPods Podfile

正则自定义是可能的，但"被认为是危险的，因为这类改动难以组合，多个改动很可能冲突。"优先使用 **Podfile.properties.json** 中的配置值：

```ruby Podfile
require 'json'

podfile_properties = JSON.parse(File.read(File.join(__dir__, 'Podfile.properties.json'))) rescue {}

platform :ios, podfile_properties['ios.deploymentTarget'] || '16.4'

target 'yolo27' do
  use_expo_modules!
  # ...

  # podfile_properties['your_property']
end
```

再次强调，通过 Expo [Autolinking](/more/glossary-of-terms#autolinking)与 Podfile 交互，以获得编程接口。

### 自定义基础修改器

`npx expo prebuild` 使用 [`@expo/prebuild-config`](https://github.com/expo/expo/tree/main/packages/%40expo/prebuild-config) 提供默认基础修改器，它们只处理常见文件；为自定义文件添加新的本地基础修改器。示例：通过 `ios.appDelegateHeader` 修改器支持 `ios/*/AppDelegate.h`（示例使用 `tsx` 处理本地 TypeScript，并非严格必需；参见[在 `app.config.js` 中使用 TypeScript](/guides/typescript#appconfigjs)）：

```ts withAppDelegateHeaderBaseMod.ts
import { ConfigPlugin, IOSConfig, Mod, withMod, BaseMods } from 'expo/config-plugins';
import fs from 'fs';

/**
 * A plugin which adds new base modifiers to the prebuild config.
 */
export function withAppDelegateHeaderBaseMod(config) {
  return BaseMods.withGeneratedBaseMods<'appDelegateHeader'>(config, {
    platform: 'ios',
    providers: {
      // Append a custom rule to supply AppDelegate header data to mods on `mods.ios.appDelegateHeader`
      appDelegateHeader: BaseMods.provider<IOSConfig.Paths.AppDelegateProjectFile>({
        // Get the local filepath that should be passed to the `read` method.
        getFilePath({ modRequest: { projectRoot } }) {
          const filePath = IOSConfig.Paths.getAppDelegateFilePath(projectRoot);
          // Replace the .m with a .h
          if (filePath.endsWith('.m')) {
            return filePath.substr(0, filePath.lastIndexOf('.')) + '.h';
          }
          // Possibly a Swift project...
          throw new Error(`Could not locate a valid AppDelegate.h at root: "${projectRoot}"`);
        },
        // Read the input file from the filesystem.
        async read(filePath) {
          return IOSConfig.Paths.getFileInfo(filePath);
        },
        // Write the resulting output to the filesystem.
        async write(filePath: string, { modResults: { contents } }) {
          await fs.promises.writeFile(filePath, contents);
        },
      }),
    },
  });
}

/**
 * (Utility) Provides the AppDelegate header file for modification.
 */
export const withAppDelegateHeader: ConfigPlugin<Mod<IOSConfig.Paths.AppDelegateProjectFile>> = (
  config,
  action
) => {
  return withMod(config, {
    platform: 'ios',
    mod: 'appDelegateHeader',
    action,
  });
};

// (Example) Log the contents of the modifier.
export const withSimpleAppDelegateHeaderMod = config => {
  return withAppDelegateHeader(config, config => {
    console.log('modify header:', config.modResults);
    return config;
  });
};
```

新的基础 mod 必须**最后**添加到 plugins 数组，在使用它的所有插件之后，因为它在最后把结果写入磁盘：

```js app.config.js
// Required for external files using TS
require('tsx/cjs');

import {
  withAppDelegateHeaderBaseMod,
  withSimpleAppDelegateHeaderMod,
} from './withAppDelegateHeaderBaseMod.ts';

export default ({ config }) => {
  if (!config.plugins) config.plugins = [];
  config.plugins.push(
    withSimpleAppDelegateHeaderMod,

    // Base mods MUST be last
    withAppDelegateHeaderBaseMod
  );
  return config;
};
```

更多信息见[添加支持的 PR](https://github.com/expo/expo-cli/pull/3852)。

## expo install

用 `npx expo install` 安装 node 模块会自动把它的配置插件添加到应用配置，简化设置并防止用户遗漏。注意事项：

1. 只自动把使用根 **app.config.js** 的插件添加到应用 manifest —— 防止像 `lodash` 这样的包被误认为配置插件并破坏 prebuild。
2. 没有检测强制插件 props 的机制；`expo install` 只添加插件，不加额外 props。`expo-camera` 的 props 是可选的，所以 `plugins: ['expo-camera']` 有效，但强制 props 会报错。
3. 自动添加只对静态应用配置（**app.json**、**app.config.json**）有效。使用 **app.config.js** 时，用户会看到警告：

```sh
Cannot automatically write to dynamic config at: app.config.js
Please add the following to your app config

{
  "plugins": [
    "expo-camera"
  ]
}
```
