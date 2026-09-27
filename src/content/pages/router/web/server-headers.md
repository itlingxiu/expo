---
title: 服务器请求头
description: 了解如何在 Expo Router 中为所有服务器路由响应设置自定义 HTTP 请求头。
---

# 服务器请求头

:::warning
服务器请求头自 SDK 54 起可用，并且需要 [`expo-server`](/versions/latest/sdk/server) 来提供导出的应用。
:::

Expo Router 中的服务器请求头允许你为路由响应设置用于安全、缓存、Cookie 和自定义元数据的 HTTP 请求头。请求头**仅**适用于 HTML 和 API 路由响应，不适用于图片、字体或 JavaScript bundle 等静态资源。

## 设置

1. 在[应用配置](/versions/latest/config/app)的 `expo-router` 插件中配置请求头：

   ```json app.json
   {
     "expo": {
       "plugins": [
         [
           "expo-router",
           {
             "headers": {
               "X-Frame-Options": "DENY"
             }
           }
         ]
       ]
     }
   }
   ```

2. 启动开发服务器，或导出用于生产环境：

   :::tabs
   :::tab npm
   ```sh
   npx expo start

   # 或导出用于生产环境
   npx expo export -p web
   ```
   :::
   :::tab yarn
   ```sh
   yarn expo start

   # 或导出用于生产环境
   yarn expo export -p web
   ```
   :::
   :::tab pnpm
   ```sh
   pnpm expo start

   # 或导出用于生产环境
   pnpm expo export -p web
   ```
   :::
   :::tab bun
   ```sh
   bun expo start

   # 或导出用于生产环境
   bun expo export -p web
   ```
   :::
   :::

   请求头会自动应用到所有 HTML 和 API 路由响应。

## 配置

请求头配置为一个对象，键是请求头名称，值是字符串或字符串数组。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "headers": {
            "X-Frame-Options": "DENY",
            "X-Content-Type-Options": "nosniff",
            "Set-Cookie": ["session=abc123; HttpOnly", "preference=dark; Path=/"]
          }
        }
      ]
    ]
  }
}
```

## 示例

<details>
<summary>安全请求头</summary>

添加常见的安全请求头以保护应用：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "headers": {
            "X-Frame-Options": "DENY",
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "X-XSS-Protection": "1; mode=block"
          }
        }
      ]
    ]
  }
}
```

</details>

<details>
<summary>用于 SharedArrayBuffer 的跨源请求头</summary>

[`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 等一些 Web API 需要特定的跨源请求头。诸如 [Web 上的 `expo-sqlite`](/versions/latest/sdk/sqlite#web-setup) 等功能就需要这些请求头。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "headers": {
            "Cross-Origin-Embedder-Policy": "credentialless",
            "Cross-Origin-Opener-Policy": "same-origin"
          }
        }
      ]
    ]
  }
}
```

</details>

<details>
<summary>Cache-Control 请求头</summary>

为响应设置缓存策略：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "headers": {
            "Cache-Control": "public, max-age=3600, s-maxage=86400"
          }
        }
      ]
    ]
  }
}
```

</details>

<details>
<summary>自定义请求头</summary>

添加包含应用元数据的自定义请求头：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "headers": {
            "X-App-Version": "1.0.0",
            "X-Environment": "production"
          }
        }
      ]
    ]
  }
}
```

</details>

## 工作原理

### 输出模式

服务器请求头适用于应用配置中的两种输出模式：

- **`static`**：用 [`expo-server`](/versions/latest/sdk/server) 提供预渲染 HTML 文件时应用请求头
- **`server`**：请求头应用于动态渲染的响应

### 请求头优先级

`expo-router` 插件中定义的请求头会全局应用，但不会覆盖 API 路由设置的请求头。如果 API 路由返回的响应包含插件配置中也定义了的请求头，则以该路由自己的请求头为准。

例如，如果全局配置了 `Cache-Control: public, max-age=3600`，但返回实时数据的 API 路由设置了 `Cache-Control: no-store`，则以 API 路由的请求头为准。

## 已知限制

- **重定向**：请求头不适用于重定向响应
- **静态资源**：请求头只应用于 HTML 和 API 路由响应，不应用于图片、字体或 JavaScript bundle 等静态资源

## 相关内容

- [API 路由](/router/web/api-routes)：了解如何使用 Expo Router 创建服务器端点。
- [服务器中间件](/router/web/middleware)：了解如何创建对每个服务器请求都会运行的中间件。
