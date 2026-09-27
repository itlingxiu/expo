---
title: StatusBar
description: A library that provides the same interface as the React Native StatusBar API, but with slightly different defaults to work great in Expo environments.
packageName: expo-status-bar
---

# StatusBar

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-status-bar` gives you a component and imperative interface to control the app status bar to change its text color, hide it, and apply animations to any of these changes. Exactly what you are able to do with the `StatusBar` component depends on the platform you're using.

> **tvOS and web support**
> 
> For **tvOS**, the `expo-status-bar` code will compile and run, but no status bar will show.
> 
> For **web**, there is no API available to control the operating system's status bar, so `expo-status-bar` will do nothing and won't throw an error.

[视频](https://www.youtube.com/watch?v=_ogZuukmZa8)

## Installation

:::tabs
:::tab npm
```sh
npx expo install expo-status-bar
```
:::
:::tab yarn
```sh
yarn expo install expo-status-bar
```
:::
:::tab pnpm
```sh
pnpm expo install expo-status-bar
```
:::
:::tab bun
```sh
bun expo install expo-status-bar
```
:::
:::

## Configuration in app config

You can configure `expo-status-bar` using its built-in [config plugin](/config-plugins/introduction) if you use config plugins in your project ([Continuous Native Generation (CNG)](/workflow/continuous-native-generation)). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does **not** use CNG, then you'll need to manually configure the library.

### Example app.json with config plugin

```json
{
  "expo": {
    "plugins": [
      [
        "expo-status-bar",
        {
          "hidden": false,
          "style": "dark"
        }
      ]
    ]
  }
}
```

### Configurable properties

| Name | Default | Description |
| --- | --- | --- |
| `hidden` | `undefined` | Determines whether the status bar starts hidden. Accepts `true` and `false` as values. |
| `style` | `undefined` | Determines which style the status bar starts with. Accepts `light` and `dark` as values. |

<details><summary>Are you using this library in an existing React Native app?</summary>

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation)) or you're using a native project manually, then you need to add the following configuration to your native project:

- To hide the status bar on **Android**, add `expoStatusBarHidden` to **android/app/src/main/res/values/styles.xml**:

  

```xml
  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    
    <item name="expoStatusBarHidden">true</item>
  </style>
  
```

- To hide the status bar on **iOS**, set the following keys in your **ios/&lt;project&gt;/Info.plist**:

  

```xml
  <key>UIStatusBarHidden</key>
  <true/>
  
```

</details>

## Usage

```jsx
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notice that the status bar has light text!</Text>
      <StatusBar style="light" />
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
import { StatusBar } from 'expo-status-bar';
```

