---
title: 客户端 ID
description: 读取 EAS Observe 在每条指标和事件上记录的 EAS 客户端 ID，并用它把数据与其他服务关联起来。
---

# 客户端 ID

EAS Observe 发送的每条指标、事件和日志记录都带有一个 **EAS 客户端 ID**：你的应用某一次安装的随机标识符。仪表盘和 EAS CLI 用它按安装对数据分组，`Observe.clientId` 把同一个值暴露给你的应用。

用它从另一个工具查找某次安装的 Observe 数据，例如崩溃报告工具、分析服务提供商或你自己的后端。

## 读取客户端 ID

`Observe.clientId` 在 Android 和 iOS 上是字符串，在 Web 上是 `null`：

```tsx
import { Observe } from 'expo-observe';

console.log(Observe.clientId);
// 'f81d4fae-7dec-41d0-a765-00a0c91e6bf6'
```

只要导入了 `expo-observe`，该值就可用。你不需要先调用 `configure()`。

## 与另一项服务关联

把客户端 ID 附加到你发送到别处的数据上。然后，当你在那项服务中发现问题，就可以在 EAS Observe 中查询同一次安装。

下面的示例把客户端 ID 连同一份报告发送到你自己的后端：

```tsx
import { Observe } from 'expo-observe';

async function reportFeedback(message: string) {
  await fetch('https://example.com/feedback', {
    method: 'POST',
    body: JSON.stringify({
      message,
      easClientId: Observe.clientId,
    }),
  });
}
```

崩溃报告和分析 SDK 通常为此提供标签、自定义属性或上下文字段。在启动时设置一次，然后用该值在 EAS Observe 中找到匹配的安装。

要反过来查找，带 `--json` 运行 [`eas observe:metrics`](/eas/observe/eas-cli#eas-observemetrics) 或 [`eas observe:events`](/eas/observe/eas-cli#eas-observeevents)。每个样本都包含其 `easClientId`。

## 客户端 ID 的行为

- ID 在设备上第一次有 EAS 客户端库需要它时生成，并存储在原生偏好设置中。它不从任何硬件或账户标识符派生。
- 它在应用启动、应用更新和 EAS Update 之间保持稳定。
- 它与应用中的其他 EAS 客户端库共享，例如 `expo-updates`。同一次安装在所有这些库中只有一个 ID。
- 当应用数据被清除或应用被重新安装时，它会改变，不过备份恢复（包括重新安装时的 Android Auto Backup）可以带上先前的 ID。

因为该 ID 标识的是一次安装而不是一个人，请把它视为假名数据。如果你把它发送给第三方服务，请确认你的隐私政策涵盖这种用途。

## 采样与客户端 ID

[`sampleRate`](/eas/observe/configuration#采样) 的决定从客户端 ID 派生，这就是为什么一次安装在多次启动之间会保持在样本内或样本外。无论该安装是否在样本内，`Observe.clientId` 都会返回该 ID，因此即使应用不发送任何指标，你也可以记录它。
