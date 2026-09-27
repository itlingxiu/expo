---
title: 排查 EAS Observe 问题
description: 常见 EAS Observe 问题的解决办法。
---

# 排查 EAS Observe 问题

## 常见问题

### 指标没有出现在仪表盘中

1. 确保在安装 `expo-observe` 之后创建了**新构建**。指标只从包含该库的构建中收集。
2. 检查你在 EAS 仪表盘中查看的是正确的项目。
3. 如果在调试构建中测试，请确保通过 `configure()` 把 `dispatchInDebug` 设为 `true`。见[在开发中启用指标](/eas/observe/configuration#在开发中启用指标)。

### 首次渲染时间没有显示

确认你的根布局已用根 HOC 包裹：

:::tabs
:::tab SDK 56 及更高版本
```jsx
import { ObserveRoot } from 'expo-observe';

function RootLayout() {
  return (/* 你的布局 */);
}

export default ObserveRoot.wrap(RootLayout);
```
:::
:::tab SDK 55
```jsx
import { AppMetricsRoot } from 'expo-observe';

function RootLayout() {
  return (/* 你的布局 */);
}

export default AppMetricsRoot.wrap(RootLayout);
```
:::
:::

### 可交互时间没有显示

此指标需要手动埋点。请确认：

:::tabs
:::tab SDK 56 及更高版本

1. 你在启动屏隐藏之后调用了 `markInteractive()`（来自 `useObserve()`）。
2. 该调用确实被执行（添加 `console.log` 来验证）。

:::
:::tab SDK 55

1. 你在启动屏隐藏之后调用了 `AppMetrics.markInteractive()`。
2. 该调用确实被执行（添加 `console.log` 来验证）。

:::
:::

<details>
<summary>从 expo-eas-observe 迁移</summary>

如果你参加过私有预览并以前使用过 `expo-eas-observe`，请按照以下步骤迁移到 `expo-observe`。

1. **替换包**

   ```sh
   npx expo install expo-observe
   npm uninstall expo-eas-observe
   ```

   如果你以前把 `expo-eas-client` 作为单独的依赖安装，可以移除它：

   ```sh
   npm uninstall expo-eas-client
   ```

2. **更新导入**

   ```diff
   - import AppMetrics from 'expo-eas-observe';
   + import { AppMetrics } from 'expo-observe';
   ```

3. **用根 HOC 替换手动的 `markFirstRender()`**

   不要手动调用 `markFirstRender()`，而是用适用于你的 SDK 的根 HOC 包裹根布局。这会自动处理测量。

   之前：

   ```jsx
   import { useEffect } from 'react';
   import AppMetrics from 'expo-eas-observe';

   export default function RootLayout() {
     useEffect(() => {
       AppMetrics.markFirstRender();
     }, []);

     return (/* 你的布局 */);
   }
   ```

   之后：

:::tabs
:::tab SDK 56 及更高版本
```jsx
import { ObserveRoot } from 'expo-observe';

function RootLayout() {
  return (/* 你的布局 */);
}

export default ObserveRoot.wrap(RootLayout);
```
:::
:::tab SDK 55
```jsx
import { AppMetricsRoot } from 'expo-observe';

function RootLayout() {
  return (/* 你的布局 */);
}

export default AppMetricsRoot.wrap(RootLayout);
```
:::
:::

4. **创建新构建**

   完成迁移后，为应用创建新构建：

   ```sh
   eas build
   ```

</details>
