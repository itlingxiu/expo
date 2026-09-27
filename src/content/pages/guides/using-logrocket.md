---
title: 使用 LogRocket
description: 安装与配置 LogRocket 以进行会话回放与错误监控的指南。
---

# 使用 LogRocket

[LogRocket](https://logrocket.com) 会录制用户会话，并在用户使用应用时识别缺陷。你可以按更新 ID 筛选会话，也可以在 EAS 仪表盘上连接 LogRocket 账户，以便快速访问应用的会话数据。

## 安装并配置 LogRocket

可以用以下命令安装 LogRocket SDK：

:::tabs
:::tab npm
```sh
npx expo install @logrocket/react-native expo-build-properties
```
:::
:::tab yarn
```sh
yarn expo install @logrocket/react-native expo-build-properties
```
:::
:::tab pnpm
```sh
pnpm expo install @logrocket/react-native expo-build-properties
```
:::
:::tab bun
```sh
bun expo install @logrocket/react-native expo-build-properties
```
:::
:::

然后，在[应用配置](/workflow/configuration)中加入 LogRocket 配置插件：

```json app.json
{
  "plugins": [
    [
      "expo-build-properties",
      {
        "android": {
          "minSdkVersion": 25
        }
      }
    ],
    "@logrocket/react-native"
  ]
}
```

最后，在顶层文件（例如 **src/app/\_layout.tsx**）中初始化 LogRocket：

```tsx src/app/_layout.tsx
import { useEffect } from 'react';
import * as Updates from 'expo-updates';
import LogRocket from '@logrocket/react-native';

const App = () => {
  useEffect(() => {
    LogRocket.init('<App ID>', {
      updateId: Updates.isEmbeddedLaunch ? null : Updates.updateId,
      expoChannel: Updates.channel,
    });
  }, []);
};
```

在上面的代码中，把 `<App ID>` 替换为你的 [LogRocket App ID](https://app.logrocket.com/r/settings/setup)。

## 在 EAS 仪表盘上连接 LogRocket

你可以在 Expo 仪表盘上把 LogRocket 账户和项目链接到 Expo 账户和项目，从而在部署与更新仪表盘中看到应用最近的几次会话。

前往 **Account settings** > [**Overview**](https://expo.dev/accounts/%5Baccount%5D/settings) > **Connections**，点击 **Connect** 以通过 LogRocket 进行身份验证：

![把 LogRocket 账户连接到 Expo 账户。](/static/images/monitoring/monitor-your-app/logrocket-connect-account.webp)

然后进入项目，在 **Project settings** > [**General**](https://expo.dev/accounts/%5Baccount%5D/projects/%5BprojectName%5D/settings) 下点击 **Connect**，把 LogRocket 项目与 Expo 上的项目关联起来：

![把 LogRocket 项目连接到 Expo 项目。](/static/images/monitoring/monitor-your-app/logrocket-connect-project.webp)

之后，你会在 EAS 仪表盘的 Native Deployments 与 Updates 仪表盘中看到 **View on LogRocket** 按钮，以及应用最近的几次会话。

![部署仪表盘中的 View on LogRocket 按钮与会话。](/static/images/monitoring/monitor-your-app/logrocket-view-on-logrocket.webp)

## 进一步了解 LogRocket

要进一步了解如何在 Expo 中使用 LogRocket，请查看 [LogRocket 文档](https://docs.logrocket.com/reference/react-native-expo-adding-the-sdk)。
