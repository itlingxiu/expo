---
title: 安全区域
description: 了解如何在 Expo 项目中为页面组件添加安全区域。
---

# 安全区域

安全区域（safe areas）让应用页面内容被正确放置，避免被硬件或操作系统的界面元素遮挡 —— 例如刘海（notch）、状态栏、Home 指示条。被遮挡的内容会被这些界面元素遮住。例如，Android 上内容会被状态栏盖住；在 iOS 上，同样的内容会被圆角、刘海与状态栏覆盖。

## 使用 `react-native-safe-area-context` 库

该库（[react-native-safe-area-context](https://github.com/AppAndFlow/react-native-safe-area-context)）为 Android 与 iOS 的安全区域 insets 提供了灵活的 API，还提供一个可以替代 `<View>`、自动处理安全区域的 `SafeAreaView` 组件。

### 安装

如果项目来自默认模板，可以跳过安装 —— 该库作为 Expo Router 的 peer dependency 随附。否则：

```sh
# npm
npx expo install react-native-safe-area-context

# yarn
yarn expo install react-native-safe-area-context

# pnpm
pnpm expo install react-native-safe-area-context

# bun
bun expo install react-native-safe-area-context
```

### 用法

`SafeAreaView` 包裹页面内容；它就像一个普通的 `<View>`，把 insets 应用为额外的内边距或外边距。

```tsx src/app/index.tsx
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Content is in safe area.</Text>
    </SafeAreaView>
  );
}
```

#### 使用其他 Expo 模板且没有安装 Expo Router？

在页面组件中使用 `SafeAreaView` 之前，先在根组件文件（例如 App.tsx）中添加 `SafeAreaProvider`。

```tsx App.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Your app content */}
    </SafeAreaProvider>
  );
}
```

## 替代方案：`useSafeAreaInsets` Hook

除了 `SafeAreaView`，`useSafeAreaInsets` Hook 可以直接访问 insets，从而按 `<View>` 的每条边分别应用内边距。下面的示例用 `insets.top` 应用顶部内边距。

```tsx src/app/index.tsx
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Text>Content is in safe area.</Text>
    </View>
  );
}
```

该 Hook 返回：

```ts
{
  top: number,
  right: number,
  bottom: number,
  left: number
}
```

## 更多信息

### 最小示例

使用该 Hook 应用顶部内边距的最小可运行示例：

```tsx Using react-native-safe-area-context
import { Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Text style={{ fontSize: 28 }}>Content is in safe area.</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}
```

### 与 React Navigation 配合使用

React Navigation 默认支持安全区域，并把 `react-native-safe-area-context` 列为 peer dependency。参见 [React Navigation 安全区域指南](https://reactnavigation.org/docs/handling-safe-area/)。

### 在 Web 上使用

对于 Web 目标，按照上面用法一节配置 `SafeAreaProvider`；服务端渲染（SSR）请参考该库的 [Web SSR](https://appandflow.github.io/react-native-safe-area-context/optimizations#web-ssr) 章节。

相关 API 文档：[SafeAreaView](https://appandflow.github.io/react-native-safe-area-context/api/safe-area-view)、[SafeAreaProvider](https://appandflow.github.io/react-native-safe-area-context/api/safe-area-provider)、[useSafeAreaInsets](https://appandflow.github.io/react-native-safe-area-context/api/use-safe-area-insets)。
