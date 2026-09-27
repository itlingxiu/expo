---
title: 使用 eas.json 进行配置
description: 了解 EAS Build 和 EAS Submit 可用的属性，以便在项目内配置并覆盖它们的默认行为。
---

# 使用 eas.json 进行配置

**eas.json** 是 EAS CLI 与各项服务的配置文件。本页给出 [EAS Build](/build/introduction) 和 [EAS Submit](/deploy/submit-to-app-stores) 全部可用 schema 属性的完整参考。

:::note
要进一步了解使用 EAS 服务的项目如何用 **eas.json** 配置，请参阅[使用 eas.json 配置 EAS Build](/build/eas-json)和[使用 eas.json 配置 EAS Submit](/submit/eas-json)。
:::

## EAS Build

以下属性可用于 **eas.json** 中 `build` 键的 schema。

<details>
<summary>多个构建 profile 的 schema 示例</summary>

```json eas.json
{
  "build": {
    "base": {
      "node": "12.13.0",
      "yarn": "1.22.5",
      "env": {
        "EXAMPLE_ENV": "example value"
      },
      "android": {
        "image": "default",
        "env": {
          "PLATFORM": "android"
        }
      },
      "ios": {
        "image": "latest",
        "env": {
          "PLATFORM": "ios"
        }
      }
    },
    "development": {
      "extends": "base",
      "developmentClient": true,
      "env": {
        "ENVIRONMENT": "development"
      },
      "android": {
        "distribution": "internal",
        "withoutCredentials": true
      },
      "ios": {
        "simulator": true
      }
    },
    "staging": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "staging"
      },
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "production"
      }
    }
  }
}
```

</details>

### 原生平台的通用属性

#### `withoutCredentials`

**类型：** `boolean`

设为 `true` 时，EAS CLI 在构建应用时不会要求你配置凭据。使用 EAS Build [自定义构建](/custom-builds/get-started)时这很方便。默认为 `false`。

#### `extends`

**类型：** `string`

当前 profile 应当继承其值的构建 profile 名称。此值不能按平台分别指定。

#### `credentialsSource`

**枚举：** `local`、`remote`

用于为应用归档签名的凭据来源。

- `local`：如果你想提供自己的 [**credentials.json**](/app-signing/local-credentials)。
- `remote`：如果你想使用由 EAS 管理的凭据（默认选项）。

#### `releaseChannel`

**类型：** `string`

**已弃用**：Classic Updates 服务的发布频道名称，仅在 SDK 49 及更低版本中受支持。如果你不指定频道，二进制文件会从 `default` 频道拉取发布。

EAS Update 使用 [channel](#channel) 字段，因此在[迁移到 EAS Update](/eas-update/migrate-from-classic-updates)之后，可以移除 [`releaseChannel`](#releasechannel)。

#### `channel`

**类型：** `string`

此构建将在其中查找更新的 EAS Update 频道。[了解更多](/eas-update/how-it-works)。独立构建会检查并下载与平台、原生运行时和频道匹配的更新。

当 [`developmentClient`](#developmentclient) 设为 `true` 时，此字段不起作用，因为开发构建可以运行来自任何频道的更新。

如果你还没有从 Classic Updates 迁移到 EAS Update，请继续使用 [`releaseChannel`](#releasechannel) 字段。

#### `distribution`

**枚举：** `store`、`internal`

分发应用的方式。

- `internal`：使用此选项时，你可以与任何人分享构建 URL，他们可以直接从 Expo 网站把构建安装到设备上。使用 `internal` 时，请确保构建产出 **.apk** 或 **ipa** 文件。否则可分享的 URL 将无法使用。更多信息见[内部分发](/build/internal-distribution)。
- `store`：产出用于商店上传的构建，构建 URL 不可分享。

#### `developmentClient`

**类型：** `boolean`

设为 `true`（默认为 `false`）时，此字段会产出[开发构建](/workflow/overview#开发构建)。要让构建成功，项目必须已安装并配置 [`expo-dev-client`](/versions/latest/sdk/dev-client)。

**注意**：此字段会把 Android 的 `gradleCommand` 设为 `:app:assembleDebug`，把 iOS 的 `buildConfiguration` 设为 `Debug`。如果同一构建 profile 中提供了这些字段，它们会优先于 `developmentClient`。

#### `resourceClass`

**枚举：** `default`、`medium`、`large`

用于运行此构建的资源等级。各平台的对应关系见 [Android 专用 resource class 字段](#resourceclass-2)和 [iOS 专用 resource class 字段](#resourceclass-3)。

`large` 资源等级在免费方案上不可用。

#### `prebuildCommand`

**类型：** `string`

可选地覆盖 EAS 使用的 [prebuild](/more/expo-cli#prebuild) 命令。

例如，你可以指定 `prebuild --template example-template` 来使用自定义模板。

**注意**：构建引擎会自动添加 `--platform` 和 `--non-interactive`，因此你不需要手动指定它们。

#### `buildArtifactPaths`

**类型：** `string[]`

EAS Build 用来查找构建产物的路径（或模式）列表。使用 `applicationArchivePath` 指定上传应用归档的路径。即使构建失败，构建产物也会被上传。EAS Build 使用 [glob 模式](https://github.com/isaacs/node-glob#glob-primer)进行模式匹配。

#### `uploadSourceMaps`

**类型：** `boolean`

设为 `true` 时，构建期间生成的 JavaScript source map 会上传到 EAS。存储的 source map 由 [EAS Observe](/eas/observe/errors#符号化堆栈跟踪)用来符号化已报告错误的堆栈跟踪。map 中嵌入的源代码会在上传前移除。默认为 `false`。

**注意**：仅适用于在 EAS Build 服务器上运行的构建。本地构建不会上传 source map。

#### `node`

**类型：** `string`

构建使用的 Node.js 版本。

#### `corepack`

**类型：** `boolean`

设为 `true` 时，会在构建过程开始时启用 [corepack](https://nodejs.org/api/corepack.html)。默认为 `false`。

#### `yarn`

**类型：** `string`

构建使用的 Yarn 版本。

#### `pnpm`

**类型：** `string`

构建使用的 pnpm 版本。

#### `bun`

**类型：** `string`

构建使用的 Bun 版本。你也可以使用特定版本。了解[如何在 eas.json 中配置确切版本](/guides/using-bun#在-eas-上自定义-bun-版本)。

#### `expoCli`

**类型：** `string`

**已弃用**：用于[预构建](/more/expo-cli#prebuild)应用的 [`expo-cli`](https://www.npmjs.com/package/expo-cli) 版本。它只影响 Expo SDK 45 及更低版本上的托管项目。

对于更新的 SDK，EAS Build 会使用带版本的 [Expo CLI](/more/expo-cli)。它包含在 `expo` 库中。你可以在构建 profile 中设置环境变量 `EXPO_USE_LOCAL_CLI=0`，以停用带版本的 Expo CLI。

#### `env`

**类型：** `object`

构建过程中应当设置的[环境变量](/guides/environment-variables)。它只应用于你会提交到 git 仓库的值，而不应用于密码或[密钥](/eas/environment-variables#环境变量的可见性设置)。

#### `autoIncrement`

**类型：** `boolean`

控制 EAS CLI 如何递增应用的构建版本。默认为 `false`。

启用后，对于 Android，会递增 `expo.android.versionCode`（例如从 `3` 到 `4`）。对于 iOS，会递增 `expo.ios.buildNumber` 的最后一段（例如从 `1.2.3.39` 到 `1.2.3.40`）。

#### `cache`

**类型：** `object`

缓存配置。此功能用于缓存需要大量计算的值。例如编译结果（最终二进制文件和任何中间文件）。不过它不太适合 **node_modules**，因为缓存不在本机本地，下载速度与从 npm registry 下载相近。

##### `disabled`

**类型：** `boolean`

禁用缓存。默认为 `false`。

##### `key`

**类型：** `string`

缓存键。更改此值可以使缓存失效。

##### `paths`

**类型：** `array`

成功构建后将保存、并在下一次构建开始时恢复的路径列表。支持绝对路径和相对路径，相对路径从 **eas.json** 所在目录解析。

#### `config`

**类型：** `string`

用于运行此构建的自定义工作流文件名。你也可以在平台级别指定此属性，以使用特定平台的工作流。[了解更多](/custom-builds/get-started)。

示例：`"config": "production.yml"` 会使用 `.eas/build/production.yml` 中的工作流。

#### `environment`

**枚举：** `development`、`preview`、`production`

构建过程中用于应用环境变量的环境。[了解更多](/eas/environment-variables)。

### Android 专用选项

#### `withoutCredentials`

**类型：** `boolean`

设为 `true` 时，EAS CLI 在构建应用时不会要求你配置凭据。当你想构建调试二进制文件，并且调试 keystore 已签入仓库时，这很方便。默认为 `false`。

#### `image`

**类型：** `string`

[带有构建环境的镜像](/build-reference/infrastructure)。

#### `resourceClass`

**枚举：** `default`、`medium`、`large`

用于运行此构建的 Android 专用资源等级。默认为 `medium`。

各资源等级可用的构建资源见 [Android 构建服务器配置](/build-reference/infrastructure#android-构建服务器配置)。

`large` 资源等级在免费方案上不可用。

#### `ndk`

**类型：** `string`

Android NDK 的版本。

#### `autoIncrement`

**类型：** `boolean | "version" | "versionCode"`

控制 EAS CLI 如何递增应用的构建版本。默认为 `false`。

允许的值：

- `"version"`：递增 `expo.version` 的补丁版本（例如从 `1.2.3` 到 `1.2.4`）。
- `"versionCode"`（或 `true`）：递增 `expo.android.versionCode`（例如从 `3` 到 `4`）。
- `false`：不会自动递增版本（默认）。

根据 [**eas.json** 中 `cli.appVersionSource`](/build-reference/app-versions) 的值，这些值会在本地项目中更新，或在 EAS 服务器上更新。

#### `buildType`

**枚举：** `app-bundle`、`apk`

你想构建的产物类型。它控制使用哪个 Gradle 任务来构建项目。可以被 `gradleCommand` 或 `developmentClient: true` 选项覆盖。

- `app-bundle`：`:app:bundleRelease`（创建 **.aab** 产物）
- `apk`：`:app:assembleRelease`（创建 **.apk** 产物）

#### `gradleCommand`

**类型：** `string`

用于构建项目的 Gradle 任务。例如 `:app:assembleDebug` 用于构建调试二进制文件。除非你需要运行 `buildType` 不支持的任务，否则不建议使用。它的优先级高于 [`buildType`](#buildtype) 和 [`developmentClient`](#developmentclient)。

#### `applicationArchivePath`

**类型：** `string`

EAS Build 用来查找应用归档的路径（或模式）。EAS Build 使用 [glob 模式](https://github.com/isaacs/node-glob#glob-primer)进行模式匹配。默认值是 `android/app/build/outputs/**/*.{apk,aab}`。

#### `config`

**类型：** `string`

用于运行此 Android 构建的自定义工作流文件名。你也可以在 profile 级别指定此属性，以使用与平台无关的工作流。[了解更多](/custom-builds/get-started)。

示例：`"config": "production-android.yml"` 会使用 `.eas/build/production-android.yml` 中的工作流。

### iOS 专用选项

#### `withoutCredentials`

**类型：** `boolean`

设为 `true` 时，EAS CLI 在构建应用时不会要求你配置凭据。使用 EAS Build [自定义构建](/custom-builds/get-started)时这很方便。默认为 `false`。

#### `simulator`

**类型：** `boolean`

设为 true 时，创建用于 iOS 模拟器的构建。默认为 `false`。

#### `enterpriseProvisioning`

**枚举：** `universal`、`adhoc`

当你拥有加入 Apple Developer Enterprise Program 的 Apple 账户，并且 `"distribution": "internal"` 时使用的描述方式。你可以选择使用 `adhoc` 或 `universal` 描述。推荐后者，因为它不要求你登记每一台设备。如果你没有提供此选项，但仍然使用企业团队进行认证，系统会提示你选择使用哪种描述方式。

#### `autoIncrement`

**类型：** `boolean | "version" | "buildNumber"`

控制 EAS CLI 如何递增应用的构建版本。默认为 `false`。

允许的值：

- `"version"`：递增 `expo.version` 的补丁版本（例如从 `1.2.3` 到 `1.2.4`）。
- `"buildNumber"`（或 `true`）：递增 `expo.ios.buildNumber` 的最后一段（例如从 `1.2.3.39` 到 `1.2.3.40`）。
- `false`：不会自动递增版本（默认）。

根据 [**eas.json** 中 `cli.appVersionSource`](/build-reference/app-versions) 的值，这些值会在本地项目中更新，或在 EAS 服务器上更新。

#### `image`

**类型：** `string`

[带有构建环境的镜像](/build-reference/infrastructure)。

#### `resourceClass`

**枚举：** `default`、`medium`、`large`

用于运行此构建的 iOS 专用资源等级。默认为 `medium`。

各资源等级可用的构建资源见 [iOS 构建服务器配置](/build-reference/infrastructure#ios-构建服务器配置)。

`large` 资源等级在免费方案上不可用。

#### `bundler`

**类型：** `string`

[bundler](https://bundler.io/) 的版本。

#### `fastlane`

**类型：** `string`

fastlane 的版本。

#### `cocoapods`

**类型：** `string`

CocoaPods 的版本。

#### `scheme`

**类型：** `string`

Xcode 项目的 scheme。如果项目：

- 有多个 scheme，你应当设置此值。
- 只有一个 scheme，它会被自动检测。
- 有多个 scheme 且**未**设置此值，EAS CLI 会提示你选择其中一个。

#### `buildConfiguration`

**类型：** `string`

Xcode 项目的 Build Configuration。

- 对于 Expo 项目，值为 `"Release"` 或 `"Debug"`。默认为 `"Release"`。
- 对于 [裸 React Native](/bare/overview) 项目，默认使用 scheme 中指定的值。

它的优先级高于 [`developmentClient`](#developmentclient)。

#### `applicationArchivePath`

**类型：** `string`

EAS Build 用来查找应用归档的路径（或模式）。EAS Build 使用 [glob 模式](https://github.com/isaacs/node-glob#glob-primer)进行模式匹配。只有在使用自定义 **Gymfile** 时才应修改该路径。为模拟器构建时默认是 `ios/build/Build/Products/*-iphonesimulator/*.app`，其他情况默认是 `ios/build/*.ipa`。

#### `config`

**类型：** `string`

用于运行此 iOS 构建的自定义工作流文件名。你也可以在 profile 级别指定此属性，以使用与平台无关的工作流。[了解更多](/custom-builds/get-started)。

示例：`"config": "production-ios.yml"` 会使用 `.eas/build/production-ios.yml` 中的工作流。

## EAS Submit

以下属性可用于 **eas.json** 中 `submit` 键的 schema。

<details>
<summary>带 production profile 的 schema 示例</summary>

```json eas.json
{
  "cli": {
    "version": ">= 0.34.0"
  },
  "submit": {
    "production": {
      "android": {
        "track": "internal"
      },
      "ios": {
        "appleId": "john@turtle.com",
        "ascAppId": "1234567890",
        "appleTeamId": "AB12XYZ34S"
      }
    }
  }
}
```

</details>

### Android 专用选项

#### `serviceAccountKeyPath`

**类型：** `string`

用于向 Google Play 认证的 [Google Service Account Key](https://expo.fyi/creating-google-service-account) JSON 文件路径。

#### `track`

**枚举：** `production`、`beta`、`alpha`、`internal`

要使用的应用轨道。

#### `releaseStatus`

**枚举：** `completed`、`draft`、`halted`、`inProgress`

[发布的状态](https://developers.google.com/android-publisher/api-ref/rest/v3/edits.tracks#status)。

#### `rollout`

**类型：** `number`

有资格收到该发布的用户的初始比例。取值应从 0（没有用户）到 1（全部用户）。仅在 `inProgress` [发布状态](https://developers.google.com/android-publisher/api-ref/rest/v3/edits.tracks#status)下有效。

#### `changesNotSentForReview`

**类型：** `boolean`

表示此次提交发送的更改不会被审核，直到从 Google Play Console 界面显式送审。默认为 `false`。

#### `applicationId`

**类型：** `string`

访问由 Expo 管理的 Service Account Key 时使用的应用 ID。如果你使用本地凭据，它没有任何效果。大多数情况下此值会被自动检测。不过，如果你有多个 product flavor，可能需要此值。

### iOS 专用选项

#### `appleId`

**类型：** `string`

你的 Apple ID 用户名（也可以设置 `EXPO_APPLE_ID` 环境变量）。

#### `ascAppId`

**类型：** `string`

[App Store Connect 应用的唯一 Apple ID 编号](https://expo.fyi/asc-app-id)。设置后，会跳过创建应用的步骤。

#### `appleTeamId`

**类型：** `string`

你的 Apple Developer Team ID。

#### `sku`

**类型：** `string`

应用的唯一 ID，在 App Store 上不可见。除非提供，否则会自动生成。

#### `language`

**类型：** `string`

主要语言。默认为 "en-US"。

#### `companyName`

**类型：** `string`

公司名称，仅在向 App Store 首次提交任何应用时需要。

#### `appName`

**类型：** `string`

应用在 App Store 上显示的名称。默认使用[应用配置](/workflow/configuration)中的 `expo.name`。

#### `ascApiKeyPath`

**类型：** `string`

[App Store Connect API Key **.p8** 文件](https://expo.fyi/creating-asc-api-key)的路径。

#### `ascApiKeyIssuerId`

**类型：** `string`

[App Store Connect API Key](https://expo.fyi/creating-asc-api-key) 的 Issuer ID。

#### `ascApiKeyId`

**类型：** `string`

[App Store Connect API Key](https://expo.fyi/creating-asc-api-key) 的 Key ID。

#### `bundleIdentifier`

**类型：** `string`

访问由 Expo 管理的提交凭据时使用的 bundle identifier。如果你使用本地凭据，它没有任何效果。大多数情况下此值会被自动检测。不过，如果你有多个 Xcode scheme 和 target，可能需要此值。

#### `metadataPath`

**类型：** `string`

[商店配置文件](/eas/metadata)的路径。

#### `groups`

**类型：** `array`

要把该构建加入的 TestFlight 内部组名称数组。注意：除了你在这里提供的组之外，构建还会自动加入那些在 App Store Connect 中以 “Enable automatic distribution” 设置创建的组。
