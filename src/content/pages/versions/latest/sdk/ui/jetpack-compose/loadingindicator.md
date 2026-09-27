---
title: LoadingIndicator 组件参考
description: 用于显示加载状态的 Jetpack Compose 加载指示器组件。
---

# LoadingIndicator 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的加载指示器与官方 Jetpack Compose [Loading Indicator API](https://m3.material.io/components/loading-indicator/overview) 保持一致。

![不确定模式下的默认和容器内加载指示器](/static/images/expo-ui/loadingindicator/android-light.webp)

## 安装

:::tabs
:::tab npm
```sh
npx expo install @expo/ui
```
:::
:::tab yarn
```sh
yarn expo install @expo/ui
```
:::
:::tab pnpm
```sh
pnpm expo install @expo/ui
```
:::
:::tab bun
```sh
bun expo install @expo/ui
```
:::
:::

## 用法

### 加载指示器

来自 Material 3 Expressive 的变形形状加载动画。

![单个变形形状加载指示器](/static/images/expo-ui/examples/loadingindicator-basic-android-light.webp)

```tsx LoadingIndicatorExample.tsx
import { Host, LoadingIndicator } from '@expo/ui/jetpack-compose';

export default function LoadingIndicatorExample() {
  return (
    <Host matchContents>
      <LoadingIndicator />
    </Host>
  );
}
```

### 容器内加载指示器

位于彩色背景内的加载指示器。

![填充圆形容器内的变形形状加载指示器](/static/images/expo-ui/examples/loadingindicator-contained-android-light.webp)

```tsx ContainedLoadingIndicatorExample.tsx
import {
  Host,
  ContainedLoadingIndicator,
} from '@expo/ui/jetpack-compose';

export default function ContainedLoadingIndicatorExample() {
  return (
    <Host matchContents>
      <ContainedLoadingIndicator />
    </Host>
  );
}
```

### 不确定进度

省略 `progress` 属性即可连续播放动画，而不表示具体完成程度。

![普通加载指示器与容器内指示器并排，两者都在连续动画](/static/images/expo-ui/examples/loadingindicator-indeterminate-android-light.webp)

```tsx IndeterminateExample.tsx
import {
  ContainedLoadingIndicator,
  Host,
  LoadingIndicator,
  Row,
} from '@expo/ui/jetpack-compose';

export default function IndeterminateExample() {
  return (
    <Host matchContents>
      <Row horizontalArrangement={{ spacedBy: 16 }}>
        <LoadingIndicator />
        <ContainedLoadingIndicator />
      </Row>
    </Host>
  );
}
```

### 确定进度

把 `useNativeState` 的可观察状态作为 `progress` 传入。将 `progress.value` 更新为 `0` 到 `1` 之间的值。

![普通和容器内加载指示器，各自按当前进度值绘制形状](/static/images/expo-ui/examples/loadingindicator-determinate-android-light.webp)

```tsx DeterminateExample.tsx
import {
  ContainedLoadingIndicator,
  Host,
  LoadingIndicator,
  Row,
  useNativeState,
} from '@expo/ui/jetpack-compose';
import { useEffect } from 'react';

export default function DeterminateExample() {
  const progress = useNativeState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      progress.value = (progress.value + 0.05) % 1;
    }, 500);
    return () => clearInterval(interval);
  }, [progress]);

  return (
    <Host matchContents>
      <Row horizontalArrangement={{ spacedBy: 16 }}>
        <LoadingIndicator progress={progress} />
        <ContainedLoadingIndicator progress={progress} />
      </Row>
    </Host>
  );
}
```

## API

```tsx
import {
  LoadingIndicator,
  ContainedLoadingIndicator,
} from '@expo/ui/jetpack-compose';
```
