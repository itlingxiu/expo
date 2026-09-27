---
title: 教程：创建原生模块
description: 使用 Expo Modules API 创建用于持久化设置的原生模块的教程。
---

# 教程：创建原生模块

在本教程中，你将构建一个存储用户首选应用主题的模块：深色、浅色或跟随系统。在 Android 上使用 [`SharedPreferences`](https://developer.android.com/reference/android/content/SharedPreferences)，在 iOS 上使用 [`UserDefaults`](https://developer.apple.com/documentation/foundation/userdefaults)。你可以用 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 实现 Web 支持，但本教程不涵盖这一点。

> 视频：[Watch: How to create a native module with the Expo Modules API](https://www.youtube.com/watch?v=CdaQSlyGik8)
>
> 构建一个原生模块，在 Android 上使用 SharedPreferences、在 iOS 上使用 UserDefaults 来持久化用户设置。

1. **初始化新模块**

首先创建一个新模块。在本教程中，模块名为 `expo-settings` 或 `ExpoSettings`。你可以选择不同的名称，但请把说明调整为与你的选择一致。

:::tabs
:::tab npm
```sh
$ npx create-expo-module expo-settings
```
:::
:::tab yarn
```sh
$ yarn create expo-module expo-settings
```
:::
:::tab pnpm
```sh
$ pnpm create expo-module expo-settings
```
:::
:::tab bun
```sh
$ bun create expo-module expo-settings
```
:::
:::

:::note
因为你并不会真正发布这个库，可以对所有提示按 **Return** 以接受默认值。
:::

2. **设置工作区**

清理默认模块，从一个干净的起点开始。删除视图模块，因为本指南不使用它。

```sh
$ cd expo-settings
$ rm ios/ExpoSettingsView.swift
$ rm android/src/main/java/expo/modules/settings/ExpoSettingsView.kt
$ rm src/ExpoSettingsView.tsx
$ rm src/ExpoSettingsView.web.tsx src/ExpoSettingsModule.web.ts
```

找到以下文件，并用提供的最小样板替换它们的内容：

```kotlin android/src/main/java/expo/modules/settings/ExpoSettingsModule.kt
package expo.modules.settings

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoSettingsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    Function("getTheme") {
      return@Function "system"
    }
  }
}
```

```swift ios/ExpoSettingsModule.swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    Function("getTheme") { () -> String in
      "system"
    }
  }
}
```

```ts src/ExpoSettings.types.ts
export type ExpoSettingsModuleEvents = {};
```

```ts src/ExpoSettingsModule.ts
import { NativeModule, requireNativeModule } from 'expo';

import { ExpoSettingsModuleEvents } from './ExpoSettings.types';

declare class ExpoSettingsModule extends NativeModule<ExpoSettingsModuleEvents> {
  getTheme: () => string;
}

// 此调用从 JSI 加载原生模块对象。
export default requireNativeModule<ExpoSettingsModule>('ExpoSettings');
```

```ts src/index.ts
import ExpoSettingsModule from './ExpoSettingsModule';

export function getTheme(): string {
  return ExpoSettingsModule.getTheme();
}
```

```tsx example/App.tsx
import * as Settings from 'expo-settings';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Theme: {Settings.getTheme()}</Text>
    </View>
  );
}
```

3. **运行示例项目**

启动 TypeScript 编译器以监视更改。

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

在另一个终端窗口中运行示例应用。

:::tabs
:::tab npm
```sh
$ cd example
# 在 Android 上运行示例应用
$ npx expo run:android
# 在 iOS 上运行示例应用
$ npx expo run:ios
```
:::
:::tab yarn
```sh
$ cd example
# 在 Android 上运行示例应用
$ yarn expo run:android
# 在 iOS 上运行示例应用
$ yarn expo run:ios
```
:::
:::tab pnpm
```sh
$ cd example
# 在 Android 上运行示例应用
$ pnpm expo run:android
# 在 iOS 上运行示例应用
$ pnpm expo run:ios
```
:::
:::tab bun
```sh
$ cd example
# 在 Android 上运行示例应用
$ bun expo run:android
# 在 iOS 上运行示例应用
$ bun expo run:ios
```
:::
:::

启动示例应用时，你应该会在屏幕中央看到文本 “Theme: system”。值 `"system"` 来自同步调用原生模块中的 `getTheme()` 函数。你将在下一步更改此值。

4. **获取、设置并持久化主题偏好值**

### Android 原生模块

要读取该值，请查找键 `"theme"` 下的 `SharedPreferences` 字符串。如果该键不存在，则默认为 `"system"`。使用 `reactContext`（一个 React Native 的 [ContextWrapper](https://developer.android.com/reference/android/content/ContextWrapper)），通过 `getSharedPreferences()` 访问 `SharedPreferences` 实例。

要设置该值，使用 `SharedPreferences` 的 `edit()` 方法获取 `Editor` 实例。然后使用 `putString()` 设置值。确保 `setTheme` 函数接受 `String` 类型的值。

```kotlin android/src/main/java/expo/modules/settings/ExpoSettingsModule.kt
package expo.modules.settings

import android.content.Context
import android.content.SharedPreferences
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoSettingsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    Function("setTheme") { theme: String ->
      getPreferences().edit().putString("theme", theme).commit()
    }

    Function("getTheme") {
      return@Function getPreferences().getString("theme", "system")
    }
  }

  private val context
  get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".settings", Context.MODE_PRIVATE)
  }
}
```

### iOS 原生模块

要在 iOS 上读取该值，请查找键 `"theme"` 下的 `UserDefaults` 字符串。如果该键不存在，则默认为 `"system"`。

要设置该值，使用 `UserDefaults` 的 `set(_:forKey:)` 方法。确保 `setTheme` 函数接受 `String` 类型的值。

```swift ios/ExpoSettingsModule.swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    Function("setTheme") { (theme: String) -> Void in
      UserDefaults.standard.set(theme, forKey:"theme")
    }

    Function("getTheme") { () -> String in
      UserDefaults.standard.string(forKey: "theme") ?? "system"
    }
  }
}
```

### TypeScript 模块

更新 **ExpoSettingsModule.ts**，为 `ExpoSettingsModule` 原生模块添加 TypeScript 接口，以便更新主题。

```ts src/ExpoSettingsModule.ts
import { NativeModule, requireNativeModule } from 'expo';

import { ExpoSettingsModuleEvents } from './ExpoSettings.types';

declare class ExpoSettingsModule extends NativeModule<ExpoSettingsModuleEvents> {
  setTheme: (theme: string) => void;
  getTheme: () => string;
}

// 此调用从 JSI 加载原生模块对象。
export default requireNativeModule<ExpoSettingsModule>('ExpoSettings');
```

现在，从 TypeScript 调用你的原生模块。

```ts src/index.ts
import ExpoSettingsModule from './ExpoSettingsModule';

export function getTheme(): string {
  return ExpoSettingsModule.getTheme();
}

export function setTheme(theme: string): void {
  return ExpoSettingsModule.setTheme(theme);
}
```

### 示例应用

现在可以在示例应用中使用 Settings API。

```tsx example/App.tsx
import * as Settings from 'expo-settings';
import { Button, Text, View } from 'react-native';

export default function App() {
  const theme = Settings.getTheme();
  // 在深色和浅色主题之间切换
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Theme: {Settings.getTheme()}</Text>
      <Button title={`Set theme to ${nextTheme}`} onPress={() => Settings.setTheme(nextTheme)} />
    </View>
  );
}
```

重新构建并运行应用时，主题仍然是 “system”。按下按钮似乎没有反应，但重新加载应用后主题会改变。这是因为应用没有获取新的主题值，也没有重新渲染。你将在下一步修复这一点。

5. **为主题值发出变更事件**

通过在值更新时发出变更事件，确保使用你的 API 的开发者能够响应主题值的变化。使用 [Events](/modules/module-api#events) 定义组件来描述模块发出的事件，使用 `sendEvent` 从原生代码发出事件，并使用 [EventEmitter](/modules/module-api#发送事件) API 在 JavaScript 中订阅事件。事件载荷是 `{ theme: string }`。

### Android 原生模块

在 Android 上，事件载荷表示为 [`Bundle`](https://developer.android.com/reference/android/os/Bundle.html) 实例，你可以使用 [`bundleOf`](https://developer.android.com/reference/kotlin/androidx/core/os/package-summary#bundleOf(kotlin.Array)) 函数创建它。

```kotlin android/src/main/java/expo/modules/settings/ExpoSettingsModule.kt
package expo.modules.settings

import android.content.Context
import android.content.SharedPreferences
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoSettingsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { theme: String ->
      getPreferences().edit().putString("theme", theme).commit()
      this@ExpoSettingsModule.sendEvent("onChangeTheme", bundleOf("theme" to theme))
    }

    Function("getTheme") {
      return@Function getPreferences().getString("theme", "system")
    }
  }

  private val context
  get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".settings", Context.MODE_PRIVATE)
  }
}
```

### iOS 原生模块

```swift ios/ExpoSettingsModule.swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { (theme: String) -> Void in
      UserDefaults.standard.set(theme, forKey:"theme")
      sendEvent("onChangeTheme", [
        "theme": theme
      ])
    }

    Function("getTheme") { () -> String in
      UserDefaults.standard.string(forKey: "theme") ?? "system"
    }
  }
}
```

### TypeScript 模块

```ts src/ExpoSettings.types.ts
export type ThemeChangeEvent = {
  theme: string;
};

export type ExpoSettingsModuleEvents = {
  onChangeTheme: (params: ThemeChangeEvent) => void;
};
```

```ts src/index.ts
import { EventSubscription } from 'expo-modules-core';
import ExpoSettingsModule from './ExpoSettingsModule';
import { ThemeChangeEvent } from './ExpoSettings.types';

export function addThemeListener(listener: (event: ThemeChangeEvent) => void): EventSubscription {
  return ExpoSettingsModule.addListener('onChangeTheme', listener);
}

export function getTheme(): string {
  return ExpoSettingsModule.getTheme();
}

export function setTheme(theme: string): void {
  return ExpoSettingsModule.setTheme(theme);
}
```

### 示例应用

```tsx example/App.tsx
import * as Settings from 'expo-settings';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function App() {
  const [theme, setTheme] = useState<string>(Settings.getTheme());

  useEffect(() => {
    const subscription = Settings.addThemeListener(({ theme: newTheme }) => {
      setTheme(newTheme);
    });

    return () => subscription.remove();
  }, [setTheme]);

  // 在深色和浅色主题之间切换
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Theme: {Settings.getTheme()}</Text>
      <Button title={`Set theme to ${nextTheme}`} onPress={() => Settings.setTheme(nextTheme)} />
    </View>
  );
}
```

6. **用枚举提高类型安全**

以当前形式使用 `Settings.setTheme()` API 很容易出错，因为它允许任意字符串值。使用枚举把可能的值限制为 `system`、`light` 和 `dark`，以提高此 API 的类型安全。

### Android 原生模块

```kotlin android/src/main/java/expo/modules/settings/ExpoSettingsModule.kt
package expo.modules.settings

import android.content.Context
import android.content.SharedPreferences
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.types.Enumerable

class ExpoSettingsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { theme: Theme ->
      getPreferences().edit().putString("theme", theme.value).commit()
      this@ExpoSettingsModule.sendEvent("onChangeTheme", bundleOf("theme" to theme.value))
    }

    Function("getTheme") {
      return@Function getPreferences().getString("theme", Theme.SYSTEM.value)
    }
  }

  private val context
  get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".settings", Context.MODE_PRIVATE)
  }
}

enum class Theme(val value: String) : Enumerable {
  LIGHT("light"),
  DARK("dark"),
  SYSTEM("system")
}
```

### iOS 原生模块

```swift ios/ExpoSettingsModule.swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { (theme: Theme) -> Void in
      UserDefaults.standard.set(theme.rawValue, forKey:"theme")
      sendEvent("onChangeTheme", [
        "theme": theme.rawValue
      ])
    }

    Function("getTheme") { () -> String in
      UserDefaults.standard.string(forKey: "theme") ?? Theme.system.rawValue
    }
  }

  enum Theme: String, Enumerable {
    case light
    case dark
    case system
  }
}
```

### TypeScript 模块

```ts src/ExpoSettings.types.ts
export type Theme = 'light' | 'dark' | 'system';

export type ThemeChangeEvent = {
  theme: Theme;
};

export type ExpoSettingsModuleEvents = {
  onChangeTheme: (params: ThemeChangeEvent) => void;
};
```

```ts src/ExpoSettingsModule.ts
import { NativeModule, requireNativeModule } from 'expo';

import { ExpoSettingsModuleEvents, Theme } from './ExpoSettings.types';

declare class ExpoSettingsModule extends NativeModule<ExpoSettingsModuleEvents> {
  setTheme: (theme: Theme) => void;
  getTheme: () => Theme;
}

// 此调用从 JSI 加载原生模块对象。
export default requireNativeModule<ExpoSettingsModule>('ExpoSettings');
```

```ts src/index.ts
import { EventSubscription } from 'expo-modules-core';

import ExpoSettingsModule from './ExpoSettingsModule';

import { Theme, ThemeChangeEvent } from './ExpoSettings.types';

export function addThemeListener(listener: (event: ThemeChangeEvent) => void): EventSubscription {
  return ExpoSettingsModule.addListener('onChangeTheme', listener);
}

export function getTheme(): Theme {
  return ExpoSettingsModule.getTheme();
}

export function setTheme(theme: Theme): void {
  return ExpoSettingsModule.setTheme(theme);
}
```

### 示例应用

如果把 `Settings.setTheme(nextTheme)` 改成 `Settings.setTheme("not-a-real-theme")`，TypeScript 会报错。如果忽略该错误并按下按钮，你会看到以下运行时错误：

```text
 ERROR  Error: FunctionCallException: Calling the 'setTheme' function has failed (at ExpoModulesCore/SyncFunctionComponent.swift:76)
→ Caused by: ArgumentCastException: Argument at index '0' couldn't be cast to type Enum<Theme> (at ExpoModulesCore/JavaScriptUtils.swift:41)
→ Caused by: EnumNoSuchValueException: 'not-a-real-theme' is not present in Theme enum, it must be one of: 'light', 'dark', 'system' (at ExpoModulesCore/Enumerable.swift:37)
```

错误信息的最后一行表明，`not-a-real-theme` 不是 `Theme` 枚举的有效值。唯一有效的值是 `light`、`dark` 和 `system`。

恭喜！你已经为 Android 和 iOS 创建了第一个 Expo 模块。

## 下一步

- [Expo Modules API 参考](/modules/module-api) — 使用 Kotlin 和 Swift 创建原生模块。
- [教程：创建原生视图](/modules/native-view-tutorial) — 使用 Expo Modules API 创建原生视图的教程。
