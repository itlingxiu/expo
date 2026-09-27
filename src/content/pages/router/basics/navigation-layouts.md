---
title: Expo Router 中的导航布局
description: 了解如何通过目录和布局文件，在页面之间构建不同的关系。
---

# Expo Router 中的导航布局

> 视频：[Expo Router 布局文件简介](https://www.youtube.com/watch?v=Yh6Qlg2CYwQ)。什么是布局文件、如何在屏幕之间导航，以及如何用重定向阻止访问。

**src/app** 目录中的每个目录（包括 **src/app** 本身）都可以用该目录内的 **\_layout.tsx** 文件定义布局。此文件定义该目录中所有页面的排列方式。你可以在这里定义栈导航器、标签页导航器、抽屉导航器，或希望用于该目录中页面的任何其他布局。布局文件导出一个默认组件，它会在你导航到该目录内的任何页面之前渲染。

下面看几种常见的布局场景。

## 根布局

几乎每个应用都会在 **src/app** 目录中直接有一个 **\_layout.tsx** 文件。这是根布局，代表导航的入口。除了描述应用的顶层导航器之外，以前可能放在 **App.jsx** 中的初始化代码也放在这里，例如加载字体、与启动屏交互，或添加 context provider。

下面是一个根布局示例：

```tsx src/app/_layout.tsx
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <Stack />;
}
```

上面的示例最初显示启动屏，字体加载完成后渲染栈导航器，应用随后会进入初始路由。

## 栈

可以像上面那样在根布局中实现栈导航器，也可以在目录内的任何其他布局文件中实现。假设文件结构中某个目录内有一个栈：

```text
src/app/products/_layout.tsx
src/app/products/index.tsx
src/app/products/[productId].tsx
src/app/products/accessories/index.tsx
```

如果希望 **src/app/products** 目录内的所有内容以栈的关系排列，请在 **\_layout.tsx** 文件中返回 `Stack` 组件：

```tsx src/app/products/_layout.tsx
import { Stack } from 'expo-router';

export default function StackLayout() {
  return <Stack />;
}
```

导航到 `/products` 时，会首先进入默认路由，即 **products/index.tsx**。如果导航到 `/products/123`，该页面会被压入栈。默认情况下，栈会在标题栏中渲染一个返回按钮，它会把当前页面从栈中弹出，使用户回到上一页。即使某个页面不可见，只要它仍被压在栈上，它就仍在渲染。

`Stack` 组件实现了 [React Navigation 的原生栈](https://reactnavigation.org/docs/native-stack-navigator/)，可以使用相同的屏幕选项。不过，不必在导航器内专门定义页面。目录中的文件会自动被视为栈中的合格路由。如果想定义屏幕选项，可以在 `Stack` 组件内添加 `Stack.Screen` 组件。`name` 属性应匹配路由名称，但不需要提供 `component` 属性；Expo Router 会自动映射：

```tsx src/app/products/_layout.tsx
import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="[productId]" options={{ headerShown: false }} />
    </Stack>
  );
}
```

虽然可以嵌套导航器，但请只在真正需要时才这样做。在上面的示例中，如果想把 **products/accessories/index.tsx** 压入栈，不必在 **accessories** 目录中再放一个带 `Stack` 导航器的 **\_layout.tsx**。那会在第一个栈内再定义一个栈。可以添加只影响 URL 的目录；否则，使用与父目录相同的导航器。

## 标签页

Expo Router 根据需求提供多种实现标签页导航的方式。

### JavaScript 标签页

可以在布局文件中用 `Tabs` 组件实现基于 JavaScript 的标签页导航器。该目录内直接放置的所有路由都会被视为标签页。考虑以下文件结构：

```text
src/app/(tabs)/_layout.tsx
src/app/(tabs)/index.tsx
src/app/(tabs)/feed.tsx
src/app/(tabs)/profile.tsx
```

在 **\_layout.tsx** 文件中返回 `Tabs` 组件：

```tsx src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
```

这会使 **index.tsx**、**feed.tsx** 和 **profile.tsx** 文件一起出现在同一个底部标签页导航器中。此 `Tabs` 组件使用 [React Navigation 的原生底部标签页](https://reactnavigation.org/docs/bottom-tab-navigator/)，并支持相同的选项。

对于 `Tabs`，你很可能希望在导航器中定义标签页，因为这会影响标签页出现的顺序、标题以及标签内的图标。index 路由将是默认选中的标签页。

### 原生标签页

在 Android 和 iOS 上，可以使用[原生标签页](/router/advanced/native-tabs)渲染平台内置的标签栏。原生标签页提供预期的平台行为，例如点击后滚动到顶部、原生动画，以及原生外观和手感。

与 JavaScript 标签页一样，原生标签页可以在路由组目录内的布局文件中使用：

```text
src/app/(tabs)/_layout.tsx
src/app/(tabs)/index.tsx
src/app/(tabs)/feed.tsx
src/app/(tabs)/profile.tsx
```

```tsx src/app/(tabs)/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/home.png')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="feed">
        <NativeTabs.Trigger.Label>Feed</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/feed.png')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/profile.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

### 平台特定的标签页

由于原生标签页仅在 Android 和 iOS 上可用，一种常见模式是使用[平台特定文件扩展名](/router/advanced/platform-specific-modules)，为原生和 Web 提供不同的标签页实现。根布局渲染一个标签页组件，Expo 的模块解析会根据平台自动选择正确的文件。

```text
src/app/_layout.tsx
src/app/index.tsx
src/app/explore.tsx
src/components/app-tabs.native.tsx    原生标签页（Android 和 iOS）
src/components/app-tabs.tsx           自定义标签页（Web）
```

根布局导入并渲染 `AppTabs` 组件。**app-tabs.native.tsx** 用于 Android 和 iOS，**app-tabs.tsx** 用于 Web：

```tsx src/app/_layout.tsx
import AppTabs from '@/components/app-tabs';

export default function RootLayout() {
  return <AppTabs />;
}
```

在 Android 和 iOS 上，**app-tabs.native.tsx** 使用[原生标签页](/router/advanced/native-tabs)：

```tsx src/components/app-tabs.native.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function AppTabs() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/home.png')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/explore.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

在 Web 上，**app-tabs.tsx** 使用来自 `expo-router/ui` 的[自定义标签页](/router/advanced/custom-tabs)，它们是无样式且灵活的组件：

```tsx src/components/app-tabs.tsx
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot />
      <TabList>
        <TabTrigger name="index" href="/">
          Home
        </TabTrigger>
        <TabTrigger name="explore" href="/explore">
          Explore
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
```

## Slot

在某些情况下，你可能想要一个没有导航器的布局。这有助于在当前路由周围添加页眉或页脚，或在目录内的任意路由上显示模态。此时可以使用 `Slot` 组件，它作为当前子路由的占位符。

考虑以下文件结构：

```text
src/app/social/_layout.tsx
src/app/social/index.tsx
src/app/social/feed.tsx
src/app/social/profile.tsx
```

例如，你可能希望用页眉和页脚包裹 **social** 目录内的任意路由，但希望页面之间的导航只是替换当前页面，而不是把新页面压入栈（之后再用“返回”导航动作弹出）。在 **\_layout.tsx** 文件中，返回被页眉和页脚包围的 `Slot` 组件：

```tsx src/app/social/_layout.tsx
import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <>
      <Header />
      <Slot />
      <Footer />
    </>
  );
}
```

## 其他布局

以上只是几个常见布局示例，用来说明其工作方式。布局还能做更多事情：

- 实现[抽屉导航器](/router/advanced/drawer)
- 在 Android 和 iOS 上使用[原生标签页](/router/advanced/native-tabs)获得平台原生标签栏
- 用[完全自定义的标签页](/router/advanced/custom-tabs)替换默认标签页
- 使用[模态](/router/advanced/modals)以透明方式显示页面，使父导航器仍然在下方可见
- [适配任何与 React Navigation 兼容的导航器](/versions/latest/sdk/router#withlayoutcontextnav-processor-useonlyuserdefinedscreens)，包括顶部标签页、底部工作表等
