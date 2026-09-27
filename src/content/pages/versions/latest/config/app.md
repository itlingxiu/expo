---
title: 应用配置参考（app.json / app.config.js）
description: Expo 应用配置（App Config）中可用属性的完整参考，涵盖 app.json 与 app.config.js。
---

# 应用配置参考（app.json / app.config.js）

以下列出的属性位于 **app.json** 或 **app.config.json** 中的 `"expo"` 键之下，也可以传入 **app.config.js** 或 **app.config.ts** 的顶层对象。有关应用配置文件以及动态用法的详细信息，请参阅[使用应用配置进行配置](/workflow/configuration)。

## name

类型：`string`

应用名称，在 Expo Go 中显示，也会作为独立应用安装到主屏幕后显示。

:::note 现有 React Native 应用？
如需重命名应用，请编辑 Xcode 中的 **Display Name** 字段，以及 `android/app/src/main/res/values/strings.xml` 中的 `app_name` 字符串。
:::

## description

类型：`string`

应用的简短描述，说明它是什么以及它的优点。

## slug

类型：`string`

项目的 URL 友好名称，在你的账号内唯一。

## owner

类型：`string`

拥有该项目的 Expo 账号名称。这对团队协作很有用，省略时默认为当前用户的用户名。

## currentFullName

类型：`string`

自动生成的账号名称与 slug，用于显示，不应直接设置。格式为 `@username/slug`，未登录时显示 `@anonymous`。对于已发布的项目，当项目在账号之间转移或被重命名时，该值可能变化。

## originalFullName

类型：`string`

自动生成的账号名称与 slug，供通知（Notifications）与 AuthSession 代理等服务使用，同样不应直接设置。格式为 `@username/slug`，未登录时显示 `@anonymous`。对于已发布的项目，当项目在账号之间转移或被重命名时，该值不会变化。

## sdkVersion

类型：`string`

项目运行的 Expo SDK 版本，应与 package.json 中的版本对应。

## runtimeVersion

类型：`string` 或 `object`

用于指示构建的原生代码与 OTA 更新之间兼容性的属性。

- 作为字符串时，需匹配 `^[a-zA-Z\d][a-zA-Z\d._+()-]{0,254}$`（任意自定义版本，最长 255 个字符），或匹配 `^exposdk:((\d+\.\d+\.\d+)|(UNVERSIONED))$`（SDK 版本模式）。
- 作为对象时，包含 `policy` 属性，可选值：`nativeVersion`、`sdkVersion`、`appVersion`、`fingerprint`。

有关运行时版本策略的详细信息，请参阅[运行时版本](/eas-update/runtime-versions)。

## version

类型：`string`

应用版本。与 `ios.buildNumber` 和 `android.versionCode` 一起使用。在 iOS 上对应 `CFBundleShortVersionString`，在 Android 上对应 `versionName`。请参阅[应用版本管理](/build-reference/app-versions)指南与 [Apple 的格式文档](https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleshortversionstring)。

:::note 现有 React Native 应用？
编辑 Xcode 中的 **Version** 字段，以及 `android/app/build.gradle` 中的 `versionName` 字符串。
:::

## platforms

类型：`array`

项目显式支持的平台。默认为 `["ios", "android"]`，如果安装了 `react-dom`，默认还会包含 `web`。

```json
["ios", "android", "web"]
```

## githubUrl

类型：`string`

填写你的仓库 URL，用于分享应用源代码；它会从你的 Expo 项目页面链接出去。

```json
"https://github.com/expo/expo"
```

## orientation

类型：`enum`（`default`、`portrait`、`landscape`）

将应用锁定为竖屏（portrait）或横屏（landscape）方向；默认为不锁定。

## userInterfaceStyle

类型：`enum`（`light`、`dark`、`automatic`）

强制应用始终使用浅色或深色外观（即「深色模式」），或自动跟随系统偏好。默认为 `light`。在 Android 上需要安装 `expo-system-ui`。

## backgroundColor

类型：`string`

React 视图背后的应用背景色，即根视图（root view）的背景色。接受 6 位十六进制颜色字符串，例如 `'#000000'`，默认白色 `'#ffffff'`。在 iOS 上需要安装 `expo-system-ui`。

## primaryColor

类型：`string`

在 Android 上决定应用在多任务切换器（multitasker）中的颜色；目前在 iOS 上未使用，将来可能会使用。接受 6 位十六进制颜色字符串，例如 `'#000000'`。

## icon

类型：`string`

应用图标图片的本地路径或远程 URL。推荐使用 1024x1024 的 png 图片。图标会显示在主屏幕与 Expo Go 应用中。

:::note 现有 React Native 应用？
编辑或替换 `ios/<PROJECT-NAME>/Assets.xcassets/AppIcon.appiconset`（建议使用 Xcode）与 `android/app/src/main/res/mipmap-<RESOLUTION>` 中的文件，遵循 Apple 与 Android 的图标指南，并提供每个必需的尺寸。
:::

## androidStatusBar

类型：`object`

Android 状态栏的配置。

:::warning 已弃用
`androidStatusBar` 已弃用，请改用 `expo-status-bar` 的配置插件。
:::

### barStyle

类型：`enum`（`light-content`、`dark-content`）

设置浅色或深色的状态栏图标。默认为 `dark-content`。

### backgroundColor

类型：`string`

状态栏的背景色。使用 `dark-content` 时默认为 `#00000000`（透明），使用 `light-content` 时默认为 `#00000088`（半透明黑色）。接受 6 位 `'#RRGGBB'` 或 8 位 `'#RRGGBBAA'` 十六进制格式，例如 `'#00000088'`。

### hidden

类型：`boolean`

状态栏是否可见。默认为 `false`。

### translucent

类型：`boolean`

为 `false` 时，状态栏会把内容向下推（类似 `position: relative`）；为 `true` 时，状态栏浮在内容上方（类似 `position: absolute`）。默认为 `true` 以匹配 iOS 的行为。显式设为 `true` 会在 `styles.xml` 中添加 `android:windowTranslucentStatus`，当 `softwareKeyboardLayoutMode` 设为 `resize` 时，可能在 Android 上引起意外的键盘行为，需要配合 `KeyboardAvoidingView` 使用。

## developmentClient

类型：`object`

专门针对在开发客户端（Development Client）中运行应用的设置。

### silentLaunch

类型：`boolean`

如果为 `true`，应用将在开发客户端中启动，不显示额外的对话框或进度指示器，就像独立应用一样。

## scheme

类型：`string` 或 `string[]`（须匹配 `^[a-z][a-z0-9+.-]*$`）

链接到应用的 URL scheme。例如设置为 `demo` 后，点击 `demo://` 开头的 URL 即可打开应用。它是构建时配置，在 Expo Go 中不生效。必须以小写字母开头，后跟小写字母、数字、`+`、`.` 或 `-`。

:::note 现有 React Native 应用？
替换 `Info.plist` 与 `AndroidManifest.xml` 中旧 scheme 的所有出现。
:::

## extra

类型：`object`

传递给 experience 的额外字段，可通过 `Constants.expoConfig.extra` 访问。

## updates

类型：`object`

[`expo-updates`](/versions/latest/sdk/updates) 库的配置。

### enabled

类型：`boolean`

默认：`true`

控制更新系统是否运行。如果禁用，发布版本将仅依赖构建时捆绑的代码和资源。

### checkAutomatically

类型：`enum`（`ON_ERROR_RECOVERY`、`ON_LOAD`、`WIFI_ONLY`、`NEVER`）

默认：`ON_LOAD`

默认情况下，expo-updates 会在每次应用加载时检查更新。`ON_ERROR_RECOVERY` 会关闭自动检查，仅在从错误中恢复时检查；`NEVER` 则完全关闭检查。

### useEmbeddedUpdate

类型：`boolean`

默认：`true`

决定是否加载内嵌更新。设为 `false` 时，会在启动时拉取更新；此时 `checkAutomatically` 必须为 `ON_LOAD`，且 `fallbackToCacheTimeout` 必须足够大以完成首次远程下载。生产环境不应使用。

### fallbackToCacheTimeout

类型：`number`

默认：`0`

启动时检查并拉取新更新、在回退到设备上已有最新更新之前等待的毫秒数。必须在 0 到 300000（5 分钟）之间。如果启动检查超过该时长，期间下载的任何更新将在下次启动时应用。

### url

类型：`string`

expo-updates 用于获取更新清单（manifest）的 URL。

### codeSigningCertificate

类型：`string`

本地 PEM 格式 X.509 证书的路径，用于验证代码签名更新。提供后，expo-updates 下载的每个更新都必须经过签名。

### codeSigningMetadata

类型：`object`

`codeSigningCertificate` 的元数据。

#### alg

类型：`enum`（`rsa-v1_5-sha256`）

用于生成清单代码签名签名的算法。

#### keyid

类型：`string`

标识证书中的密钥；用于在签名或验证签名时指引签名机制。

### requestHeaders

类型：`object`

获取清单或资源时，expo-updates 请求使用的额外 HTTP 头。这些头可能覆盖预设头。

### assetPatternsToBeBundled

类型：`array`

Glob 模式（相对于项目根目录），用于选择要包含在更新中的文件。省略时包含所有资源文件。`['**']` 匹配项目根目录下的所有资源文件。

例如，值为 `['app/images/**/*.png', 'app/fonts/**/*.woff']` 时，`app/images` 所有子目录中的 `.png` 文件与 `app/fonts` 所有子目录中的 `.woff` 文件都会被包含在更新中。

### disableAntiBrickingMeasures

类型：`boolean`

默认：`false`

禁用 expo-updates 内置的防「变砖」保护。设为 `true` 后允许通过 JS API 覆盖某些配置选项，操作不当可能让应用处于变砖状态。生产环境不应使用。

### useNativeDebug

类型：`boolean`

默认：`false`

在启用更新的同时启用原生代码调试。设为 `true` 会在 `Podfile.properties.json` 和 `gradle.properties` 中设置 `EX_UPDATES_NATIVE_DEBUG` 环境变量，使 Xcode 与 Android Studio 的调试构建包含 expo-updates，同时禁用 JS 调试（开发客户端或打包器）。生产环境不应使用。

### enableBsdiffPatchSupport

类型：`boolean`

默认：`true`

切换是否支持通过 bsdiff 下载并应用 bundle 差异补丁。

## locales

类型：`object`

为系统对话框提示（例如权限弹窗）提供各语言的值，并创建 Localizable.strings 文件来本地化推送通知等内容；平台专属字符串放在 `ios` 和 `android` 键下。

:::note 现有 React Native 应用？
语言与本地化信息必须使用 Xcode 添加或更改。
:::

## plugins

类型：`array`

为项目添加额外功能的[配置插件（Config Plugin）](/config-plugins/introduction)。

:::note 现有 React Native 应用？
添加修改的插件只能用于 prebuild 与托管式 EAS Build。
:::

## buildCacheProvider

类型：`enum`（`local`、`remote`）

启用从远程下载缓存构建。

## ios

类型：`object`

仅适用于 iOS 平台的配置。

### appleTeamId

类型：`string`

应用于所有原生目标的 Apple 开发团队 ID。可以在 [Apple Developer Portal](https://developer.apple.com/account) 中找到它。

### publishManifestPath

类型：`string`

发布期间，应用的 iOS 构建清单将写入此路径。

### publishBundlePath

类型：`string`

发布期间，应用的 iOS bundle 将写入此路径。

### bundleIdentifier

类型：`string`

独立 iOS 应用的 bundle ID。由你自行命名，但必须在 App Store 中唯一。采用反向 DNS 记法（例如 `host.exp.expo`，其中 `exp.host` 是域名，`expo` 是应用名）。

:::note 现有 React Native 应用？
在 `info.plist` 的 `CFBundleIdentifier` 中设置此值。
:::

### buildNumber

类型：`string`

独立 iOS 应用的构建号（build number）。对应 `CFBundleVersion`，必须符合 Apple 指定的格式。Transporter 从 `expo.version`（而非 `expo.ios.buildNumber`）获取 **Version Number**。

:::note 现有 React Native 应用？
在 `info.plist` 的 `CFBundleVersion` 中设置此值。
:::

### deploymentTarget

类型：`string`

设置最低支持的 iOS 版本。使用 `MAJOR.MINOR` 格式（例如 `"18.6"`）或仅主版本（例如 `"26"`）。

:::note 现有 React Native 应用？
在 Xcode 项目的构建设置中的 `IPHONEOS_DEPLOYMENT_TARGET` 下设置。
:::

### backgroundColor

类型：`string`

iOS 上 React 视图背后的颜色；如果存在，会覆盖顶层的 `backgroundColor`。接受 6 位十六进制颜色字符串，例如 `'#000000'`。在 iOS 上需要安装 `expo-system-ui` 才能生效。

### scheme

类型：`string` 或 `string[]`（须匹配 `^[a-z][a-z0-9+.-]*$`）

链接到 iOS 应用的 URL scheme；此处的 scheme 会与顶层的 `scheme` 键合并。必须以小写字母开头，后跟任意小写字母、数字、`+`、`.` 或 `-`。

:::note 现有 React Native 应用？
替换 `Info.plist` 与 `AndroidManifest.xml` 中旧 scheme 的所有出现。
:::

### icon

类型：`string` 或 `object`

iOS 应用图标的本地路径或远程 URL。也可以传入一个对象，按系统外观选择不同图标，或传入 `.icon` 目录的路径。如果提供，会覆盖顶层的 `icon`。请使用遵循 Apple 图标指南的 1024x1024 图标（包括色彩配置与透明度要求）；Expo 会生成其他所需尺寸。图标会显示在主屏幕与 Expo Go 中。

作为对象时，包含以下属性：

- `light`（`string`）：既不使用深色图标也不使用着色图标时显示。
- `dark`（`string`）：用户系统外观为深色时显示（参见 [Apple 人机界面指南](https://developer.apple.com/design/human-interface-guidelines/app-icons)）。
- `tinted`（`string`）：系统外观为着色时显示（参见 [Apple 人机界面指南](https://developer.apple.com/design/human-interface-guidelines/app-icons)）。

### appStoreUrl

类型：`string`

应用在 Apple App Store 上的 URL（如果已发布），用于从公开的 Expo 项目页面链接到商店页面。

```json
"https://apps.apple.com/us/app/expo-client/id982107779"
```

### bitcode

类型：`string`

开启 iOS Bitcode 优化。接受 iOS 构建配置（build configuration）的名称（例如 `Debug` 或 `Release`），只为该配置启用，其余配置禁用。在 Expo Go 中不可用。

### config

类型：`object`

此键不会出现在生产清单中，求值为 `undefined`；它仅在构建过程中使用，因为它可能包含一些开发者希望保密的 API 密钥。

#### usesNonExemptEncryption

类型：`boolean`

将独立 ipa 的 Info.plist 中的 `ITSAppUsesNonExemptEncryption` 设置为给定的布尔值。

#### googleMapsApiKey

类型：`string`

独立应用使用的 Google Maps iOS SDK 密钥（参见 [Google 的入门指南](https://developers.google.com/maps/documentation/ios-sdk/start)）。

### googleServicesFile

类型：`string`

`GoogleService-Info.plist` Firebase 配置文件的位置（参见 [Firebase 的配置文件文档](https://support.google.com/firebase/answer/7015592)）。

### supportsTablet

类型：`boolean`

默认：`false`

独立 iOS 应用是否支持平板屏幕尺寸。

:::note 现有 React Native 应用？
在 `info.plist` 的 `UISupportedInterfaceOrientations~ipad` 中设置此值。
:::

### isTabletOnly

类型：`boolean`

如果为 `true`，独立 iOS 应用仅支持平板，不支持手机。

:::note 现有 React Native 应用？
在 `info.plist` 的 `UISupportedInterfaceOrientations` 中设置此值。
:::

### requireFullScreen

类型：`boolean`

默认：`false`

如果为 `true`，独立 iOS 应用在 iPad 上不支持 Slide Over 与 Split View（分屏）。

:::note 现有 React Native 应用？
使用 Xcode 设置 `UIRequiresFullScreen`。
:::

### userInterfaceStyle

类型：`enum`（`light`、`dark`、`automatic`）

强制应用始终使用浅色或深色外观，或自动跟随系统偏好。未提供时默认为 `light`。

### infoPlist

类型：`object`

任意字典，合并进独立应用的原生 Info.plist。它在所有其他 Expo 特定配置之前应用，且不进行额外验证 —— 使用不当可能被 App Store 拒绝，风险自负。

### entitlements

类型：`object`

任意字典，合并进独立应用的原生 `*.entitlements`（plist）。与 `infoPlist` 一样，它在所有其他 Expo 特定配置之前应用且不进行验证，使用不当可能被 App Store 拒绝，风险自负。

### privacyManifests

类型：`object`

添加到应用原生 PrivacyInfo.xcprivacy 文件的隐私清单（Privacy Manifest）定义字典（参见 [Apple 的隐私清单文档](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)）。

#### NSPrivacyAccessedAPITypes

类型：`array`

使用受限 API 类别（[required reason API](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)）所需的理由。包含 `NSPrivacyAccessedAPIType`（`string`，应用使用的 required-reason API 类别名称）与 `NSPrivacyAccessedAPITypeReasons`（`array`，该类别对应的理由）。

#### NSPrivacyTrackingDomains

类型：`array`

应用用于跟踪的域名。

#### NSPrivacyTracking

类型：`boolean`

应用或第三方 SDK 是否将数据用于跟踪。

#### NSPrivacyCollectedDataTypes

类型：`array`

应用收集的数据类型。每个条目包含 `NSPrivacyCollectedDataType`（`string`）、`NSPrivacyCollectedDataTypeLinked`（`boolean`）、`NSPrivacyCollectedDataTypeTracking`（`boolean`）与 `NSPrivacyCollectedDataTypePurposes`（`array`）。

### associatedDomains

类型：`array`

独立应用的关联域名（Associated Domains）。每个条目必须遵循 `applinks:<完全限定域名>[:端口号]` 格式（参见 [Apple 的关联域名文档](https://developer.apple.com/documentation/xcode/supporting-associated-domains)）。

:::note 现有 React Native 应用？
使用 EAS 构建，或在 Xcode 中手动启用此能力（参见 [Apple 文档](https://developer.apple.com/documentation/xcode/supporting-associated-domains)）。
:::

### usesIcloudStorage

类型：`boolean`

应用是否为 `DocumentPicker` 使用 iCloud Storage（详见 DocumentPicker 文档）。

:::note 现有 React Native 应用？
使用 Xcode 或 `ios.entitlements` 进行配置。
:::

### usesAppleSignIn

类型：`boolean`

应用是否使用 Apple 登录（Sign-In）（详见 AppleAuthentication 文档）。

### usesBroadcastPushNotifications

类型：`boolean`

表示应用为推送通知（Push Notifications）能力使用了 Broadcast 选项。如果为 `true`，EAS CLI 会在能力同步期间使用该值；如果不使用 EAS CLI，除非有其他工具使用它，否则该设置无效 —— 此时请在 Apple Developer Portal 中手动启用该能力。

### accessesContactNotes

类型：`boolean`

应用是否可以访问联系人中存储的备注。在提交具有该能力的应用之前，必须获得 Apple 的授权。

### runtimeVersion

类型：`string` 或 `object`（`policy`，可选值：`nativeVersion`、`sdkVersion`、`appVersion`、`fingerprint`）

描述 iOS 构建的原生代码与 OTA 更新之间兼容性的属性。如果提供，会在 iOS 上覆盖顶层的 `runtimeVersion` 键。

### version

类型：`string`

iOS 应用版本，对应 `CFBundleShortVersionString`；与 `ios.buildNumber` 一起使用。优先于根 `version` 字段。所需格式见 [Apple 文档](https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleshortversionstring)。

:::note 现有 React Native 应用？
如需更改应用版本，请编辑 Xcode 中的 **Version** 字段。
:::

## android

类型：`object`

仅适用于 Android 平台的配置。

### publishManifestPath

类型：`string`

发布期间，应用的 Android 构建清单将写入此路径。

### publishBundlePath

类型：`string`

发布期间，应用的 Android 构建 bundle 将写入此路径。

### package

类型：`string`

独立 Android 应用的包名。由你自行命名，但必须在 Play Store 中唯一。采用反向 DNS 记法（例如 `com.example.app`，其中 `com.example` 是域名，`app` 是应用名）。仅允许大小写字母、数字和下划线，以点分隔，每段应以小写字母开头。必须是有效的 Android Application ID。

:::note 现有 React Native 应用？
在 `android/app/build.gradle` 中设置 `applicationId`，并在 `AndroidManifest.xml` 中设置（多处）。
:::

### versionCode

类型：`integer`

Google Play 要求的版本号。每次发布递增 1。必须为正整数（参见 [Android 的版本管理文档](https://developer.android.com/studio/publish/versioning)）。

:::note 现有 React Native 应用？
在 `android/app/build.gradle` 中设置 `versionCode`。
:::

### backgroundColor

类型：`string`

React 视图背后的背景色；如果存在，会覆盖顶层的 `backgroundColor`。接受 6 位十六进制颜色字符串，例如 `'#000000'`。

:::note 现有 React Native 应用？
在 `android/app/src/main/AndroidManifest.xml` 的 `android:windowBackground` 下设置。
:::

### userInterfaceStyle

类型：`enum`（`light`、`dark`、`automatic`）

强制应用始终使用浅色或深色外观，或自动跟随系统偏好。默认为 `light`。在 Android 上需要安装 `expo-system-ui` 才能生效。

### scheme

类型：`string` 或 `string[]`（须匹配 `^[a-z][a-z0-9+.-]*$`）

链接到 Android 应用的 URL scheme；此处的 scheme 会与顶层的 `scheme` 键合并。必须以小写字母开头，后跟小写字母、数字、`+`、`.` 或 `-`。

:::note 现有 React Native 应用？
替换 `Info.plist` 与 `AndroidManifest.xml` 中旧 scheme 的所有出现。
:::

### icon

类型：`string`

Android 应用图标的本地路径或远程 URL；如果提供，会覆盖顶层的 `icon`。推荐使用 1024x1024 的 png 图片，Google Play Store 推荐透明背景。图标会显示在主屏幕与 Expo Go 应用中。

### adaptiveIcon

类型：`object`

Android 自适应启动图标（Adaptive Launcher Icon）的设置（参见 [Android 的自适应图标指南](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)）。

#### foregroundImage

类型：`string`

图标图片的路径或 URL；同时覆盖顶层的 `icon` 与 `android.icon`。应遵循 Android 指定的指南。显示在主屏幕上。

#### monochromeImage

类型：`string`

用于 Android 13+ 单色图标（monochromatic icon）的图片；当用户在 Android 13+ 的系统设置中开启「Themed icons」时显示。

#### backgroundImage

类型：`string`

自适应图标的背景图片；覆盖 `backgroundColor`。必须与 `foregroundImage` 的尺寸一致。未指定 `foregroundImage` 时无效。

#### backgroundColor

类型：`string`

默认：`#FFFFFF`

自适应图标的背景色；没有 `foregroundImage` 时无效。接受 6 位十六进制颜色字符串。

### playStoreUrl

类型：`string`

应用在 Google Play Store 上的链接，用于从公开的 Expo 项目页面链接到商店页面。

```json
"https://play.google.com/store/apps/details?id=host.exp.exponent"
```

### permissions

类型：`array`

prebuild 期间要添加到 `AndroidManifest.xml` 的权限。

```json
["android.permission.SCHEDULE_EXACT_ALARM"]
```

:::note 现有 React Native 应用？
直接编辑 `AndroidManifest.xml`。要阻止已安装的原生包自动添加权限，可在清单中列出这些权限并附加 `tools:node="remove"` 标签。
:::

### blockedPermissions

类型：`array`

从最终 `AndroidManifest.xml` 中屏蔽的权限，用于移除由原生包合并进来的条目。内部使用 `tools:node="remove"` XML 属性。在 Expo Go 中不可用。

### googleServicesFile

类型：`string`

`google-services.json` Firebase 配置文件的路径。包含此键会自动在独立应用中启用 FCM。

:::note 现有 React Native 应用？
在 `android/app/google-services.json` 中添加或编辑该文件。
:::

### config

类型：`object`

此键不会出现在生产清单中，求值为 `undefined`。它仅在构建过程中使用，因为它包含的 API 密钥可能是一些开发者希望保密的。

#### googleMaps

类型：`object`

独立应用使用的 Google Maps Android SDK 配置。

##### apiKey

类型：`string`

你的 Google Maps Android SDK API 密钥。

### intentFilters

类型：`array`

在 Android 清单中配置自定义 intent filter（参见 [Android 的 intent 与 filter 指南](https://developer.android.com/guide/components/intents-filters)）。

```json
[
  {
    "autoVerify": true,
    "action": "VIEW",
    "data": {
      "scheme": "https",
      "host": "*.example.com"
    },
    "category": ["BROWSABLE", "DEFAULT"]
  }
]
```

:::note 现有 React Native 应用？
直接在 `AndroidManifest.xml` 中设置。
:::

#### autoVerify

类型：`boolean`

设为 `true` 会让应用成为默认链接处理器，不再弹出选择对话框；需要配置服务器提供 JSON 验证文件（参见 [Android App Links 文档](https://developer.android.com/training/app-links)）。

#### action

类型：`string`

intent filter 的 action。

#### data

类型：`object`

intent filter 的 data。

#### category

类型：`array`

intent filter 的 category。

### allowBackup

类型：`boolean`

默认：`true`

允许将应用数据自动备份到用户的 Google Drive。设为 `false` 则不备份也不恢复，适用于处理敏感信息的应用。

### softwareKeyboardLayoutMode

类型：`enum`（`resize`、`pan`）

默认：`resize`

决定软键盘如何影响布局。对应 `android:windowSoftInputMode` 属性。

### runtimeVersion

类型：`string` 或 `object`（`policy`，可选值：`nativeVersion`、`sdkVersion`、`appVersion`、`fingerprint`）

指示 Android 构建的原生代码与 OTA 更新之间兼容性的属性。如果存在，会在 Android 上覆盖顶层的 `runtimeVersion`。

### version

类型：`string`

Android 应用版本，对应 `versionName`；优先于根 `version` 字段。请参阅[应用版本管理](/build-reference/app-versions)指南。

:::note 现有 React Native 应用？
编辑 `android/app/build.gradle` 中的 `versionName` 字符串。
:::

### predictiveBackGestureEnabled

类型：`boolean`

默认：`false`

允许应用在 Android 13（API 级别 33）及以上使用预测性返回手势（参见 [Android 的预测性返回手势指南](https://developer.android.com/guide/navigation/predictive-back-gesture)）。

:::note 现有 React Native 应用？
更改 `AndroidManifest.xml` 中的 `android:enableOnBackInvokedCallback` 值。
:::

## web

类型：`object`

仅适用于 Web 平台的配置。

### output

类型：`enum`（`single`、`static`、`server`）

默认：`single`

选择 `expo start` 与 `expo export` 的输出方式。`static` 会为 `app/` 目录中的每个路由静态渲染 HTML 文件，仅适用于 Expo Router 项目。`single` 输出单页应用（SPA），只有一个 `index.html`，没有可被静态索引的内容。`server` 输出静态 HTML 和 API Routes，供自定义 Node.js 服务器托管。

### favicon

类型：`string`

应用 favicon 图片的路径，相对于项目。

### name

类型：`string`

设置文档标题（document title）。默认使用外层的 `name`。

### shortName

类型：`string`（最多 12 个字符）

缩短的应用名（12 个字符以内），显示在应用启动器和新建标签页中。对应 PWA `manifest.json` 中的 `short_name`。默认使用 `name` 属性。

### lang

类型：`string`

设置 `name` 与 `short_name` 值的主要语言，使用单一语言标签。

### scope

类型：`string`

定义站点上下文的导航范围，限制在应用清单生效期间可以查看的页面。超出范围时，用户会回到普通的浏览器标签页/窗口。相对范围会基于清单的 URL 进行解析。

### themeColor

类型：`string`（6 位十六进制颜色，例如 `'#000000'`）

Android 工具栏的颜色；也可能出现在任务切换器的应用预览中。

### description

类型：`string`

对所固定网站的通用描述。

### dir

类型：`enum`（`auto`、`ltr`、`rtl`）

`name`、`short_name` 与 `description` 的主要文本方向。与 `lang` 配合，可正确渲染从右到左的语言。

### display

类型：`enum`（`fullscreen`、`standalone`、`minimal-ui`、`browser`）

开发者偏好的网站显示模式。

### startUrl

类型：`string`

用户启动应用时打开的 URL（例如从主屏幕启动），通常是首页。必须相对于清单 URL。

### orientation

类型：`enum`（`any`、`natural`、`landscape`、`landscape-primary`、`landscape-secondary`、`portrait`、`portrait-primary`、`portrait-secondary`）

站点所有顶层浏览上下文的默认方向。

### backgroundColor

类型：`string`（6 位十六进制颜色，例如 `'#000000'`）

站点的预期背景色。它与 CSS 中声明的颜色重复，但能让浏览器在样式表加载前绘制快捷方式的背景，使从启动到内容显示的过渡更平滑。

### barStyle

类型：`enum`（`default`、`black`、`black-translucent`）

`default` 保持状态栏正常外观；`black` 让状态栏背景为黑色；`black-translucent` 让状态栏为黑色且透明。使用 `default` 或 `black` 时，Web 内容渲染在状态栏下方；使用 `black-translucent` 时，内容占满整个屏幕，部分被状态栏覆盖。

### preferRelatedApplications

类型：`boolean`

告知用户代理（user agent），`expo.ios` 与 `expo.android` 下声明的原生应用优先于网站。

### dangerous

类型：`object`

实验性功能，可能在没有弃用通知的情况下破坏。

### splash

类型：`object`

PWA 启动画面（splash screen）的配置。

:::note 现有 React Native 应用？
请参阅 [expo-splash-screen](https://github.com/expo/expo/tree/main/packages/expo-splash-screen)。
:::

#### backgroundColor

类型：`string`（6 位十六进制颜色，例如 `'#000000'`）

用给定的颜色填充加载画面背景。

#### resizeMode

类型：`enum`（`cover`、`contain`）

默认：`contain`

控制图片在启动加载画面上的渲染方式。

#### image

类型：`string`

填充加载画面背景的图片的本地路径或远程 URL；尺寸与宽高比由你决定，必须是 `.png` 图片。

### config

类型：`object`

Firebase Web 配置，供 `expo-firebase` 包在 Web 与原生端使用（参见 [Firebase JS SDK `initializeapp` 参考](https://firebase.google.com/docs/reference/js/app)）。

#### firebase

类型：`object`

Firebase Web 配置对象，包含以下字符串属性：`apiKey`、`authDomain`、`databaseURL`、`projectId`、`storageBucket`、`messagingSenderId`、`appId`、`measurementId`。

### bundler

类型：`enum`（`webpack`、`metro`）

选择 Web 平台的打包器。默认：存在 `@expo/webpack-config` 包时为 `webpack`，否则为 `metro`。仅在本地 CLI（`npx expo`）中受支持。

## experiments

类型：`object`

启用实验性功能，这些功能可能不稳定、不受支持，或在没有弃用通知的情况下被移除。

### outOfTreePlatforms

类型：`boolean`

如果安装了相应的支持包，启用对部分树外平台（out-of-tree platforms）的实验性支持。

### onDemandFilesystem

类型：`boolean`

开启 Expo 的按需文件系统（On-Demand Filesystem），允许 Metro 在 `watchFolders` 之外打包，并与包管理器的全局虚拟存储（Global Virtual Store）配合使用。

### autolinkingModuleResolution

类型：`boolean`

将 Expo 自动链接（Autolinking）的搜索结果应用到 Metro 的模块解析。打包时会固定项目的 `react`、`react-dom` 和 `react-native` 依赖，以及自动链接的 Expo/React Native 模块，有助于避免版本错位，尤其是在 monorepo 中。

### baseUrl

类型：`string`

将网站导出到域名的子路径下。该路径会原样添加到捆绑资源的链接之前。以 `/` 开头（推荐）会让资源相对于服务器根目录加载；否则资源会相对于发起请求的代码加载，可能产生意外结果。示例 `'/subpath'`。默认 `''`（空字符串）。

### buildCacheProvider

类型：`boolean`

:::warning 已弃用
此字段已不再标记为实验性，将在未来版本中移除 —— 请改用顶层的 `buildCacheProvider` 字段。
:::

### supportsTVOnly

类型：`boolean`

如果为 `true`，表示该项目不支持平板或手机，仅支持 Apple TV 和 Android TV。

### tsconfigPaths

类型：`boolean`

在 Metro 中启用 tsconfig/jsconfig 的 `compilerOptions.paths` 与 `compilerOptions.baseUrl` 导入别名支持。

### typedRoutes

类型：`boolean`

在 Expo Router 中启用静态类型链接支持。需要 Expo Router v2 项目并配置 TypeScript。

### turboModules

类型：`boolean`

启用 Turbo Modules，让原生模块以不同的方式在 JS 与平台代码之间通信。注意：Turbo Modules 不支持远程调试，启用此选项将禁用远程调试。

### reactCanary

类型：`boolean`

实验性地使用 vendored 的 React canary 构建来测试即将推出的功能。

### reactCompiler

类型：`boolean`

实验性地启用 React Compiler。

### reactServerComponentRoutes

类型：`boolean`

实验性地在 Expo Router 中默认启用 React Server Components，并为转场启用并发路由。

### reactServerFunctions

类型：`boolean`

实验性地在 Expo CLI 与 Expo Router 中启用 React Server Functions 支持。

### inlineModules

类型：`object`

内联模块（inline modules）的配置。定义它会开启 Expo CLI 和 expo-modules-autolinking 中的内联模块功能。

#### watchedDirectories

类型：`array`

要监视内联模块的目录列表。

#### xcodeProjectTargets

类型：`array`

内联模块文件要添加到的目标列表。如果未定义，默认仅主目标。

## _internal

类型：`object`

供开发者工具使用的内部属性。

### pluginHistory

类型：`object`

已在配置上运行过的插件列表。
