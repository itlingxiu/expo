---
title: Asset 包参考
description: 一个通用库，用于下载资源并与其他库配合使用。
---

# Asset 包参考

`expo-asset` 提供了访问 Expo 资源系统的接口。资源是指与应用源代码放在一起、应用在运行时需要用到的任意文件。例如图片、字体和声音。Expo 的资源系统与 React Native 的资源系统集成，因此你可以用 `require('path/to/file')` 引用文件。例如，在 React Native 中把静态图片用于 `Image` 组件时，就是这样引用的。更多信息见 React Native 的[静态图片资源文档](https://reactnative.dev/docs/images#static-image-resources)。这种引用静态图片资源的方式在 Expo 中开箱即用。

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-asset
```
:::
:::tab yarn
```sh
yarn expo install expo-asset
```
:::
:::tab pnpm
```sh
pnpm expo install expo-asset
```
:::
:::tab bun
```sh
bun expo install expo-asset
```
:::
:::

## 在应用配置中配置

如果你的项目使用配置插件（[持续原生生成（CNG）](/workflow/continuous-native-generation)），可以使用内置的[配置插件](/config-plugins/introduction)来配置 `expo-asset`。该插件允许你配置若干无法在运行时设置的属性，这些属性需要重新构建应用二进制文件后才会生效。如果应用**没有**使用 CNG，则需要手动配置此库。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-asset",
        {
          "assets": ["path/to/file.png", "path/to/directory"]
        }
      ]
    ]
  }
}
```

### 可配置属性

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `assets` | `[]` | 要链接到原生项目的资源文件或目录数组。路径应相对于项目根目录，这样无论是直接指定文件名还是使用目录，这些名称都会成为资源名。支持的文件类型：图片：`.png`、`.jpg`、`.gif`；媒体：`.mp4`、`.mp3`、`.lottie`、`.riv`；SQLite 数据库文件：`.db`；3D 模型：`.glb`。 |

:::note
要导入已有的数据库文件（`.db`），请参阅 [SQLite API 参考](/versions/latest/sdk/sqlite#import-an-existing-database)中的说明。对于其他文件类型（例如 `.lottie` 或 `.riv`），请参阅[如何在 Metro 配置的 `assetExts` 中添加文件扩展名](/guides/customizing-metro#adding-more-file-extensions-to-assetexts)。
:::

### 用法

了解如何使用 `expo-asset` 配置插件在项目中嵌入资源文件，见[在构建时加载资源](/develop/user-interface/assets#load-an-asset-at-build-time-with-expo-asset-config-plugin)。

## API

```js
import { Asset } from 'expo-asset';
```
