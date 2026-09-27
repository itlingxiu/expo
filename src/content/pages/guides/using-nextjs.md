---
title: 在 Web 上把 Next.js 与 Expo 一起使用
description: 在 Web 上将 Next.js 与 Expo 集成的指南。
---

# 在 Web 上把 Next.js 与 Expo 一起使用

:::warning
使用 Next.js 并不是 Expo 通用应用开发工作流的官方组成部分。
:::

[Next.js](https://nextjs.org/) 是一个 React 框架，提供简单的基于页面的路由以及服务端渲染。要让 Next.js 与 Expo SDK 一起使用，我们建议使用 [`@expo/next-adapter`](https://github.com/expo/expo-cli/tree/main/packages/next-adapter) 库来处理配置。

把 Expo 与 Next.js 一起使用，意味着你可以在移动应用和 Web 应用之间共享部分现有组件和 API。Next.js 有自己的 CLI，开发 Web 平台时需要使用它，因此**你需要用 Next.js CLI 启动 Web 项目，而不是用 `npx expo start`**。

> Next.js 只能与 Expo 的 Web 一起使用，因为原生应用不支持服务端渲染（SSR）。

## 自动设置

要快速开始，使用 [with-nextjs](https://github.com/expo/examples/tree/master/with-nextjs) 模板创建新项目：

:::tabs
:::tab npm
```sh
npx create-expo-app -e with-nextjs
```
:::
:::tab yarn
```sh
yarn create expo-app -e with-nextjs
```
:::
:::tab pnpm
```sh
pnpm create expo-app -e with-nextjs
```
:::
:::tab bun
```sh
bun create expo -e with-nextjs
```
:::
:::

- **原生**：`npx expo start` —— 启动 Expo 项目
- **Web**：`npx next dev` —— 启动 Next.js 项目

## 手动设置

### 安装依赖

确保项目中已安装 `expo`、`next`、`@expo/next-adapter`：

:::tabs
:::tab npm
```sh
npm install expo next @expo/next-adapter
```
:::
:::tab yarn
```sh
yarn add expo next @expo/next-adapter
```
:::
:::tab pnpm
```sh
pnpm add expo next @expo/next-adapter
```
:::
:::tab bun
```sh
bun add expo next @expo/next-adapter
```
:::
:::

### 转译

配置 Next.js 以转换语言特性：

<details>
<summary>使用 SWC 的 Next.js。（推荐）</summary>

推荐使用带 SWC 的 Next.js。可以把 [**babel.config.js**](/versions/latest/config/babel) 配置为只照顾原生：

```js babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

还需要通过向 **next.config.js** 添加以下内容来[强制 Next.js 使用 SWC](https://nextjs.org/docs/messages/swc-disabled)：

```js next.config.js
module.exports = {
  experimental: {
    forceSwcTransforms: true,
  },
};
```

</details>

<details>
<summary>使用 Babel 的 Next.js。（不推荐）</summary>

调整 **babel.config.js**，在用 webpack 为 Web 打包时有条件地添加 `next/babel`：

```js babel.config.js
module.exports = function (api) {
  // 检测 Web 用法（如果 Next.js 更改加载器，这将来可能会变）
  const isWeb = api.caller(
    caller =>
      caller && (caller.name === 'babel-loader' || caller.name === 'next-babel-turbo-loader')
  );
  return {
    presets: [
      // 只在浏览器中使用 next，否则会破坏原生项目
      isWeb && require('next/babel'),
      'babel-preset-expo',
    ].filter(Boolean),
  };
};
```

</details>

### Next.js 配置

向 **next.config.js** 添加以下内容：

```js next.config.js
const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  // transpilePackages 是 Next.js +13.1 的特性。
  // 更早的版本可以使用 next-transpile-modules
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    // 在这里添加更多 React Native/Expo 包...
  ],
});
```

完整的 Next.js 配置可能如下：

```js next.config.js
const { withExpo } = require('@expo/next-adapter');

/** @type {import('next').NextConfig} */
const nextConfig = withExpo({
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    // 在这里添加更多 React Native/Expo 包...
  ],
  experimental: {
    forceSwcTransforms: true,
  },
});

module.exports = nextConfig;
```

### React Native Web 样式

`react-native-web` 包建立在重置 CSS 样式的假设之上。下面是在 Next.js 中使用 **pages** 目录重置样式的方法。

```jsx pages/_document.js
import { Children } from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { AppRegistry } from 'react-native';

// 遵循 react-native-web 的设置：
// https://necolas.github.io/react-native-web/docs/setup/#root-element
// 另外为各种浏览器补充 React Native 的滚动与文本一致性样式。
// 强制 Next 生成的 DOM 元素填满父元素高度
const style = `
html, body, #__next {
  -webkit-overflow-scrolling: touch;
}
#__next {
  display: flex;
  flex-direction: column;
  height: 100%;
}
html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}
body {
  /* 允许滚动到视口以下；默认值是 visible */
  overflow-y: auto;
  overscroll-behavior-y: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -ms-overflow-style: scrollbar;
}
`;

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }) {
    AppRegistry.registerComponent('main', () => Main);
    const { getStyleElement } = AppRegistry.getApplication('main');
    const page = await renderPage();
    const styles = [
      <style key="react-native-style" dangerouslySetInnerHTML={{ __html: style }} />,
      getStyleElement(),
    ];
    return { ...page, styles: Children.toArray(styles) };
  }

  render() {
    return (
      <Html style={{ height: '100%' }}>
        <Head />
        <body style={{ height: '100%', overflow: 'hidden' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

```jsx pages/_app.js
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
```

## 转译模块

默认情况下，React Native 生态中的模块不会被转译以在 Web 浏览器中运行。React Native 依赖 Metro 中的高级缓存来快速重载。Next.js 使用 webpack，它没有同等水平的缓存，因此默认不会转译任何 node module。你必须用 **next.config.js** 中的 `transpilePackages` 选项，手动标记每一个想要转译的模块：

```js next.config.js
const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  experimental: {
    transpilePackages: [
      // 注意：即使 Next.js 中从未使用 `react-native`，
      // 也需要列出 `react-native`，因为 `react-native-web`
      // 被别名为 `react-native`。
      'react-native',
      'react-native-web',
      'expo',
      // 在这里添加更多 React Native/Expo 包...
    ],
  },
});
```

## 部署到 Vercel

这是 Vercel 首选的、把 Next.js 项目部署到生产环境的方法。

1. 向 **package.json** 添加 `build` 脚本：

```json package.json
{
  "scripts": {
    "build": "next build"
  }
}
```

2. 安装 Vercel CLI：

:::tabs
:::tab npm
```sh
npm install --global vercel
```
:::
:::tab yarn
```sh
yarn global add vercel
```
:::
:::tab pnpm
```sh
pnpm add --global vercel
```
:::
:::tab bun
```sh
bun add --global vercel
```
:::
:::

3. 部署到 Vercel：

```sh
vercel
```

## 与默认 Expo for Web 相比的限制或差异

使用 Next.js 做 Web 意味着你会用 Next.js 的 webpack 配置打包。这会导致开发应用与开发网站的方式存在一些核心差异。

- Expo Next.js 适配器不支持实验性的 **app** 目录。
- 对于原生上基于文件的路由，我们建议使用 [Expo Router](https://github.com/expo/router)。

## 贡献

如果你希望帮助改进 Expo 中的 Next.js 支持，欢迎提交 PR 或 issue：

- [@expo/next-adapter](https://github.com/expo/expo-cli/tree/main/packages/next-adapter)

## 故障排除

### 不能在模块外部使用 import 语句

找出哪一个模块含有 import 语句，并把它添加到 **next.config.js** 的 `transpilePackages` 选项中：

```js next.config.js
const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  experimental: {
    transpilePackages: [
      'react-native',
      'react-native-web',
      'expo',
      // 在这里添加失败的包，并重启服务器...
    ],
  },
});
```
