---
title: Mods
description: 了解 mod 以及如何在创建配置插件时使用它们。
---

# Mods

本指南介绍 mod 与 mod 插件是什么、如何工作，以及编写配置插件时如何使用它们。它聚焦于配置插件层级的底两级：

```
withMyPlugin ("myPlugin") [Config Plugin]
→ withAndroidPlugin, withIosPlugin [Plugin Function]
→ withAndroidManifest, withInfoPlist [Mod Plugin Function]
→ mods.android.manifest, mods.ios.infoplist [Mod]
```

## Mod 插件

Mod 插件让你在 prebuild 期间修改原生项目文件。它们来自 `expo/config-plugins`，包装顶层的 mod（"默认 mod"），因为那些 mod 是平台专属的，执行各种难以理解的繁重任务。

:::tip
对于需要 mod 的功能，优先使用 mod 插件，而不是直接操作顶层 mod。
:::

### 可用的 mod 插件

可在 `expo/config-plugins` 库中使用。

#### Android

| 默认 Android mod | Mod 插件 | 危险 | 描述 |
| --- | --- | --- | --- |
| `mods.android.manifest` | `withAndroidManifest`（[示例](https://github.com/expo/expo/blob/main/packages/expo-notifications/plugin/src/withNotificationsAndroid.ts)） | - | 以 JSON 修改 **android/app/src/main/AndroidManifest.xml**（用 [`xml2js`](https://www.npmjs.com/package/xml2js) 解析） |
| `mods.android.strings` | `withStringsXml`（[示例](https://github.com/expo/expo/blob/d7fb5d254d5cb57ab06055136db72b9347d3db1e/packages/expo-navigation-bar/plugin/src/withNavigationBar.ts)） | - | **android/app/src/main/res/values/strings.xml** 为 JSON（`xml2js`） |
| `mods.android.colors` | `withAndroidColors`（[示例](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/android/PrimaryColor.ts)） | - | **android/app/src/main/res/values/colors.xml** 为 JSON（`xml2js`） |
| `mods.android.colorsNight` | `withAndroidColorsNight`（[示例](https://github.com/expo/expo/blob/main/packages/expo-splash-screen/plugin/src/withAndroidSplashStyles.ts)） | - | **android/app/src/main/res/values-night/colors.xml** 为 JSON（`xml2js`） |
| `mods.android.styles` | `withAndroidStyles`（[示例](https://github.com/expo/expo/blob/main/packages/expo-splash-screen/plugin/src/withAndroidSplashStyles.ts)） | - | **android/app/src/main/res/values/styles.xml** 为 JSON（`xml2js`） |
| `mods.android.gradleProperties` | `withGradleProperties`（[示例](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/android/BuildProperties.ts#L5)） | - | 以 `Properties.PropertiesItem[]` 修改 **android/gradle.properties** |
| `mods.android.mainActivity` | `withMainActivity`（[示例](https://github.com/expo/expo/blob/main/packages/install-expo-modules/src/plugins/android/withAndroidModulesMainActivity.ts#L2)） |  | **android/app/src/main/<package>/MainActivity.java** 为字符串 |
| `mods.android.mainApplication` | `withMainApplication`（[示例](https://github.com/expo/expo/blob/main/packages/expo-web-browser/plugin/src/withWebBrowserAndroid.ts#L8)） |  | **android/app/src/main/<package>/MainApplication.java** 为字符串 |
| `mods.android.appBuildGradle` | `withAppBuildGradle`（[示例](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/android/GoogleServices.ts#L5)） |  | **android/app/build.gradle** 为字符串 |
| `mods.android.projectBuildGradle` | `withProjectBuildGradle`（[示例](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/android/GoogleServices.ts#L5)） |  | **android/build.gradle** 为字符串 |
| `mods.android.settingsGradle` | `withSettingsGradle`（[示例](https://github.com/expo/expo/blob/main/packages/install-expo-modules/src/plugins/android/withAndroidSettingsGradle.ts#L2)） |  | **android/settings.gradle** 为字符串 |

#### iOS

| 默认 iOS mod | Mod 插件 | 危险 | 描述 |
| --- | --- | --- | --- |
| `mods.ios.infoPlist` | `withInfoPlist`（[示例](https://github.com/expo/expo/blob/main/packages/expo-location/plugin/src/withLocation.ts)） | - | **ios/<name>/Info.plist** 为 JSON（用 [`@expo/plist`](https://www.npmjs.com/package/@expo/plist) 解析） |
| `mods.ios.entitlements` | `withEntitlementsPlist`（[示例](https://github.com/expo/expo/blob/main/packages/expo-apple-authentication/plugin/src/withAppleAuthIOS.ts)） | - | **ios/<name>/<product-name>.entitlements** 为 JSON（`@expo/plist`） |
| `mods.ios.expoPlist` | `withExpoPlist`（[示例](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/ios/Updates.ts#L6)） | - | **ios/<name>/Expo.plist** 为 JSON（iOS 的 Expo updates 配置）（`@expo/plist`） |
| `mods.ios.xcodeproj` | `withXcodeProject`（[示例](https://github.com/expo/expo/blob/main/packages/expo-asset/plugin/src/withAssetsIos.ts)） | - | **ios/<name>.xcodeproj** 为 `XcodeProject` 对象（用 [`xcode`](https://www.npmjs.com/package/xcode) 解析） |
| `mods.ios.podfile` | `withPodfile`（[示例](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/ios/Maps.ts#L6)） | - | **ios/Podfile** 为字符串 |
| `mods.ios.podfileProperties` | `withPodfileProperties`（[示例](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/ios/BuildProperties.ts#L4)） | - | **ios/Podfile.properties.json** 为 JSON |
| `mods.ios.appDelegate` | `withAppDelegate`（[示例](https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/ios/Maps.ts#L6)） |  | **ios/<name>/AppDelegate.m** 为字符串 |

:::note
关于默认的 Android 与 iOS mod：默认 mod 由 mod 编译器提供，用于常见的文件操作。危险修改依赖正则表达式来修改应用代码；它们可能破坏构建且难以版本控制，请谨慎使用。文档建议用应用代码修改应用代码，即 [Expo Modules](https://github.com/expo/expo/tree/main/packages/expo-modules-core) 原生 API。
:::

## Mods

配置插件使用 **mod**（修改器）在 prebuild 期间修改原生项目文件。它们是异步函数，用于更改平台专属文件，如 **AndroidManifest.xml**、**Info.plist** 及其他原生配置文件，无需手动编辑，并且只在 `npx expo prebuild` 的**同步（syncing）**阶段运行。每个 mod 接受一个 config 与一个数据对象，然后把两者作为一个对象返回。例如，`mods.android.manifest` 编辑 **AndroidManifest.xml**，`mods.ios.plist` 编辑 **Info.plist**。

本页强调：不要在插件中直接使用顶层 mod（例如 `with.android.manifest`）；改用 `expo/config-plugins` 中的 mod 插件，它们包装顶层 mod 函数并在幕后完成工作（参见[可用的 mod 插件列表](/develop/config-plugins/mods#available-mod-plugins)）。

#### 默认 mod 如何工作及其关键特征

解析后的默认 mod 被放在应用配置的 `mods` 对象上，它与配置的其余部分不同，因为它不被序列化 —— 因此可以在代码生成期间使用。尽可能使用 mod 插件而不是默认 mod，因为它们更简单。

默认 mod 的高层流程：

- 通过 `@expo/prebuild-config` 的 [`getPrebuildConfig`](https://github.com/expo/expo/blob/efc2db4eb1c909544e28792a15c89f8d22113c5b/packages/%40expo/prebuild-config/src/getPrebuildConfig.ts#L28) 读取配置
- 通过 `withIosExpoPlugins` 中的插件添加 Expo 核心功能 —— 名称、版本、图标、语言环境等
- 配置交给编译器 `compileModsAsync`
- 编译器添加读取数据的基础 mod（例如 **Info.plist**），运行命名 mod（例如 `mods.ios.infoPlist`），并把结果写入文件系统
- 编译器遍历所有 mod，异步求值它们并传递 `projectRoot` 等基础 props
  - 每个 mod 之后，错误处理检查无效 mod 是否损坏了 mod 链

关键特征：

- Mod 从 manifest 中省略，"无法通过 `Updates.manifest` 访问" —— 它们的存在是为了在代码生成期间修改原生文件。
- Mod 让你在 `npx expo prebuild` 期间安全地读/写文件；Expo CLI 就是这样修改 **Info.plist**、entitlements、xcproj 等的。
- Mod 是平台专属的，属于平台专属对象：

```ts app.config.ts
module.exports = {
  name: 'my-app',
  mods: {
    ios: {
      /* iOS mods... */
    },
    android: {
      /* Android mods... */
    },
  },
};
```

Mod 解析后，每个 mod 的内容被写入磁盘。可以添加自定义 mod 以支持新的原生文件 —— 例如，为传给其他 mod 的 **GoogleServices-Info.plist** 添加一个 mod。

### Mod 插件如何工作

Mod 插件运行时收到一个 `config` 对象，带有额外属性：`modResults` 与 `modRequest`。

#### `modResults`

存放要修改并返回的数据；其类型取决于所用的 mod。

#### `modRequest`

由 mod 编译器提供，具有以下属性：

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `projectRoot` | `string` | 通用应用的项目根目录。 |
| `platformProjectRoot` | `string` | 特定平台的项目根目录。 |
| `modName` | `string` | Mod 的名称。 |
| `platform` | `ModPlatform` | mods 配置中使用的平台名称。 |
| `projectName` | `string` | （仅 iOS）用于查询项目文件的路径组件。例如 `projectRoot/ios/[projectName]/`。 |

## 创建你自己的 mod

示例：一个更新 Xcode 项目"product name"的 mod，作为使用 [`withXcodeProject`](/develop/config-plugins/mods#ios) mod 插件的配置插件文件：

```ts my-config-plugin.ts
import { ConfigPlugin, withXcodeProject, IOSConfig } from 'expo/config-plugins';

const withCustomProductName: ConfigPlugin<string> = (config, customName) => {
  return withXcodeProject(
    config,
    async (
      config
    ) => {
      config.modResults = IOSConfig.Name.setProductName({ name: customName }, config.modResults);
      return config;
    }
  );
};

// Usage:

/// Create a config
const config = {
  name: 'my app',
};

/// Use the plugin
export default withCustomProductName(config, 'new_name');
```

## 插件模块解析

有两种基本方式：(1) **在应用项目内定义的插件** —— 本地、易于自定义并随应用代码维护，适合项目专属需求；(2) **独立包插件** —— 单独的 npm 包，适合跨项目复用。两者提供相同的能力，但结构与导入不同。未指定的解析模式属于意外行为，可能发生破坏性变更。

> 任何未在下面指定的解析模式都是意外行为，可能发生破坏性变更。

### 在应用项目内定义的插件

#### 文件导入

创建一个 JS/TS 文件，像其他 JS/TS 文件一样在配置中使用。

`app.config.ts`
```ts
import "./my-config-plugin"
```
`my-config-plugin.ts` —— ✓ 从配置导入

最小插件函数：

```ts my-config-plugin.ts
module.exports = ({ config }: { config: ExpoConfig }) => {};
```

#### 动态应用配置内的内联函数

配置对象也支持把函数直接传给 `plugins` 数组 —— 便于测试或避免单独文件。

```js app.config.ts
const withCustom = (config, props) => config;

const config = {
  plugins: [
    [
      withCustom,
      {
        /* props */
      },
    ],
    withCustom,
  ],
};
```

一个注意事项：使用函数而不是字符串时，序列化会把函数换成它的名称，manifest 才能正常工作。序列化结果：

```json
{
  "plugins": [["withCustom", {}], "withCustom"]
}
```

### 独立包插件

参见[创建带配置插件的模块](/modules/config-plugin-and-native-module-tutorial)获取独立包的分步指南。两种实现风格：

#### 1. 专用配置插件包

唯一目的就是配置插件的 npm 包；通过 `app.plugin.js` 导出：

```ts
import "expo-splash-screen"
```
```
node_modules
 expo-splash-screen  Node module
  app.plugin.js      ✓ Entry file for custom plugins
  build
   index.js          ✗ Skipped in favor of app.plugin.js
```

#### 2. 带伴随包的配置插件

当插件是缺少 **app.plugin.js** 的模块的一部分时，使用包的 `main` 入口点：

```ts
import "expo-splash-screen"
```
```
node_modules
 expo-splash-screen  Node module
  package.json       "main": "./build/index.js"
  build
   index.js          ✓ Node resolve to this file
```

### 插件解析顺序

1. **包根目录的 app.plugin.js**
```
node_modules
 expo-splash-screen  Node module
  package.json       "main": "./build/index.js"
  app.plugin.js      ✓ Entry file for custom plugins
  build
   index.js          ✗ Skipped in favor of app.plugin.js
```
2. **包的 main 入口（来自 package.json）**
```
node_modules
 expo-splash-screen  Node module
  package.json       "main": "./build/index.js"
  build
   index.js          ✓ Node resolve to this file
```
3. **直接内部导入**（不推荐）

> 避免直接导入模块内部，因为它绕过标准解析顺序，可能在未来更新中损坏。

```ts
import "expo-splash-screen/build/index.js"
```
```
node_modules
 expo-splash-screen
  package.json       "main": "./build/index.js"
  app.plugin.js      ✗ Ignored due to direct import
  build
   index.js          ✓ expo-splash-screen/build/index.js
```

### 为什么插件使用 app.plugin.js

这种方式是首选，因为它允许与主包代码不同的转译设置 —— 这一点很重要，因为 Node 环境通常需要不同于 Android、iOS 或 Web JS 环境的预设（例如 `module.exports` 而不是 `import/export`）。
