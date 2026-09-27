---
title: Localization 包参考
description: 提供原生用户本地化信息接口的库。
---

# Localization 包参考

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-localization` 让你本地化应用，为特定地区、语言或文化定制体验。它也提供对原生设备区域设置数据的访问。把 [`lingui-js`](https://lingui.dev/introduction)、[`react-i18next`](https://react.i18next.com/)、[`react-intl`](https://formatjs.io/docs/getting-started/installation/)、[`i18n-js`](https://github.com/fnando/i18n-js) 或 [`react-native-intlayer`](https://intlayer.org/doc/environment/react-native-and-expo) 等本地化库与 `expo-localization` 一起使用，可以为用户打造无障碍程度很高的体验。

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

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-localization`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

```json
{
  "expo": {
    "plugins": [
      [
        "expo-localization",
        {
          "supportsRTL": true,
          "forcesRTL": false,
          "supportedLocales": ["en", "ja"]
        }
      ]
    ]
  }
}
```

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `supportsRTL` | `true` | 应用是否允许 RTL 布局。启用后，当设备语言为从右到左时，应用会按照 React Native 的 `I18nManager` 以 RTL 方式渲染。 |
| `forcesRTL` | `false` | 是否无论设备语言如何都强制使用 RTL 布局。适合测试，或只面向 RTL 区域本地化的应用。 |
| `supportedLocales` | `undefined` | 应用支持的区域设置，用于在系统设置中启用按应用选择语言。可以提供一个两个平台共用的数组，也可以分别提供平台专用的 `ios` 和 `android` 数组。 |

## 用法

关于如何使用 `expo-localization` 以及添加从右到左语言支持的更多信息，请参阅[本地化](/guides/localization)指南。

## API

```jsx
import { getLocales, getCalendars } from 'expo-localization';
```

### 行为

可以用同步的 `getLocales()` 和 `getCalendars()` 方法获取用户设备的区域设置。在 iOS 上，应用运行期间这些结果保持不变。

在 Android 上，用户可以在设置中更改区域偏好，而无需重启应用。为了让本地化保持最新，可以在应用每次回到前台时重新调用 `getLocales()` 和 `getCalendars()`。用 `AppState` 来检测这一点。
