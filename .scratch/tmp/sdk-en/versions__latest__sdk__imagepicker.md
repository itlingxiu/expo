---
title: ImagePicker
description: A library that provides access to the system's UI for selecting images and videos from the phone's library or taking a photo with the camera.
packageName: expo-image-picker
---

# ImagePicker

> 支持平台：Android、iOS、Web、Expo Go。

`expo-image-picker` provides access to the system's UI for selecting images and videos from the phone's library or taking a photo with the camera.

<video src="/static/videos/sdk/imagepicker.mp4" controls></video>

## Known issues （iOS）

On iOS, when an image (usually of a [higher resolution](https://openradar.me/49866214)) is picked from the camera roll, the result of the cropped image gives the wrong value for the cropped rectangle in some cases. Unfortunately, this issue is with the underlying `UIImagePickerController` due to a bug in the closed-source tools built into iOS.

## Installation

:::tabs
:::tab npm
```sh
npx expo install expo-image-picker
```
:::
:::tab yarn
```sh
yarn expo install expo-image-picker
```
:::
:::tab pnpm
```sh
pnpm expo install expo-image-picker
```
:::
:::tab bun
```sh
bun expo install expo-image-picker
```
:::
:::

## Configuration in app config

You can configure `expo-image-picker` using its built-in [config plugin](/config-plugins/introduction) if you use config plugins in your project ([Continuous Native Generation (CNG)](/workflow/continuous-native-generation)). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does **not** use CNG, then you'll need to manually configure the library.

By default `expo-image-picker` will add `RECORD_AUDIO` permission on Android. You can remove it by setting the `microphonePermission` to false in the config below.

### Example app.json with config plugin

```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends.",
          "colors": {
            "cropToolbarColor": "#000000"
          },
          "dark": {
            "colors": {
              "cropToolbarColor": "#000000"
            }
          }
        }
      ]
    ]
  }
}
```

### Configurable properties

| Name | Default | Description |
| --- | --- | --- |
| `photosPermission` | `"Allow $(PRODUCT_NAME) to access your photos"` | Only for: iOS. A string to set the `NSPhotoLibraryUsageDescription` permission message. |
| `cameraPermission` | `"Allow $(PRODUCT_NAME) to access your camera"` | Only for: Android, iOS. A string to set the `NSCameraUsageDescription` permission message. If value `false` is provided then `CAMERA` permission will be blocked on Android. |
| `microphonePermission` | `"Allow $(PRODUCT_NAME) to access your microphone"` | Only for: Android, iOS. A string to set the `NSMicrophoneUsageDescription` permission message. If value `false` is provided then `RECORD_AUDIO` permission will be blocked on Android. |
| `colors` | `undefined` | Only for: Android. An object containing color properties for customizing the image picker crop UI in light mode. |
| `colors.cropToolbarColor` | `#00000000` | Only for: Android. A hex color string for the crop toolbar background color. |
| `colors.cropToolbarIconColor` | `#000000` | Only for: Android. A hex color string for the crop toolbar icon color. |
| `colors.cropToolbarActionTextColor` | `#000000` | Only for: Android. A hex color string for the crop toolbar action text color. |
| `colors.cropBackButtonIconColor` | `#000000` | Only for: Android. A hex color string for the crop toolbar back button icon color. |
| `colors.cropBackgroundColor` | `#ffffff` | Only for: Android. A hex color string for the crop screen background color. |
| `dark.colors` | `{ cropToolbarColor: "#00000000", cropToolbarIconColor: "#ffffff", cropToolbarActionTextColor: "#ffffff", cropBackButtonIconColor: "#ffffff", cropBackgroundColor: "#000000"  }` | Only for: Android. An object containing color properties for customizing the image picker crop UI in dark mode. |

<details><summary>Are you using this library in an existing React Native app?</summary>

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation)) or you're using a native **ios** project manually, then you need to add `NSPhotoLibraryUsageDescription`, `NSCameraUsageDescription`, and `NSMicrophoneUsageDescription` keys to your **ios/[app]/Info.plist**:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Give $(PRODUCT_NAME) permission to save photos</string>
<key>NSCameraUsageDescription</key>
<string>Give $(PRODUCT_NAME) permission to access your camera</string>
<key>NSMicrophoneUsageDescription</key>
<string>Give $(PRODUCT_NAME) permission to use your microphone</string>
```

</details>

## Usage

```tsx
import { useState } from 'react';
import { Alert, Button, Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Camera access always requires the user's permission.
    // Taking a photo also requires a device with a camera. The iOS Simulator
    // does not have one, so use a physical device to test this button.
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the camera is required.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="Take a photo" onPress={takePhoto} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
```

When you run this example and pick an image, you will see the image that you picked show up in your app, and a similar log will be shown in the console:

```json
{
  "assets": [
    {
      "assetId": "C166F9F5-B5FE-4501-9531",
      "base64": null,
      "duration": null,
      "exif": null,
      "fileName": "IMG.HEIC",
      "fileSize": 6018901,
      "height": 3025,
      "type": "image",
      "uri": "file:///data/user/0/host.exp.exponent/cache/cropped1814158652.jpg"
      "width": 3024
    }
  ],
  "canceled": false
}
```

### Invoke permissions for videos （iOS）

In SDK 54 and later, the default configuration keeps `allowsEditing` set to `false` and [`videoExportPreset`](#videoexportpreset) set to `'Passthrough'`. These settings return the original asset (including HEIC and AVIF files) instantly because the picker skips compression, but iOS requires media library permission to access the original file and displays a permission dialog immediately after the user selects a video.

To avoid showing permissions dialog after selection, **manually request media library permissions before opening the picker** via [`requestMediaLibraryPermissionsAsync`](#imagepickerrequestmedialibrarypermissionsasyncwriteonly) or [`useMediaLibraryPermissions`](#usemedialibrarypermissionsoptions).

### With AWS S3

- [AWS storage example](https://github.com/expo/examples/tree/master/with-aws-storage-upload)：An example of how to use AWS storage can be found in with-aws-storage-upload.

See [Amplify documentation](https://docs.amplify.aws/) guide to set up your project correctly.

### With Firebase

- [Firebase storage example](https://github.com/expo/examples/tree/master/with-firebase-storage-upload)：An example of how to use Firebase storage can be found in with-firebase-storage-upload.

See [Using Firebase](/guides/using-firebase) guide to set up your project correctly.

## API

```js
import * as ImagePicker from 'expo-image-picker';
```

## Permissions

### Android

The following permissions are added automatically through the library's **AndroidManifest.xml**.

| Android permission | Description |
| --- | --- |
| `CAMERA` | Required to be able to access the camera device. |
| `READ_EXTERNAL_STORAGE` | Allows an application to read from external storage. |
| `WRITE_EXTERNAL_STORAGE` | Allows an application to write to external storage. |

### iOS

The following usage description keys are used by the APIs in this library.

| Info.plist key | Description |
| --- | --- |
| `NSMicrophoneUsageDescription` | A message that tells the user why the app is requesting access to the device’s microphone. Warning: This key is required if your app uses APIs that access the device’s microphone. |
| `NSPhotoLibraryUsageDescription` | A message that tells the user why the app is requesting access to the user’s photo library. Warning: This key is required if your app uses APIs that have read or write access to the user’s photo library. |
| `NSCameraUsageDescription` | A message that tells the user why the app is requesting access to the device’s camera. Warning: This key is required if your app uses APIs that access the device’s camera. |

