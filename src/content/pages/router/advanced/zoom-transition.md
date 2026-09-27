---
title: 缩放过渡
description: 了解如何在 iOS 上使用 Expo Router 的缩放过渡，在屏幕之间创建流畅动画。
---

# 缩放过渡

:::warning
缩放过渡是 [alpha](/more/release-statuses#alpha) API，仅在 **iOS** 上、自 **Expo SDK 55** 起可用。该 API 可能会发生破坏性变更。
:::

> 演示视频：带有缩放过渡的简单图库。

缩放过渡通过从源元素缩放到目标屏幕，在屏幕之间导航时提供流畅的动画效果。此功能利用 iOS 18+ 的原生缩放过渡 API，创建共享的、可交互的过渡，让路由之间产生空间感。例如，卡片缩略图可以过渡为下一条路由上的全宽横幅。

## 入门

要实现缩放过渡，需要使用 `Link.AppleZoom` 组件标记源元素，并可选地使用 `Link.AppleZoomTarget` 指定目标屏幕上的对齐方式。

### 基本示例

要为链接启用缩放过渡，在屏幕中用 `Link.AppleZoom` 包裹源（`Image`）元素：

```tsx src/app/index.tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Link href="/image" asChild>
        <Link.AppleZoom>
          <Pressable>
            <Image
              source={{ uri: 'https://example.com/image-1.jpg' }}
              style={{ width: 100, height: 200 }}
            />
          </Pressable>
        </Link.AppleZoom>
      </Link>
    </View>
  );
}
```

在目标屏幕中定义 `Image` 组件：

```tsx src/app/image.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export default function DetailsScreen() {
  return <Image source={{ uri: 'https://example.com/image-1.jpg' }} style={{ flex: 1 }} />;
}
```

## 使用 `Link.AppleZoom`

`Link.AppleZoom` 组件包裹你希望从其开始缩放的元素。如果你想在缩放内容旁边包含额外元素，用它标记缩放过渡的源很有用。

```tsx
<Link href="/image" asChild>
  <Pressable>
    <Link.AppleZoom>
      <View>{/* 你的内容 */}</View>
    </Link.AppleZoom>
    <Text>Subtitle</Text>
  </Pressable>
</Link>
```

:::note
`Link.AppleZoom` 只接受单个子组件。如果需要包裹多个子项，请使用 `View` 或其他容器组件。
:::

### 自定义对齐

可以用 `Link.AppleZoomTarget` 元素指定缩放元素在目标屏幕上的对齐方式。

```tsx src/app/image.tsx
export default function ImageScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Link.AppleZoomTarget>
        <Image source={{ uri: 'https://example.com/image-1.jpg' }} style={{ width: '100%' }} />
      </Link.AppleZoomTarget>
    </View>
  );
}
```

如果需要对齐矩形有更多控制，可以向 `Link.AppleZoom` 传入 `alignmentRect` 属性。不过，如果使用 `Link.AppleZoomTarget`，通常不需要这样做。

:::note
`alignmentRect` 属性在内部依赖 [`alignmentRectProvider`](https://developer.apple.com/documentation/uikit/uiviewcontroller/transition/zoomoptions/alignmentrectprovider) API。
:::

```tsx
<Link.AppleZoom alignmentRect={{ x: 0, y: 0, width: 200, height: 300 }}>
  <Image source={{ uri: 'https://example.com/image-1.jpg' }} style={{ width: 100, height: 150 }} />
</Link.AppleZoom>
```

## 完整示例

下面是一个更复杂的示例，展示带有缩放到详情视图过渡的图库网格。源屏幕组件（**src/app/index.tsx**）使用 `Link.AppleZoom` 包裹 `Image` 组件：

```tsx src/app/index.tsx
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, Pressable, ScrollView, StyleSheet } from 'react-native';

const IMAGES = [
  // 在这里定义图片数组。
];

export default function Index() {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      contentInsetAdjustmentBehavior="automatic">
      {IMAGES.map((_, index) => (
        <Thumbnail key={index} index={index} />
      ))}
    </ScrollView>
  );
}

function Thumbnail({ index }: { index: number }) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  return (
    <Link
      href={{
        pathname: `/image/[id]`,
        // 需要把图片尺寸传给详情页，以便在首次渲染时测量布局。
        params: { id: index, width: size?.width, height: size?.height },
      }}
      asChild>
      <Pressable style={styles.thumbnail}>
        <Link.AppleZoom>
          <Image
            source={IMAGES[index % IMAGES.length]}
            style={styles.thumbnailImage}
            onLoad={e => setSize({ width: e.source.width, height: e.source.height })}
          />
        </Link.AppleZoom>
        <Text style={{ textAlign: 'center' }}>Photo {index + 1}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  scrollViewContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  thumbnail: {
    width: 170,
    aspectRatio: 1,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
```

在目标屏幕中，使用 `Link.AppleZoomTarget` 指定缩放元素的对齐方式：

```tsx src/app/image/[id].tsx
import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

export default function ImagePage() {
  const params = useLocalSearchParams();
  const index = params.id ? parseInt(params.id as string, 10) : 0;
  const imageSource = IMAGES[index % IMAGES.length];
  const imageSize = {
    width: parseInt(params.width as string, 10),
    height: parseInt(params.height as string, 10),
  };
  const windowDimensions = useWindowDimensions();
  // 计算在保持宽高比的同时适配窗口的尺寸。
  const computedSize = useMemo(() => {
    if (!imageSize.width || !imageSize.height) {
      return { width: windowDimensions.width, height: windowDimensions.height };
    }
    const widthRatio = windowDimensions.width / imageSize.width;
    const heightRatio = windowDimensions.height / imageSize.height;
    const minRatio = Math.min(widthRatio, heightRatio);
    return {
      width: imageSize.width * minRatio,
      height: imageSize.height * minRatio,
    };
  }, [imageSize, windowDimensions]);

  return (
    <View style={styles.container}>
      <Link.AppleZoomTarget>
        <View style={{ ...computedSize }}>
          <Image source={imageSource} style={styles.image} />
        </View>
      </Link.AppleZoomTarget>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
```

## 控制关闭手势

[`usePreventZoomTransitionDismissal`](/versions/latest/sdk/router/link#usepreventzoomtransitiondismissal_options) hook 允许你控制使用缩放过渡的屏幕上的交互式滑动关闭手势。当你希望防止意外关闭，或把关闭限制在特定屏幕区域时，这很有用。

### 完全禁用关闭

不带任何选项调用该 hook，即可完全禁用滑动关闭手势：

```tsx src/app/detail.tsx
import { usePreventZoomTransitionDismissal } from 'expo-router';

export default function DetailScreen() {
  usePreventZoomTransitionDismissal();
  // 关闭手势现已禁用——用户必须使用导航控件返回
  return <View>{/* 内容 */}</View>;
}
```

### 将关闭限制在特定区域

使用 `unstable_dismissalBoundsRect` 选项定义允许关闭手势的矩形。这对于图片查看器很有用，你可能只希望从图片区域关闭：

```tsx src/app/image.tsx
import { usePreventZoomTransitionDismissal } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export default function DetailScreen() {
  // 只允许从该矩形内开始的关闭手势
  usePreventZoomTransitionDismissal({
    unstable_dismissalBoundsRect: { minX: 100, minY: 100, maxX: 300, maxY: 300 },
  });

  return (
    <View style={styles.container}>
      {/* 关闭区域的视觉指示（用于演示） */}
      <View style={styles.dismissalZone} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  dismissalZone: {
    position: 'absolute',
    left: 100,
    top: 100,
    width: 200, // maxX - minX = 300 - 100
    height: 200, // maxY - minY = 300 - 100
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.5)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
});
```

:::note
`unstable_dismissalBoundsRect` 选项在内部依赖 [`interactiveDismissShouldBegin`](https://developer.apple.com/documentation/uikit/uiviewcontroller/transition/zoomoptions/interactivedismissshouldbegin) API。
:::

## 平台支持

缩放过渡仅在 iOS 18 及更高版本上可用。在更早的 iOS 版本或其他平台上，组件会正常渲染，但没有缩放动画效果。

缩放过渡组件会自动检测平台支持，并在不支持的平台上优雅降级为标准导航。

## 已知限制

<details>
<summary>将缩放过渡与标题栏一起使用</summary>

建议避免在带有标题栏（导航栏）的屏幕之间导航时使用缩放过渡。原生 iOS 缩放过渡 API 存在已知问题，涉及标题栏时可能导致视觉故障或意外行为。

</details>

<details>
<summary>将缩放过渡与 Link.Preview 一起使用</summary>

当 `Link.Preview` 与缩放过渡一起使用时，目标屏幕必须使用模态呈现，例如 `presentation: 'fullScreenModal'`。这是底层 iOS 缩放过渡 API 的限制。从 `Link.Preview` 导航到非模态屏幕时，缩放过渡不会按预期工作，并会回退到标准导航过渡。

</details>

<details>
<summary>`usePreventZoomTransitionDismissal` 不能用于具有模态呈现的屏幕</summary>

`usePreventZoomTransitionDismissal` hook 不能用于具有模态呈现的屏幕，例如 `presentation: 'fullScreenModal'`。在模态屏幕中使用时，该 hook 不会产生任何效果，关闭手势会照常工作。

</details>

<details>
<summary>单个子项要求</summary>

`Link.AppleZoom` 和 `Link.AppleZoomTarget` 都只接受单个子组件。如果尝试传入多个子项，会记录一条警告，并且组件无法正确渲染。

**不正确：**

```tsx
<Link.AppleZoom>
  <View />
  <Text />
</Link.AppleZoom>
```

**正确：**

```tsx
<Link.AppleZoom>
  <View>
    <Image />
    <Text />
  </View>
</Link.AppleZoom>
```

</details>

<details>
<summary>打开或关闭屏幕时有明显延迟</summary>

导航到使用缩放过渡的屏幕或关闭它们时，你可能会遇到明显延迟（大约 1 秒），尤其是在快速执行打开/关闭/打开手势时。这种延迟高于使用相同缩放过渡 API 的原生 iOS 应用。

这是 `react-native-screens` 中的上游问题，与它在 iOS 上处理过渡的方式有关。Expo 团队正在与 `react-native-screens` 团队积极合作以改进这一点。更新和更多细节见此 [GitHub Issue](https://github.com/expo/expo/issues/42797)。

</details>

<details>
<summary>仅在路由器的 Stack 导航器内受支持</summary>

缩放过渡功能仅在使用路由器内置的 Stack 导航器时受支持。如果尝试使用带缩放过渡的 Link 前往不属于 Stack 导航器的屏幕，缩放过渡不会按预期工作。

</details>

<details>
<summary>必须在 Link 内使用</summary>

`Link.AppleZoom` 必须作为带有 `asChild` 属性的 `Link` 组件的直接或间接子项使用。在此上下文之外使用会导致错误。

</details>

<details>
<summary>仅 iOS 18+</summary>

缩放过渡功能需要 iOS 18 或更高版本。组件在更早版本上仍会渲染，但不会应用缩放动画。

</details>
