---
title: Button 组件参考
description: A pressable button with multiple visual variants.
---

# Button 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A pressable button that renders consistently across Android, iOS, and web. Supports `filled`, `outlined`, and `text` visual variants.

**Android**

![Filled, outlined, and text buttons showing the Material 3 emphasis hierarchy](/static/images/expo-ui/button/android-light.webp)

**iOS**

![Two iOS 26 Liquid Glass buttons: a glassProminent Get started above a glass Learn more](/static/images/expo-ui/button/ios-light.webp)

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

### Basic button

**Android**

![A single filled button](/static/images/expo-ui/examples/universal-button-basic-android-light.webp)

**iOS**

![A single filled button](/static/images/expo-ui/examples/universal-button-basic-ios-light.webp)

```tsx BasicButtonExample.tsx
import { Host, Button } from '@expo/ui';

export default function BasicButtonExample() {
  return (
    <Host matchContents>
      <Button label="Press me" onPress={() => alert('Pressed!')} />
    </Host>
  );
}
```

### Variants

Pick a visual variant with the [`variant`](#variant) prop.

**Android**

![Filled, outlined, and text button variants stacked vertically](/static/images/expo-ui/examples/universal-button-variants-android-light.webp)

**iOS**

![Filled, outlined, and text button variants stacked vertically](/static/images/expo-ui/examples/universal-button-variants-ios-light.webp)

```tsx ButtonVariantsExample.tsx
import { Host, Column, Button } from '@expo/ui';

export default function ButtonVariantsExample() {
  return (
    <Host matchContents>
      <Column spacing={8}>
        <Button variant="filled" label="Filled" onPress={() => {}} />
        <Button variant="outlined" label="Outlined" onPress={() => {}} />
        <Button variant="text" label="Text" onPress={() => {}} />
      </Column>
    </Host>
  );
}
```

### Custom content

Pass [`children`](#children) for fully custom button contents. The [`label`](#label) prop is ignored when `children` is provided.

**Android**

![A filled button with a star icon and a Favorite label](/static/images/expo-ui/examples/universal-button-custom-android-light.webp)

**iOS**

![A filled button with a star icon and a Favorite label](/static/images/expo-ui/examples/universal-button-custom-ios-light.webp)

```tsx CustomButtonExample.tsx
import { Host, Button, Row, Icon, Text } from '@expo/ui';

export default function CustomButtonExample() {
  return (
    <Host matchContents>
      <Button onPress={() => {}}>
        <Row spacing={6} alignment="center">
          <Icon
            name={Icon.select({
              ios: 'star.fill',
              android: require('@expo/material-symbols/star.xml'),
            })}
            size={16}
            color="#FFFFFF"
          />
          <Text textStyle={{ color: '#FFFFFF' }}>Favorite</Text>
        </Row>
      </Button>
    </Host>
  );
}
```

### Disabled

**Android**

![A dimmed disabled button](/static/images/expo-ui/examples/universal-button-disabled-android-light.webp)

**iOS**

![A dimmed disabled button](/static/images/expo-ui/examples/universal-button-disabled-ios-light.webp)

```tsx DisabledButtonExample.tsx
import { Host, Button } from '@expo/ui';

export default function DisabledButtonExample() {
  return (
    <Host matchContents>
      <Button label="Disabled" onPress={() => {}} disabled />
    </Host>
  );
}
```

## API

```tsx
import { Button } from '@expo/ui';
```
