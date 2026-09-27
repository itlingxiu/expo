---
title: Expo Router 的测试配置
description: 了解如何在使用 Expo Router 时为应用创建集成测试。
---

# Expo Router 的测试配置

Expo Router 依赖文件系统，这会给集成测试设置 mock 带来挑战。Expo Router 的子模块 `expo-router/testing-library` 是一组构建在流行的 [`@testing-library/react-native`](https://callstack.github.io/react-native-testing-library/) 之上的测试工具，让你可以快速创建已为测试预先配置好的内存中 Expo Router 应用。

## 配置

继续之前，请确保已按照[使用 Jest 进行单元测试](/develop/unit-testing)和 [`@testing-library/react-native`](https://callstack.github.io/react-native-testing-library/docs/start/quick-start) 在项目中设置好 `jest-expo`。

:::note
使用 Expo Router 时，不要把测试文件放在 **app** 目录内。**app** 目录中的所有文件必须是路由或布局文件。请改用 **\_\_tests\_\_** 目录或单独的目录。这种方法在[使用 Jest 进行单元测试](/develop/unit-testing#组织你的测试)中有说明。
:::

## `renderRouter`

`renderRouter` 扩展了 [`render`](https://callstack.github.io/react-native-testing-library/docs/api#render) 的功能，以简化 Expo Router 的测试。它返回与 [`render`](https://callstack.github.io/react-native-testing-library/docs/api#render) 相同的查询对象，并与 [`screen`](https://callstack.github.io/react-native-testing-library/docs/api#screen) 兼容，因此可以使用标准的[查询 API](https://callstack.github.io/react-native-testing-library/docs/api/queries) 定位组件。

`renderRouter` 接受与 `render` 相同的 [options](https://callstack.github.io/react-native-testing-library/docs/api#render-options)，并额外引入 `initialUrl` 选项，用于设置初始路由以模拟深层链接。

### 内联文件系统

`renderRouter(mock: Record<string, ReactComponent>, options: RenderOptions)`

`renderRouter` 可以通过把对象作为第一个参数传入，来内联 mock 文件系统。对象的键是 mock 文件系统路径。**定义这些路径时不要使用前导相对（`./`）或绝对（`/`）标记，并且不要包含文件扩展名。**

```tsx app.test.tsx
import { renderRouter, screen } from 'expo-router/testing-library';
import { View } from 'react-native';

it('my-test', async () => {
  const MockComponent = jest.fn(() => <View />);

  renderRouter(
    {
      index: MockComponent,
      'directory/a': MockComponent,
      '(group)/b': MockComponent,
    },
    {
      initialUrl: '/directory/a',
    }
  );

  expect(screen).toHavePathname('/directory/a');
});
```

### 使用 `null` 组件的内联文件系统

`renderRouter(mock: string[], options: RenderOptions)`

向 `renderRouter` 提供字符串数组，会创建一个使用 `null` 组件（`{ default: () => null }`）的内联 mock 文件系统。这适用于不需要测试路由输出的场景。

```tsx app.test.tsx
import { renderRouter, screen } from 'expo-router/testing-library';

it('my-test', async () => {
  renderRouter(['index', 'directory/a', '(group)/b'], {
    initialUrl: '/directory/a',
  });

  expect(screen).toHavePathname('/directory/a');
});
```

### 指向 fixture 的路径

`renderRouter(fixturePath: string, options: RenderOptions)`

`renderRouter` 可以接受一个目录路径来 mock 现有 fixture。请确保提供的路径相对于当前测试文件。

```tsx app.test.tsx
import { renderRouter } from 'expo-router/testing-library';
import { View } from 'react-native';

it('my-test', async () => {
  const MockComponent = jest.fn(() => <View />);
  renderRouter('./my-test-fixture');
});
```

### 带覆盖项的 fixture 路径

`renderRouter({ appDir: string, overrides: Record<string, ReactComponent>}, options: RenderOptions)`

对于更复杂的测试场景，`renderRouter` 可以同时使用目录路径和内联 mock。`appDir` 参数接受表示目录路径名的字符串。overrides 参数是内联 mock，可用于覆盖 `appDir` 中的特定路径。这种组合让你可以精细控制 mock 环境。

```tsx app.test.tsx
import { renderRouter } from 'expo-router/testing-library';
import { View } from 'react-native';

it('my-test', async () => {
  const MockAuthLayout = jest.fn(() => <View />);
  renderRouter({
    appDir: './my-test-fixture',
    overrides: {
      'directory/(auth)/_layout': MockAuthLayout,
    },
  });
});
```

## Jest 匹配器

以下匹配器已添加到 `expect`，可用于对 `screen` 断言值。

### toHavePathname()

针对给定字符串断言当前 pathname。该匹配器使用当前 `screen` 上 [`usePathname`](/versions/latest/sdk/router#usepathname) hook 的值。

```tsx app.test.tsx
expect(screen).toHavePathname('/my-router');
```

### toHavePathnameWithParams()

针对给定字符串断言当前 pathname（包括 URL 参数）。这对于断言 URL 在 Web 浏览器中的呈现很有用。

```tsx app.test.tsx
expect(screen).toHavePathnameWithParams('/my-router?hello=world');
```

### toHaveSegments()

针对字符串数组断言当前片段。该匹配器使用当前 `screen` 上 [`useSegments`](/versions/latest/sdk/router#usesegments) hook 的值。

```tsx app.test.tsx
expect(screen).toHaveSegments(['[id]']);
```

### useLocalSearchParams()

针对对象断言当前的本地 URL 参数。该匹配器使用当前 `screen` 上 [`useLocalSearchParams`](/versions/latest/sdk/router#uselocalsearchparams) hook 的值。

```tsx app.test.tsx
expect(screen).useLocalSearchParams({ first: 'abc' });
```

### useGlobalSearchParams()

针对对象断言当前的全局 URL 参数。该匹配器使用当前 `screen` 上 [`useGlobalSearchParams`](/versions/latest/sdk/router#useglobalsearchparams) hook 的值。

```tsx app.test.tsx
expect(screen).useGlobalSearchParams({ first: 'abc' });
```

### toHaveRouterState()

一个高级匹配器，针对对象断言当前的路由器状态。

```tsx app.test.tsx
expect(screen).toHaveRouterState({
  routes: [{ name: 'index', path: '/' }],
});
```
