---
title: expo 包参考
description: expo 包为 Expo 及相关的包提供通用方法和类型，是 Expo SDK 的基础依赖。
---

# expo 包参考

`expo` 包为 Expo 及相关的包提供通用方法和类型。

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo
```
:::
:::tab yarn
```sh
yarn expo install expo
```
:::
:::tab pnpm
```sh
pnpm expo install expo
```
:::
:::tab bun
```sh
bun expo install expo
```
:::
:::

导入命名空间：

```ts
import * as Expo from 'expo';
```

## expo/fetch

WinterCG 兼容的 Fetch API，在 Web 与移动端行为一致。流式请求示例：

```ts
import { fetch } from 'expo/fetch';

const response = await fetch('https://httpbin.org/drip?numbytes=512&duration=2', {
  headers: {
    Accept: 'text/event-stream',
  },
});

const reader = response.body.getReader();
const chunks = [];
let totalLength = 0;
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    break;
  }
  chunks.push(value);
  totalLength += value.length;
}
const combined = new Uint8Array(totalLength);
let position = 0;
for (const chunk of chunks) {
  combined.set(chunk, position);
  position += chunk.length;
}
console.log(combined.length); // 512
```

:::note
在 Android 和 iOS 上，`expo/fetch` 同时也是全局 `fetch`，因此不带限定名的 `fetch(...)` 调用使用的就是这一实现。要保持 React Native 内置的 `fetch` 作为全局实现，请在环境变量中设置 `EXPO_PUBLIC_USE_RN_FETCH=1`。无论该标志如何，从 `expo/fetch` 的命名导入都始终有效。
:::

## 编码（Encoding）

`TextEncoder` 与 `TextDecoder` 在所有平台上都是内置的；Web/Node 覆盖情况见 [caniuse](https://caniuse.com/textencoder)。`TextEncoder` 内置在 Hermes 引擎中（[TextEncoder.cpp](https://github.com/facebook/hermes/blob/main/API/hermes/TextEncoder.cpp)）。原生端的 `TextDecoder` 不符合规范，仅支持 UTF-8 —— 其他编码请使用 polyfill，例如 `text-encoding`。流式等价物 `TextEncoderStream` 与 `TextDecoderStream` 也可在所有平台上使用，用于分块处理数据。

```ts
const encoder = new TextEncoder();
const encoded = encoder.encode('hello');
console.log(encoded); // [104, 101, 108, 108, 111]

const decoder = new TextDecoder();
const decoded = decoder.decode(encoded);
console.log(decoded); // "hello"
```

```ts
const encoderStream = new TextEncoderStream();
const writer = encoderStream.writable.getWriter();
writer.write('Hello');
writer.write('World');
writer.close();

const reader = encoderStream.readable.getReader();
const result = await reader.read();
console.log(result.value); // Uint8Array [72, 101, 108, 108, 111]
```

## 流（Streams）

原生平台全局暴露标准 Web 流，与 Web 和服务器端行为一致，EAS Hosting 的服务器运行时也支持它们。`ReadableStream`、`WritableStream` 与 `TransformStream` 类均可全局访问：

```ts
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('Hello');
    controller.enqueue('World');
    controller.close();
  },
});

const reader = stream.getReader();
console.log(await reader.read()); // { done: false, value: 'Hello' }
console.log(await reader.read()); // { done: false, value: 'World' }
```

## URL

`URL` 与 `URLSearchParams` 在所有平台上提供标准接口；在原生端，内置实现取代了 `react-native` 的 shim。Expo 的目标是完全符合规范，只有一个缺口：主机名中的非 ASCII 字符。`new URL('http://🥓')` 在 Web 和 Node.js 上序列化为 `http://xn--pr9h/`，在 Android 和 iOS 上则保持为 `http://🥓/`。

## structuredClone

内置的深拷贝函数，可以处理 `Map`、`Set`、`ArrayBuffer` 等复杂值，在所有平台上可用。针对 `ArrayBuffer` 和 `TypedArray` 的 `transfer` 选项尚未实现。请移除任何自定义的 `structuredClone` polyfill 以避免体积膨胀。

## Hooks

### useEvent(eventEmitter, eventName, initialValue)

> 支持平台：Android、iOS、tvOS、Web。

订阅给定对象发出的事件并返回事件参数的 React Hook，每次派发时刷新。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `eventEmitter` | `EventEmitter<TEventsMap>` | 发出事件的对象。例如原生模块、共享对象或 `EventEmitter` 的实例。 |
| `eventName` | `TEventName` | 要监听的事件名称。 |
| `initialValue`（可选） | `TInitialValue \| null` | 事件首次触发前使用的值。默认：`null`。 |

返回值：`InferEventParameter<TEventListener, TInitialValue>` —— 事件监听器的参数。

```tsx PlayerStatus.tsx
import { Text } from 'react-native';
import { useEvent } from 'expo';
import { VideoPlayer } from 'expo-video';

export function PlayerStatus({ videoPlayer }: { videoPlayer: VideoPlayer }) {
  const { status } = useEvent(videoPlayer, 'statusChange', { status: videoPlayer.status });

  return <Text>Player status: {status}</Text>;
}
```

### useEventListener(eventEmitter, eventName, listener)

> 支持平台：Android、iOS、tvOS、Web。

在每次派发时调用监听器的 React Hook。订阅会在首次渲染时自动添加，并在组件卸载时移除。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `eventEmitter` | `EventEmitter<TEventsMap>` | 发出事件的对象。例如原生模块、共享对象或 `EventEmitter` 的实例。 |
| `eventName` | `TEventName` | 要监听的事件名称。 |
| `listener` | `TEventListener` | 事件派发时要调用的函数。 |

返回值：`void`。

```tsx VideoPlayerView.tsx
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEventListener } from 'expo';

export function VideoPlayerView({ videoSource }: { videoSource: string }) {
  const player = useVideoPlayer(videoSource);

  useEventListener(player, 'playingChange', ({ isPlaying }) => {
    console.log(isPlaying);
  });

  return <VideoView player={player} />;
}
```

## 类（Classes）

### EventEmitterType

> 支持平台：Android、iOS、tvOS、Web。

提供一致的 API 用于发出和监听事件的类。它在概念上与 Node 的 EventEmitter 和 `fbemitter` 共享；某个事件的监听器同步运行，「被调用监听器返回的任何值都会被忽略并丢弃」。其实现用 C++ 编写，在各平台间共享。

方法：

- `addListener(eventName, listener)` —— 添加监听器。返回 `EventSubscription`。
- `emit(eventName, ...args)` —— 同步调用该事件的监听器，转发所有参数。返回 `void`。
- `listenerCount(eventName)` —— 返回该事件的监听器数量。返回 `number`。
- `removeAllListeners(eventName)` —— 移除该名称下的所有监听器。返回 `void`。
- `removeListener(eventName, listener)` —— 移除指定的监听器。返回 `void`。
- `startObserving(eventName)` —— 在该事件的第一个监听器被添加时自动调用；可在子类中重写以做额外设置。返回 `void`。
- `stopObserving(eventName)` —— 在该事件的最后一个监听器被移除时自动调用；可在子类中重写以做清理。返回 `void`。

### NativeModuleType

> 支持平台：Android、iOS、tvOS、Web。

所有原生模块的基类。继承 `EventEmitter<TEventsMap>`。

### SharedObjectType

> 支持平台：Android、iOS、tvOS、Web。

共享对象的基类。继承并实现 `EventEmitter<TEventsMap>`；其 C++ 实现通过 JSI 安装，在各移动平台间共享。

#### release()

「在 JS 对象被垃圾回收之前，将 JS 对象与原生对象解绑，让原生对象可以被释放」的函数。此后调用原生函数会抛错，因为对象不再有原生对应物。通常没有必要；只在性能关键、需要手动内存管理、且原生对象独占原生内存（例如二进制数据、图像位图）的情况下有用。请先确认没有其他方还会使用该对象。React Hook 返回的共享对象（如 `expo-video` 的 `useVideoPlayer()` 与 `expo-image` 的 `useImage()`）通常会在 effect 清理时自动释放。返回 `void`。

### SharedRefType

> 支持平台：Android、iOS、tvOS、Web。

「持有对任意原生对象引用的 `SharedObject`」。这让相互独立的库可以传递原生实例引用 —— 例如 `expo-image` 的 `ImageRef` 在 Android 上包装一个 `Drawable`、在 iOS 上包装一个 `UIImage`，于是 `expo-image-manipulator` 可以把处理结果直接交给 `expo-image` 视图，无需额外的文件系统读写。继承并实现 `SharedObject<TEventsMap>`。

属性：

- `nativeRefType`（`string`）—— 原生引用的类型。

## 方法（Methods）

### createPermissionHook(methods)

> 支持平台：Android、iOS、tvOS、Web。

构建一个已接好权限方法的新权限 Hook，作为快速制作模块专属权限 Hook 的方式。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `methods` | `PermissionHookMethods<Permission, Options>` | 权限方法。 |

返回值：`(options: PermissionHookOptions<Options>) => [Permission | null, RequestPermissionMethod<Permission>, GetPermissionMethod<Permission>]`。

### installOnUIRuntime(uiRuntimeHolder)

> 支持平台：Android、iOS、tvOS、Web。

将 Expo Modules 安装到 UI worklet 运行时，使 worklet 回调与可序列化的 SharedObjects 在那里正常工作。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `uiRuntimeHolder` | `object` | 来自 `react-native-worklets` 中 `getUIRuntimeHolder()` 的 UI 运行时持有者。 |

返回值：`void`。

### isRunningInExpoGo()

> 支持平台：Android、iOS、tvOS、Web。

报告应用是否在 Expo Go 中运行。无参数。返回 `boolean`。

### registerRootComponent(component)

> 支持平台：Android、iOS、tvOS、Web。

设置应用根 React Native 视图中原生渲染的初始组件。它调用 React Native 的 `AppRegistry.registerComponent`；在 Web 上调用 React Native web 的 `AppRegistry.runApplication` 渲染到根 `index.html`；并全局 polyfill `process.nextTick`。

仅开发环境的附加内容（会从生产 bundle 中剥离）：Fast Refresh / bundle 拆分指示器、`expo-updates` 已配置的断言、浏览器中 `react-native` 别名到 `react-native-web` 的断言。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `component` | `ComponentType<P>` | 渲染应用其余部分的 React 组件类。 |

返回值：`void`。

bare React Native 项目的设置见下方「常见问题」。

### registerWebModule(moduleImplementation, moduleName)

> 支持平台：Android、iOS、tvOS、Web。

注册一个 Web 模块。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `moduleImplementation` | `ModuleType` | 继承 `NativeModule` 的类，注册在 `globalThis.expo.modules[className]` 下。 |
| `moduleName` | `string` | 模块注册所用的名称。 |

返回值：`ModuleType` —— 所传类的单例实例。

### reloadAppAsync(reason)

> 支持平台：Android、iOS、tvOS、Web。

在发布版和调试版构建中重新加载应用。与 `Updates.reloadAsync()` 不同，它忽略任何可用的新更新，重新运行当前正在执行的 JavaScript bundle。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `reason`（可选） | `string` | 重新加载应用的原因。仅部分平台使用。 |

返回值：`Promise<void>`。

### requireNativeModule(moduleName)

> 支持平台：Android、iOS、tvOS、Web。

导入以该名称注册的原生模块，优先使用 JSI 宿主对象，否则使用桥接代理模块。通过代理加载的模块可能缺少某些功能，例如同步函数。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `moduleName` | `string` | 所请求原生模块的名称。 |

返回值：`ModuleType`。

### requireNativeView(moduleName, viewName)

> 支持平台：Android、iOS、tvOS、Web。

`requireNativeComponent` 的直接替代品。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `moduleName` | `string` | 所请求原生视图模块的名称。 |
| `viewName`（可选） | `string` | 所请求原生视图的名称。 |

返回值：`ComponentType<P>`。

### requireOptionalNativeModule(moduleName)

> 支持平台：Android、iOS、tvOS、Web。

与 `requireNativeModule` 类似，但模块缺失时返回 `null` 而不是抛错。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `moduleName` | `string` | 所请求原生模块的名称。 |

返回值：`ModuleType | null`。

## 类型（Types）

### PermissionExpiration

权限的过期时间。接受 `'never'` | `number`。目前，所有权限都是永久授予的。

### PermissionHookOptions

接受 `PermissionHookBehavior` | `Options`。

### PermissionResponse

权限的获取/请求函数返回的对象。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `canAskAgain` | `boolean` | 是否可以再次询问用户；如果不能，应引导用户前往设置应用。 |
| `expires` | `PermissionExpiration` | 权限何时过期。 |
| `granted` | `boolean` | 已授予状态的便捷标志。 |
| `status` | `PermissionStatus` | 权限的状态。 |

## 枚举（Enums）

### PermissionStatus

> 支持平台：Android、iOS、tvOS、Web。

- `DENIED = "denied"` —— 用户拒绝了该权限。
- `GRANTED = "granted"` —— 用户授予了该权限。
- `UNDETERMINED = "undetermined"` —— 尚未做出决定。

## 常见问题

### 在现有 React Native 项目中设置 registerRootComponent

如果你自行维护 **android** 和 **ios** 目录，必须执行以下步骤，Expo 模块才能工作：

- **Android**：在 `android/app/src/main/your-package/MainActivity.java` 中，让 `getMainComponentName` 返回名称 `main`：

```java MainActivity.java
@Override
protected String getMainComponentName() {
  return "main";
}
```

- **iOS**：在 `ios/your-project/AppDelegate.(m|mm|swift)` 的 `application:didFinishLaunchingWithOptions:` 中，在 `createRootViewWithBridge:bridge moduleName:@"main" initialProperties:initProps` 这一行使用模块名 `main`：

```objc AppDelegate.mm
UIView *rootView = [self.reactDelegate createRootViewWithBridge:bridge
                                                    moduleName:@"main"
                                             initialProperties:initProps];
```

### 使用 App.js 或 app/_layout.tsx 之外的主应用文件

- **不使用 Expo Router**：可以将 package.json 中的 `"main"` 指向任意项目文件，例如 `{ "main": "src/main.jsx" }`。使用自定义入口文件时，`export default` 不会让组件成为应用根 —— 你必须从 **src/main.jsx** 调用 `registerRootComponent`，并传入想要放在根部的组件：

```json package.json
{
  "main": "src/main.jsx"
}
```

```tsx src/main.jsx
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

- **使用 Expo Router**：按照 Expo Router 安装指南中的自定义入口点步骤构建自定义入口；顶层 **src** 目录的用法见 src 目录参考。
