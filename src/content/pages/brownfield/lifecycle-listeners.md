---
title: 配置生命周期监听器
description: 了解 Expo Modules API 接入应用生命周期的机制。
---

# 配置生命周期监听器

一些 Expo 库需要通过实现 `Activity` / `Application` 或 `AppDelegate` 生命周期回调，来处理 deep link、推送通知和配置变更等系统事件。

Expo Modules API 提供了一种简便方式来管理这类回调：

- **Android**：`ApplicationLifecycleDispatcher` 和 `ReactActivityHandler` 把 `Application` 与 `Activity` 生命周期事件转发给已注册的监听器。模块可以通过 `Package` 类提供 `ReactActivityLifecycleListener` 和 `ApplicationLifecycleListener` 实现来注册回调。
- **iOS**：`ExpoAppDelegate` 把 `AppDelegate` 调用转发给已注册的订阅者。模块可以提供 `ExpoAppDelegateSubscriber` 实现来注册回调。

使用这些机制后，模块可以注册行为，而不需要你反复编辑原生入口。

## 配置原生项目

### Android

要在 Android 上集成 `Application` 生命周期监听器，把 `Application` 类中的 `onCreate()` 和 `onConfigurationChanged()` 调用转发给 `ApplicationLifecycleDispatcher`：

```diff MainApplication.kt
class MainApplication : Application() {
  override fun onCreate() {
    super.onCreate()
    ...
+    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ...
+    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}
```

### iOS

要在 iOS 上集成 `AppDelegate` 订阅者，在现有 `AppDelegate` 实现中把相关调用转发给 `ExpoAppDelegateSubscriberManager`，这样订阅者才能响应它们：

```diff AppDelegate.swift
+import Expo
+
 public class AppDelegate: UIApplicationDelegate {

   open func application(
     _ application: UIApplication,
     willFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
   ) -> Bool {
-
+    return ExpoAppDelegateSubscriberManager.application(application, willFinishLaunchingWithOptions: launchOptions)
   }

   open func application(
     _ application: UIApplication,
     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
   ) -> Bool {
-
+    return ExpoAppDelegateSubscriberManager.application(application, didFinishLaunchingWithOptions: launchOptions)
   }

   ...
```

或者，如果 `AppDelegate` 尚未继承其他类，可以通过继承 `ExpoAppDelegate` 简化设置，它会自动处理转发：

```diff AppDelegate.swift
+import Expo
+
 @main
-public class AppDelegate: NSObject, UIApplicationDelegate {
+public class AppDelegate: ExpoAppDelegate {
```

:::note
并非所有可能产生显著副作用的 `UIApplicationDelegate` 方法都受支持。如果你需要依赖某个特定委托方法，请查看 Expo 源码（**ExpoAppDelegate.swift**）中被转发方法的完整列表。
:::

## 测试集成

要测试回调是否正常工作，安装一个依赖它们的模块。安装 `expo-linking`，它使用生命周期监听器处理 deep link：

:::tabs
:::tab npm
```sh
npx expo install expo-linking
```
:::
:::tab yarn
```sh
yarn expo install expo-linking
```
:::
:::tab pnpm
```sh
pnpm expo install expo-linking
```
:::
:::tab bun
```sh
bun expo install expo-linking
```
:::
:::

在代码中为 deep link 添加监听器，并在打开 deep link 时观察控制台：

```jsx
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

useEffect(() => {
  const listener = Linking.addEventListener('url', ({ url }) => {
    console.log('Received deep link:', url);
  });

  return listener.remove;
}, []);
```

运行下面的命令，向应用打开一个 deep link：

:::tabs
:::tab npm
```sh
# 如果在 app.json 中定义了 android.package 或 ios.bundleIdentifier
npx uri-scheme open com.example.app://somepath/details --android

# 如果在 app.json 中定义了 scheme
npx uri-scheme open myapp://somepath/details --ios
```
:::
:::tab yarn
```sh
# 如果在 app.json 中定义了 android.package 或 ios.bundleIdentifier
yarn dlx uri-scheme open com.example.app://somepath/details --android

# 如果在 app.json 中定义了 scheme
yarn dlx uri-scheme open myapp://somepath/details --ios
```
:::
:::tab pnpm
```sh
# 如果在 app.json 中定义了 android.package 或 ios.bundleIdentifier
pnpm dlx uri-scheme open com.example.app://somepath/details --android

# 如果在 app.json 中定义了 scheme
pnpm dlx uri-scheme open myapp://somepath/details --ios
```
:::
:::tab bun
```sh
# 如果在 app.json 中定义了 android.package 或 ios.bundleIdentifier
bunx uri-scheme open com.example.app://somepath/details --android

# 如果在 app.json 中定义了 scheme
bunx uri-scheme open myapp://somepath/details --ios
```
:::
:::
