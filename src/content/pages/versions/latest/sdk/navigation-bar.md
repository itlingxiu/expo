---
title: NavigationBar 包参考
description: 用于与 Android 原生导航栏进行各种交互的库。
---

# NavigationBar 包参考

> 支持平台：Android、Expo Go。

`expo-navigation-bar` 提供一个组件和一套命令式 API，用来控制 Android 设备上应用的导航栏，可以更改按钮颜色或隐藏导航栏。

## 安装

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

## 在应用配置中配置

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-navigation-bar`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

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

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `enforceContrast` | `true` | 仅 Android。决定操作系统是否保持导航栏半透明，以便在导航按钮和应用内容之间提供对比。对 Android 7.1 及更低版本没有效果。 |
| `hidden` | `undefined` | 仅 Android。决定状态栏启动时是否隐藏。接受 `true` 和 `false`。 |
| `style` | `undefined` | 仅 Android。决定导航栏启动时使用哪种样式。接受 `light` 和 `dark`。 |

<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>

如果你没有使用连续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动维护原生 **android** 项目，则需要把下面的配置添加到原生项目中：

- 要在 **Android** 上隐藏导航栏，把 `expoNavigationBarHidden` 添加到 **android/app/src/main/res/values/styles.xml**：

```xml
<style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
  <item name="expoNavigationBarHidden">true</item>
</style>
```

</details>

## 用法

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
