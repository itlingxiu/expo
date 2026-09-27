---
title: Metro 打包器
description: 了解可以自定义的各种 Metro 打包器配置。
---

# Metro 打包器

## 概览

Expo CLI 依赖 [Metro](https://metrobundler.dev/) 在 [`npx expo start`](/more/expo-cli#develop) 与 [`npx expo export`](/more/expo-cli#exporting) 期间打包 JS 代码与资源。"Metro 是为 React Native 构建并优化的，用于 Facebook 与 Instagram 等大规模应用。"

## 自定义

自定义通过项目根目录的 **metro.config.js** 文件进行，它导出一个扩展自 [`expo/metro-config`](https://github.com/expo/expo/tree/main/packages/@expo/metro-config) 的 Metro 配置。文档建议导入 `expo/metro-config`（而不是 `@expo/metro-config`）以保证版本一致。用以下命令生成模板：

```sh
# npm
npx expo customize metro.config.js

# yarn
yarn expo customize metro.config.js

# pnpm
pnpm expo customize metro.config.js

# bun
bun expo customize metro.config.js
```

文件如下：

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

更多细节在 [**metro.config.js** 文档](/versions/latest/config/metro)中。

:::note
"Expo 锁定了一些 Metro 配置选项以防止项目损坏。"并非每个上游 Metro 选项都可自定义或受支持，基于 YAML 的 Metro 配置（上游已弃用）或仓库之外的配置不受支持。
:::

## 资源

Metro 把文件视为源代码（JS、TS、JSON 等）或[资源](/develop/user-interface/assets)（图片、字体、未转换的文件）。对于大型代码库，每个扩展名都必须在打包开始前通过 `resolver.sourceExts` 与 `resolver.assetExts` 声明。默认值列于：

- [`resolver.assetExts`](https://github.com/facebook/metro/blob/7028b7f51074f9ceef22258a8643d0f90de2388b/packages/metro-config/src/defaults/defaults.js#L15)
- [`resolver.sourceExts`](https://github.com/facebook/metro/blob/7028b7f51074f9ceef22258a8643d0f90de2388b/packages/metro-config/src/defaults/defaults.js#L53)

### 向 `assetExts` 添加更多文件扩展名

最常见的自定义。把扩展名（不带前导 `.`）添加到 `resolver.assetExts`：

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db'
);

module.exports = config;
```

## 别名

别名把一个导入重定向到另一个模块或文件。因为 Metro 一次为多个平台打包，文档推荐自定义 resolver。示例 —— 把 `old-module` 别名为 `new-module`：

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const ALIASES = {
  'old-module': 'new-module',
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Ensure you call the default resolver.
  return context.resolveRequest(
    context,
    // Use an alias if one exists.
    ALIASES[moduleName] ?? moduleName,
    platform
  );
};

module.exports = config;
```

平台专属别名使用 `platform` 参数：

```js metro.config.js
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // The alias will only be used when bundling for the web.
    return context.resolveRequest(context, ALIASES[moduleName] ?? moduleName, platform);
  }
  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};
```

改动在重启开发服务器后生效；解析从不缓存，无需 `--clear` 标志。基于转换的系统（如 `babel-plugin-module-resolver`）则需要清空缓存。
链接：[自定义 Metro 解析](/versions/latest/config/metro#custom-resolving)。

## 文件监视与爬取

从 **SDK 56** 起，Expo 的文件映射支持按需文件系统访问：`watchFolders` 不再需要列出每个被打包的模块，项目根目录之外的符号链接依赖现在也能正确解析。这由[应用配置](/workflow/configuration)中的 [`experiments.onDemandFilesystem`](/versions/v56.0.0/config/app#ondemandfilesystem) 标志控制，默认启用。
链接：[按需文件系统](/versions/v56.0.0/config/metro#on-demand-filesystem)。

## Bundle 拆分

Expo CLI 自动按异步导入拆分 bundle（仅 Web），并可以与 Expo Router 配合按 **app** 目录中的路由文件拆分，只加载当前路由所需的内容。参见[异步路由](/router/web/async-routes)。

## Tree shaking

链接：[Tree shaking](/guides/tree-shaking) —— Expo CLI 如何优化生产 JavaScript bundle。

## 压缩

链接：[压缩 JavaScript](/guides/minify) —— 用 Metro 自定义 Expo CLI 中的 JS 压缩。

## Web 支持

Expo CLI 可以用 Metro 打包网站 —— 与原生应用相同的通用打包器，也是 Web 项目推荐的选择。

### Expo webpack 与 Expo Metro

对于之前用已弃用的 `@expo/webpack-adapter` 构建的站点，参见[迁移指南](/router/migrate/from-expo-webpack)与[对比图](/router/migrate/from-expo-webpack#expo-cli)。

### 为 Metro 添加 Web 支持

通过[应用配置](/workflow/configuration)中的 `expo.web.bundler` 字段启用：

```json app.json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

#### 开发

启动开发服务器：

```sh
# npm
npx expo start --web

# yarn
yarn expo start --web

# pnpm
pnpm expo start --web

# bun
bun expo start --web
```

或者，在 Expo CLI 终端 UI 中按 `W`。

#### 静态文件

Metro 的 Expo 实现从根 **public/** 目录提供静态文件，与其他 Web 框架类似。使用 `npx expo export` 时，**public** 的内容会复制到 **dist/**，因此应用可以相对主机 URL 获取这些资源（例如 **public/favicon.ico**）。自定义的 **public/index.html** 会覆盖 Metro Web 的默认 **index.html**。最终这应该通过 EAS Update 托管跨平台工作；目前它仅限 Web，基于原生应用使用的静态主机（旧版 Expo 服务更新不支持它）。

:::note
某些路径（例如 `/assets`）被 Metro 保留。避免在 **public/assets/** 或其他保留路径中放文件；完整列表见[保留路径](/router/reference/reserved-paths)。
:::

## TypeScript

Expo 的 Metro 配置支持 **tsconfig.json**（或 **jsconfig.json**）中的 `compilerOptions.paths` 与 `compilerOptions.baseUrl`，支持绝对导入与别名。参见 [TypeScript](/guides/typescript) 指南。[现有 React Native 项目](/bare/overview)需要额外设置；参见 [Metro 设置指南](/versions/latest/config/metro#existing-react-native-apps)。

## CSS

链接：[Metro Web CSS 指南](/versions/latest/config/metro#css) —— 在 Expo CLI 与 Metro 打包的网站中使用 CSS。
