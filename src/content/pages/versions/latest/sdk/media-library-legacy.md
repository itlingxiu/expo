---
title: MediaLibrary (legacy) 包参考
description: 用于访问设备媒体库的库。
---

# MediaLibrary (legacy) 包参考

> 支持平台：Android、iOS、tvOS、Expo Go。

:::warning
MediaLibrary API 的旧版本包含在 `expo-media-library` 库中。它可以与从根导入暴露的、基于类的 `expo-media-library` API 一起使用。要使用旧版 API，请从 `expo-media-library/legacy` 导入。
:::

`expo-media-library` 提供对用户媒体库的访问，让用户可以从你的应用访问已有的图片和视频，也可以保存新的媒体。你还可以订阅用户媒体库的任何更新。

:::warning
Android 只允许需要广泛访问照片的应用完整访问媒体库（这正是本包的用途）。见 [Google Play 照片和视频权限政策详情](https://support.google.com/googleplay/android-developer/answer/14115180)。
:::

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-media-library
```
:::
:::tab yarn
```sh
yarn expo install expo-media-library
```
:::
:::tab pnpm
```sh
pnpm expo install expo-media-library
```
:::
:::tab bun
```sh
bun expo install expo-media-library
```
:::
:::

## 在应用配置中配置

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-media-library`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

```json
{
  "expo": {
    "plugins": [
      [
        "expo-media-library",
        {
          "photosPermission": "Allow $(PRODUCT_NAME) to access your photos.",
          "savePhotosPermission": "Allow $(PRODUCT_NAME) to save photos.",
          "isAccessMediaLocationEnabled": true,
          "granularPermissions": ["audio", "photo"]
        }
      ]
    ]
  }
}
```

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `photosPermission` | `"Allow $(PRODUCT_NAME) to access your photos."` | 仅 iOS。在 **Info.plist** 中设置 iOS `NSPhotoLibraryUsageDescription` 权限提示文案。 |
| `savePhotosPermission` | `"Allow $(PRODUCT_NAME) to save photos."` | 仅 iOS。在 **Info.plist** 中设置 iOS `NSPhotoLibraryAddUsageDescription` 权限提示文案。 |
| `preventAutomaticLimitedAccessAlert` | `false` | 仅 iOS。当用户对照片库只有有限访问权限时，阻止自动显示有限访问提示。适合只想访问有限照片库、又不希望 iOS 强制显示该提示的应用。 |
| `isAccessMediaLocationEnabled` | `false` | 仅 Android。设置是否在 Android 上请求 `ACCESS_MEDIA_LOCATION` 权限。 |
| `granularPermissions` | `["photo", "video", "audio"]` | 仅 Android。设置要包含哪些 [`GranularPermission`](#granularpermission) 值，从而决定会向 Android 清单添加哪些媒体权限（`READ_MEDIA_IMAGES`、`READ_MEDIA_VIDEO`、`READ_MEDIA_AUDIO`）。行为与运行时 API 一致。 |

<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>

如果你不使用连续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动使用原生 **android** 和 **ios** 项目，则需要向原生项目添加以下权限和配置：

**Android**

- 要访问资源位置（纬度和经度 EXIF 标签），请在项目的 **android/app/src/main/AndroidManifest.xml** 中添加 `ACCESS_MEDIA_LOCATION` 权限：

```xml
<uses-permission android:name="android.permission.ACCESS_MEDIA_LOCATION" />
```

- [分区存储](https://developer.android.com/training/data-storage#scoped-storage)从 Android 10 起可用。要让 `expo-media-library` 与分区存储一起工作，需要在 **android/app/src/main/AndroidManifest.xml** 中添加以下配置：

```xml
<manifest ... >
  <application android:requestLegacyExternalStorage="true" ...>
</manifest>
```

**iOS**

- 在项目的 **ios/[app]/Info.plist** 中添加 `NSPhotoLibraryUsageDescription` 和 `NSPhotoLibraryAddUsageDescription` 键：

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Give $(PRODUCT_NAME) permission to access your photos</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Give $(PRODUCT_NAME) permission to save photos</string>
```

</details>

## 用法

```jsx
import { useState, useEffect } from 'react';
import { Button, Text, ScrollView, StyleSheet, Image, View, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library/legacy';

export default function App() {
  const [albums, setAlbums] = useState(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    if (permissionResponse.status !== 'granted') {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }

  return (
    <View style={styles.container}>
      <Button onPress={getAlbums} title="Get albums" />
      <ScrollView>
        {albums && albums.map((album) => <AlbumEntry album={album} />)}
      </ScrollView>
    </View>
  );
}

function AlbumEntry({ album }) {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function getAlbumAssets() {
      const albumAssets = await MediaLibrary.getAssetsAsync({ album });
      setAssets(albumAssets.assets);
    }
    getAlbumAssets();
  }, [album]);

  return (
    <View key={album.id} style={styles.albumContainer}>
      <Text>
        {album.title} - {album.assetCount ?? 'no'} assets
      </Text>
      <View style={styles.albumAssetsContainer}>
        {assets && assets.map((asset) => (
          <Image source={{ uri: asset.uri }} width={50} height={50} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  albumContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 4,
  },
  albumAssetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
```

## 已知限制

### 空相册

由于 Android 的系统限制，无法创建空相册。必须传入要添加到相册的已有资源，或者传入本地资源的 URI，用来在相册内创建新资源。

### 在相册之间移动资源

Android 11 引入的权限变更使在相册之间移动资源的操作每次都需要用户确认。因此，创建新资源时，建议把 `album` 参数传给 [`createAssetAsync`](#medialibrarycreateassetasynclocaluri-album) 方法，而不是先创建资源再移动到相册。这样会自动把资源加入相册，无需用户确认。

### 图片方向错误

在 Android 上，使用 `getAssetsAsync` 且未设置 `resolveWithFullInfo: true` 时，图片方向可能不正确，因为只有启用该选项时才会读取包含方向信息的 EXIF 数据。

### `resolveWithFullInfo` 对性能的影响

在 Android 上，在 `getAssetsAsync` 中启用 `resolveWithFullInfo: true` 会显著增加请求时间（约 5 倍），因为库会为每张图片获取 EXIF 和位置数据。该库只为图片资源解析位置和 EXIF 数据。iOS 会在批量结果中为所有资源类型包含 GPS 位置，此选项不起作用。

## API

```js
import * as MediaLibrary from 'expo-media-library/legacy';
```

## 权限

### Android

此库的 **AndroidManifest.xml** 会自动添加以下权限：

| Android 权限 | 说明 |
| --- | --- |
| `READ_EXTERNAL_STORAGE` | 允许应用从外部存储读取。 |
| `WRITE_EXTERNAL_STORAGE` | 允许应用写入外部存储。 |
| `READ_MEDIA_IMAGES` | 允许应用从外部存储读取图片文件。 |
| `READ_MEDIA_VIDEO` | 允许应用从外部存储读取视频文件。 |
| `READ_MEDIA_AUDIO` | 允许应用从外部存储读取音频文件。 |
| `READ_MEDIA_VISUAL_USER_SELECTED` | 允许应用读取用户通过权限提示中的照片选择器从外部存储选出的图片或视频文件。应用可以检查此权限，以确认用户选择使用照片选择器，而不是授予 `[READ_MEDIA_IMAGES](https://developer.android.com/reference/android/Manifest.permission#READ_MEDIA_IMAGES)` 或 `[READ_MEDIA_VIDEO](https://developer.android.com/reference/android/Manifest.permission#READ_MEDIA_VIDEO)`。它不会阻止应用手动访问标准照片选择器。应根据所需媒体类型，与 `[READ_MEDIA_IMAGES](https://developer.android.com/reference/android/Manifest.permission#READ_MEDIA_IMAGES)` 和/或 `[READ_MEDIA_VIDEO](https://developer.android.com/reference/android/Manifest.permission#READ_MEDIA_VIDEO)` 一起请求此权限。 |

### iOS

此库使用以下用途说明键：

| Info.plist 键 | 说明 |
| --- | --- |
| `NSPhotoLibraryUsageDescription` | 向用户说明应用为何请求访问用户照片库的消息。警告：如果应用使用对照片库有读取或写入权限的 API，则必须提供此键。 |
| `NSPhotoLibraryAddUsageDescription` | 向用户说明应用为何请求仅添加权限以访问用户照片库的消息。警告：如果应用使用对照片库有写入权限的 API，则必须提供此键。 |
