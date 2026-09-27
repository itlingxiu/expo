---
title: Maps 包参考
description: 用于在 Android 上访问 Google 地图、在 iOS 上访问 Apple 地图的库。
---

# Maps 包参考

> 支持平台：iOS、Android。

:::note
在 iOS 上，Expo Maps 使用 Apple 地图，并且需要 **iOS 17 或更高版本**。部分功能需要 **iOS 18 或更高版本**，包括标记、标注和覆盖物的点击回调（例如 `onMarkerClick` 和 `onPolylineClick`）以及编程方式的选择（`selectMarker` 和 `selectAnnotation`）。
:::

## 安装

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

- [观看：Expo Maps 深入讲解](https://www.youtube.com/watch?v=jDCuaIQ9vd0)：用 expo-maps 库把 Google 地图和 Apple 地图添加到 Expo 应用。

## 配置

Expo Maps 提供对 Android 和 iOS 平台原生地图 API 的访问。

- **Apple 地图（仅 iOS）**。安装这个包之后，使用它不需要额外配置。
- **Google 地图（仅 Android）**。虽然 Google 提供了 iOS 版 Google Maps SDK，但 Expo Maps 只在 Android 上支持它。如果想在 iOS 上使用 Google 地图，可以考虑使用[替代库](https://reactnative.directory/)或[自己编写](/modules/overview)。

### Google Cloud API 设置

**在 Android 上使用 Google 地图之前**，需要注册 Google Cloud API 项目，启用 Maps SDK for Android，并把相关配置添加到 Expo 项目中。

<details><summary>在 Android 上设置 Google 地图</summary>

> 如果已经为 Android 上的其他 Google 服务（例如 Google 登录）注册过项目，只需在项目中启用 **Maps SDK for Android**，然后跳到第 4 步。

1. **注册 Google Cloud API 项目并启用 Maps SDK for Android**

   - 在浏览器中打开 [Google API 管理器](https://console.cloud.google.com/apis)并创建一个项目。
   - 创建完成后，进入该项目并启用 **Maps SDK for Android**。

2. **复制应用的 SHA-1 证书指纹**

   :::tabs
   :::tab Google Play 商店
   - **如果要把应用部署到 Google Play 商店**，至少需要[把应用二进制上传到 Google Play 管理中心](/submit/android)一次。Google 需要这一步来生成应用签名凭据。
   - 前往 **[Google Play 管理中心](https://play.google.com/console) >（你的应用）> 发布 > 设置 > 应用完整性 > 应用签名**。
   - 复制 **SHA-1 证书指纹**的值。
   :::

   :::tab 开发构建
   - 如果已经创建了[开发构建](/develop/development-builds/introduction)，项目会使用调试密钥库签名。
   - 构建完成后，前往[项目仪表板](https://expo.dev/accounts/[username]/projects/[project-name])，然后在 **Project settings** 下点击 **Credentials**。
   - 在 **Application Identifiers** 下，点击项目的包名，并在 **Android Keystore** 下复制 **SHA-1 Certificate Fingerprint** 的值。
   :::
   :::

3. **创建 API 密钥**

   - 前往 [Google Cloud 凭据管理器](https://console.cloud.google.com/apis/credentials)，点击 **Create Credentials**，然后点击 **API Key**。
   - 在对话框中点击 **Edit API key**。
   - 在 **Key restrictions** > **Application restrictions** 下选择 **Android apps**。
   - 在 **Restrict usage to your Android apps** 下点击 **Add an item**。
   - 把 **app.json** 中的 `android.package`（例如 `com.company.myapp`）填到包名字段。
   - 然后填入第 2 步中的 **SHA-1 证书指纹**。
   - 点击 **Done**，然后点击 **Save**。

4. **把 API 密钥添加到项目**

   - 把 **API Key** 复制到 **app.json** 的 `android.config.googleMaps.apiKey` 字段。
   - 创建新的开发构建后，就可以在 Android 上通过 `expo-maps` 使用 Google Maps API。

</details>

## 权限

要在地图上显示用户位置，需要事先声明并请求位置权限。如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)进行配置。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

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

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `requestLocationPermission` | `false` | 是否把权限添加到 **AndroidManifest.xml** 和 **Info.plist** 的布尔值。 |
| `locationPermission` | `"Allow $(PRODUCT_NAME) to use your location"` | 仅 iOS。用于设置 [`NSLocationWhenInUseUsageDescription`](#permission-nslocationwheninuseusagedescription) 权限提示文案的字符串。 |

## 用法

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

### 自定义标记图标

可以用 `expo-image` 的 [`useImage`](/versions/latest/sdk/image#useimagesource-options-dependencies) hook 加载自定义标记和标注图标。

:::tabs
:::tab Google 地图
下面的示例展示如何在 Android 上用 Google 地图显示自定义标记图标。

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

`GoogleMaps.Marker.icon` 期望的是图片引用，例如 `expo-image` 包中 `useImage` hook 返回的值。它不直接接受图片源。

已加载图片的尺寸决定标记大小，而不是标记的样式属性。对于 SVG 图标，请在 SVG 中设置 `width`、`height` 和 `viewBox`，或者向 `useImage` hook 传入 `maxWidth` 和 `maxHeight`。可以用 `anchor` 把自定义图标与其坐标对齐。
:::

:::tab Apple 地图
下面的示例展示如何在 iOS 上用 Apple 地图显示自定义标注图标。

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

`AppleMaps.Annotation.icon` 期望的是图片引用，例如 `expo-image` 库中 `useImage` hook 返回的值。可以用 `AppleMaps.Annotation` 显示自定义图片图标。`AppleMaps.Marker` 支持标记专用选项，例如 `systemImage`、`monogram` 和 `tintColor`。
:::
:::

## API

```js
import { AppleMaps, GoogleMaps } from 'expo-maps';

// AppleMaps.View 和 GoogleMaps.View 是 React 组件
```

## 权限

### Android

要在地图上显示用户位置，`expo-maps` 库需要以下权限：

- `ACCESS_COARSE_LOCATION`：用于大致的设备位置
- `ACCESS_FINE_LOCATION`：用于精确的设备位置

| Android 权限 | 说明 |
| --- | --- |
| `ACCESS_COARSE_LOCATION` | 允许应用访问大致位置。你也可以改用 [`ACCESS_FINE_LOCATION`](https://developer.android.com/reference/android/Manifest.permission#ACCESS_FINE_LOCATION)。 |
| `ACCESS_FINE_LOCATION` | 允许应用访问精确位置。你也可以改用 [`ACCESS_COARSE_LOCATION`](https://developer.android.com/reference/android/Manifest.permission#ACCESS_COARSE_LOCATION)。 |
| `FOREGROUND_SERVICE` | 允许普通应用使用 `Service.startForeground`。允许普通应用使用 [`Service.startForeground`](https://developer.android.com/reference/android/app/Service#startForeground(int,%20android.app.Notification))。 |
| `FOREGROUND_SERVICE_LOCATION` | 允许普通应用以 "location" 类型使用 `Service.startForeground`。允许普通应用以 "location" 类型使用 [`Service.startForeground`](https://developer.android.com/reference/android/app/Service#startForeground(int,%20android.app.Notification))。 |
| `ACCESS_BACKGROUND_LOCATION` | 允许应用在后台访问位置。如果请求此权限，还必须请求 [`ACCESS_COARSE_LOCATION`](https://developer.android.com/reference/android/Manifest.permission#ACCESS_COARSE_LOCATION) 或 [`ACCESS_FINE_LOCATION`](https://developer.android.com/reference/android/Manifest.permission#ACCESS_FINE_LOCATION) 之一。单独请求此权限不会授予位置访问权。 |

### iOS

这个库使用以下用途描述键：

| Info.plist 键 | 说明 |
| --- | --- |
| `NSLocationWhenInUseUsageDescription` | 向用户说明应用为何在前台运行时请求访问用户位置信息的消息。警告：如果 iOS 应用在使用期间通过 API 访问用户位置信息，则必须提供此键。 |
