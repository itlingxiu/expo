---
title: NavigationBar 组件参考
description: 用于 Material 3 底部导航的 Jetpack Compose NavigationBar 组件。
---

# NavigationBar 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 NavigationBar 与官方 Jetpack Compose [`NavigationBar`](https://developer.android.com/develop/ui/compose/components/navigation-bar) API 保持一致。它显示一行目的地，用于在应用的顶层分区之间切换。

![带可选目的地的 Material 3 导航栏](/static/images/expo-ui/navigationbar/android-light.webp)

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

### 基本导航栏

在 React 状态中管理当前选中项，并把 `selected` 传给每个 `NavigationBarItem`。

![Material 3 导航栏，包含 Home、Search 和 Settings，Home 被选中](/static/images/expo-ui/examples/navigationbar-basic-android-light.webp)

```tsx BasicNavigationBar.tsx
import { useState } from 'react';
import {
  Host,
  Icon,
  NavigationBar,
  NavigationBarItem,
  Text,
} from '@expo/ui/jetpack-compose';

const HOME_ICON = require('./assets/home.xml');
const SEARCH_ICON = require('./assets/search.xml');
const SETTINGS_ICON = require('./assets/settings.xml');

export default function BasicNavigationBar() {
  const [selectedTab, setSelectedTab] = useState('home');

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <NavigationBar>
        <NavigationBarItem
          selected={selectedTab === 'home'}
          onClick={() => setSelectedTab('home')}>
          <NavigationBarItem.Icon>
            <Icon source={HOME_ICON} />
          </NavigationBarItem.Icon>
          <NavigationBarItem.Label>
            <Text>Home</Text>
          </NavigationBarItem.Label>
        </NavigationBarItem>

        <NavigationBarItem
          selected={selectedTab === 'search'}
          onClick={() => setSelectedTab('search')}>
          <NavigationBarItem.Icon>
            <Icon source={SEARCH_ICON} />
          </NavigationBarItem.Icon>
          <NavigationBarItem.Label>
            <Text>Search</Text>
          </NavigationBarItem.Label>
        </NavigationBarItem>

        <NavigationBarItem
          selected={selectedTab === 'settings'}
          onClick={() => setSelectedTab('settings')}>
          <NavigationBarItem.Icon>
            <Icon source={SETTINGS_ICON} />
          </NavigationBarItem.Icon>
          <NavigationBarItem.Label>
            <Text>Settings</Text>
          </NavigationBarItem.Label>
        </NavigationBarItem>
      </NavigationBar>
    </Host>
  );
}
```

## API

```tsx
import {
  NavigationBar,
  NavigationBarItem,
} from '@expo/ui/jetpack-compose';
```
