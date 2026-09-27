---
title: Babel 配置参考
description: Babel 配置文件（babel.config.js）的参考说明。
---

# Babel 配置参考

Babel 是 JavaScript 编译器，将现代 ES6+ 代码转换为与移动设备上的 JavaScript 引擎兼容的版本。

使用 `npx create-expo-app` 创建的新项目都会自动配置好 Babel，默认预设（preset）为 [`babel-preset-expo`](https://github.com/expo/expo/tree/main/packages/babel-preset-expo)。除非需要自定义 Babel 配置，否则无需编写 **babel.config.js** 文件。

## 创建 babel.config.js

如需自定义配置，必须自行创建该文件，步骤如下：

1. 在项目根目录下，运行以下命令 —— 这会在项目根目录生成 **babel.config.js**：

```sh
npx expo customize babel.config.js
```

2. 生成的文件包含以下默认配置：

```js babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

3. 编辑该文件后，必须重启 Metro 才能使更改生效，并使用 CLI 的 `--clear` 选项清除打包器缓存：

```sh
npx expo start --clear
```

## babel-preset-expo

[`babel-preset-expo`](https://github.com/expo/expo/tree/main/packages/babel-preset-expo) 是 Expo 项目默认使用的预设。它在 React Native 的 [`@react-native/babel-preset`](https://www.npmjs.com/package/@react-native/babel-preset) 基础上，添加了对装饰器（decorators）、Web 库摇树优化（tree-shaking）以及字体图标加载的支持。
