---
title: SystemUI
description: A library that allows interacting with system UI elements.
packageName: expo-system-ui
---

# SystemUI

> 支持平台：Android、iOS、tvOS、Web。

`expo-system-ui` enables you to interact with UI elements that fall outside of the React tree. Specifically the root view background color, and locking the user interface style globally on Android.

## Installation

:::tabs
:::tab npm
```sh
npx expo install expo-system-ui
```
:::
:::tab yarn
```sh
yarn expo install expo-system-ui
```
:::
:::tab pnpm
```sh
pnpm expo install expo-system-ui
```
:::
:::tab bun
```sh
bun expo install expo-system-ui
```
:::
:::

## Configuration in app config

You can configure `expo-system-ui` using its built-in [config plugin](/config-plugins/introduction) if you use config plugins in your project ([Continuous Native Generation (CNG)](/workflow/continuous-native-generation)). The plugin allows you to configure [`userInterfaceStyle`](/versions/latest/config/app#userinterfacestyle) on Android and [`backgroundColor`](/versions/latest/config/app#backgroundcolor) on iOS properties from [app config](/versions/latest/config/app). These properties cannot be set at runtime and require building a new app binary to take effect. If your app does **not** use CNG, then you'll need to manually configure the library.

### Example app.json with config plugin

```json
{
  "expo": {
    "backgroundColor": "#ffffff",
    "userInterfaceStyle": "light",
    "ios": {
      "backgroundColor": "#ffffff"
    },
    "android": {
      "userInterfaceStyle": "light"
    },
    "plugins": ["expo-system-ui"]
  }
}
```

<details><summary>Are you using this library in an existing React Native app?</summary>

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation)) or you're using native **android** and **ios** project manually, then you need to add the following configuration to your native project:

**Android**

To apply `userInterfaceStyle` on Android, you need to add the `expo_system_ui_user_interface_style` configuration **android/app/src/main/res/values/strings.xml**:

```xml
<resources>
  
  <string name="expo_system_ui_user_interface_style" translatable="false">light</string> 
</resources>
```

**iOS**

To apply `backgroundColor` on iOS, you need to add the `UIUserInterfaceStyle` configuration in **ios/your-app/Info.plist**:

```xml
<plist>
  <dict>
    
    <key>UIUserInterfaceStyle</key>
    <string>Light</string> 
  </dict>
</plist>
```

</details>

## API

```js
import * as SystemUI from 'expo-system-ui';
```

