---
title: 设置 EAS Observe
description: 了解如何安装 EAS Observe，并开始从生产应用收集性能指标。
---

# 设置 EAS Observe

## 用 AI agent 设置 EAS Observe

把下面的内容粘贴到 Claude、Cursor、Codex 或其他 agent 中。

```text
在我的 Expo 项目中设置 EAS Observe，以便我能看到生产应用的启动性能。按顺序完成这些步骤。

1. 从 package.json 中的 expo 版本识别 SDK 版本，因为它决定哪些步骤适用。SDK 56 及更高版本使用 Observe API。SDK 55 使用旧的 AppMetrics 名称，因此标记为“仅 SDK 55”的步骤代替标记为“SDK 56 及更高版本”或“SDK 57 及更高版本”的步骤。如果项目在 SDK 54 或更早版本上，请停止并告诉我升级，因为 EAS Observe 需要 SDK 55 或更高版本。
2. 用 npm install -g eas-cli 安装或升级 EAS CLI，然后用 eas whoami 检查我是否已登录。如果没有，运行 eas login。
3. 检查应用配置是否有 extra.eas.projectId。如果缺少，在运行 eas init 之前停止并询问我，因为那会在我的账户上创建一个新项目。
4. 运行 npx expo install expo-observe，它会安装与此 SDK 匹配的版本。
5. 包裹根布局组件，并把包裹后的组件作为默认导出。在 Expo Router 项目中，根布局是 app/_layout.tsx，否则是应用注册的根组件。这会自行测量首次渲染时间。
   - 从 expo-observe 导入 ObserveRoot，并在文件末尾写 export default ObserveRoot.wrap(RootLayout)。
   - 仅 SDK 55：改为导入 AppMetricsRoot，并使用 AppMetricsRoot.wrap(RootLayout)。
6. 在启动屏背后的启动工作完成后调用 markInteractive()。这些工作包括更新检查、认证、第一次数据获取和启动屏动画。在应用设置就绪状态并隐藏启动屏之后运行的 effect 中调用它。
   - 在组件内部从 useObserve() 钩子读取 markInteractive。
   - 仅 SDK 55：改为调用 AppMetrics.markInteractive()。没有钩子。
   - 在一个会话中多次调用是安全的，因为只有第一次调用会记录测量值。如果应用有不止一个入口屏幕，例如引导流程、登录流程或深层链接目标，请在每一个上都调用它。否则，当应用在其中一个屏幕上打开时，不会记录可交互时间。
7. SDK 56 及更高版本：记录按路由的导航指标，这样仪表盘会按屏幕报告渲染和可交互时间，而不仅仅是应用范围的数字。
   - 对于 Expo Router 项目，在根布局文件的模块作用域、组件之上添加 Observe.configure({ integrations: { 'expo-router': true } })。对于直接用 React Navigation 导航的项目，使用 'react-navigation': true，这需要 @react-navigation/native 7 或更高版本。
   - 只保留一次 Observe.configure() 调用，并把每个选项都放进去，因为每次调用都会替换整个配置，后一次调用会重置前一次设置的内容。该调用必须在任何屏幕挂载之前运行，在那之后打开或关闭集成会抛出错误。
   - 仅 React Navigation：从 expo-observe/integrations/react-navigation 导入。使用动态配置时，用 ObserveNavigationContainer 替换顶层的 NavigationContainer，它接受相同的 props 并转发相同的 ref。使用静态配置时，用 useNavigationContainerRef() 创建 ref，把它传给 createStaticNavigation() 返回的元素，并把该元素包在 ObserveNavigationProvider navigationRef={navigationRef} 中。
   - 把第 6 步的 markInteractive() 调用移到屏幕组件中的 effect 里，因为钩子把调用限定在它运行的屏幕上，从屏幕外部调用不会记录任何内容。应用范围的可交互时间仍然来自该调用。先为入口屏幕埋点，然后问我还有哪些屏幕应当报告可交互时间。
   - SDK 57 及更高版本：如果此项目中的路由或查询参数带有敏感值，在 filteredParams 中列出这些键，例如 { 'expo-router': { filteredParams: ['userId'] } }。集成随后会把它们排除在导出的指标之外。
8. SDK 57 及更高版本：设置错误报告，该功能处于预览阶段。未处理的 JavaScript 错误从包被导入的那一刻起就会被记录，因此剩下的工作是那些永远不会到达该处理程序的错误。
   - 渲染错误：把第 5 步的 ObserveRoot.wrap() 导出替换为组件形式并传入回退，例如 ObserveRoot errorBoundaryFallback={FallbackScreen}，因为 wrap() 不传递 props。回退随后会代替应用渲染，并且错误会连同其 React 组件堆栈一起被记录。要覆盖一个子树而不是整个应用，用 ObserveErrorBoundary 包裹该子树，并把 fallback 设为一个元素，或一个接收 error 和 resetError 的函数。
   - 已处理的错误：在从失败中恢复的 catch 块中调用 Observe.reportError(error)，例如失败的同步或失败的上传，因为这些错误既不会到达全局处理程序，也不会到达边界。如果数量不止几个，先给我看列表，并让个人数据远离消息，因为所报告的一切都会被发送到设备之外并显示在仪表盘中。
   - 在 eas.json 的生产构建 profile 上设置 "uploadSourceMaps": true，这样仪表盘会把堆栈跟踪映射回我的源文件，而不是压缩包中的位置。它需要 EAS CLI 22.0.0 或更高版本，以及在 EAS Build 服务器上运行的构建。
9. 停止并问我：“埋点已经就位。你想先在开发构建中测试吗？” EAS Observe 不会在 Expo Go 中运行，因此无论哪种回答都需要新构建。
   - 如果我说是，把 dispatchInDebug: true 加到 Observe.configure() 调用中，或者如果项目没有该调用，就在模块作用域添加它，因为调试构建默认不发送指标。在 SDK 55 上，改为调用 AppMetrics.configure({ dispatchInDebug: true })。告诉我在发布前移除它，因为调试性能会扭曲仪表盘。
   - 如果我说否，不要更改任何配置。发布构建默认会发送。
10. 停止并问我要为哪个平台和 profile 构建，然后运行 eas build --platform <platform> --profile <profile>。
11. 告诉我打开 EAS 仪表盘中该项目的 Observe 标签页以查看第一批指标，其中 Navigation 页面列出按路由的耗时，Errors 页面列出已记录的错误。作为替代，eas observe:versions 列出可用来筛选的应用版本，eas observe:metrics-summary 显示每个版本的中位数、p90 和 p99 启动时间，eas observe:metrics 显示各个慢会话，eas observe:routes 显示那些按路由的耗时。

匹配此项目已经使用的包管理器，并报告你运行了什么。

EAS Observe 入门指南见 /eas/observe/get-started。
```

EAS Observe 在生产环境中跟踪应用的启动性能。本指南带你安装该库、设置应用，并查看第一批指标。

:::warning
EAS Observe 在 Expo Go 中不可用，因为它依赖 `expo-observe` 原生库。要使用它，请创建[开发构建](/develop/development-builds/introduction)或生产构建。
:::

## 前置条件

- **一个 Expo 用户账户**

  任何拥有 Expo 账户的人都可以使用 EAS Observe。可以在 [expo.dev/signup](https://expo.dev/signup) 注册。

- **Expo SDK 55 或更高版本**

  EAS Observe 需要 SDK 55 或更高版本。运行 `npx expo-doctor` 检查 SDK 版本，运行 `npx expo install --fix` 更新依赖。

- **一个 EAS 项目**

  你的应用必须关联到一个 EAS 项目。确保应用配置中的 `extra.eas.projectId` 包含项目 ID，或运行 `eas init` 创建一个。

1. **安装该库**

   确保你使用的是最新版本的 `expo`，然后安装 `expo-observe`：

:::tabs
:::tab npm
```sh
npx expo install --fix

npx expo install expo-observe
```
:::
:::tab yarn
```sh
yarn expo install --fix

yarn expo install expo-observe
```
:::
:::tab pnpm
```sh
pnpm expo install --fix

pnpm expo install expo-observe
```
:::
:::tab bun
```sh
bun expo install --fix

bun expo install expo-observe
```
:::
:::

2. **包裹根布局**

   用 `AppMetricsRoot`（SDK 55）或 `ObserveRoot`（SDK 56 及更高版本）包裹根布局。这个高阶组件（HOC）会自动为你测量[首次渲染时间（TTR）](/eas/observe/reference/metrics#首次渲染时间ttr)。

:::tabs
:::tab SDK 56 及更高版本
```tsx app/_layout.tsx
import { Stack } from 'expo-router';
import { ObserveRoot } from 'expo-observe';

function RootLayout() {
  return <Stack />;
}

export default ObserveRoot.wrap(RootLayout);
```
:::
:::tab SDK 55
```tsx app/_layout.tsx
import { Stack } from 'expo-router';
import { AppMetricsRoot } from 'expo-observe';

function RootLayout() {
  return <Stack />;
}

export default AppMetricsRoot.wrap(RootLayout);
```
:::
:::

3. **标记可交互**

   当应用完全准备好供用户交互时调用 `markInteractive()`。这应当在启动屏背后的任何初始化工作完成**之后**调用，例如：

   - 检查更新
   - 认证用户
   - 获取初始数据
   - 动画启动屏

:::tabs
:::tab SDK 56 及更高版本
```tsx app/_layout.tsx
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ObserveRoot, useObserve } from 'expo-observe';
import { useEffect, useState } from 'react';

// 在获取资源时保持启动屏可见
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const { markInteractive } = useObserve();

  useEffect(() => {
    async function prepare() {
      try {
        await authenticateUser();
        await fetchInitialData();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
      markInteractive();
    }
  }, [isReady, markInteractive]);

  if (!isReady) {
    return null;
  }

  return <Stack />;
}

export default ObserveRoot.wrap(RootLayout);
```
:::
:::tab SDK 55
```tsx app/_layout.tsx
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AppMetrics, AppMetricsRoot } from 'expo-observe';
import { useEffect, useState } from 'react';

// 在获取资源时保持启动屏可见
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await authenticateUser();
        await fetchInitialData();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
      AppMetrics.markInteractive();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return <Stack />;
}

export default AppMetricsRoot.wrap(RootLayout);
```
:::
:::

   :::note
   `markInteractive()` 在每个会话中可以安全地多次调用，但只有第一次调用会记录测量值。如果你的应用有多个入口屏幕（例如引导流程、登录流程或深层链接目标），请在**每一个这样的屏幕**上调用 `markInteractive`。如果你只把它放在一个屏幕上，当应用通过深层链接打开到另一个屏幕时，[可交互时间（TTI）](/eas/observe/reference/metrics#可交互时间tti)将不会被记录。
   :::

4. **创建新构建**

   安装 `expo-observe` 并添加埋点之后，为应用创建新构建：

   ```sh
   eas build
   ```

   :::note
   默认情况下，从调试构建收集的指标不会被发送。要在调试构建中测试你的集成，见[在开发中启用指标](/eas/observe/configuration#在开发中启用指标)。
   :::

5. **查看你的指标**

   打开你的项目，并打开 [EAS 仪表盘中的 **Observe** 标签页](https://expo.dev/accounts/[account]/projects/[project]/observe)以查看来自应用的指标。

   关于筛选、发布对比和会话调查的细节，见[仪表盘指南](/eas/observe/dashboard)。

   你也可以使用 EAS CLI 从终端查询指标：

   - `eas observe:versions`：列出版本及其构建 ID、更新组 ID 和发布日期。可用于找到筛选其他命令所需的版本标识符。
   - `eas observe:metrics-summary`：显示按应用版本分组的汇总性能指标统计（例如中位数、p90 和 p99 值）。用它比较各发布的整体启动性能。
   - `eas observe:metrics`：显示按值排序的各个性能指标事件，包括会话和设备元数据。用它调查特定的慢会话或离群值。
   - `eas observe:routes`：显示按路由名称分组的导航指标（冷/热首次渲染时间和可交互时间）。需要 [Expo Router](/eas/observe/integrations/expo-router) 或 [React Navigation](/eas/observe/integrations/react-navigation) 集成。
   - `eas observe:session`：显示单个会话的完整事件时间线。
   - `eas observe:events`：显示应用通过 `Observe.logEvent` 发出的各个事件。详情见[用户定义的事件](/eas/observe/events)。

   为这些命令中的任何一个加上 `--help` 即可查看可用的标志和参数。关于标志、指标名称和常见工作流，见[使用 EAS CLI 查询](/eas/observe/eas-cli)。

   完整的库 API，包括配置选项和所有可用方法，见 [`expo-observe` API 参考](/versions/latest/sdk/observe)。
