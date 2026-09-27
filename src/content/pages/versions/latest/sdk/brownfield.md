---
title: Brownfield 包参考
description: 用于把 Expo 集成到已有原生应用中的工具包和 API。
---

# Brownfield 包参考

`expo-brownfield` 是一个工具包，用于把 React Native 视图添加到已有的原生 Android 和 iOS 应用中。它提供：

- 用于原生应用与 React Native 应用之间双向通信和导航的**内置 API**
- 用于在 Expo 项目中自动设置 brownfield 目标的**配置插件**
- 用于构建产物并发布到 Maven 仓库（Android）和 XCFramework（iOS）的 **CLI**

> 支持平台：Android、iOS。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-brownfield
```
:::
:::tab yarn
```sh
yarn expo install expo-brownfield
```
:::
:::tab pnpm
```sh
pnpm expo install expo-brownfield
```
:::
:::tab bun
```sh
bun expo install expo-brownfield
```
:::
:::

## 用法

### 通信 API

通信 API 支持原生（宿主）应用与 React Native 之间基于消息的双向通信。

#### 从 React Native 向原生发送消息

```typescript
import * as Brownfield from 'expo-brownfield';

Brownfield.sendMessage({
  type: 'MyMessage',
  data: {
    language: 'TypeScript',
    expo: true,
    platforms: ['android', 'ios'],
  },
});
```

#### 在 React Native 中接收来自原生的消息

```typescript
import * as Brownfield, { type MessageEvent } from 'expo-brownfield';
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Received message:', event);
    };

    Brownfield.addMessageListener(handleMessage);

    return () => {
      Brownfield.removeMessageListener(handleMessage);
    };
  }, []);

  // ...
}
```

#### 从原生向 React Native 发送消息

:::tabs
:::tab Android
```kotlin
import expo.modules.brownfield.BrownfieldMessaging

BrownfieldMessaging.sendMessage(mapOf(
    "type" to "MyAndroidMessage",
    "timestamp" to System.currentTimeMillis(),
    "data" to mapOf(
        "platform" to "android"
    )
))
```
:::
:::tab iOS
```swift
import ExpoBrownfield

BrownfieldMessaging.sendMessage([
    "type": "MyIOSMessage",
    "timestamp": Date().timeIntervalSince1970,
    "data": [
        "platform": "ios"
    ]
])
```
:::
:::

#### 在原生中接收来自 React Native 的消息

:::tabs
:::tab Android
```kotlin
import expo.modules.brownfield.BrownfieldMessaging

val listenerId = BrownfieldMessaging.addListener { event ->
    println("Message from React Native: $event")
}

// 之后，要移除监听器：
BrownfieldMessaging.removeListener(listenerId)
```
:::
:::tab iOS
```swift
import ExpoBrownfield

let listenerId = BrownfieldMessaging.addListener { message in
    print("Message from React Native: \(message)")
}

// 之后，要移除监听器：
BrownfieldMessaging.removeListener(id: listenerId)
```
:::
:::

## 在应用配置中配置

`expo-brownfield` 包提供一个[配置插件](/config-plugins/introduction)，在使用[持续原生生成（CNG）](/workflow/continuous-native-generation)时，可用它配置 brownfield 集成。该插件允许你自定义 Expo 项目如何被打包并集成到已有的原生应用中。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-brownfield",
        {
          "ios": {
            "targetName": "MyBrownfieldTarget",
            "bundleIdentifier": "com.example.brownfield"
          },
          "android": {
            "group": "com.example",
            "libraryName": "brownfield",
            "package": "com.example.brownfield",
            "version": "1.0.0"
          }
        }
      ]
    ]
  }
}
```

### 可配置属性

| 属性 | 平台 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ios.targetName` | iOS | `"<scheme>brownfield" 或 "<slug>brownfield"` | brownfield 集成的 Xcode target 名称。用于在 Xcode 项目中为 React Native 代码创建单独的 target。 |
| `ios.bundleIdentifier` | iOS | `"<ios.bundleIdentifier 基名>.<targetName>" 或 "com.example.<targetName>"` | brownfield target 的 Bundle Identifier。它应唯一，并且与主应用的 Bundle Identifier 不同。 |
| `ios.buildReactNativeFromSource` | iOS | `false` | 从源码构建 React Native，而不是使用预构建框架。打开此项会显著增加构建时间。 |
| `android.group` | Android | `"<去掉最后一段的 package>"` | 生成的 Android 库的 Maven group ID。发布库到 Maven 仓库时使用。 |
| `android.libraryName` | Android | `"brownfield"` | 生成的 Android 库模块的名称。 |
| `android.package` | Android | `"<android.package>.brownfield" 或 "com.example.brownfield"` | 生成的 Android 库代码的 Java/Kotlin 包名。 |
| `android.version` | Android | `"1.0.0"` | 生成的 Android 库的版本字符串。发布到 Maven 仓库时使用。 |
| `android.publishing` | Android | `[{ type: "localMaven" }]` | 生成的 Android 库的发布配置。支持 `localMaven`、`localDirectory`、`remotePublic` 和 `remotePrivate` 发布类型。每种类型都有不同的配置选项，用于指定库发布到何处以及如何发布。 |

## 发布产物

`expo-brownfield` CLI 把 Android 产物推送到一个或多个 Maven 仓库，这些仓库通过应用配置中的 `android.publishing` 声明。支持的仓库类型有：

| `type` | 说明 |
| --- | --- |
| `localMaven` | 发布到 **~/.m2/repository**。默认值。适合开发期间与本地宿主应用集成。 |
| `localDirectory` | 发布到本地文件系统路径（`path` 字段）。适合把产物提交到相邻的 git 仓库。 |
| `remotePublic` | 发布到无需身份验证的公共 Maven 仓库。 |
| `remotePrivate` | 发布到需要身份验证的远程 Maven 仓库。凭据可以是内联字符串，也可以是环境变量引用。 |

`remotePrivate` 上的 `url`、`username` 和 `password` 接受普通字符串，或在构建时通过 Gradle 的 `providers.environmentVariable(...)` 解析值的 `EnvValue` 对象（`{ "variable": "SOME_ENV_VAR" }`）。把密钥固定到环境变量，这样它们就不会进入已提交的应用配置。

### 发布到 GitHub Packages

GitHub Packages 托管一个限定在 GitHub 仓库范围内的私有 Maven 仓库。身份验证使用 `GITHUB_ACTOR`（用户或机器人名称）以及具有 `write:packages` 和 `read:packages` 范围的[个人访问令牌（PAT）](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages#authenticating-to-github-packages)。在 GitHub Actions 中，工作流的 `GITHUB_TOKEN` 已经具备该工作流自身仓库所需的范围。

向 `android.publishing` 添加一条 `remotePrivate` 条目，指向测试仓库的 GitHub Packages URL：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-brownfield",
        {
          "android": {
            "group": "com.example",
            "libraryName": "brownfield",
            "publishing": [
              { "type": "localMaven" },
              {
                "type": "remotePrivate",
                "name": "GitHubPackages",
                "url": "https://maven.pkg.github.com/<owner>/<repo>",
                "username": { "variable": "GITHUB_ACTOR" },
                "password": { "variable": "GITHUB_TOKEN" }
              }
            ]
          }
        }
      ]
    ]
  }
}
```

`name` 字段同时控制 Gradle Maven 仓库名称和 `--repo` CLI 标志的值。当 `"name": "GitHubPackages"` 时，发布任务变为 `publishBrownfieldReleasePublicationToGitHubPackagesRepository`（debug 对应任务为 `publishBrownfieldDebugPublicationToGitHubPackagesRepository`）。默认调用会同时运行两者：

```sh
npx expo-brownfield build:android --fused --repo GitHubPackages
```

### 只发布融合产物

非融合发布流程会为每个自动链接的 Expo Android 模块发出一个 Maven 坐标（每次发布通常有 20 到 40 个产物）。若要改为发布一小套经过挑选的产物，请使用 `--fused`。融合模式会短路发布插件按模块重新发布的循环，只发出胖 AAR 的对应产物。始终需要一个仓库（`--repo`）或一个显式任务（`-t`），因为没有默认值：

| 调用 | 发布的坐标 |
| --- | --- |
| `--fused --release --repo <name>` | `<group>:<libraryName>-fused-release:<version>` |
| `--fused --debug --repo <name>` | `<group>:<libraryName>-fused-debug:<version>` |
| `--fused --all --repo <name>`（与 `--fused` 一起时的默认值） | 以上两者（底层两次 Gradle 调用，每个变体一次） |

每次发布最多发布两个 Maven 坐标，与项目自动链接了多少 Expo 模块无关。其余内容（按模块的 AAR、传递性 Maven 依赖）不会进入你的远程仓库。基础库（AndroidX、RN 运行时、Kotlin 标准库、宿主已经拥有的 Glide 替代品）留在 POM 中作为外部依赖，而不是融进 AAR。

### 融合模式

`--fused` 通过预构建始终会生成的两个额外 Gradle 子项目来发布——`:<libraryName>-fused-release` 和 `:<libraryName>-fused-debug`——每个子项目通过 [AGP 的 Fused Library 插件](https://developer.android.com/build/publish-library/fused-library) 生成一个胖 AAR（预览功能；CLI 会临时强制这些构建使用 AGP 8.13）。这些子项目在普通构建中是惰性的：只有当 CLI 传入 `-Pbrownfield.fused=true` 时，它们的构建脚本才会激活，因此 `npx expo run:android` 和 IDE 同步不会产生额外的配置成本。如果你不通过 CLI、而是直接调用融合 Gradle 任务，请自行传入 `-Pbrownfield.fused=true`。

并非所有内容都会融进 AAR。构建会把三类依赖保持为外部依赖，并在已发布的 POM 和 Gradle Module Metadata 中把它们声明为普通 Maven 依赖，由宿主应用自行解析：

- **Brownfield 宿主基线**——React Native 运行时（`react-android`、`hermes-android`、`fbjni`、`soloader`、`yoga`）、Kotlin 标准库，以及宿主提供的通用库（Material Components、Guava、Fresco、OkHttp、Okio）。把这些融进去会重复宿主已经附带的类。
- **`androidx.*` 库**——AGP Fused Library 的类重写器无法解析其 styleable 中的 `android:` 框架属性，因此除了出于校验原因必须融合的链（默认是 `androidx.camera`、`androidx.media3`）之外，所有 AndroidX 都保持外部。
- **自动检测的 KMP 伞形模块**——仅 POM 的坐标，其所有变体都重定向到一个平台模块。

已发布的元数据还会用同级产物的构建类型标注 `react-android` 和 `hermes-android` 依赖边，因此即使 debug 宿主使用 release AAR，宿主应用也始终会解析与融合 AAR 的原生库所链接的同一 React Native 变体。

当项目的依赖图需要时，五个 Gradle 属性可以调整此行为：

| 属性 | 效果 |
| --- | --- |
| `brownfield.fused.skip` | 以逗号分隔的 Gradle 项目名，这些项目完全不放入胖 AAR。 |
| `brownfield.fused.strip-packages` | 以逗号分隔的包前缀，从生成的 `ExpoModulesPackageList` 中移除。与 `skip` 搭配，以避免启动时因被跳过的模块出现 `NoClassDefFoundError`。 |
| `brownfield.fused.androidx-fuse` | 额外要融进 AAR、而不是保持外部的 `androidx.*` group 前缀。 |
| `brownfield.fused.exclude-transitive` | 额外要保持外部的依赖 group（在 POM 中声明，而不是融合）。 |
| `brownfield.fused.host-provided` | 宿主应用已经附带的依赖 group（Glide、Compose 等）。与 `exclude-transitive` 一样不放入 AAR，但也不在 POM 中声明，因此宿主自己的版本不受影响。 |

从 **android** 目录直接调用融合发布任务时，把它们作为 `-P` Gradle 属性传入：

```sh
./gradlew :brownfield-fused-release:publishBrownfieldReleasePublicationToMavenLocal \
    -Pbrownfield.fused=true \
    -Pbrownfield.fused.skip=expo-camera \
    -Pbrownfield.fused.strip-packages=expo.modules.camera.
```

:::note
融合之前，请检查宿主应用已经使用了哪些库。如果宿主自带 Glide（`expo-image` 会融合 Glide）、Jetpack Compose（`@expo/ui`）或类似库，融合 AAR 中的副本会在构建时与宿主冲突（重复类），或通过 POM 强制升级宿主。最好把这些 Expo 模块留在项目之外，或把共享的 group 标记为 `brownfield.fused.host-provided` 并手动对齐版本。
:::

### GitHub Actions 工作流示例

```yaml .github/workflows/publish-brownfield.yml
name: Publish brownfield fused AAR

on:
  push:
    tags:
      - 'brownfield-v*'
  workflow_dispatch:

permissions:
  contents: read
  packages: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17
      - run: npm ci
      - run: npx expo prebuild --platform android
      - run: npx expo-brownfield build:android --fused --release --repo GitHubPackages
        env:
          GITHUB_ACTOR: ${{ github.actor }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

通过 `git tag brownfield-v1.0.0 && git push --tags` 触发（或通过 Actions 标签页手动触发）。工作流内置的 `GITHUB_TOKEN` 范围限于该工作流自身的仓库，因此要发布到第三方仓库，需要改用存放在仓库密钥中的 PAT。

### 消费者设置（宿主 Android 应用）

宿主应用的 **settings.gradle.kts**（或按模块的 **build.gradle.kts**）声明相同的 GitHub Packages URL 和凭据。宿主应用的 CI 或本地构建必须设置 `GITHUB_ACTOR` 和 `GITHUB_TOKEN` 环境变量，或从 **~/.gradle/gradle.properties** 读取。

```kotlin android/settings.gradle.kts
dependencyResolutionManagement {
  repositories {
    google()
    mavenCentral()
    maven {
      url = uri("https://maven.pkg.github.com/<owner>/<repo>")
      credentials {
        username = providers.environmentVariable("GITHUB_ACTOR").orNull
          ?: providers.gradleProperty("gpr.user").orNull
        password = providers.environmentVariable("GITHUB_TOKEN").orNull
          ?: providers.gradleProperty("gpr.token").orNull
      }
    }
  }
}
```

```kotlin android/app/build.gradle.kts
dependencies {
  releaseImplementation("com.example:brownfield-fused-release:1.0.0")
  debugImplementation("com.example:brownfield-fused-debug:1.0.0")
}
```

`releaseImplementation` / `debugImplementation` 会自动配对变体。Gradle 会按宿主构建类型选择匹配的同级产物。如果宿主只发布 release 构建，可以去掉 `debugImplementation` 这一行，并用 `--fused --release` 只发布 release 同级产物。

宿主应用的若干要求与提示：

- **`minSdk` 必须至少为 24**（React Native 的下限）。针对更低 API 级别的宿主在消费该 AAR 时，会在清单合并阶段失败。
- **权限会从融合模块合并进来。** 例如，与媒体相关的 Expo 模块会声明存储权限。如果宿主强制执行权限允许列表，请在宿主清单中用 `tools:node="remove"` 去掉不需要的条目（或用 `tools:replace` 调和属性冲突）。
- **AAR 会附带发布时启用的每个 ABI 的原生库。** 如果不加过滤，宿主 APK 会因全部四个 ABI 的 React Native 库而变大。发布时限制 ABI（在 Expo 项目的 **gradle.properties** 中设置 `reactNativeArchitectures=arm64-v8a`），或在宿主中用 `ndk.abiFilters` 或 APK 拆分进行过滤。

## CLI

`expo-brownfield` 库包含一个 CLI，用于构建并发布到 Maven 仓库（Android）和 XCFramework（iOS）。

```sh
npx expo-brownfield [command] [options]
```

### 命令

#### `build:android`

构建 brownfield 库及其依赖，并发布到 Maven 仓库。

```sh
npx expo-brownfield build:android [options]
```

| 选项 | 说明 |
| --- | --- |
| `-d, --debug` | 以 debug 模式构建 |
| `-r, --release` | 以 release 模式构建 |
| `-a, --all` | 同时以 debug 和 release 模式构建（默认） |
| `--fused` | 通过 AGP Fused Library 为每个变体发布单个胖 AAR。见[融合模式](#融合模式) |
| `-l, --library` | 指定 brownfield 库名称 |
| `--repo, --repository` | 指定要发布到的 Maven 仓库 |
| `-t, --task` | 指定要运行的 Gradle 发布任务 |
| `--verbose` | 包含子进程的全部日志 |

#### `build:ios`

构建 brownfield XCFramework，并把 Hermes XCFramework 复制到产物目录。

```sh
npx expo-brownfield build:ios [options]
```

| 选项 | 说明 |
| --- | --- |
| `-d, --debug` | 以 debug 模式构建 |
| `-r, --release` | 以 release 模式构建（默认） |
| `-a, --artifacts` | 产物目录路径（默认：`./artifacts`） |
| `-s, --scheme` | 要构建的 Xcode scheme |
| `-x, --xcworkspace` | Xcode workspace 路径 |
| `-p, --package` | 以 Swift Package 形式交付产物（可带可选名称） |
| `--verbose` | 包含子进程的全部日志 |

#### `tasks:android`

列出所有可用的发布任务和 Maven 仓库。

```sh
npx expo-brownfield tasks:android
```

## API

```js
import * as Brownfield from 'expo-brownfield';
```
