---
title: Location
description: A library that provides access to reading geolocation information, polling current location or subscribing location update events from the device.
packageName: expo-location
---

# Location

> 支持平台：Android、iOS、Web、Expo Go。

`expo-location` allows reading geolocation information from the device. Your app can poll for the current location or subscribe to location update events.

## Installation

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

## Configuration in app config

You can configure `expo-location` using its built-in [config plugin](/config-plugins/introduction) if you use config plugins in your project ([Continuous Native Generation (CNG)](/workflow/continuous-native-generation)). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does **not** use CNG, then you'll need to manually configure the library.

### Example app.json with config plugin

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

### Configurable properties

| Name | Default | Description |
| --- | --- | --- |
| `locationAlwaysAndWhenInUsePermission` | `"Allow $(PRODUCT_NAME) to use your location"` | Only for: iOS. A string to set the [`NSLocationAlwaysAndWhenInUseUsageDescription`](#permission-nslocationalwaysandwheninuseusagedescription) permission message. |
| `locationAlwaysPermission` | `"Allow $(PRODUCT_NAME) to use your location"` | Deprecated · Only for: iOS. A string to set the [`NSLocationAlwaysUsageDescription`](#permission-nslocationalwaysusagedescription) permission message. |
| `locationWhenInUsePermission` | `"Allow $(PRODUCT_NAME) to use your location"` | Only for: iOS. A string to set the [`NSLocationWhenInUseUsageDescription`](#permission-nslocationwheninuseusagedescription) permission message. |
| `motionUsagePermission` | `"Allow $(PRODUCT_NAME) to detect your current motion activity"` | Only for: iOS. A string to set the `NSMotionUsageDescription` permission message shown when `getMotionActivityAsync` or `watchMotionActivityAsync` is called for the first time. |
| `isIosBackgroundLocationEnabled` | `false` | Only for: iOS. A boolean to enable `location` in the `UIBackgroundModes` in **Info.plist**. |
| `isAndroidBackgroundLocationEnabled` | `false` | Only for: Android. A boolean to enable the [`ACCESS_BACKGROUND_LOCATION`](#permission-access_background_location) permission. |
| `isAndroidForegroundServiceEnabled` | - | Only for: Android. A boolean to enable the [`FOREGROUND_SERVICE`](#permission-foreground_service) permission and [`FOREGROUND_SERVICE_LOCATION`](#permission-foreground_service_location) (required on Android 14 and later when running a location foreground service). Defaults to `true` if `isAndroidBackgroundLocationEnabled` is `true`, otherwise `false`. |
| `androidForegroundServiceIcon` | - | Only for: Android. Local path to an image to use as the icon for the foreground service started by `startLocationUpdatesAsync`. 96x96 all-white png with transparency. If not set, falls back to the `notification_icon` drawable (if configured via `expo-notifications` config plugin), then to the app launcher icon. The launcher icon is full-color and may render as a solid white square since Android requires notification icons to be monochrome. |

<details><summary>Are you using this library in an existing React Native app?</summary>

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation)) or you're using native **ios** project manually, then you need to add the `NSLocationAlwaysAndWhenInUseUsageDescription`, `NSLocationAlwaysUsageDescription` and `NSLocationWhenInUseUsageDescription` keys to your project's **ios/[app]/Info.plist**:

```xml
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to use your location</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to use your location</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to use your location</string>
```

</details>

### Background location

Background location allows your app to receive location updates while it is running in the background and includes both location updates and region monitoring through geofencing. This feature is subject to platform API limitations and system constraints:

- Background location will stop if the user terminates the app.
- Background location resumes if the user restarts the app.
- Android A terminated app will not automatically restart when a location
  or geofencing event occurs due to platform limitations.
- iOS The system will restart the terminated app when a new geofence
  event occurs.

:::note
On Android, the result of removing an app from the recent apps list varies by device vendor. For example, some implementations treat removing an app from the recent apps list as killing it. Read more about these differences here: [https://dontkillmyapp.com](https://dontkillmyapp.com).
:::

### Background location configuration iOS

To be able to run background location on iOS, you need to add the `location` value to the `UIBackgroundModes` array in your app's **Info.plist** file.

**If you're using [CNG](/workflow/continuous-native-generation)**, the required `UIBackgroundModes` configuration will be applied automatically by prebuild.

<details><summary>Configure UIBackgroundModes manually on iOS</summary>

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation)) or you're using a native iOS project, then you'll need to add the following to your **Expo.plist** file:

```xml
<key>UIBackgroundModes</key>
  <array>
    <string>location</string>
  </array>
```

</details>

### Background location methods

To use Background Location methods, the following requirements apply:

- Location permissions must be granted.
- Background location task must be defined in the top-level scope, using [`TaskManager.defineTask`](/versions/latest/sdk/task-manager#taskmanagerdefinetasktaskname-taskexecutor).
- iOS `"location"` background mode must be
  specified in **Info.plist** file. See [Background location
  configuration](#background-location-configuration).
- iOS You must use a [development
  build](/develop/development-builds/introduction) to use background location since it is not
  supported in the Expo Go app.

### Geofencing methods

To use Geofencing methods, the following requirements apply:

- Location permissions must be granted.
- The Geofencing task must be defined in the top-level scope, using [`TaskManager.defineTask`](/versions/latest/sdk/task-manager#taskmanagerdefinetasktaskname-taskexecutor).

When using Geofencing, the following platform differences apply:

- Android You are allowed [up to
  100](https://developer.android.com/develop/sensors-and-location/location/geofencing) active
  geofences per app.
- iOS Expo Location will report the initial state of the registered
  geofence(s) at app startup.
- iOS There is a [limit of
  20](https://developer.apple.com/documentation/corelocation/monitoring_the_user_s_proximity_to_geographic_regions)
  `regions` that can be simultaneously monitored.

### Background permissions

To use location tracking or Geofencing in the background, you must request the appropriate permissions:

- On Android, you must request both foreground and background permissions.
- On iOS, it must be granted with the `Always` option using [`requestBackgroundPermissionsAsync`](#locationrequestbackgroundpermissionsasync).

<details><summary>Expo and iOS permissions</summary>

iOS permissions are divided into the two categories `When In Use` and `Always` and map to Expo's foreground and background location permissions requested via:

- [`requestForegroundPermissionsAsync`](#locationrequestforegroundpermissionsasync) maps to `When In Use`
- [`requestBackgroundPermissionsAsync`](#locationrequestbackgroundpermissionsasync) maps to `Always`

> **Note:** When requesting `When In Use` authorization, the user can grant **temporary access** by selecting `Allow Once` in the system permission dialog. This authorization will be valid **only for the current app session** and is automatically revoked when the app is closed.

**Detecting "Allow Once" versus "Allow While Using the App"**

Unfortunately, **iOS does not provide a way to detect whether the user selected `Allow Once` or `Allow While Using the App`**. Both responses result in `When In Use` authorization.

If the user selected `Allow Once` and you subsequently call [`requestBackgroundPermissionsAsync`](#locationrequestbackgroundpermissionsasync) in the same session, the system **will not show another prompt**. Instead, the request will **silently fail**, and the returned background permission status will be **denied**.

**Handling "Allow Once" scenarios**

If you suspect the user selected `Allow Once` and needs to request background permissions, they must **manually enable background location** in the Settings app. You can use `Linking` to open the Settings app within your app:

```js
import { Linking } from 'react-native';

function openSettings() {
  Linking.openURL('app-settings:');
}
```

**Incremental permission requests**

It is possible to request foreground location access first and then ask for background location access later. This can improve the user experience by requesting permissions only when necessary.

**Requesting Background Permissions directly**

If you call [`requestBackgroundPermissionsAsync`](#locationrequestbackgroundpermissionsasync) without first requesting foreground permissions, iOS treats it as a request for both `When In Use` and `Always` authorization. The system will then prompt the user for `When In Use` access, and the `Always` authorization prompt will be displayed when the system determines that `Always` authorization is required.

Remember that the user has the option of granting your app `When In Use` authorization instead. You must always be prepared to run with `When In Use` permission.

</details>

## Deferred locations

When using background locations, you can configure the location manager to defer updates. This helps save battery by reducing update frequency. You can set updates to trigger only after the device has moved a certain distance or after a specified time interval.

Deferred updates are configured through [`LocationTaskOptions`](#locationtaskoptions) using the [`deferredUpdatesDistance`](#locationtaskoptions), [`deferredUpdatesInterval`](#locationtaskoptions) and [`deferredTimeout`](#locationtaskoptions) properties.

> Deferred locations apply only when the app is in the background.

## Usage

If you're using the Android Emulator or iOS Simulator, ensure that [Location is enabled](#enable-emulator-location).

```tsx
import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
/* @hide */
import * as Device from 'expo-device';
/* @end */
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      /* @hide */
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
        );
        return;
      }
      /* @end */
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

## Enable emulator location

### Android Emulator

Open Android Studio, and launch the Android Emulator. Inside it, go to **Settings** > **Location** and enable **Use location**.

![Location settings in Android Emulator for versions 12 and higher](/static/images/sdk/location/enable-android-emulator-location.png)

If you don't receive the locations in the emulator, you may have to turn off the **Improve Location Accuracy** setting. This will turn off Wi-Fi location and only use GPS. Then you can manipulate the location with GPS data through the emulator.

For Android 12 and higher, go to **Settings** > **Location** > **Location Services** > **Google Location Accuracy**, and turn off **Improve Location Accuracy**. For Android 11 and lower, go to **Settings** > **Location** > **Advanced** > **Google Location Accuracy**, and turn off **Google Location Accuracy**.

### iOS Simulator

With Device Hub open, go to **Device** > **Location** and choose any option besides **None**.

![Device menu in Device Hub with the Location submenu open.](/static/images/sdk/location/device-hub-location.webp)

## API

```js
import * as Location from 'expo-location';
```

## Permissions

### Android

:::warning
Foreground and background services are not available in Expo Go for Android. Instead, we recommend using a [development build](/develop/development-builds/introduction) to avoid limitations.
:::

When you install the `expo-location` module, it automatically adds the following permissions:

- `ACCESS_COARSE_LOCATION`: for approximate device location
- `ACCESS_FINE_LOCATION`: for precise device location

The following permissions are optional:

- `FOREGROUND_SERVICE` and `FOREGROUND_SERVICE_LOCATION`: to be able to access location while the app is open but backgrounded. `FOREGROUND_SERVICE_LOCATION` is only required as of Android 14. When you enable this in a new build, you will need to [submit your app for review and request access to use the foreground service permission](https://support.google.com/googleplay/android-developer/answer/13392821?hl=en).
- `ACCESS_BACKGROUND_LOCATION`: to be able to access location while the app is backgrounded or closed. When you enable this in a new build, you will need to [submit your app for review and request access to use the background location permission](https://support.google.com/googleplay/android-developer/answer/9799150?hl=en).

| Android permission | Description |
| --- | --- |
| `ACCESS_COARSE_LOCATION` | Allows an app to access approximate location. Alternatively, you might want `[ACCESS_FINE_LOCATION](https://developer.android.com/reference/android/Manifest.permission#ACCESS_FINE_LOCATION)`. |
| `ACCESS_FINE_LOCATION` | Allows an app to access precise location. Alternatively, you might want `[ACCESS_COARSE_LOCATION](https://developer.android.com/reference/android/Manifest.permission#ACCESS_COARSE_LOCATION)`. |
| `FOREGROUND_SERVICE` | Allows a regular application to use Service.startForeground. Allows a regular application to use `[Service.startForeground](https://developer.android.com/reference/android/app/Service#startForeground(int,%20android.app.Notification))`. |
| `FOREGROUND_SERVICE_LOCATION` | Allows a regular application to use Service.startForeground with the type "location". Allows a regular application to use `[Service.startForeground](https://developer.android.com/reference/android/app/Service#startForeground(int,%20android.app.Notification))` with the type "location". |
| `ACCESS_BACKGROUND_LOCATION` | Allows an app to access location in the background. If you're requesting this permission, you must also request either `[ACCESS_COARSE_LOCATION](https://developer.android.com/reference/android/Manifest.permission#ACCESS_COARSE_LOCATION)` or `[ACCESS_FINE_LOCATION](https://developer.android.com/reference/android/Manifest.permission#ACCESS_FINE_LOCATION)`. Requesting this permission by itself doesn't give you location access. |

#### Excluding a permission

:::note
Excluding a **required permission** from a module in your app can break the functionality corresponding to that permission. Always make sure to include all permissions a module is dependent on.
:::

When your Expo project doesn't benefit from having particular permission included, you can omit it. For example, if your application doesn't need access to the precise location, you can exclude the `ACCESS_FINE_LOCATION` permission.

Another example can be stated using [available location accuracies](#accuracy). Android defines the approximate location accuracy estimation within about 3 square kilometers, and the precise location accuracy estimation within about 50 meters. For example, if the location accuracy value is [Low](#low), you can exclude `ACCESS_FINE_LOCATION` permission. To learn more about levels of location accuracies, see [Android documentation](https://developer.android.com/training/location/permissions#accuracy).

To learn more on how to exclude permission, see [Excluding Android permissions](/guides/permissions#android).

### iOS

The following usage description keys are used by this library:

| Info.plist key | Description |
| --- | --- |
| `NSLocationAlwaysAndWhenInUseUsageDescription` | A message that tells the user why the app is requesting access to the user’s location information at all times. Warning: This key is required if your iOS app uses APIs that access the user’s location information at all times. |
| `NSLocationAlwaysUsageDescription` | A message that tells the user why the app is requesting access to the user's location at all times.DeprecatedFor apps deployed to targets in iOS 11 and later, use NSLocationAlwaysAndWhenInUseUsageDescription instead. Warning: This key is required if your iOS app uses APIs that access the user’s location at all times and deploys to targets earlier than iOS 11. |
| `NSLocationWhenInUseUsageDescription` | A message that tells the user why the app is requesting access to the user’s location information while the app is running in the foreground. Warning: This key is required if your iOS app uses APIs that access the user’s location information while the app is in use. |

`NSLocationAlwaysUsageDescription` is deprecated in favor of `NSLocationAlwaysAndWhenInUseUsageDescription` from iOS 11.

