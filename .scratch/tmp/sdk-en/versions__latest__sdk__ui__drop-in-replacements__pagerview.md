---
title: PagerView
description: A horizontally paged view compatible with react-native-pager-view.
packageName: @expo/ui
---

# PagerView

> 支持平台：Android、iOS。

A `PagerView` component with an API compatible with `react-native-pager-view`. It wraps the platform-specific `@expo/ui` primitives: Jetpack Compose `HorizontalPager` on Android and a paged SwiftUI `ScrollView` on iOS. Each child becomes a separate page and stretches to fill the pager.

If you need lower-level control over platform-specific paging behavior or modifiers, use the native primitives directly. On iOS, [`TabView`](/versions/latest/sdk/ui/swift-ui/tabview#page-indicator-dots) with the `page` style also renders a horizontal pager and may fit better when you want SwiftUI's built-in page indicators.

![The first page of a pager（Android）](/static/images/expo-ui/community-pagerview/android-light.webp)

![The first page of a pager（iOS）](/static/images/expo-ui/community-pagerview/ios-light.webp)

## Installation

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

Optionally, install [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets/) if you need either of the following:

- **Animated `setPage` on iOS.** Without worklets, iOS `setPage` falls back to a non-animated jump. Android animates regardless.
- **Per-frame `onPageScroll` callbacks that stay on the UI thread.** When your `onPageScroll` handler is itself a worklet, it runs synchronously on the UI thread every frame instead of hopping to JS. Without worklets the callback still fires — it just runs on the JS thread.

## Migrating from `react-native-pager-view`

Update the import statement by importing `PagerView` from `@expo/ui/community/pager-view`:

```tsx
import PagerView from 'react-native-pager-view';
// becomes:
import PagerView from '@expo/ui/community/pager-view';
```

Before you swap, you should know what changes:

- `orientation="vertical"`, `keyboardDismissMode`, `overdrag`, and `overScrollMode` are not supported.
- The `usePagerView` hook is not provided — use a `ref` instead.
- On iOS, `onPageScroll` and `onPageScrollStateChanged` only fire on iOS 18+.

See [Platform behavior](#platform-behavior) for the full list.

## Basic usage

![The first page of a pager above a Go to page 2 button（Android）](/static/images/expo-ui/examples/community-pagerview-basic-android-light.webp)

![The first page of a pager above a Go to page 2 button（iOS）](/static/images/expo-ui/examples/community-pagerview-basic-ios-light.webp)

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

## Platform behavior

Web is not supported and rendering `PagerView` on web throws at runtime.

| Feature                                     | Android                | iOS                                                                                                       |
| ------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------- |
| Minimum platform version                    | Any supported version  | iOS 17+ for paging. On iOS 16, the view scrolls horizontally but pages don't snap                         |
| `onPageScroll` / `onPageScrollStateChanged` | 支持            | iOS 18+ only. On iOS 17, they never fire and the component logs a development warning on mount            |
| Animated `setPage`                          | Native pager animation | Routes through `react-native-worklets`. Falls back to a non-animated jump if the package is not installed |
| `layoutDirection`                           | 支持            | 不支持                                                                                                |
| `offscreenPageLimit`                        | 支持            | 不支持                                                                                                |
| `pageMargin`                                | 支持            | 不支持                                                                                                |

Additional differences from upstream `react-native-pager-view`:

- `orientation="vertical"`, `keyboardDismissMode`, `overdrag`, and `overScrollMode` are not supported. Only horizontal paging is available, and the others fall back to the platform pager's defaults.
- The `usePagerView` hook is not provided. Use a `ref` to `PagerView` to access `setPage`, `setPageWithoutAnimation`, and `setScrollEnabled`.
- `setScrollEnabled` triggers a re-render so the new value flows through to the native view as a prop. It is still useful for toggling from non-React contexts such as a ref-based gesture handler.
- The `borderRadius` style applies on both platforms. On Android, only numeric values clip the pager. The underlying Compose host silently drops string values such as `'50%'`.

## API

```tsx
import PagerView from '@expo/ui/community/pager-view';
```

