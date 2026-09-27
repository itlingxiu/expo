---
title: ImagePicker 包参考
description: 用于访问系统界面，以便从手机图库选择图片和视频，或用相机拍照的库。
---

# ImagePicker 包参考

> 支持平台：Android、iOS、Web、Expo Go。

`expo-image-picker` 用于访问系统界面，以便从手机图库选择图片和视频，或用相机拍照。

<video src="/static/videos/sdk/imagepicker.mp4" controls></video>

## 已知问题（iOS）

在 iOS 上，从相机胶卷选取图片（通常是[较高分辨率](https://openradar.me/49866214)）时，裁剪结果在某些情况下会给出错误的裁剪矩形值。遗憾的是，这个问题出在底层的 `UIImagePickerController`，源于 iOS 内置闭源工具中的一个缺陷。

## 安装

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

## 在应用配置中配置

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-image-picker`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

默认情况下，`expo-image-picker` 会在 Android 上添加 `RECORD_AUDIO` 权限。可以在下面的配置中把 `microphonePermission` 设为 false 来移除它。

### 带配置插件的 app.json 示例

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

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `photosPermission` | `"Allow $(PRODUCT_NAME) to access your photos"` | 仅 iOS。用于设置 `NSPhotoLibraryUsageDescription` 权限提示文案的字符串。 |
| `cameraPermission` | `"Allow $(PRODUCT_NAME) to access your camera"` | 仅 Android、iOS。用于设置 `NSCameraUsageDescription` 权限提示文案的字符串。如果提供 `false`，则会在 Android 上阻止 `CAMERA` 权限。 |
| `microphonePermission` | `"Allow $(PRODUCT_NAME) to access your microphone"` | 仅 Android、iOS。用于设置 `NSMicrophoneUsageDescription` 权限提示文案的字符串。如果提供 `false`，则会在 Android 上阻止 `RECORD_AUDIO` 权限。 |
| `colors` | `undefined` | 仅 Android。包含颜色属性的对象，用于在浅色模式下自定义图片选择器的裁剪界面。 |
| `colors.cropToolbarColor` | `#00000000` | 仅 Android。裁剪工具栏背景色的十六进制颜色字符串。 |
| `colors.cropToolbarIconColor` | `#000000` | 仅 Android。裁剪工具栏图标颜色的十六进制颜色字符串。 |
| `colors.cropToolbarActionTextColor` | `#000000` | 仅 Android。裁剪工具栏操作文字颜色的十六进制颜色字符串。 |
| `colors.cropBackButtonIconColor` | `#000000` | 仅 Android。裁剪工具栏返回按钮图标颜色的十六进制颜色字符串。 |
| `colors.cropBackgroundColor` | `#ffffff` | 仅 Android。裁剪屏幕背景色的十六进制颜色字符串。 |
| `dark.colors` | `{ cropToolbarColor: "#00000000", cropToolbarIconColor: "#ffffff", cropToolbarActionTextColor: "#ffffff", cropBackButtonIconColor: "#ffffff", cropBackgroundColor: "#000000"  }` | 仅 Android。包含颜色属性的对象，用于在深色模式下自定义图片选择器的裁剪界面。 |

<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>

如果你没有使用连续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动维护原生 **ios** 项目，则需要在 **ios/[app]/Info.plist** 中添加 `NSPhotoLibraryUsageDescription`、`NSCameraUsageDescription` 和 `NSMicrophoneUsageDescription` 键：

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Give $(PRODUCT_NAME) permission to save photos</string>
<key>NSCameraUsageDescription</key>
<string>Give $(PRODUCT_NAME) permission to access your camera</string>
<key>NSMicrophoneUsageDescription</key>
<string>Give $(PRODUCT_NAME) permission to use your microphone</string>
```

</details>

## 用法

```tsx
import { useState } from 'react';
import { Alert, Button, Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // 启动图片库不需要请求权限。
    // 在 iOS 上，当 `allowsEditing` 为 `false` 且 `videoExportPreset` 为 `'Passthrough'`（默认值）时，
    // 需要为视频手动请求权限，最好在打开选择器之前请求，
    // 这样用户就不会在选完视频后突然看到系统对话框。
    // 更多细节见「为视频请求权限」小节。
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
    // 访问相机始终需要用户授权。
    // 拍照还需要带相机的设备。iOS 模拟器没有相机，
    // 因此请用真机测试这个按钮。
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

运行这个示例并选取一张图片后，你会在应用中看到所选图片，控制台也会出现类似的日志：

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
      "uri": "file:///data/user/0/host.exp.exponent/cache/cropped1814158652.jpg",
      "width": 3024
    }
  ],
  "canceled": false
}
```

### 为视频请求权限（iOS）

在 SDK 54 及更高版本中，默认配置保持 `allowsEditing` 为 `false`，并把 [`videoExportPreset`](#videoexportpreset) 设为 `'Passthrough'`。这些设置会立即返回原始资源（包括 HEIC 和 AVIF 文件），因为选择器会跳过压缩，但 iOS 需要媒体库权限才能访问原始文件，并会在用户选择视频后立刻显示权限对话框。

为了避免在选择之后才显示权限对话框，请在打开选择器之前，通过 [`requestMediaLibraryPermissionsAsync`](#imagepickerrequestmedialibrarypermissionsasyncwriteonly) 或 [`useMediaLibraryPermissions`](#usemedialibrarypermissionsoptions) **手动请求媒体库权限**。

### 配合 AWS S3

- [AWS 存储示例](https://github.com/expo/examples/tree/master/with-aws-storage-upload)：如何使用 AWS 存储的示例可以在 with-aws-storage-upload 中找到。

请参阅 [Amplify 文档](https://docs.amplify.aws/)指南来正确设置项目。

### 配合 Firebase

- [Firebase 存储示例](https://github.com/expo/examples/tree/master/with-firebase-storage-upload)：如何使用 Firebase 存储的示例可以在 with-firebase-storage-upload 中找到。

请参阅[使用 Firebase](/guides/using-firebase)指南来正确设置项目。

## API

```js
import * as ImagePicker from 'expo-image-picker';
```

## 权限

### Android

以下权限会通过这个库的 **AndroidManifest.xml** 自动添加。

| Android 权限 | 说明 |
| --- | --- |
| `CAMERA` | 访问相机设备所必需。 |
| `READ_EXTERNAL_STORAGE` | 允许应用从外部存储读取。 |
| `WRITE_EXTERNAL_STORAGE` | 允许应用写入外部存储。 |

### iOS

这个库中的 API 使用以下用途描述键。

| Info.plist 键 | 说明 |
| --- | --- |
| `NSMicrophoneUsageDescription` | 向用户说明应用为何请求访问设备麦克风的消息。警告：如果应用使用访问设备麦克风的 API，则必须提供此键。 |
| `NSPhotoLibraryUsageDescription` | 向用户说明应用为何请求访问用户照片图库的消息。警告：如果应用使用对用户照片图库有读或写访问的 API，则必须提供此键。 |
| `NSCameraUsageDescription` | 向用户说明应用为何请求访问设备相机的消息。警告：如果应用使用访问设备相机的 API，则必须提供此键。 |
