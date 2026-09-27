---
title: EAS Hosting worker 运行时
description: 了解 EAS Hosting worker 运行时以及 Node.js 兼容性。
---

# EAS Hosting worker 运行时

EAS Hosting 构建在 [Cloudflare Workers](https://developers.cloudflare.com/workers/) 之上。这是一个现代且强大的无服务器 API 平台，为全球范围内的无缝扩展、高可靠性和出色性能而构建。

Cloudflare Workers 运行时运行在 V8 JavaScript 引擎上，与为 Node.js 和 Chromium 中的 JavaScript 提供动力的引擎相同。不过，它的运行时与你在传统无服务器 Node.js 部署中可能习惯的方式有几处关键差异。

每个请求并不是在完整的 JavaScript 进程中运行，Workers 被设计为在小型 V8 isolate 中运行它们，这是 V8 运行时的一项特性。可以把它们看作单个 JavaScript 进程中的微型容器。

关于 Workers 如何工作的更多信息，见 [Cloudflare Workers](https://developers.cloudflare.com/workers/reference/how-workers-works/) 文档。

## Node.js 兼容性

Cloudflare 是 [Winter TC](https://wintertc.org/) 的一部分，它更接近浏览器和 service worker 中的 JavaScript 环境，而不是 Node.js。这类限制提供了比 Node.js 更精简、但仍然熟悉的运行时。这种通用运行时是如今许多 JavaScript 运行时支持的最低标准。

这意味着，你可能习惯使用的许多 Node.js API，或你使用的某些依赖，在 EAS Hosting 运行时中并不能直接使用。为了缓和这一过渡（因为并非所有依赖都已对 Web API 提供一等支持），存在 Node.js 兼容模块，可以在你的 API 路由中使用。

| Node.js 内置模块 | 支持情况 | 实现说明 |
| --- | --- | --- |
| `node:assert` | 支持 | |
| `node:async_hooks` | 支持 | |
| `node:buffer` | 支持 | |
| `node:crypto` | 支持 | 部分已弃用的算法不可用 |
| `node:console` | 部分支持 | 以功能不完整的 JS shim 提供 |
| `node:constants` | 支持 | |
| `node:diagnostics_channel` | 支持 | 部分已弃用的算法未实现 |
| `node:dns` | 支持 | `Resolver` 未实现，所有 DNS 请求都发送到 Cloudflare |
| `node:events` | 支持 | |
| `node:fs` | 支持 | 支持，使用内存文件系统 |
| `node:http` | 支持 | 支持，但不包括服务器功能 |
| `node:http2` | 部分支持 | 部分支持。不支持服务器功能 |
| `node:https` | 支持 | 支持，但不包括服务器功能 |
| `node:module` | 部分支持 | `SourceMap` 未实现，其余部分支持 |
| `node:net` | 部分支持 | `Server` 和 `BlockList` 未实现，客户端 socket 部分支持 |
| `node:os` | 支持 | 以 JS stub 提供，给出与 Linux 上 Node.js 匹配的模拟值 |
| `node:path` | 支持 | |
| `node:path/posix` | 支持 | |
| `node:path/win32` | 支持 | |
| `node:process` | 支持 | 以 JS stub 提供 |
| `node:punycode` | 不支持 | |
| `node:querystring` | 支持 | |
| `node:readline` | 不支持 | 以无功能的 JS stub 提供，因为 worker 没有 `stdin` |
| `node:stream` | 支持 | |
| `node:stream/consumers` | 支持 | |
| `node:stream/web` | 支持 | |
| `node:string_decoder` | 支持 | |
| `node:test` | 支持 | |
| `node:timers` | 支持 | |
| `node:tls` | 支持 | 支持，但不包括服务器功能 |
| `node:trace_events` | 部分支持 | 以无功能的 JS stub 提供 |
| `node:tty` | 支持 | 以 JS shim 提供，把输出重定向到 Console API |
| `node:url` | 支持 | |
| `node:util` | 支持 | |
| `node:util/types` | 支持 | |
| `node:worker_threads` | 不支持 | 以无功能的 JS stub 提供，因为 worker 不支持线程 |
| `node:zlib` | 支持 | |

这些模块通常提供对其 Node.js 对应模块的较低精度 polyfill 或近似实现。例如，`fs`、`http` 和 `https` 模块有额外限制，它们是 Node.js 兼容层，并不等同于在 Node.js 进程中运行它们。

上面列出的任何 Node.js 模块都可以像往常一样在 API 路由或 API 路由的依赖中使用，并会使用相应的兼容模块。不过，其中一些模块可能不提供任何实际功能，只是为了 shim API 以防止运行时崩溃。

这里没有提到的任何模块都不可用或不受支持，你的代码和你的任何依赖都不应当依赖它们被提供。

> 未来可能会添加更多 Node.js 兼容 shim，但本非详尽列表中未记录的所有 Node.js API 都不应期望能够工作。

## 全局对象

| JavaScript 运行时全局对象 | 支持情况 | 实现说明 |
| --- | --- | --- |
| `origin` | 支持 | 始终与传入请求的 `Origin` 头相同 |
| `process` | 支持 | |
| `process.env` | 支持 | 由 EAS Hosting 环境变量填充 |
| `process.stdout` | 支持 | 会把输出重定向到 Console API（`console.log`）以进行日志记录 |
| `process.stderr` | 支持 | 会把输出重定向到 Console API（`console.error`）以进行日志记录 |
| `setImmediate` | 支持 | |
| `clearImmediate` | 支持 | |
| `Buffer` | 支持 | 设为来自 `node:buffer` 的 `Buffer` |
| `EventEmitter` | 支持 | 设为来自 `node:events` 的 `EventEmitter` |
| `global` | 支持 | 设为 `globalThis` |
| `WeakRef` | 支持 | |
| `FinalizationRegistry` | 支持 | |
| `require` | 部分支持 | 支持外部 require，但仅限于已部署的 JS 文件和内置模块。不支持 Node 模块解析。 |
| `require.cache` | 不支持 | |
