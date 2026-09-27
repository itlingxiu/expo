---
title: Router UI 包参考
description: 提供无头标签页组件、用于创建自定义标签布局的 Expo Router 子模块。
---

# Router UI 包参考

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-router/ui` 是 `expo-router` 库的子模块，导出组件和 hook，用来构建自定义标签布局，而不是使用 `expo-router` 默认提供的 [React Navigation](https://reactnavigation.org/) 导航器。

> 有关这个面向原生和 Web 应用的基于文件的路由库的更多信息，请参阅 [Expo Router](/versions/latest/sdk/router) 参考。

## 安装

要在项目中使用 `expo-router/ui`，需要先安装 `expo-router`。请按照 Expo Router 安装指南中的说明操作：

- [安装 Expo Router](/router/installation)：了解如何在项目中安装 Expo Router。

## 在应用配置中配置

如果使用[默认](/more/create-expo#--template)模板创建新项目，`expo-router` 的[配置插件](/config-plugins/introduction)已经在应用配置中配置好了。

### 带配置插件的 app.json 示例

```json
{
  "expo": {
    "plugins": ["expo-router"]
  }
}
```

## 用法

关于在自定义标签布局指南中使用 `expo-router/ui` 的信息：

- [自定义标签布局](/router/advanced/custom-tabs)

## API

```js
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
```
