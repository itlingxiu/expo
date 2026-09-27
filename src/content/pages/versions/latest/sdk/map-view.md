---
title: react-native-maps 包参考
description: 提供地图组件的库，在 Android 上使用 Google 地图，在 iOS 上使用 Apple 地图或 Google 地图。
---

# react-native-maps 包参考

> 支持平台：Android、iOS、Expo Go。

:::warning
[`expo-maps`](/versions/latest/sdk/maps) 是 Expo 构建的 `react-native-maps` 替代方案，在 Android 上由 Google 地图驱动，在 iOS 上由 Apple 地图驱动。
:::

`react-native-maps` 提供地图组件，在 Android 上使用 Google 地图，在 iOS 上使用 Apple 地图或 Google 地图。

使用 Expo Go 测试项目时不需要额外设置。不过，**要把应用二进制部署到应用商店**，Google 地图还需要额外步骤。更多信息见[下面的说明](#使用-google-地图部署应用)。

## 安装

:::tabs
:::tab npm
```sh
npx expo install react-native-maps
```
:::
:::tab yarn
```sh
yarn expo install react-native-maps
```
:::
:::tab pnpm
```sh
pnpm expo install react-native-maps
```
:::
:::tab bun
```sh
bun expo install react-native-maps
```
:::
:::

## 用法

完整文档见 [`react-native-maps/react-native-maps`](https://github.com/react-native-maps/react-native-maps)。

```jsx
import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
```

## 使用 Google 地图部署应用

### Android

> 如果已经为 Android 上的其他 Google 服务（例如 Google 登录）注册过项目，只需在项目中启用 **Maps SDK for Android**，然后跳到第 4 步。

1. #### 注册 Google Cloud API 项目并启用 Maps SDK for Android

   - 在浏览器中打开 [Google API 管理器](https://console.cloud.google.com/apis)并创建一个项目。
   - 创建完成后，进入该项目并启用 **Maps SDK for Android**。

2. #### 复制应用的 SHA-1 证书指纹

   :::tabs
   :::tab Google Play 商店
   - **如果要把应用部署到 Google Play 商店**，至少需要[把应用二进制上传到 Google Play 管理中心](/submit/android)一次。Google 需要这一步来生成应用签名凭据。
   - 前往 **[Google Play 管理中心](https://play.google.com/console) >（你的应用）> 测试和发布 > 应用完整性 > Play 应用签名 > 设置 > 应用签名密钥证书**。
   - 复制 **SHA-1 证书指纹**的值。
   :::

   :::tab 开发构建
   - 如果已经创建了[开发构建](/develop/development-builds/introduction)，项目会使用调试密钥库签名。
   - 构建完成后，前往[项目仪表板](https://expo.dev/accounts/[username]/projects/[project-name])，然后在 **Configure** 下点击 **Credentials**。
   - 在 **Application Identifiers** 下，点击项目的包名，并在 **Android Keystore** 下复制 **SHA-1 Certificate Fingerprint** 的值。
   :::
   :::

3. #### 创建 API 密钥

   - 前往 [Google Cloud 凭据管理器](https://console.cloud.google.com/apis/credentials)，点击 **Create Credentials**，然后点击 **API Key**。
   - 在对话框中点击 **Edit API key**。
   - 在 **Key restrictions** > **Application restrictions** 下选择 **Android apps**。
   - 在 **Restrict usage to your Android apps** 下点击 **Add an item**。
   - 把 **app.json** 中的 `android.package`（例如 `com.company.myapp`）填到包名字段。
   - 然后填入第 2 步中的 **SHA-1 证书指纹**。
   - 点击 **Done**，然后点击 **Save**。

4. #### 把 API 密钥添加到项目

   由于使用 Google 作为地图提供商，需要把 API 密钥添加到 `react-native-maps` [配置插件](/config-plugins/introduction)。把 **API Key** 复制到项目的 **.env** 文件，或直接复制，然后添加到应用配置的 `plugins.react-native-maps.androidGoogleMapsApiKey` 字段，例如：

   ```json
   {
     "expo": {
       "plugins": [
         [
           "react-native-maps",
           {
             "androidGoogleMapsApiKey": "process.env.YOUR_GOOGLE_MAPS_API_KEY"
           }
         ]
       ]
     }
   }
   ```

   :::note
   如果 EAS Build 没有读到 API 密钥，请确认项目包含 [.easignore](/build-reference/easignore) 文件。该文件应与 **.gitignore** 保持一致，但不得排除 **.env**，以便 EAS Build 能够访问环境变量。
   :::

   - 在代码中从 `react-native-maps` 导入 `{ PROVIDER_GOOGLE }`，并把属性 `provider={PROVIDER_GOOGLE}` 加到 `<MapView>` 上。这个属性在 Android 和 iOS 上都有效。
   - 重新构建应用二进制（如果应用已经上传，则重新提交到 Google Play 商店）。验证配置是否成功的简单方法是做一次[模拟器构建](/develop/development-builds/introduction#how-would-you-like-to-build-your-development-build)。

### iOS

> 如果已经为 iOS 上的其他 Google 服务（例如 Google 登录）注册过项目，只需在项目中启用 **Maps SDK for iOS**，然后跳到第 3 步。

1. #### 注册 Google Cloud API 项目并启用 Maps SDK for iOS

   - 在浏览器中打开 [Google API 管理器](https://console.cloud.google.com/apis)并创建一个项目。
   - 然后进入该项目，点击 **Enable APIs and Services**，并启用 **Maps SDK for iOS**。

2. #### 创建 API 密钥

   - 前往 [Google Cloud 凭据管理器](https://console.cloud.google.com/apis/credentials)，点击 **Create Credentials**，然后点击 **API Key**。
   - 在对话框中点击 **Edit API key**。
   - 在 **Key restrictions** > **Application restrictions** 下选择 **iOS apps**。
   - 在 **Accept requests from an iOS application with one of these bundle identifiers** 下点击 **Add an item** 按钮。
   - 把 **app.json** 中的 `ios.bundleIdentifier`（例如 `com.company.myapp`）填到 Bundle ID 字段。
   - 点击 **Done**，然后点击 **Save**。

3. #### 把 API 密钥添加到项目

   由于使用 Google 作为地图提供商，需要把 API 密钥添加到 `react-native-maps` [配置插件](/config-plugins/introduction)。把 **API Key** 复制到项目的 **.env** 文件，或直接复制，然后添加到应用配置的 `plugins.react-native-maps.iosGoogleMapsApiKey` 字段，例如：

   ```json
   {
     "expo": {
       "plugins": [
         [
           "react-native-maps",
           {
             "iosGoogleMapsApiKey": "process.env.YOUR_GOOGLE_MAPS_API_KEY"
           }
         ]
       ]
     }
   }
   ```

   - 在代码中从 `react-native-maps` 导入 `{ PROVIDER_GOOGLE }`，并把属性 `provider={PROVIDER_GOOGLE}` 加到 `<MapView>` 上。这个属性在 Android 和 iOS 上都有效。
   - 重新构建应用二进制。验证配置是否成功的简单方法是做一次[模拟器构建](/develop/development-builds/introduction#how-would-you-like-to-build-your-development-build)。
