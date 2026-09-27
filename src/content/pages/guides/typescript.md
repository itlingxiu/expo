---
title: 使用 TypeScript
description: 了解如何配置 TypeScript 支持，或把现有 JavaScript 项目迁移到 TypeScript。
---

# 使用 TypeScript

Expo 对 TypeScript 有一等支持；Expo SDK 的 JavaScript 接口就是用 TypeScript 编写的。本指南涵盖创建新项目与迁移现有 JavaScript 项目。

## 快速开始

对于新项目，使用默认模板，它自带基础 TypeScript 配置、示例代码与基本导航结构：

```sh
# npm
npx create-expo-app@latest

# yarn
yarn create expo-app

# pnpm
pnpm create expo-app

# bun
bun create expo
```

之后参考：

- [设置你的环境](/get-started/set-up-your-environment) —— 本地开发环境的必需步骤。
- [开始开发](/get-started/start-developing) —— 如何启动开发服务器、文件结构与其他特性。

## 迁移现有 JavaScript 项目

### 把文件重命名为 .tsx 或 .ts 扩展名

把文件重命名为 TypeScript，从根组件开始（例如 **App.js** → **App.tsx**）：

```sh
mv App.js App.tsx
```

:::tip
文件包含 React 组件（JSX）时使用 **.tsx**；否则 **.ts** 即可。
:::

### 安装必需的开发依赖

把 `typescript` 与 `@types/react` 安装为 `devDependencies`：

**macOS/Linux**

```sh
# npm
npx expo install typescript @types/react --dev

# yarn
yarn expo install typescript @types/react --dev

# pnpm
pnpm expo install typescript @types/react --dev

# bun
bun expo install typescript @types/react --dev
```

**Windows**

```sh
# npm
npx expo install typescript @types/react "--" --dev

# yarn
yarn expo install typescript @types/react "--" --dev

# pnpm
pnpm expo install typescript @types/react "--" --dev

# bun
bun expo install typescript @types/react "--" --dev
```

:::note
或者，运行 `npx expo start` 也会安装 `typescript` 与 `@types/react` 开发依赖。
:::

**用 tsc 检查项目文件** —— 在项目根目录运行 `tsc`：

```sh
# npm
npm run tsc

# yarn
yarn run tsc

# pnpm
pnpm run tsc

# bun
bun run tsc
```

### 用 tsconfig.json 添加基础配置

默认情况下，项目的 **tsconfig.json** 应继承 `expo/tsconfig.base`。用以下命令生成：

```sh
# npm
npx expo customize tsconfig.json

# yarn
yarn expo customize tsconfig.json

# pnpm
pnpm expo customize tsconfig.json

# bun
bun expo customize tsconfig.json
```

默认设置对用户友好、易于采纳。想要更严格的检查与更少的运行时错误，在 [`compilerOptions`](https://www.typescriptlang.org/docs/handbook/compiler-options.html) 下启用 `strict`：

```json tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

### 路径别名（可选）

Expo CLI 自动支持 **tsconfig.json** 中定义的[路径别名](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)，让你通过自定义别名而不是相对路径导入模块。例如，把 `@/*` 映射到 **src**，即可把 **src/components/Button.tsx** 导入为 **@/components/Button**：

```json tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**禁用路径别名** —— `tsconfigPaths` 默认开启；可以在项目的[应用配置](/workflow/configuration)中关闭：

```json app.json
{
  "expo": {
    "experiments": {
      "tsconfigPaths": false
    }
  }
}
```

**注意事项**

- 修改 **tsconfig.json** 后重启 Expo CLI；无需清空 Metro 缓存。
- 没有 TypeScript 时，**jsconfig.json** 是替代方案。
- 定义的别名会增加解析时间。
- 只有 Metro（包括 Metro web）支持别名 —— 已弃用的 `@expo/webpack-config` 不支持。
- [现有 React Native 项目](/bare/overview)需要额外设置；参见 [Metro 设置指南](/versions/latest/config/metro)。

### 绝对导入（可选）

在 **tsconfig.json** 中设置 [`compilerOptions.baseUrl`](https://www.typescriptlang.org/docs/handbook/module-resolution.html#base-url)，即可从项目根目录导入：

```json tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "baseUrl": "./"
  }
}
```

这样可以从 **src/components/Button** 导入 `Button`：

```tsx
import Button from 'src/components/Button';
```

**注意事项**

- 设置后，`compilerOptions.paths` 相对于 `baseUrl` 解析；未设置时相对于项目根目录。
- `baseUrl` 先于 node_modules 解析，因此本地 `./path.ts` 可能遮蔽名为 `path` 的模块。
- 修改 `baseUrl` 后重启 Expo CLI。
- 没有 TypeScript 时，**jsconfig.json** 是替代方案。
- 只有 Metro（包括 Metro web）支持此功能，`@expo/webpack-config` 不支持。
- 现有 React Native 项目需要额外设置；参见 [Metro 设置指南](/versions/latest/config/metro)。

## 类型生成

某些 Expo 库提供静态类型与类型生成。这些类型会在构建时自动创建，也可以通过运行 `npx expo customize tsconfig.json` 生成。

## 项目配置文件的 TypeScript 支持

**metro.config.js** 或 **app.config.js** 这样的配置文件需要额外设置。把 [`tsx`](https://tsx.is/) 安装为开发依赖，并使用它的 [`tsx/cjs` require hook](https://tsx.is/dev-api/entry-point#commonjs-mode-only)，让 JS 配置可以导入 TypeScript，同时根文件保持 JavaScript。

**macOS/Linux**

```sh
# npm
npx expo install tsx --dev

# yarn
yarn expo install tsx --dev

# pnpm
pnpm expo install tsx --dev

# bun
bun expo install tsx --dev
```

**Windows**

```sh
# npm
npx expo install tsx "--" --dev

# yarn
yarn expo install tsx "--" --dev

# pnpm
pnpm expo install tsx "--" --dev

# bun
bun expo install tsx "--" --dev
```

### metro.config.js

更新 **metro.config.js**，让它引用 **metro.config.ts** 文件：

```js metro.config.js
require('tsx/cjs'); // Add this to import TypeScript files
module.exports = require('./metro.config.ts');
```

然后把你的 Metro 配置放在 **metro.config.ts** 中：

```ts metro.config.ts
import { getDefaultConfig } from 'expo/metro-config';

const config = getDefaultConfig(__dirname);

module.exports = config;
```

#### 已弃用：webpack.config.js

安装 `@expo/webpack-config` 包。

```js webpack.config.js
require('tsx/cjs'); // Add this to import TypeScript files
module.exports = require('./webpack.config.ts');
```

```ts webpack.config.ts
import createExpoWebpackConfigAsync from '@expo/webpack-config/webpack';
import { Arguments, Environment } from '@expo/webpack-config/webpack/types';

module.exports = async function (env: Environment, argv: Arguments) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  return config;
};
```

### app.config.js

**app.config.ts** 默认可用，但它不支持外部 TypeScript 模块或 **tsconfig.json** 自定义。要更完整的 TypeScript 设置：

```ts app.config.ts
import 'tsx/cjs'; // Add this to import TypeScript files
import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'my-app',
  slug: 'my-app',
};

export default config;
```

## 其他 TypeScript 特性

一些语言特性需要额外配置 —— 例如装饰器（decorators）需要 `experimentalDecorators` 选项。可用选项见 [TypeScript 编译器选项](https://www.typescriptlang.org/docs/handbook/compiler-options.html)参考。

## 学习如何使用 TypeScript

推荐从官方的 [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) 入手。对于 React 组件中的 TypeScript，Expo 推荐 [React TypeScript CheatSheet](https://github.com/typescript-cheatsheets/react)，了解常见场景下的组件类型写法。
