---
title: 教程：创建原生视图
description: 使用 Expo Modules API 创建渲染 WebView 的原生视图的教程。
---

# 教程：创建原生视图

在本教程中，你将构建一个带有原生视图的示例模块，该视图渲染一个 WebView。对于 Android，你将使用 [`WebView`](https://developer.android.com/reference/android/webkit/WebView) 组件；对于 iOS，使用 [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview)。Web 支持可以用 [`iframe`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) 实现，留给你作为练习。

1. **初始化新模块**

运行以下命令创建一个新模块，并把示例模块命名为 `expo-web-view`：

:::tabs
:::tab npm
```sh
$ npx create-expo-module expo-web-view
```
:::
:::tab yarn
```sh
$ yarn create expo-module expo-web-view
```
:::
:::tab pnpm
```sh
$ pnpm create expo-module expo-web-view
```
:::
:::tab bun
```sh
$ bun create expo-module expo-web-view
```
:::
:::

:::note
因为这是一个示例库，不会发布，所以对所有提示按 **Return** 以接受默认值。
:::

2. **设置工作区**

删除以下文件，清理默认模块，从一个干净的起点开始：

```sh
$ cd expo-web-view
$ rm src/ExpoWebView.types.ts src/ExpoWebViewModule.ts
$ rm src/ExpoWebView.web.tsx src/ExpoWebViewModule.web.ts
```

找到以下文件，并用提供的最小样板替换它们：

```kotlin android/src/main/java/expo/modules/webview/ExpoWebViewModule.kt
package expo.modules.webview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoWebViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView::class) {}
  }
}
```

```swift ios/ExpoWebViewModule.swift
import ExpoModulesCore

public class ExpoWebViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView.self) {}
  }
}
```

```tsx src/ExpoWebView.tsx
import { ViewProps } from 'react-native';
import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

export type Props = ViewProps;

const NativeView: React.ComponentType<Props> = requireNativeViewManager('ExpoWebView');

export default function ExpoWebView(props: Props) {
  return <NativeView {...props} />;
}
```

```tsx src/index.ts
export { default as WebView, Props as WebViewProps } from './ExpoWebView';
```

```tsx example/App.tsx
import { WebView } from 'expo-web-view';

export default function App() {
  return <WebView style={{ flex: 1, backgroundColor: 'purple' }} />;
}
```

3. **运行示例项目**

为了确保一切正常，启动 TypeScript 编译器以监视更改并重新构建模块的 JavaScript：

:::tabs
:::tab npm
```sh
# 在项目根目录运行此命令以启动 TypeScript 编译器
$ npm run build
```
:::
:::tab yarn
```sh
# 在项目根目录运行此命令以启动 TypeScript 编译器
$ yarn run build
```
:::
:::tab pnpm
```sh
# 在项目根目录运行此命令以启动 TypeScript 编译器
$ pnpm run build
```
:::
:::tab bun
```sh
# 在项目根目录运行此命令以启动 TypeScript 编译器
$ bun run build
```
:::
:::

:::tabs
:::tab npm
```sh
# 进入 example 目录
$ cd example
# 在 Android 上运行示例应用
$ npx expo run:android
# 在 iOS 上运行示例应用
$ npx expo run:ios
```
:::
:::tab yarn
```sh
# 进入 example 目录
$ cd example
# 在 Android 上运行示例应用
$ yarn expo run:android
# 在 iOS 上运行示例应用
$ yarn expo run:ios
```
:::
:::tab pnpm
```sh
# 进入 example 目录
$ cd example
# 在 Android 上运行示例应用
$ pnpm expo run:android
# 在 iOS 上运行示例应用
$ pnpm expo run:ios
```
:::
:::tab bun
```sh
# 进入 example 目录
$ cd example
# 在 Android 上运行示例应用
$ bun expo run:android
# 在 iOS 上运行示例应用
$ bun expo run:ios
```
:::
:::

你现在应该会看到一个空白的紫色屏幕。虽然不算激动人心，但这是一个好的开始。接下来，把它变成一个 WebView。

4. **把系统 WebView 添加为子视图**

把带有硬编码 URL 的系统 `WebView` 添加为 `ExpoWebView` 的子视图。`ExpoWebView` 类继承自 `ExpoView`，`ExpoView` 继承自 React Native 的 `RCTView`，最终在 Android 上继承 `View`，在 iOS 上继承 `UIView`。

确保 `WebView` 子视图使用与 `ExpoWebView` 相同的布局，而 `ExpoWebView` 的布局由 React Native 的布局引擎计算。

### Android 视图

在 Android 上，使用 `LayoutParams` 把 WebView 的布局设置为匹配 `ExpoWebView` 的布局。你可以在实例化 WebView 时这样做。

```kotlin android/src/main/java/expo/modules/webview/ExpoWebView.kt
package expo.modules.webview

import android.content.Context
import android.webkit.WebView
import android.webkit.WebViewClient
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class ExpoWebView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  internal val webView = WebView(context).also {
    it.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    it.webViewClient = object : WebViewClient() {}
    addView(it)

    it.loadUrl("https://docs.expo.dev/modules/")
  }
}
```

### iOS 视图

在 iOS 上，把 `clipsToBounds` 设为 `true`，并确保在 `layoutSubviews` 中 WebView 的 `frame` 与 `ExpoWebView` 的 bounds 一致。创建视图时会调用 `init` 方法，布局变化时会调用 `layoutSubviews`。

```swift ios/ExpoWebView.swift
import ExpoModulesCore
import WebKit

class ExpoWebView: ExpoView {
  let webView = WKWebView()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    addSubview(webView)

    let url =  URL(string:"https://docs.expo.dev/modules/")!
    let urlRequest = URLRequest(url:url)
    webView.load(urlRequest)
  }

  override func layoutSubviews() {
    webView.frame = bounds
  }
}
```

### 示例应用

不需要更改。使用以下命令重新构建并运行应用：

:::tabs
:::tab npm
```sh
# 使用 --clean 标志预构建示例应用，以确保干净的构建
$ npx expo prebuild --clean
# 在 Android 上运行示例应用
$ npx expo run:android
# 在 iOS 上运行示例应用
$ npx expo run:ios
```
:::
:::tab yarn
```sh
# 使用 --clean 标志预构建示例应用，以确保干净的构建
$ yarn expo prebuild --clean
# 在 Android 上运行示例应用
$ yarn expo run:android
# 在 iOS 上运行示例应用
$ yarn expo run:ios
```
:::
:::tab pnpm
```sh
# 使用 --clean 标志预构建示例应用，以确保干净的构建
$ pnpm expo prebuild --clean
# 在 Android 上运行示例应用
$ pnpm expo run:android
# 在 iOS 上运行示例应用
$ pnpm expo run:ios
```
:::
:::tab bun
```sh
# 使用 --clean 标志预构建示例应用，以确保干净的构建
$ bun expo prebuild --clean
# 在 Android 上运行示例应用
$ bun expo run:android
# 在 iOS 上运行示例应用
$ bun expo run:ios
```
:::
:::

之后，你会看到渲染出的 [Expo Modules API 概述页](/modules/overview)。如果更改没有反映出来，请尝试重新安装应用。

5. **添加用于设置 URL 的 prop**

要在视图上设置 prop，请在 `ExpoWebViewModule` 内部定义 prop 名称和 setter。在本例中，为了方便，你可以直接访问 `webView` 属性。不过，在真实场景中，应把逻辑保留在 `ExpoWebView` 类内部，以尽量减少 `ExpoWebViewModule` 对其内部实现的了解。

使用 [Prop 定义组件](/modules/module-api#prop) 来定义该 prop。在 prop setter 块中，你可以同时访问视图和 prop。指定 URL 的类型为 `URL`——Expo Modules API 会把字符串转换为原生 `URL` 类型。

### Android 模块

```kotlin android/src/main/java/expo/modules/webview/ExpoWebViewModule.kt
package expo.modules.webview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class ExpoWebViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView::class) {
      Prop("url") { view: ExpoWebView, url: URL? ->
        view.webView.loadUrl(url.toString())
      }
    }
  }
}
```

### iOS 模块

```swift ios/ExpoWebViewModule.swift
import ExpoModulesCore

public class ExpoWebViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView.self) {
      Prop("url") { (view, url: URL) in
        if view.webView.url != url {
          let urlRequest = URLRequest(url: url)
          view.webView.load(urlRequest)
        }
      }
    }
  }
}
```

### TypeScript 模块

接下来，把 `url` prop 添加到 `Props` 类型中。

```tsx src/ExpoWebView.tsx
import { ViewProps } from 'react-native';
import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

export type Props = {
  url?: string;
} & ViewProps;

const NativeView: React.ComponentType<Props> = requireNativeViewManager('ExpoWebView');

export default function ExpoWebView(props: Props) {
  return <NativeView {...props} />;
}
```

### 示例应用

最后，在示例应用中把一个 `URL` 传给你的 `WebView` 组件。

```tsx example/App.tsx
import { WebView } from 'expo-web-view';

export default function App() {
  return <WebView style={{ flex: 1 }} url="https://expo.dev" />;
}
```

重新构建示例应用：

:::tabs
:::tab npm
```sh
$ npx expo prebuild --clean
# 在 Android 上运行示例应用
$ npx expo run:android
# 在 iOS 上运行示例应用
$ npx expo run:ios
```
:::
:::tab yarn
```sh
$ yarn expo prebuild --clean
# 在 Android 上运行示例应用
$ yarn expo run:android
# 在 iOS 上运行示例应用
$ yarn expo run:ios
```
:::
:::tab pnpm
```sh
$ pnpm expo prebuild --clean
# 在 Android 上运行示例应用
$ pnpm expo run:android
# 在 iOS 上运行示例应用
$ pnpm expo run:ios
```
:::
:::tab bun
```sh
$ bun expo prebuild --clean
# 在 Android 上运行示例应用
$ bun expo run:android
# 在 iOS 上运行示例应用
$ bun expo run:ios
```
:::
:::

之后，你会在 WebView 中看到 [Expo 主页](https://expo.dev)。

6. **添加一个事件，在页面加载完成时通知**

[视图回调](/modules/module-api#视图回调)允许开发者监听组件上的事件。它们通常通过组件上的 props 注册，例如：`<Image onLoad={...} />`。使用 [Events 定义组件](/modules/module-api#events) 为你的 WebView 定义一个事件。把它称为 `onLoad`。

### Android 视图和模块

在 Android 上，重写 `onPageFinished` 函数。然后调用你在模块中定义的 `onLoad` 事件处理程序。

```kotlin android/src/main/java/expo/modules/webview/ExpoWebView.kt
package expo.modules.webview

import android.content.Context
import android.webkit.WebView
import android.webkit.WebViewClient
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

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

在 `ExpoWebViewModule` 中表明该 `View` 有一个 `onLoad` 事件。

```kotlin android/src/main/java/expo/modules/webview/ExpoWebViewModule.kt
package expo.modules.webview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class ExpoWebViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView::class) {
      Events("onLoad")

      Prop("url") { view: ExpoWebView, url: URL? ->
        view.webView.loadUrl(url.toString())
      }
    }
  }
}
```

### iOS 视图和模块

在 iOS 上，实现 `webView(_:didFinish:)`，并让 `ExpoWebView` 遵循 `WKNavigationDelegate`。然后从该委托方法调用 `onLoad`。

```swift ios/ExpoWebView.swift
import ExpoModulesCore
import WebKit

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

在 `ExpoWebViewModule` 中表明该 `View` 有一个 `onLoad` 事件。

```swift ios/ExpoWebViewModule.swift
import ExpoModulesCore

public class ExpoWebViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWebView")

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
```

### TypeScript 模块

事件载荷包含在事件的 `nativeEvent` 属性中。要从 `onLoad` 事件访问 `url`，请读取 `event.nativeEvent.url`。

```tsx src/ExpoWebView.tsx
import { ViewProps } from 'react-native';
import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

export type OnLoadEvent = {
  url: string;
};

export type Props = {
  url?: string;
  onLoad?: (event: { nativeEvent: OnLoadEvent }) => void;
} & ViewProps;

const NativeView: React.ComponentType<Props> = requireNativeViewManager('ExpoWebView');

export default function ExpoWebView(props: Props) {
  return <NativeView {...props} />;
}
```

### 示例应用

更新示例应用，在页面加载完成时显示一个 alert。复制以下代码，然后重新构建并运行应用，你就会看到这个 alert！

```tsx example/App.tsx
import { WebView } from 'expo-web-view';

export default function App() {
  return (
    <WebView
      style={{ flex: 1 }}
      url="https://expo.dev"
      onLoad={event => alert(`loaded ${event.nativeEvent.url}`)}
    />
  );
}
```

7. **加分项：围绕它构建一个网页浏览器 UI**

既然你已经有了 WebView，就围绕它构建一个网页浏览器 UI。试着重新构建一个浏览器 UI，并在需要时随意添加新的原生能力（例如支持后退或重新加载按钮）。如果需要灵感，请看下面的示例。

<details>
<summary>example/App.tsx</summary>

```tsx App.tsx
import { useState } from 'react';
import { ActivityIndicator, Platform, Text, TextInput, View } from 'react-native';
import { WebView } from 'expo-web-view';

export default function App() {
  const [inputUrl, setInputUrl] = useState('https://docs.expo.dev/modules/');
  const [url, setUrl] = useState(inputUrl);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 80 : 30 }}>
      <TextInput
        value={inputUrl}
        onChangeText={setInputUrl}
        returnKeyType="go"
        autoCapitalize="none"
        onSubmitEditing={() => {
          if (inputUrl !== url) {
            setUrl(inputUrl);
            setIsLoading(true);
          }
        }}
        keyboardType="url"
        style={{
          color: '#fff',
          backgroundColor: '#000',
          borderRadius: 10,
          marginHorizontal: 10,
          paddingHorizontal: 20,
          height: 60,
        }}
      />

      <WebView
        url={url.startsWith('https://') || url.startsWith('http://') ? url : `https://${url}`}
        onLoad={() => setIsLoading(false)}
        style={{ flex: 1, marginTop: 20 }}
      />
      <LoadingView isLoading={isLoading} />
    </View>
  );
}

function LoadingView({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <ActivityIndicator animating={isLoading} color="#fff" style={{ marginRight: 10 }} />
      <Text style={{ color: '#fff' }}>Loading...</Text>
    </View>
  );
}
```

</details>

![围绕我们的 WebView 构建的简单网页浏览器 UI](/static/images/modules/native-view-tutorial/web-browser.webp)

恭喜！你已经为 Android 和 iOS 创建了第一个带原生视图的 Expo 模块。

## 下一步

- [Expo Modules API 参考](/modules/module-api) — 使用 Kotlin 和 Swift 创建原生模块。
- [教程：创建原生模块](/modules/native-module-tutorial) — 使用 Expo Modules API 创建用于持久化设置的原生模块的教程。
