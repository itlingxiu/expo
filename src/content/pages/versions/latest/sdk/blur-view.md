---
title: BlurView 包参考
description: 模糊视图下方所有内容的 React 组件。
---

# BlurView 包参考

一个会模糊视图下方所有内容的 React 组件。常见用途是导航栏、标签栏和模态框。

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

:::note
在 SDK 55 及更高版本中，`expo-blur` 在 Android 上已经稳定，但要让 `BlurView` 正常工作，需要做一些代码更改。详见 [Android 支持](#android-支持)。
:::

## 已知问题

当 `BlurView` 在动态内容（例如使用 `FlatList`）渲染之前就被渲染时，模糊效果不会更新。要解决此问题，请确保 `BlurView` 在动态内容组件之后渲染。例如：

```jsx
<View>
  <FlatList />
  <BlurView />
</View>
```

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-blur
```
:::
:::tab yarn
```sh
yarn expo install expo-blur
```
:::
:::tab pnpm
```sh
pnpm expo install expo-blur
```
:::
:::tab bun
```sh
bun expo install expo-blur
```
:::
:::

## 用法

<details>
<summary>仅适用于 iOS 和 Web 的基本 BlurView 用法</summary>

这是创建 `BlurView` 的旧方式，只会在 iOS 上产生模糊。在 Android 上，这会得到一个带半透明背景的视图。

```jsx
import { Text, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

export default function App() {
  const text = 'Hello, my container is blurring contents underneath!';
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        {[...Array(20).keys()].map(i => (
          <View
            key={`box-${i}`}
            style={[styles.box, i % 2 === 1 ? styles.boxOdd : styles.boxEven]}
          />
        ))}
      </View>
      <BlurView intensity={100} style={styles.blurContainer}>
        <Text style={styles.text}>{text}</Text>
      </BlurView>
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <Text style={styles.text}>{text}</Text>
      </BlurView>
      <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
        <Text style={[styles.text, { color: '#fff' }]}>{text}</Text>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    margin: 16,
    textAlign: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 20,
  },
  background: {
    flex: 1,
    flexWrap: 'wrap',
    ...StyleSheet.absoluteFill,
  },
  box: {
    width: '25%',
    height: '20%',
  },
  boxEven: {
    backgroundColor: 'orangered',
  },
  boxOdd: {
    backgroundColor: 'gold',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
});
```

</details>

<details id="支持-android-的基本-blurview-用法">
<summary>支持 Android 的基本 BlurView 用法</summary>

要在 Android 上模糊视图的背景，把要模糊的内容包在 `BlurTargetView` 组件中，并将其 ref 传给 `BlurView`。

:::note
请注意，只要所有 `BlurView` 都位于单个 `BlurTargetView` 的边界内，你就可以让多个 `BlurView` 共用这一个 `BlurTargetView`。这比创建多个 `BlurTargetView` 更高效。
:::

```tsx
import { BlurView, BlurTargetView } from 'expo-blur';
import { useRef } from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default function App() {
  const targetRef = useRef<View | null>(null);
  const text = 'Hello, my container is blurring contents underneath!';

  return (
    <View style={styles.container}>
      <BlurTargetView ref={targetRef} style={styles.background}>
        {[...Array(20).keys()].map(i => (
          <View
            key={`box-${i}`}
            style={[styles.box, i % 2 === 1 ? styles.boxOdd : styles.boxEven]}
          />
        ))}
      </BlurTargetView>
      <BlurView
        blurTarget={targetRef}
        intensity={100}
        style={styles.blurContainer}
        blurMethod="dimezisBlurView">
        <Text style={styles.text}>{text}</Text>
      </BlurView>
      <BlurView
        blurTarget={targetRef}
        intensity={80}
        tint="light"
        style={styles.blurContainer}
        blurMethod="dimezisBlurView">
        <Text style={styles.text}>{text}</Text>
      </BlurView>
      <BlurView
        blurTarget={targetRef}
        intensity={90}
        tint="dark"
        style={styles.blurContainer}
        blurMethod="dimezisBlurView">
        <Text style={[styles.text, { color: '#fff' }]}>{text}</Text>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    margin: 16,
    textAlign: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 20,
  },
  background: {
    flex: 1,
    flexWrap: 'wrap',
    ...StyleSheet.absoluteFill,
  },
  box: {
    width: '25%',
    height: '20%',
  },
  boxEven: {
    backgroundColor: 'orangered',
  },
  boxOdd: {
    backgroundColor: 'gold',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
});
```

</details>

## Android 支持

模糊功能在 Android 上已经稳定。迁移时需要注意几点：

### API

要在 Android 上模糊视图的背景，把要模糊的内容包在 `BlurTargetView` 组件中，并将其 ref 传给 `BlurView`。示例见[用法](#支持-android-的基本-blurview-用法)。

### 性能

只有使用 Android SDK 31（Android 12.0）引入的 [RenderNode](https://developer.android.com/reference/android/graphics/RenderNode) Android API，才能高效实现模糊。因此，在更旧的 Android 版本上，`expo-blur` 使用效率低得多的 [RenderScript](https://developer.android.com/guide/topics/renderscript/compute) API。如果想避免旧平台上的性能损失，可以使用 `dimezisBlurViewSdk31Plus` [BlurMethod](#blurmethod-1)，它只在较新的 Android 版本上模糊，并在更旧的版本上回退到 [`none`](#blurmethod-1)。

## API

```js
import { BlurView } from 'expo-blur';
```

## 在 `BlurView` 上使用 `borderRadius`

在 Android 和 iOS 上使用 `BlurView` 时，显式提供的 `borderRadius` 属性不会生效。要解决此问题，可以使用 `overflow: 'hidden'` 样式，因为 `BlurView` 继承了 `<View>` 的属性。示例见[用法](#用法)。
