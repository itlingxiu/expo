---
title: Application 包参考
description: 一个通用库，用于在运行时获取原生应用的 ID、应用名称和构建版本信息。
---

# Application 包参考

`expo-application` 可在运行时提供原生应用的 ID、应用名称和构建版本等有用信息。

> 支持平台：Android、iOS、Web、tvOS、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-application
```
:::
:::tab yarn
```sh
yarn expo install expo-application
```
:::
:::tab pnpm
```sh
pnpm expo install expo-application
```
:::
:::tab bun
```sh
bun expo install expo-application
```
:::
:::

## API

```js
import * as Application from 'expo-application';
```

## 错误码

| 代码 | 说明 |
| --- | --- |
| `ERR_APPLICATION_PACKAGE_NAME_NOT_FOUND` | 由 `getInstallationTimeAsync` 和 `getLastUpdateTimeAsync` 抛出的错误码。若无法获取包信息或包名，可能会抛出此错误。 |
| `ERR_APPLICATION_INSTALL_REFERRER_UNAVAILABLE` | 当前 Play Store 应用未提供安装引荐来源 API，或者可能未安装 Play Store。在未预装 Play Store 的 AVD 上测试时可能出现此错误码，例如 Google Pixel 3 和 Nexus 6。 |
| `ERR_APPLICATION_INSTALL_REFERRER_CONNECTION` | 无法建立到 Google Play Store 的连接。 |
| `ERR_APPLICATION_INSTALL_REFERRER_REMOTE_EXCEPTION` | 在与 Play Store 建立连接后抛出了 `RemoteException`。如果托管远程对象的进程不再可用，通常意味着该进程已崩溃，就可能发生这种情况。更多信息见 [关于 `RemoteException` 的这篇 StackOverflow 回答](https://stackoverflow.com/questions/3156389/android-remoteexceptions-and-services)。 |
| `ERR_APPLICATION_INSTALL_REFERRER` | `getInstallReferrerAsync` 方法的通用默认错误码。如果在获取安装引荐来源时发生异常，且该异常不属于更具体的错误，就会抛出此错误码。错误会附带 [`responseCode`](https://developer.android.com/reference/com/android/installreferrer/api/InstallReferrerClient.InstallReferrerResponse.html)。 |
| `ERR_APPLICATION_INSTALL_REFERRER_SERVICE_DISCONNECTED` | 与安装引荐来源服务的连接已丢失。当尝试连接并设置安装引荐来源服务、但连接随后丢失时，会抛出此错误。更多信息见 [Android 文档](https://developer.android.com/reference/com/android/installreferrer/api/InstallReferrerStateListener)。 |
