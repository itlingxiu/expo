---
title: react-native-pager-view
description: A component library that provides a carousel-like view to swipe through pages of content.
---

# react-native-pager-view

> 支持平台：Android、iOS、Expo Go。

> **important** [`@expo/ui` provides a drop-in replacement](/versions/latest/sdk/ui/drop-in-replacements/pagerview) for `react-native-pager-view`, powered by Jetpack Compose on Android and SwiftUI on iOS.

`react-native-pager-view` exposes a component that provides the layout and gestures to scroll between pages of content, like a carousel.

![sdk/viewpager.mp4](/static/images/sdk/viewpager.mp4)

## Installation

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

## Example

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

## Learn more

[Visit official documentation](https://github.com/callstack/react-native-pager-view)

Get full information on API and its usage.
