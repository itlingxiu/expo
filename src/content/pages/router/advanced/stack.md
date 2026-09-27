---
title: Stack
description: 了解如何在 Expo Router 中使用 Stack 导航器。
---

# Stack

> 视频：[在 Expo Router 中使用 Stack 导航器](https://www.youtube.com/watch?v=izZv6a99Roo)。在屏幕之间导航、在屏幕之间传递参数、创建动态路由，并配置屏幕标题与动画。

栈导航器是应用中在路由之间导航的基础方式。在 Android 上，压入栈的路由会动画到当前屏幕之上。在 iOS 上，压入栈的路由会从右侧动画进入。Expo Router 提供 `Stack` 导航组件，它创建导航栈，并允许你在应用中添加新路由。

本指南说明如何在项目中创建 `Stack` 导航器，以及如何自定义单条路由的选项和标题栏。

## 入门

可以用基于文件的路由创建栈导航器。示例文件结构如下：

```text
src/app/_layout.tsx
src/app/index.tsx
src/app/details.tsx
```

该文件结构会生成一个布局，其中 `index` 路由是栈中的第一条路由，导航时 `details` 路由会被压到 `index` 路由之上。

可以用 **src/app/\_layout.tsx** 文件定义包含这两条路由的应用 `Stack` 导航器：

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack />;
}
```

## 屏幕选项与标题栏配置

从 SDK 55 开始，可以使用基于选项的 API 或新的组合组件 API 来配置屏幕选项和标题栏。两种 API 可以在项目中互换使用。

### 静态配置路由选项

可以在布局组件路由中使用 `<Stack.Screen name={routeName} />` 组件，静态配置路由的选项。

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      // 可用 screenOptions 的更多信息见 React Navigation 文档：https://reactnavigation.org/docs/headers/#sharing-common-options-across-screens
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {/* 可选：在路由外部配置静态选项。 */}
      <Stack.Screen name="home" options={{}} />
    </Stack>
  );
}
```

### 配置标题栏

可以用 `screenOptions` 属性为 `Stack` 导航器中的所有路由配置标题栏。这对于为所有路由设置共同的标题栏样式很有用。

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  );
}
```

### 动态设置屏幕选项

要动态配置路由的选项，可以使用组合组件或基于选项的 API。

:::tabs
:::tab 选项 API

```tsx src/app/details.tsx
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Details() {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: params.name,
          headerStyle: { backgroundColor: 'lightblue' },
        }}
      />
      <Text
        onPress={() => {
          router.setParams({ name: 'Updated' });
        }}>
        Update the title
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

:::
:::tab 组合组件

:::warning
屏幕组合 API 处于 [alpha](/more/release-statuses#alpha) 阶段，自 SDK 55 起可用。
:::

```tsx src/app/details.tsx
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Details() {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Title>{params.name}</Stack.Title>
      <Stack.Header style={{ backgroundColor: 'lightblue' }} />
      <Text
        onPress={() => {
          router.setParams({ name: 'Updated' });
        }}>
        Update the title
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

:::
:::

### 可用的标题栏选项

`Stack` 导航器支持全面的标题栏配置选项。标题栏相关选项的完整列表见 [React Navigation 原生栈导航器文档](https://reactnavigation.org/docs/native-stack-navigator)。

更多细节和针对该导航器的示例，见 [React Navigation 原生栈导航器文档](https://reactnavigation.org/docs/native-stack-navigator)。

### 标题按钮

可以用 `headerLeft` 和 `headerRight` 选项或 `<Stack.Toolbar>` 组件向标题栏添加按钮。这些选项接受一个在标题栏中渲染的 React 组件。

- [Stack 工具栏](/router/advanced/stack-toolbar)：配置支持 Liquid Glass 的 iOS 标题栏工具栏。

:::tabs
:::tab 选项 API

```tsx src/app/index.tsx
import { Stack } from 'expo-router';
import { Button, Text, Image, StyleSheet } from 'react-native';
import { useState } from 'react';

function LogoTitle() {
  return (
    <Image style={styles.image} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />
  );
}

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: props => <LogoTitle {...props} />,
          headerRight: () => <Button onPress={() => setCount(c => c + 1)} title="Update count" />,
        }}
      />
      <Text>Count: {count}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
```

:::
:::tab 组合组件

:::warning
屏幕组合 API 处于 [alpha](/more/release-statuses#alpha) 阶段，自 SDK 55 起可用。
:::

```tsx src/app/index.tsx
import { Stack } from 'expo-router';
import { Button, Text, Image, StyleSheet } from 'react-native';
import { useState } from 'react';

function LogoTitle() {
  return (
    <Image style={styles.image} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />
  );
}

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Stack.Title asChild>
        <LogoTitle />
      </Stack.Title>
      <Stack.Toolbar placement="right" asChild>
        <Button onPress={() => setCount(c => c + 1)} title="Update count" />
      </Stack.Toolbar>
      <Text>Count: {count}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
```

:::
:::

### 其他屏幕选项

包括动画、手势和其他配置在内的全部其他屏幕选项，见 [React Navigation 原生栈导航器文档](https://reactnavigation.org/docs/native-stack-navigator)。

更多细节和针对该导航器的示例，见 [React Navigation 原生栈导航器文档](https://reactnavigation.org/docs/native-stack-navigator)。

## 自定义压入行为

默认情况下，当压入栈中已有的路由时，`Stack` 导航器会移除重复屏幕。例如，如果把同一屏幕压入两次，第二次压入会被忽略。可以通过向 `<Stack.Screen>` 提供自定义 `getId()` 函数来更改此压入行为。

例如，下面布局结构中的 `index` 路由显示应用中不同用户资料的列表。让我们把 `[details]` 路由做成[动态路由](/router/basics/notation#方括号)，以便应用用户可以导航查看资料详情。

```text
src/app/_layout.tsx
src/app/index.tsx
src/app/[details].tsx    匹配 '/details1' 这样的动态路径
```

每当应用用户导航到不同资料时，`Stack` 导航器会压入新屏幕，但会失败。如果提供的 `getId()` 函数每次都返回新 ID，则每当应用用户导航到资料时，`Stack` 都会压入新屏幕。

可以在布局组件路由中使用 `<Stack.Screen name="[profile]" getId={}>` 组件来修改压入行为：

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="[profile]"
        getId={
          // 每次返回新 ID 会使每个页面都被压入。
          ({ params }) => String(Date.now())
        }
      />
    </Stack>
  );
}
```

## 移除栈屏幕

可以使用不同的动作来关闭并从栈中移除一条或多条路由。

### `dismiss` 动作

关闭最近栈中的最后一个屏幕。如果当前屏幕是栈中的唯一路由，它会关闭整个栈。

可以选择传入一个正数，以关闭最多该数量的屏幕。

`dismiss` 与 `back` 不同，因为它针对最近的栈，而不是当前导航器。如果有嵌套导航器，调用 `dismiss` 会一次返回多个屏幕。

```tsx src/app/settings.tsx
import { Button, View } from 'react-native';
// 从 Expo Router 导入 useRouter。
import { useRouter } from 'expo-router';

export default function Settings() {
  // 从 useRouter hook 访问 router。
  const router = useRouter();

  const handleDismiss = (count: number) => {
    // 在处理函数中调用 router.dismiss 以返回。
    router.dismiss(count)
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* 在可触摸组件或按钮组件上触发处理函数。 */}
      <Button title="Go to first screen" onPress={() => handleDismiss(3)} />
    </View>
  );
}
```

### `dismissTo` 动作

> `dismissTo` 是在 Expo Router `4.0.8` 中加入的。它的行为类似于 Expo Router v3 中的 `navigation` 函数。

关闭当前 `<Stack />` 中的屏幕，直到到达指定的 `Href`。如果历史记录中没有该 `Href`，则用指定的 `Href` 替换当前屏幕。

例如，考虑 `/one`、`/two`、`/three` 路由的历史，其中 `/three` 是当前路由。动作 `router.dismissTo('/one')` 会使历史返回两次，而 `router.dismissTo('/four')` 会用 `/four` 路由替换当前的 `/three` 路由。

```tsx src/app/settings.tsx
import { Button, View, Text } from 'react-native';
// 从 Expo Router 导入 useRouter。
import { useRouter } from 'expo-router';

export default function Settings() {
  // 从 useRouter hook 访问 router。
  const router = useRouter();

  const handleDismissAll = () => {
    // 在处理函数中调用 router.dismissTo，以返回到特定路由。
    router.dismissTo('/')
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* 在可触摸组件或按钮组件上触发处理函数。 */}
      <Button title="Go to first screen" onPress={handleDismissAll} />
    </View>
  );
}
```

### `dismissAll` 动作

返回最近栈中的第一个屏幕。这类似于 [`popToTop`](https://reactnavigation.org/docs/stack-actions/#poptotop) 栈动作。

例如，`home` 路由是第一个屏幕，`settings` 是最后一个。要从 `settings` 到 `home` 路由，必须先回到 `details`。不过，使用 `dismissAll` 动作，可以从 `settings` 到 `home`，并关闭中间的任何屏幕。

```tsx src/app/settings.tsx
import { Button, View, Text } from 'react-native';
// 从 Expo Router 导入 useRouter。
import { useRouter } from 'expo-router';

export default function Settings() {
  // 从 useRouter hook 访问 router。
  const router = useRouter();

  const handleDismissAll = () => {
    // 在处理函数中调用 router.dismissAll，以返回栈中的第一个屏幕。
    router.dismissAll()
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* 在可触摸组件或按钮组件上触发处理函数。 */}
      <Button title="Go to first screen" onPress={handleDismissAll} />
    </View>
  );
}
```

### `canDismiss` 动作

检查是否可以关闭当前屏幕。如果 router 位于栈中，且该栈的历史中有不止一个屏幕，则返回 `true`。

```tsx src/app/settings.tsx
import { Button, View } from 'react-native';
// 从 Expo Router 导入 useRouter。
import { useRouter } from 'expo-router';

export default function Settings() {
  // 从 useRouter hook 访问 router。
  const router = useRouter();

  const handleDismiss = (count: number) => {
    // 检查是否可以关闭。
    if (router.canDismiss()) {
      // 在处理函数中调用 router.dismiss 以返回。
      router.dismiss(count)
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* 在可触摸组件或按钮组件上触发处理函数。 */}
      <Button title="Maybe dismiss" onPress={() => handleDismiss()} />
    </View>
  );
}
```

## iOS 26 Liquid Glass 标题栏

从 iOS 26 开始，导航标题栏默认采用系统的 “Liquid Glass” 效果。无法按屏幕禁用它，因此需要使用全局配置退出。

### 方法 1：使用 `UIDesignRequiresCompatibility`

:::note
不支持在 Expo Go 中使用。此方法是临时变通方案。从 iOS 27 起，Apple 将移除此选项，你将无法退出 Liquid Glass 效果。
:::

创建[开发构建](/develop/development-builds/introduction#选择构建开发构建的方式)，并在[应用配置](/workflow/configuration)中把 [`UIDesignRequiresCompatibility`](https://developer.apple.com/documentation/BundleResources/Information-Property-List/UIDesignRequiresCompatibility) 属性设为 `true`：

```json app.json
{
  "ios": {
    "infoPlist": {
      "UIDesignRequiresCompatibility": true
    }
  }
}
```

### 方法 2：使用基于 JavaScript 的导航栈

把原生栈换成 `expo-router/js-stack` 提供的 JavaScript 驱动栈。这让你可以完全控制标题栏 UI，代价是失去高度优化的 iOS 导航视图和控制器带来的性能优势：

```tsx src/app/_layout.tsx
import { Stack as JsStack } from 'expo-router/js-stack';

export default function Layout() {
  return <JsStack />;
}
```

`expo-router/js-stack` 入口是 SDK 56 对 `@react-navigation/stack` 库的替代。更多信息见 [SDK 55 到 56 迁移指南](/router/migrate/sdk-55-to-56)。

## 常见问题

<details>
<summary>滚动时大标题不折叠</summary>

当 `headerLargeTitle: true`（或 `<Stack.Title large>`）与 `ScrollView` 或 `FlatList` 一起使用时，大标题在滚动时可能不会折叠。当可滚动视图不是屏幕组件的直接第一个子项时，就会发生这种情况。

要修复，请确保 `ScrollView` 或 `FlatList` 是屏幕组件渲染的第一个子项。如果需要包装器，请在其上设置 `collapsable={false}`：

```tsx src/app/index.tsx
import { Stack } from 'expo-router';
import { ScrollView, View, Text } from 'react-native';

// 正确：ScrollView 是直接的第一个子项
export default function Home() {
  return (
    <ScrollView>
      <Stack.Title large>Home</Stack.Title>
      <Text>Content here</Text>
    </ScrollView>
  );
}
```

如果需要包裹 `ScrollView`，请在包装器上设置 `collapsable={false}`：

```tsx src/app/index.tsx
import { Stack } from 'expo-router';
import { ScrollView, View, Text } from 'react-native';

export default function Home() {
  return (
    // 在 ScrollView 周围的任何包装器上设置 collapsable={false}
    <View collapsable={false}>
      <ScrollView>
        <Stack.Title large>Home</Stack.Title>
        <Text>Content here</Text>
      </ScrollView>
    </View>
  );
}
```

</details>

<details>
<summary>在屏幕之间导航时闪现白色背景</summary>

屏幕过渡之间出现白色闪烁，通常意味着导航栈使用浅色背景，而应用使用深色主题。

要修复，用 Expo Router 的 `<ThemeProvider>` 包裹根布局，并传入合适的主题：

```tsx src/app/_layout.tsx
import { ThemeProvider, DarkTheme, DefaultTheme, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // 用 ThemeProvider 包裹布局，为所有屏幕设置背景
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack />
    </ThemeProvider>
  );
}
```

对于始终使用深色主题的应用：

```tsx src/app/_layout.tsx
import { ThemeProvider, DarkTheme, Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack />
    </ThemeProvider>
  );
}
```

</details>
