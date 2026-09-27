---
title: 字体
description: 了解如何使用本地文件或 Google Fonts 包，在应用中集成自定义字体。
---

# 字体

Android 与 iOS 各自带有平台字体；自定义字体有助于保持一致的 UX 与品牌形象。本指南介绍如何添加并加载自定义字体及相关细节。

## 添加自定义字体

两种方式：(1) 把字体文件放入本地资源目录，例如 **assets/fonts** 目录；(2) 安装 Google Fonts 包，例如 [`@expo-google-fonts/inter`](https://www.npmjs.com/package/@expo-google-fonts/inter)。

### 支持的字体格式

Expo SDK 官方支持 OTF 与 TTF，覆盖 Android、iOS 与 Web。其他格式需要高级配置。

### 可变字体

可变字体（variable font）把多种字面打包进一个文件；你通过 `fontWeight` 和 `fontStyle` 选择字面，而不是每种字重都发布一个文件。[配置插件](#使用-expo-font-配置插件)与 [`useFonts` Hook](#使用-usefonts-hook) 都支持可变字体。

:::note
Android 与 iOS 从 SDK 58 起支持可变字体。更早的版本请使用静态字体文件。
:::

各平台提供字面的方式不同：

- **Android** 读取 `wght` 轴，并在该轴声明的范围内绘制每个 `fontWeight`。需要 Android 10+；更旧的版本渲染默认字重，并通过加粗字母合成粗体。
- **iOS** 读取文件中的命名实例（named instances，例如 "Bold"、"Condensed Light"）—— 设计者在每个轴上命名的固定位置。React Native 选择与请求字重最接近的命名实例；未覆盖的字重无法到达，没有命名实例的文件只会渲染默认字面。
- 对于 `fontStyle: 'italic'`：Android 在 Android 15+ 上应用 `ital` 轴；更旧版本倾斜正体字母。iOS 使用斜体命名实例。
- 在 React Native 0.88（Expo SDK 58）及以上，可以用 [`fontVariationSettings`](https://reactnative.dev/docs/text-style-props) 样式属性设置任意轴，例如 `fontVariationSettings: "'wght' 650, 'wdth' 90"`。在两个平台（Android 8+）的 `<Text>` 与 `<TextInput>` 上都可用，并优先于 `fontWeight`/`fontStyle`。

用 [fontTools](https://fonttools.readthedocs.io/) 检查轴与命名实例；如果需要的字面不可达，可以用 fontTools [提取该轴配置](https://fonttools.readthedocs.io/en/latest/varLib/instancer.html)并另存为静态文件。

### 如何在 OTF 与 TTF 之间选择

如果两者都有，优先选择 OTF —— **.otf** 文件比 **.ttf** 小，而且 OTF 有时渲染效果略好。

## 使用本地字体文件

把文件复制到 **assets/fonts**。

:::note
**assets/fonts** 目录是 React Native 应用中放置字体文件的常见约定。如果你遵循自己的约定，也可以放在别处。
:::

两种使用方式：

- 用 [`expo-font` 配置插件](/versions/latest/sdk/font)嵌入（仅 Android/iOS）。
- 用 [`useFonts`](/versions/latest/sdk/font) Hook 在运行时加载（Android、iOS、Web）。

### 使用 expo-font 配置插件

插件把一个或多个字体文件嵌入原生代码。它支持 Android 与 iOS 上的 `ttf` 与 `otf`；`woff`/`woff2` 仅支持 iOS。

:::note
配置插件只在原生平台（Android 与 iOS）运行。对于 Web，请改用 [`useFonts` Hook](#使用-usefonts-hook)。
:::

这是推荐方式，好处：

- 应用启动时字体立即可用。
- 启动时无需额外的异步加载代码。
- 字体打包在应用中，所有安装都一致可用。

局限：

- 不兼容 Expo Go；需要[创建开发构建](/develop/development-builds/introduction)。

安装库：

```sh
# npm
npx expo install expo-font

# yarn
yarn expo install expo-font

# pnpm
pnpm expo install expo-font

# bun
bun expo install expo-font
```

把插件添加到[应用配置](/versions/latest/config/app)。配置需要通过 [`fonts`、`android` 或 `ios`](/versions/latest/sdk/font) 属性提供字体路径，它们接收一个字体定义数组，路径相对于项目根目录。字体可以指定为带 `fontFamily` 等属性的对象数组，也可以指定为文件路径数组。

对于 Android，可以设置 `fontFamily`、`weight`，以及可选的 `style`（默认 `"normal"`），把字体嵌入为原生 [XML 资源](https://developer.android.com/develop/ui/views/text-and-emoji/fonts-in-xml)。如果数组里只写文件路径，文件名会成为 Android 的字体族名；iOS 则总是从文件本身读取字体族名。

要只通过 `fontFamily` 引用字体，提供路径数组（见 `FiraSans-MediumItalic.ttf`）并遵循[文件命名建议](#如何确定使用哪个字体族名)。要使用 `fontFamily` + `weight` + `style`，提供对象数组（见 `Inter`）。

对于 Android 上的[可变字体](#可变字体)，在每个 `fontDefinitions` 条目中声明文件路径，或紧挨 `fontFamily` 声明一次。同一字体族内每个定义都需要唯一的 `weight`/`style` 组合，因为 Android 按该组合解析字体族。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/FiraSans-MediumItalic.ttf"
          ],
          "android": {
            "fonts": [
              {
                "fontFamily": "Inter",
                "fontDefinitions": [
                  {
                    "path": "./assets/fonts/Inter-BoldItalic.ttf",
                    "weight": 700,
                    "style": "italic"
                  },
                  {
                    "path": "./assets/fonts/Inter-Bold.ttf",
                    "weight": 700
                  }
                ]
              },
              {
                "fontFamily": "Roboto Flex",
                "path": "./assets/fonts/RobotoFlex.ttf",
                "fontDefinitions": [
                  { "weight": 400 },
                  { "weight": 700 },
                  { "weight": 400, "style": "italic", "axes": { "slnt": -10 } }
                ]
              }
            ]
          },
          "ios": {
            "fonts": [
              "./assets/fonts/Inter-Bold.ttf",
              "./assets/fonts/Inter-BoldItalic.ttf",
              "./assets/fonts/RobotoFlex.ttf"
            ]
          }
        }
      ]
    ]
  }
}
```

`style` 选择与 `fontStyle` 匹配的字面，但不会倾斜字形 —— 要从正体文件得到斜体，在 `axes` 中设置倾斜轴（`slnt` 或 `ital`）。`axes` 接受字体声明的任意[变体轴](https://learn.microsoft.com/en-us/typography/opentype/spec/dvaraxisreg)（例如压缩的 `wdth`）。标签是四个区分大小写的字符：注册轴（`ital`、`opsz`、`slnt`、`wdth`、`wght`）为小写，字体专属轴为大写（例如 `GRAD`）。`weight` 设置 `wght`，除非在 `axes` 中被覆盖。在 iOS 上，`path` 与 `axes` 不适用 —— 像静态字体一样在 `ios.fonts` 中列出可变字体文件；可选字面是文件的命名实例，其他轴位置需要 React Native 0.88+ 的 `fontVariationSettings`。

嵌入后，[创建新的开发构建](/develop/development-builds/introduction)并安装。然后用带 `fontFamily` 样式属性的 `<Text>`：

```tsx
<Text style={{ fontFamily: 'Inter', fontWeight: '700' }}>Inter Bold</Text>
<Text style={{ fontFamily: 'Inter', fontWeight: '700', fontStyle: 'italic' }}>Inter Bold Italic</Text>
<Text style={{ fontFamily: 'FiraSans-MediumItalic' }}>Fira Sans Medium Italic</Text>
<Text style={{ fontFamily: 'Roboto Flex', fontWeight: '400', fontStyle: 'italic' }}>Roboto Flex Italic</Text>
```

#### 在现有 React Native 项目中使用此方式？

- **Android：** 把字体文件复制到 **android/app/src/main/assets/fonts**。
- **iOS：** 参见 Apple 文档中的 [Adding a Custom Font to Your App](https://developer.apple.com/documentation/uikit/text_display_and_fonts/adding_a_custom_font_to_your_app)。

#### 如何确定使用哪个字体族名

- 使用文件路径数组时：Android 用文件名（不含扩展名）作为字体族名；iOS 从文件中读取。为跨平台一致，建议按字体的 [PostScript 名称](#什么是字体文件的-postscript-名称)命名文件。
- 使用对象语法时：提供 "Family Name"，可以在 macOS 的 Font Book、[fontdrop.info](https://fontdrop.info/) 或类似程序中找到。

#### 什么是字体文件的 PostScript 名称？

它是遵循 Adobe PostScript 标准的唯一标识符，操作系统/应用用它来引用字体 —— 不是显示名称。例如，Inter Black 的 PostScript 名称是 `Inter-Black`。

### 使用 useFonts Hook

`expo-font` 的 `useFonts` 异步加载字体文件、跟踪加载状态，并在应用初始化时加载字体。它兼容所有 Expo SDK 版本与 Expo Go。安装：

```sh
# npm
npx expo install expo-font expo-splash-screen

# yarn
yarn expo install expo-font expo-splash-screen

# pnpm
pnpm expo install expo-font expo-splash-screen

# bun
bun expo install expo-font expo-splash-screen
```

[`expo-splash-screen`](/versions/latest/sdk/splash-screen) 提供 `SplashScreen`，在字体就绪前阻止渲染。在 **src/app/_layout.tsx** 这样的顶层组件中映射字体：

```tsx src/app/_layout.tsx
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
    'Roboto Flex': require('./assets/fonts/RobotoFlex.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    ...
  )
}
```

在 `<Text>` 上使用：

```tsx
<Text style={{ fontFamily: 'Inter-Black' }}>Inter Black</Text>
```

对于[可变字体](#可变字体)，用 `fontWeight`/`fontStyle` 选择字面：

```tsx
<Text style={{ fontFamily: 'Roboto Flex', fontWeight: '300' }}>Roboto Flex Light</Text>
<Text style={{ fontFamily: 'Roboto Flex', fontWeight: '700' }}>Roboto Flex Bold</Text>
```

`useFonts` 只读取 weight 轴。对于其他轴（例如 `wdth`、`slnt`），在 Android 上用[配置插件](#使用-expo-font-配置插件)嵌入，或在 React Native 0.88+ 上设置 [`fontVariationSettings`](#可变字体)。

#### 为一个字体族加载多个字重与样式

:::note
在同一个字体族名下加载多个字体文件，从 SDK 58 起可用。
:::

映射语法把每个键视为独立的字体族。要在同一个 `fontFamily` 下加载多个文件（常规、粗体、斜体），给 `useFonts` 传一个 [`FontFamilyDefinition`](/versions/unversioned/sdk/font) 数组：

```tsx src/app/_layout.tsx
const [loaded, error] = useFonts([
  {
    fontFamily: 'Inter',
    fontDefinitions: [
      { path: require('./assets/fonts/Inter-Regular.otf'), weight: 400 },
      { path: require('./assets/fonts/Inter-Italic.otf'), weight: 400, style: 'italic' },
      { path: require('./assets/fonts/Inter-Bold.otf'), weight: 700 },
    ],
  },
]);
```

然后用 `fontWeight`/`fontStyle` 选择字面：

```tsx
<Text style={{ fontFamily: 'Inter', fontWeight: '700' }}>Inter Bold</Text>
<Text style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'italic' }}>Inter Italic</Text>
```

所有字面都要在一次调用中声明：一个 `fontFamily` 只加载一次，之后对已加载名称调用 `loadAsync`/`useFonts` 不会增加任何内容 —— 包括混合调用风格（先 `useFonts({ Inter: require('./assets/fonts/Inter-Regular.otf') })`，再为 `Inter` 传数组也不会多加载任何东西）。

多字面字体族的每个字面都要声明 `weight` 与 `style`；Web 需要两者，显式声明也能让各平台保持一致。例外：单个可变字体文件 —— 不设 `style`，`weight` 不设或设为 `'100 900'` 这样的范围；Android 会为每个 `fontWeight` 实例化 `wght`，而不是固定在一个字重上。

平台说明：

- **Android** 使用声明的 `weight`/`style`，缺失时回退到文件中的值。声明 `weight` 会把可变字面固定在该字重，其余由 Android 合成。在 API 29（Android 10）以下，只会加载默认字面（选择最接近字重 400 的正体）。配置插件嵌入的字体使用 XML 资源，没有这个限制。
- **iOS** 按文件中的元数据匹配字面；声明的值只在文件没有可读元数据时用于选择字体族默认值。
- **Web** 为每个字面生成一条 CSS `@font-face` 规则，使用声明的值。CSS 无法读取文件元数据，因此未声明的 `style` 会渲染为正体；两个字面声明了相同的未声明值会产生相同规则，浏览器渲染最后一条。

## 使用 Google Fonts

Expo 对所有 [Google Fonts](https://fonts.google.com/) 提供一等支持，通过 [`@expo-google-fonts`](https://github.com/expo/google-fonts) 库提供。两种用法：用 [`expo-font` 配置插件](/versions/latest/sdk/font)嵌入，或用 [`useFonts`](/versions/latest/sdk/font) Hook 在运行时加载。

### 使用 expo-font 配置插件

:::note
用 `expo-font` 配置插件嵌入 Google Font 与嵌入自定义字体的好处和局限相同。详见[使用本地字体文件与 expo-font 配置插件](#使用-expo-font-配置插件)。
:::

安装包，以 Inter Black 为例：

```sh
# npm
npx expo install expo-font @expo-google-fonts/inter

# yarn
yarn expo install expo-font @expo-google-fonts/inter

# pnpm
pnpm expo install expo-font @expo-google-fonts/inter

# bun
bun expo install expo-font @expo-google-fonts/inter
```

把插件添加到[应用配置](/versions/latest/config/app)，[`fonts`](/versions/latest/sdk/font) 接收文件数组，路径指向 `node_modules` 中的字体包。对于 `@expo-google-fonts/inter`，文件是 **Inter_900Black.ttf**。

```json app.json
{
  "plugins": [
    [
      "expo-font",
      {
        "fonts": ["node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf"]
      }
    ]
  ]
}
```

嵌入后，[创建新的开发构建](/develop/development-builds/introduction)并安装。Android 上使用文件名（例如 `Inter_900Black`）；iOS 上使用字体与字重名称（[PostScript 名称](#什么是字体文件的-postscript-名称)）。用 [`Platform`](https://reactnative.dev/docs/platform-specific-code#platform-module) 选择正确的名称：

```tsx
import { Platform } from 'react-native';

// Inside a React component:
<Text
  style={{
    fontFamily: Platform.select({
      android: 'Inter_900Black',
      ios: 'Inter-Black',
    }),
  }}>
  Inter Black
</Text>
```

### 使用 useFonts Hook

:::note
用 `useFonts` Hook 加载 Google Font 与嵌入自定义字体的好处和局限相同。详见[使用本地字体文件与 useFonts Hook](#使用-usefonts-hook)。
:::

每个 Google Fonts 包都提供 `useFonts` Hook，异步加载字体并为你导入字体文件。安装：

```sh
# npm
npx expo install @expo-google-fonts/inter expo-font expo-splash-screen

# yarn
yarn expo install @expo-google-fonts/inter expo-font expo-splash-screen

# pnpm
pnpm expo install @expo-google-fonts/inter expo-font expo-splash-screen

# bun
bun expo install @expo-google-fonts/inter expo-font expo-splash-screen
```

[`expo-splash-screen`](/versions/latest/sdk/splash-screen) 提供 `SplashScreen`，在字体就绪前阻止渲染。然后在 **src/app/_layout.tsx** 这样的顶层组件中映射字体：

```tsx src/app/_layout.tsx
// Rest of the import statements
import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    ...
  )
}
```

在 `<Text>` 上使用：

```tsx
<Text style={{ fontFamily: 'Inter_900Black' }}>Inter Black</Text>
```

## 更多信息

### 最小示例

[expo-font 用法](/versions/latest/sdk/font) —— 参见 Expo Fonts API 参考的用法一节，获取自定义字体的最小示例。

### 超越 OTF 与 TTF

其他格式需要[自定义 Metro bundler 配置，把它们作为额外资源包含进来](/guides/customizing-metro)；渲染不支持的格式可能导致应用崩溃。格式支持：

| 格式 | Android | iOS | Web |
| --- | --- | --- | --- |
| bdf | ✗ | ✗ | ✗ |
| dfont | ✓ | ✗ | ✗ |
| eot | ✗ | ✗ | ✓ |
| fon | ✗ | ✗ | ✗ |
| otf | ✓ | ✓ | ✓ |
| ps | ✗ | ✗ | ✗ |
| svg | ✗ | ✗ | ✓ |
| ttc | ✗ | ✗ | ✗ |
| ttf | ✓ | ✓ | ✓ |
| woff | ✗ | ✓ | ✓ |
| woff2 | ✗ | ✓ | ✓ |

### 平台内置字体

不设置自定义 `fontFamily` 时使用平台默认字体：Android 是 Roboto，iOS 是 SF Pro。默认字体通常可读性良好，但系统可能更改它们；自定义字体能精确控制。

### 处理 @expo/vector-icons 的首次加载

`@expo/vector-icons` 的图标首次加载时不可见，之后会被缓存。用 [`useFonts`](/versions/latest/sdk/font) 在初始加载画面期间预加载：

```tsx src/app/_layout.tsx
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RootLayout() {
  useFonts([require('./assets/fonts/Inter-Black.otf'), Ionicons.font]);

  return (
    ...
  )
}
```

然后使用任意图标：

```tsx
<Ionicons name="checkmark-circle" size={32} color="green" />
```

参见[图标](/guides/icons)，了解矢量图标、自定义图标字体、图片与图标按钮。

### 直接从 Web 加载远程字体

:::warning
**如果你要加载远程字体，请确保它们由正确配置了 CORS 的源提供**。否则你的远程字体在 Web 平台上可能无法正常加载。
:::

本地资源最安全：随下载打包、立即可用、没有 CORS 问题。要从 Web 加载，把 `require('./assets/fonts/FontName.otf')` 替换为 URL：

```tsx Using a remote font
import { useFonts } from 'expo-font';
import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  const [loaded, error] = useFonts({
    'Inter-SemiBoldItalic': 'https://rsms.me/inter/font-files/Inter-SemiBoldItalic.otf?v=3.12',
  });

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'Inter-SemiBoldItalic', fontSize: 30 }}>Inter SemiBoldItalic</Text>
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
