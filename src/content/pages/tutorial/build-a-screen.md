---
title: 构建界面
description: 在本章中，学习如何使用 Pressable 和 Expo Image 等组件构建一个界面。
---

# 构建界面

本章将创建 StickerSmash 应用的第一个界面。

界面显示一张图片和两个按钮。用户可以用任一按钮选择图片 —— 一个从设备中选择，另一个继续使用应用的默认图片。选择图片后就可以添加贴纸，所以我们从创建这个界面开始。

[观看视频：在通用 Expo 应用中构建界面](https://www.youtube.com/watch?v=3rcOP8xDwTQ) —— 使用 Pressable、Expo Image 等核心组件构建 StickerSmash 的第一个界面，实现图片选择器的布局。

## 拆解界面

动手编码前，先把界面拆解成基本元素：

- 一张居中显示的大图片
- 下半部分有两个按钮

第一个按钮由多个部分组成：外层元素提供黄色边框，内部包含图标和文字，按行排列。

把 UI 拆成小块之后，就可以开始编码了。

## 显示图片

使用 `expo-image` 库 —— 它提供跨平台的 `<Image>` 组件来加载和渲染图片，默认模板已包含该库。

`Image` 组件接受图片来源：可以是[静态资源](https://reactnative.dev/docs/images#static-image-resources)，也可以是 URL。来自 `assets/images` 的来源是静态资源；也可以通过 `uri` 属性使用[网络图片](https://reactnative.dev/docs/images#network-images)。

修改 **src/app/(tabs)/index.tsx**：

1. 从 `expo-image` 导入 `Image`。
2. 创建一个 `PlaceholderImage` 变量指向 **assets/images/background-image.png**，作为 `Image` 的 `source` prop。

```tsx src/app/(tabs)/index.tsx
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={PlaceholderImage} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
```

## 把组件拆分到独立文件

随着组件增多，需要把代码拆分到多个文件；我们会创建一个 components 目录存放自定义组件。

步骤：

1. 在 **src** 中创建 **components** 目录，然后创建 **image-viewer.tsx**。
2. 把图片展示相关的代码移过去，包括 `image` 样式。

```tsx src/components/image-viewer.tsx
import { StyleSheet, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  imgSource: ImageSourcePropType;
};

export default function ImageViewer({ imgSource }: Props) {
  return <Image source={imgSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
```

:::note
ImageViewer 是自定义组件，所以放在自己的目录里而不是 **src/app**；**src/app** 下的文件是布局文件或路由文件。详见[非导航组件放在 src/app 目录之外](/router/basics/core-concepts#6-non-navigation-components-live-outside-the-srcapp-directory)。
:::

然后在 **src/app/(tabs)/index.tsx** 中导入 `ImageViewer`：

```tsx src/app/(tabs)/index.tsx
import { View, StyleSheet } from 'react-native';
import ImageViewer from '@/components/image-viewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
});
```

### import 语句中的 @ 是什么？

`@` 是自定义[路径别名](/guides/typescript#path-aliases-optional)，用于导入自定义组件和其他模块，代替相对路径；Expo CLI 会自动在 **tsconfig.json** 中配置。

## 使用 Pressable 创建按钮

React Native 提供多种处理触摸的组件，推荐使用 [`<Pressable>`](https://reactnative.dev/docs/pressable) —— 它足够灵活，支持单击、长按，以及独立的按下/松开事件。

设计稿需要两个样式和文字不同的按钮；先做一个可复用的组件。在 **src/components** 中创建 **button.tsx**。

```tsx src/components/button.tsx
import { StyleSheet, View, Pressable, Text } from 'react-native';

type Props = {
  label: string;
};

export default function Button({ label }: Props) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={() => alert('You pressed a button.')}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
```

因为 `<Pressable>` 在 `onPress` 中调用了 `alert()`，点击任一按钮都会弹出提示框。

接着把组件导入 **src/app/(tabs)/index.tsx**，并为包裹的 `<View>` 添加样式。

```tsx src/app/(tabs)/index.tsx
import { View, StyleSheet } from 'react-native';
import Button from '@/components/button';
import ImageViewer from '@/components/image-viewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button label="Choose a photo" />
        <Button label="Use this photo" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
```

在 Android、iOS 和 Web 上查看效果。第二个按钮（"Use this photo"）已经接近设计稿，但第一个还需要进一步修饰。

## 增强可复用的按钮组件

由于 "Choose a photo" 需要不同的样式，我们为按钮组件添加一个 `theme` prop 来应用 `primary` 主题。这个按钮还在文字前加了一个图标，使用 `@expo/vector-icons` 库。

从该库导入 `FontAwesome` 来加载和显示图标；修改 **src/components/button.tsx**。

```tsx src/components/button.tsx
import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  label: string;
  theme?: 'primary';
};

export default function Button({ label, theme }: Props) {
  if (theme === 'primary') {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 },
        ]}>
        <Pressable
          style={[styles.button, { backgroundColor: '#fff' }]}
          onPress={() => alert('You pressed a button.')}>
          <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={() => alert('You pressed a button.')}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
```

说明：

- primary 主题的按钮使用内联样式（inline style）—— 直接传给 `style` prop 的对象会覆盖 `StyleSheet.create()` 中的定义。
- primary 的 `<Pressable>` 用 `backgroundColor: '#fff'` 获得白色背景；把它放进 `styles.button` 会同时影响 primary 和无主题两个版本。
- 内联样式使用 JavaScript，针对特定值覆盖默认样式。

然后修改 **src/app/(tabs)/index.tsx**，为第一个按钮加上 `theme="primary"`：

```tsx src/app/(tabs)/index.tsx
import { View, StyleSheet } from 'react-native';
import Button from '@/components/button';
import ImageViewer from '@/components/image-viewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" />
        <Button label="Use this photo" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
```

在 Android、iOS 和 Web 上查看效果。

## 本章小结

第三章：构建界面。

应用第一个界面的初始设计已经实现。下一章将添加从设备媒体库中选择图片的能力。

[下一章：第四章 使用图片选择器](/tutorial/image-picker)
