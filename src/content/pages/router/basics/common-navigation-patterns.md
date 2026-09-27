---
title: Expo Router 中的常见导航模式
description: 把 Expo Router 的基础知识应用到应用中可能用到的真实导航模式。
---

# Expo Router 中的常见导航模式

既然你已经了解 Expo Router 中文件和目录如何命名与排列，下面把这些知识应用到应用中可能用到的一些真实导航模式上。

## 标签页内的栈：嵌套导航器

如果应用的典型起点是一组标签页，但一个或多个标签页可能关联不止一个屏幕，通常的做法是在标签页内嵌套栈导航器。这种模式往往产生直观的 URL，并且能很好地扩展到桌面 Web 应用，因为主要标签页通常始终可见。

考虑以下导航树：

```text
src/app/(tabs)/_layout.tsx
src/app/(tabs)/index.tsx              单页标签
src/app/(tabs)/feed/_layout.tsx       内部带栈的标签
src/app/(tabs)/feed/index.tsx
src/app/(tabs)/feed/[postId].tsx
src/app/(tabs)/settings.tsx           单页标签
```

在 **src/app/(tabs)/\_layout.tsx** 文件中返回 `Tabs` 组件：

```tsx src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    /* @info 每个导航器都会添加自己的标题栏，因此你很可能希望在外层导航器中隐藏标题栏。 */
    <Tabs screenOptions={{ headerShown: false }}>
    /* @end */
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
```

在 **src/app/(tabs)/feed/\_layout.tsx** 文件中返回 `Stack` 组件：

```tsx src/app/(tabs)/feed/_layout.tsx
import { Stack } from 'expo-router';

/* @info 设置 `anchor` 可确保直接深入栈的链接仍会先把 index 路由压入栈。 */
export const unstable_settings = {
  anchor: 'index',
};
/* @end */

export default function FeedLayout() {
  return <Stack />;
}
```

现在，在 **src/app/(tabs)/feed** 目录内，可以有指向不同帖子的 `Link` 组件（例如 `/feed/123`）。这些链接会把 `feed/[postId]` 路由压入栈，同时让标签页导航器保持可见。

也可以用相同的 URL 从任何其他标签页导航到动态中的帖子。将 `withAnchor` 与 `anchor` 一起使用，以确保 `feed/index` 路由始终是栈中的第一个屏幕：

```tsx src/app/(tabs)/feed/index.tsx
<Link href="/feed/123" withAnchor>
  Go to post
</Link>
```

也可以把标签页嵌套在外层栈导航器内。这对于在标签页上方显示模态通常更有用。

### 返回你来自的标签页

指向属于另一个标签页的 URL 的 `Link` 会切换标签页，然后返回按钮会弹出该标签页内的栈。在上面的示例中，从 Settings 标签页打开 `/feed/123` 会落在 Feed 标签页中的帖子上。返回会回到 `feed/index`，而不是 Settings。

使用[原生标签页](/router/advanced/native-tabs)时，标签页导航器在挂载时就会加载每个标签页。包含栈的标签页在你链接进入之前，已经位于该栈的第一个屏幕。无论是否传入 `withAnchor`，该屏幕都会位于你链接到的屏幕下方。

如果希望返回按钮回到你来自的屏幕，请把详情路由放在标签页之外，改为从外层栈压入：

```text
src/app/_layout.tsx                 包含标签页的栈
src/app/(tabs)/_layout.tsx
src/app/(tabs)/index.tsx
src/app/(tabs)/feed/_layout.tsx
src/app/(tabs)/feed/index.tsx
src/app/(tabs)/settings.tsx
src/app/feed/[postId].tsx           压在标签栏上方
```

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="feed/[postId]" options={{ title: 'Post' }} />
    </Stack>
  );
}
```

`/feed/123` 现在是根栈的屏幕，而不是 Feed 标签页的屏幕。路由器会把它压在当前打开的任意标签页之上，返回时会回到该标签页。iOS 应用中的详情屏幕通常也是这样表现的。

- [嵌套导航器](/router/advanced/nesting-navigators)：进一步了解如何在 Expo Router 应用中使用嵌套导航器。

## 各平台不同的标签页：平台特定标签页

构建跨平台应用时，你可能希望在 Android 和 iOS 上使用[原生标签页](/router/advanced/native-tabs)以获得平台原生的外观和手感，同时在 Web 上使用[自定义标签页](/router/advanced/custom-tabs)以完全控制样式。可以使用[平台特定文件扩展名](/router/advanced/platform-specific-modules)实现这一点。

```text
src/app/_layout.tsx                      导入 AppTabs
src/app/index.tsx
src/app/feed.tsx
src/app/profile.tsx
src/components/app-tabs.native.tsx       用于 Android 和 iOS 的 AppTabs（原生标签页）
src/components/app-tabs.tsx              用于 Web 的 AppTabs（自定义标签页）
```

根布局渲染 `AppTabs` 组件。Expo 的模块解析会在 Android 和 iOS 上自动选择 **app-tabs.native.tsx**，在 Web 上选择 **app-tabs.tsx**，从而让每个平台使用符合其惯例的标签页实现。

带有代码的完整示例见布局指南中的[平台特定标签页](/router/basics/navigation-layouts#平台特定的标签页)。

## 一个屏幕，两个标签页：共享路由

路由组可用于在两个不同的标签页之间共享单个屏幕。考虑这样一个导航树：有 Feed 标签页和 Search 标签页，它们都共享查看用户资料的页面：

```text
src/app/(tabs)/_layout.tsx
src/app/(tabs)/(feed)/index.tsx                         默认路由
src/app/(tabs)/(search)/search.tsx
src/app/(tabs)/(feed,search)/_layout.tsx                两个标签页之间共享的布局
src/app/(tabs)/(feed,search)/users/[username].tsx       共享的用户资料页
```

每个标签页都放在一个分组中，这样可以定义第三个目录，在两个分组之间共享路由（**src/app/(tabs)/(feed,search)/**）。即使多了一层，**src/app/(tabs)/(feed)/index.tsx** 仍然是最近的 index，因此它会成为默认路由。

```tsx src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="(feed)" options={{ title: 'Feed' }} />
      <Tabs.Screen name="(search)" options={{ title: 'Search' }} />
    </Tabs>
  );
}
```

`(feed)` 和 `(search)` 路由组都包含栈，因此它们也可以共享单个布局：

```tsx src/app/(tabs)/(feed,search)/_layout.tsx
import { Stack } from 'expo-router';

export default function SharedLayout() {
  return <Stack />;
}
```

共享分组也可以只包含共享页面，而每个独立分组有自己的布局文件。

现在，两个标签页都可以导航到 `/users/evanbacon` 并看到同一个用户资料页。

当你已经聚焦在某个标签页并导航到用户时，你会留在当前标签页的分组中。但从应用外部直接深层链接到用户资料页时，Expo Router 必须在两个分组中选择一个，因此它会按字母顺序选择第一个分组。因此，深层链接到 `/users/evanbacon` 会在 Feed 标签页中显示用户资料。

- [共享路由](/router/advanced/shared-routes)：进一步了解不同路由如何在 Expo Router 中共享同一个 URL。

## 仅已认证用户：受保护路由

对于需要认证的移动应用，你很可能有一组只应对已认证用户可访问的路由。

例如，考虑以下导航树：有底部标签页布局、登录页、创建账户页，以及只应对已认证用户可见的模态：

```text
src/app/_layout.tsx           根布局
src/app/(tabs)/_layout.tsx
src/app/(tabs)/index.tsx      受保护
src/app/(tabs)/settings.tsx   受保护
src/app/sign-in.tsx
src/app/create-account.tsx
src/app/modal.tsx             受保护
```

应用首次启动时，路由器会尝试打开根 index，即 **src/app/(tabs)/index.tsx**。如果用 `guard={false}` 的 `Stack.Protected` 包裹此屏幕，该屏幕将变得不可访问，并会打开下一个可用屏幕。在此示例中，会打开 `sign-in` 屏幕，因为它是下一条可用路由。

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';
import { useAuthState } from '@/utils/authState';

export default function RootLayout() {
  const { isLoggedIn } = useAuthState();

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="create-account" />
      </Stack.Protected>
    </Stack>
  );
}
```

这样，可以从存储中获取认证状态并显示相应屏幕。如果认证状态变化，布局会重新渲染，因此如果 `isLoggedIn` 从 `false` 变为 `true`，应用会自动导航到 `(tabs)` 分组的根。

受保护路由的另一个好处是，即使直接深层链接到某个页面，它们也会被检查。例如，如果未认证用户深层链接到上面的模态屏幕，他们会被重定向到登录页。

受保护路由也可用于有条件地显示底部标签页。在此示例中，`vip` 标签页只会对作为 VIP 会员的已认证用户显示：

```tsx src/app/(tabs)/_layout.tsx
import { Stack } from 'expo-router';
import { useAuthState } from '@/utils/authState';

export default function TabsLayout() {
  const { isVip } = useAuthState();

  return (
    <Tabs>
      <Tabs.Screen name="index" />

      <Tabs.Protected guard={isVip}>
        <Tabs.Screen name="vip" />
      </Tabs.Protected>

      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
```

- [Expo Router 认证](/router/advanced/authentication)：按照深入指南，使用受保护路由实现认证。

## 有时最好的路由根本不是路由

把导航状态拆成不同的路由，是为了服务于你和你的应用。有时最适合这项工作的模式根本不涉及导航到另一条路由。由于布局文件只是 React 组件，可以用它们在导航器周围、旁边或代替导航器显示各种 UI。

回到认证：如果用户在未登录时根本不应该访问某些页面，受保护路由的设置效果很好。但如果未认证用户可以以只读模式浏览应用呢？在这种情况下，你可能希望在应用上方显示登录模态，而不是把用户重定向到登录页：

```tsx src/app/(logged-in)/_layout.tsx
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function Layout() {
  const isAuthenticated = /* 检查有效的认证令牌 / 会话 */

  return (
    <SafeAreaView>
      <Stack />
      <Modal visible={!isAuthenticated}>{/* 登录体验 */}</Modal>
    </SafeAreaView>
  );
}
```

- [Expo Router 中的模态](/router/advanced/modals)：了解在 Expo Router 中显示模态的多种模式，包括在布局文件内使用模态。
