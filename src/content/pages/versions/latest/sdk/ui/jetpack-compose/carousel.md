---
title: Carousel 组件参考
description: 用于显示可滚动项目集合的 Jetpack Compose Carousel 组件。
---

# Carousel 组件参考

> 支持平台：Android、Expo Go。

Expo UI 提供三个与官方 Jetpack Compose [Carousel](https://developer.android.com/develop/ui/compose/components/carousel) API 一致的轮播组件：`HorizontalCenteredHeroCarousel`、`HorizontalMultiBrowseCarousel` 和 `HorizontalUncontainedCarousel`。

:::note
Carousel 是水平可滚动组件，因此父级 `Host` 必须在滚动轴上提供有限宽度。请把 `matchContents={{ vertical: true }}` 与 `style={{ width: '100%' }}`（或任何有限宽度）一起使用。详见 [Host 参考中的匹配内容尺寸](/versions/latest/sdk/ui/jetpack-compose/host#匹配内容尺寸)。
:::

![Material 3 多浏览轮播，含一个主项和较小的窥视项](/static/images/expo-ui/carousel/android-light.webp)

## 安装

:::tabs
:::tab npm
```sh
npx expo install @expo/ui
```
:::
:::tab yarn
```sh
yarn expo install @expo/ui
```
:::
:::tab pnpm
```sh
pnpm expo install @expo/ui
```
:::
:::tab bun
```sh
bun expo install @expo/ui
```
:::
:::

## 用法

### HorizontalCenteredHeroCarousel

在两个较小的窥视项之间居中放置一个大主项，适合突出电影海报等内容。

![宽紫色主幻灯片，两侧各有一条窄窥视幻灯片](/static/images/expo-ui/examples/carousel-centered-hero-android-light.webp)

```tsx CenteredHeroExample.tsx
import {
  Host,
  HorizontalCenteredHeroCarousel,
  Box,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  size,
  background,
  maskClip,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';

export default function CenteredHeroExample() {
  const colors = [
    '#6200EE',
    '#03DAC5',
    '#FF5722',
    '#4CAF50',
    '#2196F3',
  ];

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <HorizontalCenteredHeroCarousel itemSpacing={8}>
        {colors.map((color, index) => (
          <Box
            key={index}
            contentAlignment="center"
            modifiers={[
              size(300, 200),
              maskClip(Shapes.RoundedCorner(28)),
              background(color),
            ]}>
            <Text color="#FFFFFF">Slide {index + 1}</Text>
          </Box>
        ))}
      </HorizontalCenteredHeroCarousel>
    </Host>
  );
}
```

### HorizontalMultiBrowseCarousel

在大项旁边显示较小的窥视项，让用户浏览接下来的内容。

![一张大卡片，后面跟着逐渐变窄的窥视卡片](/static/images/expo-ui/examples/carousel-multi-browse-android-light.webp)

```tsx MultiBrowseExample.tsx
import {
  Host,
  HorizontalMultiBrowseCarousel,
  Box,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  size,
  background,
} from '@expo/ui/jetpack-compose/modifiers';

export default function MultiBrowseExample() {
  const colors = [
    '#6200EE',
    '#03DAC5',
    '#FF5722',
    '#4CAF50',
    '#2196F3',
  ];

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <HorizontalMultiBrowseCarousel
        preferredItemWidth={200}
        itemSpacing={8}
        flingBehavior="singleAdvance">
        {colors.map((color, index) => (
          <Box
            key={index}
            contentAlignment="center"
            modifiers={[size(200, 180), background(color)]}>
            <Text color="#FFFFFF">Card {index + 1}</Text>
          </Box>
        ))}
      </HorizontalMultiBrowseCarousel>
    </Host>
  );
}
```

### HorizontalUncontainedCarousel

每一项都有固定宽度，可以自由滚动。

![等宽照片卡片滚动到屏幕边缘之外](/static/images/expo-ui/examples/carousel-uncontained-android-light.webp)

```tsx UncontainedExample.tsx
import {
  Host,
  HorizontalUncontainedCarousel,
  Box,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  size,
  background,
} from '@expo/ui/jetpack-compose/modifiers';

export default function UncontainedExample() {
  const items = [
    'Photo 1',
    'Photo 2',
    'Photo 3',
    'Photo 4',
    'Photo 5',
  ];

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <HorizontalUncontainedCarousel
        itemWidth={160}
        itemSpacing={12}
        contentPadding={{ start: 16, top: 0, end: 16, bottom: 0 }}>
        {items.map(item => (
          <Box
            key={item}
            contentAlignment="center"
            modifiers={[size(160, 180), background('#3F51B5')]}>
            <Text color="#FFFFFF">{item}</Text>
          </Box>
        ))}
      </HorizontalUncontainedCarousel>
    </Host>
  );
}
```

## API

```tsx
import {
  HorizontalCenteredHeroCarousel,
  HorizontalMultiBrowseCarousel,
  HorizontalUncontainedCarousel,
} from '@expo/ui/jetpack-compose';
```
