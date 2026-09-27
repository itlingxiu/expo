---
title: 指标参考
description: EAS Observe 跟踪的每项性能指标的参考，包括概念和数据处理。
---

# 指标参考

EAS Observe 收集的性能指标、用于组织事件的核心概念（会话和用户），以及所收集数据如何保留的参考。

## 概念

### 会话

**会话**在应用进程启动时开始，在应用进程终止时结束。每个会话都有唯一标识符，并包含该次应用启动期间收集的全部指标。

### 用户

**用户**由每次应用安装唯一的匿名 ID 标识。此 ID：

- 在应用首次安装时生成
- 在应用更新之间保持
- 如果用户卸载并重新安装应用，则会被重置
- 不是个人身份信息（PII）

这让你能够看到同一用户跨多个会话的指标，而不收集个人数据。

## 指标

:::note
所有时长指标都以秒报告。
:::

### 冷启动时间

**它测量什么：** 从进程创建到系统完成分配内存、启动全新运行时环境、从磁盘加载应用的代码和资源，并在渲染 UI 之前初始化其组件的时间。这是最慢的一类启动，通常发生在全新安装、应用升级、设备重启之后，或操作系统为回收内存而杀死应用时。它是仅原生的指标，意味着你的 JavaScript 代码不影响此指标，但 React Native 运行时初始化包含在内。

此指标自动收集。

**如何改进：**

- 移除未使用的原生模块。
- 避免静态初始化器（Objective-C 中的 `+load` 方法、C++ 中的静态构造函数），以及添加它们的原生模块或配置插件。
- 保持应用的内存和 CPU 使用较低，以免操作系统在后台杀死进程。这本身不影响此指标，但会使后续启动成为热启动而不是冷启动。
- 如果你使用 `expo-updates` 并且 `fallbackToCacheTimeout` 非零，应用启动会阻塞以等待更新检查。把此值保持为 `0`（默认），或把 `checkOnLaunch` 设为 `NEVER` 或 `ERROR_RECOVERY_ONLY`，以避免延迟冷启动。

**我们的建议：** 低于 1.5 秒。

### 热启动时间

**它测量什么：** 当操作系统已经把应用进程放在内存中，只需要把它带回前台并重建视图层次时，就会发生热启动。与冷启动不同，大多数原生资源和服务已经在内存中，因此这类启动明显更快。

应用不能自行预热：操作系统根据系统压力和最近使用情况决定哪些进程留在内存中。你可以影响热启动的时长，但不能决定是否发生热启动。

此指标自动收集。

**如何改进：**

- 移除未使用的原生模块。
- 减少视图层次中的视图数量。操作系统必须在热启动时重建视图树，因此深层嵌套或臃肿的树需要更长时间才能恢复。

**我们的建议：** 低于 0.5 秒。

### 包加载时间

**它测量什么：** 加载 JavaScript 字节码并求值它的时长。从包开始加载时起，到包完成求值、在调用 [`runApplication`](https://reactnative.dev/docs/appregistry#runapplication) 之前结束。

此指标自动收集。

**如何改进：**

- 减小包体积：
  - 使用 tree shaking（自 Expo SDK 54 起默认启用），并遵循有助于 Metro 剥离不必要代码的规则。见[Tree shaking 与代码移除](/guides/tree-shaking)。
  - 分析 JavaScript 包以移除未使用的和大型依赖。见[使用 Expo Atlas 分析 JavaScript 包](/guides/analyzing-bundles)。
- 用 `React.lazy()` 延迟加载大型屏幕和组件。见[优化 JavaScript 加载](https://reactnative.dev/docs/optimizing-javascript-loading)。
- 避免在顶层作用域阻塞 JavaScript 线程：
  - 不要做繁重计算。
  - 推迟任何同步 I/O 操作（存储读写）。

**我们的建议：** 低于 0.3 秒。

### 首次渲染时间（TTR）

**它测量什么：** 从应用完成原生启动到根 React 组件首次在屏幕上渲染的时间。这是启动屏隐藏之后、React 渲染出实际内容的时刻。每个应用的目标都应当是尽快显示有意义的内容，即使只是骨架加载屏。

当你用根 HOC 包裹根布局时，此指标会自动收集（见[开始使用](/eas/observe/get-started)）：

**如何改进：**

- 缩短包加载时间（见上文）。
- 避免同步 I/O 操作（存储读写）。
- 避免阻塞在网络请求上。
- 保持初始渲染树较小（推迟重型组件）。
- 使用轻量屏幕作为初始路由。
- 尽量减少会阻塞渲染的 `useEffect` 和 `useLayoutEffect` 链。

**我们的建议：** 包含冷启动时间在内低于 2 秒。

### 可交互时间（TTI）

**它测量什么：** 从热/冷启动到用户真正能够点击、滚动并以其他方式与应用交互的时间。它是最重要的启动指标，因为用户感知到的“应用已就绪”就是它。

此指标不会自动报告。要开始测量它，在屏幕准备好供用户交互时调用一次 `markInteractive()`，例如在初始数据加载之后运行的 `useEffect` 中。如果你的应用使用深层链接，主屏幕可能并不总是初始屏幕，因此我们建议在其他屏幕上也调用此函数。每次启动只记录第一次调用，因此多次调用是安全的（例如用户在屏幕之间导航时）。如果你使用 `expo-router`，该指标的事件会自动包含当前路由名称。

:::tabs
:::tab SDK 56 及更高版本
在组件内部从 `useObserve()` 钩子调用 `markInteractive()`。
:::
:::tab SDK 55
在应用的任何地方调用 `AppMetrics.markInteractive()`。
:::
:::

**什么使应用“可交互”？**

以下各项都必须为真：

- 内容已渲染在屏幕上（不只是启动屏或骨架）。
- 触摸处理程序已挂接并且有响应。
- 导航可用。

**如何提高测量准确性：** 只在屏幕内容已加载且触摸处理程序已激活之后调用 `markInteractive()`，而不是仅仅在组件挂载时调用。如果你的屏幕在变得可用之前要获取数据，请把调用放在数据就绪之后。

**如何改进：**

- 缩短首次渲染时间（见上文）。
- 避免在显示可交互内容之前出现瀑布式数据获取。
- 优化初始网络请求。
- 避免渲染大型列表（使用 FlashList 或 LegendList）。
- 减少可能阻塞 JavaScript 线程和交互的繁重工作（I/O 操作、状态水合、JSON 解析）。
- 如果可能，先显示缓存或本地数据。

**我们的建议：** 包含冷启动时间在内低于 3 秒。

#### 自动事件参数

每个 TTI 事件都包含额外参数，以帮助分诊问题：

- **`expo.frameRate.slowFrames`**（计数）：渲染耗时 17 毫秒或更长的帧。如果相对于启动时长这个值很高，说明主线程在启动期间持续忙碌。指向繁重的布局工作、同步的 bridge 调用，或一次渲染了太多组件。
- **`expo.frameRate.frozenFrames`**（计数）：渲染耗时 700 毫秒或更长的帧。这些是应用明显卡住的硬冻结。启动期间即使出现一次也是严重问题。通常由同步 I/O、大型 JSON 解析或主线程上的阻塞网络调用引起。
- **`expo.frameRate.totalDelay`**（秒）：所有帧超出其目标时长的累计总时间。这是最好的单一“流畅度”数字。把它与 TTI 比较：如果 TTI 是 2.5 秒而 `totalDelay` 是 0.1 秒，启动慢但流畅（时间花在了正当的工作上）。如果 `totalDelay` 是 1.5 秒，应用在启动的大部分时间里都不流畅，用户盯着的是卡顿的屏幕。
- **`expo.device.lowPowerMode`**（布尔值）：报告 TTI 时操作系统的省电模式（iOS 上的 Low Power Mode，Android 上的 Battery Saver）是否处于活动状态。省电模式会限制 CPU、GPU 和后台活动，因此一旦筛掉此标志就消失的 TTI 回退是环境因素，而不是代码变更。
- **`expo.device.batteryLevel`**（数字，0–1）：TTI 时的电池电量分数。可用于排除在低电量时积极管理性能的设备上的热/节流效应。操作系统不报告值时省略。
- **`expo.device.batteryCharging`**（布尔值）：设备是否插电或正在无线充电。充电往往会提高 iOS 和某些 Android OEM 上的持续 CPU 性能上限，因此未充电的样本是更保守的比较总体。
- **`expo.device.thermalState`**（字符串）：`nominal`、`fair`、`serious`、`critical`、`unknown` 之一。持续的 `serious`/`critical` 状态会导致操作系统节流 CPU/GPU，并且可以在没有任何应用变更的情况下大幅减慢启动。
- **`expo.network.connected`**（布尔值）：设备在 TTI 时是否有具备互联网能力的网络。如果 TTI 只在此值为 `true` 时变差，原因很可能是受网络约束的启动路径；如果在 `false` 时变差，应用在显示缓存内容之前做了过多工作。
- **`expo.network.type`**（字符串）：`wifi`、`cellular`、`ethernet`、`none`、`other`、`unknown` 之一。用于比较蜂窝与 Wi-Fi 总体——较大差距通常指向受网络约束的启动工作。VPN 流量被报告为底层传输（通常是 `wifi` 或 `cellular`），因为 VPN 在其上建立隧道。该取值集合在 Android 和 iOS 上有意保持相同，因此仪表盘不需要按平台分支。
- **`expo.network.isExpensive`**（布尔值）：操作系统是否认为该连接是按流量计费的，例如蜂窝或个人热点。两个平台都会报告，并且仅在存在网络时报告。
- **`expo.network.isConstrained`**（布尔值，仅 iOS）：此路径是否启用了 Low Data Mode。系统会在此模式下推迟后台传输，因此等待其中一次传输的启动可能比同一代码在不受约束的路径上更慢。
- **`expo.network.dataSaverEnabled`**（布尔值，仅 Android）：是否启用了 Data Saver。它是最接近 Low Data Mode 的 Android 对应项，但它是进程范围的设置而不是按路径的设置，因此使用单独的键。

**如何解读它们：**

- **高 TTI + 低总延迟：** 启动慢但流畅。优化阻塞启动序列的内容（包体积、数据获取、初始化链）。
- **高 TTI + 高总延迟 + 许多慢帧：** 主线程争用。把工作移出主线程并简化初始渲染树。
- **高 TTI + 高延迟 + 冻结帧：** 有东西在硬阻塞。查找同步 I/O、大型 JSON 解析或阻塞的 API 调用。

#### 网络请求参数

TTI 事件也会汇总应用在启动期间发出的 HTTP 请求，因此你可以把由网络引起的慢启动与由应用自身工作引起的慢启动区分开。窗口从原生启动结束运行到调用 `markInteractive()` 的时刻。请求会被自动观察：iOS 上的 `URLSession` 流量和 Android 上的 `OkHttpClient` 流量，这涵盖 React Native 中的 `fetch`。EAS Observe 会排除它自己的遥测上传。当窗口中没有请求时，这些参数会被省略。

- **`expo.network.requests.count`**（计数）：在窗口中开始的请求。
- **`expo.network.requests.failed`**（计数）：出错或返回非 2xx 状态的请求。这是启动因一个从未到达的请求而停住的信号。
- **`expo.network.requests.bytesReceived`** 和 **`expo.network.requests.bytesSent`**（字节）：窗口内的总量，在线路上测量。
- **`expo.network.requests.totalDuration`**（秒）：每个请求时长的总和，包括失败。请求重叠时它可以超过墙钟时间，单次超时会贡献客户端的整个超时间隔。
- **`expo.network.requests.throughputBytesPerSecond`**（字节每秒）：在那些字节实际移动的时间内收到的字节。分母是传输窗口的并集，从每个第一个响应字节起测量，因此排除了 DNS、连接建立和服务器思考时间。缓存命中和失败的请求被排除。没有收到任何内容时省略。
- **`expo.network.requests.slowest.*`**：关于已完成的单次最长请求的事实——`duration`（秒）、`host`（字符串）、`statusCode`（数字）、`timeToFirstByte`（秒）和 `bytesReceived`（字节）。把它们放在一起读：主要由 `timeToFirstByte` 构成的 `duration` 意味着服务器应答慢，而较小的 `timeToFirstByte` 配上较大的 `bytesReceived` 意味着传输慢。`statusCode` 解释空响应——`bytesReceived` 为 0 在 304 上是正常的，在 200 上则是问题。

:::note
该摘要受最近 200 个请求的内存缓冲区限制。超过这个数量的启动会被少计，因此请把这些参数读作非常繁忙窗口的样本，而不是完整统计。
:::

#### 自定义事件参数

你可以通过把参数传给 `markInteractive()`，把自己的参数附加到 TTI 事件上。这对于按应用特定维度切分 TTI 很有用，例如用户分群、租户、功能标志变体，或屏幕加载的内容类型。

:::tabs
:::tab SDK 56 及更高版本
```tsx
import { useObserve } from 'expo-observe';

const { markInteractive } = useObserve();

markInteractive({
  params: {
    tenant: 'acme',
    cohort: 'beta',
    cacheHit: true,
  },
});
```
:::
:::tab SDK 55
```tsx
import { AppMetrics } from 'expo-observe';

AppMetrics.markInteractive({
  params: {
    tenant: 'acme',
    cohort: 'beta',
    cacheHit: true,
  },
});
```
:::
:::

你也可以覆盖附加到事件上的路由名称，否则它会由 [Expo Router](/router/introduction) 检测到的初始路由填充。当屏幕的逻辑名称与路由器路径不同、是动态路由，或没有使用 Expo Router 时，这很有用：

:::tabs
:::tab SDK 56 及更高版本
```tsx
import { useObserve } from 'expo-observe';

const { markInteractive } = useObserve();

markInteractive({
  routeName: '/feed',
  params: { cacheHit: true },
});
```
:::
:::tab SDK 55
```tsx
import { AppMetrics } from 'expo-observe';

AppMetrics.markInteractive({
  routeName: '/feed',
  params: { cacheHit: true },
});
```
:::
:::

参数值可以是字符串、数字、布尔值或其他可 JSON 序列化的值。

#### 以声明方式标记可交互

你可以不从 effect 调用 `markInteractive()`，而是在屏幕变得可交互的位置渲染 `<ObserveInteractiveMarker />` 组件，例如在其初始数据已加载之后。它在挂载时调用一次 `markInteractive()`，并且不渲染任何内容。

:::note
`ObserveInteractiveMarker` 在 SDK 56 及更高版本中可用。
:::

```tsx
import { ObserveInteractiveMarker } from 'expo-observe';

function Feed({ items }) {
  if (!items) {
    return <Spinner />;
  }

  return (
    <>
      <FeedList items={items} />
      <ObserveInteractiveMarker />
    </>
  );
}
```

标记只在挂载时触发一次，因此它的 `params` 从第一次渲染读取。之后更改它们没有效果，并会在开发中记录警告。如果你需要附加只有稍后才知道的参数，请改为直接调用 `useObserve().markInteractive(...)`。

### 更新下载时间

**它测量什么：** 在用户设备上下载 EAS Update OTA 包的时间。当应用使用 [EAS Update](/eas-update/introduction) 并包含 `expo-observe` 时，此指标会自动收集。不需要额外埋点。

关于仪表盘视图、按更新的明细和 CLI 查询，见 [EAS Update 下载性能](/eas/observe/eas-update)。

### 导航指标

:::note
导航指标需要 SDK 56 及更高版本，以及已启用的导航集成。
:::

当启用 [Expo Router](/eas/observe/integrations/expo-router) 或 [React Navigation](/eas/observe/integrations/react-navigation) 集成时，EAS Observe 会收集三项按路由的指标：

- **按路由的首次渲染（`cold_ttr`）**：从导航动作到目标屏幕首次获得焦点的时间。
- **按路由的热渲染（`warm_ttr`）**：对在获得焦点之前已经渲染过的屏幕的相同测量，例如预加载或返回导航之后。
- **按路由的可交互时间（`tti`）**：从导航动作到在目标屏幕上调用 `markInteractive()` 的时间。

设置说明和每个指标的完整事件参数，见 [Expo Router](/eas/observe/integrations/expo-router#指标) 或 [React Navigation](/eas/observe/integrations/react-navigation#指标) 的集成页面。

## 内存警告

:::note
内存警告需要 SDK 57 及更高版本，并且只在 iOS 上记录。
:::

当 iOS 向应用发出低内存警告时，EAS Observe 会以 `warn` 严重程度记录一个 `expo.memory.warning` 事件。该事件标记系统开始承受内存压力的时刻。它携带在收到警告时、在应用的其他部分对它做出反应并释放内存之前拍摄的内存使用快照。

内存警告意味着操作系统内存不足，可能会终止应用以回收内存。在此事件之后不久结束的会话很可能是内存不足终止，而这不会被报告为崩溃。

此事件自动记录。不需要埋点。它出现在会话时间线和 [`eas observe:events`](/eas/observe/eas-cli#eas-observeevents) 中，与你的用户定义事件并列。

### 事件参数

- **`expo.memory.allocated`**（字节）：记入应用进程的内存占用。这是系统用来与应用内存上限比较的值，因此是需要关注的数字。
- **`expo.memory.physical`**（字节）：驻留内存，即当前保存在物理 RAM 中的应用页面。
- **`expo.memory.available`**（字节）：应用在达到上限之前仍可分配的内存。在 iOS 模拟器上省略，模拟器不强制上限。
- **`expo.memory.warningsCount`**（计数）：到目前为止在会话中记录的警告次数，包括这一次。在单个会话内不断上升的计数指向泄漏或从不释放内存的缓存。

**如何改进：**

- 在解码之前，把大图像缩小到它们显示时的尺寸。保存在内存中的全分辨率资源是内存压力的常见原因。
- 当应用转到后台时，释放缓存和其他不可见的资源。
- 避免把整个网络响应或文件内容保存在内存中。改为流式处理或分页。
- 检查保留循环和从未移除的事件监听器。

## 数据处理

### 离线收集

设备离线时收集的指标存储在设备上。当应用转到后台并且有连接时，它们会自动发送到服务器。你也可以随时调用 [`Observe.dispatchEvents()`](/versions/latest/sdk/observe#dispatchevents) 手动刷新事件。

### 数据保留

指标数据至少保留 60 天。

### 采样

默认情况下，所有安装都会发送其指标。你可以通过设置 `sampleRate` 改为只从一部分安装发送。详情见[采样](/eas/observe/configuration#采样)。

### 环境

所有指标都按环境分组，环境是附加到每条指标上的元数据标签。值如何派生以及如何覆盖，见[环境](/eas/observe/configuration#环境)。

### 调试构建

除非把 `dispatchInDebug` 设为 `true`，否则从调试构建收集的指标会在发送前被丢弃。详情见[在开发中启用指标](/eas/observe/configuration#在开发中启用指标)。

### 禁用发送

你可以使用 `configure({ dispatchingEnabled: false })` 全局禁用所有发送。禁用期间，任何待发送的指标都会被丢弃而不发送，并且在把它设回 `true` 之前不会再发送更多指标。
