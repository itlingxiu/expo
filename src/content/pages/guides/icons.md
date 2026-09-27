---
title: 图标
description: 了解如何在 Expo 应用中使用各种类型的图标，包括图标字体、自定义图标字体、图标图片和图标按钮。
---

# 图标

应用中的图标可以来自 FontAwesome、Glyphicons、Ionicons 等图标字体，也可以使用 [The Noun Project](https://thenounproject.com/) 等来源的 PNG 图片。本指南介绍在 Expo 应用中使用图标的几种方式。

## @expo/vector-icons

:::warning 弃用警告
此库即将被弃用，不再推荐使用。请参阅 [expo.dev/blog/moving-away-from-expo-vector-icons](https://expo.dev/blog/moving-away-from-expo-vector-icons) 中的迁移指南。
:::

[`@expo/vector-icons`](https://github.com/expo/vector-icons) 构建于 [`react-native-vector-icons`](https://github.com/oblador/react-native-vector-icons) 之上，API 与之类似，并内置了最流行的图标集，可以在 [icons.expo.fyi](https://icons.expo.fyi) 中浏览。

```tsx
// Vector icons
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function App() {
  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={32} color="green" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

:::note
图标字体可以像[其他自定义字体](/develop/user-interface/fonts#use-a-local-font-file)一样预加载，因为字体对象是组件上的静态属性。以上面的示例为例，`Ionicons.font` 解析为 `{ionicons: require('path/to/ionicons.ttf')}`。
:::

## 自定义图标字体

如果需要更多控制，你可以创建自定义图标字体。首先导入字体，只有字体加载完成后才能创建图标集。请参阅[加载自定义字体](/develop/user-interface/fonts#handle-expovector-icons-initial-load)。以下三个辅助方法可用于创建自定义图标字体。

### createIconSet

基于 `glyphMap` 返回自定义字体，其中键是图标名称，值是 UTF-8 字符或其字符码。将 `glyphMap` 作为第一个参数传给 `createIconSet`，第二个参数是 `fontFamily` 名称（是字体名称而非文件名），第三个参数（可选）用于 Android，是自定义字体文件的名称。

```tsx
// Custom Icon Set
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createIconSet } from '@expo/vector-icons';

const glyphMap = { 'icon-name': 1234, test: '∆' };
const CustomIcon = createIconSet(glyphMap, 'fontFamily', 'custom-icon-font.ttf');

export default function CustomIconExample() {
  return (
    <View style={styles.container}>
      <CustomIcon name="icon-name" size={32} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### createIconSetFromIcoMoon

基于 [IcoMoon](https://icomoon.io/) 配置文件构建自定义字体。请确保将 `.ttf` 与 `selection.json` 文件导入到项目中，最好放在 `assets` 目录下，然后使用 `expo-font` 的 `useFonts` hook 或 `Font.loadAsync` 加载字体。

:::warning
新版 [IcoMoon 应用](https://icomoon.io/new-app)导出的 JSON 格式与[旧版应用](https://icomoon.io/app)不同，当前函数只支持旧版应用的输出。有一个 [Pull Request](https://github.com/expo/vector-icons/pull/356) 添加了对新格式的支持，待其随 `@expo/vector-icons` 发布后即可使用。
:::

```tsx
// Icomoon icons
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';

const Icon = createIconSetFromIcoMoon(
  require('./assets/icomoon/selection.json'),
  'IcoMoon',
  'icomoon.ttf'
);

export default function App() {
  const [fontsLoaded] = useFonts({
    IcoMoon: require('./assets/icomoon/icomoon.ttf'),
  });

  if (!fontsLoaded) {
    // 等待字体加载（关于启动画面（Splash Screen）的更多信息，请参阅 /develop/user-interface/fonts/#wait-for-fonts-to-load）
    return null;
  }

  return (
    <View style={styles.container}>
      <Icon name="pacman" size={50} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### createIconSetFromFontello

基于 [Fontello](https://fontello.com/) 配置文件构建自定义字体。请确保将 `.ttf` 与 `config.json` 文件导入到项目中，最好放在 `assets` 目录下，然后使用 `expo-font` 的 `useFonts` hook 或 `Font.loadAsync` 加载字体。配置方式与 IcoMoon 完全相同。

```tsx
// Fontello icons
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { createIconSetFromFontello } from '@expo/vector-icons';
import fontelloConfig from './assets/fontello/config.json';

// 假设字体名称是 "fontello"、字体文件是 "fontello.ttf"（Fontello 工具的默认设置）。
// 注意：这里传的是 "fontello.ttf"，而不是文件路径。
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello', 'fontello.ttf');

export default function App() {
  const [fontsLoaded] = useFonts({
    fontello: require('./assets/fontello/fontello.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Icon name="folder" size={50} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## 按钮组件

可以使用 `Font.Button` 语法创建图标按钮，其中 `Font` 是导入的图标集。

```tsx
// Icon button component
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function App() {
  const loginWithFacebook = () => {
    console.log('Button pressed');
  };

  return (
    <View style={styles.container}>
      <FontAwesome.Button name="facebook" backgroundColor="#3b5998" onPress={loginWithFacebook}>
        Login with Facebook
      </FontAwesome.Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### 属性

`Font.Button` 接受任何 [`Text`](https://reactnative.dev/docs/text)、[`TouchableHighlight`](https://reactnative.dev/docs/touchablehighlight) 或 [`TouchableWithoutFeedback`](https://reactnative.dev/docs/touchablewithoutfeedback) 属性，以及以下属性：

| 属性 | 描述 | 默认值 |
| --- | --- | --- |
| `color` | 文本和图标的颜色，如果需要不同颜色请使用 `iconStyle` 或嵌套 `Text` 组件 | `white` |
| `size` | 图标大小 | `20` |
| `iconStyle` | 仅应用于图标的样式，适合设置边距或不同的颜色。注意：边距请使用 `iconStyle`，否则可能出现不稳定的表现 | `{marginRight: 10}` |
| `backgroundColor` | 按钮背景颜色 | `#007AFF` |
| `borderRadius` | 按钮圆角半径，设为 `0` 可禁用 | `5` |
| `onPress` | 按下按钮时调用的函数 | 无 |
