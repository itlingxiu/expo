---
title: SplashScreen 包参考
description: 用于控制原生启动画面可见性行为的库。
---

# SplashScreen 包参考

> 支持平台：Android、iOS、tvOS。

`expo-splash-screen` 库中的 `SplashScreen` 模块用于控制原生启动画面的行为。默认情况下，启动画面会在应用准备好时自动隐藏，但你也可以为更高级的用例手动控制其可见性。

> 从 **SDK 52** 起，由于支持最新 Android 启动画面 API 的改动，Expo Go 和开发构建无法完全复现用户在[独立应用](/more/glossary-of-terms#standalone-app)中看到的启动画面体验。Expo Go 会显示应用图标而不是启动画面，开发构建上的启动画面也不会反映配置插件中设置的全部属性。**强烈建议在发布构建上测试启动画面，以确保它符合预期。**

另见[创建启动画面图片](/develop/user-interface/splash-screen-and-app-icon#splash-screen)指南。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-splash-screen
```
:::
:::tab yarn
```sh
yarn expo install expo-splash-screen
```
:::
:::tab pnpm
```sh
pnpm expo install expo-splash-screen
```
:::
:::tab bun
```sh
bun expo install expo-splash-screen
```
:::
:::

## 用法

对大多数应用来说，你不需要对启动画面做任何特殊处理。它会在应用准备好时自动隐藏。你可以选择配置动画选项：

:::tabs
:::tab 使用 Expo Router
```tsx
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// 设置动画选项。这一步是可选的。
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  return <Stack />;
}
```
:::

:::tab 不使用 Expo Router
```tsx
import { Text, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';

// 设置动画选项。这一步是可选的。
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>SplashScreen Demo! 👋</Text>
      <Entypo name="rocket" size={30} />
    </View>
  );
}
```
:::
:::

### 延迟隐藏启动画面

在某些情况下，可能需要延迟隐藏启动画面，直到某些资源加载完成。例如，如果需要在显示应用内容之前加载 API 数据，可以用 `preventAutoHideAsync()` 手动控制启动画面何时隐藏。目标应该是尽快隐藏启动画面。

:::tabs
:::tab 使用 Expo Router
```tsx
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

// 在获取资源期间保持启动画面可见
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function doAsyncStuff() {
      try {
        // 在这里做一些异步工作
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    doAsyncStuff();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return <Stack />;
}
```
:::

:::tab 不使用 Expo Router
```tsx
import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';

// 在获取资源期间保持启动画面可见
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function doAsyncStuff() {
      try {
        // 在这里做一些异步工作
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    doAsyncStuff();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>SplashScreen Demo! 👋</Text>
      <Entypo name="rocket" size={30} />
    </View>
  );
}
```
:::
:::

## 配置

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-splash-screen`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

**如下所示使用配置插件，是配置启动画面的推荐方法。** 其他方法现在被视为旧方式，未来会被移除。

### 带配置插件的 app.json 示例

```json
{
  "expo": {
    "plugins": [
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#232323",
          "image": "./assets/splash-icon.png",
          "dark": {
            "image": "./assets/splash-icon-dark.png",
            "backgroundColor": "#000000"
          },
          "imageWidth": 200
        }
      ]
    ]
  }
}
```

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `backgroundColor` | `#ffffff` | 表示启动画面背景色的十六进制颜色字符串。 |
| `image` | `undefined` | 将显示在启动画面上的图片文件路径。这应该是应用图标或标志。 |
| `enableFullScreenImage_legacy` | `false` | 仅 iOS。启用此属性后可以使用全屏图片作为启动画面。这是为了帮助从旧的启动画面配置过渡，未来会被移除。 |
| `dark` | `undefined` | 包含设备处于深色模式时启动画面配置属性的对象。 |
| `imageWidth` | `100` | 图片的宽度。 |
| `android` | `undefined` | 包含 Android 上启动画面配置属性的对象。 |
| `ios` | `undefined` | 包含 iOS 上启动画面配置属性的对象。 |
| `resizeMode` | `undefined` | 决定图片如何缩放到 `imageWidth` 所定义的容器中。可选值：`contain`、`cover` 或 `native`。 |

<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>

关于如何配置原生项目，见 [`expo-splash-screen` 仓库中的安装说明](https://github.com/expo/expo/tree/main/packages/expo-splash-screen#-installation-in-bare-react-native-projects)。

</details>

### 为启动画面添加动画

`SplashScreen` 提供开箱即用的淡出动画。可以用 `setOptions` 方法配置。

```tsx
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});
```

如果希望使用自定义动画，见 [`with-splash-screen`](https://github.com/expo/examples/tree/master/with-splash-screen) 示例，了解如何对启动画面应用任意动画。可以运行 `npx create-expo-app --example with-splash-screen` 从这个示例初始化新项目。

## API

```tsx
import * as SplashScreen from 'expo-splash-screen';
```
