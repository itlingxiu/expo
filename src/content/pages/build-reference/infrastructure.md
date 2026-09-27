---
title: 构建服务器基础设施
description: 了解使用 EAS 时当前的构建服务器基础设施。
---

# 构建服务器基础设施

## 构建器 IP 地址

构建服务器的 IP 地址列表见[此文件](https://expo.dev/eas-build-worker-ips.txt)。我们预计不会经常更改该列表。列表包含 “Last-Modified” 和 “Expires” 两个 ISO 8601 时间戳，分别表示列表上次更新的时间，以及我们承诺在此之前不更改列表的时间。

Linux 运行器托管在 Google Cloud Platform 上。macOS 运行器托管在我们自己的 macOS 云上。

## 配置构建环境

每个平台的镜像都有特定版本的 Node.js、Yarn、CocoaPods、Xcode、Ruby、Fastlane 等。你可以在 [eas.json](/build/eas-json) 中覆盖其中一些版本。如果没有你要找的专用配置选项，可以用 [npm 钩子](/build-reference/npm-hooks)，通过 `apt-get` 或 `brew` 安装或更新任意系统依赖。请注意，这些自定义会在构建期间应用，并会增加构建时间。

选择构建镜像时，可以使用下面提供的完整名称，或使用别名之一：`auto`、`latest`，或针对特定 SDK，例如 `sdk-57`。

- 使用具体名称可以保证环境一致，只有小幅更新。
- 使用 `auto` 别名时，构建镜像会根据项目配置、Expo SDK 版本和 React Native 版本选择。你可以在构建日志的 **Spin up build environment** 部分查看某次构建使用了哪份镜像。
- `latest` 别名会指向软件版本最新的镜像。
- `sdk-57` 别名会指向最适合 SDK 57 构建的镜像。
- `sdk-56` 别名会指向最适合 SDK 56 构建的镜像。
- `sdk-55` 别名会指向最适合 SDK 55 构建的镜像。
- `sdk-54` 别名会指向最适合 SDK 54 构建的镜像。
- `sdk-53` 别名会指向最适合 SDK 53 构建的镜像。
- `sdk-52` 别名会指向最适合 SDK 52 构建的镜像。
- SDK 别名会随每次新的 SDK 发布而更新。
- `latest` 别名会随每次新镜像发布而更新。

:::note
**注意：** 如果你没有在 **eas.json** 中提供 `image`，构建默认会使用 `auto` 别名。
:::

## Android 构建服务器配置

Android 构建器在隔离环境中的虚拟机上运行。每次构建都有自己专用的虚拟机实例。

- 构建资源：

  > 官方页面在这里用交互组件按当前方案列出 Android 构建器的 CPU、内存等规格。这些数值会随基础设施调整而变化，无法在此静态复刻。请以 [expo.dev 定价页](https://expo.dev/pricing) 或构建日志中的资源等级为准。

- [用 Kubernetes 部署的 npm 缓存](/build-reference/caching#javascript-依赖)
- [用 Kubernetes 部署的 Maven 缓存](/build-reference/caching#android-依赖)
- 构建环境配置好之后，会通过环境变量 `GRADLE_OPTS` 注入 Gradle JVM 参数。参见下面的 [Gradle JVM 参数](#gradle-jvm-参数)。
- **~/.npmrc** 中的全局 npm 配置：

  ```ini ~/.npmrc
  registry=http://npm.production.caches.eas-build.internal
  ```

- **~/.yarnrc.yml** 中的全局 Yarn 配置：

  ```yaml ~/.yarnrc.yml
  unsafeHttpWhitelist:
    - '*'
  npmRegistryServer: 'http://npm.production.caches.eas-build.internal'
  enableImmutableInstalls: false
  ```

### Gradle JVM 参数

EAS Build 在 Gradle 运行之前，在构建虚拟机（工作器）上设置环境变量 `GRADLE_OPTS`。具体值取决于你选择的[资源等级](/eas/json#resourceclass)：

| 资源等级 | `-Xmx`（最大堆） |
| --- | --- |
| `medium` | `4g` |
| `large` | `8g` |

除了 `-Xmx`，工作器还会通过 `-Dorg.gradle.jvmargs` 把以下 JVM 参数传给 Gradle 构建 JVM：

- `-XX:MaxMetaspaceSize=1g`
- `-XX:+HeapDumpOnOutOfMemoryError`
- `-Dfile.encoding=UTF-8`

工作器还会在 `GRADLE_OPTS` 上设置这些顶层 Gradle 属性：

- `-Dorg.gradle.parallel=true`
- `-Dorg.gradle.daemon=false`

:::warning
工作器通过 `GRADLE_OPTS` 设置 `org.gradle.jvmargs`，这会覆盖项目 **gradle.properties** 中定义的任何 `org.gradle.jvmargs`。
:::

#### 覆盖 `GRADLE_OPTS`

你可以在 **eas.json** 中某个构建 profile 的 [`env`](/eas/json#env) 下、在[工作流文件](/eas/workflows/syntax#jobsjob_idenv)中，或用 [EAS 环境变量](/eas/environment-variables)设置 `GRADLE_OPTS`，以替换工作器的默认值。项目环境值优先于工作器的默认值。

### Android 服务器镜像

#### `ubuntu-26.04-jdk-17-ndk-r27b-sdk-57` (`latest`, `sdk-57`)

<details>
<summary>详情</summary>


- GCE 镜像：`ubuntu-2604-resolute-amd64-v20260624`
- NDK 27.1.12297006
- Node.js 22.23.1
- Bun 1.3.14
- Yarn 1.22.22
- pnpm 11.9.0
- npm 10.9.8
- Java 17
- node-gyp 13.0.0
- Maestro 2.6.1

</details>

#### `ubuntu-26.04-jdk-17-ndk-r27b` (`sdk-56`)

<details>
<summary>详情</summary>


- GCE 镜像：`ubuntu-2604-resolute-amd64-v20260505`
- NDK 27.1.12297006
- Node.js 22.22.2
- Bun 1.3.13
- Yarn 1.22.22
- pnpm 10.33.3
- npm 10.9.4
- Java 17
- node-gyp 12.3.0
- Maestro 2.5.1

</details>

#### `ubuntu-24.04-jdk-17-ndk-r27b-sdk-55` (`sdk-55`)

<details>
<summary>详情</summary>


- GCE 镜像：`ubuntu-2404-noble-amd64-v20260128`
- NDK 27.1.12297006
- Node.js 20.19.4
- Bun 1.3.8
- Yarn 1.22.22
- pnpm 10.28.2
- npm 10.9.3
- Java 17
- node-gyp 12.2.0
- Maestro 2.1.0

</details>

#### `ubuntu-24.04-jdk-17-ndk-r27b` (`sdk-54`)

<details>
<summary>详情</summary>


- GCE 镜像：`ubuntu-2404-noble-amd64-v20250805`
- NDK 27.1.12297006
- Node.js 20.19.4
- Bun 1.2.20
- Yarn 1.22.22
- pnpm 10.14.0
- npm 10.9.3
- Java 17
- node-gyp 11.3.0
- Maestro 2.0.2

</details>

#### `ubuntu-22.04-jdk-17-ndk-r26b` (`sdk-53`)

<details>
<summary>详情</summary>


- Docker 镜像：`ubuntu:jammy-v20250112`
- NDK 26.1.10909125
- Node.js 20.19.2
- Bun 1.2.4
- Yarn 1.22.22
- pnpm 9.15.5
- npm 10.8.2
- Java 17
- node-gyp 11.1.0

</details>

#### 旧版 `ubuntu-22.04-jdk-17-ndk-r26b`-like (`sdk-51`, `sdk-52`)

<details>
<summary>详情</summary>


- Docker 镜像：`ubuntu:jammy-v20250112`
- NDK 26.1.10909125
- Node.js 20.18.3
- Bun 1.2.4
- Yarn 1.22.22
- pnpm 9.15.5
- npm 10.8.2
- Java 17
- node-gyp 11.1.0

</details>

#### `ubuntu-22.04-jdk-17-ndk-r25b` (`sdk-50`)

<details>
<summary>详情</summary>


- Docker 镜像：`ubuntu:jammy-20220810`
- NDK 25.1.8937393
- Node.js 18.18.0
- Bun 1.0.14
- Yarn 1.22.19
- pnpm 8.9.2
- npm 9.8.1
- Java 17
- node-gyp 10.0.1

</details>

#### `ubuntu-22.04-jdk-11-ndk-r23b` (`sdk-49`)

<details>
<summary>详情</summary>


- Docker 镜像：`ubuntu:jammy-20220810`
- NDK 23.1.7779620
- Node.js 18.18.0
- Bun 1.0.14
- Yarn 1.22.19
- pnpm 8.7.5
- npm 9.8.1
- Java 11
- node-gyp 10.0.1

</details>

#### `ubuntu-22.04-jdk-17-ndk-r21e`

<details>
<summary>详情</summary>


- Docker 镜像：`ubuntu:jammy-20220810`
- NDK 21.4.7075529
- Node.js 18.18.0
- Bun 1.0.14
- Yarn 1.22.19
- pnpm 8.9.2
- npm 9.8.1
- Java 17
- node-gyp 10.0.1

</details>

#### `ubuntu-22.04-jdk-11-ndk-r21e`

<details>
<summary>详情</summary>


- Docker 镜像：`ubuntu:jammy-20220810`
- NDK 21.4.7075529
- Node.js 18.18.0
- Bun 1.0.14
- Yarn 1.22.19
- pnpm 8.7.5
- npm 9.8.1
- Java 11
- node-gyp 10.0.1

</details>

#### `ubuntu-22.04-jdk-8-ndk-r21e` （已弃用）

<details>
<summary>详情</summary>


- Docker 镜像：`ubuntu:jammy-20220810`
- NDK 21.4.7075529
- Node.js 18.18.0
- Bun 1.0.14
- Yarn 1.22.19
- pnpm 7.0.0
- npm 9.8.1
- Java 8
- node-gyp 10.0.1

</details>

#### `ubuntu-20.04-jdk-11-ndk-r23b` （已弃用）

<details>
<summary>详情</summary>


- Docker 镜像：`ubuntu:focal-20220823`
- NDK 23.1.7779620
- Node.js 18.18.0
- Bun 1.0.14
- Yarn 1.22.19
- pnpm 7.0.0
- npm 9.8.1
- Java 11
- node-gyp 10.0.1

</details>

#### `ubuntu-20.04-jdk-11-ndk-r21e` （已弃用）

<details>
<summary>详情</summary>


- Docker 镜像：`ubuntu:focal-20220823`
- NDK 21.4.7075529
- Node.js 18.18.0
- Bun 1.0.14
- Yarn 1.22.19
- pnpm 7.0.0
- npm 9.8.1
- Java 11
- node-gyp 10.0.1

</details>

#### `ubuntu-20.04-jdk-8-ndk-r21e` （已弃用）

<details>
<summary>详情</summary>


- Docker 镜像：`ubuntu:focal-20220823`
- NDK 21.4.7075529
- Node.js 18.18.0
- Bun 1.0.14
- Yarn 1.22.19
- pnpm 7.0.0
- npm 9.8.1
- Java 8
- node-gyp 10.0.1

</details>

#### `ubuntu-20.04-jdk-11-ndk-r19c` （已弃用）

<details>
<summary>详情</summary>


- Docker 镜像：`ubuntu:focal-20220823`
- NDK 19.2.5345600
- Node.js 18.18.0
- Bun 1.0.14
- Yarn 1.22.19
- pnpm 7.0.0
- npm 9.8.1
- Java 11
- node-gyp 10.0.1

</details>

#### `ubuntu-20.04-jdk-8-ndk-r19c` （已弃用）

<details>
<summary>详情</summary>


- Docker 镜像：`ubuntu:focal-20220823`
- NDK 19.2.5345600
- Node.js 18.18.0
- Bun 1.0.14
- Yarn 1.22.19
- pnpm 7.0.0
- npm 9.8.1
- Java 8
- node-gyp 10.0.1

</details>

## iOS 构建服务器配置

iOS 构建器虚拟机在隔离环境中的 Mac mini 主机上运行。每次构建都有自己全新的 macOS 虚拟机。更多信息参见 [iOS 专用资源等级](/eas/json#resourceclass-2)。

- 构建资源：

  > 官方页面在这里用交互组件按当前方案列出 iOS 构建器的 CPU、内存等规格。这些数值会随基础设施调整而变化，无法在此静态复刻。请以 [expo.dev 定价页](https://expo.dev/pricing) 或构建日志中的资源等级为准。

- [npm 缓存](/build-reference/caching#javascript-依赖)
- [CocoaPods 缓存](/build-reference/caching#ios-依赖)
- **~/.npmrc** 中的全局 npm 配置：

  ```ini ~/.npmrc
  registry=http://npm.caches.eas-build.internal
  ```

- **~/.yarnrc.yml** 中的全局 Yarn 配置：

  ```yaml ~/.yarnrc.yml
  unsafeHttpWhitelist:
    - '*'
  npmRegistryServer: 'http://npm.caches.eas-build.internal'
  enableImmutableInstalls: false
  ```

### iOS 服务器镜像

#### `macos-tahoe-26.5-xcode-26.6` (`latest`, `sdk-57`)

<details>
<summary>详情</summary>


- macOS Tahoe 26.5.2
- Xcode 26.6 (17F113)
- Node.js 22.23.1
- Bun 1.3.14
- Yarn 1.22.22
- pnpm 11.9.0
- npm 10.9.8
- fastlane 2.236.1
- CocoaPods 1.16.2
- Ruby 3.2
- node-gyp 13.0.0
- Maestro 2.6.1

</details>

#### `macos-tahoe-26.4-xcode-26.4` (`sdk-56`)

<details>
<summary>详情</summary>


- macOS Tahoe 26.4.1
- Xcode 26.4 (17E202)
- Node.js 22.22.2
- Bun 1.3.13
- Yarn 1.22.22
- pnpm 10.33.3
- npm 10.9.4
- fastlane 2.233.1
- CocoaPods 1.16.2
- Ruby 3.2
- node-gyp 12.3.0
- Maestro 2.5.1

</details>

#### `macos-sequoia-15.6-xcode-26.2` (`sdk-55`)

<details>
<summary>详情</summary>


- macOS Sequoia 15.6.1
- Xcode 26.2 (17C52)
- Node.js 20.19.4
- Bun 1.3.8
- Yarn 1.22.22
- pnpm 10.28.2
- npm 10.9.3
- fastlane 2.231.1
- CocoaPods 1.16.2
- Ruby 3.2
- node-gyp 12.2.0
- Maestro 2.1.0

</details>

#### `macos-sequoia-15.6-xcode-26.1`

<details>
<summary>详情</summary>


- macOS Sequoia 15.6.1
- Xcode 26.1 (17B55)
- Node.js 20.19.4
- Bun 1.3.1
- Yarn 1.22.22
- pnpm 10.20.0
- npm 10.9.3
- fastlane 2.228.0
- CocoaPods 1.16.2
- Ruby 3.2
- node-gyp 11.5.0
- Maestro 2.0.9

</details>

#### `macos-sequoia-15.6-xcode-26.0` (`sdk-54`, `macos-sequoia-15.5-xcode-26.0`)

<details>
<summary>详情</summary>


- macOS Sequoia 15.6
- Xcode 26.0 (17A324)
- Node.js 20.19.4
- Bun 1.2.22
- Yarn 1.22.22
- pnpm 10.16.1
- npm 10.9.3
- fastlane 2.228.0
- CocoaPods 1.16.2
- Ruby 3.2
- node-gyp 11.4.2
- jq 1.8.0
- Azul Zulu JDK 17.58.21 (OpenJDK 17.0.15)
- Git 2.49.0
- Git LFS 3.6.1
- applesimutils 0.9.12
- idb-companion 1.1.8
- Maestro 2.0.3

</details>

#### `macos-sequoia-15.6-xcode-16.4` （如果不想使用 Xcode 26，建议 SDK 54 使用此镜像）

<details>
<summary>详情</summary>


- macOS Sequoia 15.6
- Xcode 16.4 (16F6)
- Node.js 20.19.4
- Bun 1.2.20
- Yarn 1.22.22
- pnpm 10.14.0
- npm 10.9.3
- fastlane 2.228.0
- CocoaPods 1.16.2
- Ruby 3.2
- node-gyp 11.3.0
- Maestro 1.41.0
- jq 1.8.0
- Azul Zulu JDK 17.58.21 (OpenJDK 17.0.15)
- Git 2.49.0
- Git LFS 3.6.1
- applesimutils 0.9.10
- idb-companion 1.1.8

</details>

#### `macos-sequoia-15.5-xcode-16.4` (`sdk-53`)

<details>
<summary>详情</summary>


- macOS Sequoia 15.5
- Xcode 16.4 (16E140)
- Node.js 20.19.2
- Bun 1.2.15
- Yarn 1.22.22
- pnpm 9.15.9
- npm 10.8.2
- fastlane 2.227.1
- CocoaPods 1.16.2
- Ruby 3.2
- node-gyp 11.2.0
- jq 1.8.0
- Azul Zulu JDK 17.58.21 (OpenJDK 17.0.15)
- Git 2.49.0
- Git LFS 3.6.1
- applesimutils 0.9.10
- idb-companion 1.1.8

</details>

#### `macos-sequoia-15.4-xcode-16.3`

<details>
<summary>详情</summary>


- macOS Sequoia 15.4.1
- Xcode 16.3 (16E140)
- Node.js 20.19.1
- Bun 1.2.11
- Yarn 1.22.22
- pnpm 9.15.9
- npm 9.8.1
- fastlane 2.227.1
- CocoaPods 1.16.2
- Ruby 3.2
- node-gyp 11.2.0
- jq 1.7.1
- Azul Zulu JDK 17.58.21 (OpenJDK 17.0.15)
- Git 2.49.0
- Git LFS 3.6.1
- applesimutils 0.9.10
- idb-companion 1.1.8

</details>

#### `macos-sequoia-15.3-xcode-16.2` (`sdk-52`)

<details>
<summary>详情</summary>


- macOS Sequoia 15.3
- Xcode 16.2 (16C5032a)
- Node.js 20.18.3
- Bun 1.2.4
- Yarn 1.22.22
- pnpm 9.15.5
- npm 9.8.1
- fastlane 2.226.0
- CocoaPods 1.16.2
- Ruby 3.2
- node-gyp 11.1.0

</details>

#### `macos-sonoma-14.6-xcode-16.1`

<details>
<summary>详情</summary>


- macOS Sonoma 14.6
- Xcode 16.1 (16B40)
- Node.js 18.18.0
- Bun 1.1.33
- Yarn 1.22.21
- pnpm 9.12.3
- npm 9.8.1
- fastlane 2.225.0
- CocoaPods 1.16.2
- Ruby 3.2
- node-gyp 10.2.0

</details>

#### `macos-sonoma-14.6-xcode-16.0`

<details>
<summary>详情</summary>


- macOS Sonoma 14.6
- Xcode 16.0 (16A242d)
- Node.js 18.18.0
- Bun 1.1.27
- Yarn 1.22.21
- pnpm 9.10.0
- npm 9.8.1
- fastlane 2.222.0
- CocoaPods 1.15.2
- Ruby 3.2
- node-gyp 10.2.0

</details>

#### `macos-sonoma-14.5-xcode-15.4` (`sdk-51`, `sdk-50`, `sdk-49`)

<details>
<summary>详情</summary>


- macOS Sonoma 14.5
- Xcode 15.4 (15F31d)
- Node.js 18.18.0
- Bun 1.1.13
- Yarn 1.22.21
- pnpm 9.3.0
- npm 9.8.1
- fastlane 2.220.0
- CocoaPods 1.14.3
- Ruby 2.7
- node-gyp 10.1.0

</details>

#### `macos-sonoma-14.4-xcode-15.3`

<details>
<summary>详情</summary>


- macOS Sonoma 14.4.1
- Xcode 15.3 (15E204a)
- Node.js 18.18.0
- Bun 1.0.35
- Yarn 1.22.21
- pnpm 8.14.1
- npm 9.8.1
- fastlane 2.219.0
- CocoaPods 1.14.3
- Ruby 2.7
- node-gyp 10.0.1

</details>

#### `macos-ventura-13.6-xcode-15.2`

<details>
<summary>详情</summary>


- macOS Ventura 13.6
- Xcode 15.2 (15C500b)
- Node.js 18.18.0
- Bun 1.0.23
- Yarn 1.22.21
- pnpm 8.14.1
- npm 9.8.1
- fastlane 2.219.0
- CocoaPods 1.14.3
- Ruby 2.7
- node-gyp 10.0.1

</details>

#### `macos-ventura-13.6-xcode-15.1`

<details>
<summary>详情</summary>


- macOS Ventura 13.6
- Xcode 15.1 (15C65)
- Node.js 18.18.0
- Bun 1.0.14
- Yarn 1.22.19
- pnpm 8.12.1
- npm 9.8.1
- fastlane 2.217.0
- CocoaPods 1.14.3
- Ruby 2.7
- node-gyp 10.0.1

</details>

#### `macos-ventura-13.6-xcode-15.0`

<details>
<summary>详情</summary>


- macOS Ventura 13.6
- Xcode 15.0 (15A240d)
- Node.js 18.18.0
- Bun 1.0.14
- Yarn 1.22.19
- pnpm 8.7.6
- npm 9.8.1
- fastlane 2.216.0
- CocoaPods 1.13.0
- Ruby 2.7
- node-gyp 10.0.1

</details>

### 支持的 Xcode 版本

我们的目标是支持所有稳定的 Xcode 发布版本，使你在构建过程中使用它们时可以把应用提交到 App Store Connect。

这通常意味着我们支持最新的稳定 Xcode 版本以及上一个版本（直到 Apple 引入新的[最低 Xcode 版本要求](https://developer.apple.com/news/upcoming-requirements/?id=04292024a)）。
