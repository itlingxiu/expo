---
title: 内联模块参考
description: Expo 内联模块参考。
---

# 内联模块参考

:::warning
内联模块是[实验性](/more/release-statuses#experimental)功能，在 Expo SDK 56 及更高版本中可用。该 API 可能会发生破坏性变更。
:::

内联模块让你可以直接在 Expo 项目目录中编写原生模块代码（Kotlin 和 Swift），而无需创建单独的 Expo 模块包。Expo 会自动发现这些文件，并把它们包含进构建中。

## 配置

### `expo.experiments.inlineModules`

定义后，会在 Expo CLI 和 Expo Modules 自动链接中启用内联模块功能。

```json app.json
{
  "expo": {
    "experiments": {
      "inlineModules": {}
    }
  }
}
```

### `expo.experiments.inlineModules.watchedDirectories`

配置可以在哪些目录中创建内联模块。

```json app.json
{
  "expo": {
    "experiments": {
      "inlineModules": {
        "watchedDirectories": ["app", "src"]
      }
    }
  }
}
```

嵌套目录中的文件也会被使用。
例如，如果应用配置中定义了 `watchedDirectories = ["app"]`，并且存在嵌套路径中的模块文件，如 **app/nested/directory/SomeModule.kt**，那么可以在应用中使用 `SomeModule`。

`watchedDirectories` 中的目录：

- 需要位于一个 TypeScript/JavaScript 项目内部。这意味着目录树中需要有一个包含 **package.json** 的祖先目录。例如，`"watchedDirectories": ["app", "src/some/directory", pathToOtherProject]` 应该可以工作，而 `"watchedDirectories": ["/", pathToFolderNotInNodeProject]` 则不行。
- 不能是整个项目目录，例如 `"./"`，也不能是它的祖先目录（例如 `../`）。
- 不能是 `watchedDirectories` 中另一个目录的子目录。例如，`watchedDirectories` 不能是 `["app", "app/nested/directory"]`，你只需把 `watchedDirectories` 设置为 `["app"]`。
- 不能包含 `" "`、`"("`、`")"`、`"$"` 等特殊字符。这意味着 `watchedDirectories` 中不能有 `"app/(tabs)"`，但可以有 `"app"`，并且它仍然应该使用 `"app/(tabs)"` 目录中的原生文件。

### `expo.experiments.inlineModules.xcodeProjectTargets`

> 支持平台：iOS。

配置内联模块文件要添加到哪些 Xcode target。省略时，内联模块只添加到应用的主 target。

```json app.json
{
  "expo": {
    "experiments": {
      "inlineModules": {
        "xcodeProjectTargets": ["MyApp", "MyAppWidgets"]
      }
    }
  }
}
```

每一项都是 target 在 Xcode 项目中显示的名称（也是 **ios/Podfile** 里 `target` 块中的名称）。只使用 target 名称。即使 target 嵌套在 `abstract_target` 内部，也不要包含 abstract target 的名称。

:::warning
更改[应用配置](/workflow/configuration)后，需要运行 `npx expo prebuild` 才能生效。
:::

## 命名约定

内联模块的文件名必须与原生模块名一致（该名称在整个应用中必须唯一）。
如果你有 **SimpleModule.kt**，那么其中的内联模块就使用该文件名。例如：

```kotlin
// SimpleModule.kt
// ...
class SimpleModule: Module() { // 注意：类名必须与文件名一致。
    public func definition() -> ModuleDefinition {
        // Name("SimpleModule") // 注意：`Name` 也必须与文件名一致，因此可以直接省略。
    }
}
```
