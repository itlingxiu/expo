---
title: iOS 通用链接
description: 了解如何配置 iOS 通用链接，以便从标准网页 URL 打开 Expo 应用。
---

# iOS 通用链接

要为应用配置 iOS 通用链接，需要建立**双向关联**，以验证网站和原生应用。

**[视频：使用 Expo Router 设置 iOS 通用链接](https://www.youtube.com/watch?v=kNbEEYlFIPs&t=68)**：了解如何配置 iOS 通用链接，使 Expo 应用能从标准网页 URL 打开。

## 设置双向关联

要在网站和应用之间为 iOS 建立**双向关联**，需要完成以下步骤：

- **网站验证：** 需要在 **/.well-known** 目录中创建 **apple-app-site-association（AASA）** 文件，并托管在目标网站上。该文件用于验证从给定链接打开的应用是否为正确的应用。
- **原生应用验证：** 需要某种形式的代码签名，引用目标网站域名（URL）。

### 创建 AASA 文件

在 **/.well-known** 目录中为网站验证创建 **apple-app-site-association** 文件。该文件指定 Apple Developer Team ID、bundle identifier，以及要重定向到原生应用的受支持路径列表。

:::note
可以在项目中运行[实验性](/more/release-statuses#experimental) CLI 命令 `npx setup-safari`，自动把 bundle identifier 注册到 Apple 账户、为该 ID 分配授权项，并在商店中创建 iTunes 应用条目。本地设置会被打印出来，你可以跳过后面大部分步骤。这是在 iOS 上开始使用通用链接最简单的方式。
:::

如果使用 Expo Router 构建网站（或 Remix、Next.js 等任何其他现代 React 框架），在 **public/.well-known/apple-app-site-association** 创建 AASA 文件。对于旧版 Expo webpack 项目，在 **web/.well-known/apple-app-site-association** 创建该文件。

```json public/.well-known/apple-app-site-association
{
  // 此部分启用通用链接
  "applinks": {
    "apps": [],
    "details": [
      {
        // 语法："<APPLE_TEAM_ID>.<BUNDLE_ID>"
        // 把 `QQ57RJ5UTD.com.example.myapp` 换成你自己的 Apple Team ID 和 bundle identifier。
        "appID": "QQ57RJ5UTD.com.example.myapp",
        // 所有应支持重定向的路径。
        // 把 `/records/*` 换成你自己的路径。
        "paths": ["/records/*"]
      }
    ]
  },
  // 此部分启用 Apple Handoff
  "activitycontinuation": {
    "apps": ["<APPLE_TEAM_ID>.<BUNDLE_ID>"]
  },
  // 此部分启用共享网页凭据
  "webcredentials": {
    "apps": ["<APPLE_TEAM_ID>.<BUNDLE_ID>"]
  }
}
```

在上面的示例中：

- 指向 `https://www.myapp.io/records/*` 的任何链接（记录 ID 使用通配符匹配）都应在 iOS 设备上由 bundle identifier 匹配的应用直接打开。它是 [Apple Team ID](https://expo.fyi/apple-team) 与 bundle identifier 的组合。
- `*` 通配符**不会**匹配域名或路径分隔符（句点和斜杠）。
- `activitycontinuation` 和 `webcredentials` 对象是可选的，但建议保留。

> 有关 AASA 格式的更多细节，见 [Apple 文档](https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html)。Branch 提供了 [AASA 验证器](https://branch.io/resources/aasa-validator/)，可以帮助确认 AASA 已正确部署且格式有效。

### 支持 `details` 格式

自 iOS 13 起[支持 `details` 格式](https://developer.apple.com/documentation/xcode/supporting-associated-domains)。它允许你指定：

- 用 `appIDs` 代替 `appID`：更容易把多个应用关联到同一配置
- `components` 数组：允许指定 fragment、排除特定路径并添加注释

<details>
<summary>来自 Apple 文档的 AASA JSON 示例</summary>

```json public/.well-known/apple-app-site-association
{
  "applinks": {
    "details": [
      {
        "appIDs": ["ABCDE12345.com.example.app", "ABCDE12345.com.example.app2"],
        "components": [
          {
            "#": "no_universal_links",
            "exclude": true,
            "comment": "Matches any URL whose fragment equals no_universal_links and instructs the system not to open it as a universal link"
          },
          {
            "/": "/buy/*",
            "comment": "Matches any URL whose path starts with /buy/"
          },
          {
            "/": "/help/website/*",
            "exclude": true,
            "comment": "Matches any URL whose path starts with /help/website/ and instructs the system not to open it as a universal link"
          },
          {
            "/": "/help/*",
            "?": {
              "articleNumber": "????"
            },
            "comment": "Matches any URL whose path starts with /help/ and which has a query item with name 'articleNumber' and a value of exactly 4 characters"
          }
        ]
      }
    ]
  }
}
```

</details>

要支持所有 iOS 版本，可以在 `details` 键中同时提供上述两种格式，但建议把较新 iOS 版本的配置放在前面。

### 托管 AASA 文件

使用带有你域名的 Web 服务器托管 **apple-app-site-association** 文件。该文件必须通过 HTTPS 连接提供。验证浏览器可以访问此文件。

设置好 AASA 文件后，把网站部署到支持 HTTPS 的服务器（大多数现代 Web 主机）。

### 原生应用配置

部署 **apple-app-site-association**（AASA）文件后，通过在[应用配置](/workflow/configuration)中添加 [`ios.associatedDomains`](/versions/latest/config/app#associateddomains) 来配置应用使用关联域名。务必遵循 [Apple 指定的格式](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_associated-domains)，并且 URL 中**不要**包含协议（`https`）。这是一个常见错误，会导致通用链接无法工作。

例如，如果关联网站是 `https://expo.dev/`，则 `applinks` 为：

```json app.json
{
  "expo": {
    "ios": {
      "associatedDomains": ["applinks:expo.dev"]
    }
  }
}
```

使用 [EAS Build](/build/setup) 构建 iOS 应用，它会确保授权项自动向 Apple 注册。

<details>
<summary>手动原生配置</summary>

如果未使用 EAS 或[持续原生生成](/workflow/continuous-native-generation)（`npx expo prebuild`），必须为 bundle identifier [手动配置](/build-reference/ios-capabilities#手动设置) **Associated Domains** capability。

如果通过 [Apple Developer Console](/build-reference/ios-capabilities#apple-developer-console) 启用，请确保在 **ios/[app]/[app].entitlements** 文件中添加以下授权项：

```xml
<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:expo.dev</string>
</array>
```

</details>

### 原生应用验证

在 iOS 设备上安装应用以触发验证过程。移动设备上指向你网站的链接应打开应用。如果没有，请重新检查前面的步骤，确保 AASA 有效、AASA 中指定的路径正确，并且已在 [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list) 中正确配置 App ID。

应用打开后，见[处理进入应用的链接](/linking/into-your-app#处理-url)，了解如何处理入站链接并向用户显示他们请求的内容。

> iOS 会在应用首次安装时，或从 App Store 安装更新时下载 AASA。之后操作系统不会频繁刷新。如果要为生产应用更改 AASA 中的路径，需要通过 App Store 发布完整更新，以便所有用户的应用重新获取 AASA 并识别新路径。

## Apple Smart Banner

如果用户没有安装你的应用，他们会被引导到网站。可以使用 [Apple Smart Banner](https://developer.apple.com/documentation/webkit/promoting_apps_with_smart_app_banners) 在页面顶部显示横幅，提示用户安装应用。只有当用户在移动设备上且未安装应用时，横幅才会显示。

要启用横幅，把以下 meta 标签添加到网站的 `<head>` 中，把 `<ITUNES_ID>` 替换为应用的 iTunes ID：

```html
<meta name="apple-itunes-app" content="app-id=<ITUNES_ID>" />
```

如果设置横幅遇到困难，运行以下命令为项目自动生成 meta 标签：

:::tabs
:::tab npm
```sh
npx setup-safari
```
:::
:::tab yarn
```sh
yarn dlx setup-safari
```
:::
:::tab pnpm
```sh
pnpm dlx setup-safari
```
:::
:::tab bun
```sh
bunx setup-safari
```
:::
:::

### 把 meta 标签添加到静态渲染的网站

如果正在使用 Expo Router 构建[静态渲染的网站](/router/web/static-rendering)，把 HTML 标签添加到 [**src/app/+html.js** 文件](/router/web/static-rendering#根-html) 的 `<head>` 组件中。

```tsx src/app/+html.tsx
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* 把 <ITUNES_ID> 替换为应用的 iTunes ID。 */}
        <meta name="apple-itunes-app" content="app-id=<ITUNES_ID>" />
        {/* 其他 head 元素... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## 调试

Expo CLI 让你无需部署网站即可测试 iOS 通用链接。利用 [`--tunnel`](/more/expo-cli#隧道) 功能，可以把开发服务器转发到公开可用的 HTTPS URL。

1. 设置环境变量 `EXPO_TUNNEL_SUBDOMAIN=my-custom-domain`，其中 `my-custom-domain` 是开发期间使用的唯一字符串。这确保隧道 URL 在开发服务器重启后保持一致。

2. 按[上文所述](#原生应用配置)把 `associatedDomains` 添加到应用配置。把域名值替换为 Ngrok URL：`my-custom-domain.ngrok.io`。

3. 使用 `--tunnel` 标志启动开发服务器：

:::tabs
:::tab npm
```sh
npx expo start --tunnel
```
:::
:::tab yarn
```sh
yarn expo start --tunnel
```
:::
:::tab pnpm
```sh
pnpm expo start --tunnel
```
:::
:::tab bun
```sh
bun expo start --tunnel
```
:::
:::

4. 在设备上编译开发构建：

:::tabs
:::tab npm
```sh
npx expo run:ios
```
:::
:::tab yarn
```sh
yarn expo run:ios
```
:::
:::tab pnpm
```sh
pnpm expo run:ios
```
:::
:::tab bun
```sh
bun expo run:ios
```
:::
:::

现在可以在设备的 Web 浏览器中输入自定义域名链接来打开应用。

## 故障排除

以下是实现 iOS 通用链接时的一些常见提示：

- 阅读 Apple 关于[调试通用链接](https://developer.apple.com/documentation/technotes/tn3155-debugging-universal-links)的官方文档
- 使用[验证工具](https://branch.io/resources/aasa-validator/)确保 apple app site association 文件有效。
- 未压缩的 `apple-app-site-association` 文件[不能大于 128kb](https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html)。
- 确保网站通过 HTTPS 提供。
- 如果更新了 Web 文件，请重新构建原生应用，以触发供应商端（Apple）的服务器更新。
