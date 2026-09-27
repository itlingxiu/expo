---
title: 动画
description: 了解如何在 Expo 项目中集成并使用 React Native 动画。
---

# 动画

动画能改善用户体验。Expo 项目可以使用 React Native 的 [Animated API](https://reactnative.dev/docs/next/animations)，但对于更高级、性能更好的动画，推荐使用 [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) 库 —— 它提供的 API 让创建"流畅、强大且可维护的动画"更简单。

## 安装

如果项目由[默认模板](/get-started/create-a-project)创建，`react-native-reanimated` 已安装，可以跳过此步骤。否则安装：

```sh
# npm
npx expo install react-native-reanimated

# yarn
yarn expo install react-native-reanimated

# pnpm
pnpm expo install react-native-reanimated

# bun
bun expo install react-native-reanimated
```

## 用法

### 最小示例

一个使用 reanimated 的简单动画演示。更深入的 API 细节参见 [`react-native-reanimated` 文档](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation)。

```tsx Using react-native-reanimated
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { View, Button, StyleSheet } from 'react-native';

export default function AnimatedStyleUpdateExample() {
  const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, style]} />
      <Button
        title="toggle"
        onPress={() => {
          randomWidth.value = Math.random() * 350;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 80,
    backgroundColor: 'black',
    margin: 30,
  },
});
```

## 其他动画库

也可以使用 [Moti](https://moti.fyi/) 等替代方案；它支持 Android、iOS 与 Web。
