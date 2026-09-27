---
title: React Compiler
description: 了解如何在 Expo 应用中启用并使用 React Compiler。
---

# React Compiler

新的 [React Compiler](https://react.dev/learn/react-compiler) 会自动记忆化组件与 hook，从而实现细粒度响应性。这可以显著提升应用性能。按以下说明即可在应用中启用它。

## 启用 React Compiler

1. [检查项目与 React Compiler 的兼容程度](https://react.dev/learn/react-compiler#checking-compatibility)。

:::tabs
:::tab npm
```sh
npx react-compiler-healthcheck@latest
```
:::
:::tab yarn
```sh
yarn dlx react-compiler-healthcheck@latest
```
:::
:::tab pnpm
```sh
pnpm dlx react-compiler-healthcheck@latest
```
:::
:::tab bun
```sh
bunx react-compiler-healthcheck@latest
```
:::
:::

这通常会验证应用是否遵循 [**React 规则**](https://react.dev/reference/rules)。

2. 在项目中安装 `babel-plugin-react-compiler` 与 React Compiler 运行时：

:::tabs
:::tab SDK 54 及更高版本

在 Expo SDK 54 及更高版本中，Babel 会自动配置。

:::
:::tab SDK 53
:::tabs
:::tab npm
```sh
npx expo install babel-plugin-react-compiler@beta
```
:::
:::tab yarn
```sh
yarn expo install babel-plugin-react-compiler@beta
```
:::
:::tab pnpm
```sh
pnpm expo install babel-plugin-react-compiler@beta
```
:::
:::tab bun
```sh
bun expo install babel-plugin-react-compiler@beta
```
:::
:::
:::
:::tab SDK 52 及更早版本
:::tabs
:::tab npm
```sh
npx expo install babel-plugin-react-compiler@beta react-compiler-runtime@beta
```
:::
:::tab yarn
```sh
yarn expo install babel-plugin-react-compiler@beta react-compiler-runtime@beta
```
:::
:::tab pnpm
```sh
pnpm expo install babel-plugin-react-compiler@beta react-compiler-runtime@beta
```
:::
:::tab bun
```sh
bun expo install babel-plugin-react-compiler@beta react-compiler-runtime@beta
```
:::
:::
:::
:::

3. 在应用配置文件中打开 React Compiler 实验：

```json app.json
{
  "expo": {
    "experiments": {
      "reactCompiler": true
    }
  }
}
```

### 启用 linter

运行 [`npx expo lint`](/guides/using-eslint#eslint) 在应用中设置 ESLint，然后按你的 SDK 版本遵循说明：

:::tabs
:::tab SDK 55 及更高版本

在 SDK 55 及更高版本中，React Compiler 的 lint 规则默认包含在 `eslint-config-expo` 中。

如果之前安装过 `eslint-plugin-react-compiler`，可以卸载它，并从 ESLint 配置中移除。

:::
:::tab SDK 54 及更早版本

安装 React Compiler 的 ESLint 插件：

:::tabs
:::tab npm
```sh
npx expo install eslint-plugin-react-compiler -- -D
```
:::
:::tab yarn
```sh
yarn expo install eslint-plugin-react-compiler -- -D
```
:::
:::tab pnpm
```sh
pnpm expo install eslint-plugin-react-compiler -- -D
```
:::
:::tab bun
```sh
bun expo install eslint-plugin-react-compiler -- -D
```
:::
:::

更新 [ESLint 配置](/guides/using-eslint)以包含该插件：

```js eslint.config.js
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactCompiler = require('eslint-plugin-react-compiler');

module.exports = defineConfig([
  expoConfig,
  reactCompiler.configs.recommended,
  {
    ignores: ['dist/*'],
  },
]);
```

:::
:::

## 渐进采用

可以用几种策略在应用中渐进采用 React Compiler：

1. 配置 Babel 插件，使其只在特定文件或组件上运行。做法如下：

   1. 如果项目还没有 [**babel.config.js**](/versions/latest/config/babel)，运行 `npx expo customize babel.config.js` 创建一个。
   2. 向 **babel.config.js** 添加以下配置：

```js babel.config.js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          'react-compiler': {
            sources: filename => {
              // 匹配要纳入 React Compiler 的文件名。
              return filename.includes('src/path/to/dir');
            },
          },
        },
      ],
    ],
  };
};
```

每当更改 **babel.config.js** 文件后，需要重启 Metro 打包器以使更改生效：

:::tabs
:::tab npm
```sh
npx expo start --clear
```
:::
:::tab yarn
```sh
yarn expo start --clear
```
:::
:::tab pnpm
```sh
pnpm expo start --clear
```
:::
:::tab bun
```sh
bun expo start --clear
```
:::
:::

2. 使用 `"use no memo"` 指令，让特定组件或文件退出 React Compiler。

```jsx
function MyComponent() {
  'use no memo';

  return <Text>Will not be optimized</Text>;
}
```

## 用法

> 要更好地理解 React Compiler 如何工作，可以查看 [React Playground](https://playground.react.dev/)。

改进主要是自动的。你可以移除 `useCallback`、`useMemo` 和 `React.memo` 的使用，改由自动记忆化处理。类组件不会被优化。请改为迁移到函数组件。

Expo 对 React Compiler 的实现只在应用代码上运行（不包括 node modules），并且只在为客户端打包时运行（服务端渲染中禁用）。

## 配置

可以通过 Babel 配置中的 `react-compiler` 对象，向 React Compiler Babel 插件传递额外设置：

```js babel.config.js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          'react-compiler': {
            // 直接传给 React Compiler Babel 插件。
            compilationMode: 'all',
            panicThreshold: 'all_errors',
          },
          web: {
            'react-compiler': {
              // 仅 Web 的设置...
            },
          },
        },
      ],
    ],
  };
};
```
