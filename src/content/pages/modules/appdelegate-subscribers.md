---
title: iOS AppDelegate 订阅者
description: 了解如何使用 Expo Modules API 订阅与应用相关的 iOS 系统事件，例如入站链接和通知。
---

# iOS AppDelegate 订阅者

要响应与应用相关的某些 iOS 系统事件（例如入站链接和通知），必须在 `AppDelegate` 中处理对应的方法。

React Native 模块 API 没有提供任何接入这些方法的机制，因此 React Native 库的安装说明通常包含把代码复制到 `AppDelegate` 文件中的步骤。为了简化并自动化安装与维护，Expo Modules API 提供了一种机制，让你的库可以订阅对 `AppDelegate` 函数的调用。为此，应用的 `AppDelegate` 必须继承自 `ExpoAppDelegate`，这也是使用 Expo Modules 的要求。

`ExpoAppDelegate` 实现了 [`UIApplicationDelegate`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate) 协议中的大部分函数，并把它们的调用转发给所有订阅者。

## 开始使用

首先，你需要已经创建了一个 Expo 模块，或者已在使用 React Native 模块 API 的库中集成了 Expo Modules API。参见[什么是 Expo Modules API](/modules/overview#什么是-expo-modules-api)。

创建一个继承自 `ExpoModulesCore` 中 `ExpoAppDelegateSubscriber` 的新的 public Swift 类，并把类名添加到[模块配置](/modules/module-config)里 `apple.appDelegateSubscribers` 数组中。运行 `pod install` 后，订阅者会生成在应用项目内的 **ExpoModulesProvider.swift** 文件中。

现在，你可以通过向订阅者类添加委托函数来订阅事件。可订阅函数的完整列表，请查看 [`ExpoAppDelegate.swift`](https://github.com/expo/expo/blob/main/packages/expo/ios/AppDelegates/ExpoAppDelegate.swift) 中被重写的函数。提供后可能产生副作用的 App Delegate 函数尚不支持（例如 [`application(_:viewControllerWithRestorationIdentifierPath:coder:)`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623062-application)）。

> 不支持 Objective-C 类。

## 返回值

需要返回值的委托函数还有一些额外逻辑，用来调和多个订阅者的响应，并尽量同时满足它们。下面是两个典型的边界情况：

### `application(_:didFinishLaunchingWithOptions:) -> Bool`

根据 [Apple 文档](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622921-application)，如果应用无法处理 URL 资源或继续用户活动，应返回 `false`，否则应返回 `true`。如果应用是因远程通知而启动的，返回值会被忽略。
在这种情况下，只要至少有一个订阅者返回 `true`，`ExpoAppDelegate` 也会返回 `true`。

### `application(_:didReceiveRemoteNotification:fetchCompletionHandler:)`

此方法告诉 app delegate 远程通知已到达，并让应用有机会获取新数据。它接收一个完成块，在获取操作完成时执行。调用该块时应传入最能描述获取请求结果的获取结果值。可能的值是：`UIBackgroundFetchResult.newData`、`UIBackgroundFetchResult.noData` 或 `UIBackgroundFetchResult.failed`。
在这种场景中，`ExpoAppDelegate` 会向每个订阅者传递一个新的完成块，等待全部完成并收集结果，然后再调用原始完成块。最终结果取决于从订阅者收集到的结果，顺序如下：

- 如果至少有一个订阅者以 `failed` 结果调用了完成块，委托同样返回 `failed`。
- 如果至少有一个 `newData` 结果，委托返回 `newData`。
- 否则返回 `noData`。

> 要了解其他函数如何处理订阅者的结果，建议直接阅读代码：[`ExpoAppDelegate.swift`](https://github.com/expo/expo/blob/main/packages/expo/ios/AppDelegates/ExpoAppDelegate.swift)。

## 示例

```swift AppLifecycleDelegate.swift
import ExpoModulesCore

public class AppLifecycleDelegate: ExpoAppDelegateSubscriber {
  public func applicationDidBecomeActive(_ application: UIApplication) {
    // 应用已变为活跃状态。
  }

  public func applicationWillResignActive(_ application: UIApplication) {
    // 应用即将变为非活跃状态。
  }

  public func applicationDidEnterBackground(_ application: UIApplication) {
    // 应用现在处于后台。
  }

  public func applicationWillEnterForeground(_ application: UIApplication) {
    // 应用即将进入前台。
  }

  public func applicationWillTerminate(_ application: UIApplication) {
    // 应用即将终止。
  }

  public func applicationDidReceiveMemoryWarning(_ application: UIApplication) {
    // 应用收到了内存警告。
  }
}
```

```json expo-module.config.json
{
  "apple": {
    "appDelegateSubscribers": ["AppLifecycleDelegate"]
  }
}
```
