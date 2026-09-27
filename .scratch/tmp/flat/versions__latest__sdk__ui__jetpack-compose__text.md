---
title: Text 组件参考
description: A Jetpack Compose Text component for displaying styled text.
---

# Text 组件参考

> 支持平台：Android、Expo Go。

> **info** For cross-platform usage, see the universal [`Text`](/versions/latest/sdk/ui/universal/text) — it renders the appropriate native component per platform.

Expo UI Text matches the official Jetpack Compose [Text styling](https://developer.android.com/develop/ui/compose/text/style-text) API and displays text with Material 3 typography styles, custom fonts, and text formatting options.

![Material 3 typography hierarchy: headline, title, body, and label](/static/images/expo-ui/text/android-light.webp)

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

![A single line of text reading Hello, world!](/static/images/expo-ui/examples/composetext-basic-android-light.webp)

```tsx BasicTextExample.tsx
import {
  Host,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';

export default function BasicTextExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Text color={colors.onBackground}>Hello, world!</Text>
    </Host>
  );
}
```

### Typography styles

Use the `style` prop with `typography` to apply Material 3 typography presets.

![Four lines showing the display large, headline medium, body small, and label large type scales](/static/images/expo-ui/examples/composetext-typography-android-light.webp)

```tsx TypographyExample.tsx
import {
  Host,
  Text,
  Column,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function TypographyExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Column modifiers={[paddingAll(16)]}>
        <Text
          color={colors.onBackground}
          style={{ typography: 'displayLarge' }}>
          Display Large
        </Text>
        <Text
          color={colors.onBackground}
          style={{ typography: 'headlineMedium' }}>
          Headline Medium
        </Text>
        <Text
          color={colors.onBackground}
          style={{ typography: 'bodySmall' }}>
          Body Small
        </Text>
        <Text
          color={colors.onBackground}
          style={{ typography: 'labelLarge' }}>
          Label Large
        </Text>
      </Column>
    </Host>
  );
}
```

### Text with maxLines and overflow

Control text truncation with `maxLines` and `overflow`.

![A paragraph clipped to two lines ending in an ellipsis](/static/images/expo-ui/examples/composetext-overflow-android-light.webp)

```tsx TextOverflowExample.tsx
import {
  Host,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { width } from '@expo/ui/jetpack-compose/modifiers';

export default function TextOverflowExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Text
        color={colors.onBackground}
        maxLines={2}
        overflow="ellipsis"
        modifiers={[width(200)]}>
        This is a long paragraph of text that will be truncated
        after two lines with an ellipsis at the end to indicate
        there is more content.
      </Text>
    </Host>
  );
}
```

### Styled text

Apply custom text styles including font weight, style, size, and decoration.

![Five lines showing bold, italic, underlined, letter-spaced, and pink centered text](/static/images/expo-ui/examples/composetext-styled-android-light.webp)

```tsx StyledTextExample.tsx
import {
  Host,
  Text,
  Column,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function StyledTextExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Column modifiers={[paddingAll(16)]}>
        <Text
          color={colors.onBackground}
          style={{ fontWeight: 'bold', fontSize: 20 }}>
          Bold text
        </Text>
        <Text
          color={colors.onBackground}
          style={{ fontStyle: 'italic' }}>
          Italic text
        </Text>
        <Text
          color={colors.onBackground}
          style={{ textDecoration: 'underline' }}>
          Underlined text
        </Text>
        <Text
          color={colors.onBackground}
          style={{ letterSpacing: 4 }}>
          Spaced out text
        </Text>
        <Text
          color="#E91E63"
          style={{ fontSize: 18, textAlign: 'center' }}>
          Colored and centered
        </Text>
      </Column>
    </Host>
  );
}
```

### Nested text

Nest `<Text>` components to apply inline styles to parts of a sentence. Child spans inherit styles from their parent. For example, a bold parent with an italic child renders the child as bold and italic.

![Four sentences with inline spans in italic, bold, underline, blue, and a yellow highlight](/static/images/expo-ui/examples/composetext-nested-android-light.webp)

```tsx NestedTextExample.tsx
import {
  Host,
  Text,
  Column,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function NestedTextExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Column modifiers={[paddingAll(16)]}>

        <Text
          color={colors.onBackground}
          style={{ fontWeight: 'bold' }}>
          Hello <Text style={{ fontStyle: 'italic' }}>world</Text>!
        </Text>

        <Text color={colors.onBackground} style={{ fontSize: 16 }}>
          Normal,{' '}
          <Text style={{ fontStyle: 'italic' }}>italic</Text>,{' '}
          <Text style={{ fontWeight: 'bold' }}>bold</Text>, and{' '}
          <Text style={{ textDecoration: 'underline' }}>
            underlined
          </Text>
        </Text>

        <Text color={colors.onBackground} style={{ fontSize: 18 }}>
          Click{' '}
          <Text color="#007AFF" style={{ fontWeight: 'bold' }}>
            here
          </Text>{' '}
          or{' '}
          <Text style={{ background: '#FFEB3B' }}>highlighted</Text>
        </Text>

        <Text
          color={colors.onBackground}
          style={{ fontWeight: 'bold' }}>
          Bold{' '}
          <Text style={{ fontStyle: 'italic' }}>
            bold+italic{' '}
            <Text style={{ textDecoration: 'underline' }}>
              bold+italic+underline
            </Text>
          </Text>
        </Text>
      </Column>
    </Host>
  );
}
```

### Custom fonts

Use fonts loaded via [`expo-font`](/versions/latest/sdk/font) by passing the font family name to `style.fontFamily`.

![Three lines rendered in the system serif, system monospace, and Inter Bold fonts](/static/images/expo-ui/examples/composetext-font-android-light.webp)

```tsx CustomFontExample.tsx
import {
  Host,
  Text,
  Column,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function CustomFontExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Column modifiers={[paddingAll(16)]}>
        <Text
          color={colors.onBackground}
          style={{ fontFamily: 'serif', fontSize: 16 }}>
          System serif font
        </Text>
        <Text
          color={colors.onBackground}
          style={{ fontFamily: 'monospace', fontSize: 16 }}>
          System monospace font
        </Text>
        <Text
          color={colors.onBackground}
          style={{ fontFamily: 'Inter-Bold', fontSize: 16 }}>
          Custom Inter Bold font
        </Text>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { Text } from '@expo/ui/jetpack-compose';
```
