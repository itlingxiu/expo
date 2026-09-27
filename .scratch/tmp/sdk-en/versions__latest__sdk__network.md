---
title: Network
description: A library that provides access to the device's network such as its IP address, MAC address, and airplane mode status.
packageName: expo-network
---

# Network

> 支持平台：Android、iOS、Web、tvOS、Expo Go。

`expo-network` provides useful information about the device's network such as its IP address, MAC address, and airplane mode status.

## Installation

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

## Configuration

On Android, this module requires permissions to access the network and Wi-Fi state. The permissions `ACCESS_NETWORK_STATE` and `ACCESS_WIFI_STATE` are added automatically.

## API

```js
import * as Network from 'expo-network';
```

## Error codes

| Code                                    | Description                                                                                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ERR_NETWORK_IP_ADDRESS                  | On Android, there may be an unknown Wi-Fi host when trying to access `WifiManager` in `getIpAddressAsync`. On iOS, no network interfaces could be retrieved.                               |
| ERR_NETWORK_UNDEFINED_INTERFACE         | An undefined `interfaceName` was passed as an argument in `getMacAddressAsync`.                                                                                                            |
| ERR_NETWORK_SOCKET_EXCEPTION            | An error was encountered in creating or accessing the socket in `getMacAddressAsync`.                                                                                                      |
| ERR_NETWORK_INVALID_PERMISSION_INTERNET | There are invalid permissions for [`android.permission.ACCESS_WIFI_STATE`](https://developer.android.com/reference/android/Manifest.permission#ACCESS_WIFI_STATE) in `getMacAddressAsync`. |
| ERR_NETWORK_NO_ACCESS_NETWORKINFO       | Unable to access network information                                                                                                                                                       |

