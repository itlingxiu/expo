---
title: Tree shaking 与代码移除
description: 了解 Expo CLI 如何优化生产环境的 JavaScript bundle。
---

# Tree shaking 与代码移除

> 支持平台：Android、iOS、Web、tvOS。

Tree shaking（也称为 _死代码移除_）是从生产 bundle 中移除未使用代码的技术。Expo CLI 采用多种技术，包括[压缩](/guides/minify)，通过移除未使用的代码来改善启动时间。

## 平台 shaking

Expo CLI 在应用打包时采用称为 **平台 shaking** 的过程，为每个平台（Android、iOS、Web）创建单独的 bundle。它确保只在一个平台上使用的代码会从其他平台中移除。

任何基于从 `react-native` 导入的 `Platform` 模块有条件使用的代码，都会从其他平台中移除。不过，这种排除专门适用于在每个文件中直接从 react-native 导入 `Platform.select` 和 `Platform.OS` 的情况。如果它们通过另一个模块重新导出，在为不同平台打包时就不会被移除。

例如，考虑以下转换输入：

```js Input
import { Platform } from 'react-native';

if (Platform.OS === 'ios') {
  console.log('Hello on iOS');
}
```

生产 bundle 会根据平台移除该条件：

```js Output (Android)
/* @hide Android 上为空 */
```

```js Output (iOS)
console.log('Hello on iOS');
```

此优化仅用于生产环境，并按文件运行。如果从另一个模块重新导出 `Platform.OS`，它不会从生产 bundle 中移除。

`process.env.EXPO_OS` 可用于检测 JavaScript 是为哪个平台打包的（运行时不能改变）。由于 Metro 在依赖解析之后才压缩代码，这个值不支持平台 shaking 导入。

## 移除仅用于开发的代码

项目中可能有为帮助开发过程而设计的代码。它应当从生产 bundle 中排除。要处理这些场景，使用 `process.env.NODE_ENV` 环境变量或非标准的 `__DEV__` 全局布尔值。

1. 例如，以下代码片段会从生产 bundle 中移除：

```js Input
if (process.env.NODE_ENV === 'development') {
  console.log('Hello in development');
}

if (__DEV__) {
  console.log('Another development-only conditional...');
}
```

2. _常量折叠_ 发生后，条件可以静态求值：

```js Post constants folding
if ('production' === 'development') {
  console.log('Hello in development');
}

if (false) {
  console.log('Another development-only conditional...');
}
```

3. 不可达的条件在[压缩](/guides/minify)期间被移除：

```js Output (production)
/* @hide 空文件 */
```

为了提高速度，Expo CLI 只在生产构建中执行代码消除。上面代码片段中的条件会保留在开发构建中。

## 自定义代码移除

`EXPO_PUBLIC_` 环境变量会在压缩过程之前内联。这意味着它们可以用来从生产 bundle 中移除代码。例如：

1. 

```js .env
EXPO_PUBLIC_DISABLE_FEATURE=true;
```

```js Input
if (!process.env.EXPO_PUBLIC_DISABLE_FEATURE) {
  console.log('Hello from the feature!');
}
```

2. 上面的输入代码片段在 `babel-preset-expo` 之后转换为：

```js Post babel-preset-expo
if (!'true') {
  console.log('Hello from the feature!');
}
```

3. 上面的代码片段随后被压缩，从而移除未使用的条件：

```js Post minifier
// 空文件
```

- 此系统不适用于服务器代码，因为环境变量不会在服务器 bundle 中内联。
- 库作者不应使用 `EXPO_PUBLIC_` 环境变量，因为出于安全原因它们只在应用代码中运行。

## 移除服务器代码

用 `typeof window === 'undefined'` 有条件地为服务器和客户端环境启用或禁用代码很常见。

为服务器环境打包时，`babel-preset-expo` 会把 `typeof window === 'undefined'` 转换为 `true`。默认情况下，为 Web 客户端环境打包时此检查保持不变。此转换在开发和生产中都会运行，但只在生产环境中移除条件 `require`。

可以通过传入 `{ minifyTypeofWindow: true }` 配置 `babel-preset-expo` 来启用此转换。默认情况下，即使对 Web 环境此转换也保持禁用，因为 Web Worker 没有 `window` 全局对象。

1. 

```js Input
if (typeof window === 'undefined') {
  console.log('Hello on the server!');
}
```

2. 上一步的输入代码在为服务器环境（API 路由、服务端渲染）打包时，经过 `babel-preset-expo` 后转换为以下代码片段：

```js Post babel-preset-expo (bundling for server)
if (true) {
  console.log('Hello on the server!');
}
```

为 Web 或原生应用打包客户端代码时，除非设置了 `minifyTypeOfWindow: true`，否则不会替换 `typeof window`：

```js Post babel-preset-expo
if (typeof window === 'undefined') {
  console.log('Hello on the server!');
}
```

3. 对于服务器环境，上面的代码片段随后被压缩，从而移除未使用的条件：

```js Post minifier (server)
console.log('Hello on the server!');
```

```js Post minifier (client)
if (typeof window === 'undefined') {
  console.log('Hello on the server!');
}
// 空文件
```

## React Native Web 导入

`babel-preset-expo` 为 `react-native-web` 的 barrel 文件提供内置优化。如果使用 ESM 直接导入 `react-native`，则 barrel 文件会从生产 bundle 中移除。

:::tabs
:::tab ESM

如果使用静态 `import` 语法导入 `react-native`，barrel 文件会被移除。

```js Input
import { View, Image } from 'react-native';
```

```js Output (web)
import View from 'react-native-web/dist/exports/View';
import Image from 'react-native-web/dist/exports/Image';
```

:::
:::tab CJS

如果使用 `require()` 导入 `react-native`，barrel 文件会原样留在生产 bundle 中。

```js Input
const { View, Image } = require('react-native');
```

```js Output (web)
const { View, Image } = require('react-native-web');
```

:::
:::

## 移除未使用的导入与导出

> 在 SDK 52 及更高版本中[实验性](/more/release-statuses#experimental)可用。

你可以实验性地启用跨模块自动移除未使用导入与导出的支持。这有助于加快原生 OTA 下载，并优化必须用标准 JavaScript 引擎解析和执行 JavaScript 的 Web 性能。

考虑以下示例代码：

```js index.js
import { ArrowUp } from './icons';

export default function Home() {
  return <ArrowUp />;
}
```

```js icons.js
export function ArrowUp() {
  /* ... */
}

export function ArrowDown() {
  /* ... */
}

export function ArrowRight() {
  /* ... */
}

export function ArrowLeft() {
  /* ... */
}
```

由于 `index.js` 中只使用了 `ArrowUp`，生产 bundle 会从 `icons.js` 中移除所有其他组件。

```js icons.js (Output)
export function ArrowUp() {
  /* ... */
}
```

此系统可以扩展到自动优化应用中所有平台上的全部 `import` 和 `export` 语法。虽然这会得到更小的 bundle，处理 JS 仍然需要时间和计算机内存，因此避免导入数百万个模块。

- Tree shaking 只在生产 bundle 中运行，并且只能在使用 `import` 和 `export` 语法的模块上运行。使用 `module.exports` 和 `require` 的文件不会被 tree shake。
- 避免添加会把 `import`/`export` 语法转换为 CJS 的 Babel 插件，例如 `@babel/plugin-transform-modules-commonjs`。这会破坏整个项目的 tree shaking。
- 被标记为有副作用的模块不会从图中移除。
- `export * from "..."` 会被展开并优化，除非导出使用 `module.exports` 或 `exports`。
- Expo SDK 中的所有模块都以 ESM 形式发布，可以被彻底 tree shake。

## 启用 tree shaking

> 在 SDK 52 及更高版本中[实验性](/more/release-statuses#experimental)可用。

1. 确保 `experimentalImportSupport`，并确保应用按预期构建和运行。

:::note
在 SDK 54 及更高版本中默认启用。
:::

<details>
<summary>如何在较旧的 SDK 版本中启用 import 支持？</summary>

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
  },
});

module.exports = config;
```

实验性 import 支持使用 `@babel/plugin-transform-modules-commonjs` 插件的自定义版本。这大幅减少解析次数并简化输出 bundle。此特性可以与 `inlineRequires` 一起使用，以进一步实验性地优化 bundle。

</details>

2. 打开环境变量 `EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1`，以便在整个图创建完成之前保留模块。在继续之前，确保应用在启用此特性的生产环境中按预期构建和运行。

```sh .env
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1
```

这只会在生产模式中使用。

3. 打开环境变量 `EXPO_UNSTABLE_TREE_SHAKING=1` 以启用该特性。

```sh .env
EXPO_UNSTABLE_TREE_SHAKING=1
```

这只会在生产模式中使用。

4. 在生产模式下打包应用，以查看 tree shaking 的效果。

:::tabs
:::tab npm
```sh
npx expo export
```
:::
:::tab yarn
```sh
yarn expo export
```
:::
:::tab pnpm
```sh
pnpm expo export
```
:::
:::tab bun
```sh
bun expo export
```
:::
:::

此特性非常实验性，因为它改变了 Metro 打包代码的基本结构。默认情况下，Metro 按需且惰性地打包一切，以确保尽可能快的开发时间。相比之下，tree shaking 要求某些转换延迟到整个 bundle 创建之后。这意味着可以缓存的代码更少，这通常没问题，因为 tree shaking 是仅生产环境的特性，而生产 bundle 往往不使用转换缓存。

## Barrel 文件

> 在 SDK 52 及更高版本中[实验性](/more/release-statuses#experimental)可用。

使用 Expo tree shaking 时，星号导出会根据使用情况自动展开并 shaking。例如，考虑以下代码片段：

```js Input
export * from './icons';
```

优化过程会爬取 `./icons` 并把导出添加到当前模块。如果导出未被使用，它们会从生产 bundle 中移除。

```js Expanded
export { ArrowRight, ArrowLeft } from './icons';
```

这会按照标准 tree shaking 规则被 shaking。如果只导入 `ArrowRight`，则 `ArrowLeft` 会从生产 bundle 中移除。

如果星号导出引入了 `module.exports.ArrowUp` 或 `exports.ArrowDown` 这类有歧义的导出，优化过程不会展开星号导出，也不会从 barrel 文件中移除任何导出。可以使用 [Expo Atlas](/guides/analyzing-bundles#analyzing-bundle-size-with-expo-atlas) 检查展开后的导出。

可以把此策略用于 `lucide-react` 等库，以移除应用中未使用的全部图标。

## 递归优化

> 在 SDK 52 及更高版本中[实验性](/more/release-statuses#experimental)可用。

Expo 通过穷尽地递归遍历图来查找未使用的导入，从而优化模块。考虑以下代码片段：

```js Input
export function foo() {
  // 因为这里使用了 bar，所以不能移除它。
  bar();
}

export function bar() {}
```

在这种情况下，`bar` 在 `foo` 中被使用，因此不能移除。不过，如果应用中任何地方都没有使用 `foo`，则 `foo` 会被移除，模块会再次扫描以查看 `bar` 是否可以移除。出于性能原因，此过程对给定模块递归 5 次后就会停止。

## 副作用

Expo CLI 按照 [Webpack 系统](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free)尊重模块副作用。副作用通常用于定义全局变量（`console.log`）或修改原型（避免这样做）。

可以在 **package.json** 中标记模块是否有副作用：

```json package.json
{
  "name": "library",
  "sideEffects": ["./src/*.js"]
}
```

副作用会阻止移除未使用的模块，并禁用模块内联，以确保 JS 代码按预期顺序运行。如果副作用为空，或只包含注释和指令（`"use strict"`、`"use client"` 等），它们会被移除。

启用 Expo tree shaking 后，可以安全地在 **metro.config.js** 中为生产 bundle 启用 `inlineRequires`。这会在模块被求值时惰性加载它们，从而加快启动时间。不要在没有 Expo tree shaking 的情况下使用此特性，因为它会以可能改变副作用执行顺序的方式移动模块。

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
    inlineRequires: true,
  },
});

module.exports = config;
```

## 为 tree shaking 优化

在 Expo tree shaking 之前，React Native 库会把导入包在条件块中来移除它们，例如：

```js
if (process.env.NODE_ENV === 'development') {
  require('./dev-only').doSomething();
}
```

这有问题，因为你没有准确的 TypeScript 支持，而且由于无法静态分析代码，图会变得有歧义。启用 Expo tree shaking 后，可以把这段代码重构为使用 ESM 导入：

```js Input
import { doSomething } from './dev-only';

if (process.env.NODE_ENV === 'development') {
  doSomething();
}
```

两种情况下，整个模块在生产 bundle 中都会为空。
