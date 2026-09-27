---
title: Network 包参考
description: 用于访问设备网络信息（如 IP 地址、MAC 地址和飞行模式状态）的库。
---

# Network 包参考

> 支持平台：Android、iOS、Web、tvOS、Expo Go。

`expo-network` 提供设备网络的有用信息，例如 IP 地址、MAC 地址和飞行模式状态。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-network
```
:::
:::tab yarn
```sh
yarn expo install expo-network
```
:::
:::tab pnpm
```sh
pnpm expo install expo-network
```
:::
:::tab bun
```sh
bun expo install expo-network
```
:::
:::

## 配置

在 Android 上，这个模块需要访问网络和 Wi-Fi 状态的权限。`ACCESS_NETWORK_STATE` 和 `ACCESS_WIFI_STATE` 权限会自动添加。

## API

```js
import * as Network from 'expo-network';
```

## 错误码

| 代码 | 说明 |
| --- | --- |
| `ERR_NETWORK_IP_ADDRESS` | 在 Android 上，访问 `getIpAddressAsync` 中的 `WifiManager` 时，Wi-Fi 主机可能未知。在 iOS 上，无法获取任何网络接口。 |
| `ERR_NETWORK_UNDEFINED_INTERFACE` | 调用 `getMacAddressAsync` 时传入了未定义的 `interfaceName` 参数。 |
| `ERR_NETWORK_SOCKET_EXCEPTION` | 在 `getMacAddressAsync` 中创建或访问套接字时遇到错误。 |
| `ERR_NETWORK_INVALID_PERMISSION_INTERNET` | `getMacAddressAsync` 中 [`android.permission.ACCESS_WIFI_STATE`](https://developer.android.com/reference/android/Manifest.permission#ACCESS_WIFI_STATE) 的权限无效。 |
| `ERR_NETWORK_NO_ACCESS_NETWORKINFO` | 无法访问网络信息。 |
