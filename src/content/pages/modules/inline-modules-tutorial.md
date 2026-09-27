---
title: 教程：创建内联模块
description: 使用内联模块直接在 Expo 项目中创建原生模块和视图的教程。
---

# 教程：创建内联模块

:::warning
内联模块是[实验性](/more/release-statuses#experimental)功能，在 Expo SDK 56 及更高版本中可用。该 API 可能会发生破坏性更改。
:::

在本教程中，你将使用内联模块，直接在 Expo 项目的 **app** 目录内创建一个示例原生模块和一个原生视图。与标准 Expo 模块不同，内联模块不需要单独的包或 `create-expo-module` 脚手架。你把 Kotlin 和 Swift 文件与应用代码写在一起，Expo 会自动发现它们。

1. **设置你的项目**

打开[应用配置](/workflow/configuration)，把 `expo.experiments.inlineModules.watchedDirectories` 设为 `["app"]`：

```json app.json
{
  "expo": {
    "experiments": {
      "inlineModules": {
        "watchedDirectories": ["app"]
      }
    }
  }
}
```

定义 `expo.experiments.inlineModules` 会在 Expo 项目中启用内联模块功能。

在 `expo.experiments.inlineModules.watchedDirectories` 中，你可以指定内联模块所在的目录。注意，并非所有目录都允许。更多信息请参阅[内联模块参考](/modules/inline-modules-reference)。

2. **运行预构建**

运行预构建命令，生成已配置内联模块的 **android** 和 **ios** 原生项目。

:::tabs
:::tab npm
```sh
$ npx expo prebuild
```
:::
:::tab yarn
```sh
$ yarn expo prebuild
```
:::
:::tab pnpm
```sh
$ pnpm expo prebuild
```
:::
:::tab bun
```sh
$ bun expo prebuild
```
:::
:::

3. **创建一个内联模块**

对于 Android，在 **app** 目录内创建一个名为 **FirstInlineModule.kt** 的 Kotlin 文件，并添加类似以下内容的模块：

```kotlin app/FirstInlineModule.kt
package app

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class FirstInlineModule : Module() {
  override fun definition() = ModuleDefinition {
    Constant("Hello") { ->
      "Hello Android inline modules!"
    }
  }
}
```

对于 iOS，在 **app** 目录内创建一个名为 **FirstInlineModule.swift** 的 Swift 文件：

```swift app/FirstInlineModule.swift
internal import ExpoModulesCore

class FirstInlineModule: Module {
  public func definition() -> ModuleDefinition {
    Constant("Hello") {
      return "Hello iOS inline modules!"
    }
  }
}
```

4. **在应用中使用该模块**

在应用的 TypeScript/JavaScript 代码中，你可以按以下方式使用该模块：

```tsx app/index.tsx
import { requireNativeModule } from 'expo';
import { Text } from 'react-native';

const FirstInlineModule = requireNativeModule('FirstInlineModule');

export default function InlineModulesDemoComponent() {
  return <Text> {FirstInlineModule.Hello} </Text>;
}
```

现在，你可以运行示例应用：

:::tabs
:::tab npm
```sh
# 在 Android 上运行示例应用
$ npx expo run:android

# 在 iOS 上运行示例应用
$ npx expo run:ios
```
:::
:::tab yarn
```sh
# 在 Android 上运行示例应用
$ yarn expo run:android

# 在 iOS 上运行示例应用
$ yarn expo run:ios
```
:::
:::tab pnpm
```sh
# 在 Android 上运行示例应用
$ pnpm expo run:android

# 在 iOS 上运行示例应用
$ pnpm expo run:ios
```
:::
:::tab bun
```sh
# 在 Android 上运行示例应用
$ bun expo run:android

# 在 iOS 上运行示例应用
$ bun expo run:ios
```
:::
:::

运行上述命令后，你会看到应用中的文本常量来自原生 Android/iOS 模块。

5. **创建一个原生视图**

要在 **app** 目录内创建原生视图，我们使用 `ExpoWebView` 示例。

对于 Android，在 **app** 目录内创建一个名为 **FirstInlineView.kt** 的 Kotlin 文件，并添加类似以下内容的视图：

```kotlin app/FirstInlineView.kt
package app

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

import android.content.Context
import android.webkit.WebView
import android.webkit.WebViewClient
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

class FirstInlineView : Module() {
  override fun definition() = ModuleDefinition {
    View(ExpoWebView::class) {
      Events("onLoad")

      Prop("url") { view: ExpoWebView, url: URL? ->
        view.webView.loadUrl(url.toString())
      }
    }
  }
}

class ExpoWebView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val onLoad by EventDispatcher()

  internal val webView = WebView(context).also {
    it.layoutParams = LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT
    )

    it.webViewClient = object : WebViewClient() {
      override fun onPageFinished(view: WebView, url: String) {
        onLoad(mapOf("url" to url))
      }
    }

    addView(it)
  }
}
```

对于 iOS，在 **app** 目录内创建一个名为 **FirstInlineView.swift** 的 Swift 文件：

```swift app/FirstInlineView.swift
internal import ExpoModulesCore
import WebKit

class FirstInlineView: Module {
  public func definition() -> ModuleDefinition {
    View(ExpoWebView.self) {
      Events("onLoad")

      Prop("url") { (view, url: URL) in
        if view.webView.url != url {
          let urlRequest = URLRequest(url: url)
          view.webView.load(urlRequest)
        }
      }
    }
  }
}

class ExpoWebView: ExpoView, WKNavigationDelegate {
  let webView = WKWebView()
  let onLoad = EventDispatcher()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    webView.navigationDelegate = self
    addSubview(webView)
  }

  override func layoutSubviews() {
    webView.frame = bounds
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    if let url = webView.url {
      onLoad([
        "url": url.absoluteString
      ])
    }
  }
}
```

6. **在应用中使用原生视图**

使用内联视图的方式与使用内联模块类似：

```tsx app/index.tsx
import { requireNativeModule, requireNativeView } from 'expo';
import { StyleSheet, Text, View } from 'react-native';

const FirstInlineModule = requireNativeModule('FirstInlineModule');
const FirstInlineView = requireNativeView('FirstInlineView');

export default function InlineModulesDemoComponent() {
  return (
    <>
      <View style={styles.textBox}>
        <Text style={styles.text}> {FirstInlineModule.Hello} </Text>
      </View>
      <FirstInlineView style={styles.inlineView} url="https://docs.expo.dev/modules/" />
    </>
  );
}

const styles = StyleSheet.create({
  textBox: { height: 100, justifyContent: 'flex-end', alignItems: 'center' },
  text: { fontSize: 26 },
  inlineView: { flex: 1 },
});
```

现在，使用 `npx expo run:android` 或 `npx expo run:ios` 命令编译并运行你的示例应用。

运行上述命令后，你会看到应用中有一个来自原生 Android/iOS 模块的文本常量，以及一个来自原生视图的 WebView。

恭喜！你已经创建了第一个 Expo 内联模块和视图。

## 下一步

- [Expo 内联模块参考](/modules/inline-modules-reference) — 关于如何使用 Kotlin 和 Swift 创建内联模块的参考。
- [教程：创建原生模块](/modules/native-module-tutorial) — 使用 Expo Modules API 创建用于持久化设置的原生模块的教程。
