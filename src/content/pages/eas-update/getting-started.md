---
title: 开始使用 EAS Update
description: 了解在项目中配置和使用 EAS Update 所需的设置。
---

# 开始使用 EAS Update

## 用 AI 代理设置 EAS Update

把下面的内容粘贴到 Claude、Cursor、Codex 或其他代理中。

```text
在我的 Expo 项目中设置 EAS Update，以便我可以在不做新构建的情况下发布 JavaScript 和资源变更。按顺序完成这些步骤。

1. 识别项目类型。如果 android 和 ios 目录没有提交，项目使用 CNG。如果它们已提交，则是裸 React Native 项目，标记为“仅裸项目”的步骤也适用。
2. 用 `npm install -g eas-cli` 安装或升级 EAS CLI。
3. 用 `eas whoami` 检查我是否已登录。如果没有，运行 `eas login`。
4. 仅裸项目：准备原生项目。
   - 如果项目没有 Expo modules，运行 `npx install-expo-modules@latest`，以便使用 Expo CLI 和 Metro 配置。
   - 如果缺少该包，运行 `npx expo install expo-updates`，然后运行 `npx pod-install`。
   - 如果 index.js 调用 `AppRegistry.registerComponent(appName, () => App)`，从 `expo` 导入 `registerRootComponent`，并把该调用替换为 `export default registerRootComponent(App)`。然后在 `MainActivity` 和 `AppDelegate` 中把模块名设为 "main"，而不是应用名。
5. 运行 `eas update:configure`。它会把 `runtimeVersion` 和 `updates.url` 写入应用配置，并在缺少时添加 `extra.eas.projectId`。
6. 仅裸项目：检查 `eas update:configure` 更改的原生文件。AndroidManifest.xml 需要 `expo.modules.updates.EXPO_UPDATE_URL` 和 `EXPO_RUNTIME_VERSION` 的 meta-data，strings.xml 需要 `expo_runtime_version` 字符串，ios/<project>/Supporting/Expo.plist 需要 `EXUpdatesURL` 和 `EXUpdatesRuntimeVersion`。如果用 Xcode 构建项目，把 Expo.plist 加入 Xcode 项目。
7. 设置更新 channel：
   - 使用 EAS Build：在 eas.json 的 `preview` 和 `production` profile 上设置 `channel`，或在本项目使用的 profile 上设置。
   - 不使用 EAS Build 且为 CNG：在应用配置中把 `updates.requestHeaders` 设为 `{"expo-channel-name": "<channel>"}`。它会在下次 `npx expo prebuild` 时生效。
   - 不使用 EAS Build 且为裸项目：在 AndroidManifest.xml 中添加值为 `{"expo-channel-name":"<channel>"}` 的 `expo.modules.updates.UPDATES_CONFIGURATION_REQUEST_HEADERS_KEY` meta-data，并在 Expo.plist 中添加 `EXUpdatesRequestHeaders` 字典，把 `expo-channel-name` 设为该 channel。
8. 停下来问我：“一切都已配置。你在设备或模拟器上有预览构建吗？”如果我说没有，在为我说出的平台运行 `eas build --profile preview --platform <platform>` 之前先询问。
9. 停下来问我：“一切都已设置。你现在想发布更新吗？”如果我说想，向我询问 channel、消息和环境，然后运行 `eas update --channel <channel> --message "<message>" --environment <environment>`。
10. 告诉我如何测试更新：从开发构建的 Extensions 标签页加载它，或强制关闭并重新打开发布构建两次。

匹配本项目已经使用的包管理器，并报告你运行了什么。

关于 EAS Update 入门指南，参见 https://docs.expo.dev/eas-update/getting-started/。
```

设置 EAS Update 后，你可以推送用户立刻需要的关键 bug 修复和改进。本指南将带你在新项目或现有项目中设置 EAS Update。

:::note
如果你计划把 EAS Update 与 EAS Build 一起使用，建议在继续之前先遵循 [EAS Build 设置指南](/build/setup)。即便如此，[你可以不使用任何其他 EAS 服务来使用 EAS Update](/eas-update/standalone-service)。
:::

## 前置条件

- **一个 Expo 账户**

  任何拥有 Expo 账户的人都可以使用 EAS Update，无论你是否为 EAS 付费或使用免费方案。你可以在 [expo.dev/signup](https://expo.dev/signup) 注册。

  付费订阅者可以向更多用户发布更新，并使用更多带宽和存储。不同方案和权益见 [EAS 定价](https://expo.dev/pricing)。

- **一个 React Native 项目**

  还没有项目？可以快速创建一个能配合本指南使用的 "Hello world" 应用。运行以下命令创建新项目：

:::tabs
:::tab npm
```sh
$ npx create-expo-app@latest my-app
```
:::
:::tab yarn
```sh
$ yarn create expo-app my-app
```
:::
:::tab pnpm
```sh
$ pnpm create expo-app my-app
```
:::
:::tab bun
```sh
$ bun create expo my-app
```
:::
:::

  EAS Update 也适用于由 `npx create-react-native-app`、`npx react-native`、`ignite-cli` 及其他项目脚手架工具创建的项目。

- **Expo CLI 与 Expo Metro Config**

  如果你已经用 `npx expo [command]` 运行项目（例如用 `npx create-expo-app` 创建的），那就准备好了。

  如果项目中还没有 `expo` 包，运行下面的命令安装它，并[选择使用 Expo CLI 和 Metro Config](/bare/installing-expo-modules#在-android-和-ios-上为打包配置-expo-cli)：

  ```sh
  $ npx install-expo-modules@latest
  ```

  如果命令失败，参见[安装 Expo modules](/bare/installing-expo-modules#手动安装)指南。

- **使用 `registerRootComponent` 而不是 `registerComponent`**

  如果你用 `npx create-expo-app` 创建项目，或者应用中根本不调用 `registerRootComponent`（例如由 Expo Router 处理），那就准备好了。以下内容适用于用其他工具（如 React Native Community CLI）创建的项目。

  我们建议使用 EAS Update 的应用使用 Expo 的 [`registerRootComponent`](/versions/latest/sdk/expo#registerrootcomponentcomponent)，而不是 React Native 的 `registerApplication`。这确保 Expo 可以配置 React Native 去加载更新中包含的资源，例如图片。如果你不使用 `registerRootComponent`，资源可能在发布构建中不可用。

  在用 React Native Community CLI 创建的简单应用中，差异如下：

  ```diff index.js
  diff --git a/index.js b/index.js
  index 0000000..1111111 100644
  --- a/index.js
  +++ b/index.js
  @@ -1,5 +1,4 @@
  -import {AppRegistry} from 'react-native';
  -import {name as appName} from './app.json';
  +import {registerRootComponent} from 'expo';
   import App from './App';
  -
  -AppRegistry.registerComponent(appName, () => App);
  +export default registerRootComponent(App);
  ```

  做出该更改后，更新 [`MainActivity`](/versions/latest/sdk/expo#rootregistercomponent-setup-for-existing-react-native-projects) 和 [`AppDelegate`](/versions/latest/sdk/expo#rootregistercomponent-setup-for-existing-react-native-projects)，使用模块名 `"main"` 而不是应用名。

## 安装最新的 EAS CLI

EAS CLI 是你将用来从终端与 EAS 服务交互的命令行应用。要安装它，运行：

:::tabs
:::tab npm
```sh
$ npm install --global eas-cli
```
:::
:::tab yarn
```sh
$ yarn global add eas-cli
```
:::
:::tab pnpm
```sh
$ pnpm add --global eas-cli
```
:::
:::tab bun
```sh
$ bun add --global eas-cli
```
:::
:::

你也可以用上面的命令检查是否有新版本的 EAS CLI。我们鼓励你始终保持最新版本。

> 我们建议全局安装包时使用 `npm` 而不是 `yarn`。你也可以使用 `npx eas-cli@latest`。文档中凡是需要调用 `eas` 的地方，记得改用它。

## 登录你的 Expo 账户

如果你已经用 Expo CLI 登录了 Expo 账户，可以跳过本节描述的步骤。如果没有，运行以下命令登录：

```sh
$ eas login
```

你可以运行 `eas whoami` 检查是否已登录。

## 配置项目

在终端中进入项目目录并运行以下命令：

```sh
# 用 EAS Update 初始化项目
$ eas update:configure
```

<details>
<summary>这条命令做什么？</summary>

`eas update:configure` 命令会用 `runtimeVersion` 和 `updates.url` 属性更新 **app.json** 文件，并在项目此前未使用任何 EAS 服务时添加 `extra.eas.projectId` 字段。

在不使用 [CNG](/workflow/continuous-native-generation) 的项目中运行 `eas update:configure` 时，你会看到原生项目有以下更改：

### Android

在 **android/app/src/main/AndroidManifest.xml** 文件中，你会看到以下新增内容：

```xml android/app/src/main/AndroidManifest.xml
<meta-data android:name="expo.modules.updates.EXPO_UPDATE_URL" android:value="https://u.expo.dev/your-project-id"/>
<meta-data android:name="expo.modules.updates.EXPO_RUNTIME_VERSION" android:value="@string/expo_runtime_version"/>
```

`EXPO_UPDATE_URL` 的值应包含你的项目 ID。

在 **android/app/src/main/res/values/strings.xml** 中，你会在 `resources` 对象里看到 `expo_runtime_version` 字符串条目：

```diff android/app/src/main/res/values/strings.xml
diff --git a/android/app/src/main/res/values/strings.xml b/android/app/src/main/res/values/strings.xml
index ef1de86..d3d75b0 100644
--- a/android/app/src/main/res/values/strings.xml
+++ b/android/app/src/main/res/values/strings.xml
@@ -1,3 +1,4 @@
 <resources>
     <string name="app_name">MyApp</string>
+    <string name="expo_runtime_version">1.0.0</string>
 </resources>
```

### iOS

在 **ios/project-name/Supporting/Expo.plist** 中，你会看到以下新增内容：

```xml ios/project-name/Supporting/Expo.plist
<key>EXUpdatesRuntimeVersion</key>
<string>1.0.0</string>
<key>EXUpdatesURL</key>
<string>https://u.expo.dev/your-project-id</string>
```

`EXUpdatesURL` 的值应包含你的项目 ID。

:::note
如果你使用 Xcode 创建项目构建，请确保 [`Expo.plist` 文件已加入 Xcode 项目](https://developer.apple.com/documentation/xcode/managing-files-and-folders-in-your-xcode-project#Add-existing-files-and-folders-to-a-project)。
:::

</details>

## 配置更新 channel

构建上的 channel 属性让你把更新指向特定类型的构建。例如，它允许你向预览构建发布更新，而不影响生产部署。

**如果你正在使用 EAS Build**，`eas update:configure` 会在 **eas.json** 的 `preview` 和 `production` profile 上设置更新 `channel` 属性。如果你使用不同的 profile 名称，请手动设置它们。

<details>
<summary>eas.json 中的 channel 配置示例</summary>

如果你尚未配置项目，下面的配置大约就是 `eas update:configure` 会为你生成的内容。

```json eas.json
{
  "build": {
    "preview": {
      "channel": "preview"
      // 省略
    },
    "production": {
      "channel": "production"
      // 省略
    }
  }
}
```

</details>

**如果你不使用 EAS Build**，则需要在 **app.json** 或原生项目中配置 channel，具体取决于你是否使用 [CNG](/workflow/continuous-native-generation)。为不同环境创建构建时，你需要修改 channel，以确保构建从正确的 channel 拉取更新。进一步了解[把 EAS Update 作为独立服务使用](/eas-update/standalone-service)。

<details id="在-appjson-中配置更新-channel">
<summary>在 app.json 中配置更新 channel</summary>

如果你使用持续原生生成（CNG），可以用 **app.json** 中的 `updates.requestHeaders` 属性配置 channel：

```json app.json
{
  "expo": {
    /* @hide 省略 ... */ /* @end */
    "updates": {
      /* @hide 省略 ... */ /* @end */
      "requestHeaders": {
        "expo-channel-name": "your-channel-name"
      }
      /* @hide 省略 ... */ /* @end */
    }
    /* @hide 省略 ... */ /* @end */
  }
}
```

该配置会在你下次运行 `npx expo prebuild` 时应用。

</details>

<details>
<summary>在 Android 原生项目中配置更新 channel</summary>

在 **AndroidManifest.xml** 中，你需要添加该条目，并把 `your-channel-name` 替换为与项目匹配的 channel：

```xml android/app/src/main/AndroidManifest.xml
<meta-data android:name="expo.modules.updates.UPDATES_CONFIGURATION_REQUEST_HEADERS_KEY" android:value="{&quot;expo-channel-name&quot;:&quot;your-channel-name&quot;}"/>
```

</details>

<details>
<summary>在 iOS 原生项目中配置更新 channel</summary>

在 **Expo.plist** 中，你需要添加以下内容，并把 `your-channel-name` 替换为与项目匹配的 channel：

```xml ios/project-name/Supporting/Expo.plist
<key>EXUpdatesRequestHeaders</key>
<dict>
  <key>expo-channel-name</key>
  <string>your-channel-name</string>
</dict>
```

:::note
如果你使用 Xcode 创建项目构建，请确保 [`Expo.plist` 文件已加入 Xcode 项目](https://developer.apple.com/documentation/xcode/managing-files-and-folders-in-your-xcode-project#Add-existing-files-and-folders-to-a-project)。
:::

</details>

## 为项目创建构建

你需要为 Android 或 iOS 创建构建。我们建议先用 `preview` 构建 profile 创建构建。关于如何开始，参见[创建你的第一个构建](/build/setup)，并为设备或模拟器设置[内部分发](/build/internal-distribution#使用内部分发)。

一旦构建在设备或模拟器上运行，你就可以发送更新了。

## 在本地做更改

创建构建后，你就可以在项目上迭代了。用以下命令启动本地开发服务器：

:::tabs
:::tab npm
```sh
$ npx expo start
```
:::
:::tab yarn
```sh
$ yarn expo start
```
:::
:::tab pnpm
```sh
$ pnpm expo start
```
:::
:::tab bun
```sh
$ bun expo start
```
:::
:::

然后对项目的 JavaScript、样式或图片资源做任何想要的更改。

## 发布更新

发布更新可以：

- 修复 bug，并快速更新项目的非原生部分，而不是创建新构建
- 使用内部分发[分享应用的预览版本](/review/overview)

要用项目中的更改发布更新，使用 `eas update` 命令，并指定 channel 名称、描述更新的 `message`，以及 `--environment` 标志以指定使用哪些 [EAS 环境变量](/eas/environment-variables)（SDK 55 及更高版本中为必需）：

```sh
$ eas update --channel [channel-name] --message "[message]" --environment [environment-name]
```

<details>
<summary>发布更新是如何工作的？</summary>

用 `eas update` 命令发布更新时，它会生成新的更新 bundle 并上传到 EAS 服务器。channel 名称用于从其他更新分支中定位要发布新更新的正确分支。这类似于 Git 提交的工作方式，每次提交都在一个 Git 分支上。

例如，当应用设置为从 `preview` channel 拉取更新时，你可以用 `eas update --channel preview` 为该构建发布更新。这会在 `preview` channel 上创建一个分支（默认称为 `preview`）。在幕后，此命令运行 `npx expo export` 来生成 **dist** 目录并创建本地更新 bundle。该更新 bundle 会上传到 EAS Update 服务器。

- [EAS Update 如何工作的深入指南](/eas-update/how-it-works)：深入了解 EAS Update 如何工作。

</details>

## 测试更新

更新上传到 EAS Update 后，你可以用以下方法之一测试更新：

- 使用[开发构建](/eas-update/expo-dev-client)中的 Extensions 标签页加载更新。
- 使用 [Expo Orbit](/review/with-orbit)在开发构建中安装并启动更新。
- 用 [Updates API](/versions/latest/sdk/updates) 和[应用配置](/versions/latest/config/app#updates)实现自定义策略，以编程方式在应用中加载更新。
- 通过强制关闭并重新打开应用的发布构建最多两次，手动测试更新，以下载并应用更新。非开发构建（预览或生产）的更新会在应用启动并请求任何新更新时自动在后台下载到设备。更新下载完成且应用重启后才会应用。

<details>
<summary>有什么不工作？</summary>

如果应用没有按预期更新，参见[调试指南](/eas-update/debug)中验证配置的技巧。

</details>

## 下一步

- [预览更新](/eas-update/preview)：了解如何通过分享更新进行 QA 和测试来快速迭代。
- [部署更新](/eas-update/deployment)：了解使用 EAS Update 时项目的不同部署模式。
