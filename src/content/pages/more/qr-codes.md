---
title: qr.expo.dev
description: qr.expo.dev 二维码生成器参考。
---

# qr.expo.dev

qr.expo.dev 是一个云函数，用于生成带 Expo 品牌的二维码。该函数为 [EAS Update](/eas-update/introduction) 创建二维码，用于在[开发构建](/develop/development-builds/introduction)和 Expo Go 中预览更新。

例如，如果你和团队有一个开发构建，并想在某个构建渠道上加载最新更新，可以访问下面的端点来生成二维码：

```text
https://qr.expo.dev/eas-update?projectId=your-project-id&runtimeVersion=your-runtime-version&channel=your-channel
```

这会生成下面的二维码 SVG：

![由 qr.expo.dev 生成的二维码](https://qr.expo.dev/eas-update?slug=your-slug&projectId=your-project-id&runtimeVersion=your-runtime-version&channel=your-channel)

该二维码表示下面的 URL：

```text
exp+your-slug://expo-development-client/?url=https://u.expo.dev/your-project-id?runtime-version=your-runtime-version&channel-name=your-channel
```

这个 URL 会深层链接到开发构建，并指示它获取指定渠道上的最新更新。

:::note
如果分享 URL 更方便，可以在查询参数中加上 `format=url`，直接请求该 URL。
:::

## 通用

下面的参数适用于 `/eas-update` 端点。

### 基础查询参数

下面的基础查询参数可以包含在对 `/eas-update` 的任何请求中。

| 参数 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `slug` | 否 | exp | 使用[应用配置](/workflow/configuration)中的 [`slug`](/versions/latest/config/app#slug) 来指向开发构建。否则使用 “exp” 以指向 Expo Go。 |
| `appScheme`（已弃用） | 否 | exp | 已被 `slug` 取代。请改用 `slug`。 |
| `host` | 否 | u.expo.dev | 处理更新请求的服务器主机名。 |
| `format` | 否 | svg | 端点默认返回 SVG。要接收纯文本 URL，使用 `url`。 |

### 按设备特征更新

预览和生产构建会带着 `runtimeVersion` 和 `channel` 属性向 EAS Update 服务发请求。你可以用下面的查询参数模拟这一行为：

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `projectId` | 是 | 项目的 ID |
| `runtimeVersion` | 是 | 构建的[运行时版本](/eas-update/runtime-versions) |
| `channel` | 是 | 构建的渠道名称 |

#### 示例

```text
https://qr.expo.dev/eas-update?projectId=your-project-id&runtimeVersion=your-runtime-version&channel=your-channel
```

### 按 ID 更新

可以根据特定于平台的更新 ID，为某一次更新创建二维码。

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `updateId` | 是 | 更新的 ID |

#### 示例

```text
https://qr.expo.dev/eas-update?updateId=your-update-id
```

### 按组 ID 更新

可以根据更新的组 ID，为一个更新组创建二维码。

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `projectId` | 是 | 项目的 ID |
| `groupId` | 是 | 更新组的 ID |

#### 示例

```text
https://qr.expo.dev/eas-update?projectId=your-project-id&groupId=your-update-id
```

### 按分支 ID 更新

可以用分支 ID 创建二维码，它会返回该分支上可用的最新更新。

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `projectId` | 是 | 项目的 ID |
| `branchId` | 是 | 分支的 ID |

#### 示例

```text
https://qr.expo.dev/eas-update?projectId=your-project-id&branchId=your-branch-id
```

### 按渠道 ID 更新

可以用渠道 ID 创建二维码，它会返回映射到该渠道的一个或多个分支上可用的最新更新。

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `projectId` | 是 | 项目的 ID |
| `channelId` | 是 | 渠道的 ID |

#### 示例

```text
https://qr.expo.dev/eas-update?projectId=your-project-id&channelId=your-channel-id
```
