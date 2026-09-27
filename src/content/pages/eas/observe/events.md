---
title: 用户定义的事件
description: 从应用记录具名事件，以跟踪在 EAS Observe 仪表盘中可见的自定义信号。
---

# 用户定义的事件

用户定义的事件让你可以从应用记录任意的具名事件。用它们跟踪内置性能指标未覆盖的、特定于你的应用的任何信号。

事件会持久化在设备上，分批处理，并在下一次刷新时作为 OpenTelemetry 日志记录发送。它们出现在 EAS Observe 仪表盘的 **Events** 页面上，也可以从 EAS CLI 查询。

## 记录事件

在应用的任何地方调用 `Observe.logEvent`：

```tsx
import { Observe } from 'expo-observe';

function handleOnboardingComplete() {
  Observe.logEvent('onboarding.completed');
}
```

第一个参数是事件名称。使用稳定的、以点分隔的标识符。仪表盘按精确名称对事件分组。

## 附加属性

传入 `attributes` 映射，以随事件记录上下文：

```tsx
Observe.logEvent('report.exported', {
  attributes: {
    format: 'csv',
    rowCount: 1248,
    durationMs: 532,
    filters: ['status:active', 'region:us-west'],
  },
});
```

支持的属性值类型：`string`、`number`、`boolean`、数组和嵌套对象。其他 JS 值（`Date`、`undefined`、函数）会被丢弃。

## 严重程度

事件默认的严重程度为 `"info"`。用 `severity` 选项覆盖它，以便把你想在仪表盘中单独呈现的警告或错误区分出来：

```tsx
Observe.logEvent('sync.failed', {
  severity: 'error',
  attributes: { reason: 'network_timeout' },
});
```

支持的严重程度，从低到高：`"trace"`、`"debug"`、`"info"`、`"warn"`、`"error"`、`"fatal"`。

## 正文

使用 `body` 提供一段自由形式的消息，作为结构化属性的补充：

```tsx
Observe.logEvent('cache.evicted', {
  body: 'Cache evicted because disk pressure exceeded the configured threshold.',
  severity: 'warn',
  attributes: { evictedItemCount: 42, freedBytes: 1048576 },
});
```

## 命名约定

- 使用小写、以点分隔的名称：`task.completed`、`onboarding.skipped`、`report.exported`。
- 选定一套词汇并坚持使用。仪表盘按精确事件名称分组，因此 `report_exported` 和 `report.exported` 会显示为不同的行。
- 避免在事件名称、属性键和属性值中包含个人身份信息（PII）。你传入的一切在仪表盘中可见，并会被发送到设备之外。

## 显示名称

使用 `displayName` 为仪表盘中的事件提供人类友好的标签：

```tsx
Observe.logEvent('onboarding.completed', {
  displayName: 'Onboarding completed',
});
```

:::note
你设置的显示名称只会在会话时间线视图中使用。
:::

![EAS Observe 会话时间线中带有自定义显示名称的事件。](/static/images/expo-observe/observe-log-event-display-name.webp)

![EAS Observe 会话时间线中带有自定义显示名称的事件。（深色）](/static/images/expo-observe/observe-log-event-display-name-dark.webp)

## SDK 和集成发出的事件

除了你自己的事件，你还可能看到 EAS Observe 及其集成发出的事件：

- 以 `expo.` 开头的事件名称保留给 EAS Observe 自身发出的事件。例如，当 iOS 向应用发出低内存警告时，会记录 `expo.memory.warning`。见[内存警告](/eas/observe/reference/metrics#内存警告)。`logEvent` 会丢弃使用该保留前缀的事件，并丢弃 `expo.` 命名空间中的属性键，同时在开发中记录一条警告。
- 已启用的集成会记录它们自己的事件。例如，[`expo-image` 集成](/eas/observe/integrations/expo-image)在图像以远大于屏幕可显示的尺寸解码时，会记录 `expo-image.oversized`。

## 查看事件

在仪表盘中：打开你的项目，并前往 [**Observe > Events**](https://expo.dev/accounts/[account]/projects/[project]/observe/events)。默认视图列出所选时间范围内不同的事件名称及其计数。点击事件名称可查看各个事件及其时间戳、属性和所属会话。

![EAS Observe 仪表盘中的事件页面，列出不同的事件名称及其计数。](/static/images/expo-observe/observe-events-light.webp)

![EAS Observe 仪表盘中的事件页面，列出不同的事件名称及其计数。（深色）](/static/images/expo-observe/observe-events-dark.webp)

从 CLI：

```sh
# 列出带计数的事件名称
eas observe:events

# 显示特定事件名称的各个事件
eas observe:events report.exported

# 显示所有名称下的全部事件（JSON 输出）
eas observe:events --all-events --json
```

运行 `eas observe:events --help` 查看标志的完整列表（时间范围、平台、会话 ID 等）。其他 `eas observe` 命令见[使用 EAS CLI 查询](/eas/observe/eas-cli)。
