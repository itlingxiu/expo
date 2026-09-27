---
title: 在现有 React Native 项目中安装 expo-updates
description: 了解如何在现有 React Native 项目中安装并配置 expo-updates。
---

# 在现有 React Native 项目中安装 expo-updates

`expo-updates` 是一个库，让应用能够管理应用代码的远程更新。它与配置的远程更新服务通信，以获取可用更新的信息。本指南说明如何设置现有 React Native 项目，以便使用 [EAS Update](/eas-update/introduction)。EAS Update 是托管的远程更新服务，并包含简化 `expo-updates` 库安装与配置的工具。

<details>
<summary>项目使用持续原生生成（CNG）吗？</summary>

你可能看错了指南。要在使用 [CNG](/workflow/continuous-native-generation) 的项目中使用 `expo-updates`，参见 [EAS Update「入门」](/eas-update/getting-started)。

</details>

**前置条件**

- **安装并配置 expo 包**：如果项目是用 `npx @react-native-community/cli@latest init` 创建的，并且没有安装其他 Expo 库，继续之前需要先[安装 Expo modules](/bare/installing-expo-modules)。

## 安装

首先安装 `expo-updates`：

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

然后为 iOS 安装 pods：

:::tabs
:::tab npm
```sh
npx pod-install
```
:::
:::tab yarn
```sh
yarn dlx pod-install
```
:::
:::tab pnpm
```sh
pnpm dlx pod-install
```
:::
:::tab bun
```sh
bunx pod-install
```
:::
:::

## 配置 expo-updates 库

应用下面各节差异中的改动，以便在项目中配置 `expo-updates`。

### JavaScript 与 JSON

运行 `eas update:configure`，在 **app.json** 中设置 `updates` URL 和 `projectId`。

```sh
eas update:configure
```

修改 **app.json** 的 `expo` 部分。如果项目是用 `npx @react-native-community/cli@latest init` 创建的，需要加入下面的改动，包括 [`updates` URL](/versions/latest/config/app#url)。

> 下面示例中的 `updates` URL 和 `projectId` 用于 EAS Update。运行 `eas update:configure` 时，EAS CLI 会为 EAS Update 服务正确设置此 URL。

```diff
diff --git a/app.json b/app.json
index 5c2e602..63e62c9 100644
--- a/app.json
+++ b/app.json
@@ -1,6 +1,17 @@
 {
   "displayName": "MyApp",
+  "expo": {
+    "name": "MyApp",
+    "slug": "MyApp",
+    "ios": {
+      "bundleIdentifier": "com.MyApp"
+    },
+    "android": {
+      "package": "com.MyApp"
+    },
+    "runtimeVersion": "1.0.0",
+    "updates": {
+      "url": "https://u.expo.dev/[your-project-id]"
+    },
+    "extra": {
+      "eas": {
+        "projectId": "[your-project-id]"
+      }
+    }
+  }
 }
```

如果想改用[自定义 `expo-updates` 服务器](https://github.com/expo/custom-expo-updates-server)，把你的 URL 加到 **app.json** 的 `updates.url`。

```diff
diff --git a/app.json b/app.json
index 0000000..1111111 100644
--- a/app.json
+++ b/app.json
@@ -1,7 +1,7 @@
   "expo": {
     "name": "MyApp",
-    "updates": {
-      "url": "https://u.expo.dev/[your-project-id]"
-    }
+    "updates": {
+      "url": "http://localhost:3000/api/manifest"
+    }
   }
 }
```

### Android

修改 **android/app/build.gradle**，以便在 Expo 文件中检查 JS 引擎配置（JSC 或 Hermes）：

```diff
diff --git a/android/app/build.gradle b/android/app/build.gradle
index 2465ebf..a9e2343 100644
--- a/android/app/build.gradle
+++ b/android/app/build.gradle
@@ -49,6 +49,11 @@ react {
     //
     //   The list of flags to pass to the Hermes compiler. By default is "-O", "-output-source-map"
     // hermesFlags = ["-O", "-output-source-map"]
+    // 用 expo.jsEngine 覆盖 hermesEnabled
+    ext {
+    hermesEnabled = (findProperty('expo.jsEngine') ?: "hermes") == "hermes"
+    }
+
     entryFile = file(["node", "-e", "require('expo/scripts/resolveAppEntry')", rootDir.getAbsoluteFile().getParentFile().getAbsolutePath(), "android", "absolute"].execute(null, rootDir).text.trim())
     cliFile = new File(["node", "--print", "require.resolve('@expo/cli')"].execute(null, rootDir).text.trim())
     bundleCommand = "export:embed"
```

修改 **android/app/src/main/AndroidManifest.xml**，添加 `expo-updates` 配置 XML，使其与 **app.json** 的内容匹配：

```diff
diff --git a/android/app/src/main/AndroidManifest.xml b/android/app/src/main/AndroidManifest.xml
index adbb95a..e4c1543 100644
--- a/android/app/src/main/AndroidManifest.xml
+++ b/android/app/src/main/AndroidManifest.xml
@@ -13,5 +13,10 @@
         <data android:scheme="myapp"/>
       </intent-filter>
     </activity>
+    <meta-data android:name="expo.modules.updates.ENABLED" android:value="true"/>
+    <meta-data android:name="expo.modules.updates.EXPO_UPDATES_CHECK_ON_LAUNCH" android:value="ALWAYS"/>
+    <meta-data android:name="expo.modules.updates.EXPO_UPDATES_LAUNCH_WAIT_MS" android:value="0"/>
+    <meta-data android:name="expo.modules.updates.EXPO_UPDATE_URL" android:value="https://u.expo.dev/[your-project-id]"/>
+    <meta-data android:name="expo.modules.updates.EXPO_RUNTIME_VERSION" android:value="@string/expo_runtime_version"/>
   </application>
 </manifest>
```

如果使用更新服务器 URL（在同一台机器上运行的自定义非 HTTPS 更新服务器），需要修改 **android/app/src/main/AndroidManifest.xml**，添加更新服务器 URL 并启用 `usesCleartextTraffic`：

```diff
diff --git a/android/app/src/main/AndroidManifest.xml b/android/app/src/main/AndroidManifest.xml
index 0000000..1111111 100644
--- a/android/app/src/main/AndroidManifest.xml
+++ b/android/app/src/main/AndroidManifest.xml
@@ -1,5 +1,6 @@
 <application
   android:name=".MainApplication"
   android:label="@string/app_name"
   android:icon="@mipmap/ic_launcher"
   android:roundIcon="@mipmap/ic_launcher_round"
   android:allowBackup="false"
   android:theme="@style/AppTheme"
+  android:usesCleartextTraffic="true"
 >
-  <meta-data android:name="expo.modules.updates.EXPO_UPDATE_URL" android:value="https://u.expo.dev/[your-project-id]" />
+  <meta-data android:name="expo.modules.updates.EXPO_UPDATE_URL" android:value="http://localhost:3000/api/manifest"/>
 </application>
```

把 Expo 运行时版本字符串键添加到 **android/app/src/main/res/values/strings.xml**：

```diff
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

把 **Podfile.properties.json** 文件添加到 **ios** 目录：

```json ios/Podfile.properties.json
{
  "expo.jsEngine": "hermes"
}
```

修改 **ios/Podfile**，以便在 Expo 文件中检查 JS 引擎配置（JSC 或 Hermes）：

```diff
diff --git a/ios/Podfile b/ios/Podfile
index 51c4548..32e5ea1 100644
--- a/ios/Podfile
+++ b/ios/Podfile
@@ -6,6 +6,9 @@ require Pod::Executable.execute_command('node', ['-p',
     {paths: [process.argv[1]]},
   )', __dir__]).strip

+require 'json'
+podfile_properties = JSON.parse(File.read(File.join(__dir__, 'Podfile.properties.json'))) rescue {}
+
 platform :ios, min_ios_version_supported
 prepare_react_native_project!

@@ -28,6 +31,7 @@ target 'myapp' do

   use_react_native!(
     :path => config[:reactNativePath],
+    :hermes_enabled => podfile_properties['expo.jsEngine'] == nil || podfile_properties['expo.jsEngine'] == 'hermes',
     # An absolute path to your application root.
     :app_path => "#{Pod::Config.instance.installation_root}/.."
   )
```

使用 Xcode，把 **Expo.plist** 文件添加到 **ios/your-project/Supporting**，内容如下，以匹配 **app.json**：

```xml Expo.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>EXUpdatesCheckOnLaunch</key>
    <string>ALWAYS</string>
    <key>EXUpdatesEnabled</key>
    <true/>
    <key>EXUpdatesLaunchWaitMs</key>
    <integer>0</integer>
    <key>EXUpdatesRuntimeVersion</key>
    <string>1.0.0</string>
    <key>EXUpdatesURL</key>
    <string>http://localhost:3000/api/manifest</string>
  </dict>
</plist>
```

## 在构建时配置更新渠道

构建上的 `channel` 属性让你把更新指向特定类型的构建。例如，它可以让你向预览构建发布更新，而不影响生产部署。

该属性最终也会设置在你上面修改的 **AndroidManifest.xml** 和 **Expo.plist** 文件中。它通常在构建之前设置，这样你可以在生产构建与非生产构建之间切换。如果用 EAS Build 构建项目，`channel` 在 **eas.json** 构建 profile 中设置。EAS Build 会在原生构建步骤之前把它们应用到这些文件。

在本地或用其他服务构建时，需要自己在这些文件中设置渠道：

### Android

在 **android/app/src/main/AndroidManifest.xml** 中，于 `<application>` 元素内添加请求头 `meta-data` 条目：

```xml android/app/src/main/AndroidManifest.xml
<meta-data android:name="expo.modules.updates.UPDATES_CONFIGURATION_REQUEST_HEADERS_KEY" android:value="{&quot;expo-channel-name&quot;:&quot;your-channel-name&quot;}"/>
```

### iOS

在 **Expo.plist** 中，于现有 `<dict>` 元素内添加 `EXUpdatesRequestHeaders` 字典：

```xml ios/project-name/Supporting/Expo.plist
<key>EXUpdatesRequestHeaders</key>
<dict>
  <key>expo-channel-name</key>
  <string>your-channel-name</string>
</dict>
```

:::note
如果之后采用 CNG，可以改为在 **app.json** 中用 [`updates.requestHeaders`](/versions/latest/config/app#requestheaders) 配置渠道。然后在流水线中运行 `npx expo prebuild`，就会把渠道写入这些文件。参见[在 app.json 中配置更新渠道](/eas-update/getting-started#配置更新-channel)。
:::

## 下一步

- 要开始把 EAS Update 与 EAS Build 一起使用，参见 EAS Update [入门](/eas-update/getting-started)。
- 关于如何使用该库的更多信息，参见 [`expo-updates` API 参考](/versions/latest/sdk/updates)。
- 参见如何[直接把 EAS Update 与本地构建一起使用](/eas-update/standalone-service)。
- 也可以把 `expo-updates` 与实现了 [Expo Updates 协议](/technical-specs/expo-updates-1) 的自定义服务器一起使用。参见 [`custom-expo-updates-server` README](https://github.com/expo/custom-expo-updates-server#readme)。
