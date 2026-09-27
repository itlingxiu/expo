---
title: Location 包参考
description: 用于读取地理定位信息、轮询当前位置或订阅设备位置更新事件的库。
---

# Location 包参考

> 支持平台：Android、iOS、Web、Expo Go。

`expo-location` 允许从设备读取地理定位信息。应用可以轮询当前位置，或订阅位置更新事件。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-location
```
:::
:::tab yarn
```sh
yarn expo install expo-location
```
:::
:::tab pnpm
```sh
pnpm expo install expo-location
```
:::
:::tab bun
```sh
bun expo install expo-location
```
:::
:::

## 在应用配置中配置

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-location`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        }
      ]
    ]
  }
}
```

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `locationAlwaysAndWhenInUsePermission` | `"Allow $(PRODUCT_NAME) to use your location"` | 仅 iOS。用于设置 [`NSLocationAlwaysAndWhenInUseUsageDescription`](#permission-nslocationalwaysandwheninuseusagedescription) 权限提示文案的字符串。 |
| `locationAlwaysPermission` | `"Allow $(PRODUCT_NAME) to use your location"` | 已弃用 · 仅 iOS。用于设置 [`NSLocationAlwaysUsageDescription`](#permission-nslocationalwaysusagedescription) 权限提示文案的字符串。 |
| `locationWhenInUsePermission` | `"Allow $(PRODUCT_NAME) to use your location"` | 仅 iOS。用于设置 [`NSLocationWhenInUseUsageDescription`](#permission-nslocationwheninuseusagedescription) 权限提示文案的字符串。 |
| `motionUsagePermission` | `"Allow $(PRODUCT_NAME) to detect your current motion activity"` | 仅 iOS。用于设置首次调用 `getMotionActivityAsync` 或 `watchMotionActivityAsync` 时显示的 `NSMotionUsageDescription` 权限提示文案的字符串。 |
| `isIosBackgroundLocationEnabled` | `false` | 仅 iOS。是否在 **Info.plist** 的 `UIBackgroundModes` 中启用 `location` 的布尔值。 |
| `isAndroidBackgroundLocationEnabled` | `false` | 仅 Android。是否启用 [`ACCESS_BACKGROUND_LOCATION`](#permission-access_background_location) 权限的布尔值。 |
| `isAndroidForegroundServiceEnabled` | - | 仅 Android。是否启用 [`FOREGROUND_SERVICE`](#permission-foreground_service) 权限和 [`FOREGROUND_SERVICE_LOCATION`](#permission-foreground_service_location)（在 Android 14 及更高版本上运行位置前台服务时必需）的布尔值。如果 `isAndroidBackgroundLocationEnabled` 为 `true`，默认值为 `true`，否则为 `false`。 |
| `androidForegroundServiceIcon` | - | 仅 Android。用作 `startLocationUpdatesAsync` 启动的前台服务图标的图片本地路径。96x96、带透明度的全白 png。如果未设置，会回退到 `notification_icon` drawable（若通过 `expo-notifications` 配置插件配置），然后再回退到应用启动图标。启动图标是全彩色的，由于 Android 要求通知图标为单色，它可能会渲染成纯白方块。 |

<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>

如果你不使用连续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动使用原生 **ios** 项目，则需要在项目的 **ios/[app]/Info.plist** 中添加 `NSLocationAlwaysAndWhenInUseUsageDescription`、`NSLocationAlwaysUsageDescription` 和 `NSLocationWhenInUseUsageDescription` 键：

```xml
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to use your location</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to use your location</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to use your location</string>
```

</details>

### 后台位置

后台位置允许应用在后台运行时接收位置更新，包括通过地理围栏进行的位置更新和区域监视。此功能受平台 API 限制和系统约束：

- 如果用户终止应用，后台位置会停止。
- 如果用户重新启动应用，后台位置会恢复。
- Android：由于平台限制，已终止的应用不会在位置或地理围栏事件发生时自动重启。
- iOS：当新的地理围栏事件发生时，系统会重启已终止的应用。

:::note
在 Android 上，从最近使用的应用列表中移除应用的结果因设备厂商而异。例如，某些实现会把从最近使用列表中移除应用视为杀掉应用。关于这些差异，详见：[https://dontkillmyapp.com](https://dontkillmyapp.com)。
:::

### iOS 后台位置配置

要在 iOS 上运行后台位置，需要在应用的 **Info.plist** 文件的 `UIBackgroundModes` 数组中添加 `location` 值。

**如果你使用 [CNG](/workflow/continuous-native-generation)**，预构建会自动应用所需的 `UIBackgroundModes` 配置。

<details><summary>在 iOS 上手动配置 UIBackgroundModes</summary>

如果你不使用连续原生生成（[CNG](/workflow/continuous-native-generation)），或者使用原生 iOS 项目，则需要在 **Expo.plist** 文件中添加以下内容：

```xml
<key>UIBackgroundModes</key>
  <array>
    <string>location</string>
  </array>
```

</details>

### 后台位置方法

要使用后台位置方法，需满足以下要求：

- 必须授予位置权限。
- 后台位置任务必须在顶层作用域中使用 [`TaskManager.defineTask`](/versions/latest/sdk/task-manager#taskmanagerdefinetasktaskname-taskexecutor) 定义。
- iOS：必须在 **Info.plist** 文件中指定 `"location"` 后台模式。见[后台位置配置](#ios-后台位置配置)。
- iOS：必须使用[开发构建](/develop/development-builds/introduction)来使用后台位置，因为 Expo Go 应用不支持。

### 地理围栏方法

要使用地理围栏方法，需满足以下要求：

- 必须授予位置权限。
- 地理围栏任务必须在顶层作用域中使用 [`TaskManager.defineTask`](/versions/latest/sdk/task-manager#taskmanagerdefinetasktaskname-taskexecutor) 定义。

使用地理围栏时，存在以下平台差异：

- Android：每个应用最多允许 [100 个](https://developer.android.com/develop/sensors-and-location/location/geofencing)活动地理围栏。
- iOS：Expo Location 会在应用启动时报告已注册地理围栏的初始状态。
- iOS：可同时监视的 `regions` [上限为 20](https://developer.apple.com/documentation/corelocation/monitoring_the_user_s_proximity_to_geographic_regions)。

### 后台权限

要在后台使用位置跟踪或地理围栏，必须请求相应权限：

- 在 Android 上，必须同时请求前台和后台权限。
- 在 iOS 上，必须使用 [`requestBackgroundPermissionsAsync`](#locationrequestbackgroundpermissionsasync) 以 `Always` 选项授予。

<details><summary>Expo 与 iOS 权限</summary>

iOS 权限分为 `When In Use` 和 `Always` 两类，对应 Expo 通过以下方式请求的前台和后台位置权限：

- [`requestForegroundPermissionsAsync`](#locationrequestforegroundpermissionsasync) 对应 `When In Use`
- [`requestBackgroundPermissionsAsync`](#locationrequestbackgroundpermissionsasync) 对应 `Always`

> **注意：** 请求 `When In Use` 授权时，用户可以在系统权限对话框中选择 `Allow Once` 来授予**临时访问**。此授权**仅对当前应用会话有效**，应用关闭时会自动撤销。

**区分「Allow Once」和「Allow While Using the App」**

遗憾的是，**iOS 不提供方法来检测用户选择的是 `Allow Once` 还是 `Allow While Using the App`**。两种响应都会得到 `When In Use` 授权。

如果用户选择了 `Allow Once`，而你随后在同一会话中调用 [`requestBackgroundPermissionsAsync`](#locationrequestbackgroundpermissionsasync)，系统**不会再显示另一个提示**。请求会**静默失败**，返回的后台权限状态为**已拒绝**。

**处理「Allow Once」场景**

如果你怀疑用户选择了 `Allow Once`，并且需要请求后台权限，他们必须在「设置」应用中**手动启用后台位置**。你可以在应用内用 `Linking` 打开「设置」应用：

```js
import { Linking } from 'react-native';

function openSettings() {
  Linking.openURL('app-settings:');
}
```

**分步请求权限**

可以先请求前台位置访问，稍后再请求后台位置访问。这样只在必要时请求权限，可以改善用户体验。

**直接请求后台权限**

如果在未先请求前台权限的情况下调用 [`requestBackgroundPermissionsAsync`](#locationrequestbackgroundpermissionsasync)，iOS 会把它视为同时请求 `When In Use` 和 `Always` 授权。系统随后会提示用户授予 `When In Use` 访问，并在系统判定需要 `Always` 授权时显示 `Always` 授权提示。

请记住，用户可以选择只授予应用 `When In Use` 授权。你必须始终准备好在只有 `When In Use` 权限的情况下运行。

</details>

## 延迟位置更新

使用后台位置时，可以配置位置管理器延迟更新。这通过降低更新频率来节省电量。你可以设置为仅在设备移动了一定距离或经过指定时间间隔后才触发更新。

延迟更新通过 [`LocationTaskOptions`](#locationtaskoptions) 的 [`deferredUpdatesDistance`](#locationtaskoptions)、[`deferredUpdatesInterval`](#locationtaskoptions) 和 [`deferredTimeout`](#locationtaskoptions) 属性配置。

> 延迟位置更新仅在应用处于后台时生效。

## 用法

如果你使用 Android 模拟器或 iOS 模拟器，请确保[已启用位置](#启用模拟器位置)。

```tsx
import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
```

## 启用模拟器位置

### Android 模拟器

打开 Android Studio 并启动 Android 模拟器。在其中进入 **Settings** > **Location**，启用 **Use location**。

![Android 12 及更高版本模拟器中的位置设置](/static/images/sdk/location/enable-android-emulator-location.png)

如果在模拟器中收不到位置，可能需要关闭 **Improve Location Accuracy** 设置。这会关闭 Wi-Fi 定位并只使用 GPS。然后你可以通过模拟器用 GPS 数据操控位置。

对于 Android 12 及更高版本，进入 **Settings** > **Location** > **Location Services** > **Google Location Accuracy**，关闭 **Improve Location Accuracy**。对于 Android 11 及更低版本，进入 **Settings** > **Location** > **Advanced** > **Google Location Accuracy**，关闭 **Google Location Accuracy**。

### iOS 模拟器

打开 Device Hub，进入 **Device** > **Location**，选择 **None** 以外的任意选项。

![Device Hub 中打开了 Location 子菜单的 Device 菜单。](/static/images/sdk/location/device-hub-location.webp)

## API

```js
import * as Location from 'expo-location';
```

## 权限

### Android

:::warning
Android 的前台和后台服务在 Expo Go 中不可用。建议改用[开发构建](/develop/development-builds/introduction)，以避免这些限制。
:::

安装 `expo-location` 模块时，它会自动添加以下权限：

- `ACCESS_COARSE_LOCATION`：用于大致的设备位置
- `ACCESS_FINE_LOCATION`：用于精确的设备位置

以下权限是可选的：

- `FOREGROUND_SERVICE` 和 `FOREGROUND_SERVICE_LOCATION`：用于在应用打开但处于后台时访问位置。`FOREGROUND_SERVICE_LOCATION` 仅从 Android 14 起必需。在新构建中启用此项后，你需要[提交应用以供审核并请求使用前台服务权限](https://support.google.com/googleplay/android-developer/answer/13392821?hl=en)。
- `ACCESS_BACKGROUND_LOCATION`：用于在应用处于后台或已关闭时访问位置。在新构建中启用此项后，你需要[提交应用以供审核并请求使用后台位置权限](https://support.google.com/googleplay/android-developer/answer/9799150?hl=en)。

| Android 权限 | 说明 |
| --- | --- |
| `ACCESS_COARSE_LOCATION` | 允许应用访问大致位置。你也可以改用 `[ACCESS_FINE_LOCATION](https://developer.android.com/reference/android/Manifest.permission#ACCESS_FINE_LOCATION)`。 |
| `ACCESS_FINE_LOCATION` | 允许应用访问精确位置。你也可以改用 `[ACCESS_COARSE_LOCATION](https://developer.android.com/reference/android/Manifest.permission#ACCESS_COARSE_LOCATION)`。 |
| `FOREGROUND_SERVICE` | 允许普通应用使用 Service.startForeground。允许普通应用使用 `[Service.startForeground](https://developer.android.com/reference/android/app/Service#startForeground(int,%20android.app.Notification))`。 |
| `FOREGROUND_SERVICE_LOCATION` | 允许普通应用使用类型为 "location" 的 Service.startForeground。允许普通应用使用类型为 "location" 的 `[Service.startForeground](https://developer.android.com/reference/android/app/Service#startForeground(int,%20android.app.Notification))`。 |
| `ACCESS_BACKGROUND_LOCATION` | 允许应用在后台访问位置。如果请求此权限，还必须请求 `[ACCESS_COARSE_LOCATION](https://developer.android.com/reference/android/Manifest.permission#ACCESS_COARSE_LOCATION)` 或 `[ACCESS_FINE_LOCATION](https://developer.android.com/reference/android/Manifest.permission#ACCESS_FINE_LOCATION)`。单独请求此权限不会获得位置访问。 |

#### 排除某个权限

:::note
从应用中的模块排除**必需权限**可能会破坏与该权限对应的功能。请始终包含模块所依赖的全部权限。
:::

当 Expo 项目从包含某个特定权限中得不到好处时，可以省略它。例如，如果应用不需要访问精确位置，可以排除 `ACCESS_FINE_LOCATION` 权限。

另一个例子可以用[可用的位置精度](#accuracy)来说明。Android 把大致位置精度估计定义在约 3 平方公里内，把精确位置精度估计定义在约 50 米内。例如，如果位置精度值为 [Low](#low)，可以排除 `ACCESS_FINE_LOCATION` 权限。要了解位置精度级别，见 [Android 文档](https://developer.android.com/training/location/permissions#accuracy)。

要了解如何排除权限，见[排除 Android 权限](/guides/permissions#android)。

### iOS

此库使用以下用途说明键：

| Info.plist 键 | 说明 |
| --- | --- |
| `NSLocationAlwaysAndWhenInUseUsageDescription` | 向用户说明应用为何请求随时访问用户位置信息的消息。警告：如果 iOS 应用使用随时访问用户位置信息的 API，则必须提供此键。 |
| `NSLocationAlwaysUsageDescription` | 向用户说明应用为何请求随时访问用户位置的消息。已弃用。对于部署到 iOS 11 及更高版本目标的应用，请改用 NSLocationAlwaysAndWhenInUseUsageDescription。警告：如果 iOS 应用使用随时访问用户位置的 API，并且部署目标早于 iOS 11，则必须提供此键。 |
| `NSLocationWhenInUseUsageDescription` | 向用户说明应用为何在前台运行时请求访问用户位置信息的消息。警告：如果 iOS 应用使用在应用使用期间访问用户位置信息的 API，则必须提供此键。 |

从 iOS 11 起，`NSLocationAlwaysUsageDescription` 已弃用，请改用 `NSLocationAlwaysAndWhenInUseUsageDescription`。
