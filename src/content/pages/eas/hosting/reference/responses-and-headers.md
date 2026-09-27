---
title: 默认响应与头
description: 使用 EAS Hosting 时自动添加到请求上的默认值。
---

# 默认响应与头

**EAS Hosting** 会为你的部署应用若干默认值，这些默认值旨在帮助你，并减少为简单 API 路由自行添加的代码量。

## 资源响应

资源响应包含供浏览器使用的额外元数据头，主要用于缓存。

所有资源响应都会添加默认的 `ETag` 头，以便浏览器使用 `if-none-match` 请求头重新验证其缓存。

## CORS 响应

默认情况下，如果 API 路由不处理 `OPTIONS` 请求，EAS Hosting 会自动以默认的 CORS 响应来应答。

此默认值非常宽松，通常允许所有浏览器向该 API 路由发起请求。**如果你不希望这样**，请在 API 路由中自行处理 `OPTIONS` 请求。

默认会发送以下头：

```sh
Access-Control-Allow-Origin: <origin || '*'>
Access-Control-Allow-Headers: <access-control-request-headers || '*'>
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: *
Access-Control-Max-Age: 3600
Vary: Origin, Access-Control-Request-Headers
```

这些头允许任何客户端从任何来源、携带任何头和凭据发起请求，并把 `OPTIONS` 响应缓存 3600 秒。

关于预检 `OPTIONS` 请求的更多信息，见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)。

## Strict-Transport-Security 头

此头告诉浏览器今后只使用 HTTPS 协议访问 URL。如果缺少此头，EAS Hosting 会自动添加它。

其默认值设为 `max-age=31536000; includeSubDomains; preload`。

关于为什么此头是一个好的默认值、并能提高安全性和性能，请[阅读 `web.dev` 上的这篇文章](https://web.dev/blog/bbc-hsts)，并在 MDN 文档中进一步阅读 [Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) 头。

## 常见头

默认情况下，EAS Hosting 会移除并且不转发任何 `X-Powered-By` 和 `X-Aspnet-Version` 头。对于 API 路由，此头没有多大用途，我们也不建议你向 API 路由添加 `X-Powered-By` 之类的替代头，因为它会不必要地暴露你正在运行的代码的内部信息。

如果你的 API 路由以自定义 `X-Frame-Options` 头响应，这些头会自动转换为响应中的 `Content-Security-Policy` 指令。

## 崩溃页面

如果你的 API 路由抛出未处理的 JavaScript 错误，这会被视为“崩溃”，因为你的 API 路由无法交付错误。

在这些情况下，EAS Hosting 会以错误页面响应。如果发送了 `Accept: text/html` 请求头，错误页面会渲染为 HTML 响应。否则，它只会以纯文本响应。

## 请求头

**EAS Hosting** 会在把每个请求转发到你的 API 路由之前，向其添加以下头。这些头通常会补充关于是谁发起请求的更多信息。

| 请求头 | 说明 |
| --- | --- |
| `Forwarded` | 以逗号分隔的列表，其中每一项是以分号分隔的 `for`、`host` 和 `proto` 参数。更多信息见 MDN 文档中的 [HTTP `Forwarded` 头](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded)。 |
| `X-Forwarded-For` | 给定请求的转发方 IP 的逗号分隔列表 |
| `X-Forwarded-Proto` | 发起请求所用的协议。通常为 `https` |
| `X-Forwarded-Host` | 传入请求的主机名 |
| `X-Real-IP` | 传入请求的 IP 地址 |
| `Origin` | 传入请求的 URL Origin |
| `Host` | 被转发请求的主机名（与 `request.url` 的主机名匹配） |
| `eas-colo` | 处理该请求的 Cloudflare 数据中心代码。例如 `lhr` |
| `eas-ip-continent` | 客户端的两字母大洲代码。取值为：`AF`、`AN`、`AS`、`EU`、`NA`、`OC` 或 `SA` |
| `eas-ip-country` | 客户端的 ISO-3166 Alpha 2 格式国家代码。例如 `US` 或 `JP` |
| `eas-ip-region` | 客户端的 ISO-3166-2 格式地区代码，最长三个字符 |
| `eas-ip-city` | 客户端的人类可读城市名称（可选）。例如 `London` 或 `Chicago` |
| `eas-ip-latitude` | 对客户端纬度的最佳估计（可选） |
| `eas-ip-longitude` | 对客户端经度的最佳估计（可选） |
| `eas-ip-timezone` | 客户端的时区。例如 `Europe/London` |
| `eas-ip-eu` | 当请求很可能源自欧盟司法管辖区域时设为 `1` |

### 请求 URL 与来源

EAS Hosting 把来自若干主机名的请求路由到你的部署。[别名](/eas/hosting/deployments-and-aliases)和[自定义域名](/eas/hosting/custom-domain)意味着，客户端用来发起请求的**传入** URL，与你的 API 路由收到的**目标** URL 之间可能存在差异。

例如，客户端可能向别名 URL（例如 `https://my-app--staging.expo.app/`）发起请求，而将收到该请求的 worker 部署的 URL 会包含其部署 ID，例如 `https://my-app--or1170q9ix.expo.app/`。

这种差异也存在于你在 API 路由中收到的 `Request` 的 URL 和头中。`request.url` 会是你的 worker 部署的 URL，而 `Origin` 和 `X-Forwarded-Host` 头会被设为客户端用来发起请求的传入 URL。

```js
export async function GET(request) {
  request.url; // 'https://my-app--or1170q9ix.expo.app/'
  request.headers.get('Origin'); // 'https://my-app--staging.expo.app/'
  request.headers.get('X-Forwarded-Host'); // 'my-app--staging.expo.app'
  origin; // 'https://my-app--staging.expo.app/'
}
```

### IP 头

请求包含若干头，用于识别发起请求的用户设备的 IP 地址：

- `Forwarded` 包含以逗号分隔的列表，其中每一项是以分号分隔的参数。列表中的每一项代表转发该请求的一个代理。因此，第一项的 `for` 参数很可能是原始客户端的 IP 地址。
- `X-Forwarded-For` 只包含 IP 地址的逗号分隔列表。列表中的每一项同样代表转发该请求的一个代理。
- `X-Real-IP` 只包含原始请求的 IP 地址

例如，要获取调用你的 API 路由的用户浏览器的 IP 地址，从请求中读取 `X-Real-IP` 头：

```js
export async function GET(request) {
  const ip = request.headers.get('X-Real-IP');
}
```

### 地理头

请求还包含若干头，其中有关于请求来源地理位置的信息：

- `eas-colo` 包含处理你的请求的数据中心的 Cloudflare 代码。例如 `lhr`。
- `eas-ip-continent` 包含当前请求的大洲代码：
  - `AF` 表示非洲
  - `AN` 表示南极洲
  - `AS` 表示亚洲
  - `EU` 表示欧洲
  - `NA` 表示北美洲
  - `OC` 表示大洋洲
  - `SA` 表示南美洲。
- `eas-ip-country` 包含 ISO-3166 Alpha 2 国家代码。它最多两个字母。例如 `US` 或 `JP`。
- `eas-ip-region` 包含请求的 ISO-3166-2 地区代码。此值最长三个字符。不过，它会根据特定国家的地区代码对所请求来源的工作方式而变化。它可以由一到三位数字、一到三个字母或任何其他组合组成。
- `eas-ip-city` 可能包含城市的人类可读名称。例如 `London` 或 `Chicago`。
- `eas-ip-latitude` 和 `eas-ip-longitude` 包含请求的近似纬度和经度。
- `eas-ip-timezone` 包含对请求来源时区的最佳估计。例如 `Europe/London`
- `eas-ip-eu` 在请求很可能源自欧盟司法管辖区域时设为 `1`。
