---
title: 嵌套导航器
description: 了解如何在 Expo Router 中嵌套导航器。
---

# 嵌套导航器

:::warning
导航 UI 元素（Link、Tabs、Stack）将来可能会移出 Expo Router 库。
:::

> 视频：[在 Expo Router 中使用 Stack 导航器](https://www.youtube.com/watch?v=izZv6a99Roo)。在屏幕之间导航、在屏幕之间传递参数、创建动态路由，并配置屏幕标题与动画。

嵌套导航器允许在另一个导航器的屏幕中渲染一个导航器。本指南是 [React Navigation：嵌套导航器](https://reactnavigation.org/docs/nesting-navigators) 在 Expo Router 上的延伸，并举例说明使用 Expo Router 时嵌套导航器如何工作。

## 示例

以下文件结构用作示例：

```text
src/app/_layout.tsx
src/app/index.tsx
src/app/home/_layout.tsx
src/app/home/feed.tsx
src/app/home/messages.tsx
```

在上面的示例中，**src/app/home/feed.tsx** 匹配 `/home/feed`，**src/app/home/messages.tsx** 匹配 `/home/messages`。

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default Stack;
```

下面的 **src/app/home/\_layout.tsx** 和 **src/app/index.tsx** 都嵌套在 **src/app/\_layout.tsx** 布局中，因此会作为栈渲染。

```tsx src/app/home/_layout.tsx
import { Tabs } from 'expo-router';

export default Tabs;
```

```tsx src/app/index.tsx
import { Link } from 'expo-router';

export default function Root() {
  return <Link href="/home/messages">Navigate to nested route</Link>;
}
```

下面的 **src/app/home/feed.tsx** 和 **src/app/home/messages.tsx** 都嵌套在 **home/\_layout.tsx** 布局中，因此会作为标签页渲染。

```tsx src/app/home/feed.tsx
import { View, Text } from 'react-native';

export default function Feed() {
  return (
    <View>
      <Text>Feed screen</Text>
    </View>
  );
}
```

```tsx src/app/home/messages.tsx
import { View, Text } from 'react-native';

export default function Messages() {
  return (
    <View>
      <Text>Messages screen</Text>
    </View>
  );
}
```

## 在原生标签页中嵌套 Stack

使用原生标签页时，可以在每个标签页内嵌套 `<Stack />` 布局，以支持标题栏和压入屏幕。完整示例见[在标签页中使用 Stack](/router/advanced/native-tabs#在标签页中使用-stack)。

## 导航到嵌套导航器中的屏幕

在 React Navigation 中，可以通过在 params 中传递屏幕名称，来控制导航到某个特定的嵌套屏幕。这样会渲染指定的嵌套屏幕，而不是该嵌套导航器的初始屏幕。

例如，从 `root` 导航器内的初始屏幕出发，你想导航到 `settings`（一个嵌套导航器）内部名为 `media` 的屏幕。在 React Navigation 中，做法如下例所示：

```jsx React Navigation
navigation.navigate('root', {
  screen: 'settings',
  params: {
    screen: 'media',
  },
});
```

在 Expo Router 中，可以用 `router.push()` 达到同样的效果。无需在 params 中显式传递屏幕名称。

```jsx Expo Router
router.push('/root/settings/media');
```
