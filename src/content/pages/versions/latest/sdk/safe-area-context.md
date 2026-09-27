---
title: react-native-safe-area-context 包参考
description: 提供灵活 API、用于访问设备安全区域边距信息的库。
---

# react-native-safe-area-context 包参考

> 支持平台：Android、iOS、Web、tvOS、Expo Go。

`react-native-safe-area-context` 提供灵活的 API，用来访问设备安全区域的边距信息。这让你可以把内容适当地布置在刘海、状态栏、Home 指示条以及其他设备和操作系统界面元素周围。它还提供 `SafeAreaView` 组件，可以代替 `View` 使用，自动为视图加上安全区域对应的内边距。

## 安装

:::tabs
:::tab npm
```sh
npx expo install react-native-safe-area-context
```
:::
:::tab yarn
```sh
yarn expo install react-native-safe-area-context
```
:::
:::tab pnpm
```sh
pnpm expo install react-native-safe-area-context
```
:::
:::tab bun
```sh
bun expo install react-native-safe-area-context
```
:::
:::

## API

```js
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
```

## 组件

### SafeAreaView

`SafeAreaView` 是普通的 `View` 组件，并把安全区域的边缘作为内边距应用。

如果你在视图上设置了自己的内边距，它会加到安全区域的内边距之上。

:::note
如果目标平台是 Web，必须按照[上下文](#上下文)一节所述设置 `SafeAreaProvider`。
:::

```jsx
import { SafeAreaView } from 'react-native-safe-area-context';

function SomeComponent() {
  return (
    <SafeAreaView>
      <View />
    </SafeAreaView>
  );
}
```

#### SafeAreaView 属性

##### edges

可选 • 类型：[`Edge[]`](#edge) • 默认值：`["top", "right", "bottom", "left"]`

设置要应用安全区域边距的边缘。

##### emulateUnlessSupported

可选 • 类型：`boolean` • 默认值：`true`

在 iOS 10 及以上，使用状态栏高度和 Home 指示条尺寸来模拟安全区域。

## Hooks

### useSafeAreaInsets()

这个 hook 让你直接访问安全区域边距。这是更高级的用法，在旋转设备时性能可能不如 `SafeAreaView`。

#### 示例

```jsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function HookComponent() {
  const insets = useSafeAreaInsets();

  return <View style={{ paddingTop: insets.top }} />;
}
```

#### 返回值

[`EdgeInsets`](#edgeinsets)

## 类型

### Edge

可能边缘的字符串联合类型。

可接受的值：`'top'`、`'right'`、`'bottom'`、`'left'`。

### EdgeInsets

表示 hook 的结果。

#### EdgeInsets 属性

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `bottom` | `number` | 底部边距的值。 |
| `left` | `number` | 左侧边距的值。 |
| `right` | `number` | 右侧边距的值。 |
| `top` | `number` | 顶部边距的值。 |

## 指南

### 上下文

要使用安全区域上下文，需要在应用根组件中添加 `SafeAreaProvider`。

> 你可能还需要在其他地方添加它，包括使用 `react-native-screen` 时任何模态框和任何路由的根部。

```jsx
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return <SafeAreaProvider>...</SafeAreaProvider>;
}
```

然后可以使用 [`useSafeAreaInsets()`](#usesafeareainsets) hook，也可以用 consumer API 访问边距数据：

```jsx
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

function Component() {
  return (
    <SafeAreaInsetsContext.Consumer>
      {insets => <View style={{ paddingTop: insets.top }} />}
    </SafeAreaInsetsContext.Consumer>
  );
}
```

### 优化

如果可以，请使用 `SafeAreaView`。它是原生实现的，因此旋转设备时不会有异步桥接带来的延迟。

为了加快首次渲染，可以从这个包导入 `initialWindowMetrics`，并按 Web SSR 中所述把它设为 provider 的 `initialMetrics` 属性。如果 provider 会重新挂载，或者你在使用 `react-native-navigation`，则不能这样做。

```jsx
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

function App() {
  return <SafeAreaProvider initialMetrics={initialWindowMetrics}>...</SafeAreaProvider>;
}
```

### Web 服务端渲染

如果在 Web 上做服务端渲染，可以用 `initialSafeAreaInsets` 根据用户设备注入数值，或者直接传入零。否则，边距测量是异步的，会打断页面内容的渲染。

### 从 CSS 迁移

#### 之前

在仅 Web 的应用中，会用 CSS 环境变量获取屏幕安全区域边距的大小。

```css
div {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-bottom: env(safe-area-inset-bottom);
  padding-right: env(safe-area-inset-right);
}
```

#### 之后

在所有平台上，hook `useSafeAreaInsets()` 都可以提供这些信息。

```jsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function App() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingBottom: insets.bottom,
        paddingRight: insets.right,
      }}
    />
  );
}
```
