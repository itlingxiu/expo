---
title: EAS Hosting 部署中的缓存
description: 了解 EAS Hosting 上的缓存如何工作。
---

# EAS Hosting 部署中的缓存

## 使用 API 路由进行缓存

API 路由可以返回 `Cache-Control` 指令，EAS Hosting 会根据缓存指令的值适当地缓存响应。

```js
export async function GET(request) {
  return Response.json({ ... }, {
    headers: {
      'Cache-Control': 'public, max-age=3600'
    },
  });
}
```

响应中出现的 `Cache-Control` 指令会被 EAS Hosting 按指定方式用于缓存该响应。例如，如果 `Response` 指定的缓存指令把 `max-age` 设为 1800 秒，响应会在再次调用 API 路由之前被缓存指定的时间。

关于 `Cache-Control` 指令的更多细节，请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)。

## Cache-Control 指令

`Cache-Control` 头可以作为请求头和响应头的一部分发送，它是一串以逗号分隔的设置。

当请求发送 `Cache-Control` 头时，它通常发送的是约束如何交付已缓存响应的指令。如果它作为响应头发送，则向 EAS Hosting 指定响应将如何被缓存，以及通过再次调用 API 路由来重新验证的频率。

如果缓存指令接受参数，指令后面会跟一个等号和参数值，例如 `max-age=3600`。如果指令不接受参数，则不带值列出，例如 `public`。

如果传递多个缓存指令，每个指令与上一个之间用逗号分隔，例如 `public, max-age=3600`。

## 可缓存性

若干响应指令决定已缓存的响应是否可以被缓存或返回给客户端：

- `public`：表示任何缓存（包括 EAS Hosting）都可以存储该响应。没有它时，隐含的含义是该响应不在多个请求之间共享。
- `private`：表示该响应面向单个用户，只能由浏览器缓存。
- `no-store` 或 `no-cache`：表示此响应永远不能被缓存或存储。

例如，指定 `public, max-age=3600` 表示允许 EAS Hosting（除用户浏览器之外）存储该响应 3600 秒。而 `private, max-age=3600` 表示只有用户的浏览器可以存储该响应 3600 秒，EAS Hosting 不会缓存它。

对于未设置 `Authorization` 头、并且方法为 `HEAD` 或 `GET` 的请求，其响应会被自动视为可公开缓存。

要区分浏览器和 EAS Hosting 可以缓存的内容，可以使用 `s-maxage` 指令。例如，以 `s-maxage=3600` 指令响应，将允许 EAS Hosting 缓存该响应 3600 秒，而用户的浏览器完全不会缓存它。

## 头名称

如上所示，Cache-Control 头既被浏览器接受和理解，也被 EAS Hosting 接受和理解。要更细粒度地、并且与用户浏览器分开地为 EAS Hosting 定制缓存，你可以用 CDN-Cache-Control 头来响应。使用此头时，它会隐式地把 public 加入你的指令，并强制 EAS Hosting 按照你的指令缓存响应。

```js
export async function GET(request) {
  return Response.json({ ... }, {
    headers: {
      'Cache-Control': 'no-store', // 浏览器绝不应当存储该响应
      'CDN-Cache-Control': 'max-age=3600', // EAS Hosting 应当缓存 3600 秒
    },
  });
}
```

## 过期指令

- `max-age` 用于指定响应被缓存多长时间后才被视为过期
- `s-maxage` 用于只向 EAS Hosting 表明它应当缓存响应多长时间
- `no-cache` 等价于把 max-age 指定为零
- `immutable` 用于表明响应可以无限期缓存，应当尽可能长时间缓存，并且永远不会被视为过期。

此外，还可以使用两个较新的缓存控制指令，来决定过期响应在为其指定的 `max-age` 之外还能使用多长时间。

- `stale-while-revalidate` 为响应指定一段过期时间。已缓存的响应被视为过期之后，它允许在指定时间范围内仍然把该响应返回给客户端，同时在后台重新验证请求。
  - 例如，`max-age=1800, stale-while-revalidate=3600` 指定响应被缓存 1800 秒。1800 秒之后，如果对此响应发起新请求，只要请求发生在 3600 秒之内就会返回它，但该请求也会在后台继续发送到你的 API 路由。
- `stale-if-error` 为响应指定一段过期时间，以便在底层 API 路由意外失败时仍然返回该响应。这有助于让 API 路由具备容错能力，适用于 API 路由因运行时错误崩溃，或返回 `500`、`502`、`503` 或 `504` 响应状态的情况。
  - 例如，`max-age=1800, stale-if-error=3600` 指定响应被缓存 1800 秒。1800 秒之后，如果你的 API 路由以错误响应，则会把过期的已缓存响应发送给客户端，而不是发送错误。

## 请求指令

`Cache-Control` 头可以作为请求头的一部分发送，并会影响 EAS Hosting 如何选择返回已缓存的响应。

- `only-if-cached` 只会在响应已被缓存时返回它，否则以 `504` 响应中止请求（带有 `must-revalidate` 指令）
- `no-store`、`no-cache` 或 `max-age=0` 会跳过已缓存的响应，并始终强制 EAS Hosting 忽略其请求缓存
- `min-fresh` 会在已缓存响应比指定值更旧时跳过它。例如，`min-fresh=360` 会阻止返回已被缓存超过 360 秒的响应。

此外，`max-stale` 和 `stale-if-error` 可以作为请求缓存指令的一部分发送，并限制已缓存响应的过期时间。不过请记住，这不会覆盖请求被缓存的时长，因此它只能用于**缩短**已缓存响应可接受的过期程度。

- `max-stale` 指定客户端接受已缓存响应时可接受的最长时间。例如，如果响应是用 `stale-while-revalidate=3600` 指令缓存的，请求可以指定 `max-stale=1800`，从而只接受过期时间最长为 1800 秒的过期响应（指其过期时段，而不是 `max-age`）
- `stale-if-error` 可用于自定义在 API 路由否则会以错误响应时，接受过期响应的时间段。

对于这两个指令，如果服务端响应在其 `max-age` 之上被缓存的时间，短于指定的 `max-stale` 或 `stale-if-error` 时段，那么这些指令不会起任何作用。

## 请求方法

除了缓存 `GET` 和 `HEAD` 请求之外，EAS Hosting 也支持缓存 `POST` 请求。

如果发送的 `POST` 请求的请求体小于 1MB，你的响应可以指定带有 `public` 指令的 `Cache-Control` 头，把该请求标记为可缓存。

## `Expires` 头

EAS Hosting 也支持使用较旧的 [`Expires` 头](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires)进行缓存。

由于这不会把响应标记为可公开缓存，它通常只用于未认证的 `GET` 响应。它可以指定一个 HTTP Date 值，表示响应被缓存到何时。在指定的时间戳之后，响应被视为过期。

## `Vary` 头

默认情况下：

- `GET` 或 `HEAD` 请求只按其 URL 缓存
- `POST` 请求只按其 URL 和请求体缓存

不过，你可以使用 `Vary` 头指定请求应当把请求头用作缓存键。例如，如果 API 路由以 `Vary: custom-header` 响应，那么只有当请求的 `custom-header` 头值与已缓存请求的 `custom-header` 值匹配时，才会使用已缓存的响应。

## CORS 缓存

对于许多 Web 请求，浏览器会用 `OPTIONS` 方法发起 CORS 请求，以确定路由的访问控制设置。

这些请求可以使用特殊的 `Access-Control-Max-Age` 头进行缓存。例如，`Access-Control-Max-Age: 3600` 会把 `OPTIONS` 响应缓存 3600 秒，这同时适用于浏览器和 EAS Hosting 缓存。这可以防止浏览器发出过多请求，也可以防止你的 API 路由因 CORS 请求被过于频繁地调用。

## 资源缓存

对于部署所响应的任何资源，浏览器缓存会应用默认的 3600 秒缓存时间。为了提高性能，每个部署的资源在内部会被无限期缓存。由于部署是不可变的，这不会影响你。

当你把新部署分配给别名时，EAS Hosting 会忽略其已缓存的资源。例如，当你把新部署提升到生产时，缓存会被忽略，你的资源响应应当立即切换到新部署。

## 计费与指标

EAS Hosting 按请求计费（以 100 万次请求为单位）。不过，已缓存的请求**仍然计入**你的配额，即使它们被 EAS Hosting 缓存，你也会为这些请求付费。

指标不受缓存影响。已缓存的请求会像任何其他请求一样被记录，EAS 仪表盘中的指标也会反映并代表已缓存的请求。
