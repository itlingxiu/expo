---
title: 从 React Navigation 迁移
description: 了解如何把使用 React Navigation 的项目迁移到 Expo Router。
---

# 从 React Navigation 迁移

:::note
本指南面向 **SDK 56 及更高版本**。在 SDK 56 中，Expo Router 不再接受来自 `@react-navigation/*` 的应用代码导入。它们现在来自 `expo-router/*` 入口。如果你要把现有 Expo Router 应用从 SDK 55 或更早版本升级，请遵循 [SDK 55 到 56 迁移指南](/router/migrate/sdk-55-to-56)。下面的示例已经使用 SDK 56 及更高版本的导入路径。
:::

## 优势

除了 React Navigation 的全部好处之外，Expo Router 还支持自动深层链接、[类型安全](/router/reference/typed-routes)、[延迟打包](/router/web/async-routes)、[Web 上的静态渲染](/router/web/static-rendering)等。

## 不适用的情况

如果你的应用使用自定义 `getPathFromState` 或 `getStateFromPath` 组件，它可能不太适合 Expo Router。如果你使用这些函数来支持[共享路由](/router/advanced/shared-routes)，那么应该没问题，因为 Expo Router 对此有内置支持。

## 建议

建议在开始迁移之前对代码库做以下修改：

- 把 React Navigation 屏幕组件拆成单独文件。例如，如果你有 `<Stack.Screen component={HomeScreen} />`，请确保 `HomeScreen` 组件在自己的文件中。
- 把项目转换为 [TypeScript](/guides/typescript#迁移现有-javascript-项目)。这样更容易发现迁移期间可能出现的错误。
- 把相对导入转换为[类型化别名](/guides/typescript#路径别名可选)。例如，在开始迁移之前，把 `../../components/button.tsx` 改为 `@/components/button`。这样在文件系统中移动屏幕时，不必更新相对路径。
- 停止使用 `resetRoot`。它用于在运行时“重启”应用。这通常被视为不良实践，你应该重构应用导航，使这种情况永远不必发生。
- 把初始路由重命名为 `index`。Expo Router 认为启动时打开的路由匹配 `/`，React Navigation 用户通常会把初始路由叫做 “Home” 之类。

### 重构搜索参数

把屏幕重构为[使用可序列化的顶层查询参数](https://reactnavigation.org/docs/params/#what-should-be-in-params)。我们在 React Navigation 中也建议这样做。

在 Expo Router 中，搜索参数只能序列化 `number`、`boolean` 和 `string` 等顶层值。React Navigation 没有同样的限制，因此用户有时会传入函数、对象、Map 等无效参数。

如果你的代码与下面类似：

```js
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

navigation.push('Followers', {
  onPress: profile => {
    navigation.push('User', { profile });
  },
});
```

请考虑重构，使该函数可以从 “followers” 屏幕访问。在这种情况下，你可以从 “followers” 屏幕访问 router 并直接压入。

### 急切加载 UI

在 React Native 应用中，根组件在资源和字体加载时 `return null` 很常见。这是不良实践，并且在 Expo Router 中通常不受支持。如果绝对必须延迟渲染，请确保不要尝试导航到任何屏幕。

历史上存在这种模式，是因为如果使用尚未加载的自定义字体，React Native 会抛出错误。我们在 React Native 0.72（SDK 49）的上游改了这一点，因此默认行为是在自定义字体加载时替换默认字体。如果想在字体加载完成之前隐藏单个文本元素，请编写一个包装器 `<Text>`，在字体加载之前返回 null。

在 Web 上，从根组件返回 `null` 会导致[静态渲染](/router/web/static-rendering)跳过所有子项，从而没有可搜索的内容。可以在 Chrome 中使用 “View Page Source”，或禁用 JavaScript 并重新加载页面来测试这一点。

## 迁移

### 删除未使用或受管理的代码

Expo Router 会自动添加 `react-native-safe-area-context` 支持。

```diff
diff --git a/App.tsx b/App.tsx
index 0000000..1111111 100644
--- a/App.tsx
+++ b/App.tsx
@@ -1,9 +1,6 @@
-import { SafeAreaProvider } from 'react-native-safe-area-context';

 export default function App() {
   return (
-    <SafeAreaProvider>
       <MyApp />
-    </SafeAreaProvider>
   )
 }
```

Expo Router **不会**添加 `react-native-gesture-handler`（截至 v3），因此如果你使用 Gesture Handler 或 `<Drawer />` 布局，必须自行添加。避免在 Web 上使用此包，因为它会添加大量通常用不到的 JavaScript。

### 把屏幕复制到 app 目录

在根 **src** 目录内创建一个 **app** 目录。Expo Router 会自动把 **src/app** 目录检测为路由根。

确保 **tsconfig.json** 和 **app.json** 配置正确：

```json tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/assets/*": ["./assets/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

还要确保 **app.json** 配置了 `expo-router` 插件：

```json app.json
{
  "expo": {
    "plugins": ["expo-router"]
  }
}
```

根据 [Expo Router 规则的实践](/router/basics/core-concepts#实践expo-router-的规则)创建文件来排布应用结构。路由文件名的最佳实践是 kebab-case 和小写字母。

用目录替换导航器，例如：

```jsx React Navigation
function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Feed" component={Feed} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    // NavigationContainer 由 Expo Router 管理。
    <NavigationContainer
      linking={
        // 删除 linking 配置，它由 Expo Router 管理。
        {
          // ...linking configuration
        }
      }
    >
      <Stack.Navigator>
        {/* 普通屏幕可以移动到文件中。 */}
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Profile" component={Profile} />
        {/* 导出导航器的屏幕应转换为带布局路由的目录。 */}
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={{
            title: 'Home Screen',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**Expo Router：**

- 把 “main” 路由从 **Home** 重命名为 **index**，以确保它匹配 `/` 路径。
- 把名称转换为小写。
- 把所有屏幕移动到 app 目录中的适当文件位置。这可能需要一些试验。

```text
src/app/_layout.tsx
src/app/(home)/_layout.tsx
src/app/(home)/index.tsx
src/app/(home)/feed.tsx
src/app/profile.tsx
src/app/settings.tsx
```

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(home)"
        options={
          // 可以用导航器上的 Screen 组件表达选项。其类型与 React Navigation 相同。
          {
            title: 'Home Screen',
          }
        }
      />
    </Stack>
  );
}
```

标签页导航器会被移动到子目录。

```tsx src/app/(home)/_layout.tsx
import { Tabs } from 'expo-router/js-tabs';

export default function HomeLayout() {
  return <Tabs />;
}
```

### 使用 Expo Router hooks

React Navigation v6 及更低版本会把属性 `{ navigation, route }` 传给每个屏幕。这种模式正在从 React Navigation 中消失，我们也从未把它引入 Expo Router。

改为把 `navigation` 迁移到 `useRouter` hook。

```diff
diff --git a/app/index.tsx b/app/index.tsx
index 0000000..1111111 100644
--- a/app/index.tsx
+++ b/app/index.tsx
@@ -1,6 +1,7 @@
+import { useRouter } from 'expo-router';

-export default function Page({ navigation }) {
-  navigation.push('User', { user: 'bacon' });
+export default function Page() {
+  const router = useRouter();
+  router.push('/users/bacon');
}
```

同样，把 `route` 属性迁移到 [`useLocalSearchParams`](/versions/latest/sdk/router#uselocalsearchparams) hook。

```diff
diff --git a/app/index.tsx b/app/index.tsx
index 0000000..1111111 100644
--- a/app/index.tsx
+++ b/app/index.tsx
@@ -1,5 +1,6 @@
+import { useLocalSearchParams } from 'expo-router';

-export default function Page({ route }) {
-  const user = route?.params?.user;
+export default function Page() {
+  const { user } = useLocalSearchParams();
}
```

要访问 [`navigation.navigate`](https://reactnavigation.org/docs/navigation-object/#navigate)，从 [`useNavigation`](/versions/latest/sdk/router#usenavigationparent) hook 导入 `navigation` 属性。

```diff
diff --git a/app/index.tsx b/app/index.tsx
index 0000000..1111111 100644
--- a/app/index.tsx
+++ b/app/index.tsx
@@ -1,4 +1,6 @@
+import { useNavigation } from 'expo-router';

export default function Page() {
+ const navigation = useNavigation();

  return (
    <Button onPress={navigation.navigate('screenName')}>
  )
}
```

### 迁移 Link 组件

React Navigation 和 Expo Router 都提供 Link 组件。不过，Expo 的 Link 组件使用 `href` 而不是 [`to`](https://reactnavigation.org/docs/use-link-props/#to)。

```jsx
// React Navigation
<Link to="Settings" />

// Expo Router
<Link href="/settings" />
```

React Navigation 用户经常用 `useLinkProps` hook 创建自定义 Link 组件来控制子组件。在 Expo Router 中这没有必要，请改用 `asChild` 属性。

### 在导航器之间共享屏幕

React Navigation 应用在多个导航器之间复用一组路由很常见。这通常与标签页一起使用，以确保每个标签页都可以压入任何屏幕。

在 Expo Router 中，可以迁移到[共享路由](/router/advanced/shared-routes)，或创建多个文件并从中重新导出同一组件。

使用分组或共享路由时，可以用完全限定的路由名称导航到特定标签页，例如用 `/(home)/settings` 而不是 `/settings`。

### 迁移屏幕跟踪事件

你可能已按照我们的 [React Navigation 屏幕跟踪指南](https://reactnavigation.org/docs/screen-tracking/) 设置屏幕跟踪，请按照 [Expo Router 屏幕跟踪指南](/router/reference/screen-tracking) 更新它。

### 为屏幕使用平台专属组件

有关根据平台切换 UI 的信息，请参阅[平台专属模块](/router/advanced/platform-specific-modules)指南。

### 替换 `NavigationContainer`

全局 React Navigation [`<NavigationContainer />`](https://reactnavigation.org/docs/navigation-container/) 在 Expo Router 中完全受管理。Expo Router 提供了实现与 `NavigationContainer` 相同功能的系统，而无需直接使用它。

<details>
<summary>API 替换</summary>

### Ref

不应直接访问 `NavigationContainer` 的 ref。请改用以下方法。

#### `resetRoot`

导航到应用的初始路由。例如，如果你的应用从 `/` 开始（推荐），则可以用此方法把当前路由替换为 `/`。

```jsx
import { useRouter } from 'expo-router';

function Example() {
  const router = useRouter();

  return (
    <Text
      onPress={() => {
        // 转到应用的初始路由。
        router.replace('/');
      }}>
      Reset App
    </Text>
  );
}
```

#### `getRootState`

使用 `useRootNavigationState()`。

#### `getCurrentRoute`

与 React Navigation 不同，Expo Router 可以用字符串可靠地表示任何路由。使用 [`usePathname()`](/versions/latest/sdk/router#usepathname) 或 [`useSegments()`](/versions/latest/sdk/router#usesegments) hook 来识别当前路由。

#### `getCurrentOptions`

使用 [`useLocalSearchParams()`](/versions/latest/sdk/router#uselocalsearchparams) hook 获取当前路由的查询参数。

#### `addListener`

可以迁移以下事件：

#### `state`

使用 [`usePathname()`](/versions/latest/sdk/router#usepathname) 或 [`useSegments()`](/versions/latest/sdk/router#usesegments) hook 来识别当前路由。与 `useEffect(() => {}, [...])` 结合使用以观察变化。

#### `options`

使用 [`useLocalSearchParams()`](/versions/latest/sdk/router#uselocalsearchparams) hook 获取当前路由的查询参数。与 `useEffect(() => {}, [...])` 结合使用以观察变化。

### 属性

迁移以下 `<NavigationContainer />` 属性：

#### `initialState`

在 Expo Router 中，可以从路由字符串（例如 `/user/evanbacon`）恢复应用状态。使用[重定向](/router/reference/redirects)处理初始状态。高级重定向见[共享路由](/router/advanced/shared-routes)。

避免使用这种模式，而应使用深层链接（例如，用户打开应用时直接进入 `/profile`，而不是从主屏幕进入），因为它最类似于 Web。如果应用因某个特定屏幕而崩溃，最好避免在应用启动时自动导航回那个确切屏幕，因为修复它可能需要重新安装应用。

#### `onStateChange`

使用 [`usePathname()`](/versions/latest/sdk/router#usepathname)、[`useSegments()`](/versions/latest/sdk/router#usesegments) 和 [`useGlobalSearchParams()`](/versions/latest/sdk/router#useglobalsearchparams) hook 来识别当前路由状态。与 `useEffect(() => {}, [...])` 结合使用以观察变化。

- 如果要跟踪屏幕变化，请遵循[屏幕跟踪指南](/router/reference/screen-tracking)。
- React Navigation 建议避免使用 [`onStateChange`](https://reactnavigation.org/docs/navigation-container/#onstatechange)。

#### `onReady`

在 React Navigation 中，[`onReady`](https://reactnavigation.org/docs/navigation-container/#onready) 最常用于确定何时应隐藏启动屏，或何时使用分析跟踪屏幕。Expo Router 对这两种用例都有特殊处理。在 Expo Router 中，假定导航对导航事件始终就绪。

- 有关从 React Navigation 迁移分析的信息，见[屏幕跟踪指南](/router/reference/screen-tracking)。
- 有关处理启动屏的信息，见[启动屏功能](/develop/user-interface/splash-screen-and-app-icon)。

#### `onUnhandledAction`

在 Expo Router 中，动作始终会被处理。请使用[动态路由](/router/basics/notation#方括号)和 [404 屏幕](/router/error-handling#未匹配的路由)，而不是 [`onUnhandledAction`](https://reactnavigation.org/docs/navigation-container/#onunhandledaction)。

#### `linking`

[`linking`](https://reactnavigation.org/docs/navigation-container/#linking) 属性会根据 **app** 目录中的文件自动构建。

#### `fallback`

[`fallback`](https://reactnavigation.org/docs/navigation-container/#fallback) 属性由 Expo Router 自动处理。更多信息见[启动屏](/versions/latest/sdk/splash-screen)参考。

#### `theme`

在 React Navigation 中，你使用 [`<NavigationContainer />`](https://reactnavigation.org/docs/navigation-container/#theme) 组件为整个应用设置主题。Expo Router 会为你管理根容器，因此应直接使用 `ThemeProvider` 设置主题。

```tsx src/app/_layout.tsx
import { ThemeProvider, DarkTheme, DefaultTheme, useTheme } from 'expo-router/react-navigation';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    // 此 provider 内的所有布局都将使用深色主题。
    <ThemeProvider value={DarkTheme}>
      <Slot />
    </ThemeProvider>
  );
}
```

可以在应用的任何一层使用此技术，为特定布局设置主题。当前主题可以通过 `expo-router/react-navigation` 的 `useTheme` hook 访问。

#### `children`

`children` 属性会根据 **app** 目录中的文件和当前打开的 URL 自动填充。

#### `independent`

Expo Router 不支持 [`independent`](https://reactnavigation.org/docs/navigation-container/#independent) 容器。这是因为 router 负责管理唯一的 `<NavigationContainer />`。任何额外容器都不会由 Expo Router 自动管理。

#### `documentTitle`

使用 [Head 组件](/router/web/static-rendering#meta-标签)设置网页标题。

#### `ref`

改用 `useNavigationContainerRef()` hook。

</details>

### 迁移自定义导航器

:::note
本节中的稳定 API 在 **SDK 58 及更高版本**中可用。在 SDK 56 和 SDK 57 中，请改用 `unstable_createStandardRouterNavigator` 和 `unstable_integrateWithRouter`。
:::

当导航器属于你的应用时，使用 `createStandardRouterNavigator`：

```tsx src/components/CustomTabs.tsx
import { createStandardRouterNavigator, TabRouter } from 'expo-router';
import { CustomTabsContent } from './CustomTabsContent';

export const CustomTabs = createStandardRouterNavigator(CustomTabsContent, TabRouter);
```

如果某个库已经暴露 `standard-navigation` 导航器，请改用 `integrateWithRouter`。完整集成以及 JavaScript 栈、JavaScript 标签页和原生栈辅助函数，见[自定义导航器](/router/advanced/custom-navigators)。

### 使用 Expo Router 的启动屏包装器

Expo Router 包装了 `expo-splash-screen`，并添加了特殊处理，以确保在导航挂载之后以及捕获到意外错误时隐藏它。只需把导入从 `expo-splash-screen` 改为从 `expo-router` 导入 `SplashScreen`。

### 导航状态观察

如果你直接观察导航状态，请迁移到 [`usePathname`](/versions/latest/sdk/router#usepathname)、[`useSegments`](/versions/latest/sdk/router#usesegments) 和 [`useGlobalSearchParams`](/versions/latest/sdk/router#useglobalsearchparams) hook。

### 向嵌套屏幕传递参数

不要使用[嵌套屏幕导航事件](https://reactnavigation.org/docs/params/#passing-params-to-nested-navigators)，而应使用限定的 href：

```js
// React Navigation
navigation.navigate('Account', {
  screen: 'Settings',
  params: { user: 'jane' },
});

// Expo Router
router.push({ pathname: '/account/settings', params: { user: 'jane' } });
```

### 为深层链接和服务器导航设置初始路由

在 React Navigation 中，可以使用 linking 配置的 `initialRouteName` 属性。在 Expo Router 中，使用[布局设置](/router/advanced/router-settings)。

### 重置导航状态

可以使用 React Navigation 库中的 [`reset`](https://reactnavigation.org/docs/navigation-actions/#reset) 动作来重置导航状态。它通过 Expo Router 的 [`useNavigation`](/versions/latest/sdk/router#usenavigationparent) hook 分发，以访问 `navigation` 属性。

在下面的示例中，`navigation` 属性可以从 `useNavigation` hook 访问，`CommonActions.reset` 动作来自 `expo-router/react-navigation`。`reset` 动作中指定的对象会用新的导航状态替换现有导航状态。

```tsx src/app/screen.tsx
import { useNavigation } from 'expo-router'
import { CommonActions } from 'expo-router/react-navigation'

export default function Screen() {
  const navigation = useNavigation();

  const handleResetAction = () => {
    navigation.dispatch(CommonActions.reset({
      routes: [{key: "(tabs)", name: "(tabs)"}]
    }))
  }

  return (
    <>
      {/* ...rest of the code */}
      <Button title='Reset' onPress={handleResetAction} />
    </>
  );
}
```

### 迁移 TypeScript 类型

Expo Router 可以自动生成[静态类型化路由](/router/reference/typed-routes)，这将确保你只能导航到有效路由。

## 其他信息

### React Navigation 主题

React Navigation 导航器 `<Stack>`、`<Drawer>` 和 `<Tabs>` 使用共享的外观 provider。在 React Navigation 中，你使用 `<NavigationContainer />` 组件为整个应用设置主题。Expo Router 管理根容器，因此你可以直接使用 `ThemeProvider` 设置主题。

```tsx src/app/_layout.tsx
// 直接从 React Navigation 导入主题 API。
import { ThemeProvider, DarkTheme, DefaultTheme, useTheme } from 'expo-router/react-navigation';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    // 此 provider 内的所有布局都将使用深色主题。
    <ThemeProvider value={DarkTheme}>
      <Slot />
    </ThemeProvider>
  );
}
```

可以在应用的任何一层使用此技术，为特定布局设置主题。当前主题可以通过 `expo-router/react-navigation` 的 `useTheme` hook 访问。

### React Navigation Elements

[React Navigation Elements](https://reactnavigation.org/docs/elements/) 库提供一组可用于构建导航 UI 的 UI 元素和辅助函数。这些组件被设计为可组合且可自定义。你可以复用该库的默认功能，或在其上构建导航器的 UI。

在 SDK 56 及更高版本中，此库从 `expo-router/react-navigation` 重新导出，没有需要单独安装的包：

```tsx
import { Header, HeaderBackButton } from 'expo-router/react-navigation';
```

要了解该库提供的组件和工具，见 [Elements 库](https://reactnavigation.org/docs/elements/)文档。
