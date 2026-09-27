---
title: 为 EAS Update 优化资源
description: 了解 EAS Update 如何下载资源，以及如何优化下载体积。
---

# 为 EAS Update 优化资源

:::note
新的[资源选择功能](/eas-update/asset-selection)可以大幅减少下载资源的总数和体积。
:::

应用发现新更新时，会先下载清单，再下载任何新的或已更新的资源，以便运行该更新。流程如下：

![更新下载时间线](/static/images/eas-update/process.png)

许多运行 Android 和 iOS 应用的用户使用的是移动网络，其稳定性或速度不如 Wi-Fi，因此作为更新一部分下发的资源应尽可能小。

## 代码资源

发布更新时，EAS CLI 会运行 Expo CLI，把项目打包成更新。更新会出现在项目的 **dist** 目录中。

在 **dist/bundles** 中，可以看到将分别成为 Android 和 iOS 更新一部分的 **index.android.js** 与 **index.ios.js** 文件大小。请注意这些是未压缩的文件大小；EAS Update 使用 Brotli 和 gzip 压缩，可以显著减小下载体积。即便如此，如果设备此前没有下载过这些文件，获取新更新时仍会把它们下载到用户设备上。让这些文件尽可能小，有助于终端用户更快下载更新。

## 图片资源

如果新图片或其他资源还不是构建的一部分，应用用户在检测到新更新时就必须下载它们。你可以在 **dist/assets** 中查看上传到 EAS 服务器的全部资源。那里的资源经过哈希处理并去掉了扩展名，因此很难知道具体是哪些资源。要查看格式化后的资源列表，可以运行：

:::tabs
:::tab npm
```sh
$ npx expo export
```
:::
:::tab yarn
```sh
$ yarn expo export
```
:::
:::tab pnpm
```sh
$ pnpm expo export
```
:::
:::tab bun
```sh
$ bun expo export
```
:::
:::

### 优化图片资源

要手动优化项目中的图片资源，可以使用 `npx expo-optimize` 命令。它使用 [sharp](https://sharp.pixelplumbing.com/) 库压缩图片。

```sh
$ npx expo-optimize
```

运行该命令后，除已经优化过的图片外，所有图片资源都会被压缩。你可以在命令中加入 `--quality [number]` 选项来调整压缩质量。例如，压缩到 90%：

```sh
$ npx expo-optimize --quality 90
```

### 其他手动优化方法

要手动优化图片和视频，参见[资源文件](/develop/user-interface/assets#手动优化方法)了解更多信息。

## 确保资源包含在更新中

发布更新时，EAS 会把资源上传到 CDN，以便用户运行应用时获取。但资源要上传到 CDN，必须在应用代码的某处被显式 require。有条件地 require 资源会导致打包器无法检测到它们，发布项目时它们就不会被上传。

## 进一步的考虑

需要注意的是，用户的应用只会下载新的或已更新的资源。它不会重新下载应用内已经存在且未改变的资源。

让更新保持精简的一种方式，是经常向应用商店构建并提交应用，使用户可以下载包含更新资源的新应用二进制文件。一般来说，添加大型资源或多个资源时构建并提交应用是好做法；在应用商店发布之间，用更新来修复小 bug 和做小改动也是好做法。
