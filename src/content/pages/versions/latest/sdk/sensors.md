---
title: Sensors 包参考
description: 用于访问设备加速度计、气压计、运动、陀螺仪、光线、磁力计和计步器的库。
---

# Sensors 包参考

> 支持平台：Android、iOS、Web、Expo Go。

`expo-sensors` 提供多种 API，用于访问设备传感器，以测量运动、方向、气压、磁场、环境光和步数。

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

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-sensors`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

```json
{
  "expo": {
    "plugins": [
      [
        "expo-sensors",
        {
          "motionPermission": "Allow $(PRODUCT_NAME) to access your device motion"
        }
      ]
    ]
  }
}
```

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `motionPermission` | `"Allow $(PRODUCT_NAME) to access your device motion"` | 仅 iOS。用于设置 [`NSMotionUsageDescription`](#permission-nsmotionusagedescription) 权限提示文案的字符串；设为 `false` 可禁用运动权限。 |

## API

```js
import * as Sensors from 'expo-sensors';
// 或者
import {
  Accelerometer,
  Barometer,
  DeviceMotion,
  Gyroscope,
  LightSensor,
  Magnetometer,
  MagnetometerUncalibrated,
  Pedometer,
} from 'expo-sensors';
```

## 权限

### Android

从 Android 12（API 级别 31）开始，系统对每个传感器的更新频率限制为 200Hz。

如果需要高于 200Hz 的更新间隔，必须在 **app.json** 的 [`expo.android.permissions`](/versions/latest/config/app#permissions) 数组中添加以下权限。

| Android 权限 | 说明 |
| --- | --- |
| `HIGH_SAMPLING_RATE_SENSORS` | 允许应用以高于 200 Hz 的采样率访问传感器数据。 |

<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>

如果你没有使用连续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动维护原生 **android** 项目，请把 `HIGH_SAMPLING_RATE_SENSORS` 权限添加到项目的 **android/app/src/main/AndroidManifest.xml**：

```xml
<uses-permission android:name="android.permission.HIGH_SAMPLING_RATE_SENSORS" />
```

</details>

### iOS

这个库使用以下用途描述键：

| Info.plist 键 | 说明 |
| --- | --- |
| `NSMotionUsageDescription` | 向用户说明应用为何请求访问设备运动数据的消息。警告：如果应用使用访问设备运动数据的 API（包括 `CMSensorRecorder`、`CMPedometer`、`CMMotionActivityManager` 和 `CMMovementDisorderManager`），则必须提供此键。如果没有这个键，应用在尝试访问运动数据时会崩溃。 |

## 可用传感器

更多信息请参阅你感兴趣的传感器文档：

- [Accelerometer](/versions/latest/sdk/accelerometer)：在所有平台上测量设备加速度。

- [Barometer](/versions/latest/sdk/barometer)：在 Android 和 iOS 上测量气压。

- [DeviceMotion](/versions/latest/sdk/devicemotion)：在所有平台上测量设备运动。

- [Gyroscope](/versions/latest/sdk/gyroscope)：在所有平台上测量设备旋转。

- [Magnetometer](/versions/latest/sdk/magnetometer)：在 Android 和 iOS 上测量磁场。

- [LightSensor](/versions/latest/sdk/light-sensor)：在 Android 上测量环境光。

- [Pedometer](/versions/latest/sdk/pedometer)：在 Android 和 iOS 上测量步数。
