---
title: 了解应用体积
description: 了解如何判断应用分发给用户时的实际体积，以及如何洞察并优化应用体积。
---

# 了解应用体积

开发者常关心的一个问题是，应用在应用商店中会占用多少空间。本指南将帮助你：

- 理解不同构建产物各自的用途
- 弄清应用分发给用户时的实际体积
- 洞察应用体积并加以优化

## 为什么我的应用这么大？

**其实多半并没有那么大！** 查看应用发布构建的产物时，不熟悉原生 Android 和 iOS 开发的开发者常常会对文件体积感到惊讶——它通常比他们预期从应用商店下载的应用大得多。**这并不是将在应用商店分发的应用的实际体积！** 人们谈论应用体积时，指的是他们会下载到设备上的体积，而不是上传到应用商店、或在开发和测试中分享的体积。

有多种构建产物服务于不同目的，它们几乎都比用户从商店下载你的应用时看到的更大。这是因为这些构建并没有像从商店下载时那样针对特定设备优化，而是通常包含应用在多种设备上运行所需的全部代码和资源。

## Android 应用

你会接触到两种 Android 构建产物：APK 和 AAB。

### `.apk`（Android Package）

在 React Native 项目中用 Gradle 构建 APK 时，默认行为是创建通用二进制文件，其中包含应用所支持的所有不同设备类型的全部资源。例如，它包含每种屏幕尺寸、每种 CPU 架构和每种语言的资源，即使单台设备每种只需要一份。这意味着你可以把这一个文件分享给任何人，直接安装到他们的设备上，也许用 [Orbit](https://expo.dev/orbit) 或直接用 `adb`，并且能够工作。

当然，如果你运营的是一个服务数百万用户的极其流行的应用商店，你不会想把同一个 50 MB 的文件发给每一个用户，尤其是他们只会用到 APK 中一小部分资源时。这就是 Google Play Store 和其他应用商店提供 “App Bundles”（Android）功能的原因：你可以上传一份二进制文件，然后商店根据用户设备的需要为每个用户生成定制的二进制文件。

### `.aab`（Android App Bundle）

在 Android 上，提交到 Play Store 的所有新应用都必须构建为 [Android App Bundle（.aab）](https://developer.android.com/platform/technology/app-bundle)。把二进制文件提交到各自的商店之后，你就能看到各种设备类型的下载体积。

### 确定 Android 应用的下载体积和安装体积

通常，应用开发者关心的是 Play Store 上的“下载体积”（用户进入商店列表页准备下载应用时看到的体积）。这将是 Google Play 从你的 AAB 生成的、针对用户设备定制的 APK 的体积。

真正准确看到最终会发给用户的应用体积的唯一方法，是把应用上传到商店并在真机上下载。Google Play 也会在开发者仪表盘上提供预期下载体积的可靠估计。你可以在 [Google Play 开发者控制台](https://play.google.com/console/)的 **Android vitals** 下的 **App size** 页面找到它。更多信息参见[优化应用体积并保持在 Google Play 应用体积限制内](https://support.google.com/googleplay/android-developer/answer/9859372?hl=en)。

<details>
<summary>升级到 React Native 0.73 及更高版本后，为什么我的 APK 体积增大了？</summary>

React Native 0.73 把 Android 的 `minSdkVersion` 提升到了 `23`。这带来的副作用是把 [`extractNativeLibs`](https://developer.android.com/guide/topics/manifest/application-element#extractNativeLibs) 的默认值改为 `false`。

> 如果设为 `false`，原生库会以未压缩形式存储在 APK 中。虽然 APK 可能更大，但应用加载更快，因为库在运行时直接从 APK 加载。

下表显示，虽然 APK 体积增大了，这可能略微影响使用[内部分发](/build/internal-distribution)的测试人员的下载时间，但 Google Play Store 上的体积保持不变。

| SDK | APK（debug 变体） | APK（release 变体） | AAB | Google Play |
| --- | --- | --- | --- | --- |
| 49 | 66 MB | 27.6 MB | 28.2 MB | 11.7 MB |
| 50 | 168.1 MB | 62.1 MB | 27.4 MB | 11.7 MB |

如果想恢复先前的行为，可以在 **gradle.properties** 中把 `useLegacyPackaging` 设为 `true`，或使用 [`expo-build-properties`](/versions/latest/sdk/build-properties)。

</details>

## iOS 应用

一个最小的 React Native 应用（使用空白模板创建）在 App Store 上的下载体积[略低于 4 MB](https://x.com/aleqsio/status/1844045829973344457)。

你会接触到两种 iOS 构建产物：APP 和 IPA。

### `.app`（iOS 应用包）

这是应用的实际应用包。当你把应用的构建下载并安装到 iOS 模拟器时，下载的就是 `.app` 包。它们可以针对特定架构，也可以是通用二进制文件。`.app` 的体积并不一定能告诉你应用在商店上的下载体积会是多少。你不能把 `.app` 文件直接安装到 iOS 真机上。

### `.ipa`（iOS App Store 包）

IPA 文件是包含 `.app` 包以及在 iOS 设备上运行应用所需的其他资源的 [ZIP](https://en.wikipedia.org/wiki/ZIP) 文件。它们用于多种分发类型，包括 App Store、Ad Hoc、Enterprise 和 TestFlight。

它们包含安全和代码签名信息，例如描述文件和 entitlements。App Store 会处理 IPA 文件并把它拆成面向每种设备类型的更小二进制文件，因此 IPA 的体积也不代表应用的下载体积。

### 确定 iOS 应用的下载体积和安装体积

通常，应用开发者关心的是 App Store 上的“下载体积”（用户进入商店列表页准备下载应用时看到的体积）。这将是商店从你的通用 IPA 生成的拆分 IPA 的体积。

真正准确看到最终会发给用户的应用体积的唯一方法，是把应用上传到 App Store 并在真机上下载。你可以从 TestFlight 得到准确估计：在 [App Store Connect](https://appstoreconnect.apple.com/)中进入 TestFlight，点击构建号选择你的构建，然后切换到 **Build Metadata** 标签页并点击 **App File Sizes**。你会看到一份随设备类型而变化的估计下载体积和安装体积列表。实际安装体积也可能因设备的 iOS 版本而略有不同。

## 优化应用体积

随着你为应用添加功能，你会加入代码、库和资源，这可能增大体积。如果应用体积对你和用户很重要，你可能希望定期检查体积并优化它。下面各节帮助你了解可以如何优化应用的若干方面。

### 静态资源

应用体积膨胀最常见的来源之一是资源，例如字体、图标、图片、视频和声音。它们可以来自你直接导入代码的资源，也可以来自 JavaScript 和原生库。只查看应用的资源目录，无法得到完整图景。

先检查构建产物，确定其中包含哪些资源。

- 对于 Android，可以用 [Android APK Analyzer](https://developer.android.com/studio/debug/apk-analyzer) 或 [apktool](https://apktool.org/)检查应用内容
- 对于 iOS，把 IPA 文件从 `app.ipa` 重命名为 `app.zip` 并解压以检查内容，用 macOS 工具 `assetutil` 检查 **Assets.car**。

### React Native 图片格式支持（Android）

Android 模板默认会为 React Native 的 `<Image>` 组件启用 GIF 和 WebP 解码器。如果你的应用使用 [`expo-image`](/versions/latest/sdk/image)（它在 Android 上使用 Glide），或者不用 React Native 的 `<Image>` 渲染这些格式，可以用 [`expo-build-properties`](/versions/latest/sdk/build-properties)禁用它们以减小应用体积：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "gifEnabled": false,
            "webpEnabled": false
          }
        }
      ]
    ]
  }
}
```

上述选项对应 **android/gradle.properties** 中的 Gradle 属性 `expo.gif.enabled` 和 `expo.webp.enabled`。动画 WebP 解码器（`expo.webp.animated`）默认禁用，因为 iOS 上 React Native 的 `<Image>` 不支持动画 WebP。如果确实需要在 Android 上使用动画 WebP，请在上面的配置插件中同时设置 `"webpEnabled": true` 和 `"webpAnimated": true`。

### JavaScript 包体积

要分析 JavaScript 包，请[使用 Expo Atlas](/guides/analyzing-bundles)。你可能会发现，一些你以为很小的库实际上对包体积影响很大，或者你停止使用某个库后忘了移除它，等等。

### 特定平台的优化

独立于 React Native 和 Expo，你可以用以下工具为 Android 和 iOS 优化应用：

- [Android Developers：减小应用体积](https://developer.android.com/topic/performance/reduce-apk-size)：直接来自 Google 的、关于减小 Android 应用体积的建议。
- [Apple Developer：减小应用体积](https://developer.apple.com/documentation/xcode/reducing-your-app-s-size)：直接来自 Apple 的、关于减小 iOS 应用体积的建议。
