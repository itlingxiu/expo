---
title: 使用 ESLint 与 Prettier
description: 了解如何在 Expo 项目中配置 ESLint 与 Prettier。
---

# 使用 ESLint 与 Prettier

[ESLint](https://eslint.org/) 是一个 JavaScript 代码检查器（linter），帮助发现并修复错误，在生产环境之前抓住问题。[Prettier](https://prettier.io/docs/en/) 是一个格式化器（formatter），让所有代码文件保持一致的风格。本页介绍两者的设置与配置。

## ESLint

### 设置

:::note
从 SDK 53 起，默认配置文件使用 **Flat config**；旧版（legacy）配置也受支持。SDK 52 及更早版本默认使用旧版配置，且**不**支持 Flat config。
:::

通过 Expo CLI 安装会拉取依赖，并在项目根目录创建 **eslint.config.js**，继承 `eslint-config-expo`。

```sh
# npm
# Install and configure ESLint
npx expo lint

# yarn
# Install and configure ESLint
yarn expo lint

# pnpm
# Install and configure ESLint
pnpm expo lint

# bun
# Install and configure ESLint
bun expo lint
```

### 用法

:::tip
推荐 VS Code 用户安装 ESLint 扩展，在输入时实时检查代码。
:::

手动检查通过 `npx expo lint` 脚本进行（ESLint 配置完成后，再次运行该命令即可检查你的代码）。它运行 **package.json** 中的 `lint` 脚本。

```sh
# Example output for npx expo lint command

/src/components/hello-wave.tsx
22:6 warning React Hook useEffect has a missing dependency: "rotateAnimation".
Either include it or remove the dependency array react-hooks/exhaustive-deps

✖ 1 problem (0 errors, 1 warning)
```

### 环境配置

ESLint 通常只为一个环境配置，而 Expo 应用的 JavaScript 运行在多种环境中。**app.config.js**、**metro.config.js**、**babel.config.js** 与 **src/app/+html.tsx** 在 Node.js 下运行（因此可以使用 `__dirname` 与 `path` 等模块），而 **src/app/index.js** 等典型应用文件可能运行在 Hermes、Node.js 或浏览器中。声明环境全局变量的方式取决于配置格式。

#### Flat config

得益于 `eslint-config-expo` 的内置支持，**metro.config.js** 已经获得 Node.js 全局变量。其他需要 Node 全局变量的配置文件，应在 **eslint.config.js** 中使用 `languageOptions.globals`：

```js eslint.config.js
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  globalIgnores(['dist/*']),
  expoConfig,
  {
    files: ['babel.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
```

这样设置后，**babel.config.js** 中就可以使用 Node.js 全局变量：

```js babel.config.js
import path from 'path';
const __dirname = path.dirname(__filename);

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

#### 旧版配置

对于旧版配置，在文件顶部的 `eslint-env` 注释告诉 ESLint 该文件运行在哪个环境：

```js metro.config.js
/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(
  __dirname
);

module.exports = config;
```

## Prettier

### 安装

**macOS/Linux**

```sh
# npm
npx expo install prettier eslint-config-prettier eslint-plugin-prettier --dev

# yarn
yarn expo install prettier eslint-config-prettier eslint-plugin-prettier --dev

# pnpm
pnpm expo install prettier eslint-config-prettier eslint-plugin-prettier --dev

# bun
bun expo install prettier eslint-config-prettier eslint-plugin-prettier --dev
```

**Windows**

```sh
# npm
npx expo install prettier eslint-config-prettier eslint-plugin-prettier "--" --dev

# yarn
yarn expo install prettier eslint-config-prettier eslint-plugin-prettier "--" --dev

# pnpm
pnpm expo install prettier eslint-config-prettier eslint-plugin-prettier "--" --dev

# bun
bun expo install prettier eslint-config-prettier eslint-plugin-prettier "--" --dev
```

### 设置

**Flat config**

```js eslint.config.js
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*'],
  },
]);
```

**旧版配置**

```js .eslintrc.js
module.exports = {
  extends: ['expo', 'prettier'],
  ignorePatterns: ['/dist/*'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
```

:::note
如果希望把格式问题显示为警告而不是错误，可以把规则设为 `"prettier/prettier": "warn"`。之后运行 `npx expo lint` 就会标记所有不符合 Prettier 格式的内容。要调整 Prettier 选项，在项目根目录添加 **.prettierrc**。参见[自定义 Prettier 配置](https://github.com/expo/expo/tree/main/packages/eslint-config-universe#customizing-prettier)。
:::

## 故障排查

- **ESLint 没有在 VS Code 中更新** —— 安装 [ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)获得实时检查；通过[命令面板](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)中的 `ESLint: Restart ESLint Server` 重启。
- **ESLint 很慢** —— 减少检查的文件数量来提速；在根目录添加 **.eslintignore**，例如：

```sh .eslintignore
/.expo
node_modules
```

## 迁移到 Flat config

:::note
Flat config 从 Expo SDK 53 起受支持。
:::

升级 ESLint 与 `eslint-config-expo`：

**macOS/Linux**

```sh
# npm
npx expo install eslint eslint-config-expo  --dev

# yarn
yarn expo install eslint eslint-config-expo  --dev

# pnpm
pnpm expo install eslint eslint-config-expo  --dev

# bun
bun expo install eslint eslint-config-expo  --dev
```

**Windows**

```sh
# npm
npx expo install eslint eslint-config-expo "--" --dev

# yarn
yarn expo install eslint eslint-config-expo "--" --dev

# pnpm
pnpm expo install eslint eslint-config-expo "--" --dev

# bun
bun expo install eslint eslint-config-expo "--" --dev
```

如果从未自定义过配置，删除 **.eslintrc.js** 并用 `npx expo lint` 重新生成。否则按照 [ESLint 迁移指南](https://eslint.org/docs/latest/use/configure/migration-guide)迁移。因为 `npx expo lint` 同时接受旧版与 Flat 配置，新配置会被自动采用。
