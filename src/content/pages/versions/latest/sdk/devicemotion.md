---
title: DeviceMotion 包参考
description: 提供设备运动与方向传感器访问能力的库。
---

# DeviceMotion 包参考

`expo-sensors` 提供的 `DeviceMotion` 可访问设备的运动与方向传感器。所有数据都按穿过设备的三个轴呈现。按竖屏方向：X 从左到右，Y 从下到上，Z 从背面到正面垂直穿过屏幕。

> 支持平台：Android、iOS、Web、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-sensors
```
:::
:::tab yarn
```sh
yarn expo install expo-sensors
```
:::
:::tab pnpm
```sh
pnpm expo install expo-sensors
```
:::
:::tab bun
```sh
bun expo install expo-sensors
```
:::
:::

## 在应用配置中配置

如果你的项目使用配置插件（[持续原生生成（CNG）](/workflow/continuous-native-generation)），可以使用内置的[配置插件](/config-plugins/introduction)来配置 `expo-sensors` 中的 `DeviceMotion`。该插件允许你配置若干无法在运行时设置的属性，这些属性需要重新构建应用二进制文件后才会生效。如果应用**没有**使用 CNG，则需要手动配置此库。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-sensors",
        {
          "motionPermission": "Allow $(PRODUCT_NAME) to access your device motion."
        }
      ]
    ]
  }
}
```

### 可配置属性

| 属性 | 平台 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `motionPermission` | iOS | `"Allow $(PRODUCT_NAME) to access your device motion"` | 用于设置 [`NSMotionUsageDescription`](#ios) 权限说明的字符串。 |

如果你没有使用持续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动使用原生 **ios** 项目，则需要在原生项目中配置 `NSMotionUsageDescription` 键，才能访问 `DeviceMotion` 数据：

```xml ios/[app]/Info.plist
<key>NSMotionUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to access your device motion</string>
```

## API

```js
import { DeviceMotion } from 'expo-sensors';
```

## 权限

### iOS

此库使用以下用途说明键：

- `NSMotionUsageDescription`
