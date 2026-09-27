---
title: Linking 包参考
description: 提供通用方法，用于创建并打开深层链接的 API。
---

# Linking 包参考

> 支持平台：Android、iOS、Web、tvOS、Expo Go。

`expo-linking` 提供工具方法，让应用通过深层链接与其他已安装应用交互。它也提供辅助方法，用来构造指向你的应用的深层链接，以及解析这些链接。这个库是 React Native [`Linking`](https://reactnative.dev/docs/linking) 的扩展。

关于如何使用 `expo-linking` 的更完整说明，请参阅[链接到其他应用](/linking/into-other-apps)。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-linking
```
:::
:::tab yarn
```sh
yarn expo install expo-linking
```
:::
:::tab pnpm
```sh
pnpm expo install expo-linking
```
:::
:::tab bun
```sh
bun expo install expo-linking
```
:::
:::

## API

```js
import * as Linking from 'expo-linking';
```
