---
title: IntentLauncher 包参考
description: 提供启动 Android intent 的 API 的库。
---

# IntentLauncher 包参考

> 支持平台：Android、Expo Go。

`expo-intent-launcher` 提供启动 Android intent 的方法。例如，可以用这个 API 打开某个特定的设置界面。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-intent-launcher
```
:::
:::tab yarn
```sh
yarn expo install expo-intent-launcher
```
:::
:::tab pnpm
```sh
pnpm expo install expo-intent-launcher
```
:::
:::tab bun
```sh
bun expo install expo-intent-launcher
```
:::
:::

## 用法

```ts
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';

// 打开位置设置
startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS);
```

## API

```js
import * as IntentLauncher from 'expo-intent-launcher';
```
