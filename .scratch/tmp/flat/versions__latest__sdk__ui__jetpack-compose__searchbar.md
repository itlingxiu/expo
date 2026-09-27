---
title: SearchBar 组件参考
description: A Jetpack Compose SearchBar component for search input functionality.
---

# SearchBar 组件参考

> 支持平台：Android、Expo Go。

Expo UI SearchBar matches the official Jetpack Compose [Search](https://developer.android.com/develop/ui/compose/components/search-bar) API and provides a search input with support for placeholder text and expanded full-screen search.

![Material 3 search bar with placeholder text](/static/images/expo-ui/searchbar/android-light.webp)

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

### Basic search bar

![An empty rounded search field with no placeholder text](/static/images/expo-ui/examples/searchbar-basic-android-light.webp)

```tsx BasicSearchBarExample.tsx
import { useState } from 'react';
import { Host, SearchBar } from '@expo/ui/jetpack-compose';

export default function BasicSearchBarExample() {
  const [query, setQuery] = useState('');

  return (
    <Host matchContents>
      <SearchBar onSearch={searchText => setQuery(searchText)} />
    </Host>
  );
}
```

### Search bar with placeholder

Use the `SearchBar.Placeholder` sub-component to display hint text when the search field is empty.

![A rounded search field showing the placeholder text Search items](/static/images/expo-ui/examples/searchbar-placeholder-android-light.webp)

```tsx SearchBarPlaceholderExample.tsx
import { useState } from 'react';
import { Host, SearchBar, Text } from '@expo/ui/jetpack-compose';

export default function SearchBarPlaceholderExample() {
  const [query, setQuery] = useState('');

  return (
    <Host matchContents>
      <SearchBar onSearch={searchText => setQuery(searchText)}>
        <SearchBar.Placeholder>
          <Text>Search items...</Text>
        </SearchBar.Placeholder>
      </SearchBar>
    </Host>
  );
}
```

## API

```tsx
import { SearchBar } from '@expo/ui/jetpack-compose';
```
