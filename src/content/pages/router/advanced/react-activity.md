---
title: 用 React Activity 管理非活动路由
description: 了解如何在保留状态的同时，释放非活动路由占用的资源。
---

# 用 React Activity 管理非活动路由

:::warning
这是一项[实验性](/more/release-statuses#experimental)功能，自 **Expo SDK 58** 起可用。
:::

[React 的 `<Activity>`](https://react.dev/reference/react/Activity) 可以隐藏非活动路由的内容，同时保留其状态。隐藏的内容会清理 effect 并释放资源，直到再次可见。

在导航器上启用 activity 处理，并可为单条路由覆盖：

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack activityEnabled>
      {/* 当另一个屏幕覆盖它时，仍保持此屏幕处于活动状态。 */}
      <Stack.Screen name="music" activityEnabled={false} />
      {/* 一旦被另一个屏幕覆盖，就隐藏此屏幕。 */}
      <Stack.Screen name="editor" activityEnabled={1} />
      {/* 当上方有三个屏幕时隐藏此屏幕。 */}
      <Stack.Screen name="feed" activityEnabled={3} />
    </Stack>
  );
}
```

## 配置屏幕何时隐藏

对于 `Stack`，`activityEnabled` 会在上方有两个屏幕时隐藏当前屏幕。正数会改变这一阈值。设为 `1` 时，屏幕一失去焦点就会隐藏。

JavaScript 标签页、原生标签页、无界面标签页和抽屉会在屏幕失去焦点时将其隐藏。

## 手动包裹路由内容

当只需包裹屏幕的一部分时，使用 [`<NavigationAwareActivity>`](/versions/v58.0.0/sdk/router#navigationawareactivityhidewhennestedatlevel)：

```tsx src/app/details.tsx
import { NavigationAwareActivity } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';

function Details() {
  useEffect(() => {
    console.log('Details became visible');

    return () => console.log('Details became hidden');
  }, []);

  return <Text>Details</Text>;
}

export default function DetailsScreen() {
  return (
    <NavigationAwareActivity hideWhenNestedAtLevel={1}>
      <Details />
    </NavigationAwareActivity>
  );
}
```

屏幕隐藏时会运行 effect 的清理函数。React 会保留组件状态，因此组件不会卸载。

`<NavigationAwareActivity>` 必须渲染在路由屏幕内部。全部 activity 选项见 [Expo Router API 参考](/versions/latest/sdk/router)。
