---
title: 在 Expo 原生应用中使用 React DOM
description: 了解如何使用 'use dom' 指令在 Expo 原生应用中渲染 React DOM 组件。
---

# 在 Expo 原生应用中使用 React DOM

Expo 通过 `'use dom'` 指令提供一种新方法，让你在原生应用中直接使用现代 Web 代码。这使你可以按组件逐步把整个网站迁移为通用应用。

虽然 Expo 原生运行时通常不支持 `<div>` 或 `<img>` 这类元素，但有时你需要快速纳入 Web 组件。在这些情况下，DOM 组件提供了有用的方案。

## 前置条件

- **Expo SDK 55 及更早版本：react-native-webview**

:::tabs
:::tab SDK 56 及更高版本

DOM 组件默认使用 [`@expo/dom-webview`](https://www.npmjs.com/package/@expo/dom-webview)，无需额外安装。

<details>
<summary>如何退出 @expo/dom-webview 并改用 react-native-webview？</summary>

如果想改用 `react-native-webview`，请安装它并通过 `dom` prop 退出：

:::tabs
:::tab npm
```sh
npx expo install react-native-webview
```
:::
:::tab yarn
```sh
yarn expo install react-native-webview
```
:::
:::tab pnpm
```sh
pnpm expo install react-native-webview
```
:::
:::tab bun
```sh
bun expo install react-native-webview
```
:::
:::

```tsx App.tsx (native)
import DOMComponent from './my-component';

export default function App() {
  return <DOMComponent dom={{ useExpoDOMWebView: false }} />;
}
```

</details>

:::
:::tab SDK 55 及更早版本

在项目中安装 `react-native-webview`：

:::tabs
:::tab npm
```sh
npx expo install react-native-webview
```
:::
:::tab yarn
```sh
yarn expo install react-native-webview
```
:::
:::tab pnpm
```sh
pnpm expo install react-native-webview
```
:::
:::tab bun
```sh
bun expo install react-native-webview
```
:::
:::

:::
:::

- **Expo CLI 与 Expo Metro Config**

如果你已经用 `npx expo [command]` 运行项目（例如用 `npx create-expo-app` 创建的），就已经准备好了。

如果项目中还没有 `expo` 包，运行下面的命令安装，并[选择使用 Expo CLI 和 Metro Config](/bare/installing-expo-modules#configure-expo-cli-for-bundling-on-android-and-ios)：

:::tabs
:::tab npm
```sh
npx install-expo-modules@latest
```
:::
:::tab yarn
```sh
yarn dlx install-expo-modules@latest
```
:::
:::tab pnpm
```sh
pnpm dlx install-expo-modules@latest
```
:::
:::tab bun
```sh
bunx install-expo-modules@latest
```
:::
:::

如果命令失败，参见[安装 Expo 模块](/bare/installing-expo-modules#manual-installation)指南。

- **Expo Metro Runtime、React DOM 和 React Native Web**

如果使用 Expo Router 和 Expo Web，可以跳过此步骤。否则安装以下包：

:::tabs
:::tab npm
```sh
npx expo install @expo/metro-runtime react-dom react-native-web
```
:::
:::tab yarn
```sh
yarn expo install @expo/metro-runtime react-dom react-native-web
```
:::
:::tab pnpm
```sh
pnpm expo install @expo/metro-runtime react-dom react-native-web
```
:::
:::tab bun
```sh
bun expo install @expo/metro-runtime react-dom react-native-web
```
:::
:::

## 用法

要把 React 组件渲染到 DOM，在 Web 组件文件顶部添加 `'use dom'` 指令：

```tsx my-component.tsx (web)
'use dom';

export default function DOMComponent({ name }: { name: string }) {
  return (
    <div>
      <h1>Hello, {name}</h1>
    </div>
  );
}
```

在原生组件文件中，导入该 Web 组件来使用它：

```tsx App.tsx (native)
import DOMComponent from './my-component.tsx';

export default function App() {
  return (
    // 这是一个 DOM 组件。它在幕后重新导出一个被包裹的 `react-native-webview`。
    <DOMComponent name="Europa" />
  );
}
```

## 面向 AI 代理的 Expo Skills

如果使用 AI 代理，请安装 [Expo Skills](/skills)，教它何时使用 DOM 组件以及如何把 Web 代码迁移到原生。相关技能：`expo-dom`、`expo-web-to-native`。

## 特性

- 在 Web、原生和 DOM 组件之间共享打包器配置。
- DOM 组件中启用了 React、TypeScript、CSS 以及所有其他 Metro 特性。
- 终端中的日志以及 Safari/Chrome 调试。
- Fast Refresh 和 HMR。
- 用于离线支持的嵌入式导出。
- 资源在 Web 和原生之间统一。
- 可以在 [Expo Atlas](/guides/analyzing-bundles#analyzing-bundle-size-with-expo-atlas) 中检查 DOM 组件 bundle 以便调试。
- 无需重新构建原生即可访问全部 Web 功能。
- 开发时的运行时错误覆盖层。
- 支持 Expo Go。

## WebView props

要把 props 传给底层原生 **WebView**，在组件上使用 `dom` prop。这个 prop 内置于每个 DOM 组件，接受一个对象，其中可以是你想更改的任何 [`WebView` props](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md)。

```tsx App.tsx (native)
import DOMComponent from './my-component';

export default function App() {
  return (
    <DOMComponent
      dom={{
        scrollEnabled: false,
      }}
    />
  );
}
```

在 DOM 组件上添加 `dom` prop，以便 TypeScript 识别它：

```tsx my-component.tsx (web)
'use dom';

export default function DOMComponent({}: { dom: import('expo/dom').DOMProps }) {
  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}
```

## 编组后的 props

可以通过可序列化的 props（`number`、`string`、`boolean`、`null`、`undefined`、`Array`、`Object`）向 DOM 组件发送数据。例如，在原生组件文件中可以把 prop 传给 DOM 组件：

```tsx App.tsx (native)
import DOMComponent from './my-component';

export default function App() {
  return <DOMComponent hello={'world'} />;
}
```

在 Web 组件文件中，可以如下例接收该 prop：

```tsx my-component.tsx (web)
'use dom';

export default function DOMComponent({ hello }: { hello: string }) {
  return <p>Hello, {hello}</p>;
}
```

Props 通过异步桥发送，因此不会同步更新。它们作为 props 传给 React 根组件，这意味着它们会重新渲染整棵 React 树。

## 原生操作

可以通过把异步函数作为顶层 props 传给 DOM 组件，向 DOM 组件发送类型安全的原生函数：

```tsx App.tsx (native)
import DomComponent from './my-component';

export default function App() {
  return (
    <DomComponent
      hello={(data: string) => {
        console.log('Hello', data);
      }}
    />
  );
}
```

```tsx my-component.tsx (web)
'use dom';

export default function MyComponent({ hello }: { hello: (data: string) => Promise<void> }) {
  return <p onClick={() => hello('world')}>Click me</p>;
}
```

> 不能把函数作为嵌套 props 传给 DOM 组件。它们必须是顶层 props。

原生操作始终是异步的，并且只接受可序列化的参数（也就是不能是函数），因为数据要通过桥发送到 DOM 组件的 JavaScript 引擎。

原生操作可以把可序列化的数据返回给 DOM 组件，这对于从原生侧取回数据很有用。

```tsx
getDeviceName(): Promise<string> {
  return DeviceInfo.getDeviceName();
}
```

可以把这些函数想象成 React Server Functions，但它们不是位于服务器上，而是位于原生应用本地，并与 DOM 组件通信。这种方法提供了一种强大的方式，为 DOM 组件添加真正的原生功能。

## 传递 ref

可以在 DOM 组件内部使用 `useDOMImperativeHandle` hook 来接受来自原生侧的 ref 调用。此 hook 类似于 React 的 [`useImperativeHandle`](https://react.dev/reference/react/useImperativeHandle) hook，但不需要把 ref 对象传给它。

```tsx App.tsx (native)
import { useRef } from 'react';
import { Button, View } from 'react-native';

import MyComponent, { type DOMRef } from './my-component';

export default function App() {
  const ref = useRef<DOMRef>(null);

  return (
    <View style={{ flex: 1 }}>
      <MyComponent ref={ref} />
      <Button
        title="focus"
        onPress={() => {
          ref.current?.focus();
        }}
      />
    </View>
  );
}
```

:::tabs
:::tab SDK 53 及更高版本

Expo SDK 53 及更高版本使用 React 19。这意味着 `ref` prop 作为 prop 传给组件，你可以直接在组件中使用它。

```tsx my-component.tsx (web)
'use dom';

import { useDOMImperativeHandle, type DOMImperativeFactory } from 'expo/dom';
import { Ref, useRef } from 'react';

export interface DOMRef extends DOMImperativeFactory {
  focus: () => void;
}

export default function MyComponent(props: {
  ref: Ref<DOMRef>;
  dom?: import('expo/dom').DOMProps;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useDOMImperativeHandle(
    props.ref,
    () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }),
    []
  );

  return <input ref={inputRef} />;
}
```

:::
:::tab SDK 52 及更早版本

在 Expo SDK 52 及更早版本（React 18）中，使用旧的 `forwardRef` 函数来访问 `ref` 句柄。

```tsx my-component.tsx (web)
'use dom';

import { useDOMImperativeHandle, type DOMImperativeFactory } from 'expo/dom';
import { forwardRef, useRef } from 'react';

export interface MyRef extends DOMImperativeFactory {
  focus: () => void;
}

export default forwardRef<MyRef, object>(function MyComponent(props, ref) {
  const inputRef = useRef<HTMLInputElement>(null);

  useDOMImperativeHandle(
    ref,
    () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }),
    []
  );

  return <input ref={inputRef} />;
});
```

:::
:::

React 旨在具有单向数据流，因此用回调沿树向上返回的概念并不符合惯用法。预期行为会不稳定，并且可能在未来更新的 React 版本中被逐步淘汰。把数据沿树向上发送的首选方式是使用原生操作，它们更新状态，然后再传回 DOM 组件。

## 特性检测

由于 DOM 组件用于运行网站，你可能需要额外的限定条件来更好地支持某些库。可以用以下代码检测组件是否在 DOM 组件中运行：

```ts
import { IS_DOM } from 'expo/dom';
```

虽然在 DOM 组件中 `process.env.EXPO_OS` 始终是 web，但可以用 `process.env.EXPO_DOM_HOST_OS` 检测 _顶层_ 平台。这将是 `ios` 或 `android`，取决于最顶层原生平台的操作系统，在 Web 上为 `undefined`。

## 公共资源

:::warning
EAS Update 不支持公共资源。请改用 `require()` 加载本地资源。
:::

根 **public** 目录的内容会复制到原生应用的二进制中，以支持在 DOM 组件中使用公共资源。由于这些公共资源将从本地文件系统提供，请使用 `process.env.EXPO_BASE_URL` 前缀来引用正确路径。例如：

```tsx
<img src={`${process.env.EXPO_BASE_URL}img.png`} />
```

## 调试

默认情况下，WebView 中的所有 `console.log` 方法都会被扩展，把日志转发到终端。这样可以快速、轻松地查看 DOM 组件中发生了什么。

在开发模式打包时，Expo 也会启用 WebView 检查和调试。可以打开 **Safari** > **Develop** > **Simulator** > **MyComponent.tsx** 查看 WebView 的控制台并检查元素。

## 手动 WebView

可以使用 `react-native-webview` 的 `WebView` 组件创建手动 WebView。这对于从远程服务器渲染网站很有用。

```tsx App.tsx (native)
import { WebView } from 'react-native-webview';

export default function App() {
  return <WebView source={{ html: '<h1>Hello, world!</h1>' }} />;
}
```

## 路由

可以在 DOM 组件中使用 `<Link />` 和 `useRouter` 等 Expo Router API 在路由之间导航。

```tsx my-component.tsx (web)
'use dom';
import Link from 'expo-router/link';

export default function DOMComponent() {
  return (
    <div>
      <h1>Hello, world!</h1>
      <Link href="/about">About</Link>
    </div>
  );
}
```

同步返回路由信息的 API，例如 `useLocalSearchParams()`、`useGlobalSearchParams()`、`usePathname()`、`useSegments()`、`useRootNavigation()` 和 `useRootNavigationState()`，不会自动支持。请改为在 DOM 组件外部读取这些值，并把它们作为 props 提供。

```tsx App.tsx (native)
import DOMComponent from './my-component';
import { usePathname } from 'expo-router';

export default function App() {
  const pathname = usePathname();
  return <DOMComponent pathname={pathname} />;
}
```

`router.canGoBack()` 和 `router.canDismiss()` 函数也不受支持，需要手动编组，这确保不会触发多余的渲染周期。

避免使用标准 Web `<a />` 锚点元素进行导航，因为它们会以用户可能无法返回的方式改变 DOM 组件的源。如果要展示外部网站，优先启动 `WebBrowser`。

由于 DOM 组件不能渲染原生子元素，布局路由（`_layout`）永远不能是 DOM 组件。可以从布局路由渲染 DOM 组件来创建页眉、背景等，但布局路由本身应始终是原生的。

## 测量 DOM 组件

你可能希望测量 DOM 组件的尺寸并报告回原生侧（例如原生滚动）。可以用 `matchContents` prop 或手动原生操作来完成。

### 用 `matchContents` prop 自动测量

可以用 `dom={{ matchContents: true }}` prop 自动测量 DOM 组件的尺寸并调整原生视图大小。这对某些布局特别有用，DOM 组件必须具有固有尺寸才能显示，例如当组件在父视图中居中时：

```tsx App.tsx (native)
import DOMComponent from './my-component';

export default function Route() {
  return <DOMComponent dom={{ matchContents: true }} />;
}
```

### 通过指定尺寸手动测量

也可以通过 `dom` prop 把尺寸传给 `WebView` 的 `style` prop 来手动提供尺寸：

```tsx App.tsx (native)
import DOMComponent from './my-component';

export default function Route() {
  return (
    <DOMComponent
      dom={{
        style: { width, height },
      }}
    />
  );
}
```

### 观察尺寸变化

如果希望把 DOM 组件的尺寸变化报告回原生侧，可以添加一个原生操作，在尺寸变化时调用：

```tsx my-component.tsx (web)
'use dom';

import { useEffect } from 'react';

function useSize(callback: (size: { width: number; height: number }) => void) {
  useEffect(() => {
    // 观察窗口尺寸变化
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        callback({ width, height });
      }
    });

    observer.observe(document.body);

    callback({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    });

    return () => {
      observer.disconnect();
    };
  }, [callback]);
}

export default function DOMComponent({
  onDOMLayout,
}: {
  dom?: import('expo/dom').DOMProps;
  onDOMLayout: (size: { width: number; height: number }) => void;
}) {
  useSize(onDOMLayout);

  return <div style={{ width: 500, height: 500, background: 'blue' }} />;
}
```

然后更新原生代码，每当 DOM 组件报告尺寸变化时把尺寸存入状态：

```tsx App.tsx (native)
import DOMComponent from '@/components/my-component';
import { useState } from 'react';
import { View, ScrollView } from 'react-native';

export default function App() {
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <DOMComponent
          onDOMLayout={async ({ width, height }) => {
            if (containerSize?.width !== width || containerSize?.height !== height) {
              setContainerSize({ width, height });
            }
          }}
          dom={{
            containerStyle:
              containerSize != null
                ? { width: containerSize.width, height: containerSize.height }
                : null,
          }}
        />
      </ScrollView>
    </View>
  );
}
```

## 架构

内置 DOM 支持只把网站渲染为单页应用（没有 SSR 或 SSG）。这是因为嵌入的 JS 代码不需要搜索引擎优化和索引。

当模块用 `'use dom'` 标记时，它会被替换为运行时导入的代理引用。此特性主要通过一系列打包器和 CLI 技术实现。

如果需要，仍可以通过把原始 HTML 传给 `WebView` 组件，用标准方法使用 WebView。

在网站或其他 DOM 组件中渲染的 DOM 组件会表现得像普通组件，`dom` prop 会被忽略。这是因为 Web 内容直接传递，而不是包在 `iframe` 中。

总体而言，这个系统与 Expo 的 React Server Components 实现有许多相似之处。

## 注意事项

我们建议使用 `View`、`Image` 和 `Text` 等通用原语构建真正的原生应用。DOM 组件只支持标准 JavaScript，它的解析和启动比优化后的 Hermes 字节码更慢。

数据只能通过异步 JSON 传输系统在 DOM 组件和原生组件之间发送。避免依赖跨 JS 引擎的数据，以及 DOM 组件中指向嵌套 URL 的深层链接，因为它们目前不支持与 Expo Router 的完整协调。

虽然 DOM 组件并非 Expo Router 专有，但它们是针对 Expo Router 应用开发和测试的，以便与 Expo Router 一起使用时提供最佳体验。

如果你有用于共享数据的全局状态，它将无法跨 JS 引擎访问。

虽然 Expo SDK 中的原生模块可以被优化以支持 DOM 组件，但这种优化尚未实现。使用原生操作和 props 与 DOM 组件共享原生功能。

DOM 组件和网站总体上不如原生视图优化，但它们有一些合理的用途。例如，从概念上讲，Web 是渲染富文本和 markdown 的最佳方式。Web 也有很好的 WebGL 支持，但要注意低电量模式下的设备往往会限制 Web 帧率以节省电量。

许多大型应用也会把一些 Web 内容用于辅助路由，例如博客文章、富文本（例如 X 上的长文）、设置页面、帮助页面，以及应用中访问频率较低的其他部分。

## Server Components

DOM 组件目前只渲染为单页应用，不支持静态渲染或 React Server Components（RSC）。当项目使用 React Server Components 时，无论平台如何，`'use dom'` 都会与 `'use client'` 一样工作。可以把 RSC 载荷作为属性传给 DOM 组件。不过，它们无法在原生平台上正确水合，因为它们会针对原生运行时渲染。

## 限制

- 与服务器组件不同，不能把 `children` 传给 DOM 组件。
- DOM 组件是独立的，不会在不同实例之间自动共享数据。
- 不能向 DOM 组件添加原生视图。虽然可以尝试把原生视图浮在 DOM 组件之上，这种方法会导致次优的用户体验。
- 函数 props 不能同步返回值。它们必须是异步的。
- DOM 组件目前只能嵌入，不支持 OTA 更新。此功能将来可能会作为 React Server Components 的一部分添加。

归根结底，通用架构是最令人兴奋的一种。Expo CLI 的通用工具使此特性成为可能。

虽然 DOM 组件有助于迁移和快速推进，我们建议尽可能使用真正的原生视图。

## 常见问题

<details>
<summary>如何在 DOM 组件中获得安全上下文？</summary>

某些 Web API 需要[安全上下文](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)才能正确工作。例如，[Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) 只在安全上下文中可用。安全上下文意味着远程资源必须通过 HTTPS 提供。[进一步了解仅限于安全上下文的特性](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts)。

要确保 DOM 组件在安全上下文中运行，遵循以下准则：

- **发布构建**：使用 `file://` 方案提供的 DOM 组件默认获得安全上下文。
- **调试构建**：使用开发服务器（默认 `http://` 协议）时，可以用[隧道](/more/expo-cli#tunneling)通过 HTTPS 提供 DOM 组件。

**通过 HTTPS 为 DOM 组件建立隧道的示例命令：**

:::tabs
:::tab npm
```sh
# 安装 expo-dev-client，以便连接到远程开发服务器：
npx expo install expo-dev-client

# 在 Android 上运行应用：
npx expo run:android
# 按 Ctrl + C 停止服务器
npx expo start --tunnel -d -a

# 在 iOS 上运行应用：
npx expo run:ios
# 按 Ctrl + C 停止服务器
npx expo start --tunnel -d -i
```
:::
:::tab yarn
```sh
# 安装 expo-dev-client，以便连接到远程开发服务器：
yarn expo install expo-dev-client

# 在 Android 上运行应用：
yarn expo run:android
# 按 Ctrl + C 停止服务器
yarn expo start --tunnel -d -a

# 在 iOS 上运行应用：
yarn expo run:ios
# 按 Ctrl + C 停止服务器
yarn expo start --tunnel -d -i
```
:::
:::tab pnpm
```sh
# 安装 expo-dev-client，以便连接到远程开发服务器：
pnpm expo install expo-dev-client

# 在 Android 上运行应用：
pnpm expo run:android
# 按 Ctrl + C 停止服务器
pnpm expo start --tunnel -d -a

# 在 iOS 上运行应用：
pnpm expo run:ios
# 按 Ctrl + C 停止服务器
pnpm expo start --tunnel -d -i
```
:::
:::tab bun
```sh
# 安装 expo-dev-client，以便连接到远程开发服务器：
bun expo install expo-dev-client

# 在 Android 上运行应用：
bun expo run:android
# 按 Ctrl + C 停止服务器
bun expo start --tunnel -d -a

# 在 iOS 上运行应用：
bun expo run:ios
# 按 Ctrl + C 停止服务器
bun expo start --tunnel -d -i
```
:::
:::

</details>
