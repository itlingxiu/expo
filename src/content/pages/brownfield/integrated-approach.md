---
title: 如何使用集成方式把 Expo 添加到原生应用
description: 一份指南，说明如何使用集成方式把 Expo 和 React Native 添加到现有原生（棕地）应用。
---

# 如何使用集成方式把 Expo 添加到原生应用

React Native 和 Expo 很灵活，可以增量采用，一次一个屏幕（甚至一个视图）。你可能会发现以这种方式使用 Expo 最适合你的特定应用，或者你最终会在应用的更多界面上逐步采用它。无论哪种方式，这种灵活性都让开发者可以立即在原生应用中采用现代的跨平台工具，而不必冒完全重写的风险。

本指南将带你完成把 React Native 视图添加到现有原生应用的步骤。这里介绍的方式称为“集成”方式，因为 React Native 和 Expo 的集成方式与你集成任何其他库相同。

:::note
另一种流行技术是我们所说的“隔离”方式，即把 Expo 应用打包为库，并由现有主应用当作黑盒对待。细节见[隔离方式指南](/brownfield/isolated-approach)。
:::

**前置条件**

- **Node.js（LTS）**：安装 [Node.js](https://nodejs.org/en/) 以运行 JavaScript 代码和 Expo CLI。
- **Yarn**：安装 [Yarn](https://yarnpkg.com/) 作为 JavaScript 依赖的包管理器。
- **CocoaPods**（iOS）：安装 [CocoaPods](https://cocoapods.org/)，iOS 的依赖管理系统之一。CocoaPods 是一个 Ruby [gem](https://en.wikipedia.org/wiki/RubyGems)，你可以使用最新版 macOS 自带的 Ruby 安装它。

从[设置环境指南](/get-started/set-up-your-environment#如何开发)了解更多。

## 创建 Expo 项目

首先，在现有原生项目的根目录内创建一个 Expo 项目。

:::tabs
:::tab npm
```sh
npx create-expo-app@latest my-project
```
:::
:::tab yarn
```sh
yarn create expo-app my-project
```
:::
:::tab pnpm
```sh
pnpm create expo-app my-project
```
:::
:::tab bun
```sh
bun create expo my-project
```
:::
:::

此命令创建名为 **my-project** 的新目录，其中包含你的新 Expo 项目。项目可以任意命名，本指南为保持一致使用 **my-project**。新项目包含一个示例 TypeScript 应用，帮助你开始。

## 设置项目结构

标准 React Native 项目把原生代码放在 **android** 和 **ios** 目录中。具体做法取决于你的项目，但可以简单到创建这些目录并把项目移到那里。例如：

:::tabs
:::tab Android
```sh
mkdir my-project/android
mv /path/to/your/android-project my-project/android/
```
:::
:::tab iOS
```sh
mkdir my-project/ios
mv /path/to/your/ios-project my-project/ios/
```
:::
:::

<details>
<summary>无法把原生项目移到 android 和 ios 目录？</summary>

### 设置 monorepo

Monorepo，或“单体仓库”，是包含多个应用或包的单个仓库。见[如何使用 monorepo](/guides/monorepos)。

设置 monorepo 可确保即使使用自定义文件夹结构，Android 和 iOS 脚本也能调用 Node 库中的命令。要设置 Yarn monorepo，在项目根目录创建 **package.json** 文件并添加以下内容：

```json package.json
{
  "version": "1.0.0",
  "private": true,
  "workspaces": ["my-project"]
}
```

然后运行 `yarn install` 安装依赖。这会确保 **node_modules** 安装在项目根目录，并且原生脚本可以与 React Native 代码交互。请务必将 `["my-project"]` 更改为上一步创建的 Expo 项目名称。

:::note
选择 monorepo 需要你在 Gradle/CocoaPods 中配置自定义项目根。这将在接下来的章节中介绍。
:::

</details>

## 配置原生项目

:::tabs
:::tab 配置 Android

要在 Android 上集成 React Native，需要通过修改以下文件来配置原生项目：

- **Gradle 文件**：**settings.gradle**、顶层 **build.gradle**、**app/build.gradle** 和 **gradle.properties**，以添加 React Native Gradle 插件（RNGP）和其他属性。
- **AndroidManifest.xml**：添加必要权限。（[了解更多](#配置清单)）
- **MainActivity**：加载 React Native 应用。

### 配置 Gradle

1. 首先编辑 **settings.gradle** 文件并添加以下行（使用[最小模板](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/settings.gradle)作为参考）：

```groovy settings.gradle
// 配置用于自动链接的 React Native Gradle Settings 插件
pluginManagement {
  def reactNativeGradlePlugin = new File(
    providers.exec {
      workingDir(rootDir)
      commandLine("node", "--print", "require.resolve('@react-native/gradle-plugin/package.json', { paths: [require.resolve('react-native/package.json')] })")
    }.standardOutput.asText.get().trim()
  ).getParentFile().absolutePath
  includeBuild(reactNativeGradlePlugin)

  def expoPluginsPath = new File(
    providers.exec {
      workingDir(rootDir)
      commandLine("node", "--print", "require.resolve('expo-modules-autolinking/package.json', { paths: [require.resolve('expo/package.json')] })")
    }.standardOutput.asText.get().trim(),
    "../android/expo-gradle-plugin"
  ).absolutePath
  includeBuild(expoPluginsPath)
}

plugins {
  id("com.facebook.react.settings")
  id("expo-autolinking-settings")
}

extensions.configure(com.facebook.react.ReactSettingsExtension) { ex ->
  ex.autolinkLibrariesFromCommand(expoAutolinking.rnConfigCommand)
}
expoAutolinking.useExpoModules()

// rootProject.name = 'HelloWorld'

expoAutolinking.useExpoVersionCatalog()

includeBuild(expoAutolinking.reactNativeGradlePlugin)
// 在此包含你现有的 Gradle 模块。
// include(":app")
```

<details>
<summary>使用自定义文件夹结构？</summary>

如果使用自定义文件夹结构，需要在 **settings.gradle** 中显式设置项目根，自动链接才能工作。修改以下行：

```diff
diff --git a/settings.gradle b/settings.gradle
index f07559f..4ad6b79 100644
--- a/settings.gradle
+++ b/settings.gradle
@@ -42,8 +42,12 @@ dependencyResolutionManagement {
     }
 }

+expoAutolinking {
+  projectRoot = new File(rootDir, "my-project")
+}
+
 extensions.configure(com.facebook.react.ReactSettingsExtension) { ex ->
-  ex.autolinkLibrariesFromCommand(expoAutolinking.rnConfigCommand)
+  ex.autolinkLibrariesFromCommand(expoAutolinking.rnConfigCommand, file(rootDir), files("yarn.lock"))
 }
 expoAutolinking.useExpoModules()
 expoAutolinking.useExpoVersionCatalog()
```

</details>

2. 然后打开顶层 **build.gradle** 并包含此行（如[最小模板](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/build.gradle)所建议）：

```diff
diff --git a/build.gradle b/build.gradle
index fee4cc3..52f6135 100644
--- a/build.gradle
+++ b/build.gradle
@@ -9,6 +9,7 @@ buildscript {
     dependencies {
         classpath('com.android.tools.build:gradle')
         classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')
+        classpath('com.facebook.react:react-native-gradle-plugin')
     }
 }

@@ -18,3 +19,6 @@ allprojects {
         mavenCentral()
     }
 }
+
+apply plugin: "expo-root-project"
+apply plugin: "com.facebook.react.rootproject"
```

这确保 React Native Gradle 和 Expo 插件在项目中可用并已应用。

3. 在应用的 **build.gradle** 文件（通常是 **app/build.gradle**——可以使用[最小模板文件作为参考](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/app/build.gradle)）内添加以下行：

```diff
diff --git a/app/build.gradle b/app/build.gradle
index 57ed10f..cb9cbc6 100644
--- a/app/build.gradle
+++ b/app/build.gradle
@@ -1,6 +1,7 @@
 apply plugin: "com.android.application"
 apply plugin: "org.jetbrains.kotlin.android"
 apply plugin: "org.jetbrains.kotlin.plugin.compose"
+apply plugin: "com.facebook.react"

 android {
     namespace 'com.example.blankandroid'
@@ -29,6 +30,8 @@ android {
 }

 dependencies {
+    implementation("com.facebook.react:react-android")
+    implementation("com.facebook.react:hermes-android")

     implementation libs.androidx.core.ktx
     implementation libs.androidx.lifecycle.runtime.ktx
@@ -47,4 +50,19 @@ dependencies {
     debugImplementation libs.androidx.ui.test.manifest
 }

+def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()
+react {
+    entryFile = file(["node", "-e", "require('expo/scripts/resolveAppEntry')", projectRoot, "android", "absolute"].execute(null, rootDir).text.trim())
+    reactNativeDir = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()
+    hermesCommand = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsolutePath() + "/sdks/hermesc/%OS-BIN%/hermesc"
+    codegenDir = new File(["node", "--print", "require.resolve('@react-native/codegen/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()
+    enableBundleCompression = false
+
+    // 使用 Expo CLI 打包应用，这可确保 Metro 配置与 Expo 项目正确配合。
+    cliFile = new File(["node", "--print", "require.resolve('@expo/cli', { paths: [require.resolve('expo/package.json')] })"].execute(null, rootDir).text.trim())
+    bundleCommand = "export:embed"
+
+    /* 自动链接 */
+    autolinkLibrariesWithApp()
+}
```

<details>
<summary>使用自定义文件夹结构？</summary>

如果使用自定义文件夹结构，需要在 **app/build.gradle** 中调整 `projectRoot` 值，使其指向 Expo 项目的根。修改以下行：

```diff
diff --git a/app/build.gradle b/app/build.gradle
index 2c1b374..6aefd77 100644
--- a/app/build.gradle
+++ b/app/build.gradle
@@ -49,8 +49,9 @@ dependencies {
     debugImplementation libs.androidx.ui.test.manifest
 }

-def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()
+def projectRoot = new File(rootDir.getAbsoluteFile(), 'my-project').getAbsolutePath()
 react {
+    root = new File(projectRoot)
     entryFile = file(["node", "-e", "require('expo/scripts/resolveAppEntry')", projectRoot, "android", "absolute"].execute(null, rootDir).text.trim())
     reactNativeDir = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()
```

</details>

4. 最后，打开应用的 **gradle.properties** 文件并添加以下行（使用[最小模板文件作为参考](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/gradle.properties)）：

```properties gradle.properties
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
newArchEnabled=true
hermesEnabled=true
```

### 配置清单

1. 首先，确保 **AndroidManifest.xml** 中有 `INTERNET` 权限：

```diff
diff --git a/app/src/main/AndroidManifest.xml b/app/src/main/AndroidManifest.xml
index a670c43..26eb9fe 100644
--- a/app/src/main/AndroidManifest.xml
+++ b/app/src/main/AndroidManifest.xml
@@ -2,6 +2,7 @@
 <manifest xmlns:android="http://schemas.android.com/apk/res/android"
     xmlns:tools="http://schemas.android.com/tools">

+    <uses-permission android:name="android.permission.INTERNET" />
     <application
         android:allowBackup="true"
         android:dataExtractionRules="@xml/data_extraction_rules"
```

2. 现在在 **debug** **AndroidManifest.xml** 中启用[明文流量](https://developer.android.com/training/articles/security-config#CleartextTrafficPermitted)：

```diff
diff --git a/app/src/debug/AndroidManifest.xml b/app/src/debug/AndroidManifest.xml
index 91f84ed..7412c2d 100644
--- a/app/src/debug/AndroidManifest.xml
+++ b/app/src/debug/AndroidManifest.xml
@@ -2,5 +2,7 @@
     xmlns:tools="http://schemas.android.com/tools">
     <application
         tools:targetApi="28"
+        android:usesCleartextTraffic="true"
+        tools:replace="android:usesCleartextTraffic"
     />
 </manifest>
```

这是应用通过 HTTP 与本地 [Metro 打包器](https://metrobundler.dev/)通信所必需的。可以使用最小模板中的 **AndroidManifest.xml** 文件作为参考：[main](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/app/src/main/AndroidManifest.xml) 和 [debug](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/app/src/debug/AndroidManifest.xml)。

### 与代码集成

现在，需要添加一些原生代码来启动 React Native 运行时，并告诉它渲染你的 React 组件。

#### 更新 `Application` 类

首先更新 `Application` 类以初始化 React Native。可以使用[最小模板](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/app/src/main/java/com/helloworld/MainApplication.kt)中的 **MainApplication.kt** 作为参考：

```diff
diff --git a/app/src/main/java/com/example/blankandroid/MainApplication.kt b/app/src/main/java/com/example/blankandroid/MainApplication.kt
index f4a23c5..7f7d95c 100644
--- a/app/src/main/java/com/example/blankandroid/MainApplication.kt
+++ b/app/src/main/java/com/example/blankandroid/MainApplication.kt
@@ -1,9 +1,46 @@
 package com.example.blankandroid

 import android.app.Application
+import android.content.res.Configuration
+import com.facebook.react.PackageList
+import com.facebook.react.ReactApplication
+import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
+import com.facebook.react.ReactPackage
+import com.facebook.react.ReactHost
+import com.facebook.react.common.ReleaseLevel
+import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
+import expo.modules.ApplicationLifecycleDispatcher
+import expo.modules.ExpoReactHostFactory

-class MainApplication : Application() {
+class MainApplication : Application(), ReactApplication {
+
+    override val reactHost: ReactHost by lazy {
+        ExpoReactHostFactory.getDefaultReactHost(
+            context = applicationContext,
+            packageList =
+                PackageList(this).packages.apply {
+                    // 尚不能自动链接的包可以在此手动添加，例如：
+                    // add(MyReactNativePackage())
+                }
+        )
+    }
     override fun onCreate() {
         super.onCreate()
+        DefaultNewArchitectureEntryPoint.releaseLevel = try {
+            ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.uppercase())
+        } catch (e: IllegalArgumentException) {
+            ReleaseLevel.STABLE
+        }
+        loadReactNative(this)
+        ApplicationLifecycleDispatcher.onApplicationCreate(this)
+    }
+
+    override fun onConfigurationChanged(newConfig: Configuration) {
+        super.onConfigurationChanged(newConfig)
+        ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
+    }
 }
```

#### 创建 `ReactActivity`

创建一个新的 `Activity`，它将扩展 `ReactActivity` 并托管 React Native 代码。此 activity 负责启动 React Native 运行时并渲染 React 组件。可以使用[最小模板文件中的 **MainActivity.kt**](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/app/src/main/java/com/helloworld/MainActivity.kt)作为参考：

```kotlin MyReactActivity.kt
// package <your-package-here>

import android.os.Build

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

class MyReactActivity : ReactActivity() {

  /**
   * 返回从 JavaScript 注册的主组件名称。用于安排该组件的渲染。
   */
  override fun getMainComponentName(): String = "main"

  /**
   * 返回 [ReactActivityDelegate] 的实例。我们使用 [DefaultReactActivityDelegate]，
   * 它允许你用单个布尔标志 [fabricEnabled] 启用新架构。
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }
}
```

把新 Activity 添加到 **AndroidManifest.xml** 文件，务必把 `MyReactActivity` 的主题设置为 `Theme.AppCompat.Light.NoActionBar`（或任何非 ActionBar 主题），以避免应用在 React Native 屏幕上方渲染 `ActionBar`：

```diff
diff --git a/app/src/main/AndroidManifest.xml b/app/src/main/AndroidManifest.xml
index 42c0681..d89f66c 100644
--- a/app/src/main/AndroidManifest.xml
+++ b/app/src/main/AndroidManifest.xml
@@ -24,6 +24,10 @@
                 <category android:name="android.intent.category.LAUNCHER" />
             </intent-filter>
         </activity>
+        <activity
+            android:name=".MyReactActivity"
+            android:theme="@style/Theme.AppCompat.Light.NoActionBar">
+        </activity>
     </application>

 </manifest>
```

现在你的 activity 已准备好运行一些 JavaScript 代码。

:::
:::tab 配置 iOS

要在 iOS 上集成 React Native，需要通过修改以下文件来配置原生 iOS 项目：

- **Podfile**：添加 React Native 依赖。
- **Xcode 项目**：添加用于打包 JavaScript 代码的构建阶段。
- **Info.plist**：配置 React Native 所需的应用设置。

### 配置 CocoaPods

如果项目没有 **Podfile**，可以使用[最小模板](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/ios/Podfile)作为参考创建一个：

```rb Podfile
require File.join(File.dirname(`node --print "require.resolve('expo/package.json')"`), "scripts/autolinking")
require File.join(File.dirname(`node --print "require.resolve('react-native/package.json')"`), "scripts/react_native_pods")

require 'json'

platform :ios, '16.4'
install! 'cocoapods',
  :deterministic_uuids => false

prepare_react_native_project!

target 'HelloWorld' do
  use_expo_modules!

  config_command = [
    'npx',
    'expo-modules-autolinking',
    'react-native-config',
    '--json',
    '--platform',
    'ios'
  ]
  config = use_native_modules!(config_command)

  use_frameworks! :linkage => ENV['USE_FRAMEWORKS'].to_sym if ENV['USE_FRAMEWORKS']

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true,
    # 应用根目录的绝对路径。
    :app_path => "#{Pod::Config.instance.installation_root}/..",
    :privacy_file_aggregation_enabled => true,
  )

  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
    )
  end
end
```

如果项目已有 **Podfile**，需要手动把 React Native 依赖合并到现有 **Podfile** 中。

<details>
<summary>使用自定义文件夹结构？</summary>

如果使用自定义文件夹结构，需要在 **Podfile** 中显式设置项目根，自动链接才能工作。修改 **Podfile** 中的以下行：

```diff
diff --git a/Podfile b/Podfile
index 1472f45..03d4cce 100644
--- a/Podfile
+++ b/Podfile
@@ -9,8 +9,11 @@ install! 'cocoapods',

 prepare_react_native_project!

+project_root = File.join(__dir__, 'my-project')
+ENV['PROJECT_ROOT'] = project_root
+
 target 'HelloWorld' do
-  use_expo_modules!
+  use_expo_modules!({ projectRoot: project_root })

   config_command = [
     'npx',
@@ -18,7 +21,11 @@ target 'BlankIOS' do
     'react-native-config',
     '--json',
     '--platform',
-    'ios'
+    'ios',
+    '--project-root',
+    project_root,
+    '--source-dir',
+    "#{__dir__}"
   ]
   config = use_native_modules!(config_command)

@@ -28,7 +35,7 @@ target 'BlankIOS' do
     :path => config[:reactNativePath],
     :hermes_enabled => true,
     # 应用根目录的绝对路径。
-    :app_path => "#{Pod::Config.instance.installation_root}/..",
+    :app_path => "#{project_root}",
     :privacy_file_aggregation_enabled => true,
   )
```

</details>

现在运行以下命令：

```sh
pod install
```

运行 `pod` 命令会把 React Native 代码集成到应用中，使 iOS 文件能够导入 React Native 头文件。

### 配置 Xcode 项目

1. `pod install` 命令之后，CocoaPods 会创建 Xcode 工作区 **\{Project\}.xcworkspace**，你需要打开 **xcworkspace** 项目，而不是传统的 **xcodeproj** 项目。也可以使用以下命令打开项目：

```sh
xed my-project/ios
```

在 Xcode 项目导航器中，选择你的项目，然后在 `TARGETS` 下选择应用目标。在 **Build Settings** 中，使用搜索栏搜索 `ENABLE_USER_SCRIPT_SANDBOXING`。如果尚未设置，把它的值设为 `No`。这是在随 React Native 提供的 [Hermes 引擎](https://github.com/facebook/hermes/blob/main/README.md)的 Debug 和 Release 版本之间正确切换所需要的。

![Xcode 构建设置](/static/images/brownfield/user-script-sandboxing.webp)

2. 现在切换到 **Build Phases** 标签页，在 `[CP] Embed Pods Frameworks` 阶段之前添加一个新的 `Run Script Phase`。此脚本会把 JavaScript 代码和资源打包到 iOS 应用中。

![Xcode 构建阶段](/static/images/brownfield/run-script-phase.webp)

```sh 构建 React Native 代码和图像
if [[ -f "$PODS_ROOT/../.xcode.env" ]]; then
  source "$PODS_ROOT/../.xcode.env"
fi
if [[ -f "$PODS_ROOT/../.xcode.env.local" ]]; then
  source "$PODS_ROOT/../.xcode.env.local"
fi

# 项目根默认比 ios 目录高一级
export PROJECT_ROOT="$PROJECT_DIR"/..

if [[ "$CONFIGURATION" = *Debug* ]]; then
  export SKIP_BUNDLING=1
fi
if [[ -z "$ENTRY_FILE" ]]; then
  # 使用打包器的入口解析设置入口 JS 文件。
  export ENTRY_FILE="$("$NODE_BINARY" -e "require('expo/scripts/resolveAppEntry')" "$PROJECT_ROOT" ios absolute | tail -n 1)"
fi

if [[ -z "$CLI_PATH" ]]; then
  # 使用 Expo CLI
  export CLI_PATH="$("$NODE_BINARY" --print "require.resolve('@expo/cli', { paths: [require.resolve('expo/package.json')] })")"
fi
if [[ -z "$BUNDLE_COMMAND" ]]; then
  # 用于打包的默认 Expo CLI 命令
  export BUNDLE_COMMAND="export:embed"
fi

# 如果存在 .xcode.env.updates 则 source 它，以便在需要时取消设置 SKIP_BUNDLING
if [[ -f "$PODS_ROOT/../.xcode.env.updates" ]]; then
  source "$PODS_ROOT/../.xcode.env.updates"
fi
# source 本地更改以允许覆盖
# （如果需要）
if [[ -f "$PODS_ROOT/../.xcode.env.local" ]]; then
  source "$PODS_ROOT/../.xcode.env.local"
fi

`"$NODE_BINARY" --print "require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'"`
```

下次为 Release 构建应用时，将使用 Expo CLI 打包 React Native 代码并嵌入应用。

3. 编辑 **Info.plist** 文件，确保添加值为 `NO` 的 `UIViewControllerBasedStatusBarAppearance` 键，这是确保状态栏由 React Native 正确管理所需要的。

```diff
diff --git a/HelloWorld/Info.plist b/HelloWorld/Info.plist
index 81ed29b..2360724 100644
--- a/HelloWorld/Info.plist
+++ b/HelloWorld/Info.plist
@@ -2,6 +2,8 @@
 <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
 <plist version="1.0">
 <dict>
+	<key>UIViewControllerBasedStatusBarAppearance</key>
+	<false/>
 	<key>UIApplicationSceneManifest</key>
 	<dict>
 		<key>UIApplicationSupportsMultipleScenes</key>
```

### 与代码集成

现在，需要添加一些原生代码来启动 React Native 运行时，并告诉它渲染你的 React 组件。

#### 创建 ReactViewController

创建一个名为 **ReactViewController.swift** 的新文件，这将是把 React Native 视图作为其 `view` 加载的 `ViewController`。

```swift ReactViewController.swift
import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

class ReactNativeViewController: UIViewController {
  var reactNativeFactory: RCTReactNativeFactory?
  var reactNativeFactoryDelegate: RCTReactNativeFactoryDelegate?

  override func viewDidLoad() {
    super.viewDidLoad()
    reactNativeFactoryDelegate = ReactNativeDelegate()
    reactNativeFactoryDelegate!.dependencyProvider = RCTAppDependencyProvider()
    reactNativeFactory = RCTReactNativeFactory(delegate: reactNativeFactoryDelegate!)
    view = reactNativeFactory!.rootViewFactory.view(withModuleName: "HelloWorld")

  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
    override func sourceURL(for bridge: RCTBridge) -> URL? {
      self.bundleURL()
    }

    override func bundleURL() -> URL? {
      #if DEBUG
      RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
      #else
      Bundle.main.url(forResource: "main", withExtension: "jsbundle")
      #endif
    }

}
```

#### 在 rootViewController 中展示 React Native 视图

最后，可以展示 React Native 视图。为此，需要一个新的 View Controller，它可以托管一个视图，我们在其中加载 JS 内容。你已经有初始的 `ViewController`，可以让它展示 `ReactViewController`。根据应用的不同，有几种方式可以做到这一点。在此示例中，假设你有一个以模态方式展示 React Native 的按钮。

```swift ViewController.swift
import UIKit

class ViewController: UIViewController {

  var reactViewController: ReactViewController?

  override func viewDidLoad() {
    super.viewDidLoad()
    // 视图加载后的任何额外设置。
    self.view.backgroundColor = .systemBackground

    let button = UIButton()
    button.setTitle("Open React Native", for: .normal)
    button.setTitleColor(.systemBlue, for: .normal)
    button.setTitleColor(.blue, for: .highlighted)
    button.addAction(UIAction { [weak self] _ in
      guard let self else { return }
      if reactViewController == nil {
       reactViewController = ReactViewController()
      }
      present(reactViewController!, animated: true)
    }, for: .touchUpInside)
    self.view.addSubview(button)

    button.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      button.leadingAnchor.constraint(equalTo: self.view.leadingAnchor),
      button.trailingAnchor.constraint(equalTo: self.view.trailingAnchor),
      button.centerXAnchor.constraint(equalTo: self.view.centerXAnchor),
      button.centerYAnchor.constraint(equalTo: self.view.centerYAnchor),
    ])
  }
}
```

:::
:::

## 测试集成

你已完成把 React Native 与应用集成的所有基本步骤。现在在 React Native 目录中运行以下命令以启动 [Metro 打包器](https://metrobundler.dev/)

:::tabs
:::tab npm
```sh
npm run start
```
:::
:::tab yarn
```sh
yarn run start
```
:::
:::tab pnpm
```sh
pnpm run start
```
:::
:::tab bun
```sh
bun run start
```
:::
:::

Metro 把 TypeScript 应用代码构建为 bundle，通过其 HTTP 服务器提供它，并把 bundle 从开发环境的 `localhost` 共享到模拟器或设备，从而支持[热重载](https://reactnative.dev/blog/2016/03/24/introducing-hot-reloading)。现在可以照常构建并运行应用。一旦到达应用内由 React 驱动的 Activity，它应从开发服务器加载 JavaScript 代码。
