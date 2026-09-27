---
title: 自定义标签页布局
description: 了解如何使用无界面标签页组件，在 Expo Router 中创建自定义标签页布局。
---

# 自定义标签页布局

:::warning
这是一项[实验性](/more/release-statuses#experimental)功能。
:::

Expo Router 通过子模块 [`expo-router/ui`](/versions/latest/sdk/router/ui) 提供一组组件，用于创建自定义标签页布局。与带有 React Navigation 样式的 `Tabs` 不同，这些组件没有样式且很灵活。它们旨在让你在项目中从零构建复杂的 UI 模式。

其他标签页布局见：

- [原生标签页](/router/advanced/native-tabs)：如果希望标签栏具有原生外观和手感，请参阅原生标签页。
- [JavaScript 标签页](/router/advanced/tabs)：如果你已经使用 React Navigation 的标签页，请参阅 JavaScript 标签页。

## 自定义 Tabs 组件的结构

`expo-router/ui` 提供四个组件来创建自定义标签页布局：

| 组件 | 说明 |
| --- | --- |
| `Tabs` | 包装组件，包含标签页的 `<View>`。 |
| `TabList` | 容纳 `TabTrigger` 组件列表的 `<View>`。 |
| `TabTrigger` | 用于切换到指定标签页的触发组件。它用 `href` 属性定义路由，并用 `name` 为每个标签页命名。 |
| `TabSlot` | 用于渲染当前选中标签页的插槽。 |

自定义标签页布局的最简结构由一个 `TabList`（为每个标签页包含 `TabTrigger` 组件）和一个 `TabSlot` 组成，它们都位于 `Tabs` 组件内，如下所示：

```tsx src/app/(tabs)/_layout.tsx
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Text } from 'react-native';

// 定义自定义标签页导航器的布局
export default function Layout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList>
        <TabTrigger name="home" href="/">
          <Text>Home</Text>
        </TabTrigger>
        <TabTrigger name="article" href="/article">
          <Text>Article</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
```

## 创建路由

`TabList` 包含标签页导航器内所有可用路由。它必须是 `Tabs` 的直接子项。每条路由由 `TabList` 内的一个 `TabTrigger` 定义。`TabList` 内的 `TabTrigger` 必须包含 `name` 和 `href` 属性。

通常，`TabList` 既定义可用的标签路由，也定义标签页的外观，每个 `TabTrigger` 的子项则定义每个标签按钮的外观。

:::note
`name` 可以是任意 `string`。这是用户为该标签页定义的名称。
:::

### 动态路由

允许动态路由，并可以通过 `href` 提供值。

```text
_layout.tsx
[slug].tsx
```

触发器 `<TabTrigger name="dynamic page" href="/hello-world" />` 会为 **[slug].tsx** 创建一个标签页，参数为 `{ slug: 'hello-world' }`。此设置可用于根据最终用户数据在标签栏中显示任意数量的标签页，例如为应用中的每个用户资料显示单独的标签页。

### 含糊路由

```text
_layout.tsx
(one,two)/route.tsx    共享分组中的一条路由
```

提供给 `TabTrigger` 的 `href` 值必须始终指向单条路由。在上面的共享路由示例中，不允许使用 href `/route`，因为它可能指向 `/(one)/route` 或 `/(two)/route`。不过，在 href 中指定路由组是可以的（例如 `href="/(one)/route"`）。

### 嵌套路由

```text
_layout.tsx
(stack-one)/_layout.tsx                    一个 <Stack> 布局
(stack-one)/(stack-two)/_layout.tsx        嵌套的 <Stack> 布局
(stack-one)/(stack-two)/route.tsx
```

`TabTrigger` 可以链接到深层嵌套的路由。`<TabTrigger name="route" href="/route" />` 会显示 **(stack-one)/(stack-two)/route.tsx** 路由。该标签页由该路由的父导航器控制（即 **(stack-two)/_layout.tsx** 中的导航器）。这种导航类似于深层链接。

## 渲染路由

`TabSlot` 组件渲染当前路由。`TabSlot` 可以嵌套在 `Tabs` 内的其他组件中，但不能位于 `TabList` 内。

```tsx src/app/_layout.tsx
<Tabs>
  <TabList>
    <TabTrigger name="home" href="/">
      <Text>Home</Text>
    </TabTrigger>
  </TabList>
  {/* 自定义 `<TabSlot />` 的渲染方式。 */}
  /* @info `TabSlot` 可以嵌套在自定义组件内。 */
  <View>
    <View>
      <TabSlot />
    </View>
  </View>
  /* @end */
</Tabs>
```

## 切换标签页

可以通过 `Link` 或命令式 API 切换标签页。不过，这些 API 总会执行导航动作（它们会切换标签页，并可能更改 URL）。要在不执行任何导航的情况下切换标签页，应使用 `TabTrigger`。`TabTrigger` 是一个无样式的 `<View>`，按下时会切换标签页，这与把文本和组件包在 `Link` 中使其成为可按下的导航元素类似。

### 重置导航

`TabTrigger` 的 `reset` 属性可用于控制标签页何时重置其导航状态。选项为 `always`、`onLongPress` 和 `never`。这对于嵌套在标签页内的栈导航器特别有用。例如，`<TabTrigger name="home" reset="always" />` 会把用户带回标签页嵌套栈导航器内的 index 路由。

## TabTrigger

`TabTrigger` 用于切换标签页，同时还具有定义哪些路由可作为标签页的双重作用。

### 在 TabList 内

当 `TabTrigger` 用作 `TabList` 的子项时，它定义标签页导航器内有哪些可用路由。这些 `TabTrigger` 需要同时包含 `name` 和 `href` 属性，因为它们定义该标签页的 URL，以及可用于引用该标签页的自定义名称。如果 `TabTrigger` 组件还包含文本或其他组件作为子项，它们也会渲染为标签按钮。不过，也可以在 `TabList` 内定义不带任何 UI 的 `TabTrigger`，然后由 `TabList` 之外的 `TabTrigger` 调用它们。

### 在 TabList 外

可以在 `TabList` 之外再定义一个 `TabTrigger`，从而执行与 `TabList` 中定义的 `TabTrigger` 相同的动作。在这种情况下，`TabTrigger` 不会有 `href` 属性。它会执行与具有相同 `name` 属性的主 `TabTrigger` 相同的动作。这让你可以创建能够切换标签页、且与当前导航状态无关的组件。请注意，所有 `TabTrigger` 至少需要是 `Tabs` 组件的后代，否则它们会被视为位于标签页导航器之外，无法调用它。

## 自定义外观

除了渲染为 `<Pressable>` 的 `TabTrigger` 之外，所有组件都作为无样式的 `<View>` 渲染。这让你可以提供自定义 `style` 属性来自定义外观。为 `TabList` 设置样式类似于在 React Navigation 中自定义标签栏，而为 `TabTrigger` 设置样式会影响标签按钮的外观。

如果需要更改组件的结构，可以使用 `asChild` 属性覆盖其底层组件。该组件随后充当插槽，并把属性转发给其直接子项。

```tsx Custom TabList
<Tabs>
  <TabSlot />
  /* @info 更改 `TabList` 的外观。 */
  <TabList asChild>
    {/* 渲染自定义 TabList */}
    <CustomTabList>
      <TabTrigger name="home" href="/">
        <Text>Home</Text>
      </TabTrigger>
    </CustomTabList>
  </TabList>
  /* @end */
</Tabs>
```

```tsx Custom Button
<Tabs>
  <TabSlot />
  <TabList asChild>
    /* @info 更改 `TabTrigger` 的外观。 */
    <TabTrigger name="home" href="/" asChild>
      {/* 渲染自定义按钮 */}
      <CustomButton>
        <Text>Home</Text>
      </CustomButton>
    </TabTrigger>
    /* @end */
  </TabList>
</Tabs>
```

### 多个标签栏

`TabList` 既是 `Tabs` 的配置，也是其默认外观，但它不是渲染标签栏的唯一方式。通过隐藏 `TabList`，可以用 `TabTrigger` 构建自定义标签栏。

```tsx Multiple tab bars example
<Tabs>
  <TabSlot />
  {/* 自定义标签栏 */}
  <View>
    /* @info 自定义标签栏。TabList 之外的 `TabTrigger` 不需要 `href` 属性。 */
    <View>
      <TabTrigger name="home">
        <Text>Home</Text>
      </TabTrigger>
      <TabTrigger name="article">
        <Text>article</Text>
      </TabTrigger>
    </View>
    /* @end */
  </View>
  /* @info `TabList` 需要被渲染，但不一定要显示。 */
  <TabList style={{ display: 'none' }}>
    /* @end */
    <TabTrigger name="home" href="/">
      <Text>Home</Text>
    </TabTrigger>
    <TabTrigger name="article" href="/article">
      <Text>article</Text>
    </TabTrigger>
  </TabList>
</Tabs>
```

`TabTrigger` 会转发 `isFocused` 属性，因此可以创建单独的标签按钮组件来响应聚焦状态。

```tsx tab-button.tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { ComponentProps, Ref } from 'react';
import { Text, Pressable, View } from 'react-native';

type Icon = ComponentProps<typeof FontAwesome>['name'];

export type TabButtonProps = TabTriggerSlotProps & {
  icon?: Icon;
  ref: Ref<View>;
};

export function TabButton({ icon, children, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable
      {...props}
      style={[
        {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 5,
          padding: 10,
        },
        isFocused ? { backgroundColor: 'white' } : undefined,
      ]}>
      <FontAwesome name={icon} />
      <Text style={[{ fontSize: 16 }, isFocused ? { color: 'white' } : undefined]}>{children}</Text>
    </Pressable>
  );
}
```

<details>
<summary>Expo SDK 52 / React 18 及更早版本</summary>

在 Expo SDK 52 及更早版本（React 18）中，使用旧的 `forwardRef` 函数来访问 `ref` 句柄。

```diff
-import { ComponentProps, Ref } from 'react';
+import { ComponentProps, Ref, forwardRef } from 'react';

-export function TabButton({ icon, children, isFocused, ...props }: TabButtonProps) {
+export const TabButton = forwardRef((props: TabButtonProps, ref: Ref<View>) => {
  // 省略
}
```

</details>

### Hook

所有组件也有 hook 版本，让你可以控制渲染树。可用 hook 的完整列表见[路由器 UI 参考](/versions/latest/sdk/router/ui)。

使用 hook 被视为此库的高级用法。对大多数用例，使用带 `asChild` 的组件就足以控制渲染树。

如果正在开发自定义 `<TabTrigger />`，可能还需要开发自定义 `<TabList />`，因为 `<TabList />` 使用 [`useTabsWithChildren()`](/versions/latest/sdk/router/ui#usetabswithchildrenoptions)，它要求使用导出的 `<TabTrigger />` 组件。

### 自定义标签屏幕的渲染方式

`TabSlot` 接受 `renderFn` 属性。此函数可用于覆盖屏幕的渲染方式，从而允许你实现动画或持久化/卸载屏幕等高级功能。更多信息见[路由器 UI 参考](/versions/latest/sdk/router/ui)。

## 常见问题

<details>
<summary>如何为同一条路由创建多个标签页？</summary>

```text
_layout.tsx              标签页布局
(movie,tv)/[id].tsx
```

应把该路由添加到共享分组中，并为每个分组 `group` 创建单独的 `TabTrigger`。

</details>

<details>
<summary>如何隐藏标签页？</summary>

不渲染 `TabTrigger` 会从应用中移除该标签页（及其导航状态）。

</details>

<details>
<summary>如何创建带动画的标签页？</summary>

可以向 `TabSlot` 提供自定义渲染器，以自定义它渲染屏幕的方式。可以用它检测屏幕何时聚焦，并相应地播放动画。

</details>

<details>
<summary>可以使用相对 href 吗？</summary>

```text
directory/_layout.tsx     本地 pathname 是 /directory
directory/page.tsx        pathname 是 /directory/page
directory/profile.tsx     pathname 是 /directory/profile
```

带有相对 href 的 `TabTrigger` 是相对于渲染 `Tabs` 时的本地路径名的。这与普通相对 href 不同，后者相对于当前显示的路由。例如，即使正在显示 `/directory/page` 路由，`<TabTrigger href="./profile" />` 也会解析为 `/directory/profile`。Expo 不建议使用相对 href。

</details>
