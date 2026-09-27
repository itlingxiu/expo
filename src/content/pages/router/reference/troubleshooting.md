---
title: 故障排除
description: 修复 Expo Router 设置中的常见问题。
---

# 故障排除

## React Native DevTools 中缺少文件或 source map

如果 Chrome DevTools 的忽略列表中包含排除项，就可能出现这种情况。要修复，请使用 [React Native DevTools](https://reactnative.dev/docs/react-native-devtools)：

1. 在终端窗口中运行的开发服务器里按 <kbd>J</kbd>，启动 React Native DevTools
2. 点击齿轮图标，打开 **Settings**
3. 在 **Extensions** 下，点击 **Restore defaults and reload**
4. 再次打开 **Settings**，进入 **Ignore List** 标签页
5. 取消勾选 `/node_modules/` 的任何排除项

## 未定义 `EXPO_ROUTER_APP_ROOT`

如果 `process.env.EXPO_ROUTER_APP_ROOT` 未定义，你会看到以下错误：

```sh
Invalid call at line 11: process.env.EXPO_ROUTER_APP_ROOT First argument of require.context should be a string.
```

当项目的 **babel.config.js** 没有使用 Babel 插件 `expo-router/babel` 时，可能出现此问题。可以尝试清除缓存：

:::tabs
:::tab npm
```sh
npx expo start --clear
```
:::
:::tab yarn
```sh
yarn expo start --clear
```
:::
:::tab pnpm
```sh
pnpm expo start --clear
```
:::
:::tab bun
```sh
bun expo start --clear
```
:::
:::

也可以在项目根目录创建 **index.js** 来绕过此问题，内容如下：

```jsx index.js
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// 必须导出，否则 Fast Refresh 不会更新 context
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
```

然后更新应用在 **package.json** 中的主入口：

```json package.json
{
  "main": "index.js"
  /* @hide 省略 ... */ /* @end */
}
```

> 不要用这种方式修改根目录（**app**），因为它不会覆盖其他地方的用法。

## 未启用 `require.context`

使用未启用 context 模块的自定义 `@expo/metro-config` 版本时，可能出现此问题。Expo Router 要求项目的 **metro.config.js** 使用 `expo-router/metro` 作为默认配置。删除 **metro.config.js**，或扩展 `expo/metro-config`。更多信息见[自定义 Metro](/guides/customizing-metro)。

## 缺少返回按钮

如果设置了模态或其他预期带有返回按钮的屏幕，则需要在该路由的布局中添加 [`unstable_settings`](/router/advanced/router-settings)，以确保已配置锚点。锚点路由在一定程度上是移动应用特有的，放进这套系统里略显别扭——改进仍在进行中。

```tsx src/app/_layout.tsx
export const unstable_settings = {
  anchor: 'index',
};
```
