---
title: 安装
description: 了解如何将 Expo Router 手动安装到现有项目中。
---

# 安装

如果你已有项目，请按照以下步骤操作；新建项目请使用[快速开始](/router/introduction#quick-start)。

## 前置条件

### 配置开发环境

你的电脑需要先配置好可以运行 Expo 应用的环境，参见[创建项目](/get-started/create-a-project)。

## 安装依赖

使用 Expo 的安装器安装版本兼容的库：

```sh
# npm
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# yarn
yarn expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# pnpm
pnpm expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# bun
bun expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

该命令会安装与 SDK 版本兼容的依赖。

## 设置入口文件

将 `main` 字段设置为 `expo-router/entry`。第一个加载的客户端文件是根布局（Root Layout）：使用 `src` 目录时是 `src/app/_layout.tsx`（参见 [src 目录](/router/reference/src-directory)），不使用 `src` 时是 `app/_layout.tsx`（参见[根布局](/router/basics/navigation-layouts#root-layout)）。

```json package.json
{
  "main": "expo-router/entry"
}
```

### 自定义入口文件：初始化并加载副作用

自定义入口文件可以在根布局加载之前执行副作用。常见场景：

- 初始化全局服务，例如分析、错误上报等。
- 设置 polyfill。
- 使用 `react-native` 的 `LogBox` 忽略特定日志。

步骤如下：

1. 在根目录创建一个入口文件，例如 `index.js`：

```
.
├── src
│   └── app
│       └── _layout.tsx
├── index.js
├── package.json
└── Other project files
```

2. 添加你的配置，然后导入 `expo-router/entry`——把它放在最后，确保渲染前配置已就绪：

```js index.js
// Import side effects first and services
// Initialize services
// Register app entry through Expo Router
import 'expo-router/entry';
```

3. 将 `package.json` 中的 `main` 指向新入口文件：

```json package.json
{
  "main": "index.js"
}
```

## 修改项目配置

在应用配置中添加深度链接的 `scheme`，并开启[类型化路由](/router/reference/typed-routes)：

```json app.json
{
  "scheme": "your-app-scheme",
  "experiments": {
    "typedRoutes": true
  }
}
```

Web 端还需要安装 `react-native-web` 和 `react-dom`：

```sh
# npm
npx expo install react-native-web react-dom

# yarn
yarn expo install react-native-web react-dom

# pnpm
pnpm expo install react-native-web react-dom

# bun
bun expo install react-native-web react-dom
```

然后在应用配置中启用 Metro Web（参见[为 Metro 添加 Web 支持](/guides/customizing-metro#adding-web-support-to-metro)）：

```json app.json
{
  "web": {
    "bundler": "metro"
  }
}
```

更多配置选项参见[应用配置](/workflow/configuration)。

## 修改 babel.config.js

如果项目中存在 `babel.config.js`，必须将 `babel-preset-expo` 设为 preset；如果不需要自定义 Babel 配置，可以直接删除该文件。

```js babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

## 配置路径别名

如果使用 [src 目录](/router/reference/src-directory)，可以在 `tsconfig.json` 中配置路径别名，以便使用 `@/components/button` 这样的短路径导入：

```json tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

上面的示例中，`@/*` 别名指向 `src` 目录。

## 清除打包器缓存

修改配置后，需要清除打包器缓存：

```sh
# npm
npx expo start --clear

# yarn
yarn expo start --clear

# pnpm
pnpm expo start --clear

# bun
bun expo start --clear
```

## 更新 resolutions

从旧版 Expo Router 升级时，请移除 `package.json` 中过时的 Yarn resolutions 或 npm overrides——具体是 `metro`、`metro-resolver` 与 `react-refresh`。
