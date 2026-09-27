---
title: 额外的平台支持
description: 了解如何为 macOS 和 tvOS 平台添加支持。
---

# 额外的平台支持

Expo Modules API 为 Android 和 iOS 提供了一流支持。不过，由于所有 Apple 平台都基于相同的基础并使用相同的编程语言，在 Expo 模块中面向其他[树外平台](https://reactnative.dev/docs/out-of-tree-platforms)（Out-of-Tree platforms）是可行的。

目前仅支持 **macOS** 和 **tvOS** 平台。本指南将带你完成为这些平台添加支持的流程。

1. **使用 `expo-module.config.json` 中的 `"apple"` 平台**

   为了无缝支持其他 Apple 平台，Expo SDK 引入了通用的 `"apple"` 平台，用于告知[自动链接](/modules/autolinking)该模块可能支持任意 Apple 平台，而是否在特定的 CocoaPods target 中链接该模块则交由 podspec 决定。如果你之前使用的是 `"ios"`，可以放心地将其替换：

   ```diff
   diff --git a/expo-module.config.json b/expo-module.config.json
   index 0000000..1111111 100644
   --- a/expo-module.config.json
   +++ b/expo-module.config.json
   @@ -1,5 +1,5 @@
   -  "platforms": ["ios"],
   -  "ios": {
   -    "modules": ["MyModule"]
   -  }
   +  "platforms": ["apple"],
   +  "apple": {
   +    "modules": ["MyModule"]
   +  }
    }
   ```

2. **更新 podspec 以声明对其他平台的支持**

   模块的 podspec 需要更新为包含所支持平台的列表。否则，CocoaPods 将无法在其他平台的 target 上安装该 pod。正如第一步所述，当模块配置为通用的 `"apple"` 平台时，spec 的这一部分就是自动链接的事实来源。

   ```diff
   diff --git a/YourModule.podspec b/YourModule.podspec
   index 0000000..1111111 100644
   --- a/YourModule.podspec
   +++ b/YourModule.podspec
   @@ -1,5 +1,5 @@
   - s.platform       = :ios, '13.4'
   + s.platforms = {
   +   :ios => '13.4',
   +   :tvos => '13.4',
   +   :osx => '10.15'
   + }
   ```

   对 podspec 的任何更改都需要运行 `pod install` 才能生效。

3. **在应用中设置 `react-native-macos` 或 `react-native-tvos`**

   如果你正在编写本地模块且应用已设置完成，可以跳过此步骤。否则，你需要设置你的应用（如果是编写独立（非本地）模块，则是示例应用）。

   - **对于 macOS**：按照 `react-native-macos` 文档中的官方 [Install React Native for macOS](https://microsoft.github.io/react-native-macos/docs/getting-started) 指南操作。
   - **对于 tvOS**：按照 [`react-native-tvos`](https://github.com/react-native-tvos/react-native-tvos) 仓库中的说明操作。如果你正在构建 Expo 应用，还应按照[为 TV 构建 Expo 应用指南](/guides/building-for-tv)中的说明操作。

4. **检查代码中是否使用了这些平台不支持的 API**

   平台 API 在不同 Apple 平台之间可能存在差异。最明显的差异来自所依赖的 UI 框架不同——iOS/tvOS 上使用 `UIKit`，macOS 上使用 `AppKit`。

   `react-native-macos` 和 `expo-modules-core` 都提供了别名和 polyfill，以便在 macOS target 上引用 `UIKit` 类（例如，`UIView` 是 `NSView` 的别名，`UIApplication` 是 `NSApplication` 的别名），但对于以 iOS 为主的库来说，这通常不足以开箱即用地支持其他平台。你可能需要编写条件编译代码，根据平台使用不同的实现。

   为此，可以使用带有 `os` 条件的 Swift 编译器指令，当应用针对特定平台构建时，该指令会包含给定的代码段。结合 `#if` 和 `#else` 指令，你可以在跨平台代码中设置平台特定的分支。

   ```swift
   #if os(iOS)
     // iOS 实现
   #elseif os(macOS)
     // macOS 实现
   #elseif os(tvOS)
     // tvOS 实现
   #endif
   ```

你的模块现在可以在树外平台上使用了。
