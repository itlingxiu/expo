---
title: Expo Updates v1
description: 版本 1
---

# Expo Updates v1

## 简介

这是 Expo Updates 的规范，一种向运行在多个平台上的 Expo 应用交付更新的协议。

### 一致性

符合规范的服务器和客户端库必须满足所有规范性要求。本文档通过描述性断言和含义明确的关键词来描述一致性要求。

规范性部分中的关键词 “MUST”、“MUST NOT”、“REQUIRED”、“SHALL”、“SHALL NOT”、“SHOULD”、“SHOULD NOT”、“RECOMMENDED”、“MAY” 和 “OPTIONAL” 应按 [IETF RFC 2119](https://tools.ietf.org/html/rfc2119) 中的描述解释。这些关键词可以以小写形式出现，除非明确声明为非规范性，否则仍保留其含义。

本协议的符合实现 MAY 提供额外功能，但在明确禁止或会导致不符合规范的地方 MUST NOT 这样做。在相关情况下，符合规范的客户端应当允许并忽略未知字段。

### 概述

符合规范的服务器和客户端库 MUST 遵循 [RFC 7231](https://tools.ietf.org/html/rfc7231) 中描述的 HTTP 规范，以及本规范中描述的更精确指导。

- _更新（update）_ 定义为 [_清单_](#清单正文) 以及清单内引用的资源。
- [_指令（directive）_](#指令正文) 定义为来自服务器、指示客户端执行某个动作的消息。

Expo Updates 是一种组装并向客户端交付更新和指令的协议。

本规范的主要读者是 Expo Application Services，以及希望管理自己的更新服务器以满足内部要求的组织。

## 客户端

> 见[参考客户端库](https://github.com/expo/expo/tree/main/packages/expo-updates)。

运行符合规范的 Expo Updates 客户端库的应用 MUST 加载客户端库更新数据库中保存的最新 _更新_，可能先根据更新清单的 [_metadata_](#清单正文) 内容进行过滤。

以下描述符合规范的 Expo Updates 客户端库 MUST 如何从符合规范的服务器检索新更新：

1. 客户端库 MUST 发出[请求](#请求)以获取最新更新和指令，约束在请求头中指定。
2. 如果收到[响应](#响应)，客户端库 MUST 处理其内容：
   - 对于包含 _更新_ 的响应，客户端库 SHALL 继续发出额外请求，下载并存储清单中指定的任何新资源。清单和资源一起被视为新的 _更新_。客户端库会编辑其本地状态，以反映新更新已添加到本地存储。它还会用响应[头](#通用响应头)中找到的新 `expo-manifest-filters` 和 `expo-server-defined-headers` 更新本地状态。
   - 对于包含 _指令_ 的响应，客户端库会根据指令类型消费该指令，并相应地编辑其本地状态。

## 请求

符合规范的客户端库 MUST 发出带有以下请求头的 GET 请求：

1. `expo-protocol-version: 1`，用于指定此 Expo Updates 规范的版本 1。
2. `expo-platform`，用于指定客户端正在运行的平台类型。
   - iOS MUST 为 `expo-platform: ios`。
   - Android MUST 为 `expo-platform: android`。
   - 如果不是这些平台之一，服务器 SHOULD 返回 400 或 404
3. `expo-runtime-version` MUST 是与客户端兼容的运行时版本。运行时版本规定客户端正在运行的原生代码设置。它应在构建客户端时设置。例如，在 iOS 客户端中，该值可以在 plist 文件中设置。
4. 先前响应的[服务器定义的请求头](#响应)所规定的任何请求头。

符合规范的客户端库 MAY 根据[支持的响应结构](#响应)发送 `accept: application/expo+json`、`accept: application/json` 或 `accept: multipart/mixed` 之一，不过它 SHOULD 发送 `accept: application/expo+json, application/json, multipart/mixed`。符合规范的客户端库 MAY 使用 [RFC 7231](https://datatracker.ietf.org/doc/html/rfc7231#section-5.3.1) 中指定的 “q” 参数表达偏好，其默认值为 `1`。

配置为执行[代码签名](#代码签名)验证的符合规范客户端库 MUST 发送 `expo-expect-signature` 请求头，以表明它期望符合规范的服务器在清单响应中包含 `expo-signature` 请求头。`expo-expect-signature` 是一个 [Expo SFV](/technical-specs/expo-sfv-0) 字典，MAY 包含以下任意键值对：

- `sig` SHOULD 包含布尔值 `true`，以表明它要求符合规范的服务器在 `sig` 键中响应签名。
- `keyid` SHOULD 包含客户端将用于验证签名的公钥的 keyId
- `alg` SHOULD 包含客户端将用于验证签名的算法

示例：

```text
expo-protocol-version: 1
accept: application/expo+json;q=0.9, application/json;q=0.8, multipart/mixed
expo-platform: *
expo-runtime-version: *
expo-expect-signature: sig, keyid="root", alg="rsa-v1_5-sha256"
```

## 响应

符合规范的服务器 MUST 返回至少采用以下两种响应结构之一的响应，MAY 支持其中一种或两种响应结构，并且当请求了不支持的响应结构时，服务器 SHOULD 以 HTTP `406` 错误状态响应。希望对所请求的协议版本返回不兼容响应的服务器 SHOULD 也以 HTTP `406` 错误状态响应。

- 对于 `content-type: application/json` 或 `content-type: application/expo+json` 的响应，[通用响应头](#通用响应头)和[其他响应头](#其他响应头) MUST 在响应头中发送，[清单正文](#清单正文) MUST 在响应正文中发送。此响应格式不支持多个响应部分，因此不支持 _指令_，并且当要提供的最新响应不是 _更新_ 时 SHOULD 以 HTTP `406` 错误状态响应。
- 对于 `content-type: multipart/mixed` 的响应，响应 MUST 按[多部分响应](#多部分响应)一节的规定组织。
- 没有部分的[多部分响应](#多部分响应) MAY 以 HTTP `204` 状态且无内容响应，因此也没有 `content-type` 响应头。

更新和请求头的选择取决于请求头的值。符合规范的服务器 MUST 以创建时间排序、满足[请求头](#请求)施加的所有参数和约束的最新更新进行响应。服务器 MAY 使用请求的任何属性（如其请求头和源 IP 地址）在都满足请求约束的多个更新中进行选择。

### 通用响应头

```text
expo-protocol-version: 1
expo-sfv-version: 0
expo-manifest-filters: <expo-sfv>
expo-server-defined-headers: <expo-sfv>
cache-control: *
content-type: *
```

- `expo-protocol-version` 描述本规范中定义的协议版本，MUST 为 `1`。
- `expo-sfv-version` MUST 为 `0`。
- `expo-manifest-filters` 是一个 [Expo SFV](/technical-specs/expo-sfv-0) 字典。它用于按[清单](#清单正文)中找到的 `metadata` 属性过滤客户端库存储的更新。如果过滤器中提到某个字段，则元数据中的对应字段必须缺失或相等，该更新才会被包含。客户端库 MUST 存储清单过滤器，直到它被更新的响应覆盖。
- `expo-server-defined-headers` 是一个 [Expo SFV](/technical-specs/expo-sfv-0) 字典。它定义客户端库 MUST 存储直到被更新的字典覆盖的请求头，并且它们 MUST 包含在每个后续的[更新请求](#请求)中。
- `cache-control` MUST 设置为适当短的时间段。建议使用 `cache-control: private, max-age=0`，以确保返回最新清单。设置更长的缓存时间可能导致过期更新。
- `content-type` MUST 由 [RFC 7231](https://tools.ietf.org/html/rfc7231#section-3.4.1) 中定义的 _主动协商_ 确定。由于客户端库在每次清单请求时都[必须](#请求)发送 `accept` 请求头，这将始终是 `application/expo+json` 或 `application/json`；否则请求会返回 `406` 错误。

### 其他响应头

```text
expo-signature: *
```

- 如果清单请求包含 `expo-expect-signature` 请求头，`expo-signature` SHOULD 包含要在[代码签名](#代码签名)验证步骤中使用的清单签名。这是一个 [Expo SFV](/technical-specs/expo-sfv-0) 字典，MAY 包含以下任意键值对：
  - `sig` MUST 包含清单的签名。此字段的名称与 `expo-expect-signature` 的名称匹配。
  - `keyid` MAY 包含服务器用于签署响应的密钥的 keyId。客户端 SHOULD 使用与此 `keyid` 匹配的证书来验证签名。
  - `alg` MAY 包含服务器用于签署响应的算法。客户端 SHOULD 仅在此字段与匹配 `keyid` 的证书所定义的算法一致时使用它。

### 多部分响应

此格式的更新响应由 [RFC 2046](https://tools.ietf.org/html/rfc2046#section-5.1) 定义的 `multipart/mixed` MIME 类型定义。

此响应格式的请求头是[通用响应头](#通用响应头)，但有以下例外：

- `content-type` SHOULD 具有 [RFC 2046](https://tools.ietf.org/html/rfc2046#section-5.1) 定义的 `multipart/mixed` 值

部分的顺序并不严格。没有部分（零长度正文）的多部分响应应被视为空操作（没有可用的更新或指令），不过响应的请求头 SHOULD 仍然发送并由客户端处理。

每个部分定义如下：

1. 可选的 `"manifest"` 部分：
   - MUST 具有部分头 `content-disposition: form-data; name="manifest"`。第一个参数（`form-data`）不必是 `form-data`，但 `name` 参数的值必须为 `manifest`。
   - MUST 具有部分头 `content-type: application/json` 或 `application/expo+json`。
   - 如果正在使用代码签名，SHOULD 具有[其他响应头](#其他响应头)中定义的部分头 `expo-signature`。
   - [清单正文](#清单正文) MUST 在部分正文中发送。
2. 可选的 `"extensions"` 部分：
   - MUST 具有部分头 `content-disposition: form-data; name="extensions"`。第一个参数（`form-data`）不必是 `form-data`，但 `name` 参数的值必须为 `extensions`。
   - MUST 具有部分头 `content-type: application/json`。
   - [扩展正文](#扩展正文) MUST 在部分正文中发送。
3. 可选的 `"directive"` 部分：
   - MUST 具有部分头 `content-disposition: form-data; name="directive"`。第一个参数（`form-data`）不必是 `form-data`，但 `name` 参数的值必须为 `directive`。
   - MUST 具有部分头 `content-type: application/json` 或 `application/expo+json`。
   - 如果正在使用代码签名，SHOULD 具有[其他响应头](#其他响应头)中定义的部分头 `expo-signature`。
   - [指令正文](#指令正文) MUST 在部分正文中发送。

### 清单正文

定义为同时符合以下用 [TypeScript](https://www.typescriptlang.org/) 表达的 `Manifest` 定义以及每个字段详细描述的 JSON：

```ts
type Manifest = {
  id: string;
  createdAt: string;
  runtimeVersion: string;
  launchAsset: Asset;
  assets: Asset[];
  metadata: { [key: string]: string };
  extra: { [key: string]: any };
};

type Asset = {
  hash?: string;
  key: string;
  contentType: string;
  fileExtension?: string;
  url: string;
};
```

- `id`：ID MUST 唯一指定清单，并且 MUST 是 UUID。
- `createdAt`：更新创建的日期和时间至关重要，因为客户端库会选择最新更新（受 `expo-manifest-filters` 请求头提供的任何约束限制）。日期时间应按 [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) 格式化。
- `runtimeVersion`：可以是开发者定义的任何字符串。它规定运行关联更新所需的原生代码设置。
- `launchAsset`：作为应用代码入口点的特殊资源。此资源的 `fileExtension` 字段将被忽略，并且 SHOULD 省略。
- `assets`：更新 bundle 使用的资源数组，例如 JavaScript、图片和字体。所有资源（包括 `launchAsset`）都应在执行更新之前下载到磁盘，并且应向应用代码提供资源 `key` 到磁盘位置的映射。
- 每个资源对象的属性：
  - `hash`：文件的 Base64URL 编码 SHA-256 哈希，用于保证完整性。Base64URL 编码由 [IETF RFC 4648](https://datatracker.ietf.org/doc/html/rfc4648#section-5) 定义。
  - `key`：用于从更新的应用代码引用此资源的键。例如，此键可能由处理应用代码的单独构建步骤（如打包器）生成。
  - `contentType`：由 [RFC 2045](https://tools.ietf.org/html/rfc2045) 定义的文件 MIME 类型。例如 `application/javascript`、`image/jpeg`。
  - `fileExtension`：文件保存在客户端时建议使用的扩展名。某些平台（如 iOS）要求某些文件类型以带扩展名的形式保存。扩展名 MUST 以 `.` 为前缀。例如 **.jpeg**。在某些情况下（如 launchAsset），此字段会被忽略，而采用本地确定的扩展名。如果省略该字段且没有本地规定的扩展名，资源将不带扩展名保存。例如末尾没有 `.` 的 `./filename`。
    如果文件扩展名非空且缺少 `.` 前缀，符合规范的客户端 SHOULD 为文件扩展名加上 `.` 前缀。
  - `url`：可以获取该文件的位置。
- `metadata`：与更新关联的元数据。它是值为字符串的字典。服务器 MAY 发回它希望用于过滤更新的任何内容。元数据 MUST 通过随附的 `expo-manifest-filters` 请求头中定义的过滤器。
- `extra`：用于存储可选的“额外”信息，例如第三方配置。例如，如果更新托管在 Expo Application Services（EAS）上，可以包含 EAS 项目 ID：

  ```json
  "extra": {
    "eas": {
      "projectId": "00000000-0000-0000-0000-000000000000"
    }
  }
  ```

### 扩展正文

定义为同时符合以下用 [TypeScript](https://www.typescriptlang.org/) 表达的 `Extensions` 定义以及每个字段详细描述的 JSON：

```ts
type Extensions = {
  assetRequestHeaders: ExpoAssetHeaderDictionary;
  ...
}

type ExpoAssetHeaderDictionary = {
  [assetKey: string]: {
    [headerName: string]: string,
  };
}
```

- `assetRequestHeaders`：MAY 包含要随资源请求一起包含的请求头（键、值）对字典。键和值 MUST 都是字符串。

### 指令正文

定义为同时符合以下用 [TypeScript](https://www.typescriptlang.org/) 表达的 `Directive` 定义以及每个字段详细描述的 JSON：

```ts
type Directive = {
  type: string;
  parameters?: { [key: string]: any };
  extra?: { [key: string]: any };
};
```

- `type`：指令的类型。
- `parameters`：MAY 包含特定于 `type` 的任何额外信息。
- `extra`：用于存储可选的“额外”信息，例如第三方信息。例如，如果更新托管在 Expo Application Services（EAS）上，可以包含 EAS 项目 ID。

符合规范的客户端库和服务器 MAY 指定并实现特定于应用需求的指令类型。例如，Expo Application Services 迄今使用一种类型 `rollBackToEmbedded`，它指示 expo-updates 库使用嵌入在宿主应用中的更新，而不是任何其他已下载的更新。

## 资源请求

符合规范的客户端库 MUST 向清单指定的资源 URL 发出 GET 请求。客户端库 SHOULD 包含一个接受清单中指定的资源内容类型的请求头。此外，客户端库 SHOULD 指定它能够处理的压缩编码。

示例请求头：

```text
accept: image/jpeg, */*
accept-encoding: br, gzip
```

符合规范的客户端库 MUST 还包含此资源键在 [`assetRequestHeaders`](#扩展正文) 中包含的任何请求头（键、值）对。

## 资源响应

位于特定 URL 的资源 MUST NOT 被更改或移除，因为客户端库可能在任何时候为任何更新获取资源。符合规范的客户端 MUST 验证资源的 base64url 编码 SHA-256 哈希与清单中该资源的 `hash` 字段匹配。

### 资源响应头

资源 MUST 使用客户端根据请求的 `accept-encoding` 请求头所支持的压缩格式进行编码。服务器 MAY 提供未压缩的资源。响应 MUST 包含带有资源 MIME 类型的 `content-type` 请求头。
例如：

```text
content-encoding: br
content-type: application/javascript
```

建议为资源设置持续时间较长的 `cache-control` 请求头，因为位于给定 URL 的资源不得更改。例如：

```text
cache-control: public, max-age=31536000, immutable
```

### 压缩

资源 SHOULD 能够以 [Gzip](https://www.gnu.org/software/gzip/) 和 [Brotli](https://github.com/google/brotli) 压缩提供。

## 代码签名

Expo Updates 支持对清单和指令正文进行代码签名。对清单进行代码签名也会传递性地签署资源，因为它们的哈希存在于清单中，并由符合规范的客户端验证。符合规范的客户端 MAY 请求使用私钥签署清单或指令，然后 MUST 在使用清单或指令、或下载任何对应的清单资源之前，使用相应的代码签名证书验证清单或指令的签名。客户端 MUST 验证签名证书要么是自签名的受信任根证书，要么位于由受信任根证书签名的证书链中。无论哪种情况，根证书 MUST 嵌入在应用或设备的操作系统中。
