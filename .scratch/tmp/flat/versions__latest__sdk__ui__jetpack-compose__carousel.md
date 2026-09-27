---
title: Carousel 组件参考
description: Jetpack Compose Carousel components for displaying scrollable collections of items.
---

# Carousel 组件参考

> 支持平台：Android、Expo Go。

Expo UI provides three carousel components matching the official Jetpack Compose [Carousel](https://developer.android.com/develop/ui/compose/components/carousel) API: `HorizontalCenteredHeroCarousel`, `HorizontalMultiBrowseCarousel`, and `HorizontalUncontainedCarousel`.

> **Note:** Carousel is a horizontally scrollable component, so the parent `Host` must provide a finite width on the scroll axis. Use `matchContents={{ vertical: true }}` together with `style={{ width: '100%' }}` (or any finite width). See [Match contents in Host reference](host#match-contents) for details.

![Material 3 multi-browse carousel with a hero item and smaller peek items](/static/images/expo-ui/carousel/android-light.webp)

## Installation

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

## Usage

### HorizontalCenteredHeroCarousel

Centers one large hero item between two small peek items — ideal for spotlighting content like movie posters.

![A wide purple hero slide with two narrow peek slides beside it](/static/images/expo-ui/examples/carousel-centered-hero-android-light.webp)

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

Shows a large item alongside smaller peek items, letting users browse what comes next.

![A large first card followed by progressively narrower peek cards](/static/images/expo-ui/examples/carousel-multi-browse-android-light.webp)

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

Each item has a fixed width with free-form scrolling.

![Equal width photo cards scrolling off the edge of the screen](/static/images/expo-ui/examples/carousel-uncontained-android-light.webp)

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
