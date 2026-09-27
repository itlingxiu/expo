---
title: 如何使用隔离方式把 Expo 添加到原生应用
description: 一份指南，说明如何使用隔离方式把 Expo 和 React Native 作为原生库添加，并集成到现有（棕地）原生应用中。
---

# 如何使用隔离方式把 Expo 添加到原生应用

在隔离方式中，React Native 代码与原生项目分开开发和维护。你把它打包为原生库（Android 使用 AAR，iOS 使用 XCFramework），然后像任何其他依赖一样集成到原生应用中。

当你希望尽量减少 React Native 对现有原生构建流程的影响，或者原生和 React Native 开发由不同团队负责时，这种方式很合适。使用这种方式时，原生开发者不需要 Node.js、Yarn 或任何 React Native 构建工具，他们只需消费预先构建的产物。

:::note
如果希望把 React Native 直接集成到原生项目中，见[集成方式指南](/brownfield/integrated-approach)。
:::

**前置条件**

- **Node.js（LTS）**：安装 [Node.js](https://nodejs.org/en/) 以运行 JavaScript 代码和 Expo CLI。
- **Yarn**：安装 [Yarn](https://yarnpkg.com/) 作为 JavaScript 依赖的包管理器。

从[设置环境指南](/get-started/set-up-your-environment#如何开发)了解更多。

## 设置 Expo 项目

### 创建新的 Expo 项目

运行以下命令创建名为 **my-project** 的新目录，其中包含你的新 Expo 项目。项目可以任意命名，本指南为保持一致使用 **my-project**。

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

**my-project** 不必位于现有原生应用内部，可以在单独的仓库或 monorepo 中创建。新项目包含一个示例 TypeScript 应用，帮助你开始。

### 安装 expo-brownfield

进入新的 Expo 项目并安装 `expo-brownfield` 库。它提供把 React Native 代码构建为原生库并集成到现有原生应用中的工具。

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

### 调整配置插件（可选）

`expo-brownfield` 应自动在 **app.json** 的 `plugins` 数组中添加一项，使用默认配置，这对大多数项目已经足够。

```json app.json
{
  "expo": {
    "plugins": ["expo-brownfield"]
  }
}
```

默认值来自应用配置（例如，目标名称基于应用的 scheme 或 slug）。也可以传入选项以自定义目标名称、bundle identifier 和发布配置。

<details>
<summary>自定义 expo-brownfield 配置</summary>

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-brownfield",
        {
          "ios": {
            "targetName": "MyBrownfield",
            "bundleIdentifier": "com.example.mybrownfield"
          },
          "android": {
            "libraryName": "mybrownfield",
            "group": "com.example",
            "package": "com.example.mybrownfield",
            "version": "1.0.0"
          }
        }
      ]
    ]
  }
}
```

</details>

有关所有可用选项的细节，见 [`expo-brownfield` API 参考](/versions/latest/sdk/brownfield)。

## 把 Expo 项目导出为原生库

设置好 Expo 项目后，使用 `expo-brownfield` CLI 把 React Native 代码构建为 Android 的 AAR 和 iOS 的 XCFramework。

:::tabs
:::tab Android

从 Expo 项目目录运行：

```sh
npx expo-brownfield build:android
```

```sh
# yarn
yarn dlx expo-brownfield build:android
```

```sh
# pnpm
pnpm dlx expo-brownfield build:android
```

```sh
# bun
bunx expo-brownfield build:android
```

这会构建 AAR 并把它发布到 Maven 仓库。默认情况下，它发布到本地 Maven 仓库（`~/.m2`），但也可以配置为发布到远程仓库。生成的产物名称由配置插件设置决定，本例中为 `com.username.myproject:brownfield:1.0.0`。

有关构建选项的更多细节（例如只构建 debug 或 release、指定自定义输出目录等），见 [API 参考](/versions/latest/sdk/brownfield)。

:::
:::tab iOS

从 Expo 项目目录运行：

```sh
npx expo-brownfield build:ios
```

```sh
# yarn
yarn dlx expo-brownfield build:ios
```

```sh
# pnpm
pnpm dlx expo-brownfield build:ios
```

```sh
# bun
bunx expo-brownfield build:ios
```

这会构建 XCFramework 产物：为设备和模拟器架构编译框架目标，把它们打包成 XCFramework，并复制 Hermes 引擎框架。

构建过程完成后，输出放在 **./artifacts** 目录中，包含：

- **\{TargetName\}.xcframework** - 作为原生库的 Expo 项目
- **hermesvm.xcframework** - Hermes JavaScript 引擎

有关构建选项的更多细节（例如只构建 debug 或 release、指定自定义输出目录等），见 [`expo-brownfield` API 参考](/versions/latest/sdk/brownfield)。

### 以 Swift Package 交付产物

传入 `--package [name]` 标志，把构建输出打包为自包含的 Swift Package，而不是单独的 **.xcframework** 目录。然后可以在 Xcode 中把它作为本地依赖添加到宿主应用，而不是手动把框架拖进项目。

```sh
npx expo-brownfield build:ios --release --package MyAppPackage
```

```sh
# yarn
yarn dlx expo-brownfield build:ios --release --package MyAppPackage
```

```sh
# pnpm
pnpm dlx expo-brownfield build:ios --release --package MyAppPackage
```

```sh
# bun
bunx expo-brownfield build:ios --release --package MyAppPackage
```

该标志接受可选名称。如果省略，包默认为 **\{TargetName\}Artifacts**。生成的目录是具有以下布局的完整 Swift Package：

```text
artifacts/MyAppPackage/Package.swift
artifacts/MyAppPackage/xcframeworks/MyAppPackage.xcframework
artifacts/MyAppPackage/xcframeworks/hermesvm.xcframework
artifacts/MyAppPackage/xcframeworks/React.xcframework
artifacts/MyAppPackage/xcframeworks/ReactNativeDependencies.xcframework
```

:::
:::

<details>
<summary>调试原生目标</summary>

如果需要调试 Expo 项目目标的原生代码，可以运行 `npx expo prebuild`，在 **android** 和 **ios** 目录中生成带有棕地库目标的原生项目。

:::tabs
:::tab npm
```sh
npx expo prebuild
```
:::
:::tab yarn
```sh
yarn expo prebuild
```
:::
:::tab pnpm
```sh
pnpm expo prebuild
```
:::
:::tab bun
```sh
bun expo prebuild
```
:::
:::

上述命令会生成以下内容：

- **Android**：一个单独的库模块，包含 `ReactNativeHostManager`、`BrownfieldActivity`、`ReactNativeFragment`、`ReactNativeViewFactory` 和 `BrownfieldMessaging`。
- **iOS**：一个单独的 Xcode 框架目标，包含 `ReactNativeHostManager`、`ReactNativeViewController`、`ReactNativeView`（SwiftUI）、`BrownfieldMessaging` 和 `ReactNativeDelegate`。

</details>

## 集成到原生应用

产物构建完成后，现在可以把它们集成到现有原生应用中。确切步骤取决于项目结构和构建系统，但一般过程是把预构建产物添加为依赖并初始化 React Native 宿主。

### Android

#### 添加 Maven 依赖

首先把依赖添加到应用的 **build.gradle.kts**。group、产物名称和版本应与配置插件设置匹配：

```kotlin app/build.gradle.kts
dependencies {
  implementation("com.username.myproject:brownfield:1.0.0")
}
```

如果库发布到了本地 Maven，请确保在仓库配置中添加 `mavenLocal()`：

```kotlin settings.gradle.kts
dependencyResolutionManagement {
  repositories {
    google()
    mavenCentral()
    mavenLocal()
  }
}
```

#### 显示 React Native 屏幕

创建一个扩展 `BrownfieldActivity` 的 activity，并使用 `showReactNativeFragment()` 扩展：

```kotlin ExpoActivity.kt
import android.os.Bundle
import com.example.brownfield.BrownfieldActivity
import com.example.brownfield.showReactNativeFragment

class ExpoActivity : BrownfieldActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    showReactNativeFragment()
  }
}
```

使用非 ActionBar 主题把该 activity 添加到 **AndroidManifest.xml**：

```xml AndroidManifest.xml
<activity
  android:name=".ExpoActivity"
  android:theme="@style/Theme.AppCompat.Light.NoActionBar"
  android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
/>
```

然后从应用中的任何地方启动它：

```kotlin
startActivity(Intent(this, ExpoActivity::class.java))
```

`BrownfieldActivity` 扩展 `AppCompatActivity`，并负责把配置更改转发给 Expo 模块。`showReactNativeFragment()` 扩展也会自动设置原生返回按钮处理。

### iOS

#### 把产物添加到项目

集成步骤取决于你构建的是 XCFramework 还是 Swift Package。

**XCFramework（默认）**

把两个 XCFramework 文件（\{TargetName\}**.xcframework** 和 **hermesvm.xcframework**）拖到 Xcode 项目导航器中。在出现的对话框中：

- 勾选 **Copy items if needed**
- 把它们添加到应用目标

然后，在目标的 **General** 标签页的 **Frameworks, Libraries, and Embedded Content** 下，确保两个框架都设置为 **Embed & Sign**。

**Swift Package**

当 `build:ios` 生成 Swift Package（例如 **./artifacts/MyAppPackage-release**）时，在 Xcode 中把它作为本地依赖添加到宿主应用，并选择该包目录。Xcode 会通过聚合库产品自动链接打包的 **.xcframework** 文件。

要同时支持 `--debug` 和 `--release`，让宿主应用在每种构建配置下指向匹配的包。

#### 初始化 React Native

在应用生命周期的早期调用 `ReactNativeHostManager.shared.initialize()`。一个合适的位置是 `AppDelegate`：

```swift AppDelegate.swift
import UIKit
import MyAppBrownfield // 替换为你的目标名称

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    ReactNativeHostManager.shared.initialize()
    return true
  }
}
```

#### 展示 React Native 视图

**UIKit**

```swift ViewController.swift
import UIKit
import MyAppBrownfield

class ViewController: UIViewController {
  @IBAction func openReactNative(_ sender: Any) {
    let rnViewController = ReactNativeViewController(moduleName: "main")
    navigationController?.pushViewController(rnViewController, animated: true)
  }
}
```

`ReactNativeViewController` 也接受可选的 `initialProps` 和 `launchOptions` 参数：

```swift
let rnViewController = ReactNativeViewController(
  moduleName: "main",
  initialProps: ["userId": "123"],
  launchOptions: [:]
)
```

**SwiftUI**

```swift ContentView.swift
import SwiftUI
import MyAppBrownfield

struct ContentView: View {
  @State private var showReactNative = false

  var body: some View {
    Button("Open React Native") {
      showReactNative = true
    }
    .fullScreenCover(isPresented: $showReactNative) {
      ReactNativeView(moduleName: "main")
    }
  }
}
```

## 测试集成

你已完成把 React Native 与应用集成的所有基本步骤。现在是时候测试它了。确切过程取决于你运行的是 debug 还是 release 构建。

### 开发（debug 构建）

现在在 React Native 目录中运行以下命令以启动 [Metro 打包器](https://metrobundler.dev/)

:::tabs
:::tab npm
```sh
npx expo start
```
:::
:::tab yarn
```sh
yarn expo start
```
:::
:::tab pnpm
```sh
pnpm expo start
```
:::
:::tab bun
```sh
bun expo start
```
:::
:::

然后从 Android Studio 或 Xcode 构建并运行原生应用。导航到 React Native 屏幕时，它会从 Metro 开发服务器加载，并支持热重载。

### 生产（release 构建）

在 release 构建中，JavaScript bundle 嵌入在产物（AAR 或 XCFramework）中，因此不需要 Metro 服务器。以 Release 配置构建原生应用，并验证 React Native 屏幕正确加载。

## 下一步

- **[生命周期监听器](/brownfield/lifecycle-listeners)**：为与 Expo 模块的更深集成配置应用生命周期监听器。
- **[expo-brownfield API 参考](/versions/latest/sdk/brownfield)**：探索用于通信、导航等的完整 JavaScript API。
