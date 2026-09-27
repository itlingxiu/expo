---
title: 在 macOS 和 Linux 上清除打包器缓存
description: 了解在 macOS 和 Linux 上使用 Yarn 或 npm 配合 Expo CLI 或 React Native CLI 时，如何清除打包器缓存。
---

# 在 macOS 和 Linux 上清除打包器缓存

> 需要在 Windows 上清除开发缓存？[在这里查看相关命令。](/troubleshooting/clear-cache-windows)

项目关联着多种不同的缓存，它们可能让项目无法按预期运行。清除缓存有时可以帮助你绕过由过期或损坏数据引起的问题，在排查和调试时往往很有用。

要清除各种缓存，请运行：

## Expo CLI 与 Yarn

```sh
# 使用 Yarn workspaces 时，可能需要删除每个 workspace 中的 node_modules
$ rm -rf node_modules

$ yarn cache clean

$ yarn

$ watchman watch-del-all

$ rm -fr $TMPDIR/haste-map-*

$ rm -rf $TMPDIR/metro-cache

$ npx expo start --clear
```

## Expo CLI 与 npm

```sh
$ rm -rf node_modules

$ npm cache clean --force

$ npm install

$ watchman watch-del-all

$ rm -fr $TMPDIR/haste-map-*

$ rm -rf $TMPDIR/metro-cache

$ npx expo start --clear
```

## React Native CLI 与 Yarn

```sh
# 使用 Yarn workspaces 时，可能需要删除每个 workspace 中的 node_modules
$ rm -rf node_modules

$ yarn cache clean

$ yarn

$ watchman watch-del-all

$ rm -fr $TMPDIR/haste-map-*

$ rm -rf $TMPDIR/metro-cache

$ yarn start -- --reset-cache
```

## React Native CLI 与 npm

```sh
$ rm -rf node_modules

$ npm cache clean --force

$ npm install

$ watchman watch-del-all

$ rm -fr $TMPDIR/haste-map-*

$ rm -rf $TMPDIR/metro-cache

$ npm start -- --reset-cache
```

## 这些命令在做什么

在运行从网上找到的命令之前，先理解它们是个好习惯。下面针对 Expo CLI、npm 和 Yarn 解释每条命令，React Native CLI 的对应命令行为相同。

| 命令 | 说明 |
| --- | --- |
| `rm -rf node_modules` | 清除项目的全部依赖 |
| `yarn cache clean` | 清除全局 Yarn 缓存 |
| `npm cache clean --force` | 清除全局 npm 缓存 |
| `yarn`/`npm install` | 重新安装全部依赖 |
| `watchman watch-del-all` | 重置 `watchman` 文件监视器 |
| `rm -rf $TMPDIR/<cache>` | 清除指定的打包器缓存文件或目录 |
| `npx expo start --clear` | 重启开发服务器并清除 JavaScript 转换缓存 |
