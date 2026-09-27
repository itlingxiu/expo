---
title: Localization 包参考
description: 一个提供原生用户本地化信息接口的库。
---

# Localization 包参考

> 本页面对应 Expo SDK v56。
> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-localization` 允许你对应用进行本地化，为特定地区、语言或文化定制体验。它还提供对原生设备上区域设置数据的访问。将 `expo-localization` 与 [`lingui-js`](https://lingui.dev/introduction)、[`react-i18next`](https://react.i18next.com/)、[`react-intl`](https://formatjs.io/docs/getting-started/installation/)、[`i18n-js`](https://github.com/fnando/i18n-js) 或 [`react-native-intlayer`](https://intlayer.org/doc/environment/react-native-and-expo) 等本地化库搭配使用，可以让你为用户提供出色的无障碍体验。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-localization
```
:::
:::tab yarn
```sh
yarn expo install expo-localization
```
:::
:::tab pnpm
```sh
pnpm expo install expo-localization
```
:::
:::tab bun
```sh
bun expo install expo-localization
```
:::
:::

## 在应用配置中配置

如果你的项目使用了配置插件（[连续原生生成 (CNG)](/workflow/continuous-native-generation/)），你可以使用 `expo-localization` 内置的[配置插件](/config-plugins/introduction)对其进行配置。该插件允许你配置各种无法在运行时设置、必须构建新的应用二进制文件才能生效的属性。如果你的应用**没有**使用 CNG，则需要手动配置该库。

```json app.json
{
  "expo": {
    "plugins": ["expo-localization"]
  }
}
```

## 用法

在[本地化](/guides/localization)指南中了解有关使用 `expo-localization` 以及添加从右到左语言支持的更多信息。

## API

```jsx
import { getLocales, getCalendars } from 'expo-localization';
```

### 行为

你可以使用同步的 `getLocales()` 和 `getCalendars()` 方法获取用户设备的区域设置。在 iOS 上，应用运行期间结果将保持不变。

在 Android 上，用户无需重启应用即可在「设置」中更改区域偏好。为了让本地化保持最新，你可以在应用每次回到前台时重新运行 `getLocales()` 和 `getCalendars()` 方法。可以使用 `AppState` 来检测这一事件。
