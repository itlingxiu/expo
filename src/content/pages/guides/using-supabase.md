---
title: 使用 Supabase
description: 通过 Supabase 把 Postgres 数据库与用户认证连接到 React Native 应用。
---

# 使用 Supabase

[Supabase](https://supabase.com/) 是一个"构建在 Postgres 之上的后端即服务（BaaS）应用开发平台"。它自动生成 REST API 并使用行级安全（row level security），因此 React Native 应用无需中间服务器即可直接查询。EAS CLI 集成处理授权、项目创建/关联、SDK 安装与环境变量；也提供手动设置路径，本指南其余部分对两者都适用。

## 前置条件

- **Expo 账户** —— 在 expo.dev/signup 注册。
- **EAS CLI** —— `npm install -g eas-cli`。
- **关联到 EAS 的 Expo 项目** —— 创建一个并运行 `eas init`。
- **Supabase 账户** —— 在 supabase.com/dashboard/sign-up 注册。

## 你将学到

安装/配置 Supabase；添加身份验证；设置环境（本地、Production、Preview）；管理集成并排查故障。

## 安装并配置 Supabase

### 运行 `connect` 命令

```sh
eas integrations:supabase:connect
```

没有关联任何项目时，这会创建一个新的 Supabase 项目；要使用现有项目：

```sh
eas integrations:supabase:connect --link <project-ref-or-url>
```

该命令会：打开浏览器进行 Supabase 授权；如果有多个**组织**则询问选择哪一个；询问**区域**（Americas、EMEA、Asia Pacific），创建项目并等待 —— "区域决定你的数据驻留地，项目创建后无法更改"；安装 `@supabase/supabase-js` 与 `expo-sqlite`（用于存储认证会话），并把 `expo-sqlite` 配置插件添加到应用配置（使用动态应用配置时会打印要添加的条目）；把 `EXPO_PUBLIC_SUPABASE_URL` 与 `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 写入 **.env.local**，以及 Production、Preview、Development 的 EAS 环境变量。

这两个值都是公开的、可以随应用发布；任何持有它们的人都可以查询数据库，因此行级安全才是保护数据的关键 —— 在每张被读写的表上启用它并添加策略。

:::warning
"永远不要把数据库密码或 secret key 放进你的应用。"secret key 会绕过 RLS 并获得完整的数据访问权。
:::

重复运行 `connect` 是安全的：它会复用连接与项目，在覆盖环境变量前会提示。

#### 查找你的项目引用 ID

`--link` 接受引用 ID、仪表盘 URL 或项目 API URL；该 ID 显示在 **Project Settings** > **General** 下。项目名称不可用。

```sh
eas integrations:supabase:connect --link abcdefghijklmnopqrst

eas integrations:supabase:connect --link https://supabase.com/dashboard/project/abcdefghijklmnopqrst
```

#### 在 CI 中或非交互式运行

EAS Build/Update 从它们的运行时环境读取变量，因此只有在 CI 创建或关联项目时才在 CI 中运行 `connect`：

```sh
eas integrations:supabase:connect --non-interactive --region us-east-1 --overwrite
```

- 非交互式创建需要 `--region`；接受 `americas`、`emea`、`apac`，或 `us-east-1` 这样的代码。
- `--overwrite` 不提示直接替换现有环境变量。
- `--organization` 选择 Supabase 组织。
- `--json` 隐含 `--non-interactive`。

授权需要浏览器，因此至少先交互式运行一次 `connect`。

### 创建 Supabase 客户端

创建一个读取已写入环境变量的辅助模块。路径遵循默认模板，其中 `@/` 映射到 **src**；检查 **tsconfig.json** 中的 `paths` 或使用相对导入。

```ts src/lib/supabase.ts
import 'expo-sqlite/localStorage/install';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

`expo-sqlite/localStorage/install` 提供用于跨启动持久化会话的 `localStorage`；`detectSessionInUrl` 设为 `false`，因为 Android/iOS 没有用于此目的的 URL。Supabase 快速入门还导入了 `react-native-url-polyfill/auto`，在 Expo 中不需要，因为已经存在 `URL` 全局对象。

### 创建一张表

运行 `eas integrations:supabase:dashboard` 打开项目，然后在 **SQL Editor** 中：

```sql Supabase SQL Editor
create table public.todos (
  id bigint generated always as identity primary key,
  title text not null
);
alter table public.todos enable row level security;
create policy "Anyone can read todos" on public.todos for select using (true);
grant select on public.todos to anon, authenticated;
insert into public.todos (title) values ('Hello from Supabase');
```

未登录时请求使用 `anon`，登录后使用 `authenticated`；策略决定哪些行可读。没有策略时，select 返回空数组且不报错。添加 insert 策略即可允许写入。

grant 是保障措施而非必需：托管项目已经给新 `public` 表向两个角色授予 `select`、`insert`、`update`、`delete`，但 Supabase 正在把这些授权改为可选（外部链接：hardening-data-api）。撤销了这些授权的项目会报 `permission denied for table todos`。对已有权限执行 grant 不会有任何变化。

### 验证配置

```tsx src/app/index.tsx
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const [titles, setTitles] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from('todos')
      .select()
      .then(({ data, error }) => {
        if (error) {
          setTitles([error.message]);
          return;
        }
        setTitles(data.map(todo => todo.title));
      });
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {titles.map(title => (
        <Text key={title}>{title}</Text>
      ))}
    </View>
  );
}
```

启动应用：

```sh
npx expo start
```

显示 `Hello from Supabase` 说明客户端工作正常；空屏幕说明没有读策略；报错说明另有问题（参见故障排查）。以上全部可以在 Expo Go 中运行，但一旦向 `expo-sqlite` 插件传入选项或添加其他原生库，就需要开发构建。外部链接：Supabase 数据库概览（表、RLS 策略、realtime）。

## 添加身份验证

第 2 步的客户端已经持久化会话，因此邮箱/密码登录无需额外配置。新项目默认确认邮箱，所以第一次 `signUp` 返回 `data.user` 而 `data.session` 为 `null`，直到确认完成，或在邮箱提供商设置中禁用 **Confirm email**。

因为 `autoRefreshToken` 在 Android 与 iOS 上会持续循环，Supabase 的 `startAutoRefresh` 参考建议把它与应用状态绑定。添加到客户端文件：

```ts src/lib/supabase.ts
import { AppState } from 'react-native';

AppState.addEventListener('change', state => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
```

OAuth 提供商与 magic link 需要深度链接 —— 参见 Supabase 的移动端深度链接指南。

## 设置环境

`connect` 把值存为 EAS 环境变量（内部链接：/eas/environment-variables），因此每次构建/更新读取各自的坏境。一个 Supabase 项目存放一个环境的数据，因此多个环境意味着多个项目 —— 添加第二个前先查看 Supabase 套餐限制。

**Development** 使用 Supabase CLI 在本地运行。启动 Docker，然后：

```sh
# npm
npx supabase init
npx supabase start
npx supabase status

# yarn
yarn dlx supabase init
yarn dlx supabase start
yarn dlx supabase status

# pnpm
pnpm dlx supabase init
pnpm dlx supabase start
pnpm dlx supabase status

# bun
bunx supabase init
bunx supabase start
bunx supabase status
```

把 **.env.local** 中的托管值替换为 `supabase status` 输出的 URL 与 publishable key。导出的 shell 变量会覆盖 **.env.local**，所以编辑文件而不是 export。本地数据库启动时是空的 —— 也要对它运行建表 SQL。重新运行 `connect` 会重写托管值。

:::note
本地 URL 指向你的电脑；实体设备或 Android 模拟器无法访问它，所以使用你电脑的 LAN 地址而不是 `127.0.0.1`。
:::

#### 把 Development 环境指向本地栈

`connect` 写入的变量覆盖 Production、Preview 与 Development。`eas env:pull --environment development` 替换 **.env.local** 前会提示，并重写整个文件，丢弃本地值。要把 Development 指向本地，把变量拆成两个。`eas env:set` 会复用同名且环境重叠的变量，所以只针对 Development 的设置会连 Production 与 Preview 一起移到本地 URL：

```sh
eas env:delete --variable-name EXPO_PUBLIC_SUPABASE_URL

eas env:set --name EXPO_PUBLIC_SUPABASE_URL --value <hosted-url> --environment production --environment preview --visibility plaintext

eas env:set --name EXPO_PUBLIC_SUPABASE_URL --value http://127.0.0.1:54321 --environment development --visibility plaintext
```

如果 **eas.json** 中有构建 profile 设置了 `"environment": "development"`，不要这样做 —— 云构建会嵌入一个不可达的 URL。

**Production** 使用 `connect` 创建的项目。**Preview** 默认没有；要给 Preview 或其他 EAS 环境一个自己的托管项目，用 `--environment` 重新运行（计入套餐的活跃项目上限）：

```sh
eas integrations:supabase:connect --environment preview
```

新值只写入指定的环境；其他环境保留第一个项目。如果目标环境已有 `EXPO_PUBLIC_SUPABASE_*` 值，命令会询问是否替换。与普通 `connect` 不同，它不安装 SDK、不修改 **.env.local**，也不能与 `--link`、`--reauth` 或 `--organization` 组合。要把某个 EAS 环境指向现有项目，用 `eas env:set` 自己设置两个变量，先把共享变量替换为两个。

## 管理集成

```sh
eas integrations:supabase:dashboard

eas integrations:supabase:disconnect
```

`dashboard` 打开已关联的项目。`disconnect` 只移除 Expo 侧的链接 —— 项目、数据与环境变量不受影响。断开后，`connect` 看不到链接并会创建新项目；要重新连接到同一个项目，用 `connect --link` 加上它的引用 ID。

## 手动设置

`connect` 只是标准设置的快捷方式。手动步骤：

1. 在 database.new 创建项目。
2. 从 API Settings 复制 **Project URL**，从 API Keys 复制 **Publishable key**。
3. 安装 SDK：

```sh
# npm
npx expo install @supabase/supabase-js expo-sqlite

# yarn
yarn expo install @supabase/supabase-js expo-sqlite

# pnpm
pnpm expo install @supabase/supabase-js expo-sqlite

# bun
bun expo install @supabase/supabase-js expo-sqlite
```

4. 把 `expo-sqlite` 配置插件添加到应用配置。
5. 在 **.env.local** 中设置 `EXPO_PUBLIC_SUPABASE_URL` 与 `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`，然后创建第 2 步的客户端文件。

## 故障排查

- **达到活跃项目上限** —— Free 套餐每个用户有两个活跃项目，在组织 owner/admin 之间共享；暂停的项目不计入。用 `--link` 关联现有项目、暂停/删除一个、升级套餐，或参见 Supabase 的计费 FAQ。`--environment` 不能与 `--link` 组合，所以这条路径下要么腾出一个名额，要么自己设置两个变量。
- **项目引用 ID 无效** —— 项目必须属于已连接的组织；接受的格式见上文。
- **环境变量没有更新** —— 重载应用；如果仍读到旧值，停止开发服务器并重新运行 `npx expo start`。
- **刚创建的表不存在** —— schema 缓存可能导致 `Could not find the table 'public.todos' in the schema cache`；重试即可，缓存会自行刷新。
- **表的 permission denied** —— 为两个角色添加所需的 grant，例如 `grant select on public.todos to anon, authenticated`。只有策略还不够；与缺失策略（空数组）不同，这会以 `error.code` 为 `42501` 报错。
- **Supabase 授权失效** —— 如果 Expo 的访问被撤销，运行 `eas integrations:supabase:connect --reauth`，它会清除存储的连接与链接，重新打开浏览器，然后询问是关联还是创建；准备好引用 ID。项目不受影响。它需要浏览器，非交互模式下会失败。
- **创建了多余的项目但没有环境变量** —— 如果 `connect --environment` 创建项目后写入变量失败，它会打印 URL 与 key；用 `eas env:set` 保存。不要重新运行 `connect --environment` —— 那会再创建一个项目并计入套餐上限。

## 延伸阅读（外部链接）

- 构建用户管理应用 —— Supabase Auth + 数据库快速入门。
- Sign in with Apple —— 使用 Supabase Auth 的 Android/iOS 社交登录。
- Sign in with Google —— 同上，针对 Google。
- 使用 WatermelonDB 的离线优先应用 —— 与 Postgres 同步的本地存储。
- 使用 Supabase Storage 上传文件 —— React Native 中的认证与文件上传。
