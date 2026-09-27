---
title: Android 构建过程
description: 了解 Android 项目在 EAS Build 上是如何构建的。
---

# Android 构建过程

本页描述用 EAS Build 构建 Android 项目的过程。如果你关心构建服务的实现细节，可以阅读本页。

## 构建过程

下面更仔细地看一看用 EAS Build 构建 Android 项目的步骤。我们先在你的本地机器上运行一些步骤来准备项目，然后在远程服务上构建项目。

### 本地步骤

第一阶段发生在你的电脑上。EAS CLI 负责完成以下步骤：

1. 如果 **eas.json** 中 `cli.requireCommit` 设为 `true`，检查 git 索引是否干净，也就是没有任何未提交的更改。如果不干净，EAS CLI 会提供选项，帮你提交本地更改，或中止构建过程。
2. 准备构建所需的凭据，除非 `builds.android.PROFILE_NAME.withoutCredentials` 设为 `true`。
   - 凭据来自本地 **credentials.json** 文件还是 EAS 服务器，取决于 `builds.android.PROFILE_NAME.credentialsSource` 的值。如果选择了 `remote` 模式但尚无凭据，系统会提示你生成新的 keystore。
3. 创建包含仓库副本的 tarball。实际行为取决于你使用的 [VCS 工作流](https://expo.fyi/eas-vcs-workflow)。
4. 把项目 tarball 上传到私有的 Google Cloud Storage（GCS）存储桶，并把构建请求发送给 EAS Build。

### 远程步骤

接下来，EAS Build 接手你的请求时会发生这些事：

1. 为构建创建一个新的 Docker 容器。
   - 每次构建都有自己全新的容器，其中安装了全部构建工具（Java JDK、Android SDK、NDK 等）。
2. 从私有 GCS 存储桶下载项目 tarball 并解包。
3. 如果设置了 `NPM_TOKEN`，则[创建 **.npmrc**](/build-reference/private-npm-packages)。
4. 如果 **package.json** 中定义了 `eas-build-pre-install` 脚本，则运行它。
5. 在项目根目录运行 `npm install`（如果存在 `yarn.lock`，则运行 `yarn install`）。
6. 运行 `npx expo-doctor`，诊断项目配置中的潜在问题。
7. 使用[持续原生生成（CNG）](/workflow/continuous-native-generation)的项目还有额外步骤：运行 `npx expo prebuild` 生成 **android** 和 **ios** 目录。这一步会使用带版本的 Expo CLI。
8. 恢复由[构建 profile](/build/eas-json)中 `cache.key` 值标识的先前保存的缓存。
9. 如果 **package.json** 中定义了 `eas-build-post-install` 脚本，则运行它。
10. 恢复 keystore（如果它包含在构建请求中）。
11. 把签名[配置注入 **build.gradle**](#配置-gradle)。
12. 在项目内的 **android** 目录中运行 `./gradlew COMMAND`。
    - `COMMAND` 是 **eas.json** 中 `builds.android.PROFILE_NAME.gradleCommand` 所定义的命令。默认是 `:app:bundleRelease`，它会产出 AAB（Android App Bundle）。
13. **已弃用：** 如果 **package.json** 中定义了 `eas-build-pre-upload-artifacts` 脚本，则运行它。
14. 存储[构建 profile](/build/eas-json)中定义的文件和目录缓存。后续构建会恢复该缓存。
15. 把应用归档上传到 GCS。
    - 产物路径可以在 **eas.json** 的 `builds.android.PROFILE_NAME.applicationArchivePath` 中配置。默认是 `android/app/build/outputs/**/*.{apk,aab}`。我们使用 [glob 模式](https://github.com/isaacs/node-glob#glob-primer)进行模式匹配。
16. 如果构建成功：运行 **package.json** 中定义的 `eas-build-on-success` 脚本（如果已定义）。
17. 如果构建失败：运行 **package.json** 中定义的 `eas-build-on-error` 脚本（如果已定义）。
18. 运行 **package.json** 中定义的 `eas-build-on-complete` 脚本（如果已定义）。环境变量 `EAS_BUILD_STATUS` 会被设为 `finished` 或 `errored`。
19. 如果构建 profile 中指定了 `buildArtifactPaths`，则把构建产物归档上传到私有 GCS 存储桶。

## 项目自动配置

每当你要构建新的 Android 应用二进制文件时，我们都会验证项目设置是否正确，以便在我们的服务器上顺利运行构建过程。这主要适用于[现有 React Native 项目](/bare/overview)，但构建使用持续原生生成（CNG）的项目时也会运行类似步骤。

### Android keystore

Android 要求你用证书为应用签名。该证书存放在 keystore 中。Google Play Store 根据证书识别应用。这意味着如果你丢失了 keystore，可能无法在商店中更新应用。不过，借助 [Play App Signing](https://developer.android.com/studio/publish/app-signing#app-signing-google-play)，可以降低丢失 keystore 的风险。

应用的 keystore 应当保密。**在任何情况下都不应把它提交到仓库。** 唯一的例外是调试 keystore，因为我们不会用它们把应用上传到 Google Play Store。

### 配置 Gradle

应用二进制文件需要用 keystore 签名。由于我们在远程服务器上构建项目，必须想办法把出于安全原因未提交到仓库的凭据提供给 Gradle。在某个远程步骤中，我们会把签名配置注入你的 **build.gradle**。EAS Build 会创建 **android/app/eas-build.gradle** 文件，内容如下：

```groovy android/app/eas-build.gradle
// 与 EAS 的构建集成

import java.nio.file.Paths

android {
  signingConfigs {
    release {
      // 这样用户就不必手动定义 release 签名配置
      // 如果没有定义 release 配置，并且这里也不存在，assembleRelease 构建会崩溃
    }
  }

  buildTypes {
    release {
      // 这样用户就不必手动定义 release 构建类型
    }
    debug {
      // 这样用户就不必手动定义 debug 构建类型
    }
  }
}

tasks.whenTaskAdded {
  android.signingConfigs.release {
    def credentialsJson = rootProject.file("../credentials.json");
    def credentials = new groovy.json.JsonSlurper().parse(credentialsJson)
    def keystorePath = Paths.get(credentials.android.keystore.keystorePath);
    def storeFilePath = keystorePath.isAbsolute()
      ? keystorePath
      : rootProject.file("..").toPath().resolve(keystorePath);

    storeFile storeFilePath.toFile()
    storePassword credentials.android.keystore.keystorePassword
    keyAlias credentials.android.keystore.keyAlias
    if (credentials.android.keystore.containsKey("keyPassword")) {
      keyPassword credentials.android.keystore.keyPassword
    } else {
      // Gradle 要求提供 key password，但 PKCS keystore 没有
      // 使用 keystore 密码似乎可以满足这一要求
      keyPassword credentials.android.keystore.keystorePassword
    }
  }

  android.buildTypes.release {
    signingConfig android.signingConfigs.release
  }

  android.buildTypes.debug {
    signingConfig android.signingConfigs.release
  }
}

```

最重要的部分是 `release` 签名配置。它被配置为从项目根目录的 **credentials.json** 文件读取 keystore 和密码。即使你不需要自己创建该文件，EAS Build 也会在运行构建之前创建它，并填入你的凭据。

该文件在 **android/app/build.gradle** 中这样导入：

```groovy android/app/build.gradle
// ...

apply from: "./eas-build.gradle"
```
