---
title: Maps
description: A library that provides access to Google Maps on Android and Apple Maps on iOS.
packageName: expo-maps
---

# Maps

> 支持平台：iOS、Android。

:::note
On iOS, Expo Maps uses Apple Maps and requires **iOS 17 or later**. Some features require **iOS 18 or later**, including marker, annotation, and overlay tap callbacks (such as `onMarkerClick` and `onPolylineClick`) and programmatic selection (`selectMarker` and `selectAnnotation`).
:::

## Installation

:::tabs
:::tab npm
```sh
npx expo install expo-maps
```
:::
:::tab yarn
```sh
yarn expo install expo-maps
```
:::
:::tab pnpm
```sh
pnpm expo install expo-maps
```
:::
:::tab bun
```sh
bun expo install expo-maps
```
:::
:::

- [Watch: Expo Maps Deep Dive](https://www.youtube.com/watch?v=jDCuaIQ9vd0)：Add Google Maps and Apple Maps to your Expo app with the expo-maps library.

## Configuration

Expo Maps provides access to the platform native map APIs on Android and iOS.

- **Apple Maps (available on iOS only)**. No additional configuration is required to use it after installing this package.
- **Google Maps (available on Android only)**. While Google provides a Google Maps SDK for iOS, Expo Maps supports it exclusively on Android. If you want to use Google Maps on iOS, you can look into using an [alternative library](https://reactnative.directory/) or [writing your own](/modules/overview).

### Google Cloud API setup

**Before you can use Google Maps on Android**, you need to register a Google Cloud API project, enable the Maps SDK for Android, and add the associated configuration to your Expo project.

<details><summary>Set up Google Maps on Android</summary>

> If you have already registered a project for another Google service on Android, such as Google Sign In, you enable the **Maps SDK for Android** on your project and jump to step 4.

1. **Register a Google Cloud API project and enable the Maps SDK for Android**

   - Open your browser to the [Google API Manager](https://console.cloud.google.com/apis) and create a project.
   - Once it's created, go to the project and enable the **Maps SDK for Android**.

2. **Copy your app's SHA-1 certificate fingerprint**

   :::tabs
   :::tab For Google Play Store
   - **If you are deploying your app to the Google Play Store**, you'll need to [upload your app binary to Google Play console](/submit/android) at least once. This is required for Google to generate your app signing credentials.
   - Go to the **[Google Play Console](https://play.google.com/console) > (your app) > Release > Setup > App integrity > App Signing**.
   - Copy the value of **SHA-1 certificate fingerprint**.
   :::

   :::tab For development builds
   - If you have already created a [development build](/develop/development-builds/introduction), your project will be signed using a debug keystore.
   - After the build is complete, go to your [project's dashboard](https://expo.dev/accounts/[username]/projects/[project-name]), then, under **Project settings** > click **Credentials**.
   - Under **Application Identifiers**, click your project's package name and under **Android Keystore** copy the value of **SHA-1 Certificate Fingerprint**.
   :::
   :::

3. **Create an API key**

   - Go to [Google Cloud Credential manager](https://console.cloud.google.com/apis/credentials) and click **Create Credentials**, then **API Key**.
   - In the modal, click **Edit API key**.
   - Under **Key restrictions** > **Application restrictions**, choose **Android apps**.
   - Under **Restrict usage to your Android apps**, click **Add an item**.
   - Add your `android.package` from **app.json** (for example: `com.company.myapp`) to the package name field.
   - Then, add the **SHA-1 certificate fingerprint's** value from step 2.
   - Click **Done** and then click **Save**.

4. **Add the API key to your project**

   - Copy your **API Key** into your **app.json** under the `android.config.googleMaps.apiKey` field.
   - Create a new development build, and you can now use the Google Maps API on Android with `expo-maps`.

</details>

## Permissions

To display the user's location on the map, you need to declare and request location permission beforehand. You can configure this using its built-in [config plugin](/config-plugins/introduction) if you use config plugins in your project ([Continuous Native Generation (CNG)](/workflow/continuous-native-generation)). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does **not** use CNG, then you'll need to manually configure the library.

### Example app.json with config plugin

```json
{
  "expo": {
    "plugins": [
      [
        "expo-maps",
        {
          "requestLocationPermission": true,
          "locationPermission": "Allow $(PRODUCT_NAME) to use your location"
        }
      ]
    ]
  }
}
```

### Configurable properties

| Name | Default | Description |
| --- | --- | --- |
| `requestLocationPermission` | `false` | A boolean to add permissions to **AndroidManifest.xml** and **Info.plist**. |
| `locationPermission` | `"Allow $(PRODUCT_NAME) to use your location"` | Only for: iOS. A string to set the [`NSLocationWhenInUseUsageDescription`](#permission-nslocationwheninuseusagedescription) permission message. |

## Usage

```tsx
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform, Text } from 'react-native';

export default function App() {
  if (Platform.OS === 'ios') {
    return <AppleMaps.View style={{ flex: 1 }} />;
  } else if (Platform.OS === 'android') {
    return <GoogleMaps.View style={{ flex: 1 }} />;
  } else {
    return <Text>Maps are only available on Android and iOS</Text>;
  }
}
```

### Custom marker icons

You can use the [`useImage`](/versions/latest/sdk/image#useimagesource-options-dependencies) hook from `expo-image` to load custom marker and annotation icons.

:::tabs
:::tab Google Maps
The following example shows how to display a custom marker icon with Google Maps on Android.

```tsx
import { useImage } from 'expo-image';
import { GoogleMaps } from 'expo-maps';

export default function Map() {
  const icon = useImage('https://example.com/marker.svg', { maxWidth: 48, maxHeight: 48 });

  return (
    <GoogleMaps.View
      style={{ flex: 1 }}
      markers={[
        {
          coordinates: { latitude: 37.78825, longitude: -122.4324 },
          icon: icon ?? undefined,
          anchor: { x: 0.5, y: 0.5 },
        },
      ]}
    />
  );
}
```

`GoogleMaps.Marker.icon` expects an image reference, such as the value returned by the `useImage` hook from the `expo-image` package. It does not accept an image source directly.

The loaded image dimensions determine the marker size, not a marker style prop. For SVG icons, set `width`, `height`, and `viewBox` in the SVG, or pass `maxWidth` and `maxHeight` to the `useImage` hook. You can use `anchor` to align custom icons with their coordinates.
:::

:::tab Apple Maps
The following example shows how to display a custom annotation icon with Apple Maps on iOS.

```tsx
import { useImage } from 'expo-image';
import { AppleMaps } from 'expo-maps';

export default function Map() {
  const icon = useImage('https://example.com/marker.svg');

  return (
    <AppleMaps.View
      style={{ flex: 1 }}
      annotations={[
        {
          coordinates: { latitude: 37.78825, longitude: -122.4324 },
          icon: icon ?? undefined,
        },
      ]}
    />
  );
}
```

`AppleMaps.Annotation.icon` expects an image reference, such as the value returned by the `useImage` hook from the `expo-image` library. You can use `AppleMaps.Annotation` for custom image icons. `AppleMaps.Marker` supports marker-specific options such as `systemImage`, `monogram`, and `tintColor`.
:::
:::

## API

```js
import { AppleMaps, GoogleMaps } from 'expo-maps';

// AppleMaps.View and GoogleMaps.View are the React components
```

## Permissions

### Android

To show the user's location on the map, the `expo-maps` library requires the following permissions:

- `ACCESS_COARSE_LOCATION`: for approximate device location
- `ACCESS_FINE_LOCATION`: for precise device location

| Android permission | Description |
| --- | --- |
| `ACCESS_COARSE_LOCATION` | Allows an app to access approximate location. Alternatively, you might want `[ACCESS_FINE_LOCATION](https://developer.android.com/reference/android/Manifest.permission#ACCESS_FINE_LOCATION)`. |
| `ACCESS_FINE_LOCATION` | Allows an app to access precise location. Alternatively, you might want `[ACCESS_COARSE_LOCATION](https://developer.android.com/reference/android/Manifest.permission#ACCESS_COARSE_LOCATION)`. |
| `FOREGROUND_SERVICE` | Allows a regular application to use Service.startForeground. Allows a regular application to use `[Service.startForeground](https://developer.android.com/reference/android/app/Service#startForeground(int,%20android.app.Notification))`. |
| `FOREGROUND_SERVICE_LOCATION` | Allows a regular application to use Service.startForeground with the type "location". Allows a regular application to use `[Service.startForeground](https://developer.android.com/reference/android/app/Service#startForeground(int,%20android.app.Notification))` with the type "location". |
| `ACCESS_BACKGROUND_LOCATION` | Allows an app to access location in the background. If you're requesting this permission, you must also request either `[ACCESS_COARSE_LOCATION](https://developer.android.com/reference/android/Manifest.permission#ACCESS_COARSE_LOCATION)` or `[ACCESS_FINE_LOCATION](https://developer.android.com/reference/android/Manifest.permission#ACCESS_FINE_LOCATION)`. Requesting this permission by itself doesn't give you location access. |

### iOS

The following usage description keys are used by this library:

| Info.plist key | Description |
| --- | --- |
| `NSLocationWhenInUseUsageDescription` | A message that tells the user why the app is requesting access to the user’s location information while the app is running in the foreground. Warning: This key is required if your iOS app uses APIs that access the user’s location information while the app is in use. |

