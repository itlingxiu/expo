---
title: 使用图片选择器
description: 在本教程中，学习如何使用 Expo Image Picker。
---

# 使用图片选择器

React Native 提供内置组件作为标准构建块，例如 `<View>`、`<Text>` 和 `<Pressable>`。我们正在构建一个从设备媒体库中选择图片的功能。核心组件做不到这一点，我们需要一个库来把这个功能加到应用中。

我们将使用 Expo SDK 中的 [`expo-image-picker`](/versions/latest/sdk/imagepicker) 库。

> `expo-image-picker` 提供对系统 UI 的访问，以便从手机相册中选择图片和视频。

[观看视频：在通用 Expo 应用中使用图片选择器](https://www.youtube.com/watch?v=iEQZU58naS8) —— 学习如何使用 expo-image-picker 从设备媒体库中选择图片。

---

## 1. 安装 expo-image-picker

要安装 `expo-image-picker` 库，先在终端按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 停止开发服务器，然后运行以下命令：

:::tabs
:::tab npm
```sh
npx expo install expo-image-picker
```
:::
:::tab yarn
```sh
yarn expo install expo-image-picker
```
:::
:::tab pnpm
```sh
pnpm expo install expo-image-picker
```
:::
:::tab bun
```sh
bun expo install expo-image-picker
```
:::
:::

[`npx expo install`](/more/expo-cli#installation) 命令会安装该库，并把它添加到项目 **package.json** 的依赖中。

:::tip
每次在项目中安装新库时，先在终端按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 停止开发服务器，然后再运行安装命令。安装完成后，运行 `npx expo start` 重新启动开发服务器。
:::

## 2. 从设备媒体库中选择图片

`expo-image-picker` 提供 `launchImageLibraryAsync()` 方法，通过从设备媒体库中选择图片或视频来显示系统 UI。我们将使用上一章创建的主主题按钮，从设备媒体库中选择图片，并创建一个函数来启动设备的图片库，从而实现这个功能。

在 **src/app/(tabs)/index.tsx** 中导入 `expo-image-picker` 库，并在 `Index` 组件内创建 `pickImageAsync()` 函数：

```tsx src/app/(tabs)/index.tsx
// ... 其余 import 语句保持不变
// 导入 ImagePicker。
import * as ImagePicker from 'expo-image-picker';

export default function Index() {
  // 把图片选择器选项传给 launchImageLibraryAsync()。
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // 如果选中了图片，在终端窗口中打印它的信息。
      console.log(result);
    } else {
      // 如果用户没有选择图片，显示一条提示。
      alert('You did not select any image.');
    }
  };

  // ... 其余代码保持不变
}
```

来看看上面的代码做了什么：

- `launchImageLibraryAsync()` 接收一个对象来指定不同选项。这个对象就是 [`ImagePickerOptions`](/versions/latest/sdk/imagepicker#imagepickeroptions)，我们在调用该方法时传入它。
- 当 `allowsEditing` 设为 `true` 时，用户可以在 Android 和 iOS 的选择过程中裁剪图片。

## 3. 更新按钮组件

按下主按钮时，我们将在 `Button` 组件上调用 `pickImageAsync()` 函数。更新 **src/components/button.tsx** 中 `Button` 组件的 `onPress` prop：

```tsx src/components/button.tsx
import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  label: string;
  theme?: 'primary';
  // 定义 onPress prop 的类型。
  onPress?: () => void;
};

// 传入该 prop，以便从父组件触发处理函数。
export default function Button({ label, theme, onPress }: Props) {
  if (theme === 'primary') {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 },
        ]}>
        <Pressable style={[styles.button, { backgroundColor: '#fff' }]} onPress={onPress}>
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

在 **src/app/(tabs)/index.tsx** 中，把 `pickImageAsync()` 函数加到第一个 `<Button>` 的 `onPress` prop 上。

```tsx src/app/(tabs)/index.tsx
import { View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import Button from '@/components/button';
import ImageViewer from '@/components/image-viewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      alert('You did not select any image.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button
          // 添加这一行。
          theme="primary"
          label="Choose a photo"
          onPress={pickImageAsync}
        />
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

`pickImageAsync()` 函数调用 `ImagePicker.launchImageLibraryAsync()`，然后处理结果。`launchImageLibraryAsync()` 方法返回一个对象，其中包含所选图片的信息。

下面是 `result` 对象及其属性的一个例子：

:::tabs
:::tab Android
```json
{
  "assets": [
    {
      "assetId": null,
      "base64": null,
      "duration": null,
      "exif": null,
      "fileName": "ea574eaa-f332-44a7-85b7-99704c22b402.jpeg",
      "fileSize": 4513577,
      "height": 4570,
      "mimeType": "image/jpeg",
      "rotation": null,
      "type": "image",
      "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FStickerSmash-13f21121-fc9d-4ec6-bf89-bf7d6165eb69/ImagePicker/ea574eaa-f332-44a7-85b7-99704c22b402.jpeg",
      "width": 2854
    }
  ],
  "canceled": false
}
```
:::
:::tab iOS
```json
{
  "assets": [
    {
      "assetId": "99D53A1F-FEEF-40E1-8BB3-7DD55A43C8B7/L0/001",
      "base64": null,
      "duration": null,
      "exif": null,
      "fileName": "IMG_0004.JPG",
      "fileSize": 2548364,
      "height": 1669,
      "mimeType": "image/jpeg",
      "type": "image",
      "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FStickerSmash-13f21121-fc9d-4ec6-bf89-bf7d6165eb69/ImagePicker/ea574eaa-f332-44a7-85b7-99704c22b402.jpeg",
      "width": 1668
    }
  ],
  "canceled": false
}
```
:::
:::tab web
```json
{
  "assets": [
    {
      "fileName": "some-image.png",
      "height": 720,
      "mimeType": "image/png",
      "uri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABQAA"
    }
  ],
  "canceled": false
}
```
:::
:::

## 4. 使用选中的图片

`result` 对象提供 `assets` 数组，其中包含所选图片的 `uri`。我们从图片选择器取出这个值，并用它在应用中显示选中的图片。

修改 **src/app/(tabs)/index.tsx** 文件：

1. 用 React 的 [`useState`](https://react.dev/learn/state-a-components-memory#adding-a-state-variable) hook 声明一个名为 `selectedImage` 的状态变量。我们将用这个状态变量保存所选图片的 URI。
2. 更新 `pickImageAsync()` 函数，把图片 URI 保存到 `selectedImage` 状态变量中。
3. 把 `selectedImage` 作为 prop 传给 `ImageViewer` 组件。

```tsx src/app/(tabs)/index.tsx
import { View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// 从 react 导入 useState hook。
import { useState } from 'react';

import Button from '@/components/button';
import ImageViewer from '@/components/image-viewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  // 创建一个状态变量，用来保存所选图片的值。
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // 从 assets 数组中取出第一个 uri。一次只会选中一张图片，因此不必修改这里。
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer
          // 把所选图片的 URI 传给 ImageViewer 组件。
          imgSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
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

把 `selectedImage` prop 传给 `ImageViewer` 组件，以显示选中的图片，而不是占位图片。

1. 修改 **src/components/image-viewer.tsx** 文件，使其接受 `selectedImage` prop。
2. 图片来源会变长，因此也把它移到一个名为 `imageSource` 的单独变量中。
3. 把 `imageSource` 作为 `Image` 组件 `source` prop 的值传入。

```tsx src/components/image-viewer.tsx
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  imgSource: ImageSourcePropType;
  selectedImage?: string;
};

// 传入 selectedImage prop。
export default function ImageViewer({ imgSource, selectedImage }: Props) {
  // 如果所选图片不为空，显示来自设备的图片，否则显示占位图片。
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  // imgSource 已替换为 imageSource。
  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
```

在上面的片段中，Image 组件使用条件运算符来加载图片来源。选中的图片是一个 [`uri` 字符串](https://reactnative.dev/docs/images#network-images)，而不是像占位图片那样的本地资源。

现在看看我们的应用：

<video src="/static/videos/tutorial/03-image-picker-demo.mp4" controls></video>

> 本教程示例应用使用的图片选自 [Unsplash](https://unsplash.com)。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
