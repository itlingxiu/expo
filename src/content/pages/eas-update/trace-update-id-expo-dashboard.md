---
title: 如何把更新 ID 追溯到 EAS 仪表盘
description: 了解在使用 EAS Update 和 expo-updates 库时，如何把更新 ID 追溯到 EAS 仪表盘。
---

# 如何把更新 ID 追溯到 EAS 仪表盘

使用 [EAS Update](/eas-update/introduction)时，你可能会遇到需要把 `updateId` 追溯到 [EAS 仪表盘](https://expo.dev/accounts/[account])的情况。这可能比较麻烦，因为无论 [`Updates.isEmbeddedLaunch`](/versions/latest/sdk/updates#updatesisembeddedlaunch) 是 `true` 还是 `false`，`Updates.updateId` 总会返回一个 ID。但是，如果应用正在运行嵌入式更新，在 [EAS 仪表盘](https://expo.dev/accounts/[account])中查找该 `updateId` 会报错。这是因为嵌入式更新不会在仪表盘中跟踪。

## 判断更新是嵌入式的还是下载的

为避免这个问题，可以用 `Updates.isEmbeddedLaunch` 属性判断应用正在运行嵌入式更新，还是从服务器下载的更新。如果 `Updates.isEmbeddedLaunch` 为 `true`，当前运行的更新嵌入在构建中，这意味着它不会出现在 EAS 仪表盘上。

下面的示例展示如何显示更新是嵌入式的还是下载的：

```tsx update-status.tsx
import * as Updates from 'expo-updates';
import { Text } from 'react-native';

export default function UpdateStatus() {
  return (
    <Text>
      {Updates.isEmbeddedLaunch
        ? '(Embedded) ❌ You cannot trace this update in the EAS dashboard.'
        : '(Downloaded) ✅ You can trace this update in the EAS dashboard.'}
    </Text>
  );
}
```

在 EAS 仪表盘中进入某个更新组时（打开项目，选择 **Over-the-air updates**，再点击某个具体更新），URL 显示为：

```text
https://expo.dev/accounts/[accountName]/projects/[projectName]/updates/[updateGroupId]
```

你可以把 `updateGroupId` 替换为 `Updates.updateId`，直接导航到特定平台的更新：

```text
https://expo.dev/accounts/[accountName]/projects/[projectName]/updates/[updateId]
```

这会打开该平台特定更新所对应的更新组。
