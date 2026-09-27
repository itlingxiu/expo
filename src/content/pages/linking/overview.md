---
title: 深层链接概览
description: 在 Expo 应用中实现链接与深层链接所需资源的概览，包括 Android 应用链接与 iOS 通用链接。
---

# 深层链接概览

在 Expo 应用中实现链接与深层链接（Deep Link）所需资源的概览。

## 链接

链接（Linking）让你的应用可以处理传入与传出的 URL。在这个过程中，一个 URL 会打开你的应用，并把用户带到应用内的某个特定页面（路由）。

[观看视频：使用 Expo 设置链接](https://www.youtube.com/watch?v=kNbEEYlFIPs) —— 在你的 Expo 应用中设置深层链接、通用链接和应用链接，以处理传入与传出的 URL。

### 链接策略

在 Expo 应用中，你可以采用不同的链接策略：

- 使用你的 Web 域名链接到你的应用（[通用链接](#universal-linking)，使用 `https` 或 `http` 协议）
- 使用自定义 scheme 从其他应用或网站链接到你的应用（深层链接）
- 从你的应用链接到其他应用（传出链接）

:::tip
Expo Go 对传入链接的支持有限。我们建议使用[开发构建（Development Build）](/develop/development-builds/introduction)来测试应用的链接策略。
:::

## 通用链接

Android 和 iOS 都各自实现了将 Web URL 路由到已安装应用的机制。在 Android 上，这套机制被称为应用链接（App Links）；在 iOS 上则被称为通用链接（Universal Links）。两者共同的前提是：你需要拥有一个 Web 域名，并能在上面托管一个用于验证域名所有权的文件。

### Android 应用链接

Android 应用链接与[标准深层链接](#linking-to-your-app-from-other-apps-or-websites)不同，它使用普通的 HTTP 和 HTTPS 协议，且仅适用于 Android 设备。

这种链接类型让用户点击链接时始终打开你的应用，而无需在设备弹出的对话框中选择浏览器或其他处理程序。如果用户没有安装你的应用，链接会将他们带到与应用关联的网站。

[配置 Android 应用链接](/linking/android-app-links) —— 了解如何配置 `intentFilters`，并基于标准 Web URL 建立双向关联。

### iOS 通用链接

iOS 通用链接与[标准深层链接](#linking-to-your-app-from-other-apps-or-websites)不同，它使用普通的 HTTP 和 HTTPS 协议，且仅适用于 iOS 设备。

这种链接类型让应用在用户点击指向你 Web 域名的 HTTP(S) 链接时打开。如果用户没有安装你的应用，链接会将他们带到与应用关联的网站。你还可以通过 [Apple 智能横幅（Smart Banner）](/linking/ios-universal-links#apple-smart-banner)进一步配置网站，显示一个引导用户打开应用的横幅。

[配置 iOS 通用链接](/linking/ios-universal-links) —— 了解如何配置 `associatedDomains` 并建立双向关联。

## 从其他应用或网站链接到你的应用

[深层链接（Deep Links）](https://en.wikipedia.org/wiki/Deep_linking)是指向应用或网站内特定基于 URL 的内容的链接。

例如，用户点击某个商品广告后，你的应用会在用户设备上打开，用户可以查看该商品的详情。用户点击的这个商品链接可能长这样（也可以通过 JavaScript 设置 `window.location.href` 来触发）：

```html
<a href="myapp://web-app.com/product">View product</a>
```

这个链接由三部分组成：

- **Scheme**：标识应该打开该 URL 的应用的 URL scheme（例如 `myapp://`）。对于非标准深层链接，它也可以是 `https` 或 `http`。对于基于 http(s) 的深层链接，我们推荐使用[通用链接](#universal-linking)。
- **Host**：应该打开该 URL 的应用的域名（例如 `web-app.com`）。
- **Path**：要打开的页面的路径（例如 `/product`）。如果没有指定路径，用户会被带到应用的主页。

[链接到你的应用](/linking/into-your-app) —— 了解如何配置自定义 URL scheme 来创建应用的深层链接。

### 使用 Expo Router 处理深层链接

要实现上述任何一种链接策略，**我们推荐使用** [Expo Router](/router/introduction)，因为应用所有页面的深层链接都会自动启用。

**优点：**

- Expo Router 的 `Link` 组件可以用于[处理指向其他应用的 URL scheme](/linking/into-other-apps#using-expo-routers-link-component)
- Android 应用链接和 iOS 通用链接需要为应用内的链接在 JavaScript 中配置运行时路由。使用 Expo Router 后，你无需单独配置运行时路由，因为所有路由的深层链接都会自动启用。
- 对于第三方深层链接，你可以覆盖默认的链接行为来处理传入链接并发送导航事件。参见[自定义链接](/router/advanced/native-intent)。

## 从你的应用链接到其他应用

从你的应用链接到其他应用，需要基于目标应用的 URL scheme 构造一个 URL。这个 **URL scheme** 让你能够引用该原生应用内的资源。

你的应用可以使用默认应用的[常用 URL scheme](/linking/into-other-apps#common-url-schemes)，包括 `https` 和 `http`（Chrome、Safari 等浏览器常用），并用 JavaScript 触发启动相应原生应用的 URL。

[链接到其他应用](/linking/into-other-apps) —— 了解如何处理常用与自定义 URL scheme，从你的应用链接到其他应用。
