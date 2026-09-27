---
title: VideoThumbnails
description: A library that allows you to generate an image to serve as a thumbnail from a video file.
---

# VideoThumbnails

> 支持平台：Android、iOS、tvOS、Expo Go。

> **warning** **[Deprecated](/more/release-statuses#deprecated):** Video Thumbnails library has been deprecated in favor of [`generateThumbnailsAsync`](video#generatethumbnailsasynctimes-options) from [`expo-video`](video). `expo-video-thumbnails` is not receiving patches and will be removed in SDK 56.

`expo-video-thumbnails` allows you to generate an image to serve as a thumbnail from a video file.

## Installation

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

## Usage

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
