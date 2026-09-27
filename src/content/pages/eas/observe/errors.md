---
title: 错误报告
description: 从应用记录 JavaScript 错误和原生崩溃，并在 EAS Observe 仪表盘中调查堆栈跟踪。
---

# 错误报告

:::warning
EAS Observe 中的错误报告处于[预览](/more/release-statuses#preview)，并且需要 SDK 57 或更高版本。原生崩溃还需要 `expo-observe` 57.0.21 或更高版本。EAS Update 的 source map 等功能仍在后续计划中。
:::

`expo-observe` 库会在性能指标之外，记录来自应用的 JavaScript 错误和原生崩溃。错误会持久化在设备上，分批处理，并在下一次刷新时发送。它们出现在 EAS Observe 仪表盘的 **Errors** 页面上。

![EAS Observe 仪表盘的错误页面，显示无崩溃会话图表和不同错误的列表。](/static/images/expo-observe/observe-errors-light.webp)

![EAS Observe 仪表盘的错误页面，显示无崩溃会话图表和不同错误的列表。（深色）](/static/images/expo-observe/observe-errors-dark.webp)

## JavaScript 错误

JavaScript 错误通过三条路径捕获：未处理的错误会自动记录，渲染错误由 `ObserveErrorBoundary` 捕获，已处理的错误可以用 `Observe.reportError` 报告。

### 未处理的错误

未处理的 JavaScript 错误会自动记录。该库在首次导入时安装全局错误处理程序，因此不需要设置。React Native 自身的行为不变：开发中红框仍然出现，生产中致命错误仍然会终止应用。

要关闭自动记录，通过 [`configure()`](/versions/latest/sdk/observe#configureconfig) 把 `errorHandlingEnabled` 设为 `false`：

```tsx
import { Observe } from 'expo-observe';

Observe.configure({
  errorHandlingEnabled: false,
});
```

这只影响未处理的 JavaScript 错误。由 `ObserveErrorBoundary` 捕获的错误、用 `Observe.reportError` 报告的错误以及原生崩溃仍会被记录。

### 渲染错误

如果没有错误边界，渲染时抛出的错误会被全局错误处理程序记录为未处理错误。用 `ObserveErrorBoundary` 包裹一个子树，即可把它连同 React 组件堆栈一起记录，并在抛出错误的子树位置显示回退 UI：

```tsx
import { ObserveErrorBoundary } from 'expo-observe';

export default function FeedScreen() {
  return (
    <ObserveErrorBoundary
      fallback={({ error, resetError }) => <ErrorScreen error={error} onRetry={resetError} />}>
      <Feed />
    </ObserveErrorBoundary>
  );
}
```

`fallback` 属性接受 React 元素、`null`，或一个接收所抛出的 `error` 和 `resetError` 回调的函数。调用 `resetError()` 会清除已捕获的错误并重新挂载子节点，使它们从干净状态重新开始。

要在整个应用周围放置边界，把 `errorBoundaryFallback` 传给 `ObserveRoot` 组件，而不是手动包裹它：

```tsx src/app/_layout.tsx
import { ObserveRoot } from 'expo-observe';

export default function RootLayout() {
  return (
    <ObserveRoot errorBoundaryFallback={<FallbackScreen />}>
      <Stack />
    </ObserveRoot>
  );
}
```

没有任何边界捕获的渲染错误仍会被全局错误处理程序记录。

### 已处理的错误

你的代码捕获并恢复的错误既不会到达全局处理程序，也不会到达错误边界。用 `Observe.reportError` 报告它们：

```tsx
import { Observe } from 'expo-observe';

async function handleSync() {
  try {
    await syncCart();
  } catch (error) {
    Observe.reportError(error);
  }
}
```

`reportError` 接受任何抛出的值。`Error` 会贡献其名称、消息和堆栈跟踪。任何其他值（字符串、普通对象、数字）会被字符串化进消息，而没有堆栈跟踪。

避免在错误消息中包含个人身份信息（PII）。你报告的一切在仪表盘中可见，并会被发送到设备之外。

## 原生崩溃

原生崩溃会在你的 JavaScript 能够对它做出反应之前终止应用，因此报告会写在设备上，并在应用下一次启动时发送。使用 `expo-observe` 57.0.21 或更高版本时，原生崩溃会在 Android 和 iOS 上自动记录，不需要设置。它们在仪表盘中以 **Native** 来源出现。

在 Android 上，EAS Observe 记录未捕获的 Java 和 Kotlin 异常，包括 `Caused by` 链。在 Android 11 及更高版本上，它还会读取操作系统为你的应用保留的崩溃记录，这涵盖原生代码中的崩溃，例如 `SIGSEGV` 和 `SIGABRT`。

在 iOS 上，EAS Observe 使用 MetricKit 收集系统为你的应用生成的崩溃报告。这些报告涵盖 Mach 异常，例如 `EXC_BAD_ACCESS` 和 `EXC_BREAKPOINT`，以及 Unix 信号，例如 `SIGSEGV`、`SIGBUS` 和 `SIGTRAP`。在 iOS 17 及更高版本上，它们还涵盖未捕获的 Objective-C 和 Swift 异常。

:::note
原生崩溃不会在 tvOS 或 iOS 模拟器上记录。应用无响应（ANR）事件和内存不足终止在两个平台上都不会记录。
:::

## 调查错误

点击列表中的某个错误即可打开其详情。该页面显示错误发生的频率、影响多少用户、首次和最后一次出现的时间，以及它如何在各平台之间分布。

![EAS Observe 仪表盘的错误详情页面，显示原生崩溃的堆栈跟踪以及在它之前的会话记录。](/static/images/expo-observe/observe-error-details-light.webp)

![EAS Observe 仪表盘的错误详情页面，显示原生崩溃的堆栈跟踪以及在它之前的会话记录。（深色）](/static/images/expo-observe/observe-error-details-dark.webp)

摘要下方，**Occurrence** 一次步进查看各个报告，每个报告都带有它来自的应用版本、设备和操作系统。**Stack trace** 显示所选发生实例的帧，**Before the crash** 列出在它之前的最后会话记录。打开 **Session timeline** 可查看完整会话。使用 **Breakdown** 部分查看该错误影响哪些应用版本、操作系统、设备和地区，并点击某个值以按它筛选页面。

**Occurrences** 标签页列出该组中的每一份报告，因此你可以浏览错误出现在哪些版本和设备上。

### 交给 AI

在错误详情页面上选择 **Hand off to AI**，即可用编程 agent 开始调查该错误。它会准备一段提示，描述该错误、其堆栈跟踪、当前应用的筛选器，以及按版本、操作系统、设备和地区的明细。把提示直接发送给 Claude Code 或 Codex，或复制并粘贴到另一个助手中。

agent 使用该提示把堆栈跟踪映射到你的源代码，并用 `eas observe:` 命令拉取更多上下文，例如崩溃来自的会话。

## 符号化堆栈跟踪

在生产应用中，你的 JavaScript 会被打包并压缩。堆栈跟踪指向生成包中的行和列位置，而不是你的源文件。source map 把这些位置翻译回去。当某个构建存储了 source map 时，仪表盘会为每一帧显示原始文件、行和列，并在堆栈跟踪旁边链接该错误来自的构建。

如果该构建没有存储 source map，仪表盘会按原样显示所报告的堆栈跟踪。此时帧会引用压缩包中的位置，例如 `index.android.bundle:1:481231`，很难映射回你的代码。

### 使用 EAS Build 上传 source map

要为每次构建存储 source map，在 **eas.json** 的构建 profile 中把 `uploadSourceMaps` 设为 `true`：

```json eas.json
{
  "build": {
    "production": {
      "uploadSourceMaps": true
    }
  }
}
```

有了此设置，EAS Build 会上传打包应用 JavaScript 时产生的 source map。此后，从该构建报告的每个错误都可以符号化。不需要更改应用代码。

:::note
上传 source map 需要 EAS CLI 22.0.0 或更高版本，并且只适用于在 EAS Build 服务器上运行的构建。用 `eas build --local` 创建的本地构建不会上传 source map。
:::

source map 中嵌入的源代码（`sourcesContent`）会在上传前移除。只存储文件名和位置映射。如果上传失败，构建仍会完成，并在构建日志中显示警告。

### 原生堆栈跟踪

source map 只适用于 JavaScript。原生堆栈跟踪不会在仪表盘中符号化。

在 Android 上，来自 Java 和 Kotlin 异常的帧已经带有类、方法和行号。在 iOS 上，帧会在发生崩溃的设备上解析为符号名称，因此你看到的是函数名，但没有文件名或行号。无法解析的帧会显示为二进制名称和偏移量，例如 `MyApp + 19160`。

## 查看错误

打开你的项目，并前往 [**Observe** > **Errors**](https://expo.dev/accounts/[account]/projects/[project]/observe/errors)。

**Crash-free sessions** 卡片显示所选时间范围内、在没有致命错误的情况下结束的会话所占比例。它还显示无崩溃用户、致命和非致命计数，以及受影响的用户数。

**Distinct errors** 列出所选时间范围内记录的错误，并按错误分组。**Source** 列告诉你错误来自哪里：

| 来源 | 说明 |
| --- | --- |
| JavaScript | 由应用的 JavaScript 抛出的错误 |
| Native | Android 或 iOS 报告的原生代码崩溃 |
| Other | 由运行时的另一部分记录的错误 |

可以按来源、严重程度（**Fatal** 或 **Non-fatal**）、平台、环境和发布筛选列表。致命错误在应用下一次启动时报告，因此最近的崩溃可能需要一些时间才会出现。

## 仍在后续计划中

错误报告处于预览阶段，以下内容尚不可用：

- **EAS Update 的 source map**：运行 OTA 更新的应用所产生的错误会显示未符号化的堆栈跟踪。
- **原生崩溃的符号化**：上传调试符号（例如 Android ProGuard 映射和 iOS dSYM）尚不受支持。
