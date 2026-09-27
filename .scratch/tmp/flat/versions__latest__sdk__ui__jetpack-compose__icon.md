---
title: Icon 组件参考
description: A Jetpack Compose Icon component for displaying icons.
---

# Icon 组件参考

> 支持平台：Android、Expo Go。

> **info** For cross-platform usage, see the universal [`Icon`](/versions/latest/sdk/ui/universal/icon) — it renders the appropriate native component per platform.

An icon component for rendering Material Symbol XML vector drawables in Jetpack Compose. The recommended source is [`@expo/material-symbols`](https://www.npmjs.com/package/@expo/material-symbols) — it ships Google's [Material Symbols](https://fonts.google.com/icons) as individual asset subpaths, so Metro only bundles the icons you actually import. For other styles (rounded, sharp, filled) or custom axes, the package's [CLI](#custom-styles-via-expomaterial-symbols-cli) downloads any variant directly into your project.

![Wifi, bluetooth, mail, and person icons rendered with the Material 3 Icon component](/static/images/expo-ui/icon/android-light.webp)

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

Optionally, install [`@expo/material-symbols`](https://www.npmjs.com/package/@expo/material-symbols) to use the bundled icons. For a different style or custom axes, see [Custom styles](#custom-styles-via-expomaterial-symbols-cli) — no install needed.

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

### Basic icon

Import any icon directly from its own subpath of `@expo/material-symbols` — each icon resolves to a Metro asset that `Icon` can render natively. For local XML files you add to your project, use `require()` instead (see [Custom styles](#custom-styles-via-expomaterial-symbols-cli) below).

![A house outline icon at the default size](/static/images/expo-ui/examples/icon-basic-android-light.webp)

```tsx BasicIcon.tsx
import {
  Host,
  Icon,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import Home from '@expo/material-symbols/home.xml';

export default function BasicIcon() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Icon
        source={Home}
        tint={colors.onBackground}
        contentDescription="Home"
      />
    </Host>
  );
}
```

### Icon with tint color

Use the `tint` prop to apply a color overlay to the icon.

![A heart outline icon drawn in purple](/static/images/expo-ui/examples/icon-tinted-android-light.webp)

```tsx TintedIcon.tsx
import { Host, Icon } from '@expo/ui/jetpack-compose';
import Favorite from '@expo/material-symbols/favorite.xml';

export default function TintedIcon() {
  return (
    <Host matchContents>
      <Icon
        source={Favorite}
        tint="#6200ee"
        contentDescription="Favorite"
      />
    </Host>
  );
}
```

### Icon with size

Specify a custom size in dp using the `size` prop.

![A gear icon drawn at 48 density independent pixels](/static/images/expo-ui/examples/icon-sized-android-light.webp)

```tsx SizedIcon.tsx
import {
  Host,
  Icon,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import Settings from '@expo/material-symbols/settings.xml';

export default function SizedIcon() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Icon
        source={Settings}
        size={48}
        tint={colors.onBackground}
        contentDescription="Settings"
      />
    </Host>
  );
}
```

### Custom styles via `@expo/material-symbols` CLI

`@expo/material-symbols` ships the **outlined** style with default axes. When you need a different style (`rounded`, `sharp`), a filled variant, or custom weight, grade, or optical size, use its CLI to fetch specific drawables straight from Google Fonts into your project.

```sh
# Download icons by name (defaults: outlined, weight 400, 24px)
npx @expo/material-symbols star home

# Rounded style
npx @expo/material-symbols --style rounded star home

# Sharp + filled
npx @expo/material-symbols --style sharp --fill favorite

# Paste a URL from fonts.google.com/icons to preserve the axes you picked there
npx @expo/material-symbols "https://fonts.google.com/icons?selected=Material+Symbols+Outlined:check_box:FILL@1;wght@300;GRAD@0;opsz@24"
```

| Option                | Description                                | Default    |
| --------------------- | ------------------------------------------ | ---------- |
| `-o, --output <dir>`  | Output directory                           | `./assets` |
| `-s, --style <style>` | Icon style: `outlined`, `rounded`, `sharp` | `outlined` |
| `-f, --fill`          | Use the filled variant                     |            |
| `-w, --weight <wght>` | Weight: `100`–`700`                        | `400`      |
| `-g, --grade <grad>`  | Grade: `-25`, `0`, `200`                   | `0`        |
| `--opsz <size>`       | Optical size: `20`, `24`, `40`, `48`       | `24`       |

The CLI writes ready-to-use XML vector drawables into your project. Load them with `require()` and pass them to `Icon`.

![A rounded star outline icon downloaded with the material symbols command line tool](/static/images/expo-ui/examples/icon-custom-android-light.webp)

```tsx CustomIcon.tsx
import {
  Host,
  Icon,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';

export default function CustomIcon() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Icon
        source={require('./assets/star_rounded.xml')}
        size={32}
        tint={colors.onBackground}
        contentDescription="Star"
      />
    </Host>
  );
}
```

## API

```tsx
import { Icon } from '@expo/ui/jetpack-compose';
```
