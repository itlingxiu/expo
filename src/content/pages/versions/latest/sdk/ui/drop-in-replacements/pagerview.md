---
title: PagerView 包参考
description: 与 react-native-pager-view 兼容的横向分页视图。
---

# PagerView 包参考

> 支持平台：Android、iOS。

与 `react-native-pager-view` API 兼容的 `PagerView` 组件。它封装了平台专用的 `@expo/ui` 原语：Android 上是 Jetpack Compose 的 `HorizontalPager`，iOS 上是分页的 SwiftUI `ScrollView`。每个子元素成为单独的一页，并拉伸以填满分页器。

如果需要更底层地控制平台专用的分页行为或修饰符，请直接使用原生原语。在 iOS 上，使用 `page` 样式的 [`TabView`](/versions/latest/sdk/ui/swift-ui/tabview#page-indicator-dots) 也会渲染横向分页器，当你想要 SwiftUI 内置的页面指示器时，它可能更合适。

![分页器的第一页（Android）](/static/images/expo-ui/community-pagerview/android-light.webp)

![分页器的第一页（iOS）](/static/images/expo-ui/community-pagerview/ios-light.webp)

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

如果需要下面任一能力，可以可选地安装 [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets/)：

- **iOS 上带动画的 `setPage`。** 没有 worklets 时，iOS 的 `setPage` 会回退为无动画跳转。Android 无论是否安装都会播放动画。
- **留在 UI 线程上的逐帧 `onPageScroll` 回调。** 当 `onPageScroll` 处理函数本身是 worklet 时，它会在每一帧同步运行在 UI 线程上，而不会跳到 JS。没有 worklets 时回调仍然会触发，只是运行在 JS 线程上。

## 从 `react-native-pager-view` 迁移

把导入语句改为从 `@expo/ui/community/pager-view` 导入 `PagerView`：

```tsx
import PagerView from 'react-native-pager-view';
// 改为：
import PagerView from '@expo/ui/community/pager-view';
```

替换之前，你应该知道会有哪些变化：

- 不支持 `orientation="vertical"`、`keyboardDismissMode`、`overdrag` 和 `overScrollMode`。
- 不提供 `usePagerView` hook，请改用 `ref`。
- 在 iOS 上，`onPageScroll` 和 `onPageScrollStateChanged` 只在 iOS 18+ 上触发。

完整列表见[平台行为](#平台行为)。

## 基本用法

![分页器第一页，下方有一个「转到第 2 页」按钮（Android）](/static/images/expo-ui/examples/community-pagerview-basic-android-light.webp)

![分页器第一页，下方有一个「转到第 2 页」按钮（iOS）](/static/images/expo-ui/examples/community-pagerview-basic-ios-light.webp)

```tsx
import { useRef } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import PagerView, { type PagerViewRef } from '@expo/ui/community/pager-view';

export default function PagerViewExample() {
  const pagerRef = useRef<PagerViewRef>(null);

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={event => {
          console.log('selected page', event.nativeEvent.position);
        }}>
        <View key="one" style={[styles.page, { backgroundColor: '#fde68a' }]}>
          <Text>Page one</Text>
        </View>
        <View key="two" style={[styles.page, { backgroundColor: '#bfdbfe' }]}>
          <Text>Page two</Text>
        </View>
        <View key="three" style={[styles.page, { backgroundColor: '#bbf7d0' }]}>
          <Text>Page three</Text>
        </View>
      </PagerView>

      <Button title="Go to page 2" onPress={() => pagerRef.current?.setPage(1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
```

## 平台行为

不支持 Web，在 Web 上渲染 `PagerView` 会在运行时抛出错误。

| 功能 | Android | iOS |
| --- | --- | --- |
| 最低平台版本 | 任何受支持的版本 | 分页需要 iOS 17+。在 iOS 16 上，视图可以横向滚动，但页面不会吸附 |
| `onPageScroll` / `onPageScrollStateChanged` | 支持 | 仅 iOS 18+。在 iOS 17 上它们永远不会触发，组件会在挂载时输出一条开发警告 |
| 带动画的 `setPage` | 原生分页动画 | 经由 `react-native-worklets`。如果未安装该包，则回退为无动画跳转 |
| `layoutDirection` | 支持 | 不支持 |
| `offscreenPageLimit` | 支持 | 不支持 |
| `pageMargin` | 支持 | 不支持 |

与上游 `react-native-pager-view` 的其他差异：

- 不支持 `orientation="vertical"`、`keyboardDismissMode`、`overdrag` 和 `overScrollMode`。只提供横向分页，其余项回退到平台分页器的默认行为。
- 不提供 `usePagerView` hook。使用指向 `PagerView` 的 `ref` 来访问 `setPage`、`setPageWithoutAnimation` 和 `setScrollEnabled`。
- `setScrollEnabled` 会触发重新渲染，以便新值作为 prop 传递到原生视图。它仍然适合从非 React 上下文（例如基于 ref 的手势处理程序）切换。
- `borderRadius` 样式在两个平台上都生效。在 Android 上，只有数值会裁剪分页器。底层 Compose 宿主会静默丢弃 `'50%'` 这类字符串值。

## API

```tsx
import PagerView from '@expo/ui/community/pager-view';
```
