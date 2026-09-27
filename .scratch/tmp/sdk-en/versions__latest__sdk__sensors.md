---
title: Sensors
description: A library that provides access to a device's accelerometer, barometer, motion, gyroscope, light, magnetometer, and pedometer.
packageName: expo-sensors
---

# Sensors

> 支持平台：Android、iOS、Web、Expo Go。

`expo-sensors` provide various APIs for accessing device sensors to measure motion, orientation, pressure, magnetic fields, ambient light, and step count.

## Installation

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

## Configuration in app config

You can configure `expo-sensors` using its built-in [config plugin](/config-plugins/introduction) if you use config plugins in your project ([Continuous Native Generation (CNG)](/workflow/continuous-native-generation)). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does **not** use CNG, then you'll need to manually configure the library.

### Example app.json with config plugin

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

### Configurable properties

| Name | Default | Description |
| --- | --- | --- |
| `motionPermission` | `"Allow $(PRODUCT_NAME) to access your device motion"` | Only for: iOS. A string to set the [`NSMotionUsageDescription`](#permission-nsmotionusagedescription) permission message or `false` to disable motion permissions. |

## API

```js
import * as Sensors from 'expo-sensors';
// OR
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

## Permissions

### Android

Starting in Android 12 (API level 31), the system has a 200Hz limit for each sensor updates.

If you need an update interval greater than 200Hz, you must add the following permissions to your **app.json** inside the [`expo.android.permissions`](/versions/latest/config/app#permissions) array.

| Android permission | Description |
| --- | --- |
| `HIGH_SAMPLING_RATE_SENSORS` | Allows an app to access sensor data with a sampling rate greater than 200 Hz. |

<details><summary>Are you using this library in an existing React Native app?</summary>

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation)) or you're using native **android** project manually, add `HIGH_SAMPLING_RATE_SENSORS` permission to your project's **android/app/src/main/AndroidManifest.xml**:

```xml
<uses-permission android:name="android.permission.HIGH_SAMPLING_RATE_SENSORS" />
```

</details>

### iOS

The following usage description keys are used by this library:

| Info.plist key | Description |
| --- | --- |
| `NSMotionUsageDescription` | A message that tells the user why the app is requesting access to the device’s motion data. Warning: This key is required if your app uses APIs that access the device’s motion data, including CMSensorRecorder, CMPedometer, CMMotionActivityManager, and CMMovementDisorderManager. If you don’t include this key, your app will crash when it attempts to access motion data. |

## Available sensors

For more information, see the documentation for the sensor you are interested in:

- [Accelerometer](/versions/latest/sdk/accelerometer)：Measures device acceleration on all platforms.

- [Barometer](/versions/latest/sdk/barometer)：Measures pressure on Android and iOS platforms.

- [DeviceMotion](/versions/latest/sdk/devicemotion)：Measures device motion on all platforms.

- [Gyroscope](/versions/latest/sdk/gyroscope)：Measures device rotation on all platforms.

- [Magnetometer](/versions/latest/sdk/magnetometer)：Measures magnetic fields on Android and iOS platforms.

- [LightSensor](/versions/latest/sdk/light-sensor)：Measures ambient light on Android platform.

- [Pedometer](/versions/latest/sdk/pedometer)：Measures steps count on Android and iOS platforms.

