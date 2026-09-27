---
title: Router Native tabs
description: An Expo Router submodule that provides native tabs layout.
packageName: expo-router
---

# Router Native tabs

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-router/native-tabs` is a submodule of `expo-router` and exports components to build tab layouts using platform-native system tabs.

> See the [Expo Router](/versions/latest/sdk/router/index) reference for more information about the file-based routing library for native and web app.

## Installation

To use `expo-router/native-tabs` in your project, you need to install `expo-router` in your project. Follow the instructions from Expo Router's installation guide:

- [Install Expo Router](/router/installation)：Learn how to install Expo Router in your project.

## Configuration in app config

If you are using the [default](/more/create-expo#--template) template to create a new project, `expo-router`'s [config plugin](/config-plugins/introduction) is already configured in your app config.

### Example app.json with config plugin

```json
{
  "expo": {
    "plugins": ["expo-router"]
  }
}
```

## Usage

To learn how to use native tabs, with Expo Router, read the native tabs guide:

- [Native tabs](/router/advanced/native-tabs)：Learn how to use native tabs in your Expo Router app.

## API

```js
import { NativeTabs } from 'expo-router/native-tabs';
```

