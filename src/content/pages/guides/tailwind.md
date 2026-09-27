---
title: Tailwind CSS
description: 了解如何在 Expo 项目中配置与使用 Tailwind CSS。
---

# Tailwind CSS

> 标准 Tailwind CSS 仅支持 Web 平台。

[Tailwind CSS](https://tailwindcss.com/) 是一个 utility-first 的 CSS 框架，可用于使用 Metro 的 Web 项目。要进行跨平台开发，参见 [NativeWind](https://www.nativewind.dev/) 或 [Uniwind](https://uniwind.dev/) 等库，它们支持用 Tailwind 为 React Native 组件设置样式。

## 前置条件

### 使用 Metro 的 Web 项目

在 **app.json** 中确认 `web.bundler` 等于 `metro`：

```json app.json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

设置涉及这些文件：`app.json`、`package.json`、`global.css`、`index.js`。

## 配置

按照 [Tailwind PostCSS 文档](https://tailwindcss.com/docs/installation/using-postcss)配置。

### v3

安装 `tailwindcss` 及其 peer 依赖，然后运行 init 命令，在项目根目录生成 **tailwind.config.js** 与 **postcss.config.js**。

```sh
# npm
# Install Tailwind and its peer dependencies
npx expo install tailwindcss@3 postcss autoprefixer --dev

# Create a Tailwind config file
npx tailwindcss init -p

# yarn
# Install Tailwind and its peer dependencies
yarn expo install tailwindcss@3 postcss autoprefixer --dev

# Create a Tailwind config file
yarn dlx tailwindcss init -p

# pnpm
# Install Tailwind and its peer dependencies
pnpm expo install tailwindcss@3 postcss autoprefixer --dev

# Create a Tailwind config file
pnpm dlx tailwindcss init -p

# bun
# Install Tailwind and its peer dependencies
bun expo install tailwindcss@3 postcss autoprefixer --dev

# Create a Tailwind config file
bunx tailwindcss init -p
```

在 **tailwind.config.js** 中添加模板文件路径：

```js tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Ensure this points to your source code
    './src/app/**/*.{js,tsx,ts,jsx}',
    // If you use a `src` directory, add: './src/**/*.{js,tsx,ts,jsx}'
    // Do the same with `components`, `hooks`, `styles`, or any other top-level directories
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

:::note
Expo Router 用户可能更喜欢根 **src** 目录来简化这一步 —— 参见[顶层 src 目录](/router/reference/src-directory)参考。
:::

在项目根目录创建 **global.css**，包含每个 Tailwind 层的指令：

```css global.css
/* This file adds the requisite utility classes for Tailwind to work. */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

在 **src/app/_layout.tsx**（Expo Router）或 **index.js** 中导入它：

```tsx src/app/_layout.tsx
import '../../global.css';
```

```tsx index.js
// Import the global.css file in the index.js file:
import './global.css';
```

:::note
使用 [DOM 组件](/guides/dom-components)时，需要在使用 `"use dom"` 指令的每个模块中添加该导入，因为全局样式不共享。
:::

:::note
始终在根 **_layout.tsx** 中导入全局 CSS，而不是在嵌套布局中。Expo Router 从根布局开始遍历依赖图；在嵌套布局（例如 **app/blog/_layout.tsx**）中导入 CSS 会让 **node_modules** 的 CSS 先于自定义样式加载，破坏预期的样式顺序。
:::

启动项目并使用 Tailwind 类：

```sh
# npm
npx expo start

# yarn
yarn expo start

# pnpm
pnpm expo start

# bun
bun expo start
```

### v4

安装依赖：

```sh
# npm
# Install Tailwind and its peer dependencies
npx expo install tailwindcss @tailwindcss/postcss postcss --dev

# yarn
# Install Tailwind and its peer dependencies
yarn expo install tailwindcss @tailwindcss/postcss postcss --dev

# pnpm
# Install Tailwind and its peer dependencies
pnpm expo install tailwindcss @tailwindcss/postcss postcss --dev

# bun
# Install Tailwind and its peer dependencies
bun expo install tailwindcss @tailwindcss/postcss postcss --dev
```

把 Tailwind 加入 PostCSS 配置：

```js postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

创建一个导入 Tailwind 的全局 CSS 文件（文件名任意；**global.css** 是常见选择）：

```css global.css
@import 'tailwindcss';
```

在 **src/app/_layout.tsx**（Expo Router）或 **index.js** 中导入它：

```tsx src/app/_layout.tsx
// If using Expo Router, import your CSS file in the src/app/_layout.tsx file
import '../../global.css';
```

```tsx index.js
// Otherwise import your CSS file in the index.js file:
import './global.css';
```

:::note
与 v3 相同 —— 在使用 `"use dom"` 指令的每个 DOM 组件模块中添加该导入。
:::

:::note
与 v3 相同 —— 在根 **_layout.tsx** 中导入全局 CSS，而不是嵌套布局，避免 **node_modules** CSS 先于自定义样式加载。
:::

然后启动项目：

```sh
# npm
npx expo start

# yarn
yarn expo start

# pnpm
pnpm expo start

# bun
bun expo start
```

## 用法

Tailwind 可以直接用于 React DOM 元素：

```tsx src/app/index.tsx
export default function Index() {
  return (
    <div className="bg-slate-100 rounded-xl">
      <p className="text-lg font-medium">Welcome to Tailwind</p>
    </div>
  );
}
```

对于 React Native web 元素，使用 `{ $$css: true }` 语法：

```tsx src/app/index.tsx
import { View, Text } from 'react-native';

export default function Index() {
  return (
    <View style={{ $$css: true, _: 'bg-slate-100 rounded-xl' }}>
      <Text style={{ $$css: true, _: 'text-lg font-medium' }}>Welcome to Tailwind</Text>
    </View>
  );
}
```

## 面向 Android 与 iOS 的 Tailwind

Tailwind 不支持 Android/iOS 平台；使用 [NativeWind](https://www.nativewind.dev/) 或 [Uniwind](https://uniwind.dev/) 等兼容库获得通用支持。

### 面向 AI 智能体的 Expo Skills

使用 AI 智能体的读者可以安装 [Expo Skills](/skills) 来教它通用的 Tailwind CSS 设置。

## Android 与 iOS 的替代方案

[DOM 组件](/guides/dom-components)可以在原生端的 `WebView` 中渲染 Tailwind Web 代码：

```tsx src/app/index.tsx
'use dom';

// Remember to import the global.css file in each DOM component.
import '../../global.css';

export default function Page() {
  return (
    <div className="bg-slate-100 rounded-xl">
      <p className="text-lg font-medium">Welcome to Tailwind</p>
    </div>
  );
}
```

## 故障排查

如果 **metro.config.js** 定义了自定义的 `config.cacheStores`，扩展 Expo 的 `FileStore` 超类：

```js metro.config.js
// Import the Expo superclass which has support for PostCSS.
const { FileStore } = require('@expo/metro-config/file-store');

config.cacheStores = [
  new FileStore({
    root: '/path/to/custom/cache',
  }),
];

module.exports = config;
```

同时确认 **metro.config.js** 中没有禁用 CSS：

```js metro.config.js
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Do not disable CSS support when using Tailwind.
  isCSSEnabled: true,
});
```
