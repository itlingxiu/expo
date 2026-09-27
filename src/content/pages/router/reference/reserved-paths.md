---
title: 保留路径
description: Metro 与 Expo Router 保留的 URL 路径，应避免用作路由或静态文件。
---

# 保留路径

如果在某些 URL 路径上创建路由或放置静态文件，Metro 或 Expo Router 会拦截请求，而不会提供你的内容。根据路径不同，这可能导致 “404 Asset not found” 错误，或你的页面被开发服务器的内部响应静默替换。

## `/assets/*`

Metro 在此路径上提供所有打包资源（图片、字体和其他文件）。如果在 **app/assets.tsx** 创建路由，或在 **public/assets/** 创建目录，Metro 会拦截请求，你的内容永远不会被访问到。

这同时适用于顶层路由和静态文件：

```text
app/assets.tsx            与 Metro 冲突
app/assets/index.tsx      与 Metro 冲突
public/assets/logo.png    与 Metro 冲突
```

重命名路由或目录以避免冲突：

```text
app/media.tsx             可用
public/images/logo.png    可用
```

## `/_expo/*`

Expo Router 将此路径用于多种内部中间件，包括开发工具和清单。不要在此路径下创建路由或静态文件。

## `/_flight/*`

React Server Components 在内部使用此路径。不要在此路径下创建路由或静态文件。

## `/inspector`

React Native 使用 `/inspector/debug` 和 `/inspector/network` 作为调试器。避免创建匹配 `/inspector` 或其子路径的路由。

## `/expo-dev-plugins/*`

Expo 开发工具插件使用此路径。不要在此路径下创建路由或静态文件。

## `/manifest`

开发服务器在此路径上提供原生应用清单。如果在 **app/manifest.tsx** 创建路由，开发服务器会返回清单 JSON，而不是你的页面。开发期间，该路由看起来会静默无法加载。

## `/_sitemap`

Expo Router 会在此路径自动生成用于调试的 sitemap 路由。如果在 **app/\_sitemap.tsx** 创建路由，它会覆盖内置 sitemap。此功能的更多细节见 [Sitemap](/router/reference/sitemap)。

## `/public/*`

如果项目有 **public** 目录，`/public` URL 路径可能与静态文件服务冲突。当 **public** 目录存在时，该路径会被隐式保留，因此避免在 **app/public.tsx** 或 **app/public/index.tsx** 创建路由。

## `/favicon.ico`

与上面的路径不同，`/favicon.ico` 可以安全覆盖。未提供图标时，Expo CLI 会提供默认 favicon。可以把 **favicon.ico** 放在 **public** 目录中，或创建一条 [API 路由](/router/web/api-routes) 来替换它。
