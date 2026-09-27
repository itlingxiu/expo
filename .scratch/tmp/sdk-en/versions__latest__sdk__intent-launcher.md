---
title: IntentLauncher
description: A library that provides an API to launch Android intents.
packageName: expo-intent-launcher
---

# IntentLauncher

> 支持平台：Android、Expo Go。

`expo-intent-launcher` provides a way to launch Android intents. For example, you can use this API to open a specific settings screen.

## Installation

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

## Usage

```ts
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';

// Open location settings
startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS);
```

## API

```js
import * as IntentLauncher from 'expo-intent-launcher';
```

