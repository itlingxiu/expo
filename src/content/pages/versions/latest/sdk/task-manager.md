---
title: TaskManager 包参考
description: 为可以在后台运行的任务提供支持的库。
---

# TaskManager 包参考

> 支持平台：Android、iOS、tvOS、Expo Go。

`expo-task-manager` 提供 API，用来管理长时间运行的任务，尤其是应用处于后台时仍可运行的任务。这个库的部分功能会被其他库在内部使用。下面是使用 `TaskManager` 的 Expo SDK 库列表。

## 使用 Expo TaskManager 的库

- [Location](/versions/latest/sdk/location)
- [BackgroundTask](/versions/latest/sdk/background-task)
- [BackgroundFetch](/versions/latest/sdk/background-fetch)
- [Notifications](/versions/latest/sdk/notifications)

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-task-manager
```
:::
:::tab yarn
```sh
yarn expo install expo-task-manager
```
:::
:::tab pnpm
```sh
pnpm expo install expo-task-manager
```
:::
:::tab bun
```sh
bun expo install expo-task-manager
```
:::
:::

:::note
可以在 Expo Go 应用中测试 `TaskManager`。不过，请查看每个使用 `TaskManager` 的[库](#使用-expo-taskmanager-的库)的文档，确认它是否支持在 Expo Go 中测试。
:::

## 配置（iOS）

独立应用需要一些额外配置：在 iOS 上，每项后台功能都需要在 **Info.plist** 文件的 `UIBackgroundModes` 数组中加入一个特殊键。

关于如何配置，请阅读每个使用 `TaskManager` 的[库](#使用-expo-taskmanager-的库)的参考文档。

## 用法

```jsx
import { Button, View, StyleSheet } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

const requestPermissions = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
      });
    }
  }
};

const PermissionsButton = () => (
  <View style={styles.container}>
    <Button onPress={requestPermissions} title="Enable background location" />
  </View>
);

// 在模块作用域定义任务，以便后台运行时能够找到它。
// 必须在全局作用域调用，不能写在 React 组件内部。
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // 发生错误——查看 `error.message` 了解详情。
    return;
  }
  if (data) {
    const { locations } = data;
    // 对在后台捕获的位置做一些处理
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PermissionsButton;
```

:::note
**注意：** [`TaskManager.defineTask`](#taskmanagerdefinetasktaskname-taskexecutor) 必须在模块作用域调用，不能写在 React 组件内部。上面的示例把它放在屏幕文件的模块作用域中，这对不使用路由的应用是可行的。在 Expo Router 项目中，请把它移到单独的文件（例如 **tasks.ts**），并在根布局（**app/\_layout.tsx**）顶部导入该文件，以便在任何导航运行之前完成任务注册。
:::

## API

```js
import * as TaskManager from 'expo-task-manager';
```
