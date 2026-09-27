---
title: BackgroundFetch 包参考
description: 提供执行后台获取任务的 API 的库。
---

# BackgroundFetch 包参考

:::danger
**[已弃用](/more/release-statuses#deprecated)：** `expo-background-fetch` 库正被 [`expo-background-task`](/versions/latest/sdk/background-task) 中的新版本取代。`expo-background-fetch` 不再接收补丁，并将在即将发布的版本中移除。
:::

`expo-background-fetch` 提供执行[后台获取](https://developer.apple.com/documentation/uikit/core_app/managing_your_app_s_life_cycle/preparing_your_app_to_run_in_the_background/updating_your_app_with_background_app_refresh)任务的 API，让你可以在后台定期运行特定代码以更新应用。此模块在底层使用 [TaskManager](/versions/latest/sdk/task-manager) 原生 API。

> 支持平台：Android、iOS。

## 已知问题（iOS）

`BackgroundFetch` 仅在应用处于后台时工作，如果应用已被终止或设备重启，则不会工作。更多细节见[相关 GitHub issue](https://github.com/expo/expo/issues/3582)。

在 iOS 上，`BackgroundFetch` 库要求你使用[开发构建](/develop/development-builds/introduction)，因为 iOS 版 Expo Go 未启用后台获取。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-background-fetch
```
:::
:::tab yarn
```sh
yarn expo install expo-background-fetch
```
:::
:::tab pnpm
```sh
pnpm expo install expo-background-fetch
```
:::
:::tab bun
```sh
bun expo install expo-background-fetch
```
:::
:::

## 配置（iOS）

要在 iOS 上运行后台获取任务，需要在应用的 **Info.plist** 文件里，向 `UIBackgroundModes` 数组添加 `fetch` 值。后台获取要正常工作，这是必需的。

**如果你使用 [CNG](/workflow/continuous-native-generation)**，预构建会自动应用所需的 `UIBackgroundModes` 配置。

<details>
<summary>在 iOS 上手动配置 UIBackgroundModes</summary>

如果你没有使用持续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动使用原生 **ios** 项目，则需要在 **Expo.plist** 文件中添加以下内容：

```xml ios/project-name/Supporting/Expo.plist
<key>UIBackgroundModes</key>
<array>
  <string>fetch</string>
</array>
```

</details>

## 用法

下面的示例演示如何使用 `expo-background-fetch`。

```tsx
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-fetch';

// 1. 通过提供名称以及应执行的函数来定义任务
// 注意：这需要在全局作用域中调用（例如在 React 组件之外）
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  // 务必返回成功的结果类型！
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// 2. 在应用的某个时机注册该任务，提供相同的名称，
// 以及后台获取行为的一些配置选项
// 注意：这不需要位于全局作用域，可以在 React 组件中使用！
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 15, // 15 分钟
    stopOnTerminate: false, // 仅 Android
    startOnBoot: true, // 仅 Android
  });
}

// 3. （可选）通过指定任务名称来取消注册
// 这将取消今后所有与给定名称匹配的后台获取调用
// 注意：这不需要位于全局作用域，可以在 React 组件中使用！
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export default function BackgroundFetchScreen() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] = useState<BackgroundFetch.BackgroundFetchStatus | null>(null);

  useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.textContainer}>
        <Text>
          Background fetch status:{' '}
          <Text style={styles.boldText}>
            {status && BackgroundFetch.BackgroundFetchStatus[status]}
          </Text>
        </Text>
        <Text>
          Background fetch task name:{' '}
          <Text style={styles.boldText}>
            {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
          </Text>
        </Text>
      </View>
      <View style={styles.textContainer}></View>
      <Button
        title={isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
        onPress={toggleFetchTask}
      />
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

## 触发后台获取

后台获取可能难以测试，因为它们的发生并不稳定。好在开发应用时可以手动触发后台获取。

在 iOS 上，可以使用 macOS 上的 `Instruments` 应用手动触发后台获取：

1. 打开 Instruments 应用。可以通过 Spotlight（<kbd>Cmd ⌘</kbd> + <kbd>Space</kbd>）搜索 Instruments，或从 `/Applications/Xcode.app/Contents/Applications/Instruments.app` 打开。
2. 选择 `Time Profiler`
3. 选择你的设备或模拟器，并选中 `Expo Go` 应用
4. 按下左上角的 `Record` 按钮
5. 打开 `Document` 菜单，选择 `Simulate Background Fetch - Expo Go`：

![带有 Simulate Background Fetch 选项的 Xcode 菜单](/static/images/simulate-background-fetch-instruments.webp)

在 Android 上，可以把任务的 `minimumInterval` 选项设为一个较小的数字，然后让应用进入后台，如下所示：

```tsx
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1 * 60, // 应用进入后台 1 分钟后触发任务
  });
}
```

## API

```js
import * as BackgroundFetch from 'expo-background-fetch';
```

## 权限

### Android

在 Android 上，此模块可能会在设备启动时监听。这对于继续处理以 `startOnBoot` 启动的任务是必要的。它还会让很快进入空闲和睡眠的设备保持“唤醒”，以提高任务的可靠性。因此，`RECEIVE_BOOT_COMPLETED` 和 `WAKE_LOCK` 权限都会自动添加。

- `RECEIVE_BOOT_COMPLETED`
- `WAKE_LOCK`
