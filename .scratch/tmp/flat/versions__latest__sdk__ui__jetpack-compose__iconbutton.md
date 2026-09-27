---
title: IconButton 组件参考
description: Jetpack Compose IconButton components for displaying native Material3 icon buttons.
---

# IconButton 组件参考

> 支持平台：Android、Expo Go。

Expo UI provides four icon button components that match the official Jetpack Compose [IconButton API](https://developer.android.com/develop/ui/compose/components/icon-button): `IconButton`, `FilledIconButton`, `FilledTonalIconButton`, and `OutlinedIconButton`. All variants share the same props and accept composable children for content.

![Filled, filled tonal, and standard Material 3 icon buttons](/static/images/expo-ui/iconbutton/android-light.webp)

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

### Basic icon button

A standard icon button with no background, typically used for toolbar actions.

![A gear icon button with no background](/static/images/expo-ui/examples/iconbutton-basic-android-light.webp)

```tsx BasicIconButtonExample.tsx
import {
  Host,
  IconButton,
  Icon,
  Surface,
} from '@expo/ui/jetpack-compose';

export default function BasicIconButtonExample() {
  return (
    <Host matchContents>
      <Surface>
        <IconButton onClick={() => alert('Pressed!')}>
          <Icon
            source={require('./assets/settings.xml')}
            size={24}
          />
        </IconButton>
      </Surface>
    </Host>
  );
}
```

### Icon button variants

Use different icon button components to convey varying levels of emphasis.

![Four star icon buttons in a row: plain, filled, filled tonal, and outlined](/static/images/expo-ui/examples/iconbutton-variants-android-light.webp)

```tsx IconButtonVariantsExample.tsx
import {
  Host,
  IconButton,
  FilledIconButton,
  FilledTonalIconButton,
  OutlinedIconButton,
  Icon,
  Row,
  Surface,
} from '@expo/ui/jetpack-compose';

export default function IconButtonVariantsExample() {
  return (
    <Host matchContents>
      <Surface>
        <Row horizontalArrangement={{ spacedBy: 8 }}>
          <IconButton onClick={() => {}}>
            <Icon source={require('./assets/star.xml')} size={24} />
          </IconButton>
          <FilledIconButton onClick={() => {}}>
            <Icon source={require('./assets/star.xml')} size={24} />
          </FilledIconButton>
          <FilledTonalIconButton onClick={() => {}}>
            <Icon source={require('./assets/star.xml')} size={24} />
          </FilledTonalIconButton>
          <OutlinedIconButton onClick={() => {}}>
            <Icon source={require('./assets/star.xml')} size={24} />
          </OutlinedIconButton>
        </Row>
      </Surface>
    </Host>
  );
}
```

## API

```tsx
import {
  IconButton,
  FilledIconButton,
  FilledTonalIconButton,
  OutlinedIconButton,
} from '@expo/ui/jetpack-compose';
```
