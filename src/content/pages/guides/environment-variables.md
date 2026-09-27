---
title: 环境变量
description: 了解如何在 Expo 项目中读取与配置环境变量。
---

# 环境变量

环境变量是在源代码之外设置的键值对，让应用可以按环境表现出不同行为 —— 例如在测试构建中启用功能，或在生产环境中指向不同的 API 端点。

每当你使用 Expo CLI（例如 `npx expo start` 进行本地开发）时，它都会自动从 **.env** 文件加载以 `EXPO_PUBLIC_` 为前缀的变量，供 JavaScript 使用。

## 从 .env 文件读取环境变量

在项目根目录创建 **.env**，行格式为 `EXPO_PUBLIC_[NAME]=VALUE`：

```bash .env
EXPO_PUBLIC_API_URL=https://staging.example.com
EXPO_PUBLIC_API_KEY=abc123
```

然后在源码中直接使用：

```tsx
import { Button } from 'react-native';

function Post() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  async function onPress() {
    await fetch(apiUrl, { ... })
  }

  return <Button onPress={onPress} title="Post" />;
}
```

运行 `npx expo start` 时，应用 bundle 中的 `process.env.EXPO_PUBLIC_API_URL` 会被替换为 `https://staging.example.com`。变量可以在不重启 CLI、不清缓存的情况下编辑；需要完整重载（摇一摇后在 Expo Go 或开发构建中按 Reload）才能看到更新后的值。

:::warning
不要把敏感信息（例如私钥）放在 `EXPO_PUBLIC_` 变量中。这些变量会以明文形式出现在你编译后的应用中。
:::

### 变量是如何加载的

Expo CLI 按照[标准 .env 文件解析规则](https://github.com/bkeepers/dotenv/blob/c6e583a/README.md#what-other-env-files-can-i-use)加载 **.env** 文件，然后把代码中对 `process.env.EXPO_PUBLIC_[VARNAME]` 的引用替换为这些文件中的值。出于安全考虑，**node_modules** 中的代码被排除在外。

### 如何读取环境变量

- ✓ 每个变量都必须以点号形式静态引用为 `process.env` 的属性，才会被内联 —— 例如 `process.env.EXPO_PUBLIC_KEY`。
- ✗ 不支持其他形式：`process.env['EXPO_PUBLIC_KEY']` 以及 `const {EXPO_PUBLIC_X} = process.env` 这样的解构都不会被内联。

### 使用多个 .env 文件定义不同环境

任何[标准 .env 文件](https://github.com/bkeepers/dotenv/blob/c6e583a/README.md#what-other-env-files-can-i-use)都可以使用，所以 **.env** 与 **.env.local** 都有效，并按标准优先级加载。默认的 **.env** 可以提交到版本库，但 **.env.local** 通常应加入 **.gitignore**，因为它存放机器相关的配置（例如本地服务器的网络 IP）。

```bash .gitignore
.env*.local
```

#### 环境变量与 `NODE_ENV`

`NODE_ENV` 是标准的 Node.js 变量，标识运行模式（`development`、`production` 或 `test`），模块解析器、打包器与测试运行器都会读取它。

文档不建议用 `NODE_ENV` 来切换 **.env** 文件（比如 **.env.test** / **.env.production**）。虽然 `NODE_ENV=test npx expo start` 会加载 **.env.test**，但行为可能不符合预期：`npx expo export` 总是强制把 `NODE_ENV` 设为 `production`，所以 `NODE_ENV=test npx expo export` 实际上并不是以 `test` 模式运行。基于 Expo CLI 的工具也是如此 —— `eas update` 会调用 `npx expo export`，因此 `NODE_ENV=test eas update` 同样以 production 运行。由于许多工具以各种方式使用 `NODE_ENV`（例如 `NODE_ENV=production npm install` 会跳过 devDependencies），文档建议 React Native 项目不要让它承担过多职责。

使用 EAS 时，可以考虑 `eas env:pull`，它会用所选环境的内容替换你的 **.env.local**，而不依赖 `NODE_ENV`。不用 EAS 时，可以写一个脚本，用期望的内容覆盖 **.env.local** 或 **.env**。

### 禁用环境变量

环境变量分两部分，都可以禁用：

1. Expo CLI 把 **.env** 文件加载进全局 process。在任何 Expo CLI 命令前设置 `EXPO_NO_DOTENV=1` 可禁用。
2. Expo 的 Metro 配置把环境变量内联进客户端 JavaScript bundle。用 `EXPO_NO_CLIENT_ENV_VARS=1` 禁用。

如果环境变量出现异常，试着禁用其中一个或两个。

## Expo Application Services 中的环境变量

### [EAS Build](/build/introduction)

EAS Build 使用 Metro Bundler 创建嵌入二进制的 JS bundle，因此随构建作业上传的 **.env** 文件会被用来内联 `EXPO_PUBLIC_` 变量。变量也可以在 **eas.json** 的构建配置中定义，或通过 EAS Secrets 定义。参见[环境变量与构建密钥](/eas/environment-variables)。

### [EAS Update](/eas-update/introduction)

EAS Update 在你本地环境或 CI 中使用 Metro，因此可用的 **.env** 文件会内联 `EXPO_PUBLIC_` 变量。参见[在 EAS Update 中使用环境变量](/eas/environment-variables/usage)。

## 迁移到 Expo 环境变量

### 从 react-native-config 迁移

给 JavaScript 中使用的变量加上 `EXPO_PUBLIC_` 前缀：

```diff .env
- API_URL=https://myapi.com
+ EXPO_PUBLIC_API_URL=https://myapi.com
```

:::note
非标准 **.env** 文件（例如 **.env.staging**）必须迁移到某个[标准 .env 文件](https://github.com/bkeepers/dotenv/blob/c6e583a/README.md#what-other-env-files-can-i-use)。
:::

更新代码，使用 `process.env.EXPO_PUBLIC_[VARNAME]`：

```diff
- import Config from 'react-native-config';

- const apiUrl = Config.API_URL;
+ const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

### 从 babel-plugin-transform-inline-environment-variables 迁移

这个 Babel 插件的方式与 Expo 类似。把变量放进 **.env** 并加上 `EXPO_PUBLIC_` 前缀重命名：

```diff
- const apiUrl = process.env.API_URL;
+ const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

然后从 [Babel 配置](/versions/latest/config/babel)中移除该插件：

```diff babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
--    plugins: ['transform-inline-environment-variables'],
  };
};
```

更新 Babel 配置后，用 `npx expo start --clear` 清空缓存。

### 从 direnv 迁移

把 JavaScript 使用的变量从 **.envrc** 移到 **.env**，加上 `EXPO_PUBLIC_` 前缀。以前你需要一个[动态应用配置](/workflow/configuration)读取 [`process.env`](https://nodejs.org/dist/latest/docs/api/process.html#process_process_env) 来填充 `extra`，再通过 [`expo-constants`](/versions/latest/sdk/constants) 使用。现在可以直接引用变量：

```diff
- import Constants from 'expo-constants';

- const apiUrl = Constants.expoConfig.extra.apiUrl;
+ const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

:::note
[`direnv`](https://direnv.net/) 会根据当前目录加载与卸载 shell 环境变量，因此它会影响在那里运行的任何进程，不只是 Expo CLI。对于 JavaScript 代码中不使用的其他变量，你可能还是想继续使用 `direnv`。
:::

## 安全注意事项

永远不要把敏感机密放在以 `EXPO_PUBLIC_` 为前缀的变量中。当最终用户运行你的应用时，所有代码与内嵌的环境变量对他们都是可访问的。更多内容见 React Native 文档的[存储敏感信息](https://reactnative.dev/docs/security#storing-sensitive-info)。
