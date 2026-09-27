---
title: 截图
description: 在本教程中，学习如何使用第三方库和 Expo Media Library 截取屏幕并保存。
---

# 截图

在本章中，我们将学习如何使用第三方库截图，并把它保存到设备的媒体库。我们将使用 [`react-native-view-shot`](https://github.com/gre/react-native-view-shot) 截图，并使用 [`expo-media-library`](/versions/v57.0.0/sdk/media-library) 把图片保存到设备的媒体库。

:::note
到目前为止，我们已经使用了第三方库，例如 `react-native-gesture-handler`、`react-native-reanimated`。根据使用场景，可以在 [React Native Directory](https://reactnative.directory/) 上找到数百个其他第三方库。
:::

[观看视频：在通用 Expo 应用中截图](https://www.youtube.com/watch?v=Jft3_Yfr-p4) —— 用 react-native-view-shot 截图，并用 expo-media-library 把它保存到设备的媒体库。

---

## 1. 安装库

要安装 `react-native-view-shot` 和 `expo-media-library`，运行以下命令：

:::tabs
:::tab npm
```sh
npx expo install react-native-view-shot expo-media-library
```
:::
:::tab yarn
```sh
yarn expo install react-native-view-shot expo-media-library
```
:::
:::tab pnpm
```sh
pnpm expo install react-native-view-shot expo-media-library
```
:::
:::tab bun
```sh
bun expo install react-native-view-shot expo-media-library
```
:::
:::

## 2. 请求权限

需要敏感信息的应用（例如访问设备媒体库）必须请求权限，以便允许或拒绝访问。使用 `expo-image-picker` 的 `useMediaLibraryPermissions()` hook，我们可以用权限 `permissionResponse` 和 `requestPermission()` 方法来请求访问。这个 hook 同时请求读取和写入权限，既覆盖从媒体库选择图片，也覆盖把截图保存到媒体库。

应用第一次加载、权限状态既未授予也未拒绝时，`permissionResponse` 的值是 `null`。被询问权限时，用户可以授予或拒绝。我们可以添加一个条件，检查是否尚未授予。如果尚未授予，就触发 `requestPermission()` 方法。获得访问后，`permissionResponse` 的值会变为 `granted`。

把以下代码片段添加到 **src/app/(tabs)/index.tsx**：

```tsx src/app/(tabs)/index.tsx
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

// ... 其余代码保持不变

export default function Index() {
  // 添加这条语句，从 hook 导入权限响应和 requestPermission() 方法。
  const [permissionResponse, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  // ... 其余代码保持不变

  // 添加 if 语句检查权限状态。requestPermission() 方法会弹出对话框，让用户授予或拒绝权限。
  useEffect(() => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
  }, []);

  // ... 其余代码保持不变
}
```

## 3. 创建 ref 以保存当前视图

我们将使用 `react-native-view-shot`，让用户在应用内截图。这个库用 `captureRef()` 方法把 `<View>` 的截图捕获为图片。它返回所捕获截图图片文件的 URI。

1. 从 `react-native-view-shot` 导入 `captureRef`，并从 React 导入 `useRef`。
2. 创建一个 `imageRef` 引用变量，用来保存所捕获截图图片的引用。
3. 用一个 `<View>` 包裹 `<ImageViewer>` 和 `<EmojiSticker>` 组件，然后把引用变量传给它。

```tsx src/app/(tabs)/index.tsx
import { useState, useRef } from 'react';
// 从 react 导入 useRef hook。
// 从 react-native-view-shot 导入 captureRef。
import { captureRef } from 'react-native-view-shot';

export default function Index() {
  // 创建 imageRef 变量。
  const imageRef = useRef<View>(null);

  // ... 其余代码保持不变

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View
          // 添加一个 View 组件，把 ImageViewer 和 EmojiSticker 包裹在里面。
          ref={imageRef}
          collapsable={false}
        >
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </View>
      </View>
      {null /* ...其余代码保持不变 */}
    </GestureHandlerRootView>
  );
}
```

在上面的片段中，`collapsable` prop 设为 `false`。这样 `<View>` 组件只会截取背景图片和表情贴纸。

## 4. 截图并保存

我们可以在 `onSaveImageAsync()` 函数中调用 `react-native-view-shot` 的 `captureRef()` 方法来截取视图。它接受一个可选参数，我们可以在其中传入截图区域的 `width` 和 `height`。可用选项的更多内容见[该库的文档](https://github.com/gre/react-native-view-shot#capturerefview-options-lower-level-imperative-api)。

`captureRef()` 方法还会返回一个 promise，它以截图的 URI 兑现。我们将把这个 URI 作为参数传给 [`MediaLibrary.saveToLibraryAsync()`](/versions/v57.0.0/sdk/media-library#medialibrarysavetolibraryasynclocaluri)，并把截图保存到设备的媒体库。

在 **src/app/(tabs)/index.tsx** 中，用以下代码更新 `onSaveImageAsync()` 函数：

```tsx src/app/(tabs)/index.tsx
import * as ImagePicker from 'expo-image-picker';
// 从 expo-media-library 导入 MediaLibrary。
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';

import Button from '@/components/button';
import CircleButton from '@/components/circle-button';
import EmojiList from '@/components/emoji-list';
import EmojiPicker from '@/components/emoji-picker';
import IconButton from '@/components/icon-button';
import ImageViewer from '@/components/image-viewer';

import EmojiSticker from '@/components/emoji-sticker';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | undefined>(undefined);
  const [permissionResponse, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const imageRef = useRef<View>(null);

  useEffect(() => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
  }, []);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  // 用截图并保存图片的代码替换注释。
  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert('Saved!');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </GestureHandlerRootView>
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
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
```

现在在应用中选择一张照片并添加贴纸。然后点击 “Save” 按钮。在 Android 和 iOS 上应该看到以下结果：

<video src="/static/videos/tutorial/saving-screenshot.mp4" controls></video>

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
