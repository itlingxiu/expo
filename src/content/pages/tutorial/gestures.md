---
title: 添加手势
description: 在本教程中，学习如何使用 React Native Gesture Handler 和 Reanimated 库实现手势。
---

# 添加手势

手势是在应用中提供直观用户体验的好方法。[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/) 库提供可以处理手势的内置原生组件。它使用平台的原生触摸处理系统来识别平移、点按、旋转和其他手势。在本章中，我们将用这个库添加两种不同的手势：

- 双击以放大表情贴纸的尺寸，再次双击时缩小。
- 平移以在屏幕上移动表情贴纸，让用户可以把贴纸放在图片的任意位置。

我们还会使用 [Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/handling-gestures/) 库在手势状态之间做动画。

[观看视频：为通用 Expo 应用添加手势](https://www.youtube.com/watch?v=0q48LLvTGDU) —— 使用 React Native Gesture Handler 和 Reanimated 为表情贴纸添加双击和平移手势。

---

## 1. 添加 GestureHandlerRootView

要让应用中的手势交互生效，我们会在 `Index` 组件的顶层渲染来自 `react-native-gesture-handler` 的 `<GestureHandlerRootView>`。把 **src/app/(tabs)/index.tsx** 中根级的 `<View>` 组件替换为 `<GestureHandlerRootView>`。

```tsx src/app/(tabs)/index.tsx
// ... 其余 import 语句保持不变
// 从 react-native-gesture-handler 导入 GestureHandlerRootView。
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Index() {
  return (
    // 把根级 View 组件替换为 GestureHandlerRootView。
    <GestureHandlerRootView style={styles.container}>
      {null /* ...其余代码保持不变 */}
    </GestureHandlerRootView>
  );
}
```

## 2. 使用动画组件

`Animated` 组件会查看组件的 `style` prop，判断哪些值需要动画，并应用更新来创建动画。Reanimated 导出 `<Animated.View>`、`<Animated.Text>` 或 `<Animated.ScrollView>` 等动画组件。我们将把动画应用到 `<Animated.Image>` 组件，使双击手势生效。

1. 打开 **src/components** 目录中的 **emoji-sticker.tsx** 文件。在其中从 `react-native-reanimated` 库导入 `Animated`，以便使用动画组件。
2. 把 `Image` 组件替换为 `<Animated.Image>`。

```tsx src/components/emoji-sticker.tsx
import { ImageSourcePropType, View } from 'react-native';
// 从 react-native-reanimated 导入 Animated。
import Animated from 'react-native-reanimated';

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  return (
    <View style={{ top: -350 }}>
      <Animated.Image
        // 把 Image 组件替换为 Animated.Image。
        source={stickerSource}
        resizeMode="contain"
        style={{ width: imageSize, height: imageSize }}
      />
    </View>
  );
}
```

> 动画组件 API 的完整参考，参见 [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent) 文档。

## 3. 添加点按手势

React Native Gesture Handler 允许我们在检测到触摸输入（例如双击事件）时添加行为。

在 **src/components/emoji-sticker.tsx** 文件中：

1. 从 `react-native-gesture-handler` 导入 `Gesture` 和 `GestureDetector`。
2. 为了识别贴纸上的点按，从 `react-native-reanimated` 导入 `useAnimatedStyle`、`useSharedValue` 和 `withSpring`，以便为 `<Animated.Image>` 的样式做动画。
3. 在 `EmojiSticker` 组件内部，用 `useSharedValue()` hook 创建一个名为 `scaleImage` 的引用。它以 `imageSize` 的值作为初始值。

```tsx src/components/emoji-sticker.tsx
// ... 其余 import 语句保持不变
// 从 react-native-gesture-handler 导入 Gesture 和 GestureDetector。
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// 从 react-native-reanimated 导入 useAnimatedStyle、useSharedValue 和 withSpring。
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  // 创建 scaleImage 共享值，并把 imageSize 设为它的初始值。
  const scaleImage = useSharedValue(imageSize);

  return null; // ... 其余代码保持不变
}
```

用 `useSharedValue()` hook 创建共享值有很多好处。它有助于变更数据，并根据当前值运行动画。我们可以用 `.value` 属性访问和修改共享值。我们将创建一个 `doubleTap` 对象来缩放初始值，并用 `Gesture.Tap()` 在缩放贴纸图片时为过渡做动画。为了确定所需的点按次数，我们会添加 `numberOfTaps()`。

在 `EmojiSticker` 组件中创建以下对象：

```tsx src/components/emoji-sticker.tsx
const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onStart(() => {
    if (scaleImage.value !== imageSize * 2) {
      scaleImage.value = scaleImage.value * 2;
    } else {
      scaleImage.value = Math.round(scaleImage.value / 2);
    }
  });
```

为了给过渡做动画，我们使用基于弹簧的动画。这会让它感觉有生命力，因为它基于弹簧在真实世界中的物理规律。我们将使用 `react-native-reanimated` 提供的 `withSpring()` 函数。

在贴纸图片上，我们用 `useAnimatedStyle()` hook 创建一个样式对象。这有助于在动画发生时用共享值更新样式。我们还会通过操作 `width` 和 `height` 属性来缩放图片尺寸。这些属性的初始值设为 `imageSize`。

创建一个 `imageStyle` 变量并添加到 `EmojiSticker` 组件：

```tsx src/components/emoji-sticker.tsx
const imageStyle = useAnimatedStyle(() => {
  return {
    width: withSpring(scaleImage.value),
    height: withSpring(scaleImage.value),
  };
});
```

接下来，用 `<GestureDetector>` 包裹 `<Animated.Image>` 组件，并修改 `<Animated.Image>` 上的 `style` prop 以传入 `imageStyle`。

```tsx src/components/emoji-sticker.tsx
import { ImageSourcePropType, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const scaleImage = useSharedValue(imageSize);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
      } else {
        scaleImage.value = Math.round(scaleImage.value / 2);
      }
    });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  return (
    <View style={{ top: -350 }}>
      <GestureDetector
        // 用 GestureDetector 包裹 Animated.Image 组件。
        gesture={doubleTap}
      >
        <Animated.Image
          source={stickerSource}
          resizeMode="contain"
          // 修改 Animated.Image 上的 style prop，传入 imageStyle。
          style={[{ width: imageSize, height: imageSize }, imageStyle]}
        />
      </GestureDetector>
    </View>
  );
}
```

在上面的片段中，`gesture` prop 取 `doubleTap` 的值，以便在用户双击贴纸图片时触发手势。

分别在 Android、iOS 和 Web 上看看我们的应用：

<video src="/static/videos/tutorial/tap-gesture.mp4" controls></video>

> 点按手势 API 的完整参考，参见 [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gestures/tap-gesture) 文档。

## 4. 添加平移手势

为了识别贴纸上的拖动手势并跟踪它的移动，我们将使用平移手势。在 **src/components/emoji-sticker.tsx** 中：

1. 创建两个新的共享值：`translateX` 和 `translateY`。
2. 把 `<View>` 替换为 `<Animated.View>` 组件。

```tsx src/components/emoji-sticker.tsx
export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const scaleImage = useSharedValue(imageSize);
  // 添加 translateX 和 translateY 共享值。
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  // ... 其余代码保持不变

  return (
    // 把 View 组件替换为 Animated.View。
    <Animated.View style={{ top: -350 }}>
      <GestureDetector gesture={doubleTap}>
        {null /* ...其余代码保持不变 */}
      </GestureDetector>
    </Animated.View>
  );
}
```

来看看上面的代码做了什么：

- 定义的平移值会在屏幕上移动贴纸。由于贴纸沿两个轴移动，我们需要跟踪 X 和 Y 值。
- 在 `useSharedValue()` hook 中，我们把两个平移变量的初始位置都设为 `0`。这是贴纸的初始位置和起点。这个值设置手势开始时贴纸的初始位置。

在上一步中，我们为链接到 `Gesture.Tap()` 方法的点按手势触发了 `onStart()` 回调。对于平移手势，指定一个 `onChange()` 回调，它在手势处于活动状态并移动时运行。

1. 创建一个 `drag` 对象来处理平移手势。`onChange()` 回调接受 `event` 作为参数。`changeX` 和 `changeY` 属性保存自上次事件以来的位置变化，并更新存储在 `translateX` 和 `translateY` 中的值。
2. 用 `useAnimatedStyle()` hook 定义 `containerStyle` 对象。它会返回一个变换数组。对于 `<Animated.View>` 组件，我们需要把 `transform` 属性设为 `translateX` 和 `translateY` 的值。这会在手势活动时改变贴纸的位置。

```tsx src/components/emoji-sticker.tsx
const drag = Gesture.Pan().onChange(event => {
  translateX.value += event.changeX;
  translateY.value += event.changeY;
});

const containerStyle = useAnimatedStyle(() => {
  return {
    transform: [
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
    ],
  };
});
```

接下来，在 JSX 代码中：

1. 更新 `<EmojiSticker>` 组件，使 `<GestureDetector>` 组件成为顶层组件。
2. 在 `<Animated.View>` 组件上添加 `containerStyle`，以应用变换样式。

```tsx src/components/emoji-sticker.tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ImageSourcePropType } from 'react-native';

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
      } else {
        scaleImage.value = Math.round(scaleImage.value / 2);
      }
    });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  const drag = Gesture.Pan().onChange(event => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    // 把所有组件包裹在 GestureDetector 中。
    <GestureDetector gesture={drag}>
      <Animated.View
        // 把 containerStyle 加到 Animated.View 的 style prop。
        style={[containerStyle, { top: -350 }]}
      >
        <GestureDetector gesture={doubleTap}>
          <Animated.Image
            source={stickerSource}
            resizeMode="contain"
            style={[{ width: imageSize, height: imageSize }, imageStyle]}
          />
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}
```

分别在 Android、iOS 和 Web 上看看我们的应用：

<video src="/static/videos/tutorial/pan-gesture.mp4" controls></video>

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
