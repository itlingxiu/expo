---
title: LivePhoto
description: A library that allows displaying Live Photos on iOS.
packageName: expo-live-photo
---

# LivePhoto

> 支持平台：iOS、Expo Go。

## Installation

:::tabs
:::tab npm
```sh
npx expo install expo-live-photo
```
:::
:::tab yarn
```sh
yarn expo install expo-live-photo
```
:::
:::tab pnpm
```sh
pnpm expo install expo-live-photo
```
:::
:::tab bun
```sh
bun expo install expo-live-photo
```
:::
:::

## Usage

Here's a simple example of `expo-live-photo` usage combined with `expo-image-picker`.

```tsx
import * as ImagePicker from 'expo-image-picker';
import { LivePhotoAsset, LivePhotoView, LivePhotoViewType } from 'expo-live-photo';
import { useRef, useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

export default function LivePhotoScreen() {
  const viewRef = useRef<LivePhotoViewType>(null);
  const [livePhoto, setLivePhoto] = useState<LivePhotoAsset | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['livePhotos'],
    });

    if (!result.canceled && result.assets[0].pairedVideoAsset?.uri) {
      setLivePhoto({
        photoUri: result.assets[0].uri,
        pairedVideoUri: result.assets[0].pairedVideoAsset.uri,
      });
    } else {
      console.error('Failed to pick a live photo');
    }
  };

  if (!LivePhotoView.isAvailable()) {
    return (
      <View style={styles.container}>
        <Text>expo-live-photo is not available on this platform 😕</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LivePhotoView
        ref={viewRef}
        source={livePhoto}
        style={[styles.livePhotoView, { display: livePhoto ? 'flex' : 'none' }]}
        onLoadComplete={() => {
          console.log('Live photo loaded successfully!');
        }}
        onLoadError={error => {
          console.error('Failed to load the live photo: ', error.message);
        }}
      />
      <View style={livePhoto ? styles.pickImageCollapsed : styles.pickImageExpanded}>
        <Button title={livePhoto ? 'Change image' : 'Pick an image'} onPress={pickImage} />
      </View>
      <Button title="Start playback hint" onPress={() => viewRef.current?.startPlayback('hint')} />
      <Button title="Start playback" onPress={() => viewRef.current?.startPlayback('full')} />
      <Button title="Stop playback" onPress={() => viewRef.current?.stopPlayback()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  livePhotoView: {
    alignSelf: 'stretch',
    height: 300,
  },
  pickImageExpanded: {
    alignSelf: 'stretch',
    height: 300,
    justifyContent: 'center',
  },
  pickImageCollapsed: {
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
  },
});
```

## API

```js
import { LivePhotoView } from 'expo-live-photo';
```

