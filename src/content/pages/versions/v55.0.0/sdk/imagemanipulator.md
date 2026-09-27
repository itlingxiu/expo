---
title: ImageManipulator 包参考
description: 一个提供本地文件系统图像处理 API 的库。
---

# ImageManipulator 包参考

> 本页面对应 Expo SDK v55。
> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-image-manipulator` 提供了一组 API，用于修改存储在本地文件系统中的图像。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-image-manipulator
```
:::
:::tab yarn
```sh
yarn expo install expo-image-manipulator
```
:::
:::tab pnpm
```sh
pnpm expo install expo-image-manipulator
```
:::
:::tab bun
```sh
bun expo install expo-image-manipulator
```
:::
:::

## 用法

下面的示例先将图像顺时针旋转 90 度，再将旋转后的图像垂直翻转，最后保存为 PNG。

```jsx
import { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { Asset } from 'expo-asset';
import { FlipType, SaveFormat, useImageManipulator } from 'expo-image-manipulator';

const IMAGE = Asset.fromModule(require('./assets/snack-icon.png'));

export default function App() {
  const [imageUri, setImageUri] = useState(IMAGE.uri);
  const [isReady, setIsReady] = useState(false);
  const context = useImageManipulator(imageUri);

  const loadImageAsync = async () => {
    await IMAGE.downloadAsync();
    setImageUri(IMAGE.localUri ?? IMAGE.uri);
    setIsReady(true);
  };

  useEffect(() => {
    loadImageAsync();
  }, []);

  const rotate90andFlip = async () => {
    context.rotate(90).flip(FlipType.Vertical);
    const renderedImage = await context.renderAsync();
    const result = await renderedImage.saveAsync({
      format: SaveFormat.PNG,
    });

    setImageUri(result.uri);
  };

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Text>Loading image...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>
      <Button title="Rotate and Flip" onPress={rotate90andFlip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});
```

## API

```js
import * as ImageManipulator from 'expo-image-manipulator';
```
