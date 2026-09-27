---
title: 创建模态框
description: 在本章中，学习如何创建一个用于选择表情的 React Native 模态框。
---

# 创建模态框

React Native 的 [`<Modal>` 组件](https://reactnative.dev/docs/modal)用于在应用内容之上展示内容；模态框用来吸引注意力或引导用户操作。在[第三章](/tutorial/build-a-screen#enhance-the-reusable-button-component)中，我们用 `alert()` 展示了占位文本，作为覆盖层（overlay）行为的一个例子。本章将创建一个显示表情选择列表的模态框。

[观看视频：在通用 Expo 应用中创建模态框](https://www.youtube.com/watch?v=HRAMzrBwVeo) —— 使用 React Native 的 Modal API 构建模态框，展示表情选择器并处理交互。

## 声明状态变量以显示按钮

计划添加三个按钮，在用户选择图片或使用占位图后显示；其中一个打开表情选择器模态框。

修改 **src/app/(tabs)/index.tsx**：声明布尔状态 `showAppOptions`（默认 `false`，选择图片后设为 `true`）；更新 `pickImageAsync()` 把状态设为 `true`；更新无主题按钮的 `onPress`。

在 **src/components/button.tsx** 中：移除 `alert`，让按钮通过 `onPress` prop 接收点击处理函数。

```tsx src/components/button.tsx
type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
};
```

```tsx src/components/button.tsx
<Pressable style={styles.button} onPress={onPress}>
```

```tsx src/app/(tabs)/index.tsx
import { View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import Button from '@/components/button';
import ImageViewer from '@/components/image-viewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);

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

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
      </View>
      {showAppOptions ? (
        <View />
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
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

按钮的渲染由 `showAppOptions` 驱动，按钮被移入三元表达式；为 `true` 时先渲染一个空的 `<View>`，下一步再处理。

## 添加按钮

布局：外层 `<View>` 中三个按钮排成一行；中间的「+」按钮打开模态框，样式与其他两个不同。

创建 **src/components/circle-button.tsx**：

```tsx src/components/circle-button.tsx
import { View, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
  onPress: () => void;
};

export default function CircleButton({ onPress }: Props) {
  return (
    <View style={styles.circleButtonContainer}>
      <Pressable style={styles.circleButton} onPress={onPress}>
        <MaterialIcons name="add" size={38} color="#25292e" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 84,
    height: 84,
    marginHorizontal: 60,
    borderWidth: 4,
    borderColor: '#ffd33d',
    borderRadius: 42,
    padding: 3,
  },
  circleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#fff',
  },
});
```

加号图标来自 `@expo/vector-icons` 的 `<MaterialIcons>`。

另外两个按钮用 `<MaterialIcons>` 图标配合垂直排列的文字。创建 **src/components/icon-button.tsx**，三个 props：`icon`（MaterialIcons 图标名）、`label`（文字）、`onPress`（点击回调）。

```tsx src/components/icon-button.tsx
import { Pressable, StyleSheet, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
};

export default function IconButton({ icon, label, onPress }: Props) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color="#fff" />
      <Text style={styles.iconButtonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonLabel: {
    color: '#fff',
    marginTop: 12,
  },
});
```

在 **index.tsx** 中：导入 `CircleButton`/`IconButton`；添加三个占位函数 —— `onReset()` 让选择按钮重新出现；另外两个稍后实现。

```tsx src/app/(tabs)/index.tsx
import { View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import Button from '@/components/button';
import CircleButton from '@/components/circle-button';
import IconButton from '@/components/icon-button';
import ImageViewer from '@/components/image-viewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);

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
    // 稍后实现
  };

  const onSaveImageAsync = async () => {
    // 稍后实现
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
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

## 创建表情选择器模态框

模态框让用户从列表中选择表情。创建 **src/components/emoji-picker.tsx**，props：`isVisible`（是否可见）、`onClose`（关闭模态框）、`children`（稍后放置表情列表）。

```tsx src/components/emoji-picker.tsx
import { Modal, View, Text, Pressable, StyleSheet, PropsWithChildren } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function EmojiPicker({ isVisible, children, onClose }: Props) {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose a sticker</Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </View>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: '25%',
    width: '100%',
    backgroundColor: '#25292e',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    height: '16%',
    backgroundColor: '#464C55',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
});
```

说明：

- `Modal` 显示标题和关闭按钮；
- `visible` 接收 `isVisible`；
- `transparent` 决定是否填满整个视图；
- `animationType` 控制进入/退出动画（从底部滑入）；
- 点击关闭 `Pressable` 时触发 `onClose`。

在 **index.tsx** 中：导入 `EmojiPicker`；添加 `isModalVisible` 状态（默认 `false`）；在 `onAddSticker` 中设为 `true`；添加 `onModalClose` 设为 `false`；把 `<EmojiPicker>` 放在 `Index` 底部。

```tsx src/app/(tabs)/index.tsx
import { View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import Button from '@/components/button';
import CircleButton from '@/components/circle-button';
import EmojiPicker from '@/components/emoji-picker';
import IconButton from '@/components/icon-button';
import ImageViewer from '@/components/image-viewer';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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
    // 稍后实现
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
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
        {/* 表情列表将放在这里 */}
      </EmojiPicker>
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

## 显示表情列表

使用 React Native 的 [`<FlatList>`](https://reactnative.dev/docs/flatlist) 添加一个横向表情列表。创建 **src/components/emoji-list.tsx**。

```tsx src/components/emoji-list.tsx
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Platform, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  onSelect: (image: ImageSourcePropType) => void;
  onCloseModal: () => void;
};

export default function EmojiList({ onSelect, onCloseModal }: Props) {
  const [emoji] = useState<ImageSourcePropType[]>([
    require('@/assets/images/emoji1.png'),
    require('@/assets/images/emoji2.png'),
    require('@/assets/images/emoji3.png'),
    require('@/assets/images/emoji4.png'),
    require('@/assets/images/emoji5.png'),
    require('@/assets/images/emoji6.png'),
  ]);

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={Platform.OS === 'web'}
      data={emoji}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item, index }) => (
        <Pressable
          onPress={() => {
            onSelect(item);
            onCloseModal();
          }}>
          <Image source={item} key={index} style={styles.image} />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
});
```

说明：

- `FlatList` 通过 `Pressable` 中的 `Image` 渲染表情图片（之后会改进为点击放置贴纸）；
- `data` 来自 `emoji` 数组；
- `renderItem` 返回每一项；
- `horizontal` 实现横向渲染；
- `showsHorizontalScrollIndicator` 使用 `Platform` 在 Web 上显示滚动条。

更新 **index.tsx**：导入 `EmojiList`，替换 `EmojiPicker` 中的注释。

```tsx src/app/(tabs)/index.tsx
// 新增导入
import EmojiList from '@/components/emoji-list';
```

```tsx src/app/(tabs)/index.tsx
// 新增状态
const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | undefined>(undefined);
```

```tsx src/app/(tabs)/index.tsx
<EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
  <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
</EmojiPicker>
```

在 `EmojiList` 中，`onSelect` 负责选中表情，`onCloseModal` 负责关闭模态框。

## 显示选中的表情

创建 **src/components/emoji-sticker.tsx**。

```tsx src/components/emoji-sticker.tsx
import { View, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  return (
    <View style={{ top: -350 }}>
      <Image source={stickerSource} style={{ width: imageSize, height: imageSize }} />
    </View>
  );
}
```

两个 props 说明：`imageSize`（在 `Index` 中定义；下一章将用于点击缩放）；`stickerSource`（选中的表情图片）。

在 **index.tsx** 中导入 `EmojiSticker`，并在 `pickedEmoji` 不为 `undefined` 时渲染。

```tsx src/app/(tabs)/index.tsx
// 新增导入
import EmojiSticker from '@/components/emoji-sticker';
```

```tsx src/app/(tabs)/index.tsx
<View style={styles.imageContainer}>
  <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
  {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
</View>
```

查看应用在 Android、iOS 和 Web 上的效果。

## 本章小结

第五章：创建模态框。

我们创建了表情选择器模态框，并实现了选择表情、将其显示在图片之上的逻辑。下一章将添加手势，让表情可以拖动、点击缩放。

[下一章：第六章 添加手势](/tutorial/gestures)
