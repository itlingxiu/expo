---
title: 集成到现有库中
description: 了解如何把 Expo Modules API 集成到现有的 React Native 库中。
---

# 集成到现有库中

有些情况下，你可能希望把 Expo Modules API 集成到现有的 React Native 库中。例如，增量重写库，或者利用 [Android 生命周期监听器](/modules/android-lifecycle-listeners)和 [iOS AppDelegate 订阅者](/modules/appdelegate-subscribers)来自动完成库的设置，都会很有用。

本指南将帮助你设置现有的 React Native 库，以便访问 Expo Modules API。

## 前置条件

**创建 expo-module.config.json**

在项目根目录创建 [**expo-module.config.json**](/modules/module-config) 文件，并在其中放入一个空对象 `{}`。稍后你会更新它以启用特定功能。

此文件是 [Expo 自动链接](/modules/autolinking)将你的库识别为 Expo 模块并自动链接原生代码所必需的。

1. **添加 `expo-modules-core` 原生依赖**

   在 **build.gradle** 和 **podspec** 文件中把 `expo-modules-core` 添加为依赖：

:::tabs
:::tab build.gradle
```groovy
// ...
dependencies {
  // ...
  implementation project(':expo-modules-core')
}
```
:::
:::tab *.podspec
```ruby
# ...
Pod::Spec.new do |s|
  # ...
  s.dependency 'ExpoModulesCore'
end
```
:::
:::

2. **把 Expo 包添加到依赖中**

   在 **package.json** 中把 `expo` 包添加为 peer 依赖。我们建议使用 `*` 作为版本范围，以免在用户的 **node_modules** 目录中造成任何重复的包。

   你的库也需要依赖 `expo-modules-core`，但只作为开发依赖。依赖你的库的项目中，`expo` 包已经提供了与项目所用特定 SDK 兼容的 core 版本。

   ```json package.json
   {
     /* @hide 省略 ... */ /* @end */
     "devDependencies": {
       "expo-modules-core": "^X.Y.Z"
     },
     "peerDependencies": {
       "expo": "*"
     },
     "peerDependenciesMeta": {
       "expo": {
         "optional": true
       }
     }
   }
   ```

3. **创建原生模块**

   根据下面的模板创建 Kotlin 和 Swift 文件：

:::tabs
:::tab MyModule.kt
```kotlin
package my.module.package

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MyModule : Module() {
  override fun definition() = ModuleDefinition {
    // 定义组件写在这里
  }
}
```
:::
:::tab MyModule.swift
```swift
import ExpoModulesCore

public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    // 定义组件写在这里
  }
}
```
:::
:::

   然后，把你的类添加到 [**expo-module.config.json**](/modules/module-config) 文件中 Android 和/或 iOS 的 `modules` 里。Expo 自动链接会在用户项目中自动将这些类链接为原生模块。

   ```json expo-module.config.json
   {
     "ios": {
       "modules": ["MyModule"]
     },
     "android": {
       "modules": ["my.module.package.MyModule"]
     }
   }
   ```

   如果工作区中已经有示例应用，请确认模块已正确链接。

   - **在 Android 上**，原生模块类会在构建之前作为 Gradle 构建任务的一部分自动链接。
   - **在 iOS 上**，需要运行 `pod install` 来链接新类。

   现在可以通过 `expo-modules-core` 包中的 `requireNativeModule` 函数，从 JavaScript 代码访问这些模块类。为简单起见，我们建议创建一个单独的文件来导出原生模块。

   ```ts MyModule.ts
   import { requireNativeModule } from 'expo-modules-core';

   export default requireNativeModule('MyModule');
   ```

类设置好并完成链接之后，就可以开始实现它的功能了。请参阅[原生模块 API](/modules/module-api)参考页，以及从简单到中等复杂度的真实模块[示例](/modules/module-api#示例)链接，了解如何使用该 API。
