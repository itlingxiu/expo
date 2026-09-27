---
title: ScreenOrientation 包参考
description: 用于管理设备屏幕方向的通用库。
---

# ScreenOrientation 包参考

> 支持平台：Android、iOS、Web、Expo Go。

屏幕方向指图形在设备上绘制时的方向。例如，下图中的设备在物理上分别处于竖直和水平方向，但屏幕方向都是竖屏。关于设备的物理方向，请参阅 [Device Motion](/versions/latest/sdk/devicemotion) 的方向一节。

![不同物理朝向下的竖屏方向。](/static/images/screen-orientation-portrait.jpg)

在 Android 和 iOS 上，更改屏幕方向会覆盖任何系统设置或用户偏好。在 Android 上，可以在考虑用户首选方向的同时更改屏幕方向。在 iOS 上，应用无法访问用户和系统设置，对屏幕方向的任何更改都会覆盖现有设置。

> Web 的支持[有限](https://caniuse.com/#feat=deviceorientation)。

## iOS 27 及更高版本上的方向锁定

从 iOS 27 开始，iPhone 应用可以被调整大小，例如在 macOS 上的 iPhone 镜像中，或在 iPad 上运行时。当应用可调整大小时，系统会把受支持的方向当作偏好而不是硬性要求。这会带来两个后果：

- `lockAsync` 可能没有效果。系统可以拒绝该请求，应用仍保持可调整大小。
- `getOrientationAsync` 可能无法描述应用正在绘制的窗口形状。无论窗口宽高比如何，iPhone 镜像始终报告竖屏方向。

请把界面设计成适应可用空间，而不是依赖固定方向。在调试构建中，当系统拒绝方向锁定时，这个库会输出警告。利用这些警告找出仍然依赖平台不再保证的锁定的屏幕。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-screen-orientation
```
:::
:::tab yarn
```sh
yarn expo install expo-screen-orientation
```
:::
:::tab pnpm
```sh
pnpm expo install expo-screen-orientation
```
:::
:::tab bun
```sh
bun expo install expo-screen-orientation
```
:::
:::

### 警告

Apple 在 iOS 9 中为 iPad 增加了*分屏*模式支持。这改变了系统处理屏幕方向的方式。简单来说，在 iOS 上，除非并排打开两个应用，否则 iPad 始终处于横屏模式。要能用这个模块锁定屏幕方向，需要在[应用配置](/workflow/configuration)中把 [`ios.requireFullScreen`](/versions/latest/config/app#requirefullscreen) 设为 `true`，以禁用对该功能的支持。

在 iOS 27 及更高版本上，`requireFullScreen` 不再让应用退出可调整大小状态，因此无法可靠地锁定屏幕方向。见[iOS 27 及更高版本上的方向锁定](#ios-27-及更高版本上的方向锁定)。关于*分屏*模式的更多信息，请查看[Apple 官方文档](https://support.apple.com/en-us/HT207582)。

## 在应用配置中配置

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-screen-orientation`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

```json
{
  "expo": {
    "ios": {
      "requireFullScreen": true
    },
    "plugins": [
      [
        "expo-screen-orientation",
        {
          "initialOrientation": "DEFAULT"
        }
      ]
    ]
  }
}
```

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `initialOrientation` | `undefined` | 仅 iOS。设置 iOS 的初始屏幕方向。可选值：`DEFAULT`、`ALL`、`PORTRAIT`、`PORTRAIT_UP`、`PORTRAIT_DOWN`、`LANDSCAPE`、`LANDSCAPE_LEFT`、`LANDSCAPE_RIGHT`。 |

<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>

1. 用 `xed ios` 在 Xcode 中打开 **ios** 目录。如果还没有这个目录，运行 `npx expo prebuild -p ios` 来生成。
2. 在 Xcode 中勾选 `Requires Full Screen`。它位于 **Project Target** > **General** > **Deployment Info**。

</details>

## 使用 Expo Router 按屏幕设置方向

如果使用 [Expo Router](/router/introduction)，可以在 [`Stack.Screen`](/router/advanced/stack) 上用 `orientation` 选项为每个屏幕设置方向。这由 `react-native-screens` 驱动，是栈导航器中按屏幕设置方向的推荐方式。

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ orientation: 'portrait' }} />
      <Stack.Screen name="landscape" options={{ orientation: 'landscape' }} />
    </Stack>
  );
}
```

## API

```js
import * as ScreenOrientation from 'expo-screen-orientation';
```
