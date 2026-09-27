---
title: 键盘处理
description: 在 Android 或 iOS 设备上处理常见键盘交互的指南。
---

# 键盘处理

键盘处理会影响 Expo 应用的用户体验。React Native 提供 [`Keyboard`](https://reactnative.dev/docs/keyboard) 和 [`KeyboardAvoidingView`](https://reactnative.dev/docs/keyboardavoidingview)，它们常用于处理键盘事件。对于更复杂或自定义的键盘交互，可以考虑使用 [`react-native-keyboard-controller`](https://kirillzyusko.github.io/react-native-keyboard-controller)，该库提供高级键盘处理能力。

本指南涵盖常见的键盘交互，以及如何有效管理它们。

- [React Native 应用的键盘处理教程](https://www.youtube.com/watch?v=Y51mDfAhd4E) —— 在这份 React Native 应用的键盘处理教程中，你将学习如何解决尝试在应用中输入时键盘挡住输入框的问题。

## 键盘处理基础

以下各节说明如何用常见 API 处理键盘交互。

### 避开键盘的视图

`KeyboardAvoidingView` 是一个组件，它根据键盘高度自动调整视图的高度、位置或底部内边距，以便键盘显示时视图仍然可见。

Android 和 iOS 与 `behavior` 属性的交互方式不同。在 iOS 上，`padding` 通常效果最好；在 Android 上，只要有 `KeyboardAvoidingView` 就能避免挡住输入。因此下面的示例在 Android 上使用 `undefined`。尝试不同的 `behavior` 是好习惯，因为别的选项可能更适合你的应用。

```tsx home-screen.tsx
import { KeyboardAvoidingView, TextInput } from 'react-native';

export default function HomeScreen() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <TextInput placeholder="Type here..." />
    </KeyboardAvoidingView>;
  );
}
```

在上面的示例中，`KeyboardAvoidingView` 的高度会根据设备键盘高度自动调整，从而确保输入始终可见。

在 Android 上使用底部标签导航器时，你可能会注意到聚焦输入框会导致底部标签被推到键盘上方。要解决此问题，在[应用配置](/workflow/configuration)的 Android 配置中添加 `softwareKeyboardLayoutMode` 属性，并把它设为 `pan`。

```json app.json
"expo" {
  "android": {
    "softwareKeyboardLayoutMode": "pan"
  }
}
```

添加此属性后，重启开发服务器并重新加载应用以使更改生效。

也可以在键盘打开时用 [`tabBarHideOnKeyboard`](https://reactnavigation.org/docs/bottom-tab-navigator/#tabbarhideonkeyboard) 隐藏底部标签。它是底部标签导航器的一个选项。如果设为 `true`，键盘打开时会隐藏标签栏。

```tsx src/app/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen name="index" />
    </Tabs>
  );
}
```

### 键盘事件

React Native 的 `Keyboard` 模块允许你监听原生事件、对它们做出反应，并对键盘做出更改，例如关闭它。

要监听键盘事件，使用 `Keyboard.addListener` 方法。该方法接受事件名和回调函数作为参数。键盘显示或隐藏时，会用事件数据调用回调函数。

下面的示例说明添加键盘监听器的一个用例。状态变量 `isKeyboardVisible` 在键盘每次显示或隐藏时切换。基于这个变量，只有在键盘处于活动状态时，按钮才允许用户关闭键盘。另外请注意，按钮使用 `Keyboard.dismiss` 方法。

```tsx home-screen.tsx
import { useEffect, useState } from 'react';
import { Keyboard, View, Button, TextInput } from 'react-native';

export default function HomeScreen() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleKeyboardShow = event => {
    setIsKeyboardVisible(true);
  };

  const handleKeyboardHide = event => {
    setIsKeyboardVisible(false);
  };

  return (
    <View>
      {isKeyboardVisible && <Button title="Dismiss keyboard" onPress={Keyboard.dismiss} />}
      <TextInput placeholder="Type here..." />
    </View>
  );
}
```

## 用 Keyboard Controller 进行高级键盘处理

对于更复杂的键盘交互，例如带有多个文本输入字段的较大可滚动表单，考虑使用 [`react-native-keyboard-controller`（Keyboard Controller）](https://kirillzyusko.github.io/react-native-keyboard-controller) 库。它提供超出 React Native 内置键盘 API 的额外功能，以最少的配置在 Android 和 iOS 之间保持一致，并提供用户期望的原生手感。

### 前置条件

- **开发构建** —— Keyboard Controller 库不包含在 Expo Go 中。更多信息见[创建开发构建](/develop/development-builds/introduction#how-would-you-like-to-build-your-development-build)。
- **已安装 `react-native-reanimated`** —— Keyboard Controller 需要 `react-native-reanimated` 才能正确工作。遵循[安装说明](/versions/latest/sdk/reanimated#installation)。

### 安装

先在 Expo 项目中安装 Keyboard Controller 库：

```sh
npx expo install react-native-keyboard-controller
```

### 设置 Provider

要完成设置，把 `KeyboardProvider` 添加到应用中。

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <Stack>
        <Stack.Screen name="home" />
        <Stack.Screen name="chat" />
      </Stack>
    </KeyboardProvider>
  );
}
```

### 处理多个输入

[`KeyboardAvoidingView`](#避开键盘的视图) 组件非常适合原型，但它需要特定平台的配置，并且不太可定制。

作为更强大的替代，可以使用 [`KeyboardAwareScrollView`](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view) 组件。它会自动滚动到聚焦的 `TextInput`，并提供接近原生的性能。对于只有少数元素的简单屏幕，使用 `KeyboardAwareScrollView` 是很好的方法。

对于有多个输入的屏幕，Keyboard Controller 库还提供 `KeyboardToolbar` 组件，可与 `KeyboardAwareScrollView` 一起使用。这两个组件一起处理输入导航，并在无需自定义配置的情况下防止键盘挡住屏幕：

```tsx form-screen.tsx
import { TextInput, View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';

export default function FormScreen() {
  return (
    <>
      <KeyboardAwareScrollView bottomOffset={62} contentContainerStyle={styles.container}>
        <View>
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
        </View>
        <TextInput placeholder="Type a message..." style={styles.textInput} />
        <View>
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
          <TextInput placeholder="Type a message..." style={styles.textInput} />
        </View>
        <TextInput placeholder="Type a message..." style={styles.textInput} />
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  listStyle: {
    padding: 16,
    gap: 16,
  },
  textInput: {
    width: 'auto',
    flexGrow: 1,
    flexShrink: 1,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d8d8d8',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 8,
  },
});
```

上面的示例用 `KeyboardAwareScrollView` 包裹输入，以防止键盘挡住它们。`KeyboardToolbar` 组件显示导航控件和关闭按钮。它无需配置即可工作，需要时也可以自定义工具栏内容。

### 让视图与键盘高度同步动画

对于更高级、更可定制的方法，可以使用 [`useKeyboardHandler`](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-handler)。它提供对键盘生命周期事件的访问。它让我们能够确定键盘何时开始动画，以及动画每一帧中的位置。

使用 `useKeyboardHandler` hook，可以创建一个自定义 hook，以访问每一帧的键盘高度。它使用 reanimated 的 `useSharedValue` 返回高度，如下所示。

```tsx chat-screen.tsx
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const useGradualAnimation = () => {
  const height = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: event => {
        'worklet';
        height.value = Math.max(event.height, 0);
      },
    },
    []
  );
  return { height };
};
```

你可以使用 `useGradualAnimation` hook 为视图制作动画，在键盘活动或关闭时给出平滑动画，例如在聊天屏幕组件中（如下面的示例所示）。该组件从 hook 获取键盘高度。然后用 reanimated 的 `useAnimatedStyle` hook 创建一个名为 `fakeView` 的动画样式。该样式只包含一个属性：`height`，设为键盘高度。

`fakeView` 动画样式用在 `TextInput` 之后的动画视图上。这个视图的高度会根据每一帧的键盘高度动画变化，从而用平滑动画把内容推到键盘上方。键盘关闭时，它也会把高度减到零。

```tsx chat-screen.tsx
import { StyleSheet, Platform, FlatList, View, StatusBar, TextInput } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useKeyboardHandler } from 'react-native-keyboard-controller';

import MessageItem from '@/components/MessageItem';
import { messages } from '@/messages';

const useGradualAnimation = () => {
  /* @hide 代码与上一示例相同 */
  /* @end */
};

export default function ChatScreen() {
  const { height } = useGradualAnimation();

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.abs(height.value),
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageItem message={item} />}
        keyExtractor={item => item.createdAt.toString()}
        contentContainerStyle={styles.listStyle}
      />
      <TextInput placeholder="Type a message..." style={styles.textInput} />
      <Animated.View style={fakeView} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  listStyle: {
    padding: 16,
    gap: 16,
  },
  textInput: {
    width: '95%',
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d8d8d8',
    backgroundColor: '#fff',
    padding: 8,
    alignSelf: 'center',
    marginBottom: 8,
  },
});
```

## 更多资源

- [示例](https://github.com/betomoedano/keyboard-guide) —— 在 GitHub 上查看示例项目的源代码。
- [`react-native-keyboard-controller`](https://kirillzyusko.github.io/react-native-keyboard-controller) —— 有关 Keyboard Controller 库的更多细节，参见其文档。
