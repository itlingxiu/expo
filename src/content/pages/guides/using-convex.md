---
title: 使用 Convex
description: 用 Convex 为你的应用添加数据库。
---

# 使用 Convex

[Convex](https://www.convex.dev/) 是一个面向响应式应用的后端平台，提供实时数据库、服务端函数、文件存储、搜索、调度与类型安全客户端 —— "无需集群管理、SQL 或 ORM"。

EAS CLI 集成可以自动设置并连接 Convex 项目，替代手动步骤：安装包、创建 Convex 团队/项目、复制部署 URL、配置 EAS 环境变量。

## 前置条件

- **Expo 账户**：在 [expo.dev/signup](https://expo.dev/signup) 注册。
- **EAS CLI**：通过 `npm install -g eas-cli` 全局安装。
- **关联到 EAS 的 Expo 项目**：创建一个项目并用 `eas init` 关联。

## 用 EAS 连接 Convex

### 运行 EAS CLI 集成命令

在项目目录中运行：

```sh
eas integrations:convex:connect
```

它会按需提示 Convex 部署区域、项目名称与团队名称（团队名称仅在创建新的团队连接时需要）。也可以显式传入这些值：

```sh
eas integrations:convex:connect --region aws-us-east-1 --team-name "Your-team-name" --project-name "your-app"
```

该命令会：

- 使用 `npx expo install convex` 安装 `convex`
- 为 EAS 账户创建 Convex 团队连接，或复用现有连接
- 为当前 Expo 应用创建 Convex 项目/部署
- 把 `CONVEX_DEPLOY_KEY` 与 `EXPO_PUBLIC_CONVEX_URL` 写入 **.env.local**
- 为 production、preview 与 development 创建或更新 `EXPO_PUBLIC_CONVEX_URL` EAS 项目环境变量
- 向已验证的邮箱发送邀请，以便认领 Convex 团队并打开仪表盘

### 在本地启动 Convex

集成完成后，启动开发服务器：

```sh
# npm
npx convex dev

# yarn
yarn dlx convex dev

# pnpm
pnpm dlx convex dev

# bun
bunx convex dev
```

如果本地 **convex** 目录不存在，它会创建该目录、生成带类型的 API 文件，并在运行时把函数同步到部署。

### 添加 Convex provider

使用 **.env.local** 中的部署 URL 创建客户端，然后用 `ConvexProvider` 包裹应用。对于 Expo Router，编辑 **src/app/_layout.tsx**：

```tsx src/app/_layout.tsx
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Stack } from 'expo-router';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <Stack />
    </ConvexProvider>
  );
}
```

### 从你的应用查询 Convex

在 **convex** 目录中添加查询函数：

```ts convex/tasks.ts
import { query } from './_generated/server';

export const get = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query('tasks').collect();
  },
});
```

用 `useQuery` 调用它：

```tsx src/app/index.tsx
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Text, View } from 'react-native';

export default function Index() {
  const tasks = useQuery(api.tasks.get);

  return (
    <View>
      {tasks?.map(task => (
        <Text key={task._id}>{task.text}</Text>
      ))}
    </View>
  );
}
```

核心概念 —— 文档、函数、客户端订阅 —— 参见 [Convex 概览](https://docs.convex.dev/understanding/)，它介绍了"数据库文档、函数与实时客户端更新"。

### 管理集成

之后用于查看/管理的命令：

```sh
eas integrations:convex:project
eas integrations:convex:dashboard
eas integrations:convex:team
eas integrations:convex:team:invite
```

用 `eas integrations:convex:project:delete` 或 `eas integrations:convex:team:delete` 移除链接只会删除 EAS 集成元数据；不会销毁 Convex 资源。

### 故障排查

#### 接受发送到其他邮箱的团队邀请

邀请会发送到 Expo 账户上验证过的邮箱，但 Convex 只支持 Google 或 GitHub 登录。如果这两个邮箱不同，邀请页面会提示被邀请的地址尚未添加到 Convex 账户；离开页面会进入一个没有该项目的独立账户。

从现有 Convex 账户接受的步骤：

1. 在邀请页面（或 Convex 仪表盘的个人资料设置中）选择 **Add email**，输入被邀请的地址。
2. 打开 Convex 发送的验证邮件并完成验证。
3. 返回邀请链接并重新加载，或登出后重新打开链接。
4. 接受邀请；团队与项目随后会出现在账户中。

:::note
验证邮箱后流程看似失败是正常的 —— 邀请页面"在你重新加载或重新打开之前不会更新"。
:::
