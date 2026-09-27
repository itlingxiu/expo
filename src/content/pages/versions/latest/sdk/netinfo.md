---
title: '@react-native-community/netinfo 包参考'
description: 提供网络信息访问的跨平台 API。
---

# @react-native-community/netinfo 包参考

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`@react-native-community/netinfo` 让你可以获取连接类型和连接质量的信息。

## 安装

:::tabs
:::tab npm
```sh
npx expo install @react-native-community/netinfo
```
:::
:::tab yarn
```sh
yarn expo install @react-native-community/netinfo
```
:::
:::tab pnpm
```sh
pnpm expo install @react-native-community/netinfo
```
:::
:::tab bun
```sh
bun expo install @react-native-community/netinfo
```
:::
:::

## API

导入这个库：

```js
import NetInfo from '@react-native-community/netinfo';
```

如果只想获取一次网络连接信息，可以这样：

```js
NetInfo.fetch().then(state => {
  console.log('Connection type', state.type);
  console.log('Is connected?', state.isConnected);
});
```

如果希望订阅网络状态更新（从而在网络状态每次变化时运行代码或执行操作），可以这样：

```js
const unsubscribe = NetInfo.addEventListener(state => {
  console.log('Connection type', state.type);
  console.log('Is connected?', state.isConnected);
});

// 要取消订阅这些更新，只需：
unsubscribe();
```

## 访问 SSID

要访问 `ssid` 属性（位于 `state.details.ssid`），还需要一些额外配置步骤：

- 使用 [`Location.requestForegroundPermissionsAsync()`](/versions/latest/sdk/location#locationrequestforegroundpermissionsasync) 或 [`Location.requestBackgroundPermissionsAsync()`](/versions/latest/sdk/location#locationrequestbackgroundpermissionsasync) 请求位置权限。

### 仅 iOS

- 在 **app.json** 的 `ios.entitlements` 下添加 `com.apple.developer.networking.wifi-info` 授权：

```json
{
  "ios": {
    "entitlements": {
      "com.apple.developer.networking.wifi-info": true
    }
  }
}
```

- 在应用的 App Identifier 中勾选 **Access Wi-Fi Information**，[可以在这里找到](https://developer.apple.com/account/resources/identifiers/list)。
- 使用 [`eas build --platform ios`](/build/setup#run-a-build) 或 [`npx expo run:ios`](/more/expo-cli#compiling) 重新构建应用。

## 了解更多

- [查看官方文档](https://github.com/react-native-netinfo/react-native-netinfo)：获取 API 及其用法的完整信息。
