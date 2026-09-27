---
title: Sitemap
description: 了解如何使用 sitemap 调试 Expo Router 应用。
---

# Sitemap

在原生平台上，可以使用 [`uri-scheme`](https://www.npmjs.com/package/uri-scheme) CLI 测试在设备上打开原生链接。

例如，若要在 iOS 上把 Expo Go 启动到 `/form-sheet` 路由，运行：

:::tabs
:::tab npm
```sh
npx uri-scheme open exp://192.168.87.39:19000/--/form-sheet --ios
```
:::
:::tab yarn
```sh
yarn dlx uri-scheme open exp://192.168.87.39:19000/--/form-sheet --ios
```
:::
:::tab pnpm
```sh
pnpm dlx uri-scheme open exp://192.168.87.39:19000/--/form-sheet --ios
```
:::
:::tab bun
```sh
bunx uri-scheme open exp://192.168.87.39:19000/--/form-sheet --ios
```
:::
:::

> 将 `192.168.87.39:19000` 替换为运行 `npx expo start` 时显示的 IP 地址。

也可以直接在 Safari 或 Chrome 等浏览器中搜索链接，以便在真机上测试深层链接。更多内容见[测试深层链接](https://reactnavigation.org/docs/deep-linking)。

## Sitemap

![目录结构](/static/images/expo-router/directory.webp)

Expo Router 目前会自动注入 **/\_sitemap**，列出应用中的全部路由。这在调试时很有用。

在应用配置的 `expo-router` 配置插件中加入 `sitemap: false`，即可移除 sitemap：

```json app.json
{
  "plugins": [
    [
      "expo-router",
      {
        /* @info 禁用 sitemap 生成。 */
        "sitemap": false
        /* @end */
      }
    ]
  ]
}
```
