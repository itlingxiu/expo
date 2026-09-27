---
title: PullToRefreshBox 组件参考
description: 用于下拉刷新交互的 Jetpack Compose PullToRefreshBox 组件。
---

# PullToRefreshBox 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台且带下拉刷新的列表请参阅 [`List`](/versions/latest/sdk/ui/universal/list)——在 Android 上它基于 `PullToRefreshBox` 构建。
:::

Expo UI 的 PullToRefreshBox 与官方 Jetpack Compose [PullToRefreshBox](https://developer.android.com/reference/kotlin/androidx/compose/material3/pulltorefresh/package-summary#PullToRefreshBox(kotlin.Boolean,kotlin.Function0,androidx.compose.ui.Modifier,androidx.compose.material3.pulltorefresh.PullToRefreshState,androidx.compose.ui.Alignment,kotlin.Function1,kotlin.Function1)) API 保持一致。它包裹可滚动内容，下拉时显示刷新指示器。

![PullToRefreshBox 在列表上方显示 Material 3 加载指示器](/static/images/expo-ui/pulltorefreshbox/android-light.webp)

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

### 基本下拉刷新

把可滚动内容包在 `PullToRefreshBox` 中即可添加下拉刷新行为。

![下拉刷新容器中的五项列表，处于静止状态](/static/images/expo-ui/examples/pulltorefresh-basic-android-light.webp)

```tsx BasicPullToRefresh.tsx
import { useState, useCallback } from 'react';
import {
  Host,
  PullToRefreshBox,
  LazyColumn,
  ListItem,
  Text,
} from '@expo/ui/jetpack-compose';

export default function BasicPullToRefresh() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <Host style={{ height: 400 }}>
      <PullToRefreshBox
        isRefreshing={refreshing}
        onRefresh={onRefresh}>
        <LazyColumn>
          <ListItem>
            <ListItem.HeadlineContent>
              <Text>Item 1</Text>
            </ListItem.HeadlineContent>
          </ListItem>
          <ListItem>
            <ListItem.HeadlineContent>
              <Text>Item 2</Text>
            </ListItem.HeadlineContent>
          </ListItem>
          <ListItem>
            <ListItem.HeadlineContent>
              <Text>Item 3</Text>
            </ListItem.HeadlineContent>
          </ListItem>
          <ListItem>
            <ListItem.HeadlineContent>
              <Text>Item 4</Text>
            </ListItem.HeadlineContent>
          </ListItem>
          <ListItem>
            <ListItem.HeadlineContent>
              <Text>Item 5</Text>
            </ListItem.HeadlineContent>
          </ListItem>
        </LazyColumn>
      </PullToRefreshBox>
    </Host>
  );
}
```

### 自定义指示器颜色

使用 `indicator` 属性自定义转圈和容器颜色。

![下拉刷新容器中的三项列表，使用自定义指示器，处于静止状态](/static/images/expo-ui/examples/pulltorefresh-colors-android-light.webp)

```tsx CustomIndicatorColors.tsx
import { useState, useCallback } from 'react';
import {
  Host,
  PullToRefreshBox,
  LazyColumn,
  ListItem,
  Text,
} from '@expo/ui/jetpack-compose';

export default function CustomIndicatorColors() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <Host style={{ height: 400 }}>
      <PullToRefreshBox
        isRefreshing={refreshing}
        onRefresh={onRefresh}
        indicator={{ color: '#6200EE', containerColor: '#F5F5F5' }}>
        <LazyColumn>
          <ListItem>
            <ListItem.HeadlineContent>
              <Text>Item 1</Text>
            </ListItem.HeadlineContent>
          </ListItem>
          <ListItem>
            <ListItem.HeadlineContent>
              <Text>Item 2</Text>
            </ListItem.HeadlineContent>
          </ListItem>
          <ListItem>
            <ListItem.HeadlineContent>
              <Text>Item 3</Text>
            </ListItem.HeadlineContent>
          </ListItem>
        </LazyColumn>
      </PullToRefreshBox>
    </Host>
  );
}
```

## API

```tsx
import { PullToRefreshBox } from '@expo/ui/jetpack-compose';
```
