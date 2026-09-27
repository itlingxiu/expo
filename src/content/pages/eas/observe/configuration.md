---
title: 配置 EAS Observe
description: 控制 EAS Observe 如何收集和发送指标，包括环境设置、开发模式、自定义端点以及数据接入。
---

# 配置 EAS Observe

在运行时配置 EAS Observe，以适配应用的构建设置、环境和数据路由。本页介绍如何在开发中启用指标、采样、使用自定义端点、按环境分离数据，以及从仪表盘关闭数据接入。运行时方法本身见 [`configure()`](/versions/latest/sdk/observe#configureconfig) 和 [`dispatchEvents()`](/versions/latest/sdk/observe#dispatchevents) API 参考。

## 采样

默认情况下，每次安装都会发送其指标。对于高流量应用，你可以把 `sampleRate` 设为 `0` 到 `1` 之间的值，对一部分安装进行采样：

```tsx
import { Observe } from 'expo-observe';

// 从大约 25% 的安装发送指标。
Observe.configure({
  sampleRate: 0.25,
});
```

采样决定对**每次安装是确定的**。对于给定的比率，每次安装要么永久在样本内，要么永久在样本外，因此该选择在应用启动之间保持稳定，你得到的是一致的一部分安装，而不是会话的随机子集。

值得了解的几点细节：

- `[0, 1]` 范围之外的值会被钳制到最近的边界。`0` 始终丢弃；`1` 始终发送。
- 样本外的设备会丢弃待发送的指标，而不是累积它们。之后降低比率不会追溯发送更早的会话。
- 采样依赖于 [`dispatchingEnabled`](/versions/latest/sdk/observe#observeconfig)。如果 `dispatchingEnabled` 为 `false`，无论 `sampleRate` 如何，都不会发送任何内容。

## 在开发中启用指标

默认情况下，从调试构建收集的指标不会被发送。要仍然发送它们（例如在测试 EAS Observe 集成时），调用 `configure()` 时把 `dispatchInDebug` 设为 `true`：

```tsx
import { Observe } from 'expo-observe';

Observe.configure({
  dispatchInDebug: true,
});
```

如果原生应用是调试构建，或者 JS 包是开发包（`__DEV__` 为 `true`），该构建就会被视为调试构建。此检测独立于 `environment` 值（见[环境](#环境)）。

`dispatchInDebug` 对发布构建没有影响，发布构建始终会发送（受 [`dispatchingEnabled`](/versions/latest/sdk/observe#observeconfig) 和 [`sampleRate`](#采样) 约束）。如果 `dispatchingEnabled` 为 `false`，或此次安装在样本外，则无论 `dispatchInDebug` 如何，都不会发送任何内容。

:::warning
仅在测试 EAS Observe 集成时启用此项。开发/调试性能与生产差异很大，因此收集开发/调试指标可能会扭曲仪表盘中显示的结果。
:::

## 自定义端点

EAS Observe 使用 OpenTelemetry 协议（OTLP）通过 HTTP 发送数据，载荷为 JSON。它把指标发送到 `<endpointUrl>/<project-id>/v1/metrics`，把日志发送到 `<endpointUrl>/<project-id>/v1/logs`，其中 `<project-id>` 是你的 EAS 项目 ID。这意味着你可以把 `endpointUrl` 设为兼容 OpenTelemetry 的后端或 OpenTelemetry Collector，把可观测性数据路由到那里。

要更改端点，在**应用配置**中设置 `endpointUrl` 值：

```json app.json
{
  "expo": {
    "extra": {
      "eas": {
        "observe": {
          "endpointUrl": "https://your-custom-endpoint.com"
        }
      }
    }
  }
}
```

端点 URL 在构建时被烘焙进应用的原生层，因此更改它需要重新生成原生代码。更新应用配置后，运行 `npx expo prebuild` 并创建新构建以应用更改。

该路径在标准的 `/v1/metrics` 和 `/v1/logs` OTLP 路径之前包含你的项目 ID。如果你的后端期望的是没有该前缀的标准 OTLP 路径，请把数据发送到一个 OpenTelemetry Collector，由它接收并重新导出到你的后端。

## 环境

所有指标都按环境分组。环境值默认从 `process.env.NODE_ENV` 派生（未设置时回退到 `'production'`）。要覆盖它，使用 [`configure({ environment })`](/versions/latest/sdk/observe#configureconfig)。

环境是附加到每条指标上的元数据标签，与包是如何构建的无关。要控制是否发送调试构建的指标，见[在开发中启用指标](#在开发中启用指标)。要全局禁用所有发送，使用 `configure({ dispatchingEnabled: false })`。

## 网络追踪

:::note
网络追踪需要 SDK 58 及更高版本。
:::

已完成的网络请求可以记录为追踪 span。记录默认关闭，因为每个 span 都会计入你的事件配额。用以下方式打开：

```ts
import { Observe } from 'expo-observe';

Observe.configure({ networkTraces: true });
```

传入一个对象，以便只记录你关心的请求。主机精确匹配且不区分大小写，因此不会隐含子域名。省略的字段匹配每个请求，空数组则不匹配任何请求：

```ts
Observe.configure({
  networkTraces: { filter: { hosts: ['api.myapp.com'], methods: ['GET', 'POST'] } },
});
```

对象形式默认会记录，除非你另有说明，因此设置 `enabled: false` 可以在保持筛选器已配置的同时不记录任何内容。

被关闭或被筛掉的请求永远不会进入本地数据库，因此不会存储任何内容，也不会导出任何内容。该设置适用于未来的请求，因此启动过程中更早记录的 span 仍会被发送。它也会在多次启动之间保持，因此下一次启动时，在 `configure` 运行之前观察到的请求会遵循你上次设置的值。

因为该值会保持，移除该选项要到下一次 `configure` 运行时才生效，而不是立即生效。较窄的 `hosts` 列表也是如此：它会继续抑制启动早期的请求，直到某次 `configure` 放宽它。

URL 在存储之前会被脱敏。URL 中的用户名和密码会被替换为 `REDACTED`，查询参数 `AWSAccessKeyId`、`Signature`、`sig`、`X-Amz-Signature`、`X-Amz-Credential`、`X-Amz-Security-Token` 和 `X-Goog-Signature` 也是如此。任何其他查询参数中的密钥会按原样存储。

## 关闭数据接入

上面的选项控制你的应用发送什么。你也可以在不发布应用更新的情况下，从服务器端停止 EAS Observe 接受数据，方法是使用 EAS 仪表盘中的 **Observe data ingestion** 开关：

- **账户级**：打开[账户设置](https://expo.dev/accounts/[account]/settings)并关闭 **Observe data ingestion**。这会暂停该账户中所有项目的接入。
- **项目级**：打开[项目设置](https://expo.dev/accounts/[account]/projects/[project]/settings)并关闭 **Observe data ingestion**。这只会暂停该项目的接入。

![EAS 仪表盘账户设置中的 Observe 数据接入开关。](/static/images/expo-observe/observe-data-ingestion-light.webp)

![EAS 仪表盘账户设置中的 Observe 数据接入开关。（深色）](/static/images/expo-observe/observe-data-ingestion-dark.webp)

接入暂停期间，EAS Observe 不接受你的应用发送的事件、指标或日志。已经接入的数据仍可在仪表盘和 CLI 中使用。把开关重新打开即可恢复接入。
