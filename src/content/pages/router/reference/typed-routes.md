---
title: 类型化路由
description: 了解如何在 Expo Router 中使用静态类型化的链接和路由。
---

# 类型化路由

> 在项目中使用 TypeScript 时可用。Expo Router 开箱支持标准 TypeScript。如何设置见 [TypeScript](/guides/typescript) 指南。

Expo Router 支持用 Expo CLI 自动生成 TypeScript 类型。这使得 `<Link>` 和 [hooks API](/versions/latest/sdk/router#hooks) 可以被静态类型化。此功能目前处于 beta，默认不启用。

## 入门

### 快速开始

如果使用 [Expo Router 快速开始指南](/router/introduction#quick-start) 创建项目，则项目已经配置为使用类型化路由。第一次运行 `npx expo start` 时，Expo CLI 会生成所需的类型文件。之后，在 **.tsx** 文件中使用 Expo Router 的 `<Link>` 组件时，可以为 `href` 属性使用自动补全。

### 手动配置

该功能处于 beta 期间，可以在 **app.json** 中把 `experiments.typedRoutes` 设为 `true` 来启用：

```json app.json
{
  "expo": {
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

运行 `npx expo customize tsconfig.json`，配置 **tsconfig.json** 并添加所需的 `includes` 字段。

然后运行 `npx expo start` 启动开发服务器。现在可以在 Expo Router `<Link>` 组件的 `href` 属性上使用自动补全。

## 类型生成

Expo Router 中的类型化路由会在开发服务器启动时自动生成。默认情况下，这些生成的类型被配置为不被 Git 跟踪，并会添加到本地 **.gitignore** 文件。这可以确保自动生成的文件不会弄乱版本控制系统。

如果需要在不启动开发服务器的情况下生成这些类型，例如在持续集成（CI）服务器上进行类型检查，可以在 CI 上运行命令 `npx expo customize tsconfig.json`。

## 静态类型化路由

使用 `Href<T>` 的组件和函数现在会被静态类型化，定义也严格得多。例如：

```tsx
✅ <Link href="/about" />
✅ <Link href="/user/1" />
✅ <Link href={`/user/${id}`} />
✅ <Link href={("/user" + id) as Href} />
// 如果 href 不是有效路由，TypeScript 会报错
❌ <Link href="/usser/1" />
```

:::note
`expo-router` 还提供 [`Route` 类型](/versions/latest/sdk/router#route)，它会自动匹配项目中的所有有效路由。
:::

对于动态路由，Href 必须是对象，其参数被严格类型化：

```tsx
✅ <Link href={{ pathname: "/user/[id]", params: { id: 1 }}} />
// href 有效，但应为带 params 的 HrefObject，TypeScript 会报错
❌ <Link href="/user/[id]" />
// params 包含无效键，TypeScript 会报错
❌ <Link href={{ pathname: "/user/[id]", params: { _id: 1 }}} />
// params 包含未知键，TypeScript 会报错
❌ <Link href={{ pathname: "/user/[id]", params: { id: 1, id2: 2 }}} />
```

### 相对路径

静态类型化路由不支持相对路径。所有路由都需要使用绝对路径：

```tsx
✅ <Link href="/about" />

// 不支持相对路径
❌ <Link href="./about" />
```

可以利用 `expo-router` 的 `useSegments()` hook 创建复杂的相对路径。考虑以下结构：

```text
src/app/(feed)/_layout.tsx
src/app/(feed)/feed.tsx
src/app/(feed)/search.tsx
src/app/(feed)/profile.tsx
src/app/(search)/profile.tsx
src/components/button.tsx
```

可以用 `useSegments()` hook 获取当前路由的第一个片段，以确保推入同一个标签页。

```tsx button.tsx
import { Link, useSegments } from 'expo-router';

export function Button() {
  const [
    // 根据当前标签页，这里会是 `(feed)` 或 `(search)`
    first,
  ] = useSegments();

  return <Link href={`/${first}/profile`}>Push profile</Link>;
}
```

现在可以从 **src/app/(feed)/feed.tsx** 和 **src/app/(search)/search.tsx** 使用 `<Button />`，在保留当前标签页的同时推入 `./profile`。

如果某个特定用途需要这些片段，可以把完整路由传给 `useSegments`：

```tsx button.tsx
import { Link, useSegments } from 'expo-router';

export function useMySegments() {
  const segments = useSegments<'/(search)/profile'>();
  //    ^? segments = ['(search)', 'profile']
  return segments;
}
```

## 命令式导航

可以用类型化的 `router` 对象进行命令式导航：

```tsx
import { router } from 'expo-router';

router.push('/about');
```

或者使用类型化的 `useRouter()` hook：

```tsx
import { useRouter } from 'expo-router';

function Page() {
  const router = useRouter();

  router.push('/about');

  // ...
}
```

## 路由参数

要获得强类型的路由参数，可以把完整 href 传给 `useLocalSearchParams` 和 `useGlobalSearchParams` hook。例如：

```tsx src/app/search.tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  /* @info 为路由提供强类型 hook */
  const {
    profile, // string
    search, // string[]
  } = useLocalSearchParams<'/(search)/[profile]/[...search]'>();
  /* @end */

  return (
    <>
      <Text>Profile: {profile}</Text>
      <Text>Search: {search.join(',')}</Text>
    </>
  );
}
```

## 查询参数

大多数查询参数不会出现在文件系统中，因此无法自动类型化。可以通过向 `useLocalSearchParams` 和 `useGlobalSearchParams` hook 传递泛型来手动类型化查询参数。例如：

```tsx src/app/search.tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  /* @info 手动类型化的额外查询参数 */
  const { query } = useLocalSearchParams<{ query?: string }>();
  /* @end */

  return <Text>Search: {query ?? 'unset'}</Text>;
}
```

如果需要同时使用路由参数和查询参数，请把路由作为第一个泛型，然后是查询参数：

```tsx src/app/search.tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  /* @info 同时提供路由和搜索参数 */
  const { query, profile, search } = useLocalSearchParams<
    '/[profile]/[...search]',
    { query?: string }
  >();
  /* @end */

  return <Text>Search: {query ?? 'unset'}</Text>;
}
```

## 对环境所做的更改

启用类型化路由后，Expo CLI 会在项目根目录生成一个被 Git 忽略的 **expo-env.d.ts** 文件，更新 **.gitignore** 以忽略新的根目录 **expo-env.d.ts** 文件，并修改 **tsconfig.json** 以包含新的 **expo-env.d.ts** 文件。

**tsconfig.json** 中的 `includes` 字段会被更新，以包含 **expo-env.d.ts** 和一个隐藏的 **.expo** 目录。这些条目是必需的，不应从文件中移除。

生成的 **expo-env.d.ts** 在任何时候都不应移除或更改。它不应被提交，并应被版本控制忽略。

### 全局类型

启用类型化路由后，Expo CLI 会向项目添加以下全局类型：

- 将 `process.env.NODE_ENV` 设为 `"development" | "production" | "test"`
- 允许导入 `.[css|sass|scss]` 文件
- 将 `*.module.[css|sass|scss]` 的导出设为 `Record<string, string>`
- 为 Metro 的 `require.context` 添加类型。这由 `expo/metro-config` 启用，并用于静态路由生成。

### React Native Web

启用类型化路由后，Expo CLI 还会增强 `react-native` 类型以支持 React Native Web。所做更改如下：

- 为 `ViewStyle`、`TextStyle`、`ImageStyle` 添加仅 Web 的额外样式
- 向 `TextProps` 添加 `tabIndex`、`aria-level`、`lang`
- 向 Pressable 的 `children` 和 `style` 状态回调函数添加 `hovered`
- 添加 `className` 元素
