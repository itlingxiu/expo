---
title: Font 包参考
description: 一个允许在运行时加载字体并在 React Native 组件中使用它们的库。
---

# Font 包参考

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-font` 支持从网络加载字体，并在 React Native 组件中使用它们。更详细的使用信息请参见[字体](/develop/user-interface/fonts)指南。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-font
```
:::
:::tab yarn
```sh
yarn expo install expo-font
```
:::
:::tab pnpm
```sh
pnpm expo install expo-font
```
:::
:::tab bun
```sh
bun expo install expo-font
```
:::
:::

## 在应用配置中配置

为应用添加字体有两种方式：使用 `expo-font` 配置插件（推荐用于 Android 和 iOS），或在运行时加载（适用于包括 Web 在内的所有平台）。

在 Android 和 iOS 上，该插件允许你在构建时将字体文件嵌入应用，这比 `useFonts` 或 `loadAsync` 更高效。设置好配置插件并运行[预构建](/workflow/continuous-native-generation#usage)后，你就可以立即渲染自定义字体。该插件有多种配置方式，使用方法请参见[字体](/develop/user-interface/fonts#with-expo-font-config-plugin)指南。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-font",
        {
          /* @info 字体文件的路径相对于项目根目录。 */
          "fonts": ["./path/to/file.ttf"],
          /* @end */
          "android": {
            "fonts": [
              {
                "fontFamily": "Source Serif 4",
                "fontDefinitions": [
                  {
                    "path": "./path/to/SourceSerif4-ExtraBold.ttf",
                    "weight": 800
                  }
                ]
              },
              {
                "fontFamily": "Roboto Flex",
                /* @info 可变字体文件。它支持下面所有的定义，因此路径是共享的。 */
                "path": "./path/to/RobotoFlex.ttf",
                /* @end */
                "fontDefinitions": [
                  { "weight": 400 },
                  { "weight": 700 },
                  /* @info `slnt` 轴用于从同一文件中绘制斜体。 */
                  { "weight": 400, "style": "italic", "axes": { "slnt": -10 } }
                  /* @end */
                ]
              }
            ]
          },
          "ios": {
            "fonts": ["./path/to/SourceSerif4-ExtraBold.ttf"]
          }
        }
      ]
    ]
  }
}
```

| 属性 | 描述 | 默认值 |
| --- | --- | --- |
| fonts | 要链接到原生项目的字体定义数组。路径应相对于项目根目录。在 Android 上，文件名将成为字体系列名。在 iOS 上，字体系列名始终直接取自字体文件，可能与文件名不同——请遵循[命名建议](/develop/user-interface/fonts#how-to-determine-which-font-family-name-to-use)或使用 `getLoadedFonts` 查看可用字体。 | `[]` |
| android | 一个对象，包含要链接到 Android 原生项目的字体定义 `fonts` 数组。在 `fonts` 中使用对象语法可嵌入带有自定义系列名的 [xml 字体](https://developer.android.com/develop/ui/views/text-and-emoji/fonts-in-xml)。 | `{}` |
| ios | 一个对象，包含要链接到 iOS 原生项目的字体文件路径 `fonts` 数组。字体系列名直接取自字体文件。 | `{}` |

- **Android：** 将字体文件复制到 **android/app/src/main/assets/fonts**。
- **iOS：** 参见 Apple 开发者文档中的[向应用添加自定义字体](https://developer.apple.com/documentation/uikit/adding-a-custom-font-to-your-app)。

## 用法

如果你不想使用[配置插件](#在应用配置中配置)，可以在运行时使用 `useFonts` hook 加载字体，如下面的代码片段所示：

```tsx
/* @info 从 'expo-font' 导入 useFonts hook。 */ import { useFonts } from 'expo-font'; /* @end */
/* @info 同时导入 SplashScreen，这样当字体尚未加载时，我们可以继续显示启动屏。 */ import * as SplashScreen from 'expo-splash-screen'; /* @end */
import { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

/* @info 在字体加载期间，防止启动屏自动隐藏。 */
SplashScreen.preventAutoHideAsync();
/* @end */

export default function App() {
  // 仅当你无法使用配置插件时才使用 `useFonts`。
  const [loaded, error] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      /* @info 自定义字体加载完成后，我们可以隐藏启动屏并显示应用界面。 */
      SplashScreen.hideAsync();
      /* @end */
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'Inter-Black', fontSize: 30 }}>Inter Black</Text>
      <Text style={{ fontSize: 30 }}>Platform Default</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### 可变字体

上面示例中的 `Roboto Flex` 条目是一个可变字体：一个文件包含多个字面（face）。你可以通过 `fontWeight` 和 `fontStyle` 样式属性选择字面。可变字体也适用于 `useFonts`。要了解更多信息，请参见字体指南中的[可变字体](/develop/user-interface/fonts#variable-fonts)。

### 多种字重和样式

一个字体系列也可以包含多个静态字体文件，例如常规、粗体和斜体字型。要将它们加载到同一个 `fontFamily` 名称下，请向 `useFonts` 或 `loadAsync` 传入一个 `FontFamilyDefinition` 数组，而不是映射对象。然后通过 `fontWeight` 和 `fontStyle` 样式属性选择字面。要了解更多信息，请参见字体指南中的[为一个字体系列加载多种字重和样式](/develop/user-interface/fonts#loading-multiple-weights-and-styles-for-one-font-family)。

## API

```js
import * as Font from 'expo-font';
```

## 错误码

| 代码 | 描述 |
| --- | --- |
| ERR_FONT_API | 传给 `loadAsync` 的参数无效。 |
| ERR_FONT_SOURCE | 提供的资源类型不正确。 |
| ERR_WEB_ENVIRONMENT | 浏览器的 `document` 元素不支持注入字体。 |
| ERR_DOWNLOAD | 下载提供的资源失败。 |
| ERR_FONT_FAMILY | 提供了无效的字体系列名。 |
| ERR_UNLOAD | 试图卸载尚未加载完成的字体。 |
