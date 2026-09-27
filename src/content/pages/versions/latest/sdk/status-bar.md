---
title: StatusBar 包参考
description: 提供与 React Native StatusBar API 相同接口的库，但默认值略有不同，以便在 Expo 环境中更好地工作。
---

# StatusBar 包参考

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-status-bar` 提供一个组件和命令式接口，用来控制应用状态栏：更改文字颜色、隐藏它，并对这些更改应用动画。你能用 `StatusBar` 组件做什么，取决于所在平台。

> **tvOS 和 Web 支持**
>
> 在 **tvOS** 上，`expo-status-bar` 的代码可以编译并运行，但不会显示状态栏。
>
> 在 **Web** 上，没有可用于控制操作系统状态栏的 API，因此 `expo-status-bar` 不会做任何事，也不会抛出错误。

[视频](https://www.youtube.com/watch?v=_ogZuukmZa8)

## 安装

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

## 在应用配置中配置

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-status-bar`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

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

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `hidden` | `undefined` | 决定状态栏启动时是否隐藏。接受 `true` 和 `false`。 |
| `style` | `undefined` | 决定状态栏启动时使用哪种样式。接受 `light` 和 `dark`。 |

<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>

如果你没有使用连续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动维护原生项目，则需要把下面的配置添加到原生项目中：

- 要在 **Android** 上隐藏状态栏，把 `expoStatusBarHidden` 添加到 **android/app/src/main/res/values/styles.xml**：

```xml
<style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
  <item name="expoStatusBarHidden">true</item>
</style>
```

- 要在 **iOS** 上隐藏状态栏，在 **ios/&lt;project&gt;/Info.plist** 中设置以下键：

```xml
<key>UIStatusBarHidden</key>
<true/>
```

</details>

## 用法

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
