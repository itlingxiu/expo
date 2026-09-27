---
title: GlassEffect 包参考
description: 使用 iOS 原生 UIVisualEffectView 渲染液态玻璃效果的 React 组件。
---

# GlassEffect 包参考

:::note
`GlassView` 仅在 iOS 26 及以上可用。在不支持的平台上，它会回退为普通 `View`。
:::

使用 [`UIVisualEffectView`](https://developer.apple.com/documentation/uikit/uivisualeffectview) 渲染原生 iOS 液态玻璃效果的 React 组件。支持可自定义的玻璃样式和着色。

> 支持平台：iOS、tvOS、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-glass-effect
```
:::
:::tab yarn
```sh
yarn expo install expo-glass-effect
```
:::
:::tab pnpm
```sh
pnpm expo install expo-glass-effect
```
:::
:::tab bun
```sh
bun expo install expo-glass-effect
```
:::
:::

## 用法

### `GlassView`

`GlassView` 组件渲染原生 iOS 玻璃效果。它支持不同的玻璃效果样式，并可以用着色来满足各种视觉需求。下面的示例中，第一个是基本玻璃视图，第二个使用 `clear` 样式。

```jsx
import { StyleSheet, View, Image } from 'react-native';
import { GlassView } from 'expo-glass-effect';

export default function App() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={{
          uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        }}
      />

      <GlassView style={styles.glassView} />
      <GlassView style={styles.tintedGlassView} glassEffectStyle="clear" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  glassView: {
    position: 'absolute',
    top: 100,
    left: 50,
    width: 200,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tintedGlassView: {
    position: 'absolute',
    top: 250,
    left: 50,
    width: 200,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
});
```

### `GlassContainer`

`GlassContainer` 组件让你把多个玻璃视图组合成一个组合效果。

```jsx
import { StyleSheet, View, Image } from 'react-native';
import { GlassView, GlassContainer } from 'expo-glass-effect';

export default function GlassContainerDemo() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={{
          uri: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=600&fit=crop',
        }}
      />
      <GlassContainer spacing={10} style={styles.containerStyle}>
        <GlassView style={styles.glass1} isInteractive />
        <GlassView style={styles.glass2} />
        <GlassView style={styles.glass3} />
      </GlassContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  containerStyle: {
    position: 'absolute',
    top: 200,
    left: 50,
    width: 250,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  glass1: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  glass2: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  glass3: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
```

### 动画玻璃效果样式

`glassEffectStyle` 属性接受一个带有 `animate` 和 `animationDuration` 属性的配置对象，以便在玻璃样式之间做原生动画过渡。这是在不修改 `opacity` 的情况下淡入或淡出玻璃效果的推荐方式。

```jsx
import { useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { GlassView } from 'expo-glass-effect';

export default function AnimatedGlassStyleExample() {
  const [visible, setVisible] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundImage}>
        <Image
          style={{
            width: 300,
            height: 200,
          }}
          source={{
            uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
          }}
        />
        <GlassView
          style={styles.glassView}
          glassEffectStyle={{
            style: visible ? 'clear' : 'none',
            animate: true,
            animationDuration: 0.5,
          }}
        />
      </View>
      <Pressable style={styles.toggleButton} onPress={() => setVisible(prev => !prev)}>
        <Text style={styles.toggleButtonText}>{visible ? 'Hide' : 'Show'} Glass Effect</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: 300,
  },
  backgroundImage: {
    position: 'absolute',
  },
  glassView: {
    position: 'absolute',
    width: 200,
    height: 120,
    borderRadius: 12,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### 不透明度动画的变通方法

Apple 不建议在 `GlassView` 或其父视图上使用低于 `1` 的 `opacity` 值，见[设置正确的 alpha 值](https://developer.apple.com/documentation/uikit/uivisualeffectview#Set-the-correct-alpha-value)。在非常低的不透明度下，玻璃效果不会渲染。如果仍然要为不透明度做动画，请使用 Reanimated 为包装视图的不透明度做动画，同时在期望的样式和 `'none'` 之间切换 `glassEffectStyle`。

```jsx
import { GlassView } from 'expo-glass-effect';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

export default function GlassOpacityAnimationExample() {
  const fadeOpacity = useSharedValue(0);

  const glassViewProps = useAnimatedProps(() => {
    const glassEffectStyle = fadeOpacity.value > 0.02 ? 'regular' : 'none';
    return {
      glassEffectStyle,
      style: {
        width: 150,
        height: 100,
        borderRadius: 12,
        position: 'absolute',
      },
    };
  });

  const fadeOpacityStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    opacity: fadeOpacity.value,
    width: 150,
    height: 100,
    borderRadius: 12,
  }));

  return (
    <>
      <Text style={styles.title}>Opacity Animation Workaround (iOS 26.1+)</Text>
      <View style={styles.backgroundContainer}>
        <Image
          style={styles.backgroundImage}
          source={{
            uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
          }}
        />
        <Animated.View style={fadeOpacityStyle}>
          <AnimatedGlassView animatedProps={glassViewProps} />
        </Animated.View>
      </View>

      <Pressable
        style={styles.toggleButton}
        onPress={() => {
          fadeOpacity.value = withTiming(fadeOpacity.value > 0.5 ? 0 : 1, { duration: 500 });
        }}>
        <Text style={styles.toggleButtonText}>Toggle glass visibility</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backgroundContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### `isLiquidGlassAvailable`

`isLiquidGlassAvailable` 函数让你检查已编译的应用中是否可用液态玻璃效果。它会验证系统和编译器版本，以及 [**Info.plist**](https://developer.apple.com/documentation/BundleResources/Information-Property-List/UIDesignRequiresCompatibility) 设置。

```tsx
import { Text } from 'react-native';
import { isLiquidGlassAvailable } from 'expo-glass-effect';

export default function CheckLiquidGlass() {
  return (
    <Text>
      {isLiquidGlassAvailable()
        ? 'Liquid Glass effect is available'
        : 'Liquid Glass effect is not available'}
    </Text>
  );
}
```

### `isGlassEffectAPIAvailable`

`isGlassEffectAPIAvailable` 函数检查设备在运行时是否可用液态玻璃 API。

:::warning
添加此 API 是因为某些 iOS 26 beta 版本没有可用的液态玻璃 API，这可能导致崩溃。在应用中使用 `GlassView` 之前应先检查此项，以确保兼容。更多信息见 [GitHub issue #40911](https://github.com/expo/expo/issues/40911)。
:::

```tsx
import { Text } from 'react-native';
import { isGlassEffectAPIAvailable } from 'expo-glass-effect';

export default function CheckGlassEffectAPI() {
  return (
    <Text>
      {isGlassEffectAPIAvailable()
        ? 'Glass Effect API is available'
        : 'Glass Effect API is not available'}
    </Text>
  );
}
```

## API

```js
import {
  GlassView,
  GlassContainer,
  isLiquidGlassAvailable,
  isGlassEffectAPIAvailable,
} from 'expo-glass-effect';
```
