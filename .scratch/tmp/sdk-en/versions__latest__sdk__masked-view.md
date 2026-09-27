---
title: @react-native-masked-view/masked-view
description: A library that provides a masked view.
packageName: @react-native-masked-view/masked-view
---

# @react-native-masked-view/masked-view

> 支持平台：Android、iOS、tvOS、Expo Go。

:::warning
[`@expo/ui` provides a drop-in replacement](/versions/latest/sdk/ui/drop-in-replacements/maskedview) for `@react-native-masked-view/masked-view`, powered by Jetpack Compose on Android and SwiftUI on iOS.
:::

`@react-native-masked-view/masked-view` provides a masked view that only displays the pixels that overlap with the view rendered in its mask element.

:::warning
You can only have one of either `@react-native-community/masked-view` (deprecated) or `@react-native-masked-view/masked-view` installed in your project at any given time. React Navigation v6 and later requires `@react-native-masked-view/masked-view`, so you should use that package instead if you are using the latest version of React Navigation.

**important** Android support for this library is [experimental](/more/release-statuses#experimental) and you may encounter inconsistencies in behavior across platforms. Report issues you encounter to [`react-native-masked-view` GitHub repository](https://github.com/react-native-masked-view/masked-view).
:::

## Installation

:::tabs
:::tab npm
```sh
npx expo install @react-native-masked-view/masked-view
```
:::
:::tab yarn
```sh
yarn expo install @react-native-masked-view/masked-view
```
:::
:::tab pnpm
```sh
pnpm expo install @react-native-masked-view/masked-view
```
:::
:::tab bun
```sh
bun expo install @react-native-masked-view/masked-view
```
:::
:::

## Learn more

- [Visit official documentation](https://github.com/react-native-masked-view/masked-view)：Get full information on API and its usage.

