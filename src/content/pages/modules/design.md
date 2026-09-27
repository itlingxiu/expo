---
title: Expo Modules API：设计考量
description: Expo Modules API 背后的设计考量概述。
---

# Expo Modules API：设计考量

Expo 团队维护着大量库。随着时间推移，在不断变化的环境中维护原生模块可能很有挑战。借助 Expo Modules API，我们着手构建强大的工具，让构建和维护这些库变得更容易。

### 利用现代语言特性

在维护 Expo SDK 中超过 50 个原生模块数年之后，我们发现许多问题是由未处理的空值或错误类型引起的。现代语言特性可以帮助开发者避免这些 bug。例如，缺少可选类型，再加上 Objective-C 的动态特性，使得某些类别的 bug 很难被捕获，而在 Swift 中编译器本可以发现它们。

编写 React Native 模块的另一个困难是：在各平台差异极大的语言和范式之间来回切换。由于这些平台之间的差异，这无法完全避免。我们觉得需要一套统一的 API 和文档，尽可能简化开发，并让单个开发者更容易在多个平台上维护同一个库。

这也是 Expo Modules 生态从一开始就设计为配合现代原生语言 Swift 和 Kotlin 使用的原因之一。

### 让数据在运行时之间传递变得容易

Expo Modules API 完全了解原生函数期望的参数类型。它可以预先校验并转换参数，字典也可以表示为我们称为 [Records](/modules/module-api#records) 的原生结构体。

我们希望用这套 API 解决的一个大痛点，是校验从 JavaScript 传到原生函数的参数。对于 `NSDictionary` 或 `ReadableMap` 尤其容易出错、耗时且难以维护：值的类型在运行时是未知的，每个属性都需要开发者单独校验。

知道参数类型之后，也可以[自动把参数转换](/modules/module-api#convertibles)为某些平台特定类型（例如，`{ x: number, y: number }` 或 `[number, number]` 可以转换为 CoreGraphics 的 `CGPoint`，方便你使用）。

总之，Expo Modules 具有强大的内置且可扩展的类型转换和类型安全。它支持原始值的自动转换（例如 `Bool` / `Int` / `UInt` / `Float32` / `Double` / `Pair` / `String`）、复杂的内置类型（例如 `URL`、`CGPoint`、`UIColor`、`Data`、`java.net.URL`、`android.graphics.Color`、`kotlin.ByteArray`）、记录（用户定义类型，类似 `struct` / `Object`）以及枚举。

### 支持表达力强的面向对象 API

把原生模块状态的唯一来源保存在一处，而不是分散在 JavaScript 和原生两侧、再由你自己做相应的簿记。我们把这一特性称为 **Shared Objects**。例如，[`expo-sqlite` 的数据库实例由 Shared Objects 支撑](https://github.com/expo/expo/blob/718a9ac107231475ca4b2e6427317ade9d1e70fa/packages/expo-sqlite/src/SQLiteDatabase.ts#L421)。Shared Objects 的详细文档即将推出。

### 提供安全且可组合的机制来接入应用生命周期事件

[Android 生命周期监听器](/modules/android-lifecycle-listeners)和 [iOS AppDelegate 订阅者](/modules/appdelegate-subscribers)是一项强大的功能，让你可以接入应用的生命周期，而不必把模块代码分散到 `MainActivity` 和 `AppDelegate` 类中，也不必要求库的使用者做同样的事。这对与[持续原生代码生成](/workflow/continuous-native-generation)平滑集成特别有用，因为它为库提供了一种可组合的方式来接入应用生命周期事件，而不必担心其他库可能在做什么。

### 支持新架构，同时保持向后兼容

React Native 0.68 引入了[新架构](https://reactnative.dev/docs/the-new-architecture/landing-page)，为开发者提供了构建移动应用的新能力。它由名为 [Turbo Modules](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules) 的新原生模块系统，以及名为 [Fabric](https://reactnative.dev/architecture/fabric-renderer) 的新渲染系统组成。
原生库需要适配才能利用这些新系统。对于 Fabric，工作量更大，因为它不提供任何兼容层。这意味着用旧方式编写的视图管理器无法与 Fabric 一起工作，反过来 Fabric 原生组件也无法与旧渲染器一起工作。这基本上意味着现有库在一段时间内必须同时支持两种架构，从而增加技术债。

新架构大部分用 C++ 编写，因此你的库最终可能也要写一些 C++ 代码。作为每天使用高层 JavaScript 的 React Native 开发者，我们相当不愿意去写处于光谱另一端的 C++。此外，在库中包含 C++ 代码会对构建时间产生负面影响，尤其是在 Android 上，调试也可能更困难。

设计 Expo Modules API 时我们考虑到了这些，目标是让它与渲染器无关，这样模块就不需要知道应用是否运行在新架构上，从而显著降低库开发者的成本。
