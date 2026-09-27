---
title: 下载更新
description: 了解下载并启动更新的策略。
---

# 下载更新

:::note
本页以下所有信息仅适用于发布构建，以及[启用了 `EX_UPDATES_NATIVE_DEBUG`](/eas-update/debug#运行时问题)的调试构建。
:::

本节介绍下载并启动更新的不同策略。目标是确保终端用户在更新发布后尽快采用应用的最新版本，同时不因缓慢的加载画面或其他问题牺牲用户体验。这些策略并不互斥，你可以根据应用需求混合使用。

## 默认在启动时异步加载更新

默认行为是在应用冷启动（从被杀掉的状态启动）时检查更新，并在有可用更新时下载它。这个过程不会阻塞应用加载，因此使用此策略时，终端用户只会在更新发布后冷启动应用，然后在某个时刻杀掉并重启应用时加载该更新（例如从操作系统的最近应用列表关闭它，或关闭再打开设备）。

这种行为是安全的，因为它不会为了等待网络请求完成而干扰应用启动（在常见的真实场景中，用户网络很慢、卡在加载画面上好几秒，那会是糟糕的用户体验）。缺点是用户采用应用最新版本需要更长时间。如果理想情况是更新一发布就被所有用户立即采用，那么此策略离该目标很远。

<details>
<summary>如果我想始终阻塞应用启动，直到下载完最新更新呢？</summary>

我们不建议此策略，因为由此产生的用户体验非常差。通常当用户启动应用时卡在启动画面上等待，他们会关闭应用再试一次（于是下载更新无法完成），或者放弃并使用另一个应用。当用户设备连接到慢速网络时，即使没有更新，他们也可能要等好几秒或更久才能加载应用。如果确保用户始终拥有应用的最新版本至关重要，你可以探索这里说明的其他策略之一。

</details>

<details>
<summary>如何禁用默认行为？</summary>

你可以在 `updates` 配置中把 [`checkAutomatically`](/versions/latest/sdk/updates#updatescheckautomaticallyvalue) 选项设为 `NEVER` 来禁用默认行为。这会阻止应用自动检查并下载更新。

</details>

## 在应用运行时（前台）检查更新

你可以使用 `Updates.checkForUpdateAsync()` 在应用运行时检查更新。它返回一个 promise，解析为 [`UpdateCheckResult` 对象](/versions/latest/sdk/updates#updatecheckresult)。如果有可用更新，`isAvailable` 为 `true`，并且 [`manifest`](/versions/latest/sdk/manifests#expoupdatesmanifest) 属性中包含关于该更新的信息。

如果有可用更新，可以使用 `Updates.fetchUpdateAsync()` 方法下载更新。它返回一个在下载完成时解析的 promise。最后，可以使用 `Updates.reloadAsync()` 方法用新版本重新加载应用。也可以用 `useUpdates()` hook 从 React 组件监控 `expo-updates` 库的状态。

<details>
<summary>应用运行时检查更新的常见模式有哪些？</summary>

- 你可以在应用生命周期的不同节点检查更新，例如[进入前台时](https://reactnative.dev/docs/appstate)或按某个间隔。找到更新时，你可能想向用户显示对话框，提示用户更新。
- 你可以在启动时检查更新并显示自己的自定义加载画面，如果你的用例非常需要确保用户在启动时始终获得最新版本。

</details>

## 检查后台更新（应用处于后台时）

你可以在应用处于后台时检查并获取更新来下载**后台更新**，也称为 _后台获取_。你可以使用 [`expo-background-task`](/versions/latest/sdk/background-task) 在后台任务中运行与前台相同的 `Updates.checkForUpdateAsync()` 和 `Updates.fetchUpdateAsync()` 方法。这是确保用户始终拥有应用最新版本的好方法，即使他们有一段时间没有打开应用。

值得考虑的是，你是想在后台下载更新后重新加载应用，还是等待用户关闭并重新打开它。如果选择只在后台下载而不应用，这仍然有用，可以确保下次启动立即拥有最新版本，并且与默认行为相比会提高更新的采用速度。

<details>
<summary>在后台检查更新的示例</summary>

为确保应用启动时注册后台任务，在顶层组件中导入并调用 `setupBackgroundUpdates` 函数。

```ts
import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Updates from 'expo-updates';

const BACKGROUND_TASK_NAME = 'task-run-expo-update';

export const setupBackgroundUpdates = async () => {
  TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
    return Promise.resolve();
  });

  await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_NAME, {
    minimumInterval: 60 * 24,
  });
};

setupBackgroundUpdates();
```

</details>

<details>
<summary>应用处于后台时，是否也应该用 Updates.reloadAsync() 应用更新？</summary>

**在应用处于后台时调用 `Updates.reloadAsync()` 的支持是实验性的**。这是新功能，使用并不广泛，首次启用时务必监控崩溃。在后台下载更新是安全的。

在应用处于后台时重新加载更新，可以很好地确保用户再次打开应用时拥有最新版本。但需要注意，除非你持久化应用进入后台时的状态并恢复该状态，否则用户再次打开应用时会经历冷启动。缓解这一点的一种方式是，仅在应用已闲置一段时间后再在后台重新加载，此后用户不太可能期望应用恢复先前状态。

</details>

## 关键/强制更新

`expo-updates` 库没有对关键/强制更新的一等支持。不过你可以实现自己的逻辑来检查关键更新并手动应用它们。[`expo/UpdatesAPIDemo` 仓库](https://github.com/expo/UpdatesAPIDemo)包含一种做法的示例。你可以把该做法与上面的策略结合起来检查更新。

## 从客户端控制加载哪个更新

使用 EAS Update 的典型方式，是在应用构建中嵌入单个更新 URL 和一组请求头（例如更新 channel 名称）。要控制加载哪个更新，你通过 `eas update` 命令或 EAS 仪表盘在服务器上做更改。例如，你向构建所指向的 channel 发布新更新，然后该构建在下次启动时获取该更新。用这种方式，发布到与构建所指向 channel 不同的 channel 的更新不会被下载。

你可以在运行时使用 `Updates.setUpdateURLAndRequestHeadersOverride()` 方法覆盖更新 URL 和请求头。如果你想加载特定更新，或在应用运行时更改更新 channel，这会很有用。参见[如何在运行时覆盖更新配置](/eas-update/override)。

## 监控更新的采用情况

更新的详情页（例如：`https://expo.dev/accounts/[account]/projects/[project]/updates/[id]`）显示已运行该更新的用户数量指标，以及失败安装的数量（下载并尝试运行该更新但崩溃的用户）。

部署页（例如：`https://expo.dev/accounts/[account]/projects/[project]/deployments/production/[runtime-version]`）包含表格和图表，显示在给定时间段内，针对特定更新 channel 与运行时版本组合，运行过每个更新的用户数量。
