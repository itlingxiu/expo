const fs = require('fs')
const src = fs.readFileSync('E:/个人/个人项目/expo/.scratch/tmp/src/build-reference__infrastructure.mdx', 'utf8')

function convertChunk(text) {
  let s = text
  s = s.replace(/<Collapsible summary="Details">/g, '<details>\n<summary>详情</summary>\n')
  s = s.replace(/<\/Collapsible>/g, '</details>')
  s = s.replace(/^- GCE image:/gm, '- GCE 镜像：')
  s = s.replace(/^- Docker image:/gm, '- Docker 镜像：')
  s = s.replace(/#### Legacy <CopyTextButton>([\s\S]*?)<\/CopyTextButton>/g, (_, inner) => {
    return '#### 旧版 ' + inner.replace(/\(deprecated\)/g, '（已弃用）')
  })
  s = s.replace(/#### <CopyTextButton>([\s\S]*?)<\/CopyTextButton>([^\n]*)/g, (_, inner, rest) => {
    let extra = rest.trim()
    if (extra.startsWith("(recommended for SDK 54")) {
      extra = '（如果不想使用 Xcode 26，建议 SDK 54 使用此镜像）'
    }
    inner = inner.replace(/\(deprecated\)/g, '（已弃用）')
    return '#### ' + inner + (extra ? ' ' + extra : '')
  })
  return s.trim()
}

const androidStart = src.indexOf('### Android server images')
const iosStart = src.indexOf('## iOS build server configurations')
const iosImages = src.indexOf('### iOS server images')
const xcode = src.indexOf('### Supported Xcode versions')

const androidImages = convertChunk(src.slice(androidStart, iosStart).replace('### Android server images', '').trim())
const iosImageBody = convertChunk(src.slice(iosImages, xcode).replace('### iOS server images', '').trim())

const header = `---
title: 构建服务器基础设施
description: 了解使用 EAS 时当前的构建服务器基础设施。
---

# 构建服务器基础设施

## 构建器 IP 地址

构建服务器的 IP 地址列表见[此文件](https://expo.dev/eas-build-worker-ips.txt)。我们预计不会经常更改该列表。列表包含 “Last-Modified” 和 “Expires” 两个 ISO 8601 时间戳，分别表示列表上次更新的时间，以及我们承诺在此之前不更改列表的时间。

Linux 运行器托管在 Google Cloud Platform 上。macOS 运行器托管在我们自己的 macOS 云上。

## 配置构建环境

每个平台的镜像都有特定版本的 Node.js、Yarn、CocoaPods、Xcode、Ruby、Fastlane 等。你可以在 [eas.json](/build/eas-json) 中覆盖其中一些版本。如果没有你要找的专用配置选项，可以用 [npm 钩子](/build-reference/npm-hooks)，通过 \`apt-get\` 或 \`brew\` 安装或更新任意系统依赖。请注意，这些自定义会在构建期间应用，并会增加构建时间。

选择构建镜像时，可以使用下面提供的完整名称，或使用别名之一：\`auto\`、\`latest\`，或针对特定 SDK，例如 \`sdk-57\`。

- 使用具体名称可以保证环境一致，只有小幅更新。
- 使用 \`auto\` 别名时，构建镜像会根据项目配置、Expo SDK 版本和 React Native 版本选择。你可以在构建日志的 **Spin up build environment** 部分查看某次构建使用了哪份镜像。
- \`latest\` 别名会指向软件版本最新的镜像。
- \`sdk-57\` 别名会指向最适合 SDK 57 构建的镜像。
- \`sdk-56\` 别名会指向最适合 SDK 56 构建的镜像。
- \`sdk-55\` 别名会指向最适合 SDK 55 构建的镜像。
- \`sdk-54\` 别名会指向最适合 SDK 54 构建的镜像。
- \`sdk-53\` 别名会指向最适合 SDK 53 构建的镜像。
- \`sdk-52\` 别名会指向最适合 SDK 52 构建的镜像。
- SDK 别名会随每次新的 SDK 发布而更新。
- \`latest\` 别名会随每次新镜像发布而更新。

:::note
**注意：** 如果你没有在 **eas.json** 中提供 \`image\`，构建默认会使用 \`auto\` 别名。
:::

## Android 构建服务器配置

Android 构建器在隔离环境中的虚拟机上运行。每次构建都有自己专用的虚拟机实例。

- 构建资源：

  > 官方页面在这里用交互组件按当前方案列出 Android 构建器的 CPU、内存等规格。这些数值会随基础设施调整而变化，无法在此静态复刻。请以 [expo.dev 定价页](https://expo.dev/pricing) 或构建日志中的资源等级为准。

- [用 Kubernetes 部署的 npm 缓存](/build-reference/caching#javascript-依赖)
- [用 Kubernetes 部署的 Maven 缓存](/build-reference/caching#android-依赖)
- 构建环境配置好之后，会通过环境变量 \`GRADLE_OPTS\` 注入 Gradle JVM 参数。参见下面的 [Gradle JVM 参数](#gradle-jvm-参数)。
- **~/.npmrc** 中的全局 npm 配置：

  \`\`\`ini ~/.npmrc
  registry=http://npm.production.caches.eas-build.internal
  \`\`\`

- **~/.yarnrc.yml** 中的全局 Yarn 配置：

  \`\`\`yaml ~/.yarnrc.yml
  unsafeHttpWhitelist:
    - '*'
  npmRegistryServer: 'http://npm.production.caches.eas-build.internal'
  enableImmutableInstalls: false
  \`\`\`

### Gradle JVM 参数

EAS Build 在 Gradle 运行之前，在构建虚拟机（工作器）上设置环境变量 \`GRADLE_OPTS\`。具体值取决于你选择的[资源等级](/eas/json#resourceclass)：

| 资源等级 | \`-Xmx\`（最大堆） |
| --- | --- |
| \`medium\` | \`4g\` |
| \`large\` | \`8g\` |

除了 \`-Xmx\`，工作器还会通过 \`-Dorg.gradle.jvmargs\` 把以下 JVM 参数传给 Gradle 构建 JVM：

- \`-XX:MaxMetaspaceSize=1g\`
- \`-XX:+HeapDumpOnOutOfMemoryError\`
- \`-Dfile.encoding=UTF-8\`

工作器还会在 \`GRADLE_OPTS\` 上设置这些顶层 Gradle 属性：

- \`-Dorg.gradle.parallel=true\`
- \`-Dorg.gradle.daemon=false\`

:::warning
工作器通过 \`GRADLE_OPTS\` 设置 \`org.gradle.jvmargs\`，这会覆盖项目 **gradle.properties** 中定义的任何 \`org.gradle.jvmargs\`。
:::

#### 覆盖 \`GRADLE_OPTS\`

你可以在 **eas.json** 中某个构建 profile 的 [\`env\`](/eas/json#env) 下、在[工作流文件](/eas/workflows/syntax#jobsjob_idenv)中，或用 [EAS 环境变量](/eas/environment-variables)设置 \`GRADLE_OPTS\`，以替换工作器的默认值。项目环境值优先于工作器的默认值。

### Android 服务器镜像

${androidImages}

## iOS 构建服务器配置

iOS 构建器虚拟机在隔离环境中的 Mac mini 主机上运行。每次构建都有自己全新的 macOS 虚拟机。更多信息参见 [iOS 专用资源等级](/eas/json#resourceclass-2)。

- 构建资源：

  > 官方页面在这里用交互组件按当前方案列出 iOS 构建器的 CPU、内存等规格。这些数值会随基础设施调整而变化，无法在此静态复刻。请以 [expo.dev 定价页](https://expo.dev/pricing) 或构建日志中的资源等级为准。

- [npm 缓存](/build-reference/caching#javascript-依赖)
- [CocoaPods 缓存](/build-reference/caching#ios-依赖)
- **~/.npmrc** 中的全局 npm 配置：

  \`\`\`ini ~/.npmrc
  registry=http://npm.caches.eas-build.internal
  \`\`\`

- **~/.yarnrc.yml** 中的全局 Yarn 配置：

  \`\`\`yaml ~/.yarnrc.yml
  unsafeHttpWhitelist:
    - '*'
  npmRegistryServer: 'http://npm.caches.eas-build.internal'
  enableImmutableInstalls: false
  \`\`\`

### iOS 服务器镜像

${iosImageBody}

### 支持的 Xcode 版本

我们的目标是支持所有稳定的 Xcode 发布版本，使你在构建过程中使用它们时可以把应用提交到 App Store Connect。

这通常意味着我们支持最新的稳定 Xcode 版本以及上一个版本（直到 Apple 引入新的[最低 Xcode 版本要求](https://developer.apple.com/news/upcoming-requirements/?id=04292024a)）。
`

fs.writeFileSync('E:/个人/个人项目/expo/src/content/pages/build-reference/infrastructure.md', header.replace(/\r\n/g, '\n'))
console.log('wrote', header.length)
