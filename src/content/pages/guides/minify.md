---
title: 压缩 JavaScript
description: 了解如何在 Expo CLI 中用 Metro 打包器自定义 JavaScript 压缩过程。
---

# 压缩 JavaScript

压缩是构建过程中的一项优化步骤。它会移除源码中不必要的字符，例如折叠空白、删除注释、缩短静态运算。这一过程可以减小最终体积并改善加载时间。

## Expo CLI 中的压缩

在 Expo CLI 中，压缩发生在生产导出期间对 JavaScript 文件的处理中（运行 `npx expo export`、`npx expo export:embed`、`eas build` 等命令时）。

例如，考虑项目中的以下代码片段：

```js Input
// 这条注释会被删除
console.log('a' + ' ' + 'long' + ' string' + ' to ' + 'collapse');
```

Expo CLI 会把它压缩为：

```js Output
console.log('a long string to collapse');
```

:::tip
使用 `/** @preserve */` 指令可以保留注释。
:::

Expo CLI 的默认压缩对大多数项目已经足够。不过，你可以自定义压缩器，以优化速度，或移除日志等额外特性。

## 移除 console 日志

你可以从生产构建中移除 console 日志。在 Terser 压缩器配置中使用 `drop_console` 选项。

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig = {
  compress: {
    // 下面的选项会在生产环境中移除所有 console 日志语句。
    drop_console: true,
  },
};

module.exports = config;
```

如果希望保留某些日志，也可以传入要丢弃的 console 类型数组。例如：`drop_console: ['log', 'info']` 会移除 `console.log` 和 `console.info`，但保留 `console.warn` 和 `console.error`。

## 自定义压缩器

不同压缩器在速度与压缩率之间有所取舍。你可以修改项目中的 **metro.config.js** 文件，自定义 Expo CLI 使用的压缩器。

### Terser

> [`terser`](https://github.com/terser/terser) 是默认压缩器（[Metro@0.73.0 更新日志](https://github.com/facebook/metro/releases/tag/v0.73.0)）。

1. 在项目中安装 Terser，运行以下命令：

:::tabs
:::tab npm
```sh
npm install --save-dev metro-minify-terser
```
:::
:::tab yarn
```sh
yarn add --dev metro-minify-terser
```
:::
:::tab pnpm
```sh
pnpm add --save-dev metro-minify-terser
```
:::
:::tab bun
```sh
bun add --dev metro-minify-terser
```
:::
:::

2. 用 `transformer.minifierPath` 将 Terser 设为压缩器，并把 [`terser` 选项](https://github.com/terser/terser#compress-options)传给 `transformer.minifierConfig`。

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierPath = 'metro-minify-terser';
config.transformer.minifierConfig = {
  // Terser 选项...
};

module.exports = config;
```

### 不安全的 Terser 选项

若要获得额外压缩，而这些优化未必在所有 JavaScript 引擎中都可用，请启用 [`unsafe` `compress` 选项](https://terser.org/docs/miscellaneous/#the-unsafe-compress-option)：

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierPath = 'metro-minify-terser';

config.transformer.minifierConfig = {
  compress: {
    // 启用所有不安全优化。
    unsafe: true,
    unsafe_arrows: true,
    unsafe_comps: true,
    unsafe_Function: true,
    unsafe_math: true,
    unsafe_symbols: true,
    unsafe_methods: true,
    unsafe_proto: true,
    unsafe_regexp: true,
    unsafe_undefined: true,
    unused: true,
  },
};

module.exports = config;
```

### esbuild

[`esbuild`](https://esbuild.github.io/) 的压缩速度比 `uglify-es` 和 `terser` 快几个数量级。更多信息见 [`metro-minify-esbuild`](https://github.com/EvanBacon/metro-minify-esbuild#usage) 的用法。

### Uglify

可以按以下步骤使用 [`uglify-es`](https://github.com/mishoo/UglifyJS)：

1. 在项目中安装 Uglify，运行以下命令：

:::tabs
:::tab npm
```sh
npm install --save-dev metro-minify-uglify
```
:::
:::tab yarn
```sh
yarn add --dev metro-minify-uglify
```
:::
:::tab pnpm
```sh
pnpm add --save-dev metro-minify-uglify
```
:::
:::tab bun
```sh
bun add --dev metro-minify-uglify
```
:::
:::

> 请确保 `metro-minify-uglify` 的版本与项目中的 `metro` 版本一致。

2. 用 `transformer.minifierPath` 将 Uglify 设为压缩器，并把[选项](https://github.com/mishoo/UglifyJS#compress-options)传给 `transformer.minifierConfig`。

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierPath = 'metro-minify-uglify';
config.transformer.minifierConfig = {
  // 选项：https://github.com/mishoo/UglifyJS#compress-options
};

module.exports = config;
```
