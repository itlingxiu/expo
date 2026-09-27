---
title: Expo Fingerprint 包参考
description: 一个用于从 React Native 项目生成指纹的库。
---

# Expo Fingerprint 包参考

> 支持平台：Node。

`@expo/fingerprint` 提供 API 来生成项目的指纹（哈希值），用于判断应用原生层与 JavaScript 层之间的兼容性。哈希计算是可配置的，默认通过对应用依赖、自定义原生代码、原生项目文件及配置进行哈希计算得出。

## 安装

默认情况下，`@expo/fingerprint` 已包含在 [`expo`](/versions/latest/sdk/expo) 和 [`expo-updates`](/versions/latest/sdk/updates) 中。

如果你想将 `@expo/fingerprint` 作为独立包使用，可以运行以下命令安装：

:::tabs
:::tab npm
```sh
npx expo install @expo/fingerprint
```
:::
:::tab yarn
```sh
yarn expo install @expo/fingerprint
```
:::
:::tab pnpm
```sh
pnpm expo install @expo/fingerprint
```
:::
:::tab bun
```sh
bun expo install @expo/fingerprint
```
:::
:::

## CLI 用法

:::tabs
:::tab npm
```sh
npx @expo/fingerprint --help
```
:::
:::tab yarn
```sh
yarn dlx @expo/fingerprint --help
```
:::
:::tab pnpm
```sh
pnpm dlx @expo/fingerprint --help
```
:::
:::tab bun
```sh
bunx @expo/fingerprint --help
```
:::
:::

## 配置

`@expo/fingerprint` 提供的默认配置适用于大多数项目，同时也提供了几种配置指纹计算过程的方式，以便更好地适配你的应用结构和工作流。

### .fingerprintignore

放在项目根目录下的 **.fingerprintignore** 是一个类似 [**.gitignore**](https://git-scm.com/docs/gitignore#_pattern_format) 的忽略机制，用于将文件排除在哈希计算之外。所有模式路径都相对于项目根目录。它的行为与 .gitignore 相似，但使用 `minimatch` 进行模式匹配，因而存在一些[限制](#限制)（有关 `ignorePaths` 的文档，参见 API 中的 `Options`）。

以下是一个 **.fingerprintignore** 配置示例：

```ignore .fingerprintignore
# 忽略整个 android 目录
android/**/*

# 忽略整个 ios 目录，但保留 ios/Podfile 和 ios/Podfile.lock
ios/**/*
!ios/Podfile
!ios/Podfile.lock

# 忽略 node_modules 中的特定包
node_modules/some-package/**/*

# 与上面相同，但作用范围更广，因为包可能是嵌套的
**/node_modules/some-package/**/*
```

### fingerprint.config.js

放在项目根目录下的 **fingerprint.config.js** 允许你指定 **.fingerprintignore** 之外的自定义哈希计算配置。支持的配置项参见 `Config`、`FingerprintPreset` 和 `SourceSkips`。

以下是一个 **fingerprint.config.js** 配置示例，假设你已将 `@expo/fingerprint` 作为直接依赖安装：

```js fingerprint.config.js
/** @type {import('@expo/fingerprint').Config} */
const config = {
  // 取消注释可切换预设（默认值为 'balanced'）。可选项参见 FingerprintPreset。
  // preset: 'strict',
  sourceSkips: [
    'ExpoConfigRuntimeVersionIfString',
    'ExpoConfigVersions',
    'PackageJsonAndroidAndIosScriptsIfNotContainRun',
  ],
};
module.exports = config;
```

如果你通过 `expo` 使用 `@expo/fingerprint`（即 `@expo/fingerprint` 作为传递依赖安装），可以从 `expo/fingerprint` 导入 fingerprint：

```js
/** @type {import('expo/fingerprint').Config} */
```

<details><summary>进阶：在指纹哈希计算前自定义 source</summary>

在某些情况下，你可能想在计算指纹之前自定义 source。例如：

- 你想从应用配置中移除敏感数据。
- 你想让应用配置中的动态值保持稳定。
- 你想将文件哈希转换为稳定的值。

为此，你可以在 **fingerprint.config.js** 文件中使用 `fileHookTransform` 选项，在哈希计算前对 source 进行转换。更多信息请参见 API 中 `fileHookTransform` 选项的文档。

```js fingerprint.config.js
const assert = require('node:assert');

const fileChunkMap = {};

/** @type {import('@expo/fingerprint').Config} */
const config = {
  fileHookTransform: (source, chunk, isEndOfFile, encoding) => {
    // 从应用配置中移除 "updates" 部分
    if (source.type === 'contents' && source.id === 'expoConfig') {
      assert(isEndOfFile, 'contents source is expected to have single chunk.');
      const config = JSON.parse(chunk);
      delete config.updates;
      return JSON.stringify(config);
    }

    // 将 contents 类型的 source 转换为空字符串
    if (source.type === 'contents' && source.id === 'packageJson:scripts') {
      return '';
    }

    // 通过替换动态值来转换文件类型的 source
    if (source.type === 'file' && source.filePath === 'eas.json') {
      return chunk.toString().replace(/MyApp-Dev/g, 'MyApp');
    }

    // 转换分多个 chunk 处理的大文件
    // 要获取完整文件，请缓冲所有 chunk 并一次性返回
    if (source.type === 'file' && source.filePath === 'assets/large-image.jpg') {
      let receivedBuffer = fileChunkMap[source.filePath] ?? Buffer.alloc(0);
      if (chunk != null) {
        const buffer = typeof chunk === 'string' ? Buffer.from(chunk, encoding) : chunk;
        receivedBuffer = Buffer.concat([receivedBuffer, buffer]);
        fileChunkMap[source.filePath] = receivedBuffer;
      }
      if (!isEndOfFile) {
        return null;
      }
      fileChunkMap[source.filePath] = null;
      // 完整的负载在这里可用，你可以按需进行转换。
      receivedBuffer = receivedBuffer.toString().replace(/SensitiveData/g, 'StableData');
      return receivedBuffer;
    }

    // 对于其他 source，直接返回 chunk
    return chunk;
  },
};

module.exports = config;
```

</details>

## 限制

<details><summary>对 `@expo/config-plugins` 原生函数的有限支持</summary>

在使用带原生函数的配置插件时，务必了解某些限制，尤其是在指纹计算的场景下。该库会尽力为通过配置插件所做的更改生成指纹；但原生函数会带来一些特殊挑战。原生函数无法序列化为指纹，这意味着它们不能直接用于生成唯一的哈希值。

为了解决这一限制，该库采用以下策略之一为原生函数创建可序列化的指纹：

1. 使用 `Function.name`：对于具名的原生函数，该库会利用 `Function.name` 属性（如果可用）。该属性为函数提供了一个可识别的名称，可用作指纹属性。

2. 使用 `withAnonymous`：对于没有 `Function.name` 的匿名原生函数，该库会退而使用 `withAnonymous` 作为指纹属性。这是匿名函数的通用标识符。

下面这个例子说明了该库将使用 [`withMyPlugin`、`withAnonymous`] 作为插件属性进行指纹哈希计算的情形：

```js app.config.js
const { withInfoPlist } = require('expo/config-plugins');

const withMyPlugin = (config) => {
  return withInfoPlist(config, (config) => {
    config.modResults.NSLocationWhenInUseUsageDescription = 'Allow $(PRODUCT_NAME) to use your location';
    return config;
  });
};

export default ({ config }) => {
  config.plugins ||= [];
  config.plugins.push(withMyPlugin);
  config.plugins.push((config) => config);
  return config;
};
```

需要注意的是，由于这种设计，如果你修改了原生配置插件函数的实现，例如更改 `withMyPlugin` 中的 **Info.plist** 值，指纹仍会生成相同的哈希值。为了在修改配置插件实现时确保指纹唯一，可以考虑以下做法：

- 避免匿名函数：避免使用匿名的原生配置插件函数。尽可能改用具名函数，并确保在实现发生变化时函数名保持一致。

- 使用本地配置插件：或者，你可以将本地配置插件创建为独立的模块，每个模块都有自己的导出。这样，你在修改配置插件实现时就可以指定不同的函数名。

下面是一个使用本地配置插件的示例：

```js ./plugins/withMyPlugin.js
const { withInfoPlist } = require('expo/config-plugins');

const withMyPlugin = config => {
  return withInfoPlist(config, config => {
    config.modResults.NSLocationWhenInUseUsageDescription =
      'Allow $(PRODUCT_NAME) to use your location';
    return config;
  });
};

module.exports = withMyPlugin;
```

```json app.json
{
  "expo": {
    /* @hide ... */ /* @end */
    "plugins": "./plugins/withMyPlugin"
  }
}
```

遵循这些准则，你就能有效管理配置插件的更改，并确保指纹计算保持一致且可靠。

</details>

## API

```ts
import * as Fingerprint from '@expo/fingerprint';
```
