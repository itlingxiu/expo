---
title: 颜色主题
description: 了解如何在应用中支持亮色与深色模式。
---

# 颜色主题

支持亮色/深色配色方案是常见需求。本页介绍如何在 Expo 项目中支持浅色（light）与深色（dark）模式。

## 配置

:::note
Android 与 iOS 需要额外配置来支持亮/暗模式切换；Web 无需任何配置。
:::

外观样式通过应用配置中的 `userInterfaceStyle` 属性配置。默认模板创建的新项目默认为 `automatic`。

```json app.json
{
  "expo": {
    "userInterfaceStyle": "automatic"
  }
}
```

可以通过 `android.userInterfaceStyle` 或 `ios.userInterfaceStyle` 按平台配置。

:::note
缺少该属性时，应用默认为 `light` 样式。
:::

对于开发构建，必须在 Android 上安装 `expo-system-ui` 才能支持外观样式；否则 `userInterfaceStyle` 会被忽略。

```sh
# npm
npx expo install expo-system-ui

# yarn
yarn expo install expo-system-ui

# pnpm
pnpm expo install expo-system-ui

# bun
bun expo install expo-system-ui
```

配置错误时终端会出现警告：

```sh
» android: userInterfaceStyle: Install expo-system-ui in your project to enable this feature.
```

可以用以下命令校验配置：

```sh
# npm
npx expo config --type introspect

# yarn
yarn expo config --type introspect

# pnpm
pnpm expo config --type introspect

# bun
bun expo config --type introspect
```

### 使用现有 React Native 项目？

**Android** —— 确保 **AndroidManifest.xml** 中 `MainActivity`（以及其他相关 Activity）带有 `uiMode` 标志：

```xml
<activity android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode">
```

在 **MainActivity.java** 中实现 `onConfigurationChanged`：

```java
import android.content.Intent;
import android.content.res.Configuration;
public class MainActivity extends ReactActivity {
  ...

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    sendBroadcast(intent);
  }
  ...
}
```

**iOS** —— 用 **Info.plist** 中的 `UIUserInterfaceStyle` 键配置支持的样式；使用 `Automatic` 同时支持亮色与深色模式。参见 [UIUserInterfaceStyle](https://developer.apple.com/documentation/bundleresources/information_property_list/uiuserinterfacestyle)。

### 支持的外观样式

`userInterfaceStyle` 接受：

- `automatic`：跟随系统外观设置，并通知用户做出的任何更改。
- `light`：应用仅使用亮色主题。
- `dark`：应用仅使用深色主题。

## 检测配色方案

使用 `react-native` 的 `Appearance` 或 `useColorScheme`：

```tsx src/app/index.tsx
import { Appearance, useColorScheme } from 'react-native';
```

Hook 用法：

```tsx src/app/index.tsx
function MyComponent() {
  let colorScheme = useColorScheme();

  if (colorScheme === 'dark') {
    // render some dark thing
  } else {
    // render some light thing
  }
}
```

需要命令式访问或订阅变化时，使用 `Appearance.getColorScheme()` 或 `Appearance.addChangeListener()`（见 [React Native Appearance 文档](https://reactnative.dev/docs/appearance)）。

## 更多信息

### 最小示例

```tsx useColorScheme example
import { Text, StyleSheet, View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <Text style={[styles.text, themeTextStyle]}>Color scheme: {colorScheme}</Text>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
  lightContainer: {
    backgroundColor: '#d0d0c0',
  },
  darkContainer: {
    backgroundColor: '#242c40',
  },
  lightThemeText: {
    color: '#242c40',
  },
  darkThemeText: {
    color: '#d0d0c0',
  },
});
```

### 提示

开发时可以在模拟器或设备上切换外观：

- Android 模拟器：运行 `adb shell "cmd uimode night yes"` 启用深色模式，`adb shell "cmd uimode night no"` 关闭。
- Android 真机或模拟器：在设备设置中切换系统深色模式。
- 本地 iOS 模拟器：Cmd ⌘ + Shift + A 在亮色与深色模式之间切换。
