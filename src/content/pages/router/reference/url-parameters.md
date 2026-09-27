---
title: 使用 URL 参数
description: 了解如何在应用中访问和修改路由参数与搜索参数。
---

# 使用 URL 参数

URL 参数包括**路由参数**和**搜索参数**。Expo Router 提供用于访问和修改这些参数的 hook。

## 路由参数与搜索参数的区别

路由参数是 URL 路径中定义的动态片段，例如 `/profile/[user]`，其中 `user` 是路由参数。它们用于匹配路由。

搜索参数（也称为查询参数）是可以附加到 URL 的可序列化字段，例如 `/profile?extra=info`，其中 `extra` 是搜索参数。它们通常用于在页面之间传递数据。

## 本地与全局 URL 参数

在带有嵌套导航器的应用中，你经常会**同时挂载多个页面**。例如，当压入一条新路由时，栈会把上一页和当前页都保存在内存中。因此，Expo Router 提供两个不同的 hook 来访问 URL 参数：

- **useLocalSearchParams**：返回当前组件的 URL 参数。仅当全局 URL 符合该路由时才会更新。
- **useGlobalSearchParams**：无论组件如何，都返回全局 URL。它在每次 URL 参数变化时更新，并可能导致后台组件多余地更新。

`useGlobalSearchParams` 和 `useLocalSearchParams` 这两个 hook 让你可以在组件内访问这些参数，从而获取并使用这两种 URL 参数。

两个 hook 都是类型化的，访问方式相同。唯一的区别是它们更新的频率。

下面的示例展示 `useLocalSearchParams` 与 `useGlobalSearchParams` 的区别。它使用以下 **app** 目录结构：

```text
src/app/_layout.tsx
src/app/index.tsx
src/app/[user].tsx
```

1. 根布局是一个栈导航器：

   ```tsx src/app/_layout.tsx
   import { Stack } from 'expo-router';

   export default function Layout() {
     return <Stack />;
   }
   ```

2. 初始路由重定向到动态路由 **src/app/[user].tsx**，且 **user=evanbacon**：

   ```tsx src/app/index.tsx
   import { Redirect } from 'expo-router';

   export default function Route() {
     return <Redirect href="/evanbacon" />;
   }
   ```

3. 动态路由 **src/app/[user]** 打印全局和本地 URL 参数（在此例中是路由参数）。它还允许用不同的**路由参数**压入同一路由的新实例：

   ```tsx src/app/[user].tsx
   import { Text, View } from 'react-native';
   import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';

   const friends = ['charlie', 'james']

   export default function Route() {
     const glob = useGlobalSearchParams();
     const local = useLocalSearchParams();

     console.log("Local:", local.user, "Global:", glob.user);

     return (
       <View>
         <Text>User: {local.user}</Text>
         {friends.map(friend => (
           <Link key={friend} href={`/${friend}`}>
             Visit {friend}
           </Link>
         ))}
       </View>
     );
   }
   ```

4. 应用启动时，会打印以下日志：

   ```text
   Local: evanbacon Global: evanbacon
   ```

   按下 “Visit charlie” 会压入 **user=charlie** 的 `/[user]` 新实例，并记录以下内容：

   ```text
   # 这条日志来自新屏幕
   Local: charlie Global: charlie
   # 这条日志来自第一个屏幕
   Local: evanbacon Global: charlie
   ```

   按下 “Visit james” 有类似效果：

   ```text
   # 这条日志来自新的 "/james" 屏幕
   Local: james Global: james
   # 这条日志来自 "/evanbacon" 屏幕
   Local: evanbacon Global: james
   # 这条日志来自 "/charlie" 屏幕
   Local: charlie Global: james
   ```

   **结果：**

   - 当 URL **路由参数**变化时，`useGlobalSearchParams` 会使后台屏幕重新渲染。过度使用可能导致性能问题。
   - 全局重新渲染按栈的顺序执行，因此第一个屏幕先重新渲染，然后 **user=charlie** 屏幕再重新渲染。
   - 即使全局 URL **路由参数**发生变化，`useLocalSearchParams` 也保持不变。可以利用这一行为进行数据获取，以确保导航返回时上一屏幕的数据仍然可用。

## 静态类型化的 URL 参数

`useLocalSearchParams` 和 `useGlobalSearchParams` 都可以用泛型进行静态类型化。下面是 `user` 路由参数的示例：

```tsx src/app/[user].tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
  const { user } = useLocalSearchParams<{ user: string }>();

  return <Text>User: {user}</Text>;
}

// 给定 URL：`/evanbacon`
// 返回如下：{ user: "evanbacon" }
```

任何搜索参数（例如 `?query=...`）都可以可选地类型化：

```tsx src/app/[user].tsx
const { user, query } = useLocalSearchParams<{ user: string; query?: string }>();

// 给定 URL：`/evanbacon?query=hello`
// 返回如下：{ user: "evanbacon", query: "hello" }
```

与剩余语法（`...`）一起使用时，路由参数会作为字符串数组返回：

```tsx src/app/[...everything].tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
  const { everything } = useLocalSearchParams<{
    /* @info **everything** 会是路径片段数组，即使只有一个片段 */
    everything: string[];
    /* @end */
  }>();
  const user = everything[0];

  return <Text>User: {user}</Text>;
}

// 给定 URL：`/evanbacon/123`
// 返回如下：{ everything: ["evanbacon", "123"] }
```

任何搜索参数仍会作为单独的字符串返回：

```tsx src/app/[...everything].tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
  const { everything } = useLocalSearchParams<{
    /* @info **everything** 会是路径片段数组，即使只有一个片段 */
    everything: string[];
    /* @info **query** 是可选的搜索参数 */
    query?: string;
    /* @info **query2** 是可选的搜索参数 */
    query2?: string;
    /* @end */
  }>();
  const user = everything[0];

  return <Text>User: {user}</Text>;
}

// 给定 URL：`/evanbacon/123?query=hello&query2=world`
// 返回如下：{ everything: ["evanbacon", "123"], query: "hello", query2: "world" }
```

## 更新 URL 参数

可以使用命令式 API 中的 **router.setParams** 函数更新 URL 参数。更新 URL 参数不会向历史栈压入任何新内容。

下面的示例使用 `<TextInput>` 更新搜索参数 **q**：

```tsx src/app/search.tsx
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

export default function Page() {
  const params = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(params.query);

  return (
    <TextInput
      value={search}
      onChangeText={search => {
        setSearch(search);
        /* @info 将搜索参数 **query** 设为文本输入 **search** */
        router.setParams({ query: search });
        /* @end */
      }}
      placeholderTextColor="#A0A0A0"
      placeholder="Search"
      style={{
        borderRadius: 12,
        backgroundColor: '#fff',
        fontSize: 24,
        color: '#000',
        margin: 12,
        padding: 16,
      }}
    />
  );
}
```

下面是使用 `onPress` 事件更新路由参数 **user** 的示例：

```tsx src/app/[user].tsx
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from 'react-native';

export default function User() {
  const params = useLocalSearchParams<{ user: string }>();

  return (
    <>
      <Text>User: {params.user}</Text>
      <Text onPress={() => router.setParams({ user: 'evan' })}>Go to Evan</Text>
    </>
  );
}
```

## 路由参数与搜索参数

路由参数用于匹配路由，搜索参数用于在路由之间传递数据。考虑以下结构，其中用路由参数匹配 _user_ 路由：

```text
src/app/index.tsx
src/app/[user].tsx    user 是路由参数
```

当匹配到 `src/app/[user]` 路由时，`user` 参数会传给组件，并且永远不会是空值。搜索参数和路由参数可以一起使用，并通过 `useLocalSearchParams` 和 `useGlobalSearchParams` hook 访问：

```tsx src/app/[user].tsx
import { useLocalSearchParams } from 'expo-router';

export default function User() {
  const {
    // 路由参数
    user,
    // 可选的搜索参数。
    tab,
  } = useLocalSearchParams<{ user: string; tab?: string }>();

  console.log({ user, tab });

  // 给定 URL：`/bacon?tab=projects`，打印如下：
  // { user: 'bacon', tab: 'projects' }

  // 给定 URL：`/expo`，打印如下：
  // { user: 'expo', tab: undefined }
}
```

每当路由参数发生变化，组件都会重新挂载。

```tsx src/app/[user].tsx
import { Text } from 'react-native';
import { router, useLocalSearchParams, Link } from 'expo-router';

export default function User() {
  // 下面三种方式都会更改路由参数 `user`，并添加一个新的用户页面。
  return (
    <>
      <Text onPress={() => router.setParams({ user: 'evan' })}>Go to Evan</Text>
      <Text onPress={() => router.push('/mark')}>Go to Mark</Text>
      <Link href="/charlie">Go to Charlie</Link>
    </>
  );
}
```

## Hash 支持

URL [hash](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash) 是 URL 中 `#` 符号后面的字符串。它常用于网站，以链接到页面的特定章节，也可以用于存储数据。Expo Router 把 hash 当作名为 `#` 的特殊搜索参数。可以用与[搜索参数](#本地与全局-url-参数)相同的 hook 和 API 访问和修改它。

```tsx src/app/hash.tsx
import { Text } from 'react-native';
import { router, useLocalSearchParams, Link } from 'expo-router';

export default function User() {
  // 访问 hash
  const { '#': hash } = useLocalSearchParams<{ '#': string }>();

  return (
    <>
      <Text onPress={() => router.setParams({ '#': 'my-hash' })}>Set a new hash</Text>
      <Text onPress={() => router.push('/#my-hash')}>Push with a new hash</Text>
      <Link href="/#my-hash">Link with a hash</Link>
    </>
  );
}
```

## 保留参数

某些 URL 参数由 Expo Router 和 React Navigation 保留供内部使用。避免使用以下名称作为自己的参数，以防止冲突：

- `screen`
- `params`
- `initial`
- `state`
