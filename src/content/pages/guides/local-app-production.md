---
title: 在本地创建发布构建
description: 了解如何在本地为 Expo 应用创建发布（生产）构建。
---

# 在本地创建发布构建

要在本地创建应用的发布构建（也称为生产构建），需要在电脑上按各自的步骤操作，并使用创建任何原生应用所需的工具。本指南提供 Android 与 iOS 的必要步骤。

## Android

在本地为 Android 创建发布构建时，需要用[上传密钥](https://developer.android.com/studio/publish/app-signing#certificates-keystores)为其签名，并生成 Android Application Bundle（**.aab**）。按以下步骤操作：

### 前置条件

- **已安装 OpenJDK** —— 安装 [OpenJDK 发行版](/get-started/set-up-your-environment?mode=development-build&buildEnv=local#install-jdk)，以便使用 `keytool` 命令。
- **已生成 android 目录** —— 如果使用[持续原生生成（CNG）](/workflow/continuous-native-generation)，请运行 `npx expo prebuild` 来生成它。

1. 创建上传密钥

<details>
<summary>已经用 EAS Build 创建过构建？下载凭据并跳到下一步。</summary>

如果你已经用 EAS Build 创建过构建，按以下步骤下载凭据。其中包含上传密钥及其密码、密钥别名和密钥密码：

1. 在终端中运行 `eas credentials -p android` 并选择构建 profile。
2. 选择 **credentials.json** > **Download credentials from EAS to credentials.json**。
3. 把下载的 **keystore.jks** 文件移动到 **android/app** 目录。
4. 从 **credentials.json** 中复制上传 keystore 密码、密钥别名和密钥密码，下一步会用到它们。

</details>

在 Expo 项目目录中运行以下 `keytool` 命令来创建上传密钥：

```sh
sudo keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

运行此命令后，系统会提示你输入 keystore 密码。该密码用于保护上传密钥。请记住这里输入的密码，下一步会用到。

此命令还会在项目目录中生成名为 **my-upload-key.keystore** 的 keystore 文件。把它移动到 **android/app** 目录。

:::warning
如果把 **android** 目录提交到 Git 等版本控制系统，不要提交这个 keystore 文件。它包含你的上传密钥，应当保持私密。
:::

2. 更新 Gradle 变量

打开 **android/gradle.properties** 文件，在文件末尾添加以下 Gradle 变量。把 `*****` 替换为上一步提供的正确 keystore 密码和密钥密码。

这些变量包含上传密钥的信息：

```ruby android/gradle.properties
# 如果已通过 `eas credentials` 命令下载凭据，请参见下方各值的注释。

# "keystore" 文件的路径
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
# 替换为 credentials.json 文件中 `keystore.keyAlias` 字段的值
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
# 替换为 credentials.json 文件中 `keystore.password` 字段的值
MYAPP_UPLOAD_STORE_PASSWORD=*****
# 替换为 credentials.json 文件中 `keystore.keyPassword` 字段的值
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

:::warning
如果把 **android** 目录提交到 Git 等版本控制系统，不要提交上述信息。请改为在电脑上创建 **~/.gradle/gradle.properties** 文件，并把上述变量添加到该文件中。
:::

3. 向 build.gradle 添加签名配置

打开 **android/app/build.gradle** 文件并添加以下配置：

```diff
diff --git a/android/app/build.gradle b/android/app/build.gradle
index c50bf0c..8dd1626 100644
--- a/android/app/build.gradle
+++ b/android/app/build.gradle
@@ -101,6 +101,14 @@ android {
             keyAlias 'androiddebugkey'
             keyPassword 'android'
         }
+        release {
+            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
+                storeFile file(MYAPP_UPLOAD_STORE_FILE)
+                storePassword MYAPP_UPLOAD_STORE_PASSWORD
+                keyAlias MYAPP_UPLOAD_KEY_ALIAS
+                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
+            }
+        }
     }
     buildTypes {
         debug {
             signingConfig signingConfigs.debug
         }
         release {
@@ -110,6 +118,7 @@ android {
             // 注意！在生产环境中，你需要生成自己的 keystore 文件。
             // 参见 https://reactnative.dev/docs/signed-apk-android。
+            signingConfig signingConfigs.release
             shrinkResources (findProperty('android.enableShrinkResourcesInReleaseBuilds')?.toBoolean() ?: false)
             minifyEnabled enableProguardInReleaseBuilds
             proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
```

4. 生成发布版 Android Application Bundle（aab）

进入 **android** 目录，运行 Gradle 的 `bundleRelease` 命令，创建 **.aab** 格式的发布构建：

```sh
cd android

./gradlew app:bundleRelease
```

此命令会在 **android/app/build/outputs/bundle/release** 目录中生成 app-release.aab。

5. 向 Google Play Console 提交应用

要提交 **.aab** 文件，可以通过 Google Play Console 手动上传。也可以使用 [EAS Submit](/deploy/submit-to-app-stores#can-i-submit-builds-that-were-not)，它接受本地构建的二进制：`eas submit --platform android --path ./my-app.aab`。

- [手动提交 Android 应用](/submit/android-manual) —— 按照分步指南，首次手动把应用提交到 Google Play Store。

## iOS

要在本地创建 iOS 发布构建，请使用 Xcode，它会处理签名以及上传到 App Store Connect。完整流程（从配置发布 scheme 到归档并上传应用）请遵循手动提交指南：

- [用 Xcode 手动提交 iOS 应用](/submit/ios-manual) —— 配置签名，用 Xcode 归档应用，并上传到 App Store Connect。
