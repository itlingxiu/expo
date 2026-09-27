---
title: Router Native tabs 包参考
description: 提供原生标签页布局的 Expo Router 子模块。
---

# Router Native tabs 包参考

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-router/native-tabs` 是 `expo-router` 的子模块，导出用于借助平台原生系统标签页构建标签布局的组件。

> 有关这个面向原生和 Web 应用的基于文件的路由库的更多信息，请参阅 [Expo Router](/versions/latest/sdk/router) 参考。

## 安装

要在项目中使用 `expo-router/native-tabs`，需要先安装 `expo-router`。请按照 Expo Router 安装指南中的说明操作：

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

要了解如何在 Expo Router 中使用原生标签页，请阅读原生标签页指南：

- [原生标签页](/router/advanced/native-tabs)：了解如何在 Expo Router 应用中使用原生标签页。

## API

```js
import { NativeTabs } from 'expo-router/native-tabs';
```
