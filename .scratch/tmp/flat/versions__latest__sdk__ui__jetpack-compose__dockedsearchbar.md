---
title: DockedSearchBar 组件参考
description: A Jetpack Compose DockedSearchBar component for displaying an inline search input.
---

# DockedSearchBar 组件参考

> 支持平台：Android、Expo Go。

Expo UI DockedSearchBar matches the official Jetpack Compose [SearchBar API](https://developer.android.com/develop/ui/compose/components/search-bar) and displays a search input that remains anchored in its parent layout rather than expanding to full screen.

![Material 3 docked search bar with search icon and placeholder text](/static/images/expo-ui/dockedsearchbar/android-light.webp)

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

### Basic docked search bar

![An empty rounded search field with no placeholder text and no icon](/static/images/expo-ui/examples/dockedsearchbar-basic-android-light.webp)

```tsx BasicDockedSearchBarExample.tsx
import { useState } from 'react';
import { Host, DockedSearchBar } from '@expo/ui/jetpack-compose';

export default function BasicDockedSearchBarExample() {
  const [query, setQuery] = useState('');

  return (
    <Host matchContents>
      <DockedSearchBar onQueryChange={setQuery} />
    </Host>
  );
}
```

### With placeholder and leading icon

Use the `DockedSearchBar.Placeholder` and `DockedSearchBar.LeadingIcon` slot components to customize the search bar appearance.

![A rounded search field with a magnifier icon and placeholder text reading Search items](/static/images/expo-ui/examples/dockedsearchbar-slots-android-light.webp)

```tsx DockedSearchBarWithSlotsExample.tsx
import { useState } from 'react';
import {
  Host,
  DockedSearchBar,
  Text,
} from '@expo/ui/jetpack-compose';

export default function DockedSearchBarWithSlotsExample() {
  const [query, setQuery] = useState('');

  return (
    <Host matchContents>
      <DockedSearchBar onQueryChange={setQuery}>
        <DockedSearchBar.Placeholder>
          <Text>Search items...</Text>
        </DockedSearchBar.Placeholder>
        <DockedSearchBar.LeadingIcon>
          <Text>🔍</Text>
        </DockedSearchBar.LeadingIcon>
      </DockedSearchBar>
    </Host>
  );
}
```

## API

```tsx
import { DockedSearchBar } from '@expo/ui/jetpack-compose';
```
