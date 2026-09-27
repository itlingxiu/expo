---
title: 自定义导航器
description: 了解如何在 Expo Router 中构建自己的导航器，以及库作者如何把现有导航器与路由器集成。
---

# 自定义导航器

Expo Router 为最常见的模式提供了导航器——[Stack](/router/advanced/stack)、[Tabs](/router/advanced/tabs)、[原生标签页](/router/advanced/native-tabs) 和 [Drawer](/router/advanced/drawer)。当它们都不合适时，你可以构建自己的导航器，并把它用作布局。基于文件的路由、深层链接和类型化路由的工作方式与内置导航器完全相同。

选择与目标匹配的入口：

- **应用开发者**为单个应用构建导航器时，使用 [`createStandardRouterNavigator`](#在应用中创建导航器)。
- **库作者**发布同时面向 Expo Router 和 React Navigation 的可复用导航器时，使用 [`integrateWithRouter`](#集成现有导航器库作者)。

:::note
稳定的 `createStandardRouterNavigator` 和 `integrateWithRouter` API 自 **SDK 58 及更高版本**起可用。在 SDK 56 和 SDK 57 中，请改用 `unstable_createStandardRouterNavigator` 和 `unstable_integrateWithRouter`。
:::

要把路由渲染为 Web 模态遮罩的栈导航器，见[构建自定义 Web 模态](/router/advanced/web-modals)。

## 在应用中创建导航器

使用 `createStandardRouterNavigator` 把内容组件变成可以作为布局渲染的导航器。它接受两个必需参数：

- **`NavigatorContent`**：渲染导航器 UI 的组件。它接收当前导航 `state`、每个屏幕的 `descriptors`、用于导航的 `actions`，以及用于发送事件的 `emitter`。
- **`router`**：要使用的路由行为。从 `expo-router` 导入 `StackRouter` 以进行类似栈的导航，或导入 `TabRouter` 以进行类似标签页的导航。

下面的示例构建一个最小的标签页导航器：

```tsx components/Tabs.tsx
import { createStandardRouterNavigator, TabRouter, type NavigatorContentProps } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

// 第一个类型参数是可以为每个屏幕设置的选项
type TabsContentProps = NavigatorContentProps<{ title?: string }>;

function TabsContent({ state, descriptors, actions }: TabsContentProps) {
  const focusedRoute = state.routes[state.index];

  return (
    <View style={{ flex: 1 }}>
      {/* 渲染聚焦路由的屏幕。 */}
      <View style={{ flex: 1 }}>{descriptors[focusedRoute.key].render()}</View>

      {/* 一个简单的标签栏。 */}
      <View style={{ flexDirection: 'row' }}>
        {state.routes.map(route => (
          <Pressable
            key={route.key}
            style={{ flex: 1, padding: 16 }}
            onPress={() => actions.navigate(route.name)}>
            <Text>{descriptors[route.key].options.title ?? route.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export const Tabs = createStandardRouterNavigator(TabsContent, TabRouter);
```

返回的导航器具有用于声明屏幕的 `.Screen` 子组件，因此可以像任何其他布局一样在 `_layout` 文件中使用它：

```tsx app/_layout.tsx
import { Tabs } from '../components/Tabs';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
```

### `NavigatorContent` 接收的内容

| 属性 | 说明 |
| --- | --- |
| `state` | 当前导航状态：`{ index, routes }`，每条路由都有 `key`、`name`、`params` 和 `href`。 |
| `descriptors` | 以 `route.key` 为键的映射。每个描述符暴露屏幕已解析的 `options`，以及渲染该屏幕的 `render()` 函数。 |
| `actions` | 用于更改导航状态的函数：`navigate(name, params?)` 和 `back()`。 |
| `emitter` | 带有 `emit()` 方法的对象，用于向屏幕发送事件。 |

### 类型化事件

如果导航器发出事件，请在 `NavigatorContentProps` 的第二个类型参数中声明它们。每个键是事件名称，其值描述事件的 `data` 以及它是否 `canPreventDefault`。然后 `emitter.emit` 会针对该映射进行类型检查——未知事件名称和不匹配的载荷会被拒绝：

```tsx
type TabsContentProps = NavigatorContentProps<
  { title?: string },
  { tabPress: { data: undefined; canPreventDefault: true } }
>;

function TabsContent({ emitter }: TabsContentProps) {
  emitter.emit({ type: 'tabPress', canPreventDefault: true });
  // ...
}
```

`createStandardRouterNavigator` 会从组件推断事件映射，因此不必在调用处再次传入。对于不发出事件的导航器，省略第二个类型参数。

### 选项

`createStandardRouterNavigator` 和 `integrateWithRouter` 都接受可选的 `options` 对象作为第三个参数。使用 `createProps` 派生不属于标准 `state` 和 `actions` 的、导航器特定的属性：

```tsx
export const Tabs = createStandardRouterNavigator(TabsContent, TabRouter, {
  createProps: ({ state, dispatch }) => ({
    activeRouteKey: state.routes[state.index].key,
    preload: (name: string) => dispatch({ type: 'PRELOAD', payload: { name } }),
  }),
});
```

在 `NavigatorContentProps` 的第四个类型参数中声明 `createProps` 返回的属性，这样 `NavigatorContent` 会以类型化的方式接收它们：

```tsx
type TabsContentProps = NavigatorContentProps<
  { title?: string },
  // 此示例中没有自定义事件。
  Record<string, never>,
  // 此示例中没有自定义导航器属性。
  object,
  // 由 createProps 注入的属性。
  { activeRouteKey: string; preload: (name: string) => void }
>;

function TabsContent({ activeRouteKey, preload }: TabsContentProps) {
  // ...
}
```

:::note
`createProps` 接收经过处理的 Expo Router `state` 和原始 `dispatch`。它们是内部的，版本之间可能有小的破坏性变更，因此在足够用时，优先使用传给 `NavigatorContent` 的 `state` 和 `actions`。如果标准 `state`、`actions` 或 `emitter` 中缺少你需要的内容，请[在 GitHub 上提交 issue](https://github.com/expo/expo/issues)。
:::

## 集成现有导航器（库作者）

### 标准导航器 API

上面展示的 `NavigatorContent` 组件是一个[标准导航器](https://github.com/react-navigation/standard-navigation)。它实现了 [`standard-navigation`](https://www.npmjs.com/package/standard-navigation) 包定义的最小、与框架无关的契约。内容组件接收的 `state`、`descriptors`、`actions` 和 `emitter` 与上面应用内导航器的[同一套 API](#navigatorcontent-接收的内容)完全相同。唯一的区别是谁创建导航器。

`createStandardRouterNavigator` 是一个快捷方式：它为你调用（来自 `standard-navigation` 的）`createStandardNavigator`，并一步把结果与 Expo Router 集成。作为库作者，请自己调用 `createStandardNavigator`，并保留对导航器的引用：

```tsx src/index.ts
import { createStandardNavigator } from 'standard-navigation';
import { TabsContent } from './TabsContent';

// 与框架无关：此导航器面向标准契约，而不是某一个宿主。
// 第一个类型参数是每个屏幕的选项；第二个是事件映射。
export const navigator = createStandardNavigator<
  { title?: string },
  { tabPress: { data: undefined; canPreventDefault: true } }
>(TabsContent);
```

因为 `TabsContent` 和 `navigator` 只依赖标准契约，同一份代码可以在 Expo Router、React Navigation 或任何实现该契约的其他宿主上运行。你只需编写一次导航器，并为每个框架提供一个轻量的集成入口。

### 与 Expo Router 集成

用 `integrateWithRouter` 把导航器接入 Expo Router：

```tsx src/expo-router.ts
import { integrateWithRouter, TabRouter } from 'expo-router';
import { navigator } from './index';

export const Tabs = integrateWithRouter(navigator, TabRouter);
```

返回的组件与来自 `createStandardRouterNavigator` 的组件工作方式完全相同，包括 `.Screen` 子组件和相同的[选项](#选项)。

### 为内置导航器添加属性

:::note
本节中的辅助函数自 **SDK 58 及更高版本**起可用。
:::

当库包装 Expo Router 导航器时，把它的 `createProps` 辅助函数传给 `integrateWithRouter`。该辅助函数会添加 Expo Router 所期望的、导航器特定的行为。

| 导航器 | 辅助函数 | 导入自 | 路由器 |
| --- | --- | --- | --- |
| JavaScript 栈 | `createJSStackProps` | `expo-router/js-stack` | `StackRouter` |
| JavaScript 标签页 | `createJSTabsProps` | `expo-router/js-tabs` | `TabRouter` |
| 原生栈 | `createNativeStackProps` | `expo-router` | `StackRouter` |

例如，像这样集成 JavaScript 栈：

```tsx src/expo-router.ts
import { StackRouter, integrateWithRouter } from 'expo-router';
import { createJSStackProps } from 'expo-router/js-stack';
import { navigator } from './navigator';

export const Stack = integrateWithRouter(navigator, StackRouter, {
  createProps: createJSStackProps,
});
```

对于更底层的实现，使用 `expo-router` 中的 `createBaseStackProps` 或 `createBaseTabProps`，并添加导航器所需的行为。

### 库入口

保持导航器内容和标准导航器与框架无关，然后为每个框架暴露一个入口，以便使用者导入与其应用匹配的集成：

```text
./src/TabsContent.tsx         实现标准导航器 API 的导航器 UI
./src/index.ts                根入口——导出与框架无关的导航器
./src/react-navigation.ts     React Navigation 入口——集成同一个导航器
./src/expo-router.ts          Expo Router 入口——integrateWithRouter(navigator, ...)
./package.json                把子路径导出映射到每个框架入口
```

在库的 **package.json** 中，把每个入口映射到一个[子路径导出](https://nodejs.org/api/packages.html#subpath-exports)，并指向构建输出：

```json package.json
{
  "exports": {
    ".": {
      "types": "./lib/typescript/index.d.ts",
      "default": "./lib/module/index.js"
    },
    "./react-navigation": {
      "types": "./lib/typescript/react-navigation.d.ts",
      "default": "./lib/module/react-navigation.js"
    },
    "./expo-router": {
      "types": "./lib/typescript/expo-router.d.ts",
      "default": "./lib/module/expo-router.js"
    }
  }
}
```

使用者随后导入其框架对应的集成（例如 `import { Tabs } from 'my-tabs/expo-router'`），而你在一处维护导航器逻辑。

- [React Navigation 集成](https://reactnavigation.org/docs/standard-navigator/)：了解如何把同一个标准导航器与 React Navigation 集成，并阅读定义 `NavigatorContent` 所接收的 state、descriptors、actions 和 emitter 的契约。

## 自定义路由器行为

:::note
`extendRouter` 和 `extendRouterActions` 自 **SDK 58 及更高版本**起可用。
:::

当只需要处理或拒绝导航动作时，使用 `extendRouterActions`。返回结果以处理该动作，返回 `null` 以拒绝它，或返回 `undefined` 以让基础路由器处理它。

当需要自定义其他路由器成员（例如 `actionCreators`、`getStateForRouteFocus` 或 `normalizeState`）时，使用 `extendRouter`。未返回的成员会从基础路由器继承。

下面的示例添加一个 `CLEAR` 动作及其动作创建器：

```tsx src/router.ts
import {
  extendRouter,
  extendRouterActions,
  StackRouter,
  type CommonNavigationAction,
  type StackActionType,
} from 'expo-router';

type ClearAction = { type: 'CLEAR' };

const RouterWithClearAction = extendRouterActions(
  StackRouter,
  (state, action: CommonNavigationAction | StackActionType | ClearAction, { nextKey }) => {
    if (action.type !== 'CLEAR') {
      return undefined;
    }

    const route = { key: nextKey('index'), name: 'index' };
    return {
      state: { ...state, index: 0, routes: [route] },
      affectedRouteKey: route.key,
    };
  }
);

export const Router = extendRouter(RouterWithClearAction, ({ baseRouter }) => ({
  actionCreators: {
    ...baseRouter.actionCreators,
    clear: (): ClearAction => ({ type: 'CLEAR' }),
  },
}));
```

两个辅助函数都提供 `baseRouter`、`options` 和 `nextKey`。使用 `baseRouter` 委托现有行为，使用 `options` 读取传给路由器工厂的值，在向状态添加路由时使用 `nextKey`。
