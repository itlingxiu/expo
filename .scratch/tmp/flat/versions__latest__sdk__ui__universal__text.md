---
title: Text 组件参考
description: A component for displaying styled text content.
---

# Text 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A component for displaying text. Adapts to the platform color scheme (light/dark) by default and exposes a focused subset of typography knobs through [`textStyle`](#textstyle).

**Android**

![Material 3 typography hierarchy: headline, title, body, and label](/static/images/expo-ui/text/android-light.webp)

**iOS**

![Text rendered with different font sizes, weights, and a hierarchical secondary style](/static/images/expo-ui/text/ios-light.webp)

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

### Basic text

**Android**

![The text Hello, world!](/static/images/expo-ui/examples/universal-text-basic-android-light.webp)

**iOS**

![The text Hello, world!](/static/images/expo-ui/examples/universal-text-basic-ios-light.webp)

```tsx TextExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Text } from '@expo/ui';

export default function TextExample() {
  const colorScheme = useColorScheme();

  return (
    <Host matchContents>
      <Text textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
        Hello, world!
      </Text>
    </Host>
  );
}
```

### Styled text

Use [`textStyle`](#textstyle) for typography-specific properties (font size, weight, alignment).

**Android**

![The word Headline in large bold type](/static/images/expo-ui/examples/universal-text-styled-android-light.webp)

**iOS**

![The word Headline in large bold type](/static/images/expo-ui/examples/universal-text-styled-ios-light.webp)

```tsx StyledTextExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Text } from '@expo/ui';

export default function StyledTextExample() {
  const colorScheme = useColorScheme();

  return (
    <Host matchContents>
      <Text
        textStyle={{
          color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          fontSize: 24,
          fontWeight: '700',
          textAlign: 'center',
        }}>
        Headline
      </Text>
    </Host>
  );
}
```

### Truncating long text

Use [`numberOfLines`](#numberoflines) to clamp long text with a trailing ellipsis.

**Android**

![A long line of text cut off at the screen edge](/static/images/expo-ui/examples/universal-text-truncated-android-light.webp)

**iOS**

![A long line of text truncated with an ellipsis](/static/images/expo-ui/examples/universal-text-truncated-ios-light.webp)

```tsx TruncatedTextExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Text } from '@expo/ui';

export default function TruncatedTextExample() {
  const colorScheme = useColorScheme();

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Text numberOfLines={1} textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
        A very long line of text that will be truncated when it does not fit on a single line.
      </Text>
    </Host>
  );
}
```

## API

```tsx
import { Text } from '@expo/ui';
```
