---
title: BackgroundTask 包参考
description: 提供运行后台任务的 API 的库。
---

# BackgroundTask 包参考

`expo-background-task` 提供 API，以优化终端用户设备电池与功耗的方式运行可延迟的后台任务。此模块在 Android 上使用 [`WorkManager`](https://developer.android.com/topic/libraries/architecture/workmanager) API，在 iOS 上使用 [`BGTaskScheduler`](https://developer.apple.com/documentation/backgroundtasks/bgtaskscheduler) API 来调度任务。它还使用 [`expo-task-manager`](/versions/latest/sdk/task-manager) 原生 API 来运行 JavaScript 任务。

> 支持平台：Android、iOS、tvOS、Expo Go。

**观看：Expo Background Task 深入讲解**

在后台同步数据、预取内容，并用 expo-background-task 运行可延迟的工作。

[观看：Expo Background Task 深入讲解](https://www.youtube.com/watch?v=4lFus7TvayI)

## 后台任务

后台任务是在后台、应用生命周期之外执行的可延迟工作单元。这对于应用不活跃时需要执行的任务很有用，例如与服务器同步数据、获取新内容，甚至检查是否有 [`expo-updates`](/versions/latest/sdk/updates)。

### 后台任务何时运行？

Expo Background Task API 利用各平台，在应用处于后台时，于对用户和设备都最合适的时间执行任务。

这意味着任务可能不会在调度后立即运行，但如果系统决定执行，它会在未来某个时刻运行。你可以指定任务运行的最小间隔（分钟）。在间隔过去之后的某个时间，只要满足指定条件，任务就会执行。

后台任务只有在电池电量充足（或设备已接通电源）且网络可用时才会运行。没有这些条件，任务不会执行。具体行为会因操作系统而异。

### 它们何时会停止？

后台任务由平台 API 和系统约束管理。了解任务何时停止，有助于有效规划其使用。

- 如果用户强制结束应用，后台任务会停止。应用重新启动后，任务会恢复。
- 如果系统停止应用或设备重启，后台任务会恢复，应用也会被重新启动。

在 Android 上，从最近应用列表中移除应用并不会完全停止它；而在 iOS 上，在应用切换器中划掉应用会完全终止它。

:::note
在 Android 上，行为因设备厂商而异。例如，有些实现会把从最近应用列表中移除应用视为强制结束。关于这些差异的更多说明：<https://dontkillmyapp.com>。
:::

## 平台差异

### Android

在 Android 上，[`WorkManager`](https://developer.android.com/topic/libraries/architecture/workmanager) API 允许为任务指定最小运行间隔（最少 15 分钟）。在间隔过去之后的某个时间，只要满足指定条件，任务就会执行。

### iOS

在 iOS 上，[`BGTaskScheduler`](https://developer.apple.com/documentation/backgroundtasks/bgtaskscheduler) API 决定启动后台任务的最佳时间。系统会考虑电池电量、网络可用性以及用户的使用模式，以确定何时运行任务。你仍然可以为任务指定最小间隔，但系统可能会选择在更晚的时间运行任务。

## 已知限制

### iOS

[`Background Tasks`](https://developer.apple.com/documentation/backgroundtasks) API 在 iOS 模拟器上不可用。只有在物理设备上运行时才可用。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-background-task
```
:::
:::tab yarn
```sh
yarn expo install expo-background-task
```
:::
:::tab pnpm
```sh
pnpm expo install expo-background-task
```
:::
:::tab bun
```sh
bun expo install expo-background-task
```
:::
:::

## 在应用配置中配置（iOS）

要在 iOS 上运行后台任务，需要在应用的 **Info.plist** 文件中添加以下内容：

- 向 `UIBackgroundModes` 数组添加 `processing` 值。这会启用后台处理功能。
- 添加包含 `com.expo.modules.backgroundtask.processing` 标识符的 `BGTaskSchedulerPermittedIdentifiers` 数组。这会注册允许的后台任务标识符。

**如果你使用 [CNG](/workflow/continuous-native-generation)**，预构建会自动应用所需的 `UIBackgroundModes` 和 `BGTaskSchedulerPermittedIdentifiers` 配置。

<details>
<summary>在 iOS 上手动配置 Info.plist</summary>

如果你没有使用持续原生生成（[CNG](/workflow/continuous-native-generation)），则需要在 **Info.plist** 文件中添加以下内容：

```xml ios/project-name/Supporting/Info.plist
<key>UIBackgroundModes</key>
<array>
  <string>processing</string>
</array>
<key>BGTaskSchedulerPermittedIdentifiers</key>
<array>
  <string>com.expo.modules.backgroundtask.processing</string>
</array>
```

</details>

## 用法

下面的示例演示如何使用 `expo-background-task`。

```tsx App.tsx
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const BACKGROUND_TASK_IDENTIFIER = 'background-task';

// 注册并创建任务，这样即使后台任务界面
// （本示例稍后定义的 React 组件）不可见，任务也可用。
// 注意：这需要在全局作用域中调用，而不是在 React 组件中。
TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
  try {
    const now = Date.now();
    console.log(`Got background task call at date: ${new Date(now).toISOString()}`);
  } catch (error) {
    console.error('Failed to execute the background task:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
  return BackgroundTask.BackgroundTaskResult.Success;
});

// 2. 在应用的某个时机注册该任务，提供相同的名称
// 注意：这不需要位于全局作用域，可以在 React 组件中使用！
async function registerBackgroundTaskAsync() {
  return BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER);
}

// 3. （可选）通过指定任务名称来取消注册
// 这将取消今后所有与给定名称匹配的后台任务调用
// 注意：这不需要位于全局作用域，可以在 React 组件中使用！
async function unregisterBackgroundTaskAsync() {
  return BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_IDENTIFIER);
}

export default function BackgroundTaskScreen() {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [status, setStatus] = useState<BackgroundTask.BackgroundTaskStatus | null>(null);

  useEffect(() => {
    updateAsync();
  }, []);

  const updateAsync = async () => {
    const status = await BackgroundTask.getStatusAsync();
    setStatus(status);
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_IDENTIFIER);
    setIsRegistered(isRegistered);
  };

  const toggle = async () => {
    if (!isRegistered) {
      await registerBackgroundTaskAsync();
    } else {
      await unregisterBackgroundTaskAsync();
    }
    await updateAsync();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.textContainer}>
        <Text>
          Background Task Service Availability:{' '}
          <Text style={styles.boldText}>
            {status ? BackgroundTask.BackgroundTaskStatus[status] : null}
          </Text>
        </Text>
      </View>
      <Button
        disabled={status === BackgroundTask.BackgroundTaskStatus.Restricted}
        title={isRegistered ? 'Cancel background task' : 'Schedule background task'}
        onPress={toggle}
      />
      <Button title="Check background task status" onPress={updateAsync} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    margin: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
```

## 多个后台任务

由于 iOS 上的 Background Tasks API 和 Android 上的 WorkManager API 限制了单个应用可以调度的任务数量，Expo Background Task 在两个平台上都使用单一 worker。你可以定义多个 JavaScript 后台任务，但它们都会通过这个单一 worker 运行。

最后注册的后台任务决定执行的最小间隔。

## 测试后台任务

可以使用 [`triggerTaskWorkerForTestingAsync`](#backgroundtasktriggertaskworkerfortestingasync) 方法测试后台任务。此方法会在 Android 上直接运行所有已注册任务，并在 iOS 上调用 `BGTaskScheduler`。这有助于测试后台任务的行为，而无需等待系统触发它们。

此方法仅在开发模式下可用。它在生产构建中不起作用。

```tsx
import * as BackgroundTask from 'expo-background-task';
import { Button } from 'react-native';

function App() {
  const triggerTask = async () => {
    await BackgroundTask.triggerTaskWorkerForTestingAsync();
  };

  return <Button title="Trigger background task" onPress={triggerTask} />;
}
```

## 检查后台任务（Android）

要排查或调试 Android 上的后台任务问题，请使用 Android SDK 附带的 `adb` 工具检查已调度的任务，并把 `<package-name>` 替换为应用配置中的 [Android 包名](/versions/latest/config/app#package)：

```sh
adb shell dumpsys jobscheduler | grep -A 40 -m 1 -E "JOB #.* <package-name>"
```

此命令的输出会显示应用已调度的任务，包括其状态、约束和其他信息。查找 `JOB` 行以找到作业 ID，以及输出中的其他细节：

```text
JOB #u0a453/275: 216a359 <package-name>/androidx.work.impl.background.systemjob.SystemJobService
  u0a453 tag=*job*/<package-name>/androidx.work.impl.background.systemjob.SystemJobService#275
  Source: uid=u0a453 user=0 pkg=<package-name>
  ...
  Required constraints: TIMING_DELAY CONNECTIVITY UID_NOT_RESTRICTED [0x90100000]
  Preferred constraints:
  Dynamic constraints:
  Satisfied constraints: CONNECTIVITY DEVICE_NOT_DOZING BACKGROUND_NOT_RESTRICTED TARE_WEALTH WITHIN_QUOTA UID_NOT_RESTRICTED [0x1b500000]
  Unsatisfied constraints: TIMING_DELAY [0x80000000]
  ...
  Enqueue time: -8m12s280ms
  Run time: earliest=+6m47s715ms, latest=none, original latest=none
  Restricted due to: none.
  Ready: false (job=false user=true !restricted=true !pending=true !active=true !backingup=true comp=true)
```

第一行包含作业 ID（275）。`Run time: earliest` 值表示任务可能开始的最早时间，而 `enqueue time` 显示任务是多久以前调度的。

要强制运行任务，使用 `adb shell am broadcast` 命令。运行此命令前请把应用移到后台，因为应用在前台时任务不会运行。

```sh
adb shell cmd jobscheduler run -f <package-name> <JOB_ID>
```

其中 `JOB_ID` 是你在上一步中找到的、想要运行的作业标识符。

## 排查后台任务（iOS）

iOS 没有类似 `adb` 的工具来检查后台任务。要在 iOS 上测试后台任务，请使用内置的 [`triggerTaskWorkerForTestingAsync`](#backgroundtasktriggertaskworkerfortestingasync) 方法。此方法模拟系统触发任务。

你可以在调试模式下从应用中触发此方法（它在生产构建中不起作用），以测试后台任务的行为，而无需等待系统。如果后台任务配置不正确，你会在 Xcode 控制台中看到错误描述：

```text
No task request with identifier com.expo.modules.backgroundtask.processing has been scheduled
```

上面的错误告诉你需要运行预构建，才能把更改应用到应用配置。

此错误也意味着你必须运行预构建，才能把后台任务配置应用到应用。此外，请确保已按[此示例](#用法)定义并注册了后台任务。

## API

```js
import * as BackgroundTask from 'expo-background-task';
```
