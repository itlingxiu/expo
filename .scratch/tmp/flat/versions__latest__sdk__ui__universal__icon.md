---
title: Icon 组件参考
description: A platform-native icon — SF Symbol on iOS, Material Symbol on Android.
---

# Icon 组件参考

> 支持平台：Android、iOS、Expo Go。

A platform-native icon. On Android, it renders a Material Symbol XML vector drawable (recommended source: [`@expo/material-symbols`](https://www.npmjs.com/package/@expo/material-symbols)). On iOS, it renders an [SF Symbol](https://developer.apple.com/sf-symbols).

> **Note:** `Icon` does not render on web.

**Android**

![Wi-Fi, Bluetooth, mail, and person icons rendered with the Material 3 Icon component](/static/images/expo-ui/icon/android-light.webp)

**iOS**

![Wi-Fi, radio waves, mail, and person icons rendered with SF Symbols](/static/images/expo-ui/icon/ios-light.webp)

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

Optionally, install [`@expo/material-symbols`](https://www.npmjs.com/package/@expo/material-symbols) to use the bundled icons on Android. For a different style or custom axes, see [Custom styles on the Jetpack Compose Icon page](/versions/latest/sdk/ui/jetpack-compose/icon#custom-styles-via-expomaterial-symbols-cli) — no install needed.

:::tabs
:::tab npm
```sh
npx expo install @expo/material-symbols
```
:::
:::tab yarn
```sh
yarn expo install @expo/material-symbols
```
:::
:::tab pnpm
```sh
pnpm expo install @expo/material-symbols
```
:::
:::tab bun
```sh
bun expo install @expo/material-symbols
```
:::
:::

## Usage

### Cross-platform icon with `Icon.select`

[`Icon.select`](#selectspec) picks the right asset for the current platform. Pair it with [`@expo/ui/babel-plugin`](https://github.com/expo/expo/tree/main/packages/expo-ui/plugin) (auto-loaded by `babel-preset-expo`) so Metro can tree-shake the unused side per platform.

**Android**

![A large orange star drawn as a Material Symbol](/static/images/expo-ui/examples/universal-icon-select-android-light.webp)

**iOS**

![A large orange star drawn as an SF Symbol](/static/images/expo-ui/examples/universal-icon-select-ios-light.webp)

```tsx IconSelectExample.tsx
import { Host, Icon } from '@expo/ui';

export default function IconSelectExample() {
  return (
    <Host matchContents>
      <Icon
        name={Icon.select({
          ios: 'star.fill',
          android: import('@expo/material-symbols/star.xml'),
        })}
        size={32}
        color="orange"
      />
    </Host>
  );
}
```

### Hoisted `Icon.select`

Hoist the [`Icon.select`](#selectspec) call when reusing the same icon across multiple call sites.

**Android**

![A row of three small gold stars drawn as Material Symbols](/static/images/expo-ui/examples/universal-icon-hoisted-android-light.webp)

**iOS**

![A row of three small gold stars drawn as SF Symbols](/static/images/expo-ui/examples/universal-icon-hoisted-ios-light.webp)

```tsx HoistedIconExample.tsx
import { Host, Row, Icon } from '@expo/ui';

const STAR = Icon.select({
  ios: 'star.fill',
  android: import('@expo/material-symbols/star.xml'),
});

export default function HoistedIconExample() {
  return (
    <Host matchContents>
      <Row spacing={4}>
        <Icon name={STAR} size={20} color="gold" />
        <Icon name={STAR} size={20} color="gold" />
        <Icon name={STAR} size={20} color="gold" />
      </Row>
    </Host>
  );
}
```

### Platform-specific files

Inside an **.android.tsx** file, import the XML asset directly. Inside an **.ios.tsx** file, pass the SF Symbol name as a string.

```tsx Icon.android.tsx
import StarIcon from '@expo/material-symbols/star.xml';
import { Host, Icon } from '@expo/ui';

export default function StarRow() {
  return (
    <Host matchContents>
      <Icon name={StarIcon} size={24} />
    </Host>
  );
}
```

```tsx Icon.ios.tsx
import { Host, Icon } from '@expo/ui';

export default function StarRow() {
  return (
    <Host matchContents>
      <Icon name="star.fill" size={24} />
    </Host>
  );
}
```

## API

```tsx
import { Icon } from '@expo/ui';
```
