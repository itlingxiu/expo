---
title: Router UI
description: An Expo Router submodule that provides headless tab components to create custom tab layouts.
packageName: expo-router
---

# Router UI

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-router/ui` is a submodule of `expo-router` library and exports components and hooks to build custom tab layouts, rather than using the default [React Navigation](https://reactnavigation.org/) navigators provided by `expo-router`.

> See the [Expo Router](/versions/latest/sdk/router/index) reference for more information about the file-based routing library for native and web app.

## Installation

To use `expo-router/ui` in your project, you need to install `expo-router` in your project. Follow the instructions from the Expo Router's installation guide:

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

For information about using `expo-router/ui` in Custom tab layouts guide:

- [Custom tab layouts](/router/advanced/custom-tabs)

## API

```js
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
```

