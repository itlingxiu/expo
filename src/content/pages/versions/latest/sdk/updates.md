---
title: expo-updates 包参考
description: 让应用管理应用代码远程更新的库。
---

# expo-updates 包参考

> 支持平台：Android、iOS、tvOS、Expo Go。

`expo-updates` 让应用管理应用代码的远程更新。它与已配置的远程更新服务通信，获取可用更新的信息。

## 安装

可以用 [EAS Update](/eas-update/introduction) 自动配置 `expo-updates`。EAS Update 是托管服务，负责管理并向应用提供更新。要开始使用 EAS Update，请按[入门](/eas-update/getting-started)指南中的说明操作。

若需要不同的远程更新服务，或配置只写在原生文件里，也可以手动配置 `expo-updates`。

<details>
<summary>手动安装、配置与自定义远程更新服务</summary>

:::tabs
:::tab npm
```sh
npx expo install expo-updates
```
:::
:::tab yarn
```sh
yarn expo install expo-updates
```
:::
:::tab pnpm
```sh
pnpm expo install expo-updates
```
:::
:::tab bun
```sh
bun expo install expo-updates
```
:::
:::

若在[现有 React Native 项目](/bare/overview)或手动配置了原生代码的通用应用中安装此库，请按这些[安装说明](/bare/installing-updates)操作。

若使用[应用配置](/workflow/configuration)进行配置，至少设置以下应用配置属性即可配置此库：

- [`updates.url`](/versions/latest/config/app#updates)：实现 [Expo Updates 协议](/technical-specs/expo-updates-1) 的远程服务 URL
- [`runtimeVersion`](/versions/latest/config/app#runtimeversion)：[运行时版本](#运行时版本)

远程服务必须实现 [Expo Updates 协议](/technical-specs/expo-updates-1)。[EAS Update](/eas-update/introduction) 就是这样一种服务，也可以把此库配合自定义服务器使用。

[自定义 Expo Updates 服务器](https://github.com/expo/custom-expo-updates-server)

自定义服务器以及使用该服务器的应用的示例实现。

</details>

## 配置

有一些构建期配置选项控制此库的行为。对大多数应用，这些配置值写在[应用配置](/workflow/configuration)的 [`updates` 属性](/versions/latest/config/app#updates)下。

| [应用配置属性](/versions/latest/config/app#updates)                                       | 默认值   | 是否必需   | iOS plist/字典键               | Android meta-data 名称                                           | Android Map 键               |
| ----------------------------------------------------------------------------------- | --------- | ----------- | -------------------------------------- | ---------------------------------------------------------------- | ----------------------------- |
| [`updates.enabled`](/versions/latest/config/app#enabled)                                         | `true`    | 否  | `EXUpdatesEnabled`                     | `expo.modules.updates.ENABLED`                                   | `enabled`                     |
| [`updates.url`](/versions/latest/config/app#url)                                                 | （无）    | 是 | `EXUpdatesURL`                         | `expo.modules.updates.EXPO_UPDATE_URL`                           | `updateUrl`                   |
| [`updates.requestHeaders`](/versions/latest/config/app#requestheaders)                           | （无）    | 否  | `EXUpdatesRequestHeaders`              | `expo.modules.updates.UPDATES_CONFIGURATION_REQUEST_HEADERS_KEY` | `requestHeaders`              |
| [`runtimeVersion`](/versions/latest/config/app#runtimeversion)                                   | （无）    | 是 | `EXUpdatesRuntimeVersion`              | `expo.modules.updates.EXPO_RUNTIME_VERSION`                      | `runtimeVersion`              |
| [`updates.checkAutomatically`](/versions/latest/config/app#checkautomatically)                   | `ON_LOAD` | 否  | `EXUpdatesCheckOnLaunch`               | `expo.modules.updates.EXPO_UPDATES_CHECK_ON_LAUNCH`              | `checkOnLaunch`               |
| [`updates.fallbackToCacheTimeout`](/versions/latest/config/app#fallbacktocachetimeout)           | `0`       | 否  | `EXUpdatesLaunchWaitMs`                | `expo.modules.updates.EXPO_UPDATES_LAUNCH_WAIT_MS`               | `launchWaitMs`                |
| [`updates.useEmbeddedUpdate`](/versions/latest/config/app#useembeddedupdate)                     | `true`    | 否  | `EXUpdatesHasEmbeddedUpdate`           | `expo.modules.updates.HAS_EMBEDDED_UPDATE`                       | `hasEmbeddedUpdate`           |
| [`updates.codeSigningCertificate`](/versions/latest/config/app#codesigningcertificate)           | （无）    | 否  | `EXUpdatesCodeSigningCertificate`      | `expo.modules.updates.CODE_SIGNING_CERTIFICATE`                  | `codeSigningCertificate`      |
| [`updates.codeSigningMetadata`](/versions/latest/config/app#codesigningmetadata)                 | （无）    | 否  | `EXUpdatesCodeSigningMetadata`         | `expo.modules.updates.CODE_SIGNING_METADATA`                     | `codeSigningMetadata`         |
| [`updates.assetPatternsToBeBundled`](/versions/latest/config/app#assetpatternstobebundled)       | （无）    | 否  | 不适用                                    | 不适用                                                              | 不适用                           |
| [`updates.disableAntiBrickingMeasures`](/versions/latest/config/app#disableantibrickingmeasures) | `false`   | 否  | `EXUpdatesDisableAntiBrickingMeasures` | `expo.modules.updates.DISABLE_ANTI_BRICKING_MEASURES`            | `disableAntiBrickingMeasures` |
| [`updates.enableBsdiffPatchSupport`](/versions/latest/config/app#enablebsdiffpatchsupport)       | `true`    | 否  | `EXUpdatesEnableBsdiffPatchSupport`    | `expo.modules.updates.ENABLE_BSDIFF_PATCH_SUPPORT`               | `enableBsdiffPatchSupport`    |

两项核心必需配置是：

- [`updates.url`](/versions/latest/config/app#updates)：库获取远程更新的 URL
- [`runtimeVersion`](/versions/latest/config/app#runtimeversion)：[运行时版本](#运行时版本)

按 EAS Update [入门](/eas-update/getting-started)指南操作时，这些会自动配置。

### 运行时版本

每次为应用构建二进制文件时，都会包含构建当时的原生代码和配置，这一独特组合由称为运行时版本的字符串表示。远程更新针对某一个运行时版本，表示只有运行时版本匹配的二进制才能加载该远程更新。

<details>
<summary>手动配置</summary>

可以在配置字段中设置字符串值，从而手动管理运行时版本。

```json
{
  "expo": {
    "runtimeVersion": "<runtime_version_string>"
  }
}
```

</details>

<details>
<summary>使用运行时版本策略自动配置</summary>

运行时版本策略会从项目中已有的其他信息派生运行时版本。可以在 [`runtimeVersion`](/versions/latest/config/app#runtimeversion) 配置字段中按如下方式设置：

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "<policy_name>"
    }
  }
}
```

可用的策略类型：

<details>
<summary>appVersion</summary>

`"appVersion"` 策略适用于希望按应用版本定义运行时兼容性的项目。

例如，项目的应用配置中有如下内容：

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 1
    }
  }
}
```

`"appVersion"` 策略会把运行时版本设为项目当前的 `"version"` 属性。此例中，Android 和 iOS 构建以及任何更新的运行时版本都是 `"1.0.0"`。

该策略适合包含自定义原生代码、并在每次公开发布后更新 `"version"` 字段的项目。提交应用时，应用商店要求每次提交的构建都有更新后的原生版本号，因此若希望用户设备上安装的每个版本都有不同的运行时版本，这一策略很方便。

使用该策略时，每次公开发布都需要手动更新应用配置中的 `"version"` 字段；但对 Play Store 的 Internal Test Track 和 App Store 的 TestFlight 上传，可以依靠 **eas.json** 中的 `"autoIncrement"` 选项[代为管理版本](/build-reference/app-versions#remote-version-source)。

</details>

<details>
<summary>nativeVersion</summary>

`"nativeVersion"` 策略适用于希望按项目当前的 `"version"` 以及 `"versionCode"`（Android）或 `"buildNumber"`（iOS）属性定义运行时兼容性的项目。

例如，项目的应用配置中有如下内容：

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "nativeVersion"
    },
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 1
    }
  }
}
```

Android 和 iOS 构建以及任何更新的运行时版本是 `"[version]([buildNumber|versionCode])"` 的组合，此例中为 `"1.0.0(1)"`。

该策略适合包含自定义原生代码、并为每次构建更新原生版本号（iOS 的 `"buildNumber"` 和 Android 的 `"versionCode"`）的项目。提交应用时，应用商店要求每次提交的构建都有更新后的原生版本号，因此若希望上传到 Play Store Internal Test Track 和 App Store TestFlight 的每个应用都有不同的 `runtimeVersion`，这一策略很方便。

需要知道的是，该策略要求在每次构建之间手动管理原生版本号。

另外，若 Android 和 iOS 选择了不同的原生版本，构建和更新最终会有各自独立的运行时版本。

</details>

<details>
<summary>fingerprint</summary>

`"fingerprint"` 运行时版本策略会自动计算运行时版本，包括 SDK 升级或添加自定义原生代码这类变更。

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "fingerprint"
    }
  }
}
```

该策略对有无自定义原生代码的项目都适用。它使用 [`@expo/fingerprint`](/versions/latest/sdk/fingerprint) 包在构建和更新期间计算项目哈希，以判断构建与更新的兼容性（也就是运行时）。

</details>

</details>

### 原生配置与覆盖

若项目不使用持续原生生成（CNG），这些配置值也可以写在应用的原生配置文件中，或在原生代码初始化期间覆盖。

<details>
<summary>原生配置说明</summary>

在 Android 上，这些选项作为 `meta-data` 标签写在 **AndroidManifest.xml** 中（若使用了自动设置，则紧挨安装时添加的标签）。也可以在运行时用 `UpdatesController.overrideConfiguration()` 设置或覆盖它们。

在 iOS 上，这些属性作为键写在 **Expo.plist** 中。也可以在运行时调用 `AppController.overrideConfiguration` 来设置或覆盖它们。

<details>
<summary>为在 Objective-C++ 中使用而导入 Swift 生成的头文件</summary>

若 iOS 原生代码或 `AppDelegate.mm` 用 Objective-C++ 编写，需要添加以下导入才能引用 `EXUpdatesAppController` 上的方法。只有在运行时覆盖配置时才需要这样做。

```objc
#import "ExpoModulesCore-Swift.h"
#import "EXUpdatesInterface-Swift.h"
#import "EXUpdates-Swift.h"
```

</details>

</details>

## 用法

默认情况下，`expo-updates` 在应用启动时检查更新。若有可用更新，它会下载该更新，并在下次重启应用时应用它。可以用上面的 `checkAutomatically` 和 `fallbackToCacheTimeout` 配置选项调整这一启动行为。

此库还提供多种常量来检查当前更新，以及在应用代码中（启动之后）自定义更新行为的函数。例如，一种常见的替代用法是在应用启动之后手动检查更新，而不是在启动时做默认检查。

<details>
<summary>示例：手动检查更新</summary>

可以按以下步骤把应用配置为手动检查更新：

1. 把 `checkAutomatically` 配置值设为 `ON_ERROR_RECOVERY` 或 `NEVER`，以禁用此库的默认启动行为。
2. 添加以下代码，检查可用更新、下载并重新加载：

   ```jsx App.js
      import { View, Button } from 'react-native';
      import * as Updates from 'expo-updates';

      function App() {
        async function onFetchUpdateAsync() {
          try {
            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            }
          } catch (error) {
            // 获取更新出错时，也可以加一个 alert() 来查看错误信息。
            alert(`Error fetching latest Expo update: ${error}`);
          }
        }

        return (
          <View>
            <Button title="Fetch update" onPress={onFetchUpdateAsync} />
          </View>
        );
      }
      ```

</details>

## 测试

此库中的大多数方法和常量只能在发布构建中使用或测试。在调试构建中，默认行为是始终从开发服务器加载最新的 JavaScript。可以[构建一个更新行为与发布构建相同的调试版应用](/eas-update/debug#debugging-of-native-code-while-loading-the-app-through-expo-updates)。这样的应用不会从开发服务器打开最新 JavaScript，而是像发布构建一样加载已发布的更新。这在应用未连接开发服务器时调试行为可能有用。

**要在开发构建中测试更新内容**，运行 [`eas update`](/eas-update/getting-started)，然后在开发构建中浏览到该更新。这只是模拟更新在应用中的样子，在开发构建中运行时，大部分 [Updates API](#api) 不可用。

**要在发布构建中测试更新**，可以创建 [**.apk**](/build-reference/apk) 或[模拟器构建](/build-reference/simulators)，或在本地用 `npx expo run:android --variant release` 和 `npx expo run:ios --configuration Release` 做发布构建（测试时不必把这次构建提交到商店）。完整的 [Updates API](#api) 在发布构建中可用。

**要在 Expo Go 中测试更新内容**，运行 [`eas update`](/eas-update/getting-started)，然后在 Expo Go 中浏览到该更新。这只是模拟更新在应用中的样子，在 Expo Go 中运行时，大部分 [Updates API](#api) 不可用。另外，只支持使用 [与 Expo Go 兼容的库](/workflow/using-libraries#determining-third-party-library-compatibility) 的更新。

## API

```js
import * as Updates from 'expo-updates';
```

## 错误码

| 代码                              | 说明                                                                                                                                                                                                                                                                |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ERR_UPDATES_DISABLED`            | 在 Updates 库被禁用，或应用运行在开发模式时尝试调用了方法                                                                                                                                                      |
| `ERR_UPDATES_RELOAD`              | 尝试重新加载应用时出错，无法重新加载。对于现有 React Native 项目，请再次核对此库的设置步骤，确认已正确安装并调用了正确的原生初始化方法。 |
| `ERR_UPDATES_CHECK`               | 尝试检查新更新时发生意外错误。请查看错误信息以了解详情。                                                                                                                                                           |
| `ERR_UPDATES_FETCH`               | 尝试获取新更新时发生意外错误。请查看错误信息以了解详情。                                                                                                                                                              |
| `ERR_UPDATES_READ_LOGS`           | 尝试读取日志条目时发生意外错误。请查看错误信息以了解详情。                                                                                                                                                                |
| `ERR_NOT_AVAILABLE_IN_DEV_CLIENT` | 在开发构建中运行时该方法不可用。应使用发布构建来测试此方法。                                                                                                                                                         |
