---
title: 创建 DevTools 插件
description: 了解如何创建 DevTools 插件，以提升你的开发体验。
---

# 创建 DevTools 插件

:::tip
查看 [Expo DevTools Plugins](https://github.com/expo/dev-plugins) 仓库获取完整示例。
:::

你可以创建一个 DevTools 插件——无论是用来检查某个常用框架或库的内部状态，还是针对你自己代码中的特定内容。本指南将带你一步步创建一个 DevTools 插件。

## 什么是 DevTools 插件？

DevTools 插件在你的本地开发环境中运行于网页浏览器里，并连接到你的 Expo 应用。

一个插件由三个关键部分组成：

- 一个用于展示开发工具 Web 用户界面的 Expo 应用。
- 一个 **expo-module.config.json** 文件，供 Expo CLI 识别。
- 对 `expo/devtools` API 的调用，用于让应用与开发工具的 Web 界面之间来回通信。

插件可以发布到 npm，也可以放在你应用的 Monorepo 中。它们通常会导出一个单独的 hook，你可以在应用的根组件中使用它，从而在应用以调试模式运行时与 Web 界面建立双向通信。

## 第 1 步：创建插件

### 创建新的插件项目

`create-dev-plugin` 会为你搭建一个新的插件项目。运行以下命令来创建新的插件项目：

:::tabs
:::tab npm
```sh
npx create-dev-plugin@latest
```
:::
:::tab yarn
```sh
yarn create dev-plugin
```
:::
:::tab pnpm
```sh
pnpm create dev-plugin
```
:::
:::tab bun
```sh
bun create dev-plugin
```
:::
:::

`create-dev-plugin` 会提示你输入插件名称、描述，以及插件的使用者将要使用的 hook 名称。

插件项目会包含以下目录：

- **src** - 导出在消费方应用内部使用的 hook，用于把应用连接到插件。
- **webui** - 包含插件的 Web 用户界面。

### 自定义插件的功能

模板中包含一个简单示例，演示插件与应用之间如何收发消息。从 `expo/devtools` 导入的 `useDevToolsPluginClient` 提供了在插件与应用之间收发消息的能力。

`useDevToolsPluginClient` 返回的 client 对象包含：

**`addMessageListener`**

监听与指定字符串匹配的消息，并在收到消息时以消息数据为参数调用回调函数。

```jsx
const client = useDevToolsPluginClient('my-devtools-plugin');
client.addMessageListener('ping', data => {
  alert(`Received ping from ${data.from}`);
});
```

**`sendMessage`**

监听与指定字符串匹配的消息，并在收到消息时以消息数据为参数调用回调函数。

```jsx
const client = useDevToolsPluginClient('my-devtools-plugin');
client?.sendMessage('ping', { from: 'web' });
```

修改 **webui** 目录中的 Expo 应用，自定义用于展示应用诊断信息或触发测试场景的用户界面：

```tsx webui/App.tsx
import { useDevToolsPluginClient, type EventSubscription } from 'expo/devtools';
import { useEffect } from 'react';

export default function App() {
  const client = useDevToolsPluginClient('my-devtools-plugin');

  useEffect(() => {
    const subscriptions: EventSubscription[] = [];

    subscriptions.push(
      client?.addMessageListener('ping', data => {
        alert(`Received ping from ${data.from}`);
      })
    );

    return () => {
      for (const subscription of subscriptions) {
        subscription?.remove();
      }
    };
  }, [client]);
}
```

修改 **src** 目录中的 hook，自定义要发送给插件的诊断信息，或应用应如何响应来自 Web 用户界面的消息：

```tsx src/useMyDevToolsPlugin.ts
import { useDevToolsPluginClient } from 'expo/devtools';

export function useMyDevToolsPlugin() {
  const client = useDevToolsPluginClient('my-devtools-plugin');

  const sendPing = () => {
    client?.sendMessage('ping', { from: 'app' });
  };

  return {
    sendPing,
  };
}
```

如果你更新了 hook 使其返回供应用调用的函数，还需要更新 **src/index.ts**，让它在应用不处于调试模式时导出空操作（no-op）函数：

```diff src/index.ts
if (process.env.NODE_ENV !== 'production') {
  useMyDevToolsPlugin = require('./useMyDevToolsPlugin').useMyDevToolsPlugin;
} else {
  useMyDevToolsPlugin = () => ({
+    sendPing: () => {},
  });
}
```

## 第 2 步：测试插件

由于插件的 Web UI 本身就是一个 Expo 应用，你可以像测试其他任何 Expo 应用一样，用 `npx expo start` 来测试它——只不过你只会在浏览器中运行它。模板中包含一个便捷命令，用于在本地开发模式下运行插件：

:::tabs
:::tab npm
```sh
npm run web:dev
```
:::
:::tab yarn
```sh
yarn run web:dev
```
:::
:::tab pnpm
```sh
pnpm run web:dev
```
:::
:::tab bun
```sh
bun run web:dev
```
:::
:::

## 第 3 步：构建用于分发的插件

为了准备发布插件或在你的 Monorepo 中使用它，你需要用以下命令构建插件：

:::tabs
:::tab npm
```sh
npm run build:all
```
:::
:::tab yarn
```sh
yarn run build:all
```
:::
:::tab pnpm
```sh
pnpm run build:all
```
:::
:::tab bun
```sh
bun run build:all
```
:::
:::

这条命令会把 hook 代码构建到 **build** 目录，把 Web 用户界面构建到 **dist** 目录。

## 第 4 步：使用插件

把插件的 hook 导入到应用的根组件中并调用它，从而把应用连接到插件：

```jsx App.js
import { useMyDevToolsPlugin } from 'my-devtools-plugin';
import { Button } from 'react-native';

export default function App() {
  const { sendPing } = useMyDevToolsPlugin();

  return (
    <View style={styles.container}>
      <Button
        title="Ping"
        onPress={() => {
          sendPing();
        }}
      />
    </View>
  );
}
```
