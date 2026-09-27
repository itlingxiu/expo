---
title: 配置导航过渡
description: 了解如何在 Expo Router 中使用 React transition 进行导航。
---

# 配置导航过渡

:::warning
这是一项[实验性](/more/release-statuses#experimental)功能，自 **Expo SDK 58** 起可用。
:::

Expo Router 可以在 [React transition](https://react.dev/reference/react/startTransition) 内处理导航。过渡会在下一个屏幕挂起时保持当前屏幕可见。

在根布局渲染之前设置过渡模式：

```tsx src/app/_layout.tsx
import { router, Stack } from 'expo-router';

router.setTransitionMode('always');

export default function RootLayout() {
  return <Stack />;
}
```

## 选择过渡模式

用这些模式配置 Expo Router 何时启动过渡：

| 模式 | 行为 |
| --- | --- |
| `preload-only` | 仅对预加载使用过渡。这是默认值。 |
| `always` | 对所有排队的导航操作使用过渡。 |
| `never` | 从不使用过渡。单个操作无法覆盖此模式。 |

使用 `inTransition` 为单个操作覆盖模式。`never` 模式无法被覆盖。

```tsx
router.push('/details', { inTransition: true });
router.back({ inTransition: false });
```

:::note
当 Expo Router 批量处理操作时，批次中的每个操作都必须允许过渡，该批次才会使用过渡。
:::

## 显示待处理的导航

使用 `unstable_useIsNavigating()` 检查导航是否已排队或处于待处理状态：

```tsx
import { unstable_useIsNavigating } from 'expo-router';
import { ActivityIndicator } from 'react-native';

export function NavigationProgress() {
  const isNavigating = unstable_useIsNavigating();

  return <ActivityIndicator animating={isNavigating} />;
}
```

该 hook 不会报告同步导航或原生返回手势。完整 API 见 [Expo Router API 参考](/versions/latest/sdk/router)。
