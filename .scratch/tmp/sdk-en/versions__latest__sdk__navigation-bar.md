---
title: NavigationBar
description: A library that provides access to various interactions with the native navigation bar on Android.
packageName: expo-navigation-bar
---

# NavigationBar

> 支持平台：Android、Expo Go。

`expo-navigation-bar` provides a component and an imperative API for controlling the app's navigation bar on Android devices, allowing you to change the color of its buttons or hide it.

## Installation

:::tabs
:::tab npm
```sh
npx expo install expo-navigation-bar
```
:::
:::tab yarn
```sh
yarn expo install expo-navigation-bar
```
:::
:::tab pnpm
```sh
pnpm expo install expo-navigation-bar
```
:::
:::tab bun
```sh
bun expo install expo-navigation-bar
```
:::
:::

## Configuration in app config

You can configure `expo-navigation-bar` using its built-in [config plugin](/config-plugins/introduction) if you use config plugins in your project ([Continuous Native Generation (CNG)](/workflow/continuous-native-generation)). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does **not** use CNG, then you'll need to manually configure the library.

### Example app.json with config plugin

```json
{
  "expo": {
    "plugins": [
      [
        "expo-navigation-bar",
        {
          "enforceContrast": true,
          "hidden": false,
          "style": "light"
        }
      ]
    ]
  }
}
```

### Configurable properties

| Name | Default | Description |
| --- | --- | --- |
| `enforceContrast` | `true` | Only for: Android. Determines whether the operating system should keep the navigation bar translucent to provide contrast between the navigation buttons and app content. Has no effect on Android 7.1 and below. |
| `hidden` | `undefined` | Only for: Android. Determines whether the status bar starts hidden. Accepts `true` and `false` as values. |
| `style` | `undefined` | Only for: Android. Determines which style the navigation bar starts with. Accepts `light` and `dark` as values. |

<details><summary>Are you using this library in an existing React Native app?</summary>

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation)) or you're using a native **android** project manually, then you need to add the following configuration to your native project:

- To hide the navigation bar on **Android**, add `expoNavigationBarHidden` to **android/app/src/main/res/values/styles.xml**:

  

```xml
  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    
    <item name="expoNavigationBarHidden">true</item>
  </style>
  
```

</details>

## Usage

```jsx
import { StyleSheet, Text, View } from 'react-native';
import { NavigationBar } from 'expo-navigation-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notice that the navigation bar has light buttons!</Text>
      <NavigationBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
```

## API

```js
import { NavigationBar } from 'expo-navigation-bar';
```

