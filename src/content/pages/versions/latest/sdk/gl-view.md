---
title: GLView 包参考
description: 提供作为 OpenGL ES 渲染目标并提供 GLContext 的 GLView 的库。适用于渲染 2D 与 3D 图形。
---

# GLView 包参考

`expo-gl` 提供一个作为 OpenGL ES 渲染目标的 `View`，适用于渲染 2D 和 3D 图形。挂载时会创建 OpenGL ES 上下文。每一帧都会把其绘制缓冲区作为该 `View` 的内容呈现。

> 支持平台：Android、iOS、Web、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-gl
```
:::
:::tab yarn
```sh
yarn expo install expo-gl
```
:::
:::tab pnpm
```sh
pnpm expo install expo-gl
```
:::
:::tab bun
```sh
bun expo install expo-gl
```
:::
:::

## 用法

```jsx
import { View } from 'react-native';
import { GLView } from 'expo-gl';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <GLView style={{ width: 300, height: 300 }} onContextCreate={onContextCreate} />
    </View>
  );
}

function onContextCreate(gl) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0, 1, 1, 1);

  // 创建顶点着色器（形状与位置）
  const vert = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(
    vert,
    `
    void main(void) {
      gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
      gl_PointSize = 150.0;
    }
  `
  );
  gl.compileShader(vert);

  // 创建片元着色器（颜色）
  const frag = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(
    frag,
    `
    void main(void) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
  `
  );
  gl.compileShader(frag);

  // 链接成一个程序
  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  gl.useProgram(program);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);

  gl.flush();
  gl.endFrameEXP();
}
```

## 高层 API

由于 WebGL API 相当底层，使用在底层通过 `GLView` 渲染的更高层图形 API 会有帮助。以下库集成了常用图形 API：

- 用于 [three.js](https://threejs.org) 的 [expo-three](https://github.com/expo/expo-three)

任何期望 [WebGLRenderingContext](https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14) 的、支持 WebGL 的库都可以使用。有时这类库会假定处于 Web JavaScript 环境（例如假定存在 `document`）。这通常用于资源加载或事件处理，主要渲染逻辑仍然只使用纯 WebGL。因此这些库通常仍可配合少量变通方法使用。上面列出的 Expo 专用集成已经包含了一些常用库的变通方法。

## 与 Reanimated worklet 集成

要在 Reanimated worklet 内使用此 API，需要把 GL 上下文 ID 传给 worklet，并像下面的示例那样重新创建 GL 对象。

```jsx
import { View } from 'react-native';
import { runOnUI } from 'react-native-reanimated';
import { GLView } from 'expo-gl';

function render(gl) {
  'worklet';
  // 在此添加你的 WebGL 代码
}

function onContextCreate(gl) {
  runOnUI((contextId: number) => {
    'worklet';
    const gl = GLView.getWorkletContext(contextId);
    render(gl);
  })(gl.contextId);
}

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <GLView
        style={{ width: 300, height: 300 }}
        enableExperimentalWorkletSupport
        onContextCreate={onContextCreate}
      />
    </View>
  );
}
```

关于如何将 `expo-gl` 与 Reanimated 和 Gesture Handler 一起使用的更深入示例，可以查看[此示例](https://github.com/expo/expo/tree/main/apps/native-component-list/src/screens/GL/GLReanimatedExample.tsx)。

### 限制

Worklet 运行时对在其中运行的代码有一些限制，因此如果你已有 WebGL 代码，很可能需要做一些修改才能在 worklet 线程中运行。

- Pixi.js 或 Three.js 等第三方库无法在 worklet 内工作，你只能使用开头加了 `'worklet'` 的函数。
- 如果需要加载一些资源传给 WebGL 代码，必须在主线程完成，并通过某种引用传给 worklet。如果使用 `expo-asset`，可以把 `Asset.fromModule` 或 `useAssets` hook 返回的资源对象传给 `runOnUI` 函数。
- 要实现渲染循环，需要使用 `requestAnimationFrame`，`setTimeout` 等 API 不受支持。

更多内容见 [Reanimated 文档](https://docs.swmansion.com/react-native-reanimated/docs/guides/worklets/)。

## 远程调试与 GLView

启用远程调试时，此 API 无法按预期工作。React Native 调试器在你的电脑上运行 JavaScript，而不是在移动设备上。GLView 需要同步的原生调用，Chrome 不支持这些调用。

## API

```js
import { GLView } from 'expo-gl';
```

## WebGL API

组件挂载并创建 OpenGL ES 上下文后，通过 `onContextCreate` 属性收到的 `gl` 对象就成为 OpenGL ES 上下文的接口，并提供 WebGL API。它类似于 WebGL 2 规范中的 [WebGL2RenderingContext](https://registry.khronos.org/webgl/specs/latest/2.0/#3.7)。

一些较旧的 Android 设备可能不支持 WebGL2 功能。要检查设备是否支持 WebGL2，建议使用 `gl instanceof WebGL2RenderingContext`。

另外还有方法 `gl.endFrameEXP()`，它通知上下文当前帧已准备好呈现。这类似于其他 OpenGL 平台上的 “swap buffers” API 调用。

以下 WebGL2RenderingContext 方法目前尚未实现：

- `getFramebufferAttachmentParameter()`
- `getRenderbufferParameter()`
- `compressedTexImage2D()`
- `compressedTexSubImage2D()`
- `getTexParameter()`
- `getUniform()`
- `getVertexAttrib()`
- `getVertexAttribOffset()`
- `getBufferSubData()`
- `getInternalformatParameter()`
- `renderbufferStorageMultisample()`
- `compressedTexImage3D()`
- `compressedTexSubImage3D()`
- `fenceSync()`
- `isSync()`
- `deleteSync()`
- `clientWaitSync()`
- `waitSync()`
- `getSyncParameter()`
- `getActiveUniformBlockParameter()`

[`texImage2D()`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D) 的 `pixels` 参数必须是 `null`、包含像素数据的 `ArrayBuffer`，或形如 `{ localUri }` 的对象，其中 `localUri` 是设备文件系统中某张图片的 `file://` URI。因此，对 `Asset` 对象调用 `.downloadAsync()`（并完成）以获取资源之后，就可以使用它。

出于效率考虑，这些方法的当前实现不会对其参数做类型或边界检查。因此，传入无效参数可能导致原生崩溃。计划在后续 SDK 版本中更新 API 以执行参数检查。

目前错误检查的优先级较低，因为引擎通常不依赖 OpenGL API 来做参数检查；否则，底层 OpenGL ES 实现所做的检查通常已经足够。
