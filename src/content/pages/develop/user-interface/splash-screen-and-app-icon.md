---
title: 启动画面与应用图标
description: 了解如何为 Expo 项目添加启动画面与应用图标。
---

# 启动画面与应用图标

## 启动画面

启动画面（splash screen，也叫 launch screen）是用户打开应用时最先看到的内容，在加载期间持续显示。它的消失时机可以用原生的 [SplashScreen API](/versions/latest/sdk/splash-screen) 控制。

[`expo-splash-screen`](/versions/latest/sdk/splash-screen) 内置了一个[配置插件](/develop/config-plugins/introduction)，用于配置启动图标、背景颜色等。

:::warning
不建议在 Expo Go 或开发构建中测试启动画面，因为 Expo Go 在启动画面可见时会显示你的应用图标，而开发构建中的 `expo-dev-client` 有自己的启动画面，可能产生冲突。建议改用[预览构建](/build/eas-json)或[生产构建](/build/eas-json)。
:::

### 创建启动画面图标

使用提供的 [Figma 模板](https://www.figma.com/community/file/1637141012732584189)，它为 Android 与 iOS 提供了一套简约的图标与启动画面设计。

**建议：**

- 使用 1024x1024 的图片。
- 使用 **.png** 文件。
- 使用透明背景。

### 将启动图标导出为 .png

把图标导出为 **.png** 放入 **assets/images** 目录。Expo 默认使用文件名 **splash-icon.png**；如果你改了名字，请在配置步骤中同步修改。

:::note
目前 Expo 项目中只有 .png 图片可以用作启动图标；使用其他格式会导致生产构建失败。
:::

### 配置启动画面图标

在应用配置文件的 plugins 下：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#232323",
          "image": "./assets/images/splash-icon.png",
          "dark": {
            "image": "./assets/images/splash-icon-dark.png",
            "backgroundColor": "#000000"
          },
          "imageWidth": 200
        }
      ]
    ]
  }
}
```

通过构建[内部分发版本](/tutorial/eas/internal-distribution-builds)或生产版本（[Android](/tutorial/eas/android-production-build) / [iOS](/tutorial/eas/ios-production-build) 指南）来测试。

链接：[可配置的启动画面属性](/versions/latest/sdk/splash-screen) —— 涵盖该 API 的可配置属性。

#### 为 Android 与 iOS 分别配置 expo-splash-screen 属性

`expo-splash-screen` 支持 `android` 与 `ios` 键，用于平台专属配置：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-splash-screen",
        {
          "ios": {
            "backgroundColor": "#ffffff",
            "image": "./assets/images/splash-icon.png",
            "resizeMode": "cover"
          },
          "android": {
            "backgroundColor": "#0c7cff",
            "image": "./assets/images/splash-android-icon.png",
            "imageWidth": 150
          }
        }
      ]
    ]
  }
}
```

#### 不使用 prebuild？

如果你的应用不使用 [Expo Prebuild](/more/glossary-of-terms) 生成原生 **android**/**ios** 目录，应用配置的改动不会生效。参见[如何手动自定义](https://github.com/expo/expo/tree/main/packages/expo-splash-screen#-installation-in-bare-react-native-projects)。

#### 故障排查：iOS 上新的启动画面不显示

对于 SDK 52 及更早版本，iOS 开发构建可能会在多次构建之间缓存启动画面，给测试新图片带来麻烦。Apple 的建议是在重新构建前清空 derived data 目录，可以通过 Expo CLI 实现：

```sh
# npm
npx expo run:ios --no-build-cache

# yarn
yarn expo run:ios --no-build-cache

# pnpm
pnpm expo run:ios --no-build-cache

# bun
bun expo run:ios --no-build-cache
```

参见 [Apple 关于测试启动画面的指南](https://developer.apple.com/documentation/technotes/tn3118-debugging-your-apps-launch-screen)。

## 应用图标

应用图标出现在设备主屏幕与应用商店中；Android 与 iOS 各自有着不同且严格的要求。

### 创建应用图标

同样可以使用这个 [Figma 模板](https://www.figma.com/community/file/1637141012732584189)，它为两个平台提供简约的图标/启动画面设计。

### 将图标图片导出为 .png

导出为 **.png** 放入 **assets/images**。默认文件名是 **icon.png**（如果用了别的名字，请在下一步中使用该名字）。

### 在应用配置中添加图标

把本地路径作为 [`icon`](/versions/latest/config/app) 属性的值：

```json app.json
{
  "icon": "./assets/images/icon.png"
}
```

#### Android 与 iOS 的自定义配置提示

#### Android

通过 [`android.adaptiveIcon`](/versions/latest/config/app) 可以做更多自定义，它会覆盖上面的设置。

自适应图标（Adaptive Icon）由两层组成 —— 前景图片加上背景颜色或图片 —— 让操作系统可以把它裁剪成各种形状并应用视觉效果。Android 13+ 支持由壁纸与设备主题驱动的主题图标（themed icons）。

启动器图标请遵循 [Android Adaptive Icon Guidelines](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive)。此外：

- 使用 **.png** 文件。
- 通过 `android.adaptiveIcon.foregroundImage` 设置前景路径。
- 通过 `android.adaptiveIcon.monochromeImage` 设置单色路径。
- 背景默认为白色；用 `android.adaptiveIcon.backgroundColor` 更改，或用 `android.adaptiveIcon.backgroundImage`（与前景尺寸一致）。

对于不支持自适应图标的旧 Android 设备，使用 `android.icon` —— 一个合并了前景与背景层的单一图标。

> 专业好看的图标请参见 [Apple 最佳实践](https://developer.apple.com/design/human-interface-guidelines/app-icons/#Best-practices)，例如在各种壁纸下检查效果、避免在文字标志旁再加文字。"提供的图标至少应为 512x512 像素。"

#### iOS

[Icon Composer](https://www.youtube.com/watch?v=RZ_QMym3adw) —— 一个介绍如何为 Expo 应用图标使用 Icon Composer 的视频。

iOS 图标应遵循 [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons/)。使用 [Icon Composer](https://developer.apple.com/icon-composer/) 应用会生成一个 **.icon** 目录，放在项目的 **assets** 目录中，其路径在应用配置中给出。深色模式在 Icon Composer 内部处理，因此无需提供变体。

:::note
通过 `ios.icon` 提供 Icon Composer **.icon** 目录在 SDK 54 及更高版本中受支持。
:::

```json app.json
{
  "expo": {
    "ios": {
      "icon": "./assets/app.icon"
    }
  }
}
```

基于图片的方式仍然受支持。指引：

- 使用 **.png** 文件。
- 1024x1024 是合适的尺寸；对于 `npx create-expo-app` 项目，[EAS Build](/build/setup) 会生成其他尺寸（最大 1024x1024）。对于[现有 React Native 项目](/bare/overview)，请自行生成各尺寸图标。
- 图标必须严格为正方形 —— 例如 1023x1024 是无效的。
- 填满整个正方形，不要圆角或透明像素；裁剪由操作系统处理。
- `ios.icon` 可以为不同系统外观（dark、tinted）定义图标；如果指定了它，会覆盖应用配置文件中的顶层 icon 键。

```json app.json
{
  "expo": {
    "ios": {
      "icon": {
        "dark": "./assets/images/ios-dark.png",
        "light": "./assets/images/ios-light.png",
        "tinted": "./assets/images/ios-tinted.png"
      }
    }
  }
}
```
