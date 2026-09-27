---
title: DockedSearchBar 组件参考
description: 用于显示内联搜索输入框的 Jetpack Compose DockedSearchBar 组件。
---

# DockedSearchBar 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 DockedSearchBar 与官方 Jetpack Compose [SearchBar API](https://developer.android.com/develop/ui/compose/components/search-bar) 保持一致，显示的搜索输入框会固定在父布局中，而不会展开为全屏。

![带搜索图标和占位文本的 Material 3 停靠搜索栏](/static/images/expo-ui/dockedsearchbar/android-light.webp)

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

### 基本停靠搜索栏

![没有占位文本、也没有图标的空圆角搜索框](/static/images/expo-ui/examples/dockedsearchbar-basic-android-light.webp)

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

### 带占位符和前置图标

使用 `DockedSearchBar.Placeholder` 和 `DockedSearchBar.LeadingIcon` 插槽组件来自定义搜索栏外观。

![圆角搜索框带放大镜图标，占位文本为 Search items](/static/images/expo-ui/examples/dockedsearchbar-slots-android-light.webp)

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
