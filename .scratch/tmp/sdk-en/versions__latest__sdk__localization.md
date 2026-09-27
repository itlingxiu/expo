---
title: Localization
description: A library that provides an interface for native user localization information.
packageName: expo-localization
---

# Localization

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-localization` allows you to localize your app, customizing the experience for specific regions, languages, or cultures. It also provides access to the locale data on the native device. Using a localization library such as [`lingui-js`](https://lingui.dev/introduction), [`react-i18next`](https://react.i18next.com/), [`react-intl`](https://formatjs.io/docs/getting-started/installation/), [`i18n-js`](https://github.com/fnando/i18n-js), or [`react-native-intlayer`](https://intlayer.org/doc/environment/react-native-and-expo) with `expo-localization` will enable you to create a very accessible experience for users.

## Installation

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

## Configuration in app config

You can configure `expo-localization` using its built-in [config plugin](/config-plugins/introduction) if you use config plugins in your project ([Continuous Native Generation (CNG)](/workflow/continuous-native-generation)). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does **not** use CNG, then you'll need to manually configure the library.

### Example app.json with config plugin

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

### Configurable properties

| Name | Default | Description |
| --- | --- | --- |
| `supportsRTL` | `true` | Whether the app allows RTL layout. When enabled, the app renders in RTL for RTL device languages, following React Native's `I18nManager`. |
| `forcesRTL` | `false` | Whether to force RTL layout regardless of the device language. Useful for testing or for apps localized only for RTL locales. |
| `supportedLocales` | `undefined` | The locales your app supports, used to enable per-app language selection in the system settings. Provide a single array shared by both platforms, or platform-specific `ios` and `android` arrays. |

## Usage

Find more information about using `expo-localization` and adding support for right-to-left languages in the [Localization](/guides/localization) guide.

## API

```jsx
import { getLocales, getCalendars } from 'expo-localization';
```

### Behavior

You can use synchronous `getLocales()` and `getCalendars()` methods to get the locale settings of the user device. On iOS, the results will remain the same while the app is running.

On Android, the user can change locale preferences in Settings without restarting apps. To keep the localization current, you can rerun the `getLocales()` and `getCalendars()` methods every time the app returns to the foreground. Use `AppState` to detect this.

