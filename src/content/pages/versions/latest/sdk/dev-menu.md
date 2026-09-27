---
title: DevMenu 包参考
description: 为调试构建提供开发者菜单的库。
---

# DevMenu 包参考

`expo-dev-menu` 可以作为**独立库**用在任何 Expo 项目中。它尤其适合不需要完整 [`expo-dev-client`](/versions/latest/sdk/dev-client) 启动器界面的 [brownfield 应用](/versions/latest/sdk/brownfield)。

> 支持平台：Android、iOS、tvOS。

`expo-dev-menu` 为 React Native 应用提供开发者菜单界面，其中包括：

- 可通过摇一摇手势或三指长按打开的强大且可扩展的菜单界面
- 快速访问常见开发操作
- 支持自定义菜单项以扩展功能

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-dev-menu
```
:::
:::tab yarn
```sh
yarn expo install expo-dev-menu
```
:::
:::tab pnpm
```sh
pnpm expo install expo-dev-menu
```
:::
:::tab bun
```sh
bun expo install expo-dev-menu
```
:::
:::

## 用法

安装后，开发者菜单可在调试构建中使用。你可以通过以下方式打开它：

- **摇一摇手势**：摇动设备
- **三指长按**：用三根手指在屏幕上长按
- **以编程方式**：在代码中调用 `DevMenu.openMenu()`

## 扩展开发者菜单

可以使用 `registerDevMenuItems` API 扩展开发者菜单，加入额外按钮：

```tsx
import { registerDevMenuItems } from 'expo-dev-menu';

const devMenuItems = [
  {
    name: 'My Custom Button',
    callback: () => console.log('Hello world!'),
  },
];

registerDevMenuItems(devMenuItems);
```

这会在开发者菜单中创建一个新分区，其中包含你注册的按钮：

![expo-dev-menu 中自定义菜单按钮的示例](/static/images/dev-client/custom-menu-button.png)

:::note
后续对 `registerDevMenuItems` 的调用会覆盖之前的所有条目。
:::

## 与 expo-dev-client 一起使用

如果使用[开发构建](/develop/development-builds/introduction)，请改为安装 `expo-dev-client`。它包含 `expo-dev-menu`，以及额外的开发工具：

- 可配置的启动器界面，用于在开发服务器之间切换
- 改进的调试工具
- 支持从 [EAS Update](/eas-update/introduction) 加载更新

:::tabs
:::tab npm
```sh
npx expo install expo-dev-client
```
:::
:::tab yarn
```sh
yarn expo install expo-dev-client
```
:::
:::tab pnpm
```sh
pnpm expo install expo-dev-client
```
:::
:::tab bun
```sh
bun expo install expo-dev-client
```
:::
:::

更多信息见 [`expo-dev-client` 参考](/versions/latest/sdk/dev-client)。

## API

```js
import * as DevMenu from 'expo-dev-menu';
```
