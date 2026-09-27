---
title: 在 Expo Router 中于页面之间导航
description: 了解在 Expo Router 中链接并导航到页面的不同方式。
---

# 在 Expo Router 中于页面之间导航

应用中有了若干页面及其布局之后，就可以开始在它们之间导航了。Expo Router 中的每个页面默认都有 URL，因此可以用链接以及你在 Web 上使用的相同 URL 模式在页面之间导航。

## 使用 `useRouter` 的原生导航基础

与 React Navigation 一样，可以从 `onPress` 处理函数中调用函数来导航到另一页。在 Expo Router 中，可以使用 `useRouter` hook 访问导航函数：

```tsx
import { useRouter } from 'expo-router';
import { Button } from 'react-native';

export default function Home() {
  const router = useRouter();

  return <Button title="Go to About" onPress={() => router.navigate('/about')} />;
}
```

Expo Router 应用默认使用栈导航：导航到新路由会把屏幕压入栈，退出该路由会把它从栈中弹出。通常应使用 `router.navigate` 函数。它会把新页面压入栈，或回退到栈上已有的路由。也可以调用 `router.push` 显式把新页面压入栈，调用 `router.back` 返回上一页，或调用 `router.replace` 替换栈上的当前页面。

使用 Expo Router 时，通过 URL 或相对于 **src/app** 目录的位置来引用页面。查看以下文件结构，以及如何导航到每个页面：

```text
src/app/index.tsx              router.navigate("/")
src/app/about.tsx              router.navigate("/about")
src/app/profile/index.tsx      router.navigate("/profile")
src/app/profile/friends.tsx    router.navigate("/profile/friends")
```

- [路由器命令式导航 API 参考](/versions/latest/sdk/router#imperativerouter)：了解命令式导航可用的全部函数。

## 链接与按钮

在 Expo Router 中链接到页面的典型方式是像 Web 应用那样使用链接。Expo Router 有一个用于在页面之间导航的 `Link` 组件，其中 `href` 与你在 `router.navigate` 中使用的路由相同：

```tsx src/app/index.tsx
import { View } from 'react-native';
/* @info 从 `expo-router` 导入 `Link` React 组件。 */
import { Link } from 'expo-router';
/* @end */

export default function Page() {
  return (
    <View>
      /* @info 点按此项会链接到 **about** 页面。 */
      <Link href="/about">About</Link>
      /* @end */
    </View>
  );
}
```

默认情况下，`Link` 组件在 `<Text>` 元素内渲染其子项。这意味着非文本子项（例如 `View`）可能出现意外的布局行为。要完全控制布局，请对接受 `onPress`/`onClick` 属性的 `Pressable` 或其他组件使用 `asChild` 属性：

```tsx
import { Pressable, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    /* @info 导航到 `/other` 的 `onPress` 事件会被传给 `Pressable`。 */
    <Link href="/other" asChild>
    /* @end */
      <Pressable>
        <Text>Home</Text>
      </Pressable>
    </Link>
  );
}
```

- [Link API 参考](/versions/latest/sdk/router/link#link)：了解使用链接进行导航时的可用选项。
- [链接预览](/router/reference/link-preview)：了解如何在使用 Expo Router 时为 iOS 上的链接添加预览。

## 相对路由

不必总是使用路由的绝对路径。以 `./`（当前目录）或 `../`（父目录）开头的路径会相对于当前路由导航。

相对 URL 是带 `./` 前缀的 URL，例如 `./article` 或 `./article/`。相对 URL 相对于当前渲染的屏幕解析。

```tsx
<Link href="./article">Go to article</Link>
```

```ts
router.navigate('./article');
```

## 动态路由与 URL 参数

> 视频：[在 Expo Router 中使用动态路由](https://www.youtube.com/watch?v=izZv6a99Roo&t=350)。了解如何使路由的某一段成为动态的。

可以通过完整 URL 链接到动态路由，或通过传入 `params` 对象来链接。

考虑以下文件结构：

```text
src/app/user/[id].tsx
```

下面每个链接都会导航到同一页面：

```tsx src/app/index.tsx
/* @info 从 `expo-router` 导入 `Link` React 组件和 `router`，以进行命令式导航。 */
import { Link, router } from 'expo-router';
/* @end */
import { View, Pressable, Text } from 'react-native';

export default function Page() {
  return (
    <View>
      <Link
        href="/user/bacon">
        View user (id inline)
      </Link>
      <Link
        href={{
          pathname: '/user/[id]',
          params: { id: 'bacon' }
        }}
      >
        View user (id in params in href)
      </Link>
      <Pressable
        onPress={() =>
          router.navigate({
            pathname: '/user/[id]',
            params: { id: 'bacon' }
          })
        }
      >
        <Text>View user (imperative)</Text>
      </Pressable>
    </View>
  );
}
```

:::note
某些参数由 Expo Router 和 React Navigation 保留供内部使用。可以在[使用 URL 参数指南](/router/reference/url-parameters#保留参数)中找到它们。
:::

### 传递查询参数

可以在链接 URL 本身中指定查询参数，或作为 `params` 对象中的额外参数。任何与动态路由变量名称不匹配的参数都等同于查询参数。

```tsx
<Link href="/users?limit=20">View users</Link>

<Link
  href={{
    pathname: '/users',
    params: { limit: 20 }
  }}>
  View users
</Link>
```

### 在目标页面中使用动态路由变量和查询参数

链接 URL 中的所有变量都可以通过 `useLocalSearchParams` hook 在接收页面上访问。此 hook 返回一个包含所有 URL 参数的对象，包括以 `params` 传入的参数。

例如，如果有这样的链接：

```tsx
<Link href="/users?limit=20">View users</Link>
```

然后可以在另一端这样读取参数：

```tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function Users() {
  const { id, limit } = useLocalSearchParams();

  return (
    <View>
      <Text>User ID: {id}</Text>
      <Text>Limit: {limit}</Text>
    </View>
  );
}
```

### 不导航而更新查询参数

可以在不导航到新页面的情况下更新查询参数。可以用与当前页面相同 URL、但查询参数已更新的 `Link` 来完成，也可以用命令式方式。

```tsx
<Link href="/users?limit=50">View more users</Link>

<Pressable onPress={() => router.setParams({ limit: 50 })}>
  <Text>View more users</Text>
</Pressable>
```

- [使用 URL 参数](/router/reference/url-parameters)：进一步了解如何在 Expo Router 中设置和使用 URL 参数。

## 重定向

可以用 `Redirect` 组件从页面或布局立即重定向到另一条路由。其作用类似于 `replace` 命令式导航函数。重定向会导航到新路由，而不渲染当前页面。

```tsx
import { Redirect } from 'expo-router';

export default function Page() {
  return <Redirect href="/about" />;
}
```

## 预取

`<Link />` 组件上的 `prefetch` 属性会在组件渲染时启用目标屏幕的预取。这可以通过提前准备屏幕来加快导航。

```tsx
import { Link } from 'expo-router';

export default function Page() {
  return <Link href="/about" prefetch />;
}
```

设置 `prefetch` 后，Expo Router 会尝试在屏幕外渲染目标屏幕。具体行为取决于所用导航器的类型：

- **Expo Router 导航器**：在屏幕外渲染目标屏幕以启用预加载。
- **自定义导航器**：可能以不同方式实现预取，或完全不支持。

当屏幕在栈导航器中被预加载时，会有一些限制：

- 不能使用命令式 `router` API。
- 不能用 `useNavigation().setOptions()` 更新选项。
- 不能监听来自导航器的事件（例如 focus、tabPress 等）。

导航到该屏幕后，导航对象会更新。因此，如果在 useEffect hook 中有事件监听器，并且依赖 navigation，那么在导航到该屏幕时会添加这些监听器：

```tsx
const navigation = useNavigation();

useEffect(() => {
  const unsubscribe = navigation.addListener('tabPress', () => {
    // 做一些事情
  });

  return () => {
    unsubscribe();
  };
}, [navigation]);
```

同样，在分发动作或更新选项时，可以先检查屏幕是否已聚焦：

```tsx
const navigation = useNavigation();

if (navigation.isFocused()) {
  navigation.setOptions({ title: 'Updated title' });
}
```

更多信息见 [React Navigation preload 文档](https://reactnavigation.org/docs/navigation-object/#preload)。

## 深层链接

深层链接是指 URL 打开应用中的特定页面。Expo Router 默认支持深层链接，因此可以用应用外部的 URL 链接到应用中的任何页面，就像在应用内部用 `Link` 一样。这对于分享应用中特定页面的链接特别有用。

在 Web 上，深层链接就像在 Web 浏览器中导航到该特定 URL 一样简单。在移动端，在[应用配置](/workflow/configuration)文件中定义 `scheme`，它会成为进入应用的深层链接前缀。

假设 `scheme` 是 `myapp`，下面是从网页或其他应用链接到应用中某个页面的示例：

```text
src/app/about.tsx                 myapp://about
src/app/profile/index.tsx         myapp://profile
src/app/users/[username].tsx      myapp://users/evanbacon
```

借助应用链接和通用链接，也可以用 `https` URL 链接到应用。更多信息见[通用链接](/linking/overview#通用链接)。

## 锚点路由

通过深层链接打开应用中的某个页面时，你很可能希望返回导航的表现就像用户从主页导航到该页面一样。为此，可以指定 `anchor` 配置，它定义在深层链接页面之前应加载的布局中的页面。

考虑以下文件结构：

```text
src/app/index.tsx
src/app/stack/index.tsx
src/app/stack/second.tsx
src/app/stack/_layout.tsx
```

`stack` 是一个栈导航器，`/stack/index` 始终是栈中的第一条路由。

为确保即使用户深层链接到 `/stack/second`，`/stack/index` 也始终首先加载，可以在 **src/app/stack/\_layout.tsx** 中设置 `anchor`：

```tsx
export const unstable_settings = {
  // 确保任意路由都能链回 `/`
  anchor: 'index',
};
```

默认情况下，`anchor` 只在深层链接时考虑，在应用内导航时不考虑。不过，可以在 `Link` 上使用 `withAnchor` 属性，强制在应用内直接导航到另一个栈时加载锚点路由。

因此，如果 **src/app/index.tsx** 包含指向 `/stack/second` 的链接，添加 `withAnchor` 属性以确保首先加载 `/stack/index`。这样用户从 `/stack/second` 按下返回按钮时，会回到 `/stack/index`：

```tsx
<Link href="/stack/second" withAnchor>
  Go to second
</Link>
```

:::note
如果测试深层链接时缺少返回按钮，通常可以通过设置 `anchor` 来修复。
:::
