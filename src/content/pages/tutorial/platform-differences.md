---
title: 处理平台差异
description: 在本教程中，学习如何在创建通用应用时处理原生平台与 Web 之间的差异。
---

# 处理平台差异

Android、iOS 和 Web 的能力各不相同。在我们的例子中，Android 和 iOS 都可以用 `react-native-view-shot` 库截图。但 Web 浏览器不行。

在本章中，我们将学习如何为 Web 浏览器处理截图，使应用在所有平台上都有相同的功能。

[观看视频：在通用 Expo 应用中处理平台差异](https://www.youtube.com/watch?v=mEKQvF4irBM) —— 用 dom-to-image 实现平台特定的截图，从而处理 Android、iOS 和 Web 之间的差异。

---

## 1. 安装并导入 dom-to-image

要在 Web 上截图并保存为图片，我们将使用一个名为 [`dom-to-image`](https://github.com/tsayen/dom-to-image#readme) 的第三方库。它会对任意 DOM 节点截图，并把它转成矢量（SVG）或栅格（PNG 或 JPEG）图片。

停止开发服务器，并运行以下命令安装该库：

:::tabs
:::tab npm
```sh
npm install dom-to-image
```
:::
:::tab yarn
```sh
yarn add dom-to-image
```
:::
:::tab pnpm
```sh
pnpm add dom-to-image
```
:::
:::tab bun
```sh
bun add dom-to-image
```
:::
:::

:::note
这里使用 `dom-to-image` 库是为了说明用途。对于生产应用，你可能希望探索更适合具体场景的其他方案或 API。
:::

安装之后，请重启开发服务器，并在终端按 <kbd>W</kbd>。

## 2. 添加平台特定代码

使用 React Native 的 `Platform` 模块，我们可以实现平台特定的行为。在 **src/app/(tabs)/index.tsx** 中：

1. 从 `react-native` 导入 `Platform` 模块。
2. 从 `dom-to-image` 导入 `domtoimage` 库。
3. 更新 `onSaveImageAsync()` 函数，用 `Platform.OS` 属性检查当前平台是否为 `'web'`。如果是 `'web'`，我们将用 `domtoimage.toJpeg()` 方法把当前 `<View>` 转换并截取为 JPEG 图片。否则，继续使用为原生平台添加的同一套逻辑。

```tsx src/app/(tabs)/index.tsx
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import { ImageSourcePropType, View, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
// 导入 domtoimage 库。
import domtoimage from 'dom-to-image';

import Button from '@/components/button';
import ImageViewer from '@/components/image-viewer';
import IconButton from '@/components/icon-button';
import CircleButton from '@/components/circle-button';
import EmojiPicker from '@/components/emoji-picker';
import EmojiList from '@/components/emoji-list';
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

  const onSaveImageAsync = async () => {
    // 在这里添加 if 条件，检查当前平台是否为 web。
    if (Platform.OS !== 'web') {
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
      // 添加 else 条件，在当前平台为 web 时运行这段逻辑。
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
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

<details>
<summary>修复 <code>dom-to-image</code> 的 TypeScript 模块错误</summary>

由于我们使用 TypeScript，导入 `domtoimage` 库之后需要添加类型定义。可以在项目目录根目录创建一个 **types.d.ts** 文件，并添加声明语句：

```tsx types.d.ts
declare module 'dom-to-image';
```

</details>

在 Web 浏览器中运行应用后，现在可以保存截图：

<video src="/static/videos/tutorial/web.mp4" controls></video>

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
