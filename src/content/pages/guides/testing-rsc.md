---
title: 测试 React Server Components
description: 了解如何为 Expo 中的 React Server Components 编写单元测试。
---

# 测试 React Server Components

> 支持平台：Android、iOS、Web。

:::note
本指南涉及仍在开发中的[实验性](/more/release-statuses#experimental)特性 React Server Components。
:::

React Server Components（RSC）是 React 中的新特性，允许构建在服务器上渲染、并可在客户端水合的组件。本指南说明如何在项目中为 RSC 编写单元测试。

## Jest 测试

React Server Components 运行在 Node.js 上。这意味着 Jest 本身就能较好地模拟服务端渲染环境，与需要 Jest preset 在 Node.js 和浏览器之间通信的客户端测试不同。

### 设置

标准服务端渲染仅面向 Web，而 Expo 的通用 RSC 会为每个平台打包自定义服务端渲染器。这意味着支持特定平台的文件扩展名。例如，为 iOS 应用编写 Server Components 时，会解析 **\*.ios.js** 和 **\*.native.ts** 等平台特定扩展名。

`jest-expo` 为测试 Server Components 提供几种不同的 preset：

| 运行器 | 说明 |
| --- | --- |
| `jest-expo/rsc/android` | 仅 Android 的 RSC 运行器。使用 **\*.android.js**、**\*.native.js** 和 **\*.js** 文件。 |
| `jest-expo/rsc/ios` | 仅 iOS 的 RSC 运行器。使用 **\*.ios.js**、**\*.native.js** 和 **\*.js** 文件。 |
| `jest-expo/rsc/web` | 仅 Web 的 RSC 运行器。使用 **\*.web.js** 和 **\*.js** 文件。 |
| `jest-expo/rsc` | 组合上述运行器的多运行器。 |

要为 RSC 配置 Jest，在项目根目录创建 **jest-rsc.config.js** 文件：

```js jest-rsc.config.js
module.exports = require('jest-expo/rsc/jest-preset');
```

然后可以在 **package.json** 中添加 `test:rsc` 之类的脚本：

```json package.json
{
  "scripts": {
    "test:rsc": "jest --config jest-rsc.config.js"
  }
}
```

### 编写测试

测试应写在 **\_\_rsc_tests\_\_** 目录中，以防止 Jest 在服务器上运行客户端测试。

```tsx __rsc_tests__/my-component.test.ts
/// <reference types="jest-expo/rsc/expect" />

import { LinearGradient } from 'expo-linear-gradient';

it(`renders to RSC`, async () => {
  const jsx = (
    <LinearGradient
      colors={['cyan', '#ff00ff', 'rgba(0,0,0,0)', 'rgba(0,255,255,0.5)']}
      testID="gradient"
    />
  );

  await expect(jsx).toMatchFlight(`1:I["src/LinearGradient.tsx",[],"LinearGradient"]
0:["$","$L1",null,{"colors":["cyan","#ff00ff","rgba(0,0,0,0)","rgba(0,255,255,0.5)"],"testID":"gradient"},null]`);
});
```

测试文件中导入的任何代码都会在服务器环境中运行。你可以导入 `react-server` 和 `server-only` 等仅服务器模块。这有助于判断某个库是否兼容 RSC。

### 自定义 expect 匹配器

面向 RSC 的 `jest-expo` 为 Jest 的 `expect` 添加了几个自定义匹配器：

- `toMatchFlight`：使用 Expo CLI 中渲染的伪实现来渲染 JSX 元素，并与 flight 字符串比较。
- `toMatchFlightSnapshot`：与 `toMatchFlight` 相同，但会把 flight 字符串保存到快照文件。

在底层，这些方法处理渲染 RSC 所需的一部分框架操作。组件的渲染流会被缓冲成字符串并一次性比较。你也可以改为手动流式处理，以观察渲染进度。

如果组件渲染失败，匹配器会抛出错误以使测试失败。实际中，服务端渲染器会生成一行 `E:`，并发送到客户端，在用户本地抛出。

### 运行测试

可以用 `test:rsc` 脚本运行测试：

```sh
yarn test:rsc --watch
```

如果使用多运行器，可以用 `--selectProjects` 标志选择特定项目。下面的示例只运行 Web 平台：

```sh
yarn test:rsc --watch --selectProjects rsc/web
```

### 环境

在 RSC 打包环境中，你可以导入如下文件

## 提示

使用 `server-only` 和 `client-only` 模块来断言某个模块不应在客户端或服务器上被导入：

```js my-module.js
import 'server-only';
```

RSC 默认支持包导出。可以使用 `react-server` 条件来改变从模块导入的文件：

```json package.json
{
  "exports": {
    ".": {
      "react-server": "./index.react-server.js",
      "default": "./index.js"
    }
  }
}
```

为 RSC 打包时，所有模块都以 React Server 模式打包，可以用 `"use client"` 指令退出。找到 `"use client"` 时，该模块会变成指向客户端模块的异步引用。

`"use server"` 并不是 `"use client"` 的反义。它用于定义 React Server Functions 文件。
