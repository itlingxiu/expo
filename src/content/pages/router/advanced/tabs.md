---
title: JavaScript 标签页
description: 了解如何在 Expo Router 中使用 JavaScript 标签页布局（React Navigation 底部标签页）。
---

# JavaScript 标签页

> 视频：[在 Expo Router 中使用 JavaScript 标签页导航器](https://www.youtube.com/watch?v=BElPB4Ai3j0)。配置标签图标、嵌套导航器，并管理导航历史。

标签页是在应用不同部分之间导航的常见方式。Expo Router 提供标签页布局，帮助你在应用底部创建标签栏。最快的上手方式是使用模板。请参阅[快速开始安装](/router/introduction#quick-start)。

## 多种标签页布局

Expo Router 提供三种标签页导航器：

- **JavaScript 标签页**：用 React Navigation 的底部标签页实现，如果你已经用过 React Navigation，API 会很熟悉。
- **原生标签页**：使用平台的原生标签栏，提供原生外观和手感。
- **自定义标签页**：提供来自 `expo-router/ui` 的无界面标签页组件，用于构建完全自定义的标签页布局，以实现复杂的 UI 模式。

本指南介绍 **JavaScript 标签页**布局。其他标签页布局见：

- [原生标签页](/router/advanced/native-tabs)：如果希望标签栏具有原生外观和手感，请参阅原生标签页。
- [自定义标签页](/router/advanced/custom-tabs)：如果应用需要系统标签页无法实现的完全自定义设计，请参阅自定义标签页。

## JavaScript 标签页入门

可以用基于文件的路由创建标签页布局。示例文件结构如下：

```text
src/app/_layout.tsx
src/app/(tabs)/_layout.tsx
src/app/(tabs)/index.tsx
src/app/(tabs)/settings.tsx
```

该文件结构会生成一个在屏幕底部带有标签栏的布局。标签栏有两个标签：**Home** 和 **Settings**：

![带有 Home 和 Settings 两个标签的标签栏截图](/static/images/expo-router/tabs.webp)

可以用 **src/app/\_layout.tsx** 文件定义应用的根布局：

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

**(tabs)** 目录是一个特殊目录名，它告诉 Expo Router 使用 `Tabs` 布局。

从文件结构来看，**(tabs)** 目录有三个文件。第一个是 **(tabs)/\_layout.tsx**。这是标签栏和每个标签的主布局文件。在其中可以控制标签栏和每个标签按钮的外观与行为。

```tsx src/app/(tabs)/_layout.tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

最后是构成标签内容的两个标签文件：**src/app/(tabs)/index.tsx** 和 **src/app/(tabs)/settings.tsx**。

```tsx src/app/(tabs)/index.tsx & src/app/(tabs)/settings.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab [Home|Settings]</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

名为 **index.tsx** 的标签文件是应用加载时的默认标签。第二个标签文件 **settings.tsx** 展示了如何向标签栏添加更多标签。

## 标签栏选项

Expo Router 中的 JavaScript 标签页扩展了 React Navigation 的[底部标签页导航器](https://reactnavigation.org/docs/bottom-tab-navigator)。可用的具体 API 取决于你的版本。例如，Expo Router v6 扩展了底部标签页导航器 v7。请核对版本以确保兼容，然后可以使用相同的配置属性自定义底部标签栏和单个标签。例如：

```tsx src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={
        {
          // 在这里应用到所有标签
        }
      }>
      <Tabs.Screen
        name="index"
        options={
          {
            // 或在这里应用到单个标签
          }
        }
      />
    </Tabs>
  );
}
```

支持的标签栏选项与 React Navigation 底部标签页导航器相同。更多细节和针对该导航器的示例，见 [React Navigation 底部标签页导航器文档](https://reactnavigation.org/docs/bottom-tab-navigator/#options)。

## 高级

### 隐藏某个标签

有时你希望某条路由存在，但不显示在标签栏中。可以传入 `href: null` 来禁用该按钮：

```tsx src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          /* @info 在此标签的 options 中添加 `href: null`，该标签就不会显示在标签栏中。*/
          href: null,
          /* @end */
        }}
      />
    </Tabs>
  );
}
```

### 动态路由

可以在标签栏中使用动态路由。例如，有一个显示用户资料的 `[user]` 标签。可以用 `href` 选项链接到某个特定用户的资料。

```tsx src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        // 动态路由的名称。
        name="[user]"
        options={{
          // 确保该标签始终链接到同一个 href。
          href: '/evanbacon',
          // 或者可以使用 href 对象。
          href: {
            pathname: '/[user]',
            params: {
              user: 'evanbacon',
            },
          },
        }}
      />
    </Tabs>
  );
}
```

> **注意**：在标签布局中添加动态路由时，请确保所定义的动态路由是唯一的。不能为同一条动态路由设置两个屏幕。例如，不能有两个 `[user]` 标签。如果需要多条动态路由，请创建自定义导航器。
