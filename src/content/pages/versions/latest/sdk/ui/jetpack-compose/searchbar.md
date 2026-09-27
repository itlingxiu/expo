---
title: SearchBar 组件参考
description: 用于搜索输入的 Jetpack Compose SearchBar 组件。
---

# SearchBar 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 SearchBar 与官方 Jetpack Compose [Search](https://developer.android.com/develop/ui/compose/components/search-bar) API 保持一致，提供支持占位文本和展开为全屏搜索的搜索输入框。

![带占位文本的 Material 3 搜索栏](/static/images/expo-ui/searchbar/android-light.webp)

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

### 基本搜索栏

![没有占位文本的空圆角搜索框](/static/images/expo-ui/examples/searchbar-basic-android-light.webp)

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

### 带占位符的搜索栏

使用 `SearchBar.Placeholder` 子组件，在搜索框为空时显示提示文本。

![圆角搜索框，占位文本为 Search items](/static/images/expo-ui/examples/searchbar-placeholder-android-light.webp)

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
