---
title: 添加导航
description: 在本章中，学习如何为 Expo 应用添加导航。
---

# 添加导航

本章将学习 Expo Router 的基础知识 —— 实现堆栈导航（stack navigation）以及一个带两个标签的底部标签栏。

[观看视频：为你的通用 Expo 应用添加导航](https://www.youtube.com/watch?v=8336fcFV_T4) —— 使用 Expo Router 进行文件式路由、页面之间的堆栈导航，以及构建底部标签栏。

## Expo Router 基础

Expo Router 是一个面向 React Native 和 Web 应用的文件式路由框架，负责页面之间的导航，并在各平台使用共享组件。

- **app 目录**：特殊目录，只存放路由和布局；其中的文件会变成原生屏幕和 Web 页面。默认位置是 **src/app**。
- **根布局（Root layout）**：**src/app/_layout.tsx**，定义跨路由共享的 UI（例如页眉和标签栏），保证各路由风格一致。
- **文件命名约定**：**index.tsx** 之类的 index 文件匹配其父目录本身，不增加路径段；**src/app/index.tsx** 匹配 `/` 路由。
- 路由文件以默认导出（default export）的方式导出一个 React 组件；扩展名可以是 `.js`、`.jsx`、`.ts` 或 `.tsx`。
- Android、iOS 和 Web 共享同一套导航结构。

:::note
以上内容足以开始；完整的特性列表见 [Expo Router 介绍](/router/introduction)。
:::

## 在堆栈中添加新页面

在 **src/app** 中创建 **about.tsx**，用于在 `/about` 路由显示页面名称。

```tsx src/app/about.tsx
import { Text, View, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
```

在 **src/app/_layout.tsx** 中：(1) 添加一个 `<Stack.Screen />`，通过 `options` prop 设置 `/about` 的标题；(2) 通过 `options` 把 `/index` 的标题更新为 `Home`。

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
    </Stack>
  );
}
```

### 什么是堆栈（Stack）？

堆栈导航器（stack navigator）是页面间导航的基础。在 Android 上，压入堆栈的路由动画叠加在当前屏幕之上；在 iOS 上则从右侧滑入。Expo Router 提供 `Stack` 组件，用于创建包含新路由的导航堆栈。

## 在页面之间导航

使用 Expo Router 的 `Link` 组件从 `/index` 跳转到 `/about`；它渲染一个带 `href` prop 的 `<Text>`。

步骤：在 **src/app/index.tsx** 中从 `expo-router` 导入 `Link`；在 `<Text>` 之后添加一个 `Link`，`href` 设为 `/about`；用 `fontSize`、`textDecorationLine` 和 `color` 设置样式（`Link` 接受与 `<Text>` 相同的 props）。

```tsx src/app/index.tsx
import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/about" style={styles.button}>
        Go to About screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
```

查看应用，点击 `Link` 即可到达 `/about` 路由。

## 添加 not-found 路由

使用 `+not-found` 路由作为不存在路由的兜底：在移动端避免应用崩溃，在 Web 端替代 404 页面。Expo Router 使用特殊的 **+not-found.tsx** 文件。

步骤：在 **src/app** 中创建 **+not-found.tsx**，包含一个 `NotFoundScreen` 组件；为 `Stack.Screen` 添加 `options` 设置自定义标题；添加一个指向 `/` 的 `Link` 作为兜底路由。

```tsx src/app/+not-found.tsx
import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
```

测试方法：在浏览器中访问 `http://localhost:8081/123`（浏览器里修改路径很方便），应能看到 `NotFoundScreen`。

## 添加底部标签导航器

当前 **src/app** 的文件结构：

- `_layout.tsx` —— 根布局
- `index.tsx` —— 匹配 `/` 路由
- `about.tsx` —— 匹配 `/about` 路由
- `+not-found.tsx` —— 匹配任意 404 路由

计划：添加一个底部标签导航器，复用 Home 和 About 组成标签布局（X、BlueSky 等应用中的常见样式），同时把堆栈导航器保留在根布局中，让 `+not-found` 显示在嵌套导航器之上。

步骤：(1) 在 **src/app** 中添加 **(tabs)** 子目录，用于分组显示在底部标签栏中的路由；(2) 创建 **(tabs)/_layout.tsx** 作为标签布局，与根布局分开；(3) 把 **index.tsx** 和 **about.tsx** 移入 **(tabs)**。

移动后的结构：

- `_layout.tsx` —— 根布局
- `+not-found.tsx` —— 任意 404 路由
- `(tabs)/_layout.tsx` —— 标签布局
- `(tabs)/index.tsx` —— 匹配 `/` 路由
- `(tabs)/about.tsx` —— 匹配 `/about` 路由

更新根布局代码：

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

标签布局代码：

```tsx src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="about" options={{ title: 'About' }} />
    </Tabs>
  );
}
```

查看应用即可看到新的底部标签。

## 安装 @expo/vector-icons

先按 `Ctrl + C` 停止开发服务器，然后安装：

:::tabs
:::tab npm
```sh
npx expo install @expo/vector-icons
```
:::
:::tab yarn
```sh
yarn expo install @expo/vector-icons
```
:::
:::tab pnpm
```sh
pnpm expo install @expo/vector-icons
```
:::
:::tab bun
```sh
bun expo install @expo/vector-icons
```
:::
:::

安装完成后用 `npx expo start` 重启服务器。

## 更新底部标签导航器的外观

现在的问题：标签导航器在各平台长得一样，与应用风格不符 —— 例如标签栏/页眉没有自定义图标，标签栏背景色也不匹配。

修改 **src/app/(tabs)/_layout.tsx**：

1. 从 [`@expo/vector-icons`](/guides/icons#expovector-icons) 导入 `Ionicons` 图标集（一个流行的图标集库）。
2. 为两个路由添加 `tabBarIcon` —— 接收 `focused` 和 `color` 的函数，渲染对应图标；图标名可以从图标集中选择。
3. 添加 `screenOptions.tabBarActiveTintColor` 设为 `#ffd33d`，重新着色激活的图标与标签文字。

```tsx src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'information-circle' : 'information-circle-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
```

进一步的 `screenOptions` 配置：

```tsx src/app/(tabs)/_layout.tsx
screenOptions={{
  tabBarActiveTintColor: '#ffd33d',
  headerStyle: {
    backgroundColor: '#25292e',
  },
  headerShadowVisible: false,
  headerTintColor: '#fff',
  tabBarStyle: {
    backgroundColor: '#25292e',
  },
}}
```

说明：

- 通过 `headerStyle` 设置页眉背景色，用 `headerShadowVisible` 关闭阴影；
- `headerTintColor` 把页眉文字设为 `#fff`；
- `tabBarStyle.backgroundColor` 把标签栏背景设为 `#25292e`。

现在应用有了自定义的底部标签导航器。

## 本章小结

第二章：添加导航。

我们成功添加了堆栈导航器和标签导航器。下一章将构建应用的第一个界面。

[下一章：第三章 构建界面](/tutorial/build-a-screen)
