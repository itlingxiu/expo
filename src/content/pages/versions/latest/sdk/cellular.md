---
title: Cellular 包参考
description: 提供用户蜂窝网络服务商信息的 API。
---

# Cellular 包参考

`expo-cellular` 提供用户蜂窝网络服务商的信息，例如其唯一标识符和蜂窝连接类型。

> 支持平台：Android、iOS、Web、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-cellular
```
:::
:::tab yarn
```sh
yarn expo install expo-cellular
```
:::
:::tab pnpm
```sh
pnpm expo install expo-cellular
```
:::
:::tab bun
```sh
bun expo install expo-cellular
```
:::
:::

## 配置

如果你没有使用持续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动使用原生 **android** 项目，则需要在项目的 **AndroidManifest.xml** 中添加 `android.permission.READ_PHONE_STATE` 权限。该权限用于 `TelephonyManager`。

```xml android/app/src/main/AndroidManifest.xml
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
```

此库不需要风险更高的 `READ_PRIVILEGED_PHONE_STATE` 权限。

## API

```js
import * as Cellular from 'expo-cellular';
```

## 错误码

| 代码 | 说明 |
| --- | --- |
| ERR_CELLULAR_GENERATION_UNKNOWN_NETWORK_TYPE | 无法访问网络类型，或未连接到蜂窝网络 |

## 权限

### Android

你必须在 **app.json** 的 [`expo.android.permissions`](/versions/latest/config/app#permissions) 数组中添加以下权限。

- `READ_PHONE_STATE`

### iOS

*无需权限。*
