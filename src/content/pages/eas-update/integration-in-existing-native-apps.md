---
title: 在现有原生应用中使用 EAS Update
description: 了解如何把 EAS Update 集成到现有的原生 Android 和 iOS 应用中，以启用 OTA 更新。
---

# 在现有原生应用中使用 EAS Update

:::note
如果你的项目是**全新的 React Native 应用**——从一开始就主要以 React Native 构建，并且应用的入口点是 React Native——请跳过本指南，直接阅读[开始使用 EAS Update](/eas-update/getting-started)。
:::

本指南说明如何在现有原生应用（有时称为棕地应用）中集成 EAS Update。它假定你使用 Expo SDK 52 或更高版本，以及 React Native 0.76 或更高版本。

更早的 Expo SDK 和 React Native 版本没有对应说明。只有企业客户才能获得与更早版本集成的额外实操支持（[联系我们](https://expo.dev/contact)）。

:::warning
以下说明未必适用于所有项目。把 EAS Update 集成到现有项目的具体做法，很大程度上取决于你的应用本身，因此你可能需要按自己的设置调整这些说明。如果遇到问题，请[在 GitHub 上创建 issue](https://github.com/expo/expo/issues)，或开一个 pull request 为本指南提出改进建议。
:::

**前提条件**

- **带有 React Native 的棕地原生项目。** 你应当已有一个安装了 React Native、并配置为渲染根视图的棕地原生项目。如果还没有，请先遵循 React Native 文档中的 [Integration with Existing Apps](https://reactnative.dev/docs/integration-with-existing-apps) 指南，然后再回到这里。
- **最新的 Expo SDK 以及受支持的 React Native。** 你的应用必须使用[最新的 Expo SDK 版本及其受支持的 React Native 版本](/versions/latest#每个-expo-sdk-版本都依赖一个-react-native-版本)。
- **没有其他更新库。** 从应用中移除任何其他更新库集成，例如 `react-native-code-push`，并确保应用在你支持的平台上，于调试和发布模式下都能成功编译并运行。
- **已安装 Expo 模块。** 项目中必须已安装并配置对 Expo 模块（通过 `expo` 包）的支持。更多信息参见[把 Expo 工具集成到现有原生应用](/brownfield/overview)。
- **metro.config.js 扩展了 expo/metro-config。** 你的 **metro.config.js** [必须扩展 `expo/metro-config`](/guides/customizing-metro#自定义)。
- **babel.config.js 扩展了 babel-preset-expo。** 你的 **babel.config.js** [必须扩展 `babel-preset-expo`](/versions/latest/config/babel)。
- **`npx expo export` 能成功运行。** 如果项目支持 Android，命令 `npx expo export -p android` 必须能成功运行；如果支持 iOS，则 `npx expo export -p ios` 必须能成功运行。

## 安装与基本配置

按照[开始使用 EAS Update](/eas-update/getting-started)指南中的第 1、2、3、4 步操作。

完成后，你将已安装 `eas-cli` 并完成身份验证，已在项目中安装 `expo-updates`，已初始化关联的 EAS 项目，并已向原生项目添加基本配置。

## 退出自动设置

下一步是禁用 `expo-updates` 的默认行为。该默认行为会以支持全新 React Native 项目的方式自动完成设置。

### 在 Android 上禁用自动设置

修改 **android/gradle.properties**，设置用于禁用自动更新初始化的属性，如下例所示：

```diff android/gradle.properties
diff --git a/android/gradle.properties b/android/gradle.properties
--- a/android/gradle.properties
+++ b/android/gradle.properties
@@ -54,3 +54,6 @@ EX_DEV_CLIENT_NETWORK_INSPECTOR=true

 # 使用旧版打包方式压缩生成的 APK 中的原生库。
 expo.useLegacyPackaging=false
+
+ # expo-updates 自定义初始化
+ EX_UPDATES_CUSTOM_INIT=true
```

### 在 iOS 上禁用自动设置

向 CocoaPods 安装传入环境变量，以禁用自动更新初始化。

:::tabs
:::tab npm
```sh
$ EX_UPDATES_CUSTOM_INIT=1 npx pod-install
```
:::
:::tab yarn
```sh
$ EX_UPDATES_CUSTOM_INIT=1 yarn dlx pod-install
```
:::
:::tab pnpm
```sh
$ EX_UPDATES_CUSTOM_INIT=1 pnpm dlx pod-install
```
:::
:::tab bun
```sh
$ EX_UPDATES_CUSTOM_INIT=1 bunx pod-install
```
:::
:::

## 设置 React Native 应用，使用 expo-updates 加载发布 bundle

下一步是把 `expo-updates` 集成到 Android 和 iOS 项目中，使应用在发布构建中把 `expo-updates` 作为应用 JavaScript 的来源。

### 把 expo-updates 与 React Native 打包集成

1. 确保 Metro 配置扩展了 Expo 配置，如下例所示：

   ```js metro.config.js
   // 了解更多 https://docs.expo.dev/guides/customizing-metro
   const { getDefaultConfig } = require('expo/metro-config');

   /** @type {import('expo/metro-config').MetroConfig} */
   const config = getDefaultConfig(__dirname); // eslint-disable-line no-undef

   // 按项目需要直接修改 "config" 来做任何自定义更改

   module.exports = config;
   ```

2. 如果你使用自定义入口点，请务必在那里包含 Expo 初始化。这能确保 Expo 库（包括 `expo-updates`）都得到正确初始化。下面是两个示例：

   ```jsx 第一个自定义入口文件示例
   // Expo 建议使用 registerRootComponent()。
   // 它会向 react-native AppRegistry 注册组件，
   // 并执行所有必需的 Expo 初始化
   // （包括 expo-updates 的设置）

   import App from './App';
   import { registerRootComponent } from 'expo';

   registerRootComponent(App);
   ```

   ```jsx 第二个自定义入口文件示例
   // 如果你需要保留直接使用 AppRegistry 的现有入口点，
   // 则需要在注册应用之前调用 Expo 的初始化，如下所示。
   import App from './App';
   import 'expo/src/Expo.fx';
   import { AppRegistry } from 'react-native';

   function getApp() {
     return <App />;
   }

   AppRegistry.registerComponent('App', () => getApp());
   ```

### 在 Android 上集成 expo-updates

以下说明假定你的应用使用 Kotlin 编写。你需要更新两个文件：**MainApplication.kt** 和 **MainActivity.kt**。

#### MainApplication 的更改

打开 **android/app/src/main/java/com/\<your-app-name\>/MainApplication.kt**，并按以下步骤操作。

1. 你的 application 类应当实现 `ReactApplication`。
2. 覆盖 `reactHost`，使用 `ExpoReactHostFactory.getDefaultReactHost()`。这会设置带有正确 expo-updates 集成的 React host。
3. 在 `onCreate()` 中调用 `loadReactNative()` 和 `ApplicationLifecycleDispatcher.onApplicationCreate()`，以初始化 Expo 模块。

```kotlin android/app/src/main/java/com/<your-app-name>/MainApplication.kt
package com.yourpackagename

import android.app.Application
import android.content.res.Configuration

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactHost
import com.facebook.react.common.ReleaseLevel
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ExpoReactHostFactory

// 第 1 步
class MainApplication : Application(), ReactApplication {

  // 第 2 步
  override val reactHost: ReactHost by lazy {
    ExpoReactHostFactory.getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // 尚不能自动链接的包可以在这里手动添加，例如：
          // add(MyReactNativePackage())
        }
    )
  }

  // 第 3 步
  override fun onCreate() {
    super.onCreate()
    DefaultNewArchitectureEntryPoint.releaseLevel = try {
      ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.uppercase())
    } catch (e: IllegalArgumentException) {
      ReleaseLevel.STABLE
    }
    loadReactNative(this)
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}
```

#### MainActivity 的更改

打开 **android/app/src/main/java/com/\<your-app-name\>/MainActivity.kt**，并按以下步骤操作。

1. 你的 React Native activity 应当继承 `com.facebook.react.ReactActivity`。
2. 覆盖 `getMainComponentName()`，返回你在上面的 JS 入口点中注册的应用名称。
3. 按下所示使用 `ReactActivityDelegateWrapper` 覆盖 `createReactActivityDelegate()`。

```kotlin android/app/src/main/java/com/<your-app-name>/MainActivity.kt
package com.yourpackagename

import android.os.Bundle

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

// 第 1 步
class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }

  // 第 2 步
  override fun getMainComponentName(): String = "App"

  // 第 3 步
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
      this,
      BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
      object : DefaultReactActivityDelegate(
        this,
        mainComponentName,
        fabricEnabled
      ) {})
  }
}
```

### 在 iOS 上集成 expo-updates

以下说明假定你的应用使用 Swift 编写，并有一个或多个带有自定义 UIViewController 的原生屏幕。我们将添加一个用于渲染 React Native 应用的自定义视图控制器。

:::tabs
:::tab SDK 53 及更高版本

#### AppDelegate 的更改

1. 修改 **AppDelegate.swift**，使其继承 `ExpoAppDelegate`。
2. 如果尚未这样做，添加一个公开方法以获取正在运行的 `AppDelegate` 实例，以便自定义视图控制器稍后可以访问它。
3. 添加对 `expo-updates` 的 `AppController` 类单例实例的引用。该类在 iOS 上管理更新系统。
4. 添加一个新类 `CustomReactNativeFactoryDelegate`，它继承 `ExpoReactNativeFactoryDelegate`，并覆盖 `bundleUrl()` 方法，以便在更新系统正在运行时返回更新所用的正确 bundle URL。
5. `didFinishLaunchingWithOptions()` 方法需要执行两个步骤：
   1. 使用上面创建的 `CustomReactNativeFactoryDelegate` 初始化 `ExpoReactNativeFactory`。稍后将用它创建 React Native 根视图。
   2. 调用 `AppController.initializeWithoutStarting()`。这会创建控制器实例，但把更新启动过程的其余部分推迟到需要时再执行。

```swift ios/<your-app-name>/AppDelegate.swift
import Expo
import EXUpdates
import React
import ReactAppDependencyProvider
import UIKit

@UIApplicationMain
// 第 1 步
class AppDelegate: ExpoAppDelegate {
  var launchOptions: [UIApplication.LaunchOptionsKey: Any]?

  // 第 2 步
  public static func shared() -> AppDelegate {
    guard let delegate = UIApplication.shared.delegate as? AppDelegate else {
      fatalError("Could not get app delegate")
    }
    return delegate
  }

  // 第 3 步
  var updatesController: (any InternalAppControllerInterface)?

  // 第 5 步
  private func initializeReactNativeAndUpdates(_ launchOptions: [UIApplication.LaunchOptionsKey: Any]?) {
    // 第 5.1 步
    self.launchOptions = launchOptions
    let delegate = CustomReactNativeFactoryDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeFactoryDelegate = delegate
    reactNativeFactory = factory
    // 第 5.2 步
    AppController.initializeWithoutStarting()
  }

  /**
   应用启动时初始化自定义视图控制器：所有 React Native
   和更新的初始化都在那里处理
   */
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    initializeReactNativeAndUpdates(launchOptions)

    // 创建自定义视图控制器，React Native 视图将在其中创建
    self.window = UIWindow(frame: UIScreen.main.bounds)
    let controller = CustomViewController()
    controller.view.clipsToBounds = true
    self.window?.rootViewController = controller
    window?.makeKeyAndVisible()

    return true
  }

  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    return super.application(app, open: url, options: options) ||
      RCTLinkingManager.application(app, open: url, options: options)
  }
}

// 第 4 步
class CustomReactNativeFactoryDelegate: ExpoReactNativeFactoryDelegate {
  let bundledUrl = Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    // 需要返回 expo-dev-client 的正确 URL。
    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
    if let updatesUrl = AppDelegate.shared().updatesController?.launchAssetUrl() {
      return updatesUrl
    }
    return bundledUrl
  }
}
```

#### 实现自定义视图控制器

1. 视图控制器应当实现更新协议 `AppControllerDelegate`。
2. 视图控制器的初始化应当：
   1. 设置 app delegate 的 updates controller 实例，以便上面的 `bundleURL()` 方法能为更新正确工作。
   2. 把 `AppController` 的委托设置为该视图控制器实例。
   3. 启动 `AppController`。
3. 最后，视图控制器必须实现 `AppControllerDelegate` 协议中的那个方法：`appController(_ appController: AppControllerInterface, didStartWithSuccess success: Bool)`。更新系统完全初始化、并且最新更新（或嵌入式 bundle）已准备好渲染时，会调用此方法。
   1. 使用 app delegate 创建的 `ExpoReactNativeFactory` 创建 React Native 根视图。传入的应用名称必须与你在上面的 JS 入口点中注册的应用名称匹配。
   2. 把此根视图添加到视图控制器。

```swift ios/<your-app-name>/CustomViewController.swift
import UIKit
import EXUpdates
import ExpoModulesCore


/**
 处理 React Native 和 expo-updates 初始化的自定义视图控制器
 */
// 第 1 步
public class CustomViewController: UIViewController, AppControllerDelegate {
  let appDelegate = AppDelegate.shared()

  // 第 2 步
  public convenience init() {
    self.init(nibName: nil, bundle: nil)
    self.view.backgroundColor = .clear
    // 第 2.1 步
    appDelegate.updatesController = AppController.sharedInstance
    // 第 2.2 步
    AppController.sharedInstance.delegate = self
    // 第 2.3 步
    AppController.sharedInstance.start()
  }

  required public override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
    super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
  }

  @available(*, unavailable)
  required public init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  // 第 3 步
  public func appController(
    _ appController: AppControllerInterface,
    didStartWithSuccess success: Bool
  ) {
    createView()
  }

  private func createView() {
    // 第 3.1 步
    guard let rootViewFactory: RCTRootViewFactory = appDelegate.reactNativeFactory?.rootViewFactory else {
      fatalError("rootViewFactory has not been initialized")
    }
    let rootView = rootViewFactory.view(
      withModuleName: "main",
      initialProperties: [:],
      launchOptions: appDelegate.launchOptions
    )
    // 第 3.2 步
    let controller = self
    controller.view.clipsToBounds = true
    controller.view.addSubview(rootView)
    rootView.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      rootView.topAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.topAnchor),
      rootView.bottomAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.bottomAnchor),
      rootView.leadingAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.leadingAnchor),
      rootView.trailingAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.trailingAnchor)
    ])
  }
}
```

:::
:::tab SDK 52

#### AppDelegate 的更改

1. 修改 **AppDelegate.swift**，使其继承 `EXAppDelegateWrapper`。
2. 如果尚未这样做，添加一个公开方法以获取正在运行的 `AppDelegate` 实例，以便自定义视图控制器稍后可以访问它。
3. 添加对 `expo-updates` 的 `AppController` 类单例实例的引用。该类在 iOS 上管理更新系统。
4. 覆盖 `bundleUrl()` 方法，以便在更新系统正在运行时返回更新所用的正确 bundle URL。
5. `didFinishLaunchingWithOptions()` 方法需要执行两个步骤：
   1. 初始化稍后用于创建 React Native 根视图的根视图工厂。
   2. 调用 `AppController.initializeWithoutStarting()`。这会创建控制器实例，但把更新启动过程的其余部分推迟到需要时再执行。

```swift ios/<your-app-name>/AppDelegate.swift
import ExpoModulesCore
import EXUpdates
import React
import UIKit

@UIApplicationMain
// 第 1 步
class AppDelegate: EXAppDelegateWrapper {
  let bundledUrl = Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  var launchOptions: [UIApplication.LaunchOptionsKey: Any]?

  // 第 2 步
  public static func shared() -> AppDelegate {
    guard let delegate = UIApplication.shared.delegate as? AppDelegate else {
      fatalError("Could not get app delegate")
    }
    return delegate
  }

  // 第 3 步
  var updatesController: (any InternalAppControllerInterface)?

  // 第 4 步
  override func bundleURL() -> URL? {
    if let updatesUrl = updatesController?.launchAssetUrl() {
      return updatesUrl
    }
    return bundledUrl
  }

  // 第 5 步
  private func initializeReactNativeAndUpdates(_ launchOptions: [UIApplication.LaunchOptionsKey: Any]?) {
    // 第 5.1 步
    self.launchOptions = launchOptions
    self.moduleName = "App"
    self.initialProps = [:]
    self.rootViewFactory = createRCTRootViewFactory()
    // 第 5.2 步
    AppController.initializeWithoutStarting()
  }

  /**
   * 应用启动时初始化自定义视图控制器；所有 React Native
   * 和更新的初始化都在那里处理
   */
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    initializeReactNativeAndUpdates(launchOptions)

    // 创建自定义视图控制器，React Native 视图将在其中创建
    self.window = UIWindow(frame: UIScreen.main.bounds)
    let controller = CustomViewController()
    controller.view.clipsToBounds = true
    self.window.rootViewController = controller
    window.makeKeyAndVisible()
    return true
  }
}
```

#### 实现自定义视图控制器

1. 视图控制器应当实现更新协议 `AppControllerDelegate`。
2. 视图控制器的初始化应当：
   1. 设置 app delegate 的 updates controller 实例，以便上面的 `bundleURL()` 方法能为更新正确工作。
   2. 把 `AppController` 的委托设置为该视图控制器实例。
   3. 启动 `AppController`。
3. 最后，视图控制器必须实现 `AppControllerDelegate` 协议中的那个方法：`appController(_ appController: AppControllerInterface, didStartWithSuccess success: Bool)`。更新系统完全初始化、并且最新更新（或嵌入式 bundle）已准备好渲染时，会调用此方法。
   1. 使用 app delegate 创建的根视图工厂创建 React Native 根视图。传入的应用名称必须与你在上面的 JS 入口点中注册的应用名称匹配。
   2. 把此根视图添加到视图控制器。

```swift ios/<your-app-name>/CustomViewController.swift
import UIKit
import EXUpdates
import ExpoModulesCore

// 第 1 步
public class CustomViewController: UIViewController, AppControllerDelegate {
  let appDelegate = AppDelegate.shared()

  // 第 2 步
  public convenience init() {
    self.init(nibName: nil, bundle: nil)
    self.view.backgroundColor = .clear
    // 第 2.1 步
    appDelegate.updatesController = AppController.sharedInstance
    // 第 2.2 步
    AppController.sharedInstance.delegate = self
    // 第 2.3 步
    AppController.sharedInstance.start()
  }

  required public override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
    super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
  }

  @available(*, unavailable)
  required public init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  // 第 3 步
  public func appController(
    _ appController: AppControllerInterface,
    didStartWithSuccess success: Bool
  ) {
    createView()
  }

  private func createView() {
    // 第 3.1 步
    guard let rootViewFactory: RCTRootViewFactory = appDelegate.reactNativeFactory?.rootViewFactory else {
      fatalError("rootViewFactory has not been initialized")
    }
    let rootView = rootViewFactory.view(
      withModuleName: appDelegate.moduleName,
      initialProperties: appDelegate.initialProps,
      launchOptions: appDelegate.launchOptions
    )
    // 第 3.2 步
    let controller = self
    controller.view.clipsToBounds = true
    controller.view.addSubview(rootView)
    rootView.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      rootView.topAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.topAnchor),
      rootView.bottomAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.bottomAnchor),
      rootView.leadingAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.leadingAnchor),
      rootView.trailingAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.trailingAnchor)
    ])
  }
}
```

:::
:::

## 常见问题

<details>
<summary>把这加到我的应用里需要多久？</summary>

假定你使用的是 Expo SDK 所支持的最新 React Native 版本，并且你熟悉原生项目中的 React Native 集成，那么集成 EAS Update 所需的时间，很可能与集成 CodePush 或 Sentry 之类的工具相近。

最重要的因素是应用所使用的 React Native 版本。如果应用使用的版本早于 Expo SDK 所支持的最新版本（如本指南开头所引用），那么你需要先升级到该版本，所需时间很大程度上取决于应用的规模与复杂度，以及负责这项工作的团队的技能与经验。

</details>

<details>
<summary>我正在从 CodePush 迁移，还需要了解什么？</summary>

更多内容请参见[从 CodePush 迁移](/eas-update/codepush)指南。

</details>
