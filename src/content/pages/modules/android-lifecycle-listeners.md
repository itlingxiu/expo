---
title: Android 生命周期监听器
description: 了解如何使用 Expo Modules API 让你的库接入 Android Activity 和 Application 函数的机制。
---

# Android 生命周期监听器

为了响应与应用相关的某些 Android 系统事件（例如入站链接和配置变更），有必要重写 **MainActivity.java** 和/或 **MainApplication.java** 中相应的生命周期回调。

React Native 模块 API 没有提供任何接入这些回调的机制，因此 React Native 库的安装说明通常包含将代码复制到这些文件中的步骤。为了简化并自动化安装与维护，Expo Modules API 提供了一种机制，让你的库可以接入 `Activity` 或 `Application` 的函数。

## 开始之前

首先，你需要已经创建了一个 Expo 模块，或者已在使用 React Native 模块 API 的库中集成了 Expo Modules API。参见[什么是 Expo Modules API](/modules/overview#what-is-the-expo-modules-api)。

在你的模块中，创建一个实现 [`Package`](https://github.com/expo/expo/tree/main/packages/expo-modules-core/android/src/main/java/expo/modules/core/interfaces/Package.java) 接口的具体类。大多数情况下，你只需要实现 `createReactActivityLifecycleListeners` 或 `createApplicationLifecycleListeners` 方法。

你无需在 **MainApplication.java** 或 **MainApplication.kt** 中注册这个类。[Expo 自动链接](/modules/autolinking)会扫描每个已链接模块的 Android 源码，寻找文件名以 **Package.java** 或 **Package.kt** 结尾、且实现了 `Package` 接口的类。在 Android 构建期间，它会将这些类添加到生成的 `ExpoModulesPackageList` 中，Expo 使用该列表来创建生命周期监听器。如果模块已支持 Android，你也不需要将 `Package` 类添加到 **expo-module.config.json** 中。

## `Activity` 生命周期监听器

你可以使用 `ReactActivityLifecycleListener` 接入 `Activity` 生命周期。`ReactActivityLifecycleListener` 通过 React Native 的 `ReactActivityDelegate` 接入其 `ReactActivity` 生命周期，并提供与 Android `Activity` 生命周期类似的体验。

目前支持以下 `Activity` 生命周期回调：

- `onCreate`
- `onResume`
- `onPause`
- `onDestroy`
- `onNewIntent`
- `onBackPressed`

要创建 `ReactActivityLifecycleListener`，你应该在派生出的 `Package` 类中实现 `createReactActivityLifecycleListeners`。例如 `MyLibPackage`。

:::tabs
:::tab Kotlin
```kotlin
// android/src/main/java/expo/modules/mylib/MyLibPackage.kt
package expo.modules.mylib

import android.content.Context
import expo.modules.core.interfaces.Package
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class MyLibPackage : Package {
  override fun createReactActivityLifecycleListeners(activityContext: Context): List<ReactActivityLifecycleListener> {
    return listOf(MyLibReactActivityLifecycleListener())
  }
}
```
:::
:::tab Java
```java
// android/src/main/java/expo/modules/mylib/MyLibPackage.java
package expo.modules.mylib;

import android.content.Context;
import expo.modules.core.interfaces.Package;
import expo.modules.core.interfaces.ReactActivityLifecycleListener;

import java.util.Collections;
import java.util.List;

public class MyLibPackage implements Package {
  @Override
  public List<? extends ReactActivityLifecycleListener> createReactActivityLifecycleListeners(Context activityContext) {
    return Collections.singletonList(new MyLibReactActivityLifecycleListener());
  }
}
```
:::
:::

`MyLibReactActivityLifecycleListener` 是一个派生自 `ReactActivityLifecycleListener` 的类，你可以通过它接入这些生命周期。你只需重写你需要的方法。

:::tabs
:::tab Kotlin
```kotlin
// android/src/main/java/expo/modules/mylib/MyLibReactActivityLifecycleListener.kt
package expo.modules.mylib

import android.app.Activity
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class MyLibReactActivityLifecycleListener : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity, savedInstanceState: Bundle?) {
    // 在 Activity.onCreate 中编写你的初始化代码。
    doSomeSetupInActivityOnCreate(activity)
  }
}
```
:::
:::tab Java
```java
// android/src/main/java/expo/modules/mylib/MyLibReactActivityLifecycleListener.java
package expo.modules.mylib;

import android.app.Activity;
import android.os.Bundle;

import expo.modules.core.interfaces.ReactActivityLifecycleListener;

public class MyLibReactActivityLifecycleListener implements ReactActivityLifecycleListener {
  @Override
  public void onCreate(Activity activity, Bundle savedInstanceState) {
    // 在 Activity.onCreate 中编写你的初始化代码。
    doSomeSetupInActivityOnCreate(activity);
  }
}
```
:::
:::

你也可以重写其他生命周期方法。下面的示例展示了如何在一个监听器类中重写多个生命周期方法。它基于 `expo-linking` 模块，该模块使用不同的生命周期方法来处理深层链接。你可以只实现你的用例所需的方法：

:::tabs
:::tab Kotlin
```kotlin
// android/src/main/java/expo/modules/mylib/MyLibReactActivityLifecycleListener.kt
package expo.modules.mylib

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class MyLibReactActivityLifecycleListener : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity?, savedInstanceState: Bundle?) {
    // Activity 首次创建时调用
    // 在这里完成你的初始化设置，例如处理深层链接
    val deepLinkUrl = activity?.intent?.data
    if (deepLinkUrl != null) {
      handleDeepLink(deepLinkUrl.toString())
    }
  }

  override fun onResume(activity: Activity) {
    // Activity 进入前台时调用
    // 例如，跟踪用户何时返回应用
    trackAppStateChange("active")
  }

  override fun onPause(activity: Activity) {
    // Activity 进入后台时调用
    // 例如，暂停正在进行的操作，如跟踪分析
    trackAppStateChange("inactive")
  }

  override fun onDestroy(activity: Activity) {
    // Activity 被销毁时调用
    // 在这里清理资源
    cleanup()
  }

  override fun onNewIntent(intent: Intent?): Boolean {
    // 应用运行中收到新的 intent 时调用
    // 例如，在应用打开时处理新的深层链接
    val newUrl = intent?.data
    if (newUrl != null) {
      handleDeepLink(newUrl.toString())
      return true
    }
    return false
  }

  override fun onBackPressed(): Boolean {
    // 用户按下返回键时调用
    // 返回 true 以阻止默认的返回行为
    return handleCustomBackNavigation()
  }

  // 现在，你可以添加私有函数来处理
  // 深层链接、应用状态跟踪、清理等逻辑。
}
```
:::
:::tab Java
```java
// android/src/main/java/expo/modules/mylib/MyLibReactActivityLifecycleListener.java
package expo.modules.mylib;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import expo.modules.core.interfaces.ReactActivityLifecycleListener;

public class MyLibReactActivityLifecycleListener implements ReactActivityLifecycleListener {
  @Override
  public void onCreate(Activity activity, Bundle savedInstanceState) {
    // Activity 首次创建时调用
    // 在这里完成你的初始化设置，例如处理深层链接
    Uri deepLinkUrl = activity.getIntent().getData();
    if (deepLinkUrl != null) {
      handleDeepLink(deepLinkUrl.toString());
    }
  }

  @Override
  public void onResume(Activity activity) {
    // Activity 进入前台时调用
    // 例如，跟踪用户何时返回应用
    trackAppStateChange("active");
  }

  @Override
  public void onPause(Activity activity) {
    // Activity 进入后台时调用
    // 例如，暂停正在进行的操作，如跟踪分析
    trackAppStateChange("inactive");
  }

  @Override
  public void onDestroy(Activity activity) {
    // Activity 被销毁时调用
    // 在这里清理资源
    cleanup();
  }

  @Override
  public boolean onNewIntent(Intent intent) {
    // 应用运行中收到新的 intent 时调用
    // 例如，在应用打开时处理新的深层链接
    Uri newUrl = intent.getData();
    if (newUrl != null) {
      handleDeepLink(newUrl.toString());
      return true;
    }
    return false;
  }

  @Override
  public boolean onBackPressed() {
    // 用户按下返回键时调用
    // 返回 true 以阻止默认的返回行为
    return handleCustomBackNavigation();
  }

  // 现在，你可以添加私有函数来处理
  // 深层链接、应用状态跟踪、清理等逻辑。
}
```
:::
:::

## 从生命周期监听器到 JavaScript 的事件流

生命周期监听器是单例类，独立于你的 Expo 模块实例而存在。要在生命周期监听器与模块之间进行通信（例如，向应用的 JavaScript 代码发送事件），你需要从模块观察事件，并在事件发生时通知生命周期监听器。一个典型的流程可能包含以下步骤：

- **系统集成**：生命周期监听器捕获带有 URL 数据的 Android intent
- **观察者模式**：单例生命周期监听器与模块实例通信
- **事件桥接**：模块向 JavaScript 发送结构化事件
- **内存管理**：弱引用防止内存泄漏
- **类型安全与 React 集成**：TypeScript 支持配合合适的事件类型和自定义 hook，可以方便地访问深层链接事件

你的自定义模块实现可能不需要上述事件流中的全部内容。不过，你可以将此模式应用于其他系统事件，例如应用状态变化、配置变更，或者需要将 Android 生命周期事件桥接到 React Native 应用的自定义业务逻辑。

下面的示例演示了如何使用生命周期监听器将 Android 系统事件桥接到你的 React Native 应用。它基于 [`expo-linking`](https://github.com/expo/expo/tree/main/packages/expo-linking)，该模块使用生命周期监听器创建一个深层链接处理器，在应用被打开或收到新的 intent 时捕获 URL。

1. **模块注册**

   首先创建一个注册生命周期监听器的模块类：

:::tabs
:::tab Kotlin
```kotlin
// android/src/main/java/expo/modules/deeplinkhandler/DeepLinkHandlerPackage.kt
package expo.modules.deeplinkhandler

import android.content.Context
import expo.modules.core.interfaces.Package
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class DeepLinkHandlerPackage : Package {
  override fun createReactActivityLifecycleListeners(activityContext: Context?): List<ReactActivityLifecycleListener> {
    return listOf(DeepLinkHandlerActivityLifecycleListener())
  }
}
```
:::
:::tab Java
```java
// android/src/main/java/expo/modules/deeplinkhandler/DeepLinkHandlerPackage.java
package expo.modules.deeplinkhandler;

import android.content.Context;
import expo.modules.core.interfaces.Package;
import expo.modules.core.interfaces.ReactActivityLifecycleListener;
import java.util.Collections;
import java.util.List;

public class DeepLinkHandlerPackage implements Package {
  @Override
  public List<? extends ReactActivityLifecycleListener> createReactActivityLifecycleListeners(Context activityContext) {
    return Collections.singletonList(new DeepLinkHandlerActivityLifecycleListener());
  }
}
```
:::
:::

2. **带观察者通知的 Activity 生命周期监听器**

   创建一个捕获深层链接并通知模块观察者的生命周期监听器：

:::tabs
:::tab Kotlin
```kotlin
// android/src/main/java/expo/modules/deeplinkhandler/DeepLinkHandlerActivityLifecycleListener.kt
package expo.modules.deeplinkhandler

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class DeepLinkHandlerActivityLifecycleListener : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity?, savedInstanceState: Bundle?) {
    handleIntent(activity?.intent)
  }

  override fun onNewIntent(intent: Intent?): Boolean {
    handleIntent(intent)
    return true
  }

  private fun handleIntent(intent: Intent?) {
    val url = intent?.data
    if (url != null) {
      // 存储初始 URL 以便后续获取
      DeepLinkHandlerModule.initialUrl = url

      // 通知所有观察者收到了新的深层链接
      DeepLinkHandlerModule.urlReceivedObservers.forEach { observer ->
        observer(url)
      }
    }
  }
}
```
:::
:::tab Java
```java
// android/src/main/java/expo/modules/deeplinkhandler/DeepLinkHandlerActivityLifecycleListener.java
package expo.modules.deeplinkhandler;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import expo.modules.core.interfaces.ReactActivityLifecycleListener;

public class DeepLinkHandlerActivityLifecycleListener implements ReactActivityLifecycleListener {
  @Override
  public void onCreate(Activity activity, Bundle savedInstanceState) {
    handleIntent(activity.getIntent());
  }

  @Override
  public boolean onNewIntent(Intent intent) {
    handleIntent(intent);
    return true;
  }

  private void handleIntent(Intent intent) {
    if (intent == null) return;

    Uri url = intent.getData();
    if (url != null) {
      // 存储初始 URL 以便后续获取
      DeepLinkHandlerModule.initialUrl = url;

      // 通知所有观察者收到了新的深层链接
      for (java.util.function.Consumer<Uri> observer : DeepLinkHandlerModule.urlReceivedObservers) {
        observer.accept(url);
      }
    }
  }
}
```
:::
:::

3. **带事件发送功能的 Expo 模块**

   创建一个维护观察者并向 JavaScript 发送事件的模块：

:::tabs
:::tab Kotlin
```kotlin
// android/src/main/java/expo/modules/deeplinkhandler/DeepLinkHandlerModule.kt
package expo.modules.deeplinkhandler

import android.net.Uri
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.lang.ref.WeakReference

class DeepLinkHandlerModule : Module() {
  companion object {
    var initialUrl: Uri? = null
    var urlReceivedObservers: MutableSet<((Uri) -> Unit)> = mutableSetOf()
  }

  private var urlReceivedObserver: ((Uri) -> Unit)? = null

  override fun definition() = ModuleDefinition {
    Name("DeepLinkHandler")

    Events("onUrlReceived")

    Function("getInitialUrl") {
      initialUrl?.toString()
    }

    OnStartObserving("onUrlReceived") {
      val weakModule = WeakReference(this@DeepLinkHandlerModule)
      val observer: (Uri) -> Unit = { uri ->
        weakModule.get()?.sendEvent(
          "onUrlReceived",
          bundleOf(
            "url" to uri.toString(),
            "scheme" to uri.scheme,
            "host" to uri.host,
            "path" to uri.path
          )
        )
      }
      urlReceivedObservers.add(observer)
      urlReceivedObserver = observer
    }

    OnStopObserving("onUrlReceived") {
      urlReceivedObservers.remove(urlReceivedObserver)
    }
  }
}
```
:::
:::tab Java
```java
// android/src/main/java/expo/modules/deeplinkhandler/DeepLinkHandlerModule.java
package expo.modules.deeplinkhandler;

import android.net.Uri;
import androidx.core.os.Bundle;
import expo.modules.kotlin.modules.Module;
import expo.modules.kotlin.modules.ModuleDefinition;
import java.lang.ref.WeakReference;
import java.util.HashSet;
import java.util.Set;
import java.util.function.Consumer;

public class DeepLinkHandlerModule extends Module {
  public static Uri initialUrl = null;
  public static Set<Consumer<Uri>> urlReceivedObservers = new HashSet<>();

  private Consumer<Uri> urlReceivedObserver;

  @Override
  public ModuleDefinition definition() {
    return ModuleDefinition.create()
      .name("DeepLinkHandler")
      .events("onUrlReceived")
      .function("getInitialUrl", () -> {
        return initialUrl != null ? initialUrl.toString() : null;
      })
      .onStartObserving("onUrlReceived", () -> {
        WeakReference<DeepLinkHandlerModule> weakModule = new WeakReference<>(this);
        Consumer<Uri> observer = uri -> {
          DeepLinkHandlerModule module = weakModule.get();
          if (module != null) {
            Bundle bundle = new Bundle();
            bundle.putString("url", uri.toString());
            bundle.putString("scheme", uri.getScheme());
            bundle.putString("host", uri.getHost());
            bundle.putString("path", uri.getPath());
            module.sendEvent("onUrlReceived", bundle);
          }
        };
        urlReceivedObservers.add(observer);
        urlReceivedObserver = observer;
      })
      .onStopObserving("onUrlReceived", () -> {
        urlReceivedObservers.remove(urlReceivedObserver);
      });
  }
}
```
:::
:::

4. **TypeScript 接口与 React 用法**

   为你的模块定义一个 TypeScript 接口，将 Android 生命周期事件桥接到 JavaScript：

   ```ts DeepLinkHandler.ts
   import { requireNativeModule, NativeModule } from 'expo-modules-core';

   export type DeepLinkEvent = {
     url: string;
     scheme?: string;
     host?: string;
     path?: string;
   };

   type DeepLinkHandlerModuleEvents = {
     onUrlReceived(event: DeepLinkEvent): void;
   };

   declare class DeepLinkHandlerNativeModule extends NativeModule<DeepLinkHandlerModuleEvents> {
     getInitialUrl(): string | null;
   }

   const DeepLinkHandler = requireNativeModule<DeepLinkHandlerNativeModule>('DeepLinkHandler');
   export default DeepLinkHandler;
   ```

   创建一个 React hook 以便轻松访问深层链接事件：

   ```tsx useDeepLinkHandler.ts
   import { useEffect, useState } from 'react';
   import DeepLinkHandler, { DeepLinkEvent } from './DeepLinkHandler';

   export function useDeepLinkHandler(): {
     initialUrl: string | null;
     url: string | null;
     event: DeepLinkEvent | null;
   } {
     const [initialUrl] = useState<string | null>(DeepLinkHandler.getInitialUrl());
     const [event, setEvent] = useState<DeepLinkEvent | null>(null);

     useEffect(() => {
       const subscription = DeepLinkHandler.addListener('onUrlReceived', event => {
         setEvent(event);
       });

       return () => subscription.remove();
     }, []);

     return {
       initialUrl,
       url: event?.url ?? initialUrl,
       event,
     };
   }
   ```

   在你的 React 组件中使用它：

   ```tsx App.tsx
   import { Text, View, StyleSheet } from 'react-native';
   import { useDeepLinkHandler } from './useDeepLinkHandler';

   export function App() {
     const { initialUrl, url, event } = useDeepLinkHandler();

     return (
       <View style={styles.container}>
         <Text>Initial URL: {initialUrl || 'None'}</Text>
         <Text>Current URL: {url || 'None'}</Text>
         {event && (
           <View style={styles.textContainer}>
             <Text>Latest Deep Link:</Text>
             <Text>Scheme: {event.scheme}</Text>
             <Text>Host: {event.host}</Text>
             <Text>Path: {event.path}</Text>
           </View>
         )}
       </View>
     );
   }

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
     },
     textContainer: {
       marginTop: 20,
     },
   });
   ```

5. **模块配置**

   最后，在 **expo-module.config.json** 中配置你的模块，将模块与生命周期监听器连接起来：

   ```json expo-module.config.json
   {
     "platforms": ["android"],
     "android": {
       "modules": ["expo.modules.deeplinkhandler.DeepLinkHandlerModule"]
     }
   }
   ```

## `Application` 生命周期监听器

你可以使用 `ApplicationLifecycleListener` 接入 `Application` 生命周期。

目前支持以下 `Application` 生命周期回调：

- `onCreate`
- `onConfigurationChanged`

要创建 `ApplicationLifecycleListener`，你应该在派生出的 `Package` 类中实现 `createApplicationLifecycleListeners`。例如 `MyLibPackage`。

:::tabs
:::tab Kotlin
```kotlin
// android/src/main/java/expo/modules/mylib/MyLibPackage.kt
package expo.modules.mylib

import android.content.Context
import expo.modules.core.interfaces.ApplicationLifecycleListener
import expo.modules.core.interfaces.Package

class MyLibPackage : Package {
  override fun createApplicationLifecycleListeners(context: Context): List<ApplicationLifecycleListener> {
    return listOf(MyLibApplicationLifecycleListener())
  }
}
```
:::
:::tab Java
```java
// android/src/main/java/expo/modules/mylib/MyLibPackage.java
import android.content.Context;

import java.util.Collections;
import java.util.List;

import expo.modules.core.interfaces.ApplicationLifecycleListener;
import expo.modules.core.interfaces.Package;

public class MyLibPackage implements Package {
  @Override
  public List<? extends ApplicationLifecycleListener> createApplicationLifecycleListeners(Context context) {
    return Collections.singletonList(new MyLibApplicationLifecycleListener());
  }
}
```
:::
:::

`MyLibApplicationLifecycleListener` 是一个派生自 `ApplicationLifecycleListener` 的类，可以接入 `Application` 生命周期回调。你应该只重写你需要的方法（[考虑到可能的维护成本](#接口稳定性)）。

:::tabs
:::tab Kotlin
```kotlin
// android/src/main/java/expo/modules/mylib/MyLibApplicationLifecycleListener.kt
package expo.modules.mylib

import android.app.Application
import expo.modules.core.interfaces.ApplicationLifecycleListener

class MyLibApplicationLifecycleListener : ApplicationLifecycleListener {
  override fun onCreate(application: Application) {
    // 在 Application.onCreate 中编写你的初始化代码。
    doSomeSetupInApplicationOnCreate(application)
  }
}
```
:::
:::tab Java
```java
// android/src/main/java/expo/modules/mylib/MyLibApplicationLifecycleListener.java
package expo.modules.mylib;

import android.app.Application;

import expo.modules.core.interfaces.ApplicationLifecycleListener;

public class MyLibApplicationLifecycleListener implements ApplicationLifecycleListener {
  @Override
  public void onCreate(Application application) {
    // 在 Application.onCreate 中编写你的初始化代码。
    doSomeSetupInApplicationOnCreate(application);
  }
}
```
:::
:::

## 已知问题

### 为什么没有 `onStart` 和 `onStop` Activity 监听器

在当前的实现中，我们不是从 `MainActivity` 而是从 [`ReactActivityDelegate`](https://github.com/facebook/react-native/blob/400902093aa3ccfc05712a996c592a86f342253a/ReactAndroid/src/main/java/com/facebook/react/ReactActivityDelegate.java) 设置这些钩子。`MainActivity` 与 `ReactActivityDelegate` 之间存在一些细微差异。由于 `ReactActivityDelegate` 没有 `onStart` 和 `onStop`，我们目前在这里还不支持它们。

### 接口稳定性

监听器接口在 Expo SDK 各版本之间可能会不时发生变化。我们的向后兼容策略始终是：添加新接口，并为我们计划移除的接口添加 `@Deprecated` 注解。我们的接口都基于 Java 8 接口默认方法；你不必也不应该实现所有方法。这样做将降低你的模块在 Expo SDK 版本之间升级时的维护成本。
