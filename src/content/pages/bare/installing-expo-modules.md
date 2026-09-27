---
title: 在现有 React Native 项目中安装 Expo modules
description: 了解如何准备现有 React Native 项目，以便安装并使用任何 Expo 模块。
---

# 在现有 React Native 项目中安装 Expo modules

要在应用中使用 Expo modules，需要安装并配置 `expo` 包。

`expo` 包体积很小；它只包含几乎每个应用都需要的最小包集合，以及供其他 Expo SDK 包构建的模块与自动链接基础设施。项目中安装并配置 `expo` 包之后，可以用 `npx expo install` 添加 SDK 中的任何其他 Expo 模块。

根据你[初始化项目](/bare/overview)的方式，安装 Expo modules 有两种方法：[自动](#自动安装)或[手动](#手动安装)。

## 自动安装

要安装并使用 Expo modules，最简单的起步方式是 `install-expo-modules` 命令。

```sh
# 自动安装并配置 expo 包
npx install-expo-modules@latest
```

- **命令成功时**，你就可以在应用中添加任何 Expo 模块！继续阅读[用法](#用法)了解更多。
- **命令失败时**，请遵循手动安装说明。以编程方式更新代码可能很棘手；如果项目与默认 React Native 项目相差很大，就需要手动安装，并根据你的代码库调整这里的说明。

## 手动安装

下面的说明适用于在 React Native 0.86 中安装最新版本的 Expo modules。更早的版本请查看[原生升级助手](/bare/upgrade)，了解这些文件是如何定制的。

```sh
npm install expo
```

安装完成后，应用下面差异中的改动，以便在项目中配置 Expo modules。预计大约需要五分钟，并且你可能需要根据项目的定制程度稍作调整。

### Android 配置

```diff
diff --git a/android/app/src/main/java/com/myapp/MainActivity.kt b/android/app/src/main/java/com/myapp/MainActivity.kt
index 1789e54..b6ac31d 100644
--- a/android/app/src/main/java/com/myapp/MainActivity.kt
+++ b/android/app/src/main/java/com/myapp/MainActivity.kt
@@ -1,4 +1,5 @@
 package com.myapp
+import expo.modules.ReactActivityDelegateWrapper

 import com.facebook.react.ReactActivity
 import com.facebook.react.ReactActivityDelegate
@@ -18,5 +19,5 @@ class MainActivity : ReactActivity() {
    * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
    */
   override fun createReactActivityDelegate(): ReactActivityDelegate =
-      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
+      ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled))
 }
diff --git a/android/app/src/main/java/com/myapp/MainApplication.kt b/android/app/src/main/java/com/myapp/MainApplication.kt
index 9cb435b..bd46af6 100644
--- a/android/app/src/main/java/com/myapp/MainApplication.kt
+++ b/android/app/src/main/java/com/myapp/MainApplication.kt
@@ -1,4 +1,7 @@
 package com.myapp
+import android.content.res.Configuration
+import expo.modules.ApplicationLifecycleDispatcher
+import expo.modules.ExpoReactHostFactory

 import android.app.Application
 import com.facebook.react.PackageList
@@ -10,7 +13,7 @@ import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
 class MainApplication : Application(), ReactApplication {

   override val reactHost: ReactHost by lazy {
-    getDefaultReactHost(
+    ExpoReactHostFactory.getDefaultReactHost(
       context = applicationContext,
       packageList =
         PackageList(this).packages.apply {
@@ -23,5 +26,11 @@ class MainApplication : Application(), ReactApplication {
   override fun onCreate() {
     super.onCreate()
     loadReactNative(this)
+    ApplicationLifecycleDispatcher.onApplicationCreate(this)
+  }
+
+  override fun onConfigurationChanged(newConfig: Configuration) {
+    super.onConfigurationChanged(newConfig)
+    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
   }
 }
diff --git a/android/settings.gradle b/android/settings.gradle
index 8762b63..1e69c41 100644
--- a/android/settings.gradle
+++ b/android/settings.gradle
@@ -1,6 +1,20 @@
-pluginManagement { includeBuild("../node_modules/@react-native/gradle-plugin") }
-plugins { id("com.facebook.react.settings") }
-extensions.configure(com.facebook.react.ReactSettingsExtension){ ex -> ex.autolinkLibrariesFromCommand() }
+pluginManagement { includeBuild("../node_modules/@react-native/gradle-plugin")
+  def expoPluginsPath = new File(
+    providers.exec {
+      workingDir(rootDir)
+      commandLine("node", "--print", "require.resolve('expo-modules-autolinking/package.json', { paths: [require.resolve('expo/package.json')] })")
+    }.standardOutput.asText.get().trim(),
+    "../android/expo-gradle-plugin"
+  ).absolutePath
+  includeBuild(expoPluginsPath)
+}
+plugins { id("com.facebook.react.settings")
+id("expo-autolinking-settings")
+}
+extensions.configure(com.facebook.react.ReactSettingsExtension){ ex -> ex.autolinkLibrariesFromCommand(expoAutolinking.rnConfigCommand) }
 rootProject.name = 'myapp'
 include ':app'
 includeBuild('../node_modules/@react-native/gradle-plugin')
+expoAutolinking.useExpoModules()
+expoAutolinking.useExpoVersionCatalog()
+includeBuild(expoAutolinking.reactNativeGradlePlugin)
diff --git a/android/build.gradle b/android/build.gradle
index dad99b0..d7e8f5a 100644
--- a/android/build.gradle
+++ b/android/build.gradle
@@ -19,3 +19,4 @@ buildscript {
 }

 apply plugin: "com.facebook.react.rootproject"
+apply plugin: "expo-root-project"
```

### iOS 配置

```diff
diff --git a/ios/Podfile b/ios/Podfile
index c41f442..6ec9f2c 100644
--- a/ios/Podfile
+++ b/ios/Podfile
@@ -1,3 +1,4 @@
+require File.join(File.dirname(`node --print "require.resolve('expo/package.json')"`), "scripts/autolinking")
 # Resolve react_native_pods.rb with node to allow for hoisting
 require Pod::Executable.execute_command('node', ['-p',
   'require.resolve(
@@ -5,7 +6,7 @@ require Pod::Executable.execute_command('node', ['-p',
     {paths: [process.argv[1]]},
   )', __dir__]).strip

-platform :ios, min_ios_version_supported
+platform :ios, '16.4'
 prepare_react_native_project!

 linkage = ENV['USE_FRAMEWORKS']
@@ -15,7 +16,24 @@ if linkage != nil
 end

 target 'myapp' do
-  config = use_native_modules!
+  use_expo_modules!
+
+  if ENV['EXPO_USE_COMMUNITY_AUTOLINKING'] == '1'
+    config_command = ['node', '-e', "process.argv=['', '', 'config'];require('@react-native-community/cli').run()"];
+  else
+    config_command = [
+      'node',
+      '--no-warnings',
+      '--eval',
+      'require(require.resolve(\'expo-modules-autolinking\', { paths: [require.resolve(\'expo/package.json\')] }))(process.argv.slice(1))',
+      'react-native-config',
+      '--json',
+      '--platform',
+      'ios'
+    ]
+  end
+
+  config = use_native_modules!(config_command)

   use_react_native!(
     :path => config[:reactNativePath],
diff --git a/ios/myapp/AppDelegate.swift b/ios/myapp/AppDelegate.swift
index d06a6a8..d8dd308 100644
--- a/ios/myapp/AppDelegate.swift
+++ b/ios/myapp/AppDelegate.swift
@@ -1,21 +1,22 @@
 import UIKit
+internal import Expo
 import React
 import React_RCTAppDelegate
 import ReactAppDependencyProvider

 @main
-class AppDelegate: UIResponder, UIApplicationDelegate {
+class AppDelegate: ExpoAppDelegate {
   var window: UIWindow?

   var reactNativeDelegate: ReactNativeDelegate?
   var reactNativeFactory: RCTReactNativeFactory?

-  func application(
+  override func application(
     _ application: UIApplication,
     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
   ) -> Bool {
     let delegate = ReactNativeDelegate()
-    let factory = RCTReactNativeFactory(delegate: delegate)
+    let factory = ExpoReactNativeFactory(delegate: delegate)
     delegate.dependencyProvider = RCTAppDependencyProvider()

     reactNativeDelegate = delegate
@@ -29,13 +30,14 @@ class AppDelegate: UIResponder, UIApplicationDelegate {
       launchOptions: launchOptions
     )

-    return true
+    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
   }
 }

-class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
+class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
   override func sourceURL(for bridge: RCTBridge) -> URL? {
-    self.bundleURL()
+    // 需要返回 expo-dev-client 的正确 URL。
+    bridge.bundleURL ?? bundleURL()
   }

   override func bundleURL() -> URL? {
```

你也可以选择向 **AppDelegate.swift** 添加更多委托方法。有些库可能需要它们，因此除非有充分理由省略，否则建议添加。[参见 AppDelegate.swift 中的委托方法](https://github.com/expo/expo/blob/sdk-57/templates/expo-template-bare-minimum/ios/HelloWorld/AppDelegate.swift#L34-L51)。

保存所有更改，并在 Xcode 中把 iOS Deployment Target 更新为 `iOS 16.4`：

- 在 Xcode 中打开 **your-project-name.xcworkspace**，在左侧边栏选择你的项目。
- 选择 **Targets** > **your-project-name** > **Build Settings** > **iOS Deployment Target**，并确认它设置为 `iOS 16.4`。

最后一步是再次安装项目的 CocoaPods，以拉取我们添加到 **Podfile** 的 `use_expo_modules!` 指令所检测到的 Expo modules：

```sh
# 安装 pods
npx pod-install

# 或者，run 命令会为你安装它们
npx expo run:ios
```

### 为 Android 和 iOS 上的打包配置 Expo CLI

我们建议使用 Expo CLI 及相关工具配置来打包应用的 JavaScript 代码和资源。这增加了对在 **package.json** 中使用 `"main"` 字段以使用 [Expo Router](/router/introduction) 库的支持。不用 Expo CLI 打包可能导致意外行为。[进一步了解 Expo CLI](/bare/using-expo-cli)。

<details>
<summary>在 babel.config.js 中使用 babel-preset-expo</summary>

```diff
diff --git a/babel.config.js b/babel.config.js
index f7b3da3..fcb3486 100644
--- a/babel.config.js
+++ b/babel.config.js
@@ -1,3 +1,3 @@
 module.exports = {
-  presets: ['module:@react-native/babel-preset'],
+  presets: ['babel-preset-expo'],
 };
```

</details>

<details>
<summary>在 metro.config.js 中扩展 expo/metro-config</summary>

```diff
diff --git a/metro.config.js b/metro.config.js
index ad8f87b..0dfff20 100644
--- a/metro.config.js
+++ b/metro.config.js
@@ -1,4 +1,5 @@
-const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
+const { getDefaultConfig } = require('expo/metro-config');
+const { mergeConfig } = require('@react-native/metro-config');

 /**
  * Metro configuration
```

</details>

<details>
<summary>配置 Android 项目以使用 Expo CLI 打包</summary>

```diff
diff --git a/android/app/build.gradle b/android/app/build.gradle
index e441fee..6091cd1 100644
--- a/android/app/build.gradle
+++ b/android/app/build.gradle
@@ -52,6 +52,11 @@ react {

     /* Autolinking */
     autolinkLibrariesWithApp()
+    //
+    // 由 install-expo-modules 添加
+    entryFile = file(["node", "-e", "require('expo/scripts/resolveAppEntry')", rootDir.getAbsoluteFile().getParentFile().getAbsolutePath(), "android", "absolute"].execute(null, rootDir).text.trim())
+    cliFile = new File(["node", "--print", "require.resolve('@expo/cli')"].execute(null, rootDir).text.trim())
+    bundleCommand = "export:embed"
 }

 /**
```

</details>

<details>
<summary>配置 iOS 项目以使用 Expo CLI 打包</summary>

把 Xcode 中 **Build Phases** > **Bundle React Native code and images** 下的 shell 脚本替换为下面的内容：

```sh /bin/sh
if [[ -f "$PODS_ROOT/../.xcode.env" ]]; then
  source "$PODS_ROOT/../.xcode.env"
fi
if [[ -f "$PODS_ROOT/../.xcode.env.local" ]]; then
  source "$PODS_ROOT/../.xcode.env.local"
fi

# 默认情况下，项目根目录比 ios 目录高一级
export PROJECT_ROOT="$PROJECT_DIR"/..

if [[ "$CONFIGURATION" = *Debug* ]]; then
  export SKIP_BUNDLING=1
fi
if [[ -z "$ENTRY_FILE" ]]; then
  # 使用打包器的入口解析来设置入口 JS 文件。
  export ENTRY_FILE="$("$NODE_BINARY" -e "require('expo/scripts/resolveAppEntry')" "$PROJECT_ROOT" ios relative | tail -n 1)"
fi

if [[ -z "$CLI_PATH" ]]; then
  # 使用 Expo CLI
  export CLI_PATH="$("$NODE_BINARY" --print "require.resolve('@expo/cli')")"
fi
if [[ -z "$BUNDLE_COMMAND" ]]; then
  # Expo CLI 默认的打包命令
  export BUNDLE_COMMAND="export:embed"
fi

`"$NODE_BINARY" --print "require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'"`
```

然后对 **AppDelegate.swift** 做下面的修改，以支持 **package.json** 中的 `"main"` 字段：

```diff
diff --git a/ios/AppDelegate.swift b/ios/AppDelegate.swift
index 0000000..1111111 100644
--- a/ios/AppDelegate.swift
+++ b/ios/AppDelegate.swift
@@ -1,7 +1,7 @@
   override func bundleURL() -> URL? {
 #if DEBUG
-    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
+    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
 #else
     Bundle.main.url(forResource: "main", withExtension: "jsbundle")
 #endif
   }
```

</details>

## 用法

### 验证安装

可以通过记录 [`expo-constants`](/versions/latest/sdk/constants) 中的一个值来验证安装是否成功。

- 运行 `npx expo install expo-constants`
- 然后运行 `npx expo run`，并修改应用的 JavaScript 代码，加入下面的内容：

```tsx
import Constants from 'expo-constants';
console.log(Constants.systemFonts);
```

### 使用 Expo SDK 包

项目中安装并配置 `expo` 包之后，可以用 `npx expo install` 添加 SDK 中的任何其他 Expo 模块。更多信息见[使用库](/workflow/using-libraries)。

### `expo` 包包含的 Expo modules

下面这些 Expo modules 作为 `expo` 包的依赖被引入：

- [`expo-asset`](/versions/latest/sdk/asset)：仅 JavaScript 的包，围绕 `expo-file-system` 构建，为所有 Expo modules 的资源提供共同基础。
- [`expo-constants`](/versions/latest/sdk/constants)：提供对 manifest 的访问。
- [`expo-file-system`](/versions/latest/sdk/filesystem)：与设备文件系统交互。被 `expo-asset` 和许多其他 Expo modules 使用。开发者通常也会在应用代码中直接使用。
- [`expo-font`](/versions/latest/sdk/font)：在运行时加载字体。此模块是可选的，可以安全移除。不过，如果使用 `expo-dev-client` 进行开发，建议保留它，并且 `@expo/vector-icons` 需要它。
- [`expo-keep-awake`](/versions/latest/sdk/keep-awake)：在开发应用时防止设备进入睡眠。此模块是可选的，可以安全移除。

要排除其中任何模块，请参阅[从自动链接中排除特定模块](#从自动链接中排除特定模块)。

### 从自动链接中排除特定模块

如果需要排除你并未使用、但被其他依赖安装进来的 Expo modules 的原生代码，可以在 **package.json** 中使用 [`expo.autolinking.exclude`](/modules/autolinking#exclude) 属性：

```json package.json
{
  "name": "...",
  "dependencies": {},
  "expo": {
    "autolinking": {
      "exclude": ["expo-keep-awake"]
    }
  }
}
```
