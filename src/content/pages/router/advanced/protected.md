---
title: 受保护路由
description: 了解如何让屏幕无法通过客户端导航访问。
---

# 受保护路由

> 视频：[观看：使用受保护路由](https://www.youtube.com/watch?v=zHZjJDTTHJg)。使用 Expo Router 中的受保护路由，根据认证状态限制屏幕访问。

## 概览

受保护屏幕可以阻止用户通过客户端导航访问某些路由。如果用户尝试导航到受保护屏幕，或者某个屏幕在处于活动状态时变为受保护，他们会被重定向到锚点路由（通常是 index 屏幕）或栈中第一个可用屏幕。

```text
src/app/_layout.tsx
src/app/index.tsx
src/app/about.tsx
src/app/login.tsx                 仅在未认证时可用
src/app/private/_layout.tsx       仅在已认证时可用
src/app/private/index.tsx
src/app/private/page.tsx
```

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

const isLoggedIn = false;

export function AppLayout() {
  return (
    <Stack>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="private" />
      </Stack.Protected>
      {/* Expo Router 默认包含所有路由。添加 Stack.Protected 会为这些屏幕创建例外。 */}
    </Stack>
  );
}
```

在此示例中，`/private` 路由不可访问，因为 `guard` 为 false。当用户尝试访问 `/private` 时，会被重定向到锚点路由，也就是 **index** 屏幕。

此外，如果用户位于 `/private/page`，且 `guard` 条件变为 **false**，他们会被自动重定向。

当某个屏幕的 **guard** 从 **true** 变为 **false** 时，它的所有历史记录条目都会从导航历史中移除。

## 多个受保护屏幕

在 Expo Router 中，一个屏幕**同一时间只能存在于一个活动路由组中**。

每个屏幕只应声明一次，放在最合适的分组或栈中。如果屏幕是否可用取决于逻辑，请把它包在条件分组中，而不是复制该屏幕。

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

const isLoggedIn = true;
const isAdmin = true;

export function AppLayout() {
  return (
    <Stack>
      <Stack.Protected guard={true}>
        <Stack.Screen name="profile" />
      </Stack.Protected>
      <Stack.Screen name="profile" /> // ❌ 不允许：重复的屏幕
    </Stack>
  );
}
```

## 嵌套受保护屏幕

受保护屏幕可以嵌套，以定义分层的访问控制逻辑。

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

const isLoggedIn = true;
const isAdmin = true;

export function AppLayout() {
  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Protected guard={isAdmin}>
          <Stack.Screen name="private" />
        </Stack.Protected>

        <Stack.Screen name="about" />
      </Stack.Protected>
    </Stack>
  );
}
```

在此情况下：

- `/private` 仅在用户已登录且是管理员时才受保护。
- `/about` 对任何已登录用户受保护。

## 使用默认重定向

如果访问被拒绝，导航器会重定向到其锚点路由或第一个可用屏幕。

```text
src/app/_layout.tsx
src/app/index.tsx
src/app/about.tsx
src/app/login.tsx
src/app/private/_layout.tsx
src/app/private/index.tsx
src/app/private/page.tsx
```

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

const isLoggedIn = false;

export function AppLayout() {
  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="index" />
        <Stack.Screen name="private" />
      </Stack.Protected>

      <Stack.Screen name="login" />
    </Stack>
  );
}
```

在此示例中，**index** 屏幕受保护且 `guard` 为 **false**，因此路由会重定向到第一个可用屏幕：**login**。

## 重定向到指定路由

:::note
自 **SDK 58 及更高版本**起可用。
:::

当受保护路由应重定向到指定路由时，使用 `redirectTo` 属性。它接受与 [`Link`](/router/basics/navigation#链接与按钮) 相同的字符串或对象形式的 href。

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

const isLoggedIn = false;

export function AppLayout() {
  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn} redirectTo="/login">
        <Stack.Screen name="private" />
      </Stack.Protected>

      <Stack.Screen name="login" />
    </Stack>
  );
}
```

## Tabs 与 Drawer

受保护路由也可用于 [Tabs](/router/advanced/tabs) 和 [Drawer](/router/advanced/drawer) 导航器。

```tsx src/app/_layout.tsx
import { Tabs } from 'expo-router/js-tabs';

const isLoggedIn = false;

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ tabBarLabel: 'Home' }} />
      <Tabs.Protected guard={isLoggedIn}>
        <Tabs.Screen name="private" options={{ tabBarLabel: 'Private' }} />
        <Tabs.Screen name="profile" options={{ tabBarLabel: 'Profile' }} />
      </Tabs.Protected>

      <Tabs.Protected guard={!isLoggedIn}>
        <Tabs.Screen name="login" options={{ tabBarLabel: 'Login' }} />
      </Tabs.Protected>
    </Tabs>
  );
}
```

## 自定义导航器

:::note
稳定的自定义导航器 API 自 **SDK 58 及更高版本**起可用。
:::

用 `createStandardRouterNavigator` 或 `integrateWithRouter` 创建的导航器包含 `.Protected` 子组件。创建或集成导航器见[自定义导航器](/router/advanced/custom-navigators)。

## 静态渲染的注意事项

受保护屏幕只在客户端求值。静态站点生成期间，不会为受保护路由创建 HTML 文件。不过，如果用户知道这些路由的 URL，他们仍然可以直接请求对应的 HTML 或 JavaScript 文件。受保护屏幕不能替代服务端认证或访问控制。
