---
title: VideoThumbnails 包参考
description: 可从视频文件生成缩略图的库。
---

# VideoThumbnails 包参考

> 支持平台：Android、iOS、tvOS、Expo Go。

:::danger
**[已弃用](/more/release-statuses#deprecated)：** Video Thumbnails 库已弃用，请改用 [`expo-video`](/versions/latest/sdk/video) 的 [`generateThumbnailsAsync`](/versions/latest/sdk/video#generatethumbnailsasynctimes-options)。`expo-video-thumbnails` 不再接收补丁，并将在 SDK 56 中移除。
:::

`expo-video-thumbnails` 可从视频文件生成一张用作缩略图的图片。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-video-thumbnails
```
:::
:::tab yarn
```sh
yarn expo install expo-video-thumbnails
```
:::
:::tab pnpm
```sh
pnpm expo install expo-video-thumbnails
```
:::
:::tab bun
```sh
bun expo install expo-video-thumbnails
```
:::
:::

## 用法

```jsx
import { useState } from 'react';
import { StyleSheet, Button, View, Image, Text } from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';

export default function App() {
  const [image, setImage] = useState(null);

  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        {
          time: 15000,
        }
      );
      setImage(uri);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={styles.container}>
      <Button onPress={generateThumbnail} title="Generate thumbnail" />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Text>{image}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    width: 200,
    height: 200,
  },
});
```

## API

```js
import * as VideoThumbnails from 'expo-video-thumbnails';
```
