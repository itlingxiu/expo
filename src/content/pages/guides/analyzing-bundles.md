---
title: 使用 Expo Atlas 和 Lighthouse 分析 JavaScript bundle
description: 了解如何使用 Expo Atlas 和 Lighthouse 优化 Expo 应用和网站的生产 JavaScript bundle 大小。
---

# 使用 Expo Atlas 和 Lighthouse 分析 JavaScript bundle

不同平台的 bundle 性能各不相同。例如，Web 浏览器不支持预编译字节码，因此 JavaScript bundle 的大小对于缩短启动时间和提升性能非常重要。bundle 越小，下载和解析的速度就越快。

## 使用 Expo Atlas 分析 bundle 大小

![Expo Atlas 概览页面](/static/images/atlas/atlas-overview.avif)

项目中使用的库会影响生产 JavaScript bundle 的大小。你可以使用 [Expo Atlas](https://github.com/expo/expo-atlas#readme) 来可视化生产 bundle，并找出哪些库影响了 bundle 大小。

### 配合 `npx expo start` 使用 Atlas

你可以将 Expo Atlas 与本地开发服务器一起使用。这样，每当你修改项目中的任何代码时，Atlas 都会随之更新。

当你的应用通过本地开发服务器在 Android、iOS 和/或 Web 上运行后，你可以按 Shift + M，通过[开发工具插件菜单](/debugging/devtools-plugins#using-a-dev-tools-plugin)打开 Atlas。

```sh
# npm
# 启动带 Atlas 的本地开发服务器
$ EXPO_ATLAS=true npx expo start

# yarn
# 启动带 Atlas 的本地开发服务器
$ EXPO_ATLAS=true yarn expo start

# pnpm
# 启动带 Atlas 的本地开发服务器
$ EXPO_ATLAS=true pnpm expo start

# bun
# 启动带 Atlas 的本地开发服务器
$ EXPO_ATLAS=true bun expo start
```

#### 将开发模式切换为生产模式

默认情况下，Expo 以[开发模式](/workflow/development-mode#development-mode)启动本地开发服务器。开发模式会禁用一些在[生产模式](/workflow/development-mode#production-mode)下启用的优化。你也可以以生产模式启动本地开发服务器，从而更准确地了解生产 bundle 的大小：

```sh
# npm
# 以生产模式运行本地开发服务器
$ EXPO_ATLAS=true npx expo start --no-dev

# yarn
# 以生产模式运行本地开发服务器
$ EXPO_ATLAS=true yarn expo start --no-dev

# pnpm
# 以生产模式运行本地开发服务器
$ EXPO_ATLAS=true pnpm expo start --no-dev

# bun
# 以生产模式运行本地开发服务器
$ EXPO_ATLAS=true bun expo start --no-dev
```

### 配合 `npx expo export` 使用 Expo Atlas

在生成应用或 EAS Update 的生产 bundle 时，你也可以使用 Expo Atlas。Atlas 会在导出过程中生成一个 **.expo/atlas.jsonl** 文件，你可以在无法访问项目的情况下分享和打开它。该文件包含每个被打包模块的原始代码和转换后的代码，包括内联的 [`EXPO_PUBLIC_` 环境变量](/guides/environment-variables)的值。请像对待源代码一样对待它，只与信任的人分享。

```sh
# npm
# 为所有平台导出你的应用
$ EXPO_ATLAS=true npx expo export

# 打开生成的 Expo Atlas 文件
$ npx expo-atlas .expo/atlas.jsonl

# yarn
# 为所有平台导出你的应用
$ EXPO_ATLAS=true yarn expo export

# 打开生成的 Expo Atlas 文件
$ yarn dlx expo-atlas .expo/atlas.jsonl

# pnpm
# 为所有平台导出你的应用
$ EXPO_ATLAS=true pnpm expo export

# 打开生成的 Expo Atlas 文件
$ pnpm dlx expo-atlas .expo/atlas.jsonl

# bun
# 为所有平台导出你的应用
$ EXPO_ATLAS=true bun expo export

# 打开生成的 Expo Atlas 文件
$ bunx expo-atlas .expo/atlas.jsonl
```

你还可以使用 `--platform` 选项指定要分析的平台。Expo Atlas 只会收集所导出平台的数据。

### 分析转换后的模块

![Expo Atlas 模块页面](/static/images/atlas/atlas-module.avif)

在 Atlas 中，你可以按住 ⌘ Cmd 并点击图中的节点来查看转换后的模块详情。此功能可以帮助你了解模块是如何被 Babel 转换的、它导入了哪些模块，以及哪些模块导入了它。这可以用来追溯模块在整个依赖图中的来源。

## 使用 source-map-explorer 分析 bundle 大小

> 适用于 **SDK 50 及更早版本**的替代方法。

如果你使用的是 SDK 50 或更低版本，可以使用 [`source-map-explorer`](https://www.npmjs.com/package/source-map-explorer) 库来可视化和分析生产 JavaScript bundle。

1. 要使用 source map explorer，请运行以下命令进行安装：

   ```sh
   # npm
   $ npm install --save-dev source-map-explorer

   # yarn
   $ yarn add --dev source-map-explorer

   # pnpm
   $ pnpm add --save-dev source-map-explorer

   # bun
   $ bun add --dev source-map-explorer
   ```

2. 在 **package.json** 中添加一个脚本来运行它。根据你使用的平台或 SDK，你可能需要调整输入路径。为简洁起见，以下示例假设项目使用 Expo SDK 50，并且不使用 Expo Router 的 `server` 输出。

   ```json package.json
   {
     "scripts": {
       "analyze:web": "source-map-explorer 'dist/_expo/static/js/web/*.js' 'dist/_expo/static/js/web/*.js.map'",
       "analyze:ios": "source-map-explorer 'dist/_expo/static/js/ios/*.js' 'dist/_expo/static/js/ios/*.js.map'",
       "analyze:android": "source-map-explorer 'dist/_expo/static/js/android/*.js' 'dist/_expo/static/js/android/*.js.map'"
     }
   }
   ```

   如果你使用的是 SDK 50 的 `server` Web 输出，则使用以下命令来映射 Web bundle：

   ```sh
   # npm
   $ npx source-map-explorer 'dist/client/_expo/static/js/web/*.js' 'dist/client/_expo/static/js/web/*.js.map'

   # yarn
   $ yarn dlx source-map-explorer 'dist/client/_expo/static/js/web/*.js' 'dist/client/_expo/static/js/web/*.js.map'

   # pnpm
   $ pnpm dlx source-map-explorer 'dist/client/_expo/static/js/web/*.js' 'dist/client/_expo/static/js/web/*.js.map'

   # bun
   $ bunx source-map-explorer 'dist/client/_expo/static/js/web/*.js' 'dist/client/_expo/static/js/web/*.js.map'
   ```

   Web bundle 会输出到 **dist/client** 子目录，以防止服务器端代码暴露给客户端。

3. 导出你的生产 JavaScript bundle，并加上 `--source-maps` 标志，以便 source map explorer 能够读取 source map。对于使用 Hermes 的原生应用，可以使用 `--no-bytecode` 选项禁用字节码生成。

   ```sh
   # npm
   $ npx expo export --source-maps --platform web

   # 使用 Hermes 的原生应用可以禁用字节码，以便分析 JavaScript bundle。
   $ npx expo export --source-maps --platform ios --no-bytecode

   # yarn
   $ yarn expo export --source-maps --platform web

   # 使用 Hermes 的原生应用可以禁用字节码，以便分析 JavaScript bundle。
   $ yarn expo export --source-maps --platform ios --no-bytecode

   # pnpm
   $ pnpm expo export --source-maps --platform web

   # 使用 Hermes 的原生应用可以禁用字节码，以便分析 JavaScript bundle。
   $ pnpm expo export --source-maps --platform ios --no-bytecode

   # bun
   $ bun expo export --source-maps --platform web

   # 使用 Hermes 的原生应用可以禁用字节码，以便分析 JavaScript bundle。
   $ bun expo export --source-maps --platform ios --no-bytecode
   ```

   此命令会在输出中显示 JavaScript bundle 和 source map 的路径。在下一步中，你需要将这些路径传给 source map explorer。

   > 避免将 source map 发布到生产环境，因为它们既可能引发安全问题，也可能引发性能问题（浏览器会下载这些大型 map 文件）。

4. 运行脚本以分析你的 bundle：

   ```sh
   # npm
   $ npm run analyze:web

   # yarn
   $ yarn run analyze:web

   # pnpm
   $ pnpm run analyze:web

   # bun
   $ bun run analyze:web
   ```

   运行此命令时，你可能会看到以下错误：

   ```text
   You must provide the URL of lib/mappings.wasm by calling SourceMapConsumer.initialize({ 'lib/mappings.wasm': ... }) before using SourceMapConsumer
   ```

   这很可能是由于 `source-map-explorer` 在 Node.js 18 及以上版本中的一个[已知问题](https://github.com/danvk/source-map-explorer/issues/247)。要解决此问题，请在运行 analyze 脚本之前设置环境变量 `NODE_OPTIONS=--no-experimental-fetch`。

你可能会遇到类似 `Unable to map 809/13787 bytes (5.87%)` 的警告。这是因为 source map 通常会排除打包器运行时的定义（例如 `__d(() => {}, [])`）。这个数值是恒定的，无需担心。

## Lighthouse

Lighthouse 是了解你的网站速度、可访问性和性能的好方法。你可以使用 Chrome 中的 **Audit** 选项卡来测试你的项目，也可以使用 [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse#using-the-node-cli)。

先用 `npx expo export -p web` 创建生产构建并部署它（使用 `npx serve dist`、生产部署或自定义服务器），然后使用你网站托管的 URL 运行 Lighthouse。

```sh
# npm
# 安装 lighthouse CLI
$ npm install --global lighthouse

# 为你的网站运行 lighthouse CLI
$ npx lighthouse <url> --view

# yarn
# 安装 lighthouse CLI
$ yarn global add lighthouse

# 为你的网站运行 lighthouse CLI
$ yarn dlx lighthouse <url> --view

# pnpm
# 安装 lighthouse CLI
$ pnpm add --global lighthouse

# 为你的网站运行 lighthouse CLI
$ pnpm dlx lighthouse <url> --view

# bun
# 安装 lighthouse CLI
$ bun add --global lighthouse

# 为你的网站运行 lighthouse CLI
$ bunx lighthouse <url> --view
```
