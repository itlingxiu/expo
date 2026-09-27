---
title: 用应用配置进行配置
description: 了解 app.json、app.config.js、app.config.ts 文件是什么，以及如何动态自定义和使用它们。
---

# 用应用配置进行配置

> 如果你是从旧链接来到本页，完整 schema 见[应用配置参考](/versions/latest/config/app)。

应用配置（**app.json**、**app.config.js**、**app.config.ts**）用于配置 [Expo 预构建](/more/glossary-of-terms#预构建)的生成、项目在 [Expo Go](/get-started/set-up-your-environment) 中如何加载，以及 OTA 更新清单。

它必须位于项目根目录，与 **package.json** 并列。下面是一个最小示例：

```json app.json
{
  "name": "My app",
  "slug": "my-app"
}
```

如果 Expo 配置有顶层 `expo: {}` 对象，则会用它代替根对象，并忽略所有其他键。

- [应用配置 schema 参考](/versions/latest/config/app)：探索应用配置（app.json / app.config.js）的完整 schema。

## 属性

应用配置会配置许多内容，例如应用名称、图标、启动画面、深层链接 scheme、某些服务要使用的 API 密钥等。可用属性的完整列表参见 [app.json / app.config.js / app.config.ts 参考](/versions/latest/config/app)。

:::note
你使用 Visual Studio Code 吗？如果是，建议安装 [Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools) 扩展，以便在 **app.json** 文件中获得属性自动补全。
:::

## 在应用中读取配置值

应用配置中的大部分配置都可以在运行时从 JavaScript 代码通过 [`Constants.expoConfig`](/versions/latest/sdk/constants#nativeconstants) 访问。你**不应**在应用配置中包含任何敏感信息（下面列出的、会被过滤掉的少数字段除外）。

你可以运行 `npx expo config --type public` 来验证哪些配置会嵌入构建/更新，并在运行时可用。

<details>
<summary>公共应用配置会过滤掉哪些字段？</summary>

以下字段会从公共应用配置中过滤掉（并且不能通过 `Constants.expoConfig` 对象访问）：

- [`ios.config`](/versions/latest/config/app#config)
- [`android.config`](/versions/latest/config/app#config-2)
- [`updates.codeSigningCertificate`](/versions/latest/config/app#codesigningcertificate)
- [`updates.codeSigningMetadata`](/versions/latest/config/app#codesigningmetadata)

</details>

:::warning
你也应避免在 JavaScript 代码中直接导入 **app.json** 或 **app.config.js**，因为这会导入整个文件，而不是处理后的版本。请改用 [`Constants.expoConfig`](/versions/latest/sdk/constants#nativeconstants) 访问配置。
:::

## 扩展配置

库作者可以使用 [Expo 配置插件](/config-plugins/introduction)扩展应用配置。

:::note
配置插件主要用于配置 [`npx expo prebuild`](/more/glossary-of-terms#预构建) 命令。
:::

## 动态配置

若要更多自定义，可以使用 JavaScript（**app.config.js**）或 [TypeScript](#使用-typescript-进行配置用-appconfigts-代替-appconfigjs)（**app.config.ts**）。这些配置具有以下特性：

- 注释、变量和单引号。
- **app.config.js** 和 **app.config.ts** 都支持 ESM `import` 语法，包括导入其他 JavaScript 文件。
- TypeScript 支持（**app.config.ts**），包括空值合并和可选链。导入其他 TypeScript 文件或自定义语言特性需要 [`tsx`](/guides/typescript#appconfigjs)。
- 每当 Metro 打包器重新加载时都会更新。
- 向应用提供环境信息。
- 不支持 Promise。

:::note
**说明**：**app.config.mts**、**app.config.cts**、**app.config.mjs** 和 **app.config.cjs** 文件也会被发现。默认情况下，配置会被转译为 CommonJS，`.js` 和 `.ts` 文件都可以混合 ESM 和 CommonJS 语法。当这种混合导致 import 或 require 问题时，使用其中一种显式扩展名，把配置锁定为单一模块格式。
:::

例如，你可以导出一个对象来定义自定义配置：

```js app.config.js
const myValue = 'My App';

module.exports = {
  name: myValue,
  version: process.env.MY_CUSTOM_PROJECT_VERSION || '1.0.0',
  // extra 中的所有值都会传给你的应用。
  extra: {
    fact: 'kittens are cool',
  },
};
```

`"extra"` 键允许把任意配置数据传给应用。该键的值通过 [`expo-constants`](/versions/latest/sdk/constants) 访问：

```js App.js
import Constants from 'expo-constants';

Constants.expoConfig.extra.fact === 'kittens are cool';
```

你可以导出一个返回对象的函数，来访问和修改传入的配置值。如果你的项目还有 **app.json**，这会很有用。默认情况下，Expo CLI 会先读取 **app.json**，并把规范化后的结果传给 **app.config.js**。

例如，**app.json** 可以是这样：

```json app.json
{
  "name": "My App"
}
```

在 **app.config.js** 中，导出函数的参数里会提供该配置：

```js app.config.js
module.exports = ({ config }) => {
  console.log(config.name); // 打印 'My App'
  return {
    ...config,
  };
};
```

### 根据环境切换配置

在开发、预发布和生产环境中使用一些不同的配置，或完全换掉配置来做白标应用，是常见需求。为此可以把 **app.config.js** 与环境变量一起使用。

```js app.config.js
module.exports = () => {
  if (process.env.MY_ENVIRONMENT === 'production') {
    return {
      /* 你的生产配置 */
    };
  } else {
    return {
      /* 你的开发配置 */
    };
  }
};
```

要把此配置用于 Expo CLI 命令，可以为特定命令设置环境变量，或在 shell 配置文件中设置。要为特定命令设置环境变量，按示例所示在命令前加上变量和值：

```sh
$ MY_ENVIRONMENT=production eas update
```

这并不是 Expo CLI 独有的。在 Windows 上，可以用下面的命令近似实现：

:::tabs
:::tab npm
```sh
$ npx cross-env MY_ENVIRONMENT=production eas update
```
:::
:::tab yarn
```sh
$ yarn dlx cross-env MY_ENVIRONMENT=production eas update
```
:::
:::tab pnpm
```sh
$ pnpm dlx cross-env MY_ENVIRONMENT=production eas update
```
:::
:::tab bun
```sh
$ bunx cross-env MY_ENVIRONMENT=production eas update
```
:::
:::

你也可以使用任何你熟悉的其他环境变量机制。

### 使用 TypeScript 进行配置：用 app.config.ts 代替 app.config.js

你可以在 TypeScript 的 Expo 配置中使用自动补全和文档注释块。创建包含以下内容的 **app.config.ts**：

```ts app.config.ts
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: 'my-app',
  name: 'My App',
});
```

要把其他 TypeScript 文件导入 **app.config.ts**，或自定义语言特性，我们建议使用 [`tsx`](/guides/typescript#appconfigjs)。`tsx` 还允许在被 **app.config.ts** 导入的任何文件中使用 `import` 语法。这意味着你可以用完整的语言特性用 TypeScript 编写本地[配置插件](/config-plugins/introduction)。

### 配置解析规则

配置有两种：静态（**app.config.json**、**app.json**）和动态（**app.config.js**、**app.config.ts**）。静态配置可以用 CLI 工具自动更新，动态配置必须由开发者手动更新。

1. 如果存在 **app.config.json**，则读取静态配置（否则回退到 **app.json**）。如果不存在静态配置，则从 **package.json** 和你的依赖推断默认值。
2. 如果存在 **app.config.ts** 或 **app.config.js**，则读取动态配置。如果两者都存在，则使用 TypeScript 配置。
3. 如果动态配置返回一个函数，则把静态配置以 `({ config }) => ({})` 的形式传给该函数。该函数随后可以改变静态配置的值。可以把它看成静态配置的中间件。
4. 动态配置的返回值用作最终配置。它不能包含任何 promise。
5. 配置中的所有函数都会在 Expo 生态中的任何工具使用它之前被求值并序列化。托管时，配置必须是 JSON 清单。
6. 如果最终配置对象有顶层 `expo: {}` 对象，则会用它代替根对象，并忽略所有其他键。

运行 `npx expo config` 会显示解析完成后 Expo CLI 将使用的最终配置。
