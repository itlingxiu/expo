---
title: Metro 配置参考
description: Metro 配置（metro.config.js）中可用配置项的参考说明。
---

# Metro 配置参考

本页面是 Metro 中可用配置的参考。有关更深入的信息，请参阅[自定义 Metro](/guides/customizing-metro)指南；上游 Metro 选项请参见 [Metro 文档](https://metrobundler.dev/docs/configuration)。

## 环境变量

Expo CLI 可以从 `.env` 文件读取环境变量；用法见[环境变量](/guides/environment-variables)指南。EAS CLI 使用自己的机制，除非它调用 Expo CLI 进行编译和打包。

迁移过来的旧项目应将本地环境变量文件排除在 git 之外，在 **.gitignore** 中添加：

```text .gitignore
# local env files
.env*.local
```

**禁用 dotenv 文件：** 在任何 Expo CLI 命令执行之前设置 `EXPO_NO_DOTENV`，可以完全关闭 dotenv 文件的加载。

:::tabs
:::tab 所有用户
```sh
npx cross-env EXPO_NO_DOTENV=1 expo start
```
:::
:::tab macOS/Linux
```sh
EXPO_NO_DOTENV=1 npx expo start
```
:::
:::

**禁用 `EXPO_PUBLIC_` 客户端变量：** 以 `EXPO_PUBLIC_` 为前缀的变量会在构建时暴露到应用中，例如 `EXPO_PUBLIC_API_KEY` 可通过 `process.env.EXPO_PUBLIC_API_KEY` 访问。在任何打包发生之前定义 `EXPO_NO_CLIENT_ENV_VARS=1`，可以关闭该内联行为。

:::tabs
:::tab 所有用户
```sh
npx cross-env EXPO_NO_CLIENT_ENV_VARS=1 expo start
```
:::
:::tab macOS/Linux
```sh
EXPO_NO_CLIENT_ENV_VARS=1 npx expo start
```
:::
:::

## CSS

:::note
CSS 支持正在开发中，目前仅在 Web 上可用。
:::

Expo 接受从任意组件导入 CSS，并支持 CSS Modules。该功能默认开启；可以在 Metro 配置中通过 `isCSSEnabled` 关闭它：

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname, {
  // 禁用 CSS 支持。
  isCSSEnabled: false,
});

module.exports = config;
```

### 全局 CSS

:::warning
全局样式仅限 Web；在原生端使用它们会导致你的应用在视觉上与 Web 产生差异。
:::

从组件导入的样式表会应用到整个页面。例如，以下 CSS 定义了一个类：

```css App.css
.container {
  background-color: red;
}
```

在一个组件中，可以在 Web 上通过 React DOM 的 `className` 使用它，也可以在 React Native 上通过传入带 `$$css: true` 的 `style` 对象使用它：

```tsx App.tsx
import './App.css';

// Web 与原生
<View style={{ $$css: true, _: 'container' }} />

// 仅 Web
<div className="container" />
```

库中自带的样式表可以像任意 node 模块一样导入，应用到整个应用：

```ts
import 'emoji-mart/css/emoji-mart.css';
```

在原生端，所有全局样式表都会被静默丢弃。热重载可用 —— 保存文件即可应用更改。

使用 Expo Router 时，全局 CSS 应放在根 **\_layout.tsx** 中。因为 Expo Router 从根布局遍历依赖图，在嵌套布局中导入 CSS 会让 **node_modules** 中的 CSS 先于你自己的样式加载，可能破坏预期的样式顺序。

### CSS Modules

:::note
用于原生端的 CSS Modules 正在开发中，目前仅在 Web 上可用。
:::

CSS Modules 将样式限定在单个组件内，避免命名冲突。文件使用 `.module.css` 扩展名；默认导出是一个将类名映射到 Web 限定作用域名称的对象，`unstable_styles` 则提供 `react-native-web` 安全的样式：

```css App.module.css
.text {
  color: red;
}
```

```tsx App.tsx
import styles, { unstable_styles } from './App.module.css';

// 仅 Web
<p className={styles.text} />
// Web 与原生
<Text style={unstable_styles.text} />
```

- 支持平台扩展名：`module.ios.css` 与 `module.android.css` 可按平台不同，导入时不带扩展名。反过来写（如 `App.ios.module.css`）则无效，会得到一个名为 `App.ios.module` 的通用模块。
- 样式不能通过 `className` 传给 React Native 或 React Native for web 组件，必须使用 `style` 属性。
- 在 Web 上所有 CSS 值都可用；CSS 不会像 React Native Web 的 `StyleSheet` API 那样被处理或自动加前缀，可以用 `postcss.config.js` 处理自动前缀。CSS Modules 内部依赖 lightningcss，不支持的功能请跟踪该项目的 issue。

### PostCSS

[PostCSS](https://github.com/postcss/postcss) 通过在项目根目录放置 **postcss.config.json** 进行自定义，它应导出一个返回 PostCSS 配置对象的函数。例如：

```json postcss.config.json
{
  "plugins": {
    "tailwindcss": {}
  }
}
```

`postcss.config.json` 和 `postcss.config.js` 都可以使用，但 JSON 变体支持更好的缓存。Expo CLI 会使用内置的 [browserslist](https://browsersl.ist/) 支持自行应用 CSS 厂商前缀，因此再添加 `autoprefixer` 只会重复工作并拖慢打包。

更改 PostCSS 或 browserslist 设置后，需要清除 Metro 缓存：`npx expo start --clear` 或 `npx expo export --clear`。

### browserslist

package.json 中的 [browserslist](https://browsersl.ist/) 字段可以自定义厂商前缀和浏览器目标；通过基于 Rust 的 CSS 解析器自动获得支持。示例值：

```json package.json
{
  "browserslist": [">0.2%", "not dead", "not op_mini all"]
}
```

### SASS

对 SCSS/SASS 的支持是部分的。安装 `sass`（例如 `yarn add -D sass`）并确保在 **metro.config.js** 中配置了 CSS。存在 `sass` 时，不带扩展名的模块按 `scss`、`sass`、`css` 的顺序解析。在 sass 文件中只使用与之匹配的语法；在 scss/sass 文件内部导入其他文件目前尚不支持。

### Tailwind

:::note
标准 Tailwind CSS 仅限 Web；要获得通用支持，请参考 [NativeWind](https://www.nativewind.dev/) 或 [Uniwind](https://uniwind.dev/) 等库，它们允许你用 Tailwind 构建带样式的 React Native 组件。
:::

在 Expo 项目中配置 Tailwind 的完整说明见 [Tailwind 指南](/guides/tailwind)。

## 扩展 Babel 转换器

Expo 的 Metro 配置设置了自定义的 `transformer.babelTransformerPath`，以确保始终使用 `expo-babel-preset` 并支持 Web/Node.js 环境。

要扩展它，请从 `@expo/metro-config/babel-transformer` 导入上游转换器，而不是 `metro-react-native-babel-transformer`：

```js transformer.js
const upstreamTransformer = require('@expo/metro-config/babel-transformer');

module.exports.transform = async ({ src, filename, options }) => {
  if (filename.endsWith('.svg')) {
    // 自定义逻辑
    src = '...';
  }
  return upstreamTransformer.transform({ src, filename, options });
};
```

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve('./transformer');

module.exports = config;
```

## 自定义解析

Expo CLI 在 Metro 的默认解析器之上扩展了 Web、Server 与 tsconfig 别名支持。你可以通过链式包装 `config.resolver.resolveRequest` 来自定义解析：

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('my-custom-resolver:')) {
    // 自定义解析逻辑
    return {
      filePath: 'path/to/file',
      type: 'sourceFile',
    };
  }

  // 没有解析结果时抛错。
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
```

- 回调接收 `(context, moduleName, platform)` 三个参数。
- Metro 在所有平台间共享同一个解析器函数，因此可以通过 `context` 对象按请求动态修改解析。

### Mock 模块

返回 `{ type: 'empty' }` 可以让某个模块在特定平台上为空。例如：

```js metro.config.js
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'lodash') {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};
```

这类似于 Webpack 或 Vite 中的空 externals，但可以按平台分别指定。

### 虚拟模块

Metro 不支持虚拟模块，变通办法是生成一个真实模块（例如放在 `node_modules/.cache/virtual/` 下），并将解析重定向到它：

```js metro.config.js
const path = require('path');
const fs = require('fs');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'virtual:my-module') {
    const virtualPath = path.join(
      __dirname,
      'node_modules',
      '.cache',
      'virtual',
      'virtual-module.js'
    );
    fs.mkdirSync(path.dirname(virtualPath), { recursive: true });
    fs.writeFileSync(virtualPath, 'export default "Hello World";');
    return { filePath: virtualPath, type: 'sourceFile' };
  }
  return context.resolveRequest(context, moduleName, platform);
};
```

这个模式可以模拟 `externals` 的自定义导入 —— 例如把 `require('expo')` 重定向为类似 `SystemJS.require('expo')` 的调用。

## 自定义转换

转换会被大量缓存，因此更改后请使用 `--clear`（例如 `npx expo start --clear`）。Metro 缺少富有表现力的插件系统，因此自定义通过 **babel.config.js** 与 caller 对象完成。

在 `api.caller(callback)` 内可以访问以下 caller 输入：

- **platform** —— Expo CLI 正在为哪个平台转换；示例默认 `'ios'`。
- **engine** —— `'hermes'` 或 `undefined`，表示打包是否以 Hermes 为目标。
- **isServer** —— 打包是否针对服务器环境（如 API Routes）；默认 `false`。
- **isDev** —— 是否为开发构建；示例回退到检查 `BABEL_ENV`/`NODE_ENV` 是否为 `'development'`。

由于配置会被缓存，示例调用了 `api.cache(false)`；更稳健的失效方式是 `api.cache.invalidate(() => platform)`：

```js babel.config.js
module.exports = function (api) {
  const platform = api.caller(caller => caller?.platform) ?? 'ios';
  const engine = api.caller(caller => caller?.engine);
  const isServer = api.caller(caller => caller?.isServer) ?? false;
  const isDev = api.caller(caller => caller?.isDev) ?? process.env.BABEL_ENV === 'development';

  api.cache.invalidate(() => platform);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 仅在 Web 平台包含某个插件
      platform === 'web' && 'your-web-only-plugin',
    ].filter(Boolean),
  };
};
```

- 尽可能在解析器中实现自定义逻辑，因为「缓存要简单得多，也更容易推理」。
- 通过解析器把一个导入重映射到静态文件，比在转换器中解析并重写导入更简单、更快。
- 始终使用 `babel-preset-expo` 作为默认预设，因为它会在内部利用 caller 输入针对平台、引擎与环境进行优化。

## 按需文件系统

Expo 使用 `metro-file-map` 的一个分支 `@expo/metro-file-map` 来发现、监视并惰性解析源文件。

- Metro 通常在启动时预爬取 `watchFolders` 中的每个目录 —— 在 monorepo 中意味着每个 workspace 都会被爬取。
- 借助按需文件系统访问，文件映射可以在解析器请求 `watchFolders` 之外的文件时惰性读取它们。这样你可以安全地减少 `watchFolders` 条目，用文件监视覆盖范围换取更快的启动速度，同时不会破坏延伸到项目根目录之外的导入。
- 它还允许符号链接解析到 monorepo 根目录之外，从而支持 Bun、pnpm 等包管理器使用的 pnpm 风格全局虚拟存储（Global Virtual Store）。

该功能默认开启。可以在应用配置中将 `experiments.onDemandFilesystem` 设为 `false` 来禁用它：

```json app.json
{
  "expo": {
    "experiments": {
      "onDemandFilesystem": false
    }
  }
}
```

## Node.js 内置模块

为服务器目标打包时，Expo 的 Metro 配置会根据当前运行的 Node 版本，把 Node 内置模块（`fs`、`path`、`node:crypto` 等）外部化。为浏览器打包时顺序不同：Metro 先检查模块是否本地存在，不存在则回退到一个空 shim。例如安装了 `path` 后，浏览器构建会使用它；否则该模块会被跳过。

## 注入的环境设置

> 这些环境变量不会在测试环境中定义。

Expo 的 Metro 配置会把构建设置作为环境变量内联进客户端 bundle。它们在构建时内联，无法动态访问 —— `process.env["EXPO_BASE_URL"]` 这样的写法不会生效。

- `process.env.EXPO_BASE_URL` —— 暴露 `experiments.baseUrl` 中的基础 URL，Expo Router 用它来遵循生产部署的基础路径。

## Web bundle 拆分

在生产环境中，Expo CLI 会按照异步导入拆分 Web bundle。这需要安装 `@expo/metro-runtime` 并在入口 bundle 中的某处导入它（Expo Router 默认提供）。「异步 bundle 的共享依赖会合并到一个 chunk 中，以减少请求数量。」例如两个异步 bundle 都导入了 `lodash`，就会为这个库生成一个初始 chunk。chunk 拆分的启发式规则无法自定义。

```js math.js
export function add(a, b) {
  return a + b;
}
```

```js index.js
import '@expo/metro-runtime';
import('./math').then(({ add }) => {
  console.log(add(1, 2));
});
```

上面的动态导入会成为一个单独的 chunk。运行 `npx expo export -p web` 会生成多个文件，入口 bundle 由主 HTML 引用；`@expo/metro-runtime` 提供加载并执行异步 bundle 的运行时。

## 源码映射 Debug ID

当导出的 bundle 带有外部源码映射时，会在文件末尾追加一个 Debug ID 注释，并在源码映射中记录匹配的 `debugId`，以便将二者关联起来。如果没有导出源码映射或使用内联源码映射，则不会添加任何内容。注释形式为代码末尾的 `//# debugId=<确定性 chunk 哈希>`。

配套的 `.js.map` 或 `.hbc.map` JSON 携带等价的 `debugId`。它在 Hermes 字节码生成之前注入，因此在所有情况下都能匹配。该值是对 bundle 内容（排除外部 bundle 拆分引用）的确定性哈希，与 chunk 文件名使用相同的值，但渲染为 UUID 形式。`@expo/metro-config` 会在 `npx expo export` 与 `npx expo export:embed` 期间注入它；`export:embed` 中的任何额外优化（例如 Hermes 字节码生成）都必须自行注入 `debugId`。

## EXPO_USE_METRO_REQUIRE

设置 `EXPO_USE_METRO_REQUIRE=1` 可以启用自定义的 Metro `require` 运行时，它具有三个特性：可读的字符串模块 ID，让缺失模块错误更容易排查；跨运行与模块稳定的确定性 ID（这是开发环境中 React Server Components 的要求）；并移除了对旧式 RAM bundle 的支持。

## 魔术导入注释

自 SDK 52 起在所有平台可用。类服务器环境（Workers、Node.js）可以在运行时导入文件，因此你可能希望保留 `import` 语法，而不是被转换成 Metro 的 require 系统。在 `import()` 调用中放置 `/* @metro-ignore */` 注释即可退出依赖处理：

```js
await import(/* @metro-ignore */ './file');
```

Expo CLI 随后会跳过该依赖，并假定开发者已将其放置在输出 bundle 的合适位置；内部依赖这一点来支持按请求选择文件的自定义服务器代码。原生 bundle 不建议使用，因为启用 Hermes 时通常没有 `import()`。Webpack 的 `/* webpackIgnore: true */` 也受支持，但推荐使用 Metro 的等价写法。

## ES Module 解析与 package.json:exports

自 SDK 53 起，在所有平台上，Metro 对 ES Module 的 `import` 与 CommonJS 的 `require` 使用不同的解析策略。旧式方法遵循 Node 12 之前的经典解析加上 ES Module 补充，从 `node_modules` 与 JS 文件解析，可选省略扩展名，并参考 `main`、`module` 与 `react-native` 字段。现代方法从 `node_modules` 解析，并匹配 `exports`（包暴露的子路径的嵌套映射）与 `main` 等字段。

应用哪种策略取决于文件的导入方式：来自 Node 模块的 `import` 通常使用 ES Module 解析并回退到经典解析；任何未以此方式解析的，或经由 `require` 到达的，都使用经典解析。

在 ES Module 解析下，Metro 读取 `package.json:exports` 条件映射。只暴露索引文件的包可以使用 `default` 条件；CJS/ESM 双格式包可以把 `import` 与 `require` 映射到不同文件。匹配的条件因平台以及解析是否始于 `require` 或 `import` 而异：原生端添加 `react-native`，Web 添加 `browser`，服务器目标（API routes、React Server functions）添加 `node`、`react-server` 与 `workerd`。条件不是按定义顺序匹配的 —— 匹配遵循 exports 映射中属性的顺序。

TypeScript 单独解析，当 `compilerOptions.moduleResolution` 为 `"bundler"`（与 Metro 最接近）或 `"node16"`/`"nodenext"` 时也遵循 exports 映射，但它还会额外匹配 `types`，因此如果 `types` 没有列在前面，类型可能解析失败。

由于 exports 映射可以包含子路径，导入可能被重定向：如果映射另有说明，`'package/submodule'` 不必对应 `node_modules/package/submodule.js`。当某个包与新策略不兼容时，一种选择是修补它的 `package.json:exports`；另一种是在 Metro 配置中关闭该行为（基于 `getDefaultConfig(__dirname)` 构建）：

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;

module.exports = config;
```

## 资源导入

导入资源会创建一个描述使用它所需数据的虚拟模块。在原生端，结果是一个数字 ID（`1`、`2`、`3`……），可通过 `require("@react-native/assets-registry/registry").getAssetByID(<NUMBER>)` 解析。在 Web 与服务器端，形状取决于文件类型：图片变成带有 `uri` 与可选 `width`/`height` 的对象，其他资源变成保存远程 URL 的字符串。自 SDK 55 起，在 Web 上 `String(asset)` 会得到公开 URL，但 React Server Component 环境除外（那里不能有 `toString` 函数）。

在 API routes 中可以依赖资源永远不是数字这一事实：

```ts app/icon+api.ts
import icon from './assets/icon.png';

export async function GET(request: Request) {
  const image = await fetch(new URL(icon.uri, request.url)).then(res => res.arrayBuffer());
  return new Response(image, { headers: { 'Content-Type': 'image/png' } });
}
```

## Web Worker

:::warning
Worker 支持是 alpha 状态，可能发生破坏性变更。
:::

API 为 `new Worker(new URL('./worker', window.location.href))`。支持是实验性的且仅限 Web；在原生端使用会报错（`Worker` 不存在）。Worker 可以把图片处理或加密等昂贵操作移出主线程。

虽然基于 `Blob` 的内联 Worker 也能工作，但 Metro 的这个功能让你可以使用 TypeScript 或导入模块。它依赖 Expo 的 bundle 拆分，因此必须使用 Expo Router 或导入 `@expo/metro-runtime`，并且与 `EXPO_NO_METRO_LAZY=1` 不兼容。Worker 可以在处理 `self.onmessage` 后通过 `self.postMessage` 回传结果：

```js worker.js
self.onmessage = event => {
  self.postMessage('Hello from worker!');
};
```

在幕后，Expo CLI 会生成一个指向类似 `/worker.bundle?platform=web&dev=true&etc` 的 bundle URL 的 `Worker`，随开发/生产环境而不同。与普通拆分不同，Worker 必须捆绑每个模块自己的副本，不能共享主 bundle 的模块。`Worker` API 不是 React Native 或 Expo SDK 提供的，因此该功能实际上只在 Web 上有用；原生端的替代方案是 polyfill 模块或 Reanimated worklets。

你也可以绕过转换：把一个已转换的 JS 文件放在 `public` 中并引用它，`new Worker('/worker.js')` 可以工作；在 URL 形式中使用变量会破坏转换，因此使用字面量路径。`Worker` 构造函数中的变量不支持打包。要查看内部 URL，`require.unstable_resolveWorker('./path/to/worker.js')` 会返回 URL 片段。

## 现有 React Native 应用

以下指导按版本划分，升级/降级时需要重新审视；Expo Prebuild 是自动化的替代方案。非 Prebuild 项目必须更改原生文件，让 Expo 的 Metro 配置始终打包项目，用 `npx expo export:embed` / `npx expo start` 取代 `npx react-native bundle` / `start`。

### metro.config.js

必须扩展 `expo/metro-config`：从 `'expo/metro-config'` 引入 `getDefaultConfig`，用 `__dirname` 调用它，并导出生成的配置：

```js metro.config.js
// 了解更多：https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

### android/app/build.gradle

必须修改该文件的 `react` 配置对象，让 Expo CLI 处理生产打包。

### ios/<Project>.xcodeproj/project.pbxproj

需要两处脚本修改：

- 移除 **Start Packager** 脚本。「开发服务器必须在运行应用之前/之后用 `npx expo` 启动。」
- 在 **Bundle React Native code and images** 构建阶段应用相应修改。可以设置 `CLI_PATH`、`BUNDLE_COMMAND` 与 `ENTRY_FILE` 来覆盖默认值。

### 自定义入口文件

React Native 通常要求根目录的 `index.js`（或平台变体如 `index.ios.js`）；Expo 允许任意入口文件，但 bare 项目需要额外设置。在开发环境中，可以通过 `expo-dev-client` 包或特定配置启用自定义入口文件。在生产环境中，替换 `project.pbxproj` 中的 **Bundle React Native code and images** 脚本，使 `$ENTRY_FILE` 使用 Metro 设置，并修改 `app/build.gradle` 中的 `react` 配置对象，让 Metro 的模块解析定位到根入口文件。
