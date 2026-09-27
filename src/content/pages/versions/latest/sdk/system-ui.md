---
title: SystemUI 包参考
description: 允许与系统 UI 元素交互的库。
---

# SystemUI 包参考

> 支持平台：Android、iOS、tvOS、Web。

`expo-system-ui` 让你可以与 React 树之外的 UI 元素交互。具体来说，是根视图背景色，以及在 Android 上全局锁定用户界面样式。

## 安装

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

## 在应用配置中配置

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-system-ui`。该插件可以从[应用配置](/versions/latest/config/app)中配置 Android 上的 [`userInterfaceStyle`](/versions/latest/config/app#userinterfacestyle) 和 iOS 上的 [`backgroundColor`](/versions/latest/config/app#backgroundcolor)。这些属性无法在运行时设置，必须构建新的应用二进制才会生效。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

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

<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>

如果你没有使用连续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动维护原生 **android** 和 **ios** 项目，则需要把下面的配置添加到原生项目中：

**Android**

要在 Android 上应用 `userInterfaceStyle`，需要在 **android/app/src/main/res/values/strings.xml** 中添加 `expo_system_ui_user_interface_style` 配置：

```xml
<resources>
  <string name="expo_system_ui_user_interface_style" translatable="false">light</string>
</resources>
```

**iOS**

要在 iOS 上应用 `backgroundColor`，需要在 **ios/your-app/Info.plist** 中添加 `UIUserInterfaceStyle` 配置：

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
