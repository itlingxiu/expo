---
title: react-native-pager-view 包参考
description: 提供类似轮播的视图，用于在多页内容之间滑动的组件库。
---

# react-native-pager-view 包参考

> 支持平台：Android、iOS、Expo Go。

:::warning
[`@expo/ui` 提供了可直接替换的组件](/versions/latest/sdk/ui/drop-in-replacements/pagerview)，可替代 `react-native-pager-view`。Android 由 Jetpack Compose 驱动，iOS 由 SwiftUI 驱动。
:::

`react-native-pager-view` 提供一个组件，用布局和手势在多页内容之间滚动，效果类似轮播。

[演示视频](/static/images/sdk/viewpager.mp4)

## 安装

:::tabs
:::tab npm
```sh
npx expo install react-native-pager-view
```
:::
:::tab yarn
```sh
yarn expo install react-native-pager-view
```
:::
:::tab pnpm
```sh
pnpm expo install react-native-pager-view
```
:::
:::tab bun
```sh
bun expo install react-native-pager-view
```
:::
:::

## 示例

```jsx App.js
import { StyleSheet, View, Text } from 'react-native';
import PagerView from 'react-native-pager-view';

export default function MyPager() {
  return (
    <View style={styles.container}>
      <PagerView style={styles.container} initialPage={0}>
        <View style={styles.page} key="1">
          <Text>First page</Text>
          <Text>Swipe ➡️</Text>
        </View>
        <View style={styles.page} key="2">
          <Text>Second page</Text>
        </View>
        <View style={styles.page} key="3">
          <Text>Third page</Text>
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## 了解更多

[查看官方文档](https://github.com/callstack/react-native-pager-view)

可获取 API 及其用法的完整信息。
