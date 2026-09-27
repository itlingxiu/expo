---
title: Color
description: 在 Expo Router 中以类型安全的方式访问平台特定颜色。
---

# Color

`Color` API 在 Android 和 iOS 上提供对平台特定颜色的类型安全访问。它用完整的 TypeScript 支持包装了 React Native 的 `PlatformColor`，从而为系统颜色提供自动补全和编译期类型检查。

## 用法

```tsx
import { Color } from 'expo-router';
```

`Color` 对象有两个平台特定的命名空间：

- `Color.android.*`：Android 颜色，包括基础颜色、属性和 Material Design 3 颜色
- `Color.ios.*`：来自 UIKit 的 iOS 系统颜色

## Android 颜色

Android 通过 `Color.android` 命名空间提供四类颜色。

### 基础颜色

通过 `Color.android.*` 访问 Android 系统颜色。它们映射到 `@android:color/` 资源。

```tsx
import { Color } from 'expo-router';

// 基础颜色
Color.android.black;
Color.android.white;
Color.android.transparent;

// 背景颜色
Color.android.background_dark;
Color.android.background_light;
```

可用颜色的完整列表见 [Android R.color 文档](https://developer.android.com/reference/android/R.color)。

### 属性颜色

通过 `Color.android.attr.*` 访问 Android 主题属性。它们使用 `?attr/` 语法从当前主题解析颜色。

```tsx
import { Color } from 'expo-router';

// 主题颜色
Color.android.attr.colorPrimary;
Color.android.attr.colorSecondary;
Color.android.attr.colorAccent;
Color.android.attr.colorBackground;
```

更多信息见 [Android R.attr 文档](https://developer.android.com/reference/android/R.attr)。

### Material Design 3 静态颜色

通过 `Color.android.material.*` 访问 Material Design 3 静态颜色。它们使用标准的 Material 3 浅色/深色主题颜色。

```tsx
import { Color } from 'expo-router';

// 主色
Color.android.material.primary;
Color.android.material.onPrimary;
Color.android.material.primaryContainer;
Color.android.material.onPrimaryContainer;

// 表面颜色
Color.android.material.surface;
Color.android.material.onSurface;
```

各颜色角色的更多信息见 [Material Design 3 颜色角色文档](https://m3.material.io/styles/color/roles)。

### Material Design 3 动态颜色

通过 `Color.android.dynamic.*` 访问 Material Design 3 动态颜色。动态颜色会使用 Android 的[动态颜色功能](https://m3.material.io/styles/color/dynamic/user-generated-source)适应用户壁纸，该功能在 Android 12+（API 31+）上可用。

```tsx
import { Color } from 'expo-router';

// 动态颜色适应用户壁纸
Color.android.dynamic.primary;
Color.android.dynamic.onPrimary;
Color.android.dynamic.surface;
Color.android.dynamic.onSurface;
```

可用颜色与 [Material 3 静态颜色](#material-design-3-静态颜色)相同。

### 在 Android 上响应主题变化

Android Material 颜色（静态和动态）都会响应系统的浅色/深色模式。要确保主题变化时组件重新渲染，请使用 React Native 的 `useColorScheme()` hook。

```tsx
import { Color } from 'expo-router';
import { View, Text, useColorScheme } from 'react-native';

function MyComponent() {
  // 系统主题变化时触发重新渲染
  useColorScheme();

  return (
    <View style={{ backgroundColor: Color.android.dynamic.surface }}>
      <Text style={{ color: Color.android.dynamic.onSurface }}>Hello, World!</Text>
    </View>
  );
}
```

如果不使用 `useColorScheme()`，当用户在浅色和深色模式之间切换时，颜色可能不会更新。

> 使用 React Compiler 时这一点尤其重要，它可能会记忆化组件，并在未调用 `useColorScheme()` 时跳过重新渲染。

## iOS 颜色

通过 `Color.ios.*` 访问 iOS 系统颜色。它们直接映射到 UIKit 的[标准颜色](https://developer.apple.com/documentation/uikit/standard-colors)和 [UI 元素颜色](https://developer.apple.com/documentation/uikit/ui-element-colors)。

```tsx
import { Color } from 'expo-router';
import { View, Text } from 'react-native';

function MyComponent() {
  return (
    <View style={{ backgroundColor: Color.ios.systemBackground }}>
      <Text style={{ color: Color.ios.label }}>Hello, World!</Text>
    </View>
  );
}
```

iOS 颜色会自动适应系统外观（浅色/深色模式）和无障碍设置。

## 跨平台用法

`Color` API 是平台特定的。使用 `Platform.select` 为每个平台选择合适的颜色：

```tsx
import { Platform, View, Text } from 'react-native';
import { Color } from 'expo-router';

function MyComponent() {
  const backgroundColor = Platform.select({
    ios: Color.ios.systemBackground,
    android: Color.android.dynamic.surface,
    default: '#000000',
  });

  const textColor = Platform.select({
    ios: Color.ios.label,
    android: Color.android.dynamic.onSurface,
    default: '#FFFFFF',
  });

  return (
    <View style={{ backgroundColor }}>
      <Text style={{ color: textColor }}>Hello, World!</Text>
    </View>
  );
}
```

## API 参考

- [Color API 参考](/versions/latest/sdk/router/color)：可用类型与颜色的完整列表见 Expo Router 的 Color API 参考。
