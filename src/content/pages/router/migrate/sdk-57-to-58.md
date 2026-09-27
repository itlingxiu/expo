---
title: 将 Expo Router 从 SDK 57 迁移到 SDK 58
description: 了解如何把 Expo Router 应用从 SDK 57 迁移到 SDK 58。
---

# 将 Expo Router 从 SDK 57 迁移到 SDK 58

SDK 58 改变了 Expo Router 构建导航状态以及与导航器集成的方式。使用 `Stack`、`Link` 和 `useRouter` 的应用可能需要做少量改动。从 `expo-router/react-navigation` 导入、访问导航状态，或实现自定义路由器和导航器的应用需要更仔细地检查。

用下面的清单找到适用于你的应用的章节：

- 对于常见应用迁移，在组件中优先使用 [`useRouter`](#在组件中优先使用-userouter)，用 [href](#使用完整-href-导航) 替换嵌套导航，并把 [`initialRouteName` 移到 `unstable_settings`](#把-initialroutename-移到-unstablesettings)。
- 对于 Web 应用，检查[异步路由的默认行为](#检查异步路由的默认行为)；如果使用 `web.output: "server"`，还要检查[服务器渲染变更](#检查服务器渲染行为)。
- 对于高级集成，更新[分发动作](#更新-navigationdispatch)、[读取或持久化导航状态](#读取导航状态)，或实现[自定义路由器](#更新自定义路由器)和[自定义导航器](#更新自定义导航器)的代码。
- 如果你的应用从该入口导入，请检查[已移除的 `expo-router/react-navigation` API](#检查已移除的-expo-routerreact-navigation-导出)。

:::note
本指南涵盖最可能需要更新应用的变更。SDK 58 变更的完整列表见 [`expo-router` 变更日志](https://github.com/expo/expo/blob/main/packages/expo-router/CHANGELOG.md#5800--2026-09-10)。
:::

## 常见迁移

### 检查服务器渲染行为

在 SDK 58 中，`web.output: "server"` 会在每次请求时渲染 HTML 页面，而不是在导出期间预渲染它们。

要保留 SDK 57 及更早版本中 `web.output: "server"` 的行为，请把 `web.output` 设为 `"static"`，并在[应用配置](/versions/latest/config/app)的 `expo-router` 配置插件中启用 `apiRoutes: true`：

```json app.json
{
  "expo": {
    "web": {
      "output": "static"
    },
    "plugins": [["expo-router", { "apiRoutes": true }]]
  }
}
```

这会把预渲染 HTML 与 API 路由结合起来，并且仍然需要[已部署的服务器](/router/web/api-routes#部署)。要在每次请求时渲染 HTML，请保持 `web.output: "server"`，并遵循[服务器渲染指南](/router/web/server-rendering)。

### 检查异步路由的默认行为

在 SDK 58 中，异步路由在 Web 的开发和生产环境中默认启用。原生默认值不变，原生生产构建继续同步加载路由。

异步路由使用默认加载回退，而不是布局中自定义的 [`SuspenseFallback`](/router/error-handling#使用-suspense-回退的加载状态) 导出。如果你的 Web 应用依赖自定义回退，请在[应用配置](/workflow/configuration)的 `expo-router` 配置插件中禁用 Web 上的异步路由：

```json app.json
{
  "expo": {
    "plugins": [["expo-router", { "asyncRoutes": { "web": false } }]]
  }
}
```

这会恢复同步路由加载，并支持 Web 上的自定义加载回退。现有的显式 `asyncRoutes` 设置继续优先于默认值。配置选项和限制见[异步路由](/router/web/async-routes)。

升级或更改 `asyncRoutes` 之后，用 `expo start --clear` 或 `expo export --clear` 清除 Metro 缓存。

### 在组件中优先使用 `useRouter`

对于从组件进行基于 href 的导航，优先使用 `useRouter()` 返回的 router，而不是 `useNavigation().navigate()` 或模块级 `router`。该 hook 绑定到渲染该组件的 Expo Router 根。

模块级 `router` 仍然可用，但它会在第一次 router 渲染之前抛出，并且无法区分多个 router 根。当你需要导航器专属 API（例如事件、选项或动作分发）时，继续使用 `useNavigation`。

`useRouter()` 包含常见导航方法，例如 `push`、`navigate`、`replace`、`back`、`dismiss`、`dismissTo`、`dismissAll`、`canGoBack`、`canDismiss`、`setParams` 和 `prefetch`。如果缺少所需的导航方法，请[提交 issue](https://github.com/expo/expo/issues)。

### 使用完整 href 导航

在 SDK 57 中，React Navigation 可以把 `screen`、`params` 和 `initial` 解释为构建嵌套状态的指令。在 SDK 58 中，它们是普通的用户参数。请改为导航到完整 href：

```diff
diff --git a/app/profile.tsx b/app/profile.tsx
--- a/app/profile.tsx
+++ b/app/profile.tsx
@@ -1,8 +1,8 @@
-import { useNavigation } from 'expo-router';
+import { useRouter } from 'expo-router';

-const navigation = useNavigation();
+const router = useRouter();

-navigation.navigate('(tabs)', {
-  screen: 'feed',
+router.push({
+  pathname: '/(tabs)/feed/[id]',
  params: { id: '42' },
});
```

更多示例见[导航到嵌套导航器中的屏幕](/router/advanced/nesting-navigators#导航到嵌套导航器中的屏幕)。

在命令式导航期间，祖先路由参数也不再复制到后代路由中。如果你的应用依赖后代从父路由接收参数，请把该值包含在目标 href 中。这使命令式导航与从深层链接或冷启动打开同一 href 保持一致。

### 把 `initialRouteName` 移到 `unstable_settings`

`initialRouteName` 导航器属性已被移除。要在深层链接进入栈时添加返回目标，请从该栈的布局导出 `unstable_settings.anchor`：

```diff
diff --git a/app/(tabs)/_layout.tsx b/app/(tabs)/_layout.tsx
--- a/app/(tabs)/_layout.tsx
+++ b/app/(tabs)/_layout.tsx
@@ -1,5 +1,9 @@
 import { Stack } from 'expo-router';

+export const unstable_settings = {
+  anchor: 'index',
+};

 export default function FeedLayout() {
-  return <Stack initialRouteName="index" />;
+  return <Stack />;
}
```

:::note
不要用 `anchor` 选择应用的初始屏幕。启动 URL 决定该屏幕。对于默认的 `/` URL，使用 **index.tsx** 路由。详情见[核心概念](/router/basics/core-concepts)。
:::

Expo Router 现在根据 URL 构建完整的初始状态。例如，嵌套在标签页中的栈会从该栈自己的 **\_layout.tsx** 文件读取设置。在命令式导航期间，当应在目标下方插入锚点路由时，传入 `{ withAnchor: true }`。

初始路由和锚点行为见[路由器设置](/router/advanced/router-settings)。

### 替换 `redirect` 和 `initialParams`

布局 `Screen` 组件不再接受 `redirect` 或 `initialParams`。

从路由文件渲染 `Redirect`，而不是在屏幕上配置 `redirect`：

```tsx app/legacy.tsx
import { Redirect } from 'expo-router';

export default function LegacyRoute() {
  return <Redirect href="/replacement" />;
}
```

对于访问控制，使用带 `redirectTo` 的受保护路由：

```tsx app/_layout.tsx
import { Stack } from 'expo-router';

import { useAuth } from '../context/auth';

export default function RootLayout() {
  const isSignedIn = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={isSignedIn} redirectTo="/sign-in">
        <Stack.Screen name="account" />
      </Stack.Protected>
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
```

用屏幕读取参数处的默认值替换 `initialParams`：

```tsx app/feed.tsx
import { useLocalSearchParams } from 'expo-router';

export default function Feed() {
  const { sort = 'latest' } = useLocalSearchParams<{ sort?: string }>();
  // ...
}
```

### 声明标签页和抽屉屏幕

JavaScript 标签页、顶部标签页、抽屉、无头标签页和原生标签页现在只显示布局中声明的屏幕。声明应出现在导航器 UI 中的每条路由：

```tsx app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="hidden" options={{ href: null }} />
    </Tabs>
  );
}
```

### 更新受保护路由

大多数使用受保护路由的应用不需要改动。在 SDK 58 中，受保护路由仍然注册在其导航器中。守卫失败的路由会渲染重定向，而不是从路由树中移除。

只有当你想控制重定向目标时，才在导航器的 `Protected` 组件上设置 `redirectTo`。如果不设置，Expo Router 会使用导航器可访问的锚点或初始路由，然后是它的第一条可访问路由。

守卫模式见[受保护路由](/router/advanced/protected)。

### 替换 Web 模态

实验性的 Web 模态实现已被移除。按照[构建自定义 Web 模态](/router/advanced/web-modals)用自定义导航器渲染模态叠加层。自定义实现可以从 `expo-router` 导入 `NativeStackView` 作为原生栈视图。

### 替换 `freezeOnBlur`

`freezeOnBlur` 选项在 SDK 58 中没有效果。请从屏幕配置中移除它。要在屏幕失去焦点后保留状态并清理 effect，请在导航器或已声明的屏幕上设置 `activityEnabled`。值为 `1` 会在另一个屏幕获得焦点时立即隐藏屏幕内容：

```tsx app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* 使用栈的默认值，当上方有两个屏幕时隐藏内容。 */}
      <Stack.Screen name="feed" activityEnabled />
      {/* 另一个屏幕获得焦点时立即隐藏内容。 */}
      <Stack.Screen name="account" activityEnabled={1} />
    </Stack>
  );
}
```

当 `activityEnabled` 为 `true` 时，栈会在某个屏幕上方有两个屏幕时隐藏该屏幕的内容。标签页和抽屉会在屏幕失去焦点时立即隐藏其内容。栈导航器和屏幕也接受正数来覆盖该阈值。

要只隐藏屏幕的一部分，请改用 `NavigationAwareActivity` 包裹该内容。它的 `hideWhenNestedAtLevel` 属性使用相同的阈值行为，默认为 `2`。

### 安装可选的原生依赖

SDK 58 把 `expo-symbols` 和 `@expo/ui` 设为 Expo Router 的可选对等依赖。只安装应用所用 API 需要的依赖：

:::tabs
:::tab npm
```sh
# Android 原生标签页中的 md 图标
npx expo install expo-symbols
# Android Stack.Toolbar
npx expo install @expo/ui
```
:::
:::tab yarn
```sh
# Android 原生标签页中的 md 图标
yarn expo install expo-symbols
# Android Stack.Toolbar
yarn expo install @expo/ui
```
:::
:::tab pnpm
```sh
# Android 原生标签页中的 md 图标
pnpm expo install expo-symbols
# Android Stack.Toolbar
pnpm expo install @expo/ui
```
:::
:::tab bun
```sh
# Android 原生标签页中的 md 图标
bun expo install expo-symbols
# Android Stack.Toolbar
bun expo install @expo/ui
```
:::
:::

安装任一依赖后，重新构建使用受影响原生 API 的开发构建。

### 阻止屏幕被移除

现有的 `usePreventRemove` 调用只有在其回调重复或替换被阻止的动作时才需要改动。要继续执行被阻止的那个动作，请把阻止条件设为 `false`，并调用回调的 `repeat` 函数。

使用 `expo-router` 的 `usePreventRemove`，在屏幕有未保存数据时阻止移除：

```tsx app/edit-profile.tsx
import { usePreventRemove } from 'expo-router';
import { useState } from 'react';
import { Alert, Button } from 'react-native';

export default function EditProfile() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  usePreventRemove(hasUnsavedChanges, ({ repeat }) => {
    Alert.alert('Discard changes?', 'Your changes have not been saved.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          setHasUnsavedChanges(false);
          repeat();
        },
      },
    ]);
  });

  return <Button title="Save" onPress={() => setHasUnsavedChanges(false)} />;
}
```

要导航到被阻止目标以外的地方，请保留 `usePreventRemove` 返回的 `disablePrevention` 函数。把阻止条件设为 `false`，调用 `disablePrevention()`，然后再导航。不要在阻止仍然生效时从原始的 `removePrevented` 监听器分发，因为该动作可能再次被阻止。

:::warning
调用 `disablePrevention()` 时，务必更新传给 `usePreventRemove` 的布尔值。如果它保持为 `true`，该 hook 会发出警告，并且在布尔值改变之前不会重新启用阻止。
:::

## 高级迁移

### 更新 `navigation.dispatch`

`navigation.dispatch` 和导航辅助动作现在会排队，直到当前 React 提交之后。只有当集成必须立即应用动作时，才使用 `navigation.dispatchSync(action)`。

不再支持分发函数。先读取状态，计算一个动作，然后分发该动作对象：

```diff
diff --git a/navigation.ts b/navigation.ts
--- a/navigation.ts
+++ b/navigation.ts
@@ -1,7 +1,8 @@
-navigation.dispatch(state =>
-  CommonActions.reset({
-    ...state,
-    index: 0,
-    routes: [state.routes[0]],
-  })
-);
+const state = navigation.getState();
+const action = CommonActions.reset({
+  ...state,
+  index: 0,
+  routes: [state.routes[0]],
+});
+
+navigation.dispatch(action);
```

读取和延迟分发不是原子的。如果二者之间不能发生其他导航工作，请有意使用 `dispatchSync(action)`。

### 替换 `navigationKey`

布局 `Screen` 和 `Group` 组件不再接受 `navigationKey`。没有直接替代。根据使用该键的原因，使用路由和布局标识、受保护路由或显式 href 导航。

### 替换 `beforeRemove` 和 `__unsafe_action__`

`beforeRemove` 和 `__unsafe_action__` 事件已被移除。使用 `removed` 观察已完成的移除，使用 `removePrevented` 观察被 `usePreventRemove` 阻止的动作。

`removed` 事件在路由卸载之后触发。延迟清理其监听器，以便它能收到该事件：

```tsx
useEffect(() => {
  const unsubscribe = navigation.addListener('removed', event => {
    logRemoval(event.data.action);
  });

  return () => queueMicrotask(unsubscribe);
}, [navigation]);
```

不要从这个监听器更新已移除屏幕的状态，因为该屏幕已经卸载。

### 把 `useNavigation` 移到导航器内部

`useNavigation` 在导航器外部调用时现在会抛出。如果你手动渲染 `ExpoRoot`，这也包括由其 `wrapper` 属性渲染的组件。把该 hook 移到导航树内部渲染的路由或布局中。

### 读取导航状态

导航状态是实现细节。当你需要 URL 或路由信息时，优先使用 `usePathname`、`useSegments` 和 `useGlobalSearchParams`。

#### 处理可选的 `type` 和 `history`

自定义路由器的导航状态 `type` 是可选的。标签页和抽屉状态中的 `history` 是可选的。读取之前添加回退值：

```ts
const history = state.history ?? [];

if (state.type === 'tab') {
  // 处理标签页专属状态。
}
```

#### 从 `routes` 读取栈预加载路由

`StackNavigationState.preloadedRoutes` 已被移除。预加载路由会追加到 `state.routes` 中焦点索引之后：

```ts
const activeRoutes = state.routes.slice(0, state.index + 1);
const preloadedRoutes = state.routes.slice(state.index + 1);
```

#### 使用 `routeNames` 获取标签页顺序

`TabNavigationState.preloadedRouteKeys` 已被移除。预加载的标签页是 `state.routes` 中带 `isPreloaded: true` 的未聚焦条目，惰性路由可能不在该数组中。需要已声明的标签页顺序时，遍历 `state.routeNames`：

```ts
for (const routeName of state.routeNames) {
  const route = state.routes.find(route => route.name === routeName);
  // 惰性路由尚未创建时，`route` 为 undefined。
}
```

#### 移除抽屉的 `default`

`DrawerNavigationState.default` 已被移除。在组件中，使用 `expo-router/drawer` 的 `useDrawerStatus` 读取抽屉是打开还是关闭。`getDrawerStatusFromState` 已弃用，现在需要把路由器的默认状态作为第二个参数。

#### 在完整状态中包含 `routeKeySeq`

持久化的初始状态必须完整。每个嵌套状态都需要状态键、路由键、`routeKeySeq`、`routeNames`、`index` 和 `stale: false`。Expo Router 在收到不完整的持久化初始状态时会抛出。

自定义路由器扩展返回的导航状态仍然包含 `routeKeySeq`，但扩展不会直接更新它。用 `...state` 保留当前状态，并使用 `extendRouter` 提供的 `nextKey` 函数。包装器会把更新后的序列写入返回的状态。

`CommonActions.reset` 也需要 `stale: false` 的状态，但路由器会生成省略的路由键，并用当前状态填充省略的 `routeKeySeq`。

重置其状态时，使用 `...state` 保留当前导航器的键、路由名称和键序列。见[更新 `navigation.dispatch`](#更新-navigationdispatch)中的示例。

持久化状态必须在每个嵌套层级保留有效的键和路由名称。

### 更新自定义路由器

在 SDK 58 中，通过用 `extendRouter` 或 `extendRouterActions` 扩展 `StackRouter` 或 `TabRouter` 来创建自定义路由器。Expo Router 构建完整的初始状态，而包装器保留基础路由器的行为和状态不变量。

#### 更新路由器接口

把现有自定义路由器中与其基础路由器不同的部分移到扩展中。扩展未覆盖的成员会被继承：

| SDK 57 API | SDK 58 迁移 |
| --- | --- |
| `getInitialState` | 移除它。Expo Router 构建初始状态。 |
| `getRehydratedState` | 移除它。持久化数据必须提供完整状态。 |
| `getStateForRouteNamesChange` | 继承基础行为，或在扩展中处理 `ROUTE_NAMES_CHANGED`。 |
| `routeParamList` | 从 `RouterConfigOptions` 中移除它。把参数默认值放在路由代码中。 |
| `RouterActionOptions` | 在 `getStateForAction` 中使用 `RouterConfigOptions`。 |
| 其他路由器成员 | 除非扩展改变行为，否则从基础路由器继承它们。 |

基础栈和标签页路由器处理 `PUSH`。如果扩展覆盖 `getStateForAction`，请把未处理的动作委托给提供的 `baseRouter`。

#### 返回受影响的路由键

`getStateForAction` 现在返回下一状态以及受该动作影响的路由键：

```diff
diff --git a/custom-router.ts b/custom-router.ts
--- a/custom-router.ts
+++ b/custom-router.ts
@@ -1 +1,5 @@
-return nextState;
+// affectedRoute 由该动作的处理逻辑选定。
+return {
+  state: nextState,
+  affectedRouteKey: affectedRoute?.key,
+};
```

把 `affectedRouteKey` 设为该特定动作选定或更改的路由，它不一定是焦点路由。当路由器无法处理某个动作时返回 `null`。

#### 扩展内置路由器

`extendRouter` 接收基础路由器和一个 `nextKey` 函数。`nextKey` 生成确定性路由键，包装器把更新后的 `routeKeySeq` 写入返回的状态：

```ts
import {
  attachRouteState,
  extendRouter,
  StackRouter,
  type CommonNavigationAction,
  type StackActionType,
} from 'expo-router';

type CustomAction = {
  type: 'CUSTOM-ACTION';
  payload: { name: string; params?: object };
};

const CustomStackRouter = extendRouter(StackRouter, ({ baseRouter, nextKey }) => ({
  getStateForAction(
    state,
    action: CommonNavigationAction | StackActionType | CustomAction,
    config
  ) {
    if (action.type === 'CUSTOM-ACTION') {
      if (!state.routeNames.includes(action.payload.name)) {
        return null;
      }

      const route = attachRouteState(
        {
          key: nextKey(action.payload.name),
          name: action.payload.name,
          params: action.payload.params,
        },
        action
      );
      const activeRoutes = state.routes.slice(0, state.index + 1);
      const preloadedRoutes = state.routes.slice(state.index + 1);

      return {
        state: {
          ...state,
          index: activeRoutes.length,
          routes: [...activeRoutes, route, ...preloadedRoutes],
        },
        affectedRouteKey: route.key,
      };
    }

    return baseRouter.getStateForAction(state, action, config);
  },
}));
```

当只需要自定义 `getStateForAction` 时，使用 `extendRouterActions`。从其 reducer 返回 `undefined` 以委托某个动作。用 `extendRouter` 覆盖 `getStateForAction` 时，如上所示把未处理的动作委托给 `baseRouter`。

#### 在适当时使路由器类型可选

`extendRouter` 继承基础路由器的 `type`。如果扩展更改状态以要求不同的类型，请在包装器的选项中传入该类型。状态类型为可选的扩展可以省略它。

### 更新自定义导航器

对于新的自定义集成，在应用中使用 `createStandardRouterNavigator`，或在可复用库中使用 `integrateWithRouter`。这些 API 使用 `standard-navigation` 契约，使导航器状态、描述符、动作和事件与 Expo Router 保持一致。

```diff
diff --git a/src/expo-router.ts b/src/expo-router.ts
--- a/src/expo-router.ts
+++ b/src/expo-router.ts
@@ -1,4 +1,4 @@
-import { withLayoutContext } from 'expo-router';
-import { createNavigator } from './navigator';
+import { createStandardRouterNavigator, TabRouter } from 'expo-router';
+import { TabNavigatorContent } from './navigator';

-export const Tabs = withLayoutContext(createNavigator().Navigator);
+export const Tabs = createStandardRouterNavigator(TabNavigatorContent, TabRouter);
```

`withLayoutContext` 对现有 React Navigation 导航器仍然受支持。如果集成使用了它以前的第三个 `useOnlyUserDefinedScreens` 参数，请移除它。文件系统路由仍然保持注册。当导航器 UI 需要区分布局声明的路由和文件系统路由时，使用描述符 `routeSource`。

该示例假定 `TabNavigatorContent` 已从 React Navigation 导航器工厂转换为接受 `NavigatorContentProps` 的组件。库作者应改为用 `standard-navigation` 的 `createStandardNavigator` 创建与框架无关的导航器，然后把该导航器传给 `integrateWithRouter`。

`createStackNavigator` 导出已从 `expo-router/js-stack` 移除。这不影响 `expo-router/native-stack` 中仍然可用的 `createNativeStackNavigator`。对于新的栈集成，优先使用带 `createStandardRouterNavigator` 的标准导航器，或把它与匹配的属性辅助函数一起传给 `integrateWithRouter`：

| 导航器 | `createProps` 辅助函数 |
| --- | --- |
| 自定义栈 | `createBaseStackProps` |
| Expo Router JavaScript 栈 | `createJSStackProps` |
| Expo Router 原生栈 | `createNativeStackProps` |
| 自定义标签页 | `createBaseTabProps` |
| Expo Router JavaScript 标签页 | `createJSTabsProps` |
| Expo Router JavaScript 顶部标签页 | `createJSTopTabsProps` |
| Expo Router 原生标签页 | `createNativeTabsProps` |

从 `expo-router` 导入基础和原生栈辅助函数。从对应的 `expo-router/js-stack`、`expo-router/js-tabs`、`expo-router/js-top-tabs` 或 `expo-router/native-tabs` 入口导入导航器专属辅助函数。

对于尚未拥有实时状态路由的已声明路由，`descriptor.route` 上的 `key` 可以是 `undefined`。更新自定义导航器代码以处理该情况。

标准导航器概念见[自定义导航器](/router/advanced/custom-navigators)。

### 检查已移除的 `expo-router/react-navigation` 导出

以下兼容 API 在 SDK 58 中被移除或更改。仍然受支持的导入列在 [`expo-router/react-navigation` 入口](https://github.com/expo/expo/blob/main/packages/expo-router/src/react-navigation/index.ts)中。

| 已移除的 API | 替代 | 变更 |
| --- | --- | --- |
| `UNSTABLE_UnhandledLinkingContext` | 没有应用级替代。Expo Router 负责未处理链接的处理。 | [#49616](https://github.com/expo/expo/pull/49616) |
| `BaseNavigationContainer`、`NavigationContainer` | 让 Expo Router 或 `ExpoRoot` 拥有导航容器。 | [#49587](https://github.com/expo/expo/pull/49587)、[#48760](https://github.com/expo/expo/pull/48760) |
| 根 `options` 事件、`DocumentTitleOptions`、`documentTitle` | 使用 Expo Router `Head` 或 `<title>` 元素作为 Web 元数据。 | [#49590](https://github.com/expo/expo/pull/49590) |
| 容器属性上的 `onStateChange` | 优先使用 Expo Router 状态 hook，或监听导航 ref 的 `state` 事件。 | [#49588](https://github.com/expo/expo/pull/49588) |
| `NavigationIndependentTree`、`useNavigationIndependentTree` | 对隔离的嵌入式导航树使用 `@react-navigation/native` 的 `NavigationContainer`。 | [#49172](https://github.com/expo/expo/pull/49172) |
| React Navigation `Link`、`LinkProps`、`useLinkProps` | 使用带 `href` 的 `expo-router` 的 `Link` 和 `LinkProps`。 | [#48895](https://github.com/expo/expo/pull/48895) |
| `navigateDeprecated`、`navigationInChildEnabled` | 用 `useRouter` 导航到完整 href。 | [#49102](https://github.com/expo/expo/pull/49102) |
| `NavigatorScreenParams`、`getActionFromState`、`LinkingOptions.getActionFromState` | 使用完整 href，并让 Expo Router 解析导航状态。 | [#49297](https://github.com/expo/expo/pull/49297) |
| 导航容器 ref 上的 `resetRoot` | 使用 `router.replace`，或用完整状态分发 `CommonActions.reset`。 | [#49297](https://github.com/expo/expo/pull/49297) |
| `beforeRemove`、`__unsafe_action__` | 使用 `usePreventRemove`、`removePrevented` 和 `removed`。 | [#49408](https://github.com/expo/expo/pull/49408) |
| `PreventRemoveContext`、`usePreventRemoveContext`、`PreventRemoveProvider` | 使用 `usePreventRemove`。Expo Router 拥有该 provider。 | [#49408](https://github.com/expo/expo/pull/49408)、[#48347](https://github.com/expo/expo/pull/48347) |
| `Router.getInitialState`、`Router.getRehydratedState` | 让 Expo Router 构建初始状态，并从自定义路由器返回完整状态。 | [#48783](https://github.com/expo/expo/pull/48783)、[#49297](https://github.com/expo/expo/pull/49297) |
| `Router.getStateForRouteNamesChange` | 在 `getStateForAction` 中处理 `ROUTE_NAMES_CHANGED`。 | [#48479](https://github.com/expo/expo/pull/48479) |
| `RouterActionOptions`、`RouterConfigOptions.routeParamList` | 使用不带 `routeParamList` 的 `RouterConfigOptions`。 | [#48783](https://github.com/expo/expo/pull/48783) |
| `DrawerNavigationState.default` | 使用 `useDrawerStatus`，或向已弃用的 `getDrawerStatusFromState` 传入默认状态。 | [#48750](https://github.com/expo/expo/pull/48750) |
| 静态导航 API 和类型 | 使用 Expo Router 文件路由和布局。 | [#48071](https://github.com/expo/expo/pull/48071) |
| `LinkingOptions.enabled` | 移除该选项。Expo Router 负责链接。 | [#49103](https://github.com/expo/expo/pull/49103) |
| `UNSTABLE_routeNamesChangeBehavior` | 使用受保护路由重定向和显式 href 导航。 | [#47985](https://github.com/expo/expo/pull/47985) |
| `useOnlyUserDefinedScreens` | 移除该选项。所有文件系统路由仍然保持注册。 | [#47983](https://github.com/expo/expo/pull/47983) |
